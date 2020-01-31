<template>
  <div class="template1-warpper">
    <img
      class="top-img"
      v-if="pageData.mainPageFix&&pageData.mainPageFix.length"
      :src="pageData.mainPageFix[0].picAddr"
      @click="goLink(pageData.mainPageFix[0])"
      alt
    >
    <swiper
      v-if="pageData.mainPageTop&&pageData.mainPageTop.length"
      dots-position="center"
      :auto="true"
      height="4.84rem"
      dots-class="bottom-dots"
    >
      <swiper-item
        class="swiper-demo-img"
        v-for="(item, index) in pageData.mainPageTop"
        :key="index"
        
      >
        <img style="width:100%;height:100%" @click="goLink(item)" :src="item.picAddr">
      </swiper-item>
    </swiper>
    <div class="nav-warpper">
      <div class="warpper-top">
        <div @click="navGoUrl('ticket')" class="warpper-top-left" :style="{'background-image':'url(' + require('../../../assets/images/menu1.png') + ')'}">
          <img class="nav-warpper-img" src="../../../assets/images/ticket.png" alt>
          <div class="en-title">SCENIC TICKET</div>
          <span class="zh-title">门 票 预 订</span>
        </div>
        <div class="warpper-top-right">
          <div  @click="navGoUrl('hotel')" class="warpper-top-right-top" :style="{'background-image':'url(' + require('../../../assets/images/menu3.png') + ')'}">
            <div class="nav-detail-box">
              <img class="nav-warpper-img" src="../../../assets/images/hotel.png" alt>
              <div class="en-title">Hotel</div>
              <span class="zh-title">酒店预订</span>
            </div>
          </div>
          <div  @click="navGoUrl('shop')" class="warpper-top-right-bottom" :style="{'background-image':'url(' + require('../../../assets/images/menu4.png') + ')'}">
            <div class="nav-detail-box">
              <img class="nav-warpper-img" src="../../../assets/images/goods.png" alt>
              <div class="en-title">STRATEGY</div>
              <span class="zh-title">特色商品</span>
            </div>
          </div>
        </div>
      </div>
      <div  @click="navGoUrl('strategy')" class="warpper-bottom" :style="{'background-image':'url(' + require('../../../assets/images/menu2.png') + ')'}">
        <div class="nav-detail-box">
          <img class="nav-warpper-img" src="../../../assets/images/tour.png" alt>
          <div class="en-title">STRATEGY</div>
          <span class="zh-title">游玩攻略</span>
        </div>
      </div>
    </div>
    <div class="line"></div>
    <!-- 精品推荐 -->
    <div class="product">
      <div class="product-header">
        <img src="../../../assets/images/jp.png" alt>
        <div>RECOMMENDED</div>
      </div>
      <div class="product-fine">
        <div v-for="(item,index) in productData.fine" :key="index" class="product-fine-item" @click="goUrl(item)">
          <img class="product-fine-img" :src="item.linkMobileImg" alt>
          <div
            class="product-fine-title"
          >{{(item.nickName||item.name)?(item.nickName||item.name):''}}</div>
          <div class="product-fine-price">
            <span>{{(item.priceShow||item.priceShow==0)?('￥'+item.priceShow):''}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="line"></div>
    <!-- 热销推荐 -->
    <div class="product">
      <div class="product-header">
        <img src="../../../assets/images/rx.png" alt>
        <div>HOT PRODUCTS</div>
      </div>
      <div class="product-hot">
        <div v-for="(item,index) in productData.sellWell" :key="index" @click="goUrl(item)" class="product-hot-item">
          <img class="product-hot-img" :src="item.linkMobileImg" alt>
          <div class="product-hot-detail">
            <div class="product-hot-name">
              <div class="product-hot-title">
               
                <template v-if="item.businessType=='room'">【{{item.parkNickName}}】{{item.nickName}}</template>
                <template v-else>{{item.nickName?item.nickName:item.parkNickName}}</template>
                
              </div>
              <div class="product-hot-subtitle">{{item.subtitle}}</div>
            </div>
            <div class="product-hot-price">
             <span class="price">{{(item.priceShow||item.priceShow==0)?('￥'+item.priceShow):''}}</span>
              <span class="sell">已售:{{item.virtualSale?item.virtualSale:(item.sellNum?item.sellNum:0)}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <page-footer :pageData='footerArr'></page-footer>
  </div>
</template>
<script>
import { Swiper, SwiperItem } from "vux";
import pageFooter from "./footer.vue"
export default {
  components: {
    Swiper,
    SwiperItem,
    pageFooter
  },
  props: {
    pageData: {
      type: Object,
      default: {}
    },
    productData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      //  backgroundImage: 'url(' + require('../../../assets/images/menu1.png') + ')',
      footerArr:{
        backgroundColor:'#fff',
        fontColor:'#303043',
        list:[
          {
            icon:'icon-shouye11',
            title:'首页',
            linkType:'home'
          },
           {
            icon:'icon-nav-orders',
            title:'订单',
            linkType:'order'
          },
           {
            icon:'icon-nav-my',
            title:'个人中心',
            linkType:'member'
          }
        ]
      }
    };
  },
  methods:{
    goLink(item){
      if(item.picLink){
        window.location.href=item.picLink
      }
    },
    navGoUrl(linkType){
      this.$emit('goUrl',linkType)
    }
  }
};
</script>
<style lang="scss">
.template1-warpper {
  background: #f6f9fe;
  padding-bottom: 50px;
  .product {
    padding: 0 1.6%;
    width: 100%;
    box-sizing: border-box;
    .product-header {
      text-align: center;
      img {
        width: 75px;
        height: 20px;
      }
      div {
        margin-top: 6px;
        font-size: 10px;
        color: #65574b;
      }
    }

    .product-hot {
      padding: 0 1.6%;
      width: 100%;
      box-sizing: border-box;
      .product-hot-item {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 2px solid #e8e8e8;
        .product-hot-img {
          width: 102px;
          height: 82px;
        }
        .product-hot-detail {
          flex: 1;
          margin-left: 10px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          .product-hot-name {
            font-size: 14px;
            .product-hot-title {
              color: #65574b;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .product-hot-subtitle {
              display: block;
              color: #666;
              margin-top: 3px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
          .product-hot-price {
            display: flex;
            justify-content: space-between;
            .price {
              color: #e50d0d;
              font-size: 14px;
            }
            .sell {
              font-size: 12px;
              color: #808080;
            }
          }
        }
      }
    }
    .product-fine {
      margin-top: 14px;
      display: flex;
      .product-fine-item {
        flex: 1;
        box-sizing: content-box;
        padding: 0 3px;
        text-align: center;
        font-size: 14px;
        .product-fine-img {
          width: 100%;
          height: 110px;
        }
        .product-fine-title {
          margin-top: 10px;
          color: #65574b;

          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
          word-wrap: break-word;
          word-break: break-all;
        }
        .product-fine-price {
          color: #e50d0d;
          margin: 5px 0;
        }
      }
    }
  }

  .top-img {
    display: inline-block;
    width: 100%;
    height: 65px;
  }
  .line {
    margin: 0 1.6%;
    height: 30px;
    background: url("../../../assets/images/xian.png") repeat-x center center;
  }
  .nav-warpper {
    margin-top: 6px;
    padding: 0 1.6%;
    width: 100%;
    box-sizing: border-box;
    .en-title {
      font-size: 10px;
      margin-top: 6px;
    }
    .zh-title {
      font-size: 14px;
      margin-top: 2px;
    }
    .nav-detail-box {
      width: 48%;
      height: 100%;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .nav-warpper-img {
      margin: 0 auto;
    }
    .warpper-top {
      display: flex;
      justify-content: space-between;

      .warpper-top-left {
        width: 49.2%;
        // background: url("../../../assets/images/menu1.png");
        background-size: cover;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .nav-warpper-img {
          width: 38px;
          height: 22px;
          margin: 0 auto;
        }
        color: #864d03;
      }
      .warpper-top-right {
        width: 49.2%;
        .warpper-top-right-top {
          height: 84px;
          // background: url("../../../assets/images/menu3.png");
          background-size: cover;
          .nav-warpper-img {
            width: 28px;
            height: 24px;
            margin: 0 auto;
          }

          color: #1f47a7;
        }
        .warpper-top-right-bottom {
          height: 84px;
          margin-top: 6px;
          // background: url("../../../assets/images/menu4.png");
          background-size: cover;
          .nav-warpper-img {
            width: 35px;
            height: 21px;
          }
          color: #ac2413;
        }
      }
    }
    .warpper-bottom {
      margin-top: 6px;
      // background: url("../../../assets/images/menu2.png");
      background-size: cover;
      height: 84px;
      .nav-warpper-img {
        width: 25px;
        height: 25px;
      }
      color: #0f730f;
      .nav-detail-box {
        width: 48%;
      }
    }
  }
  .bottom-dots {
    a {
      .vux-icon-dot {
        width: 8px !important;
        height: 8px !important;
        border: 4px;
        background: rgba(0, 0, 0, 0.4) !important;
      }
      .vux-icon-dot.active {
        border-radius: 6px;
        width: 16px !important;
        background: #fff !important;
      }
    }
  }
}
</style>
