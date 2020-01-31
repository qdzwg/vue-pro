<template>
  <div class="pay-result">
    <template v-if="show">
      <img class="result-img" src="../../assets/images/sucess.png" alt>
      <div class="info">
        <div>恭喜你</div>
        <div>本次支付交易成功</div>
      </div>
      <div class="qcode-look" @click="look">查看检票二维码</div>
    </template>
    <!-- <template v-else>
      <img class="result-img" src="../../assets/images/fail.png" alt>
      <div class="info">
        <div>本次支付交易失败</div>
      </div>
    </template>-->
  </div>
</template>
<script>
export default {
  data() {
    return {
      show: true
    };
  },
  created() {},
  mounted() {
    // console.log(this.$route);
  },
  methods: {
    look() {
      this.$router.push("/traffic_qrcode?out_trade_no=" + this.$route.query.out_trade_no);
    }
  }
};
</script>
<style lang="scss">
.pay-result {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: #fff;
  text-align: center;
  .result-img {
    height: 130px;
    width: 130px;
    padding-left: 30px;
    margin: 0 auto;
    display: block;
    margin-top: 50px;
    margin-bottom: 20px;
  }
  .info {
    text-align: center;
    font-size: 14px;
    color: #666;
    margin-bottom: 60px;
  }
  .qcode-look {
    display: inline-block;
    width: 200px;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: #fff;
    background: #ff9900;
  }
}
</style>
