<template>
  <div class="calendar-page">
  
    <popup v-model="isShow" class="coupon-modal" position="right" width="100%">
      <ul class="month-list">
        <li
          v-for="(item,index) in monthList"
          :key="index"
          @click="getMonthInit(index)"
          :class="{active:activeMonthIndex==index}"
        >{{item.month}}月</li>
      </ul>
      <div>
        <table class="calendar-table">
          <thead>
            <tr>
              <th v-for="(item,index) in weekNames" :key="index">{{item}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(week,index) in daysArr" :key="index">
              <td
                v-for="(day,dayIndex) in week"
                :key="dayIndex"
                @click="getDate(day)"
                :class="{'active':(selectDate==day.date),'not-after-today':(!day.isAfterToday||!(day.salePrice||day.salePrice==0)||!day.salePriceStatus||(day.stockModel!='unlimit'&&day.stock==0))}"
              >
                <template v-if="day.currentMonth">
                  <div class="day" :class="{weekend:(dayIndex==0||dayIndex==6)}">{{day.day}}</div>
                  <div class="price">
                    <template
                      v-if="day.isAfterToday&&(day.salePrice||day.salePrice==0)&&day.salePriceStatus&&(day.stockModel=='unlimit'?true:day.stock>0)"
                    >￥{{day.salePrice}}</template>
                  </div>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div @click="isShow=false" class="mutil-cal-back">返回</div>
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
      selectDate: '',
      ticketId:'',
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
  watch: {
    activeDate(val){
      this.selectDate = val
    }
  },
  created() {
    this.getCurDate();
    this.getMonth();
    // this.init();
  },
  methods: {
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
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let arr = [];
      arr.push({
        month,
        year
      });
      for (let i = 1; i < 4; i++) {
        month++;
        if (month > 12) {
          month = month - 12;
          year++;
        }
        arr.push({
          month,
          year
        });
      }
      this.monthList = arr;
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
      this.getAxios(
        "/merchant/api/merchantProductPriceApi/getPriceStockCalendar",
        {
          productType: "ticket",
          id:this.ticketId || this.$route.query.ticketId,
          month: year + "-" + (month + 1)
        }
      ).then(res => {
        let daysData = res.data;
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
          if (
            daysData[j - 1].salePriceStatus == "T" &&
            (daysData[j - 1].salePrice || daysData[j - 1].salePrice == 0) &&
            daysData[j - 1].stock > 0
          ) {
            //在售-价格大于0-数量大于O
          }

          arr.push({
            currentMonth: true, //是否当前月
            date: date, //年-月-日
            salePriceStatus: daysData[j - 1].salePriceStatus == "T", //在售状态
            day: date == this.currentdate ? "今天" : j,
            salePrice: daysData[j - 1].salePrice, //售价
            stock: daysData[j - 1].stock, //库存
            stockModel: daysData[j - 1].stockModel, //库存模式
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
        this.daysArr = daysArr;
      });
    },
    show(params) {
      let date = '';
      if (params instanceof Object) {
        date = params.date
        this.ticketId = params.ticketId
      } else {
        date = params
      }
      this.isShow = true;
      let arr = date.split("-")
      let year = arr[0]
      let month = parseInt(arr[1])
      this.init(year,month)
       this.activeMonthIndex = this.monthList.findIndex(item=>item.month==month)
    }
  }
};
</script>
<style lang="scss" scoped>
.calendar-page {
  .coupon-modal {
    // position: relative;
    background: #fff;
    z-index:1000 !important;
  }
  .mutil-cal-back{
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
  .close-content{
    .xx-icon{
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
          .day {
            font-size: 15px;
            color: #413838;
            &.weekend {
              color: #149d34;
            }
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

