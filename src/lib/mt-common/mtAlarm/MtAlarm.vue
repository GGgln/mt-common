<template>
  <div id="MtAlarm_component" class="common-container">
    <a-form :form="formData" layout="inline">
      <a-form-item label="报警等级：">
        <a-select v-decorator="['alarmLevel']" placeholder="请选择报警等级">
          <a-select-option
            v-for="(optionItem, optionIndex) in alarmLevelData"
            :key="optionIndex"
            :value="optionItem.value"
          >{{optionItem.label}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="报警状态：">
        <a-select v-decorator="['alarmStatus']" placeholder="请选择报警状态">
          <a-select-option
            v-for="(optionItem, optionIndex) in alarmStatusData"
            :key="optionIndex"
            :value="optionItem.value"
          >{{ optionItem.label }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="时间段：">
        <a-range-picker
          :showTime="{
        hideDisabledOptions: true,
        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]
      }"
          format="YYYY-MM-DD HH:mm:ss"
          @change="changeTime"
        />
      </a-form-item>
      <a-form-item label="关键字查询：">
        <a-input v-model="keywords" placeholder="请输入关键字" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="toSearch">查询</a-button>
        <a-button style="margin-left:20px;" @click="toReset">重置</a-button>
      </a-form-item>
    </a-form>
    <a-table :columns="columns" :dataSource="data" bordered>
      <template slot="operation" slot-scope="text, record">
        <!-- <a-button v-for="(el, index) in form.formButtons">{{ el.name }}</a-button> -->
      </template>
    </a-table>
  </div>
</template>
<script>
import moment from 'moment'
const columns = [
  {
    title: '报警级别',
    dataIndex: 'alarmLevel',
    scopedSlots: { customRender: 'alarmLevel' }
  },
  {
    title: '部件名称',
    dataIndex: 'partName',
    scopedSlots: { customRender: 'partName' }
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
    dataIndex: 'alarmTime',
    scopedSlots: { customRender: 'alarmTime' }
  },
  {
    title: '报警详情',
    dataIndex: 'alarmInfo',
    scopedSlots: { customRender: 'alarmInfo' }
  },
  {
    title: '消警时间',
    dataIndex: 'cancelTime',
    scopedSlots: { customRender: 'cancelTime' }
  },
  {
    title: '相关操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }

]
export default {
  name: 'mt-alarm',
  data () {
    return {
      columns,
      formData: this.$form.createForm(this),
      rangeTime: [],
      alarmLevel: '',
      alarmStatus: '',
      keywords: '',
      postData: {
        rangeTime: [],
        alarmLevel: '',
        alarmStatus: '',
        keywords: '',
        pageSize: 10,
        page: 1
      },
      alarmLevelData: [
        { label: '一级', value: 1 },
        { label: '二级', value: 2 },
        { label: '三级', value: 3 }
      ],
      alarmStatusData: [
        { label: '报警', value: 1 },
        { label: '消警', value: 2 }
      ],
      data: [],
      pageOptions: {
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50'],
        total: 0,
        onShowSizeChange: (current, size) => {
          this.postData.pageSize = size
          this.postData.page = 1
          this.requestFormList()
        },
        onChange: (page, pageSize) => {
          // 跳页
          this.postData.page = page
          this.requestFormList()
        }
      }
    }
  },
  mounted () {
    console.log(this)
  },
  methods: {
    moment,
    requestFormList () {},
    toSearch () {},
    toReset () {},
    changeTime () {}
  }
}
</script>
<style scoped>
form .ant-select {
  min-width: 100px !important;
}
</style>
