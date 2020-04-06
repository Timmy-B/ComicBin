<template>
  <v-container fluid justify-center>
    <v-layout justify-center column>
      <v-toolbar class="mb-1">
        <v-text-field
          v-model="search"
          clearable
          flat
          solo-inverted
          hide-details
          prepend-inner-icon="search"
          label="Search"
        ></v-text-field>
      </v-toolbar>
      <v-layout align-center justify-center row fill-height>
        <v-pagination @next="top()" v-model="page" :length.sync="pages"></v-pagination>
      </v-layout>
      <v-container fluid grid-list-md justify-center>
        <v-data-iterator
          :items="this.results"
          :itemsPerPage.sync="itemsPerPage"
          :page.sync="page"
          :footer-props="{ itemsPerPageOptions }"
          :loading="this.loading"
          hide-default-footer
          class="pages"
          ref="list"
        >
          <template v-slot:default="props">
            <v-layout row wrap>
              <div class="cellcontainer" v-for="item in props.items" :key="item.Id">
                <div v-if="item.Imprint == ''" class="thumb">
                  <img
                    v-if="item.Name == ''"
                    v-on:click="selectItem"
                    :name="item.Name"
                    :value="item.Imprint"
                    :src="'./publishers/Unknown Publisher.jpg'"
                    onerror="this.src='./publishers/blank.jpg'"
                  />
                  <img
                    v-else
                    v-on:click="selectItem"
                    :name="item.Name"
                    :value="item.Imprint"
                    :src="'./publishers/'+item.Name+'.jpg'"
                    onerror="this.src='./publishers/blank.jpg'"
                  />
                </div>

                <div v-else class="thumb">
                  <img
                    class="imprintThumb"
                    :src="'./publishers/'+item.Name+'.jpg'"
                    onerror="this.src='./publishers/blank.jpg'"
                  />
                  <img
                    v-on:click="selectItem"
                    :name="item.Name"
                    :value="item.Imprint"
                    :id="item.Imprint"
                    :src="'./publishers/'+item.Imprint+'.jpg'"
                    onerror="this.src='./publishers/blank.jpg'"
                  />
                </div>

                <div v-if="item.Name == ''" class="label">Unknown Publisher</div>
                <div v-else-if="item.Imprint == ''" class="label">{{item.Name}}</div>
                <div v-else class="label">{{item.Imprint}} [{{item.Name}}]</div>
              </div>
            </v-layout>
          </template>
        </v-data-iterator>
      </v-container>
      <v-layout align-center justify-center row fill-height>
        <v-pagination @next="top()" v-model="page" :length="pages"></v-pagination>
      </v-layout>
    </v-layout>
  </v-container>
</template>

<script>
import {
  GRAB_PUBLISHERS,
  CHANGE_TITLE,
  CHANGE_PUBLISHER,
  CHANGE_PAGE_NBR
} from "../plugins/api";
export default {
  created() {
    this.$store.dispatch(GRAB_PUBLISHERS, data => {
      this.itemList = data;
    });
    this.$store.dispatch(CHANGE_TITLE, "Publishers");
    this.$store.dispatch(CHANGE_PUBLISHER, "");
    this.$store.dispatch(CHANGE_PAGE_NBR, {
      list: "pubSeries",
      page: 1
    });
  },
  methods: {
    selectItem: function(event) {
      var pub = event.target.name;
      var imprint = event.target.id || "%2500";
      var displaypub = "";
      if (imprint == "" || imprint == "%2500") {
        displaypub = pub;
      } else {
        displaypub = imprint + " [" + pub + "]";
      }
      this.$store.dispatch(CHANGE_TITLE, displaypub);
      this.$store.dispatch(CHANGE_PUBLISHER, displaypub);
      console.log(imprint);
      this.$router.push({
        name: "Series",
        query: {
          publisher: pub,
          imprint: imprint
        }
      });
      this.$store.dispatch(CHANGE_PAGE_NBR, {
        list: "publishers",
        page: this.page
      });
    },
    top() {
      this.$nextTick(() => {
        // $(window).scrollTop(0);
      });
    }
  },
  computed: {
    pages() {
      if (this.itemsPerPage == null || this.totalItems == null) return 0;

      return Math.ceil(this.totalItems / this.itemsPerPage);
    },
    Issue() {
      return this.$store.state.api.selectedIssue[0];
    }
  },
  watch: {
    itemList(data) {
      this.results = data;
      this.loading = false
    },
    search() {
      if (this.search.trim() === "") {
        this.results = this.itemList;
      } else {
        this.$search(this.search, this.itemList, {
          keys: ["Name", "Imprint"],
          threshold: 0.2
        }).then(results => {
          this.results = results;
        });
      }
    },
    results() {
      this.$nextTick(() => {
        this.totalItems = this.results.length;
      });
    }
  },
  mounted() {
    this.$store.state.test = this.$el.offsetHeight;
  },
  data() {
    return {
      itemsPerPage: this.$store.state.api.gridSize,
      itemsPerPageOptions: [5, 10, 15, this.$store.state.api.gridSize],
      page: 1,
      totalItems: 0,
      pagination: {},
      loading: true,
      listtype: "Series",
      dialog: false,
      itemList: [],
      search: "",
      results: []
    };
  }
};
</script>

<style>
</style>
