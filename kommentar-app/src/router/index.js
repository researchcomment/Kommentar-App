import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import Search from  '../views/Search.vue'
import Detail from  '../views/Detail.vue'
import Admin from  '../views/Admin.vue'
import store from '@/store'
Vue.use(Router)



const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/search',
      name: 'search',
      // route level code-splitting
      // this generates a separate chunk (search.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import(/* webpackChunkName: "search" */ './views/Search.vue')
      component: Search
    },
    {
      path: '/Detail',
      name: 'detail',
      component: Detail
    },
    {
      path: '/Admin',
      name: 'admin',
      component: Admin
    },
    {
      path: '*',
      name: 'other',
      // route level code-splitting
      // this generates a separate chunk (search.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import(/* webpackChunkName: "search" */ './views/Search.vue')
      redirect: '/' 
    }
    
  ]
})

router.beforeEach(
  async function (to, from, next) {
  const username = window.localStorage.getItem('username');
  // update the login status for new Router
  store.dispatch('account/relogin',{username}).then(
    (result)=>{return result}
  ).catch(err => {
      console.log(err);
  }) 
  next();

})

export default router
