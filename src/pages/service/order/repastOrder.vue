<template>
  <div class="repast-order"
       :class="{overflow:canScroll}">
    <div class="hotel-list">
      <div class="hotel-item">
        <div class="hotel-item-main">
          <div class="hotel-info">
            <div class="counpon-title">
              <div class="title">
                <span>{{conponList.enteryName}}</span> *
                <span class>{{conponList.name}}</span>
              </div>
              <div class="buy-price clearfix">
                <span class="price fr">{{conponList.priceSettle}} 元</span>
              </div>
            </div>
            <div class="numbox clearfix">
              <span class="fl">数量</span>
              <span class="addnum fr">
                <div class="px-right">
                  <span class="number">{{mealNum}}</span>
                  <span class="sub"
                        :class="{sub0:mealNum==0}"
                        @click.stop="sub">-</span>
                  <span class="add"
                        @click.stop="add">+</span>
                </div>
              </span>
            </div>
            <div class="numbox clearfix">
              <span class="fl">小计</span>
              <span class="price fr">￥{{subtotal}}</span>
            </div>
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
             @click="showContactsPop">
      </div>
      <div class="info-list contact-info">
        <div class="info-item">
          <div class="info-title">姓名</div>
          <input maxlength="10"
                 type="text"
                 placeholder-class="input-style"
                 placeholder="须与证件上的名字一致"
                 v-model="buyerName">
        </div>
        <div class="info-item">
          <div class="info-title">手机号</div>
          <input placeholder-class="input-style"
                 placeholder="用于接收出票信息"
                 v-model="buyerMobile"
                 type="number">
        </div>
        <div class="info-item">
          <div class="info-title">身份证</div>
          <input placeholder-class="input-style"
                 placeholder="请填写身份证号码"
                 v-model="buyerIdNo"
                 type="text">
        </div>
        <div v-if="isface"
             class="info-item">
          <div class="info-title">人脸照</div>
          <rlsb ref="rlsb"
                @getImgUrl="imgUrl"></rlsb>
        </div>
      </div>
    </div>

    <div class="coupon-warper info-list">
      <div class="info-item"
           @click="getCoupons">
        <div class="coupon-info">
          <span class="info-title">优惠券</span>
          <input class="info-content"
                 placeholder-class="input-style"
                 v-if="!couponName"
                 disabled
                 placeholder="优惠券选择">
          <span v-else
                class="coupon-name"
                style="display:inline-block;">{{couponName}}</span>
        </div>
        <i class="xx-icon icon-xiangyoujiantou coupon-svg coupons-icon"></i>
      </div>
      <div class="info-item">
        <div class="coupon-info">
          <span class="info-title">优惠活动</span>
          <span v-if="couponUserType=='F'">无门槛</span>
          <div v-else>
            <input class="info-content"
                   placeholder-class="input-style"
                   v-if="!couponUserNum"
                   disabled
                   placeholder="优惠活动信息">
            <span v-else>满 {{couponUserNum}} 元可用</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 支付宝支付表单 -->
    <div>
      <div v-html="formStr"></div>
    </div>
    <div class="dt-bottom-height"></div>
    <div class="bottom-box">
      <div class="left-warper">
        <div class="money">
          <span class="title">合计:</span>
          <span class="unit">￥</span>
          <span class="price">{{totalprice}}</span>
        </div>
      </div>
      <div v-if="mealNum<=0"
           class="right-warper btn-sub">
        提交订单
      </div>
      <div v-else
           class="right-warper"
           @click="subForm">提交订单</div>
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
import floatNav from "@/components/floatNav";
import { isWxAli } from "@/common/common";
import { Popup, XDialog } from "vux";
import popContacts from "./public/popContacts";
import couponList from "./public/couponList";
import pay from "./public/pay";
import rlsb from "@/components/rlsb";

