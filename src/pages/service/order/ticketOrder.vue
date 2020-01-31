<template>
  <div class="ticket-order" :class="{overflow:canScroll}">
    <div v-if="isYpym" class="ticket-order-title">
      <div class="coupon-warper info-list">
        <div class="info-item">
          <div class="coupon-info">
            <span class="info-title">{{ticketName}}</span>
          </div>
          <div class="order-notice" @click="showNotice">
            <span>预定须知</span>
            <i class="xx-icon icon-xiangyoujiantou coupon-svg coupons-icon"></i>
          </div>
        </div>
      </div>
      <x-dialog hide-on-blur v-model="modalNoticeFlag">
        <div class="notice-modal">
          <div class="title">
            <div class="text">{{ticketName}}</div>
            <i @click="modalNoticeFlag=false" class="xx-icon icon-guanbi2"></i>
          </div>
          <div class="notice-book-content">
            <div v-html="ticketInfo.bookRemind"></div>
          </div>
        </div>
      </x-dialog>
    </div>
    <div class="topShadow"></div>
    <div v-if="isYpym" style="overflow: hidden">
      <!-- 一票一码 -->
      <div class="playDate playDate-title" style="border-top:none">
        <span class="play-item-title">游玩日期</span>
      </div>
      <div v-if="dateSelectShow" class="slide-calendar-box">
        <slideCalendar
          ref="slideCalendar"
          :isYpym="true"
          :slideDate="playDate"
          @selectCalendar="selectDate"
        ></slideCalendar>
      </div>
    </div>

    <div v-else class="playDate boxshadow">
      <span class="play-item-title">游玩日期</span>
      <div class="play-input-wrap">
        <span class="playDate-text">{{playDate}}</span>
      </div>
    </div>

    <!-- 一票一码 -->
    <template v-if="isYpym">
      <div class="ypym-warpper">
        <div class="ypyp-section add-sub-section">
          <span class="ticket-num">数量：</span>
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
              :max="(ticketInfo.isFsyy==='T'&& timeList instanceof Array && !timeList.length)?0:ticketInfo.isRealName == 'T'?99:9999"
              @on-change="changeNum"
            ></numSpinner>
          </div>
        </div>
        <div class="time-list" v-if="timeList instanceof Array && timeList.length&&num>0">
          <span
            class="time-item"
            v-for="(item,index) in timeList"
            :key="index"
            @click="timeIndex(item.num,index)"
            :class="{active:activeIndex==index,'no-num':!(item.num&&item.num>0)}"
          >
            {{item.startTime}}-{{item.endTime}}
            <br />
            <span v-if="ticketInfo.isDisplayFsyy === 'T'">余{{item.num}}</span>
          </span>
        </div>
      </div>
      <div
        class="no-timeList"
        v-if="ticketInfo.isFsyy==='T'&& timeList instanceof Array && !timeList.length"
      >当前游玩日期没有可选时间段，换个日期试试</div>
      <div v-if="ticketInfo.isRealName == 'T'&&realNameList.length" class="real-list-box">
        <div v-for="(it,i) in realNameList" :key="i" class="info-list">
          <div class="info-list-title">
            <div class="info-title-left">
              <span class="title-text">
                游玩人
                <template>{{i+1}}</template>
              </span>
            </div>
            <div class="img-content" @click="ypymContact(i)">
              <img src="http://statics.lotsmall.cn/wx/img/icon-contact.png" class="img" />
              <span class="text">选择</span>
            </div>
          </div>
          <div class="order-item-box">
            <div class="order-item-left">
              <div class="info-item">
                <div class="info-title">姓名</div>
                <input
                  @blur="iosBlur"
                  maxlength="10"
                  placeholder-class="input-style"
                  placeholder="须与证件上的名字一致"
                  v-model="it.name"
                />
              </div>
              <div class="info-item">
                <div @click="ypymShowCardModal(it.idcardType,i)" class="info-title">
                  <template v-if="it.idcardType">
                    <span v-if="it.idcardType=='id'">身份证</span>
                    <span v-if="it.idcardType=='pass'">港澳台</span>
                    <span v-if="it.idcardType=='passport'">护照</span>
                  </template>
                  <template v-else>
                    <span>身份证</span>
                  </template>
                  <i style="font-size:12px;color:#999" class="xx-icon icon-xiangyoujiantou"></i>
                </div>
                <input
                  @blur="iosBlur"
                  placeholder-class="input-style"
                  placeholder="请填写证件号"
                  v-model="it.idNo"
                />
              </div>
              <div class="info-item" v-if="needRepalce&&i==0">
                <div class="info-title">手机号</div>
                <input
                  @blur="iosBlur"
                  placeholder-class="input-style"
                  placeholder="请输入手机号"
                  v-model="it.tel"
                />
              </div>
            </div>
            <div v-if="cardGetData" class="order-item-right">
              <div @click="getCardType(i)">
                <card-getdata :idStr="'ypyp_card_'+i" @returnCardUrl="getCardUrl">
                  <img class="card-img" src="../../../assets/images/camera-icon.png" alt />
                  <span class="card-text">拍照识别</span>
                  <span class="card-text">身份证</span>
                </card-getdata>
              </div>
            </div>
          </div>

          <div v-if="ticketInfo.isRlsb=='T'&&it.idcardType!='passport'" class="info-item">
            <div class="info-title">人脸照</div>
            <div @click="yptmRlsbIndex(i)">
              <photo :idStr="i" @returnFaceUrl="ypymFaceUrl">
                <img
                  class="up-img"
                  v-if="!it.faceUrl"
                  src="../../../assets/images/camera-icon.png"
                  alt
                />
                <img class="show-img" v-else :src="it.faceUrl" alt />
                <!-- <span class="text">人脸图片用于入园对比（必传）</span> -->
                <span class="text">人脸图片用于入园对比</span>
              </photo>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="hotel-list">
      <div v-for="(item,index) in ticketType" :key="index" class="hotel-item">
        <div class="hotel-item-main" :class="{'realname-item':item.isRealName == 'T'}">
          <div class="hotel-info">
            <div class="hotel-name">{{item.nickName}}</div>
            <div class="hotel-num">
              <span class="unit">x</span>
              <span class="num">{{item.num}}</span>
              <!--实名制需要-->
              <span v-if="item.isRealName == 'T'" class="fq-idcard clearfix">
                <img
                  style="width: 15.5px;
                height: 12.5px;"
                  class="fl"
                  src="../../../assets/images/fq-idcard.png"
                />
              </span>
              <!--实名制需要-->
            </div>
          </div>
          <div class="hotel-price">
            <span>￥</span>
            <span class="price">{{item.priceSettle}}</span>
          </div>
        </div>
        <div class="fsyyTimes-box clearfix" v-if="item.isFsyy=='T'">
          <!-- //分时预约 -->
          <span class="time">预约时间：{{item.FsyyTimes.startTime}}-{{item.FsyyTimes.endTime}}</span>
        </div>
        <div v-if="item.isRealName == 'T'" class="real-list-box">
          <div v-for="(it,i) in item.list" :key="i" class="info-list">
            <div class="info-list-title">
              <div class="info-title-left">
                <span class="title-text">
                  游玩人
                  <template v-if="item.list.length>1">{{i+1}}</template>
                </span>
              </div>

              <div class="img-content" @click="showContact(index,i)">
                <img src="http://statics.lotsmall.cn/wx/img/icon-contact.png" class="img" />
                <span class="text">选择</span>
              </div>
            </div>
            <div class="order-item-box">
              <div class="order-item-left">
                <div class="info-item">
                  <div class="info-title">姓名</div>
                  <input
                    @blur="iosBlur"
                    maxlength="10"
                    placeholder-class="input-style"
                    placeholder="须与证件上的名字一致"
                    v-model="it.name"
                  />
                </div>
                <div class="info-item">
                  <div @click="showCardModal(it.idcardType,index,i)" class="info-title">
                    <template v-if="it.idcardType">
                      <span v-if="it.idcardType=='id'">身份证</span>
                      <span v-if="it.idcardType=='pass'">港澳台</span>
                      <span v-if="it.idcardType=='passport'">护照</span>
                    </template>
                    <template v-else>
                      <span>身份证</span>
                    </template>
                    <i style="font-size:12px;color:#999" class="xx-icon icon-xiangyoujiantou"></i>
                  </div>
                  <input
                    @blur="iosBlur"
                    placeholder-class="input-style"
                    placeholder="请填写证件号"
                    v-model="it.idNo"
                  />
                </div>
                <div v-if="item.showLinkerMobile&&i==0" class="info-item">
                  <div class="info-title">手机号</div>
                  <input
                    @blur="iosBlur"
                    placeholder-class="input-style"
                    placeholder="请输入手机号"
                    v-model="it.tel"
                  />
                </div>
              </div>
              <div v-if="cardGetData" class="order-item-right">
                <div @click="saveCardIndex(index, i)">
                  <card-getdata :idStr="index+'_normal_' + i" @returnCardUrl="getCardUrl">
                    <img class="card-img" src="../../../assets/images/camera-icon.png" alt />
                    <span class="card-text">拍照识别</span>
                    <span class="card-text">身份证</span>
                  </card-getdata>
                </div>
              </div>
            </div>

            <div v-if="item.isRlsb=='T'&&it.idcardType!='passport'" class="info-item">
              <div class="info-title">人脸照</div>
              <div @click="saveIndex(index,i)">
                <photo :idStr="index+'_'+i" @returnFaceUrl="getSrc">
                  <img
                    class="up-img"
                    v-if="!it.faceUrl"
                    src="../../../assets/images/camera-icon.png"
                    alt
                  />
                  <img class="show-img" v-else :src="it.faceUrl" alt />
                  <!-- <span class="text">人脸图片用于入园对比（必传）</span> -->
                  <span class="text">人脸图片用于入园对比</span>
                </photo>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <order-info
      ref="orderInfo"
      :toGContractInfo="toGContractInfo"
      :isNeedHidden="needRepalce"
      :formArr="formArr"
      :isface="isface"
    ></order-info>

    <div
      v-if="merchantInfoId !== '658' && !(merchantInfoId == '232' && (ticketInfo.modelCode === 'MP2019121111462842486' || ticketInfo.modelCode=== 'MP2019121111463113656' || ticketInfo.modelCode=== 'MP2020010110034366075'))"
      class="coupon-warper info-list"
    >
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
      <!-- 积分抵扣 -->
      <bonus-deduction
        v-if="bonusDeductionShow"
        v-model="bonusDeductionUse"
        :bonusDeductionData="bonusDeductionData"
        @useHandle="bonusDeductionSet"
      ></bonus-deduction>
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
        :class="{'active': !isYpym || num }"
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
    <!-- 一票一码购票提醒 -->
    <x-dialog v-model="noticeShow" class="dialog-demo">
      <div class="notice-body">
        <h2 class="notice-title">购票提醒</h2>
        <div class="notice-content" v-html="noticeStr"></div>
        <div class="footer">
          <span @click="noAgee" class="no-agree">不同意</span>
          <span @click="agree" class="agree">同意</span>
        </div>
      </div>
    </x-dialog>
    <!-- 时间选择 -->
    <!-- <mutil-calendar v-if="isYpym" ref="calendar" @getDate="mselectDate" :activeDate="playDate"></mutil-calendar> -->
    <float-nav :top="floatNavTop"></float-nav>
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
import activeityItem from "../detail/ticket/discountActivity/activeityItem";
import bonusDeduction from "./public/bonusDeduction";
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
import slideCalendar from "@/components/slideCalendar"; // 滑动日期组件
import floatNav from "@/components/floatNav";
import numSpinner from "../components/numSpinner";
import { wxShare } from "@/common/wxshare";
import URL from "url";
import querystring from "querystring";
import wxFans from "../components/wxFans";

