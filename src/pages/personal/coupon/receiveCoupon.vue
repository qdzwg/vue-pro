<template>
    <div class="receiveCoupon">
      
            <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" class="scrollView">
                <div class="item-ul">
                    <div class="item-li boxshadow" v-for="(item,index) in listData" :key="index" style="background: url('http://statics.lotsmall.cn/wx/img/coupons-bg.png') no-repeat;background-size: contain;">
                        <div class="left fl">
                            <div class="name">{{item.name}}</div>
                            <div class="price">
                                <span class="unit">￥</span>
                                <span class="num">{{item.amount}}</span>
                            </div>
                        </div>
                        <div class="right fr">
                            <span class="right-btn" @click="getCoupon(item.code)">立即领取</span>
                        </div>
                        <div class="date-use clearfix">
                            <div class="date">
                                <span class="title">有效期：</span>
                                <span class="text" v-if="item.validityDateType=='relative'">领取后{{item.relativeDay}}天失效</span>
                                <span v-else class="text">{{item.validStartDate}} 至 {{item.validEndDate}}</span>
                            </div>
                            <div class="use">
                                <span class="title">使用条件：</span>
                                <span v-if="item.useThreshold=='F'" class="text">无限制</span>
                                <span v-else class="text">满{{item.targetAmout}}元可用</span>

                            </div>
                        </div>
                    </div>

                </div>
            </mescroll-vue>
    
        <!-- <template v-else>
        <div class="no-data">暂无可领取优惠券</div>
      </template> -->

    </div>
</template>

<script>
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
  components: {
    MescrollVue
  },
  data() {
    return {
      listData: [],
      mescroll: null, // mescroll实例对象
      mescrollDown: {}, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
      mescrollUp: {
        // 上拉加载的配置.
        callback: this.getList, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
        //以下是一些常用的配置,当然不写也可以的.
        page: {
          num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 6 //每页数据条数,默认10
        },
        noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
        htmlNodata: '<p class="upwarp-nodata">加载完成</p>',
        htmlContent:
          '<p class="downwarp-progress"></p><p class="downwarp-tip">下拉刷新 </p>', //布局内容
        empty: {
          tip: "暂无可领取优惠券" //提示
        }
      }
    };
  },
  created() {
      document.title="领取优惠券"
  },
  methods: {
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    //   点击领取
    getCoupon(code) {
      this.getAxios(this.api.main.marketing.getCoupon, {
        userId: localStorage.getItem("xjsc_login_userId_2019_3_8")||this.$cookie.get("leaguerInfoId"),
        couponCode: code
      }).then(res => {
        if (res.status == 200) {
          this.$router.push("/personal/myCoupon");
        } else {
           this.$vux.toast.show({
              type:'cancel',
              text:res.message
          })
        }
      });
    },
    getList(page,mescroll) {
      this.getAxios(this.api.main.marketing.couponsList, {
        currPage: page.num,
        pageSize: page.size
      }).then(res => {
        if (res.status == 200) {
          // 如果是第一页需手动制空列表
          let arr = res.data.rows;
          if (page.num === 1) this.listData = [];
          // 把请求到的数据添加到列表
          this.listData = this.listData.concat(arr);
          // 数据渲染成功后,隐藏下拉刷新的状态
          this.$nextTick(() => {
            mescroll.endSuccess(arr.length);
          });
          //   this.listData = this.listData.concat(res.data.rows);
          res.data.rows.forEach(ele => {
            // ele.validStartDate = ele.validStartDate.substr(0, 10);
            // ele.validEndDate = ele.validEndDate.substr(0, 10);
            ele.amount = ele.amount >= 1 ? ele.amount.toFixed(2) : ele.amount;
          });
        } else {
          // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          mescroll.endErr();
        }
      });
    }
  }
};
</script>

<style lang="scss">
.receiveCoupon {
  width: 100%;
//   height: 100%;
  .mescroll {
    position: fixed;
    // padding-bottom: 1rem;
    top: 0;
    bottom: 0;
    height: auto;
  }
  .no-data {
    padding-top: 10px;
    text-align: center;
    font-size: 14px;
    color: #999;
  }
  .item-ul {
    margin-top: 10px;
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
      }
    }
  }
}
</style>
