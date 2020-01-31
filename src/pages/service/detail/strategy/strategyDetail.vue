<template>
  <div class>
    <title-list @indexChange="indexChange" :list="detailData.contentVoList"></title-list>
    <detail :data="detailData" isTab :activeIndex="activeIndex"></detail>
  </div>
</template>
<script>
import titleList from "./titleList";
import detail from "./detail";
export default {
  props: {
    detailData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      activeIndex: 0
    };
  },
  methods: {
    indexChange(index) {
      this.activeIndex = index;
    }
  },
  components: {
    titleList,
    detail
  }
};
</script>
<style lang="scss" scoped>
</style>