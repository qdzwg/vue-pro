<template>
  <div class="hotel-order"
       :class="{overflow:canScroll}">
    <div class="playDate boxshadow">
      <div class="play-input-wrap">
        <div class="hotel-date clearfix">
          <div class="date-box ">
            <div class="date-label">入住</div>
            <div class="date-text">{{beginDate}}</div>
          </div>
          <div class="date-box">
            <div class="date-label">离店</div>
            <div class="date-text">{{endDate}}</div>
          </div>
        </div>

      </div>
    </div>
    <div class="hotel-list">
      <div v-for="(item,index) in ticketType"
           :key="index"
           class="hotel-item">
        <div class="hotel-item-main">
          <div class="hotel-info">
            <div class="hotel-name">{{item.nickName}}</div>
            <div class="hotel-num">
              <span class="unit">x</span>
              <span class="num">{{item.num}}</span>
            </div>
          </div>
          <div class="hotel-price">
            <span>￥</span>
            <span class="price">{{item.singleSum}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="buyer-info">
      <div class="info-head">
        <div class="head-title">
          <span class="text">联系人</span>
          <span class="link-tips">（用于接收出票信息）</span>
        </div>
        <img src="http://statics.lotsmall.cn/wx/img/icon-contact.png"
             class="contacter-icon"
             @click="openModal">
      </div>
      <div class="info-list">

        <div class="info-item">
          <div class="info-title">姓名</div>
          <input type="text"
                 placeholder-class='input-style'
                 maxlength="10"
                 placeholder="须与证件上的名字一致"
                 v-model="buyerName">
        </div>
        <div class="info-item">
          <div class="info-title">手机号</div>
          <input placeholder-class='input-style'
                 @focus="buyerMobileFocus"
                 maxlength="11"
                 placeholder="用于接收出票信息"
                 v-model="buyerMobile">
        </div>
        <div class="info-item">
          <div class="info-title">身份证</div>
          <input placeholder-class='input-style'
                 placeholder="请填写身份证号码"
                 v-model="buyerIdNo">
        </div>
      </div>
    </div>
    <div class="coupon-warper info-list">
      <div class="info-item"
           @click="getCoupons">
        <span class="info-title ">优惠券</span>
        <input placeholder-class='input-style'
               v-if="!couponName"
               disabled
               placeholder="优惠券选择">
        <span v-else
              style="display:inline-block;width:70%">{{couponName}}</span>
        <i class="xx-icon icon-xiangyoujiantou coupon-svg coupons-icon"></i>
      </div>
      <div class="info-item">
        <div class="info-title">优惠活动</div>
        <span v-if="couponUserType=='F'">无门槛</span>
        <div v-else>
          <input placeholder-class='input-style'
                 v-if="!couponUserNum"
                 disabled
                 placeholder="优惠活动信息">
          <span v-else>满 {{couponUserNum}} 元可用</span>
        </div>
      </div>
    </div>

    <div class="dt-bottom-height"></div>
    <div class="bottom-box">
      <div class="left-warper">
        <div class="selected">
          <span class="title">已选:</span>
          <span>{{sumnum}}</span>
        </div>
        <div class="money">
          <span class="title">总额:</span>
          <span class="unit">￥</span>
          <span class="price">{{totalprice}}</span>
        </div>
      </div>
      <div class="right-warper"
           @click="subForm">
        去支付
      </div>

    </div>
    <div>
      <div v-html="formStr"></div>
    </div>
    <!-- 常用联系人 -->
    <pop-contacts ref="contactsList"
                  @getContactsInfo="fillContact"></pop-contacts>
    <!-- 优惠券 -->
    <coupon-list ref="couponList"
                 @nouse="Undontuse"
                 @use="useCoupon"></coupon-list>
    <!-- 支付宝支付确认 -->
    <pay ref="pay"
         :totalprice="totalprice"
         :isWxPay="isWxPay"></pay>
    <float-nav></float-nav>
  </div>
</template>
<script>
import { isWxAli } from "@/common/common";
import { Popup, DatetimeView, Group, XDialog, Confirm } from "vux";
import { linkBaseUrl } from "../../../../config/index";
import popContacts from "./public/popContacts";
import couponList from "./public/couponList";
import floatNav from "@/components/floatNav";
import pay from "./public/pay";
export default {
  components: {
    floatNav,
    popContacts,
    couponList,
    pay,
    Popup,
    DatetimeView,
    Group,
    XDialog,
    Confirm
  },
  data () {
    return {
      isWxPay: false,
      payType: "",
      formStr: "",
      couponName: "", //优惠券名称
      couponUserType: "", //优惠券  优惠活动
      couponUserNum: "", //优惠券使用门槛

      ticketType: [],
      sumnum: 0,
      totalprice: 0,
      buyerName: "",
      buyerMobile: "",
      saveBuyerMobile: "",
      buyerMobileShow: false,
      buyerIdNo: "",
      flag: true,
      orderNo: null, //订单号
      orderInfo: "",
      beginDate: "",
      endDate: "",
      couponList: [],
      couponCode: "", //优惠券code
      orderId: "",
      flagModal: true, //点击其他地方，支付弹框不要消失
      canScroll: false //是否允许页面滑动
    };
  },
  methods: {
    buyerMobileFocus () {
      //开关控制只有第一次才执行
      if (!this.buyerMobileShow) {
        this.buyerMobileShow = true;
        this.buyerMobile = this.saveBuyerMobile;
      }
    },
    openModal () {
      this.$refs.contactsList.showContacts();
    },
    getPrice (obj) {
      this.totalprice = 0;
      this.sumnum = 0;
      if (obj == 0) {
        this.ticketType.forEach((item, index) => {
          this.totalprice += item.singleSum * item.num;
          this.sumnum += item.num;
        });
        this.totalprice = this.totalprice.toFixed(2);
        return this.totalprice;
      } else {
        switch (obj.applyType) {
          case "all":
          case "type":
            let duseCprice = 0;
            this.ticketType.forEach((item, index) => {
              duseCprice += item.num * item.singleSum;
              this.sumnum += item.num;
            });
            this.totalprice =
              duseCprice > obj.amount ? duseCprice - obj.amount : 0;
            this.totalprice = this.totalprice.toFixed(2);
            return this.totalprice;
            break;
          case "used":
            let dusetotalprice = 0,
              ucoupontotalp = 0,
              duseCouponprice;
            for (let i = 0; i < this.ticketType.length; i++) {
              dusetotalprice +=
                this.ticketType[i].singleSum * this.ticketType[i].num;
              for (let j = 0; j < obj.productInfos.length; j++) {
                if (
                  this.ticketType[i].modelCode ==
                  obj.productInfos[j].productCode
                ) {
                  ucoupontotalp +=
                    this.ticketType[i].singleSum * this.ticketType[i].num;
                }
              }
            }
            duseCouponprice = dusetotalprice - ucoupontotalp;
            ucoupontotalp =
              ucoupontotalp > obj.amount ? ucoupontotalp - obj.amount : 0;
            this.totalprice = ucoupontotalp + duseCouponprice;
            this.totalprice = this.totalprice.toFixed(2);
            break;
        }
      }
    },
    //支付
    pay () {
      //微信支付
      let _this = this;
      this.flagModal = false;
      let extendParam = {
        orderInfo: this.orderInfo,
        redirectUrl: encodeURIComponent(window.location.href),
        openId: this.openId ? this.openId : ""
      };
      this.getAxios(this.api.main.pay.goPay, {
        accountId: this.$route.query.m_id,
        extendParamJson: JSON.stringify(extendParam),
        operateId: localStorage.getItem("xjsc_login_userId_2019_3_8"),
        payOrderNo: this.orderNo,
        paySum: this.totalprice,
        payType: this.payType,
        userType: "C",
        wayType: 1
      }).then(res => {
        if (res.payLink) {
          let env = isWxAli();
          this.formStr = res.data;
          this.isWxPay = env.isWx;
          this.$refs.pay.aliPayShow = true;
        } else {
          //零元支付直接跳转支付结果页面
          // this.$router.push(
          //   "/pay/result?from=zero&&payOrderNo=" + this.orderNo
          // );
          //跳转node版本支付结果页面
          // console.log(linkBaseUrl)
          let url = linkBaseUrl + "/payPlat/result?out_trade_no=" + res.data;
          window.location.href = url;
        }
      });
    },
    //表单验证
    checkMobile (val) {
      if (!/^1[345789]\d{9}$/.test(val)) {
        return true;
      }
    },
    checkIdcard (val) {
      if (
        !/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(
          val
        )
      ) {
        return true;
      }
    },
    subForm () {
      this.flag = true;
      this.realTel = this.buyerMobileShow
        ? this.buyerMobile
        : this.saveBuyerMobile;
      if (!this.buyerName) {
        this.flag = false;
        this.$vux.toast.text("联系人姓名不能为空！", "middle");
      }
      if (!this.realTel) {
        this.flag = false;
        this.$vux.toast.text("联系人手机号不能为空！", "middle");
      } else {
        if (this.checkMobile(this.realTel)) {
          this.flag = false;
          this.$vux.toast.text("请输入正确的手机号码！", "middle");
        }
      }
      if (this.buyerIdNo != "") {
        if (this.checkIdcard(this.buyerIdNo)) {
          this.flag = false;
          this.$vux.toast.text("请输入正确的身份证号码！", "middle");
        }
      }
      if (this.flag) {
        let modelCodes = [];
        let amounts = [];
        let paySum = 0;
        let formData = {
          modelCodes: "",
          leaguerId: "",
          buyerName: this.buyerName,
          buyerMobile: this.realTel,
          buyerIdNo: this.buyerIdNo,
          amounts: "",
          wayType: 1,
          orderType: "hotel",
          marketingType: "",
          paySum: 0,
          startTime: this.beginDate,
          endTime: this.endDate,
          couponCode: this.couponCode
        };

        this.ticketType.forEach((item, index) => {
          modelCodes.push(item.modelCode);
          amounts.push(item.num);
          paySum += item.singleSum * item.num;
        });
        formData.paySum = paySum.toFixed(2);
        formData.modelCodes = modelCodes.join(",");
        formData.amounts = amounts.join(",");

        let _url = this.api.order.saveOrder;
        let env = isWxAli();
        this.postAxios(_url, formData).then(
          result => {
            if (result.status != "200") {
              this.$vux.toast.warn(result.message, "middle");
            } else {
              this.orderNo = result.data.payOrderNo;
              this.orderInfo = result.data.orderDescription;
              this.orderId = result.data.id;
              this.getAxios(
                "/merchant/api/merchantPayType/getMerchantPayType",
                {
                  businessType: env.isWx
                    ? "WEIXIN"
                    : env.isAliPay ? "ALI" : "WAP"
                }
              ).then(res => {
                this.payType = JSON.parse(res.message)[0];
                //微信端获取openid
                if (env.isWx) {
                  this.getAxios("/leaguer/api/userLeaguer/manage/leaguerInfo", {
                    leaguerId: localStorage.getItem(
                      "xjsc_login_userId_2019_3_8"
                    )
                  }).then(res => {
                    this.openId = res.data.openId ? res.data.openId : "";
                    this.pay();
                  });
                } else if (env.isAliPay) {
                  //阿里
                  this.pay();
                } else {
                  this.pay();
                }
              });
            }
          },
          reject => { }
        );
      }
    },
    //常用联系人填充取票联系人
    fillContact (ele) {
      this.buyerMobileShow = true;
      this.buyerName = ele.name;
      this.buyerMobile = ele.phone;
      this.buyerIdNo = ele.certNo;
    },
    //下单获取优惠券列表
    getCoupons () {
      let couponUrl = this.api.main.marketing.useCoupons;
      let cpArr = [],
        modelprice = "";
      this.ticketType.forEach((item, index) => {
        cpArr.push(item.modelCode + "-" + item.singleSum * item.num);
      });
      modelprice = cpArr.join(",");
      this.getAxios(couponUrl, {
        userId: localStorage.getItem("xjsc_login_userId_2019_3_8"),
        moldCodes: modelprice
      }).then(res => {
        this.$refs.couponList.show(res.data);
      });
    },
    //使用优惠券
    useCoupon (obj) {
      this.couponCode = obj.code;
      this.getPrice(obj);
      this.couponUserType = obj.useThreshold;
      if (this.couponUserType == "T") {
        this.couponUserNum = obj.targetAmout;
      }
      this.couponName = obj.name;
    },
    //不使用优惠券
    Undontuse () {
      this.couponCode = "";
      this.getPrice(0);
      this.couponUserType = "";
      this.couponName = "";
      this.couponUserNum = "";
      //   this.closeCouponModal();
    }
  },

  created () {
    document.title = "酒店下单";
    //下单页面拦截授权
    let tUrl = this.api.member.info;
    this.getAxios(tUrl, {});
    //获取缓存入住和离店日期
    this.beginDate = localStorage.getItem("selectBegin");
    this.endDate = localStorage.getItem("selectEnd");
    //获取缓存票型信息
    let arr = [];
    arr = localStorage.getItem("ticketType");
    this.ticketType = JSON.parse(arr);
    this.getPrice(0);
    this.getAxios("/leaguer/api/userLeaguer/manage/leaguerInfo").then(res => {
      let tel = res.data.mobile ? res.data.mobile : "";
      // this.buyerMobile = tel;
      // console.log(tel)
      this.saveBuyerMobile = tel;
      if (tel) {
        this.buyerMobile = tel.slice(0, 3) + "****" + tel.slice(tel.length - 4);
        // console.log(this.buyerMobile)
      }

      this.buyerName = res.data.nickName ? res.data.nickName : "";
    });
  }
};
</script>

<style lang="scss">
.hotel-order {
  .playDate {
    width: 100%;
    height: 57px;
    line-height: 57px;
    overflow: hidden;
    background-color: #f7f7f7;
    .play-item-title {
      width: 60px;
      font-size: 14px;
      color: #413838;
      float: left;
      margin-left: 20px;
    }
    .play-input-wrap {
      position: relative;
      width: 100%;

      .hotel-date {
        height: 54px;
        .date-box {
          width: 173px;
          height: 34px;
          line-height: 34px;
          margin-left: 10px;
          float: left;
          background-color: #fff;
          color: #413838;
          margin-top: 10px;
          .date-label {
            font-size: 14px;
            display: inline-block;
            // vertical-align: middle;
            margin-left: 30px;
          }
          .date-text {
            margin-top: 1.5px;
            float: right;
            height: 34px;
            line-height: 34px;
            font-size: 13px;
            display: inline-block;
            // vertical-align: middle;
            margin-right: 30px;
          }
        }
      }
      .place-holder {
        color: #767676;
        font-size: 14px;
      }
      .time-input {
        border: none;
        height: 57px;
        line-height: 57px;
        color: #413838;
        font-size: 14px;
      }
      .time-icon {
        position: absolute;
        right: 0;
        top: 0;
        font-size: 18px;
        color: #e25a45;
        height: 57px;
        line-height: 57px;
      }
    }
  }
  .hotel-list {
    margin-bottom: 10px;
    background: #ffffff;
    padding: 20px 15px;
    .hotel-item {
      padding-bottom: 11px;
      width: 100%;
      .hotel-item-main {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .hotel-info {
          display: flex;
          align-items: center;
          .hotel-name {
            width: 187px;
            padding-right: 15px;
            font-size: 14px;
            color: #413838;
            font-family: PingFangSC-Regular, sans-serif;
            display: inline-block;
            vertical-align: middle;
          }
          .hotel-num {
            font-size: 15px;
            font-family: PingFangSC-Regular, sans-serif;
            color: #767676;
            // width: 60px;
            display: inline-block;
            vertical-align: middle;
            padding-left: 15px;
            .unit {
              font-size: 12px;
            }
            .fq-idcard {
              margin-left: 10px;
              image {
                width: 15.5px;
                height: 12.5px;
              }
            }
          }
        }
        .hotel-price {
          font-size: 12px;
          color: #413838;
          font-family: PingFangSC-Regular, sans-serif;
          display: inline-block;
          vertical-align: middle;
          .price {
            font-size: 16px;
            margin-left: 4.5px;
          }
        }
      }
    }
    .hotel-item:last-child {
      padding-bottom: 0;
    }
  }
  .buyer-info {
    background: #ffffff;
    margin-bottom: 10px;
    padding: 20px 15px;
    padding-right: 0;
    padding-bottom: 0;
    .info-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      margin-right: 13px;
      position: relative;
      .head-title {
        .line {
          height: 16.5px;
          width: 2px;
          border-radius: 0.5px;
          display: inline-block;
          background: #f05b47;
          margin-right: 8px;
        }
        .text {
          display: inline-block;
          color: #413838;
          font-size: 18px;
          font-family: PingFangSC-Semibold, sans-serif;
        }
        .link-tips {
          font-size: 12px;
          color: #767676;
        }
      }
      .contacter-icon {
        width: 17px;
        height: 17px;
        position: absolute;
        top: -10px;
        right: -13px;
        padding: 15px;
      }
    }
    .info-list {
      padding-top: 10px;
      .info-list-title {
        height: 20px;
        line-height: 20px;
        .title-text {
          color: #413838;
          font-weight: bold;
          display: inline-block;
          vertical-align: middle;
          font-size: 12px;
        }
        .del-yk-icon {
          width: 12px;
          height: 13.5px;
          display: inline-block;
          vertical-align: middle;
          margin-left: 15px;
        }
      }
      .info-item:last-child {
        border-bottom: none;
      }
      .info-item {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 14px;
        color: #413838;
        position: relative;
        height: 53px;
        border-bottom: 0.5px solid #eeeee7;
        .info-title {
          width: 77px;
          font-family: PingFangSC-Regular, sans-serif;
        }
        .preview-img {
          width: 30px;
          height: 30px;
        }
        .input-style {
          color: rgba(65, 56, 56, 0.5);
          font-size: 14px;
          font-family: PingFangSC-Regular, sans-serif;
        }
        input {
          width: 255px;
          border: none;
          outline: 0;
        }
        .coupon-svg {
          font-size: 12px;
          color: #f05b47;
        }
        .coupons-icon {
          width: 9px;
          color: #f05b47;
          padding-left: 6.5px;
        }
        .camera-icon {
          width: 30px;
          height: 26.5px;
        }
        .camera-tips {
          color: rgba(65, 56, 56, 0.5);
          margin-left: 10px;
          font-size: 12px;
        }
        .setLink {
          position: absolute;
          right: 0;
          top: 0;
          font-size: 13px;
          color: rgba(65, 56, 56, 0.6);
          border: 1px solid rgba(65, 56, 56, 0.5);
          padding: 2px 5px;
          border-radius: 4px;
        }
      }
      .info-item:last-child {
        margin-bottom: 0;
      }
    }
  }
  .info-list {
    padding-top: 10px;
    .info-list-title {
      height: 20px;
      line-height: 20px;
      .title-text {
        color: #413838;
        font-weight: bold;
        display: inline-block;
        vertical-align: middle;
        font-size: 12px;
      }
      .del-yk-icon {
        width: 12px;
        height: 13.5px;
        display: inline-block;
        vertical-align: middle;
        margin-left: 15px;
      }
    }
    .info-item:last-child {
      border-bottom: none;
    }
    .info-item {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 14px;
      color: #413838;
      position: relative;
      height: 53px;
      border-bottom: 0.5px solid #eeeee7;
      .info-title {
        width: 77px;
        font-family: PingFangSC-Regular, sans-serif;
      }
      .preview-img {
        width: 30px;
        height: 30px;
      }
      .input-style {
        color: rgba(65, 56, 56, 0.5);
        font-size: 14px;
        font-family: PingFangSC-Regular, sans-serif;
      }
      input {
        width: 255px;
        border: none;
        outline: 0;
        background-color: #fff;
      }
      .coupon-svg {
        font-size: 12px;
        color: #f05b47;
      }
      .coupons-icon {
        width: 9px;
        color: #f05b47;
        padding-left: 6.5px;
      }
      .camera-icon {
        width: 30px;
        height: 26.5px;
      }
      .camera-tips {
        color: rgba(65, 56, 56, 0.5);
        margin-left: 10px;
        font-size: 12px;
      }
      .setLink {
        position: absolute;
        right: 0;
        top: 0;
        font-size: 13px;
        color: rgba(65, 56, 56, 0.6);
        border: 1px solid rgba(65, 56, 56, 0.5);
        padding: 2px 5px;
        border-radius: 4px;
      }
    }
    .info-item:last-child {
      margin-bottom: 0;
    }
  }
  .coupon-warper {
    background: #ffffff;
    margin-bottom: 10px;
    padding-left: 15px;
    padding-top: 0;
  }

  .dt-bottom-height {
    height: 58.5px;
  }
  .bottom-box {
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 0;
    height: 49px;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    font-family: PingFangSC-Regular, sans-serif;
    background: #ffffff;
    z-index: 20;
    .left-warper {
      width: 204px;
      font-size: 13px;
      color: #413838;
      padding-left: 15px;
      .selected {
        padding-top: 9px;
      }
      .title {
        margin-right: 19px;
      }
      .money {
        height: 19px;
        line-height: 15px;
        .unit {
          color: #fc4150;
          font-family: PingFangSC-Regular, sans-serif;
          font-size: 12px;
          margin-right: 4px;
        }
        .price {
          color: #fc4150;
          font-family: PingFangSC-Regular, sans-serif;
          font-size: 18px;
          //  font-weight: bold;
        }
      }
    }
    .right-warper {
      width: calc(100% - 204px);
      height: 49px;
      line-height: 49px;
      background: #f05b47;
      color: #fff;
      text-align: center;
      font-size: 16px;
    }
  }
}
</style>
