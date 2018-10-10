import Vue from 'vue'
import Router from 'vue-router'

const routerOptions = [
  {
    path: '/',
    component: 'Landing'
  },
  {
    path: '/signin',
    component: 'Signin'
  },
  {
    path: '/publishers',
    component: 'Publishers'
  },
  {
    path: '/publisherseries',
    component: 'PublisherSeries'
  },
  {
    path: '/series',
    component: 'Series'
  },
  {
    path: '/seriesissues',
    component: 'Seriesissues'
  },
  {
    path: '/reader',
    component: 'Reader'
  },
]

const routes = routerOptions.map(route => {
  return {
    ...route,
    component: () => import(`@/components/${route.component}.vue`)
  }
})

Vue.use(Router)
export default new Router({
  routes
})