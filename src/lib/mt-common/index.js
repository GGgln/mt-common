import mtLog from './mtLog/MtLog'
import mtSet from './mtPersonalSetting/PersonalSetting'
import mtRole from './mtRole/RoleManagement'
import mtAlarm from './mtAlarm/MtAlarm'
import mtAlarmConfig from './mtAlarm/MtAlarmConfig'
import mtConsumer from './mtConsumer/MtConsumer'
import mtLogin from './mtLogin/MtLogin'
import mtParam from './mtParam/MtParam'
import mtClass from './mtClass/MtClass'
import moduleComponents from './modules'
import mtPlcDebug from './mtPlcDebug/PlcDebug'
import mtMain from './mtMain/MtMain'


let { MtFilter, MtTableList, MtTableSection } = moduleComponents
const components = [
  MtFilter,
  MtTableList,
  MtTableSection,
  mtLog,
  mtAlarm,
  mtConsumer,
  mtParam,
  mtLogin,
  mtClass,
  mtSet,
  mtRole,
  mtAlarmConfig,
  mtPlcDebug,
  mtMain
]

export default {
  install (Vue, options) {
    components.forEach(component => {
      Vue.component(component.name, component)
    })
  }
}
