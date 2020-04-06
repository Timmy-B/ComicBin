<template>
  <v-navigation-drawer v-model="drawerState" fixed app>
    <v-toolbar flat :color="$root.themeColor" class="toolbar">
      <router-link :to="{ name: 'Home' }">
        <img src="logo.png" width="36px">
      </router-link>
      <router-link :to="{ name: 'Home' }" class="text">ComicBin</router-link>
    </v-toolbar>
    <v-list v-if="this.loginStatus === 'loggedin'">
      <v-list-item @click="changeRoute('Home', 1)">
        <v-list-item-action>
          <v-icon>home</v-icon>
        </v-list-item-action>
        <v-list-item-title :class="[{'active': selectedIndex === 1}, 'item-title' ]">Home</v-list-item-title>
      </v-list-item>
      <v-list-item @click="changeRoute('Publishers', 2)">
        <v-list-item-action>
          <v-icon>print</v-icon>
        </v-list-item-action>
        <v-list-item-title :class="[{'active': selectedIndex === 2}, 'item-title' ]">Publishers</v-list-item-title>
      </v-list-item>
      <v-list-item @click="changeRoute('Series', 3)">
        <v-list-item-action>
          <v-icon>library_books</v-icon>
        </v-list-item-action>
        <v-list-item-title :class="[{'active': selectedIndex === 3}, 'item-title' ]">Series</v-list-item-title>
      </v-list-item>
      <v-list-item @click="changeRoute('AgeRatings', 4)">
        <v-list-item-action>
          <v-icon>people</v-icon>
        </v-list-item-action>
        <v-list-item-title :class="[{'active': selectedIndex === 4}, 'item-title' ]">Age Ratings</v-list-item-title>
      </v-list-item>
      <v-list-item @click="changeRoute('Recent', 5)">
        <v-list-item-action>
          <v-icon>access_time</v-icon>
        </v-list-item-action>
        <v-list-item-title :class="[{'active': selectedIndex === 5}, 'item-title' ]">Recently Added</v-list-item-title>
      </v-list-item>
          <v-list>
        <v-list-item @click="logout">
          <v-list-item-action>
            <v-icon>cancel</v-icon>
          </v-list-item-action>
          <v-list-item-title class="item-title">Logout</v-list-item-title>
        </v-list-item>

    </v-list>
    </v-list>

        <!-- <v-list-item @click="$router.push({ name: 'Login' })">
          <v-list-item-action>
            <v-icon>cancel</v-icon>
          </v-list-item-action>
          <v-list-item-title class="item-title">Login</v-list-item-title>
        </v-list-item> -->



  </v-navigation-drawer>
</template>

<script>
import {
    AUTH_LOGIN,
    AUTH_LOGOUT
} from "../../plugins/auth";
export default {
  props: ['drawer'],
  data() {
    return {
      selectedIndex: 1,
      drawerState: this.drawer,
      loggedin: false
    };
  },
watch: {
      drawer (value) {
          this.drawerState = value;
      },
      drawerState(value){
        this.$emit('update:drawer', value)
      },
    },
    computed:{
      loginStatus() {
        return this.$store.state.auth.status;
      }
    },
  methods: {
    logout(){
      console.log("logout")
      this.$store.dispatch(AUTH_LOGOUT)
    },
    changeRoute(routeName, selectedIndex) {
      const vm = this;

      vm.selectedIndex = selectedIndex;

      return vm.$router.push({ name: routeName });
    }
  }
};
</script>

<style>
.toolbar {
  font-weight: bold;
  font-size: 18px;
}

.toolbar .text {
  padding-left: 15px;
  color: white;
  text-decoration: none;
}

.item-title {
  font-size: 17px;
  font-weight: 500;
}
.item-sub-title {
  font-size: 15px;
  font-weight: 500;
}

.active {
  font-weight: bold;
}
</style>
