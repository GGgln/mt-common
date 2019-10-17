<template>
  <div id="MtLogin_component" class="login">
    <div class="content">
      <div class="login_wrap">
        <div class="login-con">
          <p>欢迎登录</p>
          <a-form class="filter_box" :form="formLogin">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="账号">
              <a-input
                placeholder="请输入用户名"
                v-decorator="['userId', { rules: [{ required: true, message: '请输入用户名' }] }]"
              >
                <img class="img-ipt" slot="prefix" src="./user.png" alt />
              </a-input>
            </a-form-item>
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="密码">
              <a-input
                type="password"
                placeholder="请输入密码"
                v-decorator="['passWord', { rules: [{ required: true, message: '请输入密码' }] }]"
              >
                <img class="img-ipt" slot="prefix" src="./psw.png" alt />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-button class="login-btn" @click="login" type="primary">登录</a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import request from "../utils/request";
export default {
  name: "mt-login",
  props: ["baseUrl"],
  data() {
    return {
      formLogin: this.$form.createForm(this), // 新建form
      form: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 }
      }
    };
  },
  methods: {
    login(e) {
      e.preventDefault();

      let this_ = this;
      this.formLogin.validateFields((err, values) => {
        console.log(values)
        if (!err) {
          
          for (let value in values) {
            this.form[value] = values[value];
          }
          request({
            url: `${this_.baseUrl}/Service/API/V1/CPH/login`,
            method: "post",
            data: this.form
          })
            .then(res => {
              this.$message.success("登录成功");
              this.$emit("loginToNext", res);
            })
            .catch(error => {
              this.$message.warn(error.msg);
            });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.login {
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  margin: auto;
  box-sizing: border-box;
  background: url(./login.png) no-repeat;
  background-size: 100%;
  .content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .login_wrap {
      width: 28%;
      margin-top: 14%;
      float: right;
      margin-right: 9%;
    }
    .login-con {
      width: 420px;
      background-color: white;
      margin: 0 auto;
      padding: 30px 40px;

      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      p {
        color: #2c9ae6;
        font-size: 22px;
        letter-spacing: 2px;
        margin-bottom: 30px;
      }
      .hint {
        height: 20px;
        display: block;
        font-size: 15px;
        line-height: 20px;
        width: 100%;
        color: red;
      }
      .login-btn {
        width: 85%;
        height: 40px;
        display: block;
        margin: 0 auto;
        margin-top: 10px;
        font-size: 18px;
        text-align: center;
        letter-spacing: 4px;
        background-color: #2c9ae6;
      }
      .img-ipt {
        width: 16px;
      }
    }
  }
}
</style>
