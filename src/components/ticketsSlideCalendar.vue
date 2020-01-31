<template>
  <div class="slide-calendar tickets-slide-calendar">
    <div class="slide-calendar-warp tickets-slide-calendar-wrap">
      <div class="slide-calendar-list tickets-slide-calendar-list">
        <swiper :options="swiperOption" ref="mySwiper" @click.prevent="selectedDate">
          <!-- slides -->
          <!-- {{slideDate}} -->
          <swiper-slide
            v-for="(item,index) in swiperDate"
            :key="index"
            :class="{
              'active':swiperActiveIndex === index && ((typeof item.salePrice !== 'undefined')),
              'gray':!(typeof item.salePrice !== 'undefined')}"
          > 
            <div class="swiper-slide-time">{{item.week+item.date}}</div>
            <div v-if="showPrice && typeof item.salePrice !== 'undefined'" class="swiper-slide-price">￥{{item.salePrice}}起</div>
            <!-- <div v-else class="swiper-slide-week">{{item.week}}</div> -->
          </swiper-slide>
        </swiper>
      </div>
      <div class="slide-calendar-box tickets-slide-calendar-box" @click="moreCalendar">更多日期</div>
    </div>
    <singel-calender ref="calendar" @initDate="initDate" :url="url" :showPrice="showPrice"  @getDate="getSingeDate" :singeDate="curDate"></singel-calender>
  </div>
