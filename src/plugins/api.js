import Vue from 'vue'
import VueCookie from 'vue-cookie'
import axios from 'axios';
import _ from 'lodash';

Vue.use(VueCookie);
const baseURL = window.location.origin + "/tablet";
export const GRAB_SERIES = 'GRAB_SERIES'
export const GRAB_SERIES_ISSUES = 'GRAB_SERIES_ISSUES'
export const GRAB_PUBLISHERS = 'GRAB_PUBLISHERS'
export const GRAB_PUBLISHERS_SERIES = 'GRAB_PUBLISHERS_SERIES'
export const GRAB_ISSUE = 'GRAB_ISSUE'
export const GRAB_ISSUE_PAGES = 'GRAB_ISSUE_PAGES'
export const GRAB_LISTS = 'GRAB_LISTS'
export const GRAB_AGE_RATINGS = 'GRAB_AGE_RATINGS'
export const GRAB_AGE_RATING_SERIES = 'GRAB_AGE_RATING_SERIES'
export const GRAB_RECENT = 'GRAB_RECENT'
export const GRAB_READ = 'GRAB_READ'
export const GRAB_TOTALS = 'GRAB_TOTALS'
export const LOADING_LIST = 'LOADING_LIST'
export const LOAD_LIST = 'LOAD_LIST'
export const LOAD_LISTS = 'LOAD_LISTS'
export const LOAD_SERIES_LIST = 'LOAD_SERIES_LIST'
export const LOAD_ISSUE_LIST = 'LOAD_ISSUE_LIST'
export const LOAD_ISSUE = 'LOAD_ISSUE'
export const LOAD_PAGES = 'LOAD_PAGES'
export const LOAD_TOTALS = 'LOAD_TOTALS'
export const LOAD_READ = 'LOAD_READ'
export const LOAD_RECENT = 'LOAD_RECENT'

export const SET_MANGA = 'SET_MANGA'
export const ADJUST_GRID_SIZE = 'ADJUST_GRID_SIZE'
export const SET_GRID_SIZE = 'SET_GRID_SIZE'
export const SEARCH = 'SEARCH'
export const SET_SEARCH = 'SET_SEARCH'
export const SET_TITLE = 'SET_TITLE'
export const SET_SERIES = 'SET_SERIES'
export const SET_RATING = 'SET_RATING'
export const UPDATE_CURRENT_PAGE = 'UPDATE_CURRENT_PAGE'
export const CHANGE_SERIES = 'CHANGE_SERIES'
export const CHANGE_TITLE = 'CHANGE_TITLE'
export const CHANGE_PUBLISHER = 'CHANGE_PUBLISHER'
export const CHANGE_RATING = 'CHANGE_RATING'
export const SET_PUBLISHER = 'SET_PUBLISHER'
export const CHANGE_PAGE_NBR = 'CHANGE_PAGE_NBR'
export const SET_PAGE_NBR = 'SET_PAGE_NBR'

const state = {
    comicList: {},
    status: '',
    Lists: {},
    issueList: {},
    itemList: [],
    selectedIssue: {},
    selectedSeries: {},
    recent:{},
    read:{},
    selectedRating:"",
    selectedPublisher: "",
    comicPages: {},
    manga: false,
    baseURL: baseURL,
    gridSize: 80,
    search: '',
    psList: [],
    appTitle: "Comic Browser",
    pageNbr: [],
    totals: {
        "issues": 0,
        "series": 0,
        "publishers": 0
    },
    racks: {},
    rackStats: {},
    selectedRack: '',
    selectedItem: '',
    publishers: {},
    series: {},
    items: {}
}
const getters = {
    hasList: state => !!state.comicList,
    comicListStatus: state => state.status,
    ageRating: state => state.selectedRating,
}

