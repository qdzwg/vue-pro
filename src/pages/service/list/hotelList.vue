<template>
    <div class="list-warper-hotel">
        <transition name="draw">
            <div v-if="show" class="mask" @click="hideCalendar">
                <Calendar clean now range @select="select" :begin="begin" ref="calendar" />
            </div>
        </transition>
        <four-month @getDate="select" ref="calendar"></four-month>
        <popup class="showFilter" v-model="showFilter" position="top">

            <div class="maskFilter">
                <div class="hotelType">
                    <div class="hotelType-title">酒店类型</div>
                    <checker v-model="hotelTypeList" type="checkbox" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
                        <checker-item @on-item-click="selectType" v-for="item in hotelType" :value="item.value" :key="item.value">{{ item.label }}</checker-item>
                    </checker>

                </div>
                <div class="hotelType">
                    <div class="hotelType-title">酒店星级</div>
                    <checker v-model="hotelLeaveList" type="checkbox" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
                        <checker-item @on-item-click="selectLeave" v-for="item in hotelLeave" :value="item.value" :key="item.value">{{ item.label }}</checker-item>
                    </checker>
                </div>
                <div class="filter-handle">
                    <span @click="hideFilter">确认</span>
                </div>
            </div>

        </popup>
        <div class="hotel-date">
            <div class="hotel-item" @click="showCalendar">
                <div class="date-box ">
                    <span>住</span>
                    <span class="date-text"> {{beginDate.substring(5)}}</span>
                </div>
                <div class="date-box">
                    <span>离</span>
                    <span class="date-text"> {{endDate.substring(5)}}</span>
                </div>
            </div>
            <div class="search-warper">
                <input v-model="searchword" class="search-input" placeholder="搜索" type="text" @keyup.enter="search">
                <i @click="search" class="xx-icon icon-ico-search search-icon"></i>
            </div>
            <div class="hotel-filter-warper" @click="hotelFilter">
                <span>筛选</span>
                <i class="xx-icon icon-shaixuan"></i>
            </div>

        </div>
        <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" class="scrollView">
            <div class="good-list">
                <div @click="godetail(item)" v-for="(item,index) in dataList" :key="index" class="good-item clearfix">
                    <img class="fl good-img" :src="item.linkMobileImg + '?imageMogr2/thumbnail/640x/strip/quality/100'" alt>
                    <div class="good-detail">
                        <div class="good-title">{{item.nickName}}</div>
                        <div class="scenic-distance clearfix">
                            <span class="fl">{{item.areaName}}</span>
                            <span v-if="item.hotelLevel&&item.hotelLevel!=0" class="hotel-star"> {{item.hotelLevel}}星</span>
                        </div>
                        <div class="good-sell">
                            <div class="buy-num">{{item.fictSaleNum}}人已购买</div>
                            <div class="price-num">
                                <span class="unit">￥</span>
                                <span class="price">{{item.priceShow}}</span>
                                <span style="color:#999">起</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </mescroll-vue>

    </div>
</template>

