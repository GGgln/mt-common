<template>
  <div class="container">
    <div class="title-btn">
      <h2 class="headline">新建用户</h2>
      <div class="child_btn">
        <a-button @click="cancel">取消</a-button>
        <a-button style="margin-left:20px;" type="primary" @click="addUser">保存</a-button>
      </div>
    </div>
    <h2 class="subtitle ">基本信息</h2>
    <div class="container-min">
      <a-form :form="form">
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="姓名:">
          <a-input v-decorator="['employeeName', { rules: [{ required: true, message: '姓名不能为空' }, { validator: constraintLengthTwo }] }]" />
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="用户名:">
          <a-input v-decorator="['userName', { rules: [{ required: true, message: '用户名不能为空' }, { validator: handleUserId }] }]" />
        </a-form-item>

        <a-form-item label="密码" class="stepFormText" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            type="password"
            v-decorator="['passWord', { rules: [{ required: true, message: '请输入密码' }, { validator: handlePass }] }]"
            @blur="handleConfirmBlur"
          />
        </a-form-item>
        <a-form-item label="确认密码" class="stepFormText" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            type="password"
            v-decorator="['confirm_password', { rules: [{ required: true, message: '请输入确认密码' }, { validator: handleConfirmPass }] }]"
          />
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="角色:">
          <a-select v-decorator="['roleId', { rules: [{ required: true, message: '请选择角色' }] }]">
            <a-select-option :value="select.roleId" :key="index" v-for="(select, index) in selects">{{ select.roleTypeName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="电话:">
          <a-input v-decorator="['phone', { rules: [{ required: true, message: '电话不能为空' }, { validator: handIphone }] }]" />
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="智信:"><a-input v-decorator="['zhixin', { rules: [{ validator: constraintLengthFive }] }]" /></a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="微信:" >
          <a-input v-decorator="['wechat', { rules: [{ validator: constraintLengthFive }] }]" />
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="钉钉:" >
          <a-input v-decorator="['dingding', { rules: [{ validator: constraintLengthFive }] }]" />
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="邮箱:" ><a-input v-decorator="['mail', { rules: [{ validator: constraintLengthFive }] }]" /></a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import request from '../utils/request'
export default {
  name: 'NewTheUser',
  props: {
    baseUrl: {
      type: String,
      default: '/mtCommonApi'
    },
    selects: Array
  },
  data () {
    return {
      confirmDirty: false,
      formNewData: {}, // 新建数据
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 }
      }
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this) // 新建form
  },
  created () {
    this.form.resetFields() // 新建重置
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    addUser (e) {
      e.preventDefault()
      let this_ = this
      this.form.validateFields((err, values) => {
        if (!err) {
          for (let value in values) {
            if (value !== 'confirm_password') {
              this.formNewData[value] = values[value]
            }
          }
          let this_ = this
          request({
            url: `${this_.baseUrl}/Service/API/V1/CHP/user/create`,
            method: 'post',
            data: this.formNewData
          })
            .then(res => {
              this.$emit('save')
              this.$message.success('新建用户成功')
            })
            .catch(error => {
              this.$message.error(error.msg)
            })
        }
      })
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
    constraintLengthTwo(rule, value, callback) {
      // 长度20
      if (value && value.length>20) {
        callback(new Error('长度不能超过20个字符！'))
        return
      }
      callback()
    },
    constraintLengthFive(rule, value, callback) {
      // 长度50
      if (value && value.length>50) {
        callback(new Error('长度不能超过50个字符！'))
        return
      }
      callback()
    },
    handlePass (rule, value, callback) {
      // 新建密码验证
      const form = this.form
      var mPassword = /^[!-~]{8,14}$/
      if (value && !value.match(mPassword)) {
        callback(
          new Error('长度为8-14个字符，支持数字、大小写字母和特殊字符！')
        )
        return
      }
      if (value && this.confirmDirty && value.match(mPassword)) {
        form.validateFields(['confirm_password'], { force: true })
      }
      callback()
    },
    handleConfirmPass (rule, value, callback) {
      // 确认密码验证

      const form = this.form
      if (value && value !== form.getFieldValue('passWord')) {
        callback(new Error('两次密码输入不一致!'))
      } else {
        callback()
      }
    },
    handleConfirmBlur (e) { // 新建密码状态
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    handIphone (rule, value, callback) {
      // 电话验证
      var mPattern = /^1[2|3|4|5|6|7|8|9]\d{9}$/
      if (value && !value.match(mPattern)) {
        callback(new Error('请输入正确电话号码!'))
        return
      }
      callback()
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  .title-btn {
    width: 100%;
    margin-bottom: 20px;
    overflow: hidden;
    .headline {
      display: block;
      float: left;
    }
    .child_btn {
      float: right;
      text-align: right;
    }
  }
  .subtitle {
    margin: 0 0 20px 40px;
  }
  .container-min {
    margin-left: 100px;
    width: 500px;
    height: auto;
    overflow: hidden;
  }
}
</style>
