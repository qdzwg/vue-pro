<template>
  <div
    class="pre-custom-footer"
    :style="{background:pageData.backgroundColor,'border-color':pageData.backgroundLineColor}"
  >
    <div
      class="footer-item"
      v-for="(item,index) in pageData.list"
      :key="index"
      @click="gotoTarget(item)"
      :style="{color:pageData.textColor}"
    >
      <template v-if="index==cureenIndex">
        <img v-if="item.selectImgUrl" class="footer-item-img" :src="item.selectImgUrl+'?imageMogr2/thumbnail/640x/strip/quality/100'" alt>
        <i
          :style="{color:pageData.selectTextColor}"
          v-else
          class="xx-icon"
          :class="iconData[item.linkUrl]"
        ></i>
      </template>
      <template v-else>
        <div v-if="item.defaultImgUrl">
          <img class="footer-item-img" :src="item.defaultImgUrl+'?imageMogr2/thumbnail/640x/strip/quality/100'" alt>
        </div>
        <i v-else class="xx-icon" :class="iconData[item.linkUrl]"></i>
      </template>
      <div
        :style="{color:(index==cureenIndex)?pageData.selectTextColor:''}"
        class="footer-item-title"
      >{{item.title}}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    pageData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      cureenIndex: 0,
      iconData: {
        home: "icon-nav-home",
        order: "icon-nav-orders",
        personal: "icon-member",
        shopcart: "icon-shopping-car",
        ticket: "icon-nav-ticket",
        hotel: "icon-nav-hotel",
        shop: "icon-nav-goods",
        strategy: "icon-nav-raiders",
        route: "icon-nav-tours",
        repast: "icon-nav-foods",
        ai_p: "icon-AIpaiyipai",
        customtel: "icon-bohao"
      }
    };
  },
  methods: {
    select(item, index) {
      this.cureenIndex = index;
    }
  }
};
</script>
<style lang="scss" scoped>
.pre-custom-footer {
  border-top: 1px solid #ffffff;
  height: 58px;
  z-index: 999;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  text-align: center;
  .footer-item {
    height: 58px;
    flex: 1;
    .footer-item-title {
      // color: red;
      font-size: 14px;
    }
    .footer-item-img {
      margin: 6px auto;
      display: block;
      height: 24px;
      width: 24px;
    }
    .xx-icon {
      font-size: 22px;
      // color: red;
    }
  }
}
</style>

