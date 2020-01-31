<template>
  <div class="slide-calendar">
    <div class="slide-calendar-warp">
      <div class="slide-calendar-list">
        <swiper :options="swiperOption" ref="mySwiper" @click.prevent="selectedDate">
          <!-- slides -->
          <!-- {{slideDate}} -->
          <swiper-slide
            v-for="(item,index) in swiperDate"
            :key="index"
            :class="{
              'active':swiperActiveIndex === index && (!isYpym || (typeof item.salePrice !== 'undefined'&&item.salePriceStatus&&(item.stockModel=='unlimit'?true : item.stock>0))),
              'gray':isYpym &&!(typeof item.salePrice !== 'undefined'&&item.salePriceStatus&&(item.stockModel=='unlimit'?true : item.stock>0))}"
          > 
            <div class="swiper-slide-time">{{item.date}}</div>
            <div v-if="typeof item.salePrice !== 'undefined'&&item.salePriceStatus&&(item.stockModel=='unlimit'?true : item.stock>0)" class="swiper-slide-price">￥{{item.salePrice}}</div>
            <div v-else class="swiper-slide-week">{{item.week}}</div>
          </swiper-slide>
        </swiper>
      </div>
      <div class="slide-calendar-box" @click="moreCalendar">更多日期</div>
    </div>
    <singel-calender ref="calendar" @initDate="initDate" :getCalenderDate="getCalenderDate"  @getDate="getSingeDate" :singeDate="curDate"></singel-calender>
  </div>
</template>
<script>
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { InlineCalendar, Popup } from "vux";
import singelCalender from "@/components/singelCalender";
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
    isYpym:{
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
      getCalenderDate:false
    };
  },
  watch: {
    slideDate(val) {
      this.curDate = val
      // this.getDaysInfo(10, new Date(val));
    },
    isYpym(val){
      this.getCalenderDate = val
    }
   
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
    this.getDaysInfo(10, new Date(this.slideDate));
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
      this.getDaysInfo(10, initDate, val);
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
      this.curDate = this.swiperDate[clickedIndex].date;
      this.$emit("selectCalendar", this.curDate);
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
      this.getDaysInfo(10, initDate, libsDay);
      this.$emit("selectCalendar", this.curDate);
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
        
        if (typeof libsDay !== 'undefined' && libsDay instanceof Array && libsDay.length) Object.assign(buildArray,libsDay[i]) 
        dateArray.push(buildArray);
      }
      this.swiperDate = dateArray;
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
      let day = {
          date: thisDate,
          week: thisDate === this.currentdate ? "今天" : thisWeek,
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
            background: #fbb43c;
            color: white;
            .swiper-slide-price {
              color: white;
            }
          }
          &.gray {
            border: 1px solid #f05b47;
            color: #f05b47; 
            opacity: 0.3;
          }
        }
      }
    }
    .slide-calendar-box {
      font-size: 14px;
      width: 74px;
      padding: 2px 0 0 17px;
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
  }
}
</style>

