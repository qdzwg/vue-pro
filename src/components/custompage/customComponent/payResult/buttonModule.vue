<template>
  <div class="button-module">
    <!-- 人脸补录 -->
    <!-- <div class="button-module-item"
      v-if="payOrderInfo.realNameFaceUrl === 'T' || payOrderInfo.needFaceUrl === 'T'"
    >
      <div class="button-notice">提前录入人脸，到景区可刷脸入园；进行人脸录入，请确保本人操作</div>
      <abi-rlsb @returnFaceUrl="getUrl">
        <div class="button-module-btn face-btn" :class="{'bg-blue':needFaceUrl}" type="button">开始录入人脸</div>
      </abi-rlsb>
    </div> -->

    <!-- 添加到微信卡包 -->
    <!-- <div class="button-module-item"
      v-if="isWeiXin"
    >
      <div @click="addWxPakage" class="button-module-btn">添加到微信卡包</div>
    </div> -->
    <!-- 查看待支付订单 -->
    <div class="button-module-item"
      v-if="payOrderInfo.payStatus == 0"
    >
      <div @click="go('/list/order?orderStatus=0&m_id='+ merchantInfoId)" class="button-module-btn">查看订单</div>
    </div>
    
    <!-- 查看我的拼团 -->
    <div class="button-module-item"
      v-else-if="payOrderInfo.marketingType == 2"
    >
      <div @click="go('/group/orderList?m_id=' + merchantInfoId)" class="button-module-btn">查看我的拼团</div>
    </div>
    <!-- 常规完成订单按钮区 -->
    <div v-else class="button-module-item">
      <!-- 查看二维码 -->
      <div v-if="orderType === 'park' && (typeof payOrderInfo.isShowCheckNo === 'undefined' || payOrderInfo.isShowCheckNo === 'T')" 
        @click="go('/member/myTicket?id='+ orderIds +'&from=pay&m_id='+merchantInfoId)" 
        class="button-module-btn">查看二维码</div>
      <!-- 查看订单 -->
      <div v-else @click="go('/list/order?m_id='+merchantInfoId)" class="button-module-btn">查看订单</div>
    </div>

  </div>
</template>
<script>
// 艾比人脸识别
import abiRlsb from "@/components/abiRlsb";
import { isWxAli } from "@/common/common";
import { wxPackage } from "@/common/wxPackage";
export default {
  components:{
    abiRlsb
  },
  props:{
    payOrderInfo:{
      type:Object,
      default:()=>{return{}}
    }
  },
  data(){
    return {
      isWeiXin:false, // 是否为微信端
      wxCheckData:'', // 微信卡包
      orderInfo:[],
      orderType:""
    }
  },
  computed:{
    merchantInfoId(){
      return this.payOrderInfo.accountId
    },
    orderIds(){
      let idArray = [];
      if (this.orderInfo.length > 0) {
        this.orderInfo.forEach((item) => {
          idArray.push(item.id)
        })
      }
      return idArray.join(',')
    }
  },
  watch:{
    payOrderInfo(val){
      if(typeof val.orderInfoJson === 'string') {
        this.orderInfo = JSON.parse(val.orderInfoJson);
        if (this.orderInfo instanceof Array && this.orderInfo.length > 0) {
          this.orderType = this.orderInfo[0].orderType;
        }
      }   
    }
  },
  created(){
    let env = isWxAli();
    this.isWeiXin = env.isWx;
    // 微信环境下，获取添加卡包的校验码
    if (env.isWx) this.getWxCardOrderList();
    if(typeof this.payOrderInfo.orderInfoJson === 'string') {
      this.orderInfo = JSON.parse(this.payOrderInfo.orderInfoJson);
      if (this.orderInfo instanceof Array && this.orderInfo.length > 0) {
        this.orderType = this.orderInfo[0].orderType;
      }
    }   
  },
  methods:{
    /**
     * 查看二维码
     * @method goQrPage
     */
    goQrPage(){
      this.go('/member/myTicket?id='+this.orderIds+'&from=pay&m_id='+this.merchantInfoId)
    },
    /**
     * 微信端获取卡包列表
     * @method getWxCardOrderList
     */
    getWxCardOrderList(){
      this.getAxios(this.api.main.wechat.getWxCardOrderList,{
        payOrderNo:this.payOrderInfo.payOrderNo,
        merchantInfoId:this.merchantInfoId
      }).then(res => {
        if (res.status === 200) {
          this.wxCheckData = res.data.message
        }
      })
    },
    /**
     * 添加到微信卡包
     * @method addWxPakage
     */
    addWxPakage(){
      // TODO
      wxPackage()
    },
    getUrl(){

    },
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
  }
}
</script>
<style lang="scss">
  .button-module {
    padding: 15px;
    &-btn {
      width: 345px;
      height: 44px;
      line-height: 44px;
      background-color: #009DED;
      box-shadow:0px 3px 4px 0px rgba(0, 0, 0, 0.02);
      border-radius:2px;
      font-size:16px;
      font-family:PingFang SC;
      font-weight:500;
      color:white;
      margin: 10px auto;
      text-align: center;
    }
  }
  .button-notice {
    color: #666;
  }
</style>