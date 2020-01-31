<template>
  <div class="invoicePay">
    <dir class="info-type">发票详情</dir>
    <div class="section">
      <div class="section-title">发票种类</div>
      <div class="input-text">普通发票（电子）</div>
    </div>
    <div class="section">
      <div class="section-title">抬头类型</div>
      <div class="input-text">个人/其他</div>
    </div>
    <div class="section">
      <div class="section-title">发票抬头</div>
      <input  placeholder-class="place-holder" class="input-text input-content" v-model="buyDutyName" placeholder="个人/非企业性单位">
    </div>
    <dir class="info-type">联系人信息</dir>
    <!-- <div class="section">
      <div class="section-title">手机号码</div>
      <input
        placeholder-class="place-holder"
        class="input-text input-content"
        v-model="receiveMobile"
        placeholder="请填写手机号码"
      />
    </div> -->
    <div class="section">
      <div class="section-title">邮箱地址</div>
      <input
        placeholder-class="place-holder"
        class="input-text input-content"
        v-model="receiveEmail"
        placeholder="请填写邮箱"
      />
    </div>
    <!-- <div class="section" v-if="buyCategory=='0'">
            <div class="section-title">开户银行</div>
            <input placeholder-class="place-holder" class="input-text input-content" v-model="accName" placeholder="请填写开户银行">
    </div>-->
    <div class="info-type">消费内容/规格型号</div>
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
    <div class="info-notice">
      <p>温馨提示：</p>
      <p>1、开票申请提交后，系统将以邮件的形式将电子发票发放给您，建议您使用QQ邮箱获取电子发票</p>
      <p>2、若长时间未收到邮件，可查看邮件垃圾箱确认是否被拦截。</p>
    </div>
    <div class="pay-footer">
        <div class="pay-footer-content">
            <!-- <div class="pay-footer-totalprice">
                <em v-if="invoiceAmount||totalInvoiceAmount">￥</em>
                <strong v-if="tableData.length==1">{{invoiceAmount}}</strong>
                <strong v-else>{{totalInvoiceAmount}}</strong>
            </div> -->
            <div class="able-btn pay-footer-btn" @click="save">提交申请</div>
        </div>  
    </div> 
    <!-- 开票提醒 -->
    <x-dialog v-model="noticeShow" class="dialog-demo">
      <div class="notice-body">
        <h2 class="notice-title">开票提醒</h2>
        <div class="notice-content">
          <p>开票申请提交后将无法修改，请确认信息填写无误后点击“提交”按钮完成开票。</p>
          <p style="margin-top:5px;">发票抬头：<strong>{{buyDutyName}}</strong></p>
          <p>邮箱地址：<strong>{{receiveEmail}}</strong></p>
        </div>
        <div class="tickets-footer">
          <span @click="noticeShow=false" class="no-agree">返回修改</span>
          <span @click="agree" class="agree">提交</span>
        </div>
      </div>
    </x-dialog>
  </div>
</template>

