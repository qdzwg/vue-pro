<template>
  <div class="route-list-page">
    <div class="header">
      <div v-for="(item,index) in dayArr"
           :key="index"
           :class="['header-item',activeDateIndex==index?'active':'']"
           @click="clickDate(index)">
        <div>
          <div class="date">{{item.month>=10?item.month:"0" + item.month}}-{{item.day>=10?item.day:"0" + item.day}}</div>
          <div class="week">{{item.week}}</div>
        </div>
      </div>
      <div @click="selectDate"
           class="header-item header-more">
        <div class="icon-box">
          <i class="xx-icon icon-rili"></i>
          <i class="xx-icon icon-xiangxiajiantou"></i>
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
    <mescroll-vue ref="mescroll"
                  :down="mescrollDown"
                  :up="mescrollUp"
                  @init="mescrollInit"
                  class="scrollView"
                  :style="noticeList.length == 0 ? 'top:1.6000rem':'top:2.66667rem'">
      <ul class="route-list">
        <li class="route-item vux-1px-b"
            v-for="(item,index) in dataList"
            :key="index"
            @click="goDetail(item)">
          <div class="route-site-info">
            <span class="time">{{item.startTime}}</span>
            <div class="site-name">
              <span class="name">{{item.bgSiteName}}</span>
              <i class="line"></i>
              <span class="name">{{item.edSiteName}}</span>
            </div>
            <span class="price-wrap">
              <i>￥</i>
              <i class="price">{{item.priceRetail || '0.00'}}</i>
            </span>
          </div>
          <p class="route-name">{{item.routeName}}</p>
        </li>
      </ul>
    </mescroll-vue>
    <div class="no-route"
         v-if="!dataList.length">暂无数据</div>
    <calendar @dateChange="getDate"
              ref="calendar"></calendar>
    <!-- notice details -->
    <notice-details ref="notice">{{noticeDetail}}</notice-details>
  </div>
</template>

