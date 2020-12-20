import Vue from 'vue'
import "@/plugins/firebase"
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import { sync } from 'vuex-router-sync'
sync(store, router);



import VueAxios from 'vue-axios'
Vue.use(VueAxios,axios)

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(MintUI)

// import { Comment} from'ant-design-vue';
// Vue.use(Comment)

import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor, /* { default global options } */)


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
