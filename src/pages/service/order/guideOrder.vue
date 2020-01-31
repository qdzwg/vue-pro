<template>
  <div class="ticket-order" :class="{overflow:canScroll}">
    <div class="ticket-order-title">
      <div class="coupon-warper info-list">
        <div class="info-item">
          <div class="coupon-info">
            <span class="info-title">{{guideInfo.nickName}}</span>
          </div>
          <!-- <div class="order-notice" @click="showNotice">
            <span>预定须知</span>
            <i class="xx-icon icon-xiangyoujiantou coupon-svg coupons-icon"></i>
          </div> -->
          <div class="order-notice guide-order-price">￥<span>{{currentPrice}}</span>元起</div>
        </div>
      </div>
      <x-dialog hide-on-blur v-model="modalNoticeFlag">
        <div class="notice-modal">
          <div class="title">
            <div class="text">{{guideInfo.nickName}}</div>
            <i @click="modalNoticeFlag=false" class="xx-icon icon-guanbi2"></i>
          </div>
          <div class="notice-book-content">
            <div v-html="guideInfo.orderNotice"></div>
          </div>
        </div>
      </x-dialog>
    </div>
    <div class="topShadow"></div>
    <div style="overflow: hidden">
      <!-- 一票一码 -->
      <div class="playDate playDate-title" style="border-top:none">
        <span class="play-item-title">服务日期</span>
      </div>
      <div v-if="dateSelectShow" class="slide-calendar-box">
        <slideCalendar
          ref="slideCalendar"
          :slideDate="playDate"
          :showPrice="showPrice"
          :httpParams="httpOptions"
          :httpUrl="httpUrl"
          @selectCalendar="selectDate"
        ></slideCalendar>
      </div>
    </div>

    <!-- 一票一码 -->
    <template>
      <div class="ypym-warpper">
        <div class="ypyp-section add-sub-section">
          <span class="ticket-num">服务人数：</span>
          <div class="add-sub-num">
            <!-- <span class="num">{{num}}</span>
            <div class="add-sub">
              <span @click.stop="sub" class="sub handle-btn" :class="{'no-num':num==0}">-</span>
              <span
                v-if="ticketInfo.priceSettle||ticketInfo.priceSettle==0"
                @click.stop="add"
                class="add handle-btn"
              >+</span>
              <span v-else class="add handle-btn no-num">+</span>
            </div>-->
            <numSpinner
              v-model="num"
              :precision="0"
              :min="0"
              :max="(disabled ? 0 :guideInfo.maxPersonNu)"
              @on-change="changeNum"
            ></numSpinner>
          </div>
        </div>
      </div>
    </template>

    <order-info ref="orderInfo" :isNeedHidden="needRepalce" :formArr="formArr" :isface="isface"></order-info>

    <div v-if="merchantInfoId !== '658'" class="coupon-warper info-list">
      <div class="info-item" @click="getCoupons">
        <div class="coupon-info">
          <span class="info-title">优惠券</span>
          <input
            class="info-content"
            placeholder-class="input-style"
            v-if="!couponName"
            disabled
            placeholder="优惠券选择"
          />
          <span v-else class="coupon-name" style="display:inline-block;">{{couponName}}</span>
        </div>
        <i class="xx-icon icon-xiangyoujiantou coupon-svg coupons-icon"></i>
      </div>
      <div class="info-item">
        <div class="coupon-info">
          <span class="info-title">优惠活动</span>
          <span v-if="couponUserType=='F'">无门槛</span>
          <div v-else>
            <input
              class="info-content"
              placeholder-class="input-style"
              v-if="!couponUserNum"
              disabled
              placeholder="优惠活动信息"
            />
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
      <div
        class="right-warper"
        ref="subForm"
        :class="{'active':  num }"
        @click="subForm"
      >去支付</div>
    </div>
    <!-- 常用联系人 -->
    <pop-contacts ref="contactsList" @getContactsInfo="fillContact"></pop-contacts>
    <!-- 优惠券 -->
    <coupon-list ref="couponList" @nouse="Undontuse" @use="useCoupon"></coupon-list>
    <!-- 支付宝支付确认 -->
    <pay
      ref="pay"
      @payClose="noPay"
      @wxIcbcPay="icbcPay"
      @longPay="longPay"
      @aliApPay="aliApPay"
      :isIcbc="isIcbc"
      :isAliAp="isAliAp"
      :totalprice="totalprice"
      :isWxPay="isWxPay"
    ></pay>
 
    <!-- 时间选择 -->
    <!-- <mutil-calendar v-if="isYpym" ref="calendar" @getDate="mselectDate" :activeDate="playDate"></mutil-calendar> -->
    <float-nav :top="floatNavTop" :bindPromoterFlag.sync="bindPromoter"></float-nav>
    <!-- 身份证类型 -->
    <popup v-model="idCardShow" position="bottom" class="card-modal" should-rerender-on-show>
      <div class="title">请选择证件类型</div>
      <div class="content">
        <ul class="card-list">
          <li
            @click="selectCardType(item.key)"
            class="card-item"
            v-for="(item,index) in idCardTypeList"
            :key="index"
          >
            <span>{{item.value}}</span>
            <i v-if="cardType==item.key" class="xx-icon icon-xuanze"></i>
          </li>
        </ul>
      </div>
    </popup>
    <!-- 微信吸粉 -->
    <wx-fans v-if="inWeiXin"></wx-fans>
    <!-- <wx-fans></wx-fans> -->
  </div>
