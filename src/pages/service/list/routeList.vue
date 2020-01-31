<template>
  <div class="list-warper-route">
    <!-- <x-header>门票列表</x-header> -->
    <!-- <page-header  title="票型列表"></page-header> -->
    <div class="search-warper">
      <input v-model="searchword"
             class="search-input"
             placeholder="搜索"
             type="text"
             @keyup.enter="search">
      <i @click="search"
         class="xx-icon icon-ico-search search-icon"></i>
    </div>
    <mescroll-vue ref="mescroll"
                  :down="mescrollDown"
                  :up="mescrollUp"
                  @init="mescrollInit"
                  class="scrollView">
      <div class="good-list">
        <div @click="godetail(item)"
             v-for="(item,index) in dataList"
             :key="index"
             class="good-item clearfix">
          <img class="fl good-img"
               :src="item.linkMobileImg +'?imageMogr2/thumbnail/640x/strip/quality/100'"
               alt>
          <div class="good-detail">
            <div class="good-title">{{item.nickName}} 【{{item.subtitle}}】</div>
            <div class="good-theme">
              <!-- <span class="theme-label" v-show="item.lineTheme">{{item.lineTheme}}</span> -->
              <span v-for="(theme,inde) in item.lineTheme"
                    v-show="item.lineTheme.length"
                    :key="inde"
                    class="theme-label">{{theme}}</span>
            </div>
            <div class="good-sell">
              <div class="buy-num">
                <span>{{item.begAddress}}出发</span>
                <span>{{item.useDay}}天{{item.useNight}}夜</span>
              </div>
              <div class="price-num">
                <span class="unit">￥</span>
                <span class="price">{{item.priceShow}}<span class="unit">起/人</span></span>
                <!-- <span style="color:#999">起</span> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </mescroll-vue>
  </div>
</template>

<script>
// import pageHeader from "@/components/header";
import MescrollVue from "mescroll.js/mescroll.vue";
import { XHeader, XInput } from "vux";
export default {
  components: {
    MescrollVue,
    XHeader,
    XInput
    // pageHeader
  },
  created () {
    document.title = "跟团游列表";
    // console.log(this.$route)
  },
  data () {
    return {
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
        }
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
      this.$router.push("/detail/router?id=" + item.id + "&productCode=" + item.productCode);
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
      this.getAxios("/merchant/api/merchantRouteInfo/merchantRouteInfoGrid", {
        currPage: page.num,
        pageSize: page.size,
        modelName: this.keyword
      })
        .then(response => {
          // console.log(response);
          // 请求的列表数据
          let arr = response.data.rows;
          // console.log(arr.length);
          arr.map(item => {
            item.lineTheme = item.lineTheme ? item.lineTheme.split(',') : [];
          })
          // 如果是第一页需手动制空列表
          if (page.num === 1) this.dataList = [];
          // 把请求到的数据添加到列表
          this.dataList = this.dataList.concat(arr);
          // 数据渲染成功后,隐藏下拉刷新的状态
          this.$nextTick(() => {
            if(this.dataList.length>=response.data.total){
              mescroll.endSuccess(0);
            }else{
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
@import "../../../assets/styles/mixin.scss";
.list-warper-route {
  // padding-top: 49px;
  .mescroll {
    position: fixed;
    // padding-bottom: 1rem;
    top: 58px;
    bottom: 0;
    height: auto;
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
      padding: 0 5px;
      outline: none;
      border: none;
      width: calc(100% - 10px);
      height: 34px;
      border-radius: 2px;
    }
    ::-webkit-input-placeholder {
      text-align: center;
    }
    :-moz-placeholder {
      /* Firefox 18- */
      text-align: center;
      color: #999;
      font-size: 13px;
    }
    ::-moz-placeholder {
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
      background: #fff;
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0;
      }
      .good-img {
        width: 156px;
        height: 100px;
      }
      .good-detail {
        margin-left: 156px;
        height: 93px;
        width: calc(100% - 156px);
        padding-top: 7px;
        position: relative;
        .good-title {
          font-size: 16px;
          color: #413838;
          padding-left: 12px;
          padding-right: 9px;
          word-break: break-all;
          -webkit-line-clamp: 2;
          /* ! autoprefixer: off */
          -webkit-box-orient: vertical;
          /* autoprefixer: on */
          display: -webkit-box;
          overflow: hidden;
          @include oh(2);
          line-height: 18px;
        }
        .good-theme {
          font-size: 10px;
          padding-top: 5px;
          padding-left: 12px;
          padding-right: 9px;
          .theme-label {
            margin-right: 2px;
            display: inline-block;
            border: 1px solid #d4e7fe;
            color: #2988fb;
            border-radius: 2px;
            padding: 0px 4px;
            line-height: 15px;
          }
        }
        .good-sell {
          padding-left: 12px;
          padding-right: 9px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          .buy-num {
            font-size: 10px;
            color: #999;
            max-width: 110px;
          }
          .price-num {
            color: #f05b47;
            .price {
              font-size: 18px;
            }
            .unit {
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}
</style>
