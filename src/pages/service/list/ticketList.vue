<template>
  <div class="list-warper-ticket">
    <!-- <x-header>门票列表</x-header> -->
    <!-- <page-header  title="票型列表"></page-header> -->
    <div class="search-warper">
      <input v-model="searchword"
             class="search-input"
             placeholder="搜索"
             type="text"
             @keyup.enter="search" />
      <i @click="search"
         class="xx-icon icon-ico-search search-icon"></i>
    </div>
    <mescroll-vue ref="mescroll"
                  :down="mescrollDown"
                  :up="mescrollUp"
                  @init="mescrollInit"
                  class="scrollView"
                  :class="{'footer-waprper':footerShow}">
      <div class="good-list">
        <div v-for="(item,index) in dataList"
             :key="index"
             @click="godetail(item)"
             class="good-item">
          <div class="good-img">
            <img :src="item.linkMobileImg + '?imageMogr2/thumbnail/640x/strip/quality/100'"
                 alt="暂无图片信息" />
          </div>
          <div class="good-detail">
            <h4 class="good-title">{{item.nickName}}</h4>
            <div class="good-distance">
              <span class="xx-icon icon-shouhuodizhi"></span>
              <span>{{item.areaAddr}}</span>
            </div>
            <div class="promote-amount"
                 v-if="openSingle==='T'&&item.hasOwnProperty('earning')">
              <span class="promote-icon">赚</span>
              <span class="money">{{item.earning}} 元起</span>
            </div>
            <div class="good-sell">
              <div class="buy-num">{{item.virtualSale + item.salesNum}}人已购买</div>
              <div class="price-num">
                <span class="unit">￥</span>
                <span class="price">{{item.priceShow}}</span>
                <span style="color:#999">起</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </mescroll-vue>
    <page-footer v-if="footerShow"
                 :pageData="footerData"></page-footer>
  </div>
</template>

