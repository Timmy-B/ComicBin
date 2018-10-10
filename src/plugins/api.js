import Vue from 'vue'
import VueCookie from 'vue-cookie'
import axios from 'axios';
import _ from 'lodash'

Vue.use(VueCookie);
const baseURL = "http://home.ximcraft.com:8081/tablet";
//const baseURL = ".";
export const GRAB_SERIES = 'GRAB_SERIES'
export const GRAB_SERIES_ISSUES = 'GRAB_SERIES_ISSUES'
export const GRAB_PUBLISHERS = 'GRAB_PUBLISHERS'
export const GRAB_PUBLISHERS_SERIES = 'GRAB_PUBLISHERS_SERIES'
export const GRAB_ISSUE = 'GRAB_ISSUE'
export const GRAB_ISSUE_PAGES = 'GRAB_ISSUE_PAGES'
export const GRAB_LISTS = 'GRAB_LISTS'
export const LOADING_LIST = 'LOADING_LIST'
export const LOAD_LIST = 'LOAD_LIST'
export const LOAD_LISTS = 'LOAD_LISTS'
export const LOAD_SERIES_LIST = 'LOAD_SERIES_LIST'
export const LOAD_ISSUE_LIST = 'LOAD_ISSUE_LIST'
export const LOAD_ISSUE = 'LOAD_ISSUE'
export const LOAD_PAGES = 'LOAD_PAGES'
export const SET_MANGA = 'SET_MANGA'
export const ADJUST_GRID_SIZE = 'ADJUST_GRID_SIZE'
export const SET_GRID_SIZE = 'SET_GRID_SIZE'
export const SEARCH = 'SEARCH'
export const SET_SEARCH = 'SET_SEARCH'
export const SET_TITLE = 'SET_TITLE'
export const CHANGE_TITLE = 'CHANGE_TITLE'
export const CHANGE_PUBLISHER = 'CHANGE_PUBLISHER'
export const SET_PUBLISHER = 'SET_PUBLISHER'
export const CHANGE_PAGE_NBR = 'CHANGE_PAGE_NBR'
export const SET_PAGE_NBR = 'SET_PAGE_NBR'

const state = {
    comicList:{},
    status: '',
    Lists: {},
    issueList:{},
    selectedIssue:{},
    selectedPublisher:"",
    comicPages:{},
    manga: false,
    baseURL: baseURL,
    gridSize: 20,
    search: '',
    psList:{},
    appTitle: "Comic Browser",
    pageNbr:[],
  }
const getters = {
    hasList: state => !!state.comicList,
    comicListStatus: state => state.status,
  }

