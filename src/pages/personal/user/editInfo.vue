<template>
  <div class="editInfo">
      <div class="info-ul boxshadow">
        <div class="info-li clearfix" v-if="label=='name'">
          <input type="text" placeholder="请填写姓名" maxlength="10" v-model="name" class="info-input">
        </div>
        <div class="info-li clearfix" v-if="label=='idcard'">
          <input type="text" placeholder="请填写身份证" maxlength="18" v-model="idcard" class="info-input">
        </div>
        <div class="info-li clearfix" v-if="label=='mobile'">
          <input type="text" placeholder="请填写手机号" maxlength="11" v-model="mobile" class="info-input">
        </div>
        <div class="info-li clearfix" v-if="label=='email'">
          <input type="text" placeholder="请填写邮箱" v-model="email" class="info-input">
        </div>
        <x-button type="primary" @click.native="submit" class="btn-sub">提交</x-button>
      </div> 
  </div>
</template>

<script>
import { XButton  } from "vux";
export default {
  components: {
    XButton 
  },
  data() {
    return {
      name: "",
      mobile: "",
      idcard: "",
      email: "",
      label: ""
    };
  },
  created() {
      document.title="修改个人信息"
    this.label = this.$route.query.name;
    if (this.label == "name") {
      this.name =
        this.$route.query.value === null ? "" : this.$route.query.value;
    } else if (this.label == "mobile") {
      this.mobile =
        this.$route.query.value === null ? "" : this.$route.query.value;
    } else if (this.label == "idcard") {
      this.idcard =
        this.$route.query.value === null ? "" : this.$route.query.value;
    } else if (this.label == "email") {
      this.email =
        this.$route.query.value === null ? "" : this.$route.query.value;
    }
  },
  methods: {
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
    submit() {
      let _this = this;
      let data = {};
      if (this.name != "") {
        data = {
          nickName: this.name
        };
      } else {
        this.$vux.toast.text("姓名不能为空",'middle')
        return false;
      }

      if (this.mobile != "") {
        if (!/^1[3-9][0-9]{9}$/.test(_this.mobile)) {
          this.$vux.toast.text("手机号格式不正确",'middle')
          return false;
        } else {
          data = {
            mobile: this.mobile
          };
        }
      }

      if (this.idcard != "") {
        if (!this.isIdCardNo(_this.idcard)) {
          this.$vux.toast.text("身份证号格式不正确",'middle')
          return false;
        } else {
          data = {
            idcard: this.idcard
          };
        }
      }
      if (this.email != "") {
        if (
          !/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(
            _this.email
          )
        ) {
          this.$vux.toast.text("邮箱格式不正确",'middle')
          return false;
        } else {
          data = {
            email: this.email
          };
        }
      }
      this.postAxios(this.api.member.modify, data).then(res => {
        if (res.status == 200) {
          this.$vux.toast.show({
              type:'success',
              text:"操作成功"
          })
          this.$router.back()
        }
      });
    }
  }
};
</script>

<style lang='scss'>
.editInfo {
  width: 100%;
  .info-ul {
    width: 100%;
    background-color: #fff;
    margin-bottom: 10px;
    .info-li {
      width: 100%;
      height: 53px;
      line-height: 53px;
      .info-title {
        font-size: 14px;
        color: #413838;
        float: left;
        // padding-left: 15px;
        width: 57px;
        margin-left: 15px;
      }
      .info-input {
        font-size: 14px;
        color: #999999;
        float: left;
        height: 53px;
        line-height: 53px;
        width: 270px;
        padding-left: 15px;
        border:none;
        background-color: #fff;
        outline: none;
      }
      .arrow-left-icon {
        width: 5px;
        height: 10px;
        float: right;
        margin-top: 24px;
        margin: 24px 13px 0 10px;
      }
    }
    .btn-sub {
      width: 90%;
      margin-top: 20px;
      button::after {
        border-radius: 0;
        border: none;
      }
    }
  }
}
</style>
