import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Search from  '../views/Search.vue'
Vue.use(VueRouter)

// const routes = [
//   {
//     path: '/',
//     name: 'Home',
//     component: Home
//   },
//   // {
//   //   path: '/',
//   //   name: 'home',
//   //   component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue')
//   // }
//   {
//     path: '/search/:searchText',
//     name: 'search',
//     // route level code-splitting
//     // this generates a separate chunk (search.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     // component: () => import(/* webpackChunkName: "search" */ './views/Search.vue')
//     component: Search
//   }

// ]

// const router = new VueRouter({
//   routes
// })

// export default router

export default new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/search/:searchText',
      name: 'search',
      // route level code-splitting
      // this generates a separate chunk (search.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import(/* webpackChunkName: "search" */ './views/Search.vue')
      component: Search
    }
  ]
})
