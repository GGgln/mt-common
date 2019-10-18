<template>
<div class="container">
    <div class="title-btn">
      <h2 class="headline">编辑用户</h2>
      <div class="child_btn">
        <a-button @click="cancelEdit">取消</a-button>
        <a-button style="margin-left:20px;" type="primary" @click="editUser">保存</a-button>
      </div>
    </div>
    <div class="title-psw">
    <h2 class="subtitle ">基本信息</h2>
     <a-button class="change-pawword" type="primary" @click="showModal">修改密码</a-button>
    </div>
     <a-modal
     centered
       :maskClosable="false"
       title="修改密码"
      v-model="visible"
     @cancel="noModel"
       @ok="okModel"
       okText="保存"
       cancelText="取消"
     >
     <a-form :form="formModel">
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
     </a-form>

     </a-modal>
    <div class="container-min">

      <a-form :form="form" >
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="姓名:">
          <a-input v-decorator="['userName', {initialValue:receiveEdit.customerName, rules: [{ required: true, message: '姓名不能为空' }] }]" />
        </a-form-item>

        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="角色:">
          <a-select v-decorator="['roleTypeId', {initialValue:receiveEdit.roleTypeCode, rules: [{ required: true, message: '请选择角色' }] }]">
            <a-select-option :value="select.RoleTypeCode" :key="index" v-for="(select, index) in selects">{{ select.roleTypeName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="电话:">
          <a-input v-decorator="['phone', {initialValue:receiveEdit.phone, rules: [{ required: true, message: '电话不能为空' }, { validator: handIphone }] }]" />
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="智信:"><a-input v-decorator="['zhixin',{initialValue:receiveEdit.zhixin}]" /></a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="微信:" >
          <a-input v-decorator="['wechat',{initialValue:receiveEdit.wechat}]" />
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="钉钉:" >
          <a-input v-decorator="['dingDing',{initialValue:receiveEdit.dingDing}]" />
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="邮箱:" ><a-input v-decorator="['mail',{initialValue:receiveEdit.mail}]" /></a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import request from '../utils/request'
export default {
  name: 'EditTheUser',
  props: {
    baseUrl: {
      type: String,
      default: '/mtCommonApi'
    },
    selects: Array,
    receiveEdit: Object

  },
  data () {
    return {
      visible: false, // model状态
      EditData: {}, // 修改数据
      EditDataModel: {}, // 修改密码数据
      confirmDirty: false,
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
    this.formModel = this.$form.createForm(this) // 新建formEdit---model
  },
  created () {
    this.formModel.resetFields() // model重置
    this.form.resetFields() // 新建重置
  },
  methods: {

    noModel () {
      this.visible = false
    },
    okModel (e) {
      e.preventDefault()
      this.formModel.validateFields((err, values) => {
        if (!err) {
          this.EditDataModel = {userCode: this.receiveEdit.userCode, passWord: values.passWord}
          let this_ = this
          request({
            url: `${this_.baseUrl}/Service/API/V1/CHP/user/resetPassword`,
            method: 'post',
            data: this.EditDataModel
          })
            .then(res => {
              this.visible = false
              this.$message.success('密码修改成功')
            })
            .catch(error => {
              this.$message.error(error.msg)
            })
        }
      })
    },

    showModal () {
      this.formModel.resetFields() // model重置
      this.visible = true
    },

    cancelEdit () {
      this.$emit('cancelEdit')
    },
    editUser (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.EditData = {userCode: this.receiveEdit.userCode}
          for (let value in values) {
            this.EditData[value] = values[value]
          }

          let this_ = this
          request({
            url: `${this_.baseUrl}/Service/API/V1/CHP/user/updateUser`,
            method: 'put',
            data: this.EditData
          })
            .then(res => {
              this.$emit('edit')
              this.$message.success('修改信息成功')
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
    handlePass (rule, value, callback) {
      // 新建密码验证
      const form = this.formModel
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

      const form = this.formModel
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
  .title-psw{
    width: 100%;
    height: auto;
    overflow: hidden;
    margin-bottom: 20px;
  .subtitle {
    margin: 0 0 0 40px;
    display: block;
    float: left;
  }
  .change-pawword{
float: right;
  }
  }
  .container-min {
    margin-left: 100px;
    width: 500px;
    height: auto;
    overflow: hidden;
  }
}
</style>
