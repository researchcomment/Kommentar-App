import Vue from 'vue'
import Vuex from 'vuex'
import account from './modules/account'
import worklist from './modules/worklist'
import commitwork from './modules/commitwork'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {


  },
  mutations: {
  },
  actions: {
  },
  modules: {
    account,
    worklist,
    commitwork
  }
})



