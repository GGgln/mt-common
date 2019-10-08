// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import antDesign from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

import MtCommon from './lib/mt-common/index.js'
Vue.config.productionTip = false

console.log('mt-common-------', MtCommon)

Vue.use(antDesign)
Vue.use(MtCommon)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
