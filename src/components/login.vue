<template>
  <div class='login' style="background:#121212">
    <mt-login :itemName='itemName' :logo='logo'></mt-login>
  </div>
</template>
<script>
export default {
  name:'',
  data(){
    return{
      itemName:'神华准能哈尔乌素',
      logo:require('../lib/mt-common/mtLogin/login.png')
    }
  }
}
</script>
