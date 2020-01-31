<template>
  <div class="detail-popup">
    <div v-if="cureentValue" @click="close" class="mask"></div>
    <div class="room-detail" :class="{on:cureentValue,'b-p':hasBottom}">
      <div class="room-detail-header">
        <span class="room-name">{{roomDetailData.name}}</span>
        <div @click="close" class="close-bar">
          <i class="xx-icon icon-guanbi1"></i>
        </div>
      </div>
      <!-- {{roomDetailData.pmsImgs}} -->
      <main class="content" id="roomDetailContent">
        <!-- 图片轮播 -->
        <div class="slide-img-bar" v-if="roomDetailData.pmsImgs&&roomDetailData.pmsImgs.length">
          <img-slide height="5.3333rem" :imgList="roomDetailData.pmsImgs" :autoFlag="false"></img-slide>
        </div>

        <!-- 客房信息 -->
        <wrapper title="客房信息">
          <table class="table-default">
            <tr>
              <td>可住：{{roomDetailData.number}}人</td>
              <td>窗户：{{roomDetailData.ifWindow=='0'?'有':roomDetailData.ifWindow=='1'?'无':roomDetailData.ifWindow=='2'?'落地':''}}窗</td>
            </tr>
            <tr>
              <td>面积：{{roomDetailData.acreage}}㎡</td>
              <td>楼层：{{roomDetailData.floor}}层</td>
            </tr>
            <tr>
              <td colspan="2">床型：{{roomDetailData.bedStr2}}</td>
            </tr>
            <tr>
              <td colspan="2">说明：{{roomDetailData.summary}}</td>
            </tr>
          </table>
        </wrapper>
        <template v-if="roomDetailData.facilitys&&roomDetailData.facilitys.length">
          <wrapper title="房间设施" v-if="show">
            <div class="list">
              <div class="list-item" v-for="(item,index) in roomDetailData.facilitys" :key="index">
                <i class="xx-icon icon-gou2"></i>
                <span>{{item.name}}</span>
              </div>
            </div>
          </wrapper>

          <div class="down" @click="toggle">
            {{show?"收起":'查看全部设置'}}
            <i
              class="xx-icon"
              :class="show?'icon-xiangshangjiantou':'icon-xiangxiajiantou'"
            ></i>
          </div>
        </template>
        <!-- 房间设施 -->

        <!-- 预定说明 -->
        <info-bar title="预定说明">
          <div class="order-rule">
            <span class="title">• 早餐政策：</span>
            <div
              class="content-text breakFast"
            >{{getBreckFast(roomDetailData.ruleBook&&roomDetailData.ruleBook.ifBreakfast)}}</div>
          </div>
          <div
            v-if="roomDetailData.ruleBook&&(roomDetailData.ruleBook.bookBeforeDay>0||roomDetailData.ruleBook.bookBeforeHour>0||roomDetailData.ruleBook.bookBeforeMin>0)"
            class="order-rule"
          >
            <span class="title">• 提前预订：</span>
            <div class="content-text before">
                需提前
              <span v-if="roomDetailData.ruleBook.bookBeforeDay&&roomDetailData.ruleBook.bookBeforeDay>0">{{roomDetailData.ruleBook.bookBeforeDay}}天</span>
              <span v-if="roomDetailData.ruleBook.bookBeforeHour&&roomDetailData.ruleBook.bookBeforeHour>0">{{roomDetailData.ruleBook.bookBeforeHour}}小时</span>
              <span v-if="roomDetailData.ruleBook.bookBeforeMin&&roomDetailData.ruleBook.bookBeforeMin>0">{{roomDetailData.ruleBook.bookBeforeMin}}分</span>
              预订
            </div>
          </div>
          <div
            v-if="roomDetailData.ruleBook&&(roomDetailData.ruleBook.bookDateStart||roomDetailData.ruleBook.bookDateEnd||roomDetailData.ruleBook.bookTimeStart||roomDetailData.ruleBook.bookTimeEnd)"
            class="order-rule"
          >
            <span class="title">• 预订时间：</span>
            <div class="content-text before">
              <span v-if="roomDetailData.ruleBook.bookDateStart">在{{roomDetailData.ruleBook.bookDateStart}}至</span>
              <span v-if="roomDetailData.ruleBook.bookDateEnd">{{roomDetailData.ruleBook.bookDateEnd}}日期内可预订</span><br v-if="roomDetailData.ruleBook.bookDateStart">
               <span v-if="roomDetailData.ruleBook.bookTimeStart">在{{roomDetailData.ruleBook.bookTimeStart}}至</span>
              <span v-if="roomDetailData.ruleBook.bookTimeEnd">{{roomDetailData.ruleBook.bookTimeEnd}}时段内可预订</span>
            </div>
          </div>
          <div
            v-if="roomDetailData.ruleBook&&(roomDetailData.ruleBook.bookDaysNumMin||roomDetailData.ruleBook.bookDaysNumMax)"
            class="order-rule"
          >
            <span class="title">• 连住政策：</span>
            <div class="content-text">
              <template
                v-if="roomDetailData.ruleBook.bookDaysNumMin"
              >每间房最少预订{{roomDetailData.ruleBook.bookDaysNumMin}}晚起住</template>
              <template
                v-if="roomDetailData.ruleBook.bookDaysNumMin&&roomDetailData.ruleBook.bookDaysNumMax"
              >，</template>
              <template
                v-if="roomDetailData.ruleBook.bookDaysNumMax"
              >最多预订{{roomDetailData.ruleBook.bookDaysNumMax}}晚</template>
            </div>
          </div>
          <div
            v-if="roomDetailData.ruleBook&&(roomDetailData.ruleBook.bookRoomNumMin||roomDetailData.ruleBook.bookRoomNumMax)"
            class="order-rule"
          >
            <span class="title">• 预订间数：</span>
            <div class="content-text">
              <template
                v-if="roomDetailData.ruleBook.bookRoomNumMin"
              >最少预订{{roomDetailData.ruleBook.bookRoomNumMin}}间</template>
              <template
                v-if="roomDetailData.ruleBook.bookRoomNumMin&&roomDetailData.ruleBook.bookRoomNumMax"
              >，</template>
              <template
                v-if="roomDetailData.ruleBook.bookRoomNumMax"
              >最多预订{{roomDetailData.ruleBook.bookRoomNumMax}}间</template>
            </div>
          </div>
          <div
            v-if="roomDetailData.ruleBook&&roomDetailData.ruleBook.addBedRule"
            class="order-rule"
          >
            <span class="title">• 加床政策：</span>
            <div class="content-text">{{roomDetailData.ruleBook.addBedRule}}</div>
          </div>
        </info-bar>

        <!-- 取消及退款政策 -->
        <rule-table
          v-if="hasBottom"
          :tableData="timeArr"
          :ruleCancel="ruleCancel"
          :quantuiTime="quantuiTime"
          :quantuiType="quantuiType"
        ></rule-table>
      </main>
      <footer v-if="hasBottom" class="footer">
        <div class="price">
          <span class="txt">每晚均价</span>
          <span class="unit">￥</span>
          <span class="num">{{roomDetailData.productPrice}}</span>
        </div>
        <div v-if="roomDetailData.stockNum>0&&(roomDetailData.screen=='F'&&roomDetailData.enabled=='T')" @click.stop="preOrder" class="submit">预订</div>
        <div v-else style="background:#999999;" class="submit">预订</div>
      </footer>
    </div>
  </div>
