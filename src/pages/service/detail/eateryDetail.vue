<template>
  <div class="eatery-detail">
    <div class="repast-counpon">
      <div class="counpon-img">
        <img :src="detailData.thumbnail + '?imageMogr2/thumbnail/640x/strip/quality/100'"
             alt="">
      </div>
      <div class="counpon-title">
        <h1 class="title">{{detailData.enteryName}}</h1>
        <div class="buy-price">
          <span class="ztitle">{{detailData.alias}}</span>
          <span class="orgin-price"
                v-if="detailData.rackPrice">门市价：{{detailData.rackPrice}}</span>
          <span class="price"
                v-if="detailData.priceSettle">¥{{detailData.priceSettle}}</span>
        </div>
      </div>
    </div>
    <div class="ticket-detail-warpper m-b-10">
      <h2 class="ticket-w-title">预订须知</h2>
      <div class="ticket-detail-box">
        <div v-html="scenicDetail"></div>
      </div>
    </div>
    <div class="ticket-detail-warpper m-b-10">
      <h2 class="ticket-w-title">图文详情</h2>
      <div class="ticket-detail-box">
        <div v-html="orderDetail"></div>
      </div>
    </div>
    <div class="order-footer">
      <div class="order-total clearfix">
        <div class="order-total-left">
          <div class="gotoHome"
               v-if="detailData.priceSettle">
            <span class="unit">¥</span>
            <span class="price">{{detailData.priceSettle}}</span>
            <span class="orgin-price">¥{{detailData.rackPrice}}</span>
          </div>
        </div>
        <div class="authorization-btn"
             @click="order">立即抢购</div>
      </div>
    </div>
    <float-nav></float-nav>
  </div>
</template>
<script>
import floatNav from "@/components/floatNav";
export default {
  components: {
    floatNav
  },
  data () {
    return {
      totalPrice: 0,
      wayType: 1,
      detailData: "",
      scenicDetail: "",
      orderDetail: ""
    };
  },
  created () {
    document.title = "餐券详情";
    let _this = this;
    let detailUrl = this.api.repast.detail.mealCoupon;

    let pd = this.getAxios(detailUrl, {
      wayType: this.wayType,
      id: this.$route.query.id
    });
    Promise.all([pd])
      .then(result => {
        _this.detailData = result[0].data;
        _this.scenicDetail = result[0].data.bookingNotice.replace(/<\/?[>]*>/g, "");
        _this.orderDetail = result[0].data.introduction.replace(/<\/?[>]*>/g, "");
      })
      .catch(error => { });
  },
  methods: {
    order () {
      this.checkToken().then(res => {
        if (res.status && res.status == 200) {
          localStorage.setItem(
            "eateryOrderData",
            JSON.stringify(this.detailData)
          );
          this.$router.push("/order/repast");
        }
      });
    }
  }
};
</script>
<style lang="scss">
@import "../../../assets/styles/mixin.scss";
.eatery-detail {
  .repast-counpon {
    background-color: #fff;
    margin-bottom: 10px;
    .counpon-img {
      width: 100%;
      height: 200px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .counpon-title {
      .title {
        margin-left: 10px;
        margin-top: 10px;
        font-size: 18px;
        color: #413838;
        display: inline-block;
        vertical-align: middle;
        font-weight: bold;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      .buy-price {
        font-size: 14px;
        color: #999;
        display: flex;
        padding: 10px 0;
        span {
          vertical-align: middle;
          height: 25px;
          line-height: 25px;
        }
        .ztitle {
          flex-grow: 1;
          margin-left: 10px;
          padding-right: 20px;
        }
        .orgin-price {
          flex-grow: 1;
          margin-left: 10px;
          font-size: 12px;
          color: #999;
        }
        .price {
          flex-grow: 1;
          font-size: 18px;
          color: #f66;
        }
      }
    }
  }
  .ticket-detail-warpper {
    background: #fff;
    .ticket-w-title {
      @include sc(18px, #413838);
      font-weight: 600;
      padding: 20px 0px 20px 15px;
    }
    .ticket-detail-box {
      padding: 0px 15px 20px 15px;
      img {
        width: 100%;
      }
    }
  }
  .order-footer {
    padding-top: 58.5px;
    position: relative;
    z-index: 29;
    .order-total {
      font-size: 14px;
      height: 49px;
      background-color: #fff;
      position: fixed;
      bottom: 0;
      width: 100%;
      left: 0;
      .order-total-left {
        width: 204.5px;
        float: left;
        .gotoHome {
          float: left;
          width: 200px;
          height: 49px;
          margin-left: 15px;
          // text-align:center;
          span {
            vertical-align: baseline;
          }
          .unit {
            font-size: 12px;
            color: #f66;
          }
          .price {
            line-height: 49px;
            font-size: 25px;
            font-weight: 700;
            color: #f66;
          }
          .orgin-price {
            margin-left: 12px;
            font-size: 12px;
            color: #999;
            text-decoration: line-through;
          }
        }
      }
      .authorization-btn {
        border-radius: 0;
        border: none;
        background: #f05b47;
        color: #fff;
        font-family: PingFangSC-Regular, sans-serif;
        font-size: 16px;
        height: 49px;
        line-height: 49px;
        width: 150px;
        float: right;
        text-align: center;
      }
    }
  }
}
</style>


