<template>
  <div class="info-wrapper">
    <div class="info-heder">{{title}}</div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    }
  }
};
</script>
<style lang="scss" scoped>
.info-wrapper {
  background: #fff;
  padding: 0 10px;
  padding-bottom: 20px;
  .info-heder {
    height: 37px;
    line-height: 37px;
    color: #413838;
    font-size: 14px;
    background: #f8f8f8;
    padding: 0 10px;
    font-weight: bold;
    margin-bottom: 5px;
  }
  .table-default {
    width: 100%;
    td {
      padding: 5px 0;
      font-size: 12px;
      color: #413838;
      word-break: break-all;
      .top {
        vertical-align: super;
      }
    }
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    .list-item {
      width: 33.3%;
      display: flex;
      height: 40px;
      align-items: center;
      font-size: 12px;
      color: #413838;
      .icon-gou2 {
        color: #00c94e;
        margin-right: 3px;
        font-size: 12px;
      }
    }
  }
}
</style>