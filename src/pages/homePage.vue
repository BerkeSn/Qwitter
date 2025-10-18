<template>
  <q-page class="relative-position">
    <q-scroll-area
      style="height: 1000px; 
      max-width: 100%;"
      class="absolute full-width full-height"
    >
    <!-- Tweet Input -->
    <div class="q-py-lg q-px-lg row items-end q-gutter-md">
      <div class="col">
        <q-input 
          class="new-qweet"
          bottom-slots
          v-model="newQweetContent"
          placeholder="What's happening?"
          counter
          maxlength="280"
          :dense="dense"
          :outlined="outlined"
          autogrow
          >
          <template v-slot:before>
            <q-avatar size="xl">
              <img src="../assets/ahsoka.jpg">
            </q-avatar>
          </template>
        </q-input>
      </div>

      <div class="col col-shrink">
        <q-btn
          class="q-mb-lg"
          :disable="!newQweetContent"
          unelevated
          rounded
          color="primary"
          label="Qweet"
          no-caps
          @click="addNewQweet()"
        />
      </div>
    </div>
    <q-separator class="divider" size="0.4rem" color="grey-2"/>

    <!-- Tweets List -->
    
    <q-list separator>
      <transition-group 
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        >
        <q-item
        v-for="qweet in qweets" :key="qweet.id"
        class="q-py-md q-px-lg"
        clickable
        v-ripple
        >
        <q-item-section avatar top >
          <q-avatar>
            <img src="../assets/ahsoka.jpg">
          </q-avatar>
        </q-item-section>
        
        <q-item-section>
          <!-- Name -->
        <q-item-label class="text-subtitle1">
          <strong>{{ qweet.author ? qweet.author.fullName : 'Bilinmeyen Kullanıcı' }}</strong>
          <span class="q-px-sm text-grey-7">
            @{{ qweet.author ? qweet.author.email.split('@')[0] : '...' }}
            <br class="lt-md"> &bull; {{ relativeDate(qweet.createdAt) }}
          </span>
        </q-item-label>
          <!-- Content -->
          <q-item-label class="qweet_content text-subtitle1">
            {{ qweet.content }}
          </q-item-label>

          <!-- Actions -->
           <div class="qweet-icons row justify-between q-mt-sm q-px-xl">
            <q-btn flat round icon="chat_bubble_outline" size="sm" class="q-mr-md" />
            <q-btn flat round icon="repeat" size="sm" class="q-mr-md" />
            <q-btn flat round :icon="qweet.liked ? 'fas fa-heart': 'far fa-heart'" size="sm" class="q-mr-md" @click="likeQweet(qweet)" />
            <q-btn flat round icon="share" size="sm" class="q-mr-md" />
            <q-btn 
              v-if="auth.currentUser && qweet.authorId === auth.currentUser.uid"
              flat round 
              color="grey"
              icon="delete" 
              size="sm" 
              @click="deleteQweet(qweet)" 
              />
           </div>
        </q-item-section>
        </q-item>
      </transition-group>
    </q-list>
    </q-scroll-area>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import {formatDistance} from 'date-fns'
import { db } from "src/boot/firebase";
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc, query, orderBy, getDoc, serverTimestamp } from "firebase/firestore";
import {auth} from "src/boot/firebase";

export default defineComponent({
  name: 'PageHome',
  data() {
    return {
      newQweetContent: '',
      qweets: [],
      isSubmitting: false,
      auth: auth
    }
  },
  methods: {
    relativeDate(value) {
      if (!value) return '';
      // Firebase Timestamp objesini JavaScript Date objesine çevir
      const date = value.toDate();
      return formatDistance(date, new Date(), { addSuffix: true });
    },
    async addNewQweet(){// DÜZELTME:
        const self = this;
        const currentUser = auth.currentUser;
        if (!currentUser) {
          self.$q.notify({ color: 'negative', message: 'Tweet atmak için giriş yapmalısınız.' });
          return;
        }

        self.isSubmitting = true;

        try {
          const newQweet = {
            content: self.newQweetContent,
            createdAt: serverTimestamp(), // Doğru ve güvenilir tarih yöntemi
            authorId: currentUser.uid // Tweet'i kullanıcıya bağlayan kimlik
          };

          await addDoc(collection(db, "qweets"), newQweet);
          
          self.newQweetContent = '';
          self.$q.notify({ color: 'positive', message: 'Tweet başarıyla gönderildi!' });

        } catch (error) {
          console.error("Tweet gönderirken hata oluştu: ", error);
          self.$q.notify({ color: 'negative', message: 'Tweet gönderilirken bir hata oluştu.' });
        } finally {
          self.isSubmitting = false; // İşlem bitince butonu tekrar aktif et
        }
    },
    async deleteQweet(qweet) {
        try {
          await deleteDoc(doc(db, "qweets", qweet.id));
          this.$q.notify({ color: 'positive', message: 'Tweet silindi.' });
        } catch (error) {
          console.error("Hata - Qweet silinemedi:", error);
          this.$q.notify({ color: 'negative', message: 'Tweet silinirken bir hata oluştu.' });
        }
    },
    async likeQweet(qweet) {
        try {
          const docRef = doc(db, 'qweets', qweet.id);
          await updateDoc(docRef, {
            liked: !qweet.liked 
          });
        } catch (error) {
          console.error("Beğeni durumu güncellenirken hata oluştu: ", error);
        }
    }
  },
  
mounted() {
  const qweetsQuery = query(collection(db, "qweets"), orderBy("createdAt", "desc"));

  onSnapshot(qweetsQuery, async (snapshot) => {
    let fetchedQweets = [];
    for (const qweetDoc of snapshot.docs) {
      let qweetData = { id: qweetDoc.id, ...qweetDoc.data() };

      // Tweet'in yazarının bilgilerini 'users' koleksiyonundan çekiyoruz
      if (qweetData.authorId) {
        const userDocRef = doc(db, "users", qweetData.authorId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          // Yazar bilgisini de tweet objesine ekliyoruz
          qweetData.author = userDoc.data();
        }
      }
      fetchedQweets.push(qweetData);
    }
    this.qweets = fetchedQweets;
    });
  }
})
</script>

<style>
  .new-qweet 
    textarea {
    font-size: 1.1rem;
    line-height: 1.4 !important;
    }
  .divider {
    border-top: 1px solid;
    border-bottom: 1px solid;
    border-color: #e0e0e0;
  }
  .qweet_content {
    white-space: pre-line;
  }
  .qweet-icons{
    margin-left: -0.3rem;
  }
</style>