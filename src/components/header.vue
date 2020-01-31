<template>
  <header id="head_top">
    <span v-if="isBack" @click="$router.go(-1)" class="xx-icon icon-xiangzuojiantou back-icon"></span>
    <div class="page-title">{{title}}</div>
  </header>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: "标题"
    },
    isBack: {
      type: Boolean,
      default: true
    }
  }
};
</script>
<style scoped lang='scss'>
#head_top {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  height: 49px;
  background: #fff;
  z-index: 999;
  .back-icon {
    position: absolute;
    top: 0px;
    left: 0;
    padding: 12px 15px;
    font-weight: 600;
    color: #111111;
  }
  .page-title {
    text-align: center;
    height: 49px;
    line-height: 49px;
    color: #333333;
    font-size: 18.5px;
    margin: 0 50px;
  }
}
</style>


