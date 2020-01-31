<template>
    <div class="cardDetail">
        <div class="item-li">
            <img :src="listData.cardCover" alt="">
            <div class="cardLogo">
                <img :src="listData.cardLogo" alt="">
                <div class="cardName">{{listData.cardName}}</div>
            </div>
            <div class="card-mask"></div>
        </div>
        <div class="btn-card" @click="cardPay(listData.id)">年卡充值</div>
        <div class="card-li clearfix" @click="goUrl(listData.id)">
            <span class="item-title">交易记录</span>
            <img src="http://statics.lotsmall.cn/wx/img/arrow-left-icon.png" class="arrow-left-icon">
        </div>
        <div class="card-li clearfix" @click="show=true">
            <span class="item-title">使用说明</span>
            <img src="http://statics.lotsmall.cn/wx/img/arrow-left-icon.png" class="arrow-left-icon">
        </div>
        <popup class="order-pop" v-model="show" position="right" width="100%">
            <div class="useContent" v-html="listData.useContent"></div>
            <div class="uesr-btn" @click="show=false">返回</div>
        </popup>
    </div>
</template>

<script>
import { Popup } from "vux";
export default {
  components: {
    Popup
  },
  data() {
    return {
      show: false,
      listData: {}
    };
  },
  created() {
       document.title = "年卡详情";
    this.getAxios("/marketing/api/yearCardTob/selectById", {
      id: this.$route.query.cardId
    }).then(res => {
      this.listData = res.data;
    });
  },
  methods: {
    cardPay(id) {
      this.$router.push("/yearcardPay?cardId=" + id);
    },
    goUrl(id){
        this.$router.push("/yearcardRecord?cardId=" + id);
    }
  }
};
</script>

<style lang="scss">
.cardDetail {
  padding: 0 10px;
  .order-pop.vux-popup-dialog {
    z-index: 700 !important;
  }
  .order-pop {
    .useContent {
      background-color: #fff;
      padding: 20px;
      font-size: 15px;
    }
    .uesr-btn {
      width: 100%;
      height: 49px;
      position: fixed;
      bottom: 0;
      left: 0;
      background-color: #009ded;
      color: #fff;
      text-align: center;
      line-height: 49px;
      font-size: 16px;
    }
  }
  .btn-card {
    height: 40px;
    text-align: center;
    line-height: 40px;
    font-size: 18px;
    background-color: #009ded;
    border-radius: 3px;
    margin: 25px auto;
    color: #fff;
  }
  .item-li {
    height: 130px;
    margin: 10px 0;
    position: relative;
    .card-mask {
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.26);
      z-index: 2;
      left: 0;
      top: 0;
    }
    img {
      width: 100%;
      height: 100%;
    }
    .cardLogo {
      width: 90%;
      position: absolute;
      top: 15%;
      left: 20px;
      z-index: 99;
      img {
        width: 55px;
        height: 55px;
        border: 2px solid #fff;
        border-radius: 50%;
        vertical-align: top;
      }
      .cardName {
        width: 75%;
        margin-left: 10px;
        color: #fff;
        font-size: 22px;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }
  .card-li {
    width: 100%;
    height: 53px;
    line-height: 53px;
    margin-top: 10px;
    background-color: #fff;
    .item-title {
      font-size: 14px;
      color: #413838;
      float: left;
      margin-left: 15px;
    }
    .arrow-left-icon {
      float: right;
      margin-top: 22px;
      margin-right: 13px;
      width: 5px;
      height: 10px;
    }
  }
}
</style>


