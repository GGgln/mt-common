<template>
    <div class="alarm">
        <mt-alarm baseUrl="/port8766" :isShow="false"></mt-alarm>
        <!-- <a-from :form='form'></a-from> -->
    </div>
</template>
<script>
const columns = [
  {
    title: '报警级别',
    width: 120,
    align: 'center',
    dataIndex: 'alarmGradeId',
    scopedSlots: { customRender: 'alarmGradeId' },
    sorter: true
  },
  {
    title: '部件名称',
    dataIndex: 'partDesc',
    scopedSlots: { customRender: 'partDesc' }
  },
  {
    title: '报警名称',
    dataIndex: 'alarmDesc',
    scopedSlots: { customRender: 'alarmDesc' }
  },
  {
    title: '报警状态',
    dataIndex: 'alarmStatus',
    scopedSlots: { customRender: 'alarmStatus' }
  },
  {
    title: '报警时间',
    dataIndex: 'alarmBeginTime',
    scopedSlots: { customRender: 'alarmBeginTime' },
    sorter: true
  },
  {
    title: '报警详情',
    dataIndex: 'alarmDetails',
    scopedSlots: { customRender: 'alarmDetails' }
  },
  {
    title: '消警时间',
    dataIndex: 'alarmEndTime',
    scopedSlots: { customRender: 'alarmEndTime' },
    sorter: true
  },
  {
    title: '相关操作',
    dataIndex: 'operate',
    scopedSlots: { customRender: 'operate' }
  }
]
export default {
  data () {
    return {
      columns,
    }
  },
  mounted () {}
}
</script>
