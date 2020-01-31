<template>
  <div class="route-detail">
    <!-- auto loop -->
    <swiper height="4.69333rem"
            dots-position="center"
            v-if="imgs.length">
      <swiper-item class="swiper-demo-img"
                   v-for="(item, index) in imgs"
                   :key="index">
        <img class="s-img"
             v-error-img="item.url" />
      </swiper-item>
    </swiper>
    <!-- <img v-if="pageData.wapCarouselImg"
         class="t-img"
         :src="pageData.wapCarouselImg"
         alt> -->
    <div class="route-info">
      <div class="route-time vux-1px-b">乘车时间：{{orderDate.month}}-{{orderDate.day}} {{orderDate.week}}{{pageData.startTime}}</div>
      <div class="route-sites">
        <div @click="getGenerator(pageData.bgSiteCoordinate, pageData.bgSiteName)">
          <span class="route-site">{{pageData.bgSiteName}}</span>
          <span class="xx-icon icon-shouhuodizhi"></span>
        </div>
        <div class="route-arrow"
             @click="getSchedule">时刻表</div>
        <div @click="getGenerator(pageData.edSiteCoordinate, pageData.edSiteName)">
          <span class="route-site">{{pageData.edSiteName}}</span>
          <span class="xx-icon icon-shouhuodizhi"></span>
        </div>
      </div>
    </div>
    <!-- auto loop -->
    <swiper v-if="noticeList.length"
            height="1.06667rem"
            :show-dots="isDotShow"
            :auto="isSwiperAuto"
            :loop="isSwiperAuto">
      <swiper-item class="swiper-notice"
                   v-for="v in noticeList"
                   :key="v.id"
                   @click.native="showNoticeDetail(v)">
        <div class="notice-board">
          <div class="notice-board-icon">
            <i class="xx-icon icon-gonggao1"></i>
          </div>
          <div class="notice-board-txt">{{v.title}}</div>
        </div>
      </swiper-item>
    </swiper>
    <div class="line"></div>
    <div class="content">
      <div class="tab-list vux-1px-b">
        <div @click.stop="tabShow(0)"
             :class="{active:onIndex==0}"
             class="tab-item">
          <span class="tab-text">行程说明</span>
        </div>
        <div @click.stop="tabShow(1)"
             :class="{active:onIndex==1}"
             class="tab-item">
          <span class="tab-text">预订须知</span>
        </div>
        <div @click.stop="tabShow(2)"
             :class="{active:onIndex==2}"
             class="tab-item">
          <span class="tab-text">费用说明</span>
        </div>
      </div>
      <div class="content-warper">
        <div class="rice-text-content"
             v-html="pageData.routeIntr"
             v-if="onIndex==0"></div>
        <div class="rice-text-content"
             v-html="pageData.orderNotice"
             v-if="onIndex==1"></div>
        <div class="rice-text-content"
             v-html="pageData.freeIntr"
             v-if="onIndex==2"></div>
      </div>
    </div>
    <div class="bottom-btn">
      <div class="price">
        <span>￥</span>
        <span class="num">{{pageData.priceRetail}}</span>
        <span>元/人</span>
      </div>
      <button class="order-btn"
              @click="submit"
              type="button">立即预订</button>
    </div>
    <!-- notice details -->
    <notice-details ref="notice">{{noticeDetail}}</notice-details>
  </div>
