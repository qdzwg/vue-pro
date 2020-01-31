<template>
  <div
    class="calendar-page"
    v-if='isShow'
  >
    <popup
      v-model="isShow"
      class="coupon-modal"
      position="right"
      width="100%"
      :show-mask="false"
    >
      <div
        class="week-list"
        @click="isShow=false"
      >
        <div
          class="week-li"
          v-for="(item,index) in weekNames"
          :key="index"
        >{{item}}</div>
      </div>
      <div
        v-for="(month,monthIndex) in monthDays"
        :class="{'f-day-box':monthIndex==0}"
        :key="monthIndex"
      >
        <div class="year-m">{{month.year}}年{{month.month}}月</div>
        <table class="calendar-table">
          <!-- <thead>
            <tr>
              <th v-for="(item,index) in weekNames" :key="index">{{item}}</th>
            </tr>
          </thead>-->
          <tbody>
            <tr
              v-for="(week,index) in month.dayArr"
              :key="index"
            >
              <td
                v-for="(day,dayIndex) in week"
                :key="dayIndex"
                @click="setDate(monthIndex,index,dayIndex,day)"
                :class="{'active':(selectDate==day.date),'not-after-today':!day.isAfterToday,tody:day.isToday,'start-date':day.isStartDate||day.isEndDate,'time-range':day.isRange}"
              >
                <template>
                  <div
                    class="day"
                    :class="{weekend:(dayIndex==0||dayIndex==6)}"
                  >{{day.day}}</div>
                  <div class="show-name">{{day.showName?day.showName:""}}</div>
                  <!-- <div class="price">
                    <template
                      v-if="day.isAfterToday&&(day.salePrice||day.salePrice==0)&&day.salePriceStatus&&(day.stockModel=='unlimit'?true:day.stock>0)"
                    >￥{{day.salePrice}}</template>
                  </div>-->
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </popup>
  </div>
