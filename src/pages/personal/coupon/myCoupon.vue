<template>
    <div class="cash-warper">
        <div>
            <div class="topShadow"></div>
            <div class='state-ul bg-w boxshadow m-b-10'>
                <div class="state-li" :class='{active:currentindex=="0"}' @click="select('waitpay',0)">
                    <div class="state-title">可用优惠券</div>
                </div>
                <div class="state-li" :class='{active:currentindex=="1"}' @click="select('all',1)">
                    <div class="state-title">全部优惠券</div>
                </div>
            </div>
            <swiper v-model="currentindex" ref="swiper" :show-dots="false" class="state-content" @on-index-change="switchTab">
                <swiper-item >
                    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" class="scrollView">
                        <template v-if='waitpay.length>0'>
                            <div class="content-item">
                                <div class="item-ul" v-for="(item,index) in waitpay" :key='index'>
                                    <div v-if="item.status=='1'" class="item-li boxshadow" style="background: url('http://statics.lotsmall.cn/wx/img/coupons-bg.png') no-repeat;background-size: contain;">
                                        <div class="left fl">
                                            <div class="name">{{item.name}}</div>
                                            <div class="price">
                                                <span class="unit">￥</span>
                                                <span class="num">{{item.amount}}</span>
                                            </div>

                                        </div>
                                        <div class="right fr">
                                            <span v-if="item.unabledtouse=='T'" class="right-btn-grey">立即使用</span>
                                            <span v-else class="right-btn" @click="jumpDetail(item)">立即使用</span>
                                        </div>
                                        <div class="date-use clearfix">
                                            <div class="date">
                                                <span class="title">有效期：</span>
                                                <span class="text">{{item.validStartDate}} 至 {{item.validEndDate}}</span>
                                            </div>
                                            <div class="use">
                                                <span class="title">使用条件：</span>
                                                <span v-if="item.useThreshold=='F'" class="text">无限制</span>
                                                <span v-else class="text">满{{item.targetAmout}}元可用</span>

                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="item.status=='2'||item.status=='3'" class="item-li boxshadow" style="background: url('http://statics.lotsmall.cn/wx/img/nocoupon-bg.png') no-repeat;background-size: contain;">
                                        <div class="left fl">
                                            <div class="name">{{item.name}}</div>
                                            <div class="price">
                                                <span class="unit">￥</span>
                                                <span class="num">{{item.amount}}</span>
                                            </div>

                                        </div>
                                        <div class="right fr">
                                            <span v-if="item.status=='3'" class="right-btn btn-outofdate ">已过期</span>
                                            <span v-if="item.status=='2'" class="right-btn btn-used ">已使用</span>
                                        </div>
                                        <div class="date-use clearfix">
                                            <div class="date">
                                                <span class="title">有效期：</span>
                                                <span class="text">{{item.validStartDate}} 至 {{item.validEndDate}}</span>
                                            </div>
                                            <div class="use">
                                                <span class="title">使用条件：</span>
                                                <span v-if="item.useThreshold=='F'" class="text">无限制</span>
                                                <span v-else class="text">满{{item.targetAmout}}元可用</span>

                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </template>

                        <template v-else>
                            <div class="noData">
                                暂无可用优惠券
                            </div>
                        </template>
                    </mescroll-vue>
                </swiper-item>

                <swiper-item v-model="currentindex">
                    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" class="scrollView">
                        <template v-if="all.length > 0">
                            <div class="content-item">
                                <div class="item-ul" v-for="(el,i) in all" :key='i'>
                                    <div v-if="el.status=='1'" class="item-li boxshadow" style="background: url('http://statics.lotsmall.cn/wx/img/coupons-bg.png') no-repeat;background-size: contain;">
                                        <div class="left fl">
                                            <div class="name">{{el.name}}</div>
                                            <div class="price">
                                                <span class="unit">￥</span>
                                                <span class="num">{{el.amount}}</span>
                                            </div>

                                        </div>
                                        <div class="right fr">
                                            <span class="right-btn" @click="jumpDetail(el)">立即使用</span>
                                        </div>
                                        <div class="date-use clearfix">
                                            <div class="date">
                                                <span class="title">有效期：</span>
                                                <span class="text">{{el.validStartDate}} 至 {{el.validEndDate}}</span>
                                            </div>
                                            <div class="use">
                                                <span class="title">使用条件：</span>
                                                <span v-if="el.useThreshold=='F'" class="text">无限制</span>
                                                <span v-else class="text">满{{el.targetAmout}}元可用</span>

                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="el.status=='2'||el.status=='3'" class="item-li boxshadow" style="background: url('http://statics.lotsmall.cn/wx/img/nocoupon-bg.png') no-repeat;background-size: contain;">
                                        <div class="left fl">
                                            <div class="name">{{el.name}}</div>
                                            <div class="price">
                                                <span class="unit">￥</span>
                                                <span class="num">{{el.amount}}</span>
                                            </div>

                                        </div>
                                        <div class="right fr">
                                            <span v-if="el.status=='3'" class="right-btn btn-outofdate ">已过期</span>
                                            <span v-if="el.status=='2'" class="right-btn btn-used ">已使用</span>
                                        </div>
                                        <div class="date-use clearfix">
                                            <div class="date">
                                                <span class="title">有效期：</span>
                                                <span class="text">{{el.validStartDate}} 至 {{el.validEndDate}}</span>
                                            </div>
                                            <div class="use">
                                                <span class="title">使用条件：</span>
                                                <span v-if="el.useThreshold=='F'" class="text">无限制</span>
                                                <span v-else class="text">满{{el.targetAmout}}元可用</span>

                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </template>
                        <template v-else>
                            <div class="noData">
                                暂无优惠券
                            </div>
                        </template>
                    </mescroll-vue>
                </swiper-item>
            </swiper>
        </div>
    </div>
