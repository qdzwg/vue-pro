<template>
  <div class="address-warper">
    <!-- <navbar title="选择自提地址"></navbar> -->
    <!-- <h2>{{radiovalue}}</h2> -->
    <div>
      <div v-if="selfPlaceList.length" class="address-list">
        <!-- <radio-group class="radio-group" @change="radioChange"> -->
        <label class="radio" v-for="(item,index) in selfPlaceList" :key="index">
          <div class="address-item boxshadow">
            <div class="address-info">
              <!-- <radio :value="item.id" color="#f05b47" class="address-radio"/> -->
              <div class="checkbox-box">
                <label>
                  <input
                    type="radio"
                    @change="radioChange"
                    :value="item.id"
                    name="radioAddress"
                    v-model="radiovalue"
                  >
                  <div class="checkbox-moli"></div>
                </label>
              </div>
              <div class="buyer-info">
                <div class="name-tel">
                  <div class="name">
                    <span class="title">自提点:</span>
                    {{item.name}}
                  </div>
                  <span class="tel">{{item.linkTel}}</span>
                </div>
                <div class="work-time">
                  <span class="title">营业时间:</span>
                  <span class="time">{{item.pickupBeginDate}}-{{item.pickupEndDate}}</span>
                </div>
                <div class="address two-line">{{item.areaAddr}}{{item.addr}}</div>
              </div>
            </div>
            <div class="handle-warper">
              <i class="xx-icon icon-line address-svg" @click.stop="del(item.id)"></i>
            </div>
          </div>
          <!-- <radio value="{{item.name}}" checked="{{item.checked}}" />{{item.value}} -->
        </label>
        <!-- </radio-group> -->
      </div>
      <div class="no-address" v-else>暂无数据</div>

      <div class="selfplace-info">
        <div class="info-warper">
          <div class="info item clearfix">
            <span class="title">提货信息</span>
          </div>
          <div class="item clearfix">
            <span class="title">提货人</span>
            <input v-model="getter" placeholder="请填写提货人" class="content-input" type="text">
          </div>
          <div class="item clearfix">
            <span class="title">手机号码</span>
            <input v-model="geterTel" placeholder="请填写手机号码" class="content-input" type="text">
          </div>
        </div>
        <div @click="sure" class="sure">确认</div>
      </div>
    </div>
  </div>
</template>

<script>
// import { getData, postData, merchantInfoId } from "@/common/common";
// import navbar from "@/components/navbar";
// import api from "@/api/api";
export default {
  components: {
    // navbar
  },
  data() {
    return {
      radiovalue: null,
      selfPlace: [],
      selfPlaceList: [],
      getter: "",
      geterTel: ""
    };
  },
  computed: {},
  created() {
    document.title = "选择自提地址";
    this.getAxios(this.api.shop.order.selfPlace, {
      mdseId: this.$route.query.modeId
    }).then(res => {
      this.selfPlaceList = res.data && res.data.length ? res.data : [];
    });
  },
  methods: {
    radioChange() {
      this.itemData = this.selfPlaceList.find(
        item => item.id == this.radiovalue
      );
    },
    sure() {
      if (!this.getter) {
        this.$vux.toast.text("请填写提货人", "middle");
        return false;
      }
      if (!this.geterTel) {
        this.$vux.toast.text("请填写提货人联系电话", "middle");
        return false;
      } else {
        var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!myreg.test(this.geterTel)) {
          this.$vux.toast.text("联系电话格式错误", "middle");
          return false;
        }
      }
      //   wx.setStorageSync("mdseselfPlacexjscwx_2018_19_17", {
      //     selfPlace: this.selfPlace,
      //     getter: this.getter,
      //     geterTel: this.geterTel
      //   });
      localStorage.setItem(
        "xjsc_vue_mdse_self_place_2019_3_25",
        JSON.stringify({
          selfPlace: this.itemData,
          getter: this.getter,
          geterTel: this.geterTel
        })
      );
      this.go("/order/mdse?from=selfPlace")
    },
    // radioChange(e) {
    //   let id = e.mp.detail.value;
    //   this.selfPlace = this.selfPlaceList.find((item, index) => {
    //     return id == item.id;
    //   });
    // },
    goUrl(path) {
      // this.closeModal();
      this.navigatePageTo(this.router + path);
    }
  }
};
</script>

<style lang="scss">
.address-warper {
  .checkbox-box {
    display: inline-block;
    height: 20px;
    padding: 0 10px;
    input {
      display: none;
    }
    .checkbox-moli {
      display: inline-block;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 1px solid #9a9a9a;
      background: #ffffff;
      position: relative;
    }
    div.checkbox-moli::after {
      position: absolute;
      left: 0;
      top: 0;
      content: "";
      width: 16px;
      height: 16px;
    }
    input:checked + .checkbox-moli {
      border-color: transparent;
    }
    input:checked + .checkbox-moli::after {
      background: url("../../../../assets/images/checkbox.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      -moz-background-size: 100% 100%;
      transform: scale(1.3);
    }
  }
  .address-list {
    padding-top: 10px;
    .address-item {
      background: #fff;
      height: 93px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: PingFangSC-Medium, sans-serif;
      color: #413838;
      .address-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .address-radio {
          transform: scale(0.7);
          margin: 0 12px;
        }
        .buyer-info {
          .name-tel {
            margin-bottom: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .name {
              font-size: 14px;
              margin-right: 11px;
              .title {
                margin-right: 5px;
              }
            }
            .tel {
              font-size: 12px;
              color: #5c5c5c;
            }
          }
          .work-time {
            font-size: 12px;
            margin-bottom: 5px;
            color: #f05b47;
            .title {
              color: #413838;
              margin-right: 5px;
            }
          }
          .address {
            width: 223px;
            font-size: 12px;
          }
        }
      }

      .handle-warper {
        display: flex;
        justify-content: space-between;
        padding-right: 20px;
        .xx-icon {
          font-size: 25px;
          color: #999;
        }
        .edit {
          margin-right: 20px;
        }
      }
    }
  }
  .no-address {
    // background: #fff;
    text-align: center;
    font-family: PingFangSC-Medium, sans-serif;
    color: #413838;
    font-size: 18px;
    margin-top: 10px;
    padding: 15px;
  }
  .selfplace-info {
    background: #fff;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    .info-warper {
      padding-left: 15px;
      .item {
        font-size: 14px;
        color: #413838;
        font-family: PingFangSC-Medium, sans-serif;
        display: flex;
        align-items: center;
        height: 52.5px;
        border-bottom: 0.5px solid #d7d7d7;
        .title {
          display: inline-block;
          width: 76px;
        }
        .content-input {
          width: calc(100% - 100px);
          outline: none;
          border: none;
        }
      }
      .item:last-child {
        border-bottom: none;
      }
    }
    .sure {
      height: 48.5px;
      line-height: 48.5px;
      background: #f05b47;
      color: #fff;
      text-align: center;
      font-size: 16px;
      font-family: PingFangSC-Medium, sans-serif;
    }
  }
}
</style>
