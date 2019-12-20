import MtPlcDebug from './MtPlcDebug'

const plc = {
  install (Vue, options) { Vue.component('mt-plc-debug', MtPlcDebug) }
}
export default plc