export default {
  data () {
    return {
      isWxPay: false, //是否是微信支付
      realNameList: [],
      timeFlag: true, //分时预约请求开关
      activeIndex: 0,
      timeList: [], //分时预约时间数组
      noticeFlag: true, //弹框提示开关
      noticeStr: "",
      noticeShow: false,
      ticketInfo: {}, //ypym门票信息
      isYpym: false, //是否是一票一码
      num: 0,
      formStr: "",
      couponName: "", //优惠券名称
      couponUserType: "", //优惠券  优惠活动
      couponUserNum: "", //优惠券使用门槛
      faceUrls: "",
      ticketType: [],
      totalprice: 0,
      buyerName: "",
      buyerMobile: "",
      buyerIdNo: "",
      porsrc: "",
      flag: true,
      payShow: false,
      orderNo: null, //订单号
      orderInfo: "",
      playDate: "",
      couponAnimation: null,
      couponAnimationData: {},
      couponCode: "", //优惠券code
      orderId: "",
      flagShow: true,
      canScroll: false,
      isface: false,
      eateryData: {},
      conponList: {},
      mealNum: 0, //数量
      subtotal: 0, //小计
      usercoupon: {}, //使用优惠券数据
      usercouponShow: false, //是否使用了优惠券
      subFormShow: true
    };
  },
  components: {
    floatNav,
    Popup,
    popContacts,
    couponList,
    pay,
    rlsb,
    XDialog
  },
  computed: {},
  watch: {
    num (val) {
      if (this.obj) {
        //使用了优惠券
        this.getPrice(this.obj);
      } else {
        //没有使用优惠券
        this.getPrice(0);
      }
    }
  },
  methods: {
    sub () {
      let _this = this;
      if (this.mealNum > 0) {
        this.mealNum--;
        this.subtotal = (this.conponList.priceSettle * this.mealNum).toFixed(2);
        if (this.usercouponShow) {
          this.getPrice(_this.usercoupon);
        } else {
          this.getPrice(0);
        }
      }
    },
    add () {
      let _this = this;
      this.mealNum++;
      this.subtotal = (this.conponList.priceSettle * this.mealNum).toFixed(2);
      if (this.usercouponShow) {
        this.getPrice(_this.usercoupon);
      } else {
        this.getPrice(0);
      }
    },

    imgUrl (src) {
      this.faceUrls = src;
    },
    showContactsPop () {
      this.$refs.contactsList.showContacts();
    },

    //获取下单数量和总金额 val为优惠券金额
    getPrice (obj) {
      let _this = this;
      if (obj == 0) {
        //不使用优惠券
        this.totalprice = 0;
        if (this.mealNum > 0) {
          this.totalprice = _this.conponList.priceSettle * this.mealNum;
        }
        this.totalprice = this.totalprice.toFixed(2);
      } else {
        //使用优惠券
        switch (obj.applyType) {
          case "all":
          case "type":
            this.totalprice =
              this.subtotal > obj.amount ? this.subtotal - obj.amount : 0;
            this.totalprice = this.totalprice.toFixed(2);
            break;
          case "used":
            let duseCouponprice = 0;

            for (let j = 0; j < obj.productInfos.length; j++) {
              if (
                this.conponList.productCode == obj.productInfos[j].productCode
              ) {
                duseCouponprice =
                  this.subtotal > obj.amount ? this.subtotal - obj.amount : 0;
              }
            }

            this.totalprice = duseCouponprice;
            this.totalprice = this.totalprice.toFixed(2);
            break;
        }
      }
    },
    //支付
    pay () {
      let _this = this;
      this.flagShow = true;
      let extendParam = {
        orderInfo: this.orderInfo,
        redirectUrl: encodeURIComponent(window.location.href),
        openId: this.openId ? this.openId : ""
      };
      let formData = {
        accountId: this.$route.query.m_id,
        extendParamJson: JSON.stringify(extendParam),
        operateId: localStorage.getItem("xjsc_login_userId_2019_3_8"),
        payOrderNo: this.orderNo,
        paySum: this.totalprice,
        payType: this.payType,
        userType: "C",
        wayType: 1
      };
      this.getAxios(this.api.main.pay.goPay, formData).then(res => {
        let env = isWxAli();
        this.formStr = res.data;
        this.isWxPay = env.isWx;
        this.$refs.pay.aliPayShow = true;
      });
    },
    //手机号验证
    checkMobile (val) {
      if (!/1[3-9][0-9]{9}$/.test(val) && val.length != 11) {
        return true;
      }
    },
    //身份证验证
    checkIdCard (vla) {
      if (
        !/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(
          vla
        )
      ) {
        return true;
      }
    },
    subForm () {
      this.flag = true;
      // console.log(1);
      try {
        if (!this.buyerName) {
          this.flag = false;
          this.$vux.toast.text("联系人姓名不能为空！", "middle");
          return;
        }
        if (!this.buyerMobile) {
          this.flag = false;
          this.$vux.toast.text("联系人手机号不能为空！", "middle");
          return;
        } else if (this.checkMobile(this.buyerMobile)) {
          this.flag = false;
          this.$vux.toast.text("请输入正确的手机号码！", "middle");
          return;
        }
      } catch (e) { }
      // this.subFormShow = false;
      if (this.flag) {
        let formData = {
          modelCodes: "",
          leaguerId: "",
          buyerName: this.buyerName,
          buyerMobile: this.buyerMobile,
          buyerIdNo: this.buyerIdNo,
          amounts: "",
          wayType: 1,
          orderType: "eatery",
          marketingType: 0,
          paySum: null,
          faceUrl: this.faceUrls,
          startTime: this.playDate,
          couponCode: this.couponCode ? this.couponCode : ""
        };
        let arr = [];

        // this.ticketType.forEach((item, index) => {
        //     modelCodes.push(item.modelCode);
        //     amounts.push(item.num);
        //     paySum += item.priceSettle * item.num * 100;
        // });
        formData.paySum = this.subtotal;
        formData.modelCodes = this.conponList.productCode;
        formData.amounts = this.mealNum;

        let _url = this.api.order.saveOrder;
        let env = isWxAli();
        this.postAxios(_url, formData)
          .then(
            result => {
              this.orderNo = result.data.payOrderNo;
              this.orderInfo = result.data.orderDescription;
              this.orderId = result.data.id;
              this.getAxios(
                "/merchant/api/merchantPayType/getMerchantPayType",
                {
                  businessType: env.isWx
                    ? "WEIXIN"
                    : env.isAliPay
                      ? "ALI"
                      : "WAP"
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

                // console.log(payType);
              });
            },
            reject => { }
          )
          .catch(error => { });
      }
    },
    //常用联系人填充取票联系人信息
    fillContact (item) {
      // console.log(item);
      this.buyerName = item.name;
      this.buyerMobile = item.phone;
      this.buyerIdNo = item.certNo ? item.certNo : "";
      this.faceUrls = item.faceUrl;
      if (this.isface) {
        this.$refs.rlsb.faceUrl = item.faceUrl ? item.faceUrl : "";
      }
    },
    //下单获取优惠券列表
    getCoupons () {
      //   this.openCouponModal();
      let couponUrl = this.api.main.marketing.useCoupons;
      let cpArr = [],
        modelprice = "";

      modelprice = this.conponList.productCode + "-" + this.conponList.priceSettle;
      this.getAxios(couponUrl, {
        userId: localStorage.getItem("xjsc_login_userId_2019_3_8"),
        moldCodes: modelprice
      }).then(res => {
        this.couponList = res.data;
        this.couponList.forEach((item, index) => {
          // item.validStartDate = item.validStartDate.substr(0, 10);
          // item.validEndDate = item.validEndDate.substr(0, 10);
          item.amount = item.amount >= 1 ? item.amount.toFixed(2) : item.amount;
          return;
        });
        this.$refs.couponList.show(res.data);
      });
    },
    //使用优惠券
    useCoupon (obj) {
      this.couponCode = obj.code;
      this.usercoupon = obj;
      // this.getPrice(obj.amount, obj.productCode, obj);
      this.getPrice(this.usercoupon);
      this.usercouponShow = true;
      this.couponUserType = obj.useThreshold;
      if (this.couponUserType == "T") {
        this.couponUserNum = obj.targetAmout;
      }
      this.couponName = obj.name;
      //   this.closeCouponModal();
    },
    //不使用优惠券
    Undontuse () {
      this.obj = null;
      this.couponCode = "";
      this.getPrice(0);
      this.couponUserType = "";
      this.couponName = "";
      this.couponUserNum = "";
    }
  },
  created () {
    document.title = "填写订单信息";
    //登录权限验证
    this.checkToken();
    let obj = JSON.parse(localStorage.getItem("eateryOrderData"));
    // let faceFlag = false;
    // this.isface = faceFlag;
    this.conponList = obj;
    this.getPrice(0);
  }
};
</script>

