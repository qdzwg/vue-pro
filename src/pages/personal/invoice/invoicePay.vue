<template>
    <div class="invoicePay">
        <div class="section">
            <div class="section-title">发票种类</div>
            <div class="input-text">普通发票（电子）</div>
        </div>
        <div class="section">
            <div class="section-title">抬头类型</div>
            <div class="input-text">
                <div class="radio-box">
                    <input type="radio" name="type" v-model="buyCategory" value="0" id="buyCategory1">
                    <label for="buyCategory1"></label>
                    <span class="name">公司抬头</span>
                </div>
                <div class="radio-box">
                    <input type="radio" name="type" v-model="buyCategory" value="1" id="buyCategory2">
                    <label for="buyCategory2"></label>
                    <span class="name">个人/其他</span>
                </div>
            </div>
        </div>
        <div class="section">
            <div class="section-title">发票抬头</div>
            <input v-if="buyCategory=='0'" placeholder-class="place-holder" class="input-text input-content" v-model="buyDutyName" placeholder="请填写企业名称或单位名称">
            <input v-if="buyCategory=='1'" placeholder-class="place-holder" class="input-text input-content" v-model="buyDutyName" placeholder="个人/非企业性单位">
        </div>
        <div class="section" v-if="buyCategory=='0'">
            <div class="section-title">企业税号</div>
            <input placeholder-class="place-holder" class="input-text input-content" v-model="buyDutyNo" placeholder="请填写企业税号">
        </div>
        <div class="section">
            <div class="section-title">手机号码</div>
            <input placeholder-class="place-holder" class="input-text input-content" v-model="receiveMobile" placeholder="请填写手机号码">
        </div>
        <div class="section">
            <div class="section-title">邮箱地址</div>
            <input placeholder-class="place-holder" class="input-text input-content" v-model="receiveEmail" placeholder="请填写邮箱地址">
        </div>
        <div class="section" v-if="buyCategory=='0'">
            <div class="section-title">单位地址</div>
            <input placeholder-class="place-holder" class="input-text input-content" v-model="buyAddress" placeholder="请填写单位地址">
        </div>
        <div class="section" v-if="buyCategory=='0'">
            <div class="section-title">电话号码</div>
            <input placeholder-class="place-holder" class="input-text input-content" v-model="buyTel" placeholder="请填写电话号码">
        </div>
        <!-- <div class="section" v-if="buyCategory=='0'">
            <div class="section-title">开户银行</div>
            <input placeholder-class="place-holder" class="input-text input-content" v-model="accName" placeholder="请填写开户银行">
        </div> -->
        <div class="section" v-if="buyCategory=='0'">
            <div class="section-title">银行账户</div>
            <input placeholder-class="place-holder" class="input-text input-content" v-model="buyBankNo" placeholder="请填写银行账户">
        </div>
        <div class="i-t-b">
            <table class="invoice-apply-table">
                <tr>
                    <td>消费内容/规格型号</td>
                    <td class="money">金额(元)</td>
                    <td class="rate">税率</td>
                </tr>
                <tr v-for="(item,index) in tableData" :key="index">
                    <td>{{item.orderInfo?item.orderInfo:''}}</td>
                    <td>{{(item.paySum||item.paySum==0)?item.paySum:''}}</td>
                    <td>{{(item.rate||item.rate==0)?item.rate:''}}</td>
                </tr>
            </table>
        </div>
        <div class="footer">
            <div class="footer-l">
                <span class="text">合计：</span>
                <div class="price">
                    <span v-if="invoiceAmount||totalInvoiceAmount" class="unit">￥</span>
                    <span class="num">
                        <template v-if="tableData.length==1">{{invoiceAmount}}</template>
                        <template v-else>{{totalInvoiceAmount}}</template>
                    </span>
                </div>
            </div>
            <button @click="save" class="footer-r">提交</button>
        </div>
    </div>
</template>

