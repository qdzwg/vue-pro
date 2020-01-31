
<template>
  <div class="rule-warpper">
     
      <p class="order-notice" v-if="ruleCancel.ifCancel=='T'&&ruleCancel.cancelTimeRule=='F'">入住前，可免费取消</p>
       <p class="order-notice" v-else-if="ruleCancel.ifCancel=='F'">订单付款成功后不可以取消/变更，如未入住，商家将扣除全部房费</p>
    <p v-if="ruleCancel.cancelTimeRule=='T'&&quantuiTime>0" class="order-notice">• 下单{{quantuiTime}}{{timeType}}内免费取消，此规则不受下述规则限制</p>
    <table v-if="ruleCancel.cancelTimeRule=='T'&&timeArr.length" cellspacing="0" class="rule-table">
      <thead>
        <tr>
          <th>北京时间</th>
          <th>规则</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in timeArr" :key="index">
          <td>
            <div v-if="item.start">{{item.start.month}}-{{item.start.day}} {{item.start.showTime}}后</div>
            <div v-if="item.end">{{item.end.month}}-{{item.end.day}} {{item.end.showTime}}前</div>
          </td>
          <td>
            <div v-if="index==timeArr.length-1">不可取消</div>
            <div v-else>可取消，退支付金额{{item.proportion}}%</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  props: {
    quantuiTime: {
      type: String | String,
      default: 0
    },
    quantuiType: {
      type: String,
      default: "Min"
    },
    ruleCancel:{
        type: Object
    },
    tableData: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    tableData(val) {
      this.timeArr = val;
    },
    quantuiType(val) {
      this.timeType = this.getType();
    }
  },
  methods: {
    getType() {
      let text = "分钟";
      if (this.quantuiType == "Day") {
        text = "天";
      }
      if (this.quantuiType == "Hour") {
        text = "小时";
      }
      if (this.quantuiType == "Min") {
        text = "分钟";
      }
      return text;
    }
  },
  data() {
    return {
      timeType: this.getType(),
      timeArr: this.tableData
    };
  },
  created(){
      console.log(this.tableData)
  }
};
</script>
<style lang="scss" scoped>
.rule-warpper {
  .rule-table {
    width: 100%;
    border-bottom: 1px solid #e1e1e1;
    border-right: 1px solid #e1e1e1;
    th,
    td {
      padding: 12px 0;
      color: #413838;
      font-size: 14px;
      text-align: center;
      border-top: 1px solid #e1e1e1;
      border-left: 1px solid #e1e1e1;
      &:first-child {
        width: 138px;
      }
      div {
        line-height: 17px;
      }
    }
    th {
      font-weight: bold;
      background: #f8f8f8;
    }
  }
}
</style>