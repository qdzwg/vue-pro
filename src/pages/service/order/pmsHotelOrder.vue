<template>
  <div class="pmshotel-order" :class="{overflow:canScroll}">
    <div class="pmshotel-order-top">
      <div class="hotel-title">{{detailData.name}}</div>
    </div>
    <div class="hotel-list">
      <div v-for="(item,index) in ticketType" :key="index" class="hotel-item">
        <div class="hotelType-title clearfix">
          <div class="hotelType-name fl">{{item.name}}</div>
          <div class="hotel-right fr" @click="detailModal">
            <span>房型详情</span>
            <i class="xx-icon icon-xiangyoujiantou" style="font-size:14px;color: #0086f6;"></i>
          </div>
        </div>
        <div class="hotel-item-main">
          <span>{{item.ruleBook.ifBreakfast=='0'?'无早':item.ruleBook.ifBreakfast=='1'?'单早':item.ruleBook.ifBreakfast=='2'?'双早':item.ruleBook.ifBreakfast=='3'?'三早':''}}</span>
          <span>{{roomDetailData.acreage}}㎡</span>
          <span>{{roomDetailData.ifWindow=='0'?'有':roomDetailData.ifWindow=='1'?'无':roomDetailData.ifWindow=='2'?'落地':''}}窗</span>
          <span>{{roomDetailData.bedStr}}</span>
          <span>可住{{roomDetailData.number}}人</span>
        </div>
        <div class="hotel-date clearfix">
          <div class="date-box">
            <span class="date-text">{{beginDate.split("-")[1]}}月{{beginDate.split("-")[2]}}日</span>
            <span class="date-label">{{startWeek}}入住</span>
          </div>
          <div class="date-day">{{DateDiff(beginDate,endDate)}} 晚</div>
          <div class="date-box">
            <span class="date-text">{{endDate.split("-")[1]}}月{{endDate.split("-")[2]}}日</span>
            <span class="date-label">{{endWeek}}离店</span>
          </div>
        </div>
        <div class="hotelType-title hotelType-rules-box">
          <div class="hotelType-rules" v-if="item.ruleCancel.ifCancel=='F'">不可取消</div>
          <div
            class="hotelType-rules"
            v-else-if="item.ruleCancel.ifCancel=='T'&&item.ruleCancel.cancelTimeRule=='F'"
          >入住前，可免费取消</div>

          <div v-else class="hotelType-rules">{{item.cancelRuleStr?item.cancelRuleStr:''}}</div>
          <div class="hotel-right" @click="refundShow=true">
            <span>预订必读</span>
            <i class="xx-icon icon-xiangyoujiantou" style="font-size:14px;color: #0086f6;"></i>
          </div>
        </div>
      </div>
    </div>
    <div v-if="roomDetailData.stockNum<=5&&roomDetailData.stockNum!=0" class="reserve-box">
      <div class="reserve-text">
        <i class="xx-icon icon-shandian icon-res"></i>
        该客房仅剩最后{{roomDetailData.stockNum}}间，再不下单就......
      </div>
    </div>
    <div class="buyer-info">
      <div class="info-head">
        <div class="head-title">
          <span class="text">预订间数</span>
        </div>
        <numSpinner
          v-model="sumnum"
          :min="0"
          :max="roomDetailData.stockNum"
          :precision="0"
          @on-change="changeNum"
        ></numSpinner>
      </div>
      <div class="info-list">
        <div class="info-item">
          <div class="info-title">联系人</div>
          <input
            @blur="iosBlur"
            type="text"
            class="input-style"
            maxlength="10"
            placeholder="请填写联系人真实姓名（必填）"
            v-model="buyerName"
          />
          <div class="contacter-icon" @click="openModal">
            <i class="xx-icon icon-lianxiren icon-cont"></i>
            <span>常用</span>
          </div>
        </div>
        <div class="info-item">
          <div class="info-title">手机号</div>
          <input
            @blur="iosBlur"
            class="input-style"
            maxlength="11"
            placeholder="请填写手机号（必填）"
            v-model="buyerMobile"
          />
        </div>
        <div class="info-item">
          <div class="info-title">身份证</div>
          <input @blur="iosBlur" class="input-style" placeholder="请填写身份证号码" v-model="buyerIdNo" />
        </div>
        <div class="info-item">
          <div class="info-title">优惠活动</div>
          <activeity-item v-if="memberShow" :noTxt="false"></activeity-item>
          <input
            v-else
            class="info-content"
            placeholder-class="input-style"
            disabled
            placeholder="优惠活动信息"
          />
        </div>
      </div>
    </div>
    <!-- <div class="coupon-warper info-list">
            <div class="info-item" @click="getCoupons">
                <span class="info-title ">优惠券</span>
                <input placeholder-class='input-style' v-if="!couponName" disabled placeholder="优惠券选择">
                <span v-else style="display:inline-block;width:70%">{{couponName}}</span>
                <i class="xx-icon icon-xiangyoujiantou coupon-svg coupons-icon"></i>
            </div>
            <div class="info-item">
                <div class="info-title">优惠活动</div>
                <span v-if="couponUserType=='F'">无门槛</span>
                <div v-else>
                    <input placeholder-class='input-style' v-if="!couponUserNum" disabled placeholder="优惠活动信息">
                    <span v-else>满 {{couponUserNum}} 元可用</span>
                </div>
            </div>
    </div>-->
    <div class="ticket-detail-warpper m-b-10">
      <h2 class="ticket-w-title">入住须知</h2>
      <div class="ticket-detail-box">
        <p>
          <span>• 入离时间：</span>
          <span class="timeText">{{detailData.checkInTime}}</span> 以后入住，
          <span class="timeText">{{detailData.checkOutTime}}</span> 以前退房
        </p>
        <p v-if="detailData.ifPet">
          <span>• 宠物携带：</span>
          {{detailData.ifPet=='T'?'允许宠物携带':'不允许宠物携带'}}
        </p>
        <div class="clearfix" v-for="ele in detailData.checkInJson" :key="ele.name">
          <div v-if="ele.value" class="fl">• {{ele.key}}：</div>
          <div v-if="ele.value" style="margin-left: 82px;">{{ele.value}}</div>
        </div>
      </div>
    </div>
    <div class="dt-bottom-height"></div>
    <div class="bottom-box">
      <div class="left-warper">
        <div class="money">
          <span class="title">合计：</span>
          <span class="unit">￥</span>
          <span class="price">{{totalprice}}</span>
        </div>
        <!-- <div class="selected">
         （ <span class="title">已优惠：</span>
          <span class="unit">￥</span>
          <span>{{sumnum}}</span>）
        </div>-->
      </div>
      <div class="center-warper" @click="orderDetailShow=!orderDetailShow">
        <span>明细</span>
        <div :class="orderDetailShow?'icon-service-up':'icon-service-down'">
          <i class="xx-icon icon-xiangxiajiantou" style="font-size:14px;"></i>
        </div>
      </div>
      <div class="right-warper" @click="subForm">提交订单</div>
    </div>
    <div>
      <div v-html="formStr"></div>
    </div>
    <!-- 常用联系人 -->
    <pop-contacts ref="contactsList" @getContactsInfo="fillContact"></pop-contacts>
    <!-- 预订退款规则 -->
    <popup v-model="refundShow" :popup-style="{'z-index':610,'height':'360px'}">
      <div class="refund-box">
        <div class="modal">
          <slot name="header">
            <div class="modal-head clearfix">
              <span class="title">取消及退款政策</span>
              <i @click="refundShow=false" class="fr close xx-icon icon-cha2"></i>
            </div>
          </slot>
          <div class="modal-content">
            <rule :tableData="timeArr" :ruleCancel="ruleCancel" :quantuiTime="quantuiTime"></rule>
          </div>
        </div>
      </div>
    </popup>

    <!-- 明细 -->
    <popup v-model="orderDetailShow">
      <div class="orderDetail-box">
        <div class="modal">
          <slot name="header">
            <div class="modal-head clearfix">
              <span class="title">明细</span>
              <i @click="orderDetailShow=false" class="fr close xx-icon icon-cha2"></i>
            </div>
          </slot>
          <div class="modal-content">
            <div class="orderDetail-item">
              <div class="orderDetail-top clearfix">
                <span class="orderDetail-title">房费</span>
                <span class="fr">￥{{totalprice}}</span>
              </div>
              <div class="price-box" v-for="item in ticketType" :key="item.productId">
                <div
                  class="price-item clearfix"
                  v-for="ele in item.datePrices"
                  :key="ele.priceDate"
                >
                  <div class="price-left fl">
                    <span>• {{ele.priceDate.split("-")[1]}}月{{ele.priceDate.substring(0,10).split("-")[2]}}日</span>
                    <span style="margin-left:5px;">{{item.productName}}</span>
                  </div>
                  <div class="price-right fr">
                    <span>￥{{ele.price}}</span>
                    <span>×{{sumnum}}间</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- <div class="orderDetail-item">
              <div class="orderDetail-top">
                <span class="orderDetail-title">立减优惠</span>
                <span class="orderDetail-price fr">-￥{{totalprice}}</span>
              </div>
              <div class="price-box">
                <div class="price-item clearfix">
                  <div class="price-left fl">
                    <span>• 秋季特惠，下单享9折</span>
                  </div>
                  <div class="price-right fr">
                    <span>-￥100</span>
                  </div>
                </div>
              </div>
            </div>-->
            <div class="orderDetail-bot">
              <span>合计：</span>
              <span>￥{{totalprice}}</span>
            </div>
          </div>
        </div>
      </div>
    </popup>
    <!-- 优惠券 -->
    <coupon-list ref="couponList" @nouse="Undontuse" @use="useCoupon"></coupon-list>
    <!-- 支付宝支付确认 -->
    <pay
      ref="pay"
      class="pms-pay-modal"
       @payClose="noPay"
      :totalprice="totalprice"
      :isWxPay="isWxPay"
      @longPay="longPay"
      @wxIcbcPay="icbcPay"
       :isIcbc="isIcbc"
      :isAliAp="isAliAp"
       @aliApPay="aliApPay"
    ></pay>
    <float-nav></float-nav>
    <!-- //房型详情 -->
    <room-detail
      :hasBottom="false"
      :checkInTime="beginDate"
      :data="roomDetailData"
      @close="hotelTypeClose"
      v-model="detailModalShow"
    ></room-detail>
    <!-- 微信吸粉 -->
    <wx-fans v-if="inWeiXin"></wx-fans>
  </div>
