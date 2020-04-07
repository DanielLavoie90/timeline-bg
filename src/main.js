import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Firebase from './plugins/firebase'
import './css/index.scss'

Vue.use(Firebase)
Vue.config.productionTip = false

const app = new Vue({
  el: '#app',
  router,
  render: h => h(App)
})