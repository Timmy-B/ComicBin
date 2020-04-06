<template>
<v-layout justify-center column>
        <v-layout align-center justify-center row fill-height>
        <v-pagination @next="top()" v-model="page" :length.sync="pages"></v-pagination>
    </v-layout>
        <v-container fluid grid-list-md justify-center>
            <v-data-iterator :items="this.issuesList" :itemsPerPage.sync="itemsPerPage" :page.sync="page" :footer-props="{ itemsPerPageOptions }" hide-default-footer class="pages" ref="list"> 
                <template v-slot:default="props">
                    <v-layout row wrap>
      <div class="cellcontainer" v-for="item in props.items" :key="item.Id" v-on:click="selectItem">
   <div class="thumb">
          <clazy-load :src="baseURL+'/BCR/Comics/'+item.Id+'/Pages/0?height=240'">
            <transition name="fade">
              <img
              :id="item.Id"
              :title="item.Title"
                :src="baseURL+'/BCR/Comics/'+item.Id+'/Pages/0?height=240'" />
            </transition>
            <transition name="fade" slot="placeholder">
                <img slot="placeholder" :src="'./publishers/Unknown Publisher.jpg'" />
            </transition>
          </clazy-load>
                    <v-progress-linear 
                    class="progBar"
                    color="success"
                    height="3"
                    :value="Math.floor((item.CurrentPage / item.PageCount)*100)"
                    ></v-progress-linear>

        <!-- <div v-if="item.Count > 1" class="numberblock"><div class="number"><span>{{item.Count}}</span></div></div> -->
        </div>
          <div class="label">{{item.Caption}}</div>
      </div>
                    </v-layout>
                </template>
            </v-data-iterator>
        </v-container>
        <v-layout align-center justify-center row fill-height>
        <v-pagination @next="top()" v-model="page" :length.sync="pages"></v-pagination>
    </v-layout>
 <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar  color="primary">
          <v-btn icon  @click.native="dialog = false;">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{Issue.Series}} ({{Issue.Volume}})</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn flat @click.native="dialog = false; readIssue();">Read</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        
        <v-list three-line subheader>
          <div class="infcover infThumb">
                <div>
                     <img :src="this.baseURL+'/BCR/Comics/'+Issue.Id+'/Pages/0?height=240'"  onerror="this.src='./publishers/blank.jpg'" />
                </div>
          </div> 
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Issue</v-list-item-title>
              <v-list-item-sub-title>{{Issue.Caption}}</v-list-item-sub-title>
            </v-list-item-content>

          </v-list-item>
         <v-list-item>
            <v-list-item-content>
              <div>Genre</div>
              <v-list-item-sub-title>{{Issue.Genre}}</v-list-item-sub-title>
            </v-list-item-content>

          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <div>Pages</div>
              <v-list-item-sub-title>{{Issue.PageCount}}</v-list-item-sub-title>
            </v-list-item-content>

          </v-list-item>
                   <v-list-item>
            <v-list-item-content>
              <div>Manga</div>
              <v-list-item-sub-title>{{Issue.Manga}}</v-list-item-sub-title>
            </v-list-item-content>

          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Summary</v-list-item-title>

            </v-list-item-content>
          </v-list-item>
            <div class="summary">{{Issue.Summary}}</div>
           <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Publisher</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          
              <img class="publisherTbn" :src="'./publishers/'+Issue.Publisher+'.jpg'"/>
        </v-list>
        <v-divider></v-divider>
        <div class="preview">

            <div class="infThumb">
                <div>
                     <v-img transition contain :src="baseURL + '/BCR/Comics/'+Issue.Id+'/Pages/1?height=240'"/>
                </div>
            </div>
            <div class="infThumb">
                <div>
                     <v-img transition contain :src="baseURL + '/BCR/Comics/'+Issue.Id+'/Pages/2?height=240'"/>
                </div>
            </div>
            <div class="infThumb">
                <div>
                     <v-img transition contain :src="baseURL + '/BCR/Comics/'+Issue.Id+'/Pages/3?height=240'"/>
                </div>
            </div>
            <div class="infThumb">
                <div>
                     <v-img transition contain :src="baseURL + '/BCR/Comics/'+Issue.Id+'/Pages/4?height=240'"/>
                </div>
            </div>
            <div class="infThumb">
                <div>
                     <v-img transition contain :src="baseURL + '/BCR/Comics/'+Issue.Id+'/Pages/5?height=240'"/>
                </div>
            </div>
        <!-- <div v-if="item.Count > 1" class="numberblock"><div class="number"><span>{{item.Count}}</span></div></div> -->
        </div>
      </v-card>
    </v-dialog>
</v-layout>


</template>

<script>
// import {GRAB_SERIES_ISSUES} from '../plugins/api'
import { GRAB_RECENT,GRAB_ISSUE} from "../plugins/api";
// import {LOAD_ISSUE} from '../plugins/api'
export default {
  created: function() {
    this.$store.dispatch(GRAB_RECENT)
  },
  methods: {
    selectItem: function(event) {
      this.$store.dispatch(GRAB_ISSUE, event.target.id);
      this.dialog = true;
    },
    readIssue: function() {
      this.$router.push({name: 'Reader', params: { itemID: event.target.id}});
    }
  },
  watch: {
    issuesList() {
      this.$nextTick(() => {
        this.totalItems = this.issuesList.length;
      });
    }
  },
  computed: {
        pages() {
            if (this.itemsPerPage == null ||
                this.totalItems == null
            ) return 0

            return Math.ceil(this.totalItems / this.itemsPerPage)
        },
    // issuesList() {
    //   return this.$store.state.api.recent;
    // },
    Issue() {
      return this.$store.state.api.selectedIssue[0] || {};
    },
    baseURL() {
      return this.$store.state.api.baseURL;
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
        listtype: "Series",
        dialog: false,
        issuesList: this.$store.state.api.recent || {},
    };
  }
};
</script>

<style>

</style>
