<template>
  <div class="tag-list">
    <span v-for="(item,index) in list" :key="index" class="tag-item">{{item}}</span>
  </div>
</template>
<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  }
};
</script>
<style lang="scss" scoped>
.tag-list {
  position: absolute;
  left: 11.5px;
  top: 13.5px;
  display: flex;
  flex-wrap: wrap;
  .tag-item {
    display: inline-block;
    background: linear-gradient(bottom left, #ffa926, #ffc538);
    // background: #ffb72f;

    height: 20px;
    line-height: 20px;
    text-align: center;
    padding: 0 10px;
    font-size: 12px;
    color: #fff;
    border-radius: 3px;
    margin-right: 5px;
    margin-bottom: 5px;
  }
}
</style>