<template>
    <div class="yearcard-pay">
        <div class="title">{{title}}</div>
        <div class="section">

            <div class="section-title" v-if="cardTypeList.length>1" @click="show=true">{{CHNCardType}}</div>
            <div class="section-title" v-if="cardTypeList.length==1">{{CHNCardType}}</div>
            <input placeholder-class="place-holder" class="input-text input-content" v-model="cardNo" placeholder="请填写身份证号">
        </div>
        <div class="section">
            <!-- <div class="section-title">姓名</div> -->
            <input placeholder-class="place-holder" class="input-text input-content" v-model="accName" placeholder="请填写姓名">
        </div>
        <div class="section">
            <div class="section-title">价格</div>
            <div class="input-text price">￥{{orderSum}}</div>
        </div>
        <div class="btn-card" @click="submit">立即充值</div>
        <popup v-model="show" height=16%>
            <checker v-model='value' type="radio" default-item-class="item" selected-item-class="item-selected" radio-required>
                <checker-item v-for="(ele,i) in finalType" :key="i" :value="ele.key" @on-item-click="onItemClick(ele.value)">
                    {{ele.value}}
                </checker-item>
            </checker>

        </popup>
        <div>
            <div v-html="formStr"></div>
        </div>
        <pay ref="pay" :totalprice="payMoney" :isWxPay="isWxPay"></pay>
    </div>
</template>

