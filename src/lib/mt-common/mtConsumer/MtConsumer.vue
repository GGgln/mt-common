<template>
  <div id="MtConsumer_component" class="container">
    <div class="consumer-contents">
      <div class="consumer-title">
        <a-row :gutter="16" type="flex" justify="space-around" align="middle">
          <a-col :offset="15" :md="4"><a-input style="width:100%;" v-model="iptContent" placeholder="搜索日志内容" /></a-col>
          <a-col  :md="5">
            <a-row>
              <a-col :md="11"><a-button icon="search" @click="initData()" class="add-btn" type="primary">查询用户</a-button></a-col>
              <a-col :offset="2" :md="11"><a-button icon="plus" class="add-btn add-btn-derive" type="primary" @click="showModal">新建用户</a-button></a-col>
            </a-row>
          </a-col>
        </a-row>
      </div>
      <a-modal title="新建用户" v-model="visible" @cancel="cancelModal" @ok="saveModal" okText="保存" cancelText="关闭">
        <a-form :form="form">
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="姓名:" hasFeedback>
            <a-input id="warning" v-decorator="['userName', { rules: [{ required: true, message: '不能为空' }] }]" />
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="用户名:" hasFeedback>
            <a-input id="warning" v-decorator="['userId', { rules: [{ required: true, message: '不能为空' }] }]" />
          </a-form-item>

          <a-form-item label="密码" class="stepFormText" :label-col="labelCol" :wrapper-col="wrapperCol" hasFeedback>
            <a-input type="password" v-decorator="['passWord', { rules: [{ required: true, message: '请输入密码' }, { validator: handlePass }] }]" name="password" />
          </a-form-item>
          <a-form-item label="确认密码" class="stepFormText" :label-col="labelCol" :wrapper-col="wrapperCol" hasFeedback>
            <a-input
              type="password"
              v-decorator="['confirm_password', { rules: [{ required: true, message: '请输入确认密码' }, { validator: handleConfirmPass }] }]"
              name="confirm_password"
            />
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="用户组:" hasFeedback>
            <a-select v-decorator="['roleTypeId', { rules: [{ required: true, message: '请选择用户组' }] }]">
              <a-select-option :value="select.roleTypeId" :key="index" v-for="(select,index) in selects">{{select.roleTypeName}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="电话:" hasFeedback>
            <a-input id="warning" v-decorator="['phone', { rules: [{ required: true, message: '不能为空' }, { validator: handIphone }] }]" />
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="智信:" hasFeedback>
            <a-input id="warning" v-decorator="['zhixin', { rules: [{ required: true, message: '不能为空' }] }]" />
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="微信:" hasFeedback>
            <a-input id="warning" v-decorator="['wechat', { rules: [{ required: true, message: '不能为空' }] }]" />
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="钉钉:" hasFeedback>
            <a-input id="warning" v-decorator="['dingDing', { rules: [{ required: true, message: '不能为空' }] }]" />
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="邮箱:" hasFeedback>
            <a-input id="warning" v-decorator="['mail', { rules: [{
              type: 'email', message: '请输入正确的邮箱格式',
            },{ required: true, message: '不能为空' }] }]" />
          </a-form-item>
        </a-form>
      </a-modal>
      <a-table :pagination="pageOptions" :columns="columns" :dataSource="data">
        <template slot="action" slot-scope="text, record">
          <a-row>
            <a-col :span="8"><a v-if="record.deletFlg" href="javascript:;" @click="deleData(record)">删除</a></a-col>
            <a-col :span="8"><a href="javascript:;" @click="showModalEdit(record)">编辑</a></a-col>
            <a-col :span="8"><a href="javascript:;" @click="detailsData(record)">详情</a></a-col>
          </a-row>
        </template>
      </a-table>
      <a-modal title="编辑用户" v-model="visibleEdit" @cancel="cancelModalEdit" @ok="saveModalEdit" okText="保存" cancelText="关闭">
        <a-form :form="formEdit">
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="姓名:" hasFeedback>
            <a-input id="warning" v-decorator="['userName', { rules: [{ required: true, message: '不能为空' }] }]" />
          </a-form-item>
          <a-form-item label="原密码" class="stepFormText" :label-col="labelCol" :wrapper-col="wrapperCol" hasFeedback>
            <a-input type="password" v-decorator="['oldPassWord', { rules: [{ required: true, message: '请输入原密码' }] }]" name="password" />
          </a-form-item>
          <a-form-item label="新密码" class="stepFormText" :label-col="labelCol" :wrapper-col="wrapperCol" hasFeedback>
            <a-input
              type="password"
              v-decorator="['passWord', { rules: [{ required: true, message: '请输入新密码' }] }]"
              name="confirm_password"
            />
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="用户组:" hasFeedback>
            <a-select v-decorator="['roleTypeId', { rules: [{ required: true, message: '请选择用户组' }] }]">
              <a-select-option :value="select.roleTypeId" :key="index" v-for="(select,index) in selects">{{select.roleTypeName}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="电话:" hasFeedback>
            <a-input id="warning" v-decorator="['phone', { rules: [{ required: true, message: '不能为空' }, { validator: handIphone }] }]" />
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="智信:" hasFeedback>
            <a-input id="warning" v-decorator="['zhixin', { rules: [{ required: true, message: '不能为空' }] }]" />
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="微信:" hasFeedback>
            <a-input id="warning" v-decorator="['wechat', { rules: [{ required: true, message: '不能为空' }] }]" />
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="钉钉:" hasFeedback>
            <a-input id="warning" v-decorator="['dingDing', { rules: [{ required: true, message: '不能为空' }] }]" />
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="邮箱:" hasFeedback>
            <a-input id="warning" v-decorator="['mail', { rules: [{
              type: 'email', message: '请输入正确的邮箱格式',
            },{ required: true, message: '不能为空' }] }]" />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>
