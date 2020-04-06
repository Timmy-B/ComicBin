import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { setupComponents } from './config/setup-components';
import VueApexCharts from 'vue-apexcharts'
import VueClazyLoad from 'vue-clazy-load';
import VueFuse from "vue-fuse";
import vuetify from './plugins/vuetify';
import fullscreen from 'vue-fullscreen'
Vue.use(VueFuse);
Vue.use(VueClazyLoad);
Vue.use(VueApexCharts);
Vue.use(fullscreen)
Vue.component('apexchart', VueApexCharts)
setupComponents(Vue);
Vue.use(VueAxios, axios);
Vue.config.productionTip = false

new Vue({
  template: '<App/>',

  // icons: {
  //   iconfont: 'mdi'
  // },
  store,

  vuetify,
  router,

  data: {
      themeColor: '#1D2939'},

  render: h => h(App)
}).$mount('#app')