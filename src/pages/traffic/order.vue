<template>
  <div class="order-page">
    <div class="order-info p-30">
      <div class="name-time">
        <div class="route-name">{{lineInfo.bgSiteName}}-{{lineInfo.edSiteName}}</div>
        <div class="route-time">出发时间：{{orderDate.month}}月{{orderDate.day}}日 {{lineInfo.startTime}}</div>
      </div>
      <span class="price">￥{{lineInfo.priceRetail}}</span>
    </div>
    <order-card></order-card>
    <!-- <div class="tel p-30">
      <div class="input-item">
        <label class="input-title">手机号</label>
        <input v-model="linkMobile"
               class="input-text"
               placeholder="请填写接收预订信息的手机号"
               type="text" />
      </div>
    </div> -->
    <div class="notice p-30">
      <check-icon @click="checked=!checked"
                  :value.sync="checked"></check-icon>
      <div class="info-text clearfix">
        <span class="fl">我已经阅读并同意车票</span>
        <span class="text fl"
              @click="showAgreement">预订协议</span>
      </div>
    </div>
    <div class="bottom-btn vux-1px-t">
      <div class="price">
        <span class="text">总额:</span>
        <span>￥</span>
        <span class="num">{{totalPrice ? totalPrice : '0.00'}}</span>
        <span>元</span>
      </div>
      <button :class="['order-btn',selectArr.length?'':'no-order']"
              @click="goToOrder"
              type="button">去支付</button>
    </div>
    <div class="layer-cover-fixed"
         v-show="show_agreement">
      <div class="pay-agreement-layer center-fixed">
        <div class="pay-agreement-cont">
          <div class="pay-agreement-txt"
               v-html="agreement"></div>
        </div>
        <div class="pay-agreement-foot vux-1px-t">
          <x-button type="primary"
                    mini
                    @click.native="hideAgreement">确认</x-button>
        </div>
      </div>
    </div>
    <pay ref="pay"
         @wxIcbcPay="icbcPay"
         @aliApPay='aliApPay'
         :isIcbc="isIcbc"
         :isAliAp='isAliAp'
         :totalprice="totalPrice"
         :isWxPay="isWxPay"></pay>
    <div v-html="formStr"></div>
    <!-- <pay ref="pay" :totalprice="paySum" @wxpay="wechatPay"></pay> -->
  </div>