<script>
import { isWxAli } from "@/common/common";
import { Popup, Checker, CheckerItem } from "vux";
import pay from "../../service/order/public/pay";
export default {
  components: { Popup, Checker, CheckerItem, pay },
  data() {
    return {
      title: "",
      id: "",
      orderSum: "",
      cardNo: "",
      accName: "",
      cardType: "",
      CHNCardType: "",
      cardTypeChoice: "",
      finalType: [],
      cardTypeList: [],
      show: false,
      value: "",
      payMoney: null,
      payOrderNo: null,
      orderDescription: null,
      payType: "",
      formStr: "",
      isWxPay:false,
    };
  },
  created() {
       document.title = "年卡充值";
    // this.getAxios("/leaguer/api/userLeaguer/manage/leaguerInfo", {
    //   leaguerId: localStorage.getItem("xjsc_login_userId_2019_3_8")
    // }).then(res => {
    // });
    this.getAxios("/marketing/api/yearCardTob/selectById", {
      id: this.$route.query.cardId
    }).then(res => {
      this.title = res.data.cardName;
      this.id = res.data.id;
      this.cardTypeChoice = res.data.cardTypeChoice;
      this.orderSum = res.data.cardPrice;
      if (res.data.cardTypeList) {
        this.cardTypeList = res.data.cardTypeList;
      }
    });
    this.getAxios("/admin/api/sysParam/getSysParamByKey", {
      key: "cardMediumType"
    }).then(res => {
      if (res.message && this.cardTypeList) {
        let cardTypeMessage = res.message.split(",");
        cardTypeMessage.forEach((item, index) => {
          let obj = {
            key: cardTypeMessage[index].split(":")[0],
            value: cardTypeMessage[index].split(":")[1]
          };
          this.finalType.push(obj);
        });
        this.$nextTick(() => {
          this.finalType.forEach(ele => {
            if (ele.key == this.cardTypeList[0]) {
              this.CHNCardType = ele.value;
              this.value = ele.key;
            }
          });
        }, 300);
      }
    });
  },
  methods: {
    onItemClick(name) {
      this.CHNCardType = name;
      this.show = false;
    },
    isIdCardNo(num) {
      var factorArr = new Array(
        7,
        9,
        10,
        5,
        8,
        4,
        2,
        1,
        6,
        3,
        7,
        9,
        10,
        5,
        8,
        4,
        2,
        1
      );
      var parityBit = new Array(
        "1",
        "0",
        "X",
        "9",
        "8",
        "7",
        "6",
        "5",
        "4",
        "3",
        "2"
      );
      var varArray = new Array();
      var intValue;
      var lngProduct = 0;
      var intCheckDigit;
      var intStrLen = num.length;
      var idNumber = num;
      // initialize
      if (intStrLen != 15 && intStrLen != 18) {
        return false;
      }
      // check and set value
      for (let i = 0; i < intStrLen; i++) {
        varArray[i] = idNumber.charAt(i);
        if ((varArray[i] < "0" || varArray[i] > "9") && i != 17) {
          return false;
        } else if (i < 17) {
          varArray[i] = varArray[i] * factorArr[i];
        }
      }

      if (intStrLen == 18) {
        // check date
        var date8 = idNumber.substring(6, 14);
        if (isDate8(date8) == false) {
          return false;
        }
        // calculate the sum of the products
        for (let i = 0; i < 17; i++) {
          lngProduct = lngProduct + varArray[i];
        }
        // calculate the check digit
        intCheckDigit = parityBit[lngProduct % 11];
        // check last digit
        if (varArray[17] != intCheckDigit) {
          return false;
        }
      } else {
        // length is 15
        // check date
        var date6 = idNumber.substring(6, 12);
        if (isDate6(date6) == false) {
          return false;
        }
      }
      return true;
      function isDate8(sDate) {
        if (!/^[0-9]{8}$/.test(sDate)) {
          return false;
        }
        var year, month, day;
        year = sDate.substring(0, 4);
        month = sDate.substring(4, 6);
        day = sDate.substring(6, 8);
        var iaMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (year < 1700 || year > 2500) return false;
        if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)
          iaMonthDays[1] = 29;
        if (month < 1 || month > 12) return false;
        if (day < 1 || day > iaMonthDays[month - 1]) return false;
        return true;
      }
    },
    // 支付宝支付
    openPay() {
      let extendParam = {
        orderInfo: this.orderDescription,
        redirectUrl: encodeURIComponent(window.location.href),
        openId: this.openId ? this.openId : ""
      };
      this.getAxios(this.api.main.pay.goPay, {
        accountId: this.$route.query.m_id,
        extendParamJson: JSON.stringify(extendParam),
        operateId: localStorage.getItem("xjsc_login_userId_2019_3_8"),
        payOrderNo: this.payOrderNo,
        paySum: this.payMoney,
        payType: this.payType,
        userType: "C",
        wayType: 1
      }).then(res => {
        let env = isWxAli();
        this.formStr = res.data;
        this.isWxPay = env.isWx;
        this.$refs.pay.aliPayShow = true;
      });
    },
    submit() {
      let _this = this;
      if (this.accName == "") {
        this.$vux.toast.text("姓名不能为空", "middle");
        return false;
      }
      if (this.cardNo == "") {
        this.$vux.toast.text("身份证号不能为空", "middle");
        return false;
      }
      if (this.cardNo != "") {
        if (!this.isIdCardNo(_this.cardNo)) {
          this.$vux.toast.text("身份证号格式不正确", "middle");
          return false;
        }
      }
      let data = {
        cardNo: this.cardNo,
        orderSum: this.orderSum,
        id: this.id,
        cardType: this.value,
        CHNCardType: this.CHNCardType,
        accName: this.accName,
        cardTypeChoice: this.cardTypeChoice
      };
      this.postAxios("/yearcard/api/saveOrder", data).then(res => {
        if (res.status == 200) {
          this.orderDescription = res.data.orderDescription;
          this.payOrderNo = res.data.payOrderNo;
          this.payMoney = res.data.paySum;
          this.openPaySure()
        } else {
          this.$vux.toast.show({
            type: "cancel",
            text: res.message
          });
        }
      });
    },
    openPaySure(){
        let env = isWxAli();
          this.getAxios("/merchant/api/merchantPayType/getMerchantPayType", {
            businessType: env.isWx ? "WEIXIN" : env.isAliPay ? "ALI" : "WAP"
          }).then(res => {
            this.payType = JSON.parse(res.message)[0];
            //微信端获取openid
            if (env.isWx) {
              this.getAxios("/leaguer/api/userLeaguer/manage/leaguerInfo", {
                leaguerId: localStorage.getItem("xjsc_login_userId_2019_3_8")
              }).then(res => {
                this.openId = res.data.openId ? res.data.openId : "";
                this.openPay();
              });
            } else if (env.isAliPay) {
              //阿里
              this.openPay();
            } else {
              this.openPay();
            }
          });
    }
  }
};
</script>

<style lang="scss">
.yearcard-pay {
  .title {
    height: 53px;
    text-align: center;
    font-size: 16px;
    background-color: #fff;
    line-height: 53px;
    margin-bottom: 20px;
  }
  .btn-card {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 50px;
    text-align: center;
    line-height: 50px;
    font-size: 18px;
    background-color: #009ded;
    color: #fff;
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
    .cropper-label {
      width: 29px;
      height: 25.5px;
    }
    .section-title {
      width: 50px;
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
    }
    .price {
      color: red;
    }
    .place-holder {
      font-size: 14px;
      color: #999;
    }
  }
  .item {
    display: block;
    font-size: 14px;
    text-align: center;
    height: 52px;
    line-height: 52px;
    background-color: #fff;
    border-top: 1px solid #eee;
  }
  .item-selected {
    color: red;
  }
}
</style>


