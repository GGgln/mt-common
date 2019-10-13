import Vue from 'vue'
import Router from 'vue-router'
import alarm from '@/components/alarm'
import log from '@/components/log'
import consumer from '@/components/consumer'
import param from '@/components/param'
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
    },
    {
      path: '/consumer',
      name: 'consumer',
      component: consumer
    },
    {
      path: '/param',
      name: 'param',
      component: param
    }
  ]
})
