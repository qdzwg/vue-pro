<template>
  <div class="qrcode">
    <div class="qrcode-box">
      <div class="img-box" style="width:144px;height:144px;padding:10px;">
        <!-- <img src="../../assets/images/change.png" alt> -->
        <qrcode-vue :value="value" :size="size" level="H"></qrcode-vue>
      </div>

      <div class="check-no">检票辅助码：{{pageData.checkNo}}</div>
    </div>
    <div class="card-info">
      <div class="input-item vux-1px-b">
        <label class="input-title">上车点</label>
        <span class="text over-text">{{pageData.beginSiteName}}</span>
      </div>
      <div class="input-item vux-1px-b">
        <label class="input-title">车牌号</label>
        <span class="text over-text">{{pageData.carNumber}}</span>
      </div>
    </div>
    <div class="card-info">
      <div class="input-item vux-1px-b">
        <label class="input-title">出发时间</label>
        <span class="text">{{month}}月{{day}}日</span>
        <span class="text time">{{hour}}:{{minute}}</span>
      </div>
      <div class="input-item vux-1px-b" v-for="(item,index) in pageData.linkPersonVos" :key="index">
        <label class="input-title">乘车人</label>
        <div class="passenger-info">
          <div class="passenger-name">{{item.linkMan}}</div>
          <div class="passenger-cardno">{{item.idCardNo}}</div>
        </div>
      </div>
      <!-- <div class="input-item">
        <label class="input-title">乘车人</label>
        <div class="passenger-info">
          <div class="passenger-name">蛙鸣阿斯达</div>
          <div class="passenger-cardno">3301274199999922222</div>
        </div>
      </div>-->
    </div>
    <div class="more-look" @click="toOrderList">查看订单更多信息</div>
  </div>
</template>
<script>
import QrcodeVue from "qrcode.vue";
export default {
  components: {
    QrcodeVue
  },
  data() {
    return {
      value: "",
      size: "144",
      pageData: {},
      month: "",
      day: "",
      hour: "",
      minute: "",
      baseUrl: ''
    };
  },
  created() {
    // 获取跳转链接
    this.jsonAxios("/order/leaguer/api/common/getForwardAddress", {}).then(
      res => {
        this.baseUrl = res.data && res.data.wapOrder;
      }
    );
    // 获取数据
    this.jsonAxios("/order/leaguer/api/order/getCheckOrder", {
      payOrderNo: this.$route.query.out_trade_no,
      accType: "1",
      token: window.localStorage.getItem("xjt_token_2019610")
    }).then(res => {
      // this.value = 'www.baidu.com'
      this.pageData = res.data[0];
      if (res.data[0]) {
        let beginDate = new Date(res.data[0].outTime);
        //  var year = beginDate.getFullYear();
        this.value = res.data[0].checkNo;
        let month = beginDate.getMonth() + 1;
        let day = beginDate.getDate();
        let hour = beginDate.getHours(); //时，
        let minute = beginDate.getMinutes(); //分
        this.month = month > 9 ? month : "0" + month;
        this.day = day > 9 ? day : "0" + day;
        this.hour = hour > 9 ? hour : "0" + hour;
        this.minute = minute > 9 ? minute : "0" + minute;
      } else {
        alert('未知错误');
        this.pageData = {}
      }
    });
  },
  methods: {
    toOrderList() {
      window.location.href = this.baseUrl;
    }
  }
};
</script>
<style lang="scss" scoped>
.qrcode {
  .more-look {
    height: 40px;
    line-height: 40px;
    width: calc(100% - 30px);
    margin-left: 15px;
    font-size: 15px;
    color: #fff;
    text-align: center;
    background: #ff9900;
    border-radius: 2px;
    margin-top: 39px;
  }
  .card-info {
    background: #fff;
    margin-bottom: 8px;
    .input-item {
      padding: 0 15px;
      &:last-child {
        border-bottom: none;
      }
      span.over-text {
        flex: 1;
        word-break: break-all;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        /* ! autoprefixer: off */
        -webkit-box-orient: vertical;
        /* autoprefixer: on */
        overflow: hidden;
      }
      span.text {
        font-size: 15px;
        color: #333;
      }
      span.time {
        margin-left: 10px;
      }

      .input-title {
        font-size: 15px;
        color: #999;
        width: 82px;
      }
      .passenger-info {
        .passenger-name {
          font-size: 15px;
          color: #333;
        }
        .passenger-cardno {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
  .qrcode-box {
    padding-top: 15px;
    background: #fff;
    margin-bottom: 8px;
    text-align: center;
    .check-no {
      font-size: 13px;
      color: #333;
      margin-top: 12px;
      padding-bottom: 12px;
    }
    .img-box {
      display: inline-block;
      img {
        height: 100%;
        width: 100%;
      }
    }
  }
}
</style>
