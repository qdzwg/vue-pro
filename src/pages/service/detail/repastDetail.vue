<template>
  <div class="repast-detail">
    <swiper v-if="imgUrls.length"
            auto
            loop
            :interval="2000"
            height="5.906667rem"
            class="text-scroll"
            dots-position="center">
      <swiper-item v-for="(imgUrl,index) in imgUrls"
                   :key="index">
        <img style="width:100%;height:100%"
             :src="imgUrl + '?imageMogr2/thumbnail/640x/strip/quality/100'"
             alt>
      </swiper-item>
    </swiper>
    <div class="ticket-n-intro">
      <div class="ticket-l">
        <h3 class="ticket-name">{{detailData.name}}</h3>
        <h5 class="ticket-subtitle">{{detailData.summary}}</h5>
        <div class="ticket-price clearfix">
          <div class="adv-box fl">
            <span class="min-text">人均：</span>
            <span class="unit">￥</span>
            <span class="price">{{detailData.priceShow}}</span>
          </div>
          <div class="labels-box"
               v-if="labelArr&&labelArr.length>0">
            <span v-for="(item, index) in labelArr"
                  :key="index"
                  class="label"
                  :class="'label'+index">
              {{item}}
            </span>
          </div>
          <!-- <div class="sale-box fr">
            已售：66
          </div> -->
          <!-- <span class="t-l-price">45000</span> -->
        </div>
        <div @click="goNotice"
             class="order-t-n">购买须知</div>
      </div>
      <!-- <div class="ticket-r">
        <img class="ticket-r-img" src="http://statics.lotsmall.cn/wx/img/icon-location.png" alt>
      </div> -->
    </div>
    <div class="buy-time">
      <div class="buy-time-box">
        <i class="xx-icon icon-nav-home"></i>
        <span>营业中</span>
        <em>|</em>
        <span>{{detailData.businessHours}}</span>
      </div>
    </div>
    <div class="repast-addr"
         @click="openMap(detailData.latitudeLongitude, detailData.addr)">
      <i class="xx-icon icon-shouhuodizhi"></i>
      <span>{{detailData.addr}}</span>
    </div>
    <div class="repast-px">
      <div class="repast-px-ul"
           v-if="itemData.length>0">
        <div class="repast-px-li clearfix"
             v-for="(item, index) in itemData"
             :key="index">
          <img :src='item.thumbnail'
               alt="">
          <div class="repast-li-main">
            <h1 class="repast-title">{{item.alias}}</h1>
            <p class="repast-time"
               v-if="item.useDay&&item.useDay!=''">使用日期：{{item.useDay}}</p>
            <p class="repast-time"
               v-if="(item.checkBegDay&&item.checkBegDay!='')&&(item.checkEndDay&&item.checkEndDay!='')">有效期：{{item.checkBegDay}}~{{item.checkEndDay}}</p>
          </div>
          <div class="buy-box">
            <!-- <a href="" class="buy-btn">购买</a> -->
            <p>
              <span class="buy-btn"
                    @click="goEatery(item.id)"
                    v-if="item.beforeCheckDay=='T'">购买</span>
              <span class="buy-btn buy-close"
                    v-else>停售</span>
            </p>
            <!-- <router-link :to="{name: 'DetailEatery', params:{id:item.id}}" class="buy-btn">购买</router-link> -->
            <p class="saled-text"
               v-if="item.salesNum&&item.salesNum!=''">已售{{item.salesNum}}</p>
          </div>
        </div>

      </div>
    </div>
    <div class="ticket-detail-warpper m-b-10">
      <h2 class="ticket-w-title">餐馆详情</h2>
      <div class="ticket-detail-box">
        <div v-html="scenicDetail"></div>
      </div>
    </div>
    <div class="ticket-detail-warpper m-b-10">
      <h2 class="ticket-w-title">购买须知</h2>
      <div class="ticket-detail-box">
        <div v-html="orderDetail"></div>
      </div>
    </div>
    <div class="ticket-detail-warpper m-b-10">
      <h2 class="ticket-w-title">评论</h2>
      <div v-if="commentData.length"
           class="ticket-detail-box comment-ul">
        <div v-for="(item,index) in commentData"
             :key="index"
             class="comment-li">
          <div class="user-info">
            <div class="img-name">
              <img v-if="item.headImg"
                   class="logo-img"
                   :src="item.headImg"
                   alt>
              <i v-else
                 class="xx-icon icon-member member-svg"></i>
              <span class="name">{{item.userName}}</span>
            </div>
            <span class="comment-time">{{item.createTime}}</span>
          </div>
          <p class="comment-content">{{item.content}}</p>
        </div>
      </div>
      <div v-else
           class="no-comment">暂无评论</div>
    </div>
    <!-- <div class="f-b bottom-warpper">
      <div @click="go('/')" class="home-page">
        <i class="xx-icon icon-shouye"></i>
        <span>首页</span>
      </div>
      <button @click="order" type="button" class="order">立即下单</button>
    </div> -->
    <!-- <popup class="order-pop" v-model="show">
      <div class="order-content">
        <div class="select-ticket-title">
          <span class="select-ticket">请选择餐券</span>
          <i @click="show=false" class="xx-icon icon-guanbi2"></i>          
        </div>
        <div class="px-ul">
          <div v-for="(item,index) in itemData" :key="index" class="px-li-content">
            <div class="px-li">
              <div class="px-li-l">
                <div>
                  <div class="px-name">{{ item.nickName }}</div>
                  <div class="px-price">
                    <span class="unit">￥</span>
                    <span class="price">{{ item.priceSettle }}</span>
                    <span class="last-price">{{ item.priceSettle }}</span>
                  </div>
                </div>
                <div class="px-notice">预订须知</div>
              </div>
              <div class="px-li-r">
                <span class="num">{{item.num}}</span>
                <div class="add-sub">
                  <span
                    @click.stop="sub(index)"
                    class="sub handle-btn"
                    :class="{'no-num':item.num==0}"
                  >-</span>              
                  <span @click.stop="add(index)" class="add handle-btn">+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="px-footer">
          <div class="num-price">
            <div class="select-num">
              <span>已选：</span>
              <span class="num">{{number}}</span>
            </div>
            <div class="price">
              <span class="text">总额：</span>
              <div class="price-info">
                <span class="price-unit">￥</span>
                <span class="price-num">{{totalPrice}}</span>
              </div>
            </div>
          </div>
          <div class="px-next f-b-btn" @click="goOrder" :class="{active:number&&totalPrice}">下一步</div>
        </div>
      </div>
    </popup> -->

    <float-nav></float-nav>
  </div>
