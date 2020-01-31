<template>
  <div class="calendar-page">
    <popup v-model="isShow" class="coupon-modal" position="right" width="100%">
      <ul class="month-list">
        <li
          v-for="(item,index) in monthList"
          :key="index"
          @click="getMonthInit(index)"
          :class="{active:activeMonthIndex == index}"
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
                :class="{'active':(selectDate==day.date),'not-after-today': !day.isAfterToday||(day.needCheck && (day.salePrice !== 0 && !day.salePrice||!day.salePriceStatus||(day.stockModel!='unlimit'&&day.stock==0)))}"
              >
                <template v-if="day.currentMonth">
                  <div class="day" :class="{weekend:(dayIndex==0||dayIndex==6)}">{{day.day}}</div>
                  <div class="price">
                    <template
                      v-if="day.isAfterToday&& typeof day.salePrice !== 'undefined' &&day.salePriceStatus&&(day.stockModel=='unlimit'?true:day.stock>0)"
                    >￥{{day.salePrice}}</template>
                  </div>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- <div>
        <div class="linearGradient"></div>
        <div>
          <div class="calendar-go-order" @click="goOrder" :class='{"calendar-go-order-ok":total>0}'>继续预定</div>
        </div>
      </div>-->
      <div @click="isShow=false" class="mutil-cal-back">返回</div>
    </popup>
  </div>
