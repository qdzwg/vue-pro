<template>
  <div class="pay-success">
    <div class="t-c">
      <img
        class="success-img"
        src="https://statics.lotsmall.cn/image/20190420/2019042008585046sz24.jpeg?imageMogr2/thumbnail/640x/strip/quality/100"
        alt
      />
    </div>

    <div class="success-txt t-c">支付成功！</div>
    <div class="px-name t-c">阿斯顿撒旦门票</div>
    <div class="t-c message">
      <span>已成功提交，请查收您的</span>
      <span class="txt">短信</span>
    </div>
    <div class="opt-bar">
      <button class="btn code" type="button">检票二维码</button>
      <button class="btn balance" type="button">查看余额</button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.pay-success {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: #fff;
  .t-c {
    text-align: center;
  }
  .opt-bar {
    margin-top: 40px;
    display: flex;
    justify-content: center;
    .btn {
      height: 43px;
      width: 140px;
      text-align: center;
      line-height: 43px;
      color: #1848f7;
      border: 1px solid #1848f7;
      border-radius: 4px;
      background: #fff;
      font-size: 14px;
      &:first-child {
        margin-right: 30px;
      }
    }
  }
  .success-img {
    width: 130px;
    height: 90px;
    display: block;
    margin: 0 auto;
    margin-top: 50px;
  }
  .success-txt {
    font-size: 18px;
    color: #333;
    margin-top: 30px;
  }
  .px-name {
    margin-top: 15px;
    font-size: 12px;
    color: #a1a1a1;
  }
  .message {
    font-size: 12px;
    display: flex;
    justify-content: center;
    color: #a1a1a1;
    .txt {
      color: #1848f7;
    }
  }
}
</style>

<script>
export default {};
</script>