</template>

<script>
import { Swiper, SwiperItem } from "vux";
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
  components: {
    Swiper,
    SwiperItem,
    MescrollVue
  },
  data() {
    return {
      activestate: "waitpay",
      listData: [],
      currentindex: 0,
      swiperHeight: null,
      waitpay: [],
      all: [],
      use: [],
      currPage: 1,
      totalPage: 0,
      mescroll: null, // mescroll实例对象
      mescrollDown: {}, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
      mescrollUp: {
        // 上拉加载的配置.
        callback: this.getupList, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
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
  created() {
      document.title="我的优惠券"
    this.swiperHeight = window.innerHeight - 39 + "px";
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.swiper.xheight = this.swiperHeight;
    });
  },
  methods: {
    switchTab(i) {
      this.currentindex = i;
      if (this.currentindex == 0) {
        this.activestate = "waitpay";
      } else if (this.currentindex == 1) {
        this.activestate = "all";
      }
      this.select(this.activestate, this.currentindex);
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    getupList(page, mescroll) {
      let arr = [];
      this.getAxios(this.api.main.marketing.myCoupons, {
        userId: localStorage.getItem("xjsc_login_userId_2019_3_8")||this.$cookie.get("leaguerInfoId"),
        currPage: page.num,
        pageSize: page.size,
        status: this.activestate == "all" ? "" : 1
      }).then(res => {
        if (res.status == 200) {
          this.listData = res.data.rows;
          this.listData = this.listData.concat(this.listData);
          if (this.activestate == "waitpay" && this.currentindex == 0) {
            res.data.rows.forEach(item => {
              if (item.status == "1") {
                // item.validStartDate = item.validStartDate.substr(0, 10);
                // item.validEndDate = item.validEndDate.substr(0, 10);
                item.amount =
                  item.amount >= 1 ? item.amount.toFixed(2) : item.amount;
                if (item.productInfos && item.productInfos.length == 1) {
                  if (
                    !item.productInfos[0].productId ||
                    !item.productInfos[0].productCode ||
                    !item.productInfos[0].type
                  ) {
                    item.unabledtouse = "T";
                  }
                }
                arr.push(item);
              }
            });

            this.waitpay = arr;

            // console.log(this.waitpay);
          }

          if (this.activestate == "all" && this.currentindex == 1) {
            res.data.rows.forEach(item => {
              // item.validStartDate = item.validStartDate.substr(0, 10);
              // item.validEndDate = item.validEndDate.substr(0, 10);
              item.amount =
                item.amount >= 1 ? item.amount.toFixed(2) : item.amount;
              arr.push(item);
            });
            this.all = arr;
          }
          this.$nextTick(() => {
            mescroll.endSuccess(arr.length);
          });
        }
      });
    },
    select(state, index) {
      this.activestate = state;
      this.currentindex = index;
      this.mescroll.scrollTo(0, 0);
      this.getupList(
        { num: 1, size: this.mescrollUp.page.size },
        this.mescroll
      );
    },

    getList() {},
    gotoGame(path) {
      this.reLaunchPageTo(this.router + path);
    },
    jumpDetail(obj) {
      // console.log(obj.applyType);
      switch (obj.applyType) {
        case "all":
          wx.switchTab({
            url: this.router + "pages/index/main"
          });
          break;
        case "type":
          let goType = obj.useProductType.split(",");
          // console.log(goType[0]);
          if (goType && goType.length == 1) {
            switch (goType[0]) {
              case "park":
                this.navigatePageTo(this.router + "pages/scenic/list/main");
                break;
              case "hotel":
                this.navigatePageTo(this.router + "pages/hotel/list/main");
                break;
              case "mdse":
                this.navigatePageTo(this.router + "pages/goods/list/main");
                break;
            }
          } else {
            wx.switchTab({
              url: this.router + "pages/index/main"
            });
          }
          break;
        case "used":
          if (obj.productInfos) {
            if (obj.productInfos.length > 1) {
              wx.switchTab({
                url: this.router + "pages/index/main"
              });
            } else {
              switch (obj.productInfos[0].type) {
                case "park":
                  this.navigatePageTo(
                    this.router +
                      "pages/scenic/detail/main?id=" +
                      obj.productInfos[0].productId +
                      "&productCode=" +
                      obj.productInfos[0].productCode
                  );
                  break;
                case "hotel":
                  this.navigatePageTo(
                    this.router +
                      "pages/hotel/detail/main?id=" +
                      obj.productInfos[0].productId +
                      "&productCode=" +
                      obj.productInfos[0].productCode
                  );
                  break;
                case "mdse":
                  this.navigatePageTo(
                    this.router +
                      "pages/goods/detail/main?id=" +
                      obj.productInfos[0].productId +
                      "&code=" +
                      obj.productInfos[0].productCode
                  );
                  break;
              }
            }
          } else {
            wx.switchTab({
              url: this.router + "pages/index/main"
            });
          }
          break;
      }
    }
  }
};
</script>

<style lang="scss">
.cash-warper {
  width: 100%;
  .topShadow {
    width: 100%;
    height: 0.5px;
    background-color: rgba(146, 144, 144, 0.2);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
  }
  .state-ul {
    display: flex;
    justify-content: space-around;
    font-size: 14px;
    color: #999999;
    font-family: PingFangSC-Medium, sans-serif;
    .state-li {
      .state-title {
        padding: 10px 45px;
      }
    }
    .state-li.active {
      color: #f05b47;
      position: relative;
    }
    .state-li.active::after {
      content: "";
      display: block;
      height: 2px;
      width: 100%;
      background: #f05b47;
      position: absolute;
      bottom: 0;
      border-radius: 1px;
    }
  }
  .state-content {
    height: 100%;
    .mescroll {
      position: fixed;
      // padding-bottom: 1rem;
      top: 0px;
      bottom: 0;
      height: auto;
    }
    .content-item {
      height: 100%;
      .item-ul {
        padding: 0 13.5px;
        .item-li {
          margin-bottom: 20px;
          height: 139px;
          position: relative;
          .left {
            display: inline-block;
            width: 237px;
            .name {
              margin-top: 7px;
              color: #fff;
              font-size: 14px;
              font-family: PingFangSC-Medium, sans-serif;
              padding-left: 14px;
              overflow: hidden; //超出一行文字自动隐藏
              text-overflow: ellipsis; //文字隐藏后添加省略号
              white-space: nowrap; //强制不换行
            }
            .price {
              color: #fff;
              margin-top: 6px;
              margin-bottom: 9px;
              padding-left: 40px;
              font-family: PingFangSC-Semibold, sans-serif;
              .unit {
                font-size: 18px;
              }
              .num {
                font-size: 35px;
              }
            }
          }
          .date-use {
            position: absolute;
            left: 15px;
            bottom: 5px;
            font-size: 9px;
            color: #fff;
            font-family: PingFangSC-Semibold, sans-serif;
            .date {
              //   margin-bottom: 2.5px;
            }
            .use {
              //   margin-bottom: 5px;
            }
          }
          .right {
            margin-top: 44px;
            margin-right: 20px;
            text-align: center;
            .right-btn {
              border-radius: 2px;
              background: #fff;
              font-size: 14px;
              color: #f05b47;
              padding: 6px 9px;
              font-family: PingFangSC-Medium, sans-serif;
            }
            .right-btn-grey {
              border-radius: 2px;
              background: #ccc;
              font-size: 14px;
              color: #fff;
              padding: 6px 9px;
              font-family: PingFangSC-Medium, sans-serif;
            }
            .btn-outofdate {
              color: #999999;
            }
            .btn-used {
              color: #28a6a6;
            }
          }
        }
      }
    }
  }
}
</style>
