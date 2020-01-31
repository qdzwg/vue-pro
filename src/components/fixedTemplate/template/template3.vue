<template>
  <div class="template3-warpper">
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
          <img @click="goLink(item)" style="width:100%;height:100%" :src="item.picAddr">
        </swiper-item>
      </swiper>
    </div>

    <div class="search-box">
      <div class="search">
        <input  @keyup.enter="goOperation" class="search-input"  v-model="seachName" placeholder="请输入您要搜索的产品" type="text">
        <button  @click="goOperation" class="search-btn">
          <i class="xx-icon icon-ico-search search-icon"></i>
        </button>
      </div>
    </div>
    <div class="nav-warpper">
      <div class="nav-warpper-top dis-flex">
        <div @click="navGoUrl('ticket')" class="nav-warpper-top-left nva-wapper-item">
          <img class="nav-wapper-img" src="../../../assets/images/icon_ticket_03.jpg" alt>
          <div>
            <div class="nav-title">景区门票</div>
            <div class="nav-intro">海量门票 折扣不停</div>
          </div>
        </div>
        <div @click="navGoUrl('hotel')" class="nav-warpper-top-right nva-wapper-item">
          <img class="nav-wapper-img" src="../../../assets/images/icon_hotel_03.jpg" alt>
          <div>
            <div class="nav-title">酒店</div>
            <div class="nav-intro">特色客栈</div>
          </div>
        </div>
      </div>
      <div class="nav-warpper-bottom dis-flex">
        <div @click="navGoUrl('shop')" class="nav-warpper-bottom-left nva-wapper-item">
          <img class="nav-wapper-img" src="../../../assets/images/icon_news_03.jpg" alt>
          <div>
            <div class="nav-title">特色商品</div>
            <div class="nav-intro">最新特产 一手掌握</div>
          </div>
        </div>
        <div @click="navGoUrl('strategy')" class="nav-warpper-bottom-right nva-wapper-item">
          <img class="nav-wapper-img" src="../../../assets/images/icon_gl_03.jpg" alt>
          <div>
            <div class="nav-title">游玩攻略</div>
            <div class="nav-intro">快捷方便</div>
          </div>
        </div>
      </div>
    </div>

    <div class="i-line"></div>

    <div class="product-warpper">
      <div class="product-header">
        <i class="line"></i>
        <span class="title">精品推荐</span>
        <i class="line"></i>
      </div>
      <swiper dots-position="right" height="5.7rem" dots-class="bottom-dots">
        <swiper-item class="swiper-demo-img" v-for="(item, index) in productData.fine" :key="index">
          <a @click="goUrl(item)">
            <div
              class="product-class"
              v-if="item.businessType"
            >{{item.businessType|getBusinessType}}</div>
            <img style="width:100%" class="product-img" :src="item.linkMobileImg">
            <div class="product-detail">
              <div class="dis-flex">
                <span class="product-name">{{item.nickName?item.nickName:item.name}}</span>
                <div class="price">
                  <span class="unit">￥</span>
                  <span class="num">{{item.priceShow}}</span>
                  <span class="text">/人</span>
                </div>
              </div>
              <div class="dis-flex">
                <span class="product-subtitle">{{item.subtitle}}</span>
                <span
                  class="seller-num"
                >已售{{item.virtualSale?item.virtualSale:(item.sellNum?item.sellNum:0)}}份</span>
              </div>
            </div>
          </a>
        </swiper-item>
      </swiper>
    </div>

    <div class="i-line"></div>

    <div class="product-group-warpper">
      <tab :line-width="3" active-color="#95bc56" custom-bar-width="1.8rem" v-model="tabindex">
        <tab-item class="vux-center" v-for="(item, index) in productListData" :key="index">
          <span class="product-group-name">{{item.groupName}}</span>
        </tab-item>
      </tab>
      <template v-for="(item, index) in productListData">
        <div class="product-group-content" :key="index" v-if="tabindex==index">
          <div class="tab-swiper vux-center swiper-content">
            <div v-for="(it,i) in item.data" :key="i" @click="goUrl(it)" class="product-group-item">
              <img class="product-group-img" :src="it.linkMobileImg" alt>
              <div class="product-group-title">{{it.nickName?it.nickName:item.name}}</div>
              <div class="price-info">
                <div class="price">
                  <span class="unit">￥</span>
                  <span
                    class="num"
                    v-if="it.businessType=='ticket'"
                  >{{it.priceShow?it.priceShow:''}}</span>
                  <span class="num" v-if="it.businessType=='room'">{{it.priceShow?it.priceShow:''}}</span>
                  <span class="num" v-if="it.businessType=='mdse'">{{it.priceShow?it.priceShow:''}}</span>
                  <span class="num" v-if="it.businessType!='mdse'" style="color:#999"></span>
                </div>
                <span v-if="(it.sellNum&&it.sellNum!=0)||it.virtualSale" class="seller-num">
                  <template>{{it.virtualSale?it.virtualSale:it.sellNum}}人购买</template>
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <page-footer :pageData="footerArr"></page-footer>
  </div>