</template>
<script>
import { Popup } from "vux";
export default {
  components: { Popup },
  props: {
    activeDate: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      flagShow: false,
      flag: true,
      clickNum: 0,
      monthDays: [],
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
    getMonthWeek(a, b, c) {
      /*  
a = d = 当前日期  
b = 6 - w = 当前周的还有几天过完(不算今天)  
a + b 的和在除以7 就是当天是当前月份的第几周  
*/
      var date = new Date(a, parseInt(b) - 1, c),
        w = date.getDay(),
        d = date.getDate();
      return Math.ceil((d + 6 - w) / 7);
    },
    setDate(monthIndex, index, dayIndex, day) {
      if (this.flag) {
        if (day.isAfterToday && !day.isStartDate) {
          this.clickNum++;
          if (this.clickNum % 2 == 0) {
            if (
              new Date(day.date).valueOf() < new Date(this.startDate).valueOf()
            ) {
              //选了离店时间在入住时间之前

              //重置原先的入住时间
              this.monthDays[this.startDateMonthIndex].dayArr[
                this.startDateIndex
              ][this.startDateDayIndex].isStartDate = false;
              this.monthDays[this.startDateMonthIndex].dayArr[
                this.startDateIndex
              ][this.startDateDayIndex].showName = "";
              this.startDate = day.date;
              this.monthDays[monthIndex].dayArr[index][
                dayIndex
              ].isStartDate = true;
              this.monthDays[monthIndex].dayArr[index][dayIndex].showName =
                "入住";
              this.startDateMonthIndex = monthIndex;
              this.startDateIndex = index;
              this.startDateDayIndex = dayIndex;
              // this.$vux.toast.text("请继续选择离店日期", "middle");
              this.$vux.toast.show({
                text: "请继续选择离店日期",
                time: 1000,
                type: "text",
                width: "14.5em",
                position: "bottom"
              });

              this.clickNum--;
            } else {
              this.flag = false;
              this.endDate = day.date;
              this.monthDays[monthIndex].dayArr[index][
                dayIndex
              ].isEndDate = true;
              this.monthDays[monthIndex].dayArr[index][dayIndex].showName =
                "离店";
              this.monthDays.forEach((month, monthIndex) => {
                month.dayArr.forEach((week, weekIndex) => {
                  week.forEach((day, index) => {
                    if (
                      new Date(day.date).valueOf() >
                        new Date(this.startDate).valueOf() &&
                      new Date(day.date).valueOf() <
                        new Date(this.endDate).valueOf()
                    ) {
                      this.monthDays[monthIndex].dayArr[weekIndex][
                        index
                      ].isRange = true;
                    }
                  });
                });
              });
              if (this.DateDiff(this.startDate, this.endDate) > 30) {
                this.$vux.toast.show({
                  text: "亲，酒店只支持预订30晚",
                  time: 2000,
                  type: "text",
                  width: "15.5em"
                  // position:'bottom'
                });
                this.flagShow = true;
                this.flag = true;
                return;
              }
              setTimeout(() => {
                this.$emit("getDate", this.startDate, this.endDate);
                this.isShow = false;
                this.flag = true;
              }, 1000);
            }
          } else {
            this.monthDays.forEach((month, monthIndex) => {
              month.dayArr.forEach((week, weekIndex) => {
                week.forEach((day, index) => {
                  day.isRange = false;
                  day.isStartDate = false;
                  day.isEndDate = false;
                  if (day.date == this.currentdate) {
                  } else {
                    day.showName = "";
                  }
                });
              });
            });
            if (this.flagShow) {
              //超过30天的范围需要重置数据（选中样式）
              this.getMonth();
            }
            this.startDate = day.date;
            this.monthDays[monthIndex].dayArr[index][
              dayIndex
            ].isStartDate = true;
            this.monthDays[monthIndex].dayArr[index][dayIndex].showName =
              "入住";
            this.startDateMonthIndex = monthIndex;
            this.startDateIndex = index;
            this.startDateDayIndex = dayIndex;
            this.$vux.toast.show({
              text: "请继续选择离店日期",
              time: 1000,
              type: "text",
              width: "14.5em",
              position: "bottom"
            });
          }
        }
      }
    },
    //计算相差天数
    DateDiff(sDate1, sDate2) {
      let oDate1 = new Date(sDate1);
      let oDate2 = new Date(sDate2);
      let iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数
      return iDays;
    },
    getDate(day) {
      if (
        day.isAfterToday &&
        (day.salePrice || day.salePrice == 0) &&
        day.salePriceStatus &&
        (day.stockModel == "unlimit" ? true : day.stock > 0)
      ) {
        this.$emit("getDate", day);
        this.selectDate = day.date;
        setTimeout(() => {
          this.isShow = false;
        }, 400);
      }
    },
    getMonthInit(index) {
      this.activeMonthIndex = index;
      this.init(this.monthList[index].year, this.monthList[index].month);
    },
    getMonth() {
      this.monthDays = [];
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let arr = [];
      arr.push({
        month,
        year
      });
      for (let i = 1; i < 3; i++) {
        month++;
        if (month > 12) {
          month = month - 12;
          year++;
        }
        arr.push({
          month,
          year,
          test: false
        });
      }
      this.monthList = arr;
      arr.forEach(item => {
        // let obj = Object.assign(item, {
        //   dayArr: this.init(item.year, item.month)
        // });
        this.monthDays.push({
          year: item.year,
          month: item.month,
          dayArr: this.init(item.year, item.month)
        });
      });
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
      var year = year ? year : date.getFullYear();
      //当前是哪个月，注意这里的月是从0开始计数的
      var month = month ? month - 1 : date.getMonth();
      let daysArr = [];

      //当前月的第一天的日期
      var firstDay = new Date(year, month, 1);
      //第一天是星期几
      var weekday = firstDay.getDay();

      //求当前月一共有多少天
      //new Date(year,month+1,0) ： month+1是下一个月，day为0代表的是上一个月的最后一天，即我们所需的当前月的最后一天。
      //getDate（）则返回这个日期对象是一个月中的第几天，我们由最后一天得知这个月一共有多少天
      var days = new Date(year, month + 1, 0).getDate();

      var res = "";
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
      return daysArr;
      // this.daysArr = daysArr;
      // console.log(this.daysArr);
      // this.getAxios(
      //   "/merchant/api/merchantProductPriceApi/getPriceStockCalendar",
      //   {
      //     productType: "ticket",
      //     id: this.$route.query.ticketId,
      //     month: year + "-" + (month + 1)
      //   }
      // ).then(res => {
      //   let daysData = res.data;
      //   let daysArr = [];

      //   //当前月的第一天的日期
      //   var firstDay = new Date(year, month, 1);
      //   //第一天是星期几
      //   var weekday = firstDay.getDay();

      //   //求当前月一共有多少天
      //   //new Date(year,month+1,0) ： month+1是下一个月，day为0代表的是上一个月的最后一天，即我们所需的当前月的最后一天。
      //   //getDate（）则返回这个日期对象是一个月中的第几天，我们由最后一天得知这个月一共有多少天
      //   var days = new Date(year, month + 1, 0).getDate();

      //   var res = "";
      //   let arr = [];
      //   //输出第一天之前的空格
      //   for (var i = 0; i < weekday; i++) {
      //     arr.push({
      //       currentMonth: false //是否当前月
      //     });
      //     if (arr.length == 7) {
      //       daysArr.push(arr);
      //       arr = [];
      //     }
      //   }

      //   for (var j = 1; j <= days; j++) {
      //     let date =
      //       year +
      //       "-" +
      //       (month + 1 < 10 ? "0" + (month + 1) : month + 1) +
      //       "-" +
      //       (j < 10 ? "0" + j : j);
      //     //返回当月今天之后（包含今天），有数据并且在售的日期
      //     if (
      //       daysData[j - 1].salePriceStatus == "T" &&
      //       (daysData[j - 1].salePrice || daysData[j - 1].salePrice == 0) &&
      //       daysData[j - 1].stock > 0
      //     ) {
      //       //在售-价格大于0-数量大于O
      //     }

      //     arr.push({
      //       currentMonth: true, //是否当前月
      //       date: date, //年-月-日
      //       salePriceStatus: daysData[j - 1].salePriceStatus == "T", //在售状态
      //       day: date == this.currentdate ? "今天" : j,
      //       salePrice: daysData[j - 1].salePrice, //售价
      //       stock: daysData[j - 1].stock, //库存
      //       stockModel: daysData[j - 1].stockModel, //库存模式
      //       isAfterToday:
      //         new Date(date).valueOf() >= new Date(this.currentdate).valueOf() //是否是今天之前包含今天
      //     });
      //     if (arr.length == 7) {
      //       daysArr.push(arr);
      //       arr = [];
      //     }
      //   }
      //   if (arr.length) {
      //     daysArr.push(arr);
      //   }
      //   this.daysArr = daysArr;
      //   console.log(this.daysArr);
      // });
    },
    invertSelection(num, type) {
      let date = new Date(num);
      let m = date.getMonth() + 1;
      let day = num;
      let y = date.getFullYear();
      let d = date.getDate();
      let mi, di, i;
      di = this.getMonthWeek(y, m, d) - 1;
      this.monthDays.forEach((item, index) => {
        if (m == item.month) {
          mi = index;
          item.dayArr[di].forEach((ele, ei) => {
            if (ele.date == day) {
              i = ei;
            }
          });
        }
      });
      if (type == "start") {
        this.monthDays[mi].dayArr[di][i].isStartDate = true;
        this.monthDays[mi].dayArr[di][i].showName = "入住";
      } else {
        this.monthDays[mi].dayArr[di][i].isEndDate = true;
        this.monthDays[mi].dayArr[di][i].showName = "离店";
      }
    },

    show(date) {
      this.getMonth();
      this.clickNum = 0;
      this.isShow = true;

      if (localStorage.getItem("selectBegin")) {
        this.invertSelection(localStorage.getItem("selectBegin"), "start");
      }
      if (localStorage.getItem("selectEnd")) {
        this.invertSelection(localStorage.getItem("selectEnd"), "end");
      }
      if (
        localStorage.getItem("selectBegin") &&
        localStorage.getItem("selectEnd")
      ) {
        this.monthDays.forEach((month, monthIndex) => {
          month.dayArr.forEach((week, weekIndex) => {
            week.forEach((day, index) => {
              if (
                new Date(day.date).valueOf() >
                  new Date(localStorage.getItem("selectBegin")).valueOf() &&
                new Date(day.date).valueOf() <
                  new Date(localStorage.getItem("selectEnd")).valueOf()
              ) {
                this.monthDays[monthIndex].dayArr[weekIndex][
                  index
                ].isRange = true;
              }
            });
          });
        });
      }

      // let arr = date.split("-")
      // let year = arr[0]
      // let month = parseInt(arr[1])
      // this.init()
      //  this.activeMonthIndex = this.monthList.findIndex(item=>item.month==month)
      //  console.log(this.activeMonthIndex)
      // console.log(date)
    }
  }
};
</script>
<style lang="scss" scoped>
.calendar-page {
  .year-m {
    text-align: center;
    font-size: 15px;
    padding-top: 20px;
  }
  .f-day-box {
    padding-top: 40px;
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
      color: #413838;
      background: #fff;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      border-bottom: 1px solid #e1e1e1;
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
    height: 49px;
    line-height: 49px;
    text-align: center;
    font-size: 16px;
    color: #fff;
    background: #f05b47;
  }
  .close-content {
    .xx-icon {
      font-size: 18px;
      padding: 4px;
      color: #999;
      margin-right: 15px;
    }
  }
  .month-list {
    display: flex;
    li {
      flex: 1;
      text-align: center;
      height: 49px;
      line-height: 49px;
      font-size: 16px;
      color: #19a0f0;
      &.active {
        border-bottom: 2px solid #19a0f0;
      }
    }
  }
  .calendar-table {
    width: 100%;
    thead {
      tr {
        th {
          background-color: #e5e5e5;
          border-bottom: 1px solid #eee;
          border-top: 1px solid #eee;
          padding: 8px 0;
          font-size: 12px;
          color: #413838;
        }
      }
    }
    tbody {
      tr {
        td {
          padding: 6px 0;
          text-align: center;
          width: 14.2%;
          color: #413838;
          &.tody {
            background: #48bc95;
            color: #fff;
          }
          &.start-date {
            background: #0086f6;
            color: #fff;
          }
          &.time-range {
            background: #e4f3fc;
            // color: #fff;
          }
          .day {
            font-size: 15px;
          }
          .show-name {
            height: 19px;
          }
          .price {
            font-size: 12px;
            color: #f66;
            padding: 4px 0;
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
}
</style>

