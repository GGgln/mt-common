import Vue from 'vue'
import Router from 'vue-router'
import alarm from '@/components/alarm'
import alarmConfig from '@/components/alarmConfig'
import alarm_dxa from '@/components/alarm_dxa'
import log from '@/components/log'
import consumer from '@/components/consumer'
import param from '@/components/param'
import login from '@/components/login'
import _class from '@/components/class'
import set from '@/components/set'
import role from '@/components/role'
import pclDebug from '@/components/plcDebug'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/pclDebug',
      name: 'pclDebug',
      component: pclDebug
    },
    {
      path: '/analyze',
      name: 'analyze',
      component: () => import('@/components/analyze')
    },
    {
      path: '/alarmConfig',
      name: 'alarmConfig',
      component: alarmConfig
    },
    {
      path: '/alarm',
      name: 'alarm',
      component: alarm
    },
    {
      path: '/alarm_dxa',
      name: 'alarm_dxa',
      component: alarm_dxa
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