export default {
  data() {
    return {
      bonusDeductionUse: true, //是否使用了积分抵扣，默认使用
      bonusDeductionShow: false, //积分抵扣信息是否展示
      bonusDeductionData: {}, //积分抵扣信息
      ticketOrderFlag: true, //开关
      memberShow: false, //优惠活动是否展示会员的优惠活动
      needRepalce: false,
      dateSelectShow: false,
      formItem: {
        buyerName: ""
      },
      formArr: [],
      isIcbc: false, //是否工行支付
      isAliAp: false,
      cardGetData: false, //店铺是否拥有权限9(身份证生成信息)
      floatNavTop: "10", //浮动导航顶部高度
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
      ticketInfo: {}, //ypym门票信息
      ticketName: "",
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
      idArr: ["166", "108"],
      toGContractInfo: {}, // 从2G跳转过来的联系人信息
      wayType: this.$route.query.touristId ? "G" : 1,
      tgFlag: true
    };
  },
  components: {
    bonusDeduction,
    activeityItem,
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
          this.getBonusDeduction(() => {
            this.getPrice(this.obj);
          });
        } else {
          //没有使用优惠券
          // this.getPrice(0);
          this.getBonusDeduction(() => {
            this.getPrice(0);
          });
        }
      },
      immediate: true
    },
    needRepalce: {
      handler(val, oldVal) {},
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
    bonusDeductionSet(val) {
      // this.bonusDeductionUse = val;
      //积分抵扣使用
      //价格计算
      this.getPrice(this.obj ? this.obj : 0);
    },
    initPageData(arr) {
      //初始化多票型业态数据
      this.ticketType = arr;
      //多票新初始化价格计算
      this.getBonusDeduction(() => {
        this.getPrice(0);
      });
    },
    getBonusDeduction(fn) {
      //积分抵扣获取
      //积分抵扣价格获取
      // 抵扣对象测试示例：{"totalPrice":10,"deductions":[{"productCode":"商品编码","num":"数量","price":"商品单价","detailType":"针对跟团游订单detail类型 1：表示成人票，0：表示儿童票"}]}
      let deductions = null;
      if (this.ticketOrderType == "mutiTicket") {
        //多票新
        deductions = this.ticketType.map(item => {
          return {
            productCode: item.modelCode,
            num: item.num,
            price: item.priceSettle
          };
        });
      } else {
        //单票新或者一票一码
        if (this.num) {
          deductions = [
            {
              productCode: this.ticketInfo.modelCode,
              num: this.num,
              price: this.ticketInfo.priceSettle
            }
          ];
        }
      }
      if (deductions) {
        let bonusDeduction = {
          totalPrice: this.totalprice,
          deductions: deductions
        };
        let fromData = {
          bonusDeductionJson: JSON.stringify(bonusDeduction),
          orderType: "park",
          couponCode: this.couponCode ? this.couponCode : "",
          startTime: this.playDate
        };
        this.getAxios(
          "/leaguer/api/leaguer/pubs/bonus/deduction",
          fromData
        ).then(res => {
          if (res.data && res.data.bonus && res.data.price) {
            //判断是否存在积分抵扣
            this.bonusDeductionData = {
              price: res.data.price,
              bonus: res.data.bonus
            };
            this.bonusDeductionShow = true;
          } else {
            this.bonusDeductionData = {};
            this.bonusDeductionShow = false;
          }
          typeof fn == "function" && fn();
        });
      } else {
        this.bonusDeductionData = {};
        this.bonusDeductionShow = false;
        typeof fn == "function" && fn();
      }
    },
    getOrderInfo(id) {
      // id景区id
      this.getAxios(this.api.ticket.detail.main, {
        wayType: this.wayType,
        merchantParkInfoId: id
      }).then(res => {
        this.formArr = JSON.parse(res.data.orderCustomPlugins);
      });
    },
    onBridgeReady() {
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
        function(res) {
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
    ypymFaceUrl(src) {
      this.realNameList[this.ypymRlsbIndex].faceUrl = src;
    },
    yptmRlsbIndex(index) {
      this.ypymRlsbIndex = index;
    },
    selectCardType(key) {
      if (this.cardSelectType == "normal") {
        this.ticketType[this.cardIndex].list[this.cardi].idcardType = key;
      } else if (this.cardSelectType == "ypym") {
        this.realNameList[this.ypymCardIndex].idcardType = key;
      }
      this.idCardShow = false;
    },
    showCardModal(type, index, i) {
      this.cardSelectType = "normal";
      this.idCardShow = true;
      this.cardIndex = index;
      this.cardi = i;
      this.cardType = type;
      let arr = this.ticketType[index].cardType
        ? this.ticketType[index].cardType.split(",")
        : [];
      let typeArr = [];
      if (arr && arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
          let obj = {
            key: arr[i],
            value:
              arr[i] == "id"
                ? "大陆居民身份证"
                : arr[i] == "pass"
                ? "港澳台通行证"
                : arr[i] == "passport"
                ? "护照"
                : ""
          };
          typeArr.push(obj);
        }
        this.idCardTypeList = typeArr;
      }
    },
    ypymShowCardModal(type, index) {
      // 一票一码
      this.cardSelectType = "ypym";
      this.idCardShow = true;
      this.ypymCardIndex = index;
      this.cardType = type;
    },
    getSrc(src) {
      this.ticketType[this.rlsbIndex].list[this.rlsbi].faceUrl = src;
    },
    getCardUrl(data) {
      if (this.ifYpypCard) {
        this.realNameList[this.realNameCardIndex].name =
          data.words_result.姓名.words;
        this.realNameList[this.realNameCardIndex].idNo =
          data.words_result.公民身份号码.words;
        if (data.words_result.公民身份号码.words) {
          this.realNameList[this.realNameCardIndex].idcardType = "id";
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
    getCardType(index) {
      this.realNameCardIndex = index;
      this.ifYpypCard = true;
    },
    saveIndex(index, i) {
      this.rlsbIndex = index;
      this.rlsbi = i;
    },
    saveCardIndex(index, i) {
      this.cardIndex = index;
      this.cardi = i;
      this.ifYpypCard = false;
    },
    showContact(index, i) {
      //实名制
      this.contactType = "realName";
      this.realNameIndex = index;
      this.realNamei = i;
      this.$refs.contactsList.showContacts();
    },
    ypymContact(index) {
      //一票一码实名制
      this.contactType = "ypymRealName";
      this.ymypRealNameIndex = index;
      this.$refs.contactsList.showContacts();
    },
    getUrl(url) {
      this.faceUrls = url;
    },
    selectDate(day) {
      this.playDate = day;
      this.num = 0;
      this.realNameList = [];
      this.timeFlag = true;
      this.activeIndex = 0;
      this.timeList = null;
      this.noticeFlag = true;
      this.noticeStr = "";
      this.noticeShow = false;
      this.ticketInfo = {};
      //置空优惠券
      this.Undontuse();
      this.getTicketInfo();
    },
    getTimeArrFlag() {
      //后去当天的游玩时间，判断是否显示提示
      this.noticeFlag = true;
      //如果是分时预约提前请求接口判断分时预约数组长度来展示提示文字
      this.postAxios("/order/api/timeReserveList", {
        externalCode: this.ticketInfo.externalCode,
        startTime: this.playDate,
        endTime: this.playDate
      }).then(res => {
        this.timeList = res.data;
        this.noticeFlag = res.data && res.data.length ? true : false;
      });
    },
    showCalendar() {
      if (this.isYpym) {
        //只有一票一码才能唤起日期选择
        this.$refs.calendar.show(this.playDate);
      }
    },
    timeIndex(num, i) {
      if (num > 0) {
        this.activeIndex = i;
      }
    },
    noAgee() {
      this.noticeShow = false;
      this.num = 0;
      this.Undontuse();
    },
    agree() {
      //   this.num++;
      //总价变价，优惠券查询需要价格
      this.Undontuse();
      if (this.ticketInfo.isRealName == "T") {
        let obj = {
          name: "",
          idNo: "",
          idcardType: "id"
        };
        if (this.ticketInfo.isRlsb == "T") {
          //人脸识别
          obj = Object.assign(obj, { faceUrl: "" });
        }
        this.realNameList.push(obj);
      }
      this.noticeShow = false;
      this.noticeFlag = false;
    },
    sub() {
      if (this.num == 1) {
        this.noticeFlag = true;
      }
      if (this.num >= 1) {
        if (this.ticketInfo.isRealName == "T") {
          this.realNameList.pop();
        }
        this.num--;
        //优惠券查询是通过价格查询，数量改变了话，急需要重新请求接口
        this.Undontuse();
      }
    },
    changeNum() {
      let _this = this;
      if (this.ticketInfo.isFsyy == "T") {
        //分时预约
        if (this.timeFlag) {
          this.postAxios("/order/api/timeReserveList", {
            externalCode: this.ticketInfo.externalCode,
            startTime: this.playDate,
            endTime: this.playDate
          }).then(
            res => {
              if (!(res.data && res.data.length)) {
                this.num = 0;
                this.noticeFlag = false;
              }
              _this.timeList = res.data;
              //changeNum在单票型情况下会主动执行，比对对应的分时预约，保证只执行一次
              if (
                _this.ticketOrderType == "singleTicket" &&
                !_this.timeActiveFlag
              ) {
                let arr = JSON.parse(
                  localStorage.getItem("xjxc_vue_wap_2019_3_7_ticket_orderData")
                );
                let ticketData = arr[0];
                if (typeof ticketData.FsyyTimes !== "undefined") {
                  let fsyyTimesData = ticketData.FsyyTimes;
                  for (let i = 0; i < _this.timeList.length; i++) {
                    if (
                      _this.timeList[i].stockCode === fsyyTimesData.stockCode &&
                      _this.timeList[i].endTime === fsyyTimesData.endTime &&
                      _this.timeList[i].startTime === fsyyTimesData.startTime
                    ) {
                      _this.activeIndex = i;
                    }
                  }
                }
              }
              _this.timeActiveFlag = true;
              _this.timeFlag = false;
              _this.realAdd();
            },
            error => {
              this.num = 0;
            }
          );
        } else {
          this.realAdd();
        }
      } else {
        this.realAdd();
        if (this.ticketInfo.isShowTicketNotice == "T" && this.num == 0) {
          this.noticeFlag = true;
        } else {
          this.noticeFlag = false;
        }
      }
    },
    realAdd() {
      if (
        this.ticketInfo &&
        this.ticketInfo.isShowTicketNotice == "T" &&
        this.noticeFlag
      ) {
        //展示提示
        this.noticeShow = true;
      } else {
        // this.num++;
        //总价变价，优惠券查询需要价格
        this.Undontuse();
        // console.log(this.ticketInfo);
        if (this.ticketInfo.isRealName == "T") {
          //实名制
          let flag = true;

          //数量变化，实名制也跟着变
          // console.log(this.oldNum);
          // console.log(this.num);
          let arr = [];
          let num = this.num;
          while (num--) {
            let obj = {
              name: "",
              idNo: "",
              idcardType: "id"
            };
            if (this.mflag && flag) {
              obj = Object.assign(obj, { tel: "" });
              flag = false;
            }
            if (this.ticketInfo.isRlsb == "T") {
              //人脸识别
              obj = Object.assign(obj, { faceUrl: "" });
            }
            arr.push(obj);
            if (this.$route.query.touristId) {
              arr[0].name = this.toGContractInfo.name;
              arr[0].idNo = this.toGContractInfo.idNo;
            }
            this.realNameList = JSON.parse(JSON.stringify(arr));
          }
        }
      }
      //每次为this.num=0 就购票提醒就要提示
      if (this.num == 0) {
        this.noticeFlag = true;
        this.realNameList = [];
      }
    },
    imgUrl(src) {
      this.faceUrls = src;
    },
    showContactsPop() {
      //联系人
      this.contactType = "linker";
      this.$refs.contactsList.showContacts();
    },
    subBonusPrice() {
      //判断是否使存在积分抵扣并且使用了积分抵扣，但是首次加载是不会进入
      if (this.bonusDeductionUse && this.bonusDeductionShow) {
        let subNum = this.totalprice - this.bonusDeductionData.price * 100;
        this.totalprice = subNum && subNum > 0 ? subNum : 0;
      }
    },
    //非一票一码获取门票总额
    allSum() {
      let sum = 0;
      this.ticketType.forEach((item, index) => {
        sum += item.priceSettle * 100 * item.num;
      });
      return sum;
    },
    //获取下单数量和总金额 val为优惠券金额
    getPrice(obj) {
      // let pArr = [];
      this.totalprice = 0;
      let priceSettle = this.ticketInfo.priceSettle
        ? this.ticketInfo.priceSettle
        : 0;
      if (obj == 0) {
        //不使用优惠券
        if (this.isYpym) {
          //ypym
          this.totalprice = priceSettle * this.num * 100;
        } else {
          this.totalprice = this.allSum();
        }
        //积分抵扣处理
        this.subBonusPrice();
        this.totalprice = (this.totalprice / 100).toFixed(2);
      } else {
        //使用优惠券
        switch (obj.applyType) {
          case "all":
          case "type":
            let duseCprice = this.isYpym
              ? priceSettle * this.num * 100
              : this.allSum();
            this.totalprice =
              duseCprice > obj.amount * 100 ? duseCprice - obj.amount * 100 : 0;
            //积分抵扣处理
            this.subBonusPrice();
            this.totalprice = (this.totalprice / 100).toFixed(2);
            break;
          case "used":
            let dusetotalprice = 0,
              ucoupontotalp = 0,
              duseCouponprice;
            if (this.isYpym) {
              //ypym
              dusetotalprice = priceSettle * this.num * 100;
              ucoupontotalp = priceSettle * this.num * 100;
            } else {
              for (let i = 0; i < this.ticketType.length; i++) {
                dusetotalprice +=
                  this.ticketType[i].priceSettle * 100 * this.ticketType[i].num;
                for (let j = 0; j < obj.productInfos.length; j++) {
                  if (
                    this.ticketType[i].modelCode ==
                    obj.productInfos[j].productCode
                  ) {
                    ucoupontotalp +=
                      this.ticketType[i].priceSettle *
                      100 *
                      this.ticketType[i].num;
                  }
                }
              }
            }

            duseCouponprice = dusetotalprice - ucoupontotalp;
            ucoupontotalp =
              ucoupontotalp > obj.amount * 100
                ? ucoupontotalp - obj.amount * 100
                : 0;
            this.totalprice = ucoupontotalp + duseCouponprice;
            //积分抵扣处理
            this.subBonusPrice();
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
      if (this.merchantInfoId == "139" && typeof returnCitySN !== "undefined")
        extendParam.payerIp = returnCitySN["cip"] || "";
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
        wayType: this.wayType
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
      let classList = Array.from(this.$refs.subForm.classList);
      if (classList.indexOf("active") === -1) return;
      if (this.oneSubFrom) {
        this.oneSubFrom = false;
        this.flag = true;
        // console.log(1);
        try {
          if (this.isYpym) {
            //一票一码
            if (
              !(this.ticketInfo.priceSettle || this.ticketInfo.priceSettle == 0)
            ) {
              //判断当天的价格、在售状态
              this.$vux.toast.text(
                this.playDate + "号没票，请重新选择日期",
                "middle"
              );
              this.flag = false;
              throw new Error("没票，请重新选择日期");
            }
            if (this.num == 0) {
              this.$vux.toast.text("购买数量不能为0", "middle");
              this.flag = false;
              throw new Error("购买数量不能为0");
            }

            if (this.ticketInfo.isRealName == "T") {
              //是否是实名制
              this.realNameList.forEach((item, i) => {
                if (!item.name) {
                  this.flag = false;
                  this.$vux.toast.text(
                    "第" + (i + 1) + "个游玩人姓名不能为空！",
                    "middle"
                  );
                  throw new Error("验证失败！");
                }
                if (!item.idNo) {
                  this.flag = false;
                  this.$vux.toast.text(
                    "第" + (i + 1) + "个游玩人证件号不能为空！",
                    "middle"
                  );
                  throw new Error("验证失败！");
                } else {
                  if (this.checkIdCard(item.idNo, item.idcardType)) {
                    this.flag = false;
                    // this.$vux.toast.text("请输入正确证件号！", "middle");
                    this.$vux.toast.text(
                      "第" + (i + 1) + "个游玩人证件号格式错误！",
                      "middle"
                    );
                    throw new Error("验证失败！");
                  }
                }
                if (this.needRepalce && i == 0) {
                  if (!item.tel) {
                    this.flag = false;
                    this.$vux.toast.text(
                      "第" + (i + 1) + "个游玩人手机号不能为空！",
                      "middle"
                    );
                    throw new Error("验证失败！");
                  } else {
                    if (this.checkMobile(item.tel)) {
                      this.flag = false;
                      this.$vux.toast.text(
                        "第" + (i + 1) + "个游玩人电话号码格式错误！",
                        "middle"
                      );
                      throw new Error("验证失败！");
                    }
                  }
                }

                // if (this.ticketInfo.isRlsb == "T") {
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
              });
            }
          } else {
            // console.log(this.ticketType)
            this.ticketType.forEach((item, index) => {
              let realArr = item.list;
              // console.log(item);
              // console.log(realArr);
              if (item.isRealName == "T") {
                let idnoArr = [];
                for (let i = 0; i < realArr.length; i++) {
                  idnoArr.push(realArr[i].idNo);
                  if (item.showLinkerMobile && i == 0) {
                    //第一组实名制的第一张票限制票型
                    if (!realArr[i].tel) {
                      this.flag = false;
                      this.$vux.toast.text(
                        item.nickName + "第" + (i + 1) + "人电话号码不能为空！",
                        "middle"
                      );
                      throw new Error("验证失败！");
                    } else {
                      if (this.checkMobile(realArr[i].tel)) {
                        this.flag = false;
                        this.$vux.toast.text(
                          item.nickName +
                            "第" +
                            (i + 1) +
                            "人电话号码格式错误！",
                          "middle"
                        );
                        throw new Error("验证失败！");
                      }
                    }
                  }
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
            wayType: this.wayType,
            orderType: "park",
            marketingType: "",
            paySum: null,
            // faceUrl: this.faceUrls,
            startTime: this.playDate,
            couponCode: this.couponCode ? this.couponCode : "",
            tips: JSON.stringify(this.formObjData.tips)
          });

          if (this.isYpym) {
            //单票型
            if (this.needRepalce) {
              let replaceObj = this.realNameList[0];
              formData.buyerName = replaceObj.name;
              formData.buyerIdNo = "";
              formData.buyerMobile = replaceObj.tel;
            }
          } else {
            //乐山景区实名制票不需要填写联系人信息，使用实名制第一个人的信息作为联系人信息，对数据做个替换
            if (this.needRepalce) {
              let replaceItem = this.ticketType.find(
                item => item.showLinkerMobile
              );
              let replaceObj = replaceItem.list[0];
              formData.buyerName = replaceObj.name;
              formData.buyerIdNo = "";
              formData.buyerMobile = replaceObj.tel;
            }
          }

          let arr = [];
          let fsyyArr = [];
          if (this.isYpym) {
            modelCodes = [this.ticketInfo.modelCode];
            //深度复制
            let deepRealNameList = JSON.parse(
              JSON.stringify(this.realNameList)
            );
            deepRealNameList.forEach((item, index) => {
              if (item.idcardType == "id") {
                deepRealNameList[index].idNo = deepRealNameList[
                  index
                ].idNo.toUpperCase();
              }
            });
            arr = [
              {
                code: this.ticketInfo.modelCode,
                list: deepRealNameList
              }
            ];
            paySum = this.ticketInfo.priceSettle * 100 * this.num;
            amounts = [this.num];
          } else {
            //深度复制
            let deepTicketType = JSON.parse(JSON.stringify(this.ticketType));
            deepTicketType.forEach((item, index) => {
              modelCodes.push(item.modelCode);
              amounts.push(item.num);
              paySum += item.priceSettle * item.num * 100;
              if (item.isRealName == "T") {
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

          formData.paySum = (paySum / 100).toFixed(2);
          formData.modelCodes = modelCodes.join(",");
          formData.amounts = amounts.join(",");
          formData.realNames = JSON.stringify(arr);
          if (
            this.isYpym &&
            this.timeList instanceof Array &&
            this.timeList.length
          ) {
            formData.FsyyTimes = JSON.stringify([
              {
                code: this.ticketInfo.modelCode,
                startTime: this.timeList.length
                  ? this.timeList[this.activeIndex].startTime
                  : "",
                endTime: this.timeList.length
                  ? this.timeList[this.activeIndex].endTime
                  : ""
              }
            ]);
          } else {
            this.ticketType.forEach((item, index) => {
              if (item.isFsyy == "T" && item.FsyyTimes) {
                fsyyArr.push({
                  code: item.modelCode,
                  startTime: item.FsyyTimes.startTime
                    ? item.FsyyTimes.startTime
                    : "",
                  endTime: item.FsyyTimes.endTime ? item.FsyyTimes.endTime : ""
                });
              }
            });
            formData.FsyyTimes = JSON.stringify(fsyyArr);
          }

          if (!this.isface) {
            formData.faceUrl = "";
          }
          let _url = this.api.order.saveOrder;
          let env = isWxAli();

          //判断是否有推广码
          // if (this.$route.query.spread_code || this.$route.query.promoteCode) {
          //   formData = Object.assign(formData, {
          //     promoteCode:
          //       this.$route.query.spread_code || this.$route.query.promoteCode
          //   });
          // }
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
          let unit_code = this.$cookie.get(
            "mk_promote_code" + this.$route.query.m_id
          );
          if (typeof unit_code !== "undefined" && unit_code) {
            //联盟推广码
            formData = Object.assign(formData, {
              mkSpreadCode: unit_code
            });
          }
          if (this.$route.query.touristId) {
            formData = Object.assign(formData, {
              touristId: this.$route.query.touristId,
              buyerName: this.$refs.orderInfo.formItem.buyerName,
              buyerMobile: this.$refs.orderInfo.formItem.buyerMobile,
              buyerIdNo: this.$refs.orderInfo.formItem.buyerIdNo
              // list: [
              //     {
              //         name: this.$refs.orderInfo.formItem.buyerName,
              //         idNo: this.$refs.orderInfo.formItem.buyerIdNo,
              //         faceUrl: '',
              //         idcardType: 'id'
              //     }
              // ]
            });
          }

          //判断是否存在积分抵扣及是否使用积分抵扣
          // bonusDeductionUse:false,//是否使用了积分抵扣，默认未使用
          // bonusDeductionShow:false,//积分抵扣信息是否展示
          if (this.bonusDeductionUse && this.bonusDeductionShow) {
            formData = Object.assign(formData, {
              deductionMoney: this.bonusDeductionData.price,
              deductionBonus: this.bonusDeductionData.bonus
            });
          }

          this.postAxios(_url, formData)
            .then(
              result => {
                this.orderNo = result.data.payOrderNo;
                this.orderInfo = result.data.orderDescription;
                this.orderId = result.data.id;
                let businessType = "";
                if (env.isWx) {
                  //如果是微信端
                  this.getAxios("/merchant/api/validateZeroRateTicket", {
                    modelCode: modelCodes.join(",")
                  }).then(
                    res => {
                      if (res.message == "T") {
                        businessType = "YXT";
                      } else {
                        businessType = "WEIXIN";
                      }
                      this.getPayType(businessType);
                    },
                    reject => {
                      this.oneSubFrom = true;
                    }
                  );
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
        this.payType = "2015";
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
          this.ticketType[this.realNameIndex].list[
            this.realNamei
          ].tel = item.phone ? item.phone : "";
        }
      } else if (this.contactType == "ypymRealName") {
        //一票一码实名制

        this.realNameList[this.ymypRealNameIndex].idNo = item.certNo
          ? item.certNo
          : "";
        this.realNameList[this.ymypRealNameIndex].name = item.name
          ? item.name
          : "";
        this.realNameList[this.ymypRealNameIndex].faceUrl =
          this.ticketInfo.isRlsb == "T"
            ? item.faceUrl
              ? item.faceUrl
              : ""
            : "";
        //判断当前是否还有tel属性值
        if (this.realNameList[this.ymypRealNameIndex].hasOwnProperty("tel")) {
          this.realNameList[this.ymypRealNameIndex].tel = item.phone
            ? item.phone
            : "";
        }
      }
    },
    //下单获取优惠券列表
    getCoupons() {
      let couponUrl = this.api.main.marketing.useCoupons;
      let cpArr = [],
        modelprice = "";
      if (this.isYpym) {
        //ypym
        modelprice =
          this.ticketInfo.modelCode +
          "-" +
          (this.ticketInfo.priceSettle
            ? ((this.ticketInfo.priceSettle * this.num * 100) / 100).toFixed(2)
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
    useCoupon(obj) {
      //
      this.obj = obj;
      this.couponCode = obj.code;
      this.getBonusDeduction(() => {
        this.getPrice(obj);
      });
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
      this.getBonusDeduction(() => {
        this.getPrice(0);
      });
      this.couponUserType = "";
      this.couponName = "";
      this.couponUserNum = "";
    },
    //获取当前日期
    getCurDate() {
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
    initSingleTicketData() {
      // 初始化单票型实名制信息
      //价格计算是监听的num值的变化，在这个地方赋值能保证单票型业态取值是在判断会员价后的价格
      //这个处理要保证页面只有第一次处理的时候会初始化数量和实名制，后面数量改变的时候只有num=0开始，所以要价格开关
      if (this.ticketOrderType == "singleTicket" && this.ticketOrderFlag) {
        //单票型处理
        this.num = this.locationNum;
        let num = this.num;
        while (num--) {
          this.changeNum();
        }
      }
      this.ticketOrderFlag = false;
    },
    afterGetMemberData(res) {
      //请求会员优惠价格后的处理
      if (
        this.ticketInfo.isRealName &&
        this.ticketInfo.isRealName == "T" &&
        this.mflag
      ) {
        this.needRepalce = true;
      }
      if (!this.ticketName) this.ticketName = res.data[0].nickName;
      this.noticeStr = res.data[0].ticketNotice;
      // 小鲸自建的票型默认是非实名制票并且接口不返回isRealName字段
      if (
        res.data[0].isRlsb == "T" &&
        (!res.data[0].isRealName || res.data[0].isRealName == "F")
      ) {
        //非实名制人脸的时候才需要图片
        this.isface = true;
      } else {
        this.isface = false;
      }
      //请求联系人信息只有第一次的时候执行
      if (this.handelFlag) {
        this.getOrderInfo(res.data[0].merchantParkInfoId);
        this.handelFlag = false;
      }
      // this.idCardTypeList = res.data[0].cardType ? res.data[0].cardType.split(',') : [];
      //证件类型可配置
      let cardArr = res.data[0].cardType ? res.data[0].cardType.split(",") : [];
      if (cardArr && cardArr.length > 0) {
        let typeArr = [];
        for (let i = 0; i < cardArr.length; i++) {
          let obj = {
            key: cardArr[i],
            value:
              cardArr[i] == "id"
                ? "大陆居民身份证"
                : cardArr[i] == "pass"
                ? "港澳台通行证"
                : cardArr[i] == "passport"
                ? "护照"
                : ""
          };
          typeArr.push(obj);
        }
        this.idCardTypeList = typeArr;
      }
    },
    //一票一码获取门票信息
    getTicketInfo() {
      this.getAxios("/merchant/api/leaguer/manage/merchantParkTicket", {
        merchantParkTicketIds: this.$route.query.ticketId,
        playDate: this.playDate
      }).then(res => {
        //获取会员价，订单页面强制用户登录，所以直接用this.getAxios去获取信息就可以
        let data = res.data[0];
        let outRes = res;
        //重置会员优享
        this.memberShow = false;
        if (data.priceSettle || data.priceSettle == 0) {
          this.getAxios("/leaguer/api/leaguer/pubs/product/discount", {
            codePrice: data.modelCode + ":" + data.priceSettle
          }).then(res => {
            if (res.status == 200) {
              let priceArr = res.message.split(":");
              let memberPrice = priceArr[1] ? Number(priceArr[1]) : 0;
              if (data.priceSettle == memberPrice) {
                //会员价和销售价相同，非会员
                this.memberShow = false;
                data.isMemberPrice = false;
              } else {
                // 会员价
                this.memberShow = true;
                //存放老的销售价，方便用来计算优惠价
                data.oldPriceSettle = data.priceSettle;
                data.isMemberPrice = true;
                data.priceSettle = memberPrice;
              }
              this.ticketInfo = data;
              //初始化单票型数据
              this.initSingleTicketData();
              this.afterGetMemberData(outRes);
            } else {
              //走到这一步，用户未登录状态
              this.afterGetMemberData(outRes);
            }
          });
        } else {
          this.afterGetMemberData(outRes);
        }
      });
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
        this.getTicketInfo();
      });
    },
    showNotice() {
      this.modalNoticeFlag = true;
    },
    // 从2g跳转过来的根据touristId获取联系人信息
    async get2gUserInfo() {
      let data = await this.getAxios(
        "/leaguer/api/userLeaguer/getAutoContactsByTouristId",
        {
          id: this.$route.query.touristId
        }
      );
      return data;
    }
  },
  async created() {
    if (this.$route.query.touristId) {
      let data = await this.get2gUserInfo();
      if (data.status == 200) {
        this.toGContractInfo = {
          name: data.data.name,
          phone: data.data.phone,
          idNo: data.data.certNo
        };
      } else {
        this.$vux.toast.text(data.message, "middle");
      }
    }
    let env = isWxAli();
    this.inWeiXin = env.isWx;
    this.handelFlag = true;
    this.merchantInfoId = this.$route.query.m_id;
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

    this.mflag = this.idArr.indexOf(this.$route.query.m_id) > -1;
    if (this.$route.query.ticketId && this.$route.query.scenicId) {
      document.title = "景区订单";
      //门票id和景区id  单票型或者一票一码
      this.isYpym = true;
      if (this.$route.query.playDate) {
        this.ticketOrderType = "singleTicket";
        //详情页面单票型处理
        this.playDate = this.$route.query.playDate;
        this.dateSelectShow = true;
        let arr = JSON.parse(
          localStorage.getItem("xjxc_vue_wap_2019_3_7_ticket_orderData")
        );
        if (arr[0].isRealName && arr[0].isRealName == "T" && this.mflag) {
          this.needRepalce = true;
          arr[0].showLinkerMobile = true;
          // item.showLinkerMobile = true;
          // realNameFlag = false;
          // item.list[0].tel = "";
        }
        //单票新页面，判断是否会员优享受
        this.memberShow = arr[0].isMemberPrice;
        //用来存初始数量值
        this.locationNum = Number(arr[0].num);
        let num = this.locationNum;
        if (num > 0) {
          this.noticeFlag = false;
        }

        this.getTicketInfo();
      } else {
        //一票一码
        this.ticketOrderType = "oneTicketOneCode";
        this.getOnDate();
      }
    } else {
      this.ticketOrderType = "mutiTicket";
      document.title = "填写订单信息";
      //非一票一码
      this.playDate = this.$route.query.playDate;
      //获取缓存票型信息
      let arr = [];
      let ticket_orderData = localStorage.getItem(
        "xjxc_vue_wap_2019_3_7_ticket_orderData"
      );

      if (typeof ticket_orderData === "string") {
        arr = JSON.parse(ticket_orderData);
      }
      this.getOrderInfo(arr[0].merchantParkInfoId);
      let faceFlag = false;
      let isCheckIdcard = false;
      //默认都是实名制的票
      let idAllRealName = true;
      let codePriceArr = [];
      arr.forEach((item, index) => {
        //当详情页面是未登录状态没有获取会员价，但是下单页面登录后，用的是本地缓存的未使用会员价的数据导致页面展示的价格都是非会员价，需要重新请求会员价接口去获取会员价
        //获取会员价  isMemberPrice如果是会员价是true的时候，原价被保存在oldPriceSettle
        //查询会员价，但是要过滤掉item.isMemberPrice为true数据，为true的时候已经在详情页面获取了会员价，不需要重复查询
        //接口的code+':' + price(价格)的方式再次查询数据存在问题
        if (!item.isMemberPrice) {
          codePriceArr.push(
            item.modelCode +
              ":" +
              (item.isMemberPrice ? item.oldPriceSettle : item.priceSettle)
          );
        }

        console.log(codePriceArr);
        //实名制初始化
        if (arr[index].isRealName && arr[index].isRealName == "T") {
          arr[index].list = [];
          for (let i = 0; i < arr[index].num; i++) {
            let obj = {
              name: "",
              idNo: "",
              idcardType: "id"
            };
            if (this.$route.query.touristId && this.tgFlag && i == 0) {
              this.tgFlag = false;
              obj = {
                name: this.toGContractInfo.name,
                idNo: this.toGContractInfo.idNo,
                tel: this.toGContractInfo.phone,
                idcardType: "id"
              };
            }
            if (item.isRlsb == "T") {
              //是不是人脸识别票
              obj = Object.assign(obj, { faceUrl: "" });
            }
            arr[index].list.push(obj);
            console.log("arr", arr);
          }
        } else {
          idAllRealName = false;
          //非实名制人脸
          if (item.isRlsb === "T") {
            faceFlag = true;
            isCheckIdcard = true;
          }
        }
        //判断是否存在会员优惠门票
        if (item.isMemberPrice) {
          this.memberShow = true;
        }
      });

      //赋值
      this.isCheckIdcard = isCheckIdcard;
      this.isface = faceFlag;
      if (idAllRealName && this.mflag) {
        this.needRepalce = true;
        arr[0].showLinkerMobile = true;
        arr[0].list[0].tel = "";
      }
      if (codePriceArr.length) {
        //请求会员价
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
            arr.forEach((item, index) => {
              //判断item中isMemberPrice是否是true，是的话，详情页面已经登录并且获取了会员价，所以不需要次处理
              if (!item.isMemberPrice) {
                //isMemberPrice为false，详情页面登录了但是没有会员价后者未登录查询不到会员价
                if (merberPriceObj[item.modelCode] != item.priceSettle) {
                  //价格不相等，替换销售价
                  //不相等，会员价,将原有的产品销售价priceSettle替换成会员价，将原先的划线价替换成原先的销售价
                  item.isMemberPrice = true;
                  // it.memberPrice = priceObj[it.modelCode]
                  item.merchantLinePrice = item.priceSettle;
                  //老的销售价，方便后续开发用来计算优惠价格
                  item.oldPriceSettle = item.priceSettle;
                  item.priceSettle = merberPriceObj[item.modelCode];
                  //存在会员价
                  this.memberShow = true;
                }
              }
            });
            this.initPageData(arr);
          } else {
            //获取会员价接口报错
            this.initPageData(arr);
          }
        });
      } else {
        this.initPageData(arr);
      }
    }
  },
  destroyed() {
    // localStorage.removeItem("xjxc_vue_wap_2019_3_7_ticket_orderData");
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
        width: 100%;
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
