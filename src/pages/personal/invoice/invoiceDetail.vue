<template>
    <div class="invoiceDetail">

        <span class="title">发票信息</span>
        <div class="section">
            <div class="section-title">发票类型</div>
            <div class="input-text">{{invoicesInfo.buyCategory==0?"公司":"个人/其他"}}</div>
        </div>
        <div class="section">
            <div class="section-title">发票抬头</div>
            <div class="input-text">{{invoicesInfo.userName}}</div>
        </div>
        <div class="section">
            <div class="section-title">发票金额</div>
            <div class="input-text">{{invoicesInfo.nontaxAmount}}</div>
        </div>
        <div class="section">
            <div class="section-title">发票时间</div>
            <div class="input-text">{{invoicesInfo.invoiceTime}}</div>
        </div>
        <span class="title">接收信息</span>
        <div class="section">
            <div class="section-title">手机号码</div>
            <div class="input-text">{{receiveInfo.buyTel}}</div>
        </div>
        <div class="section">
            <div class="section-title">邮箱地址</div>
            <div class="input-text">{{receiveInfo.receiveEmail}}</div>
        </div>
    <div class="uesr-btn" @click="back">返回</div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      invoicesInfo: {
        buyCategory: "",
        invoiceTime: "",
        nontaxAmount: "",
        userName: ""
      },
      receiveInfo: {
        buyTel: "",
        receiveEmail: ""
      }
    };
  },
  created() {
    document.title = "发票详情";
    if (this.$route.query.payOrderNo) {
      this.getAxios(
        "/marketing/api/marketElectronicInvoices/detailInvoiceReq",
        {
          payOrderNo: this.$route.query.payOrderNo
        }
      ).then(res => {
        if (res.status == 200) {
          this.invoicesInfo = res.data.invoicesInfo;
          this.receiveInfo = res.data.receiveInfo;
        }
      });
    }
  },
  methods: {
       back() {
      this.$router.back();
    }
  }
};
</script>

<style lang="scss" scope>
.invoiceDetail {
  .title {
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;
  }
  .section {
    display: flex;
    align-items: center;
    flex-direction: row;
    // width: 100%;
    height: 53px;
    line-height: 53px;
    padding: 0 10px;
    background-color: #fff;
    border-bottom: 0.5px solid #eeeee7;
    .section-title {
      width: 70px;
      font-size: 14px;
      color: #413838;
    }
    .input-text {
      padding-left: 10px;
      padding-right: 15px;
      outline: none;
      border: none;
      flex: 1;
      height: 24px;
      line-height: 24px;
      font-size: 14px;
      color: #413838;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
  }
  .uesr-btn {
    width: 100%;
    height: 49px;
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: #009ded;
    color: #fff;
    text-align: center;
    line-height: 49px;
    font-size: 16px;
  }
}
</style>


