<template>
  <div calss="MtAlarm_component" class="common-container">
    <a-form class="filter_box" :form="formData" layout="inline">
      <a-form-item label="报警等级：">
        <a-select v-decorator="['gradeId', {initialValue: 1}]" placeholder="请选择">
          <a-select-option
            v-for="(optionItem, optionIndex) in alarmLevelData"
            :key="optionIndex"
            :value="optionItem.value"
          >{{optionItem.label}} <span :class="['status', optionItem.value == 3 ? 'level3': optionItem.value == 2? 'level2' : optionItem.value == 1? 'level1': '']"></span> </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="报警状态：">
        <a-select v-decorator="['stateId', {initialValue: 1}]" placeholder="请选择">
          <a-select-option
            v-for="(optionItem, optionIndex) in alarmStatusData"
            :key="optionIndex"
            :value="optionItem.value"
          >{{ optionItem.label }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="时间段查询：">
        <a-range-picker 
        style="text-align:left"
        v-decorator="['alarmTime']"
          :showTime="{
        hideDisabledOptions: true,
        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]
      }"
          format="YYYY-MM-DD HH:mm:ss"
          @change="changeTime"
        />
      </a-form-item>
      <a-form-item label="关键字查询：" v-show="isShow">
        <a-input v-decorator="['keyWord']" placeholder="请输入关键字" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="toSearch">查询</a-button>
        <a-button style="margin-left:20px;" @click="toReset">重置</a-button>
      </a-form-item>
    </a-form>
    <a-table id="table_blue" :columns="columns" :dataSource="data" :pagination="pageOptions" rowKey="alarmId" @change="handleTableChange" :size='size'>
      <template slot="alarmGradeId" slot-scope="text, record">
        <!-- <span>{{text == 1 ? '一级' : text == 2 ? '二级' : text == 3 ? '三级' : '-'}}</span> -->
        <span :class="['status', 'status_big', text == 3 ? 'level3': text == 2? 'level2' :text == 1? 'level1': '']"></span>
      </template>
      <template slot="alarmStatus" slot-scope="text, record">
        <span>{{text == 1 ? '报警' : text == 2 ? '消警' : text == 3 ? '待复位' : '-'}}</span>
      </template>
      <template slot="operate" slot-scope="text, record">
        <a v-if="record.IsManualReset" @click="resetAlarm(record)">复位</a>
      </template>
    </a-table>
  </div>
</template>
<script>
import moment from 'moment'
import request from '../utils/request'
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
const requestUrls = {
  getAlarmLevel: '/Service/API/V1/CPH/alarm/dictionary',
  getAlarmList: '/Service/API/V1/CPH/alarm/getAlarmInfo',
  setAlarm: '/Service/API/V1/CPH/alarm/resetAlarm'
}
export default {
  name: 'mt-alarm',
  props: {
      baseUrl: {
        type: String,
        default: '/mtCommonApi'
      },
      size:{
        type:String,
        default:'middle',
        required:false
      },
      isShow:{
        type: Boolean,
        default: true,
        required: false
      }
  }, // 格式： /baseUrl
  data () {
    return {
      alarmLevelData: [
        { label: '全部', value: 0 },
        { label: '一级', value: 1 },
        { label: '二级', value: 2 },
        { label: '三级', value: 3 }
      ],
      alarmStatusData: [
        { label: '全部', value: 0 },
        { label: '报警', value: 1 },
        { label: '消警', value: 2 },
        { label: '待复位', value: 3 }
      ],
      columns,
      data: [],
      formData: this.$form.createForm(this),
      postData: {
        alarmTime: [],
        gradeId: 1,
        stateId: 1,
        keyWord: '',
        pageNum: 10,
        currentPage: 1,
        sortField: null,
        sortType: null
      },
      pageOptions: {
        current: 1,
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50'],
        total: 0,
        onShowSizeChange: (current, size) => {
          this.postData.pageNum = size
          this.postData.currentPage = 1
          this.requestFormList()
        },
        onChange: (page, pageSize) => {
          // 跳页
          this.postData.currentPage = page
          this.requestFormList()
        }
      },
      requestUrls
    }
  },
  mounted () {
    this.getAlarmLevel()
    this.requestFormList()
  },
  methods: {
    moment,
    requestFormList () {
      let that = this
      let url = `${this.baseUrl}${this.requestUrls.getAlarmList}`
      request({
        url: url,
        method: 'post',
        data: that.postData
      }).then(res => {
        // alert('success')
        that.data = res.data.alarmInfoList
        that.pageOptions.total = res.data.totalCount
        that.postData.currentPage = res.data.page
        that.pageOptions.current = res.data.page
      }).catch(() => {
        // alert('error')
      })
    },
    getAlarmLevel () {
      let url = `${this.baseUrl}${this.requestUrls.getAlarmLevel}`
      request({
        url: url,
        method: 'get'
      }).then(res => {
        // alert('success')
      }).catch(() => {
        // alert('error')
      })
    },
    toSearch () {
      this.postData.currentPage = 1
      this.formData.validateFields((err, values) => {
        if (!err) {
          this.postData = Object.assign(this.postData, values)
          this.requestFormList()
        }
      })
    },
    toReset () {
      this.currentPage = 1
      this.formData.resetFields()
      this.requestFormList()
    },
    changeTime () {},
    resetAlarm (record) {
      let that = this
      this.$confirm({
        title: '确认复位',
        content: h => <div><p><span>报警名称：</span><span style="font-size:14px;font-weight:bold;">{record.alarmDesc}</span></p><p><span>判断标准：</span><span style="font-size:14px;font-weight:bold;">{record.decisionRules}</span></p><p>是否确认复位硬件?</p></div>,
        onOk () {
          let url = `${that.baseUrl}${that.requestUrls.setAlarm}`
          request({
            url: url,
            method: 'post',
            data: { alarmId: record.alarmId }
          }).then(res => {
            that.requestFormList()
          }).catch(() => {
            // alert('error')
          })
        },
        onCancel () {
          console.log('Cancel')
        },
        class: 'test'
      })
    },
    handleTableChange(pagination, filters, sorter) {
      // console.log(pagination, filters, sorter)
      // this.postData.currentPage = 1;
      ({field: this.postData.sortField, order: this.postData.sortType} = sorter)
      console.log(this.postData)
      this.requestFormList()
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../style/ant-style-cover.scss';
form .ant-select {
  min-width: 100px !important;
}
.filter_box{
  text-align: right;
}
#table_blue{
  margin-top: 20px;
}
.status{
  width:12px;
  height:12px;
  display: inline-block;
  border-radius: 50%;
  &.status_big{
    width: 20px;
    height: 20px;
  }
  &.level1{
    background-color: #FEF100;
  }
  &.level2{
    
    background-color: rgba(194, 128, 255, 1);
  }
  &.level3{
    background-color: #afe4ff;
  }
}
</style>
