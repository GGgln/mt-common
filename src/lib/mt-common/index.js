import mtLog from './mtLog/MtLog'
import mtAlarm from './mtAlarm/MtAlarm'

const components = [
  mtLog,
  mtAlarm
]

export default {
  install (Vue, options) {
    components.forEach(component => {
      Vue.component(component.name, component)
    })
  }
}
