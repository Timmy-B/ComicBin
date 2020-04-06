// eslint-disable-line no-unused-vars
import Vue from 'vue'
import VueCookie from 'vue-cookie'
import axios from 'axios';

Vue.use(VueCookie);
const baseURL = window.location.origin + "/tablet";
export const AUTH_LOGIN = 'AUTH_LOGIN'
export const AUTH_SUCCESS = 'AUTH_SUCCESS'
export const AUTH_ERROR = 'AUTH_ERROR'
export const AUTH_LOGOUT = 'AUTH_LOGOUT'
export const AUTH_CHECKCOOKIE = 'AUTH_CHECKCOOKIE'
export const SET_AUTH_LOGIN = 'SET_AUTH_LOGIN'
export const SET_AUTH_SUCCESS = 'SET_AUTH_SUCCESS'
export const SET_AUTH_ERROR = 'SET_AUTH_ERROR'
export const SET_AUTH_LOGOUT = 'SET_AUTH_LOGOUT'
const state = {
  apiKey: Vue.cookie.get('BCR_apiKey') || '',
  status: '',
}

const getters = {
  isAuthenticated: state => !!state.ApiKey,
  authStatus: state => state.status,
}

const actions = {
  [AUTH_LOGIN]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => { // The Promise used for router redirect in login
      commit(AUTH_LOGIN)
      Vue.cookie.delete('BCR_USERNAME', { domain: 'localhost' });
      Vue.cookie.delete('BCR_apiKey', { domain: 'localhost' });
      const url = baseURL + '/auth'

      axios({
        url: url, headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: serialize(data),
        method: 'POST'
      })
        .then(resp => {
          const days = data.rememberMe ? 10 : 0;
          const username = data.username;
          const ApiKey = resp.data.ApiKey;
          Vue.cookie.set('BCR_USERNAME', username, days);
          Vue.cookie.set('BCR_apiKey', ApiKey, days);
          commit(SET_AUTH_SUCCESS, ApiKey)
          // you have your token, now log in your user :)
          resolve()
        })
        .catch(err => {
          commit(SET_AUTH_LOGOUT)
          Vue.cookie.delete('BCR_USERNAME', { domain: 'localhost' });
          Vue.cookie.delete('BCR_apiKey', { domain: 'localhost' });
          reject(err)
        })
    })
  },
  [AUTH_LOGOUT]: ({ commit, dispatch }) => {
    return new Promise((resolve, reject) => {
      commit(SET_AUTH_LOGOUT)
      Vue.cookie.delete('BCR_USERNAME', { domain: 'localhost' });
      Vue.cookie.delete('BCR_apiKey', { domain: 'localhost' });
      resolve()
    })
  },
  [AUTH_CHECKCOOKIE]: ({ commit, dispatch }) => {
    const username = Vue.cookie.get('BCR_USERNAME')
    const ApiKey = Vue.cookie.get('BCR_apiKey')
    return new Promise((resolve, reject) => {
      commit(SET_AUTH_LOGIN)
      axios({
        url: baseURL + '/BCR/',
        method: 'GET', params: {
          apiKey: ApiKey
        }
      })
        .then(resp => {
          resolve()
          commit(SET_AUTH_SUCCESS, ApiKey, username)
        })
        .catch(err => {
          commit(SET_AUTH_LOGOUT)
          Vue.cookie.delete('BCR_USERNAME', { domain: 'localhost' })
          Vue.cookie.delete('BCR_apiKey', { domain: 'localhost' })
          reject(err)
        })
    })
  }
}
const mutations = {
  [SET_AUTH_LOGIN]: (state) => {
    state.status = 'loading'
  },
  [SET_AUTH_SUCCESS]: (state, ApiKey, username) => {
    state.status = 'loggedin'
    state.apiKey = ApiKey
    state.username = username
  },
  [SET_AUTH_ERROR]: (state) => {
    state.status = 'error'
  },
  [SET_AUTH_LOGOUT]: (state) => {
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