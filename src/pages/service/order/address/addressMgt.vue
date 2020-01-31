<template>
  <div class="add-address">
    <!-- <navbar title='添加收货地址'></navbar> -->
    <!-- <picker :columns="1" :data="years" v-model="year3" @on-change="change3"></picker> -->
    <area-select :areaArrStr="areaCodeArr" ref="areaselect" @getAddress="getAddress"></area-select>
    <div>
      <!-- <input type="text"> -->

      <div class="receiver info m-t-10 m-b-10 bg-w boxshadow">
        <span class="info-title">收货人</span>
        <!-- <button @click="test">zzzzasda</button> -->
        <input
          maxlength="10"
          v-model="linName"
          placeholder="请填写收货人姓名"
          placeholder-class="input-style"
          class="info-input"
          type="text"
        >
      </div>
      <div class="receiver info m-t-10 m-b-10 bg-w boxshadow">
        <span class="info-title">手机号</span>
        <input
          placeholder="请填写手机号码"
          v-model="likPhone"
          placeholder-class="input-style"
          class="info-input"
          type="number"
        >
      </div>
      <div class="receiver info m-t-10 m-b-10 bg-w boxshadow" @click="openselectaddress">
        <span class="info-title">所在地区</span>
        <input
          v-if="show"
          v-model="addressStr"
          disabled
          placeholder-class="input-style"
          class="info-input"
          type="search"
        >
        <span class="address" v-else>{{addressStr?addressStr:''}}</span>
        <i class="xx-icon icon-iconfont-jiantou jiantou-svg fr"></i>
      </div>
      <div class="receiver info m-t-10 m-b-10 bg-w boxshadow detail-address">
        <span class="info-title">详细地址</span>
        <textarea
          v-if="show"
          v-model="addressDetail"
          :style="{zIndex:zIndex}"
          placeholder="如道路、门牌号、小区、楼栋号、单元室等"
          maxlength="50"
          show-confirm-bar
          placeholder-class="input-style"
          class="info-area"
          :class="{'isIos':isIos}"
          type="text"
        />
        <span v-if="!show">{{addressDetail?addressDetail:'如道路、门牌号、小区、楼栋号、单元室等'}}</span>
      </div>
      <!-- <select-address @setShow='setShow' @setAddress='getAddress' ref='address'></select-address> -->
      <div @click="submit" class="add-sure">确定</div>
    </div>
  </div>
</template>

