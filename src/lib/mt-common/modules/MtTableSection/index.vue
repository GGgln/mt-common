<template>
  <div>
    <!-- 查询输入表单区域 -->
    <mt-filter :form.sync="form" @request-form-list="requestFormList"></mt-filter>
    <!-- 数据列表区域 -->

  </div>
</template>
<script>
export default {
  name: 'mt-table-section', 
  props: ['form'],
  created() {
    if (this.form) {
      this.requestFormList()
    }
    console.log('this-----', this)
    console.log('this._events-----', this._events)
  },
  methods: {
    requestFormList() {}
  }
}
</script>