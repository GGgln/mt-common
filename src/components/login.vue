<template>
  <div class='login' style="background:#121212">
    <mt-login :itemName='itemName' :logo='logo' :title='title' :slogan='slogan'></mt-login>
  </div>
</template>
<script>
export default {
  name:'',
  data(){
    return{
      title:'为用户创造价值、团队第一；激情、创新、诚信、奉献！',
      slogan:'引领工矿业迈入智能化时代，成为行业的创新者与领导者，为利益相关方和社会创造价值！',
      itemName:'神华准能哈尔乌素',
      logo:require('../lib/mt-common/mtLogin/login.png')
    }
  }
}
</script>