<script>
// import { getData, postData, merchantInfoId } from "@/common/common";
// import selectAddress from "@/components/selectAddress";
import areaSelect from "@/components/areaSelect";
import { Picker } from "vux";
export default {
  data() {
    return {
      year3: ["2005"],
      years: [],
      isIos: false,
      addressStr: "",
      zIndex: 0,
      show: true,
      addressDetail: "", //详细地址
      areaName: "", //区域名称
      likPhone: "", //联系电话
      linName: "", //联系人
      province: "", //省
      city: "", //市
      area: "", //区
      areaCodeArr: ""
    };
  },
  components: {
    Picker,
    areaSelect
    // selectAddress,
    // navbar
  },
  created() {
    if (this.$route.query.id) {
      //编辑页
      this.id = this.$route.query.id;
      this.getAxios(this.api.main.address.detail, {
        leaguerAddressId: this.id
      }).then(res => {
        // console.log(res);
        this.addressStr = res.data.areaName;
        this.addressDetail = res.data.addressDetail;
        this.linName = res.data.linName;
        this.likPhone = res.data.likPhone;
        this.areaCodeArr = res.data.areaCode
          ? res.data.areaCode
          : "110000-110100-110100";
      });
    }
  },
  // created() {
  //   // let phone = wx.getSystemInfoSync(); //调用方法获取机型
  //   // if (phone.platform == "ios") {
  //   //   this.isIos = true;
  //   // } else if (phone.platform == "android") {
  //   //   this.isIos = false;
  //   // }
  // },
  // onUnload() {
  //   //页面数据重置
  //   this.id = "";
  //   this.addressDetail = "";
  //   this.areaName = "";
  //   this.likPhone = "";
  //   this.linName = "";
  //   this.addressStr = "";
  // },
  methods: {
    submit() {
      if (!this.linName) {
        // wx.showToast({
        //   title: "请填写收货人请填写收货请填写收货人人请填写收货人请填写收货人",
        //   duration: 2000,
        //   icon: "none"
        // });
        this.$vux.toast.text("请填写收货人", "middle");
        return false;
      }
      if (!this.likPhone) {
        this.$vux.toast.text("请填写手机号", "middle");
        // wx.showToast({
        //   title: "请填写手机号",
        //   duration: 2000,
        //   icon: "none"
        // });
        return false;
      }
      if (
        !/^1(3|4|5|7|8|9)\d{9}$/.test(this.likPhone) &&
        this.likPhone.length != 11
      ) {
        this.$vux.toast.text("手机号格式不正确", "middle");
        // wx.showToast({
        //   title: "手机号格式不正确",
        //   duration: 2000,
        //   icon: "none"
        // });
        return false;
      }
      if (!this.addressStr) {
        this.$vux.toast.text("请填写所在地区", "middle");
        // wx.showToast({
        //   title: "请填写所在地区",
        //   duration: 2000,
        //   icon: "none"
        // });
        return false;
      }
      if (!this.addressDetail) {
        this.$vux.toast.text("请填写详细地址", "middle");
        // wx.showToast({
        //   title: "请填写详细地址",
        //   duration: 2000,
        //   icon: "none"
        // });
        return false;
      }
      let obj = {};
      if (this.id) {
        obj = {
          id: this.id
        };
      }
      this.postAxios(
        this.api.main.address.save,
        Object.assign(
          {
            leaguerId: localStorage.getItem("xjsc_login_userId_2019_3_8")||this.$cookie.get("leaguerInfoId"),
            linName: this.linName,
            likPhone: this.likPhone,
            addressDetail: this.addressDetail,
            areaName: this.areaName,
            areaCode: this.province + "," + this.city + "," + this.area
          },
          obj
        )
      ).then(res => {
        this.$router.back();
      });
    },
    getAddress(arr) {
      this.addressStr = arr[0].name + arr[1].name + arr[2].name;
      this.areaName = arr[0].name + arr[1].name + arr[2].name;
      this.province = arr[0].value;
      this.city = arr[1].value;
      this.area = arr[2].value;
      this.areaCodeArr = arr[0].value + "," + arr[1].value + "," + arr[2].value;
    },
    openselectaddress() {
      this.$refs.areaselect.init();
    },
    goUrl(path) {
      this.navigatePageTo(this.router + path);
    },
    back() {
      wx.navigateBack();
    }
  }
};
</script>

<style lang="scss">
.add-address {
  .info {
    height: 53.5px;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    color: #413838;
    font-size: 14px;
    font-family: PingFangSC-Regular, sans-serif;
    background: #fff;
    .info-title {
      padding-left: 16px;
      width: 75px;
    }
    .info-input {
      background: #fff;
      width: 253px;
      padding-right: 10px;
      outline: none;
      border: none;
    }
    .address {
      width: 253px;
      padding-right: 10px;
      display: inline-block;
    }
    .input-style {
      color: #999;
      z-index: 600;
      line-height: 40px;
    }
    .jiantou-svg {
      // margin-right: 13px;
      color: #f05b47;
      font-size: 12px;
      font-weight: 700;
    }
  }
  .detail-address {
    // min-height: 48px;
    height: auto;
    // padding-top: 20px;
    padding: 20px 0;
    align-items: flex-start;
    .info-area {
      line-height: 24px;
      height: 49px;
      width: 203px;
      padding-right: 60px;
      z-index: 0;
      border: none;
      outline: none;
    }
    .info-area.isIos {
      top: -4.5px;
      left: -4px;
    }
  }
  .add-sure {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background: #f05b47;
    text-align: center;
    height: 49px;
    line-height: 49px;
    color: #fff;
    font-size: 18px;
    font-family: PingFangSC-Regular, sans-serif;
  }
}
</style>
