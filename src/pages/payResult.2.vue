<template>
  <div class="paymentSuccess">
    <!-- <navbar title='支付成功'></navbar> -->
    <div>
      <div class="pay-top">
        <div>
          <img src="http://statics.lotsmall.cn/wx/img/pay-success.png" alt class="img-pay">
        </div>
        <div class="pay-text">订单支付成功</div>
        <div class="pay-num">￥{{paySum}}</div>
        <div class="pay-message" v-if="deliveryType=='自提'">该订单为到店自提订单，到店后出示凭证即可提货</div>
      </div>
      <div v-if="needFaceUrl" class="face-url">
        <p>提前录入人脸，到景区可刷脸入园；进行人脸录入，请确保本人操作</p>
        <!-- <button>开始录入人脸</button> -->
        <abi-rlsb @returnDataURL="getUrl">
          <div class="face-btn" :class="{'bg-blue':needFaceUrl}" type="button">开始录入人脸</div>
        </abi-rlsb>
      </div>
      <div
        v-if="orderType=='park'"
        @click="lookcode"
        class="btn-look"
        :class="{'bg-blue':!needFaceUrl}"
      >
        <!-- <button class="btn-look" @click="lookcode">查看二维码</button> -->
        查看二维码
      </div>
      <div
        @click="goswitchTab('all')"
        class="btn-look"
        v-else-if="orderType=='mdse' || orderType =='hotel'||orderType =='eatery'||orderType =='route'"
      >
        <!-- <button class="btn-look" @click="goswitchTab('all')">查看订单</button> -->
        查看订单
      </div>
      <div v-if="listData.length>0" class="youhuiquan">
        <div class="pay-title">
          <div class="pay-title__line left-line"></div>
          <div class="pay-title__conetent">
            <img src="http://statics.lotsmall.cn/wx/img/yhq-bg.png" alt class="yhq-bg">
            <em>本次消费获得</em>
          </div>
          <div class="pay-title__line right-line"></div>
        </div>
        <div class="item-ul">
          <div
            class="item-li boxshadow"
            v-for="(item,index) in listData"
            :key="index"
            style="background: url('http://statics.lotsmall.cn/wx/img/coupons-bg.png') no-repeat;background-size: contain;"
          >
            <div class="item-top">
              <div class="item-top-title">{{item.name}}</div>
              <div class="item-p-get">
                <div class="p">
                  <span class="unit">￥</span>
                  <span class="amount">{{item.amount}}</span>
                </div>
                <button class="get-btn" @click="getCoupon(item.code)" type="button">立即领取</button>
              </div>
            </div>
            <div class="item-bottom">
              <div class="date">
                <span class="title">有效期：</span>
                <span
                  class="text"
                  v-if="item.validityDateType=='relative'"
                >领取后{{item.relativeDay}}天失效</span>
                <span v-else class="text">{{item.validStartDate}} 至 {{item.validEndDate}}</span>
              </div>
              <div class="use">
                <span class="title">使用条件：</span>
                <span v-if="item.useThreshold=='F'" class="text">无限制</span>
                <span v-else class="text">满{{item.targetAmout}}元可用</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="hot-sale">
        <div v-if="saleData.length>0 || imgList" class="pay-title">
          <div class="pay-title__line left-line"></div>
          <div class="pay-title__conetent">
            <!-- <img src="http://statics.lotsmall.cn/wx/img/yhq-bg.png" alt class="yhq-bg">
            -->
            <i class="xx-icon icon-aixin"></i>
            <em>你可能还喜欢</em>
          </div>
          <div class="pay-title__line right-line"></div>
        </div>
        <!-- 广告位 -->
        <div v-if="imgList" class="adcertising" @click="go(imgLink)">
          <img :src="imgList" alt class="adcertising-img">
        </div>
        <div v-if="saleData.length>0" class="scenic-list">
          <div
            v-for="(item,index) in saleData"
            :key="index"
            @click="goUrl('/detail/' + item.productType + '?id='+item.merchantProductId+'&productCode='+item.productCode+'&recommendFlag=T'+'&payOrderNo='+payOrderNo)"
            class="scenic-item shadow-bottom"
          >
            <img class="scenic-img" :src="item.linkMobileImg" alt>
            <div class="scenic-info">
              <div class="scenic-title">{{item.nickName}}</div>
              <div class="scenic-distance clearfix">
                <!-- <i class="xx-icon icon-shouhuodizhi distance-icon fl"></i> -->
                <span class="fl">{{item.areaAddr}}</span>
                <span class="hotel-star" v-if="orderType=='hotel'">{{item.productLevel}}A</span>
              </div>
              <div class="price-info">
                <div class="buy-num">{{item.virtualSale}} 人已购买</div>
                <div class="start-price">
                  <span class="unit">￥</span>
                  <span class="price">{{item.priceShow}}</span>
                  <span class="text">起</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--查看二维码弹框-->
      <!-- <div v-show='show' @click="closemodal" class="mask" :style="{top:navContentHeight+navBarHeight+'px'}"></div> -->
      <!-- <div v-show="show" @click="closemodal" class="mask"></div> -->
      <!-- <div class="swiper-container" :class="{block:show}" :animation="animationData">
        <swiper class="swiper" indicator-color='#f7f7f7' indicator-active-color='#fff' @change='currentChange' :autoplay="autoplay" :interval="interval" :duration="duration">
          <swiper-item v-if="ticketDetail.length" v-for="(item, index) in ticketDetail" :key="index">

            <div class="modal-content">
              <div class="code-modal">
                <div v-if="item.oneCode=='T'" class="order">
                  订单号: {{item.orderNo}}
                </div>
                <div v-if="item.codeUrl&&normal">
                  <img class="testcode" :src="'data:image/jpeg;base64,' + item.codeUrl" alt="">
                </div>
                <div v-else>
                  <span class="fail-qrcode">发码失败，请联系商家或直接申请退款</span>
                </div>
                <p v-if="item.extp.zybAssistCheckNo&&normal" class="fzm">辅助码：{{item.extp.zybAssistCheckNo}}</p>
                <div v-if="item.oneCode=='T'" class="name">{{item.nickName}}</div>
                <div class="clearfix date-num-info">
                  <div class="title-box fl">
                    <div v-if="item.orderType=='park'" class="text">游玩日期</div>
                    <div v-else-if="item.orderType=='hotel'" class="text">入住-离店</div>
                    <div class='text'>购买数量</div>
                  </div>
                  <div class="content fr">
                    <div v-if="item.orderType=='park'" class="date">{{item.startTime}}</div>
                    <div v-else-if="item.orderType=='hotel'" class="date">{{item.startTime}}-{{item.endTime}}</div>
                    <div class="num-state clearfix">
                      <span class="fl">{{item.amount}}张</span>
                      <span v-if="item.orderStatus=='3'" class="fr state">未使用</span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="item.oneCode=='T'" class="detail-look" @click="goUrl('pages/member/order/detail/main?orderno='+item.sid)">
                查看详情
              </div>
              <div v-else class="detail-look" @click="goswitchTab('all')">查看订单</div>
            </div>

          </swiper-item>

        </swiper>
        <div v-if="ticketDetail.length>1" class="dots-list">
          <div
            v-for="(item,index) in ticketDetail"
            :key="index"
            class="dots-item"
            :class="{ active: activeIndex==index }"
          ></div>
        </div>
      </div>-->
    </div>
    <x-dialog v-model="show" class="dialog-box">
      <swiper class="swiper" height="460px" :show-dots="false">
        <swiper-item v-if="ticketDetail.length" v-for="(item, index) in ticketDetail" :key="index">
          <div class="modal-content">
            <div class="code-modal">
              <div v-if="item.oneCode=='T'" class="order">订单号: {{item.orderNo}}</div>
              <div v-if="item.codeUrl&&normal">
                <img class="testcode" :src="'data:image/jpeg;base64,' + item.codeUrl" alt>
              </div>
              <div v-else>
                <span class="fail-qrcode">发码失败，请联系商家或直接申请退款</span>
              </div>
              <p
                v-if="item.extp.zybAssistCheckNo&&normal"
                class="fzm"
              >辅助码：{{item.extp.zybAssistCheckNo}}</p>
              <div v-if="item.oneCode=='T'" class="name">{{item.nickName}}</div>
              <div class="clearfix date-num-info">
                <div class="title-box fl">
                  <div v-if="item.orderType=='park'" class="text">游玩日期</div>
                  <div v-else-if="item.orderType=='hotel'" class="text">入住-离店</div>
                  <div class="text">购买数量</div>
                </div>
                <div class="content fr">
                  <div v-if="item.orderType=='park'" class="date">{{item.startTime}}</div>
                  <div
                    v-else-if="item.orderType=='hotel'"
                    class="date"
                  >{{item.startTime}}-{{item.endTime}}</div>
                  <div class="num-state clearfix">
                    <span class="fl">{{item.amount}}张</span>
                    <span v-if="item.orderStatus=='3'" class="fr state">未使用</span>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="item.oneCode=='T'"
              class="detail-look"
              @click="goUrl('/orderDetail?orderno=' + item.sid + '&m_id=' + m_id)"
            >查看详情</div>
            <div v-else class="detail-look" @click="goswitchTab('all')">查看订单</div>
          </div>
        </swiper-item>
      </swiper>
      <div v-if="ticketDetail.length>1" class="dots-list">
        <div
          v-for="(item,index) in ticketDetail"
          :key="index"
          class="dots-item"
          :class="{ active: activeIndex==index }"
        ></div>
      </div>
    </x-dialog>
  </div>
