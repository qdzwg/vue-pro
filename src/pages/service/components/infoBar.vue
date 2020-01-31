<template>
  <div class="bar-warpper m-b-10">
    <div class="bar-header">
      <h2 class="bar-title">{{title}}</h2>
      <div>
        <slot name="navigation"></slot>
      </div>
    </div>

    <div class="ticket-detail-box">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: "这种"
    }
  },
  watch: {
    pageData(val) {
      this.detailData = val;
    }
  },
  data() {
    return {
      detailData: {}
    };
  },
  mounted() {
  },
};
</script>
<style lang="scss" scoped>
@import "../../../assets/styles/mixin.scss";
.bar-warpper {
  background: #fff;
  color: #413838;
  .bar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    height: 58px;
    line-height: 58px;
  }
  .bar-title {
    @include sc(18px, #413838);
    font-weight: bold;
  }
  .ticket-detail-box {
    padding: 0px 15px 25px 15px;
    color: #413838;
    font-size: 14px;
  }
}
</style>