</template>

<script>
import orderInfo from "./public/orderInfo";
import cardGetdata from "./public/cardGetdata";
import photo from "@/components/photo";
import axios from "axios";
import { linkBaseUrl } from "../../../../config/index";
import abiRlsb from "@/components/abiRlsb";
import { isWxAli, order } from "@/common/common";
import { Popup, XDialog } from "vux";
import popContacts from "./public/popContacts";
import couponList from "./public/couponList";
import pay from "./public/pay";
import rlsb from "@/components/rlsb";
import slideCalendar from "@/components/guideSlideCalendar"; // 滑动日期组件
import floatNav from "@/components/floatNav";
import numSpinner from "../components/numSpinner";
import { wxShare } from "@/common/wxshare";
import URL from "url";
import querystring from "querystring";
import wxFans from "../components/wxFans"

export default {
  data() {
    return {
      needRepalce: false,
      bindPromoter: false,
      dateSelectShow: true,
      formItem: {
        buyerName: ""
      },
      formArr: [],
      dateList:[],
      isIcbc: false, //是否工行支付
      isAliAp: false,
      cardGetData: false, //店铺是否拥有权限9(身份证生成信息)
      floatNavTop: "", //浮动导航顶部高度
      cardType: "", //身份证类型
      idCardTypeList: [],
      idCardShow: false, //身份证类型modal
      isWxPay: false, //是否是微信支付
      realNameList: [],
      timeFlag: true, //分时预约请求开关
      activeIndex: 0,
      timeList: null, //分时预约时间数组
      noticeFlag: true, //弹框提示开关
      noticeStr: "",
      noticeShow: false,
      guideInfo: {}, //ypym门票信息
      ticketName: "",
      num: 1,
      formStr: "",
      couponName: "", //优惠券名称
      couponUserType: "", //优惠券  优惠活动
      couponUserNum: "", //优惠券使用门槛
      faceUrls: "",
      ticketType: [],
      totalprice: 0,
      currentPrice: null,
      buyerName: "",
      buyerMobile: "",
      showBuyerMobile: "", //展示号码
      buyerMobileShow: false,
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
      //   noticeFlag: false,
      oneSubFrom: true, //防止订单反复提交
      isCheckIdcard: false, //非实名制人脸身份证必填
      ifYpypCard: false,
      modalNoticeFlag: false,
      oldNum: 0,
      tradeNo: "", // 支付宝交易流水号
      merchantInfoId: "", // 店铺id
      idArr: ["166", "108","372"],
      // 日历插件配置参数
      showPrice:true,
      httpUrl:"/merchant/api/merchantChargeGuideInfo/priceStockCalendarList",
      httpOptions:{
        merchantInfoId:this.$route.query.m_id,
        merchantGuideInfoId: this.$route.query.guideId,
        year:"",
        month: ""
      },
      disabled:false
    };
  },
  components: {
    orderInfo,
    cardGetdata,
    photo,
    abiRlsb,
    floatNav,
    Popup,
    popContacts,
    couponList,
    pay,
    rlsb,
    XDialog,
    slideCalendar,
    numSpinner,
    wxFans
  },
  computed: {},
  watch: {
    num: {
      handler(val, oldVal) {
        this.oldNum = oldVal;
        if (this.obj) {
          //使用了优惠券
          this.getPrice(this.obj);
        } else {
          //没有使用优惠券
          this.getPrice(0);
        }
      },
      immediate: true
    }
    // num(val,oldVal) {
    //     this.oldNum=oldVal
    //   if (this.obj) {
    //     //使用了优惠券
    //     this.getPrice(this.obj);
    //   } else {
    //     //没有使用优惠券
    //     this.getPrice(0);
    //   }
    // }
  },
  methods: {
    getGuideInfo() {
      // id景区id
      this.postAxios(this.api.guide.detail.main, {
        wayType: 1,
        merchantGuideInfoId: this.$route.query.guideId
      }).then(res => {
        if (res.status === 200) this.guideInfo = res.data;
        this.formArr = [{"title":"姓名","type":"buyerName","tips":"请填写姓名","name":"buyerName","isRequired":true},{"title":"手机号","type":"buyerMobile","tips":"请输入手机号","name":"buyerMobile","isRequired":true},{"title":"身份证号","type":"buyerIdNo","tips":"请填写身份证号","name":"buyerIdNo","isRequired":false}];
      });
    },
    onBridgeReady() {
      let _this = this;
      // console.log(this.infoData)
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
        function(res) {
          // console.log(res)
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
        wayType: 1
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
    buyerMobileFocus() {
      //开关控制只有第一次才执行
      if (!this.buyerMobileShow) {
        this.buyerMobileShow = true;
        this.buyerMobile = this.saveBuyerMobile;
        if (this.formItem.hasOwnProperty("buyerMobile")) {
          //是否有联系人电话
          this.formItem.buyerMobile = this.saveBuyerMobile;
        }
      }
    },
    noPay() {
      //如果支付的话，相当于将优惠券信息置空，并且重新计算金额
      this.Undontuse();
    },
    selectDate(day, dateInfo = {}) {
      this.playDate = day;
      this.currentPrice = dateInfo.salePrice?dateInfo.salePrice:0;
      this.num = 0;
      if (!((dateInfo.salePrice || dateInfo.salePrice == 0) && (dateInfo.stockModel=='unlimit'?true : dateInfo.stock>0))) {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
      // this.realNameList = [];
      // this.timeFlag = true;
      this.activeIndex = 0;
      // this.timeList = null;
      this.noticeFlag = true;
      this.noticeStr = "";
      this.noticeShow = false;
      //置空优惠券
      this.Undontuse();
    },
    showCalendar() {
      this.$refs.calendar.show(this.playDate);    
    },
    sub() {
      if (this.num == 1) {
        this.noticeFlag = true;
      }
      if (this.num >= 1) {
        this.num--;
        //优惠券查询是通过价格查询，数量改变了话，急需要重新请求接口
        this.Undontuse();
      }
    },
    changeNum() {
      this.Undontuse();
    },
    imgUrl(src) {
      this.faceUrls = src;
    },
    showContactsPop() {
      //联系人
      this.contactType = "linker";
      this.$refs.contactsList.showContacts();
    },
    //获取下单数量和总金额 val为优惠券金额
    getPrice(obj) {
      // let pArr = [];
      this.totalprice = 0;
      let priceSettle = this.currentPrice
      if (this.num > this.guideInfo.basePersonNum) {
        this.totalprice = priceSettle * 100 + ((this.num - this.guideInfo.basePersonNum) * this.guideInfo.extraMoney * 100)
      } else if (this.num === 0) {
        this.totalprice = 0
      } else {
        this.totalprice = priceSettle * 100
      }
      if (obj == 0) {
        //不使用优惠券   
        this.totalprice = (this.totalprice / 100).toFixed(2);
      } else {
        //使用优惠券
        switch (obj.applyType) {
          case "all":
          case "type":
            let duseCprice = this.totalprice;
            this.totalprice = duseCprice > obj.amount * 100 ? duseCprice - obj.amount * 100 : 0;
            this.totalprice = (this.totalprice / 100).toFixed(2);
            break;
          case "used":
            let dusetotalprice = 0,
              ucoupontotalp = 0,
              duseCouponprice;
         
            //ypym
            dusetotalprice = this.totalprice;
            ucoupontotalp = this.totalprice;
            
            duseCouponprice = dusetotalprice - ucoupontotalp;
            ucoupontotalp =
              ucoupontotalp > obj.amount * 100
                ? ucoupontotalp - obj.amount * 100
                : 0;
            this.totalprice = ucoupontotalp + duseCouponprice;
            this.totalprice = (this.totalprice / 100).toFixed(2);
            break;
        }
      }
    },
    //支付
    pay() {
      let _this = this;
      this.flagShow = true;
      let extendParam = {
        orderInfo: this.orderInfo,
        redirectUrl: encodeURIComponent(window.location.href),
        openId: this.openId ? this.openId : ""
      };
      // 特殊店铺对接工行支付 20200108 by lixuepeng
      if (this.merchantInfoId == '139' && typeof returnCitySN !== 'undefined')  extendParam.payerIp = returnCitySN["cip"] || ''
      let formData = {
        accountId: this.$route.query.m_id,
        extendParamJson: JSON.stringify(extendParam),
        operateId:
          localStorage.getItem("xjsc_login_userId_2019_3_8") ||
          this.$cookie.get("leaguerInfoId"),
        payOrderNo: this.orderNo,
        paySum: this.totalprice,
        payType: this.payType,
        userType: "C",
        wayType: 1
      };
      this.getAxios(this.api.main.pay.goPay, formData).then(
        res => {
          if (res.payLink) {
            if (this.payType == "2019") {
              this.tradeNo = JSON.parse(res.data).orderNo;
              this.isAliAp = true;
              this.$refs.pay.aliPayShow = true;
              this.$nextTick(() => {
                this.oneSubFrom = true;
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
                this.oneSubFrom = true;
              });
            } else if (this.payType == "70" || this.payType == "71") {
              //银联支付，直接跳转链接,智游宝悦单银联公众号支付,智游宝悦单银联二维码支付
              window.location.href = res.data;
            } else {
              this.formStr = res.data;
              this.isWxPay = this.inWeiXin;
              this.$refs.pay.aliPayShow = true;
              this.$nextTick(() => {
                this.oneSubFrom = true;
              });
            }
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
        },
        reject => {
          this.oneSubFrom = true;
        }
      );
    },
    //手机号验证
    checkMobile(val) {
      if (!/1[3-9][0-9]{9}$/.test(val) && val.length != 11) {
        return true;
      }
    },
    //身份证验证
    checkIdCard(vla, type) {
      let reg;
      if (type == "id") {
        //身份证
        reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|(X|x))$/;
      } else if ((type = "pass")) {
        //通行证
        reg = /^[a-zA-Z0-9]{5,17}$/;
      } else if ((type = "passport")) {
        //护照
        reg = /^[a-zA-Z0-9]{5,17}$/;
      }
      if (!reg.test(vla)) {
        return true;
      }
    },
    subForm() {
      // 是否可以下单
      let classList = Array.from(this.$refs.subForm.classList);
      if (classList.indexOf("active") === -1) return; 
      // 防止重复点击
      if(this.oneSubFrom) { 
        this.oneSubFrom = false;
        this.flag = true;

        if(!(this.currentPrice || this.currentPrice === 0)) {
          //判断当天的价格、在售状态
          this.$vux.toast.text(
            this.playDate + "号没票，请重新选择日期",
            "middle"
          );
          this.flag = false;
          this.oneSubFrom = true
          throw new Error("没票，请重新选择日期");
        }

        if (this.num === 0) {
          this.$vux.toast.text("购买数量不能为0", "middle");
          this.flag = false;
          this.oneSubFrom = true
          throw new Error("购买数量不能为0");
        }
        // 校验表单
        this.formObjData = this.$refs.orderInfo.check();
        if (!this.formObjData.flag) {
          this.flag = false;
          this.oneSubFrom = true
          throw new Error("验证失败！");
        }

        if (this.flag) {
          let modelCodes = [];
          let amounts = [];
          let paySum = 0;
          let formData = Object.assign(this.formObjData.formObj, {
            modelCodes: "",
            leaguerId:
              localStorage.getItem("xjsc_login_userId_2019_3_8") ||
              this.$cookie.get("leaguerInfoId"),
            // buyerName: this.buyerName,
            // buyerMobile: this.realTel,
            // buyerIdNo: this.formItem.buyerIdNo,
            amounts: "",
            wayType: 1,
            orderType: "guide",
            marketingType: "",
            paySum: null,
            // faceUrl: this.faceUrls,
            startTime: this.playDate,
            couponCode: this.couponCode ? this.couponCode : "",
            tips: JSON.stringify(this.formObjData.tips)
          });

          let priceSettle = this.currentPrice
          if (this.num > this.guideInfo.basePersonNum) {
            paySum = priceSettle * 100 + ((this.num - this.guideInfo.basePersonNum) * this.guideInfo.extraMoney * 100)
          } else if (this.num === 0) {
            paySum  = 0
          } else {
            paySum = priceSettle * 100
          }
          amounts = this.num;
          formData.modelCodes = this.guideInfo.code;
          formData.paySum =  (paySum / 100).toFixed(2) 
          formData.amounts = amounts;

          let _url = this.api.order.saveOrder;
          let env = isWxAli();
          let spread_code = this.$cookie.get(
            "spread_code_" + this.$route.query.m_id
          );
          if (spread_code) {
            formData = Object.assign(formData, {
              promoteCode: spread_code
            });
          }
          if (this.$route.query.isSpecial) {
            formData = Object.assign(formData, {
              isSpecial: this.$route.query.isSpecial
            });
          }

          this.postAxios(_url, formData)
            .then(
              result => {
                this.oneSubFrom = true;
                this.orderNo = result.data.payOrderNo;
                this.orderInfo = result.data.orderDescription;
                this.orderId = result.data.id;
                let businessType = "";
                if (env.isWx) {
                    //如果是微信端
                    this.getPayType("WEIXIN");
                  } else {
                    //非微信端
                    businessType = env.isAliPay ? "ALI" : "WAP";
                    this.getPayType(businessType);
                }
              },
              reject => {
                this.oneSubFrom = true;
              }
            )
            .catch(error => {
              this.oneSubFrom = true;
            });
        }

      }

    },
    getPayType(businessType) {
      let env = isWxAli();

      if (this.$route.query.m_id == 139) {
        this.payType = '2015';
        this.pay();
        return;
      }
      
      this.getAxios("/merchant/api/merchantPayType/getMerchantPayType", {
        businessType: businessType
      }).then(
        res => {
          this.payType = JSON.parse(res.message)[0];
          //微信端获取openid
          if (env.isWx) {
            this.getAxios("/leaguer/api/userLeaguer/manage/leaguerInfo", {
              leaguerId:
                localStorage.getItem("xjsc_login_userId_2019_3_8") ||
                this.$cookie.get("leaguerInfoId")
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
        },
        reject => {
          this.oneSubFrom = true;
        }
      );
    },
    //常用联系人填充取票联系人信息
    fillContact(item) {
      if (this.contactType == "linker") {
        //联系人
        this.buyerMobileShow = true;
        this.buyerName = item.name;
        this.buyerMobile = item.phone;
        this.buyerIdNo = item.certNo ? item.certNo : "";
        this.faceUrls = item.faceUrl ? item.faceUrl : "";
        if (this.formItem.hasOwnProperty("buyerName")) {
          this.formItem.buyerName = item.name;
        }
        if (this.formItem.hasOwnProperty("buyerMobile")) {
          this.formItem.buyerMobile = item.phone;
        }
        if (this.formItem.hasOwnProperty("buyerIdNo")) {
          this.formItem.buyerIdNo = item.certNo ? item.certNo : "";
        }
      } else if (this.contactType == "realName") {
        //实名制
        if (item.certNo) {
          //常用联系人如果有身份证id，将证件类型赋值成id
          this.ticketType[this.realNameIndex].list[this.realNamei].idcardType =
            "id";
        }
        this.ticketType[this.realNameIndex].list[
          this.realNamei
        ].idNo = item.certNo ? item.certNo : "";
        this.ticketType[this.realNameIndex].list[
          this.realNamei
        ].name = item.name ? item.name : "";
        this.ticketType[this.realNameIndex].list[this.realNamei].faceUrl =
          this.ticketType[this.realNameIndex].isRlsb == "T"
            ? item.faceUrl
              ? item.faceUrl
              : ""
            : "";

        //判断当前是否还有tel属性值
        if (
          this.ticketType[this.realNameIndex].list[
            this.realNamei
          ].hasOwnProperty("tel")
        ) {
          this.ticketType[this.realNameIndex].list[this.realNamei].tel = item.phone?item.phone:''
        }
      } 
    },
    //下单获取优惠券列表
    getCoupons() {
      let couponUrl = this.api.main.marketing.useCoupons;
      let cpArr = [],
        modelprice = "";
    
        //ypym
        modelprice =
          this.guideInfo.code +
          "-" +
          (this.guideInfo.merchantPrice
            ? ((this.guideInfo.merchantPrice * this.num * 100) / 100).toFixed(2)
            : 0);
      

      this.getAxios(couponUrl, {
        userId:
          localStorage.getItem("xjsc_login_userId_2019_3_8") ||
          this.$cookie.get("leaguerInfoId"),
        moldCodes: modelprice
      }).then(res => {
        // this.couponList = res.data;
        res.data.forEach((item, index) => {
          // item.validStartDate = item.validStartDate.substr(0, 10);
          // item.validEndDate = item.validEndDate.substr(0, 10);
          res.data[index].amount =
            res.data[index].amount >= 1
              ? res.data[index].amount.toFixed(2)
              : res.data[index].amount;
        });
        this.$refs.couponList.show(res.data);
      });
    },
    //使用优惠券
    useCoupon(obj) {
      //
      this.obj = obj;
      this.couponCode = obj.code;
      // this.getPrice(obj.amount, obj.productCode, obj);
      this.getPrice(obj);
      this.couponUserType = obj.useThreshold;
      if (this.couponUserType == "T") {
        this.couponUserNum = obj.targetAmout;
      }
      this.couponName = obj.name;
    },
    //不使用优惠券
    Undontuse() {
      this.obj = null;
      this.couponCode = "";
      this.getPrice(0);
      this.couponUserType = "";
      this.couponName = "";
      this.couponUserNum = "";
    },
    //获取当前日期
    getCurDate(type) {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = null;
      if(type && type === 'Object') {
        currentdate = {
          year:year,
          month:month,
          strDate:strDate
        }
      } else {
        currentdate = year + seperator1 + month + seperator1 + strDate;
      }
      return currentdate;
    },
    //获取当前月有价格的日期
    getOnDate() {
      let date = new Date();
      let sp = "-";
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let currentdate =
        year +
        sp +
        (month > 9 ? month : "0" + month) +
        sp +
        (day > 9 ? day : "0" + day);
      let arr = [];
      arr.push({
        month,
        year
      });
      for (let i = 1; i < 4; i++) {
        month++;
        if (month > 12) {
          month = month - 12;
          year++;
        }
        arr.push({
          month,
          year
        });
      }
      // console.log(arr);
      let axiosArr = [];  
      arr.forEach(item => {
        let ym = item.year + sp + (item.month > 9 ? item.month : "0" + item.month);
        axiosArr.push(
          this.postAxios(
            "/merchant/api/merchantChargeGuideInfo/priceStockCalendarList",
            {
              merchantInfoId:this.$route.query.m_id,
              merchantGuideInfoId: this.$route.query.guideId,
              year:item.year,
              month: item.month
            }
          )
        );
      });
      Promise.all(axiosArr).then(res => {
        let arr = [];
        res.forEach(item => {
          arr = arr.concat(item.data);
        });
        
        // console.log(arr);
        let item = arr.find(day => {
          return (
            (day.salePrice || day.salePrice == 0) &&
            // day.salePriceStatus == "T" &&
            (day.stockModel == "unlimit" ? true : day.stock > 0) &&
            new Date(day.date).valueOf() >= new Date(currentdate).valueOf()
          );
        });
        if (item) {
          //当前存在有库存价格的日
          this.playDate = item.date;
          this.currentPrice = item.salePrice
        } else {
          //当前月不具备
          //获取门票信息
          this.playDate = this.getCurDate();
        }
        this.dateSelectShow = true;
      });
    },
    showNotice() {
      this.modalNoticeFlag = true;
    },
    getDateList() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      for (let i = 0; i < 10; i++) {
        strDate += i;
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        let date = month + '-' + strDate;
        let text = i?(i==1?('明天'+date):(i==2?('后天'+date):date)):'今天';
        this.dateList.push({
          text: text,
          date: date,
        })
      }
    },
  },
  created() {
    let env = isWxAli();
    this.inWeiXin = env.isWx;
    this.handelFlag = true;
    this.merchantInfoId = this.$route.query.m_id;
    this.playDate = this.$route.query.playDate;

    if (window.innerHeight != undefined) {
      // return window.innerHeight;
      this.floatNavTop = window.innerHeight - 220;
    } else {
      let B = document.body,
        D = document.documentElement;
      this.floatNavTop = Math.min(D.clientHeight, B.clientHeight) - 220;
    }

    // 获取用户信息
    this.getAxios("/leaguer/api/userLeaguer/manage/leaguerInfo").then(res => {
      let tel = res.data.mobile ? res.data.mobile : "";
      this.saveBuyerMobile = tel;
      if (tel) {
        this.buyerMobile = tel.slice(0, 3) + "****" + tel.slice(tel.length - 4);
        if (this.formItem.hasOwnProperty("buyerMobile")) {
          //判断是否有电话号码
          this.formItem.buyerMobile =
            tel.slice(0, 3) + "****" + tel.slice(tel.length - 4);
        }
      }

      this.buyerName = res.data.nickName ? res.data.nickName : "";
      if (this.formItem.hasOwnProperty("buyerName")) {
        //判断是否有电话号码
        this.formItem.buyerName = res.data.nickName ? res.data.nickName : "";
      }
    });

    //判断当前用户是否能够用图片获取身份证信息
    this.postAxios(
      "marketing/api/marketBaiduService/idCardServiceEnable?merchantId=" +
        this.$route.query.m_id
    ).then(res => {
      if (res.status == 200 && res.data.enable == "T") {
        this.cardGetData = true;
      }
    });
    //登录权限验证
    this.checkToken();
    // 获取导游详情
    this.getGuideInfo()
    // 获取日历价格
    // this.getOnDate();
    // console.log("zzz", this.mflag);
    this.getDateList()
  },
  destroyed() {
    localStorage.removeItem("xjxc_vue_wap_2019_3_7_ticket_orderData");
  }
};
</script>

<style lang="scss">
@import "../../../assets/styles/mixin.scss";
.ticket-order {
  .card-modal {
    background: #fff;

    .title {
      padding: 8px 0;
      font-size: 18px;
      text-align: center;
      color: #413838;
      background: #f7f7f8;
    }
    .content {
      padding-left: 10px;
      .card-list {
        .card-item {
          height: 45px;
          line-height: 45px;
          font-size: 16px;
          color: #413838;
          border-bottom: 1px solid #e5e5e5;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .xx-icon {
            color: #04be02;
            margin-right: 15px;
            font-size: 18px;
          }
        }
      }
    }
  }
  .real-list-box {
    background: #ffffff;
    // padding: 8px 0;
    margin-bottom: 10px;
    padding-left: 14px;
    .info-list {
      padding: 0;
      border-bottom: 0.5px solid #eeeee7;
      &:last-child {
        border-bottom: none;
      }
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
  .no-timeList {
    background: #fff;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    color: #f05b47;
    padding-left: 15px;
  }
  .ypym-warpper {
    padding: 0 15px;
    background: white;
    border-top: 1px solid #eeeee7;
    .ypyp-section {
      @include fbc;
      height: 60px;
      &.add-sub-section {
        align-items: center;
        background: white;
        margin-top: 0;
        margin-bottom: 10px;
        // margin-top: 10px;
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
        font-size: 14px;
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
        margin-bottom: 5px;
        border-radius: 4px;
        font-size: 14px;
        color: #413838;
        text-align: center;
        &.active {
          border-color: #f05b47;
          color: #f05b47;
        }
        &.no-num {
          border-color: #ccc;
          color: #ccc;
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    .play-item-title {
      width: 60px;
      font-size: 14px;
      color: #413838;
      margin-left: 15px;
      font-weight: 600;
    }
    .play-input-wrap {
      margin-right: 18px;
      .playDate-text {
        font-size: 14px;
        color: #413838;
      }
      .xx-icon {
        color: #f05b47;
        font-size: 14px;
        margin-left: 5px;
      }
    }
  }
  .playDate-title {
    border: 0.5px solid #eeeee7;
    height: 50px;
    line-height: 50px;
    margin-top: 10px;
  }
  .hotel-list {
    // margin-bottom: 10px;
    background: #f7f7f7;
    // padding: 20px 14px;
    padding-top: 20px;
    padding-bottom: 20px;
    .hotel-item {
      // padding-bottom: 11px;

      width: 100%;
      .fsyyTimes-box {
        .time {
          float: right;
          margin-top: 10px;
          padding: 3px 5px;
          margin-right: 15px;
          // border: 1px solid #f05b47;
          border-radius: 4px;
          font-size: 14px;
          color: #413838;
          margin-bottom: 5px;
        }
      }
      .hotel-item-main {
        width: 100%;
        // margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .hotel-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          // width: 250px;
          vertical-align: middle;
          .hotel-name {
            width: 205px;
            padding-left: 15px;
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
            display: flex;
            align-items: center;
            .unit {
              font-size: 12px;
            }
            .num {
            }
            .fq-idcard {
              margin-left: 10px;
              margin-top: 1px;
              float: right;
              img {
                width: 15.5px;
                height: 12.5px;
              }
            }
          }
        }
        .hotel-price {
          // flex: 1;
          // word-break: break-all;
          font-size: 12px;
          color: #413838;
          font-family: PingFangSC-Medium, sans-serif;
          margin-right: 15px;
          display: inline-block;
          vertical-align: middle;
          .price {
            font-size: 16px;
            margin-left: 4.5px;
            font-family: PingFangSC-Medium, sans-serif;
          }
        }
      }
      .hotel-item-main.realname-item {
        margin-bottom: 14px;
      }
    }
    .hotel-item:last-child .hotel-item-main {
      padding-bottom: 0;
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
      .select-content {
        display: flex;
        align-items: center;
        padding-right: 15px;
        .contacter-icon {
          width: 17px;
          height: 17px;
          padding: 10px;
          padding-left: 50px;
          padding-right: 5px;
          display: block;
        }
        .text {
          font-size: 12px;
          color: #19a0f0;
          margin-top: 2px;
        }
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
      .buyerMobile-text {
        flex: 1;
        font-size: 14px;
        color: #413838;
        &.no-mobile {
          color: #999;
        }
      }
    }
    .info-item:last-child {
      border-bottom: none;
    }
  }
  .info-list {
    padding-top: 10px;

    .info-list-title {
      height: 43px;
      // margin-left: 14px;
      border-bottom: 0.5px solid #eeeee7;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .info-title-left {
        display: flex;
        align-items: center;
      }
      .card-box {
        margin-left: 24px;
        display: flex;
        align-items: center;
        .card-img {
          width: 29px;
          height: 25px;
          display: block;
        }
        .card-text {
          color: rgba(65, 56, 56, 0.5);
          margin-left: 0.266667rem;
          font-size: 12px;
        }
      }
      .title-text {
        color: #999;
        font-family: PingFangSC-Regular, sans-serif;
        display: inline-block;
        vertical-align: middle;
        font-size: 14px;
      }
      .img-content {
        padding-right: 15px;
        display: flex;
        align-items: center;
        .img {
          width: 17px;
          height: 17px;
          padding: 10px;
          padding-left: 50px;
          padding-right: 5px;
        }
        .text {
          font-size: 12px;
          color: #19a0f0;
          margin-top: 2px;
        }
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
        // width: 240px;
        outline: none;
        border: none;
        font-size: 14px;
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
          font-weight: 600;
        }
        .info-content {
          background: #ffffff;
          outline: none;
          border: none;
          font-size: 14px;
        }
        .info-content::-webkit-input-placeholder {
          color: #999;
          font-size: 13px;
        }
        .info-content:-moz-placeholder {
          color: #999;
          font-size: 13px;
        }
        .info-content:-ms-input-placeholder {
          color: #999;
          font-size: 13px;
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
  .ticket-order-title {
    .coupon-warper {
      margin-bottom: 0;
      margin-top: 10px;
      .info-item {
        height: auto;
        .order-notice {
          color: #19a0f0;
          .coupons-icon {
            color: #19a0f0;
            font-weight: 600;
            padding-left: 0px;
          }
        }
        .guide-order-price {
          color: #767676;
          font-size: 12px;
          span {
            font-size: 20px;
            color: #f05b47;
            font-weight: bold;
          }
        }
      }
      .coupon-info {
        width: 70%;
        height: 50px;
        .info-title {
          height: 100%;
          display: block;
          line-height: 50px;
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-family: PingFangSC-Semibold;
          font-size: 18px;
          color: #413838;
        }
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
        float: left;
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
      opacity: 0.4;
      &.active {
        opacity: 1;
      }
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
  .slide-calendar-box {
    width: 100%;
    background: #fff;
  }

  .order-item-box {
    border-bottom: 1px solid #eeeee7;
    position: relative;
    .order-item-left {
    }
    .order-item-right {
      position: absolute;
      height: 100%;
      top: 0;
      right: 0;
      padding: 0 15px;
      background: #f7f7f7;
      display: flex;
      align-items: center;
      .card-box {
        .card-img {
          width: 18.5px;
          height: 16.5px;
          display: block;
          margin: 0 auto 10px;
        }
        .card-text {
          color: rgba(65, 56, 56, 0.5);
          // margin-left: 0.266667rem;
          font-size: 12px;
          display: block;
          text-align: center;
        }
      }
    }
  }
}
.notice-modal {
  padding: 10px;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .text {
      text-align: left;
      width: 75%;
      font-size: 16px;
      word-break: break-all;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      /* ! autoprefixer: off */
      -webkit-box-orient: vertical;
      /* autoprefixer: on */
      overflow: hidden;
    }
    .xx-icon {
      font-size: 20px;
      padding: 5px;
    }
  }
  .notice-book-content {
    width: 100%;
    margin-top: 10px;
    max-height: 250px;
    overflow-y: auto;
    text-align: left;
    word-break: break-all;
    padding: 0;
    img {
      width: 100%;
    }
  }
}
.notice-body {
  // width: 90%;
  background: #ffffff;
  // border-radius: 2px;
  .notice-title {
    text-align: center;
    color: #413838;
    font-size: 16px;
    // height: 30px;
    // line-height: 30px;
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
    height: 49px;
    @include fbc;
    .no-agree {
      border-top: 1px solid #eeeee7;
      color: #413838;
      font-size: 16px;
      height: 48px;
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
</style>
