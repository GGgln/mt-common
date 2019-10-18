<template>
  <div id="MtLogin_component" class="login">
    <div class="login_con">
      <div class="con_l">
        <h4>{{title}}</h4>
        <p>{{slogan }}</p>
        <img :src="logo" alt />
      </div>
      <div class="con_r">
        <h5>Hello!</h5>
        <p>
          欢迎登录
          <span>{{itemName}}</span>
        </p>
        <div class="form_div">
          <a-form class="filter_box" :form="formLogin">
            <a-form-item label="账号" has-feedback >
              <a-input
                placeholder="请输入用户名"
                style="height:36px;"
                v-decorator="['userCode', { rules: [{ required: true, message: '请输入用户名' }] }]"
                @pressEnter = 'login'
              ></a-input>
            </a-form-item>
            <a-form-item label="密码" has-feedback>
              <a-input
                type="passWord"
                style="height:36px"
                placeholder="请输入密码"
                v-decorator="['passWord', { rules: [{ required: true, message: '请输入密码' }] }]"
                @pressEnter = 'login'
              ></a-input>
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
import request from '../utils/request'
export default {
  name: 'mt-login',
  props: {
    baseUrl: {
      type: String,
      default: '/mtCommonApi'
    },
    title: {
      type: String,
      default: '为用户创造价值、团队第一；激情、创新、诚信、奉献！',
      required: false
    },
    slogan: {
      type: String,
      default:
        '引领工矿业迈入智能化时代，成为行业的创新者与领导者，为利益相关方和社会创造价值！',
      required: false
    },
    itemName: {
      type: String,
      required: true
    },
    logo: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      form: {},
      formLogin: this.$form.createForm(this) // 新建form
    }
  },
  methods: {
    login (e) {
      let this_ = this
      this.formLogin.validateFields((err, values) => {
        if (!err) {
          for (let value in values) {
            this.form[value] = values[value]
          }
          console.log(this.form)
          request({
            url: `${this_.baseUrl}/Service/API/V1/CPH/login`,
            method: 'post',
            data: this.form
          })
            .then(res => {
              this.$message.success('登录成功')
              this.$emit('loginToNext', res)
            })
            .catch(error => {
              this.$message.warn(error.msg)
            })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.ant-form-item-label label {
  font-size: 16px !important;
  color: #6e7172;
}
.ant-form-item{
  margin-bottom:10px;
}
.login {
  width: 100%;
  height: 100vh;
  position: relative;
  .login_con {
    width: 662px;
    height: 436px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    overflow: hidden;
  }
  .con_l {
    width: 294px;
    height: 436px;
    box-sizing: border-box;
    padding: 35px;
    background: url(./bg_l.png) no-repeat center;
    float: left;
    color: #fff;
    position: relative;
    h4 {
      font-size: 22px;
      color: #fff;
      width: 230px;
      letter-spacing: 1px;
      margin-top: 25px;
      line-height: 1.8;
      text-align: justify;
    }
    p {
      font-size: 13px;
      line-height: 1.9;
      margin-top: 50px;
      text-align: justify;
    }
    img {
      position: absolute;
      left: 30px;
      bottom: 38px;

    }
  }
  .con_r {
    width: 357px;
    height: 436px;
    background: #fff;
    float: left;
    text-align: center;
    h5 {
      font-size: 24px;
      color: #35444f;
      line-height: 34px;
      margin-top: 40px;
      margin-bottom: 15px;
    }
    p {
      font-size: 15px;
      color: #6e7172;
    }
    span {
      color: #2c9ae6;
    }
  }
  .form_div {
    width: 272px;
    margin: 30px auto;
    text-align: left;
    .ant-form-explain {
      margin-top: 4px;
    }
    .login-btn {
      width: 100%;
      height: 36px;
      font-size: 16px;
      margin-top: 30px;
    }
  }
}
</style>
