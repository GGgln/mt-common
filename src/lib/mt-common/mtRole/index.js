import RoleManagement from './RoleManagement'

const role = {
  install (Vue, options) { Vue.component('mt-role', RoleManagement) }
}
export default role
