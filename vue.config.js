module.exports = {
  "runtimeCompiler": true,
  "publicPath": "./",
  devServer: {
    proxy: 'http://192.168.10.176:8080/',
  },
  "transpileDependencies": [
    "vuetify"
  ],

  lintOnSave: false
}