<template>
  <div class="ticket-detail"
       :class="{overflow:show}">
    <swiper v-if="imgUrls.length"
            auto
            loop
            :interval="2000"
            class="text-scroll"
            dots-position="center">
      <swiper-item class="text-scroll-item"
                   v-for="(imgUrl,index) in imgUrls"
                   :key="index">
        <img style="width:100%;"
             :src="imgUrl + '?imageMogr2/thumbnail/750x/strip/quality/100'"
             alt />
      </swiper-item>
    </swiper>
    <div class="ticket-n-intro" :class="{'n-b-l':memberShow}">
      <div class="ticket-l">
        <h3 class="ticket-name">{{detailData.nickName}}</h3>
        <h5 class="ticket-subtitle">{{detailData.subtitle}}</h5>
        <div class="ticket-price">
          <span class="unit">￥</span>
          <span class="price">{{detailData.priceShow}}</span>
          <span class="min-text">起</span>
        </div>
        <div @click="goNotice"
             class="order-t-n">预定须知</div>
      </div>
      <div class="ticket-r"
           @click="openMap(detailData.latitudeLongitude, detailData.addr)">
        <img class="ticket-r-img"
             src="http://statics.lotsmall.cn/wx/img/icon-location.png"
             alt />
      </div>
    </div>
    <!-- 优惠活动文案展示 -->
    <discount-activity class="activeity-bar" v-if='memberShow'></discount-activity>

    <div v-if="detailData.parkNotice"
         class="notcie">
      <div class="notice-title">
        <img class="notice-img"
             src="../../../assets/images/notice.png"
             alt />
        <span class="notice-text">公告</span>
      </div>
      <div ref="noticeWarper"
           class="notice-content notice-no-padding">
        <div ref="noticeContent"
             class="notice-info">{{detailData.parkNotice}}</div>
      </div>
    </div>

    <!--景区门票票型交互直接展示-->
    <div class="order-content-box">
      <div class="order-content">
        <!-- <div class="order-content-title">
          <span class="text">门票</span>
          <i @click="show=false" class="xx-icon icon-guanbi2"></i>
        </div>-->
        <!-- 日历选择 -->
        <group class="play-date">
          <slideCalendar ref="slideCalendar"
                         :slideDate="value2"
                         @selectCalendar="playDateChange"></slideCalendar>
        </group>

        <div class="select-ticket-title">
          <span class="select-ticket">可选票型</span>
          <span v-if="isSinglebuy=='2'"
                :class="{active:addNum>1}"
                class="select-ticket-notice">(一次只能预定一种票型)</span>
        </div>
        <div class="px-ul">
          <div v-for="(item,index) in itemData"
               :key="index"
               class="px-li-content">
            <div v-if="pxType=='secnicId'"
                 class="px-li-title">
              <div class="px-li-text">
                <i class="xx-icon icon-icon-ticket"></i>
                <span>{{item.labelValue}}</span>
              </div>
            </div>
            <div class="px-li-list"
                 v-for="(it,i) in item.ticketList"
                 :key="i">
              <div class="px-li">
                <div class="px-li-l">
                  <div class="px-name">{{ it.nickName }}</div>
                  <div class="px-price">
                    <span class="unit">￥</span>
                    <!-- <span v-if='it.isMemberPrice' class="price">{{it.memberPrice||it.memberPrice==0?it.memberPrice:'--'}}</span> -->
                    <span class="price">{{ it.priceSettle||it.priceSettle==0?it.priceSettle:"--" }}</span>
                    <span v-if='it.merchantLinePrice||it.merchantLinePrice==0'
                          class="last-price">{{it.merchantLinePrice}}</span>
                  </div>
                  <div class="tag-notice">
                      <span class='member-tag' v-if='it.isMemberPrice'>会员优惠</span>
                     <p class="reserve"
                     @click="showTicketNotice(it)">预定须知 <i class="xx-icon icon-iconfont-jiantou"></i></p>
                  </div>

                  <p class="promote-rule"
                     @click="showPromoteRule(it)"
                     v-if="openSingle==='T'&&it.hasOwnProperty('earning')">推广奖励: <i class="proto-money">{{it.earning}}元<i class="xx-icon icon-iconfont-jiantou"></i></i></p>
                </div>
                <div class="px-li-r-wrap">
                  <div class="px-li-r"
                       v-if="(((it.isFsyy=='T'&&activeIndexArr.indexOf(index+'-'+i)>-1)&&timeArr[index][i]&&!timeArr[index][i].length))||!(it.priceSettle||it.priceSettle==0)">
                    <div class="show-able-canelndar"
                         @click="showAbleDate(it)">查看可售日期</div>
                  </div>
                  <div v-else
                       class="px-li-r">
                    <numSpinner v-model="it.num"
                                :min="0"
                                :max="it.isRealName=='T'?99:9999"
                                :precision="0"
                                @on-change="changeNum(index,i)"></numSpinner>
                  </div>
                </div>
              </div>
              <div class="single-expand"
                   @click.stop="expandShow(0,it)"
                   v-if="openSingle==='T'&&it.hasOwnProperty('earning')">
                <span class="gold-coin">单票型推广</span>
                <i class="xx-icon icon-iconfont-jiantou"></i>
              </div>
              <div class="fsyy-error"
                   v-if="(it.isFsyy=='T'&&activeIndexArr.indexOf(index+'-'+i)>-1)&&(timeArr[index][i]&&!timeArr[index][i].length)">当前游玩日期没有可选时间段，换个日期试试</div>
              <template v-else>
                <!-- {{timeIndexArr}} -->
                <div v-if="timeArr[index][i]&&timeArr[index][i].length"
                     class="time-list">
                  <span class="time-item"
                        v-for="(timeItem,timeIndex) in timeArr[index][i]"
                        :key="timeIndex"
                        @click="settimeIndex(index,i,timeIndex,timeItem.num)"
                        :class="{active:timeIndexArr[index][i]==timeIndex,'no-num':!(timeItem.num&&timeItem.num>0)}">
                    {{timeItem.startTime}}-{{timeItem.endTime}}<br />
                    <span v-if="it.isDisplayFsyy === 'T'">余{{timeItem.num}}</span>
                  </span>
                </div>
              </template>
              <!-- </template> -->
            </div>
          </div>
        </div>
        <div class="ticket-tickets-list"
             v-if="tickets.length">
          <div class="ticket-tickets-title">组合套票</div>
          <div class="tickets-arr">
            <div class="tickets-content"
                 v-for="(item,inde) in tickets"
                 :key="inde"
                 :class="inde+1==tickets.length?'tickets-content-last':''">
              <div class="tickets-content-left">
                <div class="tickets-content-title">{{item.modelName}}</div>
                <div class="tickets-content-label">
                  <span v-for="(ite,ind) in item.modelLabel"
                        style="border-width:0.5px;"
                        :key="ind">{{ite}}</span>
                </div>
                <div class="tickets-content-detail"
                     @click='productDetail(item)'
                     :class="item.modelLabel.length<=1?'tickets-content-detail-inline':''">查看详情 ></div>
              </div>
              <div class="tickets-content-right">
                <div class="tickets-price">
                  <span>￥</span>{{item.salePrice}}
                </div>
                <div class="tickets-buy-btn"
                     @click='goTicketsBook(item)'>立即预定</div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="px-footer">
          <div class="num-price">
            <div class="select-num">
              <span>已选：</span>
              <span class="num">{{number}}</span>
            </div>
            <div class="price">
              <span class="text">总额：</span>
              <div class="price-info">
                <span class="price-unit">￥</span>
                <span class="price-num">{{totalPrice}}</span>
              </div>
            </div>
          </div>
          <div class="px-next f-b-btn" @click="goOrder" :class="{active:number&&totalPrice}">下一步</div>
        </div>-->
      </div>
    </div>
    <div class="ticket-detail-warpper m-b-10">
      <h2 class="ticket-w-title">景点详情</h2>
      <div class="ticket-detail-box">
        <div v-html="scenicDetail"></div>
      </div>
    </div>
    <div v-if="routeData.length"
         class="ticket-detail-warpper m-b-10">
      <h2 class="ticket-w-title">跟团游</h2>
      <div class="ticket-detail-box">
        <div class="route-ul">
          <div class="route-li"
               v-for="(item,index) in routeData"
               :key="index">
            <div class="li-l">
              <div class="li-l-title">{{item.name}}</div>
              <div @click="showRouteContent(item.content)"
                   class="li-detail">查看详情></div>
            </div>
            <button type="button"
                    @click="goBook(item)"
                    class="li-r-btn">预定</button>
          </div>
        </div>
      </div>
    </div>

    <div class="ticket-detail-warpper m-b-10">
      <h2 class="ticket-w-title">预定须知</h2>
      <div class="ticket-detail-box">
        <div v-html="orderDetail"></div>
      </div>
    </div>
    <!-- 评论列表 -->
    <comment :data="commentData"
             mold="park"
             :id="$route.query.id"
             :param="commentParam"
             :url="commentUrl"></comment>

    <div class="f-b bottom-warpper">
      <div class="num-price">
        <div class="select-num">
          <span>已选：</span>
          <span class="num">{{number}}</span>
        </div>
        <div class="price">
          <span class="text">总额：</span>
          <div class="price-info">
            <span class="price-unit">￥</span>
            <span class="price-num">{{totalPrice}}</span>
          </div>
        </div>
      </div>
      <div>
        <div class="detail-promoto"
             @click="expandShow(1)"
             v-if="qyTabFlag&&(openSingle=='T'||detailData.isBindQyyx=='T')">去赚钱</div>
        <button @click="order"
                type="button"
                class="order"
                :class="{active:number&&totalPrice}">立即预定</button>
      </div>
    </div>
    <div v-if="show1"
         class="time-mask"></div>
    <x-dialog v-model="noticeShow"
              class="dialog-demo">
      <div class="notice-body">
        <h2 class="notice-title">购票提醒</h2>
        <div class="notice-content"
             v-html="noticeStr"></div>
        <div class="footer">
          <span @click="noAgee"
                class="no-agree">不同意</span>
          <span @click="agree"
                class="agree">同意</span>
        </div>
      </div>
    </x-dialog>
    <!-- 门票预定须知 -->
    <x-dialog hide-on-blur
              v-model="modalNoticeFlag">
      <div class="notice-modal">
        <div class="title">
          <div class="text">{{modalNoticeTitle}}</div>
          <i @click="modalNoticeFlag=false"
             class="xx-icon icon-guanbi2"></i>
        </div>
        <div class="notice-book-content">
          <div v-html="modalNotice"></div>
        </div>
      </div>
    </x-dialog>
    <!-- 套票产品详情 -->
    <div v-show="ticketsDetailShow"
         class="order-detail-modal">
      <div class="order-detail-wrap">
        <div class="order-detail-close"><i class="xx-icon icon-cha1"
             @click="ticketsDetailShow=false"></i></div>
        <img v-show="currentProduct.linkMobileImg"
             :src="currentProduct.linkMobileImg"
             style="width: 100%;"
             alt="">
        <div class="order-detail-title">{{currentProduct.modelName}}</div>
        <div class="order-detail-content">
          <div class="order-detail-h1">费用明细</div>
          <ul>{{currentProduct.feeDetail}}
          </ul>
        </div>
      </div>
      <div class="order-detail-mask"
           @click="ticketsDetailShow=false"></div>
    </div>
    <!-- 套票预定须知 -->
    <x-dialog v-model="ticketsNoticeFlag"
              class="dialog-demo tickets-notice">
      <div class="notice-body">
        <h2 class="notice-title">预定提醒</h2>
        <div class="notice-content"
             v-html="currentProduct.bookRemind"></div>
        <div class="tickets-footer">
          <span @click="ticketsNoticeFlag=false"
                class="no-agree">不同意</span>
          <span @click="bookAgree"
                class="agree">同意</span>
        </div>
      </div>
    </x-dialog>
    <div v-if="shardFlag"
         @click="closeModal"
         class="shard-where">
      <img src="@/assets/images/weixin_sharetip.png"
           alt />
    </div>
    <x-dialog v-model="routeContentFlag"
              hide-on-blur
              class>
      <div class="route-content">
        <div class="route-warpper"
             v-html="routeContent"></div>
      </div>
    </x-dialog>
    <mutil-calendar ref="singeCalendar"
                    @getDate="getAbleDate"
                    :activeDate="playDate"></mutil-calendar>
    <!-- @open-promoto="bindPromoter=true" -->
    <copy-expand :param="expandedParam"
                 :show.sync="expandeTypeshow"
                 ref="expandType"
                 :nickName="promotoName"></copy-expand>
    <promote-rule :show.sync="promoteRuleShow"
                  :earnPrice="earnPrice"
                  :invitePrice="invitePrice"></promote-rule>
    <float-nav ref="flatNav"></float-nav>
  </div>
