<template>
<v-container>
<v-dialog v-model="dialog" fullscreen hide-overlay>
    <!-- <v-card> -->
    <div class="readerContainer"
      v-touch="{
        left: () => cyclePages(1),
        right: () => cyclePages(-1),
      }"
      >
        <div class="readerPages">
            <!-- <div class="readerPageContainer"> -->
            <v-img :class="'page1'" v-bind:position="page1position" contain max-height=100% :src="this.page1url">
            </v-img>
            <!-- </div> -->
            <!-- <div class="readerPageContainer"> -->
            <v-img :class="'page2 hidden'" v-bind:position="page2position" contain max-height=100% :src="this.page2url">
            </v-img>
            <!-- </div> -->
        </div>
        <div :class="'comicMenu hidden'">
        <v-card>
          <v-img
            :src="this.coverPage"
            aspect-ratio="2.75"
            
             position="top"
          ></v-img>
  
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{this.issue.Caption}}</h3>
              <div>{{this.issue.Summary}}</div>
            </div>
          </v-card-title>
  
          <v-card-actions>
            <v-btn flat color="orange" v-on:click="exitReader">Exit</v-btn>
            <v-btn flat color="orange">Explore</v-btn>
            <v-btn v-on:click="closeMenu" flat color="orange">Close</v-btn>
            <v-btn @click.stop="dual = !dual" flat color="orange">DualReader: {{this.dual}}</v-btn>
            <v-btn @click.stop="manga = !manga" flat color="orange">Manga: {{this.manga}}</v-btn>
          </v-card-actions>
        </v-card>
    </div>
        <div class="readerControls">
            <div class="directBtns prevReaderPage" v-on:click="cyclePages(-1)"><span>◄</span></div>
            <div class="directBtns showReaderMenu"  v-on:click="openMenu"></div>
            <div class="directBtns nextReaderPage" v-on:click="cyclePages(1)"><span>►</span></div>
        </div>
    </div>
    <!-- </v-card> -->

</v-dialog>

</v-container>
</template>