</template>
<script>
import { CheckIcon, XButton } from "vux";
import { isWxAli, wxPay } from "@/common/common";
import pay from "service/order/public/pay.vue";
import { mapGetters, mapMutations, mapState, mapActions } from "vuex";
import orderCard from "./components/orderCard.vue"
export default {
  components: {
    CheckIcon,
    pay,
    XButton,
    orderCard
  },
  computed: {
    ...mapState('traffic/', {
      lineInfo: state => state.lineInfo,
      orderDate: state => state.orderDate,
      userInfo: state => state.userInfo,
      selectArr: state => state.buyManList,
      linkManInfo: state => state.linkManInfo,
      manList: state => state.manList
    }),
    ...mapGetters('traffic/', ['totalPrice'])
  },
  created () {
    this.emptyData()
    this.isWxPay = isWxAli().isWx;
    if (!this.manList || !this.manList.length) {
      //对数据缓存处理，尽量少请求接口
      this.getManAxios()
    }
    this.getUserInfoAxios()
  },
  data () {
    return {
      formStr: "",
      linkMobile: "",
      checked: false,
      isWxPay: false,
      isAliAp: false,
      show_agreement: false,
      agreement: "",
      isIcbc: false, //是否工行支付
      isPayShow: false, //是否展示支付方式
      payType: '',
      isRepeatFlag: false,
      tradeNo: "", // 支付宝交易流水号
      orderNo: ''
    };
  },
  watch: {
  },
  methods: {
    ...mapActions('traffic/', ['getManAxios', 'getUserInfoAxios', 'emptyData']),
    async goToOrder () {
      let selectArr = this.selectArr
      let linkManInfo = this.linkManInfo
      if (!selectArr.length) return;
      for (let i = 0; i < selectArr.length; i++) {
        let info = selectArr[i]
        if (!info.name) {
          this.$vux.toast.text(
            "第" + (i + 1) + "个游玩人名字不能为空！",
            "middle"
          );
          return
        }
        if (!info.certNo) {
          this.$vux.toast.text(
            "第" + (i + 1) + "个游玩人证件号不能为空！",
            "middle"
          );
          return
        }
        if (info.certNo && !this.checkIdCard(info.certNo)) {
          this.$vux.toast.text(
            "第" + (i + 1) + "个游玩人证件号格式错误！",
            "middle"
          );
          return
        }
      }
      if (!linkManInfo.name) {
        this.$vux.toast.text(
          "联系人名字不能为空！",
          "middle"
        );
        return
      }
      if (!linkManInfo.phone) {
        this.$vux.toast.text(
          "联系人手机号不能为空！",
          "middle"
        );
        return
      }
      if (linkManInfo.phone && !this.checkMobile(linkManInfo.phone)) {

        this.$vux.toast.text(
          "联系人手机号格式错误！",
          "middle"
        );
        return
      }
      if (linkManInfo.certNo && !this.checkIdCard(linkManInfo.certNo)) {
        this.$vux.toast.text(
          "联系人证件号格式错误！",
          "middle"
        );
        return
      }
      if (!this.checked) {
        this.$vux.toast.text("请选择同意协议");
        return
      }
      if (this.isRepeatFlag) return;
      this.isRepeatFlag = true;
      try {
        this.$vux.loading.show({
          text: 'Loading'
        })
        let saveInfo = await this._saveOrder()
        if (saveInfo.status === 200) {
          let orderInfo = saveInfo.data;
          let businessType = '';
          let payType = '';
          if (this.isWxPay) {
            businessType = "WEIXIN"
            this.openId = this.userInfo.openId ? this.userInfo.openId : "";
          } else {
            businessType = isWxAli().isAliPay ? "ALI" : "WAP";
          }
          //获取payType信息
          let payTypeInfo = await this.getAxios("/merchant/api/merchantPayType/getMerchantPayType", {
            businessType: businessType
          })
          if (payTypeInfo.status === 200) {
            payType = JSON.parse(payTypeInfo.message)[0];
          }
          this.payType = payType
          let payInfo = await this._toPay(orderInfo)

          this.$vux.loading.hide()
          this.isRepeatFlag = false;

          if (payInfo.payLink) {
            let data = payInfo.data

            switch (Number(payType)) {
              case 12:
              case 17:
                this.infoData = typeof data == 'string' ? JSON.parse(infoData) : {};
                this.isIcbc = true;
                this.isPayShow = true
                this.$refs.pay.aliPayShow = true;
                break;
              case 2019:
                this.isAliAp = true
                this.$refs.pay.aliPayShow = true;
              case 70:
              case 71:
                window.location.href = res.data;
              case 2019:
                this.tradeNo = data.orderNo
              default:
                this.formStr = data;
                this.isPayShow = true
                this.$refs.pay.aliPayShow = true;
            }
          } else {
            let url = linkBaseUrl + "/payPlat/result?out_trade_no=" + res.data;
            window.location.href = url;
          }
        }
      } catch (err) {
        this.$vux.loading.hide()
        this.isRepeatFlag = false;
      }
    },
    _saveOrder () {
      let linkManInfo = this.linkManInfo
      let idCards = this.selectArr.map(item => item.certNo);
      let linkNames = this.selectArr.map(item => item.name);
      let personParams = this.selectArr.map(item => {
        return {
          idNo: item.certNo,
          name: item.name,
          idcardType: 'id'
        };
      });
      let date = this.orderDate.date
      let lineInfo = this.lineInfo
      //下单
      let params = {
        leaguerId: this.userInfo.id,
        realNames: JSON.stringify(personParams),
        modelCodes: lineInfo.routeCode,
        buyerMobile: linkManInfo.phone,
        buyerName: linkManInfo.name,
        buyerIdNo: linkManInfo.certNo,

        amounts: this.selectArr.length,
        wayType: this.isWxPay ? "2" : "1",
        orderType: 'traffic',
        marketingType: 0,
        paySum: this.totalPrice,

        startTime: date,
        endTime: date,
        trafficParams: JSON.stringify({
          trainCode: lineInfo.trainNumberCode,
          bgSiteCode: lineInfo.bgSiteCode,
          edSiteCode: lineInfo.edSiteCode
        })
      }
      this.$refs.pay.show = true;
      return this.postAxios("/order/api/saveOrder", params)
    },
    _toPay (orderInfo) {
      // this.paySum = saveInfo.settleSum;
      // let proHost =
      //   window.location.protocol +
      //   "//" +
      //   window.location.host +
      //   "/vue/" +
      //   "pay-result?corpCode=" +
      //   this.$route.query.corpCode;
      this.orderNo = orderInfo.payOrderNo
      let redirectUrl = window.location.href.split('traffic_order')[0] + 'traffic_success'
      let extendParamJson = {
        orderInfo: orderInfo.orderDescription,
        redirectUrl: encodeURIComponent(redirectUrl),
        openId: this.openId ? this.openId : ""
      };
      let payParams = {
        accountId: this.$route.query.m_id,
        extendParamJson: JSON.stringify(extendParamJson),
        operateId:
          localStorage.getItem("xjsc_login_userId_2019_3_8") ||
          this.$cookie.get("leaguerInfoId"),
        payOrderNo: orderInfo.payOrderNo,
        paySum: this.totalPrice,
        payType: this.payType,
        userType: "C",
        wayType: this.isWxPay ? "1" : "2",
      }
      return this.postAxios("/order/orderPay/toPay", payParams)
    },
    showAgreement () {
      this.getAxios("/merchant/api/traffic/getPayAgreement", { routeCode: this.lineInfo.routeCode }).then(res => {
        this.agreement = res.data.protocolContent
          ? res.data.protocolContent
          : "暂无";
        this.show_agreement = true;
      });
    },
    hideAgreement () {
      this.show_agreement = false;
    },
    aliApPay () {
      console.log('支付宝支付')
      let _this = this
      ap.tradePay({
        tradeNO: this.tradeNo
      }, function (res) {
        console.log(res)
        // _this.$refs.pay.aliPayShow = false;
        if (res.resultCode == 9000 || res.resultCode == 8000) {
          let url = linkBaseUrl + "/payPlat/Notify/1?orderNo=" + _this.orderNo;
          window.location.href = url;
        }
      });
    },
    icbcPay () {
      //工行支付
      let _this = this;
      // alert("ggg")
      if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
          document.addEventListener(
            "WeixinJSBridgeReady",
            _this.onBridgeReady,
            false
          );
        } else if (document.attachEvent) {
          document.attachEvent("WeixinJSBridgeReady", _this.onBridgeReady);
          document.attachEvent("onWeixinJSBridgeReady", _this.onBridgeReady);
        }
      } else {
        _this.onBridgeReady();
      }
    },
    onBridgeReady () {
      let _this = this;
      WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        {
          appId: this.infoData.appId, //公众号名称，由商户传入
          timeStamp: this.infoData.timeStamp, //时间戳，自1970年以来的秒数
          nonceStr: this.infoData.nonceStr, //随机串
          package: this.infoData.packageStr,
          signType: this.infoData.signType, //微信签名方式：
          paySign: this.infoData.paySign //微信签名
        },
        function (res) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            // 使用以上方式判断前端返回,微信团队郑重提示：
            //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            window.location.href =
              window.location.protocol +
              "//" +
              window.location.host +
              "/payPlat/Notify/1?orderNo=" +
              _this.orderNo +
              "&m_id=" +
              _this.$route.query.m_id;
          } else {
            window.location.href =
              window.location.protocol +
              "//" +
              window.location.host +
              "/payPlat/Notify/0?orderNo=" +
              _this.orderNo +
              "&m_id=" +
              _this.$route.query.m_id;
          }
        }
      );
    },
    //手机号验证
    checkMobile (val) {
      if (!/1[3-9][0-9]{9}$/.test(val) && val.length != 11) {
        return false;
      }
      return true
    },
    //身份证验证
    checkIdCard (idCard) {
      let reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|(X|x))$/;
      if (!reg.test(idCard)) {
        return false;
      }
      return true
    },
  }
};
</script>
<style lang="scss">
.order-page {
  overflow: hidden;
  margin-bottom: 45px;
  .p-30 {
    padding: 0 15px;
  }
  .bottom-btn {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 45px;
    background: #fff;
    display: flex;
    align-items: center;
    // border-top: 1px solid #dadae1;
    justify-content: space-between;
    .price {
      flex: 1;
      display: flex;
      font-size: 12px;
      color: #ff5f2c;
      align-items: baseline;
      padding-left: 15px;
      .text {
        font-size: 12px;
        color: #666;
        margin-right: 5px;
      }
      .num {
        font-size: 17px;
      }
    }
    .order-btn {
      width: 140px;
      text-align: center;
      height: 45px;
      line-height: 45px;
      font-size: 17px;
      color: #fff;
      background: #de6550;
      border: none;
      &.no-order {
        background: #999;
      }
    }
  }
  .notice {
    display: flex;
    align-items: center;
    margin-top: 11px;
    padding-bottom: 11px;
    .vux-check-icon {
      .weui-icon-success {
        font-size: 12px;
        &:before {
          color: #4c65f4;
          margin-left: 0;
          margin-right: 0;
        }
      }
      .weui-icon-circle {
        font-size: 12px;
        &:before {
          margin-left: 0;
          margin-right: 0;
        }
      }
    }
    .info-text {
      margin-left: 5px;
      display: inline-block;
      font-size: 12px;
      color: #bbb;
      .text {
        color: #489eeb;
      }
    }
  }
  .tel {
    background: #fff;
    .input-item {
      border-bottom: none;
      .input-text {
        flex: 1;
      }
      .input-text::-webkit-input-placeholder {
        color: #bbbbbb;
        font-size: 15px;
        text-align: right;
      }
      .input-text:-moz-placeholder {
        color: #bbbbbb;
        font-size: 15px;
        text-align: right;
      }
      .input-text:-ms-input-placeholder {
        color: #bbbbbb;
        font-size: 15px;
        text-align: right;
      }
    }
  }
  .passenger-info {
    background: #fff;
    margin-bottom: 8px;
    .passenger-add {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 45px;
      .add-box {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        color: #489eeb;
        .add-icon {
          font-size: 20px;
          line-height: 20px;
          margin-right: 4px;
        }
      }
    }
    .passenger-selected-list {
      .passenger-selected-item {
        padding: 0 15px;
        padding-right: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 60px;
        // border-bottom: 1px solid #dedede;
        .passenger-name-no {
          .name {
            font-size: 15px;
            color: #333333;
            margin-bottom: 2px;
          }
          .no {
            font-size: 12px;
            color: #999;
          }
        }
        .del-icon {
          font-size: 16px;
          color: #666;
          padding: 15px;
        }
      }
    }
    .passenger-list {
      padding: 0 5px;
      padding-top: 12px;
      border-bottom: 1px solid #dedede;
      .passenger-item {
        display: inline-block;
        text-align: center;
        font-size: 14px;
        color: #999;
        border: 1px solid #dedede;
        border-radius: 2px;
        height: 28px;
        line-height: 28px;
        padding: 0 14px;
        margin: 0 10px;
        margin-bottom: 12px;
        &.on {
          color: #4c65f4;
          border-color: #4c65f4;
        }
      }
    }
    .passenger-info-t {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      // border-bottom: 1px solid #dedede;
      .passenger-num {
        font-size: 15px;
        color: #333;
      }
      .passenger-limit {
        font-size: 13px;
        color: #999;
      }
    }
  }
  .order-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80px;
    background: #fff;
    margin-bottom: 5px;
    padding: 0 15px;
    .name-time {
      .route-name {
        font-size: 17px;
        color: #333;
      }
      .route-time {
        font-size: 14px;
        color: #ff5f2c;
      }
    }
    .price {
      font-size: 15px;
      color: #ff5f2c;
    }
  }
  .pay-agreement-layer {
    background-color: #fff;
    height: 380px;
    width: 300px;
    border-radius: 5px;
  }
  .pay-agreement-cont {
    height: 330px;
    padding: 15px;
    box-sizing: border-box;
  }
  .pay-agreement-txt {
    height: 300px;
    overflow: scroll;
  }
  .pay-agreement-foot {
    text-align: center;
    // border-top: 1px solid #d1d1d1;
    height: 50px;
    padding: 7px 15px;
    .weui-btn_primary {
      background-color: #de6550;
    }
  }
  .center-fixed {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .layer-cover-fixed {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 99;
    top: 0;
    left: 0;
  }
}
</style>
