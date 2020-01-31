<template>
  <div class="coupons-module">
    <div class="coupons-module-list inner coupons_list">
      <div v-if="listData.length>0" class="list-item-ul">
        <div v-for="(item, index) in listData" :key="index" class="list-item-li boxshadow">
          <div class="coupons-left">
            <div class="name">{{item.name}}</div>
            <div class="price">
              <span class="unit">￥</span>
              <span class="num">{{item.amount}}</span>
            </div>
          </div>
          <div class="date-use">
            <div class="date">
              <span class="title">可用时间：</span>
              <span
                class="text"
                v-if="item.validityDateType=='relative'"
              >领取后{{item.relativeDay}}天失效</span>
              <span v-else class="text">{{item.validStartDate}} 至 {{item.validEndDate}}</span>
            </div>
            <div class="use">
              <p v-if="item.useThreshold=='F'">使用条件：无限制</p>
              <p v-else>使用条件：满{{item.targetAmout}}元可用</p>
            </div>
          </div>
          <div class="coupons-right fr">
            <span @click="getCoupon(item)" class="right-btn">立即领取</span>
            <!-- <span @click="jumpDetail(item)" class="right-btn">立即使用</span> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  props:{
    listData:{
      type:Array,
      default:()=>{return[]}
    },
    payOrderInfo:{
      type:Object,
      default:()=>{return{}}
    }
  },
  data(){
    return {
      listDatas: [{
          amount: 1,
          applyType: "type",
          code: "MCT19062720381244",
          grantEndDate: "2021-07-02 20:38:31",
          grantStartDate: "2019-06-27 20:38:30",
          merchantInfoId: 108,
          name: "PC餐饮商品限定优惠",
          personNum: 4,
          receiveCondition: "T",
          receiveLimit: 10,
          receiveNum: 9,
          status: "2",
          targetAmout: 0,
          totalNum: 1000,
          useExplain: "",
          useProductType: "mdse,eatery",
          useThreshold: "T",
          usedNum: 4,
          validEndDate: "2021-07-02 20:38:31",
          validStartDate: "2019-06-27 20:38:37",
          validityDateType: "fixed",
        },{
          amount: 1,
          applyType: "all",
          code: "MCT19081416554960",
          grantEndDate: "2020-02-28 16:58:26",
          grantStartDate: "2019-08-14 16:58:24",
          merchantInfoId: 108,
          name: "通用优惠券",
          personNum: 9,
          receiveCondition: "F",
          receiveNum: 29,
          status: "2",
          totalNum: 100,
          useExplain: "",
          useThreshold: "F",
          usedNum: 22,
          validEndDate: "2020-03-24 16:58:26",
          validStartDate: "2019-08-14 16:58:42",
          validityDateType: "fixed",
      }],
      moduleName: {
        'park': 'ticket',
        'hotel': 'hotel',
        'mdse': 'shop',
        'route': 'route',
        'repast': 'repast',
        'eatery': 'repast'
      }
    }
  },
  components:{
     merchantInfoId(){
      return this.payOrderInfo.accountId
    },
  },
  methods:{
    /**
     * 领取优惠券
     * @method getCoupon
     * @param {string} code 优惠券code
     */
    getCoupon(item) {
      this.getAxios(this.api.main.marketing.getCoupon, {
        userId: localStorage.getItem("xjsc_login_userId_2019_3_8") || this.$cookie.get("leaguerInfoId"),
        couponCode: item.code,
        merchantInfoId: this.merchantInfoId
      }).then(res => {
        if (res.status == 200) {
          this.$vux.toast.text("领取成功!", "middle");
        } else {
          this.$vux.toast.text(res.message, "middle");
        }
      });
    },
    jumpDetail(obj) {
      // console.log(obj.applyType);
      switch (obj.applyType) {
        case "all":
          this.go('/?m_id=' + this.merchantInfoId)
          break;
        case "type":
          let goType = obj.useProductType.split(",");
          // console.log(goType[0]);
          if (goType && goType.length == 1) {     
            this.go('/list/' + this.moduleName[goType[0]] + '/?m_id=' + merchantInfoId)       
          } else {
            this.go('/?m_id=' + this.merchantInfoId)
          }
          break;
        case "used":
          if (obj.productInfos) {
            if (obj.productInfos.length > 1) {
              this.go('/?m_id=' + this.merchantInfoId)
            } else {
              this.go('/detail/' + this.moduleName[obj.productInfos[0].type] + '/' + obj.productInfos[0].productId + '/' + obj.productInfos[0].productCode + '/?m_id=' + merchantInfoId)
            }
          } else {
            this.go('/?m_id=' + this.merchantInfoId)
          }
          break;
      }
    },
    /**
     * vue跳转链接
     * @method goUrl
     * @param {string} path 地址
     */
    goUrl(path) {
      this.$router.push(path);
    },
    /**
     * window 跳转链接
     * @method go
     * @param {string} path 地址
     */
    go(path) {
      if (path) {
        window.location.href = path;
      }
    },
  }
}
</script>
<style lang="scss">
  .coupons-module {
    background-color: #f7f7f7;
    .coupons-module-list {
      padding-top: 12px;
      .list-item-ul {
        padding: 0 8px;
        .list-item-li {
          margin-bottom: 20px;
          height: 140px;
          background: url("http://statics.lotsmall.cn/wx/img/coupons-bg.png")
            center center no-repeat;
          background-size: 100%;
          position: relative;
          .coupons-left {
            display: inline-block;
            width: 273px;
            border: none;
            .name {
              margin-top: 7px;
              color: #fff;
              font-size: 14px;
              font-family: PingFangSC-Regular, sans-serif;
              padding-left: 14px;
            }
            .price {
              padding-left: 40px;
              color: #fff;
              margin-top: 6px;
              margin-bottom: 9px;
              font-family: PingFangSC-Regular, sans-serif;
              .unit {
                font-size: 18px;
              }
              .num {
                font-size: 35px;
              }
            }
          }
          .date-use {
            line-height: 10px;
            position: absolute;
            left: 15px;
            bottom: 5px;
            font-size: 9px;
            color: #fff;
            font-family: PingFangSC-Semibold, sans-serif;
            .date {
              margin-bottom: 2.5px;
            }
            .use {
              margin-bottom: 5px;
            }
          }
          .coupons-right {
            height: 103px;
            display: inline-block;
            width: calc(100% - 273px);
            text-align: center;
            position: relative;
            .right-btn {
              border: none;
              width: 66px;
              height: 25px;
              line-height: 25px;
              border-radius: 2px;
              background: #fff;
              font-size: 14px;
              color: #f05b47;
              font-family: PingFangSC-Regular, sans-serif;
              margin-top: 44px;
              display: block;
            }
          }
        }
      }
      .btn {
        display: block;
        color: #413838;
        border-radius: 6px;
        width: 90%;
        height: 38px;
        line-height: 38px;
        margin-left: 5%;
        text-align: center;
        font-size: 15px;
        background-color: #fff;
        box-shadow: 0 0 10px rgba(245, 245, 245, 0.5);
        margin-bottom: 10px;
        //   position:fixed;
      }
      .btn-top {
        bottom: 100px;
        left: 0;
      }
      .btn-bot {
        bottom: 0;
        left: 0;
      }
    }
  }
</style>