</template>
<script>
import { isWxAli } from "@/common/common";
import { linkBaseUrl } from "../../../../config/index";
import { Popup, DatetimeView, Group, XDialog, Confirm, XTable } from "vux";
import popContacts from "./public/popContacts";
import couponList from "./public/couponList";
import floatNav from "@/components/floatNav";
import pay from "./public/pay";
import numSpinner from "../components/numSpinner";
import { formatterTime } from "../utils/index";
import rule from "../components/rule";
import roomDetail from "../detail/pmsHotel/roomDetail";
import wxFans from "../components/wxFans";
import activeityItem from "../detail/ticket/discountActivity/activeityItem";
export default {
  components: {
    activeityItem,
    roomDetail,
    rule,
    floatNav,
    popContacts,
    couponList,
    pay,
    Popup,
    DatetimeView,
    Group,
    XDialog,
    Confirm,
    numSpinner,
    XTable,
    wxFans
  },
  data() {
    return {
        isAliAp:false,
        isIcbc:false,//是否工行支付
        tradeNo: "", // 支付宝交易流水号
      memberShow: false, //是否有会员优享活动
      inWeiXin: false, //环境判断
      detailModalShow: false,
      timeArr: [],
      ruleCancel: {},
      quantuiTime: "",
      refundShow: false,
      orderDetailShow: false,
      detailData: {},
      startWeek: "今日",
      endWeek: "明日",
      isWxPay: false,
      payType: "",
      formStr: "",
      couponName: "", //优惠券名称
      couponUserType: "", //优惠券  优惠活动
      couponUserNum: "", //优惠券使用门槛

      ticketType: [],

      sumnum: 0,
      // totalprice: 0,
      buyerName: "",
      buyerMobile: "",
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
      canScroll: false, //是否允许页面滑动
      roomDetailData: {},
      pmsHotelBedTypeList: [],
      hotelDetailShow: false,
      isWxAli: false
    };
  },
  computed: {
    totalprice() {
      let sum = 0.0;
      this.sumnum = 0;
      this.ticketType.forEach((item, index) => {
        item.datePrices.forEach((el, i) => {
          //判断是否存在会员价
          let price;
          if (
            item.isMemberPrice &&
            (item.memberPrice || item.memberPrice == 0)
          ) {
            price = item.memberPrice * 100;
          } else {
            price = el.price * 100;
          }
          sum += item.num * 100 * price;
        });
        this.sumnum += item.num;
      });
      return (sum / 10000).toFixed(2);
    }
  },
  watch: {
    hotelDetailShow: {
      deep: true,
      handler: function(newV, oldV) {
        this.stopBodyScroll(newV);
      }
    }
  },
  methods: {
    longPay() {
      // 龙支付
      let _this = this;
      this.flagShow = true;
      let extendParam = {
        orderInfo: this.orderInfo,
        redirectUrl: encodeURIComponent(window.location.href),
        openId: this.openId ? this.openId : "",
        payerIp:returnCitySN["cip"] || ''
      };
      let formData = {
        accountId: this.$route.query.m_id,
        extendParamJson: JSON.stringify(extendParam),
        operateId:
          localStorage.getItem("xjsc_login_userId_2019_3_8") ||
          this.$cookie.get("leaguerInfoId"),
        payOrderNo: this.orderNo,
        paySum: this.totalprice,
        payType: 2015,
        userType: "C",
        wayType: this.wayType
      };
      this.getAxios(this.api.main.pay.goPay, formData).then(res => {
        if (res.data) {
          window.location.href = res.data;
        }
      });
    },
    icbcPay() {
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
    detailModal() {
      this.detailModalShow = true;
      this.hotelDetailShow = true;
    },
    hotelTypeClose() {
      this.hotelDetailShow = false;
    },
    stopBodyScroll(isFixed) {
      if (isFixed) {
        document.body.style.position = "fixed";
        this.top = window.scrollY; //并没有起到作用，但是最好是加上当
        document.body.style.top = -this.top + "px"; //同上
      } else {
        document.body.style.position = "";
        document.body.style.top = ""; //并没有起到作用，但是最好是加上当
        window.scrollTo(0, this.top); //同上
      }
    },
    getData() {
      this.getAxios("/merchant/api/pmsMerchantHotelType/getTypeProduct", {
        typeProductId: this.$route.query.productId,
        startDate: this.beginDate,
        endDate: this.endDate
      }).then(res => {
        let data = res.data;
        let it = this.pmsHotelBedTypeList.find(item => {
          return item.key == data.bedType;
        });
        if (it.value) {
          if (it.value.indexOf("-") == -1) {
            data.bedStr = it.value;
          } else {
            data.bedStr = it.value.split("-")[1];
          }
        }
        data.bedStr2 = it ? it.value : "";
        this.roomDetailData = data;
        this.ruleCancel = data.ruleCancel;
        if (data && data.ruleCancel && data.ruleCancel.cancelRuleJson) {
          let cancelRuleJson = JSON.parse(data.ruleCancel.cancelRuleJson);
          if (
            cancelRuleJson.excludeTime &&
            cancelRuleJson.excludeTime.minutes
          ) {
            this.quantuiTime = cancelRuleJson.excludeTime.minutes;
          } else {
            this.quantuiTime = "";
          }

          this.timeArr = formatterTime(
            this.beginDate,
            cancelRuleJson.excludeTimeAdd
          );
        } else {
          this.timeArr = [];
        }
      });
    },
    changeNum() {
      this.ticketType[0].num = this.sumnum;
    },
    DateDiff(sDate1, sDate2) {
      //sDate1和sDate2是xxxx-xx-xx格式
      var aDate, oDate1, oDate2, iDays;
      aDate = sDate1.split("-");
      oDate1 = new Date(aDate[1] + "/" + aDate[2] + "/" + aDate[0]); //转换为xx-xx-xxxx格式
      aDate = sDate2.split("-");
      oDate2 = new Date(aDate[1] + "/" + aDate[2] + "/" + aDate[0]);
      iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数
      return iDays;
    },
    openModal() {
      this.$refs.contactsList.showContacts();
    },
    aliApPay() {
      let _this = this;
      ap.tradePay(
        {
          tradeNO: this.tradeNo
        },
        function(res) {
          _this.$refs.pay.aliPayShow = false;
          // 9000 支付成功 8000 支付处理中
          if (res.resultCode == 9000 || res.resultCode == 8000) {
            let url =
              linkBaseUrl + "/payPlat/Notify/1?orderNo=" + _this.orderNo;
            window.location.href = url;
          }
        }
      );
    },
    //支付
    pay() {
      //微信支付
      let _this = this;
      this.flagModal = false;
      let extendParam = {
        orderInfo: this.orderInfo,
        redirectUrl: encodeURIComponent(window.location.href),
        openId: this.openId ? this.openId : "",
        payerIp:returnCitySN["cip"] || ''
      };
       // 特殊店铺对接工行支付 20200108 by lixuepeng
      if (this.merchantInfoId == '139' && typeof returnCitySN !== 'undefined') {
         extendParam.payerIp = returnCitySN["cip"] || '' 
      } 
      this.getAxios(this.api.main.pay.goPay, {
        accountId: this.$route.query.m_id,
        extendParamJson: JSON.stringify(extendParam),
        operateId: localStorage.getItem("xjsc_login_userId_2019_3_8"),
        payOrderNo: this.orderNo,
        paySum: this.totalprice,
        payType: this.payType,
        userType: "C",
        wayType: 1
      }).then(
        res => {
          //  this.flag = true
          // if(res.status==200||res.success){
          //    let env = isWxAli();
          //    this.formStr = res.data;
          //    this.isWxPay = env.isWx;
          //    this.$refs.pay.aliPayShow = true;
          // }else{
          //   this.$vux.toast.warn(res.message, "middle");
          // }
          if (res.payLink) {
              if (this.payType == "2019") {
              this.tradeNo = JSON.parse(res.data).orderNo;
              this.isAliAp = true;
              this.$refs.pay.aliPayShow = true;
              this.$nextTick(() => {
                this.flag = true;
              });
            } else if (this.payType == "12" || this.payType == "17") {
              //工行聚合支付
              let infoData = res.data;
              infoData =
                typeof infoData == "string" ? JSON.parse(infoData) : {};
              this.infoData = infoData;
              // this.formStr = res.data;
              this.isWxPay = this.inWeiXin;
              this.isIcbc = true;
              this.$refs.pay.aliPayShow = true;
              this.$nextTick(() => {
                this.flag = true;
              });
            } else if (this.payType == "70" || this.payType == "71") {
              //银联支付，直接跳转链接,智游宝悦单银联公众号支付,智游宝悦单银联二维码支付
              window.location.href = res.data;
            }else{
               let env = isWxAli();
            this.formStr = res.data;
            this.isWxPay = env.isWx;
            this.$refs.pay.aliPayShow = true;
            this.$nextTick(() => {
              this.flag = true;
            }); 
            }
            

          } else {
            let url = linkBaseUrl + "/payPlat/result?out_trade_no=" + res.data;
            window.location.href = url;
          }
        },
        error => {
          this.flag = true;
        }
      );
    },
    //表单验证
    checkMobile(val) {
      if (!/^1[345789]\d{9}$/.test(val)) {
        return true;
      }
    },
    checkIdcard(val) {
      if (
        !/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(
          val
        )
      ) {
        return true;
      }
    },
    subForm() {
      if (!this.buyerName) {
        this.$vux.toast.text("联系人姓名不能为空！", "middle");
        return false;
      }
      if (!this.buyerMobile) {
        this.$vux.toast.text("联系人手机号不能为空！", "middle");
        return false;
      } else {
        if (this.checkMobile(this.buyerMobile)) {
          this.$vux.toast.text("请输入正确的手机号码！", "middle");
          return false;
        }
      }
      if (this.buyerIdNo != "") {
        if (this.checkIdcard(this.buyerIdNo)) {
          this.$vux.toast.text("请输入正确的身份证号码！", "middle");
          return false;
        }
      }
      if (this.flag) {
        this.flag = false;
        let modelCodes = [];
        let amounts = [];
        let paySum = 0;
        let formData = {
          productIds: "",
          leaguerId:
            localStorage.getItem("xjsc_login_userId_2019_3_8") ||
            this.$cookie.get("leaguerInfoId"),
          buyerName: this.buyerName,
          buyerMobile: this.buyerMobile,
          amounts: "1",
          buyerIdNo: this.buyerIdNo,
          amounts: "",
          wayType: 1,
          marketingType: "",
          paySum: this.totalprice,
          startTime: this.beginDate,
          endTime: this.endDate
        };

        this.ticketType.forEach((item, index) => {
          modelCodes.push(item.productId);
          amounts.push(item.num);
        });
        formData.productIds = modelCodes.join(",");
        formData.amounts = amounts.join(",");
        //判断是否有推广码
        if (
          this.$route.query.spread_code ||
          this.$route.query.promoteCode ||
          this.$route.query.code
        ) {
          formData = Object.assign(formData, {
            promoteCode:
              this.$route.query.spread_code ||
              this.$route.query.promoteCode ||
              this.$route.query.code
          });
        }

        let _url = "/pmsorder/api/order/saveOrder";
        let env = isWxAli();

        this.postAxios(_url, formData).then(
          result => {
            if (result && (result.status == "200" || result.success)) {
              {
                this.orderNo = result.data.payOrderNo;
                this.orderInfo = result.data.orderDescription;
                this.orderId = result.data.id;

                // 工行139支付特殊处理
                if (this.$route.query.m_id == 139) {
                  this.payType = '2015';
                  this.pay();
                  return;
                }
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
                    this.getAxios(
                      "/leaguer/api/userLeaguer/manage/leaguerInfo",
                      {
                        leaguerId: localStorage.getItem(
                          "xjsc_login_userId_2019_3_8"
                        )
                      }
                    ).then(res => {
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
            } else {
              this.flag = true;
              this.$vux.toast.warn(result.message, "middle");
            }
          },
          reject => {
            this.flag = true;
          }
        );
      }
    },
    noPay() {
      //如果支付的话，相当于将优惠券信息置空，并且重新计算金额
      this.Undontuse();
    },
    //常用联系人填充取票联系人
    fillContact(ele) {
      this.buyerName = ele.name;
      this.buyerMobile = ele.phone;
      this.buyerIdNo = ele.certNo;
    },
    //下单获取优惠券列表
    getCoupons() {
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
    useCoupon(obj) {
      this.couponCode = obj.code;
      this.getPrice(obj);
      this.couponUserType = obj.useThreshold;
      if (this.couponUserType == "T") {
        this.couponUserNum = obj.targetAmout;
      }
      this.couponName = obj.name;
    },
    //不使用优惠券
    Undontuse() {
      this.couponCode = "";
      this.getPrice(0);
      this.couponUserType = "";
      this.couponName = "";
      this.couponUserNum = "";
      //   this.closeCouponModal();
    },
    //获取当前日期
    GetDateStr(AddDayCount) {
      var dd = new Date();
      dd.setDate(dd.getDate() + AddDayCount);
      var y = dd.getFullYear();
      var m = dd.getMonth() + 1;
      var mm = m < 10 ? "0" + m : m;
      var d = dd.getDate();
      var dd = d < 10 ? "0" + d : d;
      return y + "-" + mm + "-" + dd;
    },
    GetWeekStr(date) {
      var dd = this.GetDateStr(0);
      var dt = this.GetDateStr(1);
      var week = "";
      if (dd == date) {
        week = "今日";
      } else if (dt == date) {
        week = "明日";
      } else {
        week = "";
      }
      return week;
    },
    getWeek(date) {
      var week = new Date(date).getDay();
      if (week == 0) {
        week = "周日";
      } else if (week == 1) {
        week = "周一";
      } else if (week == 2) {
        week = "周二";
      } else if (week == 3) {
        week = "周三";
      } else if (week == 4) {
        week = "周四";
      } else if (week == 5) {
        week = "周五";
      } else if (week == 6) {
        week = "周六";
      }
      return week;
    },
    initPageData(data) {
      this.ticketType = data;
      this.sumnum = this.ticketType[0].num;
      this.getData();
    }
  },

  async created() {
    let data = await this.getAxios(
      "/pmsproduct/api/pmsHotel/listKeys?keys=" +
        "pmsHotelLevel,pmsHotelType,pmsHotelBedType"
    );
    this.pmsHotelBedTypeList = data.data.pmsHotelBedType;
    document.title = "酒店下单";
    let env = isWxAli();
    this.inWeiXin = env.isWx;
    //下单页面拦截授权
    let tUrl = this.api.member.info;
    this.getAxios(tUrl, {});
    //获取缓存入住和离店日期
    this.beginDate = localStorage.getItem("selectBegin");
    this.endDate = localStorage.getItem("selectEnd");
    this.startWeek =
      this.GetWeekStr(this.beginDate) == ""
        ? this.getWeek(this.beginDate)
        : this.GetWeekStr(this.beginDate);
    this.endWeek =
      this.GetWeekStr(this.endDate) == ""
        ? this.getWeek(this.endDate)
        : this.GetWeekStr(this.endDate);
    let hotelTypeArr = localStorage.getItem("pms_hotelName_2019_9_12_wxt");
    this.detailData = JSON.parse(hotelTypeArr);
    //获取缓存票型信息
    let arr = [];
    arr = localStorage.getItem("pms_ticketType_2019_5_14_czc");
    let dataArr = JSON.parse(arr);
    console.log(dataArr);
    //详情页面存在未登录的情况，因此，在在下单页面还是需要再次请求会员价接口
    //dataArr中item.isMemberPrice为false的产品码和价格
    //判断是否存在会员价  判断是否存在会员价，并对日价格进行替换
    let codePriceArr = [];
    dataArr.forEach(item => {
      if (item.isMemberPrice) {
        //存在会员价
        this.memberShow = true;
      } else {
        //收集item.isMemberPrice为price的产品码和价格
        codePriceArr.push(item.productCode + ":" + item.productPrice);
      }
    });
    if (codePriceArr.length) {
      //存在没有会员价的产品，需要请求会员价接口
      this.getAxios("/leaguer/api/leaguer/pubs/product/discount", {
        codePrice: codePriceArr.join(",")
      }).then(res => {
        if (res.status == 200) {
          //获取会员价对象merberPriceObj
          let merberPriceObj = {};
          res.message.split(",").forEach(item => {
            let strArr = item.split(":");
            merberPriceObj[strArr[0]] = Number(strArr[1]);
          });
          dataArr.forEach(item => {
            if (!item.isMemberPrice) {
              //只对item.isMemberPrice为false的数据做处理
              if (merberPriceObj[item.productCode] != item.productPrice) {
                // 价格不相同，有会员价
                item.isMemberPrice = true;
                //会员价
                item.memberPrice = merberPriceObj[item.productCode];
                //原价
                item.oldPrice = item.productPrice;
                //划线价
                item.linePrice = item.productPrice;
                //替换为划线价
                item.productPrice = merberPriceObj[item.productCode];
                //存在会员价
                this.memberShow = true;
              }
            }
          });
          this.initPageData(dataArr);
        } else {
          this.initPageData(dataArr);
        }
      });
    } else {
      this.initPageData(dataArr);
    }
    // this.getPrice(0);
  }
};
</script>

<style lang="scss">
.pmshotel-order {
  .pms-pay-modal {
    .vux-popup-dialog {
      z-index: 789;
    }
  }
  .orderDetail-box,
  .refund-box {
    .order-notice {
      padding: 10px 0;
      color: #413838;
      font-size: 14px;
    }
    .rule-warpper {
      padding: 0 10px;
    }
    .modal {
      background: #fff;
      color: #413838;
      height: 350px;
      padding-bottom: 10px;
      position: relative;
      z-index: 90;
      .modal-head {
        text-align: center;
        line-height: 55px;
        border-bottom: 1px solid #e1e1e1;
        .title {
          font-size: 16px;
          font-weight: bold;
        }
        .close {
          font-size: 14px;
          color: #b2b2b2;
          margin-right: 15px;
        }
      }
      .modal-content {
        height: calc(100% - 116px);
        overflow: auto;
        .refund-top {
          font-size: 14px;
          padding: 10px;
        }
        .orderDetail-item {
          padding-bottom: 10px;
          .orderDetail-top {
            width: 90%;
            height: 38px;
            line-height: 38px;
            background-color: #f8f8f8;
            margin: 10px auto;
            font-size: 14px;
            padding: 0 15px;
            font-weight: bold;
            .orderDetail-title {
            }
            .orderDetail-price {
              color: #ff6600;
            }
          }
          .price-box {
            padding: 0 15px;
            font-size: 14px;
            .price-item {
              .price-right {
                font-weight: bold;
              }
            }
          }
        }
        .orderDetail-bot {
          padding-right: 15px;
          margin-left: 15px;
          text-align: right;
          font-size: 14px;
          font-weight: bold;
          height: 49px;
          line-height: 49px;
          border-top: 1px solid #e1e1e1;
        }
      }
    }
  }
  .pmshotel-order-top {
    height: 153px;
    background: linear-gradient(to right, #ff9256, #ff4441);
    text-align: center;
    .hotel-title {
      color: #fff;
      font-size: 16px;
      font-weight: bold;
      padding: 20px 0 15px 0;
    }
  }
  .hotel-list {
    width: 90%;
    // height: 125px;
    margin: 0 auto;
    background: url("./../../../assets/images/order-bg.png") no-repeat;
    background-size: 100% 100%;
    padding: 10px;
    margin-top: -95px;
    margin-bottom: 10px;
    .hotel-item {
      padding-bottom: 11px;
      width: 100%;

      .hotelType-title {
        padding-top: 5px;
        .hotelType-name {
          width: 250px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #413838;
          font-size: 16px;
          font-weight: bold;
        }
        .hotel-right {
          color: #0086f6;
          font-size: 14px;
          width: 85px;
          text-align: right;
        }
        .hotelType-rules {
          color: #1ec08a;
          font-size: 14px;
        }
      }
      .hotelType-rules-box {
        padding: 18px 0 15px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .hotel-item-main {
        width: 100%;
        color: #413838;
        font-size: 14px;
        span {
          margin-right: 5px;
        }
      }
      .hotel-date {
        display: flex;
        align-items: center;
        color: #413838;
        .date-day {
          font-size: 12px;
          border: 1px solid #413838;
          color: #413838;
          width: 33px;
          height: 18px;
          line-height: 18px;
          text-align: center;
          float: left;
          margin-right: 10px;
        }
        .date-box {
          width: 135px;
          background-color: #fff;
          color: #0086f6;
          .date-label {
            font-size: 14px;
            color: #413838;
          }
          .date-text {
            font-size: 16px;
            font-weight: bold;
          }
        }
      }
    }
    .hotel-item:last-child {
      padding-bottom: 0;
    }
  }
  .reserve-box {
    background: #ffffff;
    .reserve-text {
      font-size: 14px;
      padding: 10px 15px;
      border-bottom: 1px solid #e1e1e1;
      background: linear-gradient(to right, #ff9256, #ff4441);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      .icon-res {
        font-size: 14px;
      }
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
    }
    .info-list {
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
        border-top: 0.5px solid #e1e1e1;
        .info-title {
          width: 77px;
          font-family: PingFangSC-Regular, sans-serif;
        }
        .contacter-icon {
          position: absolute;
          top: 15px;
          right: 10px;
          color: #0086f6;
          font-size: 14px;
          .icon-cont {
            color: #0086f6;
            font-size: 14px;
          }
        }
        .preview-img {
          width: 30px;
          height: 30px;
        }
        // .input-style {
        //   color: rgba(65, 56, 56, 0.5);
        //   font-size: 14px;
        //   font-family: PingFangSC-Regular, sans-serif;
        // }
        input {
          width: 255px;
          font-size: 14px;
          outline: none;
          border: none;
          color: #413838;
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
      border-top: 0.5px solid #e1e1e1;
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
  .ticket-detail-warpper {
    background: #fff;
    color: #413838;
    .ticket-w-title {
      font-size: 18px;
      color: #413838;
      font-weight: bold;
      padding: 20px 0px 20px 15px;
    }
    .hotel-w-title {
      font-size: 14px;
      color: #0086f6;
      padding: 20px 10px 20px 15px;
    }
    .ticket-detail-box {
      padding: 0px 15px 20px 15px;
      color: #413838;
      font-size: 14px;
      img {
        width: 100%;
      }

      .timeText {
        color: #1ec08a;
        font-weight: bold;
      }
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
    background: #333333;
    z-index: 500;
    .left-warper {
      width: 166px;
      font-size: 14px;
      color: #fff;
      padding-left: 10px;

      .selected {
        font-size: 12px;
      }
      .title {
        // margin-right: 19px;
      }
      .money {
        height: 19px;
        line-height: 15px;
        .unit {
          color: #fff;
          font-family: PingFangSC-Regular, sans-serif;
          font-size: 14px;
          margin-right: 4px;
        }
        .price {
          color: #fff;
          font-family: PingFangSC-Regular, sans-serif;
          font-size: 21px;
          //  font-weight: bold;
        }
      }
    }
    .center-warper {
      width: 80px;
      font-size: 14px;
      color: #fff;
      text-align: center;
      .icon-service-down {
        display: inline-block;
        transform: rotate(-180deg);
      }
      .icon-service-up {
        display: inline-block;
        transform: rotate(0deg);
      }
    }
    .right-warper {
      width: calc(100% - 246px);
      height: 49px;
      line-height: 49px;
      background: linear-gradient(to right, #ff9256, #ff4441);
      color: #fff;
      text-align: center;
      font-size: 16px;
    }
  }
}
</style>
