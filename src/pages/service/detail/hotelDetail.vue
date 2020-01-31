<template>
  <div class="hotel-detail">
    <four-month @getDate="select"
                ref="calendar"></four-month>
    <swiper auto
            loop
            :interval="2000"
            height="5.906667rem"
            class="text-scroll"
            dots-position="center">
      <swiper-item v-for="(imgUrl,index) in imgUrls"
                   :key="index">
        <img style="width:100%;height:100%"
             :src="imgUrl + '?imageMogr2/thumbnail/640x/strip/quality/100'"
             alt>
      </swiper-item>
    </swiper>
    <div class="ticket-n-intro">
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
      <div class="ticket-r">
        <img @click="amap(detailData.latitudeLongitude,detailData.addr)"
             class="ticket-r-img"
             src="http://statics.lotsmall.cn/wx/img/icon-location.png"
             alt>
      </div>
    </div>
    <div class="ticket-detail-warpper m-b-10">
      <h2 class="ticket-w-title">酒店详情</h2>
      <div class="ticket-detail-box">
        <div v-html="scenicDetail"></div>
      </div>
    </div>
    <div class="ticket-detail-warpper m-b-10">
      <h2 class="ticket-w-title">预定须知</h2>
      <div class="ticket-detail-box">
        <div v-html="orderDetail"></div>
      </div>
    </div>
    <!-- <div class="ticket-detail-warpper m-b-10">
            <h2 class="ticket-w-title">评论</h2>
            <div v-if="commentData.length" class="ticket-detail-box comment-ul">
                <div v-for="(item,index) in commentData" :key="index" class="comment-li">
                    <div class="user-info">
                        <div class="img-name">
                            <img v-if="item.headImg" class="logo-img" :src="item.headImg" alt>
                            <i v-else class="xx-icon icon-member member-svg"></i>
                            <span class="name">{{item.userName}}</span>
                        </div>
                        <span class="comment-time">{{item.createTime}}</span>
                    </div>
                    <p class="comment-content">{{item.content}}</p>
                </div>
            </div>
            <div v-else class="no-comment">暂无评论</div>
        </div> -->

    <!-- 评论列表 -->
    <comment :data="commentData"
             mold="hotel"
             :id="$route.query.id"
             :param="commentParam"
             :url="commentUrl"></comment>
    <div class="f-b bottom-warpper">
      <div @click="go('/')"
           class="home-page">
        <i class="xx-icon icon-shouye"></i>
        <span>首页</span>
      </div>
      <div class="home-order">
        <expanded v-if="detailData.isBindQyyx=='T'"
                  :param="expandedParam"
                  :wxshareinfo="wxshareinfo"
                  @shardShow="showShard"></expanded>
        <button @click="show=true"
                type="button"
                class="order">立即下单</button>
      </div>

    </div>

    <popup class="order-pop"
           v-model="show">
      <transition name="draw">
        <div v-if="calendarShow"
             class="mask"
             @click="hideCalendar">
          <Calendar clean
                    now
                    range
                    @select="select"
                    :begin="begin"
                    ref="calendar" />
        </div>
      </transition>
      <div class="order-content">
        <div class="order-content-title">
          <span class="text">入住时间</span>
          <i @click="show=false"
             class="xx-icon icon-guanbi2"></i>
        </div>
        <group class="play-date">
          <div @click="showCalendar"
               class="hotel-date clearfix">
            <div class="date-box ">
              <span class="date-label">入住</span>
              <span class="date-text">{{beginDate}}</span>
              <i class="xx-icon icon-rili"></i>
            </div>
            <div class="date-box">
              <span class="date-label">离店</span>
              <span class="date-text">{{endDate}}</span>
              <i class="xx-icon icon-rili"></i>
            </div>
          </div>
        </group>
        <div class="select-ticket-title">
          <span class="select-ticket">可选房型</span>
        </div>
        <div class="px-ul">
          <div v-for="(item,index) in itemData"
               :key="index"
               class="px-li">
            <div class="px-li-l">
              <div>
                <div class="px-name">{{ item.nickName }}</div>
                <div class="px-price">
                  <span class="unit">￥</span>
                  <span class="price">{{ item.singleSum }}</span>
                </div>
              </div>

              <div @click="showTicketNotice(item)"
                   class="px-notice">房型介绍</div>
            </div>
            <div class="px-li-r"
                 v-if="item.ifEnough=='T'">
              <span class="num">{{item.num}}</span>
              <div class="add-sub">
                <span @click.stop="sub(index)"
                      class="sub handle-btn"
                      :class="{'no-num':item.num==0}">-</span>
                <span @click.stop="add(index)"
                      class="add handle-btn">+</span>
              </div>
            </div>
            <div v-else
                 class="disabled-btn">
              <span>已订完</span>
            </div>
          </div>
        </div>
        <div class="px-footer">
          <div class="num-price">
            <div class="select-num">
              <span>已选：</span>
              <span class="num">{{number}}</span>
            </div>
            <div class="price">
              <span class="text">总额：</span>
              <div class="price-info">
                <span class="price-unit">￥</span>
                <span class="price-num">{{total}}</span>
              </div>
            </div>
          </div>
          <div class="px-next f-b-btn"
               @click="goOrder"
               v-if="number&&total"
               :class='{active:number&&total}'>下一步</div>
          <div class="px-next f-b-btn"
               v-else>下一步</div>
        </div>
      </div>
    </popup>
    <div v-if="show1"
         class="time-mask"></div>
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
    <!-- 酒店预定须知 -->
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
    <div v-if="shardFlag"
         @click="shardFlag=false"
         class="shard-where">
      <img src="@/assets/images/weixin_sharetip.png"
           alt>
    </div>
    <float-nav></float-nav>
  </div>
