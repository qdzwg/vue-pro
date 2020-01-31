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
                :class="{'active':(selectDate==day.date),'not-after-today':(!day.isAfterToday||!day.salePrice||!day.salePriceStatus||(day.stockModel!='unlimit'&&day.stock==0))}"
              >
                <template v-if="day.currentMonth">
                  <div class="day" :class="{weekend:(dayIndex==0||dayIndex==6)}">{{day.day}}</div>
                  <div class="price">
                    <template
                      v-if="day.isAfterToday&&day.salePrice&&day.salePriceStatus&&(day.stockModel=='unlimit'?true:day.stock>0)"
                    >￥{{day.salePrice}}</template>
                  </div>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <div class="px-ul">
            <div v-for="(item,index) in itemData" :key="index">
              <div class="linearGradient"></div>
              <div class="px-li">
                <div class="px-li-l">
                    <div>
                        <div class="px-name">{{ item.ticketName }}</div>
                        <div class="px-price">
                            <span class="unit">￥</span>
                            <span class="price">{{ item.salePrice }}</span>
                            <!-- <span class="last-price">{{ item.priceSettle }}</span> -->
                        </div>
                    </div>
                </div>
                <div class="px-li-r">
                    <span class="num">{{item.num}}</span>
                    <div class="add-sub">
                        <span @click.stop="sub(index)" class="sub handle-btn" :class="{'no-num':item.num==0}">-</span>
                        <span @click.stop="add(index)" class="add handle-btn">+</span>
                    </div>
                </div>
              </div>
            </div>
        </div>
        <div class="linearGradient"></div>
        <div>
          <div class="calendar-go-order" @click="goOrder" :class='{"calendar-go-order-ok":total>0}'>继续预定</div>
        </div>
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
      selectDate: this.activeDate,
      isShow: false,
      itemData: [],
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
    this.getMonth();
    this.init();
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
      localStorage.setItem(
        "ticketType",
        JSON.stringify(nArr)
      );
      this.$router.push("/order/router?playDate=" + this.selectDate);
    },
    //加减运算
    sub(index) {
      if (this.itemData[index].num > 0) {
        this.itemData[index].num--;
        this.$set(this.itemData,index,this.itemData[index])
      }
    },
    add(index) {
      if(this.itemData[index].num>=this.itemData[index].stock){
        this.itemData[index].num = this.itemData[index].stock;
        this.$vux.toast.text("总数量不得超过当前库存："+this.itemData[index].stock, "middle");
      }else{
        this.itemData[index].num++;
      }
      this.$set(this.itemData,index,this.itemData[index])
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
        this.totalComputed();
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
      //   console.log(arr);
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
      console.log(this.itemData)
      return sum.toFixed(2);
    },
    init(year, month) {
      var date = new Date();
      //当前是哪一年
      var year = year ? year : date.getFullYear();
      //当前是哪个月，注意这里的月是从0开始计数的
      var month = month ? month - 1 : date.getMonth();
      this.getAxios(
        "/merchant/api/merchantRouteInfo/listCalendarPriceMap",
        {
          id: this.$route.query.id,
          beginMonth: year + "-" + (month + 1),
          endMonth: year + "-" + (month + 1)
        }
      ).then(res => {
        if(res.status != 200) {
          return
        }
        let daysData;
        this.itemData = res.data;
        this.itemData.map(item=>{
          item.num = 0;
        })
        this.totalComputed();
        if(res.data.length)
        daysData = res.data[0].clCalendarDayVos;
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
        console.log(this.daysArr);
      });
    },
    show() {
      this.isShow = true;
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
}
</style>

