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
export default {
  // Bileşene bir isim vermek iyi bir pratiktir
  name: 'LoginPage',

  // Bileşenin reaktif verileri burada tutulur
  data() {
    return {
      email: '',
      password: ''
    }
  },

  
  methods: {
    handleLogin() {
      
      if (this.email && this.password) {
        console.log('Email:', this.email)
        console.log('Password:', this.password)


        this.$q.notify({
          color: 'positive',
          icon: 'check_circle',
          message: 'Başarıyla giriş yapıldı!',
        })

        this.$router.push('/')
      } else {
        this.$q.notify({
          color: 'negative',
          icon: 'warning',
          message: 'Lütfen tüm alanları doldur',
        })
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