</template>

<script>
import floatNav from "@/components/floatNav";
import {
  Swiper,
  SwiperItem,
  Popup,
  Group,
  XDialog
} from "vux";
export default {
  components: {
    floatNav,
    Swiper,
    SwiperItem,
    Popup,
    Group,
    XDialog
  },
  data () {
    return {
      number: 0,
      noticeStr: "",
      noticeShow: false,
      totalPrice: 0,
      isSinglebuy: 1,
      itemData: [],
      show: false,
      wayType: 1,
      detailData: {},
      commentData: {},
      imgUrls: [],
      scenicDetail: "",
      orderDetail: "",
      labelArr: []
    };
  },
  created () {
    document.title = "餐饮详情";
    let _this = this;
    let detailUrl = this.api.repast.detail.main,
      commentUrl = this.api.main.comment.list;
    let pd = this.getAxios(detailUrl, {
      wayType: this.wayType,
      id: this.$route.query.id
    });
    let pc = this.getAxios(commentUrl, {
      wayType: this.wayType,
      productType: "eatery",
      id: this.$route.query.id
    });

    Promise.all([pd, pc])
      .then(result => {
        // console.log(result);
        if (result[0].data.labels && result[0].data.labels != '') {
          _this.labelArr = result[0].data.labels.split(',');
        }
        _this.detailData = result[0].data;
        _this.commentData = result[1].data;
        _this.imgUrls = result[0].data.merchantPictureLibVo.wapUrl
          ? result[0].data.merchantPictureLibVo.wapUrl.split(",")
          : [];

        _this.scenicDetail = result[0].data.content.replace(/<\/?[>]*>/g, "");
        _this.orderDetail = result[0].data.noticeid;
        // result[0].data.merchantRepastCouponVos.forEach((item, index) => {
        //   result[0].data.merchantRepastCouponVos[index].num = 0;
        // });
        _this.itemData = result[0].data.merchantRepastCouponVos;
        // _this.isSinglebuy = result[0].data.orderType;
        result[1].data.forEach(item => {
          var reg = /^(.{1}).*(.{1})$/;
          if (item.isAnonymous == "T") {
            item.userName = item.userName
              ? item.userName.replace(reg, "$1***$2")
              : "";
          }
        });
      })
      .catch(error => { });
  },
  methods: {
    goEatery (id) {
      this.$router.push({ path: '/detail/eatery', query: { id: id } });
    },
    order () {
      // this.checkToken().then(res => {
      //   this.show = true;
      // });
      this.show = true;
    },
    //加减运算
    sub (index) {
      if (this.itemData[index].num > 0) {
        this.itemData[index].num--;
        this.getTotal();
      }
    },
    add (index) {
      this.itemData[index].num++;
      this.getTotal();
    },
    //价格计算
    getTotal () {
      let _this = this,
        sum = 0;
      _this.number = 0;
      _this.itemData.forEach((item, index) => {
        _this.number += item.num;
        sum += item.num * (item.priceSettle * 100);
      });
      _this.totalPrice = (sum / 100).toFixed(2);
      return _this.totalPrice;
    },
    goNotice () {
      this.$router.push({ path: '/detail/ticketNotice', query: { id: this.$route.query.id, productType: 'repast' } });
    },
    //打开地图
    openMap (latlnt, addr) {
      window.location.href = "//uri.amap.com/navigation?to=" + latlnt + "," + addr + "&mode=car&callnative=1";
    }
  }
};
</script>
<style lang="scss">
@import "../../../assets/styles/mixin.scss";

