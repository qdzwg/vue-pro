<template>
  <div class="product" style="background:#fff">
    <!-- {{pageData}} -->
    <template v-if="pageData.listType=='type1'">
      <div
        @click="goProUrl(item)"
        class="product-box"
        v-for="(item,index) in pageData.list"
        :key="index"
        :class="{'img-radio':pageData.imgStyle&&pageData.imgStyle=='fillet'}"
      >
        <!-- 无标签 -->
        <div class="product-img" v-if="pageData.productTag==''">
          <img
            class="show-img"
            v-if="pageData.imgArr && (pageData.imgArr instanceof Array) && pageData.imgArr[index]"
            :src="pageData.imgArr[index] +'?imageMogr2/thumbnail/640x/strip/quality/100'"
            alt
          />
          <img
            v-else
            class="show-img"
            :src="item.linkMobileImg+'?imageMogr2/thumbnail/640x/strip/quality/100'"
            alt
          />
        </div>
        <!-- 自定义标签 -->
        <div class="product-img" v-if="pageData.productTag=='type4'">
          <div class="hotsale hotCustom custom-tag">
            <img :src="pageData.tagUrl+'?imageMogr2/thumbnail/640x/strip/quality/100'" alt />
          </div>
          <img
            class="show-img"
            v-if="pageData.imgArr && (pageData.imgArr instanceof Array) && pageData.imgArr[index]"
            :src="pageData.imgArr[index] +'?imageMogr2/thumbnail/640x/strip/quality/100'"
            alt
          />
          <img
            v-else
            class="show-img"
            :src="item.linkMobileImg+'?imageMogr2/thumbnail/640x/strip/quality/100'"
            alt
          />
        </div>
        <!-- 精品 -->
        <div class="product-img" v-if="pageData.productTag=='fine'">
          <div class="hotsale">
            <img src="http://statics.lotsmall.cn/wx/img/hot1.png" alt />
          </div>
          <img
            class="show-img"
            v-if="pageData.imgArr && (pageData.imgArr instanceof Array) && pageData.imgArr[index]"
            :src="pageData.imgArr[index] +'?imageMogr2/thumbnail/640x/strip/quality/100'"
            alt
          />
          <img
            v-else
            class="show-img"
            :src="item.linkMobileImg+'?imageMogr2/thumbnail/640x/strip/quality/100'"
            alt
          />
        </div>
        <!-- 热销 -->
        <div class="product-img" v-if="pageData.productTag=='type2'">
          <div class="hotsale">
            <img src="http://statics.lotsmall.cn/wx/img/product2.png" alt />
          </div>
          <img
            class="show-img"
            v-if="pageData.imgArr && (pageData.imgArr instanceof Array) && pageData.imgArr[index]"
            :src="pageData.imgArr[index] +'?imageMogr2/thumbnail/640x/strip/quality/100'"
            alt
          />
          <img
            v-else
            class="show-img"
            :src="item.linkMobileImg+'?imageMogr2/thumbnail/640x/strip/quality/100'"
            alt
          />
        </div>
        <!-- 特惠 -->
        <div class="product-img" v-if="pageData.productTag=='type1'">
          <div class="hotsale">
            <img src="http://statics.lotsmall.cn/wx/img/hot3.png" alt />
          </div>
          <img
            class="show-img"
            v-if="pageData.imgArr && (pageData.imgArr instanceof Array) && pageData.imgArr[index]"
            :src="pageData.imgArr[index] +'?imageMogr2/thumbnail/640x/strip/quality/100'"
            alt
          />
          <img
            v-else
            class="show-img"
            :src="item.linkMobileImg+'?imageMogr2/thumbnail/640x/strip/quality/100'"
            alt
          />
        </div>
        <!-- 新品 -->
        <div class="product-img" v-if="pageData.productTag=='type3'">
          <div class="hotsale newhot">
            <img src="http://statics.lotsmall.cn/wx/img/hot4.png" alt />
          </div>
          <img
            class="show-img"
            v-if="pageData.imgArr && (pageData.imgArr instanceof Array) && pageData.imgArr[index]"
            :src="pageData.imgArr[index] +'?imageMogr2/thumbnail/640x/strip/quality/100'"
            alt
          />
          <img
            v-else
            class="show-img"
            :src="item.linkMobileImg+'?imageMogr2/thumbnail/640x/strip/quality/100'"
            alt
          />
        </div>

        <div class="main-heading">
          <template
            v-if="item.businessType=='mdse'||item.businessType=='route'||item.businessType=='theater'"
          >
            <template
              v-if="item.businessType=='mdse'||item.businessType=='theater'"
            >{{(item.nickName||item.name)?(item.nickName||item.name):''}}</template>
            <template v-else>{{item.parkNickName}}</template>
          </template>
          <template v-else>
            <template
              v-if="pageData.textType.length==2"
            >【{{item.parkNickName}}】{{(item.nickName||item.name)?(item.nickName||item.name):''}}</template>
            <template
              v-if="pageData.textType.length==0"
            >{{(item.nickName||item.name)?(item.nickName||item.name):''}}</template>
            <template
              v-if="pageData.textType.length==1&&pageData.textType=='mdseName'"
            >【{{item.parkNickName}}】</template>
            <template
              v-if="pageData.textType.length==1&&pageData.textType=='productName'"
            >{{(item.nickName||item.name)?(item.nickName||item.name):''}}</template>
          </template>
        </div>
        <div class="subhead">
          <span
            v-if="pageData.textTagList&&pageData.textTagList[index]&&pageData.textTagList[index].tagTitle"
            class="tag-txt"
          >{{pageData.textTagList[index].tagTitle}}</span>
          <span>
            <template v-if="item.businessType=='route'||item.businessType=='theater'">
              <span class="icon-yuan" v-if="item.parkPriceShow||item.parkPriceShow==0">￥</span>
              <span class="icon-yuan" v-else style="color:#fff">￥</span>
            </template>
            <template v-if="item.businessType!='route'&&item.businessType!='theater'">
              <span class="icon-yuan" v-if="item.priceShow||item.priceShow==0">￥</span>
              <span class="icon-yuan" v-else style="color:#fff">￥</span>
            </template>
            <span v-if="item.businessType=='route'||item.businessType=='theater'">
              {{(item.parkPriceShow||item.parkPriceShow==0)?item.parkPriceShow:''}}
              <span
                class="price-txt"
                v-if="item.parkPriceShow||item.parkPriceShow==0"
              >起</span>
            </span>
            <span v-else>
              {{(item.priceShow||item.priceShow==0)?item.priceShow:''}}
              <span
                class="price-txt"
                v-if="item.priceShow||item.priceShow==0"
              >起</span>
            </span>
          </span>
        </div>
      </div>
    </template>
    <!-- 左右结构 -->
    <div class="paoductSide" v-if="pageData.listType=='type2'">
      <div
        class="product-box"
        :class="{'img-radio':pageData.imgStyle&&pageData.imgStyle=='fillet'}"
        @click="goProUrl(item)"
        v-for="(item,index) in pageData.list"
        :key="index"
      >
        <div class="product-img">
          <div
            class="hotsale"
            :class="{newhot:pageData.productTag=='type3'}"
            v-if="pageData.productTag&&pageData.productTag!='type4'"
          >
            <img
              v-if="pageData.productTag=='fine'"
              src="http://statics.lotsmall.cn/wx/img/hot1.png"
              alt
            />
            <img
              v-if="pageData.productTag=='type2'"
              src="http://statics.lotsmall.cn/wx/img/product2.png"
              alt
            />
            <img
              v-if="pageData.productTag=='type1'"
              src="http://statics.lotsmall.cn/wx/img/hot3.png"
              alt
            />
            <img
              v-if="pageData.productTag=='type3'"
              src="http://statics.lotsmall.cn/wx/img/hot4.png"
              alt
            />
          </div>
          <div class="hotsale hotCustom custom-tag" v-if="pageData.productTag=='type4'">
            <img :src="pageData.tagUrl+'?imageMogr2/thumbnail/640x/strip/quality/100'" alt />
          </div>
          <img
            class="show-img"
            v-if="pageData.imgArr && (pageData.imgArr instanceof Array) && pageData.imgArr[index]"
            :src="pageData.imgArr[index] +'?imageMogr2/thumbnail/640x/strip/quality/100'"
            alt
          />
          <img
            class="show-img"
            v-else
            :src="item.linkMobileImg+'?imageMogr2/thumbnail/640x/strip/quality/100'"
            alt
          />
        </div>
        <div class="main-heading">
          <template
            v-if="item.businessType=='mdse'||item.businessType=='route'||item.businessType=='theater'"
          >
            <template
              v-if="item.businessType=='mdse'||item.businessType=='theater'"
            >{{(item.nickName||item.name)?(item.nickName||item.name):''}}</template>
            <template v-else>{{item.parkNickName}}</template>
          </template>
          <template v-else>
            <template
              v-if="pageData.textType.length==2"
            >【{{item.parkNickName}}】{{(item.nickName||item.name)?(item.nickName||item.name):''}}</template>
            <template
              v-if="pageData.textType.length==0"
            >{{(item.nickName||item.name)?(item.nickName||item.name):''}}</template>
            <template
              v-if="pageData.textType.length==1&&pageData.textType=='mdseName'"
            >【{{item.parkNickName}}】</template>
            <template
              v-if="pageData.textType.length==1&&pageData.textType=='productName'"
            >{{(item.nickName||item.name)?(item.nickName||item.name):''}}</template>
          </template>
        </div>
        <div class="subhead">
          <span
            v-if="pageData.textTagList&&pageData.textTagList[index]&&pageData.textTagList[index].tagTitle"
            class="tag-txt"
          >{{pageData.textTagList[index].tagTitle}}</span>
          <span>
            <template v-if="item.businessType=='route'||item.businessType=='theater'">
              <span class="icon-yuan" v-if="item.parkPriceShow||item.parkPriceShow==0">￥</span>
              <span class="icon-yuan" v-else style="color:#fff">￥</span>
            </template>
            <template v-if="item.businessType!='route'&&item.businessType!='theater'">
              <span class="icon-yuan" v-if="item.priceShow||item.priceShow==0">￥</span>
              <span class="icon-yuan" v-else style="color:#fff">￥</span>
            </template>
            <span v-if="item.businessType=='route'||item.businessType=='theater'">
              {{(item.parkPriceShow||item.parkPriceShow==0)?item.parkPriceShow:''}}
              <span
                class="price-txt"
                v-if="item.parkPriceShow||item.parkPriceShow==0"
              >起</span>
            </span>
            <span v-else>
              {{(item.priceShow||item.priceShow==0)?item.priceShow:''}}
              <span
                class="price-txt"
                v-if="item.priceShow||item.priceShow==0"
              >起</span>
            </span>
          </span>
        </div>
      </div>
    </div>
    <!-- 左右滑动 -->
    <div class="shuffling" v-if="pageData.listType=='type3'">
      <div class="shuffling-content" style="overflow-x:auto">
        <div
          class="product-box"
          :class="{'img-radio':pageData.imgStyle&&pageData.imgStyle=='fillet'}"
          @click="goProUrl(item)"
          v-for="(item,index) in pageData.list"
          :key="index"
        >
          <div class="product-flex">
            <div class="product-img">
              <div
                class="hotsale"
                :class="{newhot:pageData.productTag=='type3'}"
                v-if="pageData.productTag&&pageData.productTag!='type4'"
              >
                <img
                  v-if="pageData.productTag=='fine'"
                  src="http://statics.lotsmall.cn/wx/img/hot1.png"
                  alt
                />
                <img
                  v-if="pageData.productTag=='type2'"
                  src="http://statics.lotsmall.cn/wx/img/product2.png"
                  alt
                />
                <img
                  v-if="pageData.productTag=='type1'"
                  src="http://statics.lotsmall.cn/wx/img/hot3.png"
                  alt
                />
                <img
                  v-if="pageData.productTag=='type3'"
                  src="http://statics.lotsmall.cn/wx/img/hot4.png"
                  alt
                />
              </div>
              <div class="hotsale hotCustom custom-tag" v-if="pageData.productTag=='type4'">
                <img :src="pageData.tagUrl+'?imageMogr2/thumbnail/640x/strip/quality/100'" alt />
              </div>
              <img
                class="show-img"
                v-if="pageData.imgArr && (pageData.imgArr instanceof Array) && pageData.imgArr[index]"
                :src="pageData.imgArr[index]+'?imageMogr2/thumbnail/640x/strip/quality/100'"
                alt
              />
              <img
                v-else
                class="show-img"
                :src="item.linkMobileImg+'?imageMogr2/thumbnail/640x/strip/quality/100'"
                alt
              />
              <div class="main-heading">
                <template
                  v-if="item.businessType=='mdse'||item.businessType=='route'||item.businessType=='theater'"
                >
                  <template
                    v-if="item.businessType=='mdse'||item.businessType=='theater'"
                  >{{(item.nickName||item.name)?(item.nickName||item.name):''}}</template>
                  <template v-else>{{item.parkNickName}}</template>
                </template>
                <template v-else>
                  <template
                    v-if="pageData.textType.length==2"
                  >【{{item.parkNickName}}】{{(item.nickName||item.name)?(item.nickName||item.name):''}}</template>
                  <template
                    v-if="pageData.textType.length==0"
                  >{{(item.nickName||item.name)?(item.nickName||item.name):''}}</template>
                  <template
                    v-if="pageData.textType.length==1&&pageData.textType=='mdseName'"
                  >【{{item.parkNickName}}】</template>
                  <template
                    v-if="pageData.textType.length==1&&pageData.textType=='productName'"
                  >{{(item.nickName||item.name)?(item.nickName||item.name):''}}</template>
                </template>
              </div>
            </div>
            <div class="subhead">
              <span
                v-if="pageData.textTagList&&pageData.textTagList[index]&&pageData.textTagList[index].tagTitle"
                class="tag-txt"
              >{{pageData.textTagList[index].tagTitle}}</span>
              <span>
                <template v-if="item.businessType=='route'||item.businessType=='theater'">
                  <span class="icon-yuan" v-if="item.parkPriceShow||item.parkPriceShow==0">￥</span>
                  <span class="icon-yuan" v-else style="color:#fff">￥</span>
                </template>
                <template v-if="item.businessType!='route'&&item.businessType!='theater'">
                  <span class="icon-yuan" v-if="item.priceShow||item.priceShow==0">￥</span>
                  <span class="icon-yuan" v-else style="color:#fff">￥</span>
                </template>
                <span v-if="item.businessType=='route'||item.businessType=='theater'">
                  {{(item.parkPriceShow||item.parkPriceShow==0)?item.parkPriceShow:''}}
                  <span
                    class="price-txt"
                    v-if="item.parkPriceShow||item.parkPriceShow==0"
                  >起</span>
                </span>
                <span v-else>
                  {{(item.priceShow||item.priceShow==0)?item.priceShow:''}}
                  <span
                    class="price-txt"
                    v-if="item.priceShow||item.priceShow==0"
                  >起</span>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import { getData } from "@/common/common";
