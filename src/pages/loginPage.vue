<template>
  <div class="fullscreen flex flex-center bg-grey-2">

    <q-card class="q-pa-md shadow-2 my_card" bordered>
      <q-card-section>
        
        <div class="relative-position">
          <q-btn
            to="/"
            dense
            flat
            round
            icon="arrow_back"
            color="grey-8"
            style="position: absolute; top: -15px; left: -15px;"
          />
        </div>

        <div class="text-h5 text-weight-bold text-center q-mb-lg">
          Login
        </div>

        <q-form @submit.prevent="handleLogin">
          
          <q-input
            v-model="email"
            label="Email Adresi"
            outlined
            class="q-mb-md"
            :rules="[val => !!val || 'Email alanı boş bırakılamaz']"
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>

          <q-input
            v-model="password"
            type="password"
            label="Şifre"
            outlined
            class="q-mb-md"
            :rules="[val => !!val || 'Şifre alanı boş bırakılamaz']"
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
          </q-input>

          <q-btn 
            label="Giriş Yap" 
            type="submit" 
            color="primary" 
            class="full-width q-mt-md" 
            unelevated
          />
        
        </q-form>

      </q-card-section>

      <q-card-section class="text-center q-pt-none">
        <div class="text-grey-8">
          Hesabın yok mu?
          <q-btn 
            to="/register" 
            flat 
            dense
            label="Kayıt Ol"
            class="text-weight-bold"
            color="primary" 
          />
        </div>
      </q-card-section>

    </q-card>
  </div>
</template>

<script>
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "boot/firebase";

export default {
  // Bileşene bir isim vermek iyi bir pratiktir
  name: 'LoginPage',

  // Bileşenin reaktif verileri burada tutulur
  data() {
    return {
      email: '',
      password: '',
      isSubmitting: false
    }
  },
  
  methods: {
    async handleLogin() {
      const self = this;
      self.isSubmitting = true; // Butonu kilitlemek için (isteğe bağlı)

      try {
        // Firebase'in giriş yapma fonksiyonunu çağır
        await signInWithEmailAndPassword(auth, self.email, self.password);
        
        // Bildirim gösterme
        self.$q.notify({ color: 'positive', message: 'Giriş başarılı!' });
        
        // Ana sayfaya yönlendir
        self.$router.push('/');

      } catch (error) {
        console.error("Giriş hatası:", error);
        // Firebase'den gelen hata koduna göre kullanıcıya özel mesajlar gösterebiliriz
        let message = 'Giriş sırasında bir hata oluştu.';
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          message = 'E-posta veya şifre hatalı.';
        }
        self.$q.notify({ color: 'negative', message: message });
      } finally {
        self.isSubmitting = false; // Butonu tekrar aç
      }
    }
  }
}
</script>

<style scoped>
.my_card {
  width: 400px;
  max-width: 90vw;
}
</style>