<style lang="scss">
@import "../../../assets/styles/mixin.scss";
.repast-order {
  .real-list-box {
    background: #ffffff;
    // padding: 8px 0;
    margin-bottom: 10px;
    padding-left: 14px;
    .info-list {
      padding: 0;
      border-bottom: 0.5px solid #eeeee7;
      .info-item {
        margin-bottom: 0;
        height: 53px;
        line-height: 53px;
        border-bottom: 0.5px solid #eeeee7;
        // margin-left: 14px;
        .info-title {
          font-size: 14px;
          // padding-left: 14px;
        }
        input {
          font-size: 14px;
          outline: none;
          border: none;
        }
        input::-webkit-input-placeholder {
          color: #999;
          font-size: 13px;
        }
        input:-moz-placeholder {
          color: #999;
          font-size: 13px;
        }
        input:-ms-input-placeholder {
          color: #999;
          font-size: 13px;
        }
      }
      .info-item:last-child {
        border-bottom: none;
      }
    }
  }
  .notice-body {
    background: #ffffff;
    .notice-title {
      text-align: center;
      color: #413838;
      font-size: 16px;
      margin-top: 10px;
    }
    .notice-content {
      padding: 0 10px;
      padding-bottom: 0px;
      max-height: 320px;
      overflow: auto;
      margin: 10px 0;
      text-align: left;
       img {
        width: 100% !important;
        height: auto !important;
      }
      strong,
      b {
        font-weight: bold;
      }
      em,
      i {
        font-style: italic;
      }
    }
    .footer {
      border-top: 0.5px solid #eeeee7;
      @include fbc;
      .no-agree {
        color: #413838;
        font-size: 16px;
        height: 49px;
        line-height: 49px;
        text-align: center;
        width: 50%;
      }
      .agree {
        color: #fff;
        background: #f05b47;
        font-size: 16px;
        height: 49px;
        line-height: 49px;
        text-align: center;
        width: 50%;
      }
    }
  }
  .ypym-warpper {
    padding: 0 15px;
    background: #f4f4f4;
    .ypyp-section {
      @include fbc;
      height: 48px;
      &.add-sub-section {
        align-items: flex-start;
        margin-top: 10px;
      }
      .ticket-name {
        color: #333;
        font-size: 14px;
      }
      .ticket-price {
        color: #333;
        font-size: 14px;
      }
      .ticket-num {
        color: #413838;
        font-size: 12px;
        font-weight: bold;
      }
      .add-sub-num {
        display: flex;
        align-items: center;
        .num {
          margin-right: 15px;
          font-size: 18px;
          color: #413838;
        }
      }
    }
    .time-list {
      padding-bottom: 15px;
      .time-item {
        padding: 3px 5px;
        display: inline-block;
        margin-right: 5px;
        border: 1px solid #aaa;
        border-radius: 4px;
        font-size: 14px;
        color: #413838;
        &.active {
          border-color: #f05b47;
          color: #f05b47;
        }
      }
    }
  }
  .couponBody {
    background-color: #f7f7f7;
    .coupons_list {
      padding-top: 12px;
      .item-ul {
        padding: 0 8px;
        .item-li {
          margin-bottom: 20px;
          height: 140px;
          background: url("http://statics.lotsmall.cn/wx/img/coupons-bg.png")
            center center no-repeat;
          background-size: 100%;
          position: relative;
          .left {
            display: inline-block;
            width: 273px;
            .name {
              margin-top: 7px;
              color: #fff;
              font-size: 14px;
              font-family: PingFangSC-Regular, sans-serif;
              padding-left: 14px;
            }
            .price {
              padding-left: 40px;
              color: #fff;
              margin-top: 6px;
              margin-bottom: 9px;
              font-family: PingFangSC-Regular, sans-serif;
              .unit {
                font-size: 18px;
              }
              .num {
                font-size: 35px;
              }
            }
          }
          .date-use {
            line-height: 10px;
            position: absolute;
            left: 15px;
            bottom: 5px;
            font-size: 9px;
            color: #fff;
            font-family: PingFangSC-Semibold, sans-serif;
            .date {
              margin-bottom: 2.5px;
            }
            .use {
              margin-bottom: 5px;
            }
          }
          .right {
            height: 103px;
            display: inline-block;
            width: calc(100% - 273px);
            text-align: center;
            position: relative;
            .right-btn {
              border: none;
              width: 66px;
              height: 25px;
              line-height: 25px;
              border-radius: 2px;
              background: #fff;
              font-size: 14px;
              color: #f05b47;
              font-family: PingFangSC-Regular, sans-serif;
              margin-top: 44px;
              display: block;
            }
          }
        }
      }
      .btn {
        display: block;
        color: #413838;
        border-radius: 6px;
        width: 90%;
        height: 38px;
        line-height: 38px;
        margin-left: 5%;
        text-align: center;
        font-size: 15px;
        background-color: #fff;
        box-shadow: 0 0 10px rgba(245, 245, 245, 0.5);
        margin-bottom: 10px;
        //   position:fixed;
      }
      .btn-top {
        bottom: 100px;
        left: 0;
      }
      .btn-bot {
        bottom: 0;
        left: 0;
      }
    }
  }
  .noData {
    .nodata-text {
      font-size: 16px;
      color: #999999;
      text-align: center;
      width: 100%;
      display: block;
      margin: 7px auto 0;
    }
  }
  .playDate {
    width: 100%;
    height: 57px;
    line-height: 57px;
    overflow: hidden;
    background-color: #fff;

    .play-item-title {
      width: 60px;
      font-size: 14px;
      color: #413838;
      float: left;
      margin-left: 15px;
    }
    .play-input-wrap {
      position: relative;
      // width: 150px;
      float: right;
      margin-right: 18px;
      .playDate-text {
        font-size: 14px;
        color: #413838;
      }
      .calendar {
        color: #f05b47;
        font-size: 14px;
        margin-left: 5px;
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
    // margin-bottom: 10px;
    background: #f7f7f7;
    // padding: 20px 14px;
    // padding-top: 20px;
    padding-bottom: 20px;
    .hotel-item {
      // padding-bottom: 11px;

      width: 100%;
      .hotel-item-main {
        width: 100%;
        // margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .hotel-info {
          width: 100%;
          background-color: #fff;
          .counpon-title {
            .title {
              margin-left: 10px;
              margin-top: 10px;
              font-size: 16px;
              color: #413838;
              display: inline-block;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
            }
            .buy-price {
              font-size: 14px;
              color: #413838;
              padding-bottom: 10px;
              .price {
                margin-right: 10px;
              }
            }
          }
          .numbox {
            padding: 5px 0;
            padding: 0 10px;
            font-size: 14px;
            color: #413838;
            height: 45px;
            line-height: 45px;
            border-top: 0.5px solid #eee;
            .addnum {
              .price {
                font-size: 14px;
                color: #fc4150;
              }
              .px-right {
                display: flex;
                .number {
                  font-size: 16px;
                  color: #413838;
                  display: inline-block;
                  vertical-align: middle;
                  margin-right: 18px;
                }
                .sub {
                  color: rgba(255, 99, 99, 1);
                  font-size: 16px;
                  border: 1px solid rgba(255, 99, 99, 1);
                  border-right: none;
                  margin-top: 10px;
                  height: 25px;
                  line-height: 24px;
                  width: 40px;
                  text-align: center;
                  display: inline-block;
                  vertical-align: middle;
                  border-top-left-radius: 3px;
                  border-bottom-left-radius: 3px;
                }

                .add {
                  color: rgba(255, 99, 99, 1);
                  font-size: 16px;
                  border: 1px solid #ff6363;
                  margin-top: 10px;
                  height: 25px;
                  line-height: 24px;
                  width: 40px;
                  text-align: center;
                  display: inline-block;
                  vertical-align: middle;
                  border-top-right-radius: 3px;
                  border-bottom-right-radius: 3px;
                }
                .sub0 {
                  border: 1px solid rgba(255, 99, 99, 0.35) !important;
                  border-right: none !important;
                  color: rgba(255, 99, 99, 0.35) !important;
                }
              }
            }
          }
        }
      }
    }
  }
  .buyer-info {
    background: #ffffff;
    margin-bottom: 10px;
    padding: 20px 15px;
    padding-bottom: 0;
    padding-right: 0px;
    .info-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      // margin-right: 15px;
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
          font-family: PingFangSC-Medium, sans-serif;
        }
        .link-tips {
          font-size: 12px;
          color: #767676;
        }
      }
      .contacter-icon {
        width: 17px;
        height: 17px;
        padding: 10px;
        padding-left: 50px;
        padding-right: 15px;
        display: block;
      }
    }
  }
  .contact-info {
    .info-item {
      // line-height: 53px;
      height: 53px;
      border-bottom: 0.5px solid #eeeee7;
      display: flex;
      align-items: center;
    }
    .info-item:last-child {
      border-bottom: none;
    }
  }
  .info-list {
    padding-top: 10px;

    .info-list-title {
      height: 43px;
      line-height: 50px;
      // margin-left: 14px;
      border-bottom: 0.5px solid #eeeee7;
      .title-text {
        color: #999;
        font-family: PingFangSC-Regular, sans-serif;
        display: inline-block;
        vertical-align: middle;
        font-size: 14px;
      }
      .del-yk-icon {
        width: 12px;
        height: 13.5px;
        display: inline-block;
        vertical-align: middle;
        margin-left: 15px;
      }
    }
    .info-item {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 14px;
      color: #413838;
      position: relative;
      .info-title {
        width: 77px;
        font-family: PingFangSC-Regular, sans-serif;
      }
      .preview-img {
        width: 30px;
        height: 30px;
        // margin-left: 35px;
      }
      .input-style {
        color: rgba(65, 56, 56, 0.5);
        font-size: 14px;
        font-family: PingFangSC-Regular, sans-serif;
      }
      input {
        width: 240px;
        outline: none;
        border: none;
      }
      .coupon-svg {
        font-size: 12px;
        color: #f05b47;
      }
      .coupons-icon {
        width: 9px;
        color: #f05b47;
        padding-left: 15px;
      }
      .camera-icon {
        width: 30px;
        height: 26.5px;
      }
      .rotate {
        transform: rotate(180deg);
        -ms-transform: rotate(180deg);
        -moz-transform: rotate(180deg);
        -webkit-transform: rotate(180deg);
        -o-transform: rotate(180deg);
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
  .add-tourist {
    padding-left: 8px;
    .add-yk {
      width: 16px;
      height: 16px;
      display: inline-block;
      vertical-align: middle;
    }
    .yk-text {
      font-size: 14px;
      color: #f05b47;
      display: inline-block;
      vertical-align: middle;
      margin-left: 8px;
    }
  }
  .coupon-warper {
    background: #ffffff;
    margin-bottom: 10px;
    padding-left: 15px;
    padding-top: 0;
    .info-item {
      padding-right: 13px;
      height: 53px;
      border-bottom: 0.5px solid #eeeee7;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .coupon-info {
        display: flex;
        align-items: center;
        height: 25px;
        .info-title {
          height: 25px;
          line-height: 25px;
          margin-top: 1px;
        }
        .info-content {
          background: #ffffff;
          outline: none;
          border: none;
        }
        .coupon-name {
          // margin-left: 30px;
          width: 200px;
          @include oh;
          white-space: nowrap;
        }
      }
    }
    .info-item:last-child {
      border-bottom: none;
    }
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
      .title {
        margin-right: 10px;
      }
      .money {
        margin-top: 1px;
        line-height: 16px;
        float: right;
        margin-right: 10px;
        .unit {
          color: #fc4150;
          font-family: PingFangSC-Medium, sans-serif;
          font-size: 12px;
          margin-right: 4px;
        }
        .price {
          color: #fc4150;
          font-family: PingFangSC-Medium, sans-serif;
          font-size: 18px;
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
    .btn-sub {
      background-color: #ccc;
    }
  }

  .toast-box {
    .camera-modal {
      background: #fff;
      height: 169px;
      border-top-left-radius: 2px;
      border-top-right-radius: 2px;
      padding-top: 0;
      .camera-content {
        background-color: #fff;
        .camera-do-ul {
          background-color: #fff;
          .camera-do-li {
            height: 55px;
            line-height: 55px;
            text-align: center;
            color: #020403;
            font-size: 16px;
            background-color: #fff;
          }
          .h10 {
            height: 10px;
            box-shadow: 0 10px 5px 0 rgba(242, 242, 242, 0.95);
          }
          .bb05 {
            border-bottom: 0.5px solid #d1d1d1;
            box-sizing: border-box;
          }
          .h49 {
            height: 49px;
            line-height: 49px;
          }
        }
      }
    }
  }
  .canvas-hide {
    position: fixed;
    right: 100%;
    top: 0;
  }
}
</style>
