<template>
  <div
    class="pmshotel-detail"
    :class="{'overflow':detailModal}"
  >
    <four-month
      @getDate="gettime"
      ref="calendar"
    ></four-month>

    <!-- 图片轮播 -->
    <img-slide
      height="5.625rem"
      v-if="imgUrls.length"
      :imgList="imgUrls"
      :autoFlag="false"
    ></img-slide>

    <div class="ticket-n-intro" :class="{'n-m-b':memberShow}">
      <div class="hotel-top">
        <div class="hotel-left">
          <div class="ticket-name left-item">
            <span style="font-weight:bold;">{{detailData.name}}</span>
            <span style="color:#777777;font-size:12px;">{{detailData.hotelTypeStr}}</span>
          </div>
          <div class="ticket-subtitle left-item">
            <span style="margin-right:13px;">{{detailData.trimTime}}年装修 | {{detailData.hotelLevelStr}}</span>
            <span class="scenic-left">{{detailData.tag?detailData.tag[0].name:''}}</span>
            <!-- <span class="scenic-center">{{detailData.tag?detailData.tag[1].name:''}}</span> -->
          </div>
          <div
            v-if="detailData.facilitys&&detailData.facilitys.length"
            class="hotel-facility left-item"
          >
            <template v-for="(el,i) in detailData.facilitys">
              <span
                class="item-bar"
                style="margin-right:10px;"
                v-if="i<=2"
                :key="i"
              >
                <i
                  class="xx-icon icon-iconfont-chenggong"
                  style="color:#48BC95;font-size:10px;"
                ></i>
                <span style="color:#999999;font-size:12px;">{{el.name}}</span>
              </span>
            </template>
          </div>
        </div>
        <div
          class="hotel-right"
          @click="hotelModals"
        >
          <span>酒店详情</span>
          <i
            class="xx-icon icon-xiangyoujiantou"
            style="font-size:14px;color:#0086f6;"
          ></i>
        </div>
      </div>
      <div class="hotel-bottom clearfix">
        <div class="hotel-left fl">
          <div class="hotel-area">
            <span>{{detailData.areaName?detailData.areaName.split('-')[2]:''}}{{detailData.area}}</span>
          </div>
          <div
            v-if="rangShow"
            class="hotel-adress"
          >
            <i class="xx-icon icon-dingweiweizhi icon-adress"></i>
            <span>距您直线距离{{detailData.range}}千米</span>
          </div>
        </div>
        <div
          class="hotel-right fr"
          @click="amap(detailData.latitudeLongitude,detailData.area)"
        >
          <span>地图/导航</span>
          <i
            class="xx-icon icon-xiangyoujiantou"
            style="font-size:14px;color: #0086f6;"
          ></i>
        </div>
      </div>
    </div>
    
    <!-- 优惠活动文案展示 -->
    <discount-activity class="activeity-bar" v-if='memberShow'></discount-activity>
     

    <div class="hotelDetail-promoto"
             @click="expandShow()"
             v-if="qyTabFlag&&(openSingle=='T'||detailData.isBindQyyx=='T')">
             <img style="width:25px;height:25px;" src="./../../../assets/images/gold_coin.png" alt="">
             <div style="width:85%;">去赚钱</div>
             <i
            class="xx-icon icon-xiangyoujiantou"
            style="font-size:14px;color: #0086f6;"
          ></i>
             
             </div>
    <div
      class="hotelType-cotent"
      id="hotelType-cotent"
      :class="{'is_fixed' : isFixed}"
    >
      <div class="play-date">
        <div
          @click="showCalendar"
          class="hotel-date clearfix"
        >
          <div class="date-box">
            <span class="date-text">{{beginDate.split("-")[1]}}月{{beginDate.split("-")[2]}}日</span>
            <span class="date-label">{{startWeek}}入住</span>
          </div>
          <div class="date-day">{{DateDiff(beginDate,endDate)}} 晚</div>
          <div class="date-box">
            <span class="date-text">{{endDate.split("-")[1]}}月{{endDate.split("-")[2]}}日</span>
            <span class="date-label">{{endWeek}}离店</span>
          </div>
          <i
            class="xx-icon icon-xiangyoujiantou icon-day"
            style="font-size:14px;margin-right:5px;"
          ></i>
        </div>
      </div>
      <div class="hotelType-filter">
        <div class="hotelType-item">
          <span
            v-for="(item,index) in hotelType"
            @click="selectType(index)"
            :key="index"
            :class="{'type-item-selected':item.selected}"
            class="type-item"
          >{{ item.label }}</span>
        </div>
      </div>
    </div>
    <div
      class="hotelType-list m-b-10"
      :class="{'hotelType-padTop':isFixed}"
    >
      <template v-if="isSelect">
        <div
          class="houseType-slide"
          v-for="(ele,i) in itemData"
          :key="i"
        >
          <div class="houseType-slide-img">
            <img
              v-if="ele.typeImg"
              :src="ele.typeImg"
              alt
            />
            <div class="img-text">{{ele.pmsImgs.length}} 图</div>
          </div>
          <div
            class="houseType-detail-content"
            @click="showDetai(i)"
          >
            <div class="content-item">
              <span class="title">{{ele.name}} · {{ele.ruleBook.ifBreakfast=='0'?'无早':ele.ruleBook.ifBreakfast=='1'?'单早':ele.ruleBook.ifBreakfast=='2'?'双早':ele.ruleBook.ifBreakfast=='3'?'三早':''}}</span>
              <span class="detail">详情</span>
              <i class="xx-icon icon-xiangyoujiantou icon-detail"></i>
            </div>
            <div style="color:#999999;">
              <span>{{ele.acreage}}㎡</span>
              <span>{{ele.ifWindow=='0'?'有':ele.ifWindow=='1'?'无':ele.ifWindow=='2'?'落地':''}}窗</span>
              <span>{{ele.bedStr}}</span>
              <span >可住{{ele.number}}人</span>
            </div>
            <div>
              <span style="color:#1EC08A;" v-if="ele.ruleCancel.ifCancel=='F'">不可取消</span>
                  <span style="color:#1EC08A;" v-else-if="ele.ruleCancel.ifCancel=='T'&&ele.ruleCancel.cancelTimeRule=='F'">入住前，可免费取消</span>
                <span v-else style="color:#1EC08A;">{{ele.cancelRuleStr}}</span>
            </div>
            <div class="avg-price">
              <span class="txt">{{DateDiff(beginDate,endDate)==1?'单':'均'}}价</span>
              <span class="unit">￥</span>
              <span
                class
                style="color:#FF6600;font-size:18px;"
              >{{ele.productPrice}}</span>
              <span v-if="ele.linePrice||ele.linePrice==0" class="line-price">{{ele.linePrice}}</span>
            </div>
            <div class="member-tag-content" v-if="ele.isMemberPrice">
                <span class="member-tag">会员优惠</span>
            </div>
          </div>
          <div
            class="reserve-detail"
            @click="goOrder(i)"
             v-if="(detailData.screen=='F'&&detailData.enabled=='T')&&ele.stockNum > 0"
          >
            <div class="reserve-box">
              <div class="reserve-top">订</div>
              <div class="reserve-bottom">
                <span class="reserve-bottom-text">在线付</span>
              </div>
              <div
                    v-if="ele.stockNum<=5"
                    style="text-align:center;color: #fc4150;line-height:25px;"
                  >{{ele.stockNum == 0 ? '满房':ele.stockNum<=5?'仅剩'+ele.stockNum+'间':''}}</div>
            </div>
            
          </div>
          <div
            class="reserve-detail"
             v-else
          >
            <div class="reserve-box" style="background:#999999;">
              <div v-if="ele.stockNum>0" class="reserve-top" style="font-size:15px;">订</div>
              <div v-else class="reserve-top" style="font-size:15px;">满房</div>
              <div class="reserve-bottom">
                <span v-if="ele.stockNum>0" style="color:#999999;">已下架</span>
                <span v-else style="color:#999999;">在线付</span>
              </div>
              <div
                    v-if="ele.stockNum<=5"
                    style="text-align:center;color: #fc4150;line-height:25px;"
                  >{{ele.stockNum == 0 ? '满房':ele.stockNum<=5?'仅剩'+ele.stockNum+'间':''}}</div>
            </div>
            
          </div>
        </div>
      </template>
      <template v-else>
        <div
          class="houseType-item"
          v-for="(item,index) in itemData"
          :key="item.id"
        >
          <div class="houseType-item-box">

            <div
              class="houseType-item-cell"
              :class="{'border-bot-no':index==itemData.length-1||item.showContent}"
            >
              <div class="houseType-item-img">
                <img
                  v-if="item.typeImg"
                  :src="item.typeImg"
                  alt
                />
                <div class="img-text">{{item.pmsImgs?item.pmsImgs.length:'1'}} 图</div>
              </div>
              <div class="houseType-item-content">
                <div class="content-item">
                  <span class="title">{{item.name}}</span>
                  <!-- <span class="detail">详情</span>
                <i class="xx-icon icon-xiangyoujiantou icon-detail"></i>-->
                </div>
                <div
                  class="content-item"
                  style="color:#999999;"
                >
                  <span class="type-detail">{{item.acreage}}㎡</span>
                  <span class="type-detail">{{item.ifWindow=='0'?'有':item.ifWindow=='1'?'无':item.ifWindow=='2'?'落地':''}}窗</span>
                  <span class="type-detail">{{item.bedStr}}</span>
                  <span class="type-detail">可住{{item.number}}人</span>
                </div>
                <div class="content-item">
                  <span
                    class="avg-text"
                    v-if="DateDiff(beginDate,endDate)>1"
                  >均价</span>
                  <span class="unit">￥</span>
                  <span class="num">{{item.avgPrice}}</span>
                  <span class="start-text">起</span>
                </div>
              </div>
              <div
                class="houseType-item-icon"
                @click="detailShow(index)"
                :class="item.showContent?'icon-show-up':'icon-show-down'"
              >
                <i class="xx-icon icon-xiala1 icon-show"></i>
              </div>
            </div>
          </div>

          <div
            class="houseType-slide"
            :class="item.showContent?'animate':''"
            v-for="(ele,i) in item.hotelTypeProducts"
            :key="ele.productId"
            v-show="item.showContent"
          >
            <div
              class="houseType-slide-content"
              @click="showDetai(index,i)"
            >
              <div class="content-item">
                <span class="title"> {{ele.ruleBook.ifBreakfast=='0'?'无早':ele.ruleBook.ifBreakfast=='1'?'单早':ele.ruleBook.ifBreakfast=='2'?'双早':ele.ruleBook.ifBreakfast=='3'?'三早':''}} {{item.bedStrName}}</span>
                <span class="detail">详情</span>
                <i class="xx-icon icon-xiangyoujiantou icon-detail"></i>
              </div>
              <div >
                  <span style="color:#1EC08A;" v-if="ele.ruleCancel.ifCancel=='F'">不可取消</span>
                  <span style="color:#1EC08A;" v-else-if="ele.ruleCancel.ifCancel=='T'&&ele.ruleCancel.cancelTimeRule=='F'">入住前，可免费取消</span>
                <span v-else style="color:#1EC08A;">{{ele.cancelRuleStr}}</span>
              </div>
              <div class="avg-price">
                <span class="txt">{{DateDiff(beginDate,endDate)==1?'单':'均'}}价</span>
                <span class="unit">￥</span>
                <span
                  class
                  style="color:#FF6600;font-size:18px;"
                >{{ele.productPrice}}</span>
                <span class="line-price" v-if="ele.linePrice||ele.linePrice==0">{{ele.linePrice}}</span>
              </div>
              <div v-if="ele.isMemberPrice" class="member-tag-content">
                <span class="member-tag">会员优惠</span>
              </div>
            </div>
            <div
              class="reserve"
              @click="goOrder(index,i)"
              v-if="(detailData.screen=='F'&&detailData.enabled=='T')&&item.stockNum > 0"
            >
              <div class="reserve-box">
                <div class="reserve-top">订</div>
                <div class="reserve-bottom">
                  <span class="reserve-bottom-text">在线付</span>
                </div>
                <div
                    v-if="item.stockNum<=5"
                    style="text-align:center;color: #fc4150;line-height:25px;"
                  >{{item.stockNum == 0 ? '满房':item.stockNum<=5?'仅剩'+item.stockNum+'间':''}}</div>
              </div>
              
            </div>
            <div
              class="reserve"
              v-else
            >
              <div class="reserve-box" style="background:#999999">
                <div v-if="item.stockNum>0" class="reserve-top" style="font-size:15px;">订</div>
                <div v-else class="reserve-top" style="font-size:15px;">满房</div>
                <div class="reserve-bottom">
                  <span v-if="item.stockNum>0" style="color:#999999;">已下架</span>
                  <span v-else style="color:#999999;">在线付</span>
                </div>
                <div
                    v-if="item.stockNum<=5"
                    style="text-align:center;color: #fc4150;line-height:25px;"
                  >{{item.stockNum == 0 ? '满房':item.stockNum<=5?'仅剩'+item.stockNum+'间':''}}</div>
              </div>
              
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- 入住须知 -->
    <checkin-info :pageData="detailData"></checkin-info>

    <!-- 设施与服务 -->
    <info-bar title="设施与服务">
      <div
        slot="navigation"
        class="hotel-w-title fr"
        @click="hotelModals"
      >
        <span>酒店详情</span>
        <i
          class="xx-icon icon-xiangyoujiantou"
          style="font-size:14px;color: #0086f6;"
        ></i>
      </div>
      <div
        class="reserve-item-box"
        style="margin-top:30px;"
        v-if="detailData.facilitys&&detailData.facilitys.length"
      >
        <div
          class="reserve-text"
          v-if="i<=3&&el.icon!=''"
          v-for="(el,i) in detailData.facilitys"
          :key="i"
        >
          <!-- <i class="xx-icon icon-tupian1"></i> -->
          <img
            :src="el.icon"
            alt=""
          >
          <div>{{el.name}}</div>
        </div>
      </div>
      <div
        class="reserve-item-box"
        style="margin-top:40px;"
        v-if="detailData.services&&detailData.services.length"
      >
        <div
          class="reserve-text"
          v-if="i<=3&&el.icon!=''"
          v-for="(el,i) in detailData.services"
          :key="i"
        >
          <!-- <i class="xx-icon icon-tupian1"></i> -->
          <img
            :src="el.icon"
            alt=""
          >
          <div>{{el.name}}</div>
        </div>
      </div>
    </info-bar>

    <!-- 评论列表 -->
    <comment
      :data="commentData"
      mold="pmsHotel"
      :id="$route.query.id"
      :param="commentParam"
      :url="commentUrl"
    ></comment>

    <!-- 酒店详情 -->
    <hotel-detail
      :data="detailData"
      v-model="hotelModal"
      @close="hotelDetailClose"
    ></hotel-detail>

    <div
      v-if="show1"
      class="time-mask"
    ></div>
    <room-detail
      @preOrder="preOrder"
      v-model="detailModal"
      :checkInTime="beginDate"
      :data="roomDetailData"
      @close="hotelTypeClose"
    ></room-detail>
     <copy-expand :param="expandedParam"
                 :show.sync="expandeTypeshow"
                 ref="expandType"
                 :nickName="promotoName"></copy-expand>
    <float-nav ref="flatNav"></float-nav>
  </div>
