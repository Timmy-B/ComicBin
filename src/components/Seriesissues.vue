<template>
<v-layout justify-center column>
  <v-data-iterator
      :items="issuesList"
      :rows-per-page-items="rowsPerPageItems"
      :pagination.sync="pagination"
      content-tag="v-layout"
      row
      wrap 
      justify-space-around
      width="100%"
      hide-actions
      class="elevation-1 gh"
  >
        <!-- <v-flex justify-space-around align-content-center align-center

        slot="item"
        slot-scope="props"
        xs12
        sm6
        md4
        lg3
        > -->
    <div class="cellcontainer"
        slot="item"
        slot-scope="props"
        
        v-on:click="selectItem"
        >
      
    <!-- <div v-for="item of SeriesList" :key="item.Id" class="cellcontainer"> -->
            <div class="thumb">
                <div>
                    <img :id="props.item.Id" :src="baseURL+'/BCR/Comics/'+props.item.Id+'/Pages/0?height=240'" 
                    :lazy-src="baseURL+'/BCR/Comics/'+props.item.Id+'/Pages/0?height=240'"/>
                    <v-progress-linear 
                    class="progBar"
                    color="success"
                    height="3"
                    :value="Math.floor((props.item.CurrentPage / props.item.PageCount)*100)"
                    ></v-progress-linear>
                </div>

            <div class="label">#{{props.item.Number}} {{props.item.Title}} ({{props.item.Volume}})</div>
        <!-- <div v-if="item.Count > 1" class="numberblock"><div class="number"><span>{{item.Count}}</span></div></div> -->
        </div>
    </div>
    <!-- </v-flex> -->
    </v-data-iterator>
      <div class="text-xs-center pt-2 gf">
        <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
      </div>
 <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click.native="dialog = false;">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{Issue.Series}} ({{Issue.Volume}})</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click.native="dialog = false; readIssue();">Read</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        
        <v-list three-line subheader>
          <div class="cover thumb">
                <div>
                     <img :src="this.baseURL+'/BCR/Comics/'+Issue.Id+'/Pages/0?height=240'"  onerror="this.src='./publishers/blank.jpg'" />
                </div>
          </div>
          <v-subheader>User Controls</v-subheader>
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title>Issue</v-list-tile-title>
              <v-list-tile-sub-title>{{Issue.Caption}}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title>Summary</v-list-tile-title>

            </v-list-tile-content>
          </v-list-tile>
            <div class="summary">{{Issue.Summary}}</div>
           <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title>Publisher</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          
              <img class="publisherTbn" :src="'./publishers/'+Issue.Publisher+'.jpg'"/>
        </v-list>
        <v-divider></v-divider>
        <div class="preview">

            <div class="thumb">
                <div>
                     <v-img transition contain :src="baseURL + '/BCR/Comics/'+Issue.Id+'/Pages/1?height=240'"/>
                </div>
            </div>
            <div class="thumb">
                <div>
                     <v-img transition contain :src="baseURL + '/BCR/Comics/'+Issue.Id+'/Pages/2?height=240'"/>
                </div>
            </div>
            <div class="thumb">
                <div>
                     <v-img transition contain :src="this.baseURL + '/BCR/Comics/'+Issue.Id+'/Pages/3?height=240'"/>
                </div>
            </div>
                        <div class="thumb">
                <div>
                     <v-img transition contain :src="baseURL + '/BCR/Comics/'+Issue.Id+'/Pages/4?height=240'"/>
                </div>
            </div>
                        <div class="thumb">
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
import JQuery from "jquery";
let $ = JQuery;
// import {GRAB_SERIES_ISSUES} from '../plugins/api'
import {GRAB_ISSUE} from '../plugins/api'
// import {LOAD_ISSUE} from '../plugins/api'
export default {
  created: function () {
    $(".back-btn").removeClass("hidden");
    this.issuesList[0].Series
    this.$store.dispatch(GRAB_ISSUE,this.issuesList[0].Series);
  },
  methods: {
    selectItem: function (event) {
        this.$store.dispatch(GRAB_ISSUE,event.target.id);
        this.dialog = true;
     },
     readIssue: function(){
        this.$router.push('/reader');
     },

  },
  watch: {
    issuesList(){
      this.$nextTick(() => {
        this.pagination.totalItems = this.issuesList.length
      })
    },
  },
 computed: {
    pages () {
      if (this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      ) return 0

      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
    },
    issuesList() {
      return this.$store.state.api.issueList;
    },
    Issue() {
      return this.$store.state.api.selectedIssue[0] || {}
    },
    baseURL(){
           var url = this.$store.state.api.baseURL;
           return url;
    }
  },
  mounted(){
    this.$store.state.test = this.$el.offsetHeight
  },
  data () {
    return {
     rowsPerPageItems: [5, 10, 15],
      pagination: {
        rowsPerPage: this.$store.state.api.gridSize
      },
      listtype: 'Series',
      dialog: false
  }
  },
};

</script>

<style scoped>
.gh{
  padding-bottom: 10%;
}
.gf{
  position: fixed;
  bottom: 10px;
  width: 100%;
  background: #303030;
}
.cellcontainer {
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  width: 160px;
  margin: 5px;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  align-content: center;
  align-items: center;
}
.cell {
  float: left;
  width: 160px;
  height: 300px;
  margin: 0 15px 15px 0;
  padding: 5px;
}
.thumb {
  height: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
}
.thumb img {
  max-width: 100%;
  max-height: auto;
  vertical-align: middle;
  box-shadow: 1px 1px 11px 0px #000;
  border-radius: 5px;
}
a {
  color: #444444;
  text-decoration: none;
  outline: none;
}
.label {
  margin: 12px 0 0 0;
  font-family: "Arial";
  font-size: 12px;
  height: 40px;
  width: 160px;
  overflow: hidden;
  font-family: "Arial";
  color: #FFF;
  text-align: center
}
.numberblock {
  position: relative;
  float: right;
  top: -241px;
  right: -22px;
  border-radius: 5px;
  background-color: brown;
  box-shadow: 1px 1px 11px 0px #000;
}
.number {
  background: transparent no-repeat scroll top right;
  display: block;
  float: left;
  height: 39px;
  margin-right: 7px;
  padding-right: 16px;
  text-decoration: none;
  color: #ffffff;
  text-align: center;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  font-weight: bold;
}
.number span {
  background: transparent no-repeat;
  display: block;
  height: 39px;
  padding: 10px 0 5px 8px;
}
.fade-enter-active {
  transition: opacity 3s ease-in-out;
}

.fade-enter-to {
  opacity: 1;
}

.fade-enter {
  opacity: 0;
}

.preview{
  display: flex;
  flex-direction: row;
  margin:1.0em;
  justify-content: space-around
}
.summary{
  height: 15.0em;
  margin-left: 2em;
  margin-right: 2.0em;
}
.publisherTbn{
  height:100px;
  margin-left:1em;
}
.cover{
  float: right;
  margin-right:2em;
  height: 14em;
  
}
.cover img{
  height:12em;
}
.progBar{
  margin: 0;
  bottom: 5px;
}
</style>