<script>
import JQuery from "jquery";
let $ = JQuery;
// import { GRAB_ISSUE_PAGES } from "../plugins/api";
import axios from "axios";
export default {
  created(){
  },
  methods: {
    openMenu() {
      $(".comicMenu").removeClass("hidden");
    },
    closeMenu() {
      $(".comicMenu").addClass("hidden");
    },
    exitReader() {
      this.$router.go(-1);
    },
    nextPage() {
      const manga = this.$store.state.api.manga;
      if (manga) {
        //  cyclePages("prev");
      } else {
        // cyclePages("next");
      }
    },
    prevPage() {
      const manga = this.$store.state.api.manga;
      if (manga) {
        //  cyclePages("next");
      } else {
        //  cyclePages("prev");
      }
    },
    cyclePages(direction) {
      if (this.manga) {
        direction = direction * -1;
      }
      var currPage = this.currentPage;
      var lastPage = this.lastPage;
      var page1Pos = "center right"
      if (this.manga){
       page1Pos = "center left"
       this.page2position = "center right"
      }else{
       this.page2position = "center left"
      }
      if(this.dual){
      switch (direction) {
        case 1:
          var nextPage = currPage + 1;
          var nextPage2 = nextPage + 1;
          var nextPageRatio = this.pages[nextPage].size;
          var nextPage2Ratio = this.pages[nextPage2].size;
          if (nextPage <= lastPage) {
            this.page1url = this.pages[nextPage].src;
            this.currentPage = nextPage;
            console.log("page1:", nextPage);
          }
          if (nextPage2 <= lastPage) {
            $(".page1").removeClass("hidden");
            if (nextPageRatio < 1 && nextPage2Ratio < 1) {
              $(".page2").removeClass("hidden");
              
              this.page1position = page1Pos,
              this.page2url = this.pages[nextPage2].src;
              this.currentPage = nextPage2;
              console.log("page2:", nextPage2);
               this.lastSingle = false;
            } else {
              // is a single page spread
              this.page1position = "center center",
              $(".page2").addClass("hidden");
              this.lastSingle = true;
            }
          }
          break;
        case -1:
          var nextPage2 = Math.max(0,currPage - 1);
          var nextPage = Math.max(0, nextPage2 - 1); 
          if(!this.lastSingle){
            // last view was not a single page spread - jump back additional page
            nextPage2 = Math.max(0,nextPage2 - 1);
            nextPage = Math.max(0,nextPage2 - 1)
          }
                                                
          var nextPageRatio = this.pages[nextPage].size;
          var nextPage2Ratio = this.pages[nextPage2].size;
          if (nextPage <= lastPage) {
            this.page1url = this.pages[nextPage].src;
            this.currentPage = nextPage;
            console.log("page1:", nextPage);
          }
          if(nextPage < 1){
            // reached fistPage
            this.page1url = this.pages[nextPage].src;
            this.currentPage = nextPage;
            $(".page2").addClass("hidden");
            this.page1position = "center center"
          }
          if (nextPage2 <= lastPage && nextPage2 > 0) {
            $(".page1").removeClass("hidden");
            if (nextPageRatio < 1 && nextPage2Ratio < 1) {
              $(".page2").removeClass("hidden");
              this.page1position= page1Pos,
              this.page2url = this.pages[nextPage2].src;
              this.currentPage = nextPage2;
              console.log("page2:", nextPage2);
               this.lastSingle = false;
            } else {  
              // is a single page spread
              this.page1position= "center center",
              this.page1url = this.pages[nextPage2].src;
              this.currentPage = nextPage2;
              $(".page2").addClass("hidden");
              this.lastSingle = true;
              this.page1
            }
          }
          break;
      }
      }else{
        
        switch(direction){
          case 1:
          var nextPage = this.currentPage + 1;
          if(nextPage<=this.lastPage){
          console.log("single page: Forward")
            this.page1url = this.pages[nextPage].src;
            this.currentPage = nextPage;
            }
          break;
          case -1:
          var nextPage = Math.max(0,this.currentPage - 1);
            if(nextPage>=0){
          console.log("single page: Backward")
            this.page1url = this.pages[nextPage].src;
            this.currentPage = nextPage;
            }
          break;
        }
      }
    },
    getRatios() {
      const PageCount = this.$store.state.api.selectedIssue[0].PageCount;
      const issueID = this.$store.state.api.selectedIssue[0].Id;
      const baseURL = this.baseURL;
      // this.$store
      //   .dispatch(GRAB_ISSUE_PAGES, {
      //     PageCount: PageCount,
      //     issueID: issueID
      //   })
      //   .then(
      //     response => {
      //       this.page1url = this.pages[0].src;
      //       this.page2url = this.pages[1].src;
      //       console.log("Done getting Pages");
      //       console.log(this.pages);
      //     },
      //     error => {
      //       console.log("error", error);
      //     }
      //   );
      var apiKey = this.$store.state.auth.apiKey;
      var i = 0;
      var ratio = [];
      this.page1url = baseURL + "/BCR/Comics/" + issueID + "/Pages/0";
      this.coverPage = this.page1url
      for (i = 0; i < PageCount; i++) {
        const url =
          baseURL + "/BCR/Comics/" + issueID + "/Pages/" + i + "/size";
        const srcUrl = baseURL + "/BCR/Comics/" + issueID + "/Pages/" + i;
        const x = i;
        axios({
          url: url,
          method: "GET",
          params: { apiKey: apiKey }
        })
          .then(resp => {
            const json = resp.data;
            this.pages[x] = {
              src: srcUrl,
              size: Math.floor(json.width / json.height)
            };
            // if(i==PageCount){
            //     this.page1url = this.pages[0].src
            // }
          })
          .catch(err => {
            // Vue.cookie.delete('BCR_USERNAME', {domain: 'localhost'});
            // Vue.cookie.delete('BCR_apiKey', {domain: 'localhost'});
          });
      }
    }
  },
  computed: {
    baseURL(){
           var url = this.$store.state.api.baseURL;
           return url;
    }
  },
  watch: {
    dual: function() {
      if(this.dual){
            $(".page2").removeClass("hidden");
            this.page1position = "center right"
      }else{
            $(".page2").addClass("hidden");
            this.page1position = "center center"
      }
    },
    manga: function() {
      if (this.manga) {
        $(".readerPages").addClass("manga");
        this.page1position = "center left"
        this.page2position = "center right"
      } else {
        $(".readerPages").removeClass("manga");
        this.page1position = "center right"
        this.page2position = "center left"
      }
    },
    currentPage: function() {
      console.log(this.currentPage);
    }
  },
  mounted() {
    this.getRatios();
  },
  data() {
    return {
      dialog: true,
      comicMenu: false,
      currentPage: 0,
      lastSingle:false,
      issue: this.$store.state.api.selectedIssue[0],
      lastPage: this.$store.state.api.selectedIssue[0].PageCount - 1,
      page1url: "./logo.jpg",
      coverPage: "",
      page2url: "./logo.jpg",
      pages: {},
      show1: "shown",
      show2: "hidden",
      page1position: "center center",
      page2position: "center left",
      dual: true,
      manga: false
    };
  }
};
</script>

<style>
.directBtns {
  border-radius: 10px;
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  transition: all 0.5s linear;
  height: 100%;
  width: 12vw;
  background-color: #555555;
  box-shadow: 1px 4px 4px rgba(0, 0, 0, 0.5),
    0px 1px 0px rgba(255, 255, 255, 0.4) inset;
}

.directBtns:active {
  opacity: 1;
  transition: all 0s linear;
}
.comicMenu {
  position: absolute;
  background-color: black;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 80%;
  width: 80%;
  z-index: 1000;
}
.prevReaderPage {
  opacity: 0;
  font-size: 4em;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.nextReaderPage {
  opacity: 0;
  font-size: 4em;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  transform: translateX(-100%);
  left: 100%;
}
.showReaderMenu {
  position: absolute;
  height: 50%;
  width: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
}

/* .showReaderMenu:active {
    background-color: red;
} */
.exitReader {
  height: 3em;
  width: 8em;
  left: 50%;
  transform: translateX(-50%);
  vertical-align: middle;
  text-align: center;
  line-height: 3em;
}

.exitReader:active {
  background-color: red;
}

.readerContainer {
  height: 100%;
  width: 100%;
  background: black;
}

.readerPages {
  height: 100%;
  width: 100%;
  display: flex;
}

.readerPages {
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
}

.readerPageContainer {
  /* display: none; */
  height: 100%;
  width: 50%;
}

.readerPageContainer img {
  height: auto;
  max-height: 100vh;
  max-width: 100vw;
  width: auto;
}

.shownPage {
  display: block;
}

.page1 {
  display: block;
}

.page2 {
  display: block;
}

.hidden {
  display: none;
}
.manga {
  flex-direction: row-reverse;
}
</style>
