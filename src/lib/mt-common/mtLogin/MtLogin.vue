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
                style="height:44px;"
                v-decorator="['userId', { rules: [{ required: true, message: '请输入用户名' }] }]"
              ></a-input>
            </a-form-item>
            <a-form-item label="密码" has-feedback>
              <a-input
                type="password"
                style="height:44px"
                placeholder="请输入密码"
                v-decorator="['passWord', { rules: [{ required: true, message: '请输入密码' }] }]"
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
import request from "../utils/request";
export default {
  name: "mt-login",
  props: {
    baseUrl: {
      type: String,
      default: "/mtComonApi"
    },
    title: {
      type: String,
      default: "我们帮助优秀组织创造更大的影响",
      required:false
    },
    slogan: {
      type: String,
      default:
        "我们将智慧与技术融合在一起，帮助企业在数字化、自动化转型时代成长。引领工矿业迈入智能化时代，成为行业的创新者与领导者！",
      required:false
    },
    itemName: {
      type: String,
      required: true
    },
    logo: {
      type: String,
      required:false
    }
  },
  data() {
    return {
      form: {},
      formLogin: this.$form.createForm(this) // 新建form
    };
  },
  methods: {
    login(e) {
      let this_ = this;
      this.formLogin.validateFields((err, values) => {
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
.ant-form-item-label label {
  font-size: 16px !important;
  color: #6e7172;
}
.login {
  width: 100%;
  height: 100vh;
  position: relative;
  .login_con {
    width: 828px;
    height: 546px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    overflow: hidden;
  }
  .con_l {
    width: 368px;
    height: 546px;
    box-sizing: border-box;
    padding: 35px;
    background: url(./bg_l.png) no-repeat center;
    float: left;
    color: #fff;
    position: relative;
    h4 {
      font-size: 28px;
      color: #fff;
      width: 260px;
      letter-spacing: 3px;
      margin-top: 30px;
      line-height: 1.9;
    }
    p {
      font-size: 16px;
      line-height: 1.8;
      margin-top: 66px;
      text-align: justify;
    }
    img {
      position: absolute;
      left: 30px;
      bottom: 38px;
    }
  }
  .con_r {
    width: 460px;
    height: 546px;
    background: #fff;
    float: left;
    text-align: center;
    h5 {
      font-size: 30px;
      color: #35444f;
      line-height: 42px;
      margin-top: 46px;
      margin-bottom: 15px;
    }
    p {
      font-size: 18px;
      color: #6e7172;
    }
    span {
      color: #2c9ae6;
    }
  }
  .form_div {
    width: 340px;
    margin: 40px auto;
    text-align: left;

    
   
    .ant-form-explain {
      margin-top: 4px;
    }
    .login-btn {
      width: 100%;
      height: 46px;
      font-size: 18px;
      margin-top: 20px;
    }
  }
}
</style>
