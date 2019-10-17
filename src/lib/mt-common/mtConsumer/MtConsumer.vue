<template>
  <div id="MtConsumer_component" class="container">
    <input class="ipt-hid" type="text">
    <input class="ipt-hid" type="password">
    <a-form class="filter_box" :form="formData" layout="inline">
      <a-form-item>
        <a-input style="width:100%;" v-model="iptContent" placeholder="请输入姓名" />
      </a-form-item>
      <a-form-item>
        <a-button icon="search" @click="initData()" type="primary">查询用户</a-button>
        <a-button icon="plus" style="margin-left:20px;" type="primary" @click="showModal">新建用户</a-button>
      </a-form-item>
    </a-form>
    <a-modal
      :maskClosable="false"
      title="新建用户"
      v-model="visible"
      @cancel="cancelModal"
      @ok="saveModal"
      okText="保存"
      cancelText="关闭"
    >
      <a-form :form="form">
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="姓名:">
          <a-input v-decorator="['userName', { rules: [{ required: true, message: '姓名不能为空' }] }]" />
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="用户名:">
          <a-input
            v-decorator="['userId', { rules: [{ required: true, message: '用户名不能为空' }, { validator: handleUserId}] }]"
          />
        </a-form-item>

        <a-form-item
          label="密码"
          class="stepFormText"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input
            type="password"
            v-decorator="['passWord', { rules: [{ required: true, message: '请输入密码' }, { validator: handlePass }] }]"
            name="password"
          />
        </a-form-item>
        <a-form-item
          label="确认密码"
          class="stepFormText"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input
            type="password"
            v-decorator="['confirm_password', { rules: [{ required: true, message: '请输入确认密码' }, { validator: handleConfirmPass }] }]"
            name="confirm_password"
          />
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="角色:">
          <a-select
            v-decorator="['roleTypeId', { rules: [{ required: true, message: '请选择角色' }] }]"
          >
            <a-select-option
              :value="select.RoleTypeCode"
              :key="index"
              v-for="(select,index) in selects"
            >{{select.roleTypeName}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="电话:">
          <a-input
            v-decorator="['phone', { rules: [{ required: true, message: '电话不能为空' }, { validator: handIphone }] }]"
          />
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="智信:">
          <a-input v-decorator="['zhixin']" />
        </a-form-item>
        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="微信:"
          :style="{ display: expand ? 'block' : 'none' }"
        >
          <a-input v-decorator="['wechat']" />
        </a-form-item>
        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="钉钉:"
          :style="{ display: expand ? 'block' : 'none' }"
        >
          <a-input v-decorator="['dingDing']" />
        </a-form-item>
        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="邮箱:"
          :style="{ display: expand ? 'block' : 'none' }"
        >
          <a-input
            v-decorator="['mail']"
          />
        </a-form-item>
      </a-form>
      <a style="margin-left: 50%;" @click="toggle">
        <a-icon :style="{fontSize: '30px' }" :type="expand ? 'caret-up' : 'caret-down'" />
      </a>
    </a-modal>
    <a-table id="table_blue" :pagination="pageOptions" :columns="columns" :dataSource="data">
      <template slot="action" slot-scope="text, record">
        <a-row>
          <a-col :span="8">
            <a href="javascript:;" @click="showModalEdit(record)">编辑</a>
          </a-col>
          <a-col :span="8">
            <a href="javascript:;" @click="detailsData(record)">详情</a>
          </a-col>

          <a-col :span="8">
            <a-popconfirm
              title="确定要删除该用户吗？"
              @confirm="deleData(record)"
              placement="top"
              okText="确定"
              cancelText="取消"
            >
              <a v-if="record.deletFlg" href="javascript:;">删除</a>
            </a-popconfirm>
          </a-col>
        </a-row>
      </template>
    </a-table>
    <a-modal
      :maskClosable="false"
      title="编辑用户"
      v-model="visibleEdit"
      @cancel="cancelModalEdit"
      @ok="saveModalEdit"
      okText="保存"
      cancelText="关闭"
    >
      <a-form :form="formEdit">
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="姓名:">
          <a-input v-decorator="['userName', { rules: [{ required: true, message: '姓名不能为空' }] }]" />
        </a-form-item>
        <template v-if="UserId ==='root'|| UserId ==='admin'">
          <a-form-item
            label="重置密码"
            class="stepFormText"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-input
              type="password"
              v-decorator="['passWord', { rules: [ { validator: handlePassEdit }] }]"
              name="confirm_password"
            />
          </a-form-item>
        </template>

        <template v-else>
          <a-form-item
            label="原密码"
            class="stepFormText"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-input
              type="password"
              v-decorator="['oldPassWord', { rules: [{ required: true, message: '请输入原密码' }] }]"
              name="password"
            />
          </a-form-item>
          <a-form-item
            label="新密码"
            class="stepFormText"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-input
              type="password"
              v-decorator="['passWord', { rules: [ { validator: handlePassEdit }] }]"
              name="confirm_password"
            />
          </a-form-item>
          <a-form-item
            label="确认密码"
            class="stepFormText"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-input
              type="password"
              v-decorator="['confirm_password_Edit', { rules: [{ validator: handleConfirmPassEdit }] }]"
              name="confirm_password"
            />
          </a-form-item>

        </template>

        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="角色:">
          <a-select
            v-decorator="['roleTypeId', { rules: [{ required: true, message: '请选择角色' }] }]"
          >
            <a-select-option
              :value="select.RoleTypeCode"
              :key="index"
              v-for="(select,index) in selects"
            >{{select.roleTypeName}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="电话:">
          <a-input
            v-decorator="['phone', { rules: [{ required: true, message: '电话不能为空' }, { validator: handIphone }] }]"
          />
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="智信:">
          <a-input v-decorator="['zhixin']" />
        </a-form-item>
        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="微信:"
          :style="{ display: expand ? 'block' : 'none' }"
        >
          <a-input v-decorator="['wechat']" />
        </a-form-item>
        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="钉钉:"
          :style="{ display: expand ? 'block' : 'none' }"
        >
          <a-input v-decorator="['dingDing']" />
        </a-form-item>
        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="邮箱:"
          :style="{ display: expand ? 'block' : 'none' }"
        >
          <a-input
            v-decorator="['mail']"
          />
        </a-form-item>
      </a-form>
      <a style="margin-left: 50%;" @click="toggle">
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
    dataIndex: 'userName',
    width: '12%'
  },
  {
    title: '用户名',
    dataIndex: 'userId',
    width: '15%'
  },

  {
    title: '用户组',
    dataIndex: 'roleTypeName',
    width: '15%'
  },
  {
    title: '电话',
    dataIndex: 'phone',
    width: '15%'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: '15%'
  },
  {
    title: '创建者',
    dataIndex: 'createUser',
    width: '12%'
  },
  {
    title: '操作',
    dataIndex: '',
    scopedSlots: { customRender: 'action' },
    width: '16%'
  }
]

