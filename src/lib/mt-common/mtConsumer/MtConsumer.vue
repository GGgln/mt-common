<template>
  <div id="MtConsumer_component" class="container">
    <div class="consumer-contents">
      <div class="consumer-title">
        <a-row>
          <a-col :offset="16" :xs="4"><a-input v-model="iptContent" placeholder="搜索日志内容" /></a-col>
          <a-col :offset="1" :xs="3">
            <a-button icon="plus" class="add-btn add-btn-derive" type="primary" @click="showModal">新建用户</a-button>
            <a-button icon="search" class="add-btn" type="primary">查询用户</a-button>
          </a-col>
        </a-row>
      </div>
      <a-modal title="新建用户" v-model="visible" @cancel="cancelModal" @ok="saveModal" okText="保存" cancelText="关闭">
        <a-form :form="form">
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="姓名:" hasFeedback>
            <a-input id="warning" v-decorator="['name', { rules: [{ required: true, message: '不能为空' }] }]" />
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="用户名:" hasFeedback>
            <a-input id="warning" v-decorator="['username', { rules: [{ required: true, message: '不能为空' }] }]" />
          </a-form-item>

          <a-form-item label="密码" class="stepFormText" :label-col="labelCol" :wrapper-col="wrapperCol" hasFeedback>
            <a-input type="password" v-decorator="['password', { rules: [{ required: true, message: '请输入密码' }, { validator: handlePass }] }]" name="password" />
          </a-form-item>
          <a-form-item label="确认密码" class="stepFormText" :label-col="labelCol" :wrapper-col="wrapperCol" hasFeedback>
            <a-input
              type="password"
              v-decorator="['confirm_password', { rules: [{ required: true, message: '请输入确认密码' }, { validator: handleConfirmPass }] }]"
              name="confirm_password"
            />
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="用户组:" hasFeedback>
            <a-select v-decorator="['userGroup', { rules: [{ required: true, message: '请选择用户组' }] }]">
              <a-select-option value="1">Option 1</a-select-option>
              <a-select-option value="2">Option 2</a-select-option>
              <a-select-option value="3">Option 3</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="电话:" hasFeedback>
            <a-input id="warning" v-decorator="['phone', { rules: [{ required: true, message: '不能为空' }, { validator: handIphone }] }]" />
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="智信:" hasFeedback>
            <a-input id="warning" v-decorator="['wisdomLetter', { rules: [{ required: true, message: '不能为空' }] }]" />
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="微信:" hasFeedback>
            <a-input id="warning" v-decorator="['weChat', { rules: [{ required: true, message: '不能为空' }] }]" />
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="钉钉:" hasFeedback>
            <a-input id="warning" v-decorator="['dingTalk', { rules: [{ required: true, message: '不能为空' }] }]" />
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="邮箱:" hasFeedback>
            <a-input id="warning" v-decorator="['mailbox', { rules: [{ required: true, message: '不能为空' }] }]" />
          </a-form-item>
        </a-form>
      </a-modal>
      <a-table :pagination="pageOptions" :columns="columns" :dataSource="data">
        <template slot="action" slot-scope="text, record">
          <a href="javascript:;" @click="deleData(record)">删除</a>
          <a style="margin: 0 20px;" href="javascript:;" @click="compileData(record)">编辑</a>
          <a href="javascript:;" @click="detailsData(record)">详情</a>
        </template>
      </a-table>
    </div>
  </div>
</template>
<script>
const columns = [
  {
    title: '姓名',
    align: 'center',
    dataIndex: 'time'
  },
  {
    title: '用户名',
    align: 'center',
    dataIndex: 'type'
  },
  {
    title: '密码',
    align: 'center',
    dataIndex: 'content'
  },
  {
    title: '用户组',
    align: 'center',
    dataIndex: 'a'
  },
  {
    title: '电话',
    align: 'center',
    dataIndex: 'b'
  },
  {
    title: '创建时间',
    align: 'center',
    dataIndex: 'c'
  },
  {
    title: '创建者',
    align: 'center',
    dataIndex: 'd'
  },
  {
    title: '操作',
    align: 'center',
    dataIndex: '',
    scopedSlots: { customRender: 'action' }
  }
]

