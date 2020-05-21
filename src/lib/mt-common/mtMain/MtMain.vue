<template>
  <div id="mt-main">
    <header>
      <div class="left">
        <div class="logo">
          <img :src="logoUrl" alt="">
        </div>
      </div>
      <slot></slot>
    </header>
    <slot name="mt-main-content" />
    <footer>底部</footer>
  </div>
</template>
<script>
export default {
  name: 'mt-main',
  props: {
    logoUrl: {
      type: String,
      default: require('./logo.png')
    }
  }
}
</script>
<style lang="scss" scoped>
header{
  img{
    width: 274px;
    height: 70px;
  }
}
</style>