import Vue from 'vue'
import Vuex from 'vuex'
import account from './modules/account'
import worklist from './modules/worklist'
import commitwork from './modules/commitwork'
import askFromUser from './modules/askFromUser'
import adminAktion from './modules/adminAktion'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {


  },
  mutations: {
  },
  getters:{
  },
  actions: {
  },
  modules: {
    account,
    worklist,
    commitwork,
    askFromUser,
    adminAktion,
  }
})