<script>
import Calendar from "mpvue-calendar";
import "mpvue-calendar/src/browser-style.css";
import MescrollVue from "mescroll.js/mescroll.vue";
import { XHeader, XInput, Popup, Checker, CheckerItem } from "vux";
import { setTimeout } from "timers";
import fourMonth from "@/components/fourMonthSelect";
export default {
  components: {
      fourMonth,
    MescrollVue,
    XHeader,
    XInput,
    Calendar,
    Popup,
    Checker,
    CheckerItem
  },
  created() {
    document.title = "酒店列表";
    // console.log(this.$route);
    // console.log(new Date().getTime() - 1 * 24 * 60 * 60 * 1000);
  },
  data() {
    return {
      hotelType: [
        {
          value: "all",
          label: "全部"
        },
        {
          value: 19,
          label: "米其林餐厅"
        },
        {
          value: 6,
          label: "温泉酒店"
        },
        {
          value: 4,
          label: "别墅"
        },

        {
          value: 2,
          label: "客栈"
        },
        {
          value: 1,
          label: "公寓"
        },
        {
          value: 3,
          label: "民居"
        }
      ],
      hotelLeave: [
        {
          value: "all",
          label: "全部"
        },
        {
          value: 0,
          label: "无"
        },
        {
          value: 1,
          label: "1星级"
        },
        {
          value: 2,
          label: "2星级"
        },

        {
          value: 3,
          label: "3星级"
        },
        {
          value: 4,
          label: "4星级"
        },
        {
          value: 5,
          label: "5星级"
        }
      ],
      hotelTypeList: ["all"],
      hotelLeaveList: ["all"],
      showFilter: false,
      show: false,
      beginDate: this.GetDateStr(0),
      endDate: this.GetDateStr(1),
      begin: this.GetbDate(),
      searchword: "",
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
  beforeRouteEnter(to, from, next) {
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
    next(vm => {
      vm.$refs.mescroll.beforeRouteEnter(); // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
    });
  },
  beforeRouteLeave(to, from, next) {
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
    this.$refs.mescroll.beforeRouteLeave(); // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
    next();
  },
  methods: {
    selectType(val) {
      if (val == "all") {
        this.hotelTypeList = ["all"];
      } else {
        if (val != val) this.hotelTypeList.push(val);
        var index = this.hotelTypeList.indexOf("all");
        if (index >= 0) {
          this.hotelTypeList.splice(index, 1);
        }
      }
    },
    selectLeave(val){
         if (val == "all") {
        this.hotelLeaveList = ["all"];
      } else {
        if (val != val) this.hotelLeaveList.push(val);
        var index = this.hotelLeaveList.indexOf("all");
        if (index >= 0) {
          this.hotelLeaveList.splice(index, 1);
        }
      }
    },
    godetail(item) {
      window.localStorage.setItem("selectBegin", this.beginDate);
      window.localStorage.setItem("selectEnd", this.endDate);
      this.$router.push(
        "/detail/hotel?id=" + item.id + "&productCode=" + item.productCode
      );
    },

    search() {
      this.keyword = this.searchword;
      //滚动到顶部
      this.mescroll.scrollTo(0, 0);
      this.upCallback(
        { num: 1, size: this.mescrollUp.page.size },
        this.mescroll
      );
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    upCallback(page, mescroll) {
      this.getAxios("/merchant/api/merchantHotelInfo/merchantHotelInfoGrid", {
        currPage: page.num,
        pageSize: page.size,
        beginDate: this.beginDate,
        endDate: this.endDate,
        modelName: this.keyword,
        hotelType:this.hotelTypeList.join(',')=='all'?'':this.hotelTypeList.join(','),
        hotelLevel:this.hotelLeaveList.join(',')=='all'?'':this.hotelLeaveList.join(','),
      })
        .then(response => {
          // console.log(response);
          // 请求的列表数据
          let arr = response.data.rows;
          // console.log(arr.length);
          // 如果是第一页需手动制空列表
          if (page.num === 1) this.dataList = [];
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
        .catch(e => {
          // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          mescroll.endErr();
        });
    },
    //获取当前日期格式yyyy-mm-dd
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
    //获取当前日期格式[yyyy,mm,dd]
    GetbDate() {
      var dd = new Date();
      var y = dd.getFullYear();
      var m = dd.getMonth() + 1;
      var d = dd.getDate();
      return [y, m, d];
    },
    //筛选
    hotelFilter() {
      this.showFilter = true;
    },
    hideFilter() {
      this.showFilter = false;
      this.search()
    },
    //日历选择
    showCalendar() {
    //   this.show = true;
      this.$refs.calendar.show();
    },
    hideCalendar() {
      this.show = false;
    },
    select(val, val2) {
      // console.log("准备发起请求！");
      this.beginDate =val
      this.endDate = val2;
      window.localStorage.setItem("selectBegin", val);
      window.localStorage.setItem("selectEnd", val2);
      this.upCallback(
        { num: 1, size: this.mescrollUp.page.size },
        this.mescroll
      );
    //   setTimeout(() => {
    //     this.hideCalendar();
    //   }, 500);
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
    }
  }
};
</script>

<style lang="scss" scoped>
.list-warper-hotel {
  // padding-top: 49px;
  height: auto;
  .mask,
  .maskFilter {
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
  .mescroll {
    position: fixed;
    // padding-bottom: 1rem;
    top: 58px;
    bottom: 0;
    height: auto;
  }
  .showFilter.vux-popup-dialog {
    z-index: 501 !important;
  }
  .maskFilter {
    height: 330px;
    background-color: #fff;
    position: relative;
    .hotelType {
      padding: 12px;
      border-bottom: 1px solid #dcdcdc;
      overflow: hidden;
      .hotelType-title {
        color: #19a0f0;
      }
      .demo1-item {
        float: left;
        border: 1px solid #ccc;
        color: #666;
        border-radius: 5px;
        padding: 3px 10px;
        margin: 0.3rem;
        line-height: 0.5rem;
        text-align: center;
      }
      .demo1-item-selected {
        color: #19a0f0;
        border: 1px solid #19a0f0;
      }
    }
    .filter-handle {
      height: 1.3rem;
      line-height: 1.3rem;
      font-size: 16px;
      text-align: center;
      color: #19a0f0;
    }
  }
  .hotel-date {
    // height: 54px;
    padding-top: 12px;
    height: 1.3rem;
    display: flex;

    .hotel-item {
      padding: 0 12px;
      // height:1.3rem;
      //    justify-content: center;
      .date-box {
        width: 1.3rem;
        background-color: #fff;
        color: #413838;
        .date-text {
          font-size: 12px;
          display: inline-block;
          vertical-align: middle;
          color: #f05b47;
        }
      }
    }

    .search-warper {
      background: #f7f7f7;
      width: 60%;
      position: relative;
      .search-icon {
        position: absolute;
        font-size: 18px;
        top: 8px;
        right: 15.5px;
        color: #c4c4c4;
      }
      .search-input {
        padding: 0 5px;
        outline: none;
        border: none;
        width: calc(100% - 10px);
        height: 34px;
        text-align: center;
        border-radius: 2px;
        border-left: 1px solid #eeeee7;
      }
      ::-webkit-input-placeholder {
        text-align: center;
      }
      :-moz-placeholder {
        /* Firefox 18- */
        text-align: center;
        color: #999;
        font-size: 13px;
      }
      ::-moz-placeholder {
        text-align: center;
        /* Firefox 19+ */
        color: #999;
        font-size: 13px;
      }
      :-ms-input-placeholder {
        text-align: center;
        color: #999;
        font-size: 13px;
      }
    }
    .hotel-filter-warper {
      height: 100%;
      padding-left: 0.4rem;
      font-size: 15px;
      color: #f05b47;
      line-height: 1rem;
      cursor: pointer;
    }
  }
  .good-list {
    .good-item {
      background: #fff;
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0;
      }
      .good-img {
        width: 156px;
        height: 100px;
      }
      .good-detail {
        margin-left: 156px;
        height: 93px;
        width: calc(100% - 156px);
        padding-top: 7px;
        position: relative;
        .good-title {
          font-size: 16px;
          color: #413838;
          padding-left: 12px;
          padding-right: 9px;
          word-break: break-all;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          /* ! autoprefixer: off */
          -webkit-box-orient: vertical;
          /* autoprefixer: on */
          overflow: hidden;
          line-height: 18px;
        }
        .scenic-distance {
          font-size: 10px;
          color: #f05b47;
          font-family: PingFangSC-Regular, sans-serif;
          padding-top: 3px;
          padding-bottom: 4px;
          margin-left: 10px;
          .fl {
            width: 100%;
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .distance-icon {
            display: inline;
          }
          .hotel-star {
            margin-left: 5px;
          }
        }

        .good-sell {
          position: absolute;
          bottom: 13px;
          left: 0;
          padding-left: 12px;
          padding-right: 9px;
          width: calc(100% - 21px);
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          .buy-num {
            font-size: 10px;
            color: #999;
          }
          .price-num {
            color: #f05b47;
            .price {
              font-size: 18px;
            }
          }
        }
      }
    }
  }
}
</style>