</template>
<script>
import { Popup } from "vux";
// import imgSlide from "../components/imgSlide";
import imgSlide from "../../components/imgSlide";
import checkinInfo from "../../components/checkinInfo";
import infoBar from "../../components/infoBar";
import wrapper from "../../components/wrapper";
import { formatterTime } from "../../utils/index";
import ruleTable from "../../components/ruleTable";
export default {
  components: {
    ruleTable,
    Popup,
    imgSlide,
    checkinInfo,
    infoBar,
    wrapper
  },
  props: {
    hasBottom: {
      type: Boolean,
      default: true
    },
    checkInTime: {
      type: String
    },
    data: {
      type: Object,
      default: () => {}
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  mounted() {},
  data() {
    return {
      quantuiType: "",
      quantuiTime: "",
      ruleCancel:{},
      vagPrice: null,
      cancelRule: {},
      timeArr: [],
      timeList: [
        {
          hour: 36,
          proportion: "100%"
        }
      ],
      roomDetailData: this.data,
      show: false,
      detailData: {},
      cureentValue: this.value,
      imgUrls: []
    };
  },
  methods: {
    close() {
      document.getElementById("roomDetailContent").scrollTop = 0;
      this.cureentValue = false;
      this.$emit("close")
    },
    preOrder() {
      this.cureentValue = false;
      window.history.back();
      this.$emit("preOrder");
    },
    getBreckFast(type) {
      let list = [
        { key: 0, value: "无早" },
        { key: 1, value: "含单早" },
        { key: 2, value: "含双早" },
        { key: 3, value: "含三早" }
      ];
      let item = list.find(item => item.key == type);
      return item ? item.value : "";
    },
    toggle() {
      this.show = !this.show;
    },
     resetTimeData() {
      this.timeArr = [];
      this.quantuiTime = "";
      this.quantuiType = "";
    },
  },
  watch: {
    data(val) {
      this.roomDetailData = val;
      this.ruleCancel=val.ruleCancel
      if (
        val.ruleCancel &&
        val.ruleCancel.cancelRuleJson &&
        JSON.parse(val.ruleCancel.cancelRuleJson)
      ) {
        this.cancelRule = JSON.parse(val.ruleCancel.cancelRuleJson);
        if (this.cancelRule.excludeTime) {
          if (this.cancelRule.excludeTime.minutes) {
            this.quantuiTime = this.cancelRule.excludeTime.minutes;
          } else {
            this.quantuiTime = "";
          }
          if (this.cancelRule.excludeTime.quantuiType) {
            this.quantuiType = this.cancelRule.excludeTime.quantuiType;
          } else {
            this.quantuiType = "";
          }
        } else {
          this.quantuiTime = "";
          this.quantuiType = "";
        }
        if (
          this.cancelRule.excludeTimeAdd &&
          this.cancelRule.excludeTimeAdd.length
        ) {
          // this.getTimeRule();
          this.timeArr = formatterTime(
            this.checkInTime,
            this.cancelRule.excludeTimeAdd
          );
        } else {
          this.timeArr = [];
        }
      } else {
        this.resetTimeData();
      }
      // if (val.datePrices && val.datePrices.length) {
      //   let sumPirce = val.datePrices.reduce((total, item) => {
      //     return total + item.price * 100;
      //   }, 0);
      //   this.vagPrice = (sumPirce / val.datePrices.length / 100).toFixed(2);
      // }
    },
   
    value(val) {
      this.cureentValue = val;
    },
    cureentValue(val) {
      this.$emit("input", val);
    }
  }
};
</script>
<style lang="scss">
.detail-popup {
  .order-rule {
    font-size: 14px;
    color: #413838;
    line-height: 30px;
    display: flex;
    .title {
      display: inline-block;
      width: 85px;
    }
    .content-text {
      flex: 1;
      &.before {
      }
    }
  }
  .order-notice {
    padding-bottom: 20px;
    color: #413838;
    font-size: 14px;
  }
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 501;
  }
  .room-detail {
    background: #f5f5f5;
    z-index: 600;
    position: fixed;
    width: 100%;
    left: 0;
    bottom: -600px;
    transition: all 1s;
    &.b-p {
      padding-bottom: 49px;
    }
    &.on {
      bottom: 0;
    }
    .footer {
      height: 49px;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      display: flex;
      align-items: center;
      background: #333;
      color: #fff;
      .price {
        flex: 1;
        display: flex;
        align-items: baseline;
        padding-left: 15px;

        .num {
          font-weight: bold;
          font-size: 16px;
        }
        .txt {
          font-size: 13px;
        }
        .unit {
          font-size: 11px;
        }
      }
      .submit {
        width: 129px;
        height: 49px;
        line-height: 49px;
        font-size: 15px;
        background: linear-gradient(to right, #ff9256, #ff4441);
        text-align: center;
        font-weight: bold;
      }
    }
    .room-detail-header {
      background: #fff;
      text-align: center;
      height: 55px;
      line-height: 55px;
      font-size: 16px;
      color: #413838;
      font-weight: bold;
      position: relative;
      .room-name {
        display: inline-block;
        width: 300px;
        text-align: center;
        margin: 0 auto;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .close-bar {
        position: absolute;
        top: 0;
        right: 0;
        height: 55px;
        display: flex;
        align-items: center;
        font-size: 14px;
        padding-right: 15px;
        .xx-icon {
          color: #999999;
        }
      }
    }
    .down {
      height: 45px;
      line-height: 45px;
      text-align: center;
      font-size: 12px;
      color: #0086f6;
      background: #fff;
      border-top: 1px solid #e1e1e1;
      margin-bottom: 10px;
      //   box-shadow: 0 0 5px #e1e1e1;
      .xx-icon {
        margin-left: 4px;
        font-size: 6px;
        color: #0086f6;
      }
    }
    .content {
      max-height: 500px;
      overflow-y: scroll;
      .breakFast {
        font-size: 14px;
        color: #00c94e;
      }
      .slide-img-bar {
        padding: 0 10px;
        padding-bottom: 20px;
        background: #fff;
      }
    }
  }
}
</style>