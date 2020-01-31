<template>
  <div class="pay-result-page" ref="shopBox">
    <div class="base-info">
      <i class="xx-icon icon-yuanxingxuanzhongfill success-icon"></i>
      <div class="success-text">订单支付成功</div>
      <div class="name">{{payOrderData.accountName}}</div>
      <div class="notice">
        <span>已成功提交，请查收您的</span>
        <span class="dx">短信</span>
        <span>!</span>
      </div>
    </div>
    <button class="code-look" type="button">查看二维码</button>
    <div class="pay-content">
      <div class="pay-title">
        <div class="pay-title__line left-line"></div>
        <div class="pay-title__conetent">
          <i class="xx-icon icon-aixin"></i>
          <em>你可能还喜欢</em>
        </div>
        <div class="pay-title__line right-line"></div>
      </div>
      <img
        class="pay-ad"
        src="https://statics.lotsmall.cn/image/20180925/20180925214315i7qm0a.jpg?imageMogr2/thumbnail/640x/strip/quality/100"
        alt
      >
    </div>
  </div>
</template>
<script>
// import BScroll from "better-scroll";
export default {
  data() {
    return {};
  },
  created() {
    let xmlDoc;
    if (window.DOMParser) {
      xmlDoc = new DOMParser().parseFromString(
        this.$route.query.resp_data,
        "text/xml"
      );
      //   parser.parse;
    } else {
      xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
      xmlDoc.async = "false";
      xmlDoc.loadXML(this.$route.query.resp_data);
    }
    console.log(xmlDoc);
    // console.log(
    //   xmlDoc.getElementsByTagName("out_trade_no")[0].childNodes[0].nodeValue
    // );
    let outTradeNo = xmlDoc.getElementsByTagName("trade_no")[0].childNodes[0]
      .nodeValue;
    this.getAxios("/pay/api/leaguer/manage/getPayOrder", {
      outTradeNo: outTradeNo
    }).then(res => {
      this.payOrderData = res.data;
    });
    // console.log(this.api.main.marketing.findBuySendRule);
    //查看可送优惠券
    // console.log(this.api.main.marketing.findPayPageAd);
    //GET /api/merchantAdvManage/findPayPageAd
    // 根据店铺id查询支付成功页广告
    // console.log(
    //   "leaguer/api/leaguerRecommend/getRecommentProduct?payOrderNo=11&merchantInfoId=22&leagureId=33"
    // );
    // console.log(
    //   "/api/wxCardApi/getWxCardOrderListByPayOrderNo根据支付订单号查询该订单微信卡券信息"
    // );
  }
};
</script>
<style lang="scss">
.pay-result-page {
  margin-top: 10px;
  .pay-content {
    .pay-ad {
      width: 100%;
      max-height: 150px;
    }
    .pay-title {
      text-align: center;
      .pay-title__line {
        position: relative;
        display: inline-block;
        height: 1px;
        background-color: #f05b47;
        width: 1.5rem;
        vertical-align: middle;
        &.left-line::after {
          content: "";
          display: block;
          height: 5px;
          width: 5px;
          position: absolute;
          border-radius: 50%;
          background-color: #f05b47;
          right: -2px;
          top: -2px;
        }
        &.right-line::before {
          content: "";
          display: block;
          height: 5px;
          width: 5px;
          position: absolute;
          border-radius: 50%;
          background-color: #f05b47;
          left: -2px;
          top: -2px;
        }
      }
      .pay-title__conetent {
        display: inline-block;
        vertical-align: middle;
        margin: 0 12px;
        i {
          font-size: 28px;
          color: #f05b47;
          vertical-align: middle;
        }
        em {
          font-size: 16px;
          color: #f05b47;
          margin-left: 8px;
        }
      }
    }
  }
  .code-look {
    border: none;
    outline: none;
    display: block;
    color: #fff;
    border-radius: 8px;
    width: 90%;
    height: 49px;
    line-height: 49px;
    text-align: center;
    font-size: 18px;
    background-color: #19a0f0;
    margin: 15px 0;
    margin-left: 5%;
  }
  .base-info {
    background: #fff;
    text-align: center;
    .success-icon {
      font-size: 70px;
      color: #1aad19;
    }
    .success-text {
      font-size: 20px;
      color: #333;
    }
    .name {
      font-size: 16px;
      color: #333;
    }
    .notice {
      margin-top: 10px;
      padding-bottom: 15px;
      font-size: 12px;
      color: #666;
      display: flex;
      justify-content: center;
      .dx {
        color: #19a0f0;
      }
    }
  }
}
</style>

