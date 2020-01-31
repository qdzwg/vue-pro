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
        <h3 class="ticket-name">{{detailData.fullName}}</h3>      
      </div>

    </div>
    <div class="buy-time">
      <div class="buy-time-box">
        <i class="xx-icon icon-shijian"></i>
        <span>营业时间：</span>        
        <span>{{detailData.businessHours}}</span>
      </div>
    </div>
    <div class="repast-addr"
         @click="openMap(detailData.mapPoint, detailData.address)">
      <i class="xx-icon icon-shouhuodizhi"></i>
      <span>{{detailData.address}}</span>
    </div>

    <div class="tickets-content-list-wrap">
      <div :class='isFixed?"tickets-content-list-fixed":""'>
        <div class="tickets-content-list">
          <div class="tickets-content-item-wrap" @click='scrollTo("detail0",0)' :class="current==0?'tickets-content-current':''">
            <div class="tickets-content-item">
              餐券
            </div>
          </div>
          <div class="tickets-content-item-wrap" @click='scrollTo("detail1",1)' :class="current==1?'tickets-content-current':''">
            <div class="tickets-content-item">
              详情
            </div>
          </div>
          <!-- <div class="tickets-content-item-wrap" @click='scrollTo("detail2",2)' :class="current==2?'tickets-content-current':''">
            <div class="tickets-content-item">
              评价
            </div>
          </div> -->
          <!-- <div class="tickets-content-block" :style="{'left': (12.5*current*2+12.5)+'%'}"></div> -->
        </div>
      </div>
      <div ref='refHeight' id='navBar'></div>
    </div>
    <div class="ticket-detail-warpper m-b-10" ref='detail0'>
      <div class="repast-px">
        <div class="repast-px-ul" v-if="itemData.length>0">
          <div class="repast-px-li clearfix"
              v-for="(item, index) in itemData"
              :key="index">
            <img :src='item.conversionImg'
                alt="">
            <div class="repast-li-main">
              <h1 class="repast-title">{{item.conversionName}}</h1>
              <p class="repast-time"
                v-if="item.useTime&&item.useTime.length>0&&item.useType=='0'">使用时间：                
                不限
              </p>
              <p class="repast-time"
                v-if="item.useTime&&item.useTime.length>0&&item.useType=='1'">限：                
                {{item.useTime[0]}}至{{item.useTime[1]}}
              </p>
              <p class="repast-time"
                v-if="item.useTime&&item.useTime.length>0&&item.useType=='2'">限：
                <span v-for="(it, ind) in item.useTime" :key="ind">
                  {{it}}
                </span>
              </p>
              <p class="repast-time"
                v-if="item.validTime&&item.validTime.length>0">有效期：{{item.validTime[0]}}~{{item.validTime[1]}}</p>
            </div>
            <div class="buy-box">           
              <p>
                <span class="buy-btn" v-if="item.orderFlag"
                      @click="goEatery(item.corpCode, item.conversionCode)"
                      >购买</span>
                <span class="buy-btn buy-close"
                      v-else>停售</span>
              </p>            
              <p class="saled-text"
                v-if="item.salesNum&&item.salesNum!=''">已售{{item.salesNum}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="ticket-detail-warpper m-b-10" ref='detail1'>
      <div class="repast-details" v-html="detailData.remark"></div>
    </div>
    <!-- <div class="ticket-detail-warpper m-b-10" ref='detail2'>
      <div class="repast-comments">fewfwefwefwefwefwe</div>
    </div> -->
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
      wayType: 1,
      detailData: {},
      commentData: {},
      imgUrls: [],
      scenicDetail: "",
      orderDetail: "",      
      page: 1,
      limit: 100,
      current: 0,
      isFixed: false,
    };
  },
  created () {
    document.title = "云餐饮详情";
    let _this = this;   
    let params = {}
    if(_this.$route.query&&_this.$route.query.code){
      params = {
        code: _this.$route.query.code,
        enable: 'T',
        page: this.page,
        limit: this.limit
      }
    }else{
      params = {        
        enable: 'T',
        page: this.page,
        limit: this.limit
      }
    }  
    let pd = this.getAxios('/rmsrepast/repastGoods/repastConversion', params);   
    Promise.all([pd])
      .then(result => {

        this.$nextTick(() => {
          window.addEventListener("scroll", () => {
            this.refHeight = this.$refs.refHeight?(this.$refs.refHeight.offsetTop?this.$refs.refHeight.offsetTop:450):450;
            this.documentScrollHeight =
              document.documentElement.scrollTop ||
              document.body.scrollTop ||
              window.pageYOffset;
            let height = window.innerHeight ||
              document.documentElement.clientHeight ||
              document.body.clientHeight;
            let offsetHeight = document.body.scrollHeight||document.documentElement.scrollHeight;
            let scrollHeight = this.documentScrollHeight;
            let offsetTop1 = this.$refs.detail1?(this.$refs.detail1.offsetTop?this.$refs.detail1.offsetTop:(this.$refs.refHeight.offsetTop?this.$refs.refHeight.offsetTop:450)):450;
            // let offsetTop2 = this.$refs.detail2?(this.$refs.detail2.offsetTop?this.$refs.detail2.offsetTop:offsetTop1):offsetTop1;            
            if(scrollHeight>this.refHeight&&scrollHeight<(offsetTop1-48)){
              this.current = 0;
            }else if(scrollHeight>=(offsetTop1-48)&&scrollHeight<(offsetTop2-48)){
              this.current = 1;
            }
            // else if((scrollHeight>=(offsetTop2-48))||((scrollHeight+height)==offsetHeight)){
            //   this.current = 2;
            // }
            if (this.documentScrollHeight >= this.refHeight) {
              this.isFixed = true;
            } else {
              this.isFixed = false;
            }
          });
        });

        if(result[0].status == 200){
          _this.detailData = result[0].data;
          _this.itemData = result[0].data.dataGrid.rows;
          if(_this.itemData && _this.itemData.length>0){  
            _this.itemData.forEach((item, index) => {
              _this.itemData[index].useTime = _this.itemData[index].useTime?_this.itemData[index].useTime.split(','):[];
              _this.itemData[index].validTime = _this.itemData[index].validTime?_this.itemData[index].validTime.split(','):[];
            })
          }
          _this.imgUrls = result[0].data.merchantLogo?result[0].data.merchantLogo.split(','):[]
        }      
      })
      .catch(error => { });
  },
  methods: {
    goEatery (code, conversionCode) {
      this.$router.push({ path: '/detail/rmsRepast', query: { code: code, conversionCode: conversionCode } });
    },
    //打开地图
    openMap (latlnt, addr) {
      window.location.href = "//uri.amap.com/navigation?to=" + latlnt + "," + addr + "&mode=car&callnative=1";
    },
    //tab切换
    scrollTo(detail, current) {
      window.scrollTo(0, this.$refs[detail].offsetTop-this.$refs.refHeight.clientHeight);
        this.$nextTick(() => {
          this.current = current;
        });
    },
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
    padding: 15px 0;
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
    // margin-bottom: 10px;
    .buy-time-box {
      padding-left: 15px;
      // height: 35px;
      line-height: 45px;
      color: #413838;
      border-top: 1px solid #eeeee7;
      i {
        font-size: 16px;
        color: #050505;
        display: inline-block;
        vertical-align: middle;
        margin-right: 5px;
      }
      span {
        font-size: 14px;
        display: inline-block;
        vertical-align: middle;
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
    // height: 44px;
    line-height: 45px;
    margin-bottom: 10px;
    padding: 0 15px;
    border-top: 1px solid #eeeee7;
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
        -webkit-display:flex;
        -webkit-align-items:center;
        align-items:center;
        -webkit-justify-content:center;
        justify-content:center;
        img {
          // flex-grow: 1;
          width: 64px;
          height: 64px;
          display: block;
          // float: left;
        }
        .repast-li-main {
          // float: left;
          // width: 240px;
          margin:0 10px;
          width: 210px;
          // flex-grow: 1;
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
          // flex-grow: 1;
          font-size: 12px;
          color: #999;
          width: 50px;
          // float: right;
          // padding-top: 10px;
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

  .tickets-content-list-wrap{    
    .tickets-content-list {
      // padding-top: 0.133333rem;
      background-color: #fff;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      justify-content: center;
      -webkit-box-align: start;
      -ms-flex-align: start;
      align-items: flex-start;
      border-bottom: 1px solid #eeeee7;
      border-top: 1px solid #eeeee7;
      position: relative;
      height: 1.2rem;
      line-height: 1.2rem;
      .tickets-content-item-wrap {
        -webkit-box-flex: 1;
        -ms-flex-positive: 1;
        flex-grow: 1;
        padding-bottom: 0.053333rem;
        color: #999;
        text-align: center;
        font-size: 0.4rem;
      }
      .tickets-content-current {
        color: #F05B47;
      }
    }
  }
  .repast-details{
    padding: 15px;
    min-height: 300px;
    // background-color: #f63;
  }
  .repast-comments{
    padding: 15px;
    height: 300px;
    background-color: #000
  }
  .tickets-content-list-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }
}
</style>


