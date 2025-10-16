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
            <strong>Ahsoka Tano</strong>
            <span class="q-px-sm text-grey-7">
              @skyguy
              <br class="lt-md"> &bull; {{ relativeDate(qweet.date) }}
            </span>
          </q-item-label>
          <!-- Content -->
          <q-item-label class="qweet_content text-subtitle1">
            {{ qweet.content }}
          </q-item-label>

          <!-- Actions -->
           <div class="qweet-icons row justify-between q-mt-sm">
            <q-btn flat round icon="chat_bubble_outline" size="sm" class="q-mr-md" />
            <q-btn flat round icon="repeat" size="sm" class="q-mr-md" />
            <q-btn flat round :icon="qweet.liked ? 'fas fa-heart': 'far fa-heart'" size="sm" class="q-mr-md" @click="likeQweet(qweet)" />
            <q-btn flat round icon="share" size="sm" class="q-mr-md" />
            <q-btn flat round icon="delete" size="sm" class="q-mr-md" @click="deleteQweet(qweet)" />
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
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc  } from "firebase/firestore";

export default defineComponent({
  name: 'PageHome',
  data() {
    return {
      newQweetContent: '',
      qweets: [],
    }
  },
  methods: {
    relativeDate(value) {
      // 1) yoksa hemen döndür
      if (value === null || value === undefined || value === '') return ''

      // 2) normalize et ve Date üret
      let date
      try {
        if (value instanceof Date) {
          date = value
        } else if (typeof value === 'number') {
          // 10 hane => saniye, 13 hane => ms
          const s = value.toString().length
          date = (s === 10) ? new Date(value * 1000) : new Date(value)
        } else if (typeof value === 'string') {
          const s = value.trim()
          if (/^\d+$/.test(s)) {
            // sadece rakamlardan oluşuyorsa
            date = (s.length === 10) ? new Date(parseInt(s, 10) * 1000) : new Date(parseInt(s, 10))
          } else {
            // "2025-10-04 14:32:00" formu için T kullan (Safari uyumluluğu için)
            const normalized = (s.includes(' ') && !s.includes('T')) ? s.replace(' ', 'T') : s
            date = new Date(normalized)
          }
        } else {
          // bilinmeyen tip
          return ''
        }
      } catch (err) {
        console.warn('relativeDate parse error', err, value)
        return ''
      }

      // 3) geçerli tarih mi kontrol et
      if (!date || isNaN(date.getTime())) {
        console.warn('Invalid date in relativeDate():', value)
        return ''
      }

      // 4) formatla ve döndür
      return formatDistance(date, new Date(), { addSuffix: true })
    },
    addNewQweet(){
      if(this.newQweetContent !== ''){
        let newQweet = {
          content: this.newQweetContent,
          date: new Date().toISOString(),
          liked: false
        }; 
        // this.qweets.unshift(newQweet);
        try {
          // 1. Önce koleksiyona bir referans oluşturulur
          const qweetsCollectionRef = collection(db, "qweets");
          
          // 2. addDoc fonksiyonu ile döküman eklenir
          const docRef = addDoc(qweetsCollectionRef, newQweet);
          
          console.log("Döküman şu ID ile yazıldı: ", docRef);
        } catch (error) {
          console.error("Döküman eklenirken hata oluştu: ", error);
        }
        this.newQweetContent = '';
      } 
    },
    deleteQweet(qweet) {
      // db.collection("qweets").doc(qweet.id).delete().then(() => {
      //     console.log("Document successfully deleted!");
      // }).catch((error) => {
      //     console.error("Error removing document: ", error);
      // });
      try {
        deleteDoc(doc(db, "qweets", qweet.id));
        console.log("Qweet başarıyla silindi:", qweet.id);
        
      } catch (error) {
        console.error("Hata - Qweet silinemedi:", error);
      }
    },
    likeQweet(qweet) {
      try {
        const docRef = doc(db, 'qweets', qweet.id);

        updateDoc(docRef, {
          liked: !qweet.liked 
        });
        console.log("Beğeni durumu güncellendi:", qweet);
      } catch (error) {
        console.error("Beğeni durumu güncellenirken hata oluştu: ", error);
      }
      // qweet.liked = !qweet.liked 
    }
  },
  mounted() {
    const qweetsCollection = collection(db, "qweets");

     onSnapshot(qweetsCollection, (snapshot) => {
       snapshot.docChanges().forEach((change) => {
          let qweetChange = change.doc.data();
          qweetChange.id = change.doc.id;
         if (change.type === "added") {
           this.qweets.unshift({
             id: change.doc.id,
             ...change.doc.data()
           });
         }else if (change.type === "removed") {
            let index = this.qweets.findIndex(qweet => qweet.id === qweetChange.id);
            this.qweets.splice(index, 1);
         }else if (change.type === "modified") {
            let index = this.qweets.findIndex(qweet => qweet.id === qweetChange.id);
            this.qweets[index] = qweetChange;
         }
       });
     });
  },
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