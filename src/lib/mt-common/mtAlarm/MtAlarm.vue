<template>
  <div calss="MtAlarm_component" class="common-container">
    <a-form class="filter_box" :form="formData" layout="inline">
      <a-form-item label="报警等级：">
        <a-select v-decorator="['gradeId', {initialValue: postData.gradeId}]" placeholder="请选择">
          <a-select-option
            v-for="(optionItem, optionIndex) in alarmLevelData"
            :key="optionIndex"
            :value="optionItem.value"
          >{{optionItem.label}} <span :class="['status', optionItem.value == 3 ? 'level3': optionItem.value == 2? 'level2' : optionItem.value == 1? 'level1': '']"></span> </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="报警状态：">
        <a-select v-decorator="['stateId', {initialValue: postData.stateId}]" placeholder="请选择">
          <a-select-option
            v-for="(optionItem, optionIndex) in statusData"
            :key="optionItem.id"
            :value="optionItem.id"
          >{{ optionItem.name }}</a-select-option>
          
        </a-select>
      </a-form-item>
      
      <!-- v-decorator="['alarmTime']" -->
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
        <a-button  @click="toReset" class='btn_set'>重置</a-button>
      </a-form-item>
    </a-form>
    <a-table id="table_blue" :columns="tableColumns" :dataSource="data" :pagination="pageOptions" @change="handleTableChange" :size='size'>
      <template slot="alarmLevel" slot-scope="text, record">
        <span :class="['status', 'status_big', text == 3 ? 'level3': text == 2? 'level2' :text == 1? 'level1': '']"></span>
      </template>
      <!-- <template slot="alarmStatus" slot-scope="text, record">
        <span>{{formatAlarmState(text) || '--'}}</span>
      </template> -->
      <template slot="resetType" slot-scope="text, record">
        <a style="margin-right:10px;" v-if="text != 1" @click="resetAlarm(record)">{{ text == 2 ? '复位' : text == 4 ? '确认': ''}}</a>
        <span style="color:#2c9ae6;cursor:pointer;margin-right:10px;" v-if="record.isReadyFlg" @click="showVideo(record)">视频回放</span>
        <span style="color:#2c9ae6;cursor:pointer;" v-if="record.picURL" @click="showPic(record)">查看图片</span>
        <slot name="mtTableListButtonsAfter" :row="record" />
      </template>
      <template :slot="defineTableCell.key" slot-scope="text, record">
        <slot :name="defineTableCell.key" :row="record" />
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
    dataIndex: 'alarmLevel',
    scopedSlots: { customRender: 'alarmLevel' },
    sorter: true
  },
  {
    title: '部件名称',
    dataIndex: 'devName',
    scopedSlots: { customRender: 'devName' }
  },
  {
    title: '报警名称',
    dataIndex: 'alarmName',
    scopedSlots: { customRender: 'alarmName' }
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
    title: '消警时间',
    dataIndex: 'alarmEndTime',
    scopedSlots: { customRender: 'alarmEndTime' },
    sorter: true
  },
  {
    title: '报警详情',
    dataIndex: 'alarmDetails',
    scopedSlots: { customRender: 'alarmDetails' }
  },
  {
    title: '相关操作',
    dataIndex: 'resetType',
    scopedSlots: { customRender: 'resetType' }
  }
]
const requestUrls_default = {
  getAlarmLevel: '/Service/API/V1/CPH/alarm/dictionary',
  getAlarmList: '/Service/API/V1/CPH/alarm/getAlarmInfo',
  setAlarm: '/Service/API/V1/CPH/alarm/reset/'
}
const levelData = [
  { label: '全部', value: 0 },
  { label: '一级', value: 1 },
  { label: '二级', value: 2 },
  { label: '三级', value: 3 }
]
// const  statusData = []
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
      },
      tableColumns: {
        type: Array,
        default: () => { return columns},
        required: false
      },
      requestUrls: {
        type: Object,
        default: () => { return requestUrls_default},
        required: false
      },
      alarmLevelData: {
        type: Array,
        default: () => { return levelData }
      },
      defineTableCell: {
        type: Object,
        default: () => { return {}}
      }
      // alarmStatusData: {
      //   type: Array,
      //   default: () => { return statusData }
      // }
  }, // 格式： /baseUrl
  data () {
    return {
      levelData,
      statusData: [],
      columns,
      data: [],
      formData: this.$form.createForm(this),
      postData: {
        alarmTime: [],
        gradeId: 0,
        stateId: '13',
        keyWord: '',
        pageSize: 10,
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
          this.postData.pageSize = size
          this.postData.currentPage = 1
        },
        onChange: (page, pageSize) => {
          // 跳页
          this.postData.currentPage = page
        }
      }
    }
  },
  mounted () {
    // this.getAlarmLevel()
    this.getAlarmStates()
    this.$nextTick(()=>{
      this.requestFormList()
    })
  },
  methods: {
    moment,
    getAlarmStates(){
      let url = `${this.baseUrl}/Service/API/V1/CPH/alarm/getStates`
      request({
        url:url,
        method: 'get'
      }).then(res => {
        this.statusData = res.data
        this.statusData.forEach(item => {
          if(item.name === '报警'){
            this.postData.stateId = item.id
          }
        })
      })
    },
    requestFormList () {
      let that = this
      let url = `${this.baseUrl}${this.requestUrls.getAlarmList}`
      request({
        url: url,
        method: 'post',
        data: that.postData
      }).then(res => {
        that.data = res.data.alarmShowInfos
        that.pageOptions.total = res.data.totalCount || 0
        that.postData.currentPage = res.data.currentPage
        that.pageOptions.current = res.data.currentPage
      }).catch(() => {})
    },
    formatAlarmState (state) {
      let arr = this.statusData.filter(item => item.TypeClassId == state)
      if(arr.length > 0) {
        return arr[0].TypeClassDesc
      }
      return
    },
    // getAlarmLevel () {
    //   let url = `${this.baseUrl}${this.requestUrls.getAlarmLevel}`
    //   request({
    //     url: url,
    //     method: 'get'
    //   }).then(res => {}).catch(() => {})
    // },
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
    changeTime (val, str) {
      // this.postData.alarmTime = str
    },
    resetAlarm (record) {
      let that = this
      // this.$confirm({
      //   title: '确认复位',
      //   content: h => <div><p><span>报警名称：</span><span style="font-size:14px;font-weight:bold;">{record.alarmDesc}</span></p><p><span>判断标准：</span><span style="font-size:14px;font-weight:bold;">{record.decisionRules}</span></p><p>是否确认复位硬件?</p></div>,
      //   onOk () {
          let url = `${this.baseUrl}${this.requestUrls.setAlarm}${record.alarmId}`
          request({
            url: url,
            method: 'get'
          }).then(res => {
            that.requestFormList()
          }).catch(() => {})
      //   },
      //   onCancel () {
      //     console.log('Cancel')
      //   },
      //   class: 'test'
      // })
    },
    handleTableChange(pagination, filters, sorter) {
      ({field: this.postData.sortField, order: this.postData.sortType} = sorter)
      this.requestFormList()
    },
    showVideo(data){
      this.$emit('showVideoDialog', data)
    },
    showPic(data) {
      this.$emit('showPicDialog', data)
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
.btn_set{
  margin-left: 20px;
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