</template>
<script>
import { Swiper, SwiperItem, Popup, Group, XDialog } from "vux";
import fourMonth from "@/components/fourMonthSelect";
import Calendar from "mpvue-calendar";
import "mpvue-calendar/src/browser-style.css";
import floatNav from "@/components/floatNav";
import comment from "@/components/comment";
import expanded from "../components/expanded";
export default {
  components: {
    fourMonth,
    floatNav,
    Swiper,
    SwiperItem,
    Popup,
    Group,
    Calendar,
    XDialog,
    comment,
    expanded
  },
  data () {
    return {
      modalNoticeFlag: false,
      modalNoticeTitle: "",
      modalNotice: "",
      beginDate: this.GetDateStr(0),
      endDate: this.GetDateStr(1),
      calendarShow: false,
      begin: this.GetbDate(),
      indexArr: [],
      number: 0,
      addNum: 0,
      noticeStr: "",
      noticeShow: false,
      totalPrice: 0,
      itemData: [],
      value2: this.getCurDate(),
      show1: false,
      show: false,
      wayType: 1,
      playDate: "",
      detailData: {},
      commentData: {},
      commentParam: {
        wayType: 1,
        productType: "hotel",
        id: this.$route.query.id,
        leaguerId:
          localStorage.getItem("xjsc_login_userId_2019_3_8") ||
          this.$cookie.get("leaguerInfoId")
      },
      commentUrl: "",
      imgUrls: [],
      scenicDetail: "",
      orderDetail: "",
      activeIndexArr: [], //缓存需要提示购票的下标index
      expandedParam: {
        businessId: this.$route.query.id,
        businessType: "hotel"
      },
      wxshareinfo: {},
      shardFlag: false //分享wx
    };
  },
  mounted () {
    this.commentUrl = this.api.main.comment.list;
  },
  created () {
    document.title = "酒店详情";
    let _this = this;
    this.playDate = this.getCurDate();
    this.beginDate = localStorage.getItem("selectBegin");
    this.endDate = localStorage.getItem("selectEnd");
    let detailUrl = "/merchant/api/merchantHotelInfo/merchantHotelInfo";
    //   commentUrl = this.api.main.comment.list;
    // if (recommendFlag && leagureId && payOrderNo) {
    //   //支付跳转成功后跳转详情页面
    //   var pd = this.getAxios(detailUrl, {
    //     wayType: this.wayType,
    //     merchantParkInfoId: _this.$root.$mp.query.id,
    //     merchantInfoId: merchantInfoId,
    //     recommendFlag: recommendFlag,
    //     payOrderNo: payOrderNo,
    //     leaguerId: leagureId
    //   });
    // } else {
    //   //列表页面跳转详情页面
    //   var pd = this.getAxios(detailUrl, {
    //     wayType: this.wayType,
    //     merchantParkInfoId: this.$route.query.id
    //   });
    // }
    let pd = this.getAxios(detailUrl, {
      merchantHotelInfoId: this.$route.query.id
    });
    // let pc = this.getAxios(commentUrl, {
    //   productType: "hotel",
    //   id: this.$route.query.id
    // });

    Promise.all([pd])
      .then(result => {
        // console.log(result);
        _this.detailData = result[0].data;
        // _this.commentData = result[1].data;
        _this.imgUrls = result[0].data.merchantPictureLibVo.wapUrl
          ? result[0].data.merchantPictureLibVo.wapUrl.split(",")
          : [];

        _this.scenicDetail = result[0].data.summary.replace(/<\/?[>]*>/g, "");
        _this.orderDetail = result[0].data.noticeid;
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
    //获取当天的票型信息
    this.getPxData();
  },
  computed: {
    total () {
      let _this = this,
        sum = 0,
        priceArrow = [],
        showPriceArray = [],
        itemData = _this.itemData,
        buildDate = "",
        beginDateCode = new Date(_this.beginDate).getTime(),
        selectedDateArray = [];
      _this.number = 0;
      while (!!_this.endDate && buildDate !== _this.endDate) {
        buildDate = _this.dateToString(new Date(beginDateCode));
        selectedDateArray.push(buildDate);
        beginDateCode += 1000 * 60 * 60 * 24;
      }
      // console.log(selectedDateArray);
      for (let i = 0; i < itemData.length; i++) {
        let singleSum = 0;
        _this.number += itemData[i].num;
        for (let j = 0; j < selectedDateArray.length - 1; j++) {
          for (let k = 0; k < itemData[i].prices.length; k++) {
            if (itemData[i].prices[k].day == selectedDateArray[j]) {
              singleSum = itemData[i].prices[k].salePrice;
              break;
            }
          }
        }
        _this.itemData[i].singleSum = singleSum.toFixed(2);
        sum += itemData[i].num * singleSum;
      }
      return sum.toFixed(2);
    }
  },
  methods: {
    showShard (flag) {
      this.shardFlag = flag;
    },
    showTicketNotice (item) {
      console.log(item);
      this.modalNotice = item.modelDetail;
      this.modalNoticeTitle = item.nickName || item.modelName;
      this.modalNoticeFlag = true;
    },
    amap (lat, addr) {
      window.location.href =
        "//uri.amap.com/navigation?to=" +
        lat +
        "," +
        addr +
        "&mode=car&callnative=1";
      //   window.location.href ="https:////uri.amap.com/navigation?to=" + lat + ',' + addr+ '&mode=car&callnative=1'
    },
    routeTest () {
      this.$router.replace({
        path: "/login"
      });
    },
    dateToString (time) {
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
    showCalendar () {
      //   this.calendarShow = true;
      this.$refs.calendar.show();
    },
    hideCalendar () {
      this.calendarShow = false;
    },
    select (val, val2) {
      //   this.beginDate = this.processingDate(val);
      this.beginDate = val
      //   this.endDate = this.processingDate(val2);
      this.endDate = val2
      localStorage.setItem("selectBegin", val);
      localStorage.setItem("selectEnd", val2);
      this.getPxData();
      //   setTimeout(() => {
      //     this.hideCalendar();
      //   }, 300);
    },
    //获取当前日期
    GetDateStr (AddDayCount) {
      var dd = new Date();
      dd.setDate(dd.getDate() + AddDayCount);
      var y = dd.getFullYear();
      var m = dd.getMonth() + 1;
      var mm = m < 10 ? "0" + m : m;
      var d = dd.getDate();
      var dd = d < 10 ? "0" + d : d;
      return y + "-" + mm + "-" + dd;
    },
    //获取当前日期格式[yyyy,mm,dd]
    GetbDate () {
      var dd = new Date();
      var y = dd.getFullYear();
      var m = dd.getMonth() + 1;
      var d = dd.getDate();
      return [y, m, d];
    },
    processingDate (obj) {
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
    goOrder () {
      let nArr = [];
      this.itemData.forEach((item, index) => {
        if (item.num > 0) {
          nArr.push(item);
        }
      });
      localStorage.setItem("ticketType", JSON.stringify(nArr));
      localStorage.setItem("selectBegin", this.beginDate);
      localStorage.setItem("selectEnd", this.endDate);
      // localStorage.setItem("xjxc_vue_wap_2019_3_7_ticket_playDate", this.playDate);
      // this.closeModal();
      // this.goUrl("pages/scenic/order/main");
      let url = "/order/hotel?playDate=" + this.playDate
      let nextUrl = document.location.protocol + "//" + window.location.host + "/vue" + url;
      this.checkToken(nextUrl).then(res => {
        localStorage.removeItem("xjsc_nextpath_2019_4_20")
        this.$router.push(url);
      })

    },
    agree () {
      this.noticeShow = false;
      //缓存激活的票型下标
      if (this.activeIndexArr.indexOf(this.addActiveIndex) < 0) {
        this.activeIndexArr.push(this.addActiveIndex);
      }
      // console.log('activeIndexArr',this.activeIndexArr)
      this.itemData[this.addActiveIndex].num++;
      this.getTotal();
    },
    //加减运算
    sub (index) {
      if (this.itemData[index].num > 0) {
        this.itemData[index].num--;
      }
    },
    add (index) {
      this.itemData[index].num++;
    },
    //价格计算
    getTotal () {
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
    getPxData () {
      let _this = this;
      let itemUrl = "/merchant/api/merchantHotelRoom/merchantHotelRoomGrid";
      this.getAxios(itemUrl, {
        wayType: this.wayType,
        merchantHotelInfoId: this.$route.query.id,
        currPage: 1,
        pageSize: 100,
        beginDate: localStorage.getItem("selectBegin") + " 00:00:00",
        endDate: localStorage.getItem("selectEnd") + " 00:00:00"
      }).then(res => {
        // console.log(res);
        res.data.rows.forEach((item, index) => {
          res.data.rows[index].num = 0;
          res.data.rows[index].singleSum = "";
        });
        this.itemData = res.data.rows;
        console.log(this.itemData);
      });
    },
    playDateChange (date) {
      // console.log(date);
      this.playDate = date;
      this.getPxData();
      this.addNum = 0;
      this.number = 0;
      this.totalPrice = 0;
    },
    goNotice () {
      this.$router.push({
        path: "/detail/ticketNotice",
        query: {
          merchantHotelInfoId: this.$route.query.id,
          productType: "hotel"
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
    }
  }
};
</script>
<style lang="scss">
@import "../../../assets/styles/mixin.scss";

.vux-popup-dialog {
  z-index: 601 !important;
}
.hotel-detail {
  padding-bottom: 49px;
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
  .px-ul {
    background: #fff;
    padding: 15px;
    height: 235px;
    overflow: auto;
    .px-li {
      @include fbc;
      margin-bottom: 15px;
      //   &:last-child {
      //     margin-bottom: 0;
      //   }
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
      .disabled-btn {
        height: 29px;
        line-height: 29px;
        display: inline-block;
        width: 44px;
        background-color: #ccc;
        text-align: center;
        padding: 0 10px;
        border-radius: 3px;
        font-size: 13px;
        color: #fff;
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
    height: 464.5px;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    background-color: #fff;
    position: relative;
    .px-footer {
      position: absolute;
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
    .play-date {
      // padding: 1px 0;
      background: #fff;
      .hotel-date {
        height: 54px;
        .date-box {
          width: 173px;
          height: 34px;
          line-height: 34px;
          margin-left: 10px;
          float: left;
          background-color: #fff;
          color: #413838;
          margin-top: 10px;
          .date-label {
            font-size: 14px;
            display: inline-block;
            vertical-align: middle;
            margin-left: 12px;
          }
          .date-text {
            font-size: 13px;
            display: inline-block;
            vertical-align: middle;
            margin-left: 12px;
          }
          .icon-rili {
            float: right;
            margin-top: 2px;
            display: inline-block;
            vertical-align: top;
            margin-right: 12px;
            color: #999;
            font-size: 17px;
          }
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
    .home-order {
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
        width: 172px;
      }
    }
  }
  .ticket-detail-warpper {
    background: #fff;
    .ticket-w-title {
      @include sc(18px, #413838);
      font-weight: 600;
      //   padding: 20px 0px 20px 15px;
    }
    .ticket-detail-box {
      padding: 0px 15px 20px 15px;
      word-break: break-word;
      img {
        width: 100%;
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
  .ticket-n-intro {
    @include fbc;
    height: 123.5px;
    background: #fff;
    margin-bottom: 10px;
    .ticket-l {
      width: calc(100% - 61.5px);
      padding-left: 15px;
      .ticket-name {
        @include sc(18px, #413838);
        font-weight: 600;
        @include oh;
      }
      .ticket-subtitle {
        @include sc(12px, #5c5c5c);
        @include oh;
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


