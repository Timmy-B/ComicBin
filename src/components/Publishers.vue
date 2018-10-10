<template>
<v-layout justify-center column class="gh">
  <v-data-iterator
      :items="this.SeriesList"
      :rows-per-page-items="rowsPerPageItems"
      :pagination.sync="pagination"
      content-tag="v-layout"
      row
      wrap 
      justify-space-around
      scroll
      width="100%"
      hide-actions
      class="elevation-1 pages"
      ref="list"
  >
    <div class="cellcontainer"
        slot="item"
        slot-scope="props"
        >
            <div  v-if="props.item.Imprint == ''" class="thumb">
                <div>
                  <img  v-if="props.item.Name == ''" v-on:click="selectItem" :name="props.item.Name" :value="props.item.Imprint" :src="'./publishers/Unknown Publisher.jpg'" 
                    :lazy-src="'./publishers/Unknown Publisher.jpg'" onerror="this.src='./publishers/blank.jpg'"/>
                    <img v-else v-on:click="selectItem" :name="props.item.Name" :value="props.item.Imprint" :src="'./publishers/'+props.item.Name+'.jpg'" 
                    :lazy-src="'./publishers/'+props.item.Name+'.jpg'" onerror="this.src='./publishers/blank.jpg'"/>
                    
                </div>
            </div>

            <div v-else class="thumb">
                <div>
                    <img class="imprintThumb" :src="'./publishers/'+props.item.Name+'.jpg'" 
                    :lazy-src="'./publishers/'+props.item.Name+'.jpg'" onerror="this.src='./publishers/blank.jpg'"/>
                    <img v-on:click="selectItem" :name="props.item.Name" :value="props.item.Imprint" :id="props.item.Imprint" :src="'./publishers/'+props.item.Imprint+'.jpg'" 
                    :lazy-src="'./publishers/'+props.item.Imprint+'.jpg'" onerror="this.src='./publishers/blank.jpg'"/>
                </div>
            </div>
            
            <div v-if="props.item.Name == ''" class="label">Unknown Publisher</div>
            <div v-else-if="props.item.Imprint == ''" class="label">{{props.item.Name}}</div>
            <div v-else class="label">{{props.item.Imprint}} [{{props.item.Name}}]</div>

    </div>
    </v-data-iterator>
      <div 
      class="text-xs-center pt-2 gf">
        <v-pagination
          @next="top()"
          v-model="pagination.page" 
          :length="pages"
        >
        </v-pagination>
      </div>
</v-layout>


</template>

<script>
import JQuery from "jquery";
let $ = JQuery;
import {GRAB_PUBLISHERS} from '../plugins/api'
import {GRAB_PUBLISHERS_SERIES} from '../plugins/api'
import {CHANGE_TITLE} from '../plugins/api'
import {CHANGE_PUBLISHER} from '../plugins/api'
import {CHANGE_PAGE_NBR} from '../plugins/api'
import Vue from 'vue'
import VueFuse from 'vue-fuse'
Vue.use(VueFuse)
// import {GRAB_ISSUE} from '../plugins/api'
export default {
  created() {$(".back-btn").addClass("hidden");
      this.$store.dispatch(GRAB_PUBLISHERS)
      this.$store.dispatch(CHANGE_TITLE, "Publishers")
      this.$store.dispatch(CHANGE_PUBLISHER, "")
      this.$store.dispatch(CHANGE_PAGE_NBR, {list: "pubSeries",page:1})
  },
  methods: {
    selectItem: function (event) {
      var pub = event.target.name
      var imprint = event.target.id || "";
      var displaypub = "";
      if(imprint == ""){
        displaypub = pub
      }else{
        displaypub = imprint + ' ['+pub+']'
      }
      this.$store.dispatch(GRAB_PUBLISHERS_SERIES,{pub:pub, imprint:imprint})
      this.$store.dispatch(CHANGE_TITLE, displaypub)
      this.$store.dispatch(CHANGE_PUBLISHER, displaypub)
      this.$router.push('/publisherseries')
      this.$store.dispatch(CHANGE_PAGE_NBR, {list: "publishers",page:this.pagination.page})
    },
    top(){
      this.$nextTick(() => {
         $(window).scrollTop(0);
      });
   },
  },
 computed: {
   search(){
      return this.$store.state.api.search
   },
   SeriesList(){
     return this.$store.state.api.comicList;
   },
    pages () {
      if (this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      ) return 0

      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
    },
    Issue() {
      return this.$store.state.api.selectedIssue[0] 
    },
    baseURL(){
      return this.$store.state.api.baseURL;
    }
  },
  watch: {
    SeriesList(){
      this.$nextTick(() => {
        this.pagination.totalItems = this.SeriesList.length
        if(this.$store.state.api.pageNbr.publishers){
          this.pagination.page = this.$store.state.api.pageNbr.publishers
        }
      })
    },
  },
  mounted(){
    this.$store.state.test = this.$el.offsetHeight
    // this.result = this.SeriesList
  },
  data () {
    return {
     rowsPerPageItems: [5, 10, 15],
      pagination: {
        rowsPerPage: this.$store.state.api.gridSize
      },
      listtype: 'Series',
      dialog: false,
      
  }
  },
};

</script>

<style>
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
.pages{
  padding: 5px;
}
.tests{
  position: absolute;
}
.imprintThumb{
  position: absolute;
  height: 50px;
}
</style>
