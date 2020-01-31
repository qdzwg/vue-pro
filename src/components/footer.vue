<template>
  <footer id="footer-bottom">
    <grid :show-lr-borders="false" :show-vertical-dividers="false">
      <grid-item label="首页" :link="{ path: '/flexDemo'}">
        <!-- <img slot="icon" src="../assets/images/test.jpg"> -->
        <i slot="icon" style="font-size:26px;" class="xx-icon icon-remai"></i>
      </grid-item>
      <grid-item label="公共服务" :link="{ path: '/flex'}">
        <img slot="icon" src="../assets/images/test.jpg">
      </grid-item>
      <grid-item label="个人中心" :link="{ path: '/test'}">
        <img slot="icon" src="../assets/images/test.jpg">
      </grid-item>
    </grid>
  </footer>
</template>
<script>
import { Grid, GridItem } from "vux";
export default {
  components: {
    Grid,
    GridItem
  },
  data() {
    return {};
  }
};
</script>
<style scoped lang='scss'>
#footer-bottom {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  // height: 49px;
  .weui-grid {
    padding: 0;
  }
}
</style>


