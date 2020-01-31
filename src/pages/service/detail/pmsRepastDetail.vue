<template>
  <div class="eatery-detail">
    <div class="repast-counpon">
      <div class="counpon-img">
        <swiper v-if="imgArr.length"
            auto
            loop
            :interval="2000"
            height="5.906667rem"
            class="text-scroll"
            dots-position="center">
          <swiper-item v-for="(imgUrl,index) in imgArr"
                      :key="index">
            <img style="width:100%;height:100%"
                :src="imgUrl + '?imageMogr2/thumbnail/640x/strip/quality/100'"
                alt>
          </swiper-item>
        </swiper>
      </div>
      <div class="counpon-title">
        
        <div class="buy-price clearfix">
          <span class="ztitle" v-if="detailData.conversionName">{{detailData.conversionName}}</span>
          <span class="orgin-price" v-if="detailData.salesNum">已售：{{detailData.salesNum}}</span>          
        </div>
        <div class="label-stock clearfix">
          <span class="label">{{label}}</span>
          <span class="stock">库存：{{stock}}</span>
        </div>
      </div>
    </div>
    <div class="ticket-detail-warpper m-b-10 repast-detail-wrap">
      <h2 class="ticket-w-title">兑换商品</h2>
      <div class="recommoned-shop">
        <div class="s-ul" v-for="(item, index) in detailData.productInfoDtos" :key="index">
          <div class="s-li clearfix">
            <span>{{item.productName}}</span>
            <em v-if="!item.productPackageDtos">*{{item.productNum}}</em>
          </div>
          <div v-if="item.productPackageDtos" style="padding-left:0.4rem;">
            <div class="s-li-li clearfix" v-for="(it,ind) in item.productPackageDtos" :key="ind">
              <span>{{it.productName}}</span>
              <em>*{{it.num}}</em>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="ticket-detail-warpper m-b-10">
      <h2 class="ticket-w-title">购买须知</h2>
      <div class="ticket-detail-box">
        <div class="order-notice">
          <div v-if="detailData.validType=='0'"><label>有效期：</label><span v-if="validTime&&validTime.length">{{validTime[0]}} ~ {{validTime[1]}}</span></div>
          <div v-if="detailData.validType=='1'"><label>有效期：</label>领取后{{validTimess[0]}}天{{validTimess[1]}}小时生效，有效期为{{validTimess[2]}}天</div>
          <div v-if="detailData.useType=='0'"><label>使用时间：</label><span>不限</span></div>
          <div v-if="detailData.useType=='1'"><label>限：</label><span>{{useTime[0]}} ~ {{useTime[1]}}</span></div>
          <div v-if="detailData.useType=='2'"><label>限：</label>{{detailData.useTm}}</div>
          <div><label>不可用时间：</label><span>{{detailData.notUseTm}}</span></div>
          <div><label>使用规则：</label><p v-html="detailData.conversionEmployRule"></p></div>
          <div v-if="detailData.validType=='0'&&detailData.receiveType=='0'"><label>领取时间：</label><span>{{validTime[0]}} ~ {{validTime[1]}}</span></div>
          <div v-if="detailData.validType=='1'&&detailData.receiveType=='0'"><label>领取时间：</label><span>不限</span></div>
          <div v-if="detailData.receiveType=='1'"><label>领取时间：</label><span>{{receiveTime[0]}} ~ {{receiveTime[1]}}</span></div>
          <div><span>{{label}}</span></div>
          <div v-if="detailData.refundRule=='1' && detailData.refundFlag!='0'"><span>过期后{{overdueTime[0]}}天{{overdueTime[1]}}后自动退款</span></div>
        </div>
      </div>
    </div>
    <div class="ticket-detail-warpper">
      <h2 class="ticket-w-title">图文详情</h2>
      <div class="ticket-detail-box">
        <div v-html="detailData.bookDetail"></div>
      </div>
    </div>
    <div class="order-footer">
      <div class="order-total clearfix">
        <div class="order-total-left">
          <div class="gotoHome"
               v-if="detailData.priceSettle">
            <span class="unit">¥</span>
            <span class="price">{{detailData.priceSettle}}</span>
            <span class="orgin-price">¥{{detailData.rackPrice}}</span>
          </div>
        </div>
        <div class="authorization-btn"
             @click="order">立即抢购</div>
      </div>
    </div>
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
    SwiperItem
  },
  data () {
    return {
      totalPrice: 0,
      wayType: 1,
      detailData: {},
      imgArr: [],
      label: '',
      stock: '',
      validTime: [],
      receiveTime: [],
      useTime: [],
      validTimess: [],
      overdueTime: []
    };
  },
  created () {
    document.title = "餐券详情";
    let _this = this;
    let pd = this.getAxios('/rmsrepast/repastGoods/repastDetail', {
      code: this.$route.query.code,
      conversionCode: this.$route.query.conversionCode
    });
    Promise.all([pd])
      .then(result => {
        _this.detailData = result[0].data;
        _this.imgArr = result[0].data.conversionImg&&result[0].data.conversionImg!=''?result[0].data.conversionImg.split(','):[];
        if(_this.detailData.refundRule){
          switch(_this.detailData.refundRule){
            case '0':
              _this.label = '不支持退款'
              break;
            case '1':
              switch(_this.detailData.refundFlag){
                case '0':
                  _this.label = '支持退款 过期不可退'
                  break;
                case '1':
                  _this.label = '支持退款 过期可退'
                  break;
              }              
          }
        }
        if(_this.detailData.launchType){
          if(_this.detailData.launchType == 'UNLIMIT'){
            _this.stock = '无限库存'
          }
          if(_this.detailData.launchType == 'LIMIT'){
            _this.stock = _this.detailData.totalNum
          }
        }
        if(_this.detailData.validTime&&_this.detailData.validType=='0'){
          _this.validTime = _this.detailData.validTime.split(',');
        }else{
          _this.validTime = [];
        }
        if(_this.detailData.receiveTime){
          _this.receiveTime = _this.detailData.receiveTime.split(',');
        }else{
          _this.receiveTime = [];
        }
        if(_this.detailData.useTime){
          _this.useTime = _this.detailData.useTime.split(',');
        }else{
          _this.useTime = [];
        }
        if(_this.detailData.validType=='1'&&_this.detailData.validTime){
          _this.validTimess = _this.detailData.validTime.split(',');
        }else{
          _this.validTimess = [];
        }
        if(_this.detailData.refundRule=='1'){
          _this.overdueTime = _this.detailData.overdueTime.split(',');
        }else{
          _this.overdueTime = [];
        }
      })
      .catch(error => { });
  },
  methods: {
    order () {
      localStorage.setItem("eateryOrderData", JSON.stringify(this.detailData));
      let url = '/order/rmsRepast?m_id='+this.$route.query.m_id;
      let nextUrl = document.location.protocol + "//" + window.location.host + "/vue" + url;
      this.checkToken(nextUrl).then(res => {
        localStorage.removeItem("xjsc_nextpath_2019_4_20");
        this.$router.push(url);
      });
    }
  }
};
</script>
<style lang="scss">
@import "../../../assets/styles/mixin.scss";
.eatery-detail {
  background-color: #eeeee7;
  .repast-counpon {
    background-color: #fff;
    margin-bottom: 10px;
    .counpon-img {
      width: 100%;
      // height: 200px;
      height: 5.906667rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .counpon-title {
      .title {
        margin-left: 10px;
        margin-top: 10px;
        font-size: 18px;
        color: #413838;
        display: inline-block;
        vertical-align: middle;
        font-weight: bold;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      .buy-price {
        font-size: 14px;
        color: #999;
        // display: flex;
        padding: 10px 0;
        margin: 0 10px;
        border-bottom: 1px solid #eeeee7;
        span {
          vertical-align: middle;
          height: 25px;
          line-height: 25px;
        }
        .ztitle {
          float: left;
          display: block;
          color: #333;
          font-size: 0.4rem;
          // flex-grow: 1;
          // margin-left: 10px;
          // padding-right: 20px;
        }
        .orgin-price {
          float: right;
          display: block;
          // flex-grow: 1;
          // margin-left: 10px;
          font-size: 12px;
          color: #999;
        }
        .price {
          flex-grow: 1;
          font-size: 18px;
          color: #f66;
        }
      }
      .label-stock{
        margin: 0 10px;
        padding: 10px 0;
        span {
          vertical-align: middle;
          height: 25px;
          line-height: 25px;
        }
        .label{
          display: block;
          float: left;
          color: #999;
        }
        .stock{
          display: block;
          float: right;
          color: #f66
        }
      }
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
      min-height: 50px;
      img {
        width: 100%;
      }
      .order-notice{
        div{
          line-height: 25px;
        }
        label{
          color: #999;
        }
        ul{
          
          margin-left: 0.4rem;
          li{
            // list-style: none;
            color: #333
          }
        }
       
      }
    }
  }
  .order-footer {
    padding-top: 58.5px;
    position: relative;
    z-index: 29;
    .order-total {
      font-size: 14px;
      height: 49px;
      background-color: #fff;
      position: fixed;
      bottom: 0;
      width: 100%;
      left: 0;
      .order-total-left {
        width: 204.5px;
        float: left;
        .gotoHome {
          float: left;
          width: 200px;
          height: 49px;
          margin-left: 15px;
          // text-align:center;
          span {
            vertical-align: baseline;
          }
          .unit {
            font-size: 12px;
            color: #f66;
          }
          .price {
            line-height: 49px;
            font-size: 25px;
            font-weight: 700;
            color: #f66;
          }
          .orgin-price {
            margin-left: 12px;
            font-size: 12px;
            color: #999;
            text-decoration: line-through;
          }
        }
      }
      .authorization-btn {
        border-radius: 0;
        border: none;
        background: #f05b47;
        color: #fff;
        font-family: PingFangSC-Regular, sans-serif;
        font-size: 16px;
        height: 49px;
        line-height: 49px;
        width: 150px;
        float: right;
        text-align: center;
      }
    }
  }
  .repast-detail-wrap{
    margin-top: 10px;
    .recommoned-shop{
      padding: 0 0.6rem 0.4rem;
      .s-ul{
        .s-li{
          line-height: 24px;
          width: 100%;
          span{
            float: left;
            display: block
          }
          em{
            float: right;
            display: block;
            width: 20px;
            text-align: left;
          }
        }
        .s-li-li{
          line-height: 24px;
          width: 100%;
          span{
            float: left;
            display: block
          }
          em{
            float: right;
            display: block;
            width: 20px;
            text-align: left;
          }
        }        
      }
    }
  }
}
</style>


