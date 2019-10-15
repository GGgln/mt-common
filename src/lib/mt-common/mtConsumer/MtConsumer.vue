<template>
  <div id="MtConsumer_component" class="container">
      <a-form class="filter_box" :form="formData" layout="inline">
        <a-form-item> <a-input style="width:100%;" v-model="iptContent" placeholder="请输入用户名称" /></a-form-item>
        <a-form-item>
     <a-button icon="search" @click="initData()"  type="primary">查询用户</a-button>
   <a-button icon="plus" style="margin-left:20px;"  type="primary" @click="showModal">新建用户</a-button>
        </a-form-item>
      </a-form>
      <a-modal title="新建用户" v-model="visible" @cancel="cancelModal" @ok="saveModal" okText="保存" cancelText="关闭">
        <a-form :form="form">
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="姓名:" hasFeedback>
            <a-input id="warning" v-decorator="['userName', { rules: [{ required: true, message: '不能为空' }] }]" />
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="用户名:" hasFeedback>
            <a-input id="warning" v-decorator="['userId', { rules: [{ required: true, message: '不能为空' }, { validator: handleUserId}] }]" />
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
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="微信:" hasFeedback :style="{ display: expand ? 'block' : 'none' }">
            <a-input id="warning" v-decorator="['wechat', { rules: [{ required: true, message: '不能为空' }] }]" />
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="钉钉:" hasFeedback :style="{ display: expand ? 'block' : 'none' }">
            <a-input id="warning" v-decorator="['dingDing', { rules: [{ required: true, message: '不能为空' }] }]" />
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="邮箱:" hasFeedback :style="{ display: expand ? 'block' : 'none' }">
            <a-input id="warning" v-decorator="['mail', { rules: [{
              type: 'email', message: '请输入正确的邮箱格式',
            },{ required: true, message: '不能为空' }] }]" />
          </a-form-item>
        </a-form>
           <a
                    style="margin-left: 50%;"
                    @click="toggle"
                  >
                    <a-icon :style="{fontSize: '30px' }" :type="expand ? 'caret-up' : 'caret-down'" />
                  </a>
      </a-modal>
      <a-table id="table_blue" :pagination="pageOptions" :columns="columns" :dataSource="data">
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
              v-decorator="['passWord', { rules: [{ required: true, message: '请输入新密码' }, { validator: handlePassEdit }] }]"
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
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="微信:" hasFeedback :style="{ display: expand ? 'block' : 'none' }">
            <a-input id="warning" v-decorator="['wechat', { rules: [{ required: true, message: '不能为空' }] }]" />
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="钉钉:" hasFeedback :style="{ display: expand ? 'block' : 'none' }">
            <a-input id="warning" v-decorator="['dingDing', { rules: [{ required: true, message: '不能为空' }] }]" />
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="邮箱:" hasFeedback :style="{ display: expand ? 'block' : 'none' }">
            <a-input id="warning" v-decorator="['mail', { rules: [{
              type: 'email', message: '请输入正确的邮箱格式',
            },{ required: true, message: '不能为空' }] }]" />
          </a-form-item>
        </a-form>
        <a
                 style="margin-left: 50%;"
                 @click="toggle"
               >
                 <a-icon :style="{fontSize: '30px' }" :type="expand ? 'caret-up' : 'caret-down'" />
               </a>
      </a-modal>
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
  props: ['baseUrl'],
  data () {
    return {
      formData: this.$form.createForm(this),
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
      expand: false, // 图标状态
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
        pageSizeOptions: ['10', '20', '50'],
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
    toggle  () { // 改变图标状态
      this.expand = !this.expand
    },
    initData () {
      // table数据列表接口
      let this_ = this
      request({
        url: `${this_.baseUrl}/Service/API/V1/CHP/user/list`,
        method: 'post',
        data: {
          keyWord: this.iptContent,
          userId: this.UserId,
          currentPage: this.page,
          pageNum: this.pageSize
        }
      })
        .then(res => {
          this.pageOptions.total = res.data.totalCount
          this.data = res.data.userJsons
        })
        .catch(() => {
          // alert('error')
        })
    },
    selectData () { // 下拉数据
      let this_ = this
      request({
        url: `${this_.baseUrl}/Service/API/V1/CHP/role/list/${this_.UserId}`,
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
      let this_ = this
      this.form.validateFields((err, values) => {
        if (!err) {
          this.formNewData = {createUser: this.UserId}
          for (let value in values) {
            if (value !== 'confirm_password') {
              this.formNewData[value] = values[value]
            }
          }
          request({
            url: `${this_.baseUrl}/Service/API/V1/CHP/user/create`,
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
      let this_ = this
      this.formEdit.validateFields((err, values) => {
        if (!err) {
          this.formNewDataEdit = {userId: this.receiveEdit.userId, customerName: values.userName, customerId: this.receiveEdit.customerId}
          for (let value in values) {
            this.formNewDataEdit[value] = values[value]
          }

          request({
            url: `${this_.baseUrl}/Service/API/V1/CHP/user/updateUser`,
            method: 'put',
            data: this.formNewDataEdit
          })
            .then(res => {
              this.visibleEdit = false
              this.initData()
            })
            .catch((error) => {
              this.$error({
                title: '修改信息错误',
                content: error.msg
              })
            })
        }
      })
    },
    showModal () { // 新建显示
      this.visible = true
      this.expand = false
      this.form.resetFields() // 新建重置
      this.selectData()
    },
    showModalEdit (data) { // 编辑显示
      let this_ = this
      this.visibleEdit = true
      this.expand = false
      this.formEdit.resetFields() // 编辑重置
      // this.editUserId=data.userId
      request({
        url: `${this_.baseUrl}/Service/API/V1/CHP/user/detail/${data.userId}`,
        method: 'get'
      })
        .then(res => {
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

    deleData (data) { // 删除model
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
            url: `${thisName.baseUrl}/Service/API/V1/CHP/user/delete/${ data.userId}`,
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
        }
      })
    },
    handlePassEdit (rule, value, callback) {
      // 新密码验证
      var mPasswordEdit = /^[!-~]{8,14}$/
      if (!value.match(mPasswordEdit)) {
        callback(new Error('长度为8-14个字符，支持数字、大小写字母和特殊字符！'))
        return
      }
      callback()
    },
    handleUserId (rule, value, callback) {
      // 用户名验证
      var mUserId = /^[\u4e00-\u9fa5]{1,7}$|^[\dA-Za-z_]{1,14}$/
      if (!value.match(mUserId)) {
        callback(new Error('中英文均可，最长14个英文或者7个汉字！'))
        return
      }
      callback()
    },
    handlePass (rule, value, callback) {
      // 新建密码验证
      this.password = value
      var mPassword = /^[!-~]{8,14}$/
      if (!value.match(mPassword)) {
        callback(new Error('长度为8-14个字符，支持数字、大小写字母和特殊字符！'))
        return
      }
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
    },
    detailsData (data) { // 详情model
      let this_ = this
      this.details = {}
      // 详情框
      request({
        url: `${this_.baseUrl}/Service/API/V1/CHP/user/detail`,
        method: 'post',
        data: {
          custormId: String(data.customerId),
          userId: data.userId
        }
      })
        .then(res => {
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
        })
        .catch(() => {
          // alert('error')
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.filter_box{
  text-align: right;
  margin-bottom: 20px;
}
.container {
  padding:20px;
}
</style>
