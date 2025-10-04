<template>
  <q-page class="relative-position">
    <q-scroll-area
      style="height: 1000px; 
      max-width: 100%;"
      class="absolute-full"
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
        v-for="qweet in qweets" :key="qweet.date"
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
            <q-btn flat round icon="favorite_border" size="sm" class="q-mr-md" />
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

export default defineComponent({
  name: 'PageHome',
  data() {
    return {
      newQweetContent: '',
      qweets: [
      ],
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
        this.qweets.unshift({
          content: this.newQweetContent,
          date: new Date().toISOString(),
        });
        this.newQweetContent = '';
      }
    },
    deleteQweet(qweet) {
      let dateToDelete = qweet.date;
      let index = this.qweets.findIndex(qweet => qweet.date === dateToDelete);
      this.qweets.splice(index, 1);
    }
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