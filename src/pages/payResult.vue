<template>
  <div>
    <!-- 自定义组件   -->
    <custompage
      v-if="comList.length"
      :comList="comList"
      :customBackgroundColor="customBackgroundColor"
      :pageBackFlag="pageBackFlag"
      :otherDatas="otherDatas"
    />
    <!-- 底部广告 -->
    <!-- <div v-if="imgList" class="merchant-payresult-ad">
      <div class="pay-title">
        <div class="pay-title__line left-line"></div>
        <div class="pay-title__conetent">
          <i class="xx-icon icon-aixin"></i>
          <em>你可能还喜欢</em>
        </div>
        <div class="pay-title__line right-line"></div>
      </div>
      <div class="adcertising" @click="go(imgLink)">
        <img :src="imgList" alt class="adcertising-img">
      </div>
    </div> -->
  </div>
</template>
<script>
import custompage from "@/components/custompage";
import { wxShare } from "@/common/wxshare";
import { formatterData } from "@/common/utils";
import { mapGetters, mapMutations, mapState, mapActions } from "vuex";
export default {
  components: {
    custompage
  },
  data() {
    return {
      comList: [],
      customBackgroundColor: "",
      pageBackFlag: "",
      merchantInfoId: "", //店铺id
      payOrderDetail:{},
      orderInfo:{},
      needFaceUrl: false, //是否需要人脸识别
      paySum: "",
      deliveryType: "",
      imgList: "",
      imgLink: "",
      listData: [],
      saleData: [],
      ticketDetail: [],
      componentsInfo:[],
      componentsList:[], // 自定义组件
      payOrderNo: "",
      otherDatas:{} // 功能页存储数据使用
    };
  },
  created() {
    this.payOrderNo = this.$route.query.payOrderNo;
    this.merchantInfoId = this.$route.query.m_id;
    this.init();
    this.getPageData();
  },
  methods: {
    ...mapMutations("payResult", ["updatePayResultData"]),
     /**
     * 初始化页面数据
     * @method init
     */
    init(){
      let _this = this,
        // Promise.all 接口地址
        resultUrl = this.api.order.detail,
        ruleUrl = this.api.main.marketing.findBuySendRule,
        adUrl = this.api.main.merchant.findPayPageAd,
        recommendUrl = this.api.main.order.getRecommendPark;
        
      // 获取支付详情  
      this.getAxios(resultUrl, {
        payOrderNo: this.payOrderNo
      }).then(res => {
        if (res.status == 200) {
          this.merchantInfoId = res.data.accountId;
          this.payOrderDetail = res.data;
          this.orderInfo = JSON.parse(res.data.orderInfoJson);
          _this.paySum = res.data.paySum;
          _this.deliveryType = res.data.deliveryType;
          _this.orderType = this.orderInfo[0].orderType;
          // 是否需要实名制人脸
          _this.needFaceUrl = res.data && res.data.needFaceUrl ? res.data.needFaceUrl == "T": false;
          Promise.all([
            // 买即送
            this.getAxios(ruleUrl, {
              code: this.orderInfo[0].code,
              modelType: this.orderInfo[0].orderType,
              buyCount: this.orderInfo[0].buyCount,
              payTime: res.data.payTime
            }),
            // 店铺广告
            // this.getAxios(adUrl, {}),
            // 大数据推广产品
            // this.getAxios(recommendUrl, {
            //   payOrderNo: this.payOrderNo,
            //   leagureId: res.data.buyerId
            // })
          ]).then(result => {
            // console.log(result);
            // 买即送优惠券列表
            _this.listData = result[0].data;
            // 结果页广告图片链接
            // _this.imgList =
            //   result[1].data && result[1].data.picAddr
            //     ? result[1].data.picAddr
            //     : "";
            // 结果页广告产品链接    
            // _this.imgLink =
            //   result[1].data && result[1].data.picLink
            //     ? result[1].data.picLink
            //     : "";
            // 大数据推广数据链接    
            // result[2].data.forEach((item, index) => {
            //   if (result[2].data[index].productType == "park") {
            //     result[2].data[index].productType = "scenic";
            //   }
            // });
            // _this.saleData = result[2].data;

            _this.otherDatas = {
              listData: _this.listData, // 买即送优惠券列表
              payOrderDetail: _this.payOrderDetail // 支付订单详情
            }
          });
        }
      });
    },
    getPageData() {
      this.getAxios(this.api.aiPapi.getUsePage, {
        pageType: "paySuccessPage",
        useRange: "wap"
      }).then(res => {
        //判断最新的自定义有没有返回
        this.comList = formatterData(JSON.parse(res.data.content));
        document.title = res.data.renovationPageName;
        this.customBackgroundColor = res.data.renovationPageBack
          ? res.data.renovationPageBack
          : "";
        this.pageBackFlag = res.data.pageBackFlag;
        // console.log("this.comList1231331231", this.comList);
        let sharImg = "";
        let sharDesc = "";
        for (let i = 0; i < this.comList.length; i++) {
          let item = this.comList[i];
          if (item.category == "banner" && !sharImg) {
            //缓存第一个轮播图
            let imgUrl = item.data.list[0].picAddr;
          }
          if (item.category == "shopinfo" && !sharDesc) {
            sharDesc = item.data.introduction ? item.data.introduction : "";
          }
        }
        wxShare({
          title:
            res.data && res.data.renovationPageName
              ? res.data.renovationPageName
              : "",
          desc: sharDesc,
          imgUrl: sharImg
        });
        // console.log(this.memberData);
      })
    }
  }
};
</script>
<style lang="scss">
 .pay-title {
    // text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    .pay-title__line {
      position: relative;
      display: inline-block;
      height: 1px;
      background-color: #f05b47;
      width: 17px;
      // vertical-align: middle;
      &.left-line::after {
        content: "";
        display: block;
        height: 3px;
        width: 3px;
        position: absolute;
        border-radius: 50%;
        background-color: #f05b47;
        right: -2px;
        top: -1px;
      }
      &.right-line::before {
        content: "";
        display: block;
        height: 3px;
        width: 3px;
        position: absolute;
        border-radius: 50%;
        background-color: #f05b47;
        left: -2px;
        top: -1px;
      }
    }
    .pay-title__conetent {
      display: flex;
      margin: 0 7px;
      align-items: center;
      img {
        width: 17px;
        height: 14px;
      }
      i {
        font-size: 18px;
        color: #f05b47;
      }
      em {
        font-size: 14px;
        color: #f05b47;
        margin-left: 5px;
      }
    }
  }
  .adcertising {
    width: calc(100% - 10px);
    height: 138px;
    padding: 5px;
    .adcertising-img {
      width: 359px;
      height: 138px;
      img {
        width: 100%;
      }
    }
  }
</style>