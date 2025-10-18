const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/homePage.vue'),name:'Home' },
      { path: '/about', component: () => import('src/pages/aboutPage.vue'),name:'About' },
      { path: '/profile', component: () => import('src/pages/profilePage.vue'),name:'Profil' },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/login',
    component: () => import('src/pages/loginPage.vue'),
    name: 'Login',
  },
    {
    path: '/register',
    component: () => import('src/pages/registerPage.vue'),
    name: 'Register',
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
