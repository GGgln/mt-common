<template>
  <div>
    <!-- 查询输入表单区域 -->
    <mt-filter :form.sync="form" @request-form-list="requestFormList"></mt-filter>
    <!-- 数据列表区域 -->
    <mt-table-list :form.sync="form" @request-form-list="requestFormList" @on-button-action="onButtonAction"></mt-table-list>

  </div>
</template>
<script>
import request from '../../utils/request'
export default {
  name: 'mt-table-section',
  props: ['form'],
  created () {
    if (this.form) {
      this.requestFormList()
    }
    console.log('this-----', this)
    console.log('this._events-----', this._events)
  },
  methods: {
    requestFormList () {
      let that = this
      request({
        url: that.form.listUrl,
        method: 'get'
      }).then(res => {
        // alert('success')
      }).catch(() => {
        // alert('error')
      })
    },
    onButtonAction () {}
  }
}
</script>
