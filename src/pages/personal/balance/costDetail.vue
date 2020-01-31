<template>
  <div class="cost-page">
    <div class="header">
      <h2>小鲸商城</h2>
      <div class="num">+3.00</div>
      <p>交易成功</p>
    </div>
    <div class="detail">
      <table>
        <tr>
          <td>当前状态</td>
          <td>支付成功/退款成功/充值成功</td>
        </tr>
        <tr>
          <td>交易时间</td>
          <td>2019-05-14 :19:16:32</td>
        </tr>
        <tr>
          <td>交易方式</td>
          <td>余额支付/支付宝支付/微信支付</td>
        </tr>
        <tr>
          <td>交易类型</td>
          <td>消费/退款/充值</td>
        </tr>
        <tr>
          <td>交易订单号</td>
          <td>4200000315201904199834206435</td>
        </tr>
        <tr>
          <td>交易流水</td>
          <td>O2019041923111100023143</td>
        </tr>
        <tr>
          <td>线下商户号</td>
          <td>啊实打实大</td>
        </tr>
        <tr>
          <td>交易说明</td>
          <td>奥术大师多撒奥术大师多撒奥术大师多撒奥术大师多撒奥术大师多撒奥术大师多撒奥术大师多撒奥术大师多撒</td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  created() {
    document.title = "交易详情";
  }
};
</script>
<style lang="scss" scoped>
.cost-page {
  background: #fff;
  .detail {
    padding-top: 20px;
    table {
      width: 100%;
      tr {
        td {
          font-size: 14px;
          padding: 8px 0;
          &:first-child {
            color: #8c8c8c;
            width: 135px;
            padding-left: 12.5px;
            vertical-align: top;
          }
          &:last-child {
            color: #000;
            text-align: right;
            padding-right: 12.5px;
          }
        }
      }
    }
  }
  .header {
    text-align: center;
    color: #000;
    padding-top: 20px;
    h2 {
      font-size: 14px;
    }
    .num {
      font-size: 29px;
    }
    p {
      font-size: 14px;
      color: #999;
    }
  }
}
</style>