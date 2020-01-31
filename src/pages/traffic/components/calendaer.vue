<template>
  <div class="calendar-page" :class="{show:isShow}">
    <div class="coupon-modal" position="right" width="100%">
      <!-- <div class="year-month">
        <div class="back-btn" @click="hide">返回</div>
        <div class="year-box">
          <x-icon @click="yearLast" type="ios-arrow-left" size="24"></x-icon>
          <span class="year">{{year}}年</span>
          <x-icon @click="yearNext" type="ios-arrow-right" size="24"></x-icon>
        </div>
        <div class="month-box">
          <x-icon @click="monthLast" type="ios-arrow-left" size="24"></x-icon>
          <span class="month">{{month>=10?month:("0" + month)}}月</span>
          <x-icon @click="monthNext" type="ios-arrow-right" size="24"></x-icon>
        </div>
      </div> -->
      <div class="year-month">
        <div class="back-btn" @click="hide"><span>返回</span></div>
        <div class="year-box">
          <i class="xx-icon icon-shuangjiantouyou left-dir" @click="yearLast"></i>
          <i class="xx-icon icon-xiangzuojiantou" @click="monthLast"></i>
          <span class="year">{{year}}年{{month>=10?month:("0" + month)}}月</span>
          <i class="xx-icon icon-xiangyoujiantou" @click="monthNext"></i>
          <i class="xx-icon icon-shuangjiantouyou" @click="yearNext"></i>
        </div>
      </div>
      <div>
        <table class="calendar-table">
          <tbody>
            <tr>
              <td v-for="(item,index) in weekNames" :key="index">{{item}}</td>
            </tr>
            <tr v-for="(week,index) in monthDays" :key="index">
              <td
                v-for="(day,dayIndex) in week"
                :key="dayIndex"
                @click="change(day)"
                :class="{'not-after-today':!day.isAfterToday,tody:day.isToday,'start-date':day.isStartDate||day.isEndDate,'time-range':day.isRange}"
              >
                <template>
                  <div class="day">{{day.showName?day.showName:day.day}}</div>
                  <!-- <div class="show-name">{{?day.showName:""}}</div> -->
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- <div class="hide-calendar" @click="hide">
      取消选择
    </div>-->
  </div>
</template>
<script>
export default {
  props: {
    activeDate: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      monthDays: [],
      flag: true,
      clickNum: 0,
      selectDate: this.activeDate,
      isShow: false,
      daysArr: [],
      days: [],
      year: "",
      month: "",
      monthList: [],
      activeMonthIndex: 0,
      weekNames: ["日", "一", "二", "三", "四", "五", "六"]
    };
  },
  created() {
    this.getCurDate();

    // this.init();
  },
  methods: {
    change(day) {
      if (day.isAfterToday) {
        this.$emit("dateChange", day);
        this.isShow = false;
      }
    },
    hide() {
      this.isShow = false;
    },
    yearLast() {
      this.year--;
      this.init(this.year, this.month);
    },
    yearNext() {
      this.year++;
      this.init(this.year, this.month);
    },
    monthLast() {
      if (this.month == 1) {
        this.month == 12;
        this.year--;
      } else {
        this.month--;
      }
      this.init(this.year, this.month);
    },
    monthNext() {
      this.month++;
      if (this.month > 12) {
        this.month = this.month - 12;
        this.year++;
      }
      this.init(this.year, this.month);
    },
    getMonth() {
      this.monthDays = [];
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      this.year = year;
      this.month = month;
      this.init(year, month);
    },
    getCurDate() {
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
      this.currentdate = currentdate;
    },
    init(year, month) {
      var date = new Date();
      //当前是哪一年
      year = year ? year : date.getFullYear();
      //当前是哪个月，注意这里的月是从0开始计数的
      month = month ? month - 1 : date.getMonth();
      // console.log(year, month);
      let daysArr = [];

      //当前月的第一天的日期
      var firstDay = new Date(year, month, 1);
      //第一天是星期几
      var weekday = firstDay.getDay();

      //求当前月一共有多少天
      //new Date(year,month+1,0) ： month+1是下一个月，day为0代表的是上一个月的最后一天，即我们所需的当前月的最后一天。
      //getDate（）则返回这个日期对象是一个月中的第几天，我们由最后一天得知这个月一共有多少天
      var days = new Date(year, month + 1, 0).getDate();
      let arr = [];
      //输出第一天之前的空格
      for (var i = 0; i < weekday; i++) {
        arr.push({
          currentMonth: false //是否当前月
        });
        if (arr.length == 7) {
          daysArr.push(arr);
          arr = [];
        }
      }

      for (var j = 1; j <= days; j++) {
        let date =
          year +
          "-" +
          (month + 1 < 10 ? "0" + (month + 1) : month + 1) +
          "-" +
          (j < 10 ? "0" + j : j);
        //返回当月今天之后（包含今天），有数据并且在售的日期

        arr.push({
          year: year,
          month: month + 1,
          currentMonth: true, //是否当前月
          date: date, //年-月-日
          isRange: false, //入住-离店之间时间
          day: j,
          isStartDate: false,
          showName:
            new Date(date).valueOf() == new Date(this.currentdate).valueOf()
              ? "今天"
              : "",
          isEndDate: false,
          isToday:
            new Date(date).valueOf() == new Date(this.currentdate).valueOf(),
          isAfterToday:
            new Date(date).valueOf() >= new Date(this.currentdate).valueOf() //是否是今天之前包含今天
        });
        if (arr.length == 7) {
          daysArr.push(arr);
          arr = [];
        }
      }
      if (arr.length) {
        daysArr.push(arr);
      }
      this.monthDays = daysArr;
      console.log(daysArr)
    },

    show() {
      this.getMonth();
      this.clickNum = 0;
      this.isShow = true;
    }
  }
};
</script>
<style>
  .xx-icon{
    color:#999;
    padding-top:0;
    padding-bottom:0;
  }