<script>
// import pageHeader from "@/components/header";
import MescrollVue from "mescroll.js/mescroll.vue";
import { XHeader, XInput } from "vux";
import pageFooter from "@/components/custompage/footer.vue";
import { isWxAli } from "@/common/common";
import { wxShare } from "@/common/wxshare";
export default {
  components: {
    pageFooter,
    MescrollVue,
    XHeader,
    XInput
    // pageHeader
  },
  created () {
    let _this = this;
    document.title = "景区列表";
    this.getAxios(this.api.aiPapi.getUsePage, {
      pageType: "navigationPage",
      useRange: "wap"
    }).then(res => {
      if (res.data && res.data.content) {
        let data = JSON.parse(res.data.content);
        //判断首页是否存在底部导航
        // console.log(1)
        // this.bootomFooterShow =
        //   this.newCustomFooteerData.range.indexOf("homepage") > -1;

        if (data.list && data.list.length) {
          this.footerShow = true;
          this.footerData = data;
        }
      }
    });
    this.getSingleAxios()
      .then(res => {
        if (res.status === 200) {
          this.openSingle = res.data.openSingle;
        } else {
          this.openSingle = "F";
        }
      })
      .catch(err => {
        this.openSingle = "F";
      });
    // //设置分享信息
    // let isWx = isWxAli().isWx;
    // console.log(isWx);
    // if (isWx) {
    //   var curURL = encodeURI(window.location.href.split("#")[0]);
    //   var shareObj = {
    //     title: "酒店列表",
    //     desc: "",
    //     link: window.location.href,
    //     imgUrl: ""
    //   };
    //   // 微信授权
    //   this.getAxios(
    //     "/merchant/api/merchantInfo/getWxSignature?url=" + curURL
    //   ).then(res => {
    //     let data = res.data;
    //     wx.config({
    //       debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    //       appId: data.appid, // 必填，公众号的唯一标识
    //       timestamp: data.timestamp, // 必填，生成签名的时间戳
    //       nonceStr: data.nonceStr, // 必填，生成签名的随机串
    //       signature: data.signature, // 必填，签名，见附录1
    //       jsApiList: [
    //         "onMenuShareTimeline",
    //         "onMenuShareAppMessage",
    //         "onMenuShareQQ",
    //         "onMenuShareQZone"
    //       ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    //     });

    //     wx.ready(function() {
    //       //分享给朋友
    //       _this.getAxios("/merchant/api/merchantInfo/getMerchantInfoById").then(
    //         res => {
    //           shareObj.desc = res.data.briefIntroduction?res.data.briefIntroduction:'';
    //           // shareObj.link =
    //           shareObj.imgUrl = res.data.logoAddr?res.data.logoAddr:'';

    //           wx.onMenuShareAppMessage({
    //             title: shareObj.title, // 分享标题
    //             desc: shareObj.desc, // 分享描述
    //             link: shareObj.link, // 分享链接
    //             imgUrl: shareObj.imgUrl, // 分享图标
    //             type: "", // 分享类型,music、video或link，不填默认为link
    //             dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
    //             success: function() {
    //               // shareCallback(location.href.split("#")[0]);
    //               // 用户确认分享后执行的回调函数
    //             },
    //             cancel: function() {
    //               // 用户取消分享后执行的回调函数
    //             }
    //           });

    //           //分享到朋友圈
    //           wx.onMenuShareTimeline({
    //             title: shareObj.title, // 分享标题
    //             desc: shareObj.desc, // 分享描述
    //             link: shareObj.link, // 分享链接
    //             imgUrl: shareObj.imgUrl, // 分享图标
    //             success: function() {
    //               // 用户确认分享后执行的回调函数
    //               // shareCallback(location.href.split("#")[0]);
    //             },
    //             cancel: function() {
    //               // 用户取消分享后执行的回调函数
    //             }
    //           });

    //           //分享到QQ
    //           wx.onMenuShareQQ({
    //             title: shareObj.title, // 分享标题
    //             desc: shareObj.desc, // 分享描述
    //             link: shareObj.link, // 分享链接
    //             imgUrl: shareObj.imgUrl, // 分享图标
    //             success: function() {
    //               // shareCallback(location.href.split("#")[0]);
    //               // 用户确认分享后执行的回调函数
    //             },
    //             cancel: function() {
    //               // 用户取消分享后执行的回调函数
    //             }
    //           });
    //           //分享到QQ空间
    //           wx.onMenuShareQZone({
    //             title: shareObj.title, // 分享标题
    //             desc: shareObj.desc, // 分享描述
    //             link: shareObj.link, // 分享链接
    //             imgUrl: shareObj.imgUrl, // 分享图标
    //             success: function() {
    //               // shareCallback(location.href.split("#")[0]);
    //               // 用户确认分享后执行的回调函数
    //             },
    //             cancel: function() {
    //               // 用户取消分享后执行的回调函数
    //             }
    //           });
    //         }
    //       );
    //     });
    //   });
    // }
  },
  data () {
    return {
      footerData: {},
      footerShow: false,
      searchword: "",
      keyword: "",
      dataList: [],
      mescroll: null, // mescroll实例对象
      mescrollDown: {}, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
      mescrollUp: {
        // 上拉加载的配置.
        callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
        //以下是一些常用的配置,当然不写也可以的.
        page: {
          num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 6 //每页数据条数,默认10
        },
        noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
        // toTop: {
        //   //回到顶部按钮
        //   src: "http://statics.lotsmall.cn/image/20181219/20181219111919wvv3zy.jpeg", //图片路径,默认null,支持网络图
        //   offset: 1000 //列表滚动1000px才显示回到顶部按钮
        // },
        htmlNodata: '<p class="upwarp-nodata">加载完成</p>',
        htmlContent:
          '<p class="downwarp-progress"></p><p class="downwarp-tip">下拉刷新 </p>', //布局内容
        empty: {
          //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          // warpId: "xxid", //父布局的id (1.3.5版本支持传入dom元素)
          // icon: "./static/mescroll/mescroll-empty.png", //图标,默认null,支持网络图
          tip: "暂无相关数据" //提示
        },
        openSingle: "F"
      }
    };
  },
  beforeRouteEnter (to, from, next) {
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
    next(vm => {
      vm.$refs.mescroll.beforeRouteEnter(); // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
    });
  },
  beforeRouteLeave (to, from, next) {
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
    this.$refs.mescroll.beforeRouteLeave(); // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
    next();
  },
  methods: {
    godetail (item) {
      let url = "/detail/ticket?id=" + item.id;
      if (this.$route.query.spread_code || this.$route.query.promoteCode) {
        //如果有推广码
        url +=
          "&spread_code=" + this.$route.query.spread_code ||
          this.$route.query.promoteCode;
      }
      if (this.$route.query.isSpecial) {
        url += "&isSpecial=" + this.$route.query.isSpecial;
      }
      this.$router.push(url);
    },
    search () {
      this.keyword = this.searchword;
      //滚动到顶部
      this.mescroll.scrollTo(0, 0);
      this.upCallback(
        { num: 1, size: this.mescrollUp.page.size },
        this.mescroll
      );
    },
    mescrollInit (mescroll) {
      this.mescroll = mescroll;
    },
    upCallback (page, mescroll) {
      this.getAxios("/merchant/api/merchantParkInfo/merchantParkInfoGrid", {
        currPage: page.num,
        pageSize: page.size,
        modelName: this.keyword
      })
        .then(response => {
          // console.log(response);
          // 请求的列表数据
          let arr = response.data.rows;
          // console.log(arr.length);
          // 如果是第一页需手动制空列表
          if (page.num === 1) {
            this.dataList = [];
            if (arr.length) {
              //存在数据
              wxShare({
                title: "景区列表",
                desc: "",
                imgUrl: arr[0].linkMobileImg ? arr[0].linkMobileImg : ""
              });
            } else {
              wxShare({
                title: "景区列表",
                desc: "",
                imgUrl: ""
              });
            }
          }
          // 把请求到的数据添加到列表
          this.dataList = this.dataList.concat(arr);
          // 数据渲染成功后,隐藏下拉刷新的状态
          this.$nextTick(() => {
            if (this.dataList.length >= response.data.total) {
              mescroll.endSuccess(0);
            } else {
              mescroll.endSuccess(arr.length);
            }
          });
        })
        .catch(e => {
          // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          mescroll.endErr();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.list-warper-ticket {
  // padding-top: 49px;
  .mescroll {
    position: fixed;
    // padding-bottom: 1rem;
    top: 58px;
    bottom: 0;
    height: auto;
    &.footer-waprper {
      bottom: 59px;
    }
  }
  .search-warper {
    background: #f7f7f7;
    padding: 13px 8px;
    position: relative;
    .search-icon {
      position: absolute;
      font-size: 18px;
      top: 18px;
      right: 15.5px;
      color: #c4c4c4;
    }
    .search-input {
      font-size: 14px;
      padding: 0 5px;
      outline: none;
      border: none;
      width: calc(100% - 10px);
      height: 34px;
      border-radius: 2px;
    }
    .search-input::-webkit-input-placeholder {
      text-align: center;
      font-size: 13px;
    }
    .search-input:-moz-placeholder {
      /* Firefox 18- */
      text-align: center;
      color: #999;
      font-size: 13px;
    }
    .search-input::-moz-placeholder {
      text-align: center;
      /* Firefox 19+ */
      color: #999;
      font-size: 13px;
    }
    :-ms-input-placeholder {
      text-align: center;
      color: #999;
      font-size: 13px;
    }
  }
  .good-list {
    .good-item {
      display: flex;
      background: #fff;
      margin-bottom: 10px;
      height: 115px;
      &:last-child {
        margin-bottom: 0;
      }
      .good-img {
        width: 134px;
        height: 115px;
        img {
          width: 134px;
          height: 115px;
        }
      }
      .good-detail {
        flex: 1;
        padding-top: 10px;
        padding: 6px 9px 0 12px;
        overflow: hidden;
        // margin-left: 156px;
        // height: 93px;
        // width: calc(100% - 156px);
        // padding-top: 7px;
        // position: relative;
        .good-title {
          font-size: 15px;
          line-height: 23px;
          color: #413838;
          // word-break: break-all;
          // display: -webkit-box;
          // -webkit-line-clamp: 2;
          /* ! autoprefixer: off */
          // -webkit-box-orient: vertical;
          /* autoprefixer: on */
          // margin-bottom: 8px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-weight: bold;
        }
        .good-distance {
          color: #f05b47;
          font-size: 10px;
          padding-right: 9px;
          display: -webkit-box;
          margin-bottom: 7px;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          .xx-icon {
            font-size: 12px;
          }
        }
        .promote-amount {
          height: 21px;
          line-height: 21px;
          display: flex;
          margin-bottom: 2px;
          .promote-icon {
            font-size: 13px;
            width: 25px;
            border-radius: 4px;
            background-color: #f5523e;
            text-align: center;
            line-height: 21px;
            color: #fff;
          }
          .money {
            font-size: 12px;
            color: #f5523e;
            margin-left: 7px;
          }
        }
        .good-sell {
          // position: absolute;
          // bottom: 7px;
          // left: 0;
          // width: calc(100% - 21px);
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          .buy-num {
            font-size: 10px;
            color: #999;
            margin-bottom: 2px;
          }
          .price-num {
            color: #f05b47;
            .price {
              font-size: 18px;
            }
          }
        }
      }
    }
  }
}
</style>