</template>
<script>
import {
  Swiper,
  SwiperItem,
  Popup,
  Group,
  XDialog,
  Checker,
  CheckerItem
} from "vux";
import fourMonth from "@/components/fourMonthSelect";
import Calendar from "mpvue-calendar";
import "mpvue-calendar/src/browser-style.css";
import { isWxAli } from "@/common/common";
import floatNav from "@/components/floatNav";
import { wxShare } from "@/common/wxshare";
import comment from "@/components/comment";
import checkinInfo from "../components/checkinInfo";
import infoBar from "../components/infoBar";
// import roomDetail from "../components/roomDetail";
import roomDetail from "./pmsHotel/roomDetail";
import hotelDetail from "./pmsHotel/hotelDetail";
import imgSlide from "../components/imgSlide";
import CopyExpand from "../components/copyExpand";
import { join } from "path";
import axios from "axios";
import { baseUrl } from "../../../../config/index";
import discountActivity from "./ticket/discountActivity/index"
export default {
  components: {
    discountActivity,
    hotelDetail,
    imgSlide,
    roomDetail,
    infoBar,
    comment,
    fourMonth,
    floatNav,
    Swiper,
    SwiperItem,
    Popup,
    Group,
    Calendar,
    XDialog,
    Checker,
    CheckerItem,
    checkinInfo,
    CopyExpand
  },
  data() {
    return {
      memberShow:false,//是否存在会员价
        openSingle:'F',
        qyTabFlag:false,//是否展示全员开关
            expandeTypeshow: false,
            promotoName: '',  //推广链接标题
         expandedParam: {
        businessId: this.$route.query.id,
        businessType: 'pmsHotel'//推广
      },
      checkInTime: "",
      roomDetailData: {},
      pmsHotelLevelList: [],
      pmsHotelTypeList: [],
      isFixed: false,
      offsetTop: 387,
      hotelDetailShow: false,
      hotelServiceShow: false,
      commentData: {},
      commentParam: {
        wayType: 1,
        productType: "pmsHotel",
        id: this.$route.query.id,
        leaguerId:
          localStorage.getItem("xjsc_login_userId_2019_3_8") ||
          this.$cookie.get("leaguerInfoId")
      },
      commentUrl: "",
      showContent: false,
      showIndex: "",
      hotelType: [
        {
          value: "1,2,3",
          label: "含早",
          selected: false
        },
        {
          value: "1,2,3,6,10,12,13,14,15,16,17,18,19",
          label: "大床",
          selected: false
        },
        {
          value: "4,7,11",
          label: "双床",
          selected: false
        },
        {
          value: "T",
          label: "可取消",
          selected: false
        }
      ],
      hotelTypeList: ["5", "6"],
      currentIndex: 1,
      beginDate: this.GetDateStr(0),
      endDate: this.GetDateStr(1),
      startWeek: "今日",
      endWeek: "明日",
      calendarShow: false,
      begin: this.GetbDate(),
      indexArr: [],
      number: 0,
      addNum: 0,
      noticeStr: "",
      totalPrice: 0,
      itemData: [],
      value2: this.getCurDate(),
      show1: false,
      show: false,
      wayType: 1,
      playDate: "",
      detailData: {},
      commentData: {},
      imgUrls: [],
      scenicDetail: "",
      orderDetail: "",
      activeIndexArr: [], //缓存需要提示购票的下标index
      detailModal: false,
      hotelModal: false,
      isSelect: false,
      rangShow: false
    };
  },
  watch: {
    hotelDetailShow: {
      deep: true,
      handler: function(newV, oldV) {
        this.stopBodyScroll(newV);

        let _this = this;
        if (newV) {
          pushHistory();
        }

        window.addEventListener(
          "popstate",
          function(e) {
            // var btnArray = ['否', '是'];
            // mui.confirm('是否退出系统？', '提示', btnArray, function(e){

            if (e.index == 1) {
              window.android.outSystem();
            } else {
              // window.location.href = "/convert/pat/index.htm";
              _this.hotelDetailShow = false;
              _this.hotelModal = false;
            }
            // });
          },
          false
        );
        function pushHistory() {
          var state = {
            title: "title",
            url: "#"
          };
          window.history.pushState(state, "title", "#");
        }
      }
    },
    detailModal: {
      deep: true,
      handler: function(newV, oldV) {
        let _this = this;
        if (newV) {
          pushHistory();
        }

        window.addEventListener(
          "popstate",
          function(e) {
            // var btnArray = ['否', '是'];
            // mui.confirm('是否退出系统？', '提示', btnArray, function(e){

            if (e.index == 1) {
              window.android.outSystem();
            } else {
              // window.location.href = "/convert/pat/index.htm";
              // _this.hotelDetailShow=false
              _this.detailModal = false;
            }
            // });
          },
          false
        );
        function pushHistory() {
          var state = {
            title: "title",
            url: "#"
          };
          window.history.pushState(state, "title", "#");
        }
      }
    }
  },
  beforeCreate(){
       if(localStorage.getItem("selectBegin")){
        if(new Date(localStorage.getItem("selectBegin")).getTime()<new Date().getTime()){
            localStorage.removeItem("selectBegin")
            localStorage.removeItem("selectEnd")
        }
    }
  },
  created() {
    document.title = "云PMS酒店详情";
    this.commentUrl = this.api.main.comment.list;
    let _this = this;
    
    this.beginDate = localStorage.getItem("selectBegin")
      ? localStorage.getItem("selectBegin")
      : this.GetDateStr(0);
    this.endDate = localStorage.getItem("selectEnd")
      ? localStorage.getItem("selectEnd")
      : this.GetDateStr(1);
     this.getWeekName(this.beginDate, this.endDate)
    this.playDate = this.getCurDate();
    let detailUrl = "/merchant/api/merchantHotelInfo/merchantHotelInfo";
    this.getQyFlag()
    this.getAxios(
      "/pmsproduct/api/pmsHotel/listKeys?keys=" +
        "pmsHotelLevel,pmsHotelType,pmsHotelBedType"
    ).then(res => {
      // this.hotelTypeFacilityList = res.data;
      this.pmsHotelLevelList = res.data.pmsHotelLevel;
      this.pmsHotelTypeList = res.data.pmsHotelType;
      this.pmsHotelBedTypeList = res.data.pmsHotelBedType;
      this.getPxData();
      this.getPageData()
    });
    // //获取当天的票型信息
    
    function getPosition() {
      //判断浏览器是否支持HTML5 定位

      if (window.navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          successfulCallback,
          failCallback
        );
      } else {
        alert("你的浏览器不能使用HTML5定位");
      }
    }

    function successfulCallback(position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      _this.userItude = longitude + "," + latitude;
      _this.rangShow = true;
      _this.getPageData();
    }

    function failCallback(error) {
      _this.rangShow = false;
      var text;

      switch (error.code) {
        case error.PERMISSION_DENIED:
          text = "用户拒绝对获取地理位置的请求。";

          break;
        case error.POSITION_UNAVAILABLE:
          text = "位置信息是不可用的。";

          break;

        case error.TIMEOUT:
          text = "请求用户地理位置超时。";

          break;

        case error.UNKNOWN_ERROR:
          text = "未知错误。";

          break;
      }
      _this.getPageData();
    }
    getPosition();
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
  computed: {
    total() {
      let sum = 0.0;
      this.number = 0;
      this.itemData.forEach((item, index) => {
        item.hotelTypeProducts.forEach((el, i) => {
          sum = sum + el.num * el.productPrice;
          this.number += el.num;
        });
      });
      return sum.toFixed(2);
    }
  },
  mounted() {
    // this.$refs.calendar.show();
    // this.commentUrl = this.api.main.comment.list;

    window.addEventListener("scroll", this.initHeight);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    hotelModals() {
      this.hotelModal = true;
      this.hotelDetailShow = true;
    },
    preOrder() {
      this.goOrder(this.activeIndex, this.activei);
      this.hotelDetailShow = false;
    },
    getPageData() {
      this.getAxios("/merchant/api/pmsMerchantHotelInfo/getHotelInfoDetail", {
        merchantHotelId: this.$route.query.id,
        userItude: this.userItude ? this.userItude : ""
      }).then(res => {
        this.imgUrls =
          res.data.pmsImgs && res.data.pmsImgs.length ? res.data.pmsImgs : [];
        this.scenicDetail = res.data.summary ? res.data.summary : "";
        res.data.checkInJson = JSON.parse(res.data.checkInJson);
        res.data.tag = JSON.parse(res.data.tag);

        let item = this.pmsHotelLevelList.find((it, i) => {
          return it.key == res.data.hotelLevel;
        });
        res.data.hotelLevelStr = item.value;

        let ele = this.pmsHotelTypeList.find((it, i) => {
          return it.key == res.data.hotelType;
        });
        res.data.hotelTypeStr = ele.value;

        this.detailData = res.data;
        wxShare({
          title: res.data.name ? res.data.name : "",
          desc: res.data.summary ? res.data.summary : "",
          imgUrl: this.imgUrls.length ? this.imgUrls[0].imgUrl : ""
        });
        this.$nextTick(() => {
          this.offsetTop = document.querySelector(
            "#hotelType-cotent"
          ).offsetTop;
        });
      });
    },
    hotelDetailClose() {
      this.hotelDetailShow = false;
      setTimeout(() => {
        window.scrollTo({
          top: this.offsetTop,
          behavior: "smooth"
        });
      }, 100);
    },
    hotelTypeClose() {
      this.hotelDetailShow = false;
      window.history.back();
    },
    showDetai(index, i) {
      this.activeIndex = index;
      this.activei = i;
      let item = this.isSelect
        ? this.itemData[index]
        : this.itemData[index].hotelTypeProducts[i];
      this.getAxios("/merchant/api/pmsMerchantHotelType/getTypeProduct", {
        typeProductId: item.productId,
        startDate: this.beginDate,
        endDate: this.endDate
      }).then(res => {
        let data = res.data;
        let bedItem = this.pmsHotelBedTypeList.find(
          it => it.key == data.bedType
        );
        if (bedItem.value) {
          if (bedItem.value.indexOf("-") == -1) {
            data.bedStr = bedItem.value;
          } else {
            data.bedStr = bedItem.value.split("-")[1];
          }
        }
        data.bedStr2 = bedItem.value ? bedItem.value : "";
        data.enabled=this.detailData.enabled
        data.screen=this.detailData.screen
        this.roomDetailData = data;
        this.$nextTick(() => {
          this.detailModal = true;
          //   this.hotelDetailShow = true;
        });
      });
    },
    initHeight() {
      var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      this.isFixed = scrollTop > this.offsetTop ? true : false;
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
    detailShow(i) {
      this.showIndex = i;
      this.itemData[i].showContent = !this.itemData[i].showContent;
      //   this.showContent = !this.showContent;
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
    selectType(index) {
      this.hotelType[index].selected = !this.hotelType[index].selected;
      if ((index == 1 || index == 2) && this.hotelType[index].selected) {
        if (index == 1) {
          this.hotelType[2].selected = false;
        }
        if (index == 2) {
          this.hotelType[1].selected = false;
        }
      }
      this.getPxData();
    },
    gettime(startDate, endDate) {
        window.localStorage.setItem("selectBegin", startDate);
      window.localStorage.setItem("selectEnd", endDate);
      this.getWeekName(startDate, endDate)
      this.beginDate = startDate;
      this.endDate = endDate;
      this.getPxData();
    },
    //什么日子入住
     getWeekName(startDate, endDate) {
      this.startWeek =
        this.GetWeekStr(startDate) == ""
          ? this.getWeek(startDate)
          : this.GetWeekStr(startDate);
      this.endWeek =
        this.GetWeekStr(endDate) == ""
          ? this.getWeek(endDate)
          : this.GetWeekStr(endDate);
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
    indexChange(currentIndex) {
      this.currentIndex = currentIndex + 1;
    },
    amap(lat, addr) {
      window.location.href =
        "//uri.amap.com/navigation?to=" +
        lat +
        "," +
        addr +
        "&mode=car&callnative=1";
      //   window.location.href ="https:////uri.amap.com/navigation?to=" + lat + ',' + addr+ '&mode=car&callnative=1'
    },
    routeTest() {
      this.$router.replace({
        path: "/login"
      });
    },
    dateToString(time) {
      var thisMonth = "00" + (time.getMonth() + 1);
      var thisDay = "00" + time.getDate();
      return (
        time.getFullYear() +
        "-" +
        thisMonth.substr(thisMonth.length - 2) +
        "-" +
        thisDay.substr(thisDay.length - 2)
      );
    },
    showCalendar() {
      // this.calendarShow = true;
      this.$refs.calendar.show();
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
    //获取当前日期格式[yyyy,mm,dd]
    GetbDate() {
      var dd = new Date();
      var y = dd.getFullYear();
      var m = dd.getMonth() + 1;
      var d = dd.getDate();
      return [y, m, d];
    },
    processingDate(obj) {
      let month = obj[1],
        day = obj[2];
      return (
        obj[0] +
        "-" +
        (month < 10 ? "0" + month : month) +
        "-" +
        (day < 10 ? "0" + day : day)
      );
    },
     async expandShow () {
      let shareFlag = await this.$refs.flatNav.goQyyx()
      if (shareFlag) {
          console.log(this.detailData)
           this.promotoName = this.detailData.name
           let params = {
          id: this.detailData.merchantHotelId,
          businessId: this.detailData.productHotelId,
          businessType: 26,
          playDate: this.playDate
        }
        this.$refs.expandType.shareBox(params)
      }
      },
    goOrder(xindex, xi) {
      let item = this.isSelect
        ? this.itemData[xindex]
        : this.itemData[xindex].hotelTypeProducts[xi];
      item = Object.assign(
        item,
        this.isSelect
          ? { num: 1 }
          : { name: this.itemData[xindex].name, num: 1 }
      );
      let nArr = [item];
      // this.itemData.forEach((item, index) => {
      //   if (item.num > 0) {
      //     nArr.push(item);
      //   }
      // });
      // this.itemData[xindex].hotelTypeProducts[xi].num = 1;
      // this.itemData.forEach((item, index) => {
      //   item.hotelTypeProducts.forEach((el, i) => {
      //     if (el.num > 0) {
      //       let obj = Object.assign(el, { roomName: item.name });
      //       nArr.push(obj);
      //     }
      //   });
      // });

      localStorage.setItem(
        "pms_ticketType_2019_5_14_czc",
        JSON.stringify(nArr)
      );
      localStorage.setItem("selectBegin", this.beginDate);
      localStorage.setItem("selectEnd", this.endDate);
      localStorage.setItem(
        "pms_hotelName_2019_9_12_wxt",
        JSON.stringify(this.detailData)
      );
      let productId = this.isSelect
        ? this.itemData[xindex].productId
        : this.itemData[xindex].hotelTypeProducts[xi].productId;
      let env = isWxAli();
      let nextUrl =
        document.location.protocol +
        "//" +
        window.location.host +
        "/vue/order/pmsHotel?playDate=" +
        this.playDate +
        "&m_id=" +
        this.$route.query.m_id +
        "&productId=" +
        productId;

      // if (env.isWx || env.isAliPay) {
      //   // console.log("11");
      //   //阿里。微信
      //   nextUrl =
      //     document.location.protocol +
      //     "//" +
      //     window.location.host +
      //     "/vue/order/pmsHotel?playDate=" +
      //     this.playDate +
      //     "&m_id=" +
      //     this.$route.query.m_id;
      //   // if (this.$route.query.spread_code || this.$route.query.promoteCode) {
      //   //   //如果有推广码
      //   //   nextUrl +=
      //   //     "&spread_code=" + this.$route.query.spread_code ||
      //   //     this.$route.query.promoteCode;
      //   // }
      // } else {
      //   // h5
      //   let location = "//" + window.location.host + "/vue/";
      //   // console.log(location);
      //   nextUrl =
      //     location +
      //     "order/pmsHotel?playDate=" +
      //     this.playDate +
      //     "&m_id=" +
      //     this.$route.query.m_id;
      //   // if (this.$route.query.spread_code || this.$route.query.promoteCode) {
      //   //   //如果有推广码
      //   //   nextUrl +=
      //   //     "&spread_code=" + this.$route.query.spread_code ||
      //   //     this.$route.query.promoteCode;
      //   // }
      // }

      this.checkToken(nextUrl).then(res => {
        let url =
          "/order/pmsHotel?playDate=" +
          this.playDate +
          "&productId=" +
          productId;

        if (this.$route.query.spread_code || this.$route.query.promoteCode||this.$route.query.code) {
          //如果有推广码
          url +=
            "&spread_code=" + this.$route.query.spread_code ||
            this.$route.query.promoteCode||this.$route.query.code
        }
        if (this.$route.query.isSpecial) {
          url += "&isSpecial=" + this.$route.query.isSpecial;
        }
        this.$router.push(url);
      });

      // this.$router.push("/order/pmsHotel?playDate=" + this.playDate);
    },
    //加减运算
    sub(index, i) {
      if (this.itemData[index].hotelTypeProducts[i].num > 0) {
        this.itemData[index].hotelTypeProducts[i].num--;
      }
    },
    add(index, i) {
      this.itemData[index].hotelTypeProducts[i].num++;
    },
    //价格计算
    getTotal() {
      let _this = this,
        sum = 0;
      _this.number = 0;
      _this.itemData.forEach((item, index) => {
        _this.number += item.num;
        sum += item.num * (item.priceSettle * 100);
      });
      _this.totalPrice = (sum / 100).toFixed(2);
      return _this.totalPrice;
    },
    getIsSelect() {
      let flag = false;
      this.hotelType.forEach(item => {
        if (item.selected) {
          flag = true;
        }
      });
      return flag;
    },
    getTimeValue(item) {
      let time;
      // 时间格式为分钟
      time = item.minutes * 60 * 1000;

      return time;
    },
    getCancelRuleStr(item) {
      let beginDate = this.beginDate.replace(/-/g, "/");
      //入住时间时间戳
      let beginDateValue = new Date(beginDate).valueOf() + 24 * 60 * 60 * 1000;
      let value = this.getTimeValue(item);
      let preDateValue = beginDateValue - value;
      let preDate = new Date(preDateValue);
      let year = preDate.getFullYear(); // 获取完整的年份(4位,1970)
      let month = preDate.getMonth() + 1; // 获取月份(0-11,0代表1月,用的时候记得加上1)
      let day = preDate.getDate(); // 获取日(1-31)
      let hour = preDate.getHours(); // 获取小时数(0-23)
      let minute = preDate.getMinutes(); //分
      // let seconds = preDate.getSeconds(); //秒
      month = month < 10 ? "0" + month : month;
      day = day < 10 ? "0" + day : day;
      hour = hour < 10 ? "0" + hour : hour;
      minute = minute < 10 ? "0" + minute : minute;
      // seconds = seconds < 10 ? "0" + seconds : seconds;
      // let time;
      // if (item.timeType == "Hour") {
      //   // 时间格式为小时
      //   time = hour + ":00";
      // }
      // if (item.timeType == "minute") {
      //   // 时间格式为分钟
      //   time = hour + ":" + minute;
      // }
      // if (item.timeType == "second") {
      //   // 时间格式为秒
      //   time = hour + ":" + minute + ":" + seconds;
      // }
      let time = hour + ":" + minute;
      return (
        month + "月" + day + "日" + time + "前取消可退支付金额" + item.per + "%"
      );
    },
    getPxData() {
      this.postAxios("/merchant/api/pmsMerchantHotelType/listHotelType", {
        merchantHotelId: this.$route.query.id,
        startDate: this.beginDate,
        endDate: this.endDate,
        bedType: this.hotelType[1].selected
          ? this.hotelType[1].value
          : this.hotelType[2].selected
          ? this.hotelType[2].value
          : "",
        breakfastType: this.hotelType[0].selected
          ? this.hotelType[0].value
          : "",
        canCelType: this.hotelType[3].selected ? this.hotelType[3].value : ""
      }).then(res => {
        //重置会员展示
        this.memberShow = false
        let codeArr = [];
        let data = res.data && res.data ? res.data : [];
        let flag = this.getIsSelect();
        if (flag) {
          data.forEach(item => {
            //   item.productName=item.productName?item.productName.split('_')[1]:''

              //获取会产品码及价格
              if((item.productPrice||item.productPrice==0)&&item.productCode){
                  codeArr.push(item.productCode + ':' + item.productPrice)
              }
            if (item.ruleCancel && item.ruleCancel.cancelRuleJson) {
              let cancelRuleJson = JSON.parse(item.ruleCancel.cancelRuleJson);
              if (
                  item.ruleCancel.cancelTimeRule=='T'&&
                cancelRuleJson.excludeTimeAdd &&
                cancelRuleJson.excludeTimeAdd.length
              ) {
                item.cancelRuleStr = this.getCancelRuleStr(
                  cancelRuleJson.excludeTimeAdd[0]
                );
              }
            }
            let bedItem = this.pmsHotelBedTypeList.find(
              it => it.key == item.bedType
            );
            if (bedItem.value) {
              if (bedItem.value.indexOf("-") == -1) {
                item.bedStr = bedItem.value;
              } else {
                item.bedStr = bedItem.value.split("-")[1];
                item.bedStrName = bedItem.value.split("-")[1]+bedItem.value.split("-")[2];
              }
            }
          });
           
        } else {
          data.forEach((item, index) => {
            let arr = [];
            item.hotelTypeProducts.forEach((el, i) => {
              //获取会产品码及价格
              if((el.productPrice||el.productPrice==0)&&el.productCode){
                  codeArr.push(el.productCode + ':' + el.productPrice)
              }
              if (el.ruleCancel && el.ruleCancel.cancelRuleJson) {
                let cancelRuleJson = JSON.parse(el.ruleCancel.cancelRuleJson);
                if (el.ruleCancel.cancelTimeRule=='T'&&cancelRuleJson.excludeTimeAdd.length) {
                  let timeItem = cancelRuleJson.excludeTimeAdd[0];
                  el.cancelRuleStr = this.getCancelRuleStr(timeItem);
                }
              }
              data[index].hotelTypeProducts[i].num = 0;
              arr.push(el.productPrice);
            });
            if (arr.length) {
              arr.sort(function(a, b) {
                return a - b;
              });
              let min = arr[0];
              item.avgPrice = min;
            }

            let bedItem = this.pmsHotelBedTypeList.find(
              it => it.key == item.bedType
            );
            if (bedItem.value) {
              if (bedItem.value.indexOf("-") == -1) {
                item.bedStr = bedItem.value;
              } else {
                item.bedStr = bedItem.value.split("-")[1];
                item.bedStrName = bedItem.value.split("-")[1]+bedItem.value.split("-")[2];
              }
            }
            item.bedStr2 = bedItem ? bedItem.value : "";
            item.showContent = false;
          });
        }
        this.memberPriceGet(codeArr,data,flag)
      });
    },
    memberPriceGet(codeArr,data,flag){
      let _this = this
      if(codeArr.length==0){
        this.itemData = data;
        this.isSelect = flag;
        return false
      }
       axios.get((process.env.NODE_ENV === 'production' ? baseUrl : "https://testwww.lotsmall.cn") + "/leaguer/api/leaguer/pubs/product/discount?codePrice=" + codeArr.join(",")+'&merchantInfoId=' + localStorage.getItem('xjsc_vue_2018_12_19_mid')).then(res=>{
          if(res.status==200){
            let priceObj = {}
            if(res.message&&res.message.split(",").length){
              res.message.split(",").forEach(item=>{
                let codePriceArr = item.split(":")
                priceObj[codePriceArr[0]] = codePriceArr[1]?Number(codePriceArr[1]):0
              })
            }
            if(flag){
              data.forEach(item=>{
                if(item.productPrice||item.productPrice==0){
                    //存在价格
                    if(priceObj[item.productCode] == item.productPrice){
                      // 价格相同非会员价
                       item.isMemberPrice = false
                    }else{
                      // 价格不相同，有会员价
                       item.isMemberPrice = true
                        //会员价
                       item.memberPrice = priceObj[item.productCode]
                       item.oldPrice = item.productPrice
                        item.linePrice = item.productPrice
                       item.productPrice = priceObj[item.productCode]
                       //存在会员价
                      _this.memberShow = true
                    }
                  }else{
                    // 不存在价格
                    item.isMemberPrice = false
                  }
              })
              
            }else{
              data.forEach((item,index)=>{
                item.hotelTypeProducts.forEach((el,i)=>{
                  if(el.productPrice||el.productPrice==0){
                    //存在价格
                    if(priceObj[el.productCode] == el.productPrice){
                      // 价格相同非会员价
                       el.isMemberPrice = false
                    }else{
                      // 价格不相同，有会员价
                       el.isMemberPrice = true
                       //会员价
                       el.memberPrice = priceObj[el.productCode]
                       //老的产品价
                       el.oldPrice = el.productPrice
                       //划线价
                        el.linePrice = el.productPrice
                        //被替换成会员价
                       el.productPrice = priceObj[el.productCode]
                       //存在会员价
                      _this.memberShow = true
                    }
                  }else{
                    // 不存在价格
                    el.isMemberPrice = false
                  }
                })
              })
            }
            // console.log("asdadas",priceObj)
          }
        this.itemData = data;
        this.isSelect = flag;
        })
    },
    playDateChange(date) {
      this.playDate = date;
      this.getPxData();
      this.addNum = 0;
      this.number = 0;
      this.totalPrice = 0;
    },
    goNotice() {
      this.$router.push({
        path: "/detail/ticketNotice",
        query: {
          merchantHotelInfoId: this.$route.query.id,
          productType: "hotel"
        }
      });
    },
    //获取当前日期
    getCurDate(item) {
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
    getCurDateNum(item) {
      var date = item ? new Date(item) : new Date();
      var seperator1 = "/";
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
.pms-calendar-warper {
  background: rgba(0, 0, 0, 0.2) !important;
  .calendar-warper {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    .mpvue-calendar {
      position: absolute;
      left: 0;
      bottom: 0;
    }
  }
}
.hotelDetail-modal {
  height: auto;
  background-color: #f7f7f7;
  z-index: 1000 !important;
  color: #413838;
  .hotelDetail-top {
    padding: 25px 10px;
    // height: 108px;
    height: auto;
    margin: 10px 0;
    text-align: center;
    background: #fff;
    .hotelDetail-top-title {
      color: #413838;
      font-size: 16px;
      font-weight: bold;
    }
    .hotelDetail-top-content {
      margin: 10px 0;
      color: #413838;
      font-size: 12px;
    }
    .hotel-phone {
      border: 1px solid #0086f6;
      color: #0086f6;
      font-size: 14px;
      border-radius: 2px;
      height: 40px;
      line-height: 40px;
    }
  }
  .hotelDetail-con {
    // padding-top: 20px;
    margin: 10px 0;
    background: #fff;
    .hotelDetail-con-title {
      padding-left: 10px;
      color: #413838;
      font-size: 18px;
      font-weight: bold;
      height: 58px;
      line-height: 58px;
    }
    .hotel-detail-box {
      padding: 0 10px;
      img {
        width: 100%;
      }
    }
    .hotel-service-box {
      margin: 0 10px;
      margin-top: 20px;
      transition: max-height 0.5s cubic-bezier(0, 1, 0, 1) -0.1s;
      .hotel-service-item {
        background: #f8f8f8;
        font-size: 14px;
        font-weight: bold;
        padding-left: 10px;
        height: 37px;
        line-height: 37px;
      }
      .hotel-facility {
        margin: 15px 0;
        display: flex;
        // justify-content: flex-start;
        .item-bar {
          display: inline-block;
        }
        flex-wrap: wrap;
        .hotel-facility-item {
          // flex:1;
          width: 33%;
          margin-bottom: 5px;
          .icon-facility {
            color: #00c94e;
            vertical-align: middle;
          }
        }
      }
    }
    .hotel-service-all {
      text-align: center;
      color: #0086f6;
      border-top: 1px solid #e1e1e1;
      line-height: 45px;
      .icon-service-down {
        transform: rotate(-180deg);
      }
      .icon-service-up {
        transform: rotate(0deg);
      }
    }
    .animate {
      max-height: 9999px;
      transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
      transition-delay: 0s;
    }
  }
  .hotelDetail-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 48px;
    line-height: 48px;
    text-align: center;
    background: #fff;
    font-size: 18px;
    font-weight: bold;
    box-shadow: 0 0 5px #e1e1e1;
    .hotelDetail-bottom-text {
      background: linear-gradient(to right, #ff9256, #ff4441);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}

.vux-popup-dialog {
  z-index: 601 !important;
}
.pmshotel-detail {
  padding-bottom: 49px;
  .houseType-slide {
    display: flex;
    // align-items: center;
    height: 147px;
    padding-left: 10px;
    // max-height: 0;
    transition: max-height 0.5s cubic-bezier(0, 1, 0, 1) -0.1s;
    background: #fff;
    margin: 10px;
    .houseType-slide-img {
      margin-top: 15px;
      width: 80px;
      height: 118px;
      background-repeat: no-repeat;
      background-position: center center;
      overflow: hidden;
      position: relative;
      img {
        width: 140px;
        height: 118px;
        margin-left: -30px;
        margin-right: -30px;
      }
      .img-text {
        position: absolute;
        right: 5px;
        bottom: 5px;
        width: 29px;
        height: 18px;
        border-radius: 2px;
        line-height: 18px;
        font-size: 12px;
        background-color: rgba(0, 0, 0, 0.5);
        text-align: center;
        color: #fff;
      }
    }
    .houseType-detail-content {
      width: calc(100% - 145px);
      margin-left: 10px;
      margin-top: 12px;
      .avg-price {
        display: flex;
        align-items: baseline;
        .txt {
          font-size: 12px;
          color: #413838;
        }
        .unit {
          color: #ff6600;
          font-size: 8px;
        }
        .line-price{
               font-size: 12px;
               color: #999;
              text-decoration: line-through;
              margin-left: 5px;
            }
      }
      .member-tag-content{
        margin-top: 5px;
        .member-tag{
           height: 16px;
            border: 1px solid #f2bcb7;
            padding: 0 2px;
            font-size: 10px;
            color: #e03826;
            border-radius: 2px;
            margin-right: 5px
        }
      }

      .content-item {
          display:flex;
          align-items: center;
        .avg-text {
          font-size: 12px;
          color: #777777;
        }
        .title {
            max-width:80%;
          font-size: 15px;
          color: #413838;
          font-weight: Bold;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .detail {
          font-size: 14px;
          color: #0086f6;
        }
        .icon-detail {
          font-size: 12px;
          color: #0086f6;
        }
      }
    }
    .reserve-detail {
      width: 60px;
      margin-top: 50px;
      .reserve-box {
        width: 44px;
        height: 46px;
        border-radius: 3px;
        background: linear-gradient(to right, #ff9256, #ff4441);
        .reserve-top {
          text-align: center;
          color: #fff;
          font-size: 17px;
          line-height:27px;
          font-weight: bold;
        }
        .reserve-bottom {
          background: #fff;
          width: 42px;
          height: 19px;
          line-height: 19px;
          margin: 0 auto;
          text-align: center;
          margin-top: -1px;
          border-bottom-left-radius: 2px;
          border-bottom-right-radius: 2px;
          .reserve-bottom-text {
            background: linear-gradient(to right, #ff9256, #ff4441);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }
      }
    }
  }
  .room-detail {
  }
  .px-footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background: #fff;
    @include fbc;
    .num-price {
      margin-left: 15px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .select-num {
        @include sc(13px, #413838);
        height: 12px;
      }
      .price {
        @include sc(13px, #413838);
        .text {
        }
        .price-info {
          display: inline-block;
          .price-unit {
            @include sc(12px, #f05b47);
          }
          .price-num {
            @include sc(18px, #f05b47);
          }
        }
      }
    }
    .px-next {
      width: 50%;
      background: #cbcbcb;
      &.active {
        background: #f05b47;
      }
    }
  }
  .is_fixed {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 499;
  }
  .hotelDetail-promoto{
      display: flex;
      justify-content: space-between;
        align-items: center;
        padding:10px 10px;
        background-color: #fff;
        font-size:14px;
        margin-bottom:10px;
  }
  .hotelType-cotent {
    width: 100%;
    margin-bottom: 10px;
    background: #fff;
    .play-date {
      .hotel-date {
        height: 48px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e1e1e1;
        .date-day {
          font-size: 12px;
          border: 1px solid #e1e1e1;
          color: #999999;
          width: 33px;
          height: 18px;
          line-height: 18px;
          text-align: center;
          border-radius: 2px;
          float: left;
        }
        .date-box {
          width: 150px;
          height: 48px;
          line-height: 48px;
          background-color: #fff;
          color: #0086f6;
          .date-label {
            font-size: 12px;
            margin-left: 5px;
          }
          .date-text {
            font-size: 16px;
            font-weight: bold;
            margin-left: 10px;
          }
        }
        .icon-day {
          // float: right;
          // margin-left: 10px;
          text-align: right;
          display: inline-block;
          color: #0086f6;
          font-size: 14px;
        }
      }

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

    .hotelType-filter {
      line-height: 57px;
      .hotelType-item {
        width: 100%;
        display: flex;
        flex-wrap: noWrap;
        .type-item {
          //  flex:1;
          width: 55px;
          height: 27px;
          line-height: 27px;
          background-color: #f5f5f5;
          color: #413838;
          margin: 7.5px 5px;
          border-radius: 2px;
          font-size: 12px;
          text-align: center;
        }
        .type-item-selected {
          color: #0086f6;
          //   background-color: #e0f0fe;
          background: url("./../../../assets/images/icon-hotel2.png") no-repeat;
          background-size: 55px 27px;
        }
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
  }
  .px-ul {
    background: #fff;
    padding: 15px 0;
    padding-top: 0;
    // height: 235px;
    // overflow: auto;
    .px-room-name {
      padding-left: 15px;
      font-size: 16px;
    }
    .px-li-title {
      display: flex;
      align-items: center;
      height: 36px;
      padding: 5px 15px;
      margin-bottom: 10px;
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
        flex: 1;
        font-size: 18px;
        color: #413838;
        word-break: break-all;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        /* ! autoprefixer: off */
        -webkit-box-orient: vertical;
        /* autoprefixer: on */
        overflow: hidden;
        i.xx-icon {
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
        }
      }
    }
    .px-li {
      @include fbc;
      margin-bottom: 15px;
      padding: 0 15px;
      &:last-child {
        margin-bottom: 0;
      }

      .px-li-l {
        // margin-right: 15px;
        width: 185px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .px-name {
          @include sc(16px, #413838);
          @include oh(2);
        }
        .px-price {
          .unit {
            @include sc(12px, #f05b47);
          }
          .price {
            @include sc(18px, #f05b47);
          }
          .last-price {
            @include sc(12px, #999);
            text-decoration: line-through;
          }
        }
        .px-notice {
          @include sc(12px, #00699e);
          margin-top: 5px;
        }
      }
      .px-li-r {
        @include fbc;
        .num {
          @include sc(18px, #413838);
          margin-right: 15px;
        }
        .add-sub {
          display: flex;
          .handle-btn {
            height: 29px;
            line-height: 29px;
            display: inline-block;
            width: 44px;
            border: 1px solid #f05b47;
            text-align: center;
            color: #f05b47;
            font-size: 18px;
          }
          .sub {
            border-right: none;
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
          }
          .add {
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
          }
          .no-num {
            border-color: #ffc9c9;
            color: #ffc9c9;
          }
        }
      }
    }
  }
  .order-pop.vux-popup-dialog {
    z-index: 501 !important;
  }
  .mask {
    width: 100%;
    height: 100%;
    position: fixed;
    background: rgba(0, 0, 0, 0.3);
    z-index: 700;
  }

  .draw-enter, .draw-leave-to /* .fade-leave-active below version 2.1.8 */ {
    height: 0;
  }
  .draw-enter-active {
    animation: draw-in 0.5s;
  }
  .draw-leave-active {
    animation: draw-in 0.5s reverse;
  }
  @keyframes draw-in {
    0% {
      transform: translate(200px, 0);
    }
    100% {
      transform: translate(0, 0);
    }
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
  .order-content {
    margin-bottom: 10px;
    // height: 464.5px;
    // border-top-left-radius: 2px;
    // border-top-right-radius: 2px;
    position: relative;

    .select-ticket-title {
      @include sc(18px, #413838);
      height: 56.5px;
      line-height: 56.5px;
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
    background: #fff;
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
    .order {
      border: none;
      outline: none;
      background: #f05b47;
      @include sc(16px, #fff);
      text-align: center;
      height: 49px;
      line-height: 49px;
      width: 172px;
    }
  }
  .m-t-106 {
    margin-top: 156px;
  }
  .hotelType-padTop {
    padding-top: 115px;
  }
  .hotelType-list {
    .houseType-item {
      .houseType-item-box {
        background: #fff;
        .border-bot-no {
          border: none !important;
        }

        .houseType-item-cell {
          display: flex;
          justify-content: space-around;
          align-items: center;
          height: 109px;
          // padding-left: 10px;
          margin-left: 10px;
          // border-bottom: 1px solid #e1e1e1;
          background: #fff;
          // box-shadow: 0 0 5px #e1e1e1;
          border-bottom: 1px solid #e1e1e1;
          .houseType-item-img {
            width: 80px;
            height: 80px;
            position: relative;
            background-repeat: no-repeat;
            background-position: center center;
            overflow: hidden;
            img {
                width: 120px;
              height: 80px;
              margin-left: -20px;
              margin-right: -20px;
            }
            .img-text {
              position: absolute;
              right: 5px;
              bottom: 5px;
              width: 29px;
              height: 18px;
              border-radius: 2px;
              line-height: 18px;
              font-size: 12px;
              background-color: rgba(0, 0, 0, 0.5);
              text-align: center;
              color: #fff;
            }
          }
          .houseType-item-content {
            // margin-left: 10px;
            padding-left:10px;
            width: calc(100% - 120px);
            .content-item {
              display: flex;
              align-items: baseline;
              .unit {
                font-size: 8px;
                color: #ff6600;
                margin-right: 1px;
              }
              .num {
                font-size: 14px;
                color: #ff6600;
                margin-right: 3px;
                font-weight: bold;
              }
              .start-text {
                font-size: 11px;
                color: #413838;
                margin-right: 8px;
              }
              .avg-text {
                font-size: 11px;
                color: #413838;
                margin-right: 2px;
              }
              .title {
                //   max-width:80%;
                font-size: 15px;
                color: #413838;
                font-weight: Bold;
                white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
              }
              .detail {
                font-size: 14px;
                color: #0086f6;
              }
              .icon-detail {
                font-size: 12px;
                color: #0086f6;
              }
              .stockNum {
                padding: 0 6px;
                border-radius: 12px;
                height: 17px;
                line-height: 17px;
                display: inline-block;
                color: #fff;
                background: linear-gradient(to right, #ff7977, #ff553e);
              }
              .type-detail {
                margin-right: 10px !important;
              }
            }
          }
          .houseType-item-icon {
            color: #0086f6 !important;
            margin-right: 10px;
            .icon-show {
              color: #0086f6 !important;
              font-size: 22px;
            }
          }
          .icon-show-up {
            transform: rotate(-180deg);
          }
          .icon-show-down {
            transform: rotate(0deg);
          }
        }
      }

      .houseType-slide {
        display: flex;
        align-items: center;
        height: 112px;
        padding-left: 10px;
        max-height: 0;
        transition: max-height 0.5s cubic-bezier(0, 1, 0, 1) -0.1s;
        background: #fff;
        margin: 10px;
        .houseType-slide-content {
          width: calc(100% - 60px);
          .avg-price {
            display: flex;
            align-items: baseline;
            .txt {
              font-size: 12px;
              color: #413838;
            }
            .unit {
              color: #ff6600;
              font-size: 8px;
            }
            .line-price{
               font-size: 12px;
               color: #999;
              text-decoration: line-through;
              margin-left: 5px;
            }
          }
          .member-tag-content{
            margin-top: 5px;
        .member-tag{
           height: 16px;
            border: 1px solid #f2bcb7;
            padding: 0 2px;
            font-size: 10px;
            color: #e03826;
            border-radius: 2px;
            margin-right: 5px
        }
      }
          .content-item {
              
            .avg-text {
              font-size: 12px;
              color: #777777;
            }
            .title {
               
              font-size: 15px;
              color: #413838;
              font-weight: Bold;
              
            }
            .detail {
                padding-left:5px;
              font-size: 14px;
              color: #0086f6;
            }
            .icon-detail {
              font-size: 12px;
              color: #0086f6;
            }
          }
        }
        .reserve {
          width: 60px;
          .reserve-box {
            width: 44px;
            height: 46px;
            border-radius: 3px;
            background: linear-gradient(to right, #ff9256, #ff4441);
            .reserve-top {
              text-align: center;
              color: #fff;
              font-size: 17px;
              line-height:27px;
              font-weight: bold;
            }
            .reserve-bottom {
              background: #fff;
              width: 42px;
              height: 19px;
              line-height: 19px;
              margin: 0 auto;
              text-align: center;
              margin-top: -1px;
              border-bottom-left-radius: 2px;
              border-bottom-right-radius: 2px;
              .reserve-bottom-text {
                background: linear-gradient(to right, #ff9256, #ff4441);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
              }
            }
          }
        }
      }
      .animate {
        max-height: 9999px;
        transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
        transition-delay: 0s;
      }
    }
  }
  .hotel-w-title {
    @include sc(14px, #0086f6);
    // padding: 20px 10px 20px 15px;
    display: flex;
    align-items: center;
  }
  .reserve-item-box {
    display: flex;
    .reserve-text {
      width: 25%;
      text-align: center;
      line-height: 30px;
      font-size: 12px;
      img {
        width: 24px;
        //   height:24px;
        vertical-align: middle;
      }
    }
  }
  .ticket-detail-warpper {
    background: #fff;
    color: #413838;
    .ticket-w-title {
      .more {
        color: #0086f6;
      }
    }
    .ticket-f-title {
      @include sc(18px, #413838);
      font-weight: bold;
      padding: 20px 0px 20px 15px;
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

    .comment-ul {
      .comment-li {
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
    // @include fbc;
    // height: 153px;
    &.n-m-b{
      margin-bottom: 0;
    }
    background: #fff;
    // padding: 15px 0;
    padding-top: 15px;
    padding-left: 10px;
    margin-bottom: 10px;
    .hotel-top {
      //   width: calc(100% - 61.5px);
      padding-bottom: 10px;
      border-bottom: 1px solid #e1e1e1;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .hotel-left {
        width: calc(100% - 85px);
        .left-item {
          margin-bottom: 6px;
          font-size: 11px;
          .scenic-left {
            border: 1px solid #ff6633;
            color: #ff6633;
            padding: 2px 6px;
            margin-right: 5px;
          }
          .scenic-center {
            border: 1px solid #1ec08a;
            color: #1ec08a;
            padding: 2px 6px;
            margin-right: 5px;
          }
          .item-bar {
            display: inline-block;
          }
          &:last-child {
            margin-bottom: 0;
          }
        }
        .ticket-name {
          @include sc(16px, #413838);
          @include oh;
        }
        .ticket-subtitle {
          @include sc(12px, #413838);
          // @include oh;
          // margin-bottom: 10px;
        }
        .hotel-facility {
          margin: 10px 0;
        }
        .ticket-price {
          margin-top: 5px;
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
      .hotel-right {
        color: #0086f6;
        font-size: 14px;
        padding-right: 10px;
      }
    }
    .hotel-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 60px;
      .hotel-left {
        width: calc(100% - 90px);
        .hotel-area {
          @include sc(14px, #413838);
          margin-bottom: 6px;
        }
        .hotel-adress {
          @include sc(12px, #999999);
          .icon-adress {
            font-size: 12px;
          }
        }
      }
      .hotel-right {
        color: #0086f6;
        font-size: 14px;
        // line-height: 75px;
        padding-right: 10px;
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
  .coupon-receive {
    height: 43px;
    margin: 10px 0;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .vux-slider {
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
}
</style>