</template>
<script>
import { Popup } from "vux";
export default {
  components: { Popup },
  props: {
    singeDate: {
      type: String,
      default: ""
    },
    getCalenderDate: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectDate: this.singeDate,
      isShow: false,
      itemData: [],
      params: null,
      init:true,
      initCurDayIndex:-1,
      getDataUrl: "",
      daysArr: [],
      days: [],
      year: "",
      month: "",
      monthList: [],
      activeMonthIndex: 0,
      weekNames: ["日", "一", "二", "三", "四", "五", "六"],
      daysFullData:[]  // 日历数据集合
    };
  },
  created() {   
    this.getCurDate();
    this.getMonth();

    if (typeof this.singeDate !== 'undefined') {
      let arr = this.singeDate.split("-");
      let year = arr[0];
      let month = parseInt(arr[1]);
      this.initDate(year, month);
      this.activeMonthIndex = this.monthList.findIndex(
        item => item.month == month
      );
    } else {
      this.initDate();
    }
    
    
  },
  watch: {
    singeDate(val) {
      this.selectDate = val;
    }
  },
  computed: {
    total() {
      let _this = this,
        sum = 0,
        itemData = _this.itemData;
      for (let i = 0; i < itemData.length; i++) {
        for (let j = 0; j < itemData[i].clCalendarDayVos.length - 1; j++) {
          if (itemData[i].clCalendarDayVos[j].date == _this.selectDate) {
            itemData[i].salePrice = itemData[i].clCalendarDayVos[j].salePrice;
            sum += itemData[i].num * itemData[i].clCalendarDayVos[j].salePrice;
          }
        }
      }
      return sum.toFixed(2);
    }
  },
  methods: {
    goOrder() {
      let nArr = [];
      this.itemData.forEach((item, index) => {
        if (item.num > 0) {
          nArr.push(item);
        }
      });
      localStorage.setItem("ticketType", JSON.stringify(nArr));
      this.$router.push("/order/router?playDate=" + this.selectDate);
    },
    // 设置日历请求数据
    setRequstParmas(params) {
      this.getDataUrl = params.url;
      delete params.url;
      this.params = { ...params };
      this.initDate();
    },

    getDate(day) {
      let libsDay = [];
      if ( !day.needCheck || (day.isAfterToday && (day.salePrice || day.salePrice == 0) && day.salePriceStatus && (day.stockModel == "unlimit" ? true : day.stock > 0)) ) {
        if (typeof day.index !== 'undefined') {
            libsDay = this.daysFullData.splice(day.index,10)
        }
        this.$emit("getDate",{day,libsDay} );
        this.selectDate = day.date;
        this.isShow = false;
        // this.totalComputed();
      }
    },
    getMonthInit(index) {
      this.activeMonthIndex = index;
      this.initDate(this.monthList[index].year, this.monthList[index].month);
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
        arr.push({ month, year });
      }
      this.monthList = arr;
      //   console.log(arr);
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
    },
    totalComputed() {
      let _this = this,
        sum = 0,
        itemData = _this.itemData;
      for (let i = 0; i < itemData.length; i++) {
        for (let j = 0; j < itemData[i].clCalendarDayVos.length - 1; j++) {
          if (itemData[i].clCalendarDayVos[j].date == _this.selectDate) {
            itemData[i].salePrice = itemData[i].clCalendarDayVos[j].salePrice;
            itemData[i].stock = itemData[i].clCalendarDayVos[j].stock;
            sum += itemData[i].num * itemData[i].clCalendarDayVos[j].salePrice;
          }
        }
      }
      return sum.toFixed(2);
    },
    initDate(year, month) {
      
      let date = new Date();
      //当前是哪一年
      var year = year ? year : date.getFullYear();
      //当前是哪个月，注意这里的月是从0开始计数的
      var month = month ? month - 1 : date.getMonth();
      // 日历数据
      let daysArr = [];
      //当前月的第一天的日期
      let firstDay = new Date(year, month, 1);
      //第一天是星期几
      let weekday = firstDay.getDay();
      //求当前月一共有多少天
      //new Date(year,month+1,0) ： month+1是下一个月，day为0代表的是上一个月的最后一天，即我们所需的当前月的最后一天。
      //getDate（）则返回这个日期对象是一个月中的第几天，我们由最后一天得知这个月一共有多少天
      let days = new Date(year, month + 1, 0).getDate();
      let res = "";
      let arr = [];
      let currentdateIndex = 0;
      //输出第一天之前的空格
      for (let i = 0; i < weekday; i++) {
        arr.push({
          currentMonth: false //是否当前月
        });
        if (arr.length === 7) {
          daysArr.push(arr);
          arr = [];
        }
      }

      if (this.$route.query.ticketId) {
        this.getAxios(
          "/merchant/api/merchantProductPriceApi/getPriceStockCalendar",
          {
            productType: "ticket",
            id: this.$route.query.ticketId,
            month: year + "-" + (month + 1)
          }
        ).then(res => {
          if (res.status != 200) {
            return;
          }
          let daysData = res.data;
          this.daysFullData = res.data
          for (var j = 1; j <= days; j++) {
            let date =  year +  "-" +
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

            let day = {
              index:j-1,
              needCheck: true,
              currentMonth: true, //是否当前月
              date: date, //年-月-日
              salePriceStatus: daysData[j - 1].salePriceStatus == "T", //在售状态
              day: date == this.currentdate ? '今天' : j,
              salePrice: daysData[j - 1].salePrice, //售价
              stock: daysData[j - 1].stock, //库存
              stockModel: daysData[j - 1].stockModel, //库存模式
              isAfterToday:
                new Date(date).valueOf() >= new Date(this.currentdate).valueOf() //是否是今天之前包含今天
            };
            if (date === this.singeDate) {
              this.currentdateIndex = j-1
            }

            arr.push(day);

            if (arr.length == 7) {
              daysArr.push(arr);
              arr = [];
            }
          }
          if (arr.length) {
            daysArr.push(arr)
          }
          this.daysArr = daysArr

          if ((month + 1) === 12) {
            this.getNextMouth((year +1) + "-" + (1))
          }else {
            this.getNextMouth(year + "-" + (month + 2))
          }
          
        });
      } else {
        for (let j = 1; j <= days; j++) {
          let date =
            year +
            "-" +
            (month + 1 < 10 ? "0" + (month + 1) : month + 1) +
            "-" +
            (j < 10 ? "0" + j : j);
          arr.push({
            needCheck: false, // 是否校验库存
            currentMonth: true, //是否当前月
            date: date, //年-月-日
            salePriceStatus: "F", //在售状态
            day: date == this.currentdate ? "今天" : j,
            salePrice: "", //售价
            stock: "", //库存
            stockModel: "", //库存模式
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
      }
    },
    // init(year, month) {
    //   let date = new Date();
    //   //当前是哪一年
    //   let year = year ? year : date.getFullYear();
    //   //当前是哪个月，注意这里的月是从0开始计数的
    //   let month = month ? month - 1 : date.getMonth();

    //   this.getAxios(
    //     "/merchant/api/merchantRouteInfo/listCalendarPriceMap",
    //     {
    //       id: this.$route.query.id,
    //       beginMonth: year + "-" + (month + 1),
    //       endMonth: year + "-" + (month + 1)
    //     }
    //   ).then(res => {
    //     if(res.status != 200) {
    //       return
    //     }
    //     let daysData;
    //     // this.itemData = res.data;
    //     // this.itemData.map(item=>{
    //     //   item.num = 0;
    //     // })
    //     this.totalComputed();
    //     if(res.data.length)
    //     daysData = res.data[0].clCalendarDayVos;
    //     let daysArr = [];

    //     //当前月的第一天的日期
    //     var firstDay = new Date(year, month, 1);
    //     //第一天是星期几
    //     var weekday = firstDay.getDay();

    //     //求当前月一共有多少天
    //     //new Date(year,month+1,0) ： month+1是下一个月，day为0代表的是上一个月的最后一天，即我们所需的当前月的最后一天。
    //     //getDate（）则返回这个日期对象是一个月中的第几天，我们由最后一天得知这个月一共有多少天
    //     var days = new Date(year, month + 1, 0).getDate();

    //     var res = "";
    //     let arr = [];
    //     //输出第一天之前的空格
    //     for (var i = 0; i < weekday; i++) {
    //       arr.push({
    //         currentMonth: false //是否当前月
    //       });
    //       if (arr.length == 7) {
    //         daysArr.push(arr);
    //         arr = [];
    //       }
    //     }

    //     for (var j = 1; j <= days; j++) {
    //       let date = year + "-" + (month + 1 < 10 ? "0" + (month + 1) : month + 1) + "-" + (j < 10 ? "0" + j : j);
    //       //返回当月今天之后（包含今天），有数据并且在售的日期
    //       if (
    //         daysData[j - 1].salePriceStatus == "T" &&
    //         (daysData[j - 1].salePrice || daysData[j - 1].salePrice == 0) &&
    //         daysData[j - 1].stock > 0
    //       ) {
    //         //在售-价格大于0-数量大于O
    //       }

    //       arr.push({
    //         currentMonth: true, //是否当前月
    //         date: date, //年-月-日
    //         salePriceStatus: daysData[j - 1].salePriceStatus == "T", //在售状态
    //         day: date == this.currentdate ? "今天" : j,
    //         salePrice: daysData[j - 1].salePrice, //售价
    //         stock: daysData[j - 1].stock, //库存
    //         stockModel: daysData[j - 1].stockModel, //库存模式
    //         isAfterToday:
    //           new Date(date).valueOf() >= new Date(this.currentdate).valueOf() //是否是今天之前包含今天
    //       });
    //       if (arr.length == 7) {
    //         daysArr.push(arr);
    //         arr = [];
    //       }
    //     }
    //     if (arr.length) {
    //       daysArr.push(arr);
    //     }
    //     this.daysArr = daysArr;
    //     console.log(this.daysArr);
    //   });
    // },
    show(date) {
      this.isShow = true;
      let arr = date.split("-");
      let year = arr[0];
      let month = parseInt(arr[1]);
      this.initDate(year, month);
      this.activeMonthIndex = this.monthList.findIndex(
        item => item.month == month
      );
    },

    getNextMouth(mouth){
      this.getAxios(
          "/merchant/api/merchantProductPriceApi/getPriceStockCalendar",
          {
            productType: "ticket",
            id: this.$route.query.ticketId,
            month: mouth
          }
        ).then(res => {
          if (res.status != 200) {
            return;
          }
          this.daysFullData = this.daysFullData.concat(res.data)
          if (this.init && typeof this.currentdateIndex !=='undefined' && this.currentdateIndex !== -1) {
            this.init = false
            this.$emit('initDate',this.daysFullData.splice(this.currentdateIndex,10))
          }
        }) 
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../assets/styles/mixin.scss";

.calendar-page {
  .coupon-modal {
    background: #fff;
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
  .px-ul {
    background: #fff;
    padding-bottom: 0px;
    height: auto;
    overflow: auto;
    .px-li {
      @include fbc;
      height: 86px;
      padding: 0px 15px;
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
            @include sc(12px, #fc4150);
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
  .calendar-go-order {
    color: #fff;
    font-size: 16px;
    line-height: 40px;
    text-align: center;
    background: #cbcbcb;
  }
  .calendar-go-order-ok {
    background-color: #f05b47;
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
}
</style>