const data = [
  {
    key: '1',
    time: '11.11',
    type: '￥300,000.00',
    content: 'New York No. 1 Lake Park',
    operator: 123,
    a: '1',
    b: '1',
    c: '1',
    d: '1'
  },
  {
    key: '2',
    time: '22.22',
    type: '￥1,256,000.00',
    content: 'London No. 1 Lake Park',
    operator: 123,
    a: '1',
    b: '1',
    c: '1',
    d: '1'
  },
  {
    key: '3',
    time: '33.33',
    type: '￥120,000.00',
    content: 'Sidney No. 1 Lake Park',
    operator: 123,
    a: '1',
    b: '1',
    c: '1',
    d: '1'
  },
  {
    key: '4',
    time: '44.44',
    type: '￥120,000.00',
    content: 'Sidney No. 1 Lake Park',
    operator: 123,
    a: '1',
    b: '1',
    c: '1',
    d: '1'
  }
]
// import request from './../utils/request'
export default {
  name: 'mt-consumer-page',
  data () {
    return {
      // aaaa:{},
      form: this.$form.createForm(this),
      password: '',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 }
      },
      iptContent: null, // 输入框内容
      visible: false,
      data,
      columns,
      pageSize: 10, // 条数
      page: 1, // 当前页
      pageOptions: {
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '15', '20'],
        total: 50,
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
  methods: {
    initData () {
      // 数据接口
    },
    showModal () {
      this.visible = true
      this.form.resetFields() // 新建重置
      // this.form.setFieldsValue({//数据
      //   'username':'123',
      //   'name':'121'
      // })
    },
    handlePass (rule, value, callback) {
      // 密码
      this.password = value
      callback()
    },
    handleConfirmPass (rule, value, callback) {
      // 新密码
      if (this.password && this.password !== value) {
        callback(new Error('两次密码输入不一致!'))
        return
      }
      // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
      callback()
    },
    handIphone (rule, value, callback) {
      // 电话验证
      var mPattern = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/
      if (!value.match(mPattern)) {
        callback(new Error('请输入正确电话号码!'))
        return
      }
      callback()
    },
    saveModal (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          this.visible = false
        }
      })
    },
    cancelModal () {
      this.visible = false
    },
    compileData (data) {
      // 编辑框
      console.log(data)
    },
    detailsData (data) {
      // 详情框
      // const h = this.$createElement
      console.log(data)
      // this.aaaa=data
      this.$info({
        title: '用户详情',
        // JSX support
        content: (
          <div>
            <p>{this.pageSize}</p>
            <p>{this.pageSize}</p>
            <p>{this.pageSize}</p>
            <p>{this.pageSize}</p>
            <p>{this.pageSize}</p>
            <p>{this.pageSize}</p>
            <p>{this.pageSize}</p>
            <p>{this.pageSize}</p>
          </div>
        ),
        okText: '关闭',
        centered: true,
        width: 500,
        onOk () {
          console.log(data)
        }
      })
    },
    deleData (data) {
      // 删除框
      console.log(data.time)
      this.$confirm({
        title: '删除用户',
        content: '确定要删除 "' + data.time + '" ?',
        okText: '确定',
        centered: true,
        width: 500,
        // iconType: 'exclamation-circle',
        cancelText: '取消',
        onOk () {
          console.log(data)
        },
        onCancel () {
          console.log('Cancel')
        }
      })
    }
    // init() {
    //    request({
    //     url: that.form.listUrl,
    //     method: 'get'
    //   }).then(res => {
    //     //alert('success')
    //   }).catch(()=>{
    //     //alert('error')
    //   })
    // }
  }
}
</script>
<style lang="scss" scoped>
@import './style.scss';
</style>