</template>
<script>
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { InlineCalendar, Popup } from "vux";
import singelCalender from "@/components/singelCalenderTickets";
export default {
  components: { 
    swiper,
    swiperSlide,
    InlineCalendar,
    Popup,
    singelCalender
  },
  props: {
    slideDate: {
      type: String,
      default: "" //默认值
    },
    url:{
      type: String,
      default: ""
    },
    showPrice:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      swiperOption: {
        // centeredSlides: true,
        slidesPerView: 3,
        spaceBetween: 3,
        grabCursor: true,
        freeMode: true,
        // slideToClickedSlide: true,
        normalizeSlideIndex: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        }
      },
      curDate: this.slideDate,
      popupShow: true,
      swiperDate: [],
      swiperActiveIndex: 0,
      currentdate: "",
    };
  },
  watch: {
    slideDate(val) {
      this.curDate = val
      // this.getDaysInfo(10, new Date(val));
    },
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    },
    width() {
      return this.$refs.mySwiper.$el.offsetWidth;
    }
  },
  created() {
    this.getCurDate();
    this.getDaysInfo(3, new Date(this.slideDate));
  },
  mounted() {
    this.swiperOption.slidesPerView = parseInt(
      this.$refs.mySwiper.$el.offsetWidth / 84
    );
    // if (this.swiperOption.slidesPerView !== 3) {
    //   this.swiper.update()
    // }
  },
  methods: {
    initDate(val){
      if (!(val instanceof Array)) return
      let dayArray = this.curDate.split("-");
      let initDate = new Date(
        dayArray[0],
        parseInt(dayArray[1]) - 1,
        dayArray[2]
      );
      this.getDaysInfo(3, initDate, val);
    },
    // 打开日历弹框
    moreCalendar() {
      this.$refs.calendar.show(this.curDate) 
    },
    selectedDate() {
      let { activeIndex, clickedIndex , clickedSlide} = this.swiper;
      
      if (Array.from(clickedSlide.classList).indexOf('gray') !== -1) return
      if (this.swiperActiveIndex === clickedIndex) return
      this.swiperActiveIndex = clickedIndex;
      this.curDate = this.swiperDate[clickedIndex].yyyymmdd;
      this.$emit("selectCalendar", this.curDate, this.swiperDate[clickedIndex].salePrice);
    },
    getSingeDate({day,libsDay}) {
      this.swiper.slideTo(0);
      this.curDate = day.date;
      let dayArray = this.curDate.split("-");
      let initDate = new Date(
        dayArray[0],
        parseInt(dayArray[1]) - 1,
        dayArray[2]
      );

      this.swiperActiveIndex = 0;
      this.getDaysInfo(3, initDate, libsDay);
    },
    /**
     * 获取n天的日期数据
     */
    getDaysInfo(n, date, libsDay) {
      let nowTimes =
        typeof date !== "undefined" ? date.getTime() : new Date().getTime();
      let dateArray = [];
      for (let i = 0; i < n; i++) {
        let buildArray = this.format(
          new Date(nowTimes + i * 24 * 60 * 60 * 1000)
        );
        if (buildArray.date === this.selectDate) this.swiperActiveIndex = i;
        
        if (typeof libsDay !== 'undefined' && libsDay instanceof Array && libsDay.length) {
          buildArray.salePrice = this.url?libsDay[i].salePrice:libsDay[i].priceShow
        }
        dateArray.push(buildArray);
      }
      this.swiperDate = dateArray;
      this.$emit("selectCalendar", this.curDate, this.swiperDate[this.swiperActiveIndex].salePrice);
    },
    getCurDate() {
      let date = new Date();
      let seperator1 = "-";
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      let currentdate = year + seperator1 + month + seperator1 + strDate;
      this.currentdate = currentdate;
      if (!this.curDate) this.curDate = currentdate;
    },
    format(nowDate) {
      let weekday = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六"
      ];
      let thisDate = this.formatDate(nowDate, "yyyy-MM-dd");
      let thisWeek = weekday[nowDate.getDay()];
      let currentTime = new Date(this.currentdate).getTime();
      let day = {
        yyyymmdd: this.formatDate(nowDate, "yyyy-MM-dd"),
        date: this.formatDate(nowDate, "MM-dd"),
        week: thisDate === this.currentdate ? "今天" : (thisDate === this.formatDate(new Date(currentTime+24*60*60*1000), "yyyy-MM-dd")?"明天":(thisDate === this.formatDate(new Date(currentTime+24*60*60*1000*2), "yyyy-MM-dd")?"后天":"")),
      }
      return day;
    },
    formatDate(d, fmt) {
      let date;
      if (d instanceof Date) {
        date = d;
      } else {
        let newd = !d || d.replace(/-/g, "/");
        date = new Date(newd);
      }
      let padLeftZero = str => {
        return ("00" + str).substr(str.length);
      };
      let o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds()
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      }
      for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + "";
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length === 1 ? str : padLeftZero(str)
          );
        }
      }
      return fmt;
    },
  }
};
</script>
<style lang="scss" scoped>
.swiper-container {
  z-index: 0;
}
.slide-calendar {
  padding: 15px;
  &-warp {
    width: 100%;
    display: flex;
    .slide-calendar-list {
      width: calc(100% - 50px);
      height: 100%;
      .swiper-container {
        height: 100%;
        .swiper-slide {
          border: 1px solid #e4e4e4;
          width: 70px;
          margin-right: 10px;
          text-align: center;
          border-radius: 4px;
          height: 44px;
          line-height: 16px;
          font-size: 12px;
          box-sizing: border-box;
          color: #413838;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content:center;
          .swiper-slide-time {
            font-size: 12px;
            font-family: PingFangSC-Regular, sans-serif;
          }
          .swiper-slide-price {
            font-size: 13px;
            color: #f05b47;
            font-weight: 600;
            font-family: PingFangSC-Semibold, sans-serif;
          }
          &.active {
            background: #FBB43C;
            color: white;
            .swiper-slide-price {
              color: white;
            }
          }
          &.gray {
            border: 1px solid #F5F5F5;
            background-color: #F5F5F5;
            color: #CBCBCB; 
          }
        }
      }
    }
    .tickets-slide-calendar-list {
      overflow-x: scroll;
      width: auto;
      flex-shrink: 1;
      .swiper-container {
        .swiper-slide {
          width: 90px;
          border: none;
          height: 46px;
          margin-right: 13px !important;
          color: #413838;
          background-color: #F5F5F5;
          &.active {
            background: #FBB43C;
            color: white;
            .swiper-slide-price {
              color: white;
            }
          }
          &.gray {
            color: #CBCBCB; 
          }
        }
      }
    }
    .slide-calendar-box {
      font-size: 14px;
      flex-shrink: 0;
      width: 74px;
      margin-top: 1px;
      padding: 1px 0 0 0px;
      color: #19a0f0;
      box-sizing: border-box;
      background: #fff;
      text-align: center;
      height: 40px;
      position: relative;
      &::after {
        position: absolute;
        left: 5px;
        top: -5px;
        bottom: -5px;
        content: "";
        width: 1px;
        font-size: 0;
        background-image: -webkit-linear-gradient(
          top,
          rgba(255, 255, 255, 0.1) 0,
          rgba(0, 0, 0, 0.15) 50%,
          rgba(255, 255, 255, 0.1) 100%
        );
      }
    }
    .tickets-slide-calendar-box {
      color: #0086F6;
      font-size: 14px;
      width: 86px;
      height: 86px;
      line-height: 86px;
      box-shadow: -4px 0px 4px 0px rgba(0, 0, 0, 0.05);
      &::after {
        display: none;
      }
    }
  }
  .tickets-slide-calendar-wrap {
    align-items: center;
  }
}
.tickets-slide-calendar {
  padding: 0px;
  padding-left: 10px;
}
</style>

