<template>
  <div  class="container">
    <div class="title-btn">
      <h2 class="headline">用户详情</h2>
      <div class="child_btn">
        <a-button @click="show">X</a-button>
      </div>
    </div>
    <h2 class="subtitle ">基本信息</h2>
    <div class="container-min">
    <a-row class="min-row">
      <a-col :span="5"><p class="row-title">姓名：</p></a-col>
      <a-col :span="15"><p class="row-center">{{details.customerName}}</p></a-col>
    </a-row>
    <a-row class="min-row">
      <a-col :span="5"><p class="row-title">角色：</p></a-col>
      <a-col :span="15"><p class="row-center">{{details.roleTypeName}}</p></a-col>
    </a-row>
    <a-row class="min-row">
      <a-col :span="5"><p class="row-title">电话：</p></a-col>
      <a-col :span="15"><p class="row-center">{{details.phone}}</p></a-col>
    </a-row>
    <a-row class="min-row">
      <a-col :span="5"><p class="row-title">智信：</p></a-col>
      <a-col :span="15"><p class="row-center">{{details.zhixin}}</p></a-col>
    </a-row>
    <a-row class="min-row">
      <a-col :span="5"><p class="row-title">微信：</p></a-col>
      <a-col :span="15"><p class="row-center">{{details.wechat}}</p></a-col>
    </a-row>
    <a-row class="min-row">
      <a-col :span="5"><p class="row-title">钉钉：</p></a-col>
      <a-col :span="15"><p class="row-center">{{details.dingDing}}</p></a-col>
    </a-row>
    <a-row class="min-row">
      <a-col :span="5"><p class="row-title">邮箱：</p></a-col>
      <a-col :span="15"><p class="row-center">{{details.mail}}</p></a-col>
    </a-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Particulars',
  props: {
    baseUrl: {
      type: String,
      default: '/mtCommonApi'
    },
    details: Object

  },
  data () {
    return {
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
  methods: {
    show () {
      this.$emit('show')
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
    .min-row{
margin-bottom: 15px;
    .row-title,{
text-align: right;
padding-right: 10px;
box-sizing: border-box;
    }
    .row-center{
      text-align: left;
      box-sizing: border-box;
      padding-left: 10px;
    }
    }
  }
}
</style>