<script>
import MescrollVue from "mescroll.js/mescroll.vue";
import calendar from "./components/calendaer.vue";
import { Calendar, Swiper, SwiperItem } from "vux";
import noticeDetails from "./components/notice.vue";
import { mapMutations } from "vuex";
export default {
  components: {
    calendar,
    MescrollVue,
    Calendar,
    Swiper,
    SwiperItem,
    noticeDetails
  },
  watch: {},
  created () {
    document.title =
      this.$route.query.startSite + "-" + this.$route.query.endSite;
    if (this.$route.query.date) {
      this.selectedDate = this.$route.query.date;
    } else {
      this.selectedDate = this.getCurDate();
    }
    this.getNotice();
    this.getAfterthree();
  },
  data () {
    return {
      selectedDate: "",
      activeDateIndex: 0,
      isDotShow: false,
      isSwiperAuto: true,
      noticeList: [],
      noticeDetail: "",
      dayArr: [],
      keyword: "",
      dataList: [],
      mescroll: null, // mescroll实例对象
      mescrollDown: {}, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
      mescrollUp: {
        // 上拉加载的配置.
        callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
        //以下是一些常用的配置,当然不写也可以的.
        page: {
          num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 6 //每页数据条数,默认10
        },
        noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
        // toTop: {
        //   //回到顶部按钮
        //   src: "http://statics.lotsmall.cn/image/20181219/20181219111919wvv3zy.jpeg", //图片路径,默认null,支持网络图
        //   offset: 1000 //列表滚动1000px才显示回到顶部按钮
        // },
        htmlNodata: '<p class="upwarp-nodata">加载完成</p>',
        htmlContent:
          '<p class="downwarp-progress"></p><p class="downwarp-tip">下拉刷新 </p>', //布局内容
        empty: {
          //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          // warpId: "xxid", //父布局的id (1.3.5版本支持传入dom元素)
          // icon: "./static/mescroll/mescroll-empty.png", //图标,默认null,支持网络图
          tip: "暂无相关数据" //提示
        }
      }
    };
  },
  beforeRouteEnter (to, from, next) {
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
    next(vm => {
      vm.$refs.mescroll.beforeRouteEnter(); // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
    });
  },
  beforeRouteLeave (to, from, next) {
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
    this.$refs.mescroll.beforeRouteLeave(); // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
    next();
  },
  methods: {
    ...mapMutations('traffic/', ['setOrderDate']),
    goDetail (item) {
      let date = this.dayArr[this.activeDateIndex];
      date.month = date.month < 10 ? "0" + date.month : date.month;
      date.day = date.day < 10 ? "0" + date.day : date.day;
      date.time = item.startTime;
      date.date = `${date.year}-${date.month}-${date.day} `
      this.setOrderDate(date)
      this.$router.push(
        `/traffic_detail?pid=${item.id}&bgSiteCode=${item.bgSiteCode}&edSiteCode=${item.edSiteCode}`
      );
    },
    clickDate (index) {
      this.activeDateIndex = index;
      //滚动到顶部
      this.mescroll.scrollTo(0, 0);
      this.upCallback(
        { num: 1, size: this.mescrollUp.page.size },
        this.mescroll
      );
    },
    getNotice () {
      this.getAxios("/merchant/api/traffic/getAnnounce", {
        channel: "instationMsg" //站内推送
      }).then(res => {
        this.noticeList = res.data && res.data.length ? res.data : [];
      });
    },
    showNoticeDetail (v) {
      this.noticeDetail = v.announceContent;
      this.$refs.notice.show = true;
    },
    //计算日期，往后推五天
    getAfterthree () {
      let weekday = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六"
      ];
      // let date = this.getCurDate();
      let arr = this.selectedDate.split("-");
      let year = parseInt(arr[0]),
        month = parseInt(arr[1]),
        day = parseInt(arr[2]);
      // 获取当前月份的最大天数
      let maxDay = new Date(year, month, 0).getDate();
      this.dayArr = [];
      for (let i = 0; i < 5; i++) {
        let aDay = day + i,
          aMonth = month,
          aYear = year;
        if (aDay > maxDay) {
          aDay = aDay - maxDay;
          aMonth++;
          if (aMonth > 12) {
            aMonth = 1;
            aYear++;
          }
        }
        let aDate =
          aYear +
          "-" +
          (aMonth >= 10 ? aMonth : "0" + aMonth) +
          "-" +
          (aDay >= 10 ? aDay : "0" + aDay);
        let weekIndex = new Date(aDate).getDay();
        // 判断是否是今天
        let duringTime =
          new Date(aDate).valueOf() - new Date(this.getCurDate()).valueOf();
        let showDay = weekday[weekIndex];
        if (duringTime == 0) {
          showDay = "今天";
        } else if (duringTime == 86400000) {
          showDay = "明天";
        } else if (duringTime == 172800000) {
          showDay = "后天";
        }
        this.dayArr.push({
          weekIndex: weekIndex,
          week: showDay,
          year: aYear,
          month: aMonth,
          day: aDay
        });
      }
      this.activeDateIndex = 0;
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
    getDate (day) {
      this.selectedDate = day.date;
      this.getAfterthree();
      //滚动到顶部
      this.mescroll.scrollTo(0, 0);
      this.upCallback(
        { num: 1, size: this.mescrollUp.page.size },
        this.mescroll
      );
    },
    selectDate () {
      this.$refs.calendar.show();
    },
    mescrollInit (mescroll) {
      this.mescroll = mescroll;
    },
    upCallback (page, mescroll) {
      let dateData = this.dayArr[this.activeDateIndex]
      let month = dateData.month < 10 ? ('0' + dateData.month) : dateData.month;
      let day = dateData.day < 10 ? ('0' + dateData.day) : dateData.day
      let travelDate = dateData.year + '-' + month + '-' + day
      this.getAxios("/merchant/api/traffic/searchTrafficLine", {
        currPage: page.num,
        pageSize: page.size,
        bgSiteName: this.$route.query.startSite,
        edSiteName: this.$route.query.endSite,
        travelDate: travelDate
      })
        .then(response => {
          let arr = response.data;
          // 如果是第一页需手动制空列表
          if (page.num === 1) {
            this.dataList = [];
            // if (arr.length) {
            //   //存在数据
            //   wxShare({
            //     title: "景区列表",
            //     desc: "",
            //     imgUrl: arr[0].linkMobileImg ? arr[0].linkMobileImg : ""
            //   });
            // } else {
            //   wxShare({
            //     title: "景区列表",
            //     desc: "",
            //     imgUrl: ""
            //   });
            // }
          }
          // 把请求到的数据添加到列表
          this.dataList = this.dataList.concat(arr);
          // 数据渲染成功后,隐藏下拉刷新的状态
          this.$nextTick(() => {
            if (this.dataList.length >= response.data.total) {
              mescroll.endSuccess(0);
            } else {
              mescroll.endSuccess(arr.length);
            }
          });
        })
        .catch(() => {
          // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          mescroll.endErr();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.route-list-page {
  .header {
    background: #fff;
    display: flex;
    height: 50px;
    align-items: center;
    .header-item {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      text-align: center;
      font-size: 12px;
      color: #353535;
      height: 100%;
      &.active {
        color: #fff;
        background: #de6550;
        border-radius: 5px 5px 0 0;
      }
      .icon-box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .icon-rili {
          font-size: 20px;
          line-height: 20px;
        }
        .icon-xiangxiajiantou {
          width: 30px;
          height: 10px;
          font-size: 14px;
        }
      }
    }
    .header-more {
      box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.2);
    }
  }
  .line {
    height: 10px;
    background: #f1f1f1;
  }
  .no-route {
    text-align: center;
    margin-top: 10px;
    font-size: 12x;
    color: #666;
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
  .route-list {
    padding: 0 15px;
    background: #fff;
    .route-item {
      padding-bottom: 5px;
      .route-site-info {
        height: 40px;
        display: flex;
        font-size: 16px;
        .time {
          width: 72px;
          font-weight: 700;
          line-height: 40px;
        }
        .price-wrap {
          color: #de6550;
          width: 72px;
          line-height: 40px;
          i {
            font-size: 12px;
            font-style: normal;
          }
          .price {
            font-size: 16px;
          }
        }
        .site-name {
          flex: 1;
          display: flex;
          align-items: center;
          font-size: 14px;
          line-height: 20px;
          .line {
            width: 20px;
            height: 1px;
            background-color: #4a9de9;
          }
          .name {
            flex: 1;
            padding: 0 5px;
            text-align: center;
          }
        }
      }
      .route-name {
        height: 20px;
        line-height: 20px;
        font-size: 12px;
        color: #999;
        word-break: break-all;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        text-align: center;
      }
    }
  }
  .mescroll {
    position: fixed;
    top: 100px;
    bottom: 0;
    height: auto;
  }
}
</style>
