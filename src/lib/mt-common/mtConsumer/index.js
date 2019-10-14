import MtConsumer from './MtConsumer'

const consumer = {
  install (Vue, options) { Vue.component('mt-consumer-page', MtConsumer) }
}
export default consumer