.vux-popup-dialog {
  z-index: 601 !important;
}
.repast-detail {
  // padding-bottom: 49px;
  .notice-body {
    // width: 90%;
    background: #ffffff;
    // border-radius: 2px;
    .notice-title {
      text-align: center;
      color: #413838;
      font-size: 16px;
      // height: 30px;
      // line-height: 30px;
      margin-top: 10px;
    }
    .notice-content {
      padding: 0 10px;
      padding-bottom: 0px;
      max-height: 320px;
      overflow: auto;
      margin: 10px 0;
      text-align: left;
       img {
        width: 100% !important;
        height: auto !important;
      }
      strong,
      b {
        font-weight: bold;
      }
      em,
      i {
        font-style: italic;
      }
    }
    .footer {
      border-top: 0.5px solid #eeeee7;
      @include fbc;
      .no-agree {
        color: #413838;
        font-size: 16px;
        height: 49px;
        line-height: 49px;
        text-align: center;
        width: 50%;
      }
      .agree {
        color: #fff;
        background: #f05b47;
        font-size: 16px;
        height: 49px;
        line-height: 49px;
        text-align: center;
        width: 50%;
      }
    }
  }
  .px-ul {
    background: #fff;
    padding: 15px;
    height: 235px;
    overflow: auto;
    .fsyy-error {
      margin-top: 5px;
      color: #f05b47;
      font-size: 14px;
    }
    .time-list {
      margin-top: 5px;
      .time-item {
        padding: 3px 5px;
        display: inline-block;
        margin-right: 5px;
        border: 1px solid #aaa;
        border-radius: 4px;
        font-size: 14px;
        color: #413838;
        margin-bottom: 5px;
        &.active {
          border-color: #f05b47;
          color: #f05b47;
        }
      }
    }
    .px-li-content {
      margin-bottom: 15px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .px-li {
      @include fbc;

      .px-li-l {
        // margin-right: 15px;
        width: 185px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .px-name {
          @include sc(16px, #413838);
          @include oh(2);
        }
        .px-price {
          .unit {
            @include sc(12px, #f05b47);
          }
          .price {
            @include sc(18px, #f05b47);
          }
          .last-price {
            @include sc(12px, #999);
            text-decoration: line-through;
          }
        }
        .px-notice {
          @include sc(12px, #00699e);
          margin-top: 5px;
        }
      }
      .px-li-r {
        @include fbc;
        .num {
          @include sc(18px, #413838);
          margin-right: 15px;
        }
      }
    }
  }
  .order-pop.vux-popup-dialog {
    z-index: 501 !important;
  }
  .time-select {
    z-index: 601;
    background: #ffffff;
    .handle-box {
      padding: 10px;
      @include fbc;
      .cancel {
        @include sc(16px, #999);
      }
      .sure {
        @include sc(16px, #0ce476);
      }
      .handle-btn {
        padding: 3px 10px;
        border: none;
        background: #fff;
      }
    }
  }
  .time-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 600;
  }
  .order-content {
    height: 370.5px;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    position: relative;
    .px-footer {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      background: #fff;
      @include fbc;
      .num-price {
        margin-left: 15px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .select-num {
          @include sc(13px, #413838);
          height: 12px;
        }
        .price {
          @include sc(13px, #413838);
          .text {
          }
          .price-info {
            display: inline-block;
            .price-unit {
              @include sc(12px, #f05b47);
            }
            .price-num {
              @include sc(18px, #f05b47);
            }
          }
        }
      }
      .px-next {
        width: 50%;
        background: #cbcbcb;
        &.active {
          background: #f05b47;
        }
      }
    }
    .select-ticket-title {
      @include fbc;
      @include sc(18px, #413838);
      height: 56.5px;
      line-height: 56.5px;
      padding-left: 15px;
      .select-ticket-notice {
        color: #999;
        font-size: 14px;
        padding-left: 5px;
        &.active {
          color: #f05b47;
        }
      }
      .icon-guanbi2 {
        @include sc(22px, #b2b2b2);
        padding: 5px 15px 5px 10px;
      }
    }
    .play-date {
      // padding: 1px 0;
      background: #fff;
      .weui-cells {
        margin-top: 0;
        .select-play-date {
          .weui-cell {
            .vux-label {
              @include sc(16px, #413838);
            }
            .vux-cell-value {
              @include sc(13px, #413838);
            }
            .weui-cell__ft::after {
              border-width: 1px 1px 0 0;
              border-color: #f05b47;
              height: 7px;
              width: 7px;
            }
          }
        }
      }
    }
    .time-info {
      @include fbc;
      background: #fff;
      height: 45px;
      padding-left: 15px;
      .text {
        @include sc(16px, #413838);
      }
      .time-select {
        padding-right: 15px;
        padding-left: 20px;
        height: 45px;
        line-height: 45px;
        .day {
          @include sc(13px, #413838);
        }
        .icon-iconfont-jiantou {
          @include sc(12px, #f05b47);
        }
      }
    }
    .order-content-title {
      @include fbc;
      height: 56px;
      padding-left: 15px;
      @include sc(18px, #413838);
      .icon-guanbi2 {
        @include sc(22px, #b2b2b2);
        padding: 5px 15px 5px 10px;
      }
    }
  }
  .bottom-warpper {
    @include fbc;
    height: 49px;
    background: #fff;
    .home-page {
      padding: 0 15px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      .icon-shouye {
        font-size: 25px;
        height: 30px;
      }
    }
    .order {
      border: none;
      outline: none;
      background: #f05b47;
      @include sc(16px, #fff);
      text-align: center;
      height: 49px;
      line-height: 49px;
      width: 172px;
    }
  }
  .ticket-detail-warpper {
    background: #fff;
    .ticket-w-title {
      @include sc(18px, #413838);
      font-weight: 600;
      padding: 20px 0px 20px 15px;
    }
    .ticket-detail-box {
      padding: 0px 15px 20px 15px;
      img {
        width: 100%;
      }
    }
    .comment-ul {
      .comment-li {
        .user-info {
          @include fbc;
          .img-name {
            @include fbc;
            .logo-img {
              width: 20px;
              height: 20px;
              border-radius: 10px;
            }
            .name {
              @include sc(14px, #5c5c5c);
              margin-left: 12px;
            }
          }
          .comment-time {
            @include sc(12px, #999);
          }
        }
        .comment-content {
          margin-top: 8px;
          @include sc(14px, #413838);
        }
      }
    }
    .no-comment {
      @include sc(12px, #767676);
      text-align: center;
      padding: 82px 0;
      padding-top: 14px;
    }
  }
  .ticket-n-intro {
    @include fbc;
    height: 123.5px;
    background: #fff;
    // margin-bottom: 10px;
    .ticket-l {
      width: calc(100% - 30px);
      padding-left: 15px;
      .ticket-name {
        @include sc(18px, #413838);
        font-weight: 600;
        @include oh;
      }
      .ticket-subtitle {
        @include sc(12px, #5c5c5c);
        @include oh;
      }
      .ticket-price {
        margin-top: 5px;
        // text-align: right;
        .adv-box {
          height: 24px;
          line-height: 24px;
        }
        .sale-box {
          height: 24px;
          line-height: 24px;
          color: #5c5c5c;
        }
        .labels-box {
          float: left;
          margin-left: 5px;
          .label {
            border-radius: 4px;
            display: inline-block;
            margin: 0 2px;
            padding: 0 2px;
            // height: 24px;
            // line-height: 24px;
          }
          .label0 {
            border: 1px solid #f05b47;
            color: #f05b47;
          }
          .label1 {
            border: 1px solid #00b7ee;
            color: #00b7ee;
          }
        }
        .unit {
          @include sc(12px, #f05b47);
        }
        .price {
          @include sc(18px, #f05b47);
        }
        .min-text {
          @include sc(9px, #5c5c5c);
          // margin-right: 3px;
        }

        .t-l-price {
          @include sc(12px, #5c5c5c);
          text-decoration: line-through;
        }
      }
      .order-t-n {
        @include sc(10px, #00699e);
        margin-top: 2px;
      }
    }
    .ticket-r {
      display: flex;
      width: 61.5px;
      height: 100%;
      align-items: center;
      background: #fafafa;
      .ticket-r-img {
        height: 20px;
        width: 21.5px;
        margin: 0 auto;
      }
    }
  }
  .buy-time {
    background-color: #fff;
    margin-bottom: 10px;
    .buy-time-box {
      margin-left: 15px;
      height: 35px;
      line-height: 35px;
      color: #413838;
      border-top: 1px solid #eeeee7;
      i {
        font-size: 16px;
        color: #050505;
      }
      span {
        font-size: 14px;
      }
      em {
        color: #999;
        font-size: 12px;
        margin: 0 2px;
      }
    }
  }
  .repast-addr {
    background-color: #fff;
    height: 44px;
    line-height: 44px;
    margin-bottom: 10px;
    padding: 0 15px;
    i {
      font-size: 16px;
      color: #050505;
    }
    span {
      color: #413838;
      font-size: 14px;
    }
  }
  .repast-px {
    background-color: #fff;
    margin-bottom: 10px;
    padding: 15px;

    .repast-px-ul {
      .repast-px-li {
        margin-bottom: 10px;
        display: flex;
        img {
          flex-grow: 1;
          width: 64px;
          height: 64px;
          display: block;
          // float: left;
        }
        .repast-li-main {
          // float: left;
          // width: 240px;
          margin-left: 5px;
          flex-grow: 1;
          .repast-title {
            font-size: 13px;
            line-height: 20px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
          }
          .repast-time {
            font-size: 12px;
            color: #999;
          }
        }
        .buy-box {
          // float: left;
          // margin-left: 5px;
          flex-grow: 1;
          font-size: 12px;
          color: #999;
          padding-top: 15px;
          .buy-btn {
            width: 50px;
            height: 25px;
            color: #fff;
            font-size: 12px;
            border-radius: 5px;
            text-align: center;
            line-height: 27px;
            background-color: #f63;
            display: block;
            margin: 0 auto;
          }
          .buy-close {
            background-color: #ccc;
          }
          .saled-text {
            margin-top: 5px;
            font-size: 11px;
            text-align: center;
          }
        }
      }
      .repast-px-li:last-child {
        margin-bottom: 0;
      }
    }
  }
  .vux-slider {
    .vux-indicator {
      bottom: 2px;
      a {
        margin-left: 5.5px;
        i {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.4);
          &.active {
            background-color: #fff !important;
          }
        }
      }
    }
  }
}
</style>


