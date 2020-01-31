
<template>
  <div class="tickets-detail" :class="{overflow:show}">
    <swiper
      v-if="imgUrls.length>1"
      auto
      loop
      :interval="2000"
      height="5.906667rem"
      class="text-scroll"
      dots-position="center"
    >
      <swiper-item v-for="(imgUrl,index) in imgUrls" :key="index">
        <img
          style="width:100%;height:100%"
          :src="imgUrl + '?imageMogr2/thumbnail/640x/strip/quality/100'"
          alt
        />
      </swiper-item>
    </swiper>
    <img
      v-if="imgUrls.length==1"
          style="width:100%;height:5.906667rem;"
          :src="imgUrls[0] + '?imageMogr2/thumbnail/640x/strip/quality/100'"
          alt
        />
    <div class="tickets-info">
      <h3 class="tickets-name">{{detailData.nickName}}</h3>
      <!-- <h5 class="tickets-subtitle">{{detailData.subTitle}}</h5> -->
      <div class="ticket-detail-price">
        <em class="price-span">￥</em>
        <em class="price-number">{{detailData.merchantPrice}}</em>
        <em class="price-qi">起</em>
      </div>
    </div>
  
    <div class="tickets-content-list-wrap">
      <div :class='isFixed?"tickets-content-list-fixed":""'>
        <div class="tickets-content-list">
          <div class="tickets-content-item-wrap" @click='scrollTo("detail0",0)' :class="{'tickets-content-current':current==0}">
            <div class="tickets-content-item">
              详情
            </div>
          </div>
          <div class="tickets-content-item-wrap" @click='scrollTo("detail1",1)' :class="{'tickets-content-current':current==1}">
            <div class="tickets-content-item">
              须知
            </div>
          </div>
          <div class="tickets-content-item-wrap" @click='scrollTo("detail2",2)' :class="{'tickets-content-current':current==2}">
            <div class="tickets-content-item">
              评论
            </div>
          </div>
          <div class="tickets-content-block" :style="{'left': (33.3*current+16.65)+'%'}"></div>
        </div>
      </div>
      <div ref='refHeight' id='navBar'></div>
    </div>
    <div class="ticket-detail-warpper m-b-10" ref='detail0'>
      <h2 class="ticket-w-title">详情</h2>
      <div class="ticket-detail-box">
        <div v-html="proDetail"></div>
      </div>
    </div>
    <div class="ticket-detail-warpper m-b-10" ref='detail1'>
      <h2 class="ticket-w-title">须知</h2>
      <div class="ticket-detail-box">
        <div v-html="buyNotes"></div>
      </div>
    </div>
    <!-- 评论列表 -->
    <div
      ref='detail2'
    >
      <comment
        :data="commentData"
        mold="guide"
        :id="$route.query.id"
        :param="commentParam"
        :url="commentUrl"
      ></comment>
    </div>
     <!-- 购票提醒 -->
    <x-dialog v-model="noticeShow" class="dialog-demo">
      <div class="notice-body">
        <h2 class="notice-title">购票提醒</h2>
        <div class="notice-content" v-html="detailData.ticketNotice"></div>
        <div class="tickets-footer">
          <span @click="noticeShow=false" class="no-agree">不同意</span>
          <span @click="agree" class="agree">同意</span>
        </div>
      </div>
    </x-dialog>
    <div v-if="shardFlag" @click="closeModal" class="shard-where">
      <img src="@/assets/images/weixin_sharetip.png" alt />
    </div>

    <!-- 底部 -->
    <div class="footer-block"></div>
    <div class="f-b bottom-warpper">
      <!-- <div class="num-price">
        <div class="price">
          <span class="text">合计：</span>
          <div class="price-info">
            <span class="price-unit">￥</span>
            <span class="price-num">{{totalPrice}}</span>
          </div>
        </div>
      </div> -->
      <div>
        <!-- <expanded
          v-if="detailData.isBindQyyx=='T'&&expandedShow"
          :param="expandedParam"
          :wxshareinfo="wxshareinfo"
          @shardShow="showShard"
        ></expanded> -->
        <!-- <div class="detail-promoto"
             @click="expandShow(1)"
             v-if="(openSingle==='T'&&expandedShow)||(detailData.isBindQyyx=='T'&&expandedShow)">去赚钱</div> -->
        <button @click="order"
                type="button"
                class="order"
                :class="{active:number&&totalPrice}">立即预定</button>
      </div>
    </div>
    <!-- <float-nav :bindPromoterFlag.sync="bindPromoter" ></float-nav> -->
    <!-- <mutil-calendar ref="singeCalendar" @getDate="getAbleDate" :activeDate="playDate"></mutil-calendar> -->
  </div>