</template>
<script>
import { Popup, Swiper, SwiperItem } from "vux";
import calendar from "./components/calendaer";
import noticeDetails from "./components/notice.vue";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  components: {
    Popup,
    calendar,
    Swiper,
    SwiperItem,
    noticeDetails
  },
  computed: {
    ...mapState('traffic/', ['orderDate'])
  },
  data () {
    return {
      imgs: [],
      onIndex: 0,
      show: false,
      pageData: {},
      noticeList: [],
      isDotShow: false,
      isSwiperAuto: true,
      noticeDetail: "",
      // errorUserPhoto:'this.src="' + require('../../assets/images/none-pic.jpg') + '"', //加载图片报错时处理方法
    };
  },
  created () {
    this.getData();
  },
  methods: {
    ...mapMutations('traffic/', ['setLineIno']),
    ...mapActions('traffic/', ['emptyData']),
    submit () {
      //清空下一个页面缓存的数据
      this.emptyData()

      this.$router.push("/traffic_order");
      // let urlDir = "/";
      // if (process.env.NODE_ENV === "production") {
      //   urlDir = "/vue/";
      // }
      // let nextPath =
      //   window.location.protocol +
      //   "//" +
      //   window.location.host +
      //   urlDir +
      //   "order?pid=" +
      //   this.$route.query.pid +
      //   "&trainId=" +
      //   this.$route.query.trainId +
      //   "&corpCode=" +
      //   window.localStorage.getItem("xjt_vue_2019_6_6_corpCode");
      // // console.log(nextPath);
      // // 正式环境url跳转，本地可能不可用------
      // let _url =
      //   this.baseUrl + "?redir=" + encodeURIComponent(nextPath);
      // window.location.href = _url;
      // window.localStorage.setItem("xjt_visitor_login_url", _url);
      // -------------

      // if (process.env.NODE_ENV === "production") {
      //   let _url = window.location.protocol +
      //     "//" +
      //     window.location.host +
      //     "/traffic?redir=" +
      //     encodeURIComponent(nextPath);
      //   //正式环境
      //   window.location.href = _url;
      //   window.localStorage.setItem("xjt_visitor_login_url", _url);

      //   // http://altwap.sendinfo.com.cn/traffic?redir=https://www.baidu.com
      // } else {
      //   //本地开发环境
      //   this.checkToken(nextPath).then(res => {
      //     this.$router.push("/order?pid=" + this.$route.query.pid);
      //   });
      // }
      // } else {
      //   this.$vux.toast.text("暂无班次");
      // }
    },
    getNotice (routeCode) {
      this.getAxios("/merchant/api/traffic/getAnnounce", {
        channel: "classesDetails", //站内推送
        routeCode: routeCode
      }).then(res => {
        this.noticeList = res.data && res.data.length ? res.data : [];
      });
    },
    showNoticeDetail (v) {
      this.noticeDetail = v.announceContent;
      this.$refs.notice.show = true;
    },
    tabShow (index) {
      this.onIndex = index;
    },
    getData () {
      this.getAxios("/merchant/api/traffic/getProductDetail", {
        id: this.$route.query.pid,
        bgSiteCode: this.$route.query.bgSiteCode,
        edSiteCode: this.$route.query.edSiteCode,
        travelDate: this.orderDate.date,
      }).then(res => {
        const LineInfo = res.data
        this.pageData = LineInfo;
        this.setLineIno(LineInfo)
        this.imgs = LineInfo.pictures;
        document.title = LineInfo.bgSiteName + "-" + LineInfo.edSiteName;
        this.getNotice(LineInfo.routeCode);
      });
    },
    getSchedule () {
      this.$router.push(`/traffic_schedule?trainId=${this.pageData.trainNumberCode}&routeCode=${this.pageData.routeCode}`);
    },
    // 调起导航
    getGenerator (position, name) {
      if (position.indexOf(",") < 0) {
        this.$vux.toast.text("暂无该站点位置信息");
      } else {
        let [lat, lng] = position.split(",");
        this.$router.push(`/traffic_map?lng=${lng}&lat=${lat}&sitename=${name}`);
      }
    }
  },
  watch: {
    imgs: function (newval) {
      console.log(newval)
    }
  }
};
</script>
<style lang="scss">
.route-detail {
  margin-bottom: 55px;
  background: #fff;
  .s-img {
    height: 176px;
    width: 100%;
  }
  .vux-slider {
    .vux-indicator {
      a {
        .vux-icon-dot {
          background-color: rgba(255, 255, 255, 0.3);
        }
        .vux-icon-dot.active {
          background-color: #ff9900;
        }
      }
    }
  }
  .route-info {
    padding: 10px 15px;
    .route-time {
      font-size: 12px;
      height: 35px;
      line-height: 35px;
      // border-bottom: 1px solid #ccc;
      color: #353535;
    }
    .route-sites {
      display: flex;
      align-items: center;
      justify-content: space-around;
      font-size: 16px;
      height: 70px;
    }
    .route-site {
      font-weight: 700;
      max-width: 125px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      display: inline-block;
      vertical-align: middle;
    }
    .route-arrow {
      border-radius: 15px;
      height: 15px;
      width: 45px;
      font-size: 12px;
      text-align: center;
      color: #489eeb;
      border: 1px solid #489eeb;
      background: #fff;
      margin: 0 10px;
      position: relative;
      &::before,
      &::after {
        content: "";
        position: absolute;
        left: -10px;
        top: 50%;
        transform: translateY(-50%);
        width: 10px;
        height: 1px;
        background-color: #489eeb;
      }
      &::after {
        left: 46px;
      }
    }
    .iconfont {
      color: #489eeb;
      vertical-align: middle;
      font-size: 12px;
    }
  }
  .bottom-btn {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 45px;
    background: #fff;
    display: flex;
    align-items: center;
    border-top: 1px solid #dadae1;
    justify-content: space-between;
    .price {
      flex: 1;
      display: flex;
      font-size: 12px;
      color: #de6550;
      align-items: baseline;
      padding-left: 15px;
      .num {
        font-size: 17px;
      }
    }
    .order-btn {
      width: 140px;
      text-align: center;
      height: 45px;
      line-height: 45px;
      font-size: 17px;
      color: #fff;
      background: #de6550;
      border: none;
    }
  }
  .t-img {
    height: 176px;
    width: 100%;
    display: block;
  }
  .line {
    height: 10px;
    background: #f1f1f1;
  }
  .content {
    .content-warper {
      .rice-text-content {
        padding: 20px 15px;
        img {
          width: 100%;
        }
      }
    }
    .tab-list {
      display: flex;
      // border-bottom: 1px solid #dadae1;
      .tab-item {
        flex: 1;
        text-align: center;
        &.active {
          .tab-text {
            color: #489eeb;
            &::after {
              content: "";
              height: 2px;
              width: 100%;
              position: absolute;
              left: 0;
              bottom: 0;
              background: #489eeb;
            }
          }
        }
        .tab-text {
          display: inline-block;
          position: relative;
          font-size: 15px;
          color: #666;
          height: 45px;
          line-height: 45px;
        }
      }
    }
  }
  .notice-board {
    height: 40px;
    background-color: #fff5f5;
    display: flex;
    align-items: center;
    padding: 0 15px;
    line-height: 1.2;
    .icon-gonggao {
      color: #ff6633;
      font-size: 12px;
      line-height: 1.2;
    }
    .icon-arrow-r {
      color: #999;
    }
    .notice-board-txt {
      flex: 1;
      font-size: 12px;
      color: #403e3e;
      min-width: 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding: 0 5px;
    }
  }
}
</style>
