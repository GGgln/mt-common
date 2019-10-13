import mtLog from './mtLog/MtLog'
import mtAlarm from './mtAlarm/MtAlarm'
import mtConsumer from './mtConsumer/MtConsumer'
import mtParam from './mtParam/MtParam'
import moduleComponents from './modules'

let { MtFilter, MtTableList, MtTableSection } = moduleComponents
const components = [
  MtFilter,
  MtTableList,
  MtTableSection,
  mtLog,
  mtAlarm,
  mtConsumer,
  mtParam
  
]

export default {
  install (Vue, options) {
    components.forEach(component => {
      Vue.component(component.name, component)
    })
  }
}
