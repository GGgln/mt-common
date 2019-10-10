<template>
    <div id="MtAlarm_component" class="common-container">
      <mt-filter :form.sync="filterForm" @request-form-list="requestFormList"></mt-filter>
    </div>
</template>
<script>
export default {
  name: 'mt-alarm',
  data () {
    return {
      filterForm: {

      },
      form: {
        listUrl: 'system/getLastCheckTime',
        columns: [
          {
            title: '报警名称',
            dataIndex: 'alarmName'
          },
          {
            title: '报警等级',
            dataIndex: 'alarmLevel',
            scopedSlots: { customRender: 'alarmLevel' }

          },
          {
            title: '操作',
            dataIndex: 'operation',
            scopedSlots: { customRender: 'operation' }
          }
        ],
        formFilterData: [
          { name: '报警类型', value: 'alarmType', type: 'default' }
        ]
      }
    }
  },
  mounted () {
    console.log(this)
  },
  methods: {
    requestFormList () {}
  }
}
</script>
