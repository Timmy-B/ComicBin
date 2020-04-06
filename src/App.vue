<template>
  <div>
    <template v-if="!$route.meta.allowAnonymous">
      <v-app id="inspire">
        <div class="app-container">
          <toolbar @toggleNavigationBar="drawer = !drawer" />
          <navigation :drawer.sync="drawer" />
          <v-content>
            <!-- <breadcrumbs /> -->
            <router-view />
            <!-- <page-footer /> -->
          </v-content>
        </div>
      </v-app>
    </template>
    <template v-else>
      <transition>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>
    </template>
  </div>
</template>

<script>
import {
    AUTH_CHECKCOOKIE
} from "./plugins/auth";
export default {
  name: "App",
  created() {
    this.$vuetify.theme.dark = true;
    this.$store.dispatch(AUTH_CHECKCOOKIE);
  },
    watch: {
    loginStatus() {
      if(this.loginStatus === 'loggedin'){
        this.$router.push({name: 'Home'})
      }else if(this.loginStatus === 'loggedout'){
        this.$router.push({name: 'Login'})
      }
    }

    },
      computed: {
      loginStatus() {
        return this.$store.state.auth.status;
      }
      },
  data() {
    return {
      drawer: false
    };
  },
  
};
</script>
},
}
</script>

<style>
html::-webkit-scrollbar {
  width: 0 !important;
}
html {
  overflow: -moz-scrollbars-none;
  -ms-overflow-style: none;
}
/* .app-container{
        display: flex;
        min-height: 100%;
} */
/* Put the following in its own sheet? */
.cellcontainer {
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  width: 100px;
  height: 200px;
  margin: 8px;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  align-content: center;
  align-items: center;
}
.thumb {
  position: relative;
  height: 75%;
  width: 100px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  position: relative;
}
.thumb img {
  max-height: 100%;
  overflow: hidden;
  width: 100%;
  box-shadow: 1px 1px 11px 0px #000;
  border-radius: 3px;
}

a {
  color: #444444;
  text-decoration: none;
  outline: none;
}
.label {
  position: relative;
  margin: 3px 0 0 0;
  font-family: "Arial";
  font-size: 0.6em;
  height: 25%;
  width: 100%;
  overflow: hidden;
  font-family: "Arial";
  color: #fff;
  text-align: center;
}
.imprintThumb {
  position: absolute;
  width: 36% !important;
  bottom: 0;
}

.infThumb {
  height: 100%;
  width: 120px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
}
.infThumb img {
  max-width: 100%;
  max-height: auto;
  vertical-align: middle;
  box-shadow: 1px 1px 11px 0px #000;
  border-radius: 5px;
}

.preview {
  display: flex;
  flex-direction: row;
  margin: 1em;
  align-items: center;
  justify-content: space-around;
}
.preview img {
  box-shadow: 1px 1px 11px 0px #000;
}
.summary {
  height: 10em;
  margin-left: 2em;
  margin-right: 2em;
}
.publisherTbn {
  height: 100px;
  margin-left: 1em;
}
.infcover {
  float: right;
  margin-right: 2em;
  height: 14em;
}
.infcover img {
  height: 12em;
}
.progBar {
  margin: 0;
  position: absolute !important;
  bottom: 4px;
  z-index: 14;
}

.fade-enter-active {
  transition: opacity 1.5s ease-in-out;
}

.fade-enter-to {
  opacity: 1;
}

.fade-enter {
  opacity: 0;
}
.loaded {
  z-index: 0;
}
/* stack background */
.thumbBkg {
  transform: rotate(7deg);
  background-color: white;
  position: absolute;
  left: 0%;
  z-index: -1;
}
.seriesCount {
  position: relative;
  bottom: 0px;
}
</style>
