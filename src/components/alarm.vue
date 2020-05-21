<template>
    <div class="alarm">
        <mt-alarm :defineTableCell="defineTableCell" :tableColumns="columns" baseUrl="http://192.168.6.254:15565" @showVideoDialog="show">
          <template slot="mtTableListButtonsAfter" slot-scope="data">
              <span @click="showNewData(data)">自定义</span>
          </template>
          <template slot="alarmStatus" slot-scope="data">
              <span >报警状态</span>
          </template>
          <template slot="operate">
            <span>123</span>
          </template>
        </mt-alarm>
        <!-- <a-from :form='form'></a-from> -->
    </div>
</template>
<script>
const requestUrls_default = {
  getAlarmLevel: '/Service/API/V1/CPH/alarm/dictionary',
  getAlarmList: '/Service/API/V1/CPH/alarm/getAlarmInfo',
  setAlarm: '/Service/API/V1/CPH/alarm/resetAlarm'
}
// const columns = [
//   {
//     title: '报警级别',
//     width: 120,
//     align: 'center',
//     dataIndex: 'alarmGradeId',
//     scopedSlots: { customRender: 'alarmGradeId' },
//     sorter: true
//   },
//   {
//     title: '部件名称',
//     dataIndex: 'partDesc',
//     scopedSlots: { customRender: 'partDesc' }
//   },
//   {
//     title: '报警名称',
//     dataIndex: 'alarmDesc',
//     scopedSlots: { customRender: 'alarmDesc' }
//   },
//   {
//     title: '报警状态',
//     dataIndex: 'alarmStatus',
//     scopedSlots: { customRender: 'alarmStatus' }
//   },
//   {
//     title: '报警时间',
//     dataIndex: 'alarmBeginTime',
//     scopedSlots: { customRender: 'alarmBeginTime' },
//     sorter: true
//   },
//   {
//     title: '报警详情',
//     dataIndex: 'alarmDetails',
//     scopedSlots: { customRender: 'alarmDetails' }
//   },
//   {
//     title: '消警时间',
//     dataIndex: 'alarmEndTime',
//     scopedSlots: { customRender: 'alarmEndTime' },
//     sorter: true
//   },
//   {
//     title: '相关操作',
//     dataIndex: 'operate',
//     scopedSlots: { customRender: 'operate' }
//   }
// ]
export default {
  data () {
    return {
      columns,
      requestUrls_default,
      defineTableCell: {
        key: 'alarmStatus'
      }
    }
  },
  mounted () {},
  methods:{
    show(data){
      console.log('data alarm-------', data)
    },
    showNewData(data) {
      console.log('data----', data)
    }
  }
}
</script>
