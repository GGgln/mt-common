<template>
  <div id="mtLog_component" class="container">
    <a-form class="filter_box" :form="formData" layout="inline">
      <a-form-item label="操作类型：">
        <a-select :value="logbefort" @change="selectChange">
          <a-select-option v-for="log in logMessages" :key="log">{{ log }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>--</a-form-item>
      <a-form-item>
        <a-select v-model="secondCity">
          <a-select-option v-for="detail in details" :key="detail">{{ detail }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="时间段查询：">
        <a-range-picker
          style="text-align:left"
          :showTime="{ format: 'HH:mm:ss' }"
          format="YYYY-MM-DD HH:mm:ss"
          @change="timeChange"
        />
      </a-form-item>
      <a-form-item>
        <a-input v-model="iptContent" placeholder="请输入日志关键内容" />
      </a-form-item>
      <a-form-item>
        <a-button @click="seeAbout" type="primary" >查询</a-button>
      </a-form-item>
    </a-form>

    <a-table id="table_blue" :pagination="pageOptions" :columns="columns" :dataSource="data" :size='size'></a-table>
  </div>
</template>
<script>
import request from '../utils/request'
const columns = [
  {
    title: '日志时间',
    dataIndex: 'date',
    width: '25%'
  },
  {
    title: '操作类型',
    dataIndex: 'operationType',
    width: '15%'
  },
  {
    title: '日志类别',
    dataIndex: 'subType',
    width: '15%'
  },
  {
    title: '日志内容',
    dataIndex: 'logContent',
    width: '30%'

  },
  {
    title: '操作人',
    dataIndex: 'operationUser',
    width: '15%'
  }
]
export default {
  name: 'mt-log',
  props: {
    baseUrl: {
      type: String,
      default: '/Common'
    },
    size:{
      type:String,
      default:'large',
      required:false
    }
  },
  data () {
    return {
      formData: this.$form.createForm(this),
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
        current: 1,
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50'],
        total: 0,
        onShowSizeChange: (current, size) => {
          this.pageSize = size
          this.page = current
          this.pageOptions.current = current
          this.initData()
        },
        onChange: (page, pageSize) => {
          // 跳页
          this.page = page
          this.pageOptions.current = page
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
      let this_ = this
      request({
        url: `${this_.baseUrl}/api/dimType/getType`,
        method: 'get'
      })
        .then(res => {
          this.logbefort = res.oneType[0]
          this.logMessages = res.oneType
          this.detailsMessages = res.twoType
          this.details = res.twoType[res.oneType[0]] // 日志详情信息
          this.secondCity = res.twoType[res.oneType[0]][0] // 日志详情默认第一条
        })
        .catch((error) => {
        })
    },
    initData () {
      let this_ = this
      request({
        url: `${this_.baseUrl}/api/log/selectLog`,
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
      })
        .then(res => {
          this.data = res.result.list
          this.pageOptions.total = res.result.size|| 0
        })
        .catch((error) => {
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
      this.page = 1
      this.pageOptions.current = 1
      this.initData()
    }
  }
}
</script>
<style lang="scss" scoped>
form .ant-select {
  min-width: 100px !important;
}
.filter_box {
  text-align: right;
  margin-bottom: 20px;
}
.container {
  padding: 20px;
}
.ant-form-inline .ant-form-item{
  margin-left: 16px;
  margin-right: 0;
}
</style>