</template>
<script>
import { mapState } from "vuex";
import photo from "@/components/photo";
import floatNav from "@/components/floatNav";
import pageFooter from "@/components/custompage/footer.vue";
import comment from "@/components/comment";
// import slideCalendar from "@/components/slideCalendar"; // 滑动日期组件
// import slideCalendar from "@/components/ticketsSlideCalendar"; // 套票滑动日期组件
// import mutilCalendar from "@/components/mutilCalendar"; // 单票日历组件
import { isWxAli } from "@/common/common";
import { linkBaseUrl } from "../../../../config/index";
import { wxShare } from "@/common/wxshare";
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
    photo,
    Swiper,
    floatNav,
    pageFooter,
    SwiperItem,
    Popup,
    DatetimeView,
    Group,
    Calendar,
    XDialog,
    comment,
    // slideCalendar,
    // mutilCalendar
  },
  computed: {
    ...mapState({
      pageNoScroll: state => {
        //   console.log(state)
        return state.pageNoScroll;
      }
    })
  },
  data() {
    return {
      bindPromoter:false,
      footerShow: false,
      footerData: {},
      current: 0,
      refHeight: 0,
      documentScrollHeight: 0,
      isFixed: false,
      pxType: "",
      expandedShow: false, //是否展示推广
      shardFlag: false, //分享wx
      timeArr: [], //分时预约数组
      timeIndexArr: [],
      fsyuArr: [],
      indexArr: [],
      number: 1,
      addNum: 0,
      noticeStr: "",
      noticeShow: false,
      totalPrice: 0,
      itemData: [],
      show: false,
      wayType: 1,
      playDate: "",
      detailData: {},
      commentData: {},
      imgUrls: [],
      currentProduct: {}, // 当前查看产品详情
      proDetail: "", // 产品详情
      buyNotes: "", // 预定须知
      activeIndexArr: [], //缓存需要提示购票的下标index
      expandedParam: {
        businessId: this.$route.query.id,
        businessType: "park"
      },
      commentUrl: "",
      commentParam: {
        wayType: 1,
        productType: "guide",
        id: this.$route.query.id,
        leaguerId:
          localStorage.getItem("xjsc_login_userId_2019_3_8") ||
          this.$cookie.get("leaguerInfoId")
      },
      wxshareinfo: {},
      showPrice:false
    };
  },
  created() {
    document.title = "导游详情";
    this.commentUrl = this.api.main.comment.list;
    let _this = this;
    // 获取自定义导航
    this.getAxios(this.api.aiPapi.getUsePage, {
      pageType: "navigationPage",
      useRange: "wap"
    }).then(res => {
      if (res.data && res.data.content) {
        let data = JSON.parse(res.data.content);

        if (data.list && data.list.length) {
          this.footerShow = true;
          this.footerData = data;
        }
      }
    });
    let detailUrl = this.api.guide.detail.main;
    let dParam = {
      merchantInfoId: this.$route.query.m_id,
      merchantGuideInfoId	: this.$route.query.id
    };

    //产品详情
    let pd = this.postAxios(detailUrl, dParam);
    // 套票分组
    // this.getArr();
    Promise.all([pd])
      .then(result => {
        this.$nextTick(() => {
          window.addEventListener("scroll", () => {
            this.refHeight = this.$refs.refHeight?(this.$refs.refHeight.offsetTop?this.$refs.refHeight.offsetTop:450):450;
            this.documentScrollHeight =
              document.documentElement.scrollTop ||
              document.body.scrollTop ||
              window.pageYOffset;
            let height = window.innerHeight ||
              document.documentElement.clientHeight ||
              document.body.clientHeight;
            let offsetHeight = document.body.scrollHeight||document.documentElement.scrollHeight;
            let scrollHeight = this.documentScrollHeight;
            let offsetTop1 = this.$refs.detail1?(this.$refs.detail1.offsetTop?this.$refs.detail1.offsetTop:(this.$refs.refHeight.offsetTop?this.$refs.refHeight.offsetTop:450)):450;
            let offsetTop2 = this.$refs.detail2?(this.$refs.detail2.offsetTop?this.$refs.detail2.offsetTop:offsetTop1):offsetTop1;
            // let offsetTop3 = this.$refs.detail3?(this.$refs.detail3.offsetTop?this.$refs.detail3.offsetTop:offsetTop2):offsetTop2;
            if(scrollHeight>this.refHeight&&scrollHeight<(offsetTop1-42)){
              this.current = 0;
            }else if(scrollHeight>=(offsetTop1-42)&&scrollHeight<(offsetTop2-42)){
              this.current = 1;
            }else if(scrollHeight>=(offsetTop2-42)&&((scrollHeight+height)==offsetHeight)){
              this.current = 2;
            }
            if (this.documentScrollHeight >= this.refHeight) {
              this.isFixed = true;
            } else {
              this.isFixed = false;
            }
          });
        });

        _this.detailData = result[0].data;
        // _this.detailData.recommendReason = JSON.parse(_this.detailData.recommendReason);
        // _this.showPrice = result[0].data.isDisplayPrice === 'T' // 是否展示日历价格
        _this.imgUrls = result[0].data.carouselImg
          ? result[0].data.carouselImg
          : [];
        let contentStr = result[0].data.proDetail;
        this.totalPrice =result[0].data.merchantPrice
        wxShare({
          title: result[0].data.name ? result[0].data.name : "",
          desc: _this.detailData.subTitle ? _this.detailData.subTitle : "",
          imgUrl: _this.imgUrls.length ? _this.imgUrls[0] : ""
        });
        _this.wxshareinfo = {
          title: result[0].data.name ? result[0].data.name : "",
          desc: _this.detailData.subTitle ? _this.detailData.subTitle : "",
          imgUrl: _this.imgUrls.length ? _this.imgUrls[0] : ""
        };
        contentStr = contentStr.replace(
          /<img [^>]*src=['"]([^'"]+)[^>]*>/gi,
          function(match, capture) {
            //capture,返回每个匹配的字符串
            var newStr =
              '<img src="' +
              capture +
              "?imageMogr2/thumbnail/750x/strip/quality/100" +
              '" alt="" />';
            return newStr;
          }
        );
        _this.proDetail = contentStr;
        _this.buyNotes = result[0].data.orderNotice.replace(
          /<img [^>]*src=['"]([^'"]+)[^>]*>/gi,
          function(match, capture) {
            //capture,返回每个匹配的字符串
            var newStr =
              '<img src="' +
              capture +
              "?imageMogr2/thumbnail/750x/strip/quality/100" +
              '" alt="" />';
            return newStr;
          }
        );
        result[1].data.forEach(item => {
          var reg = /^(.{1}).*(.{1})$/;
          if (item.isAnonymous == "T") {
            item.userName = item.userName
              ? item.userName.replace(reg, "$1***$2")
              : "";
          }
        });
      })
      .catch(error => {});

  },
  destroyed() {
    window.addEventListener("scroll", null);
  },
  destroyed() {
    clearInterval(this.setIntervalTime);
  },
  methods: {
    scrollTo(detail, current) {
      window.scrollTo(0, this.$refs[detail].offsetTop-this.$refs.refHeight.clientHeight);
      this.$nextTick(() => {
      this.current = current;
      });
    },
    showShard(flag) {
      this.shardFlag = flag;
      this.show = true;
    },
    //打开地图
    openMap(latlnt, addr) {
      window.location.href =
        "//uri.amap.com/navigation?to=" +
        latlnt +
        "," +
        addr +
        "&mode=car&callnative=1";
    },
    order(){
      if (this.detailData && this.detailData.isShowTicketNotice && this.detailData.isShowTicketNotice === 'T') {
        this.noticeShow = true
      } else {
        this.agree()
      }
      
    },
    agree(){
      let url = "/order/guide?guideId="+this.$route.query.id+"&m_id="+this.$route.query.m_id+'&playDate='+this.getCurDate();
      let nextUrl = document.location.protocol + "//" +  window.location.host + "/vue" + url;
      this.checkToken(nextUrl).then(res => {
          //保证在登陆状态，详情页面跳转下单页面的时候缓存的下个页面地址被清除，防止换个店铺后token在过期状态下使用nextUrl进入别的地址
          localStorage.removeItem("xjsc_nextpath_2019_4_20");
          this.$router.push(url);
      });
    },
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
  }
};
</script>
<style lang="scss">
@import "../../../assets/styles/mixin.scss";

.vux-popup-dialog {
  z-index: 601 !important;
}
.tickets-detail {
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
      margin-bottom: 15px;
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
    .px-li-list {
      padding-top: 10px;
    }
    .px-li {
      @include fbc;
      padding: 0 15px;
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
      @include sc(14px, #413838);
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
  .footer-block {
    height: 49px;
  }
  .bottom-warpper {
    @include fbc;
    height: 49px;
    background: #333!important;
    justify-content: flex-end;
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
      strong,
      b {
        font-weight: 500;
      }
      em,
      i {
        font-style: normal;
      }
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
  .tickets-info {
    width: 100%;
    background-color: #fff;
    margin-bottom: 10px;
    padding-top: 12px;
    .tickets-name {
      @include sc(16px, #413838);
      line-height: 22px;
      padding-left: 10px;
      padding-right: 12px;
      font-weight: bold;
      @include oh;
    }
    .tickets-subtitle {
      @include sc(14px, #777777);
      line-height: 30px;
      padding-left: 10px;
      padding-right: 15px;
      @include oh;
    }
    .ticket-detail-price {
       @include sc(12px, #777777);
      padding-left: 10px;
      padding-right: 15px;
       font-weight: 500;
       .price-span {
          @include sc(10px, #FF6600);
       }
       .price-number {
          @include sc(24px, #FF6600);
          font-weight: bold;
          margin-left: -3px;
       }
    }
    .tickets-labels {
      padding-bottom: 12px;
      margin-left: 10px;
      padding-top: 5px;
      border-bottom: 1px solid #e1e1e1;
      .tickets-label {
        display: inline-block;
        padding: 0px 8px;
        font-size: 12px;
        background-color: #FFEFEA;
        color: #FF6633;
        line-height: 20px;
        margin-right: 4px;
      }
    }
    .tickets-sell-core {
      padding: 10px;
      padding-right: 15px;
      @include fbc;
      .tickets-core-wrap {
        margin-right: 7px;
        display: inline-block;
        color: #0086F6;
        font-size: 12px;
        span {
          font-weight: bold;
          font-size: 20px;
          line-height: 20px;
        }
      }
      .tickets-num {
        color: #777777;
        font-size: 12px;
      }
    }
  }
  .tickets-arr {
    background-color: #fff;
    padding-top: 1px;
    .tickets-arr-title {
      font-weight: bold;
      line-height: 35px;
      padding-left: 10px;
      @include sc(14px, #413838);
      background-color: #F8F8F8;
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
          border: 1px solid #FF9B7A;
          margin-right: 5px;
          @include sc(11px, #FF6633);
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
        color: #FF6600;
        span {
          font-size: 10px;
        }
      }
      .tickets-buy-btn {
        line-height: 32px;
        text-align: center;
        color: #fff;
        background-color: #F05B47;
      }
    }
    .tickets-content-last {
      border-bottom: none;
    }
  }
  .tickets-reason {
    padding-top: 10px;
    background-color: #fff;
    margin-bottom: 10px;
    .tickets-reason-title-wrap {
      background-color: #FAF7F1;
      margin: 0px 10px;
      .tickets-reason-title {
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-image: -webkit-gradient(linear, 0 0, 0 bottom, from(#F99854), to(#FF3A4D));
        // color: #FF3A4D;
        font-weight: bold;
        font-size: 16px;
        display: flex;
        align-items: center;
        height: 36px;
        img {
          display: inline-block;
          vertical-align: middle;
          width: 12px;
          height: 14px;
          margin-left: 10px;
          margin-right: 5px;
        }
      }
    }
    .tickets-reason-content {
      font-size: 14px;
      padding: 10px 0px;
      line-height: 28px;
      li {
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: bold;
        background-image: -webkit-gradient(linear, 0 0, 0 bottom, from(#F99854), to(#FF3A4D));
        span {
          display: inline-block;
          background: linear-gradient(to bottom, #F99854, #FF3A4D);
          vertical-align: middle;
          margin-left: 10px;
          margin-right: 7px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
        }
      }
    }
  }
  .tickets-content-list-wrap {
    height: 42px;
  }
  .tickets-content-list {
    padding-top: 5px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    border-bottom: 1px solid #E1E1E1;
    position: relative;
    .tickets-content-block {
      position: absolute;
      transition: 0.5s all;
      top: 39px;
      margin-left: -10px;
      width: 20px;
      line-height: 0px;
      font-size: 0px;
      height: 2px;
      background-color: #FC8778;
    }
    .tickets-content-item-wrap {
      flex-grow: 1;
      padding-bottom: 2px;
      color: #999;
      text-align: center;
      .tickets-content-item {
        line-height: 34px;
        font-size: 14px;
      }
    }
    .tickets-content-current {
      color: #F05B47;
    }
  }
  .tickets-content-list-fixed {
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
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
  .num-price {
    margin-left: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .select-num {
      @include sc(13px, white);
      height: 12px;
    }
    .price {
      @include sc(14px, white);
      .price-info {
        display: inline-block;
        .price-unit {
          @include sc(14px, white);
        }
        .price-num {
          @include sc(21px, white);
          font-weight: 800
        }
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
        background-color: #F8F8F8;
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
}
</style>


