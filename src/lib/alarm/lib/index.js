import MtAlarm from './MtAlarm'

console.log('alarm---', MtAlarm)
const alarm = {
  install (Vue, options) { Vue.component('mt-alarm', MtAlarm) }
}
export default alarm
