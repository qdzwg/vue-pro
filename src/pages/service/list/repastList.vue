<template>
  <div class="list-warper-repast">
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
        <div v-for="(item,index) in dataList"
             :key="index"
             class="good-item clearfix"
             @click="godetail(item)">
          <img class="fl good-img"
               :src="item.linkMobileImg +'?imageMogr2/thumbnail/640x/strip/quality/100'"
               alt>
          <div class="good-detail">
            <div class="good-title">{{item.name}}</div>
            <div class="repast-label"
                 v-if="item.labels&&item.labels.length>0">
              <span v-for="(ele, i) in item.labels"
                    :key="i"
                    :class="'repast-label'+i">
                {{ele}}
              </span>
            </div>
            <!-- <div class="good-distance">
              <span class="xx-icon icon-shouhuodizhi"></span>
              <span>{{item.addr}}</span>
            </div> -->
            <div class="good-sell">
              <div class="buy-num">{{item.tradingArea}}</div>
              <div class="price-num">
                <span style="color:#999; font-size:12px">人均：</span>
                <span class="unit">￥</span>
                <span class="price">{{item.priceShow}}</span>

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
    document.title = "餐饮列表";
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
      this.$router.push("/detail/repast?id=" + item.id + "&productCode=" + item.productCode);
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
      this.getAxios("/merchant/api/merchantRepastEatery/merchantRepastEateryGrid", {
        currPage: page.num,
        pageSize: page.size,
        modelName: this.keyword
      })
        .then(response => {
          // console.log(response);
          // 请求的列表数据
          let arr = response.data.rows;
          arr.forEach((item, index) => {
            if (item.labels && item.labels != '') {
              arr[index].labels = item.labels.split(',');
            }
          })
          // console.log(arr.length);
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
.list-warper-repast {
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
          display: -webkit-box;
          -webkit-line-clamp: 2;
          /* ! autoprefixer: off */
          -webkit-box-orient: vertical;
          /* autoprefixer: on */
          overflow: hidden;
          line-height: 18px;
        }
        .repast-label {
          padding-left: 0.32rem;
          margin-top: 0.15rem;
          margin-left: -0.1rem;
          span {
            border-radius: 0.1rem;
            padding: 0 4px;
            margin: 0 2px;
          }
          .repast-label0 {
            color: #5e99ff;
            border: 1px solid #5e99ff;
          }
          .repast-label1 {
            color: #00aea8;
            border: 1px solid #00aea8;
          }
          .repast-label2 {
            color: #00b7ee;
            border: 1px solid #00b7ee;
          }
          .repast-label3 {
            color: #f05b47;
            border: 1px solid #f05b47;
          }
        }
        .good-distance {
          color: #f05b47;
          font-size: 10px;
          padding-left: 12px;
          padding-right: 9px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
        }
        .good-sell {
          position: absolute;
          bottom: 6px;
          left: 0;
          padding-left: 12px;
          padding-right: 2px;
          overflow: hidden;
          // width: 100%;
          width: calc(100% - 14px);
          display: flex;
          // justify-content: space-between;
          // align-items: flex-end;
          .buy-num {
            font-size: 10px;
            color: #999;
            width: 40%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            float: left;
            height: 24px;
            font-size: 12px;
            line-height: 24px;
          }
          .price-num {
            color: #f05b47;
            float: left;
            width: 60%;
            // text-align: right;
            height: 24px;
            line-height: 24px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            .unit {
              font-size: 12px;
            }
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
