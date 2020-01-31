<template>
  <div class="wxQr-fans-module" v-if="needFocus">
    <div class="wxQr-fans-box">
        <div class="wxQr-fans-title">公众号：{{showQrImg.name}}</div>
        <div class="wxQr-fans-img">
          <img v-if="showQrImg.qrUrl" :src="showQrImg.qrUrl" alt="">
          <Loading :show="loading"></Loading>
        </div>
        <div class="wxQr-notice">请长按二维码关注公众号后预订</div>
        <div @click="reload" class="wxQr-reload">刷新</div>
    </div>
  </div>
</template>
<script>
import { Loading } from 'vux'
export default {
  components:{
    Loading 
  },
  data(){
    return {
      merchantInfoId:"",
      showQrImg:{
        name:'微信公众号',
        qrUrl:''
      },
      loading:false,
      needFocus:false
    }
  },
  created(){
    this.merchantInfoId = this.$route.query.m_id;
    this.checkWxFans()
  },
  methods:{
    checkWxFans(){
      let _this = this;
      Promise.all([
        this.getAxios(this.api.main.marketing.getByMerchantId,{merchantInfoId:this.merchantInfoId}),
        this.getAxios(this.api.main.marketing.selectServiceUse,{ merchantInfoId:this.merchantInfoId,serviceType: 'wxAttractFans'})
      ]).then(([getByMerchantId,selectServiceUse]) => {
        if (getByMerchantId.status === 200 && selectServiceUse.status === 200) {
          if (getByMerchantId.data && getByMerchantId.data.status === 'T' && selectServiceUse.data && selectServiceUse.data.wxAttractFans) {
            console.log(_this.api.main.marketing.userFollowCheck)
            _this.getAxios(_this.api.main.marketing.userFollowCheck).then( userFollowCheck => {
              if (userFollowCheck && userFollowCheck.status ===200) {  
                if (!userFollowCheck.checkFlag) {
                  _this.getAxios(_this.api.main.marketing.getWxPublicUrl).then( getWxPublicUrl => {
                    if (getWxPublicUrl.status === 200) {
                      _this.showQrImg = getWxPublicUrl.result;
                      _this.loading = false
                      _this.needFocus = true
                    } else {
                      _this.needFocus = false
                    }
                  })
                } else {
                  _this.needFocus = false
                }
              }
            })
          }
        }
      })
    },
    reload(){
      this.loading = true
      this.checkWxFans()
      setTimeout(() => {
        this.loading = false
      },1000)
    }
  }
}
</script>
<style lang="scss">
  .wxQr-fans-module {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba($color: #000000, $alpha: .4);
    z-index: 999999;
  }
  .wxQr-fans-box {
    width:345px;
    height:393px;
    background:white;
    box-shadow:0px 3px 4px 0px rgba(0, 0, 0, 0.02);
    border-radius:2px;
    margin: 60px auto 0;
    .wxQr-fans-title {
      line-height: 57px;
      height: 57px;
      font-size:16px;
      font-family:PingFang SC;
      font-weight:500;
      color:#413838;
      text-align: center;
      padding: 0 0.425rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      border-bottom: 1px solid #EEEEE7;
    }
    .wxQr-fans-img {
      width: 191px;
      height: 189px;
      background: #eee;
      margin: 25px auto;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .wxQr-notice {
      font-size:16px;
      font-family:PingFang SC;
      font-weight:bold;
      color:#413838;
      line-height:22px;
      width: 100%;
      text-align: center;
    }
    .wxQr-reload{
      width:90px;
      height:31px;
      border:1px solid #009DED;
      border-radius:2px;
      text-align: center;
      line-height: 31px;
      font-size:12px;
      font-family:PingFang SC;
      font-weight:500;
      color:#009DED;
      margin: 15px auto 0;

    }
  }
</style>