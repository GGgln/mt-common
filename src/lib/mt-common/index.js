import mtLog from './mtLog/MtLog'
import mtAlarm from './mtAlarm/MtAlarm'
import mtConsumer from './mtConsumer/MtConsumer'
import mtLogin from './mtLogin/MtLogin'
import mtParam from './mtParam/MtParam'
import mtClass from './mtClass/MtClass'
import moduleComponents from './modules'

let { MtFilter, MtTableList, MtTableSection } = moduleComponents
const components = [
  MtFilter,
  MtTableList,
  MtTableSection,
  mtLog,
  mtAlarm,
  mtConsumer,
  mtParam,
<<<<<<< HEAD
  mtLogin

=======
  mtClass
  
>>>>>>> 8b0d576906d8a233108430a1f96cb2490864ee8f
]

export default {
  install (Vue, options) {
    components.forEach(component => {
      Vue.component(component.name, component)
    })
  }
}
