import Vue from 'vue'
import Vuex from 'vuex'
import VueCookie from 'vue-cookie'
import auth from './plugins/auth'
import api from './plugins/api'
var baseURL = "http://192.168.10.208:8080/tablet";
Vue.use(Vuex)
Vue.use(VueCookie);
export default new Vuex.Store({
  modules: {
    auth,
    api,
  }
})
