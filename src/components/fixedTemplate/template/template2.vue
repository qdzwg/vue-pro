<template>
  <div class="template2-warpper">
    <img
      class="top-img"
      v-if="pageData.mainPageFix&&pageData.mainPageFix.length"
      :src="pageData.mainPageFix[0].picAddr"
      @click="goLink(pageData.mainPageFix[0])"
      alt
    >
    <div class="search-warpper">
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
      <div class="search-box">
        <div class="search">
          <input  @keyup.enter="goOperation" class="search-input" v-model="seachName" placeholder="请输入您要搜索的产品" type="text">
          <button @click="goOperation" class="search-btn">
            <i class="xx-icon icon-ico-search search-icon"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="nav-layout-warpper">
      <div class="nav-item" @click="navGoUrl('ticket')">
        <div class="nav-icon" style="background:#368ff5">
          <i class="xx-icon icon-nav-ticket"></i>
        </div>
        <div class="nav-title">门票预定</div>
      </div>
      <div class="nav-item" @click="navGoUrl('hotel')">
        <div class="nav-icon" style="background:#f4b613">
          <i class="xx-icon icon-nav-hotel"></i>
        </div>
        <div class="nav-title">酒店住宿</div>
      </div>
      <div class="nav-item" @click="navGoUrl('shop')">
        <div class="nav-icon" style="background:#0fc4d9">
          <i class="xx-icon icon-nav-goods"></i>
        </div>
        <div class="nav-title">商品购物</div>
      </div>
      <div class="nav-item" @click="navGoUrl('strategy')">
        <div class="nav-icon" style="background:#84d018">
          <i class="xx-icon icon-nav-raiders"></i>
        </div>
        <div class="nav-title">游记攻略</div>
      </div>
    </div>
    <div class="product2-warpper">
      <div class="product-header">
        <i class="line"></i>
        <span class="title">精品推荐</span>
      </div>
      <swiper dots-position="right" :auto="true" height="5.44rem" dots-class="bottom-dots">
        <swiper-item class="swiper-demo-img" v-for="(item, index) in productData.fine" :key="index">
          <div @click="goUrl(item)">
            <div class="show-price">
              {{(item.priceShow||item.priceShow==0)?('￥'+item.priceShow):''}}
              起
            </div>
            <img style="width:100%" class="product-img" :src="item.linkMobileImg">
            <div class="product-detail">
              <div class="dis-flex">
                <span class="product-name">
                  <template
                    v-if="item.businessType=='room'"
                  >【{{item.parkNickName}}】{{item.nickName}}</template>
                  <template v-else>{{item.nickName?item.nickName:item.parkNickName}}</template>
                </span>
              </div>
              <div class="dis-flex">
                <div class="product-subtitle">{{item.subtitle}}</div>
              </div>
            </div>
          </div>
        </swiper-item>
      </swiper>
    </div>
    <div class="product-group-warpper">
      <tab :line-width="3" active-color="#3f98f6" custom-bar-width="1.8rem" v-model="tabindex">
        <tab-item class="vux-center" v-for="(item, index) in productListData" :key="index">
          <span class="product-group-name">{{item.groupName}}</span>
        </tab-item>
      </tab>
      <template v-for="(item, index) in productListData">
        <div class="product-group-content" :key="index" v-if="tabindex==index">
          <div class="tab-swiper vux-center swiper-content">
            <div v-for="(it,i) in item.data" :key="i" class="product-group-item" @click="goUrl(it)">
              <img class="product-group-img" :src="it.linkMobileImg" alt>
              <div class="product-group-title">
                <template v-if="it.businessType=='ticket'">
                   {{it.nickName?it.nickName:it.name}}
                </template>
                 <template v-if="it.businessType=='room'">
                   【{{it.parkNickName?it.parkNickName:''}}】{{it.nickName?it.nickName:it.name}}
                </template>
                 <template v-if="it.businessType=='mdse'">
                   {{it.nickName?it.nickName:it.name}}
                </template>
                </div>
              <div class="price-info">
                <div class="price">
                  <span class="unit">￥</span>
                  <span v-if="it.businessType=='ticket'">{{it.priceShow?it.priceShow:''}}</span>
                  <span v-if="it.businessType=='room'">{{it.priceShow?it.priceShow:''}}</span>
                  <span v-if="it.businessType=='mdse'">{{it.priceShow?it.priceShow:''}}</span>
                  <span v-if="it.businessType!='mdse'" style="color:#999">/人</span>
                </div>
                <span v-if="(it.sellNum&&it.sellNum!=0)||it.virtualSale" class="seller-num">
                  <template>{{it.virtualSale?it.virtualSale:it.sellNum}}人已买</template>
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
import { Tab, TabItem, Swiper, SwiperItem } from "vux";
import pageFooter from "./footer.vue";
import { linkBaseUrl } from "../../../../config/index"
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
      seachName:'',
      footerArr: {
        backgroundColor: "#2366c9",
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
  }
};
</script>
<style lang="scss">
.template2-warpper {
  padding-bottom: 50px;
  background: #eee;
  .product-group-warpper {
    background: #ffffff;
    .vux-tab-item.vux-tab-selected {
      .product-group-name {
        color: #3f98f6;
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
        padding: 6px 0;
        height: 22px;
        line-height: 1.2;
        color: #333;
        font-size: 12px;
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
          color: #ff5400;
          .unit {
            font-size: 12px;
            font-weight: 600;
          }
        }
        .seller-num {
          color: #999999;
          font-size: 10px;
        }
      }
    }
  }
  .search-warpper {
    position: relative;
    margin-bottom: 22px;
    .search-box {
      position: absolute;
      width: 100%;
      left: 0;
      bottom: -14px;
      .search {
        display: flex;
        justify-content: space-between;
        width: 90%;
        margin: 0 auto;
        .search-input {
          padding: 0 10px;
          flex: 1;
          border: 1px solid #dddddd;
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
          height: 28px;
          line-height: 28px;
          background: #3f98f6;
          .search-icon {
            color: #fff;
            font-size: 18px;
          }
        }
      }
    }
  }
  .nav-layout-warpper {
    padding-top: 15px;
    margin-bottom: 10px;
    background: #fff;
    display: flex;
    justify-content: space-around;
    .nav-item {
      text-align: center;
      flex: 1;
      overflow: hidden;
      .nav-icon {
        background: red;
        border-radius: 50%;
        display: inline-flex;
        height: 50px;
        width: 50px;
        justify-content: center;
        align-items: center;
        .nav-img {
          width: 26px;
          height: 26px;
        }
        .xx-icon {
          color: #fff;
          font-size: 30px;
        }
      }
      .nav-title {
        height: 30px;
        line-height: 30px;
        color: #666;
      }
    }
  }
  .product2-warpper {
    margin-bottom: 10px;
    background: #ffffff;
    .product-header {
      margin-left: 12px;
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
        font-size: 15px;
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
          width: 6px !important;
          height: 6px !important;
          border: 3px;
          background: #fff !important;
        }
        .vux-icon-dot.active {
          width: 6px !important;
          background: #3f98f6 !important;
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
        width: 6px !important;
        height: 6px !important;
        border: 3px;
        background: #ffffff !important;
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