</template>
<script>
import { linkBaseUrl } from "../../../../config/index"
import { Tab, TabItem, Swiper, SwiperItem } from "vux";
import pageFooter from "./footer.vue";
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
  methods: {
    goOperation() {
      window.location.href =
        linkBaseUrl +
        "/csearch?modelName=" +
        this.seachName +
        "&m_id=" +
        this.$route.query.m_id;
    },
    goLink(item) {
      if (item.picLink) {
        window.location.href = item.picLink;
      }
    },
    navGoUrl(linkType) {
      this.$emit("goUrl", linkType);
    }
  },
  data() {
    return {
      seachName:'',
      footerArr: {
        backgroundColor: "#82ba47",
        fontColor: "#fff",
        list: [
          {
            icon: "icon-shouye11",
            title: "首页",
            linkType:'home'
          },
          {
            icon: "icon-nav-orders",
            title: "我的订单",
            linkType:'order'
          },
          {
            icon: "icon-nav-my",
            title: "会员中心",
            linkType:'member'
          }
        ]
      },
      tabindex: 0
    };
  }
};
</script>
<style lang="scss">
.template3-warpper {
  padding-bottom: 50px;
  background: #eee;
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
        width: 42px;
        height: 2px;
        background-color: #90c656;
        display: inline-block;
        vertical-align: middle;
      }
      .title {
        color: #000;
        font-size: 15px;
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
          width: 7px !important;
          background: #90c656 !important;
        }
      }
    }
  }
  .i-line {
    height: 8px;
    width: 100%;
    background: #eeeeee;
    border-top: 1px solid #e3e3e3;
    border-bottom: 1px solid #e3e3e3;
  }
  .nav-warpper {
    width: 95%;
    margin: 0 auto;
    padding-bottom: 10px;
    .dis-flex {
      display: flex;
      justify-content: space-between;
    }
    .nva-wapper-item {
      height: 82px;
      display: flex;
      align-items: center;
      border-radius: 3px;
      .nav-title {
        color: #fff;
        font-size: 16px;
      }
      .nav-intro {
        color: #fff;
        font-size: 11px;
        margin-top: 2px;
      }
    }
    .nav-warpper-top {
      margin-bottom: 8px;
      .nav-warpper-top-left {
        width: 62.5%;
        background: #27ae60;
        .nav-wapper-img {
          width: 34px;
          height: 35px;
          margin-left: 35px;
          margin-right: 12px;
        }
      }
      .nav-warpper-top-right {
        width: 35%;
        background: #0099ff;
        .nav-wapper-img {
          width: 36px;
          height: 35px;
          margin-left: 19px;
          margin-right: 6px;
        }
      }
    }
    .nav-warpper-bottom {
      .nav-warpper-bottom-left {
        width: 48.75%;
        background: #3498db;
        .nav-wapper-img {
          width: 36px;
          height: 28px;
          margin-left: 10px;
          margin-right: 5px;
        }
      }
      .nav-warpper-bottom-right {
        width: 48.75%;
        background: #782899;
        .nav-wapper-img {
          width: 28px;
          height: 28px;
          margin-left: 14px;
          margin-right: 18px;
        }
      }
    }
  }
  .product-group-warpper {
    background: #ffffff;
    .vux-tab-item.vux-tab-selected {
      .product-group-name {
        color: #95bc56;
      }
    }
    .product-group-name {
      color: #999;
      font-weight: bold;
      font-size: 14px;
    }
    .product-group-content {
      width: 97% !important;
      padding: 12px 1.5%;
    }
    .product-group-item {
      display: inline-block;
      width: 47%;
      padding: 0 1.5%;
      margin-bottom: 8px;
      .product-group-img {
        display: inline-block;
        width: 100%;
        height: 100px;
      }
      .product-group-title {
        color: #000;
        font-size: 14px;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .price-info {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        height: 26px;
        .price {
          color: #ff5400;
          .unit {
            font-size: 12px;
            font-weight: 600;
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
  .search-box {
    padding: 10px 0;
    .search {
      padding: 8px 12px;
      box-sizing: border-box;
      background: #fff;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      width: 95%;
      margin: 0 auto;
      .search-input {
        padding: 0 10px;
        flex: 1;
        border: 1px solid #90c656;
        border-right: none;
        outline: none;
        color: #999;
        font-size: 14px;
      }
      .search-input::-webkit-input-placeholder {
        color: #999;
        font-size: 13px;
      }
      .search-input:-moz-placeholder {
        color: #999;
        font-size: 13px;
      }
      .search-input:-ms-input-placeholder {
        color: #999;
        font-size: 13px;
      }
      .search-btn {
        padding: 0 7px;
        border: none;
        height: 30px;
        line-height: 28px;
        background: #90c656;
        .search-icon {
          color: #fff;
          font-size: 18px;
        }
      }
    }
  }

  .top-img {
    display: inline-block;
    width: 100%;
    height: 65px;
  }
  .banner-swiper {
    // margin-bottom: 8px;
  }
  .bottom-dots {
    bottom: 12px !important;
    a {
      .vux-icon-dot {
        width: 8px !important;
        height: 8px !important;
        border: 4px;
        background: rgba(0, 0, 0, 0.4) !important;
      }
      .vux-icon-dot.active {
        border-radius: 5px;
        width: 16px !important;
        background: #fff !important;
      }
    }
  }
}
</style>