const actions = {
    [GRAB_SERIES]: ({ commit }) => {
        return new Promise((resolve, reject) => {
            commit(LOADING_LIST)
            const apiKey = Vue.cookie.get('BCR_apiKey');
            const url = baseURL + '/BCR/Series/?$orderby=Title'

            axios({
                url: url,
                method: 'GET', params: { apiKey: apiKey }
            })
                .then(resp => {
                    commit(LOAD_LIST, resp.data.items)
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
    [GRAB_PUBLISHERS]: ({ commit }, callback) => {
        return new Promise((resolve, reject) => {
            commit(LOADING_LIST)
            const apiKey = Vue.cookie.get('BCR_apiKey');
            const url = baseURL + '/BCR/Publishers'

            axios({
                url: url,
                method: 'GET', params: { apiKey: apiKey }
            })
                .then(resp => {
                    callback && callback(Array.from(resp.data.items))
                    resolve()
                })
                .catch(err => {
                    callback && callback({})
                    //   commit(AUTH_ERROR, err)
                    // Vue.cookie.delete('BCR_USERNAME', {domain: 'localhost'});
                    // Vue.cookie.delete('BCR_apiKey', {domain: 'localhost'});
                    reject(err)
                })
        })
    },
    [GRAB_PUBLISHERS_SERIES]: ({ commit }, data) => {
        return new Promise((resolve, reject) => {
            commit(LOADING_LIST)
            const apiKey = Vue.cookie.get('BCR_apiKey');
            var url = baseURL + '/BCR/Publishers/'
            if(data != undefined){
                
            
            var imprint = decodeURI(data.imprint);
            var pub = decodeURI(data.publisher);
            console.log(imprint, pub)
            if (imprint == null || imprint == '' || imprint == "%00") { imprint = "%2500" } //send blank imprint over url
            if (pub == null || pub == '' || pub == "%00") { pub = "%2500" }
                url = baseURL + '/BCR/Publishers/' + pub + '/Imprint/' + imprint + '/';
            }

            axios({
                url: url,
                method: 'GET', params: { apiKey: apiKey }
            })
                .then(resp => {
                    // var arry = _.sortBy(resp.data.items, ['Title', 'Volume'])

                    // callback && callback(Array.from(resp.data.items))
                    commit(LOAD_SERIES_LIST, resp.data.items)
                    resolve()
                })
                .catch(err => {
                    callback && callback({})
                    //   commit(AUTH_ERROR, err)
                    // Vue.cookie.delete('BCR_USERNAME', {domain: 'localhost'});
                    // Vue.cookie.delete('BCR_apiKey', {domain: 'localhost'});
                    reject(err)
                })
        })
    },
    [GRAB_SERIES_ISSUES]: ({ commit }, data) => {
        return new Promise((resolve, reject) => {
            commit(LOADING_LIST)
            const seriesID = data
            const apiKey = Vue.cookie.get('BCR_apiKey');
            const url = baseURL + '/BCR/Series/' + seriesID + '/?$orderby=Caption'

            axios({
                url: url,
                method: 'GET', params: { apiKey: apiKey }
            })
                .then(resp => {
                    commit(LOAD_ISSUE_LIST, resp.data.items)
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
    [GRAB_ISSUE]: ({ commit }, data) => {
        return new Promise((resolve, reject) => {
            const issueID = data
            const apiKey = Vue.cookie.get('BCR_apiKey');
            const url = baseURL + '/BCR/Comics/' + issueID

            axios({
                url: url,
                method: 'GET', params: { apiKey: apiKey }
            })
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
    [GRAB_ISSUE_PAGES]: ({ commit }, data) => {
        return new Promise((resolve, reject) => {
            const PageCount = data.PageCount;
            const issueID = data.issueID;
            const apiKey = Vue.cookie.get('BCR_apiKey');
            var i = 0;
            var ratio = [];
            for (i = 0; i < PageCount; i++) {
                const url = baseURL + '/BCR/Comics/' + issueID + '/Pages/' + i + '/size';
                const srcUrl = baseURL + '/BCR/Comics/' + issueID + '/Pages/' + i;
                const x = i
                axios({
                    url: url,
                    method: 'GET', params: { apiKey: apiKey }
                })
                    .then(resp => {
                        const json = resp.data
                        ratio[x] = { src: srcUrl, size: Math.round(json.width / json.height) };

                        if (i == PageCount) {

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
    [GRAB_AGE_RATINGS]: ({ commit }, callback) => {
        return new Promise((resolve, reject) => {
            const apiKey = Vue.cookie.get('BCR_apiKey');
            const url = baseURL + '/BCR/Ratings/'

            axios({
                url: url,
                method: 'GET', params: { apiKey: apiKey }
            })
                .then(resp => {
                    callback && callback(Array.from(resp.data.items))
                    resolve()
                })
                .catch(err => {
                    callback && callback({})
                    reject(err)
                })
        })
    },
    [GRAB_AGE_RATING_SERIES]: ({ commit }, data) => {
        return new Promise((resolve, reject) => {
            commit(LOADING_LIST)
            var rating = data.replace('+', '~');
            const apiKey = Vue.cookie.get('BCR_apiKey');
            const url = baseURL + '/BCR/Rating/' + rating + '/';
            console.log(url)
            axios({
                url: url,
                method: 'GET',
                params: { apiKey: apiKey }
            })
                .then(resp => {
                    var arry = resp.data.items
                    // var arry = _.sortBy(resp.data.items, ['Title', 'Volume'])
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
    [GRAB_RECENT]: ({ commit }) => {
        return new Promise((resolve, reject) => {
            const apiKey = Vue.cookie.get('BCR_apiKey');
            // const days = 0;
            const url = baseURL + '/BCR/Series/Recent/1/';
            axios({
                url: url,
                method: 'GET', params: { apiKey: apiKey }
            })
                .then(resp => {
                    var arry = _.sortBy(resp.data.items, ['Series', 'Number', 'Volume',]);
                    commit(LOAD_RECENT, arry)
                    resolve()
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    [GRAB_READ]: ({ commit }) => {
        return new Promise((resolve, reject) => {
            const apiKey = Vue.cookie.get('BCR_apiKey');
            // const days = 0;
            const url = baseURL + '/BCR/Series/RecentlyRead/1/';
            axios({
                url: url,
                method: 'GET', params: { apiKey: apiKey }
            })
                .then(resp => {
                    var arry = _.sortBy(resp.data.items, ['Series', 'Number', 'Volume',]);
                    console.log(arry)
                    commit(LOAD_READ, arry)
                    resolve()
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    [GRAB_TOTALS]: ({ commit }) => {
        return new Promise((resolve, reject) => {
            const apiKey = Vue.cookie.get('BCR_apiKey');
            // const days = 0;
            const url = baseURL + '/BCR/Totals/';
            axios({
                url: url,
                method: 'GET', params: { apiKey: apiKey }
            })
                .then(resp => {
                    commit(LOAD_TOTALS, resp.data)
                    resolve()
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    [CHANGE_SERIES]: ({ commit }, data) => {
        commit(SET_SERIES, data)
    },
    [CHANGE_PUBLISHER]: ({ commit }, data) => {
        commit(SET_PUBLISHER, data)
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
    [CHANGE_RATING]: ({ commit }, data) => {
        commit(SET_RATING, data)
    },
    [CHANGE_PAGE_NBR]: ({ commit }, data) => {
        commit(SET_PAGE_NBR, data)
    },
    [UPDATE_CURRENT_PAGE]: ({ }, data) => {
        return new Promise((resolve, reject) => {
            const id = data.id;
            const apiKey = Vue.cookie.get('BCR_apiKey');
            const url = baseURL + '/BCR/Comics/' + id + '/Progress';
            var bodyFormData = new FormData();
            bodyFormData.set('id', id);
            bodyFormData.set('CurrentPage', data.currentPage);
            axios({
                url: url,
                method: 'POST',
                params: { apiKey: apiKey },
                data: bodyFormData,
                config: { headers: { 'Content-Type': 'multipart/form-data' } }
            })
                .then(resp => {
                    console.log(resp)
                    resolve()
                })
                .catch(err => {
                    //   commit(AUTH_ERROR, err)
                    // Vue.cookie.delete('BCR_USERNAME', {domain: 'localhost'});
                    // Vue.cookie.delete('BCR_apiKey', {domain: 'localhost'});
                    reject(err)
                })
        })
    }
}




const mutations = {
    [LOADING_LIST]: (state) => {
        state.status = 'loading'
    },
    [LOAD_LIST]: (state, list) => {
        state.status = 'loaded'
        state.itemList = list
    },
    [LOAD_LISTS]: (state, lists) => {
        state.Lists = lists
    },
    [LOAD_SERIES_LIST]: (state, list) => {
        state.status = 'loaded'
        state.itemList = list
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
    [LOAD_TOTALS]: (state, totals) => {
        state.totals = totals
    },
    [LOAD_RECENT]: (state, lists) => {
        state.recent = lists
    },
    [LOAD_READ]: (state, lists) => {
        state.read = lists
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
    [SET_SERIES]: (state, data) => {
        state.selectedSeries = data
    },
    [SET_TITLE]: (state, text) => {
        state.appTitle = text
    },
    [SET_PUBLISHER]: (state, text) => {
        state.selectedPublisher = text
    },
    [SET_RATING]: (state, text) => {
        state.selectedRating = text
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