export default {
  name: 'mt-consumer-page',
  props: {
    baseUrl: {
      type: String,
      default: '/mtCommonApi'
    }
  },
  data () {
    return {
      password: '', // 新建对比密码
      passwordEdit: '', // 编辑对比密码
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
      UserId: '', // 登录用户
      pageSize: 10, // 条数
      page: 1, // 当前页
      details: {}, // 详情数据
      formNewData: {}, // 新建传输数据
      formNewDataEdit: {}, // 编辑传输数据
      receiveEdit: {},
      pageOptions: {
        // 分页
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50'],
        total: 0,
        onShowSizeChange: (current, size) => {
          // 每页多少条
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
  beforeCreate () {
    this.formData = this.$form.createForm(this)
    this.form = this.$form.createForm(this) // 新建form
    this.formEdit = this.$form.createForm(this) // 编辑form
  },

  created () {
    this.initData()
    if (sessionStorage.getItem('userInfo')) {
      this.UserId = JSON.parse(sessionStorage.getItem('userInfo')).userId
    } else {
      this.$message.warn('当前状态未登录，请先登录')
      this.$router.push('/login')
    }
  },
  methods: {
    toggle () {
      // 改变图标状态
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
          this.$message.error('获取数据列表失败')
          // alert('error')
        })
    },
    selectData () {
      // 下拉数据
      let this_ = this
      request({
        url: `${this_.baseUrl}/Service/API/V1/CHP/role/list/${this_.UserId}`,
        method: 'get'
      })
        .then(res => {
          this.selects = res.data
        })
        .catch(() => {
          this.$message.error('获取下拉角色列表失败')
          // alert('error')
        })
    },

    saveModal (e) {
      // 新建保存发送新建信息
      e.preventDefault()
      let this_ = this
      this.form.validateFields((err, values) => {
        if (!err) {
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
              this.$message.success('新建用户成功')
              this.visible = false
              this.initData()
            })
            .catch(error => {
              this.$message.error(error.msg)
              // alert('error')
            })
        }
      })
    },
    saveModalEdit (e) {
      // 编辑保存发送修改信息
      e.preventDefault()
      let this_ = this
      this.formEdit.validateFields((err, values) => {
        if (!err) {
          this.formNewDataEdit = {
            userId: this.receiveEdit.userId,
            customerName: values.userName,
            customerId: this.receiveEdit.customerId
          }
          for (let value in values) {
            if (value !== 'confirm_password_Edit') {
              this.formNewDataEdit[value] = values[value]
            }
          }
          request({
            url: `${this_.baseUrl}/Service/API/V1/CHP/user/updateUser`,
            method: 'put',
            data: this.formNewDataEdit
          })
            .then(res => {
              this.$message.success('修改成功')
              this.visibleEdit = false
              this.initData()
            })
            .catch(error => {
              this.$message.error(error.msg)
            })
        }
      })
    },
    showModal () {
      // 新建显示
      this.form.resetFields() // 新建重置
      this.visible = true
      this.expand = false
      this.selectData()
    },
    showModalEdit (data) {
      // 编辑显示
      this.formEdit.resetFields() // 编辑重置
      let this_ = this
      this.visibleEdit = true
      this.expand = false
      request({
        url: `${this_.baseUrl}/Service/API/V1/CHP/user/detail/${data.userId}`,
        method: 'get'
      })
        .then(res => {
          this.receiveEdit = res.data
          setTimeout(() => {
            this.formEdit.setFieldsValue({
              // 数据
              zhixin: res.data.zhixin,
              userName: res.data.customerName,
              roleTypeId: res.data.roleTypeId,
              phone: res.data.phone,
              dingDing: res.data.dingDing,
              mail: res.data.mail,
              wechat: res.data.wechat
            })
          }, 100)
        })
        .catch(() => {
          this.$message.error('获取信息失败')
        })

      this.selectData() // 调用下拉数据
    },
    cancelModal () {
      // 新建model关闭
      this.visible = false
    },

    cancelModalEdit () {
      // 编辑model关闭
      this.visibleEdit = false
    },

    deleData (data) {
      // 删除model
      let thisName = this // 赋值this
      request({
        url: `${thisName.baseUrl}/Service/API/V1/CHP/user/delete/${data.userId}`,
        method: 'delete'
      })
        .then(res => {
          this.$message.success('删除成功')

          thisName.initData()
        })
        .catch(() => {
          this.$message.error('删除失败')
        })
    },
    handlePassEdit (rule, value, callback) {
      // 新密码验证
      this.passwordEdit = value
      var mPasswordEdit = /^[!-~]{8,14}$/
      if (value && !value.match(mPasswordEdit)) {
        callback(
          new Error('长度为8-14个字符，支持数字、大小写字母和特殊字符！')
        )
        return
      }
      callback()
    },

    handleConfirmPassEdit (rule, value, callback) {
      // 确认新密码验证
      if (this.passwordEdit && !value) {
        callback(new Error('请输入确认密码'))
        return
      }
      if (value && this.passwordEdit !== value) {
        callback(new Error('两次密码输入不一致!'))
        return
      }
      // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
      callback()
    },

    handleUserId (rule, value, callback) {
      // 用户名验证
      var mUserId = /^[\u4e00-\u9fa5]{1,7}$|^[\dA-Za-z_]{1,14}$/
      if (value && !value.match(mUserId)) {
        callback(new Error('中英文均可，最长14个英文或者7个汉字！'))
        return
      }
      callback()
    },
    handlePass (rule, value, callback) {
      // 新建密码验证
      this.password = value
      var mPassword = /^[!-~]{8,14}$/
      if (value && !value.match(mPassword)) {
        callback(
          new Error('长度为8-14个字符，支持数字、大小写字母和特殊字符！')
        )
        return
      }
      callback()
    },
    handleConfirmPass (rule, value, callback) {
      // 确认密码验证
      if (value && this.password !== value) {
        callback(new Error('两次密码输入不一致!'))
        return
      }
      // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
      callback()
    },
    handIphone (rule, value, callback) {
      // 电话验证
      var mPattern = /^1[2|3|4|5|6|7|8|9]\d{9}$/
      if (value && !value.match(mPattern)) {
        callback(new Error('请输入正确电话号码!'))
        return
      }
      callback()
    },
    detailsData (data) {
      // 详情model
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
                <p style="margin-top：50px;">
                  <span style="width:25%;display:inline-block;text-align: right;margin-right: 20px;">
                    姓名:
                  </span>
                  {this.details.customerName}
                </p>
                <p>
                  <span style="width:25%;display:inline-block;text-align: right;margin-right: 20px;">
                    用户组:
                  </span>
                  {this.details.roleTypeName}
                </p>
                <p>
                  <span style="width:25%;display:inline-block;text-align: right;margin-right: 20px;">
                    电话:
                  </span>
                  {this.details.phone}
                </p>
                <p>
                  <span style="width:25%;display:inline-block;text-align: right;margin-right: 20px;">
                    智信:
                  </span>
                  {this.details.zhixin}
                </p>
                <p>
                  <span style="width:25%;display:inline-block;text-align: right;margin-right: 20px;">
                    微信:
                  </span>
                  {this.details.wechat}
                </p>
                <p>
                  <span style="width:25%;display:inline-block;text-align: right;margin-right: 20px;">
                    钉钉:
                  </span>
                  {this.details.dingDing}
                </p>
                <p>
                  <span style="width:25%;display:inline-block;text-align: right;margin-right: 20px;">
                    邮箱:
                  </span>
                  {this.details.mail}
                </p>
              </div>
            ),
            okText: '关闭',
            centered: true,
            width: 400,
            onOk () {}
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
.filter_box {
  text-align: right;
  margin-bottom: 20px;
}
.container {
  padding: 20px;
  position: relative;
}
.ipt-hid{
  position: absolute;
  top: -10000px;
  }
</style>
