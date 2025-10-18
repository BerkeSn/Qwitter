<template>
  <q-page class="bg-grey-2">
    <q-scroll-area class="absolute full-width full-height">

      <q-card class="q-ma-md relative-position">
        
        <q-img
          src="https://picsum.photos/1000/300"
          style="height: 200px;"
        >
          <div class="absolute-bottom bg-transparent"></div>
        </q-img>

        <q-avatar
          size="100px"
          class="absolute"
          style="top: 150px; left: 25px; border: 4px solid white;"
        >
          <img src="https://cdn.quasar.dev/img/avatar.png">
        </q-avatar>

        <q-card-section>
          <div class="row q-pt-sm">
            <q-space />

            <q-btn
              label="Profili Düzenle"
              color="primary"
              rounded
              outline
              no-caps
            />
          </div>

          <div class="q-mt-md">
            <div class="text-h6 text-weight-bold">Berke SN</div>
            <div class="text-subtitle2 text-grey-8">@berke_sn</div>
            <div class="q-pt-sm">
              Bu bir kullanıcı açıklamasıdır. Quasar ve Vue.js ile harika şeyler yapıyorum. #Vue #Quasar
            </div>
          </div>

        </q-card-section>
      </q-card>

      <q-separator class="q-mx-md" />

      <div class="q-pa-md text-h6">

<q-list separator>
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
    </q-list>

      </div>
      </q-scroll-area>
  </q-page>
</template>

// ProfilePage.vue

<script>
// Gerekli Firebase fonksiyonlarını import ediyoruz
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "boot/firebase";

export default {
  name: 'ProfilePage',
  data() {
    return {
      userProfile: null,
      loading: true
    }
  },

  mounted() {
    onAuthStateChanged(auth, (user) => {
      
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        
        getDoc(userDocRef).then(docSnap => {
          
          if (docSnap.exists()) {
            
            this.userProfile = docSnap.data();
            console.log("Kullanıcı verisi:", this.userProfile);
          } else {
            console.log("Kullanıcı için veritabanında bir belge bulunamadı!");
          }
        }).catch(error => {
          console.error("Veri çekerken hata:", error);
        }).finally(() => {
          
          this.loading = false;
        });
        
      } else {
        
        console.log("Giriş yapmış kullanıcı yok.");
        this.loading = false;
        this.$router.push('/login');
      }
    });
  }
}
</script>