</template>

<script>
// import { getData, postData, merchantInfoId } from "@/common/common";
// import api from "@/api/api";
// import navbar from "@/components/navbar";
import { isWxAli } from "@/common/common";
import { XDialog, Swiper, SwiperItem } from "vux";
import abiRlsb from "@/components/abiRlsb";
export default {
  components: {
    // navbar
    XDialog,
    Swiper,
    SwiperItem,
    abiRlsb
  },
  data() {
    return {
      m_id: "", //店铺id
      needFaceUrl: false, //是否需要人脸识别
      paySum: "",
      deliveryType: "",
      imgList: "",
      imgLink: "",
      listData: [],
      saleData: [],
      ticketDetail: [],
      show: false,
      animationData: {},
      animation: null,
      autoplay: true,
      interval: 5000,
      duration: 1000,
      activeIndex: 0,
      indicatorDots: false,
      orderType: "",
      normal: true,
      oneCode: false,
      payOrderNo: ""
    };
  },
  methods: {
    goUrl(path) {
      this.$router.push(path);
    },
    go(path) {
      if (path) {
        window.location.href = path;
      }
    },
    //领取优惠券
    getCoupon(code) {
      getData(this.api.main.marketing.getCoupon, {
        userId: wx.getStorageSync("WxXjscUserInfo").leaguerId,
        couponCode: code,
        merchantInfoId: merchantInfoId
      }).then(res => {
        if (res.status == 200) {
          wx.showToast({
            title: "领取成功！",
            icon: "none",
            duration: 2000
          });
        } else {
          wx.showToast({
            title: res.message,
            icon: "none",
            duration: 2000
          });
        }
      });
    },
    //查看二维码
    lookcode() {
      let _this = this,
        resultUrl = this.api.order.detail,
        orderDurl = this.api.member.order.orderQueryByOrderId,
        url2QrCodeUrl = this.api.member.order.getQrCodeUrl;

      _this.show = true;
      // _this.animation
      //   .scale(1, 1)
      //   .opacity(1)
      //   .step();
      // _this.$nextTick(function() {
      //   _this.animationData = _this.animation.export();
      // });
      this.getAxios(resultUrl, {
        payOrderNo: this.payOrderNo
      }).then(res => {
        if (res.status == 200) {
          if (!_this.ticketDetail.length) {
            let dArr = [],
              lotSum = 0;
            res.data.orderDetailVoList.forEach((item, index) => {
              lotSum += item.amount;
              dArr.push(item.orderId);
            });
            this.getAxios(orderDurl, {
              orderId: dArr.join(",")
            }).then(resdd => {
              let cArr = [];
              resdd.data.forEach((item, index) => {
                res.data.orderDetailVoList[index].oneCode = item.oneCode;
                res.data.orderDetailVoList[index].extp = JSON.parse(
                  item.extendParam
                );
                res.data.orderDetailVoList[
                  index
                ].startTime = item.startTime.substr(0, 10);
                res.data.orderDetailVoList[index].endTime = item.endTime.substr(
                  0,
                  10
                );
                res.data.orderDetailVoList[index].sid = item.id;
                res.data.orderDetailVoList[index].nickName = item.nickName;
                res.data.orderDetailVoList[index].orderStatus =
                  item.orderStatus;
                //没有externalOrderNo说明是商城自建的订单
                if (!item.externalOrderNo) {
                  res.data.orderDetailVoList[index].sczj = "T";
                  cArr.push(
                    this.postAxios(url2QrCodeUrl, {
                      url: item.payOrderNo,
                      imgWidth: 0,
                      imgHeight: 0
                    })
                  );
                  Promise.all(cArr)
                    .then(resqr => {
                      _this.normal = true;
                      resqr.forEach((it, ind) => {
                        res.data.orderDetailVoList[index].codeUrl = it.message;
                      });
                      let nArr = [];
                      res.data.orderDetailVoList[0].amount = lotSum;
                      nArr.push(res.data.orderDetailVoList[0]);
                      _this.ticketDetail = nArr;
                      // res.data.orderDetailVoList[0].amount = lotSum;
                      // _this.ticketDetail = res.data.orderDetailVoList;
                    })
                    .catch(error => {
                      _this.normal = false;
                      // _this.ticketDetail = res.data.orderDetailVoList;
                      let nArr = [];
                      res.data.orderDetailVoList[0].amount = lotSum;
                      nArr.push(res.data.orderDetailVoList[0]);
                      _this.ticketDetail = nArr;
                    });
                } else {
                  //智游宝订单（智游宝订单分一票一码和多票一码，根据oneCode字段判断）
                  cArr.push(
                    this.postAxios(url2QrCodeUrl, {
                      url: item.externalOrderNo
                        ? item.checkNo
                          ? item.checkNo
                          : ""
                        : item.payOrderNo
                        ? item.payOrderNo
                        : "",
                      imgWidth: 0,
                      imgHeight: 0
                    })
                  );
                  Promise.all(cArr)
                    .then(resqr => {
                      _this.normal = true;
                      resqr.forEach((it, ind) => {
                        res.data.orderDetailVoList[index].codeUrl = it.message;
                      });
                      if (res.data.orderDetailVoList[index].oneCode == "T") {
                        //一票一码
                        _this.ticketDetail = res.data.orderDetailVoList;
                      } else {
                        //多票一码
                        let nArr = [];
                        res.data.orderDetailVoList[0].amount = lotSum;
                        nArr.push(res.data.orderDetailVoList[0]);
                        _this.ticketDetail = nArr;
                        // console.log(_this.ticketDetail);
                      }
                    })
                    .catch(error => {
                      _this.normal = false;
                      if (res.data.orderDetailVoList[index].oneCode == "T") {
                        _this.ticketDetail = res.data.orderDetailVoList;
                      } else {
                        let nArr = [];
                        res.data.orderDetailVoList[0].amount = lotSum;
                        nArr.push(res.data.orderDetailVoList[0]);
                        _this.ticketDetail = nArr;
                      }
                    });
                }
              });
            });
          }
        }
      });
    },
    goswitchTab(state) {
      this.$router.push({ path: "/orderList", query: { name: state } });
      localStorage.setItem("wxxjsc_orderstate_2019_9_18", state);

      //   wx.navigateTo({
      //     url: "/pages/member/order/main"
      //   });
    },
    getPageData() {
      let _this = this,
        resultUrl = this.api.order.detail,
        ruleUrl = this.api.main.marketing.findBuySendRule,
        adUrl = this.api.main.merchant.findPayPageAd,
        recommendUrl = this.api.main.order.getRecommendPark;
      this.getAxios(resultUrl, {
        payOrderNo: this.payOrderNo
      }).then(res => {
        if (res.status == 200) {
          this.m_id = res.data.accountId;
          let orderInfo = JSON.parse(res.data.orderInfoJson);
          _this.paySum = res.data.paySum;
          _this.deliveryType = res.data.deliveryType;
          _this.orderType = orderInfo[0].orderType;
          _this.needFaceUrl =
            res.data && res.data.needFaceUrl
              ? res.data.needFaceUrl == "T"
              : false;
          Promise.all([
            this.getAxios(ruleUrl, {
              code: orderInfo[0].code,
              modelType: orderInfo[0].orderType,
              buyCount: orderInfo[0].buyCount,
              payTime: res.data.payTime
            }),
            this.getAxios(adUrl, {}),
            this.getAxios(recommendUrl, {
              payOrderNo: this.payOrderNo,
              leagureId: res.data.buyerId
            })
          ]).then(result => {
            // console.log(result);
            _this.listData = result[0].data;
            _this.imgList =
              result[1].data && result[1].data.picAddr
                ? result[1].data.picAddr
                : "";
            _this.imgLink =
              result[1].data && result[1].data.picLink
                ? result[1].data.picLink
                : "";
            result[2].data.forEach((item, index) => {
              if (result[2].data[index].productType == "park") {
                result[2].data[index].productType = "scenic";
              }
            });
            _this.saleData = result[2].data;
          });
        }
      });
    }
  },
  created() {
    // console.log(11)
    if (
      this.$route.query.from &&
      this.$route.query.from == "zero" &&
      this.$route.query.payOrderNo
    ) {
      //零元支付
      this.payOrderNo = this.$route.query.payOrderNo;
      this.getPageData();
    } else {
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
      let env = isWxAli();
      let tagName = "trade_no";
      if (env.isWx) {
        //微信端
        tagName = "out_trade_no";
      } else if (env.isAliPay) {
        //阿里支付
        tagName = "trade_no";
      } else {
        //手机浏览器
        tagName = "trade_no";
      }
      let outTradeNo = xmlDoc.getElementsByTagName(tagName)[0].childNodes[0]
        .nodeValue;
      this.getAxios("/pay/api/leaguer/manage/getPayOrder", {
        outTradeNo: outTradeNo
      }).then(res => {
        this.payOrderData = res.data;
        this.payOrderNo = res.data.payOrderNo;
        this.getPageData();
      });
    }
  }
};
</script>


