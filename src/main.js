// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import antDesign from 'ant-design-vue/lib/button'
import 'ant-design-vue/dist/antd.css'

import MtCommon from './lib/mt-common'
Vue.config.productionTip = false

Vue.use(antDesign)
Vue.use(MtCommon)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
