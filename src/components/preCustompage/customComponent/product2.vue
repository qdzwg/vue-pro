<template>
  <div class="product2-warpper">
    <div class="product-header">
      <i class="line"></i>
      <span class="title">{{pageData.title}}</span>
    </div>
    <swiper dots-position="right" height="5.44rem" :auto="true" dots-class="bottom-dots">
      <swiper-item class="swiper-demo-img" v-for="(item, index) in productList" :key="index">
        <div class="show-price">
          ￥
          <span
            class="num"
            v-if="item.businessType=='repast'"
          >{{(item.priceShow||item.priceShow==0)?item.priceShow:''}}</span>
          <span class="num" v-else>{{item.parkPriceShow?item.parkPriceShow:''}}</span>
          起
        </div>
        <img @click="goUrl(item)" style="width:100%" class="product-img" :src="item.linkMobileImg">
        <div class="product-detail">
          <div class="dis-flex">
            <span class="product-name">{{item.name}}</span>
          </div>
          <div class="dis-flex">
            <span class="product-subtitle">{{item.subtitle}}</span>
          </div>
        </div>
      </swiper-item>
    </swiper>
  </div>
</template>
<script>
import { Swiper, SwiperItem } from "vux";
export default {
  components: {
    Swiper,
    SwiperItem
  },
  props: {
    pageData: {
      type: Object,
      default: {}
    }
  },
  created() {
    var arr = this.pageData.list.map(item => item.productId);
    this.getAxios("/merchant/api/merchantInfo/listMerchantProduct", {
      id: arr.join(",")
    }).then(res => {
      this.productList = res.data && res.data.length ? res.data : [];
    });
  },
  data() {
    return {
      productList:[]
    };
  }
};
</script>
<style lang="scss">
.product2-warpper {
  background: #ffffff;
  .product-header {
    margin-left: 15px;
    display: flex;
    height: 38px;
    align-items: center;
    .line {
      width: 4px;
      height: 16px;
      background: #3f98f6;
      margin-right: 7px;
    }
    .title {
      font-size: 16px;
      color: #333;
    }
  }
  .show-price {
    position: absolute;
    left: 18px;
    bottom: 75px;
    color: #fff;
    font-weight: 600;
    height: 23px;
    line-height: 23px;
    background: #ff5400;
    padding: 0 14px;
    border-radius: 3px;
  }
  .product-img {
    height: 146px;
  }
  .product-detail {
    padding: 8px 18px;
    padding-bottom: 13px;
    .dis-flex {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      .product-subtitle {
        font-size: 12px;
        color: #999;
      }
      .seller-num {
        font-size: 12px;
        color: #999;
      }
      .product-name {
        color: #333333;
        font-size: 12px;
      }
      .price {
        color: #ff5400;
        .unit {
          font-size: 10px;
        }
        .num {
          font-size: 18px;
        }
        .text {
          font-size: 14px;
          color: #999999;
        }
      }
    }
  }

  .bottom-dots {
    // padding: 10px;
    bottom: 70px !important;
    a {
      .vux-icon-dot {
        width: 7px !important;
        height: 7px !important;
        border: 3.5px;
        background: #fff !important;
      }
      .vux-icon-dot.active {
        background: #3f98f6 !important;
      }
    }
  }
}
</style>


