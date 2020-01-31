<template>
  <div class="discount-item">
    <span class="discount-title">会员优享</span>
    <span v-if='noTxt' class="discount-txt">部分门票享受优惠</span>
  </div>
</template>
<script>
export default {
    props:{
        noTxt:{
           type:Boolean,
           default:true 
        }
    }
}
</script>
<style lang="scss">
.discount-item {
  display: flex;
  align-items: center;
  .discount-title {
    height: 20px;
    line-height: 20px;
    border-radius: 4px;
    padding: 0 4px;
    background: #eb776f;
    font-size: 12px;
    color: #fff;
  }
  .discount-txt {
    font-size: 14px;
    color: #413838;
    margin-left: 8px;
  }
}
</style>