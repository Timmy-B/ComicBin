<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1>Welcome to Awesome App</h1>
      </v-flex>
      <v-flex xs12 sm6 offset-sm3 mt-3>
        <blockquote class="blockquote text-xs-center">
          It's a basic Single Page application <br>
          with Google Firebase authentication
        </blockquote>
      </v-flex>
      <v-flex xs12 sm6 offset-sm3 class="text-xs-center" mt-5>
        <h1>Recently Added</h1>
      </v-flex>
      <v-flex xs12 sm6 offset-sm3 mt-3>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import JQuery from "jquery";
let $ = JQuery;
export default {

    mounted: function() {
    $(".back-btn").addClass("hidden");
    },
}
</script>