<script>
import request from '../utils/request'
const columns = [
  {
    title: '姓名',
    align: 'center',
    dataIndex: 'userName',
    width: '12%'
  },
  {
    title: '用户名',
    align: 'center',
    dataIndex: 'userId',
    width: '15%'
  },

  {
    title: '用户组',
    align: 'center',
    dataIndex: 'roleTypeName',
    width: '15%'
  },
  {
    title: '电话',
    align: 'center',
    dataIndex: 'phone',
    width: '15%'
  },
  {
    title: '创建时间',
    align: 'center',
    dataIndex: 'createTime',
    width: '15%'
  },
  {
    title: '创建者',
    align: 'center',
    dataIndex: 'createUser',
    width: '12%'
  },
  {
    title: '操作',
    align: 'center',
    dataIndex: '',
    scopedSlots: { customRender: 'action' },
    width: '16%'
  }
]

export default {
  name: 'mt-consumer-page',
  data () {
    return {
      form: this.$form.createForm(this), // 新建form
      formEdit: this.$form.createForm(this), // 编辑form
      password: '', // 新建对比密码
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 }
      },
      iptContent: null, // 输入框内容
      visible: false, // 新建model
      visibleEdit: false, // 编辑model
      columns,
      data: [], // table数据
      selects: [], // 下拉数据
      UserId: 'root', // 登录用户
      pageSize: 10, // 条数
      page: 1, // 当前页
      details: {}, // 详情数据
      formNewData: {}, // 新建传输数据
      formNewDataEdit: {}, // 编辑传输数据
      receiveEdit: {},
      pageOptions: {// 分页
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '15', '20'],
        total: 0,
        onShowSizeChange: (current, size) => { // 每页多少条
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
    this.initData()
  },
  methods: {
    initData () {
      // table数据列表接口
      request({
        url: 'Service/API/V1/CHP/user/list',
        method: 'post',
        data: {
          keyWord: this.iptContent,
          userId: this.UserId,
          currentPage: this.page,
          pageNum: this.pageSize
        }
      })
        .then(res => {
          if (res.code === '0') {
            this.pageOptions.total = res.data.totalCount
            this.data = res.data.userJsons
          }
        })
        .catch(() => {
          // alert('error')
        })
    },
    selectData () { // 下拉数据
      request({
        url: 'Service/API/V1/CHP/role/list/' + this.UserId,
        method: 'get'
      })
        .then(res => {
          this.selects = res.data
        })
        .catch(() => {
          // alert('error')
        })
    },

    saveModal (e) { // 新建保存发送新建信息
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.formNewData = {createUser: this.UserId}
          for (let value in values) {
            if (value !== 'confirm_password') {
              this.formNewData[value] = values[value]
            }
          }
          request({
            url: 'Service/API/V1/CHP/user/create',
            method: 'post',
            data: this.formNewData
          })
            .then(res => {
              this.visible = false
              this.initData()
            })
            .catch(() => {
              // alert('error')
            })
        }
      })
    },
    saveModalEdit (e) { // 编辑保存发送修改信息
      e.preventDefault()
      this.formEdit.validateFields((err, values) => {
        if (!err) {
          this.formNewDataEdit = {userId: this.receiveEdit.userId, customerName: values.userName, customerId: this.receiveEdit.customerId}
          for (let value in values) {
            this.formNewDataEdit[value] = values[value]
          }

          request({
            url: 'Service/API/V1/CHP/user/updateUser',
            method: 'put',
            data: this.formNewDataEdit
          })
            .then(res => {
              console.log(res)

              this.visibleEdit = false
              this.initData()
            })
            .catch(() => {
              // this.$error({
              //        title: '错误',
              //        content: 'some messages...some messages...',
              //      })
              // alert('error')
            })
        }
      })
    },
    showModal () { // 新建显示
      this.visible = true
      this.form.resetFields() // 新建重置
      this.selectData()
    },
    showModalEdit (data) { // 编辑显示
      this.visibleEdit = true
      this.formEdit.resetFields() // 编辑重置
      // this.editUserId=data.userId
      request({
        url: 'Service/API/V1/CHP/user/detail/' + data.userId,
        method: 'get'
      })
        .then(res => {
          if (res.code === '0') {
            this.receiveEdit = res.data
            setTimeout(() => {
              this.formEdit.setFieldsValue({// 数据
                'zhixin': res.data.zhixin,
                'userName': res.data.customerName,
                'roleTypeId': res.data.roleTypeId,
                'phone': res.data.phone,
                'dingDing': res.data.dingDing,
                'mail': res.data.mail,
                'wechat': res.data.wechat
              })
            }, 100)
          }
        })
        .catch(() => {
          // alert('error')
        })

      this.selectData()// 调用下拉数据
    },
    cancelModal () { // 新建model关闭
      this.visible = false
    },

    cancelModalEdit () { // 编辑model关闭
      this.visibleEdit = false
    },
    detailsData (data) { // 详情model
      this.details = {}
      // 详情框
      request({
        url: 'Service/API/V1/CHP/user/detail',
        method: 'post',
        data: {
          custormId: String(data.customerId),
          userId: data.userId
        }
      })
        .then(res => {
          if (res.code === '0') {
            this.details = res.data
            this.$info({
              title: '用户详情',
              // JSX support
              content: (
                <div class="detailsConter">
                  <p>
                    <span style="width:25%;display:inline-block;text-align: right;margin-right: 20px;">姓名:</span>
                    {this.details.customerName}
                  </p>
                  <p>
                    <span style="width:25%;display:inline-block;text-align: right;margin-right: 20px;">用户组:</span>
                    {this.details.roleTypeName}
                  </p>
                  <p>
                    <span style="width:25%;display:inline-block;text-align: right;margin-right: 20px;">电话:</span>
                    {this.details.phone}
                  </p>
                  <p>
                    <span style="width:25%;display:inline-block;text-align: right;margin-right: 20px;">智信:</span>
                    {this.details.zhixin}
                  </p>
                  <p>
                    <span style="width:25%;display:inline-block;text-align: right;margin-right: 20px;">微信:</span>
                    {this.details.wechat}
                  </p>
                  <p>
                    <span style="width:25%;display:inline-block;text-align: right;margin-right: 20px;">钉钉:</span>
                    {this.details.dingDing}
                  </p>
                  <p>
                    <span style="width:25%;display:inline-block;text-align: right;margin-right: 20px;">邮箱:</span>
                    {this.details.mail}
                  </p>
                </div>
              ),
              okText: '关闭',
              centered: true,
              width: 500,
              onOk () {
              }
            })
          }
        })
        .catch(() => {
          // alert('error')
        })
    },
    deleData (data) { // 删除model
      console.log(data)
      let thisName = this // 赋值this
      this.$confirm({
        title: '删除用户',
        content: '确定要删除 "' + data.userName + '" ?',
        okText: '确定',
        centered: true,
        width: 500,
        // iconType: 'exclamation-circle',
        cancelText: '取消',
        onOk () {
          request({
            url: 'Service/API/V1/CHP/user/delete/' + data.userId,
            method: 'delete'
          })
            .then(res => {
              thisName.initData()
            })
            .catch(() => {
              // alert('error')
            })
        },
        onCancel () {
          console.log('Cancel')
        }
      })
    },
    handlePass (rule, value, callback) {
      // 新建密码验证
      this.password = value
      callback()
    },
    handleConfirmPass (rule, value, callback) {
      // 确认密码验证
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
    }
  }
}
</script>
<style lang="scss" scoped>
@import './style.scss';
</style>
