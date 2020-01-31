<template>
  <div class="pay-warp"
       v-if="show">
    <div>
      <div class="state-ul-box bg-w boxshadow"
           v-if="selfPlaceList.length&&!haveOrder">
        <div class="state-ul">
          <div class="state-li"
               :class="{active:currentindex=='0'}"
               @click="select('all',0)">
            <div class="state-title">快递</div>
          </div>
          <div class="state-li"
               :class="{active:currentindex=='1'}"
               @click="select('waitpay',1)">
            <div class="state-title">自提</div>
          </div>
        </div>
      </div>
      <swiper :height="swiperHeight+'px'"
              class="state-content"
              v-model="currentindex">
        <swiper-item v-if="sellerShow">
          <div class="item-ul">
            <div class="receiver-info boxshadow"
                 @click="goAddress">
              <div class="left">
                <i class="xx-icon icon-shouhuodizhi address-svg"></i>
                <div v-if="addressList.length"
                     class="default-receiver">
                  <!-- //有地址，如果没有默认地址取第一个 -->
                  <template v-if="hasDefault">
                    <!-- //如果有默认地址 -->
                    <div class="name-tel">
                      <div class="name">收货人：{{defaultAddress.linName}}</div>
                      <div class="tel">{{defaultAddress.likPhone}}</div>
                    </div>
                    <div class="address">地址：{{defaultAddress.areaName}}{{defaultAddress.addressDetail}}</div>
                  </template>
                  <template v-else>
                    <div class="name-tel">
                      <div class="name">收货人：{{addressList[0].linName}}</div>
                      <div class="tel">{{addressList[0].likPhone}}</div>
                    </div>
                    <div class="address">地址：{{addressList[0].areaName}}{{addressList[0].addressDetail}}</div>
                  </template>
                </div>
                <div v-else
                     class="no-address">点击新增收货地址</div>
              </div>
              <i class="xx-icon icon-iconfont-jiantou jiantou-svg"></i>
            </div>
            <!-- 订单商品 -->
            <div class="goods-list">
              <div v-for="(item,index) in msdeData"
                   :key="index"
                   class="goods-item boxshadow">
                <img class="goods-img fl"
                     :src="item.img"
                     alt>
                <div class="goods-info">
                  <div class="info-box">
                    <div class="goods-title two-line">{{item.name}}</div>
                    <div class="spec-ul">
                      <span v-for="(it,i) in item.specStrArr"
                            :key="i"
                            class="spec-li">{{it}}</span>
                    </div>
                  </div>
                  <div class="goods-price clearfix">
                    <div class="price fl">
                      <span class="unit">￥</span>
                      <span class="num">{{item.sellPrice}}</span>
                    </div>
                    <div class="buy-num fr">
                      <span class="x">x</span>
                      {{item.num}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="cash-volume"
                 @click="openCouponModal">
              <div class="cash-volume-item">
                <div>
                  <span class="text title">优惠券</span>
                  <span class="text"
                        style=" width:100%;color: #999999;"
                        v-if="!couponName">优惠券选择</span>
                  <span v-else
                        class="text"
                        style=" width:100%">{{couponName}}</span>
                </div>
                <i class="xx-icon icon-iconfont-jiantou coupons-icon"></i>
              </div>
              <div class="cash-volume-item">
                <div>
                  <span class="text title">优惠活动</span>
                  <span v-if="couponUserType=='F'"
                        style="color: #999999;font-size:28rpx">无门槛</span>
                  <span v-else>
                    <span style="color: #999999;"
                          class="text"
                          v-if="!couponUserNum">优惠活动信息</span>
                    <!-- <input style="display:inline-block;" placeholder-class='input-style'  disabled placeholder="优惠活动信息"> -->
                    <span style="color: #999999;"
                          class="text"
                          v-else>满 {{couponUserNum}} 元可用</span>
                  </span>
                </div>
              </div>
            </div>
            <!-- 订单总计 -->
            <div class="order">
              <div v-if="addressList.length"
                   class="clearfix item">
                <span class="fl">邮费</span>
                <div class="fr">
                  <span v-if="postage>0"
                        class="postage-text">{{'￥'+postage}}</span>
                  <span v-else
                        class="postage-text">免运费</span>
                </div>
              </div>
              <div class="clearfix item">
                <span class="fl">订单总计</span>
                <div class="fr">
                  <span class="unit">￥</span>
                  <span>{{totalMoney}}</span>
                </div>
              </div>
            </div>
          </div>
        </swiper-item>
        <swiper-item v-if="getterShow">
          <div class="item-ul">
            <!-- //自提地址 -->
            <div class="receiver-info boxshadow"
                 @click="goSelfPlace">
              <div class="left">
                <i class="xx-icon icon-shouhuodizhi address-svg"></i>
                <div v-if="selfPlaceData"
                     class="default-receiver">
                  <!-- //有地址，如果没有默认地址取第一个 -->
                  <!-- <template v-if="hasDefault"> -->
                  <!-- //如果有默认地址 -->
                  <div class="name-tel">
                    <div class="name">
                      <span class="text">提货人:</span>
                      {{selfPlaceData.getter?selfPlaceData.getter:'' }}
                    </div>
                    <div class="tel">{{selfPlaceData.geterTel?selfPlaceData.geterTel:''}}</div>
                  </div>
                  <div class="address">提货地址:{{selfPlaceData.selfPlace.areaAddr}}{{selfPlaceData.selfPlace.addr}}</div>
                </div>
                <div v-else
                     class="no-address">请选择商家提货地址</div>
              </div>
              <i class="xx-icon icon-iconfont-jiantou jiantou-svg"></i>
            </div>
            <!-- 订单商品 -->
            <div class="goods-list">
              <div v-for="(item,index) in msdeData"
                   :key="index"
                   class="goods-item boxshadow">
                <img class="goods-img fl"
                     :src="item.img"
                     alt>
                <div class="goods-info">
                  <div class="info-box">
                    <div class="goods-title two-line">{{item.name}}</div>
                    <div class="spec-ul">
                      <span v-for="(it,i) in item.specStrArr"
                            :key="i"
                            class="spec-li">{{it}}</span>
                    </div>
                  </div>
                  <div class="goods-price clearfix">
                    <div class="price fl">
                      <span class="unit">￥</span>
                      <span class="num">{{item.sellPrice}}</span>
                    </div>
                    <div class="buy-num fr">
                      <span class="x">x</span>
                      {{item.num}}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 优惠券 -->
            <div class="cash-volume"
                 @click="openCouponModal">
              <div class="cash-volume-item">
                <div>
                  <span class="text title">优惠券</span>
                  <span class="text"
                        style=" width:100%;color: #999999;"
                        v-if="!couponName">优惠券选择</span>
                  <span v-else
                        class="text"
                        style=" width:100%">{{couponName}}</span>
                </div>
                <i class="xx-icon icon-iconfont-jiantou coupons-icon"></i>
              </div>
              <div class="cash-volume-item">
                <div>
                  <span class="text title">优惠活动</span>
                  <span v-if="couponUserType=='F'"
                        style="color: #999999;font-size:28rpx">无门槛</span>
                  <span v-else>
                    <span style="color: #999999;"
                          class="text"
                          v-if="!couponUserNum">优惠活动信息</span>
                    <!-- <input style="display:inline-block;" placeholder-class='input-style'  disabled placeholder="优惠活动信息"> -->
                    <span style="color: #999999;"
                          class="text"
                          v-else>满 {{couponUserNum}} 元可用</span>
                  </span>
                </div>
              </div>
            </div>
            <!-- 订单总计 -->
            <div class="order">
              <div class="clearfix item">
                <span class="fl">订单总计</span>
                <div class="fr">
                  <span class="unit">￥</span>
                  <span>{{totalMoney}}</span>
                </div>
              </div>
            </div>
          </div>
        </swiper-item>
      </swiper>
      <div class="go-pay clearfix">
        <div class="left fl">
          <div class="pay-money clearfix">
            <div class="total-price fr">
              <span class="unit">￥</span>
              <span v-if="currentindex==0">{{realMoney}}</span>
              <span v-else>{{totalMoney}}</span>
            </div>
            <div class="text fr">合计:</div>
          </div>
        </div>
        <template v-if="submitShow">
          <div v-if="haveOrder"
               class="right">去支付</div>
          <div v-else
               @click="submit"
               class="right">提交订单</div>
        </template>
        <template v-else>
          <div v-if="haveOrder"
               class="right">去支付</div>
          <div v-else
               class="right">提交订单</div>
        </template>
      </div>
    </div>
    <div>
      <div v-html="formStr"></div>
    </div>
    <!-- 支付宝支付确认 -->
    <pay ref="pay"
         :totalprice="currentindex==0?realMoney:totalMoney"
         :isWxPay="isWxPay"
         @payClose='payClose'></pay>
    <!-- 优惠券 -->
    <coupon-list ref="couponList"
                 @nouse="undontuse"
                 @use="useCoupon"></coupon-list>
    <float-nav></float-nav>
  </div>
</template>

<script>
import { isWxAli } from "@/common/common";
import couponList from "./public/couponList";
import pay from "./public/pay";
import floatNav from "@/components/floatNav";
import {
  Swiper,
  SwiperItem,
  Popup,
  DatetimeView,
  Group,
  Calendar,
  XDialog
} from "vux";
export default {
  components: {
    floatNav,
    pay,
    Swiper,
    SwiperItem,
    couponList
  },
  data () {
    return {
      formStr: "", //支付表单提交
      isWxPay: false, //是否是微信支付
      show: false,
      submitShow: true, //用于防止用户反复提交问题
      couponName: "", //优惠券名称
      couponUserType: "", //优惠券  优惠活动
      couponUserNum: "", //优惠券使用门槛
      couponCode: "", //优惠券码
      couponCodeMoney: 0, //优惠券价格默认为0
      couponList: [], //优惠券列表
      canScroll: false, //弹层后页面是否滚动
      couponShow: false, //优惠卷
      selfPlaceData: null,
      sellerShow: true,
      getterShow: true,
      haveOrder: false, //页面是否已经生成订单了
      orderNo: null, //订单号
      payShow: false,
      msdeData: [],
      addressList: [],
      defaultAddress: null,
      hasDefault: false,
      activestate: "sellerSend",
      currentindex: 0,
      swiperHeight: null,
      selfPlaceList: [],
      selfAddress: null, //自提点地址
      mdsePrice: 0, //商品价格
      postage: 0, //邮费价格默认为0
      geter: "", //提货人
      geterTel: "", //提货人电话
      orderInfo: "", //订单信息
      type: "" //商家送货和买家自提类型
    };
  },
  computed: {
    totalMoney () {
      //商家配送价格-自提价格
      //总价  商品总价减去优惠价格
      let num = this.mdsePrice;
      if (num == 0) {
        return 0;
      } else {
        return num.toFixed(2);
      }
    },
    realMoney () {
      //商家配送价格
      //真实总价  商品减去优惠价格不能小于0加上邮费
      let num = this.mdsePrice + this.postage;
      if (num == 0) {
        return num.toFixed(2);
      } else {
        return num.toFixed(2);
      }
    }
  },
  created () {
    this.msdeData = JSON.parse(
      localStorage.getItem("xjsc_vue_mode_info_2019_3_22")
    );
    if (this.$route.query.from && this.$route.query.from == "selfPlace") {
      this.currentindex = 1;
    }
    // console.log(this.msdeData)
    //计算页面高度
    // console.log(window.screen.height)

    //获取商家自提地址
    if (!(this.$route.query.balance == "cart")) {
      //订单详情页面跳转过来
      //购物车过来都是买家配送的商品，自提的没有,也就是说 wx.getStorageSync("mdse2018_info_95")长度必定为1
      this.getAxios(this.api.shop.order.selfPlace, {
        mdseId: this.msdeData[0].modeId
      }).then(res => {
        // console.log(res);
        if (res.data.length) {
          this.swiperHeight = window.screen.height - 59;
          // console.log(this.swiperHeight);
        } else {
          this.swiperHeight = window.screen.height;
        }
        this.show = true;
        this.selfPlaceList = res.data;
        if (!this.selfPlaceList.length) {
          this.getterShow = false;
        }
      });
    } else {
      //购物车-结算-跳转过来的页面
      this.selfPlaceList = []; //控制tab-自提是否展示
      this.sellerShow = true;
      this.getterShow = false;
      this.swiperHeight = window.screen.height;
      this.show = true;
    }

    if (!this.haveOrder) {
      this.initData();
      // 获取自提点值
      let selfPlaceData = JSON.parse(
        localStorage.getItem("xjsc_vue_mdse_self_place_2019_3_25")
      );
      if (selfPlaceData) {
        //获取
        this.selfPlaceData = selfPlaceData;
        // localStorage.removeItem("xjsc_vue_mdse_self_place_2019_3_25");
      } else {
        this.selfPlaceData = null;
      }
    }
    // if (wx.getStorageSync("couponInfo")) {
    //   this.getPrice(wx.getStorageSync("couponInfo"));
    // }
  },
  methods: {
    payClose () {
      this.undontuse()
    },
    undontuse () {
      //不使用优惠券
      this.code = "";
      this.couponCode = "";
      this.couponCodeMoney = 0;
      this.couponUserType = "";
      this.couponName = "";
      this.couponUserNum = "";
      this.getPrice(0);
    },
    useCoupon (obj) {
      //使用优惠券
      // console.log(obj)
      this.couponCode = obj.productCode;
      this.code = obj.code;
      this.couponCodeMoney = obj.amount;
      this.couponUserType = obj.useThreshold;
      if (this.couponUserType == "T") {
        this.couponUserNum = obj.targetAmout;
      }
      this.couponName = obj.name;
      // this.closeCouponModal();
      this.getPrice(obj);
      // wx.setStorageSync("couponInfo", obj);
    },
    //优惠券弹框
    openCouponModal () {
      // this.$refs.coupontest.openCouponModal();
      //优惠券
      let arr = [],
        cartoArr = JSON.parse(
          localStorage.getItem("xjsc_vue_mode_info_2019_3_22")
        ),
        codeArr = [];
      cartoArr.forEach((item, index) => {
        codeArr.push(item.productCode);
      });
      codeArr = this.unique(codeArr);
      // console.log(codeArr);
      for (let i = 0; i < codeArr.length; i++) {
        let UseCouponsAllPrice = 0;
        for (let j = 0; j < cartoArr.length; j++) {
          if (codeArr[i] == cartoArr[j].productCode) {
            UseCouponsAllPrice += cartoArr[j].sellPrice * cartoArr[j].num;
          }
        }
        codeArr[i] = codeArr[i] + "-" + UseCouponsAllPrice;
      }
      //拿到请求参数codeArr，请求接口拿到优惠券列表
      this.getAxios(this.api.main.marketing.useCoupons, {
        userId: localStorage.getItem("xjsc_login_userId_2019_3_8"),
        moldCodes: codeArr.join(",")
      }).then(
        res => {
          // res.data.forEach(ele => {
          //   // ele.validStartDate = ele.validStartDate.substr(0, 10);
          //   // ele.validEndDate = ele.validEndDate.substr(0, 10);
          //   ele.amount = ele.amount >= 1 ? ele.amount.toFixed(2) : ele.amount;
          // });
          this.$refs.couponList.show(res.data);
        },
        res => {
          // console.log("zzzz");
          this.$refs.couponList.show([]);
        }
      );
    },
    //支付
    pay () {
      let _this = this;
      // this.flagShow = true;
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
        paySum: this.currentindex == 0 ? this.realMoney : this.totalMoney,
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
    submit () {
      let obj = {};
      if (this.code) {
        obj = {
          couponCode: this.code
        };
      }
      if (this.currentindex == 0) {
        //商家配送
        //提交订单
        if (!this.addressList.length) {
          this.$vux.toast.text("请新增收货地址", "middle");
          return false;
        }

        this.submitShow = false;
        // 商家配送，长度可能是1，2,3,4
        let modalArr = [],
          numArr = [];
        this.msdeData.forEach(item => {
          modalArr.push(item.modelCode);
          numArr.push(item.num);
        });
        let env = isWxAli();
        this.postAxios(
          this.api.order.saveOrder,
          Object.assign(
            {
              areaCode: this.hasDefault
                ? this.defaultAddress.areaCode
                : this.addressList[0].areaCode,
              modelCodes: modalArr.join(","),
              leaguerId: localStorage.getItem("xjsc_login_userId_2019_3_8"),
              buyerName: this.hasDefault
                ? this.defaultAddress.linName
                : this.addressList[0].linName,
              buyerMobile: this.hasDefault
                ? this.defaultAddress.likPhone
                : this.addressList[0].likPhone,
              buyerAddr: this.hasDefault
                ? this.defaultAddress.areaName +
                this.defaultAddress.addressDetail
                : this.addressList[0].areaName +
                this.addressList[0].addressDetail,
              amounts: numArr.join(","),
              wayType: 1, //0:网站 1:微信 2:wap,3.app,4管理员后台操作,5B2B,6OTA'
              orderType: "mdse",
              marketingType: 0,
              paySum: this.noCouponSum.toFixed(2)
            },
            obj
          )
        ).then(
          res => {
            //下单成功后，删除购物车中的
            this.submitShow = true;
            if (
              this.$route.query.balance &&
              this.$route.query.balance == "cart"
            ) {
              //如果是购物车跳转过来的页面，需要清除购物车
              let arr = [];
              this.msdeData.forEach((item, index) => {
                arr.push(item.mdseDetailId);
              });
              this.getAxios(this.api.main.cart.delete, {
                mdseDetailIds: arr.join(","),
                userID: localStorage.getItem("xjsc_login_userId_2019_3_8")
              }).then(res => {
                // console.log("购物车删除成功了!");
              });
            }
            if (res && res.data && res.data.payOrderNo) {
              // this.haveOrder =;
              // this.sellerShow = true;
              // this.getterShow = false;
              this.orderNo = res.data.payOrderNo;
              this.orderInfo = res.data.orderDescription;
              this.openModal()
            } else {
              this.$vux.toast.text(res.message, "middle");
            }
          },
          reject => {
            this.submitShow = true;
          }
        );
      } else {
        //买家自提
        if (!this.selfPlaceData) {
          this.$vux.toast.text("请选择提货点", "middle");
          return false;
        }
        this.submitShow = false;
        this.postAxios(
          this.api.order.saveOrder,
          Object.assign(
            {
              modelCodes: this.msdeData[0].modelCode,
              leaguerId: localStorage.getItem("xjsc_login_userId_2019_3_8"),
              buyerName: this.selfPlaceData.getter,
              buyerMobile: this.selfPlaceData.geterTel,
              buyerAddr:
                this.selfPlaceData.selfPlace.areaAddr +
                this.selfPlaceData.selfPlace.addr,
              amounts: this.msdeData[0].num,
              wayType: 1, //0:网站 1:微信 2:wap,3.app,4管理员后台操作,5B2B,6OTA'
              orderType: "mdse",
              marketingType: 0,
              paySum: this.noCouponSum.toFixed(2)
            },
            obj
          )
        ).then(res => {
          this.submitShow = true;
          // this.haveOrder = true;
          // this.sellerShow = false;
          // this.getterShow = true;
          if (res && res.data && res.data.payOrderNo) {
            this.orderNo = res.data.payOrderNo;
            this.orderInfo = res.data.orderDescription;
            this.openModal()
            // this.openPayModal(); //打开支付确认
          }
        });
      }
    },
    openModal () {
      let env = isWxAli()
      this.getAxios("/merchant/api/merchantPayType/getMerchantPayType", {
        businessType: env.isWx ? "WEIXIN" : env.isAliPay ? "ALI" : "WAP"
      }).then(res => {
        this.payType = JSON.parse(res.message)[0];
        //微信端获取openid
        if (env.isWx) {
          this.getAxios("/leaguer/api/userLeaguer/manage/leaguerInfo", {
            leaguerId: localStorage.getItem("xjsc_login_userId_2019_3_8")
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
    },
    select (state, index) {
      //生成订单后不能切换
      if (!this.haveOrder) {
        this.activestate = state;
        this.currentindex = index;
      }
    },
    getPrice (obj) {
      // console.log(obj);
      //订单总价
      let sum = 0;
      let noCouponSum = 0;
      this.mdsePrice = 0;
      if (obj == 0) {
        //不使用优惠券
        this.msdeData.forEach((item, index) => {
          //计算单个商品价格
          let mdseItemPrice = parseFloat(item.sellPrice) * parseFloat(item.num);
          // noCouponSum += mdseItemPrice;
          this.mdsePrice += mdseItemPrice;
        });
        this.noCouponSum = this.mdsePrice;
        return this.mdsePrice;
      } else {
        //使用优惠券
        switch (obj.applyType) {
          case "all":
          case "type":
            this.msdeData.forEach((item, index) => {
              let mdseItemPrice =
                parseFloat(item.sellPrice) * parseFloat(item.num);
              noCouponSum += mdseItemPrice;
            });
            this.mdsePrice =
              noCouponSum > obj.amount ? noCouponSum - obj.amount : 0;
            this.noCouponSum = noCouponSum;
            return this.mdsePrice;
            break;
          case "used":
            let dusetotalprice = 0,
              ucoupontotalp = 0,
              duseCouponprice;
            for (let i = 0; i < this.msdeData.length; i++) {
              dusetotalprice +=
                this.msdeData[i].sellPrice * this.msdeData[i].num;
              for (let j = 0; j < obj.productInfos.length; j++) {
                if (
                  this.msdeData[i].productCode ==
                  obj.productInfos[j].productCode
                ) {
                  ucoupontotalp +=
                    this.msdeData[i].sellPrice * this.msdeData[i].num;
                }
              }
            }
            duseCouponprice = dusetotalprice - ucoupontotalp;
            ucoupontotalp =
              ucoupontotalp > obj.amount ? ucoupontotalp - obj.amount : 0;
            this.mdsePrice = ucoupontotalp + duseCouponprice;
            this.noCouponSum = dusetotalprice;
            return this.mdsePrice;
            break;
        }
      }
    },
    initData () {
      //获取价格
      this.getPrice(0);
      //获取地址信息
      this.getAxios(this.api.main.address.list, {
        currPage: 1,
        pageSize: 100
      }).then(res => {
        this.addressList = res.data.rows;
        let defaultAddress = this.addressList.find((item, index) => {
          return item.defaultAddr == "T";
        });
        if (defaultAddress) {
          this.defaultAddress = defaultAddress;
          this.hasDefault = true;
          this.getPostage(defaultAddress.areaCode);
        } else {
          this.defaultAddress = null;
          this.hasDefault = false;
          if (this.addressList.length) {
            this.getPostage(this.addressList[0].areaCode);
          }
        }
      });
    },
    //邮费计算
    getPostage (areaCode) {
      // let mdseData = wx.getStorageSync("mdse2018_info_95");
      let arr = [];
      this.msdeData.forEach(item => {
        arr.push(item.modelCode + "-" + item.num);
      });
      this.getAxios(this.api.shop.order.getPostage, {
        modelCodes: arr.join(","),
        areaCode: areaCode
      }).then(res => {
        this.postage = parseFloat(res.data);
      });
    },
    goAddress () {
      if (!this.haveOrder) {
        this.go("/address/list");
      }
    },
    goSelfPlace () {
      this.go("/selfPlace?modeId=" + this.msdeData[0].modeId);
    },
    //数组元素去重
    unique (arr) {
      var newArr = [arr[0]];
      for (var i = 1; i < arr.length; i++) {
        if (newArr.indexOf(arr[i]) == -1 && arr[i] !== "") {
          newArr.push(arr[i]);
        }
      }
      return newArr;
    }
  }
};
</script>

<style lang="scss">
.pay-warp {
  // .mask {
  //   position: fixed;
  //   top: 0;
  //   left: 0;
  //   right: 0;
  //   bottom: 0;
  //   background: rgba(0, 0, 0, 0.3);
  //   z-index: 700;
  // }

  .info {
    height: 53.5px;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    color: #413838;
    font-size: 14px;
    font-family: PingFangSC-Regular, sans-serif;
    .info-title {
      padding-left: 16px;
      width: 75px;
    }
    .info-input {
      width: 253px;
      padding-right: 10px;
    }
    .address {
      width: 253px;
      padding-right: 10px;
      display: inline-block;
    }
    .input-style {
      color: #999999;
      z-index: 600;
    }
    .jiantou-svg {
      //   padding-left: 15px;
      color: #f05b47;
      font-size: 12px;
      font-weight: 700;
    }
  }
  .postage {
    justify-content: space-between;
  }
  .state-ul-box {
    padding: 0 22px;
    margin-top: 10px;
    background: #fff;
    .state-ul {
      display: flex;
      justify-content: space-around;
      .state-li {
        display: inline-block;
        text-align: center;
        width: 50%;
        background: #fff;
        color: #999;
        font-size: 14px;
        border-radius: 2px;
        position: relative;
        .state-title {
          height: 45px;
          line-height: 45px;
          text-align: center;
        }
      }
      .state-li.active {
        color: #f05b47;
      }
      .state-li.active::after {
        content: "";
        display: block;
        height: 2px;
        width: 100%;
        background: #f05b47;
        position: absolute;
        bottom: 0;
        border-radius: 1px;
      }
    }
  }
  .state-content {
    .item-ul {
      height: 100%;
      overflow-y: auto;
    }
  }
  .jiantou-svg {
    margin-right: 13px;
    color: #f05b47;
    font-size: 12px;
    font-weight: 700;
  }
  .receiver-info {
    background: #fff;
    margin: 10px 0;
    padding: 20px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      // width: 340px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      .address-svg {
        margin-left: 15px;
        margin-right: 9.5px;
        font-size: 20px;
        color: #413838;
        font-weight: 700;
      }
      .default-receiver {
        font-size: 13px;
        color: #413838;
        font-family: PingFangSC-Regular, sans-serif;
        width: 300px;
        white-space: normal;
        .name-tel {
          display: flex;
          justify-content: space-between;
          .name {
            width: 190px;
            .text {
              margin-right: 11px;
            }
            .name-text {
              // width: 155px;
            }
          }
          .tel {
          }
        }
        .address {
          margin-top: 8px;
          width: 100%;
          white-space: normal;
        }
      }
      .no-address {
        font-size: 16px;
        color: #413838;
        font-family: PingFangSC-Regular, sans-serif;
      }
    }
  }
  .goods-list {
    .goods-item {
      margin: 10px 0;
      height: 120px;
      background: #fff;
      padding-left: 15px;
      padding-right: 15px;
      .goods-img {
        padding-top: 20px;
        width: 80px;
        height: 80px;
      }
      .goods-info {
        padding-top: 18.5px;
        margin-left: 92px;

        .info-box {
          height: 62px;
          .goods-title {
            // height: 34px;
            font-size: 14px;
            color: #413838;
            font-family: PingFangSC-Regular, sans-serif;
          }
          .spec-ul {
            .spec-li {
              margin-right: 11px;
              font-size: 11px;
              color: #989898;
              font-family: PingFangSC-Regular, sans-serif;
            }
          }
        }
        .goods-price {
          .price {
            color: #fc4150;
            font-size: 18px;
            font-family: PingFangSC-Regular, sans-serif;
            .unit {
              font-size: 12px;
            }
            .num {
              margin-left: 3px;
            }
          }
          .buy-num {
            color: #999999;
            font-size: 15px;
            margin-top: 3px;
            font-family: PingFangSC-Regular, sans-serif;
            align-items: flex-end;
            .x {
              font-size: 12px;
              margin-right: 6px;
            }
          }
        }
      }
    }
  }
  .cash-volume {
    margin: 10px 0;
    padding-left: 15px;
    background: #fff;
    .cash-volume-item {
      border-bottom: 0.5px solid #eeeee7;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 13px;
      height: 56px;
      .wodeyouhuiquan-svg {
        font-size: 16px;
        color: #413838;
      }
      .text {
        font-size: 14px;
        color: #413838;
        font-family: PingFangSC-Regular, sans-serif;
        // margin-left: 10px;
      }
      .title {
        width: 77px;
        display: inline-block;
      }
      .coupons-icon {
        font-size: 12px;
        font-weight: 700;
        color: #f05b47;
      }
    }
    .cash-volume-item:last-child {
      border-bottom: none;
    }
  }
  .order {
    background: #fff;
    margin: 10px 0;
    padding: 20px 15px 20px 15px;
    font-size: 14px;
    font-family: PingFangSC-Regular, sans-serif;
    color: #413838;
    .item {
      margin-bottom: 10px;
      .fr {
        color: #999999;
        .unit {
          margin-right: 3px;
        }
      }
      .fr.postage {
        color: #413838;
      }
    }
    .item:last-child {
      margin-bottom: 0;
    }
  }
  .go-pay {
    position: fixed;
    height: 49px;
    left: 0;
    bottom: 0;
    width: 100%;
    background: #f05b47;
    .left {
      height: 100%;
      padding-left: 15px;
      padding-right: 11.5px;
      width: 177.5px;
      background: #fff;
      display: flex;
      align-items: center;
      .pay-money {
        // display: flex;
        // justify-content: space-between;
        // margin-top: 2px;
        width: 100%;
        .text {
          font-size: 13px;
          height: 24px;
          line-height: 26.5px;
          color: #413838;
          font-family: PingFangSC-Regular, sans-serif;
          margin-right: 10px;
        }
        .total-price {
          color: #fc4150;
          font-size: 18px;
          font-family: PingFangSC-Regular, sans-serif;
          font-weight: 500;
          .unit {
            margin-right: 2.5px;
            font-size: 12px;
          }
        }
      }
      .free {
        .free-text {
          color: #999999;
          font-size: 12px;
          font-family: PingFangSC-Regular, sans-serif;
        }
      }
    }
    .right {
      height: 100%;
      line-height: 49px;
      margin-left: 204px;
      color: #fff;
      font-size: 16px;
      font-family: PingFangSC-Regular, sans-serif;
      text-align: center;
    }
  }
}
</style>
