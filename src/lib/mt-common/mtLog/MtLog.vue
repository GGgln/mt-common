<template>
  <div id="mtLog_component" class="container">
    <div class="log-contents">
      <div class="log-title">
    <a-row type="flex" justify="space-around" align="middle" :gutter="16">
      <a-col  :md="7">
        <a-row type="flex" justify="space-around" align="middle">
          <a-col :md="5">
        <span class="log-caption">操作类型:</span>
          </a-col>
          <a-col :md="9">
          <a-select style="width: 100%;" :value="logbefort" @change="selectChange">
            <a-select-option v-for="log in logMessages" :key="log">{{ log }}</a-select-option>
          </a-select>

          </a-col>
          <a-col :md="1">

          <span class="log-caption">--</span>
          </a-col>
          <a-col :md="9">

          <a-select style="width: 100%;"  v-model="secondCity">
            <a-select-option v-for="detail in details" :key="detail">{{ detail }}</a-select-option>
          </a-select>
          </a-col>
        </a-row>

          </a-col>
      <a-col :md="9">
      <a-row type="flex" justify="space-around" align="middle">
        <a-col :md="5">
        <span  class="log-caption">时间段查询:</span>
        </a-col>
        <a-col :md="19">
                <a-range-picker :showTime="{ format: 'HH:mm:ss' }"
          format="YYYY-MM-DD HH:mm:ss"   @change="timeChange" />
        </a-col>
      </a-row>

       </a-col>
      <a-col :md="4"><a-input  style="width: 100%;" v-model="iptContent" placeholder="搜索日志内容" /></a-col>
      <a-col  :md="4">
      <a-row>
        <a-col :md="11">
      <a-button @click="seeAbout" icon="search" class="add-btn" type="primary">查询日志</a-button>
        </a-col>
        <a-col :offset="2" :md="11">
      <a-button icon="plus"  class="add-btn" type="primary">导出日志</a-button>

        </a-col>
      </a-row>

        </a-col>
    </a-row>

        </div>
      <div class="log-table"><a-table :pagination="pageOptions" :columns="columns" :dataSource="data" ></a-table></div>
      </div>
    </div>
</template>
<script>
import request from '../utils/request'
const columns = [
  {
    title: '日志时间',
    align: 'center',
    dataIndex: 'date',
    width: '12%'
  },
  {
    title: '操作类型',
    align: 'center',
    dataIndex: 'operationType',
    width: '12%'
  },
  {
    title: '日志内容',
    align: 'center',
    dataIndex: 'logContent',
    width: '61%'
  },
  {
    title: '操作人',
    align: 'center',
    dataIndex: 'operationUser',
    width: '15%'
  }
]
export default {
  name: 'mt-log',
  data () {
    return {
      columns, // table表头
      data: [], // table数据
      logbefort: null, // 日志
      logMessages: [], // 日志数据
      detailsMessages: '', // 日志详情数据
      details: null, // 日志详情信息
      secondCity: null, // 日志详情默认第一条
      iptContent: null, // 搜索日志关键词
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
          this.page = current
          this.initData()
        },
        onChange: (page, pageSize) => {
          // 跳页
          this.page = page
          this.initData()
        }
      }
    }
  },
  created () {
    this.initSelect()
    this.initData()
  },

  methods: {
    initSelect () {
      request({
        url: 'api/dimType/getType',
        method: 'get'
      }).then(res => {
        this.logbefort = res.oneType[0]
        this.logMessages = res.oneType
        this.detailsMessages = res.twoType
        this.details = res.twoType[res.oneType[0]] // 日志详情信息
        this.secondCity = res.twoType[res.oneType[0]][0] // 日志详情默认第一条
      }).catch(() => {
        // alert('error')
      })
    },
    initData () {
      request({
        url: 'api/log/selectLog',
        method: 'post',
        data: {
          startTime: this.startTime,
          endTime: this.endTime,
          oneType: this.logbefort,
          twoType: this.secondCity,
          key: this.iptContent,
          page: this.page,
          limit: this.pageSize
        }

      }).then(res => {
        this.data = res.result.list
        this.pageOptions.total = res.result.size
      }).catch(() => {
        // alert('error')
      })
    },
    selectChange (value) {
      this.logbefort = value
      this.details = this.detailsMessages[value]
      this.secondCity = this.detailsMessages[value][0]
    },
    timeChange (date, dateString) {
      // 开始日期变化
      this.startTime = dateString[0]
      this.endTime = dateString[1]
    },
    // timeOk (value) {
    // },
    seeAbout () {
      this.initData()
    }
    // dataTime (timestamp) {
    //   var date = new Date(timestamp)// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
    //   var Y = date.getFullYear() + '-'
    //   var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    //   var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
    //   var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
    //   var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
    //   var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
    //   return Y + M + D + h + m + s
    // }

  }

}
</script>
<style lang="scss" scoped>
@import './style.scss';
</style>
