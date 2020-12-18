import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import Search from  '../views/Search.vue'
import Detail from  '../views/Detail.vue'
import Admin from  '../views/Admin.vue'
import Reviewer from  '../views/Reviewer.vue'
import store from '@/store'
import firebase from "firebase/app";
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
      path: '/Review',
      name: 'reviewer',
      component: Reviewer
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
  (to, from, next)=> {
 
  console.log( firebase.auth().currentUser);
  firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			store.dispatch('account/relogin',{}).then(
      ()=>{next();}
      ).catch(err => {
        console.log(err);
      })
		} else{
			next()
		}
  	});

  // update the login status for new Router
  

})

export default router
