import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
// import './plugins/vuecookie'
import App from './App.vue'
import store from './store'
import router from './router'

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
