import Vue from 'vue'
import Vuex from 'vuex'
import VueCookie from 'vue-cookie'
import api from './plugins/api'
import auth from './plugins/auth'
Vue.use(Vuex)
Vue.use(VueCookie);

export default new Vuex.Store({
  modules: {
    api,
    auth
  }
})
