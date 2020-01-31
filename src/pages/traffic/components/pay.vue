<template>
  <div class="pay-page"
       v-if="isShow">
    <popup v-model="isShow"
           @on-hide="close">
      <div class="toast-box">
        <div class="modal pay-modal">
          <div class="modal-content pay-sure">
            <div class="pay-money bg-w m-b-10 boxshadow">
              <span class="title">支付金额:</span>
              <span>￥{{totalprice}}</span>
            </div>
            <div class="pay-way bg-w boxshadow">
              <div class="pay-info">
                <i class="xx-icon fl icon-iconfont-weixin1 wx-pay-svg"
                   v-if="isWxPay"></i>
                <i class="xx-icon icon-iconfont-zhifubao pay-svg fl"
                   v-else></i>
                <span class="pay-name fr"
                      v-if="isWxPay">微信支付</span>
                <span class="pay-name fr"
                      v-else>支付宝支付</span>
              </div>
              <span class="xx-icon icon-yuanxingxuanzhongfill wxpayway-radio"
                    v-if="isWxPay"></span>
              <span class="xx-icon icon-yuanxingxuanzhongfill payway-radio"
                    v-else></span>
            </div>
            <div class="pay-btn"
                 :class="{'wx-pay':isWxPay}"
                 @click="pay">去支付</div>
          </div>
        </div>
      </div>
    </popup>
  </div>
</template>
<script>
import { Popup } from "vux";
import { isWxAli } from "@/common/common";
export default {
  components: {
    Popup
  },
  props: {
    totalprice: {
      type: Number | String,
      default: 0
    },
    isIcbc: {
      type: Boolean,
      default: false
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isShow: {
      get () {
        return this.value
      },
      set (newVal) {
        if (!newVal) {
          this.$emit('input', false)
        }
      }
    }
  },
  data () {
    return {
      isWxPay: false
    };
  },
  created () {
    this.isWxPay = isWxAli().isWx;
  },
  methods: {
    pay () {
      if (this.isIcbc) {
        //工行支付
        this.$emit("wxIcbcPay")
      } else if (isWxAli().isAliPay) {
        this.$emit("aliApPay")
      } else {
        this.$parent.$refs.thirdDom.firstChild.submit()
      }
    },
    close () {
      this.isShow = false
    }
  }
};
</script>
<style lang='scss'>
.pay-page {
  .toast-box {
    .pay-modal {
      background: #f7f7f7;
      height: 167.5px;
      .pay-sure {
        background: transparent;
        .pay-money {
          height: 55px;
          line-height: 55px;
          text-align: center;
          font-size: 16px;
          font-family: PingFangSC-Regular, sans-serif;
          border-top-left-radius: 2px;
          border-top-right-radius: 2px;
          color: #fc4150;
          .title {
            color: #020403;
            margin-right: 10px;
          }
        }
        .pay-way {
          padding: 0 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 55px;
          .pay-info {
            height: 55px;
            display: flex;
            align-items: center;
            .pay-svg {
              color: #0ae;
              font-size: 30px;
              margin-right: 10px;
            }
            .wx-pay-svg {
              color: #09bb07;
              font-size: 30px;
              margin-right: 10px;
            }
            .pay-name {
              font-size: 14px;
              font-family: PingFangSC-Regular, sans-serif;
              color: #020403;
            }
          }
          .payway-radio {
            color: #0ae;
            font-size: 16px;
            // transform: scale(0.7);
          }
          .wxpayway-radio {
            color: #09bb07;
            font-size: 16px;
            // transform: scale(0.7);
          }
        }
        .pay-btn {
          height: 49px;
          line-height: 49px;
          background: #0ae;
          color: #fff;
          font-size: 16px;
          text-align: center;
          &.wx-pay {
            background: #09bb07;
          }
        }
      }
    }
  }
}
</style>


