<template>
  <div class="fixed-template-footer" :style="{background:pageData.backgroundColor}">
    <div
      v-for="(item,index) in pageData.list"
      :key="index"
      class="footer-item"
      @click="footerUrl(item.linkType)"
    >
      <i :style="{color:pageData.fontColor}" class="xx-icon" :class="item.icon"></i>
      <div :style="{color:pageData.fontColor}" class="footer-title">{{item.title}}</div>
    </div>
  </div>
</template>
<script>
import { linkBaseUrl } from "../../../../config/index"
export default {
  props: {
    pageData: {
      type: Object,
      default: {}
    }
  },
  mounted(){
  },
  methods: {
    footerUrl(type) {
      switch (type) {
        case "home":
        // 首页的话不跳转
          // window.location.href = linkBaseUrl + '/?m_id=' + localStorage.getItem('xjsc_vue_2018_12_19_mid')
           window.location.reload()
          break;
        case "order":
         window.location.href = linkBaseUrl + '/list/order?m_id=' + localStorage.getItem('xjsc_vue_2018_12_19_mid')
          break;
        case "member":
          window.location.href = linkBaseUrl + '/member?m_id=' + localStorage.getItem('xjsc_vue_2018_12_19_mid')
          break;
        default:
          console.log("没有找到对饮的类型");
          break;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.fixed-template-footer {
  background: #fff;
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
  display: flex;
  text-align: center;
  height: 50px;
  align-items: center;
  .footer-item {
    flex: 1;

    .xx-icon {
      font-size: 18px;
      color: #303043;
    }
    div.footer-title {
      font-size: 12px;
      color: #303043;
    }
  }
}
</style>
