<template>
  <v-app dark>
    <v-navigation-drawer clipped v-model="drawer" app>
      <v-list>
        <v-list-tile value="true" v-for="(item, i) in menuItems" :key="i" :to="item.path">
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar v-model="mainToolbar" app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-btn class="back-btn hidden" v-on:click="back">
        <v-icon class="mx-3">reply</v-icon>Back</v-btn>
      <v-toolbar-title v-text="this.title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-layout row align-center style="max-width: 650px">
        <v-text-field class="searchBar" placeholder="Search..." single-line append-icon="search" color="white" hide-details v-model="search"></v-text-field>
      </v-layout>
    </v-toolbar>
    <v-content class="test">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
  import fullscreen from 'vue-fullscreen';
  import JQuery from "jquery";
  import Vue from 'vue'
  let $ = JQuery;
  import {
    AUTH_CHECKCOOKIE
  } from './plugins/auth'
  import {
    ADJUST_GRID_SIZE
  } from './plugins/api'
  import {
    GRAB_LISTS
  } from './plugins/api'
  import {
    SEARCH
  } from './plugins/api'
  import {
    CHANGE_TITLE
  } from './plugins/api'
  import Landing from './components/Landing'
  Vue.use(fullscreen)
  export default {
    name: 'App',
    components: {
      CurrentPage: Landing
    },
    created: function() {
      if (!this.$store.getters.isAuthenticated) {
        this.$store.dispatch(AUTH_CHECKCOOKIE)
        this.$store.dispatch(GRAB_LISTS)
      } else {
        this.$router.push('/signin')
      }
    },
    methods: {
      back: function() {
        this.$router.go(-1)
      },
      getGridListSize: function() {
        const height = $(".test").offsetHeight;
        const width = $(".test").offsetWidth;
        console.log(height, width)
        const itemQty = (height / 290) * (width / 180);
        this.$store.dispatch(ADJUST_GRID_SIZE, itemQty)
      },
      toggleFullscreen() {
        this.$refs['fullscreen'].toggle()
      },
      fullscreenChange(fullscreen) {
        this.fullscreen = fullscreen
      }
    },
    mounted() {
  
    },
    data() {
      return {
        menuItems: [{
            title: 'Home',
            path: '/',
            icon: 'home'
          },
          {
            title: 'Sign In',
            path: '/signin',
            icon: 'lock_open'
          },
          {
            title: 'Library',
            path: '/series',
            icon: 'library_books'
          },
          {
            title: 'Publishers',
            path: '/publishers',
            icon: 'library_books'
          },
        ],
        clipped: true,
        drawer: false,
        fixed: false,
        miniVariant: false,
        title: 'Test Title',
        mainToolbar: false,
        mainFooter: false,
        search: '',
  
      }
    },
    computed: {
      appTitle() {
        return this.$store.state.api.appTitle
      },
      Lists() {
        return this.$store.state.api.Lists
      },
      authed() {
        return this.$store.getters.isAuthenticated
      }
    },
    watch: {
      appTitle() {
        this.title = this.appTitle
      },
      search() {
        this.$store.dispatch(SEARCH, this.search)
      },
      authed() {
        this.$nextTick(() => {
          if (!this.authed) {
            this.$store.dispatch(GRAB_LISTS)
          }
        })
      }
    },
  }
</script>

<style>
  html {
    overflow: scroll;
    overflow-x: hidden;
  }
  
  ::-webkit-scrollbar {
    width: 0px;
    /* remove scrollbar space */
    background: transparent;
  }
  
  .hidden {
    display: none;
  }
</style>