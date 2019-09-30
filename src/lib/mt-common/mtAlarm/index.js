import MtAlarm from './MtAlarm'

const alarm = {
  install (Vue, options) { Vue.component('mt-alarm', MtAlarm) }
}
export default alarm

console.log('alarm indexj ----', alarm)