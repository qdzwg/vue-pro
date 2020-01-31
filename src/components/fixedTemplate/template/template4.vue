<template>
  <div class="template4-warpper">
    <img
      class="top-img"
      v-if="pageData.mainPageFix&&pageData.mainPageFix.length"
      :src="pageData.mainPageFix[0].picAddr"
      @click="goLink(pageData.mainPageFix[0])"
      alt
    >
    <div class="banner-swiper">
      <swiper
        v-if="pageData.mainPageTop&&pageData.mainPageTop.length"
        dots-position="right"
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
    </div>
    <div class="product-list-warpper">
      <div class="warpper-top">
        <div class="warpper-header">
          <div class="warpper-title">
            <span class="warpper-title-left">景区</span>
            <span class="warpper-title-right">门票</span>
          </div>
          <div @click="goList" class="more">
            查看更多
            <i class="xx-icon icon-iconfont-jiantou"></i>
          </div>
        </div>
        <div class="warpper-text">小编为您整理的品质线路</div>
      </div>
      <div class="product-list-content">
        <div v-for="(item,index) in productData.sellWell" :key="index" @click="goUrl(item)" class="product-list-item">
          <img class="product-list-img" :src="item.linkMobileImg" alt>
          <div class="product-list-detail">
            <div class="product-list-name">
              <div class="product-list-title">{{item.nickName?item.nickName:item.name}}</div>
              <div class="product-list-subtitle">{{item.subtitle?item.subtitle:""}}</div>
            </div>
            <div class="product-list-price">
              <div class="sell">
                <span
                  class="num"
                >{{item.virtualSale?item.virtualSale:(item.sellNum?item.sellNum:0)}}</span>
                <span>人已购买</span>
              </div>
              <div class="price">
                <span class="unit">￥</span>
                <span>{{item.priceShow}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <page-footer :pageData='footerArr'></page-footer>
  </div>
</template>
<script>
import { Tab, TabItem, Swiper, SwiperItem } from "vux";
import pageFooter from "./footer.vue"
// import productGroup from "@/components/preCustompage/customComponent/productGroup";
export default {
  components: {
    Tab,
    TabItem,
    Swiper,
    SwiperItem,
    pageFooter
    // productGroup
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
  computed: {
    productListData() {
      if (
        this.productData &&
        this.productData.sellWell &&
        this.productData.sellWell.length
      ) {
        let arr = [
          {
            groupName: "景区门票",
            data: []
          },
          {
            groupName: "酒店住宿",
            data: []
          },
          {
            groupName: "特色商品",
            data: []
          }
        ];
        this.productData.sellWell.forEach((item, index) => {
          if (item.businessType == "ticket") {
            //门票
            arr[0].data.push(item);
          } else if (item.businessType == "room") {
            //酒店
            arr[1].data.push(item);
          } else if (item.businessType == "mdse") {
            //商品
            arr[2].data.push(item);
          }
        });
        console.log(arr);
        return arr;
      } else {
        return [];
      }
    }
  },
  data() {
    return {
      footerArr:{
        backgroundColor:'#FFF',
        fontColor:'#999',
        list:[
          {
            icon:'icon-shouye11',
            title:'首页',
            linkType:'home'
          },
           {
            icon:'icon-nav-orders',
            title:'我的订单',
            linkType:'order'
          },
           {
            icon:'icon-nav-my',
            title:'会员中心',
            linkType:'member'
          }
        ]
      },
      tabindex: 0
    };
  },
   methods:{
    goLink(item){
      if(item.picLink){
        window.location.href=item.picLink
      }
    },
    goList(){
      window.location.href=(process.env.NODE_ENV === 'production'?'https://wap.lotsmall.cn/':'http://testwap.lotsmall.cn/') + 'list/ticket?m_id=' + localStorage.getItem('xjsc_vue_2018_12_19_mid')
    }
  }
};
</script>
<style lang="scss">
.template4-warpper {
  padding-bottom: 50px;
  background: #ffffff;
  .product-list-warpper {
    .warpper-top {
      margin: 0 7px;
      padding: 12px 0;
      .warpper-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .warpper-title {
          font-weight: 500;
          font-size: 16px;
          margin-bottom: 6px;
          .warpper-title-left {
            color: #f90;
          }
          .warpper-title-right {
            color: #333;
          }
        }
        .more {
          color: #999;
          font-size: 14px;
          .xx-icon {
            font-size: 12px;
          }
        }
      }
      .warpper-text {
        font-size: 12px;
        color: #999;
      }
    }

    .product-list-content {
      .product-list-item {
        border-bottom: 1px solid #eee;
        padding: 11px;
        display: flex;
        .product-list-img {
          width: 122px;
          height: 90px;
        }
        .product-list-detail {
          margin-left: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          .product-list-name {
            .product-list-title {
              color: #333;
              font-size: 16px;
              margin-bottom: 2px;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }
            .product-list-subtitle {
              color: #999;
              font-size: 10px;
              line-height: 16px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
            }
          }
          .product-list-price {
            display: flex;
            justify-content: space-between;
            padding-bottom: 2px;
            align-items: flex-end;
            .sell {
              font-size: 10px;
              color: #999;
              .num {
                color: #f90;
              }
            }
            .price {
              color: #f90;
              font-size: 18px;
              .unit {
                font-size: 10px;
              }
            }
          }
        }
      }
    }
  }
  .top-img {
    display: inline-block;
    width: 100%;
    height: 65px;
  }

  .bottom-dots {
    bottom: 12px !important;
    a {
      .vux-icon-dot {
        width: 5px !important;
        height: 5px !important;
        border: 2.5px;
        background: transparent !important;
        border: 1px solid #fff;
      }
      .vux-icon-dot.active {
        background: #fff !important;
      }
    }
  }
}
</style>
