<template>
  <div class="pay-page">
    <div class="table-bar">
      <table cellspacing="0">
        <thead>
          <tr>
            <th colspan="2">订单信息</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>储值金额</td>
            <td>￥180.00</td>
          </tr>
          <tr>
            <td>储值赠金</td>
            <td>￥180.00</td>
          </tr>
          <tr>
            <td>储值赠品</td>
            <td class="no-center">
              <span class="txt">新时代大玩票新时</span>
            </td>
          </tr>
          <tr>
            <td>应付金额</td>
            <td class="sure-pay">￥180.00</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="table-bar">
      <table cellspacing="0">
        <thead>
          <tr>
            <th colspan="2">联系人信息</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>联系人</td>
            <td class="no-center">
              <input  @blur="iosBlur" class="info-input" placeholder="请输入联系人" type="text" />
            </td>
          </tr>
          <tr>
            <td>手机号码</td>
            <td class="no-center">
              <input  @blur="iosBlur" class="info-input" placeholder="请输入手机号码" type="text" />
            </td>
          </tr>
          <tr>
            <td>身份证号</td>
            <td class="no-center">
              <input  @blur="iosBlur" class="info-input" placeholder="请输入身份证号" type="text" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <button class="pay-btn" type="button">确认支付</button>
  </div>
</template>
<style lang="scss" scoped>
.pay-page {
    .pay-btn{
        height: 45px;
        line-height: 45px;
        background: #3f86ff;
        text-align: center;
        font-size: 16px;
        color: #fff;
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        border: none;
    }
  .table-bar {
    table {
      width: 100%;
      th {
        height: 35px;
        background: #f5f6fa;
        font-size: 14px;
        color: #333;
        text-align: left;
        padding-left: 12.5px;
      }
      td {
        padding: 10px 0;
        background: #fff;
        border-bottom: 1px solid #ebecf1;
        .info-input {
          font-size: 15px;
          color: #333;
          border: none;
          outline: none;
        //   padding: 0 10px;
          width: 100%;
          text-align: right;
        }
        .info-input::-webkit-input-placeholder {
          color: #999;
          font-size: 14px;
        }
        .info-input:-moz-placeholder {
          color: #999;
          font-size: 14px;
        }
        .info-input:-ms-input-placeholder {
          color: #999;
          font-size: 14px;
        }
        &:first-child {
          text-align: left;
          font-size: 15px;
          color: #999;
          padding-left: 12.5px;
          width: 70px;
        }
        &:last-child {
          font-size: 15px;
          color: #333;
          text-align: right;
          padding-right: 12.5px;
        }
        &.no-center {
          text-align: left;
          .txt {
            float: right;
          }
        }
        &.sure-pay {
          color: #ff0000;
        }
      }
      tbody {
        tr:last-child {
          td {
            border-bottom: none;
          }
        }
      }
    }
  }
}
</style>
<script>
export default {
  created() {
    document.title = "确认支付";
  }
};
</script>
