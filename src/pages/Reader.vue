<template>
  <div>
    <fullscreen ref="fullscreen" @change="fullscreenChange">
      <button type="button" v-show="this.showFullscreenBtn" class="btn-fullscreen" @click="toggle">
        <i class="mdi mdi-fullscreen"></i>
      </button>
      <div id="BookReader">
        <v-progress-linear :value="this.loadProgress"></v-progress-linear>
        <v-img
          height="500"
          contain
          :src="this.baseURL + '/BCR/Comics/' + this.$route.query.itemID + '/Pages/0'"
        ></v-img>
        <div class="text-xs-center" align="center" justify="center">
          <v-progress-circular :size="80" :width="7" color="green" indeterminate>Loading</v-progress-circular>
        </div>

        <img id="tempImg" style="display:none;" />
        <canvas id="tempCanvas" style="display:none;"></canvas>
      </div>
    </fullscreen>
  </div>
</template>
<script>
import { GRAB_ISSUE, UPDATE_CURRENT_PAGE } from "../plugins/api";
import axios from "axios";
export default {
  created() {
    this.itemID = this.$route.query.itemID;
    this.loading = "getting ratios";
    this.$store.dispatch(GRAB_ISSUE, this.itemID);
  },
  watch: {
    loading(data) {
      if (data === "done") {
        // this.loadBookReader();
        this.pagePlacer(this.pages);
      }
    },
    selectedIssue() {
      this.manga = this.selectedIssue.Manga.length < 3 ? false : true;
      this.getRatios();
    },
    currentPage(page) {
      var data = { id: this.itemID, currentPage: page };
      this.$store.dispatch(UPDATE_CURRENT_PAGE, data);
    }
  },
  methods: {
    toggle() {
      
      this.$refs["fullscreen"].toggle();
    },
    fullscreenChange(fullscreen) {
      this.fullscreen = fullscreen;
    },
    exitReader() {
      this.$router.go(-1);
    },
    loadBookReader(data) {
      var lastpage = this.selectedIssue.LastPageRead;

      var options = {
        ui: "full",
        el: "#BookReader",
        data: data,
        bookTitle: this.selectedIssue.Caption,
        thumbnail: this.baseURL + "/BCR/Comics/" + this.selectedIssue.Id + "/Pages/0",
          metadata: [
          {label: 'Title', value: this.selectedIssue.Title},          
          {label: 'Series', value: this.selectedIssue.Series},
          {label: 'Number', value: this.selectedIssue.Number},
          {label: 'Publisher', value: this.selectedIssue.Publisher+" "+this.selectedIssue.Imprint},
          {label: 'Summary', value: this.selectedIssue.Summary},
        ],
        protected:true,
        enableExperimentalControls: false,
        pageProgression: this.manga === true ? "rl" : "lr"
      };
      window.br = new BookReader(options);
      window.br.init();
      this.showFullscreenBtn = true ;
      window.br.jumpToIndex(lastpage);
      window.br.hideNav();
    },
    pagePlacer(data) {
      console.log("placer", data);
      const PageCount = this.selectedIssue.PageCount;
      const issueID = this.selectedIssue.Id;
      const url = this.baseURL + "/BCR/Comics/" + issueID + "/Pages/";
      const pageSizes = [];
      // var dualPage
      var nextPageSide = "L";
      for (var i = 0; i < data.length; i++) {
        const height = data[i].height;
        const width = data[i].width;
        const type = data[i].type;
        const uri = data[i].uri;
        if (i === 0) {
          pageSizes.push([
            {
              width: width,
              height: height,
              type: "cover",
              uri: uri
            }
          ]);
        } else if (type === "spread 0") {
          pageSizes.push([
            {
              width: width,
              height: height,
              type: "spread 0",
              uri: uri
            }
          ]);
          console.log("yep", pageSizes[pageSizes.length - 2]);
          if (pageSizes[pageSizes.length - 2].length != 2) {
            pageSizes[pageSizes.length - 2].push({
              width: width,
              height: height,
              type: "right",
              uri: "./publishers/blank.jpg"
            });
          }
          nextPageSide = "L";
        } else if (type === "spread 1") {
          pageSizes[pageSizes.length - 1].push({
            width: width,
            height: height,
            type: "spread 1",
            uri: uri
          });
          nextPageSide = "L";
        } else if (nextPageSide == "L") {
          pageSizes.push([
            {
              width: width,
              height: height,
              type: "left",
              uri: uri
            }
          ]);
          nextPageSide = "R";
        } else {
          pageSizes[pageSizes.length - 1].push({
            width: width,
            height: height,
            type: "right",
            uri: uri
          });
          nextPageSide = "L";
        }
      }
      this.tempPages = pageSizes;
      console.log("loadbook", pageSizes);
      this.loadBookReader(pageSizes);
    },
    async getRatios() {
      this.loading = true;
      const PageCount = this.selectedIssue.PageCount;
      const issueID = this.selectedIssue.Id;
      const baseURL = this.baseURL;
      var apiKey = this.$store.state.auth.apiKey;
      var pageList = [];

      for (var i = 0; i < PageCount; i++) {
        var cnt = i;
        const url =
          baseURL + "/BCR/Comics/" + issueID + "/Pages/" + i + "/size";
        const srcUrl = baseURL + "/BCR/Comics/" + issueID + "/Pages/" + i;
        const x = i;
        await axios({
          url: url,
          method: "GET",
          params: {
            apiKey: apiKey
          }
        })
          .then(resp => {
            this.loadProgress = (cnt / PageCount) * 100;
            const json = resp.data;
            const ratio = Math.floor(json.width / json.height);
            const spread = ratio > 0 ? "spread" : "single";
            if (spread == "single") {
              pageList.push({
                uri: srcUrl,
                width: json.width,
                height: json.height,
                type: spread
              });
            } else {
              // this.splitSpread({uri: srcUrl,width:json.width,height:json.height})
              var stuff = {
                uri: srcUrl,
                width: json.width,
                height: json.height
              };
              console.log(stuff);
              this.splitSpread(stuff, function(data) {
                for (let i = 0; i < data.length; i++) {
                  pageList.splice(x + i, 0, data[i]);
                }
              });
            }
            // if(i==PageCount){
            //     this.page1url = this.pages[0].src
            // }
          })
          .catch(err => {
            // Vue.cookie.delete('BCR_USERNAME', {domain: 'localhost'});
            // Vue.cookie.delete('BCR_apiKey', {domain: 'localhost'});
          });
      }
      console.log("pagelist", pageList);
      this.pages = pageList;
      this.loading = "done";
    },
    splitSpread(imgData, cb) {
      console.log(imgData);
      var tempImage = document.getElementById("tempImg");
      tempImage.onload = () => {
        var imagePieces = [];
        var temp = {};
        var halfWidth = imgData.width / 2;
        var height = imgData.height;
        console.log(halfWidth);
        var tempImg = document.getElementById("tempImg");
        var canvas = document.getElementById("tempCanvas");

        canvas.width = halfWidth;
        canvas.height = height;
        var context = canvas.getContext("2d");
        for (var x = 0; x < 2; ++x) {
          context.drawImage(
            tempImg,
            x * halfWidth,
            0,
            halfWidth,
            height,
            0,
            0,
            canvas.width,
            canvas.height
          );

          var dataurl = canvas.toDataURL("image/jpeg", 0.8);
          temp = {
            uri: dataurl,
            width: halfWidth,
            height: height,
            type: "spread " + x
          };
          imagePieces.push(temp);
        }
        cb(imagePieces);
      };
      tempImage.src = imgData.uri;
    }
  },
  computed: {
    baseURL() {
      var url = this.$store.state.api.baseURL;
      return url;
    },
    selectedIssue() {
      return this.$store.state.api.selectedIssue[0];
    },
    currentPage() {
      return window.br.firstIndex;
    }
  },
  data() {
    return {
      loading: false,
      itemID: "",
      br: "",
      reader: true,
      dialog: false,
      comicMenu: false,
      showFullscreenBtn:false,
      lastSingle: false,
      page1url: "./logo.jpg",
      page2url: "./logo.jpg",
      pages: [],
      tempPages: [],
      comicData: {
        data: []
      },
      readerStyle: "flex-direction:row",
      showPage1: true,
      showPage2: false,
      page1style: {
        display: "block"
      },
      page2style: {
        display: "none"
      },
      dual: true,
      manga: false,
      loadProgress: 0
    };
  }
};
</script>
<style scoped>
.BookReader {
  top: 0;
  position: relative;
  height: 100%;
  min-height: 90vh;
  width: 100%;
}
#BookReader > div.BRtoolbar.header > div > div.BRtoolbarRight > span > button.BRpill.share.js-tooltip.cboxElement{
  visibility: hidden;
}
.btn-fullscreen {
    position: absolute;
    background-color: grey;
    opacity: .5;
    right: 10px;
    top: 10px;
    width: 36px;
    height: 36px;
    padding: 0;
    font-size: 36px;
    line-height: 36px;
    text-align: center;
    outline: none;
    display: inline-block;
    white-space: nowrap;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-image: none;
    border: 1px solid transparent;
    border-radius: 3px;
    z-index: 100;
}
.colorbox{
  background-color: black;
  color:white;
}
</style>