<script>
import { CheckIcon, Radio } from "vux";
export default {
  components: {
    CheckIcon,
    Radio
  },
  data() {
    return {
      invoiceAmount: "",
      totalInvoiceAmount: "",
      buyCategory: "0",
      buyDutyName: "",
      buyDutyNo: "",
      buyAddress: "",
      buyTel: "",
      buyBankNo: "",
      receiveMobile: "",
      receiveEmail: "",
      payOrderNo: "",
      tableData: []
    };
  },
  created() {
    document.title = "申请发票";
    if (this.$route.query.payOrderNo) {
      this.getAxios("/marketing/api/marketElectronicInvoices/rateInvoiceReq", {
        payOrderNo: this.$route.query.payOrderNo
      }).then(res => {
        this.tableData = res.data;
        if (this.tableData.length == 1) {
          this.invoiceAmount = this.tableData[0].paySum + "";
          this.oldInvoiceAmount = this.tableData[0].paySum;
        } else {
          let num = 0;
          this.tableData.forEach((item, index) => {
            num += item.paySum * 100;
          });
          this.totalInvoiceAmount = (num / 100).toFixed(2);
        }
      });
    }
  },
  methods: {
    save() {
      if (!this.tableData.length) {
        this.$vux.toast.text("缺少明细列表", "middle");
        return false;
      }
      //必填验证
      if (!this.buyCategory) {
        this.$vux.toast.text("请选择抬头类型", "middle");
        return false;
      } else if (!this.buyDutyName) {
        this.$vux.toast.text("请填写发票抬头", "middle");
        return false;
      } else if (!this.buyDutyNo && this.form.buyCategory == 0) {
        this.$vux.toast.text("请填写企业税号", "middle");
        return false;
      } else if (!this.receiveMobile) {
        this.$vux.toast.text("请填写手机号码", "middle");
        return false;
      }

      //字段长度限制
      if (this.buyDutyName && this.buyDutyName.length > 48) {
        this.$vux.toast.text("发票抬头长度不能超过48位", "middle");
        return false;
      }

      if (this.receiveEmail && this.receiveEmail.length > 50) {
        this.$vux.toast.text("邮箱地址长度不能超过50位", "middle");
        return false;
      }
      if (this.buyTel && this.buyCategory == 0 && this.buyTel.length > 15) {
        this.$vux.toast.text("电话号码长度不能超过15位", "middle");
        return false;
      }

      if (
        this.buyAddress &&
        this.buyCategory == 0 &&
        this.buyAddress.length > 40
      ) {
        this.$vux.toast.text("单位地址长度不能超过40位", "middle");
        return false;
      }

      if (
        this.buyDutyNo &&
        this.buyCategory == 0 &&
        (this.buyDutyNo.length < 6 || this.buyDutyNo.length > 20)
      ) {
        this.$vux.toast.text("企业税号长度不能少于6大于20位", "middle");
        return false;
      }

      //格式验证
      if (!/^1[34578]\d{9}$/.test(this.receiveMobile)) {
        this.$vux.toast.text("手机号码格式错误", "middle");
        return false;
      }

      if (
        this.receiveEmail &&
        !/[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(
          this.receiveEmail
        )
      ) {
        this.$vux.toast.text("邮箱地址格式错误", "middle");
        return false;
      }

      if (
        this.buyCategory == 0 &&
        this.buyBankNo &&
        !/^([1-9]{1})(\d{14}|\d{18})$/.test(this.form.buyBankNo)
      ) {
        this.$vux.toast.text("银行账号址格式错误", "middle");
        return false;
      }
      let data = {
        buyCategory: this.buyCategory,
        buyDutyName: this.buyDutyName,
        buyDutyNo: this.buyDutyNo,
        buyAddress: this.buyAddress,
        buyTel: this.buyTel,
        buyBankNo: this.buyBankNo,
        receiveMobile: this.receiveMobile,
        receiveEmail: this.receiveEmail,
        payOrderNo: this.$route.query.payOrderNo
      };
      let url = "/marketing/api/marketElectronicInvoices/createInvoiceReq";
      this.getAxios(url, data).then(res => {
        if (res.status == 200) {
          this.$router.back();
          this.$vux.toast.show({
            type: "success",
            text: "开票成功"
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.invoicePay {
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
    .cropper-label {
      width: 29px;
      height: 25.5px;
    }
    .section-title {
      width: 70px;
      font-size: 14px;
      color: #413838;
    }
    input.input-content {
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
      .radio-box {
        display: flex;
        align-items: center;
        margin-right: 10px;
        input {
          display: none;
        }
        label {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 1px solid #aaa;
          border-radius: 50%;
          position: relative;
        }
        label::after {
          cursor: pointer;
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
        }
        input:checked + label {
          border-color: transparent;
        }
        input:checked + label::after {
          background: url("../../../assets/images/checkbox.png");
          background-repeat: no-repeat;
          background-size: 100% 100%;
          -moz-background-size: 100% 100%;
          transform: scale(1.4);
        }
        .name {
          margin-left: 5px;
          font-size: 14px;
          color: #413838;
        }
      }
    }
    .price {
      color: red;
    }
    .place-holder {
      font-size: 14px;
      color: #999;
    }
  }
  .footer {
    z-index: 99999;
    position: fixed;
    width: 100%;
    display: flex;
    // height: 49px;
    align-items: center;
    background: #fff;
    left: 0;
    bottom: 0;
    .footer-l {
      width: 50%;
      display: flex;
      align-items: center;
      .price {
        color: #f05b47;
        .unit {
          font-size: 12px;
        }
        .num {
          font-size: 18px;
        }
      }
      .text {
        font-size: 13px;
        color: #413838;
        margin-left: 12px;
        margin-right: 5px;
      }
      .num {
      }
    }
    .footer-r {
      border: none;
      cursor: pointer;
      width: 50%;
      text-align: center;
      color: #fff;
      background: #f05b47;
      height: 49px;
      line-height: 49px;
      font-size: 16px;
    }
    // height: 49px;
    // line-height: 49px;
    // text-align: center;
    // color: #fff;
    // background: #f05b47;
    // left: 0;
    // bottom: 0;
    // font-size: 16px;
  }
  .i-t-b {
    margin-top: 10px;
    background: #fff;
    margin-bottom: 59px;
  }
  .invoice-apply-table {
    width: 100%;

    tr {
      &:last-child {
        td {
          border: none;
        }
      }
      td {
        border-bottom: 1px solid #eeeee7;
        padding: 15px 10px;
        color: #413838;
        text-align: center;
        font-size: 14px;
        &:first-child {
          text-align: left;
        }
      }
      .money {
        min-width: 70px;
      }
      .rate {
        min-width: 70px;
      }
    }
  }
}
</style>


