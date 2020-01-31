<template>
  <div class="strategy-body">
   <!-- detailIndex {{detailIndex}}
    showIndex{{showIndex}} -->
    <template v-if="detailIndex!=showIndex">
      <template v-for="(item,index) in list">
        <stragegy
          category="strategyGroup"
          v-if="index==showIndex"
          :key="index"
          :comData="data"
          :cureenIndex="index"
          :menuType="menuType"
          :listType="listType"
          :pageData="item"
          :list="list"
        ></stragegy>
      </template>
    </template>
    <slot v-else></slot>
  </div>
</template>
<script>
import stragegy from "../strategy";
export default {
  components: {
    stragegy
  },
  props: {
    detailIndex: {
      type: String | Number,
      default: -1
    },
    data: {
      type: Object,
      default: () => {}
    },
    menuType: {
      type: String
    },
    listType: {
      type: String
    },
    showIndex: {
      type: String | Number,
      default: 0
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    showIndex(val) {
      this.activeIndex = val;
    }
  },
  data() {
    return {
      activeIndex: this.showIndex
    };
  }
};
</script>
<style lang="scss">
</style>