<script>
import { CheckIcon, Radio, XDialog } from "vux";
export default {
  components: {
    CheckIcon,
    Radio,
    XDialog
  },
  data() {
    return {
      invoiceAmount: "",
      totalInvoiceAmount: "",
      buyCategory: 1,
      buyDutyName: "",
      buyDutyNo: "",
      buyAddress: "",
      buyTel: "",
      buyBankNo: "",
      receiveMobile: "",
      receiveEmail: "",
      payOrderNo: "",
      tableData: [],
      noticeShow:false
    };
  },
  created() {
    document.title = "申请发票";
    if (this.$route.query.payOrderNo) {
      this.getAxios("/marketing/api/marketElectronicInvoices/rateInvoiceReq", {
        payOrderNo: this.$route.query.payOrderNo,
        dataSource: "yearCard"
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
      } else if (!this.buyDutyNo && this.buyCategory == 0) {
        this.$vux.toast.text("请填写企业税号", "middle");
        return false;
      } 
      else if (!this.receiveEmail) {
        this.$vux.toast.text("请填写邮箱地址", "middle");
        return false;
      }
      // else if (!this.receiveMobile) {
      //   this.$vux.toast.text("请填写手机号码", "middle");
      //   return false;
      // }

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
      // if (!/^1[34578]\d{9}$/.test(this.receiveMobile)) {
      //   this.$vux.toast.text("手机号码格式错误", "middle");
      //   return false;
      // }

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
        this.buyBankNo 
      ) {
        this.$vux.toast.text("银行账号址格式错误", "middle");
        return false;
      }
      
      // 开票提醒
      this.noticeShow = true
      
    },
    agree(){
      this.noticeShow = false;
      let data = {
        buyCategory: this.buyCategory,
        buyDutyName: this.buyDutyName,
        buyDutyNo: this.buyDutyNo,
        buyAddress: this.buyAddress,
        buyTel: this.buyTel,
        buyBankNo: this.buyBankNo,
        receiveMobile: '13533333333', // 20191203,避免后端校验，使用虚拟手机号代替
        receiveEmail: this.receiveEmail,
        payOrderNo: this.$route.query.payOrderNo,
        dataSource: "yearCard"
      };
      let url = "/marketing/api/marketElectronicInvoices/createInvoiceReq";
      this.getAxios(url, data).then(res => {
        if (res.status == 200) {
          // this.$vux.toast.text("评论内容不能为空！", "middle");
          // setTimeout(() => {
          //   this.$router.push('/parkCard/invoice/list?&flag=1');
          // }, 300);  
          if (res.data.code === 0) {
            if (res.data.invoiceResponse.resultCode === 0) {
              this.$vux.toast.text("开票申请提交成功", "middle");
              setTimeout(() => {
                this.$router.push('/parkCard/invoice/list?&flag=1');
              }, 300);  
            } else if (res.data.invoiceResponse.resultCode === 6) {
              this.$vux.toast.text(res.data.invoiceResponse.desc, "middle");
            }
          } else {
            this.$vux.toast.text(res.data.description, "middle");
          }
          
        }
        
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../common.scss';
.invoicePay {
  .info-type {
    height: 44px;
    padding: 0 15px;
    line-height: 44px;
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(187, 187, 187, 1);
  }
  .info-notice {
    width:345px;
    // height:72px;
    font-size:13px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    margin: 20px auto 59px;
    color:#bbb;
    line-height:18px;
  }
  .section {
    display: flex;
    align-items: center;
    flex-direction: row;
    // width: 100%;
    height: 53px;
    line-height: 53px;
    padding: 0 15px;
    background-color: #fff;
    border-bottom: 0.5px solid #eeeeed;
    .cropper-label {
      width: 29px;
      height: 25.5px;
    }
    .section-title {
      width: 70px;
      font-size: 15px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #040000;
    }
    input.input-content {
      font-size: 15px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #040000;
      &::-webkit-input-placeholder {
        color: #bbbbbb;
      }
    }
    .input-text {
      padding-left: 40px;
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
          background: url("~/assets/images/checkbox.png");
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
  }
  .i-t-b {
    background: #fff  
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
.pay-footer {
    height: 81px;
    width: 375px;
    .pay-footer-content {
        background: white;
        position: fixed;
        bottom: 0;
        left: 0;
        display: flex;
        width: 345px;
        padding: 15px;
        justify-content: space-between;
        align-items: center;
        .pay-footer-totalprice{
            font-size:18px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(253,141,0,1);
            line-height:26px;
            em {
                font-size: 18px
            }
            strong {
                font-size: 26px;
                margin-left: -5px;
                font-family:  PingFangSC-Semibold;
            }
        }
        .pay-footer-btn {
            width: 345px;
        }
    }
}
.notice-body {
    // width: 90%;
    background: #ffffff;
    // border-radius: 2px;
    .notice-title {
      text-align: center;
      color: #413838;
      font-size: 16px;
      // height: 30px;
      // line-height: 30px;
      margin-top: 10px;
    }
    .notice-content {
      padding: 0 15px;
      padding-bottom: 0px;
      max-height: 320px;
      overflow: auto;
      margin: 15px 0;
      text-align: left;
      font-size:13px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:#413838;
      line-height:22px;
      img {
        width: 100% !important;
        height: auto !important;
      }
      strong,
      b {
        font-weight: bold;
      }
      em,
      i {
        font-style: italic;
      }
    }
    .tickets-footer {
      height: 48px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .no-agree {
        border-top: 1px solid #eeeee7;
        color: #413838;
        font-size: 16px;
        height: 48px;
        line-height: 48px;
        text-align: center;
        width: 50%;
      }
      .agree {
        color: #fff;
        background: linear-gradient(146deg, #87e6c9 0%, #4fc898 100%);
        font-size: 16px;
        height: 48px;
        line-height: 48px;
        text-align: center;
        width: 50%;
      }
    }
  }
</style>


