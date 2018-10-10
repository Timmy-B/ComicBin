 // eslint-disable-line no-unused-vars
import Vue from 'vue'
import VueCookie from 'vue-cookie'
import axios from 'axios';

Vue.use(VueCookie);
const baseURL = "http://home.ximcraft.com:8081/tablet";
export const AUTH_LOGIN = 'AUTH_REQUEST'
export const AUTH_SUCCESS = 'AUTH_SUCCESS'
export const AUTH_ERROR = 'AUTH_ERROR'
export const AUTH_LOGOUT = 'AUTH_LOGOUT'
export const AUTH_CHECKCOOKIE = 'AUTH_CHECKCOOKIE'
const state = {
    apiKey: Vue.cookie.get('BCR_apiKey') || '',
    status: '',
  }

const getters = {
    isAuthenticated: state => !!state.ApiKey,
    authStatus: state => state.status,
  }

const actions = {
    [AUTH_LOGIN]: ({commit, dispatch}, data) => {
      return new Promise((resolve, reject) => { // The Promise used for router redirect in login
        commit(AUTH_LOGIN)
        Vue.cookie.delete('BCR_USERNAME', {domain: 'localhost'});
        Vue.cookie.delete('BCR_apiKey', {domain: 'localhost'});
        const url = baseURL+'/auth'

        axios({url: url, headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: serialize(data), 
        method: 'POST' })
          .then(resp => {
            const days = data.rememberMe ? 10 : 0;
            const username = data.username;
            const ApiKey = resp.data.ApiKey;
            Vue.cookie.set('BCR_USERNAME', username, days);
            Vue.cookie.set('BCR_apiKey', ApiKey, days);
            commit(AUTH_SUCCESS, ApiKey)
            // you have your token, now log in your user :)
            resolve()
          })
        .catch(err => {
          commit(AUTH_ERROR, err)
          Vue.cookie.delete('BCR_USERNAME', {domain: 'localhost'});
          Vue.cookie.delete('BCR_apiKey', {domain: 'localhost'});
          reject(err)
        })
      })
    },
    [AUTH_LOGOUT]: ({commit, dispatch}) => {
        return new Promise((resolve, reject) => {
          commit(AUTH_LOGOUT)
          Vue.cookie.delete('BCR_USERNAME', {domain: 'localhost'});
          Vue.cookie.delete('BCR_apiKey', {domain: 'localhost'});
          resolve()
        })
      },
      [AUTH_CHECKCOOKIE]: ({commit, dispatch}) => {
        const username =  Vue.cookie.get('BCR_USERNAME')
        const ApiKey = Vue.cookie.get('BCR_apiKey')
        return new Promise((resolve, reject) => {
          commit(AUTH_LOGIN)
          axios({url: baseURL+'/BCR/',
          method: 'GET',params:{
            apiKey: '8e3986a9-4ecc-489c-b9f7-873f396d842a'
          }})
          .then(resp => {
            resolve()
            commit(AUTH_SUCCESS, ApiKey, username)
          })        
          .catch(err => {
            commit(AUTH_ERROR, err)
            Vue.cookie.delete('BCR_USERNAME', {domain: 'localhost'})
            Vue.cookie.delete('BCR_apiKey', {domain: 'localhost'})
            reject(err)
          })
        })
  }
}
  const mutations = {
    [AUTH_LOGIN]: (state) => {
      state.status = 'loading'
    },
    [AUTH_SUCCESS]: (state, ApiKey, username) => {
      state.status = 'success'
      state.apiKey = ApiKey
      state.username = username
    },
    [AUTH_ERROR]: (state) => {
      state.status = 'error'
    },
    [AUTH_LOGOUT]: (state) => {
     state.status = 'loggedout'
     state.apiKey = ''
     state.username = ''
    }
  }
  const serialize = obj => {
    let str = [];
    for (let p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  };
  export default {
    state,
    getters,
    actions,
    mutations,
  }