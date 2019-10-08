import Vue from 'vue'
import Router from 'vue-router'
import alarm from '@/components/alarm'
import log from '@/components/log'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/alarm',
      name: 'alarm',
      component: alarm
    },
    {
      path: '/log',
      name: 'log',
      component: log
    }
  ]
})
