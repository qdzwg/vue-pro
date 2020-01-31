<template>
  <div class="coupon-page" v-show="couponShow">
    <popup v-model="couponShow" class="coupon-modal" position="right" width="100%">
      <!--优惠券弹框-->
      <div class="couponBody">
        <div class="couponList inner coupons_list">
          <div v-if="couponList.length>0" class="item-ul">
            <div v-for="(item, index) in couponList" :key="index" class="item-li boxshadow">
              <div class="left">
                <div class="name">{{item.name}}</div>
                <div class="price">
                  <span class="unit">￥</span>
                  <span class="num">{{item.amount}}</span>
                </div>
              </div>
              <div class="date-use">
                <div class="date">
                  <span class="title">可用时间：</span>
                  <span
                    class="text"
                    v-if="item.validityDateType=='relative'"
                  >领取后{{item.relativeDay}}天失效</span>
                  <span v-else class="text">{{item.validStartDate}} 至 {{item.validEndDate}}</span>
                </div>
                <div class="use">
                  <p v-if="item.useThreshold=='F'">使用条件：无限制</p>
                  <p v-else>使用条件：满{{item.targetAmout}}元可用</p>
                </div>
              </div>
              <div class="right fr">
                <span class="right-btn" @click="useCoupon(item)">立即使用</span>
              </div>
            </div>
          </div>
          <div v-else class="noData">
            <span class="nodata-text">暂无优惠券</span>
          </div>
          <span
            v-if="couponList.length"
            class="btn btn-top cancle-coupon-choice"
            @click="Undontuse"
          >不使用优惠券</span>
          <span class="btn btn-bot cancle-coupon-choice" @click="couponShow=false">返回</span>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
import { Popup } from "vux";
export default {
  components: {
    Popup
  },
  data() {
    return {
      couponShow: false,
      couponList: [],
      modelprice: ""
    };
  },
  created() {},
  methods: {
    useCoupon(item) {
      this.couponShow = false;
      this.$emit("use", item);
    },
    Undontuse() {
      this.couponShow = false;
      this.$emit("nouse");
    },
    show(data) {
      this.couponShow = true;
      this.couponList = data;
    }
  }
};
</script>

<style lang="scss">
@import "../../../../assets/styles/mixin.scss";
.coupon-page {
  .noData{
     text-align: center;
     height: 50px;
     line-height: 50px;
    .nodata-text{
      font-size: 16px;
     
    }
  }
  .coupon-modal {
    background: #f7f7f7;
  }
  .couponBody {
    background-color: #f7f7f7;
    .coupons_list {
      padding-top: 12px;
      .item-ul {
        padding: 0 8px;
        .item-li {
          margin-bottom: 20px;
          height: 140px;
          background: url("http://statics.lotsmall.cn/wx/img/coupons-bg.png")
            center center no-repeat;
          background-size: 100%;
          position: relative;
          .left {
            display: inline-block;
            width: 273px;
            .name {
              margin-top: 7px;
              color: #fff;
              font-size: 14px;
              font-family: PingFangSC-Regular, sans-serif;
              padding-left: 14px;
            }
            .price {
              padding-left: 40px;
              color: #fff;
              margin-top: 6px;
              margin-bottom: 9px;
              font-family: PingFangSC-Regular, sans-serif;
              .unit {
                font-size: 18px;
              }
              .num {
                font-size: 35px;
              }
            }
          }
          .date-use {
            line-height: 10px;
            position: absolute;
            left: 15px;
            bottom: 5px;
            font-size: 9px;
            color: #fff;
            font-family: PingFangSC-Semibold, sans-serif;
            .date {
              margin-bottom: 2.5px;
            }
            .use {
              margin-bottom: 5px;
            }
          }
          .right {
            height: 103px;
            display: inline-block;
            width: calc(100% - 273px);
            text-align: center;
            position: relative;
            .right-btn {
              border: none;
              width: 66px;
              height: 25px;
              line-height: 25px;
              border-radius: 2px;
              background: #fff;
              font-size: 14px;
              color: #f05b47;
              font-family: PingFangSC-Regular, sans-serif;
              margin-top: 44px;
              display: block;
            }
          }
        }
      }
      .btn {
        display: block;
        color: #413838;
        border-radius: 6px;
        width: 90%;
        height: 38px;
        line-height: 38px;
        margin-left: 5%;
        text-align: center;
        font-size: 15px;
        background-color: #fff;
        box-shadow: 0 0 10px rgba(245, 245, 245, 0.5);
        margin-bottom: 10px;
        //   position:fixed;
      }
      .btn-top {
        bottom: 100px;
        left: 0;
      }
      .btn-bot {
        bottom: 0;
        left: 0;
      }
    }
  }
}
</style>
