<template>
    <div class="add-address">
        <div class="info">
            <span class="info-title">物流公司</span>
            <div class="express-box">
                <popup-radio @on-change="bindPickerChange" placeholder="请选择物流公司" v-model="index" :options="expressList" :show.sync="selectShow"> </popup-radio>
            </div>
        </div>
        <div class="info">
            <span class="info-title">物流单号</span>
            <input placeholder="请填写物流单号" v-model='expressCode' maxlength="30" class="info-input" type="text">
        </div>
        <div class="info">
            <span class="info-title">退货说明</span>
            <input placeholder="请填写退货说明" v-model='remark' class="info-input" type="text">
        </div>
        <div class="receiver">

            <x-address :title="title" v-model="value" value-text-align="right" raw-value @on-shadow-change="getAddress" :list="ChinaAddressV4Data" @on-hide="closeAddress" placeholder="请选择地址" :show.sync="showAddress"></x-address>
        </div>
        <div @click='submit' class="add-sure">提交申请</div>

    </div>
</template>

<script>
import { XAddress, ChinaAddressV4Data, PopupRadio } from "vux";
// import selectAddress from "@/components/selectAddress";
export default {
  data() {
    return {
      showAddress: false,
      value: [],
      title: "地址",
      ChinaAddressV4Data: ChinaAddressV4Data,
      index: null,
      selectShow: false,
      expressType: "", //快递类型
      remark: "", //说明
      expressCode: "", //物流单号
      orderRefundNo: "", //退单号
      expressList: [],
      realExpressData: []
    };
  },
  components: {
    XAddress,
    ChinaAddressV4Data,
    PopupRadio
  },
  created() {
    this.getAxios(this.api.main.express).then(res => {
      this.realExpressData = res.data;
      this.expressList = [];
      res.data.forEach(element => {
        this.expressList.push(element.value);
      });
    });
  },
  methods: {
    bindPickerChange(e) {
      this.realExpressData.forEach(ele => {
        if (ele.value == e) {
          this.expressType = ele.key;
        }
      });
      this.index = e;
    },
    submit() {
      if (!this.expressType) {
           this.$vux.toast.show({
              type:'cancel',
              text:'请选择物流公司',
              width:'200px'
          })
        return false;
      }
      if (!this.expressCode) {
           this.$vux.toast.show({
              type:'cancel',
              text:'请填写物流单号',
              width:'200px'
          })
        return false;
      }
      this.postAxios(this.api.member.order.retreatSendGoods, {
        expressType: this.expressType,
        remark: this.remark,
        expressCode: this.expressCode,
        orderRefundNo: this.$route.query.orderRefundNo
      }).then(res => {
           this.$vux.toast.show({
              type:'success',
              text:'提交成功！',
              
          })
          this.$router.back()
      });
    },
    getAddress(ids, names) {
      this.addressStr = names[0] + "-" + names[1] + "-" + names[2];
      this.areaName = names[0] + "-" + names[1] + "-" + names[2];
      this.province = ids[0];
      this.city = ids[1];
      this.area = ids[2];
    },
    closeAddress(item) {
      if (item) {
      } else {
      }
    },
  }
};
</script>

<style lang="scss">
.add-address {
  .receiver {
    background-color: #fff;
    height: 53.5px;
    line-height: 30px;
    font-size: 14px;
  }
  .info {
    height: 53.5px;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    color: #413838;
    font-size: 14px;
    font-family: PingFangSC-Medium, sans-serif;
    background-color: #fff;
    margin-bottom: 10px;
    .info-title {
      padding-left: 16px;
      width: 75px;
    }
    .express-box {
      width: 80%;
      height: 35px;
      .picker-select {
        height: 100%;
        width: 100%;
        .picker {
          height: 35px;
          width: 100%;
          line-height: 35px;
        }
        .please-select {
          color: #999;
        }
      }
    }
    .info-input {
      width: 100%;
      padding: 5px 0;
      margin-right: 15px;
      border: none;
      outline: none;
      text-align: right;
      font-size: 14px;
    }
    .address {
      width: 253px;
      padding-right: 10px;
      display: inline-block;
    }
    .input-style {
      color: #999999;
      z-index: 600;
    }
    .jiantou-svg {
      // margin-right: 13px;
      color: #f05b47;
      font-size: 9px;
      font-weight: 700;
    }
  }
  .detail-address {
    min-height: 48px;
    height: auto;
    padding-top: 20px;
    align-items: flex-start;
    .info-area {
      margin-top: 3px;
      line-height: 24px;
      height: 48px;
      width: 203px;
      padding-right: 60px;
      z-index: 0;
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
    font-family: PingFangSC-Medium, sans-serif;
  }
}
</style>