</style>
<style lang="scss" scoped>
.calendar-page {
  position: fixed;
  left: 100%;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  transition: all 0.5s;
  background: #fff;
  z-index: 602;
  &.show {
    left: 0;
  }
  
  .year-month {
    position: relative;
    display: flex;
    padding: 5px 0;
    justify-content: center;
    align-items: center;
    .iconfont {
      font-size: 15px;
      color: #999;
      padding: 0 8px;
    }
    .vux-x-icon {
      fill: #999;
    }
    .year-box {
      display: flex;
      align-items: center;
      margin-right: 10px;
      .year {
        font-size: 14px;
        color: #333;
        text-align: center;
        display: inline-block;
        width: 100px;
      }
    }
    .icon-shuangjiantouyou{
      font-size: 20px;
    }
    .left-dir{
      transform: rotateY(180deg);
    }
    // .month-box {
    //   display: flex;
    //   align-items: center;
    //   .month {
    //     font-size: 28px;
    //     color: #333;
    //     text-align: center;
    //     display: inline-block;
    //     width: 150px;
    //   }
    // }
  }
  .year-m {
    text-align: center;
    font-size: 14px;
    padding-top: 10px;
  }
  .f-day-box {
    padding-top: 20px;
  }
  .week-list {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;

    align-items: center;
    .week-li {
      flex: 1;
      text-align: center;
      color: #fff;
      background: #48ab31;
      height: 20px;
      line-height: 20px;
      font-size: 14px;
    }
  }
  .coupon-modal {
    // position: relative;
    background: #fff;
    z-index: 1000 !important;
  }
  .mutil-cal-back {
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 25px;
    line-height: 25px;
    text-align: center;
    font-size: 16px;
    color: #fff;
    background: #f05b47;
  }
  .close-content {
    .xx-icon {
      font-size: 18px;
      padding: 2px;
      color: #999;
      margin-right: 8px;
    }
  }
  .month-list {
    display: flex;
    li {
      flex: 1;
      text-align: center;
      height: 25px;
      line-height: 25px;
      font-size: 16px;
      color: #19a0f0;
      &.active {
        border-bottom: 2px solid #19a0f0;
      }
    }
  }
  .calendar-table {
    width: 100%;
    tbody {
      tr {
        td {
          padding: 3px 0;
          text-align: center;
          width: 14.2%;
          color: #413838;
          height: 45px;
          &.tody {
            background: #f6d2c6;
            color: #fff;
          }
          &.start-date {
            background: #149d34;
            color: #fff;
          }
          &.time-range {
            background: #add9a3;
            color: #fff;
          }
          .day {
            font-size: 15px;
          }
          .show-name {
            height: 20px;
          }
          .price {
            font-size: 12px;
            color: #f66;
            padding: 2px 0;
            height: 18px;
            line-height: 18px;
          }
          &.active {
            background: #2988fb;
            .day {
              color: #fff;
            }
            .price {
              color: #fff;
            }
          }
          &.not-after-today {
            background: #ffffff;
            .day {
              color: #ccc;
            }
          }
        }
      }
    }
  }
  // .hide-calendar {
  //   position: absolute;
  //   bottom: 0;
  //   left: 0;
  //   height: 90px;
  //   line-height: 90px;
  //   text-align: center;
  //   font-size: 24px;
  //   color: #333;
  //   width: 100vw;
  //   border-top: 1px solid #ccc;
  // }
  .back-btn {
    position: absolute;
    top: 5px;
    left: 15px;
    bottom:5px;
    font-size: 14px;
    color: #333;
    text-align: center;
    display: inline-block;
    line-height: 100%;
    display: flex;
    align-items: center;
  }
}
</style>

