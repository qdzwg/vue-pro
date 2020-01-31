<template>
  <div class="pay-result-module">
    <!-- 支付结果详情 -->
    <status-text v-if="pageData.type === 'info'" 
      :payOrderInfo="otherDatas.payOrderDetail" 
    ></status-text>
    <!-- 买即送优惠券 -->
    <coupons-module v-if="pageData.type === 'coupons'"
      :payOrderInfo="otherDatas.payOrderDetail" 
      :listData="otherDatas.listData"
    ></coupons-module >
    <!-- 功能按钮区 -->
    <button-module 
      :payOrderInfo="otherDatas.payOrderDetail" 
    v-if="pageData.type === 'button'"></button-module >
  </div>
</template>
<script>
import statusText from './statusText'
import couponsModule from './couponsModule'
import buttonModule from './buttonModule'
export default {
  props:{
    pageData:{
      type:Object,
      default:() => {return{}}
    },
    otherDatas:{
      type:Object,
      default:() => {return{}}
    }
  },
  components:{
    statusText,
    couponsModule,
    buttonModule
  },
  data(){
    return {
      merchantInfoId: "", //店铺id
      payOrderDetail:{},
      listData: [],
    }
  },
  methods:{
    /**
     * vue跳转链接
     * @method goUrl
     * @param {string} path 地址
     */
    goUrl(path) {
      this.$router.push(path);
    },
    /**
     * window 跳转链接
     * @method go
     * @param {string} path 地址
     */
    go(path) {
      if (path) {
        window.location.href = path;
      }
    },
  },
  created(){
    console.log('创建result')
  },
  destroyed(){

  }
}
</script>
<style lang="scss">
  
</style>