<template>
  <div class="newContacts">
    <div>
      <div class="topShadow"></div>
      <div class="section">
        <div class="section-title">姓名</div>
        <input
          placeholder-class="place-holder"
          class="input-text input-content"
          maxlength="10"
          v-model="name"
          placeholder="须与证件上的姓名一致"
        >
      </div>
      <div class="section">
        <div class="section-title">手机号</div>
        <input
          placeholder-class="place-holder"
          name="phone"
          type="number"
          maxlength="11"
          class="input-text input-content"
          v-model="phone"
          placeholder="请填写手机号"
        >
      </div>
      <div class="section">
        <div class="section-title">身份证</div>
        <input
          placeholder-class="place-holder"
          class="input-text input-content"
          type="idcard"
          maxlength="18"
          v-model="certNo"
          placeholder="请填写身份证号码"
        >
      </div>
      <div class="section" :class="{'g-img':faceUrl}">
        <div class="section-title">人脸照</div>
        <div class="p-content">
          <photo @returnFaceUrl="getSrc">
            <img
              class="up-img"
              v-if="!faceUrl"
              src="../../../assets/images/camera-icon.png"
              alt
            >
            <img class="show-img" v-else :src="faceUrl" alt>
            <span class="text">人脸图片用于入园对比</span>
          </photo>
        </div>
      </div>

      <div class="btn-area" @click="formSubmit" v-if="name&&phone">
        <button class="btn-area">完成</button>
      </div>
      <div class="btn-area-disabled" v-else>
        <button class="btn-area-disabled">完成</button>
      </div>
    </div>
  </div>
</template>

<script>
// Use Vuex
// import api from "@/api/api";
// import { getData, postData, merchantInfoId, host } from "@/common/common";
// import sha1 from "sha1";
// import faceRecognition from "@/components/faceRecognition";
// import navbar from "@/components/navbar";
// import { VueCropper } from "vue-cropper";
import vueCropper from "@/components/vueCropper";
// import sha1 from "sha1";
import axios from "axios";
import { baseUrl } from "../../../../config/index";
import photo from "@/components/photo";
export default {
  components: {
    vueCropper,
    photo
    // VueCropper
    // navbar
  },
  data() {
    return {
      subShow: "hidden",
      type: "add",
      name: "",
      phone: "",
      certNo: "",
      faceUrl: "",
      id: "",
      leaguerId: "",
      route: ""
    };
  },
  created() {
    document.title = "新增联系人";
    // console.log(1);
    if (this.$route.query.id) {
      this.type = "edit";
      this.getAxios(this.api.contacts.selectContactsById, {
        id: this.$route.query.id
      }).then(res => {
        this.id = res.data.id;
        this.name = res.data.name;
        this.phone = res.data.phone;
        this.certNo = res.data.certNo;
        this.faceUrl = res.data.faceUrl;
      });
    }
  },
  methods: {
    getSrc(src) {
      // console.log(src)
      this.faceUrl = src;
    },
    getImgUrl(src) {
      let bUrl = src;
      //  base64编码
      let base64 = src.replace(/^(data:\s*image\/(\w+);base64,)/, "");
      this.postAxios("/admin/api/aibeeFace/getQuality", {
        photo: base64
      }).then(resaibee => {
        if (resaibee.data.error_no != 0) {
          this.$vux.toast.text(resaibee.data.error_msg, "middle");
        } else {
          axios({
            method: "POST",
            url: "/admin/api/ui/uplodeBase64",
            data: base64,
            headers: {
              "content-type": "application/json"
            },
            baseURL: process.env.NODE_ENV == "production" ? baseUrl : ""
          }).then(res => {
            if (res.status == 200) {
              this.faceUrl = res.message;
            }
          });
        }
      });
    },
    getUrl(arr) {
      this.faceUrl = arr;
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
    },
    formSubmit() {
      let _this = this;
      if (this.name == "") {
        this.$vux.toast.text("请填写姓名", "middle");
        return false;
      }
      if (this.phone == "") {
        this.$vux.toast.text("请填写手机号", "middle");
        return false;
      }
      if (!/^1[3-9][0-9]{9}$/.test(this.phone)) {
        this.$vux.toast.text("手机号格式不正确", "middle");
        return false;
      }
      if (this.certNo != "") {
        if (
          !/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx])/.test(
            this.certNo
          )
        ) {
          this.$vux.toast.text("身份证号码格式不正确", "middle");
          return false;
        }
      }

      this.postAxios(this.api.contacts.saveContacts, {
        id: this.id,
        leaguerId:
          localStorage.getItem("xjsc_login_userId_2019_3_8") ||
          this.$cookie.get("leaguerInfoId"),
        name: this.name,
        phone: this.phone,
        certNo: this.certNo,
        faceUrl: this.faceUrl
      }).then(res => {
        if (res.status == 200) {
          // this.$vux.toast.text(this.type=='add'?"添加成功":"编辑成功", "middle");
          if (_this.route == "orderBack") {
            let obj = {};
            obj = {
              name: _this.name,
              phone: _this.phone,
              certNo: _this.certNo,
              faceUrl: _this.faceUrl
            };
            localStorage.setItem("xjsc_2018_linkMan", obj);
            _this.$router.back();
          } else {
            this.$router.back();
          }
        } else {
          this.$vux.toast.text(res.message, "middle");
        }
      });
    }
  }
};
</script>

