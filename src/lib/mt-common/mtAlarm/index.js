import MtAlarm from './MtAlarm'
import MtAlarmConfig from './MtAlarmConfig'

const alarm = {
  install (Vue, options) { 
    Vue.component('mt-alarm', MtAlarm);
    // Vue.component('mt-alarm-config', MtAlarmConfig) 
  }
}

export default alarm