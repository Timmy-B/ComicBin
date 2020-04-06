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
        <v-pagination @next="top()" v-model="page" :length="pages"></v-pagination>
      </v-layout>
      <v-container fluid grid-list-md justify-center>
        <v-data-iterator
          :items="this.results"
          :itemsPerPage.sync="itemsPerPage"
          :page.sync="page"
          :loading="this.loading"
          :footer-props="{ itemsPerPageOptions }"
          hide-default-footer
          class="pages"
          ref="list"
        >
          <template v-slot:default="props">
            <v-layout row wrap>
              <div
                class="cellcontainer"
                v-for="item in props.items"
                :key="item.Id"
                @click="selectItem(item.Id)"
              >
                <div class="thumb">
                  <clazy-load :src="baseURL+'/BCR/Comics/'+item.Id+'/Pages/0?height=240'">
                    <transition name="fade">
                      <div class="stack">
                        <img
                          :title="item.Title"
                          :src="baseURL+'/BCR/Comics/'+item.Id+'/Pages/0?height=240'"
                        />
                        <img
                          v-if="item.SecondId"
                          class="thumbBkg"
                          :src="baseURL+'/BCR/Comics/'+item.SecondId+'/Pages/0?height=240'"
                        />
                      </div>
                    </transition>
                    <transition name="fade" slot="placeholder">
                      <img slot="placeholder" :src="'./publishers/Unknown Publisher.jpg'" />
                    </transition>
                  </clazy-load>
                </div>
                <div class="label">{{item.Title}} (v.{{item.Volume}}) ({{item.Count}})</div>
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
  GRAB_SERIES,
  GRAB_PUBLISHERS_SERIES,
  GRAB_AGE_RATING_SERIES,
  CHANGE_SERIES,
  CHANGE_TITLE,
  CHANGE_PAGE_NBR
} from "../plugins/api";
export default {
  created() {
    const params = this.$route.query;
    console.log(params);
    if (params.publisher != undefined) {
      this.$store.dispatch(GRAB_PUBLISHERS_SERIES, params);
    } else if (params.agerating != undefined) {
      this.$store.dispatch(GRAB_AGE_RATING_SERIES, params.agerating);
    } else {
      this.$store.dispatch(GRAB_SERIES);
    }
  },
  methods: {
    selectItem: function(id) {
      this.$router.push({ name: "Items", query: { seriesID: id } });
    },
    top() {
      this.$nextTick(() => {
        console.log("click");
        $(window).scrollTop(0);
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
    },
    itemList() {
      return this.$store.state.api.itemList;
    },
    baseURL() {
      return this.$store.state.api.baseURL;
    }
  },
  watch: {
    itemList(data) {
      this.results = data;
      this.loading = false;
    },
    search() {
      if (this.search.trim() === "") {
        this.results = this.itemList;
      } else {
        this.$search(this.search, this.itemList, {
          keys: ["Title"],
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
    // this.result = this.itemList
  },
  data() {
    return {
      itemsPerPage: this.$store.state.api.gridSize,
      itemsPerPageOptions: [5, 10, 15, this.$store.state.api.gridSize],
      page: 1,
      totalItems: 0,
      pagination: {},
      listtype: "Series",
      loading: true,
      dialog: false,
      search: "",
      results: []
    };
  }
};
</script>

<style>
</style>
