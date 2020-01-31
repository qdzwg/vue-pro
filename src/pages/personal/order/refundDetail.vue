<template>
  <div class="back-detail-warp">
      <!-- 退款详情 -->
      <div class="order-detail-info bg-w m-b-10 boxshadow m-t-10">
        <!-- 除了待付款状态没有订单号别的状态下都有订单号 -->
        <div class="orderno-date clearfix m-b">
          <span class="text bottom">售后编码: {{pageData.refundNo}}</span>
          <!-- <span @click="copy" class="copy-btn">复制</span> -->
        </div>
        <div class="orderno-date clearfix m-b">
          <span class="text bottom">售后状态: {{stateName}}</span>
        </div>
        <div v-if="pageData.auditStatus=='1'&&pageData.refundType=='1'&&!pageData.isSended" class="btn-warper">
          <div @click="goUrl('orderRefundNo=' + pageData.refundNo)" class="sent-btn">发货</div>
        </div>
      </div>
      <!-- //商品 -->
      <div v-if="pageData.auditStatus=='1'&&pageData.refundType=='1'" class="order-detail-info bg-w m-b-10 boxshadow">
        <div class="orderno-date clearfix">
          <span class="text">联系人:</span>
          <span class="content-left">{{merchantData.sasContactMan}}</span>
        </div>
        <div class="orderno-date clearfix">
          <span class="text">联系电话:</span>
          <span class="content-left">{{merchantData.sasPhone}}</span>
        </div>
        <div class="orderno-date clearfix">
          <span class="text">联系地址:</span>
          <span class="content-left">{{merchantData.sasAddrCode}}{{merchantData.sasAddrDetail}}</span>
        </div>
      </div>
      <div class="goods-list boxshadow">
        <div class="goods-item">
          <!-- //退款详情-对应的订单详情页面坑定是一个商品x -->
          <img class="goods-img fl" v-if='initData.orderDetail&&initData.orderDetail.length&&initData.orderDetail[0].mdseDetail&&initData.orderDetail[0].mdseDetail.linkImg' :src="initData.orderDetail[0].mdseDetail.linkImg" alt="">
          <div class="goods-info">
            <div class="info-box">
              <div class="goods-title two-line">
                {{initData.orderInfo}}
              </div>
              <div class="spec-ul">
                <span v-for='(specStr,specIndex) in initData.specArr' :key='specIndex' class="spec-li">{{specStr}}</span>
              </div>
            </div>
            <div class="goods-price clearfix">
              <div class="price fl">
                <span class="unit">￥</span>
                <span class="num">{{initData.price}}</span>
              </div>
              <div class="buy-num fr">
                <span class="x">x</span>{{initData.amount}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="order-detail-info bg-w m-b-10 boxshadow">
        <div class="orderno-date clearfix">
          <span class="text">退款金额:</span>
          <span class="content-right red">￥{{pageData.refundSum}}</span>
        </div>
        <div class="orderno-date clearfix">
          <span class="text">退款原因:</span>
          <span class="content-right">{{pageData.reason}}</span>
        </div>
      </div>
  </div>
</template>

<script>
// Use Vuex

export default {
  components: {

  },
  data() {
    return {
      stateName: "",
      merchantData: {}, //店铺信息
      initData: {}, //订单详情
      pageData: {}, //退款详情
      pageList: [
        {
          linkMobileImg:
            "https://statics.lotsmall.cn/image/20180918/201809181413513a3m80.jpg",
          orderInfo: "zzz",
          price: "111",
          amount: "111"
        }
      ],
      refundState: ["等待审核", "审核成功", "审核驳回", "等待供应商审核"]
    };
  },
  computed: {},
  created() {
      document.title="退款详情"
    // console.log(this.$route.query.orderInfoId);
    //退款详情
    this.getAxios(this.api.member.order.refundDetail, {
      orderCode: this.$route.query.orderno
    }).then(res => {
      this.pageData = res.data;
    });
    //订单详情
    this.getAxios(this.api.member.order.detail, {
      wayType: 1,
      orderInfoId: this.$route.query.orderInfoId
    }).then(res => {
      //商品
      this.stateName = this.refundState[res.data.orderDetail[0].refundAudit];
      res.data.specArr = this.formatterSpec(res.data.specParam);
      //获取联系人地址
      this.getAxios(this.api.main.merchant.getMerchantInfo, {
        wayType: 1
      }).then(res => {
        this.merchantData = res.data;
      });

      this.initData = res.data;
    });
  },
  methods: {
    goUrl(path) {
      this.$router.push("/goodsSend?" + path);
    },
    formatterSpec(str) {
      //格式化sku
      //{"重量":"500g"},{"多少抽":"100抽"},{"颜色":"纯白"}
      var arr = [];
      str.split(",").forEach((item, index) => {
        arr.push(JSON.parse(item)[Object.keys(JSON.parse(item))[0]]);
      });
      return arr;
    }
  }
};
</script>

<style lang="scss">
.back-detail-warp {
  .m-t-10 {
    margin-top: 10px;
  }
  .goods-list {
    background: #fff;
    margin: 10px 0;
    .goods-item {
      height: 120px;
      padding-left: 14.5px;
      padding-right: 20px;
      .goods-img {
        padding-top: 20px;
        width: 80px;
        height: 80px;
      }
      .goods-info {
        padding-top: 20px;
        margin-left: 92px;

        .info-box {
          height: 57px;
          .goods-title {
            // height: 34px;
            font-size: 14px;
            color: #413838;
            font-family: PingFangSC-Medium, sans-serif;
          }
          .spec-ul {
            line-height: 16px;
            .spec-li {
              margin-right: 11px;
              font-size: 11px;
              color: #989898;
              font-family: PingFangSC-Medium, sans-serif;
            }
          }
        }
        .goods-price {
          // display: flex;
          // justify-content: space-between;
          .price {
            color: #fc4150;
            font-size: 18px;
            font-family: PingFangSC-Semibold, sans-serif;
            .unit {
              font-size: 12px;
            }
            .num {
              margin-left: 3px;
            }
          }
          .buy-num {
            color: #999999;
            font-size: 15px;
            font-family: PingFangSC-Medium, sans-serif;
            align-items: flex-end;
            .x {
              font-size: 12px;
              margin-right: 6px;
            }
          }
        }
      }
    }
  }
  .order-detail-info {
    padding: 10px 15px;
    background-color: #fff;
    .btn-warper {
      margin-top: 15px;
      .sent-btn {
        background: #f05b47;
        text-align: center;
        height: 44px;
        line-height: 44px;
        font-size: 16px;
        color: #ffffff;
        font-family: PingFangSC-Medium, sans-serif;
        border-radius: 2px;
      }
    }
    .orderno-date {
      font-size: 14px;
      color: #413838;
      font-family: PingFangSC-Medium, sans-serif;
      margin-bottom: 10px;
      .text {
        float: left;
      }
      .content-left {
        float: left;
        margin-left: 5px;
      }
      .content-right {
        float: right;
      }
      .red {
        color: #fc4150;
      }
      .copy-btn {
        float: right;
        padding: 0 5px;
        border: 1px solid #999999;
        border-radius: 2px;
      }
      .text.bottom {
        font-size: 12px;
        color: #413838;
      }
    }
    .orderno-date.m-b {
      margin-bottom: 5px;
    }
    .orderno-date:last-child {
      margin-bottom: 0;
    }
    .name {
      padding-top: 3px;
      padding-bottom: 12px;
      color: #413838;
      font-size: 16px;
      font-family: PingFangSC-Semibold, sans-serif;
      font-weight: 600;
    }
  }
  .play-time {
    background: #fff;
    padding: 0 15px;
    height: 53px;
    font-size: 14px;
    font-family: PingFangSC-Medium, sans-serif;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      color: #413838;
    }
    .text {
      color: #999999;
    }
  }
  .list-item {
    .head-item {
      padding: 10px 15px;
      .head {
        font-size: 14px;
        color: #413838;
        font-family: PingFangSC-Medium, sans-serif;
      }
      .price-num {
        margin-top: 8px;
        font-size: 12px;
        font-family: PingFangSC-Medium, sans-serif;
        color: #413838;
        .price {
          .unit {
            font-size: 12px;
            margin-right: 3px;
          }
          .price-num {
            font-size: 16px;
          }
        }
        .num {
          font-size: 16px;
          color: #999;
          .x {
            font-size: 12px;
            margin-right: 4px;
          }
        }
      }
    }
  }
  .info-item {
    padding: 20px 15px;
    margin-bottom: 10px;
    background: #fff;
    .real-user-item {
      margin-bottom: 5px;
    }
    .real-user-item:last-child {
      margin-bottom: 0;
    }
    .user-info {
      .select-checkbox {
        transform: scale(0.7);
        float: left;
      }
      .user-list {
        margin-left: 35px;
      }
    }
    .item {
      font-size: 14px;
      color: #413838;
      font-family: PingFangSC-Medium, sans-serif;
      margin-top: 8px;
      .left-title {
        width: 78px;
      }
      .right-content {
        .text {
          margin-right: 5px;
        }
        .face-img {
          // height: 50px;
          width: 44px;
        }
      }
      .face-content {
        display: flex;
        align-items: center;
        height: 50px;
      }
    }
    .item:first-child {
      margin-top: 0;
    }
    .user-sort-name {
      color: #999;
    }
    .face-item {
      height: 50px;
      line-height: 50px;
    }
    .check-info {
      display: flex;
      justify-content: space-around;
      background: #fff;
      .info {
        font-size: 14px;
        color: #413838;
        width: 50%;
        font-family: PingFangSC-Medium, sans-serif;
        text-align: center;
        .check-state {
        }
        .num {
          margin-left: 5px;
        }
      }
    }
  }
  .hotel-time {
    background: #fff;
    padding: 10px 15px;
    .time-info {
      height: 30px;
      font-size: 14px;
      font-family: PingFangSC-Medium, sans-serif;
      color: #413838;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title {
      }
      .time {
      }
    }
  }
}
</style>