<style lang="scss">
.newContacts {
  padding: 0 15px;
  background-color: #fff;
  .cropper-wrapper {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    justify-content: center;
    height: 100%;
    background-color: #e5e5e5;
  }

  .cropper-buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
  }

  .cropper-buttons .upload,
  .cropper-buttons .getCropperImage {
    width: 50%;
    text-align: center;
  }

  .cropper {
    position: absolute;
    top: 0;
    left: 0;
  }

  .cropper-buttons {
    background-color: rgba(0, 0, 0, 0.95);
    color: #04b00f;
  }
  .topShadow {
    width: 100%;
    height: 0.5px;
    background-color: rgba(146, 144, 144, 0.2);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
  }
  .section {
    display: flex;
    align-items: center;
    flex-direction: row;
    width: 100%;
    height: 53px;
    line-height: 53px;
    // margin: 0 15px;
    border-bottom: 0.5px solid #eeeee7;
    .camera-tips {
      color: rgba(65, 56, 56, 0.5);
      margin-left: 10px;
      font-size: 14px;
    }
    .p-content {
      padding-left: 35px;
    }
    .section-c-box {
      position: relative;
    }
    &.g-img {
      .cropper-label {
        line-height: 28px;
        height: 28px;
      }
    }
    .cropper-page {
      padding-left: 35px;
    }

    .cropper-label {
      // width: 29px;
      height: 25.5px;
      line-height: 25.5px;
      .cropper-img {
        height: 100%;
        width: 29px;
        float: left;
      }
    }
    .face-box {
      .info-item {
        .camera-icon {
          margin-left: 8px;
        }
      }
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
      padding-left: 35px;
      padding-right: 15px;
      outline: none;
      border: none;
      flex: 1;
      height: 24px;
      line-height: 24px;
      font-size: 14px;
      color: #413838;
    }
    .place-holder {
      font-size: 14px;
      color: #999;
    }

    .img-camera-show {
      padding-left: 35px;
      width: 40px;
      height: 40px;
      image {
        display: block;
        width: auto;
        height: 40px;
      }
    }
    .img-camera {
      padding-left: 35px;
      width: 29px;
      height: 25.5px;
    }
  }
  .section view {
    margin-right: 10px;
  }
  .btn-area {
    width: 100%;
    height: 49px;
    position: fixed;
    bottom: 0;
    left: 0;
    border-radius: 0;
    background-color: #f05b47;
    color: #fff;
    text-align: center;
    line-height: 49px;
    border: none;
    outline: none;
    font-size: 16px;
  }
  button::after {
    border-radius: 0;
    border: none;
  }
  .btn-area-disabled {
    width: 100%;
    height: 49px;
    position: fixed;
    bottom: 0;
    left: 0;
    border-radius: 0;
    background-color: #cbcbcb;
    color: #fff;
    text-align: center;
    line-height: 49px;
    font-size: 16px;
    border: none;
    outline: none;
  }
  .canvas-hide {
    position: fixed;
    right: -100%;
    top: 0;
  }
}
</style>
