<template>
  <div id="mtLog_component" class="container">
    <div class="log-contents">
      <div class="log-title">
        <div class="log-title-module log-button">
          <a-button  class="add-btn add-btn-derive" type="primary">导出</a-button>
          <a-button  class="add-btn" type="primary">查询</a-button>
        </div>
        <div class="log-title-module log-input">
          <a-input v-model="iptContent" placeholder="搜索日志内容" />
          </div>
        <div class="log-title-module log-picker">
          <span class="log-caption">时间段查询:</span>
          <a-date-picker style="width: 36.5%" placeholder="年/月/日" @change="startTimeChange" />
          <span class="log-caption">~</span>
          <a-date-picker style="width: 36.5%" placeholder="年/月/日" @change="endTimeChange" />
        </div>
        <div class="log-title-module log-select">
          <span class="log-caption">操作类型:</span>
          <a-select v-model="logSelect" style="width: 36%"><a-select-option align="center" value="all">系统日志</a-select-option></a-select>
          <span class="log-caption">--</span>
          <a-select v-model="particularSelect" style="width: 36%"><a-select-option align="center" value="all">全选</a-select-option></a-select>
        </div>
      </div>
      <div class="log-table">

      <a-table @change="TableChange" :pagination="false" :columns="columns" :dataSource="data" bordered></a-table>
      </div>
    </div>
  </div>
</template>
<script>
const columns = [
  {
    title: '日志时间',
    align: 'center',
    dataIndex: 'time',
    width: '12%'
  },
  {
    title: '操作类型',
    align: 'center',
    // className: 'column-money',
    dataIndex: 'type',
    width: '12%'
  },
  {
    title: '日志内容',
    align: 'center',
    dataIndex: 'content',
    width: '61%'
  },
  {
    title: '操作人',
    align: 'center',
    dataIndex: 'operator',
    width: '15%'
  }
]

const data = [
  {
    key: '1',
    time: '11.11',
    type: '￥300,000.00',
    content: 'New York No. 1 Lake Park',
    operator: 123
  },
  {
    key: '2',
    time: '22.22',
    type: '￥1,256,000.00',
    content: 'London No. 1 Lake Park',
    operator: 123
  },
  {
    key: '3',
    time: '33.33',
    type: '￥120,000.00',
    content: 'Sidney No. 1 Lake Park',
    operator: 123
  },
  {
    key: '4',
    time: '44.44',
    type: '￥120,000.00',
    content: 'Sidney No. 1 Lake Park',
    operator: 123
  }
]
export default {
  name: 'mt-log',
  data () {
    return {
      data,
      columns,
      iptContent: null, // 搜索日志内容
      logSelect: null, // 日志状态
      particularSelect: null, // 详细日志状态
      startTime: null, // 开始日期
      endTime: null, // 结束日期
      pageSize: 1,
      current: 1,
      pagination: {
        total: 0,
        // hideOnSinglePage:true,//只有一页时是否隐藏分页器
        defaultCurrent: 1,
        pageSize: 1,
        // showTotal: total => `共 ${total} 条数据`,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['1', '2', '3'],
        onShowSizeChange: (current, pageSize) => (this.pageSize = pageSize)
      }
    }
  },
  // created() {
  //   this.logSelect;
  //   this.particularSelect;
  // },

  methods: {
    startTimeChange (date, dateString) {
      // 开始日期变化
      this.startTime = dateString
      console.log(this.startTime)
    },
    endTimeChange (date, dateString) {
      // 结束日期变化
      this.endTime = dateString
      console.log(this.endTime)
    },
    TableChange () {
      alert(this.pageSize)
    }
  }
}
</script>
<style lang="scss" scoped>
@import './style.scss';
</style>
