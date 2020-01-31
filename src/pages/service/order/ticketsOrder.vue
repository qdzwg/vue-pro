<template>
  <div class="tickets-order"
       :class="{overflow:canScroll}">
    <div class="tickets-order-info">
      <div class="tickets-info-title tickets-info-item">{{productDetal.modelName}}</div>
      <div class="tickets-info-subtitle tickets-info-item">{{productDetal.subtitle}}</div>
      <div class="tickets-info-flex">
        <div class="tickets-info-labels">
          <span v-for="(ite,ind) in productDetal.modelLabel"
                :key="ind">{{ite}}</span>
        </div>
        <div class="tickets-info-price"
             @click="showNotice">
          <span>费用说明</span>
        </div>
      </div>
    </div>
    <div style="overflow: hidden">
      <!-- 一票一码 -->
      <div class="playDate playDate-title"
           style="border-top:none">
        <span class="play-item-title tickets-play-title">套票使用日期</span>
      </div>
      <div class="slide-calendar-box">
        <slideCalendar ref="slideCalendar"
                       url="/merchant/api/merchantFamilyInfo/ticketPriceCalendarList"
                       :slideDate="playDate"
                       @selectCalendar="selectDate"
                       :showPrice="showPrice"></slideCalendar>
      </div>
      <div class="ypym-warpper">
        <div class="ypyp-section add-sub-section">
          <span class="ticket-num">套票份数：</span>
          <span>{{maxLimitText?maxLimitText:((max <= 100)?"(游客总数限制100个)":"")}}</span>
          <numSpinner v-model="num"
                      :min="0"
                      :max="max"
                      :precision="0"></numSpinner>
          <!-- <div class="add-sub-num">
            <span class="num">{{num}}</span>
            <div class="add-sub">
              <span @click.stop="sub" class="sub handle-btn" :class="{'no-num':num==0}">-</span>
              <span
                @click.stop="add"
                class="add handle-btn"
              >+</span>
            </div>
          </div> -->
        </div>
      </div>
    </div>

    <template>
      <div v-for="(ticket,inde) in ticketsInfo"
           :key="inde">
        <div v-if="ticket.modelType==='ticket'">
          <div class="tickets-order-playDate"
               v-show="ticket.subFlag==='T'||ticket.dateList.length>1"
               v-if="ticket.dateList instanceof Array && ticket.dateList.length">
            <div class="tickets-play-title">{{ticket.detailName}}</div>
            <div class="tickets-play-dates">
              <div class="tickets-play-dates-list">
                <span v-for="(item,index) in ticket.dateList"
                      :key="index"
                      @click="changePlaydate2(ticket,item.date)"
                      :class="ticket.playDate == item.date ? 'tickets-play-dates-current':''">{{item.text}}</span>
              </div>
            </div>
            <div class="ypym-warpper tickets-time-list">
              <div class="time-list"
                   v-if="ticket.timeList instanceof Array && ticket.timeList.length">
                <span class="time-item"
                      v-for="(item,index) in ticket.timeList"
                      :key="index"
                      @click="timeIndex(ticket,item.num,index)"
                      :class="{active:ticket.activeIndex===index,'no-num':!(item.num&&item.num>0)}">{{item.startTime}}-{{item.endTime}}</span>
              </div>
            </div>
            <div class="no-timeList"
                 v-if="ticket.subFlag==='T'&& ticket.timeList instanceof Array && !ticket.timeList.length">当前游玩日期没有可选时间段，换个日期试试</div>
          </div>
          <div v-if="ticket.realNameFlag == 'T'&& ticket.realNameList.length"
               class="real-list-box">
            <div v-for="(it,i) in ticket.realNameList"
                 :key="i"
                 class="info-list">
              <div class="info-list-title">
                <div class="info-title-left">
                  <span class="title-text">
                    游玩人
                    <template>{{i+1}}</template>
                  </span>
                </div>
                <div class="img-content"
                     @click="ypymContact(i,inde,ticket)">
                  <img src="http://statics.lotsmall.cn/wx/img/icon-contact.png"
                       class="img" />
                  <span class="text">选择</span>
                </div>
              </div>
              <div class="order-item-box">
                <div class="order-item-left">
                  <div class="info-item">
                    <div class="info-title">姓名</div>
                    <input @blur="iosBlur"
                           maxlength="20"
                           placeholder-class="input-style"
                           placeholder="须与证件上的名字一致"
                           v-model="it.name" />
                  </div>
                  <div class="info-item">
                    <div @click="ypymShowCardModal(it.idcardType,i,inde,ticket)"
                         class="info-title">
                      <template v-if="it.idcardType">
                        <span v-if="it.idcardType=='id'">身份证</span>
                        <span v-if="it.idcardType=='pass'">港澳台</span>
                        <span v-if="it.idcardType=='passport'">护照</span>
                      </template>
                      <template v-else>
                        <span>身份证</span>
                      </template>
                      <i style="font-size:12px;color:#999"
                         class="xx-icon icon-xiangyoujiantou"></i>
                    </div>
                    <input @blur="iosBlur"
                           placeholder-class="input-style"
                           placeholder="请填写证件号"
                           v-model="it.idNo" />
                  </div>
                </div>
                <div v-if="cardGetData"
                     class="order-item-right">
                  <div @click="getCardType(i,inde,ticket)">
                    <card-getdata :idStr="'ypyp_card_'+i"
                                  @returnCardUrl="getCardUrl">
                      <img class="card-img"
                           src="../../../assets/images/camera-icon.png"
                           alt />
                      <span class="card-text">拍照识别</span>
                      <span class="card-text">身份证</span>
                    </card-getdata>
                  </div>
                </div>
              </div>

              <div v-if="ticketsInfo.isRlsb=='T'&&it.idcardType!='passport'"
                   class="info-item">
                <div class="info-title">人脸照</div>
                <div @click="yptmRlsbIndex(i)">
                  <photo :idStr="i"
                         @returnFaceUrl="ypymFaceUrl">
                    <img class="up-img"
                         v-if="!it.faceUrl"
                         src="../../../assets/images/camera-icon.png"
                         alt />
                    <img class="show-img"
                         v-else
                         :src="it.faceUrl"
                         alt />
                    <!-- <span class="text">人脸图片用于入园对比（必传）</span> -->
                    <span class="text">人脸图片用于入园对比</span>
                  </photo>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <order-info ref="orderInfo"
                :isFamilyTicket="isFamilyTicket"
                :formArr="formArr"
                :isface="isface"></order-info>

    <!-- <div class="coupon-warper info-list">
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
    </div> -->
    <!-- 支付宝支付表单 -->
    <div>
      <div v-html="formStr"></div>
    </div>
    <div class="dt-bottom-height"></div>
    <div class="bottom-box tickets-bottom-box">
      <div class="left-warper">
        <div class="money">
          <span class="title">合计</span>
          <span class="unit">￥</span>
          <span class="price">{{totalprice}}</span>
        </div>
        <div class="money-detail"
             v-show="ticketsInfo.length"
             @click='orderDetailShowChange'>
          <span>明细</span><i class="xx-icon icon-jiantoushang"></i>
        </div>
      </div>
      <div class="right-warper"
           ref="subForm"
           :class="{'active': !isYpym || num }"
           @click="subForm">去支付</div>
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
         @payClose="noPay"
         @wxIcbcPay="icbcPay"
         @longPay="longPay"
         @aliApPay='aliApPay'
         :isIcbc="isIcbc"
         :isAliAp='isAliAp'
         :totalprice="totalprice"
         :isWxPay="isWxPay"></pay>
    <!-- 一票一码购票提醒 -->
    <x-dialog v-model="noticeShow"
              class="dialog-demo">
      <div class="notice-body">
        <h2 class="notice-title">购票提醒</h2>
        <div class="notice-content"
             v-html="noticeStr"></div>
        <div class="footer">
          <span @click="noticeShow=false"
                class="no-agree">不同意</span>
          <span @click="agree"
                class="agree">同意</span>
        </div>
      </div>
    </x-dialog>
    <!-- 时间选择 -->
    <!-- <mutil-calendar v-if="isYpym" ref="calendar" @getDate="mselectDate" :activeDate="playDate"></mutil-calendar> -->
    <float-nav :top="floatNavTop"></float-nav>
    <!-- 身份证类型 -->
    <popup v-model="idCardShow"
           position="bottom"
           class="card-modal"
           should-rerender-on-show>
      <div class="title">请选择证件类型</div>
      <div class="content">
        <ul class="card-list">
          <li @click="selectCardType(item.key)"
              class="card-item"
              v-for="(item,index) in idCardTypeList"
              :key="index">
            <span>{{item.value}}</span>
            <i v-if="cardType==item.key"
               class="xx-icon icon-xuanze"></i>
          </li>
        </ul>
      </div>
    </popup>
    <!-- 订单明细 -->
    <div v-show="orderDetailShow"
         class="order-detail-modal">
      <div class="order-detail-wrap">
        <div class="order-detail-close"><i class="xx-icon icon-cha1"
             @click="orderDetailShow=false"></i></div>
        <div class="order-detail-title">明细</div>
        <div class="order-detail-content">
          <div v-for="(ticket,index) in ticketsInfo"
               :key="index">
            <div class="order-detail-h1">{{ticket.detailName}}</div>
            <ul>
              <template v-for="(date,inde) in ticket.dateList">
                <li v-if="ticket.modelType == 'hotel'"
                    :key="inde">
                  <div><span></span>{{date}}</div>
                  <div>
                    <div class="order-detail-numPrice"><i class="order-detail-num">x{{num*ticket.formNum}}</i><i class="order-detail-price">￥{{ticket.formPrice/ticket.hotelNum/ticket.formNum>0.01?(ticket.formPrice/ticket.hotelNum/ticket.formNum).toFixed(2):((inde||!num)?'0.00':'0.01')}}</i></div>
                  </div>
                </li>
              </template>
              <li v-if="ticket.modelType != 'hotel'">
                <div><span></span>{{ticket.playDate}}</div>
                <div class="order-detail-numPrice"><i class="order-detail-num">x{{num*ticket.formNum}}</i><i class="order-detail-price">￥{{(ticket.formPrice/ticket.formNum).toFixed(2)}}</i></div>
              </li>
            </ul>
          </div>
          <div class="order-detail-total">合计：￥{{totalprice}}</div>
        </div>
      </div>
      <div class="order-detail-mask"
           @click="orderDetailShow=false"></div>
    </div>
    <!-- 费用说明 -->
    <div v-show="moneyDetailShow"
         class="order-detail-modal">
      <div class="order-detail-wrap">
        <div class="order-detail-close"><i class="xx-icon icon-cha1"
             @click="moneyDetailShow=false"></i></div>
        <div class="order-detail-title">费用说明</div>
        <div class="order-detail-content order-detail-desc">{{productDetal.feeDetail}}
          <!-- <div class="order-detail-h1">费用包含</div>
          <ul>
            <li><span></span>1、费用包含酒店入住一晚</li>
            <li><span></span>2、包含导游一名</li>
          </ul>
          <div class="order-detail-h1">费用不包含</div>
          <ul>
            <li><span></span>1、自费项目不含</li>
            <li><span></span>2、导游小费</li>
          </ul> -->
        </div>
      </div>
      <div class="order-detail-mask"
           @click="moneyDetailShow=false"></div>
    </div>
  <!-- 微信吸粉 -->
  <wx-fans v-if="inWeiXin"></wx-fans>
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
import mutilCalendar from "@/components/mutilCalendar";
import slideCalendar from "@/components/ticketsSlideCalendar"; // 滑动日期组件
import floatNav from "@/components/floatNav";
import numSpinner from "../components/numSpinner";
import wxFans from "../components/wxFans"
export default {
  data () {
    return {
      currentPrice: 0, // 当天套票价格
      contactTicketIndex: null, // 当前票型索引
      contactTicketIndexI: null, // 当前票型实名制列表索引
      productDetal: {}, // 套票详情
      moneyDetailShow: false, // 费用说明
      orderDetailShow: false, // 订单明细
      playDate2: '',
      dateList: [],
      dateSelectShow: false,
      formItem: {
        buyerName: ""
      },
      formArr: [],
      isIcbc: false, //是否工行支付
      cardGetData: false, //店铺是否拥有权限9(身份证生成信息)
      floatNavTop: "", //浮动导航顶部高度
      cardType: "", //身份证类型
      idCardTypeList: [],
      idCardShow: false, //身份证类型modal
      isWxPay: false, //是否是微信支付
      isAliAp: false, // 支付宝api支付
      realNameList: [],
      timeFlag: true, //分时预约请求开关
      activeIndex: 0,
      timeList: null, //分时预约时间数组
      noticeFlag: true, //弹框提示开关
      noticeStr: "",
      noticeShow: false,
      ticketsInfo: {}, //ypym门票信息
      ticketName: "",
      isYpym: false, //是否是一票一码
      num: 0,
      max: 9999, // 套票份数最大值
      maxLimitText: '', //套票限制文字
      formStr: "",
      couponName: "", //优惠券名称
      couponUserType: "", //优惠券  优惠活动
      couponUserNum: "", //优惠券使用门槛
      faceUrls: "",
      ticketType: [],
      totalprice: 0,
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
      noticeFlag: false,
      oneSubFrom: true, //防止订单反复提交
      isCheckIdcard: false, //非实名制人脸身份证必填
      tradeNo: "", // 支付宝交易流水号
      ifYpypCard: false,
      showPrice:false,
      isFamilyTicket:true, // 是否为套票
      inWeiXin:false
    };
  },
  components: {
    numSpinner,
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
    mutilCalendar,
    slideCalendar,
    wxFans
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
    orderDetailShowChange () {
      this.orderDetailShow = !this.orderDetailShow;
    },
    changePlaydate2 (ticket, date) {
      ticket.playDate = date;
      if (ticket.subFlag == "T") {
        this.getTimeArrFlag(ticket);
      }
    },
    getDateList () {
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
        let text = i ? (i == 1 ? ('明天' + date) : (i == 2 ? ('后天' + date) : date)) : '今天';
        this.dateList.push({
          text: text,
          date: date,
        })
      }
    },
    getOrderInfo (id) {
      // id景区id
      this.postAxios(this.api.tickets.detail.main, {
        merchantInfoId: this.$route.query.m_id,
        merchantFamilyInfoId: this.$route.query.merchantFamilyInfoId
      }).then(res => {
        if (res.data.orderCustomPlugins) this.formArr = JSON.parse(res.data.orderCustomPlugins);
      });
    },
    onBridgeReady () {
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
        function (res) {
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
    longPay () {
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
    aliApPay () {
      let _this = this
      ap.tradePay({
        tradeNO: this.tradeNo
      }, function (res) {
        _this.$refs.pay.aliPayShow = false;
        if (res.resultCode == 9000 || res.resultCode == 8000) {
          let url = linkBaseUrl + "/payPlat/Notify/1?orderNo=" + _this.orderNo;
          window.location.href = url;
        }

      });
    },
    buyerMobileFocus () {
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
    noPay () {
      //如果支付的话，相当于将优惠券信息置空，并且重新计算金额
      this.Undontuse();
    },
    ypymFaceUrl (src) {
      this.realNameList[this.ypymRlsbIndex].faceUrl = src;
    },
    yptmRlsbIndex (index) {
      this.ypymRlsbIndex = index;
    },
    selectCardType (key) {
      if (this.cardSelectType == "normal") {
        this.ticketType[this.cardIndex].list[this.cardi].idcardType = key;
      } else if (this.cardSelectType == "ypym") {
        this.ticketsInfo[this.contactTicketIndex].realNameList[this.contactTicketIndexI].idcardType = key;
      }
      this.idCardShow = false;
    },
    showCardModal (type, index, i, ticket) {
      this.cardSelectType = "normal";
      this.idCardShow = true;
      this.cardIndex = index;
      this.cardi = i;
      this.cardType = type;
    },
    ypymShowCardModal (type, i, index, ticket) {
      // 一票一码
      this.cardSelectType = "ypym";
      this.idCardShow = true;
      this.contactTicketIndex = index;
      this.contactTicketIndexI = i;
      this.cardType = type;
      //证件类型可配置
      let cardArr = ticket.cardType ? ticket.cardType.split(',') : [];
      if (cardArr && cardArr.length > 0) {
        let typeArr = [];
        for (let i = 0; i < cardArr.length; i++) {
          let obj = {
            key: cardArr[i],
            value: cardArr[i] == 'id' ? '大陆居民身份证' : cardArr[i] == 'pass' ? '港澳台通行证' : cardArr[i] == 'passport' ? '护照' : ''
          }
          typeArr.push(obj);
        }
        this.idCardTypeList = typeArr;
      }
    },
    getSrc (src) {
      this.ticketType[this.rlsbIndex].list[this.rlsbi].faceUrl = src;
    },
    getCardUrl (data) {
      if (this.ifYpypCard) {
        this.ticketsInfo[this.contactTicketIndex].realNameList[this.contactTicketIndexI].name =
          data.words_result.姓名.words;
        this.ticketsInfo[this.contactTicketIndex].realNameList[this.contactTicketIndexI].idNo =
          data.words_result.公民身份号码.words;
        if (data.words_result.公民身份号码.words) {
          this.ticketsInfo[this.contactTicketIndex].realNameList[this.contactTicketIndexI].idcardType = "id";
        }
      } else {
        this.ticketType[this.cardIndex].list[this.cardi].name =
          data.words_result.姓名.words;
        this.ticketType[this.cardIndex].list[this.cardi].idNo =
          data.words_result.公民身份号码.words;
        if (data.words_result.公民身份号码.words) {
          this.ticketType[this.cardIndex].list[this.cardi].idcardType = "id";
        }
      }
    },
    getCardType (i, index, ticket) {
      this.contactTicketIndex = index;
      this.contactTicketIndexI = i;
      this.ifYpypCard = true;
    },
    saveIndex (index, i) {
      // console.log(index + "-" + i);
      this.rlsbIndex = index;
      this.rlsbi = i;
    },
    saveCardIndex (index, i) {
      this.cardIndex = index;
      this.cardi = i;
      this.ifYpypCard = false;
    },
    showContact (index, i) {
      //实名制
      this.contactType = "realName";
      this.realNameIndex = index;
      this.realNamei = i;
      this.$refs.contactsList.showContacts();
    },
    ypymContact (i, index, ticket) {
      this.contactTicketIndex = index;
      this.contactTicketIndexI = i;
      this.contactType = "ypymRealName";
      this.$refs.contactsList.showContacts();
    },
    getUrl (url) {
      // console.log("zzzzz",url);
      this.faceUrls = url;
    },
    selectDate (day, price) {
      this.currentPrice = price ? price : 0;
      this.playDate = day;
      this.num = 0;
      this.realNameList = [];
      this.timeFlag = true;
      this.activeIndex = 0;
      this.timeList = null;
      this.noticeFlag = true;
      this.noticeStr = "";
      this.noticeShow = false;
      this.ticketsInfo = {};
      //置空优惠券
      // this.Undontuse();
      this.getTicketsInfo();
    },
    getTimeArrFlag (item) {
      //后去当天的游玩时间，判断是否显示提示
      item.noticeFlag = true;
      //如果是分时预约提前请求接口判断分时预约数组长度来展示提示文字
      this.postAxios("/order/api/timeReserveList", {
        externalCode: item.externalCode,
        startTime: item.playDate,
        endTime: item.playDate
      }).then(res => {
        item.timeList = res.data;
        item.startTime = res.data && res.data.length ? res.data[0].startTime : '';
        item.endTime = res.data && res.data.length ? res.data[0].endTime : '';
        item.activeIndex = res.data && res.data.length ? 0 : null;
        item.noticeFlag = res.data && res.data.length ? true : false;
      });

    },
    showCalendar () {
      if (this.isYpym) {
        //只有一票一码才能唤起日期选择
        this.$refs.calendar.show(this.playDate);
      }
    },
    timeIndex (ticket, num, i) {
      if (num > 0) {
        ticket.activeIndex = i;
      }
    },
    agree () {
      this.num++;
      //总价变价，优惠券查询需要价格
      this.Undontuse();
      if (this.ticketsInfo.realNameFlag == "T") {
        let obj = {
          name: "",
          idNo: "",
          idcardType: "id"
        };
        if (this.ticketsInfo.isRlsb == "T") {
          //人脸识别
          obj = Object.assign(obj, { faceUrl: "" });
        }
        this.realNameList.push(obj);
      }
      this.noticeShow = false;
      this.noticeFlag = false;
    },
    sub () {
      if (this.num == 1) {
        this.noticeFlag = true;
      }
      if (this.num >= 1) {
        if (this.ticketsInfo.realNameFlag == "T") {
          this.realNameList.pop();
        }
        this.num--;
        //优惠券查询是通过价格查询，数量改变了话，急需要重新请求接口
        this.Undontuse();
      }
    },
    add () {
      let _this = this;
      if (this.ticketsInfo.isFsyy == "T") {
        //分时预约
        if (this.timeFlag) {
          this.postAxios("/order/api/timeReserveList", {
            externalCode: this.ticketsInfo.externalCode,
            startTime: this.playDate,
            endTime: this.playDate
          }).then(res => {
            _this.timeList = res.data;
            if (typeof this.ticketsInfo.FsyyTimes !== "undefined") {
              for (let i = 0; i < _this.timeList.length; i++) {
                if (
                  _this.timeList[i].stockCode ===
                  _this.ticketsInfo.FsyyTimes.stockCode &&
                  _this.timeList[i].endTime ===
                  _this.ticketsInfo.FsyyTimes.endTime &&
                  _this.timeList[i].startTime ===
                  _this.ticketsInfo.FsyyTimes.startTime
                ) {
                  _this.activeIndex = i;
                }
              }
            }
            _this.timeFlag = false;
            _this.realAdd();
          });
        } else {
          this.realAdd();
        }
      } else {
        this.realAdd();
      }
    },
    realAdd () {
      if (
        this.ticketsInfo &&
        this.ticketsInfo.isShowTicketNotice == "T" &&
        this.noticeFlag
      ) {
        //展示提示
        this.noticeShow = true;
      } else {
        this.num++;
        //总价变价，优惠券查询需要价格
        this.Undontuse();
        if (this.ticketsInfo.realNameFlag == "T") {
          //实名制
          let obj = {
            name: "",
            idNo: "",
            idcardType: "id"
          };
          if (this.ticketsInfo.isRlsb == "T") {
            //人脸识别
            obj = Object.assign(obj, { faceUrl: "" });
          }
          this.realNameList.push(obj);
        }
      }
    },
    imgUrl (src) {
      this.faceUrls = src;
    },
    showContactsPop () {
      //联系人
      this.contactType = "linker";
      this.$refs.contactsList.showContacts();
    },
    //非一票一码获取门票总额
    allSum () {
      let sum = 0;
      this.ticketType.forEach((item, index) => {
        sum += item.priceSettle * 100 * item.num;
      });
      return sum;
    },
    //获取下单数量和总金额 val为优惠券金额
    getPrice (obj) {
      this.totalprice = 0;
      this.totalprice = (this.num * this.currentPrice).toFixed(2);
      this.ticketsInfo.map(item => {
        // 实名制 
        if (item.realNameFlag == "T" && item.formNum) {
          item.ymypRealNameIndex = null;
          if (item.realNameList.length < item.formNum * this.num) {
            for (let index = item.realNameList.length; index < item.formNum * this.num; index++) {
              item.realNameList.push({
                name: "",
                idNo: "",
                idcardType: "id"
              });
            }
          } else {
            item.realNameList.splice(item.formNum * this.num, item.realNameList.length);
          }
        }
      });
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
            if (this.payType == "12" || this.payType == "17") {
              //工行聚合支付
              let infoData = res.data;
              infoData =
                typeof infoData == "string" ? JSON.parse(infoData) : {};
              this.infoData = infoData;
              let env = isWxAli();
              // this.formStr = res.data;
              this.isWxPay = env.isWx;
              this.isIcbc = true;
              this.$refs.pay.aliPayShow = true;
              this.$nextTick(() => {
                this.oneSubFrom = true;
              });
            }
            else if (this.payType == '2019') {
              this.tradeNo = JSON.parse(res.data).orderNo
              this.isAliAp = true
              this.$refs.pay.aliPayShow = true;
              this.$nextTick(() => {
                this.oneSubFrom = true;
              });
            }
            else if (this.payType == "70" || this.payType == "71") {
              //银联支付，直接跳转链接,智游宝悦单银联公众号支付,智游宝悦单银联二维码支付
              window.location.href = res.data;
            } else {
              let env = isWxAli();
              this.formStr = res.data;
              this.isWxPay = env.isWx;
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
    checkMobile (val) {
      if (!/1[3-9][0-9]{9}$/.test(val) && val.length != 11) {
        return true;
      }
    },
    //身份证验证
    checkIdCard (vla, type) {
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
    subForm () {
      let classList = Array.from(this.$refs.subForm.classList);
      if (classList.indexOf("active") === -1) return;
      if (this.oneSubFrom) {
        this.oneSubFrom = false;
        this.flag = true;
        // console.log(1);
        try {
          if (1 || this.isYpym) {
            //一票一码
            // if (
            //   !(this.ticketsInfo.priceSettle || this.ticketsInfo.priceSettle == 0)
            // ) {
            //   //判断当天的价格、在售状态
            //   this.$vux.toast.text(
            //     this.playDate + "号没票，请重新选择日期",
            //     "middle"
            //   );
            //   this.flag = false;
            //   throw new Error("没票，请重新选择日期");
            // }
            if (this.num == 0) {
              this.$vux.toast.text("购买数量不能为0", "middle");
              this.flag = false;
              throw new Error("购买数量不能为0");
            }
            for (let index = 0; index < this.ticketsInfo.length; index++) {
              const element = this.ticketsInfo[index];
              if (element.realNameFlag == "T") {
                //是否是实名制
                for (let index = 0; index < element.realNameList.length; index++) {
                  const item = element.realNameList[index];
                  if (!item.name) {
                    this.flag = false;
                    this.$vux.toast.text(
                      "第" + (index + 1) + "个游玩人姓名不能为空！",
                      "middle"
                    );
                    throw new Error("验证失败！");
                  }
                  if (!item.idNo) {
                    this.flag = false;
                    this.$vux.toast.text(
                      "第" + (index + 1) + "个游玩人证件号不能为空！",
                      "middle"
                    );
                    throw new Error("验证失败！");
                  } else {
                    if (this.checkIdCard(item.idNo, item.idcardType)) {
                      this.flag = false;
                      // this.$vux.toast.text("请输入正确证件号！", "middle");
                      this.$vux.toast.text(
                        "第" + (index + 1) + "个游玩人证件号格式错误！",
                        "middle"
                      );
                      throw new Error("验证失败！");
                    }
                  }
                  // if (this.ticketsInfo.isRlsb == "T") {
                  //   //人脸识别并且非护照需要验证人脸图
                  //   if (!item.faceUrl && item.idcardType != "passport") {
                  //     this.flag = false;
                  //     this.$vux.toast.text(
                  //       "第" + (i + 1) + "个游玩人人脸照不能为空！",
                  //       "middle"
                  //     );
                  //     throw new Error("验证失败！");
                  //   }
                  // }
                }
              }
            }
          } else {
            this.ticketType.forEach((item, index) => {
              let realArr = item.list;
              // console.log(item)
              // console.log(realArr);
              if (item.realNameFlag == "T") {
                let idnoArr = [];
                for (let i = 0; i < realArr.length; i++) {
                  idnoArr.push(realArr[i].idNo);
                  if (!realArr[i].name) {
                    this.flag = false;
                    this.$vux.toast.text(
                      item.nickName + "第" + (i + 1) + "个游玩人姓名不能为空！",
                      "middle"
                    );
                    throw new Error("验证失败！");
                  }
                  if (!realArr[i].idNo) {
                    this.flag = false;
                    this.$vux.toast.text(
                      item.nickName +
                      "第" +
                      (i + 1) +
                      "个游玩人证件号不能为空！",
                      "middle"
                    );
                    throw new Error("验证失败！");
                  } else {
                    if (
                      this.checkIdCard(realArr[i].idNo, realArr[i].idcardType)
                    ) {
                      this.flag = false;
                      // this.$vux.toast.text("请输入正确证件号！", "middle");
                      this.$vux.toast.text(
                        item.nickName +
                        "第" +
                        (i + 1) +
                        "个游玩人证件号格式错误！",
                        "middle"
                      );
                      throw new Error("验证失败！");
                    }
                  }
                  // if (item.isRlsb == "T") {
                  //   //人脸识别并且不是护照的时候需要验证人脸
                  //   if (
                  //     !realArr[i].faceUrl &&
                  //     realArr[i].idcardType != "passport"
                  //   ) {
                  //     this.flag = false;
                  //     this.$vux.toast.text(
                  //       item.nickName +
                  //         "第" +
                  //         (i + 1) +
                  //         "个游玩人人脸照不能为空！",
                  //       "middle"
                  //     );
                  //     throw new Error("验证失败！");
                  //   }
                  // }
                }
                for (let j = 0; j < idnoArr.length; j++) {
                  for (let k = 0; k < idnoArr.length; k++) {
                    if (j != k) {
                      if (idnoArr[j] == idnoArr[k]) {
                        this.flag = false;
                        this.$vux.toast.text(
                          item.nickName +
                          "第" +
                          (k + 1) +
                          "个游玩人证件号码重复！",
                          "middle"
                        );
                        throw new Error("证件号码重复");
                      }
                    }
                  }
                }
              } else {
              }
            });
          }
          this.formObjData = this.$refs.orderInfo.check();
          // console.log(this.formObjData);
          if (!this.formObjData.flag) {
            this.flag = false;
            throw new Error("验证失败！");
          }
        } catch (e) {
          this.oneSubFrom = true;
        }
        if (this.flag) {
          let amounts = [];
          let paySum = 0;
          let formData = Object.assign(this.formObjData.formObj, {
            modelCodes: this.productDetal.code,
            leaguerId:
              localStorage.getItem("xjsc_login_userId_2019_3_8") ||
              this.$cookie.get("leaguerInfoId"),
            // buyerName: this.buyerName,
            // buyerMobile: this.realTel,
            // buyerIdNo: this.formItem.buyerIdNo,
            amounts: "",
            wayType: 1,
            orderType: "family",
            marketingType: "0",
            paySum: null,
            startTime: this.playDate,
            // couponCode: this.couponCode ? this.couponCode : "",
            tips: JSON.stringify(this.formObjData.tips)
          });
          let arr = [];
          let fsyyArr = [];
          for (let index = 0; index < this.ticketsInfo.length; index++) {
            const element = this.ticketsInfo[index];
            if (element.realNameFlag == "T") {
              //深度复制
              let deepRealNameList = JSON.parse(
                JSON.stringify(element.realNameList)
              );
              deepRealNameList.forEach((item, index) => {
                if (item.idcardType == "id") {
                  deepRealNameList[index].idNo = deepRealNameList[
                    index
                  ].idNo.toUpperCase();
                }
              });
              arr.push({
                code: element.modelCode,
                list: deepRealNameList
              });
              paySum = element.priceSettle * 100 * element.num;
            } else {
              //深度复制
              let deepTicketType = JSON.parse(JSON.stringify(this.ticketType));
              deepTicketType.forEach((item, index) => {
                paySum += item.priceSettle * item.num * 100;
                if (item.realNameFlag == "T") {
                  //将身份证x转换成大写X
                  let list = item.list;
                  list.forEach((it, i) => {
                    if (it.idcardType == "id") {
                      //身份证
                      list[i].idNo = list[i].idNo.toUpperCase();
                    }
                  });
                  let obj = {
                    code: item.modelCode,
                    list: list
                  };
                  arr.push(obj);
                }
              });
            }
            if (element.subFlag == 'T' && element.timeList instanceof Array && element.timeList.length) {
              let time = (element.activeIndex || element.activeIndex === 0) ? element.timeList[element.activeIndex] : null;
              element.startTime = time ? time.startTime : element.startTime;
              element.endTime = time ? time.endTime : element.endTime;
              fsyyArr.push({
                code: element.modelCode,
                startTime: element.playDate
                  ? element.playDate
                  : "",
                orderType: element.modelType == 'ticket' ? 'park' : element.modelType,
                fsStartTime: element.startTime ? element.startTime : "",
                fsEndTime: element.endTime ? element.endTime : "",
              });
            } else {
              fsyyArr.push({
                code: element.modelCode,
                startTime: element.modelType == 'hotel' ? this.playDate : (element.playDate
                  ? element.playDate
                  : ""),
                orderType: element.modelType == 'ticket' ? 'park' : element.modelType,
                // endTime: element.endTime ? element.endTime : ""
              });
            }
          }
          formData.familyParams = JSON.stringify(fsyyArr);
          formData.paySum = this.totalprice;
          formData.amounts = this.num;
          formData.realNames = JSON.stringify(arr);

          // if (!this.isface) {
          //   formData.faceUrl = "";
          // }
          let _url = this.api.order.saveOrder;
          let env = isWxAli();

          //判断是否有推广码
          // if (this.$route.query.spread_code || this.$route.query.promoteCode) {
          //   formData = Object.assign(formData, {
          //     promoteCode:
          //       this.$route.query.spread_code || this.$route.query.promoteCode
          //   });
          // }
          // let spread_code = this.$cookie.get(
          //   "spread_code_" + this.$route.query.m_id
          // );
          // if (spread_code) {
          //   formData = Object.assign(formData, {
          //     promoteCode: spread_code
          //   });
          // }
          // if (this.$route.query.isSpecial) {
          //   formData = Object.assign(formData, {
          //     isSpecial: this.$route.query.isSpecial
          //   });
          // }

          this.postAxios(_url, formData)
            .then(
              result => {
                if (result.status != "200") {
                  this.$vux.toast.warn(result.message, "middle");
                } else {
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
    getPayType (businessType) {
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
    fillContact (item) {
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
      } else if (this.contactType == "ypymRealName") {
        //一票一码实名制
        this.ticketsInfo[this.contactTicketIndex].realNameList[this.contactTicketIndexI].idNo = item.certNo
          ? item.certNo
          : "";
        this.ticketsInfo[this.contactTicketIndex].realNameList[this.contactTicketIndexI].name = item.name
          ? item.name
          : "";
        // this.ticketsInfo[this.contactTicketIndex].realNameList[this.contactTicketIndexI].faceUrl =
        //   this.ticketsInfo.isRlsb == "T"
        //     ? item.faceUrl
        //       ? item.faceUrl
        //       : ""
        //     : "";
      }
    },
    //下单获取优惠券列表
    getCoupons () {
      let couponUrl = this.api.main.marketing.useCoupons;
      let cpArr = [],
        modelprice = "";
      if (this.isYpym) {
        //ypym
        modelprice =
          this.ticketsInfo.modelCode +
          "-" +
          (this.ticketsInfo.priceSettle
            ? ((this.ticketsInfo.priceSettle * this.num * 100) / 100).toFixed(2)
            : 0);
      } else {
        this.ticketType.forEach((item, index) => {
          let pertotalPrice = item.priceSettle * item.num;
          pertotalPrice = pertotalPrice.toFixed(2);
          cpArr.push(item.modelCode + "-" + pertotalPrice);
        });
        modelprice = cpArr.join(",");
      }

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
    useCoupon (obj) {
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
    Undontuse () {
      this.obj = null;
      this.couponCode = "";
      this.getPrice(0);
      this.couponUserType = "";
      this.couponName = "";
      this.couponUserNum = "";
    },
    //获取当前日期
    getCurDate () {
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
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },
    formatDate (d, fmt) {
      let date;
      if (d instanceof Date) {
        date = d;
      } else {
        let newd = !d || d.replace(/-/g, "/");
        date = new Date(newd);
      }
      let padLeftZero = str => {
        return ("00" + str).substr(str.length);
      };
      let o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds()
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      }
      for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + "";
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length === 1 ? str : padLeftZero(str)
          );
        }
      }
      return fmt;
    },
    //一票一码获取门票信息
    getTicketsInfo () {
      this.postAxios("/merchant/api/merchantFamilyInfo/familyDetailInfoList", {
        merchantFamilyTicketId: this.$route.query.merchantFamilyTicketId,
        merchantInfoId: this.$route.query.m_id,
        dateStr: this.playDate
      }).then(res => {
        // 小鲸自建的票型默认是非实名制票并且接口不返回realNameFlag字段
        let currentTime = new Date().getTime();
        let max = 0;
        res.data.map(item => {
          // 日期格式处理
          let dateArray = [];
          item.dateList = item.dateList ? item.dateList : [];
          for (let i = 0; i < item.dateList.length; i++) {
            let d = item.dateList[i];
            let date, mmdd;
            if (d instanceof Date) {
              date = this.formatDate(d, "yyyy-MM-dd");
              mmdd = this.formatDate(d, "MM-dd");
            } else {
              let newd = !d || d.replace(/-/g, "/");
              date = this.formatDate(newd, "yyyy-MM-dd");
              mmdd = this.formatDate(newd, "MM-dd");
            }
            let day = {
              date: date,
              text: (date === this.formatDate(new Date(), "yyyy-MM-dd") ? "今天" : (date === this.formatDate(new Date(currentTime + 24 * 60 * 60 * 1000), "yyyy-MM-dd") ? "明天" : (date === this.formatDate(new Date(currentTime + 24 * 60 * 60 * 1000 * 2), "yyyy-MM-dd") ? "后天" : ""))) + mmdd,
            }
            if (!i) {
              item.playDate = date
            }
            dateArray.push(day);
          }
          item.dateList = dateArray;
          if (item.modelType == "hotel") {
            item.playDate = this.playDate;
            item.dateList = [];
            let date = new Date(item.playDate.replace(/-/g, "/")).getTime();
            for (let i = 0; i < item.hotelNum; i++) {
              item.dateList.push(this.formatDate(new Date(date + i * 24 * 60 * 60 * 1000), "yyyy-MM-dd"));
            }
          }
          if (!item.dateList.length && item.modelType == 'ticket') { // 套票日期为游玩日期
            let mmdd = this.formatDate(this.playDate, "MM-dd");
            item.dateList = [{
              date: this.playDate,
              text: (this.playDate === this.formatDate(new Date(), "yyyy-MM-dd") ? "今天" : (this.playDate === this.formatDate(new Date(currentTime + 24 * 60 * 60 * 1000), "yyyy-MM-dd") ? "明天" : (this.playDate === this.formatDate(new Date(currentTime + 24 * 60 * 60 * 1000 * 2), "yyyy-MM-dd") ? "后天" : ""))) + mmdd,
            }]
            item.playDate = this.playDate;
          }
          // 分时预约
          if (item.subFlag == "T" && item.externalCode) {
            item.timeList = [];
            item.activeIndex = null;
            item.startTime = '';
            item.endTime = '';
            item.noticeFlag = false;
            this.getTimeArrFlag(item);
          }
          // 实名制 
          if (item.realNameFlag == "T" && item.formNum) {
            item.ymypRealNameIndex = null;
            item.realNameList = [];
            max += item.formNum;
            for (let index = 0; index < item.formNum; index++) {
              let num = this.num ? this.num : 0;
              for (let inde = 0; inde < num; inde++) {
                item.realNameList.push({
                  name: "",
                  idNo: "",
                  idcardType: "id"
                });
              }
            }
          }
        });
        this.max = max ? Math.floor(100 / max) : this.max;
        this.ticketsInfo = res.data;
        //请求联系人信息只有第一次的时候执行
        if (this.handelFlag) {
          this.getOrderInfo();
          // this.formArr = [{"title":"姓名","type":"buyerName","tips":"请填写姓名","name":"buyerName","isRequired":true},{"title":"手机号","type":"buyerMobile","tips":"请输入手机号","name":"buyerMobile","isRequired":true},{"title":"身份证号","type":"buyerIdNo","tips":"请填写身份证号","name":"buyerIdNo","isRequired":false}];
          this.handelFlag = false;
        }
      });
    },
    //获取套票下单数量限制
    getTicketsLimit () {
      let marketTime = [
        {
          value: '0',
          label: '整个销售时间段'
        },
        {
          value: '1',
          label: '每日'
        },
        {
          value: '2',
          label: '每周'
        },
        {
          value: '3',
          label: '每月'
        },
        {
          value: '4',
          label: '每三月'
        },
        {
          value: '5',
          label: '每次'
        },
      ],
        mobileIdcardType = [
          {
            value: '0',
            label: '手机号'
          },
          {
            value: '1',
            label: '身份证'
          },
          {
            value: '2',
            label: '手机号+身份证'
          },
          {
            value: '3',
            label: '用户'
          },
        ];
      this.postAxios("/merchant/api/merchantFamilyInfo/familyTicketInfoDetail", {
        merchantFamilyTicketId: this.$route.query.merchantFamilyTicketId,
        merchantInfoId: this.$route.query.m_id,
      }).then(res => {
        if (res.status == 200 && res.data.numberType == 'T') {
          this.max = res.data.numAmount;
          this.maxLimitText = "(" + marketTime[res.data.marketTime].label + mobileIdcardType[res.data.mobileIdcardType].label + "限购" + this.max + "份)";
        }
      });
    },
    //获取当前月有价格的日期
    getOnDate () {
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
        let ym =
          item.year + sp + (item.month > 9 ? item.month : "0" + item.month);
        axiosArr.push(
          this.getAxios(
            "/merchant/api/merchantProductPriceApi/getPriceStockCalendar",
            {
              productType: "ticket",
              id: this.$route.query.ticketId,
              month: ym
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
            day.salePriceStatus == "T" &&
            (day.stockModel == "unlimit" ? true : day.stock > 0) &&
            new Date(day.date).valueOf() >= new Date(currentdate).valueOf()
          );
        });
        if (item) {
          //当前存在有库存价格的日期
          this.playDate = item.date;
        } else {
          //当前月不具备
          //获取门票信息
          this.playDate = this.getCurDate();
        }
        this.dateSelectShow = true;
        this.getTicketsInfo();
      });
    },
    showNotice () {
      this.moneyDetailShow = true;
    }
  },
  created() {
    let env = isWxAli();
    // this.formStr = res.data;
    this.inWeiXin = env.isWx;
    this.handelFlag = true;
    this.productDetal = JSON.parse(localStorage.getItem("productDetal"));
    if (window.innerHeight != undefined) {
      // return window.innerHeight;
      this.floatNavTop = window.innerHeight - 220;
    } else {
      let B = document.body,
        D = document.documentElement;
      this.floatNavTop = Math.min(D.clientHeight, B.clientHeight) - 220;
    }
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
      this.getDateList();
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

    if (this.$route.query.merchantFamilyInfoId) {
      document.title = "套票订单";
      this.isYpym = true;
      this.playDate = this.$route.query.playDate;
      this.getTicketsInfo();
      this.getTicketsLimit();
    } else {
      document.title = "填写订单信息";
      //非一票一码
      this.playDate = this.$route.query.playDate;
      //获取缓存票型信息
      let arr = [];
      arr = JSON.parse(
        localStorage.getItem("xjxc_vue_wap_2019_3_7_ticket_orderData")
      );
      // this.getOrderInfo(arr[0].merchantParkInfoId);
      let faceFlag = false;
      let isCheckIdcard = false;
      arr.forEach((item, index) => {
        //判断当前这个订单是存在人脸识别票，存在在底部的联系人信息需要人脸识别
        // if (!faceFlag && item.isRlsb === "T") {
        //   faceFlag = true;
        // }
        //
        if (arr[index].realNameFlag == "T") {
          //是否需要实名认证
          arr[index].list = [];
          for (let i = 0; i < arr[index].num; i++) {
            let obj = {
              name: "",
              idNo: "",
              idcardType: "id"
            };
            if (item.isRlsb == "T") {
              //是不是人脸识别票
              obj = Object.assign(obj, { faceUrl: "" });
            }
            arr[index].list.push(obj);
          }
        } else {
          //非实名制人脸
          if (item.isRlsb === "T") {
            faceFlag = true;
            isCheckIdcard = true;
          }
        }
      });
      // console.log(arr);

      this.isface = faceFlag;
      this.isCheckIdcard = isCheckIdcard;
      this.ticketType = arr;
      // console.log(arr);
      this.getPrice(0);
      // 联系人配置

    }
    // 是否展示时间价格
    this.showPrice = typeof this.productDetal.isDisplayPrice !== 'undefined' && this.productDetal.isDisplayPrice === 'T'
    // this.formArr = [{"title":"姓名","type":"buyerName","tips":"请填写姓名","name":"buyerName","isRequired":true},{"title":"手机号","type":"buyerMobile","tips":"请输入手机号","name":"buyerMobile","isRequired":true},{"title":"身份证号","type":"buyerIdNo","tips":"请填写身份证号","name":"buyerIdNo","isRequired":false}];
  }
};
</script>

<style lang="scss">
@import "../../../assets/styles/mixin.scss";
.tickets-order {
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
  .tickets-time-list {
    border-top: none;
    padding-top: 10px;
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
    .tickets-play-title {
      font-size: 16px;
      line-height: 58px;
      width: auto;
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
  .tickets-order-info {
    background-color: #fff;
    padding-top: 10px;
    padding-left: 10px;
    padding-bottom: 12px;
    padding-right: 15px;
    .tickets-info-title {
      font-weight: bold;
      font-size: 16px;
      color: #413838;
      @include oh;
      line-height: 30px;
    }
    .tickets-info-subtitle {
      font-size: 14px;
      line-height: 16px;
      width: 276px;
      @include oh;
      margin-bottom: 10px;
      color: #777;
    }
    .tickets-info-flex {
      @include fbc;
    }
    .tickets-info-labels {
      width: 276px;
      span {
        display: inline-block;
        padding: 0px 8px;
        font-size: 12px;
        background-color: #ffefea;
        color: #ff6633;
        line-height: 18px;
        margin-right: 5px;
      }
    }
    .tickets-info-price {
      color: #0086f6;
      font-size: 14px;
      line-height: 18px;
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
  .tickets-bottom-box {
    background-color: #333;
    .left-warper {
      display: flex;
      color: #fff;
      height: 100%;
      flex-grow: 1;
      align-items: center;
      justify-content: space-between;
      .money {
        line-height: 49px;
        margin-top: 0px;
        white-space: nowrap;
        height: 100%;
        .title {
          margin-right: 3px;
          font-size: 14px;
        }
        .unit {
          color: #fff;
          margin-right: 0px;
        }
        .price {
          max-width: 98px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 21px;
          font-weight: bold;
          color: #fff;
        }
      }
      .money-detail {
        line-height: 49px;
        margin-right: 25px;
        font-size: 14px;
        .xx-icon {
          font-size: 10px;
          margin-left: 5px;
        }
      }
    }
    .right-warper {
      width: 129px;
      font-weight: bold;
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
.tickets-order-playDate {
  background-color: #fff;
  margin-bottom: 10px;
  .tickets-play-title {
    border-bottom: 1px solid #e1e1e1;
    line-height: 58px;
    font-size: 18px;
    color: #413838;
    padding-left: 14px;
    font-weight: bold;
  }
  .tickets-play-dates {
    padding: 20px 10px;
    height: 46px;
    overflow: auto;
    .tickets-play-dates-list {
      width: auto;
      white-space: nowrap;
      span {
        color: #413838;
        width: 90px;
        line-height: 46px;
        font-size: 12px;
        margin-right: 13px;
        background-color: #f5f5f5;
        text-align: center;
        display: inline-block;
      }
      .tickets-play-dates-current {
        background-color: #fbb43c;
        color: #fff;
      }
    }
  }
}
.tickets-order {
  .order-detail-modal {
    position: fixed;
    top: 0px;
    right: 0px;
    bottom: 50px;
    left: 0px;
  }
  .order-detail-mask {
    background-color: rgba(0, 0, 0, 0.5);
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
  }
  .order-detail-wrap {
    z-index: 1;
    border-radius: 2px 2px 0px 0px;
    font-size: 16px;
    color: #413838;
    background-color: #fff;
    text-align: left;
    position: absolute;
    bottom: 0px;
    width: 100%;
    left: 0px;
    .order-detail-close {
      position: absolute;
      top: 15px;
      right: 15px;
      font-size: 12px;
    }
    .order-detail-title {
      text-align: center;
      line-height: 56px;
      font-weight: bold;
      border-bottom: 1px solid #e2e2e2;
    }
    .order-detail-content {
      max-height: 385px;
      min-height: 332px;
      font-size: 14px;
      overflow: auto;
      .order-detail-h1 {
        margin: 0px 10px;
        margin-top: 10px;
        background-color: #f8f8f8;
        line-height: 28px;
        font-weight: bold;
        padding-left: 10px;
      }
      ul {
        padding-top: 5px;
        padding-bottom: 5px;
        padding-right: 10px;
        line-height: 24px;
        li {
          padding-bottom: 5px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          span {
            display: inline-block;
            vertical-align: middle;
            margin-left: 10px;
            margin-right: 6px;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background-color: #413838;
          }
          .order-detail-numPrice {
            i {
              font-style: normal;
            }
            .order-detail-num {
              margin-right: 36px;
            }
            .order-detail-price {
              display: inline-block;
              font-weight: bold;
              text-align: right;
              min-width: 90px;
            }
          }
        }
      }
      .order-detail-total {
        line-height: 54px;
        font-size: 14px;
        font-weight: bold;
        text-align: right;
        margin-left: 15px;
        padding-right: 15px;
        border-top: 1px solid #e1e1e1;
      }
    }
    .order-detail-desc {
      padding: 0px 20px;
      padding-bottom: 20px;
    }
  }
}
</style>
