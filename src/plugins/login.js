
import VueCookie from 'vue-cookie'
import Vue from 'vue'
Vue.use(VueCookie);
var createCookie = Vue.cookie.set
var readCookie = Vue.cookie.get
var eraseCookie = Vue.cookie.delete
var baseURL = "http://home.ximcraft.com:8088"
var ApiToken = {
    apiURL: baseURL,
    authUrl: baseURL + '/auth',
    apiKeyKey: 'BCR_apiKey',
    usernameKey: 'BCR_username',
    Set: function (username, apiKey, rememberMe) {
        var me = this,
            days = rememberMe ? 10 : 0;
        me.apiKeyKey = apiKey;
        me.usernameKey = username;
        createCookie("BCR_apiKey", apiKey, { expires: days });
        createCookie("BCR_username", username, { expires: days });
    },
    Get: function () {
        var me = this;
        var key = readCookie("BCR_apiKey");
        var username = readCookie("BCR_username");
        me.apiKeyKey = key;
        me.usernameKey = username;
        var token = {
            Key: key,
            Username: username,
            IsValid: key != null
        };
        return token;
    },
    Delete: function () {
        eraseCookie("BCR_apiKey");
        eraseCookie("BCR_username");

    }


};

const state = {
    token: localStorage.getItem('user-token') || '',
    status: '',
  }

  const getters = {
    isAuthenticated: state => !!state.token,
    authStatus: state => state.status,
  }