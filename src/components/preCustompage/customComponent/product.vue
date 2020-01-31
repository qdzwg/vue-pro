<template>
  <div class="product-warpper">
    <div class="product-header">
      <i class="line"></i>
      <span class="title">{{pageData.title}}</span>
      <i class="line"></i>
    </div>
    <swiper dots-position="right" height="5.7rem" :auto='true' dots-class="bottom-dots">
      <swiper-item class="swiper-demo-img" v-for="(item, index) in productList" :key="index">
        <div class="product-class" v-if="item.businessType">{{item.businessType|getBusinessType}}</div>
        <img @click="goUrl(item)" style="width:100%" class="product-img" :src="item.linkMobileImg">
        <div class="product-detail">
          <div class="dis-flex">
            <span class="product-name">{{item.name}}</span>
            <div class="price">
              <span class="unit">￥</span>
              <span
                class="num"
                v-if="item.businessType=='repast'"
              >{{(item.priceShow||item.priceShow==0)?item.priceShow:''}}</span>
              <span class="num" v-else>{{item.parkPriceShow?item.parkPriceShow:''}}</span>
              <span class="text">/人</span>
            </div>
          </div>
          <div class="dis-flex">
            <span class="product-subtitle">{{item.subtitle}}</span>
            <span class="seller-num" v-if="item.sellNum">已售{{item.sellNum}}份</span>
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
  created(){
    var arr = this.pageData.list.map(item=>item.productId)
    this.getAxios('/merchant/api/merchantInfo/listMerchantProduct',{
      id:arr.join(',')
    }).then(res=>{
      this.productList = res.data&&res.data.length?res.data:[]
    })
  },
  data() {
    return {
      productList:[]
    };
  }
};
</script>
<style lang="scss">
.product-warpper {
  width: 95%;
  padding: 0 2.5%;
  background: #ffffff;
  .product-header {
    text-align: center;
    height: 42px;
    line-height: 42px;
    display: flex;
    justify-content: center;
    align-items: center;
    .line {
      width: 45px;
      height: 2px;
      background-color: #90c656;
      display: inline-block;
      vertical-align: middle;
    }
    .title {
      color: #000;
      font-weight: 600;
      font-size: 16px;
      padding: 0 6px;
    }
  }
  .product-class {
    position: absolute;
    left: 12px;
    top: 12px;
    color: #ffffff;
    border: 1px solid #ffffff;
    border-radius: 10px;
    background: #90c656;
    height: 20px;
    line-height: 21px;
    padding: 0 10px;
  }
  .product-img {
    height: 146px;
  }
  .product-detail {
    padding: 8px;
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
        font-size: 11px;
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
        background: #a5a5a5 !important;
      }
      .vux-icon-dot.active {
        background: #90c656 !important;
      }
    }
  }
}
</style>


