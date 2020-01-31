<template>
  <div class="router-order"
       :class="{overflow:canScroll}">
    <div class="playDate boxshadow">
      <div class="ticket-l">
        <h3 class="ticket-name">跟团游</h3>
        <h5 class="ticket-subtitle">
          <span v-for="(item,index) in ticketType"
                :key="index">{{item.ticketName}} : {{item.num}}</span>
        </h5>
      </div>
    </div>
    <div class="linearGradient"></div>
    <div class="route-date">
      <div class="route-date-label">游玩日期</div>
      <div class="route-date-text">{{playDate}}</div>
    </div>
    <div class="linearGradient"></div>
    <!-- <div class="hotel-list">
            <div v-for="(item,index) in ticketType" :key="index" class="hotel-item">
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

        </div> -->

    <div class="buyer-info">
      <div class="info-head">
        <div class="head-title">
          <!-- <span class="line"></span> -->
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
        提交订单
      </div>
      <!-- <div v-else class="right-warper">
        提交订单
      </div> -->
    </div>
    <!--联系人弹框-->
    <!-- <popup class="order-pop" v-model="show" height=60% position="bottom">
            <div class="toast-box">
                <i @click="closeModal" class="fr close xx-icon icon-guanbi2"></i>
                <div class="modal-content">
                    <div :style="{'height': '400px'}">
                        <div v-if="contactList.length" class="contacter-ul">

                            <div v-for="(item, index) in contactList" :key="index" class="contacter-li">
                                <div class="c-li-left">
                                    <p class="contacter-name" @click="fillContact(item.name,item.phone,item.certNo)">{{item.name}}</p>
                                    <p class="contacter-tel" @click="fillContact(item.name,item.phone,item.certNo)">
                                        <span class="contacter-label"><img src="http://statics.lotsmall.cn/wx/img/icon-tel.png" class="tel-icon"></span>
                                        <span class="tel-text">{{item.phone}}</span>
                                    </p>
                                    <p class="contacter-idcard">
                                        <span v-if="item.certNo" class="contacter-label" @click="fillContact(item.name,item.phone,item.certNo)"><img src="http://statics.lotsmall.cn/wx/img/icon-idcard.png" class="idcard-icon"></span>
                                        <span v-if="item.certNo" class="idcard-text" @click="fillContact(item.name,item.phone,item.certNo)">{{item.certNo}}</span>
                                        <span v-else class="add-information" @click="goUrl(item.id)">信息不全，点击补充</span>
                                    </p>
                                </div>
                                <div class="c-li-right">
                                    <img src="http://statics.lotsmall.cn/wx/img/icon-edit.png" class="edit-icon" @click="goUrl(item.id)">
                                    <img src="http://statics.lotsmall.cn/wx/img/icon-del.png" class="del-icon" @click="delContact(item.id)">
                                </div>
                            </div>

                        </div>
                        <div v-else class="noData contact-nodata">
                            <i class="xx-icon icon-iconfont-gantanhaom"></i>
                            <span class="nodata-text">暂无常用联系人，请前往个人中心添加！</span>
                        </div>

                    </div>
                </div>
                <div v-if="contactList.length==0" class="fixed-bottom" @click="goLinkman">
                    去添加
                </div>

            </div>
        </popup> -->
    <!--联系人弹框-->

    <!--支付弹框-->
    <!-- <popup class="order-pop-pay" v-model="payShow" height=30% position="bottom">
            <div class="toast-box">
                <div class="modal-content pay-sure">
                    <div class="pay-money bg-w  m-b-10 boxshadow">
                        <span class="title">支付金额:</span>
                        <span>￥{{totalprice}}</span>
                    </div>
                    <div class="pay-way bg-w boxshadow">
                        <div class="pay-info">
                            <i class="xx-icon icon-iconfont-weixin1 pay-svg fl"></i>
                            <span class="pay-name fr">微信支付</span>
                        </div>
                    </div>
                    <div class="pay-btn" @click="wxpay">去支付</div>
                </div>
            </div>
        </popup> -->
    <!--支付弹框-->
    <!--优惠券弹框-->
    <!-- <popup class="order-pop-coupon" v-model="couponShow" height=100% position="top">
            <div class="toast-box">
                <div class="couponBodyTab">
                    <div class="couponList inner coupons_list">
                        <div v-if="couponList.length>0" class="item-ul">

                            <div v-for="(item, index) in couponList" :key="index" class="item-li boxshadow">
                                <div class="left">
                                    <div class="name">{{item.name}}</div>
                                    <div class="price">
                                        <span class="unit">￥</span>
                                        <span class="num">{{item.amount}}</span>
                                    </div>
                                </div>
                                <div class="date-use">
                                    <div class="date">
                                        <span class="title">可用时间：</span>
                                        <span class="text" v-if="item.validityDateType=='relative'">领取后{{item.relativeDay}}天失效</span>
                                        <span v-else class="text">{{item.validStartDate}} 至 {{item.validEndDate}}</span>
                                    </div>
                                    <div class="use">
                                        <p v-if="item.useThreshold=='F'">
                                            使用条件：无限制
                                        </p>
                                        <p v-else>
                                            使用条件：满{{item.targetAmout}}元可用
                                        </p>
                                    </div>
                                </div>
                                <div class="right fr">
                                    <span class="right-btn" @click="useCoupon(item)">立即使用</span>
                                </div>
                            </div>

                        </div>
                        <div v-else class="noData">
                            <span class="nodata-text">暂无优惠信息</span>
                        </div>
                        <span v-if="couponList.length>0" class="btn cancle-coupon-choice" @click="Undontuse">不使用优惠券</span>
                        <span class="btn cancle-coupon-choice" @click="dontuse">返回</span>
                    </div>
                </div>
            </div>
        </popup> -->
    <div>
      <div v-html="formStr"></div>
    </div>
    <!--联系人弹框-->
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
import popContacts from "./public/popContacts";
import couponList from "./public/couponList";
import floatNav from "@/components/floatNav";
import pay from "./public/pay";
import {
  Swiper,
  SwiperItem,
  Popup,
  DatetimeView,
  Group,
  XDialog,
  Confirm
} from "vux";
export default {
  components: {
    floatNav,
    popContacts,
    couponList,
    pay,
    Swiper,
    SwiperItem,
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
      subFormShow: true,
      couponName: "", //优惠券名称
      couponUserType: "", //优惠券  优惠活动
      couponUserNum: "", //优惠券使用门槛
      animation: null,
      animationData: {},
      show: false,
      ticketType: [],
      sumnum: 0,
      totalprice: 0,
      buyerName: "",
      buyerMobile: "",
      buyerIdNo: "",
      src: "",
      flag: true,
      payShow: false,
      payAnimation: null,
      payAnimationData: {},
      orderNo: null, //订单号
      orderInfo: "",
      playDate: '',
      beginDate: "",
      endDate: "",
      imgWidth: null,
      imgHeight: null,
      contactList: [],
      couponList: [],
      couponShow: false,
      couponAnimation: null,
      couponAnimationData: {},
      couponCode: "", //优惠券code
      orderId: "",
      flagModal: true, //点击其他地方，支付弹框不要消失
      canScroll: false //是否允许页面滑动
    };
  },
  computed: {},
  methods: {
    openModal () {
      this.$refs.contactsList.showContacts();
    },
    getPrice (obj) {
      this.totalprice = 0;
      this.sumnum = 0;
      if (obj == 0) {
        this.ticketType.forEach((item, index) => {
          this.totalprice += item.salePrice * item.num;
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
              duseCprice += item.num * item.salePrice;
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
                this.ticketType[i].salePrice * this.ticketType[i].num;
              for (let j = 0; j < obj.productInfos.length; j++) {
                if (
                  this.ticketType[i].modelCode ==
                  obj.productInfos[j].productCode
                ) {
                  ucoupontotalp +=
                    this.ticketType[i].salePrice * this.ticketType[i].num;
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
        let env = isWxAli();
        this.formStr = res.data;
        this.isWxPay = env.isWx;
        this.$refs.pay.aliPayShow = true;
      });
    },
    //支付弹框
    openPayModal () {
      this.canScroll = true;
      this.payShow = true;
    },
    closePayModal () {
      this.canScroll = false;
      if (this.flagModal == false) {
        this.payShow = false;
      }
    },

    //优惠券弹框
    openCouponModal () {
      this.couponShow = true;
      //   this.handlecToggle(0);
    },
    closeCouponModal () {
      this.couponShow = false;
      //   this.handlecToggle(-375);
    },
    handlecToggle (num) {
      this.couponAnimation.right(num * 2 + "rpx").step();
      this.couponAnimationData = this.couponAnimation.export();
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
      if (!this.buyerName) {
        this.flag = false;
        this.$vux.toast.text("联系人姓名不能为空！", "middle");
      }
      if (!this.buyerMobile) {
        this.flag = false;
        this.$vux.toast.text("联系人手机号不能为空！", "middle");
      } else {
        if (this.checkMobile(this.buyerMobile)) {
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
      // this.subFormShow = false;
      if (this.flag) {
        let modelCodes = [];
        let amounts = [];
        let routeParams = {};
        let paySum = 0;
        let formData = {
          modelCodes: "",
          leaguerId: "",
          buyerName: this.buyerName,
          buyerMobile: this.buyerMobile,
          buyerIdNo: this.buyerIdNo,
          amounts: "",
          wayType: 1,
          orderType: "route",
          marketingType: "",
          paySum: 0,
          routeParams: '',
          startTime: this.playDate,
          couponCode: this.couponCode
        };

        this.ticketType.forEach((item, index) => {
          modelCodes.push(item.modelCode);
          routeParams[index] = item.num;
          amounts.push(item.num);
          paySum += item.salePrice * item.num;
        });
        formData.paySum = paySum.toFixed(2);
        formData.modelCodes = modelCodes.join(",");
        formData.amounts = amounts.join(",");
        formData.routeParams = JSON.stringify(routeParams);

        let _url = this.api.order.saveOrder;
        let env = isWxAli();
        this.postAxios(_url, formData).then(
          result => {
            // this.subFormShow = true;
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
              });
            }
          },
          reject => {
            // this.subFormShow = true;
          }
        );
      }
    },
    //常用联系人对接
    getContacts () {
      let cListUrl = this.api.contacts.getContactsList;
      this.getAxios(cListUrl).then(res => {
        this.contactList = res.data;
      });
    },
    //删除常用联系人
    delContact (id) {
      let _this = this;
      this.$vux.confirm.show({
        // 组件除show外的属性
        title: "操作提示",
        content: "确定此删除联系人吗？",
        onCancel () { },
        onConfirm () {
          let delUrl = _this.api.contacts.deleteContacts;
          _this
            .getAxios(delUrl, {
              id: id
            })
            .then(res => {
              this.$vux.toast.success(res.message, "middle");
              _this.getContacts();
            });
        }
      });
    },
    //常用联系人填充取票联系人
    fillContact (ele) {
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
        cpArr.push(item.modelCode + "-" + item.salePrice * item.num);
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
    document.title = "填写订单信息";
    //下单页面拦截授权
    let tUrl = this.api.member.info;
    this.getAxios(tUrl, {});

    this.playDate = this.$route.query.playDate;
    //获取缓存票型信息
    let arr = [];
    arr = localStorage.getItem("ticketType");
    // console.log(arr);
    this.ticketType = JSON.parse(arr);
    this.getContacts();
    this.getPrice(0);
  }
};
</script>

<style lang="scss">
@import "../../../assets/styles/mixin.scss";
.router-order {
  .playDate {
    width: 100%;
    height: 70px;
    overflow: hidden;
    background-color: #fff;
    .ticket-l {
      padding-left: 18px;
      padding-top: 12px;
      .ticket-name {
        @include sc(18px, #413838);
        @include oh;
      }
      .ticket-subtitle {
        @include sc(12px, #5c5c5c);
        @include oh;
        span {
          margin-right: 10px;
        }
      }
    }
    .play-item-title {
      width: 60px;
      font-size: 14px;
      color: #413838;
      float: left;
      margin-left: 20px;
    }
  }
  .linearGradient {
    background-image: linear-gradient(to bottom, #f2f2f2, #fff);
    height: 10px;
  }
  .route-date {
    display: flex;
    line-height: 52px;
    background-color: #fff;
    .route-date-label {
      width: 77px;
      padding-left: 15px;
      @include sc(14px, #413838);
    }
    .route-date-text {
      color: #f66;
      font-size: 14px;
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
    z-index: 700;
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
  .order-pop.vux-popup-dialog {
    z-index: 700 !important;
  }
  .order-pop-coupon.vux-popup-dialog {
    z-index: 702 !important;
    background-color: #f7f7f7;
  }
  .order-pop-pay.vux-popup-dialog {
    z-index: 703 !important;
    background-color: #fff;
  }
  .toast-box {
    position: relative;
    background-color: #fff;
    .close {
      font-size: 16.5px;
      color: #b2b2b2;
      padding: 15px;
      font-size: 23px;
    }
    .fixed-bottom {
      position: absolute;
      left: 0;
      bottom: 0;
      text-align: center;
      width: 100%;
      background: #f05b47;
      color: #fff;
      font-size: 16px;
      height: 49px;
      line-height: 49px;
      font-family: PingFangSC-Regular, sans-serif;
    }
    .modal-content {
      // height: 345px;
      // overflow-y: scroll;
      .contacter-ul {
        padding-left: 15px;
        padding-right: 20px;
        .contacter-li {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          .c-li-left {
            width: 260px;
            .contacter-label {
              width: 17px;
              display: inline-block;
              vertical-align: middle;
            }
            .contacter-name {
              font-size: 14px;
              color: #413838;
            }
            .contacter-tel {
              height: 20px;
              line-height: 20px;
              .tel-icon {
                width: 7.5px;
                height: 11px;
                display: block;
              }
              .tel-text {
                font-size: 12px;
                color: rgba(65, 56, 56, 0.7);
                display: inline-block;
                vertical-align: middle;
              }
            }
            .contacter-idcard {
              height: 20px;
              line-height: 20px;
              .idcard-icon {
                width: 10.5px;
                height: 8.5px;
                display: block;
              }
              .idcard-text {
                font-size: 12px;
                color: rgba(65, 56, 56, 0.7);
                display: inline-block;
                vertical-align: middle;
              }
            }
          }
          .c-li-right {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .edit-icon {
              // float:right;
              width: 19px;
              height: 19.5px;
            }
            .del-icon {
              width: 16.5px;
              height: 18.5px;
              margin-left: 20px;
            }
          }
          .add-information {
            color: #f05b47;
            font-size: 11px;
          }
        }
      }
    }
    .pay-sure {
      background: #f7f7f7;
      height: 167.5px;
      // background: transparent;
      .pay-money {
        height: 55px;
        line-height: 55px;
        text-align: center;
        font-size: 16px;
        font-family: PingFangSC-Regular, sans-serif;

        color: #fc4150;
        .title {
          color: #020403;
          margin-right: 10px;
        }
      }
      .pay-way {
        padding: 0 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 55px;
        .pay-info {
          height: 55px;
          line-height: 55px;
          .pay-svg {
            color: #1aad19;
            font-size: 30px;
            margin-right: 10px;
          }
          .pay-name {
            font-size: 14px;
            font-family: PingFangSC-Regular, sans-serif;
            color: #020403;
          }
        }
        .payway-radio {
          color: #1aad19;
          transform: scale(0.7);
        }
      }
      .pay-btn {
        height: 49px;
        line-height: 49px;
        background: #1aad19;
        color: #fff;
        text-align: center;
      }
    }

    .couponBodyTab {
      .coupons_list {
        .noData {
          text-align: center;
          background-color: #f7f7f7;
          .nodata-text {
            display: inline-block;
            font-size: 15px;
            padding: 30px 0;
          }
        }
        .item-ul {
          padding: 10px 8px;
          .item-li {
            margin-bottom: 20px;
            height: 144px;
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
              position: absolute;
              left: 15px;
              bottom: 5px;
              font-size: 8px;
              color: #fff;
              font-family: PingFangSC-Semibold, sans-serif;
              .date {
                // margin-bottom: 2.5px;
              }
              .use {
                // margin-bottom: 5px;
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
        }
      }
    }
  }
}
</style>
