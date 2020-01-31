<template>
  <div
    class="topleftBar"
    id="topleftBar"
    ref="productGroupref"
    :class="'topleftBar-'+pageData.pageInteraction"
  >
    <div class="topbar-box" v-if="pageData.type=='productGroup1'">
      <!-- 下划线 -->
      <div class="topbar" :class="{'tab-fixed':isFixed}" v-if="pageData.menuType=='type1'">
        <div
          class="topbar-item"
          :class="{active:currentTab==index}"
          @click="swichNav(index)"
          v-for="(item,index) in pageData.list"
          :key="index"
        >
          <div class="topbar-item-name">{{item.groupName?item.groupName:'默认名称'}}</div>
        </div>
      </div>
      <!-- 方角 -->
      <div class="topbar tpd" :class="{'tab-fixed':isFixed}" v-if="pageData.menuType=='type2'">
        <div
          class="topbar-item"
          :class="{active2:currentTab==index}"
          @click="swichNav(index)"
          v-for="(item,index) in pageData.list"
          :key="index"
        >
          <div class="topbar-item-name">{{item.groupName?item.groupName:'默认名称'}}</div>
          <div
            :class="{botBar:currentTab==index}"
            :style="{left:pageData.list.length<=3?'45%':'40%'}"
          ></div>
        </div>
      </div>
      <!-- 圆角 -->
      <div class="topbar tpd2" :class="{'tab-fixed':isFixed}" v-if="pageData.menuType=='type3'">
        <div
          class="topbar-item"
          :class="{active3:currentTab==index}"
          @click="swichNav(index)"
          v-for="(item,index) in pageData.list"
          :key="index"
        >
          <div class="topbar-item-name">{{item.groupName?item.groupName:'默认名称'}}</div>
        </div>
      </div>
      <!-- 单列 -->
      <div
        id="topbar-box-content"
        :class="{'fiex-padding':isFixed}"
        v-for="(item,index) in pageData.list"
        :key="index"
        v-if="currentTab==index"
      >
        <div
          @click="goProUrl(ele)"
          class="product-box"
          :class="{'img-radios':pageData.imgStyle&&pageData.imgStyle=='fillet'}"
          v-if="pageData.listType=='type1'"
          v-for="(ele,i) in pageData.list[index].data"
          :key="i"
        >
          <div class="product-img">
            <img
              v-if="pageData.list[index].imgArr && (pageData.list[index].imgArr instanceof Array) && pageData.list[index].imgArr[i]"
              style="width:100%;height:100%"
              :src="pageData.list[index].imgArr[i]+'?imageMogr2/thumbnail/640x/strip/quality/100'"
              alt
            />
            <img
              v-else
              style="width:100%;height:100%"
              :src="ele.linkMobileImg+'?imageMogr2/thumbnail/640x/strip/quality/100'"
              alt
            />
          </div>
          <div class="main-heading">
            <template
              v-if="ele.businessType=='mdse'||ele.businessType=='route'||ele.businessType=='theater'"
            >
              <template
                v-if="ele.businessType=='mdse'||ele.businessType=='theater'"
              >{{(ele.nickName||ele.name)?(ele.nickName||ele.name):''}}</template>
              <template v-else>{{ele.parkNickName}}</template>
            </template>
            <template v-else>
              <template
                v-if="pageData.textType.length==2"
              >【{{ele.parkNickName}}】{{(ele.nickName||ele.name)?(ele.nickName||ele.name):''}}</template>
              <template
                v-if="pageData.textType.length==0"
              >{{(ele.nickName||ele.name)?(ele.nickName||ele.name):''}}</template>
              <template
                v-if="pageData.textType.length==1&&pageData.textType=='mdseName'"
              >【{{ele.parkNickName}}】</template>
              <template
                v-if="pageData.textType.length==1&&pageData.textType=='productName'"
              >{{(ele.nickName||ele.name)?(ele.nickName||ele.name):''}}</template>
            </template>
          </div>
          <div class="subhead">
            <span
              v-if="item.textTagList&&item.textTagList[i]&&item.textTagList[i].tagTitle"
              class="tag-txt"
            >{{item.textTagList[i].tagTitle}}</span>
            <span>
              <template v-if="ele.businessType=='route'||ele.businessType=='theater'">
                <span class="icon-yuan" v-if="ele.parkPriceShow||ele.parkPriceShow==0">￥</span>
                <span class="icon-yuan" v-else style="color:#fff">￥</span>
              </template>
              <template v-if="ele.businessType!='route'&&ele.businessType!='theater'">
                <span class="icon-yuan" v-if="ele.priceShow||ele.priceShow==0">￥</span>
                <span class="icon-yuan" v-else style="color:#fff">￥</span>
              </template>
              <span v-if="ele.businessType=='route'||ele.businessType=='theater'">
                {{(ele.parkPriceShow||ele.parkPriceShow==0)?ele.parkPriceShow:''}}
                <span
                  class="price-txt"
                  v-if="ele.parkPriceShow||ele.parkPriceShow==0"
                >起</span>
              </span>
              <span v-else>
                {{(ele.priceShow||ele.priceShow==0)?ele.priceShow:''}}
                <span
                  class="price-txt"
                  v-if="ele.priceShow||ele.priceShow==0"
                >起</span>
              </span>
            </span>
          </div>
        </div>
      </div>
      <!-- 双列 -->
      <div v-if="pageData.listType=='type2'" id="topbar-box-content" class="paoductSide">
        <div
          class="product-box"
          :class="{'img-radios':pageData.imgStyle&&pageData.imgStyle=='fillet'}"
          v-for="(ele,i) in pageData.list[index].data"
          :key="i"
          @click="goProUrl(ele)"
        >
          <div class="product-img">
            <img
              v-if="pageData.list[index].imgArr && (pageData.list[index].imgArr instanceof Array) && pageData.list[index].imgArr[i]"
              :src="pageData.list[index].imgArr[i]+'?imageMogr2/thumbnail/640x/strip/quality/100'"
              alt
            />
            <img v-else :src="ele.linkMobileImg+'?imageMogr2/thumbnail/640x/strip/quality/100'" alt />
          </div>
          <div class="main-heading">
            <template
              v-if="ele.businessType=='mdse'||ele.businessType=='route'||ele.businessType=='theater'"
            >
              <template
                v-if="ele.businessType=='mdse'||ele.businessType=='theater'"
              >{{(ele.nickName||ele.name)?(ele.nickName||ele.name):''}}</template>
              <template v-else>{{ele.parkNickName}}</template>
            </template>
            <template v-else>
              <template
                v-if="pageData.textType.length==2"
              >【{{ele.parkNickName}}】{{(ele.nickName||ele.name)?(ele.nickName||ele.name):''}}</template>
              <template
                v-if="pageData.textType.length==0"
              >{{(ele.nickName||ele.name)?(ele.nickName||ele.name):''}}</template>
              <template
                v-if="pageData.textType.length==1&&pageData.textType=='mdseName'"
              >【{{ele.parkNickName}}】</template>
              <template
                v-if="pageData.textType.length==1&&pageData.textType=='productName'"
              >{{(ele.nickName||ele.name)?(ele.nickName||ele.name):''}}</template>
            </template>
          </div>
          <div class="subhead">
            <span
              v-if="pageData.list[index].textTagList&&pageData.list[index].textTagList[i]&&pageData.list[index].textTagList[i].tagTitle"
              class="tag-txt"
            >{{pageData.list[index].textTagList[i].tagTitle}}</span>
            <span>
              <template v-if="ele.businessType=='route'||ele.businessType=='theater'">
                <span class="icon-yuan" v-if="ele.parkPriceShow||ele.parkPriceShow==0">￥</span>
                <span class="icon-yuan" v-else style="color:#fff">￥</span>
              </template>
              <template v-if="ele.businessType!='route'&&ele.businessType!='theater'">
                <span class="icon-yuan" v-if="ele.priceShow||ele.priceShow==0">￥</span>
                <span class="icon-yuan" v-else style="color:#fff">￥</span>
              </template>
              <span v-if="ele.businessType=='route'||ele.businessType=='theater'">
                {{(ele.parkPriceShow||ele.parkPriceShow==0)?ele.parkPriceShow:''}}
                <span
                  class="price-txt"
                  v-if="ele.parkPriceShow||ele.parkPriceShow==0"
                >起</span>
              </span>
              <span v-else>
                {{(ele.priceShow||ele.priceShow==0)?ele.priceShow:''}}
                <span
                  class="price-txt"
                  v-if="ele.priceShow||ele.priceShow==0"
                >起</span>
              </span>
            </span>
          </div>
        </div>
      </div>
      <!-- 横划 -->
      <div id="topbar-box-content" class="shuffling" v-if="pageData.listType=='type3'">
        <template v-for="(item,index) in pageData.list">
          <div
            class="shuffling-content"
            style="overflow-x: scroll"
            :key="index"
            v-if="currentTab==index"
            scroll-x="true"
            scroll-with-animation="true"
            v-bind:style="{width:scrollWidth+'rpx'}"
          >
            <div
              class="product-box"
              :class="{'img-radios':pageData.imgStyle&&pageData.imgStyle=='fillet'}"
              v-for="(ele,i) in pageData.list[index].data"
              :key="i"
              @click="goProUrl(ele)"
            >
              <div class="product-img">
                <img
                  v-if="pageData.list[index].imgArr && (pageData.list[index].imgArr instanceof Array) && pageData.list[index].imgArr[i]"
                  :src="pageData.list[index].imgArr[i]+'?imageMogr2/thumbnail/640x/strip/quality/100'"
                  alt
                />
                <img
                  v-else
                  :src="ele.linkMobileImg+'?imageMogr2/thumbnail/640x/strip/quality/100'"
                  alt
                />
              </div>
              <div class="main-heading">
                <template
                  v-if="ele.businessType=='mdse'||ele.businessType=='route'||ele.businessType=='theater'"
                >
                  <template
                    v-if="ele.businessType=='mdse'||ele.businessType=='theater'"
                  >{{(ele.nickName||ele.name)?(ele.nickName||ele.name):''}}</template>
                  <template v-else>{{ele.parkNickName}}</template>
                </template>
                <template v-else>
                  <template
                    v-if="pageData.textType.length==2"
                  >【{{ele.parkNickName}}】{{(ele.nickName||ele.name)?(ele.nickName||ele.name):''}}</template>
                  <template
                    v-if="pageData.textType.length==0"
                  >{{(ele.nickName||ele.name)?(ele.nickName||ele.name):''}}</template>
                  <template
                    v-if="pageData.textType.length==1&&pageData.textType=='mdseName'"
                  >【{{ele.parkNickName}}】</template>
                  <template
                    v-if="pageData.textType.length==1&&pageData.textType=='productName'"
                  >{{(ele.nickName||ele.name)?(ele.nickName||ele.name):''}}</template>
                </template>
              </div>
              <div class="subhead">
                <span
                  v-if="item.textTagList&&item.textTagList[i]&&item.textTagList[i].tagTitle"
                  class="tag-txt"
                >{{item.textTagList[i].tagTitle}}</span>
                <span>
                  <template v-if="ele.businessType=='route'||ele.businessType=='theater'">
                    <span class="icon-yuan" v-if="ele.parkPriceShow||ele.parkPriceShow==0">￥</span>
                    <span class="icon-yuan" v-else style="color:#fff">￥</span>
                  </template>
                  <template v-if="ele.businessType!='route'&&ele.businessType!='theater'">
                    <span class="icon-yuan" v-if="ele.priceShow||ele.priceShow==0">￥</span>
                    <span class="icon-yuan" v-else style="color:#fff">￥</span>
                  </template>
                  <span v-if="ele.businessType=='route'||ele.businessType=='theater'">
                    {{(ele.parkPriceShow||ele.parkPriceShow==0)?ele.parkPriceShow:''}}
                    <span
                      class="price-txt"
                      v-if="ele.parkPriceShow||ele.parkPriceShow==0"
                    >起</span>
                  </span>
                  <span v-else>
                    {{(ele.priceShow||ele.priceShow==0)?ele.priceShow:''}}
                    <span
                      class="price-txt"
                      v-if="ele.priceShow||ele.priceShow==0"
                    >起</span>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- 普通左侧  跟active5区分-->
    <div class="tab-box" v-if="pageData.type=='productGroup2'">
      <div class="topbar-left-box" v-if="pageData.menuType=='type1'">
        <div
          class="topbar-left"
          :class="{active4:scrollCurrentIndex==index}"
          @click="swichNavScroll(index)"
          v-for="(item,index) in pageData.list"
          :key="index"
        >
          <div class="topbar-left-name">{{item.groupName}}</div>
        </div>
      </div>
      <!-- 普通左侧   跟active4区分-->
      <div class="topbar-left-box" v-if="pageData.menuType=='type2'">
        <div
          class="topbar-left"
          :class="{active5:scrollCurrentIndex==index}"
          @click="swichNavScroll(index)"
          v-for="(item,index) in pageData.list"
          :key="index"
        >
          <div class="topbar-left-name">{{item.groupName}}</div>
        </div>
      </div>
      <!-- 内容带圆角的 -->
      <div class="topbar-left-box tab-bgc" v-if="pageData.menuType=='type3'">
        <div
          class="topbar-left"
          :class="{active6:scrollCurrentIndex==index}"
          @click="swichNavScroll(index)"
          v-for="(item,index) in pageData.list"
          :key="index"
        >
          <div class="topbar-left-name">{{item.groupName}}</div>
        </div>
      </div>
      <div id="wrapper" ref="scrollWarpper">
        <div class="wrapper-content" ref="scrollBox">
          <div v-for="(item,index) in pageData.list" :key="index" class="product-group-item">
            <div class="product-group-name">{{item.groupName}}</div>
            <div class="product-group-ul">
              <div
                v-for="(ele,i) in item.data"
                :key="i"
                class="product-group-li"
                :class="{'img-radios':pageData.imgStyle&&pageData.imgStyle=='fillet'}"
                @click="goProUrl(ele)"
              >
                <img
                  v-if="pageData.list[index].imgArr && (pageData.list[index].imgArr instanceof Array) && pageData.list[index].imgArr[i]"
                  :src="pageData.list[index].imgArr[i]+'?imageMogr2/thumbnail/640x/strip/quality/100'"
                  alt
                />
                <img
                  v-else
                  :src="ele.linkMobileImg+'?imageMogr2/thumbnail/640x/strip/quality/100'"
                  alt
                />
                <div class="product-detail">
                  <div
                    class="product-title"
                  >{{(ele.nickName||ele.name)?(ele.nickName||ele.name):''}}</div>
                  <div class="tag-price">
                    <span
                      v-if="item.textTagList&&item.textTagList[i]&&item.textTagList[i].tagTitle"
                      class="tag-txt"
                    >{{item.textTagList[i].tagTitle}}</span>
                    <span class="price">
                      <template v-if="ele.businessType=='route'||ele.businessType=='theater'">
                        <span class="icon-yuan" v-if="ele.parkPriceShow||ele.parkPriceShow==0">￥</span>
                        <span class="icon-yuan" v-else style="color:#fff">￥</span>
                      </template>
                      <template v-if="ele.businessType!='route'&&ele.businessType!='theater'">
                        <span class="icon-yuan" v-if="ele.priceShow||ele.priceShow==0">￥</span>
                        <span class="icon-yuan" v-else style="color:#fff">￥</span>
                      </template>
                      <span v-if="ele.businessType=='route'||ele.businessType=='theater'">
                        {{(ele.parkPriceShow||ele.parkPriceShow==0)?ele.parkPriceShow:''}}
                        <span
                          class="price-txt"
                          v-if="ele.parkPriceShow||ele.parkPriceShow==0"
                        >起</span>
                      </span>
                      <span v-else>
                        {{(ele.priceShow||ele.priceShow==0)?ele.priceShow:''}}
                        <span
                          class="price-txt"
                          v-if="ele.priceShow||ele.priceShow==0"
                        >起</span>
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { linkBaseUrl } from "../../../../config/index";
import BScroll from "better-scroll";
export default {
  props: {
    pageData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      refHeight: 0,
      documentScrollHeight: 0,
      index: 0,
      scrollY: null,
      rightLiTops: [],
      test: null,
      scrollLeft: 0,
      scrollHeight: 500,
      tabBoxHeight: 439,
      scrollWidth: 750,
      currentTab: 0,
      isFixed: false,
      viewId: "",
      flag: true, //控制计算第一个业态高度（刚开始计算）
      rightLiTops: [],
      tabHeight: null,
      tops: [],
      scrollY: null,
      currentIndex: 0,
      scrollTop: null
    };
  },
  created() {
    this.scrollFn = () => {
      let flag = true;
      if (flag) {
        this.refHeight = this.$refs.productGroupref.offsetTop;
        flag = false;
      }
      this.documentScrollHeight =
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        window.pageYOffset;
      if (this.documentScrollHeight > this.refHeight) {
        this.isFixed = true;
      } else {
        this.isFixed = false;
      }
    };
  },
  computed: {
    scrollCurrentIndex() {
      const { scrollY, rightLiTops } = this;
      return rightLiTops.findIndex((tops, index) => {
        return scrollY >= tops && scrollY < rightLiTops[index + 1];
      });
    }
  },
  destroyed() {
    if (this.pageData.pageInteraction == "type2") {
      window.removeEventListener("scroll", this.scrollFn);
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.pageData.pageInteraction == "type2") {
        window.addEventListener("scroll", this.scrollFn);
      }
      if (this.pageData.type == "productGroup2") {
        this.heightInit();
        this.scrolInit();
      }
    });
  },
  watch: {},
  methods: {
    swichNavScroll(index) {
      this.scrollY = this.rightLiTops[index];
      this.betterScorll.scrollTo(0, -this.rightLiTops[index]);
    },
    heightInit() {
      let itemArray = []; //定义一个伪数组
      let top = 0;
      itemArray.push(top);

      let allList = this.$refs.scrollBox.getElementsByClassName(
        "product-group-item"
      );
      //allList伪数组转化成真数组
      Array.prototype.slice.call(allList).forEach(item => {
        top += item.clientHeight; //获取所有li的每一个高度
        itemArray.push(top);
      });
      this.rightLiTops = itemArray;
      // console.log(this.rightLiTops);
    },
    scrolInit() {
      this.betterScorll = new BScroll(this.$refs.scrollWarpper, {
        probeType: 3, //在滚动中触发scroll 事件
        click: true
      });
      this.betterScorll.on("scroll", pos => {
        this.scrollY = Math.abs(pos.y);
      });
    },
    goProUrl(el) {
      let { businessType, merchantProdcutId, productCode, productId } = el;
      // ele.businessType, ele.merchantProdcutId, ele.productCode
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
    },
    switchTab(e) {
      if (e.mp.detail.source == "touch") {
        this.currentTab = e.mp.detail.current;
      }
      this.flag = false;
      this.testHeight =
        Math.round(this.pageData.list[this.currentTab].data.length / 2) * 424;
      // this.checkCor();
    },
    scrolltoupper() {
      if (this.currentTab > 0) {
        this.currentTab--;
      }
    },
    scrolltolower() {
      if (this.currentTab == this.pageData.list.length - 1) {
      } else {
        this.currentTab++;
      }
    },
    scrollTopFn(h, t, that) {
      let _this = that;
      if (h + (_this.navContentHeight + _this.navBarHeight) > t) {
        //   console.log(111)
        if (_this.pageData.pageInteraction == "type2") {
          // console.log(222)
          _this.isFixed = true;
        }
      } else if (h < t + 50) {
        //   console.log(333)
        _this.isFixed = false;
      }
    },
    throttle(after, wait) {
      /*option说明：after [回调函数];
                  wait  [周期性执行回调间隔时间ms]
     */
      var timer;
      var isScroll; //是否正在执行回调
      return function() {
        if (isScroll) return; //在回调函数未执行完以前
        isScroll = true;
        timer && clearTimeout(timer);
        timer = setTimeout(function() {
          after && after();
          isScroll = false;
          timer = null;
        }, wait);
      };
    },
    scroll(e) {
      let _this = this;
      let height = e.mp.detail.scrollTop;
      // console.log(this)
      //   _this.throttle(_this.scrollFn(height, this.tops, this), 300)();
    },
    swichNav(index, test) {
      // console.log(this.pageData.list[index].data.length);
      // if (this.isFixed && this.pageData.list[index].data.length) {
      //   window.scrollTo(0, this.refHeight);
      // }

      let _this = this;
      this.index = index;
      if (index == this.currentTab) {
        return false;
      } else {
        this.currentTab = index;
        this.currentIndex = index;
        this.viewId = "list-" + index;
      }
      this.flag = false;
      this.testHeight =
        Math.round(this.pageData.list[index].data.length / 2) * 424;
      this.$nextTick(() => {
        if (this.isFixed && this.pageData.list[index].data.length) {
          window.scrollTo(0, this.refHeight);
        }
      });
    },
    setShopcar() {}
  }
};
</script>
<style lang='scss'>
.topleftBar {
  width: 100%;
  #wrapper {
    height: 400px;
    overflow: hidden;
    flex: 1;
    margin: 0 4px;
    border-bottom-left-radius: 9px;
    border-bottom-right-radius: 9px;
    background: #fff;
    .wrapper-content {
      border-radius: 9px;
      .product-group-item {
        .product-group-name {
          font-size: 12px;
          color: #999;
          height: 40px;
          line-height: 40px;
          border-bottom: 1px solid #eeeee7;
          padding-left: 10px;
        }
        .product-group-ul {
          padding: 15px 10px;
          .product-group-li {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            &.img-radios {
              img {
                border-radius: 4px;
              }
            }
            &:last-child {
              margin-bottom: 0;
            }
            img {
              display: inline-block;
              height: 68px;
              width: 106px;
            }
            .product-detail {
              flex: 1;
              margin-left: 10px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              .product-title {
                font-size: 14px;
                color: #999;
                line-height: 23px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
              }
              .tag-price {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                .price{
                  color:#f63;
                  font-size: 18px;
                  .icon-yuan{
                    font-size: 12px;
                  }
                  .price-txt{
                    font-size: 11px;
                    color: #666;
                  }

                }
                .tag-txt {
                  height: 18px;
                  line-height: 18px;
                  padding: 0 5px;
                  background: #ecf4f6;
                  color: #4993a5;
                  font-size: 10px;
                }
              }
            }
          }
        }
      }
    }
  }
  .topbar-box {
    width: 100%;
    margin: 5px 0;
    #topbar-box-content {
      background: #fff;
      .subhead {
        display: flex;
        justify-content: space-between;
        align-self: center;
        box-sizing: border-box;
        .price-txt {
          font-size: 11px;
          color: #666;
        }
      }
      .tag-txt {
        height: 18px;
        line-height: 18px;
        padding: 0 5px;
        background: #ecf4f6;
        color: #4993a5;
        font-size: 10px;
      }
    }
    // .fiex-padding {
    //   padding-top: 40px;
    // }
    .product-box {
      width: 100%;
      padding: 15px 0 5px 0;
      //   margin-bottom:10px;
      &.img-radios {
        .product-img {
          img {
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
      }
      .main-heading {
        // width: 98%;
        height: 24px;
        margin: 8px auto;
        padding: 0 9px;
        line-height: 24px;
        font-size: 12px;
        color: #413838;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .subhead {
        width: 100%;
        height: 17px;
        padding: 0 9px;
        line-height: 17px;
        font-size: 20px;
        color: #f63;
        .icon-yuan {
          font-size: 12px;
          height: 12px;
        }
      }
    }
    .paoductSide {
      width: 100%;
      height: auto;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .product-box {
        width: 49.8%;
        background-color: #fff;
        padding: 10px 0 5px 0;
        .product-img {
          width: 98%;
          height: 140px;
          margin: 0 auto;
          img {
            width: 100%;
            height: 100%;
            display: block;
          }
        }
        .main-heading {
          //   width: 98%;
          height: 24px;
          margin: 8px auto;
          padding: 0 9px;
          font-size: 14px;
          line-height: 24px;
          color: #413838;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        .subhead {
          width: 100%;
          height: 17px;
          padding: 0 9px;
          line-height: 10px;
          font-size: 16px;
          color: #fc4150;
          .icon-yuan {
            font-size: 12px;
          }
        }
      }
    }

    .shuffling {
      //   width: 200%;
      margin-top: 10px;
      vertical-align: top;
      .shuffling-content {
        // display: flex;
        white-space: nowrap;
        vertical-align: top;
        .product-box {
          display: inline-block;
          width: 160px;
          background-color: #fff;
          padding: 15px 0 5px 0;
          padding-top: 0px;
          .product-img {
            width: 98%;
            height: 110px;
            margin: 0 auto;

            img {
              width: 100%;
              height: 100%;
              display: block;
            }
          }
          .main-heading {
            // width: 98%;
            height: 24px;
            margin: 8px auto;
            padding: 0 3px;
            font-size: 14px;
            line-height: 24px;
            color: #413838;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
          .subhead {
            width: 100%;
            height: 17px;
            padding: 0 3px;
            line-height: 17px;
            font-size: 10px;
            font-size: 18px;
            color: #fc4150;
            .icon-yuan {
              font-size: 12px;
            }
          }
        }
      }
    }
    .topbar {
      width: 100%;
      box-sizing: border-box;
      //   overflow: hidden;
      line-height: 40px;
      font-size: 16px;
      white-space: nowrap;
      background: #fff;
      display: flex;
      //   box-shadow: 0.5px 0.5px 5px #d8d6d6;
      background: #fff;
      ::-webkit-scrollbar {
        width: 0;
        height: 0;
        color: transparent;
      }
      &.tab-fixed {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 999;
      }
      .topbar-item {
        flex: 1;
        // text-overflow: ellipsis;
        // overflow: hidden;
        // white-space: nowrap;
        font-size: 14px;
        font-family: PingFangSC-Medium, sans-serif;
        display: inline-block;
        // width: calc(25%);
        text-align: center;
        color: #413838;
        .topbar-item-name {
          // text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
      .topbar-item.active {
        color: #f05b47;
        position: relative;
      }
      .topbar-item.active::after {
        content: "";
        display: block;
        height: 2px;
        // text-align: center;
        width: 100%;
        background: #f05b47;
        position: absolute;
        // left:12.5%;
        bottom: 0;
        border-radius: 1px;
      }
      .topbar-item.active2 {
        color: #fff;
        background-color: #f05b47;
        position: relative;
      }
      .topbar-item > .botBar {
        width: 0;
        height: 0;
        border: 7px solid#f05b47;
        border-color: #f05b47 transparent transparent transparent;
        position: absolute;
        bottom: -11.5px;
        left: 45%;
      }
      .topbar-item.active3 {
        color: #fff;
        background-color: #f05b47;
        border-radius: 20px;
      }
      .topbar-left {
        display: block;
      }
    }
    .topbar.fixed {
      position: fixed;
      //   top: 65px;
      left: 0;
      z-index: 99;
    }
    .tpd {
      padding: 0px;
    }
    .tpd2 {
      padding: 5px 10px;
    }
  }
  .tab-box {
    // background: #eee;
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    .scroll-box {
      width: 301px;
      // float:right;
    }
    .topbar-left-box {
      width: 65px;
      font-size: 12px;
      background: #fff;
      // float: left;
      .topbar-left {
        font-family: PingFangSC-Medium, sans-serif;
        width: 100%;
        height: 40px;
        // text-align: center;
        color: #999999;
        border-bottom: 0.5px solid #eeeee7;
        display: flex;
        align-items: center;
        .topbar-left-name {
          display: -webkit-box !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          word-wrap: break-word !important;
          white-space: normal !important;
          -webkit-line-clamp: 2 !important;
          -webkit-box-orient: vertical !important;
          //   line-height: 40px;
          margin-left: 9px;
        }
      }
      .topbar-left:last-child {
        border-bottom: 0px;
      }
      .topbar-left.active4 {
        color: #fff;
        background-color: #f05b47;
      }
      .topbar-left.active5 {
        // color: #fff;
        // background-color: #f05b47;
        // text-align: center;
        // line-height: 30px;
        // margin: 5px auto;
        // width: 60px;
        // height: 30px;
        // border-radius: 15px;
        position: relative;
      }
      .topbar-left.active5::before {
        content: "";
        display: block;
        height: 30px;
        width: 2px;
        background: #f05b47;
        position: absolute;
        right: 0;
        top: 12.5%;
        border-radius: 1px;
      }
      .topbar-left.active6 {
        color: #413838;
        background-color: #fff;
        padding-right: 6px;
      }
    }
    .topbar-left-box.fixed {
      position: fixed;
      //   top: 64px;
      left: 0;
      z-index: 99;
    }
    .tab-bgc {
      color: #cdcdcd;
    }
    .bgc {
      background-color: #fff;
    }
    .topbar-left-content1,
    .topbar-scroll {
      // float: right;
      ::-webkit-scrollbar {
        width: 0;
        height: 0;
        color: transparent;
      }

      .topbar-left-content,
      .top-radius {
        width: 100%;
        background-color: #fff;
        color: #a0a0a0;
        margin-right: 4px;
        margin-bottom: 10px;

        .group-title {
          font-size: 14px;
          font-family: PingFangSC-Medium, sans-serif;
          padding-left: 10px;
          line-height: 40px;
          border-bottom: 0.5px solid #eeeee7;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
        .group-content {
          width: 100%;
          font-size: 14px;
          .group-content-item {
            padding-bottom: 15px;
            position: relative;
            img {
              width: 106px;
              height: 68px;
              display: inline-block;
              padding-left: 10px;
              padding-top: 5px;
              float: left;
            }
            .text {
              float: left;
              width: 150px;
              margin-left: 10px;
              padding-left: 10px;
              display: inline-block;
              //   height: 24px;
              line-height: 24px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
            }
            .shopCar {
              position: absolute;
              right: 10px;
              bottom: 15px;
              color: #fc4150;
              width: 20px;
              height: 20px;
              font-size: 25px;
            }
          }
          .first {
            padding-top: 15px;
          }
        }
      }
    }
    .topbar-scroll {
      .top-radius {
        border-radius: 10px;
      }
    }
    // .scroll-box{
    //   width: 100%;
    //   position: absolute;
    //   top: 0;
    //   left: 0;
    //   overflow: hidden;
    // }
  }
}
</style>