</template>
<script>
import { mapState } from "vuex";
import photo from "@/components/photo";
import floatNav from "@/components/floatNav";
import comment from "@/components/comment";
// import expanded from "../components/expanded";
import slideCalendar from "@/components/slideCalendar"; // 滑动日期组件
import mutilCalendar from "@/components/mutilCalendar"; // 单票日历组件
import { isWxAli } from "@/common/common";
import { linkBaseUrl } from "../../../../config/index";
// import { wxShare } from "@/common/wxshare";
import CopyExpand from "../components/copyExpand";
import PromoteRule from "../components/promoteRule";
import numSpinner from "../components/numSpinner";
import {
  Swiper,
  SwiperItem,
  Popup,
  DatetimeView,
  Group,
  Calendar,
  XDialog
} from "vux";
import { constants } from 'crypto';
import axios from "axios";
import { baseUrl } from "../../../../config/index";
import discountActivity from "./ticket/discountActivity/index"
// import { resolve } from 'dns';
export default {
  components: {
    discountActivity,
    numSpinner,
    floatNav,
    photo,
    Swiper,
    SwiperItem,
    Popup,
    DatetimeView,
    Group,
    Calendar,
    XDialog,
    comment,
    slideCalendar,
    mutilCalendar,
    CopyExpand,
    PromoteRule
  },
  computed: {
    ...mapState({
      pageNoScroll: state => {
        //   console.log(state)
        return state.pageNoScroll;
      }
    })
  },
  data () {
    return {
      memberShow:false,//是否展示会员优惠提示
      promoteRuleShow: false,
      earnPrice: 0,
      invitePrice: 0,
      expandeTypeshow: false,
      ticketName: '',  //景区名字
      promotoName: '',  //推广链接标题
      pxType: "",
      qyTabFlag: false, //是否展示全员开关
      routeContentFlag: false,
      routeContent: "", //跟团游信息
      routeData: [], //跟团游信息
      shardFlag: false, //分享wx
      modalNoticeFlag: false, //预订须知弹框
      modalNotice: "", //门票预定须知
      modalNoticeTitle: "", //弹框标题
      timeArr: [], //分时预约数组
      timeIndexArr: [],
      fsyuArr: [],
      indexArr: [],
      number: 0,
      addNum: 0,
      noticeStr: "",
      noticeShow: false,
      totalPrice: 0,
      isSinglebuy: 1,
      itemData: [],
      value2: this.getCurDate(),
      show1: false,
      show: false,
      wayType: this.$route.query.touristId ? 'G' : 1,
      playDate: "",
      detailData: {},
      commentData: {},
      imgUrls: [],
      scenicDetail: "",
      orderDetail: "",
      activeIndexArr: [], //缓存需要提示购票的下标index
      expandedParam: {
        businessId: this.$route.query.id,
        businessType: 0//0:单票行,1:景区推广
      },
      commentUrl: "",
      commentParam: {
        wayType: this.$route.query.touristId ? 'G' : 1,
        productType: "park",
        id: this.$route.query.id,
        leaguerId:
          localStorage.getItem("xjsc_login_userId_2019_3_8") ||
          this.$cookie.get("leaguerInfoId")
      },
      tickets: [], // 套票列表
      currentProduct: {},
      ticketsDetailShow: false, // 套票产品详情
      ticketsNoticeFlag: false, // 套票预定须知
      wxshareinfo: {
        title: '',
        desc: '',
        imgUrl: '',
        link: ''
      }, //详情页推广信息
      openSingle: 'F'
    };
  },
  watch: {
    // expandeTypeshow:function(newVal,oldVal){
    //   if(!newVal){
    //     this.$refs.expandType.close()
    //   }
    // }
  },
  created () {
    document.title = "景区详情";
    this.commentUrl = this.api.main.comment.list;
    let _this = this;
    this.playDate = this.getCurDate();
    let detailUrl = this.api.ticket.detail.main;
    let dParam = {
      wayType: this.wayType,
      merchantParkInfoId: this.$route.query.id
    };
    if (this.$route.query.isSpecial) {
      dParam = Object.assign(dParam, {
        isSpecial: this.$route.query.isSpecial
      });
    }
    this.getQyFlag()
    //产品详情
    let pd = this.getAxios(detailUrl, dParam);

    Promise.all([pd])
      .then(result => {
        // console.log(result);

        _this.detailData = result[0].data;
        this.ticketName = result[0].data.name
        //公告滚动
        this.$nextTick(() => {
          if (this.detailData.parkNotice) {
            let warpperWidth = parseFloat(
              window.getComputedStyle(this.$refs.noticeWarper).width
            );
            let width = parseFloat(
              window.getComputedStyle(this.$refs.noticeContent).width
            );
            let num = 0;
            if (width > warpperWidth - 40) {
              //滚动
              this.setIntervalTime = setInterval(() => {
                num = num - 1;
                if (num < -width) {
                  num = warpperWidth;
                }
                this.$refs.noticeContent.style.transform =
                  "translate(" + num + "px)";
              }, 50);
            }
          }
        });

        _this.imgUrls = result[0].data.merchantPictureLibVo.wapUrl
          ? result[0].data.merchantPictureLibVo.wapUrl.split(",")
          : [];
        let contentStr = result[0].data.content;
        // wxShare({
        //   title: result[0].data.nickName ? result[0].data.nickName : "",
        //   desc: _this.detailData.summary ? _this.detailData.summary : "",
        //   imgUrl: _this.imgUrls.length ? _this.imgUrls[0] : ""
        // });
        let wxshareinfo = {
          title: result[0].data.nickName ? result[0].data.nickName : "",
          desc: _this.detailData.summary ? _this.detailData.summary : "",
          imgUrl: _this.imgUrls.length ? _this.imgUrls[0] : '',
        };
        this.$refs.expandType.wxShare(wxshareinfo)
        _this.wxshareinfo = wxshareinfo
        contentStr = contentStr.replace(
          /<img [^>]*src=['"]([^'"]+)[^>]*>/gi,
          function (match, capture) {
            //capture,返回每个匹配的字符串
            var newStr =
              '<img src="' +
              capture +
              "?imageMogr2/thumbnail/750x/strip/quality/100" +
              '" alt="" />';
            return newStr;
          }
        );
        _this.scenicDetail = contentStr;
        _this.orderDetail = result[0].data.orderNotice.replace(
          /<img [^>]*src=['"]([^'"]+)[^>]*>/gi,
          function (match, capture) {
            //capture,返回每个匹配的字符串
            var newStr =
              '<img src="' +
              capture +
              "?imageMogr2/thumbnail/750x/strip/quality/100" +
              '" alt="" />';
            return newStr;
          }
        );
        // result[2].data.rows.forEach((item, index) => {
        //   result[2].data.rows[index].num = 0;
        // });
        // _this.itemData = result[2].data.rows;
        _this.isSinglebuy = result[0].data.orderType;
        result[1].data.forEach(item => {
          var reg = /^(.{1}).*(.{1})$/;
          if (item.isAnonymous == "T") {
            item.userName = item.userName
              ? item.userName.replace(reg, "$1***$2")
              : "";
          }
        });
      })
      .catch(error => { });

    this.getPxData();

    // 套票列表
    this.postAxios("/merchant/api/merchantFamilyInfo/listFamilyTicketByDetailShow", {
      id: this.$route.query.id,
      businessType: "park",
      merchantInfoId: this.$route.query.m_id,
      dateStr: this.playDate,
    }).then(res => {
      if (res.status == 200) {
        this.tickets = res.data;
        this.tickets.map(item => {
          item.modelLabel = JSON.parse(item.modelLabel);
        });
      }
    });

    //门票详情更团游信息
    this.getAxios(
      "/merchant/api/merchantRouteInfo/getRouteByMerchantParkInfoId",
      {
        merchantInfoId: this.$route.query.m_id,
        merchantParkInfoId: this.$route.query.id
      }
    ).then(res => {
      this.routeData = res.data;

    });
    //是否为单票型推广
    this.getSingleAxios().then(res => {
      if (res.status === 200) {
        this.openSingle = res.data.openSingle
      } else {
        this.openSingle = 'F'
      }
    }).catch(err => {
      this.openSingle = 'F'
    })
  },
  mounted () {
    // this.commentUrl = this.api.main.comment.list;

  },
  destroyed () {
    clearInterval(this.setIntervalTime);
  },
  methods: {
    productDetail (item) {
      this.currentProduct = item;
      this.currentProduct.linkMobileImg = item.carousalImg && item.carousalImg.length ? item.carousalImg[0] : '';
      this.ticketsDetailShow = true;
    },
    goTicketsBook (item) {
      this.currentProduct = item;
      if (item.ticketNotice == "T") {
        this.ticketsNoticeFlag = true;
      } else {
        this.bookAgree();
      }
    },
    bookAgree () {
      localStorage.setItem(
        "productDetal",
        JSON.stringify(this.currentProduct)
      );
      let params = {
          merchantFamilyInfoId: this.currentProduct.merchantFamilyInfoId,
          merchantFamilyTicketId: this.currentProduct.id,
          playDate: this.playDate,
          m_id: this.$route.query.m_id
      }
      if(this.$route.query.touristId){
          params = Object.assign(params, {touristId: this.$route.query.touristId})
      }
      this.$router.push({
        path: "/order/tickets",
        query: params
      });
    },
    closeModal () {
      this.shardFlag = false;
      this.show = false;
    },
    goBook (item) {
      window.location.href =
        linkBaseUrl +
        "/detail/route/" +
        item.id +
        "/" +
        item.code +
        "?m_id=" +
        this.$route.query.m_id;
    },
    showRouteContent (content) {
      this.routeContentFlag = true;
      this.routeContent = content;
    },
    showShard (flag) {
      this.shardFlag = flag;
      this.show = true;
    },
    showTicketNotice (item) {
      this.modalNotice = item.bookRemind;
      this.modalNoticeTitle = item.nickName || item.modelName;
      this.modalNoticeFlag = true;
    },
    settimeIndex (index, i, timeIndex, num) {
      if (num && num > 0) {
        this.$set(this.timeIndexArr[index], i, timeIndex);
      }
    },
    order () {
      // this.checkToken().then(res => {
      //   this.show = true;
      // });
      // this.show = true;
      this.goOrder();
    },
    goOrder () {
      let nArr = [];
      this.itemData.forEach((item, index) => {
        item.ticketList.forEach((it, i) => {
          if (it.num > 0) {
            nArr.push(
              Object.assign(
                it,
                it.isFsyy == "T"
                  ? this.timeArr[index][i] && this.timeArr[index][i].length
                    ? {
                      FsyyTimes: this.timeArr[index][i][
                        this.timeIndexArr[index][i]
                      ]
                    }
                    : {}
                  : {}
              )
            );
          }
        });
      });
      // console.log(nArr);
      if (nArr.length) {
        let routerQuery = this.$route.query
        localStorage.setItem(
          "xjxc_vue_wap_2019_3_7_ticket_orderData",
          JSON.stringify(nArr)
        );
        let env = isWxAli();
        let url, nextUrl;

        if (nArr.length === 1) {
          // 一票一码
          url =
            "/order/ticket?playDate=" +
            this.playDate +
            "&scenicId=" +
            this.detailData.id +
            "&ticketId=" +
            nArr[0].id +
            "&m_id=" +
            routerQuery.m_id;
        } else {
          // console.log("11");
          //阿里。微信
          url =
            "/order/ticket?playDate=" +
            this.playDate +
            "&m_id=" +
            routerQuery.m_id;
        }

        if (routerQuery.spread_code || routerQuery.promoteCode || routerQuery.code) {
          //如果有推广码
          url +=
            "&spread_code=" + routerQuery.spread_code ||
            routerQuery.promoteCode || routerQuery.code;
        }
        if (routerQuery.isSpecial) {
          url += "&isSpecial=" + routerQuery.isSpecial;
        }
        if(this.$route.query.touristId){
            url += "&touristId=" + this.$route.query.touristId;
        }

        nextUrl =
          document.location.protocol +
          "//" +
          window.location.host +
          "/vue" +
          url;
        this.checkToken(nextUrl).then(res => {
          //保证在登陆状态，详情页面跳转下单页面的时候缓存的下个页面地址被清除，防止换个店铺后token在过期状态下使用nextUrl进入别的地址
          localStorage.removeItem("xjsc_nextpath_2019_4_20");

          this.$router.push(url);
        });
      } else {
        // this.$vux.toast.text('请选择票型', 'middle')
      }
    },
    noAgee () {
      this.noticeShow = false;
      this.itemData[this.addActiveIndex].ticketList[this.addActiveI].num = 0;
      this.itemData[this.addActiveIndex].ticketList[
        this.addActiveI
      ].noticeShowFlag = true;
      this.getTotal();
    },
    agree () {
      this.noticeShow = false;
      //缓存激活的票型下标
      // console.log('activeIndexArr',this.activeIndexArr)

      this.realAdd();
    },
    //加减运算
    sub (index, i) {
      let item = this.itemData[index].ticketList[i];
      if (item.num > 0) {
        item.num--;
        if (item.num == 0) {
          //当减少到0的时候，分时预约列表不展示,重置对应的分时预约和激活下标
          // this.timeArr.splice(index, 1, []);
          // this.timeIndexArr.splice(index, 1, 0);
          // //最终要的一部，当num==0的时候，一定要去除activeIndexArr中的下标
          // this.activeIndexArr.splice(this.activeIndexArr.indexOf(index),1)
        }
        this.getTotal();
      }
    },
    realAdd () {
      if (
        this.activeIndexArr.indexOf(
          this.addActiveIndex + "-" + this.addActiveI
        ) < 0
      ) {
        this.activeIndexArr.push(this.addActiveIndex + "-" + this.addActiveI);
      }
      if (this.isSinglebuy == "2") {
        //单票新
        // let sttArr = [];

        if (
          this.indexArr.indexOf(this.addActiveIndex + "-" + this.addActiveI) < 0
        ) {
          this.indexArr.push(this.addActiveIndex + "-" + this.addActiveI);
          this.addNum++;
        }

        this.itemData.forEach((item, index) => {
          item.ticketList.forEach((it, i) => {
            let item = this.itemData[index].ticketList[i];
            if (this.addActiveIndex == index && this.addActiveI == i) {
              // item.num ++;
            } else {
              item.num = 0;
              item.noticeShowFlag = true;
            }
          });
        });
      } else {
        //多票型
        // this.itemData[this.addActiveIndex].ticketList[this.addActiveI].num++;
      }
      this.getTotal();
    },
    ifShowModel () {
      let item = this.itemData[this.addActiveIndex].ticketList[this.addActiveI];

      if (item.isShowTicketNotice == "T") {
        //// 购票是否提醒
        // console.log('show')
        //判断原先是够已经同意了提醒
        if (item.num == 0) {
          item.noticeShowFlag = true;
        }
        if (
          this.activeIndexArr.indexOf(
            this.addActiveIndex + "-" + this.addActiveI
          ) < 0
        ) {
          this.noticeStr = item.ticketNotice ? item.ticketNotice : "";
          this.noticeShow = true;
        } else {
          if (item.num > 0 && item.noticeShowFlag) {
            item.noticeShowFlag = false;
            this.noticeStr = item.ticketNotice ? item.ticketNotice : "";
            this.noticeShow = true;
          } else {
            this.realAdd();
          }
          this.realAdd();
        }
      } else {
        this.realAdd();
      }
    },
    add (index, i) {
      //缓存当前index
      this.addActiveIndex = index;
      this.addActiveI = i;
      if (this.itemData[index].ticketList[i].isFsyy == "T") {
        //是不是分时预约
        if (!this.timeArr[index][i]) {
          this.postAxios("/order/api/timeReserveList", {
            externalCode: this.itemData[index].ticketList[i].externalCode,
            startTime: this.playDate,
            endTime: this.playDate
          }).then(res => {
            this.timeArr[index].splice(i, 1, res.data);
            // console.log(this.timeArr);
            if (res.data.length) {
              this.ifShowModel();
            } else {
              // console.log(111);
              if (
                this.activeIndexArr.indexOf(
                  this.addActiveIndex + "-" + this.addActiveI
                ) < 0
              ) {
                this.activeIndexArr.push(
                  this.addActiveIndex + "-" + this.addActiveI
                );
              }
            }
          });
        } else {
          this.ifShowModel();
        }
      } else {
        this.ifShowModel();
      }

      // this.getTotal();
    },
    changeNum (index, i) {
      //缓存当前index
      this.addActiveIndex = index;
      this.addActiveI = i;
      if (this.itemData[index].ticketList[i].isFsyy == "T") {
        //是不是分时预约
        if (!this.timeArr[index][i]) {
          this.postAxios("/order/api/timeReserveList", {
            externalCode: this.itemData[index].ticketList[i].externalCode,
            startTime: this.playDate,
            endTime: this.playDate
          }).then(res => {
            if (!(res.data && res.data.length)) {
              this.itemData[index].ticketList[i].num = 0;
              this.itemData[index].ticketList[i].noticeShowFlag = false;
            } else {
              this.itemData[index].ticketList[i].noticeShowFlag = true;
            }
            this.timeArr[index].splice(i, 1, res.data);
            // console.log(this.timeArr);
            if (res.data.length) {
              this.ifShowModel();
            } else {
              if (
                this.activeIndexArr.indexOf(
                  this.addActiveIndex + "-" + this.addActiveI
                ) < 0
              ) {
                this.activeIndexArr.push(
                  this.addActiveIndex + "-" + this.addActiveI
                );
              }
            }
          });
        } else {
          this.ifShowModel();
        }
      } else {
        this.ifShowModel();
      }
    },
    //价格计算
    getTotal () {
      let _this = this,
        sum = 0;
      _this.number = 0;
      _this.itemData.forEach((item, index) => {
        item.ticketList.forEach((it, i) => {
          _this.number += it.num;
          sum += it.num * ((it.priceSettle ? it.priceSettle : 0) * 100);
        });
      });
      _this.totalPrice = (sum / 100).toFixed(2);
      return _this.totalPrice;
    },
    getPxData () {
      //获取当天的票型信息
      if (this.$route.query.parkProductCode) {
        this.pxType = "productCode";
        //根据产品码查询
        this.getAxios("merchant/api/merchantParkTicketByCode", {
          codes: this.$route.query.parkProductCode,
          playDate: this.playDate
        }).then(res => {
          let data = [
            {
              labelValue: "", //模拟景区查询结构
              ticketList: res.data
            }
          ];
          this.formatterPx({ data: data });
        });
      } else {
        //根据景点查询
        this.pxType = "secnicId";
        let itemUrl = this.api.ticket.detail.productItems;
        console.log(itemUrl)
        let pxParams = {
          wayType: this.wayType,
          merchantParkInfoId: this.$route.query.id,
          currPage: 1,
          pageSize: 999,
          playDate: this.playDate,
        };
        if (this.$route.query.isSpecial) {
          pxParams = Object.assign(pxParams, {
            isSpecial: this.$route.query.isSpecial
          });
        }
        this.getAxios(itemUrl, pxParams).then(res => {
          this.formatterPx(res);
        });
      }
    },
    // 查看可选日期
    showAbleDate (it) {
      this.$refs.singeCalendar.show({
        date: this.playDate,
        ticketId: it.id
      });
    },
    formatterPx (res) {
      let _this = this
      let timeArr = [];
      let timeIndexArr = [],
      modalCodes = {};
      let ticketData = res.data;
      ticketData.forEach((item, index) => {
        //初始化分时预约数组
        timeArr[index] = new Array(item.ticketList.length);
        //初始化分时预约激活下标数组
        timeIndexArr[index] = new Array(item.ticketList.length).fill(0);
        item.ticketList.forEach((it, i) => {
          //收集产品码
          modalCodes[it.modelCode] = it.priceSettle||it.priceSettle==0?it.priceSettle:''

          res.data[index].ticketList[i].num = 0;
        });
      });
      this.timeIndexArr = timeIndexArr;
      this.timeArr = timeArr;
    let code_price_arr = []
    Object.keys(modalCodes).forEach(key=>{
      let val = modalCodes[key]
      if(val||val===0){
          code_price_arr.push(key+':'+val)
      }
    })
    //每次点击日期重置
    _this.memberShow = false
    //通过产品码获取会员优惠价格
      axios.get((process.env.NODE_ENV === 'production' ? baseUrl : "https://testwww.lotsmall.cn") + "/leaguer/api/leaguer/pubs/product/discount?codePrice=" + code_price_arr.join(",")+'&merchantInfoId=' + localStorage.getItem('xjsc_vue_2018_12_19_mid')).then(res=>{
        if(res.status==200){
          let priceObj = {}
        if(res.message&&res.message.split(",").length){
          let priceArr = res.message.split(",")
          priceArr.forEach(item=>{
            let codePriceArr = item.split(":")
            priceObj[codePriceArr[0]] = codePriceArr[1]?Number(codePriceArr[1]):0
          })
        }
        //格式数据，并通过价格是否相等来判断是否是会员价
        ticketData.forEach(item=>{
          item.ticketList.forEach((it,i)=>{
            //isMemberPrice是否会员价
            if(it.priceSettle||it.priceSettle==0){
              //存在价格
              if(priceObj[it.modelCode]==it.priceSettle){
                //相等价格说明-非会员价
                it.isMemberPrice = false

              }else{
                //不相等，会员价,将原有的产品销售价priceSettle替换成会员价，将原先的划线价替换成原先的销售价
                it.isMemberPrice = true
                // it.memberPrice = priceObj[it.modelCode]
                it.merchantLinePrice = it.priceSettle
                //老的销售价，方便后续开发用来计算优惠价格
                it.oldPriceSettle = it.priceSettle

                it.priceSettle = priceObj[it.modelCode]
                //会员优享展示
                _this.memberShow = true
              }
            }else{
              //不存在销售价
              it.isMemberPrice = false
            }
          })
        })
        }

        this.itemData = ticketData;
        // console.log(ticketData)
      })
      // this.itemData = res.data;
      // console.log(this.itemData);
    },
    playDateChange (date) {
      // console.log(date);
      this.playDate = date;
      this.getPxData();
      this.addNum = 0;
      this.number = 0;
      this.totalPrice = 0;
    },
    getAbleDate (day) {
      this.playDate = day.date;
      // this.value2 = day.date
      this.$refs.slideCalendar.getSingeDate({ day });
      this.getPxData();
      this.addNum = 0;
      this.number = 0;
      this.totalPrice = 0;
    },
    goNotice () {
      this.$router.push({
        path: "/detail/ticketNotice",
        query: {
          merchantParkInfoId: this.$route.query.id,
          productType: "ticket"
        }
      });
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
    //打开地图
    openMap (latlnt, addr) {
      window.location.href =
        "//uri.amap.com/navigation?to=" +
        latlnt +
        "," +
        addr +
        "&mode=car&callnative=1";
    },
    showPromoteRule (item) {
      this.promoteRuleShow = true;
      this.earnPrice = item.earning ? item.earning : 0;
      this.invitePrice = item.recommend ? item.recommend : 0;
    },
    //单票型推广
    async expandShow (type, it) {
      let shareFlag = await this.$refs.flatNav.goQyyx()
      if (shareFlag) {
        let businessType = 0 //0:单票行,1:景区推广
        let params = {
          id: '',
          businessId: '',
          businessType: '',
          playDate: this.playDate
        }
        if (type === 0) {
          //单票型推广
          this.promotoName = it.nickName
          params.id = it.id
          params.businessId = it.parkTicketId
          params.businessType = 0
        } else if (type === 1) {
          this.promotoName = this.ticketName
          let detailData = this.detailData
          params.id = detailData.id
          params.businessId = detailData.parkInfoId
          params.businessType = 25
          //详情页推广
        }
        this.$refs.expandType.shareBox(params, type)
      }
      // this.postAxios('leaguer/api/promoter/checkUserPromoter').then(res => {
      //   if (res.status == 200 && !res.data.binded) {
      //     this.bindPromoter = true
      //   } else if (res.status == 200 && res.data.binded) {
      //     let businessType = 0 //0:单票行,1:景区推广
      //     let params = {
      //       id: '',
      //       businessId: '',
      //       businessType: '',
      //       playDate: this.playDate
      //     }
      //     if (type === 0) {
      //       //单票型推广
      //       this.promotoName = it.nickName
      //       params.id = it.id
      //       params.businessId = it.parkTicketId
      //       params.businessType = 0
      //     } else if (type === 1) {
      //       this.promotoName = this.ticketName
      //       let detailData = this.detailData
      //       params.id = detailData.id
      //       params.businessId = detailData.parkInfoId
      //       params.businessType = 25
      //       //详情页推广
      //     }
      //     this.$refs.expandType.shareBox(params, type)
      //   }
      // }).catch(err => {
      //   this.bindPromoter = false
      // })

    },
    getQyFlag () {
      this.getAxios("/merchant/api/merchantInfo/showQyTab", {
        leaguerInfoId: localStorage.getItem("xjsc_login_userId_2019_3_8") ||
          this.$cookie.get("leaguerInfoId") ||
          ""
      }).then(res => {
        this.qyTabFlag = res.message == "T";
      });
    }
  }
};
</script>
<style lang="scss">
@import "../../../assets/styles/mixin.scss";

.vux-popup-dialog {
  z-index: 601 !important;
}
.ticket-detail {
  padding-bottom: 49px;
  .notcie {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 15px;
    background: #fff;
    margin-bottom: 5px;
    .notice-title {
      white-space: nowrap;
      display: flex;
      align-items: center;
      padding-right: 16px;
      @include sc(14px, #f05b47);
      .notice-img {
        height: 14px;
        width: 14px;
        margin-right: 2px;
      }
    }
    .notice-content {
      flex: 1;
      overflow: hidden;
      @include sc(14px, #413838);
      &.notice-no-padding {
        padding: 0;
      }
      .notice-info {
        white-space: nowrap;
        display: inline-block;
      }
    }
  }
  .route-content {
    .route-warpper {
      max-height: 200px;
      word-break: break-all;
      text-align: left;
      overflow: auto;
      img {
        width: 100%;
      }
    }

    padding: 15px 15px;
  }
  .shard-where {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    img {
      width: 250px;
      height: 300px;
      position: absolute;
      top: 0;
      right: -22px;
    }
  }
  &.overflow {
    overflow: hidden;
    height: 100%;
    padding-bottom: 0;
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
      border-top: 1px solid #eeeee7;
      .no-agree {
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
  .px-ul {
    background: #fff;
    // padding: 15px 0;
    // padding-top: 0px;
    margin-bottom: 10px;
    padding-bottom: 5px;
    // height: 235px;
    // overflow: auto;
    .fsyy-error {
      margin-top: 5px;
      color: #f05b47;
      font-size: 14px;
      margin-left: 15px;
    }
    .time-list {
      margin-top: 5px;
      margin-left: 15px;
      .time-item {
        padding: 3px 5px;
        display: inline-block;
        margin-right: 5px;
        border: 1px solid #aaa;
        border-radius: 4px;
        font-size: 12px;
        color: #413838;
        margin-bottom: 5px;
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
    .px-li-content {
      // margin-bottom: 15px;
      .px-li-title {
        display: flex;
        align-items: center;
        height: 36px;
        padding: 5px 15px;
        // margin-bottom: 10px;
        border-bottom: 1px solid #eee;
        border-top: 1px solid #eee;
        // &:first-child{
        //   border-top: none;
        // }
        .icon-box {
          background: #19a0f0;
          margin-right: 5px;
          width: 18px;
          height: 18px;
          line-height: 18px;
          border-radius: 50%;
          text-align: center;
          .xx-icon {
            font-size: 12px;
            color: #fff;
          }
        }
        .px-li-text {
          display: flex;
          align-items: center;
          flex: 1;
          font-size: 18px;
          color: #413838;
          i.icon-icon-ticket {
            font-size: 0.25rem;
            display: inline-block;
            vertical-align: middle;
            // margin-left: 0.75rem;
            width: 0.55rem;
            height: 0.55rem;
            line-height: 0.55rem;
            /* display: block; */
            border-radius: 100%;
            background-color: #19a0f0;
            color: #fff;
            text-align: center;
          }
          span {
            display: inline-block;
            vertical-align: middle;
            margin-left: 0.05rem;
            width: 75%;
            word-break: break-all;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            /* ! autoprefixer: off */
            -webkit-box-orient: vertical;
            /* autoprefixer: on */
            overflow: hidden;
            margin-left: 5px;
          }
        }
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
    .px-li {
      @include fbc;
      padding: 10px 15px 0;
      // border-bottom: 1px solid #e1e1e1;
      .px-li-l {
        // margin-right: 15px;
        width: 200px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .px-name {
          @include sc(16px, #413838);
          @include oh(2);
          // line-height: 18px;
          // white-space: nowrap;
          // display: block;
        }
        .px-price {
          line-height: 32px;
          .unit {
            @include sc(12px, #f05b47);
          }
          .price {
            @include sc(18px, #f05b47);
          }
          .last-price {
            @include sc(12px, #999);
            text-decoration: line-through;
            margin-left: 5px;
          }
        }
        .tag-notice{
          display: flex;
          .member-tag{
            height: 16px;
            border: 1px solid #f2bcb7;
            padding: 0 2px;
            font-size: 10px;
            color: #e03826;
            border-radius: 2px;
            margin-right: 5px;
          }
          .reserve {
          line-height: 20px;
          @include sc(12px, #a0a0a0);
          .icon-iconfont-jiantou {
            font-size: 12px;
          }
        }
        }

        .promote-rule {
          @include sc(12px, #413838);
          line-height: 22px;
          margin: 4px 0;
          .proto-money {
            font-style: normal;
            color: #f05b47;
            .icon-iconfont-jiantou {
              font-size: 12px;
            }
          }
        }
      }
      .px-li-r-wrap {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }
      .px-li-r {
        @include fbc;
        .num {
          @include sc(18px, #413838);
          // margin-right: 15px;
          height: 29px;
          width: 44px;
          border: 1px solid #f05b47;
          text-align: center;
        }
        .show-able-canelndar {
          font-size: 12 px;
          height: 29px;
          line-height: 29px;
          display: inline-block;
          width: 90px;
          border: 1px solid #cacaca;
          text-align: center;
          color: #ababab;
          border-radius: 4px;
        }
        .border-left {
          border-left: none;
        }
      }
    }
    .px-li-list {
      position: relative;
      padding-bottom: 10px;
      &:after {
        position: absolute;
        box-sizing: border-box;
        content: " ";
        pointer-events: none;
        right: 0;
        bottom: 0;
        left: 15px;
        border-bottom: 1px solid #ebedf0;
        transform: scaleY(0.5);
      }
      &:last-child {
        &:after {
          border-bottom: none;
        }
      }
    }
    .single-expand {
      display: flex;
      justify-content: space-between;
      margin: 0 15px;
      padding-right: 15px;
      padding-left: 37px;
      margin-top: 10px;
      @include sc(14px, #413838);
      line-height: 40px;
      background: #f8f9fc url("../../../assets/images/gold_coin.png") 8px center
        no-repeat;
      background-size: 22px 22px;
      .icon-iconfont-jiantou {
        @include sc(12px, #a9aaaa);
        .show-btn {
          font-size: 12px;
          line-height: 31px;
          display: inline-block;
          width: 76px;
          text-align: center;
          border-radius: 2px;
          color: #ffffff;
          background-color: #f05b47;
        }
      }
    }
  }
  .order-pop.vux-popup-dialog {
    z-index: 501 !important;
  }
  .time-select {
    z-index: 601;
    background: #ffffff;
    .handle-box {
      padding: 10px;
      @include fbc;
      .cancel {
        @include sc(16px, #999);
      }
      .sure {
        @include sc(16px, #0ce476);
      }
      .handle-btn {
        padding: 3px 10px;
        border: none;
        background: #fff;
      }
    }
  }
  .time-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 600;
  }
  .order-content-box {
    padding-top: 0.125rem;
  }
  .order-content {
    // height: 464.5px;
    // padding-bottom: 50px;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    position: relative;
    .px-footer {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      background: #fff;
      @include fbc;
      // .num-price {
      //   margin-left: 15px;
      //   display: flex;
      //   flex-direction: column;
      //   justify-content: center;
      //   .select-num {
      //     @include sc(13px, #413838);
      //     height: 12px;
      //   }
      //   .price {
      //     @include sc(13px, #413838);
      //     .text {
      //     }
      //     .price-info {
      //       display: inline-block;
      //       .price-unit {
      //         @include sc(12px, #f05b47);
      //       }
      //       .price-num {
      //         @include sc(18px, #f05b47);
      //       }
      //     }
      //   }
      // }
      .px-next {
        width: 50%;
        background: #cbcbcb;
        &.active {
          background: #f05b47;
        }
      }
    }
    .select-ticket-title {
      @include sc(16px, #413838);
      height: 36px;
      line-height: 36px;
      padding-left: 15px;
      .select-ticket-notice {
        color: #999;
        font-size: 14px;
        padding-left: 5px;
        &.active {
          color: #f05b47;
        }
      }
    }
    .play-date {
      // padding: 1px 0;
      background: #fff;
      .weui-cells {
        margin-top: 0;
        .select-play-date {
          .weui-cell {
            .vux-label {
              @include sc(16px, #413838);
            }
            .vux-cell-value {
              @include sc(13px, #413838);
            }
            .weui-cell__ft::after {
              border-width: 1px 1px 0 0;
              border-color: #f05b47;
              height: 7px;
              width: 7px;
            }
          }
        }
      }
    }
    .time-info {
      @include fbc;
      background: #fff;
      height: 45px;
      padding-left: 15px;
      .text {
        @include sc(16px, #413838);
      }
      .time-select {
        padding-right: 15px;
        padding-left: 20px;
        height: 45px;
        line-height: 45px;
        .day {
          @include sc(13px, #413838);
        }
        .icon-iconfont-jiantou {
          @include sc(12px, #f05b47);
        }
      }
    }
    .order-content-title {
      @include fbc;
      height: 56px;
      padding-left: 15px;
      @include sc(18px, #413838);
      .icon-guanbi2 {
        @include sc(22px, #b2b2b2);
        padding: 5px 15px 5px 10px;
      }
    }
  }
  .bottom-warpper {
    @include fbc;
    height: 49px;
    background: #333333 !important;
    color: #ffffff !important;
    .home-page {
      padding: 0 15px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      .icon-shouye {
        font-size: 25px;
        height: 30px;
      }
    }
    .market-page {
      display: flex;
      border-left: 1px solid #d1d1d1;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      float: left;
      height: 49px;
      width: 60px;
      overflow: hidden;
      @include sc(14px, #ffa628);
      .market-icon {
        line-height: 18px;
        @include sc(22px, #ffa628);
        margin-bottom: -5px;
        margin-top: 5px;
      }
    }
    .order {
      border: none;
      outline: none;
      background: #f05b47;
      @include sc(16px, #fff);
      text-align: center;
      height: 49px;
      line-height: 49px;
      // width: 172px;
      width: 120px;
      opacity: 0.4;
    }
    .active {
      opacity: 1;
    }
    .detail-promoto {
      box-sizing: border-box;
      display: flex;
      border-left: 0.026667rem solid #d1d1d1;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      float: left;
      height: 49px;
      width: 68px;
      overflow: hidden;
      font-size: 12px;
      line-height: 23px;
      color: #ffa628;
      padding-top: 23px;
      background: url("../../../assets/images/gold_coin.png") 22px 5px no-repeat;
      background-size: 23px 23px;
    }
  }
  .ticket-detail-warpper {
    background: #fff;
    .ticket-w-title {
      @include sc(18px, #413838);
      font-weight: 600;
      padding: 20px 15px;
    }
    .ticket-detail-box {
      padding: 0px 15px 20px 15px;
      overflow: hidden;
      word-break: break-all;
      img {
        max-width: 100%;
        height: auto;
      }
      strong,
      b {
        font-weight: bold;
      }
      em,
      i {
        font-style: italic;
      }
      .route-ul {
        .route-li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          &:last-child {
            margin-bottom: 0;
          }
          .li-l {
            .li-l-title {
              font-size: 16px;
              color: #333;
              width: 250px;
              word-break: break-all;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              /* ! autoprefixer: off */
              -webkit-box-orient: vertical;
              /* autoprefixer: on */
              overflow: hidden;
            }
            .li-detail {
              color: #15bea1;
              font-size: 12px;
              margin-top: 8px;
            }
          }
          .li-r-btn {
            display: inline-block;
            text-align: center;
            height: 30px;
            line-height: 30px;
            font-size: 14px;
            width: 60px;
            border-radius: 3px;
            color: #fff;
            background-color: #f63;
            border: none;
          }
        }
      }
    }
    .comment-ul {
      .comment-li {
        margin-bottom: 20px;
        .user-info {
          @include fbc;
          .img-name {
            @include fbc;
            .logo-img {
              width: 20px;
              height: 20px;
              border-radius: 10px;
            }
            .name {
              @include sc(14px, #5c5c5c);
              margin-left: 12px;
            }
          }
          .comment-time {
            @include sc(12px, #999);
          }
        }
        .comment-content {
          margin-top: 8px;
          @include sc(14px, #413838);
        }
      }
    }
    .no-comment {
      @include sc(12px, #767676);
      text-align: center;
      padding: 82px 0;
      padding-top: 14px;
    }
  }
  .activeity-bar{
    margin-bottom: 10px;
  }
  .ticket-n-intro {
    @include fbc;
    height: 123.5px;
    background: #fff;
    margin-bottom: 10px;
    &.n-b-l{
      margin-bottom: 0;
    }
    .ticket-l {
      width: calc(100% - 61.5px);
      padding: 0 15px;
      .ticket-name {
        @include sc(18px, #413838);
        font-weight: 600;
        @include oh;
      }
      .ticket-subtitle {
        @include sc(12px, #5c5c5c);
        @include oh;
        margin-top: 5px;
      }
      .ticket-price {
        margin-top: 10px;
        .unit {
          @include sc(12px, #f05b47);
        }
        .price {
          @include sc(18px, #f05b47);
        }
        .min-text {
          @include sc(9px, #5c5c5c);
          margin-right: 3px;
        }

        .t-l-price {
          @include sc(12px, #5c5c5c);
          text-decoration: line-through;
        }
      }
      .order-t-n {
        @include sc(10px, #00699e);
      }
    }
    .ticket-r {
      display: flex;
      width: 61.5px;
      height: 100%;
      align-items: center;
      background: #fafafa;
      .ticket-r-img {
        height: 20px;
        width: 21.5px;
        margin: 0 auto;
      }
    }
  }
  .vux-slider {
    .vux-swiper {
      height: 220px !important;
      img {
        min-height: 220px;
      }
    }
    .vux-indicator {
      bottom: 2px;
      a {
        margin-left: 5.5px;
        i {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.4);
          &.active {
            background-color: #fff !important;
          }
        }
      }
    }
  }
  .num-price {
    margin-left: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .select-num {
      @include sc(13px, #fff);
      height: 12px;
    }
    .price {
      @include sc(13px, #fff);
      .text {
      }
      .price-info {
        display: inline-block;
        .price-unit {
          @include sc(12px, #fff);
        }
        .price-num {
          @include sc(16px, #fff);
        }
      }
    }
  }
  .ticket-tickets-list {
    margin-bottom: 10px;
    .ticket-tickets-title {
      line-height: 36px;
      font-size: 16px;
      padding: 0px 15px;
    }
    .tickets-arr {
      background-color: #fff;
      padding-top: 1px;
      .tickets-arr-title {
        font-weight: bold;
        line-height: 35px;
        padding-left: 10px;
        @include sc(14px, #413838);
        background-color: #f8f8f8;
        margin: 10px 10px 5px;
      }
      .tickets-content {
        @include fbc;
        border-bottom: 1px solid #e1e1e1;
        padding-right: 15px;
        margin-left: 15px;
        padding-bottom: 15px;
        align-items: center;
        .tickets-content-left {
          width: 239px;
          flex-grow: 1;
          margin-right: 30px;
        }
        .tickets-content-right {
          width: 76px;
          flex-grow: 1;
        }
        .tickets-content-title {
          font-weight: bold;
          line-height: 22px;
          padding-top: 16px;
          @include sc(14px, #413838);
          @include oh(2);
        }
        .tickets-content-label {
          span {
            display: inline-block;
            vertical-align: middle;
            border: 1px solid #ff9b7a;
            margin-right: 5px;
            @include sc(11px, #ff6633);
            padding: 4px 8px;
            margin-top: 4px;
            margin-bottom: 4px;
          }
        }
        .tickets-content-detail-inline {
          display: inline-block;
        }
        .tickets-content-detail {
          padding-top: 10px;
          @include sc(12px, #777777);
        }
        .tickets-price {
          text-align: center;
          font-size: 18px;
          margin-bottom: 8px;
          color: #ff6600;
          span {
            font-size: 10px;
          }
        }
        .tickets-buy-btn {
          line-height: 32px;
          text-align: center;
          color: #fff;
          background-color: #f05b47;
        }
      }
      .tickets-content-last {
        border-bottom: none;
      }
    }
  }
  .order-detail-modal {
    position: fixed;
    top: 0px;
    right: 0px;
    bottom: 0px;
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
        padding-left: 20px;
        line-height: 24px;
        li {
          padding-bottom: 5px;
          display: flex;
          align-items: flex-start;
          span {
            display: inline-block;
            vertical-align: middle;
            margin-left: 10px;
            margin-top: 10px;
            margin-right: 6px;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background-color: #413838;
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
  }
  .tickets-notice {
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
      .tickets-footer {
        height: 48px;
        @include fbc;
        .no-agree {
          border-top: 1px solid #eeeee7;
          color: #413838;
          font-size: 16px;
          height: 48px;
          line-height: 48px;
          text-align: center;
          width: 50%;
        }
        .agree {
          color: #fff;
          background: #f05b47;
          font-size: 16px;
          height: 48px;
          line-height: 48px;
          text-align: center;
          width: 50%;
        }
      }
    }
  }
}
</style>


