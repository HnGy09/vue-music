import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import 'common/stylus/index.styl'
import fastclick from 'fastclick'
// import VueLazyLoad from 'vue-lazyload'

Vue.config.productionTip = false

/* eslint-disable no-new */

fastclick.attach(document.body)

// Vue.use(VueLazyLoad,{
//   loading: require('common/image/default.png')
// })

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
