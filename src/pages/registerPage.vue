<template>
  <div class="fullscreen flex flex-center bg-grey-2">
    <q-card class="q-pa-md shadow-2 my_card" bordered>
      <q-card-section>
        <div class="relative-position">
          <q-btn
            to="/login"
            dense flat round
            icon="arrow_back"
            color="grey-8"
            style="position: absolute; top: -15px; left: -15px;"
          />
        </div>
        <div class="text-h5 text-weight-bold text-center q-mb-lg">Kayıt Ol</div>
        <q-form @submit.prevent="handleRegister">
          <q-input
            v-model="user.username"
            label="Ad Soyad"
            outlined class="q-mb-md"
            :rules="[val => !!val || 'Ad Soyad alanı boş bırakılamaz']"
            lazy-rules
          >
            <template v-slot:prepend><q-icon name="person" /></template>
          </q-input>
          <q-input
            v-model="user.email"
            type="email"
            label="Email Adresi"
            outlined class="q-mb-md"
            :rules="[val => !!val || 'Email alanı boş bırakılamaz']"
            lazy-rules
          >
            <template v-slot:prepend><q-icon name="email" /></template>
          </q-input>
          <q-input
            v-model="user.password"
            type="password"
            label="Şifre"
            outlined class="q-mb-md"
            :rules="[val => !!val || 'Şifre alanı boş bırakılamaz']"
            lazy-rules
          >
            <template v-slot:prepend><q-icon name="lock" /></template>
          </q-input>
          <q-input
            v-model="user.passwordConfirm"
            type="password"
            label="Şifre Tekrar"
            outlined class="q-mb-md"
            :rules="[
              val => !!val || 'Şifre tekrar alanı boş bırakılamaz',
              // DÜZELTİLDİ: Artık 'user.password' ile karşılaştırıyor
              val => val === user.password || 'Şifreler uyuşmuyor!'
            ]"
            lazy-rules
          >
            <template v-slot:prepend><q-icon name="lock" /></template>
          </q-input>
          <q-btn
            label="Hesap Oluştur"
            type="submit"
            color="primary"
            class="full-width q-mt-md"
            unelevated
          />
        </q-form>
      </q-card-section>
      <q-card-section class="text-center q-pt-none">
        <div class="text-grey-8">
          Zaten bir hesabın var mı?
          <q-btn to="/login" flat dense label="Giriş Yap" class="text-weight-bold" color="primary" />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from 'boot/firebase'

export default {
  name: 'RegisterPage',
  data() {
    return {
      // DÜZELTİLDİ: Objenin adı 'users' değil 'user' (tekil) olmalı
      // Bu, template'deki v-model="user.xxx" ile eşleşmelidir.
      user: {
        username: '',
        email: '',
        password: '',
        passwordConfirm: ''
      },
    }
  },
  methods: {
    async handleRegister() {
      // DÜZELTİLDİ: Olası 'this' bağlamı hatalarını önlemek için
      const self = this;

      if (self.user.password !== self.user.passwordConfirm) {
        self.$q.notify({
          color: 'negative',
          message: 'Şifreler birbiriyle uyuşmuyor!',
        })
        return
      }

      try {
        self.$q.loading.show({
          message: 'Hesap oluşturuluyor...'
        })

        // DÜZELTİLDİ: 'this.email' yerine 'self.user.email' kullanılmalı
        const userCredential = await createUserWithEmailAndPassword(auth, self.user.email, self.user.password)
        const userResult = userCredential.user;

        // DÜZELTİLDİ: 'this.fullName' ve 'this.email' yerine doğru objeden veri alınmalı
        await setDoc(doc(db, "users", userResult.uid), {
          fullName: self.user.username,
          email: self.user.email,
        });

        self.$q.loading.hide()
        
        self.$q.notify({
          color: 'positive',
          message: 'Hesap başarıyla oluşturuldu! Giriş sayfasına yönlendiriliyorsunuz.',
        })

        self.$router.push('/login')
      } catch (error) {
        self.$q.loading.hide();
        self.$q.notify({
          color: 'negative',
          message: 'Kayıt sırasında bir hata oluştu: ' + error.message
        })
      }
    },
  }
}
</script>

<style scoped>
.my_card {
  width: 400px;
  max-width: 90vw;
}
</style>