<template>
  <div class="balance-page">
    <div class="balance-bar">
      <div class="bar line">
        <h2 class="num">{{pageData.balance||pageData.balance==0?pageData.balance:0}}</h2>
        <div class="txt">储值金额(元)</div>
      </div>
      <div class="bar">
        <h2 class="num">{{pageData.gift||pageData.gift==0?pageData.gift:0}}</h2>
        <div class="txt">储值赠金(元)</div>
      </div>
    </div>
    <!-- <router-link tag="div" class="recharge-warper" to="/member/recharge">
      <button>优惠充值</button>
    </router-link>
    <router-link tag="div" class="balance-detail" to="/personal/balanceDetail">余额明细></router-link>-->
    <div class="recharge-intro">
      <h2>充值说明</h2>
      <p>1.充值余额仅可用于线上产品支付使用；</p>
      <p>2.余额支付时优先减扣卡金，其次再减扣赠金；</p>
      <p>3.订单支付仅可选择一种付款方式进行支付；</p>
      <p>4.充值成功后，暂不支持账户余额退款、提现及转赠；</p>
      <p>5.如在充值及支付过程中遇到任何问题，请及时联系商家；</p>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.balance-page {
  .recharge-intro {
    padding: 25px;
    background: #fff;
    h2 {
      font-size: 14px;
      color: #333333;
    }
    p {
      font-size: 12px;
      color: #666;
      line-height: 24px;
    }
  }
  .balance-detail {
    background: #fff;
    text-align: center;
    font-size: 13px;
    color: #1848f7;
    height: 45px;
    line-height: 45px;
    margin-bottom: 7px;
  }
  .recharge-warper {
    background: #fff;
    padding: 0 25px;

    button {
      border: none;
      outline: none;
      height: 45px;
      line-height: 45px;
      text-align: center;
      color: #fff;
      background: #3f86ff;
      font-size: 16px;
      border-radius: 2px;
      width: 100%;
    }
  }
  .balance-bar {
    display: flex;
    height: 100px;
    background: #fff;
    align-items: center;
    .bar {
      flex: 1;
      width: 50%;
      text-align: center;

      .num {
        font-size: 20px;
        color: #0f0f12;
      }
      .txt {
        font-size: 13px;
        color: #999;
      }
    }
    .line {
      position: relative;
      &::before {
        content: "";
        position: absolute;
        top: 9px;
        right: 0;
        height: 35px;
        width: 1px;
        background: #ebecf1;
      }
    }
  }
}
</style>
<script>
export default {
  created() {
    this.getPageData();
  },
  data() {
    return {
      pageData: {}
    };
  },
  methods: {
    getPageData() {
      this.getAxios("/leaguer/api/balance/detail").then(res => {
        this.pageData = res.data;
      });
    }
  }
};
</script>