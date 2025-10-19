<template>
  <q-page class="bg-grey-2">
    <q-scroll-area class="absolute full-width full-height">

      <q-card 
        v-if="userProfile"
        class="q-ma-md relative-position">
        
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
              @click="settings()"
            />
            <q-btn
              label="Çıkış Yap"
              color="negative"
              rounded
              outline
              no-caps
              @click="signout()"
            />
          </div>

          <div class="q-mt-md">
            <div class="text-h6 text-weight-bold">{{ userProfile.fullName }}</div>
            <div class="text-subtitle2 text-grey-8">@{{ userProfile.email.split('@')[0] }}</div>
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
            <strong>{{ userProfile.fullName }}</strong>
            <span class="q-px-sm text-grey-7">
              @{{ userProfile.email.split('@')[0] }}
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

<script>
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { auth, db } from "boot/firebase";
import { formatDistance } from 'date-fns'

export default {
  name: 'ProfilePage',
  data() {
    return {
      userProfile: null,
      loading: true,
      qweets: []
    }
  },

  methods:{
    async signout () {
        try {
            await signOut(auth)
            this.$router.push('/')

            this.$q.notify({
                color: 'positive',
                icon: 'check_circle',
                message: 'Başarıyla çıkış yapıldı!',
            })

        } catch (error) {
            console.error('Çıkış yaparken hata:', error)
            this.$q.notify({
                color: 'negative',
                icon: 'check_circle',
                message: 'Başarıyla çıkış yapıldı!',
            })
        }
    },
    relativeDate(value) {
      if (!value) return '';
      const date = value.toDate();
      return formatDistance(date, new Date(), { addSuffix: true });
    }
  },

  mounted() {
    onAuthStateChanged(auth, async (user) => {
    if (user) { // Evet, var. Kimlik kartı (UID) elimizde: user.uid

      // 1. ADIM: Veritabanında doğru dosyayı hedef alıyoruz.
      // "users" koleksiyonuna git ve kimlik kartı 'user.uid' olan belgeye bir referans oluştur.
      const userDocRef = doc(db, "users", user.uid);
      
      // 2. ADIM: Hedefteki dosyayı getirmesini istiyoruz.
      // Bu referansı kullanarak veritabanından o belgeyi getirmesini söylüyoruz ('await' ile bekliyoruz).
      const docSnap = await getDoc(userDocRef);

      // 3. ADIM: Gelen veriyi işliyoruz.
      // Eğer belge bulunduysa...
      if (docSnap.exists()) {
        // ...içindeki verileri ('fullName', 'email' vb.) alıp 'userProfile' değişkenine atıyoruz.
        this.userProfile = docSnap.data();
      }else{
        this.$router.push('/login');
        return
      }

      const qweetsQuery = query(
          collection(db, "qweets"), 
          where("authorId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
      
        onSnapshot(qweetsQuery, (snapshot) => {
          this.qweets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        });
        this.loading = false;

    } else {
      // Giriş yapan yoksa, login'e yönlendir.
      this.loading = false;
      this.$router.push('/login');
    }
  });
  }
}
</script>