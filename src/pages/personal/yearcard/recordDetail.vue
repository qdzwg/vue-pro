<template>
    <div class="recordDetail">
        <div class="item-ul">
            <p class="item-li">交易流水号：{{listData.orderNo}}</p>
            <p class="item-li">交易时间：{{listData.payTime||listData.createTime}}</p>
            <p class="item-li">交易金额：{{listData.paySum}}</p>
            <p v-if="listData.payTypeCH" class="item-li">交易方式：{{listData.payTypeCH}}</p>
            <p class="item-li">交易类型：{{listData.orderType=='recharge'?"充值":""}}</p>
            <p class="item-li">交易状态：{{listData.payStatusCH}}</p>
            <p class="item-li">卡名称：{{listData.yearCardName}}</p>
        </div>
        <div class="uesr-btn" v-if="listData.payStatus=='wait_pay'" @click="openPaySure">继续支付</div>
        <div class="uesr-btn" v-else @click="back">返回</div>
        <div>
            <div v-html="formStr"></div>
        </div>
        <pay ref="pay" :totalprice="payMoney" :isWxPay="isWxPay"></pay>
    </div>
</template>

<script>
import { isWxAli } from "@/common/common";
import pay from "../../service/order/public/pay";
export default {
    components:{
        pay
    },
  data() {
    return {
        formStr: "",
      isWxPay:false,
      listData: {},
      payOrderNo:"",
      payMoney:"",
    };
  },
  created() {
      document.title = "交易详情";
      if(this.$route.query.payOrderNo){
          this.getList()
      }
  },
  methods: {
       openPaySure(){
        let env = isWxAli();
          this.getAxios("/merchant/api/merchantPayType/getMerchantPayType", {
            businessType: env.isWx ? "WEIXIN" : env.isAliPay ? "ALI" : "WAP"
          }).then(res => {
            this.payType = JSON.parse(res.message)[0];
            //微信端获取openid
            if (env.isWx) {
              this.getAxios("/leaguer/api/userLeaguer/manage/leaguerInfo", {
                leaguerId: localStorage.getItem("xjsc_login_userId_2019_3_8")
              }).then(res => {
                this.openId = res.data.openId ? res.data.openId : "";
                this.openPay();
              });
            } else if (env.isAliPay) {
              //阿里
              this.openPay();
            } else {
              this.openPay();
            }
          });
    },
    // 支付宝支付
    openPay() {
      let extendParam = {
        orderInfo: this.orderDescription,
        redirectUrl: encodeURIComponent(window.location.href),
        openId: this.openId ? this.openId : ""
      };
      this.getAxios(this.api.main.pay.goPay, {
        accountId: this.$route.query.m_id,
        extendParamJson: JSON.stringify(extendParam),
        operateId: localStorage.getItem("xjsc_login_userId_2019_3_8"),
        payOrderNo: this.payOrderNo,
        paySum: this.payMoney,
        payType: this.payType,
        userType: "C",
        wayType: 1
      }).then(res => {
        let env = isWxAli();
        this.formStr = res.data;
        this.isWxPay = env.isWx;
        this.$refs.pay.aliPayShow = true;
      });
    },
    getList() {
      this.getAxios("/leaguer/api/yearCardOrder/selectOrderDetil", {
        payOrderNo: this.$route.query.payOrderNo
      }).then(res => {
          this.listData=res.data
          this.payOrderNo = res.data.payOrderNo;
          this.payMoney = res.data.paySum;
      });
    },
    back(){
        this.$router.back()
    }
  }
};
</script>

<style lang="scss">
.recordDetail {
  .item-ul {
    background-color: #fff;
    padding: 10px 20px;
    font-size: 15px;
    margin: 10px 0;
    color: #5c5c5c;
    .item-li {
      line-height: 30px;
    }
  }
  .uesr-btn {
    width: 100%;
    height: 49px;
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: #009ded;
    color: #fff;
    text-align: center;
    line-height: 49px;
    font-size: 16px;
  }
}
</style>


