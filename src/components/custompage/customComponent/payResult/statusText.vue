<template>
  <div class="info-module">
    <div v-if="payOrderInfo.payStatus == 1" class="info-module-item info-module-success">
        <div class="info-module-icon">
          <i class="xx-icon icon-yuanxingxuanzhongfill"></i>
        </div>
        <div class="info-module-message">订单支付成功</div>
    </div>   
    <div v-else class="info-module-item info-module-handle">
        <div class="info-module-icon">
          <i class="xx-icon icon-jinxingzhong"></i>
        </div>
        <div class="info-module-message">订单处理中</div>     
    </div>  
    <div class="info-module-name">{{payOrderInfo.nickName}}</div>
    <div v-if="orderType === 'mdse'" class="info-module-detail">已成功提交</div>
    <div v-else class="info-module-detail">已成功提交，请查收您的<span class="c-base">短信</span></div>
    <div v-if="deliveryType === '自提'" class="info-module-detail">该订单为到店自提订单，到店后出示凭证即可提货</div> 
  </div>
</template>
<script>

export default {
  props:{
    payOrderInfo:{
      type:Object,
      default:()=>{return{}}
    }
  },
  data(){
    return {
        orderInfo:{},
        orderType:"",
        deliveryType:""
    }
  },
  computed:{
  },
  created(){
    try {
        this.orderInfo = JSON.parse(this.payOrderInfo.orderInfoJson);
        this.orderType = this.orderInfo[0].orderType;
    } catch (error) {}
    this.deliveryType = this.payOrderInfo.deliveryType;
  }
}
</script>
<style lang="scss">
  .info-module {
    min-height: 208px;
    background: white;
    &-name {
      font-size: 16px;
      line-height: 1.5;
      color: #413838;
      text-align: center;
      padding: 0.25rem 0.45rem 0.05rem;
    }
    &-item {

    }
    &-icon {
      padding-top: 15px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      .xx-icon {
        font-size: 55px;
        color: #1AAD19;
      }
    }
    &-message {
      font-size:22px;
      font-family:PingFang SC;
      font-weight:500;
      color:#413838;
      line-height:28px;
      text-align: center;
      padding-bottom: 5px;
    }
    &-detail {
      font-size:12px;
      font-family:PingFang SC;
      font-weight:500;
      color:#666;
      line-height:18px;
      text-align: center;
      .c-base {
        color: #19a0f0
      }
    }
  }
</style>