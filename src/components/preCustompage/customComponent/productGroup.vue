<template>
  <div class="product-group-warpper">
    <tab :line-width="2" active-color="#3f98f6" v-model="tabindex">
      <tab-item class="vux-center" v-for="(item, index) in pageData" :key="index">
        <span class="product-group-name">{{item.groupName}}</span>
      </tab-item>
    </tab>
    <template v-for="(item, index) in productList">
      <div class="product-group-content" :key="index" v-if="tabindex==index">
        <div class="tab-swiper vux-center swiper-content">
          <div v-for="(it,i) in item.data" :key="i" class="product-group-item" @click="goUrl(it)">
            <img class="product-group-img" :src="it.linkMobileImg" alt>
            <div class="product-group-title">{{it.parkNickName?it.parkNickName:it.name}}</div>
            <div class="price-info">
              <div class="price">
                <span class="unit">￥</span>
                <span
                  class="num"
                  v-if="it.businessType=='repast'"
                >{{(it.priceShow||it.priceShow==0)?it.priceShow:''}}</span>
                <span class="num" v-else>{{it.parkPriceShow?it.parkPriceShow:''}}</span>
              </div>
              <span v-if="it.sellNum&&it.sellNum!=0" class="seller-num">
                <template>{{it.sellNum}}人购买</template>
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import { Tab, TabItem, Swiper, SwiperItem } from "vux";
export default {
  props: {
    pageData: {
      type: Array,
      default: []
    }
  },
  components: {
    Tab,
    TabItem,
    Swiper,
    SwiperItem
  },
  created() {
    let arr1 = [];
    this.pageData.forEach(item => {
      let arr = item.data.map(it => it.productId);
      arr1.push(arr.join(","));
    });
    let apiArr = arr1.map(item => {
      if (item) {
        return this.getAxios("/merchant/api/merchantInfo/listMerchantProduct", {
          id: item
        });
      } else {
        return new Promise((resolve, reject) => {
          resolve({ data: [] });
        });
      }
    });
    Promise.all(apiArr).then(res => {
      this.productList = res
    });
  },
  data() {
    return {
      productList:[],
      height: "350px",
      demo2: 0,
      tabindex: 0
    };
  },
  methods: {
    getHeight(height) {}
  }
};
</script>
<style lang="scss" scoped>
.product-group-warpper {
  background: #ffffff;
  .product-group-name {
    color: #000;
    font-size: 16px;
  }
  .product-group-content {
    width: 95% !important;
    padding: 12px 2.5%;
  }
  .product-group-item {
    // text-align: center;
    display: inline-block;
    width: 45%;
    padding: 0 2.5%;
    .product-group-img {
      display: inline-block;
      width: 100%;
      height: 100px;
    }
    .product-group-title {
      padding: 6px 0;
      height: 28px;
      line-height: 1.2;
      color: #000;
      font-size: 14px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .price-info {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      height: 26px;
      .price {
        color: #ff6600;
        .unit {
          font-size: 10px;
        }
        .num {
          font-size: 16px;
        }
      }
      .seller-num {
        color: #999999;
        font-size: 10px;
      }
    }
  }
}
</style>