const actions = {
    [GRAB_SERIES]: ({commit}) => {
      return new Promise((resolve, reject) => { // The Promise used for router redirect in login
        commit(LOADING_LIST)
        const apiKey = Vue.cookie.get('BCR_apiKey');
        const url = baseURL+'/BCR/Series/?$orderby=Title'

        axios({url: url,
        method: 'GET',params:{ apiKey: apiKey} })
          .then(resp => {
            commit(LOAD_LIST, Array.from(resp.data.items))
            resolve()
          })
        .catch(err => {
        //   commit(AUTH_ERROR, err)
          // Vue.cookie.delete('BCR_USERNAME', {domain: 'localhost'});
          // Vue.cookie.delete('BCR_apiKey', {domain: 'localhost'});
          reject(err)
        })
      })
    },
    [GRAB_PUBLISHERS]: ({ commit }) => {
      return new Promise((resolve, reject) => { // The Promise used for router redirect in login
        commit(LOADING_LIST)
        const apiKey = Vue.cookie.get('BCR_apiKey');
        const url = baseURL + '/BCR/Publishers'

        axios({
          url: url,
          method: 'GET', params: { apiKey: apiKey }
        })
          .then(resp => {
            commit(LOAD_LIST, Array.from(resp.data))
            resolve()
          })
          .catch(err => {
            //   commit(AUTH_ERROR, err)
            // Vue.cookie.delete('BCR_USERNAME', {domain: 'localhost'});
            // Vue.cookie.delete('BCR_apiKey', {domain: 'localhost'});
            reject(err)
          })
      })
    },
  [GRAB_PUBLISHERS_SERIES]: ({ commit }, data) => {
      return new Promise((resolve, reject) => { // The Promise used for router redirect in login
        commit(LOADING_LIST)
        var imprint = data.imprint;
        var pub = data.pub;
        const apiKey = Vue.cookie.get('BCR_apiKey');
        if (imprint == null || imprint == '') { imprint = "%2500" } //send blank imprint over url
        if (pub == null || pub == '') { pub = "%2500" } //send blank imprint over url
        const url = baseURL + '/BCR/Publishers/' + pub+ '/Imprint/' +imprint+ '/';

        axios({
          url: url,
          method: 'GET', params: { apiKey: apiKey }
        })
          .then(resp => {
            var arry = _.sortBy(resp.data.items, ['Title', 'Volume'])
            commit(LOAD_SERIES_LIST, arry)
            resolve()
          })
          .catch(err => {
            //   commit(AUTH_ERROR, err)
            // Vue.cookie.delete('BCR_USERNAME', {domain: 'localhost'});
            // Vue.cookie.delete('BCR_apiKey', {domain: 'localhost'});
            reject(err)
          })
      })
    },
    [GRAB_SERIES_ISSUES]: ({commit}, data) => {
      return new Promise((resolve, reject) => { // The Promise used for router redirect in login
        commit(LOADING_LIST)
        const seriesID = data
        const apiKey = Vue.cookie.get('BCR_apiKey');
        const url = baseURL+'/BCR/Series/'+seriesID+'/?$orderby=Caption'

        axios({url: url,
        method: 'GET',params:{ apiKey: apiKey} })
          .then(resp => {
            commit(LOAD_ISSUE_LIST, Array.from(resp.data.items))
            resolve()
          })
        .catch(err => {
        //   commit(AUTH_ERROR, err)
          // Vue.cookie.delete('BCR_USERNAME', {domain: 'localhost'});
          // Vue.cookie.delete('BCR_apiKey', {domain: 'localhost'});
          reject(err)
        })
      })
    },
    [GRAB_ISSUE]: ({commit}, data) => {
      return new Promise((resolve, reject) => { // The Promise used for router redirect in login
        const issueID = data
        const apiKey = Vue.cookie.get('BCR_apiKey');
        const url = baseURL+'/BCR/Comics/'+issueID

        axios({url: url,
        method: 'GET',params:{ apiKey: apiKey} })
          .then(resp => {
            commit(LOAD_ISSUE, Array.from(resp.data))
            resolve(resp)
          })
        .catch(err => {
        //   commit(AUTH_ERROR, err)
          // Vue.cookie.delete('BCR_USERNAME', {domain: 'localhost'});
          // Vue.cookie.delete('BCR_apiKey', {domain: 'localhost'});
          reject(err)
        })
      })
    },
    [GRAB_ISSUE_PAGES]: ({commit}, data) => {
      return new Promise((resolve, reject) => {
        const PageCount = data.PageCount;
        const issueID = data.issueID;
        const apiKey = Vue.cookie.get('BCR_apiKey');
        var i = 0;
        var ratio=[];
        for (i = 0;i < PageCount; i++) { 
          const url = baseURL+'/BCR/Comics/' + issueID + '/Pages/' + i + '/size';
          const srcUrl = baseURL+'/BCR/Comics/' + issueID + '/Pages/' + i;
          const x = i
          axios({url: url,
            method: 'GET',params:{ apiKey: apiKey} })
              .then(resp => {
                const json = resp.data
               ratio[x] = {src: srcUrl, size: Math.round(json.width / json.height)};
                
                if(i==PageCount){
                  
                resolve(ratio)
                commit(LOAD_PAGES, ratio)
                }
              })
            .catch(err => {
              // commit(AUTH_ERROR, err)
              // Vue.cookie.delete('BCR_USERNAME', {domain: 'localhost'});
              // Vue.cookie.delete('BCR_apiKey', {domain: 'localhost'});
              reject(err)
            })
        }
      })
    },
  [GRAB_LISTS]: ({ commit }) => {
    return new Promise((resolve, reject) => { 
      const apiKey = Vue.cookie.get('BCR_apiKey');
      const url = baseURL + '/BCR/Lists'

      axios({
        url: url,
        method: 'GET', params: { apiKey: apiKey }
      })
        .then(resp => {
          // commit(LOAD_LISTS, Array.from(resp.data.items))
          resolve()
        })
        .catch(err => {
          reject(err)
        })
    })
  },
    [ADJUST_GRID_SIZE]: ({ commit }, data) => {
      commit(SET_GRID_SIZE, data)
  },
  [SEARCH]: ({ commit }, data) => {
    commit(SET_SEARCH, data)
  },
  [CHANGE_TITLE]: ({ commit }, data) => {
    commit(SET_TITLE, data)
  },
  [CHANGE_PUBLISHER]: ({ commit }, data) => {
    commit(SET_PUBLISHER, data)
  },
  [CHANGE_PAGE_NBR]: ({ commit }, data) => {
    commit(SET_PAGE_NBR, data)
  },
}





  const mutations = {
    [LOADING_LIST]: (state) => {
      state.status = 'loading'
    },
    [LOAD_LIST]: (state, list) => {
      state.status = 'loaded'
      state.comicList = list
    },
    [LOAD_LISTS]: (state, lists) => {
      state.Lists = lists
    },
    [LOAD_SERIES_LIST]: (state, list) => {
      state.status = 'loaded'
      state.psList = list
    },
    [LOAD_ISSUE_LIST]: (state, list) => {
      state.status = 'loaded'
      state.issueList = list
    },
    [LOAD_ISSUE]: (state, issue) => {
      state.selectedIssue = issue
    },
    [LOAD_PAGES]: (state, ratio) => {
      state.status = 'loaded'
      state.comicPages = ratio
    },
    [SET_MANGA]: (state, manga) => {
      state.manga = manga
    },
    [SET_GRID_SIZE]: (state, size) => {
      state.gridSize = size
    },
    [SET_SEARCH]: (state, text) => {
      state.search = text
    },
    [SET_TITLE]: (state, text) => {
      state.appTitle = text
    },
    [SET_PUBLISHER]: (state, text) => {
      state.selectedPublisher = text
    },
    [SET_PAGE_NBR]: (state, data) => {
      state.pageNbr[data.list] = data.page
    },
  }
  export default {
    state,
    getters,
    actions,
    mutations,
  }