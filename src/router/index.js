import Vue from 'vue'
import Router from 'vue-router'
import alarm from '@/components/alarm'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'alarm',
      component: alarm
    }
  ]
})