import { linkBaseUrl } from "../../../../config/index";
export default {
  props: {
    pageData: {
      type: Object,
      default: {}
    }
  },
  mounted(){
      console.log(this.pageData)
  },
  methods: {
    goProUrl(el) {
      let { businessType, merchantProdcutId, productCode, productId } = el;
      let m_id = localStorage.getItem("xjsc_vue_2018_12_19_mid");
      if (businessType == "room") {
        businessType = "hotel";
      } else if (businessType == "mdse") {
        businessType = "shop";
      }
      let url =
        "/detail/" +
        businessType +
        "/" +
        merchantProdcutId +
        "/" +
        productCode +
        "?m_id=" +
        m_id;
      if (businessType == "ticket") {
        if (this.pageData.pxType == "single") {
          //详情页面展示单票
          this.$router.push(
            "/detail/ticket?id=" +
              merchantProdcutId +
              "&parkProductCode=" +
              productCode +
              "&productId=" +
              productId +
              "&m_id=" +
              m_id
          );
        } else {
          this.$router.push(
            "/detail/ticket?id=" +
              merchantProdcutId +
              "&productId=" +
              productId +
              "&m_id=" +
              m_id
          );
        }
      }else if(businessType == "pmsHotelTypeProduct"){
          this.$router.push(
            "/detail/pmsHotel?id=" +
              merchantProdcutId +
              "&m_id=" +
              m_id
          );
      } else {
        window.location.href = linkBaseUrl + url;
      }
    }
  }
};
</script>
<style lang='scss'>
.product {
  width: 100%;
  .product-box {
    width: 100%;
    background-color: #fff;
    padding: 10px 0 5px 0;
    .subhead {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .tag-txt {
        height: 18px;
        line-height: 18px;
        padding: 0 5px;
        background: #ecf4f6;
        color: #4993a5;
        font-size: 10px;
      }
      .price-txt {
        font-size: 11px;
        color: #666;
      }
    }
    &.img-radio {
      .product-img {
        .show-img {
          border-radius: 4px;
        }
      }
    }
    .product-img {
      width: 98%;
      height: 140px;
      margin: 0 auto;
      position: relative;
      img {
        width: 100%;
        height: 100%;
        display: block;
      }
      .hotsale {
        width: 40px;
        height: 40px;
        position: absolute;
        top: 5px;
        left: 5px;
        &.custom-tag {
          top: 0;
          left: 0;
        }
        img {
          width: 100%;
          height: 100%;
          display: block;
        }
      }
      //   .hotCustom {
      //     border: 0.5px dashed #ccc;
      //   }
      .newhot {
        top: 0px;
        left: 0px;
      }
    }
    .main-heading {
      width: 94%;
      height: 24px;
      margin: 8px auto;
      padding: 0 3px;
      line-height: 24px;
      font-size: 14px;
      color: #999;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .subhead {
      box-sizing: border-box;
      width: 100%;
      white-space: nowrap;
      height: 17px;
      padding: 0 9px;
      line-height: 17px;
      font-size: 20px;
      color: #f63;
      .icon-yuan {
        font-size: 12px;
      }
    }
  }

  .paoductSide {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .product-box {
      width: 49.8%;
      background-color: #fff;
      padding: 15px 0 5px 0;
      .product-img {
        width: 98%;
        height: 140px;
        margin: 0 auto;

        img {
          width: 100%;
          height: 100%;
          display: block;
        }
        .hotsale {
          width: 40px;
          height: 40px;
          position: absolute;
          top: 5px;
          left: 5px;
          &.custom-tag {
            top: 0;
            left: 0;
          }
          img {
            width: 100%;
            height: 100%;
            display: block;
          }
        }
        // .hotCustom {
        //   border: 0.5px dashed #ccc;
        // }
        .newhot {
          top: 0px;
          left: 0px;
        }
      }
      .main-heading {
        width: 98%;
        height: 24px;
        margin: 8px auto;
        padding: 0 1%;
        line-height: 24px;
        font-size: 16px;
        color: #413838;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .subhead {
        width: 100%;
        white-space: nowrap;
        height: 17px;
        padding: 0 9px;
        line-height: 17px;
        font-size: 18px;
        color: #f63;
        .icon-yuan {
          font-size: 12px;
        }
      }
    }
  }
  .shuffling {
    width: 100%;
    .shuffling-content {
      // display: flex;
      white-space: nowrap;
      .product-box {
        display: inline-block;
        width: auto;
        background-color: #fff;
        padding: 15px 5px 5px;
        .product-flex {
          display: flex;
          flex-direction: column;
        }
        .product-img {
          width: 98%;
          height: 110px;
          margin: 0 auto;
          padding-bottom:32px;
          img {
            width: auto;
            height: 100%;
            display: block;
          }
          .hotsale {
            width: 40px;
            height: 40px;
            position: absolute;
            top: 5px;
            left: 5px;
            &.custom-tag {
              top: 0;
              left: 0;
            }
            img {
              width: 100%;
              height: 100%;
              display: block;
            }
          }
          //   .hotCustom {
          //     border: 0.5px dashed #ccc;
          //   }
          .newhot {
            top: 0px;
            left: 0px;
          }
        }
        .main-heading {
          position: absolute;
          width: 98%;
          height: 24px;
          margin: 8px auto;
          padding: 0 3%;
          line-height: 24px;
          font-size: 14px;
          color: #413838;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        .subhead {
          width: 100%;
          white-space: nowrap;
          height: 17px;
          padding: 0 4px;
          line-height: 10px;
          font-size: 16px;
          color: #f63;
          .icon-yuan {
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
