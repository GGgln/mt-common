import Vue from 'vue'
import Router from 'vue-router'
import alarm from '@/components/alarm'
import log from '@/components/log'
import consumer from '@/components/consumer'
import param from '@/components/param'
// <<<<<<< HEAD
import login from '@/components/login'
// =======
import _class from '@/components/class'
import set from '@/components/set'
import role from '@/components/role'
// >>>>>>> 8b0d576906d8a233108430a1f96cb2490864ee8f
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
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/class',
      name: 'class',
      component: _class
    },
    {
      path: '/set',
      name: 'set',
      component: set
    },
    {
      path: '/role',
      name: 'role',
      component: role
    }
  ]
})
