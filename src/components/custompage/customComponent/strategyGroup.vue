<template >
  <div class="strategy-group" ref="strategyGroupref">
    <!-- {{pageData.pageInteraction}} -->
    <strategy-menu
      @indexChange="change"
      :isFixed="isFixed"
      :list="pageData.list"
      :activeColor="pageData.activeColor"
      :menuType="pageData.menuType"
    ></strategy-menu>
    <strategy-content
      :data="pageData"
      :showIndex="activeIndex"
      :menuType="pageData.menuType"
      :listType="pageData.listType"
      :list="pageData.list"
    ></strategy-content>
  </div>
</template>
<script>
import strategyMenu from "./module/menu";
import strategyContent from "./module/strategyContent";
export default {
  components: {
    strategyMenu,
    strategyContent
  },
  data() {
    return {
      isFixed: false,
      activeIndex: 0
    };
  },
  props: {
    pageData: {
      type: Object
    }
  },
  destroyed() {
    if (this.pageData.pageInteraction == "autoTop") {
      window.removeEventListener("scroll", this.scrollFn);
    }
  },
  created() {},
  mounted() {
    this.scrollFn = () => {
      let flag = true;
      if (flag) {
        this.refHeight = this.$refs.strategyGroupref.offsetTop;
        flag = false;
        console.log(this.refHeight);
      }
      this.documentScrollHeight =
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        window.pageYOffset;
      if (this.documentScrollHeight > this.refHeight) {
        this.isFixed = true;
      } else {
        this.isFixed = false;
      }
    };
    this.$nextTick(() => {
      if (this.pageData.pageInteraction == "autoTop") {
        window.addEventListener("scroll", this.scrollFn);
      }
      // this.heightInit();
      // this.scrolInit();
    });
  },
  methods: {
    change(index) {
      // this.activeIndex = index;
      console.log(this.pageData);
      let _this = this;
      this.index = index;
      if (index == this.activeIndex) {
        return false;
      } else {
        this.activeIndex = index;
        // this.currentIndex = index;
        // this.viewId = "list-" + index;
      }
      this.flag = false;
      this.$nextTick(() => {
        if (this.isFixed && this.pageData.list[index].dataList.length) {
          window.scrollTo(0, this.refHeight);
        }
      });
    }
  }
};
</script>
<style lang="scss">
</style>