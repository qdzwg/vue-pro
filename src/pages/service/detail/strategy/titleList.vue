<template>
  <div v-if="list.length>1" class="title-ul">
    <span
      v-for="(item,index) in list"
      @click.stop="changeIndex(index)"
      :key="index"
      class="title-li"
      :class="{active:activeIndex==index}"
    >{{titleType=='strategy'?item.subHeading:item.groupName}}</span>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeIndex: this.detailIndex
    };
  },
  props: {
    detailIndex: {
      type: String | Number,
      default: 0
    },
    titleType: {
      type: String,
      default: "strategy"
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    changeIndex(index) {
      this.activeIndex = index;
      this.$emit("indexChange", index);
    }
  }
};
</script>
<style lang="scss" scoped>
.title-ul {
  background: #fff;
  display: flex;
  border-bottom: 1px solid #f6f6f6;
  .title-li {
    flex: 1;
    display: inline-block;
    text-align: center;
    font-size: 15px;
    color: #666666;
    height: 45px;
    line-height: 45px;
    position: relative;
    white-space: nowrap; /*强制不换行*/
    overflow: hidden; /*超出部分隐藏*/
    text-overflow: ellipsis;
    padding: 0 5px;
    &.active {
      color: #f05b47;
      &::after {
        content: "";
        position: absolute;
        left: 50%;
        bottom: 0;
        height: 3px;
        width: 20px;
        transform: translate(-50%, 0);
        background: #f05b47;
      }
    }
  }
}
</style>