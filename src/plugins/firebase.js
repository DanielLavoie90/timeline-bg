import Vue from 'vue'
import fb from '../firebaseConfig'

const Firebase = {
  install(Vue) {
    Vue.prototype.$fb = fb
  }
}

export default Firebase;