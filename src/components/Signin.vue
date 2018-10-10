<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1>Sign In</h1>
      </v-flex>
      <v-flex xs12 sm6 offset-sm3 mt-3>
        <form v-bind:class="login" @submit.prevent="login">
          <v-layout column>
            <v-flex>
              <v-text-field
                name="username"
                label="Username"
                id="username"
                type="text"
                v-model="username"
                required></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                name="password"
                label="Password"
                id="password"
                type="password"
                v-model="password"
                required></v-text-field>
            </v-flex>
            <v-flex class="text-xs-center" mt-5>
              <v-btn type="submit" color="primary">Sign In</v-btn>
            </v-flex>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import {AUTH_LOGIN} from '../plugins/auth'
export default {
  name: 'Login',
  props: {
    msg: String
  },
  data() {    
    return {
    password: '',
    username: '',
    rememberMe: true
  }
  },
  methods:{
    login(){
     const { username, password, rememberMe } = this
      console.log( { username, password, rememberMe});
      this.$store.dispatch(AUTH_LOGIN, { username, password, rememberMe}).then(() => {
          this.$router.push('/')
        })
    }
  }
}
</script>