<template>
  <div class="pre-custom-footer" :style="{background:pageData.bgColor}">
    <div
      class="footer-item"
      v-for="(item,index) in pageData.list"
      :key="index"
      @click="select(item,index)"
      :style="{background:cureenIndex==index?pageData.selectColor:''}"
    >
      <img v-if='item.picAddr' class="footer-item-img" :src="item.picAddr" alt>
      <i v-else class="xx-icon" :class="item.icon"></i>
      <div class="footer-item-title">{{item.name}}</div>
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
  data() {
    return {
      cureenIndex: 0
    };
  },
  methods: {
    select(item, index) {
      this.cureenIndex = index;
      this.goFooterUrl(item)
    },
    goFooterUrl(item){
        if(item.linkType=='/'){
          //首页
           window.location.reload()
        }else if(item.linkType=='/list/order'){
          //订单列表
          window.location.href = linkBaseUrl + '/list/order?m_id=' + localStorage.getItem('xjsc_vue_2018_12_19_mid')
        }else if(item.linkType=="/member"){
          //个人中心
          window.location.href = linkBaseUrl + '/member?m_id=' + localStorage.getItem('xjsc_vue_2018_12_19_mid')
        }else if(item.linkType=="/group/orderList"){
          //拼团列表
            window.location.href = linkBaseUrl + '/group/orderList?m_id=' + localStorage.getItem('xjsc_vue_2018_12_19_mid')
        }
    }
  }
};
</script>
<style lang="scss" scoped>
.pre-custom-footer {
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
      color: #ffffff;
      font-size: 14px;
    }
    .footer-item-img {
        margin-top: 10px;
      height: 24px;
      width: 24px;
    }
    .xx-icon{
        font-size: 22px;
        color: #fff;
    }
  }
}
</style>

