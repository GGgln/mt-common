import MtMain from './MtMain'

const main = {
  install (Vue, options) { 
    Vue.component('mt-main', MtMain);
    // Vue.component('mt-alarm-config', MtAlarmConfig) 
  }
}

export default main