<style lang="scss">
.paymentSuccess {
  width: 100%;
  .dialog-box {
    .weui-dialog {
      background-color: transparent;
    }
    .modal-content {
      .code-modal {
        padding-top: 23px;
        border-radius: 2px;
        background: #fff;
        height: auto;
        width: 100%;
        text-align: center;
        .fail-qrcode {
          font-size: 16px;
          color: #fa6167;
        }
        .fzm {
          font-size: 16px;
          border: 1px solid #413838;
          height: 30px;
          line-height: 30px;
          margin: 5px auto;
          width: 66%;
        }
        .order {
          font-size: 12px;
          color: #413838;
          font-family: PingFangSC-Medium, sans-serif;
          margin-bottom: 15px;
        }
        .testcode {
          height: 189px;
          width: 189px;
          margin-bottom: 8px;
        }
        .name {
          font-size: 18px;
          color: #413838;
          font-family: PingFangSC-Medium, sans-serif;
          font-weight: 600px;
          margin-bottom: 12px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .date-num-info {
          padding: 0 20px;
          .title-box {
            color: #413838;
            font-size: 14px;
            font-family: PingFangSC-Medium, sans-serif;
            .text {
              margin-bottom: 16px;
            }
          }
          .content {
            font-size: 14px;
            font-family: PingFangSC-Medium, sans-serif;
            color: #999999;
            .date {
              margin-bottom: 16px;
            }
            .state {
              display: inline-block;
              height: 17.5px;
              line-height: 17.5px;
              background: #23d240;
              color: #fff;
              border-radius: 2px;
              padding: 0 5px;
              font-size: 12px;
              font-family: PingFangSC-Medium, sans-serif;
              margin-top: 2px;
            }
          }
        }
      }
      .detail-look {
        height: 44px;
        line-height: 44px;
        background: #009ded;
        color: #fff;
        margin-top: 20px;
        border-radius: 2px;
        text-align: center;
        font-size: 16px;
        font-family: PingFangSC-Medium, sans-serif;
      }
    }
  }
  .pay-title {
    // text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    .pay-title__line {
      position: relative;
      display: inline-block;
      height: 1px;
      background-color: #f05b47;
      width: 17px;
      // vertical-align: middle;
      &.left-line::after {
        content: "";
        display: block;
        height: 3px;
        width: 3px;
        position: absolute;
        border-radius: 50%;
        background-color: #f05b47;
        right: -2px;
        top: -1px;
      }
      &.right-line::before {
        content: "";
        display: block;
        height: 3px;
        width: 3px;
        position: absolute;
        border-radius: 50%;
        background-color: #f05b47;
        left: -2px;
        top: -1px;
      }
    }
    .pay-title__conetent {
      display: flex;
      margin: 0 7px;
      align-items: center;
      img {
        width: 17px;
        height: 14px;
      }
      i {
        font-size: 18px;
        color: #f05b47;
      }
      em {
        font-size: 14px;
        color: #f05b47;
        margin-left: 5px;
      }
    }
  }
  .face-url {
    width: 90%;
    margin-left: 5%;
    margin-top: 15px;
    p {
      font-size: 16px;
      color: #413838;
    }
    .face-btn {
      background-color: #fff;
      color: #413838;
      // margin: 20px auto;
      text-align: center;
      height: 49px;
      line-height: 49px;
      font-size: 16px;
      width: 100%;
      &.bg-blue {
        background-color: #009ded;
        color: #fff;
      }
    }
  }
  .pay-top {
    height: 208.5px;
    text-align: center;
    background-color: #fff;
    font-family: PingFangSC-Medium, sans-serif;
    .img-pay {
      width: 53px;
      height: 53px;
      margin: 30px auto;
    }
    .pay-text {
      font-size: 16px;
      color: #413838;
    }
    .pay-num {
      margin-top: 10px;
      font-size: 18px;
      color: #fc4150;
    }
    .pay-message {
      margin-top: 5px;
      font-size: 12px;
      color: #aeaeae;
    }
  }
  .btn-look {
    width: 90%;
    background-color: #fff;
    color: #413838;
    margin: 20px auto;
    text-align: center;
    height: 49px;
    line-height: 49px;
    font-size: 16px;
    // button::after {
    //   border: none;
    //   border-radius: 0;
    // }
    &.bg-blue {
      background-color: #009ded;
      color: #fff;
    }
  }
  .youhuiquan {
    width: 100%;
    margin-top: 20px;
    padding-top: 12px;
    color: #f05b47;
    background-color: #fff;

    .yhq-title {
      width: 70%;
      margin: 0 auto;
      text-align: center;
      .title-line {
        position: relative;
        width: 17px;
        height: 1px;
        background: #f05b47;
        vertical-align: middle;
        display: inline-block;
        &.icon-yuan-left::after {
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
        &.icon-yuan-right::before {
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

      .icon-yhq {
        width: 17px;
        height: 14px;
        margin-top: 5px;
        display: inline-block;
        .yhq-bg {
          width: 17px;
          height: 14px;
          vertical-align: middle;
        }
      }
      .yuq-text {
        width: 85px;
        font-size: 14px;
      }
    }
    .item-ul {
      padding: 15px 13.5px 20px 13.5px;
      .item-li {
        height: 139px;
        color: #fff;
        position: relative;
        .item-top {
          .item-top-title {
            font-size: 14px;
            padding-left: 10px;
          }
          .item-p-get {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-left: 40px;
            padding-right: 20px;
            .p {
              .unit {
                font-size: 14px;
              }
              .amount {
                font-size: 40px;
              }
            }
            .get-btn {
              outline: none;
              border: none;
              background: #fff;
              color: #f05b47;
              height: 25.5px;
              line-height: 25.5px;
              text-align: center;
              width: 66px;
              font-size: 14px;
              border-radius: 2px;
            }
          }
        }
        .item-bottom {
          position: absolute;
          left: 0;
          bottom: 5px;
          width: 100%;
          .date {
            margin-left: 10px;
            line-height: 10px;
            font-size: 9px;
            .title {
            }
            .text {
            }
          }
          .use {
            margin-left: 10px;
            margin-top: 5px;
            line-height: 10px;
            margin-bottom: 5px;
            font-size: 9px;
            .title {
            }
            .text {
            }
          }
        }
      }
    }
  }
  .hot-sale {
    width: 100%;
    margin-top: 20px;
    color: #f05b47;
    background-color: #fff;
    margin-bottom: 20px;
    padding-top: 12px;
    .yhq-title {
      width: 70%;
      margin: 0 auto;
      text-align: center;
      .icon-yuan-left {
        width: 17px;
        margin-right: 14px;
        margin-bottom: 5px;
        display: inline-block;
        .heng {
          width: 15px;
          height: 1px;
          background-color: #f05b47;
        }
        .dian {
          width: 2.5px;
          height: 2.5px;
          border-radius: 50%;
          background-color: #f05b47;
        }
      }
      .icon-yhq {
        width: 17px;
        height: 14px;
        margin-top: 5px;
        display: inline-block;
        .yhq-bg {
          width: 17px;
          height: 14px;
          vertical-align: middle;
        }
      }
      .yuq-text {
        width: 85px;
        font-size: 14px;
      }
      .icon-yuan-right {
        width: 17px;
        margin-left: 14px;
        margin-bottom: 5px;
        display: inline-block;
        .heng {
          width: 15px;
          height: 1px;
          background-color: #f05b47;
        }
        .dian {
          width: 2.5px;
          height: 2.5px;
          border-radius: 50%;
          background-color: #f05b47;
        }
      }
    }
    .scenic-list {
      text-indent: 2.5px;
      margin-top: 15px;
      .scenic-item {
        background: #fff;
        display: flex;
        justify-content: space-around;
        margin-bottom: 10px;
        .scenic-img {
          height: 100px;
          width: 156px;
        }
        .scenic-info {
          width: 195px;
          height: 79px;
          padding: 12px 12px 9px;
          .scenic-title {
            padding-right: 12px;
            color: #413838;
            font-family: PingFangSC-Medium, sans-serif;
            font-size: 16px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .scenic-distance {
            font-size: 10px;
            color: #f05b47;
            font-family: PingFangSC-Regular, sans-serif;
            padding-top: 5px;
            padding-bottom: 6px;
            .distance-icon {
              display: inline;
            }
            .hotel-star {
            }
          }
          .price-info {
            position: relative;
            .buy-num {
              color: #ababab;
              font-size: 10px;
              font-family: PingFangSC-Regular, sans-serif;
            }
            .start-price {
              position: absolute;
              color: #fc4150;
              right: 0;
              bottom: 0;
              .unit {
                font-size: 12px;
                font-family: PingFangSC-Semibold, sans-serif;
              }
              .price {
                font-size: 18px;
                font-family: PingFangSC-Semibold, sans-serif;
                padding-left: 6px;
                padding-right: 4px;
              }
              .text {
                font-size: 9px;
                color: #ababab;
                font-family: PingFangSC-Regular, sans-serif;
              }
            }
          }
        }
      }
    }
    .adcertising {
      width: calc(100% - 10px);
      height: 138px;
      padding: 5px;
      .adcertising-img {
        width: 359px;
        height: 138px;
      }
    }
  }

  .mask {
    position: fixed;
    // top: 69px !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    padding: 0 15px !important;
    padding-top: 50px !important;
    background: #d3d3d3 !important;
  }
  .swiper-container {
    width: 80%;
    height: 520px;
    opacity: 0;
    position: fixed;
    top: 50%;
    margin-top: -260px;
    z-index: 701;
    display: none;
    left: 50%;
    margin-left: -40%;
    .swiper {
      width: 100%;
      height: 520px;
      margin-top: 50px;
    }
    .dots-list {
      position: absolute;
      width: 100%;
      bottom: 9px;
      left: 0px;
      display: flex;
      justify-content: center;
      .dots-item {
        height: 5px;
        width: 5px;
        margin: 0 5px;
        border-radius: 50%;
        background: #fff;
        opacity: 0.5;
      }
      .dots-item.active {
        background: #fff;
        opacity: 1;
      }
    }
  }
  .block {
    display: block;
  }
}
</style>


