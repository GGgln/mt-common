<template>
  <div id="mtLog_component" class="container">
    <div class="log-contents">
      <div class="log-title">
    <a-row>
      <a-col :offset="3" :xs="5"><span class="log-caption">操作类型:</span>
          <a-select  :defaultValue="logMessages[0]" @change="selectChange">
            <a-select-option v-for="log in logMessages" :key="log">{{ log }}</a-select-option>
          </a-select>
          <span class="log-caption">--</span>
          <a-select  v-model="secondCity">
            <a-select-option v-for="detail in details" :key="detail">{{ detail }}</a-select-option>
          </a-select></a-col>
      <a-col :xs="8">   <span class="log-caption">时间段查询:</span>
            <a-date-picker  placeholder="年/月/日" @change="startTimeChange" />
            <span class="log-caption">~</span>
            <a-date-picker  placeholder="年/月/日" @change="endTimeChange" /></a-col>
      <a-col :xs="5"><a-input  v-model="iptContent" placeholder="搜索日志内容" /></a-col>
      <a-col :xs="3"> <a-button  class="add-btn add-btn-derive" type="primary">导出</a-button>
            <a-button @click="seeAbout" class="add-btn" type="primary">查询</a-button></a-col>
    </a-row>

        </div>
      </div>
      <div class="log-table"><a-table :pagination="pageOptions" :columns="columns" :dataSource="data" bordered></a-table></div>
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
  },
  {
    key: '5',
    time: '22.22',
    type: '￥1,256,000.00',
    content: 'London No. 1 Lake Park',
    operator: 123
  },
  {
    key: '6',
    time: '33.33',
    type: '￥120,000.00',
    content: 'Sidney No. 1 Lake Park',
    operator: 123
  },
  {
    key: '7',
    time: '44.44',
    type: '￥120,000.00',
    content: 'Sidney No. 1 Lake Park',
    operator: 123
  },
  {
    key: '8',
    time: '22.22',
    type: '￥1,256,000.00',
    content: 'London No. 1 Lake Park',
    operator: 123
  },
  {
    key: '9',
    time: '33.33',
    type: '￥120,000.00',
    content: 'Sidney No. 1 Lake Park',
    operator: 123
  },
  {
    key: '10',
    time: '44.44',
    type: '￥120,000.00',
    content: 'Sidney No. 1 Lake Park',
    operator: 123
  }
]
const logMessages = ['Zhejiang', 'Jiangsu']
const detailsMessages = {
  Zhejiang: ['Hangzhou', 'Ningbo', 'Wenzhou'],
  Jiangsu: ['Nanjing', 'Suzhou', 'Zhenjiang']
}
export default {
  name: 'mt-log',
  data () {
    return {
      data, // table数据
      columns, // table表头
      logMessages, // 日志数据
      detailsMessages, // 日志详情数据
      logData: logMessages[0], // 日志
      details: detailsMessages[logMessages[0]], // 日志详情信息
      secondCity: detailsMessages[logMessages[0]][0], // 日志详情默认第一条
      iptContent: null, // 搜索日志内容
      startTime: null, // 开始日期
      endTime: null, // 结束日期
      pageSize: 10, // 条数
      page: 1, // 当前页
      pageOptions: {
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '15', '20'],
        total: 0,
        onShowSizeChange: (current, size) => {
          this.pageSize = size
          this.page = 1
          this.init()
        },
        onChange: (page, pageSize) => {
          // 跳页
          this.page = page
          this.init()
        }
      }
    }
  },
  created () {
    console.log(this.logMessages)
    console.log(this.detailsMessages)
  },

  methods: {
    init () {
    },
    selectChange (value) {
      console.log(value)
      this.logData = value
      this.details = detailsMessages[value]
      this.secondCity = detailsMessages[value][0]
    },
    startTimeChange (date, dateString) {
      // 开始日期变化
      this.startTime = dateString
    },
    endTimeChange (date, dateString) {
      // 结束日期变化
      this.endTime = dateString
    },
    seeAbout () {
      // console.log('日志--'+this.logData+'详情--'+this.secondCity+'开始时间--'+this.startTime+'结束时间--'+this.endTime+'输入框'+this.iptContent)
    }
  }
}
</script>
<style lang="scss" scoped>
@import './style.scss';
</style>
