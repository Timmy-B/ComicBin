import Vue from 'vue';
import Router from 'vue-router';

const routerOptions = [
  {
    path: '/',
    name: 'Home',
    meta: {
      breadcrumb: [
        { name: 'Home' }
      ]
    }
  },
  {
    path: '/publishers',
    name: 'Publishers',
    meta: {
      breadcrumb: [
        { name: 'Home', href: 'Home' },
        { name: 'Publishers' }
      ]
    }
  },
  {
    path: '/series',
    name: 'Series',
    meta: {
      breadcrumb: [
        { name: 'Home', href: 'Home' },
        { name: 'Series' }
      ]
    }
  },
  {
    path: '/items',
    name: 'Items',
    meta: {
      breadcrumb: [
        { name: 'Home', href: 'Home' },
        { name: 'Publishers', href: 'Publishers' },
        { name: 'Series', href: 'Series' },
        { name: 'Items' }
      ]
    }
  },
  {
    path: '/ageratings',
    name: 'AgeRatings',
    meta: {
      breadcrumb: [
        { name: 'Age Ratings' }
      ]
    }
  },
  {
    path: '/ageratingsseries',
    name: 'AgeRatingsSeries',
    meta: {
      breadcrumb: [
        { name: 'Age Ratings' },
        { name: 'Series' }
      ]
    }
  },
  {
    path: '/reader',
    name: 'Reader',
    meta: {
      breadcrumb: [
        { name: 'Reader' }
      ]
    }
  },
  {
    path: '/recent',
    name: 'Recent',
    meta: {
      breadcrumb: [
        { name: 'Home' },
        { name: 'Recently Added' }
      ]
    }
  },
  // {
  //   path: '/mailbox',
  //   name: 'Mailbox',
  //   meta: {
  //     breadcrumb: [
  //       { name: 'Home', href: 'Home' },
  //       { name: 'Mailbox' }
  //     ]
  //   }
  // },
  // {
  //   path: '/snackbar',
  //   name: 'Snackbar',
  //   meta: {
  //     breadcrumb: [
  //       { name: 'Home', href: 'Home' },
  //       { name: 'Snackbar' }
  //     ]
  //   }
  // },
  // {
  //   path: '/calendar',
  //   name: 'Calendar',
  //   meta: {
  //     breadcrumb: [
  //       { name: 'Home', href: 'Home' },
  //       { name: 'Calendar' }
  //     ]
  //   }
  // },
  // {
  //   path: '/social',
  //   name: 'Social',
  //   meta: {
  //     breadcrumb: [
  //       { name: 'Home', href: 'Home' },
  //       { name: 'Social' }
  //     ]
  //   }
  // },
  // {
  //   path: '/media',
  //   name: 'Media',
  //   meta: {
  //     breadcrumb: [
  //       { name: 'Home', href: 'Home' },
  //       { name: 'Media' }
  //     ]
  //   }
  // },
  // {
  //   path: '/chart',
  //   name: 'Chart',
  //   meta: {
  //     breadcrumb: [
  //       { name: 'Home', href: 'Home' },
  //       { name: 'Chart' }
  //     ]
  //   }
  // },
  {
    path: '/login',
    name: 'Login',
    meta: {
      allowAnonymous: true
    }
  },
  // {
  //   path: '/error',
  //   name: 'Error',
  //   meta: {
  //     allowAnonymous: true
  //   }
  // },
]

const routes = routerOptions.map(route => {
  return {
    ...route,
    component: () => import(`@/pages/${route.name}.vue`)
  }
})

Vue.use(Router)
export default new Router({
  routes
})
