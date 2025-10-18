<template>
  <q-layout view="lhr lpR lFr">

    <q-header bordered class="bg-white text-black">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="text-weight-bold">
          <span class="gt-sm">{{ $route.name }}</span>

          <q-icon 
          class = "header-icon q-pa-md lt-md"
          name="fa-solid fa-crow"
          size = "sm"
          color="primary"
          />

        </q-toolbar-title>

      </q-toolbar>
    </q-header>
      <!-- Left drawer-->
    <q-drawer 
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      bordered
      heigth="100%"
      width="283"
      class= "column"
      
    >
    <!-- Left Drawer -->
       <q-icon 
        class = "q-pa-md"
        name="fa-solid fa-crow"
        size = "lg"
        color="primary"
       />
       
        <!-- Home Item -->
        <q-item 
          clickable 
          v-ripple
          exact
          to="/"
        >
          <q-item-section avatar>
            <q-icon  name="home" size="md"/>
          </q-item-section>

          <q-item-section class="text-h6 text-weight-bold">Home</q-item-section>
        </q-item>

        <!-- About Item -->
        <q-item 
          clickable 
          v-ripple
          exact
          to="/about"
        >
          <q-item-section avatar>
            <q-icon  name="info" size="md"/>
          </q-item-section>

          <q-item-section class="text-h6 text-weight-bold">About</q-item-section>
        </q-item>

        <!-- Profile -->
        <q-item 
          clickable 
          v-ripple
          exact
          to="/profile"
        >
          <q-item-section avatar>
            <q-icon  name="account_circle" size="md"/>
          </q-item-section>

          <q-item-section class="text-h6 text-weight-bold">Profile</q-item-section>
        </q-item>

        <!-- Login / Sign Up Item -->
        <q-item 
            clickable 
            v-ripple
            exact
            style="margin-top: auto; margin-bottom: 1rem;"
            to="/login"
          >
            <q-item-section avatar>
              <q-icon  name="login" size="md"/>
            </q-item-section>
            <q-item-section class="text-h6 text-weight-bold">Login / Sign Up</q-item-section>
        </q-item>
       
    </q-drawer>

    <!-- Right drawer-->
    <q-drawer
      show-if-above
      v-model="rightDrawerOpen"
      side="right"
      bordered
      width="500"
      >
      <!-- Right drawe -->
      <q-input
        class="q-ma-md"
        outlined
        rounded
        placeholder="Search Qwitter"
        dense
        clearable
        >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>

      <q-list 
        separator 
        padding
        
        >
        <q-item class="q-pa-md">
          <q-item-section>
            <q-item-label overline class="text-grey">Education</q-item-label>
            <q-item-label class="text-weight-bold">Something amazing happened!</q-item-label>
            <q-item-label caption>Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>5 min ago</q-item-label>
          </q-item-section>
        </q-item>
        
        <q-item class="q-pa-md">
          <q-item-section>
            <q-item-label overline class="text-grey">Education</q-item-label>
            <q-item-label class="text-weight-bold">Something amazing happened!</q-item-label>
            <q-item-label caption>Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>5 min ago</q-item-label>
          </q-item-section>
        </q-item>
        
        <q-item class="q-pa-md">
          <q-item-section>
            <q-item-label overline class="text-grey">Education</q-item-label>
            <q-item-label class="text-weight-bold">Something amazing happened!</q-item-label>
            <q-item-label caption>Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>5 min ago</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const leftDrawerOpen = ref(false)
    const rightDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },

      rightDrawerOpen,
      toggleRightDrawer () {
        rightDrawerOpen.value = !rightDrawerOpen.value
      }
    }
  }
}
</script>

<style>
  .header-icon {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
</style>