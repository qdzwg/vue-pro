<template>
  <!-- 优惠活动 -->
  <div class="discount-bar">
    <div class="discount-list">
      <activeity-item></activeity-item>
    </div>
  </div>
</template>
<script>
import activeityItem from "./activeityItem";
export default {
  components: {
    activeityItem
  }
};
</script>
<style lang="scss" scoped>
.discount-bar {
  align-items: center;
  background: #fff;
  padding-left: 10px;
  .discount-list {
    border-top: 1px solid #e1e1e1;
    padding: 10px 0px;
    padding-right: 10px;
  }
}
</style>