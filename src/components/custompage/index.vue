<template>
  <div class="custom-page" :class="{'have-footer':bootomFooterShow}">
    <div
      :style="{background:pageBackFlag=='customBgImg'?(customBackgroundColor?'url('+ customBackgroundColor +')' + ' 0% 0%/100% 100% no-repeat':''):customBackgroundColor}"
    >
    <!-- 店铺设置-顶部导航 -->
      <top-navigation :pageData="topNav"></top-navigation>
      <div
        v-for="(item,index) in comList"
        :key="index"
        class="custom-item"
        :class="[item.componentClass]"
        :style="{'margin-bottom':item.hideBottom?'0':'0.26667rem'}"
      >
        <photo-ads v-if="item.category=='banner'" :pageData="item.data"></photo-ads>
        <navigation v-if="item.category=='navigation'" :pageData="item.data"></navigation>
        <custom-title v-if="item.category=='title'" :pageData="item.data"></custom-title>
        <search v-if="item.category=='search'" :pageData="item.data"></search>
        <address-phone v-if="item.category=='addressPhone'" :pageData="item.data"></address-phone>
        <rich-text v-if="item.category=='richText'" :pageData="item.data"></rich-text>
        <free-layout v-if="item.category=='freeLayout'" :pageData="item.data"></free-layout>
        <product-group v-if="item.category=='productGroup'" :pageData="item.data"></product-group>
        <product v-if="item.category=='product'" :pageData="item.data"></product>
        <notice v-if="item.category=='notice'" :pageData="item.data"></notice>
        <custom-text v-if="item.category=='text'" :pageData="item.data"></custom-text>
        <auxline v-if="item.category=='subline'" :pageData="item.data"></auxline>
        <auxblank v-if="item.category=='subBlank'" :pageData="item.data"></auxblank>
        <signage v-if="item.category=='shopinfo'" :pageData="item.data"></signage>
        <weather v-if="item.category=='weather'" :pageData="item.data"></weather>
        <strategy v-if="item.category=='strategy'" category='strategy' :listType="item.data.listType" :pageData="item.data" :comData='item.data'></strategy>
        <strategy-group v-if="item.category=='strategyGroup'" :pageData="item.data"></strategy-group>
        <layer v-if="(item.category=='layer'&&item.data.channel.includes('wap')&&item.data.type === 'ad') || (item.category=='layer'&&item.data.channel.includes('wap')&&item.data.type === 'warning'&&item.data.warningDesc !== '')" :pageData="item.data"></layer>
        <weather-details v-if="item.category=='weatherDetail'" :pageData="item.data"></weather-details>
        <seven-day-forecast v-if="item.category=='sevenDayForecast'" :pageData="item.data"></seven-day-forecast>
        <life v-if="item.category=='weatherIndex'" :pageData="item.data"></life>

        <pay-result v-if="item.category === 'payResult'" :pageData="item.data" :otherDatas="otherDatas"></pay-result>
      </div>
      <!-- 店铺设置-底部备案 -->
      <bottom-info :pageData="botInfo"></bottom-info>

      <!-- 小鲸备案 -->
      <a class="ICP-link"  target="_blank" href="http://www.beian.miit.gov.cn">©浙ICP备09019008号-5</a>
    </div>

    <page-footer v-if="bootomFooterShow" :pageData="newCustomFooteerData"></page-footer>
  </div>
</template>
<script>
import photoAds from "./customComponent/photoAds";
import navigation from "./customComponent/byNavigation";
import customTitle from "./customComponent/title";
import search from "./customComponent/search";
import addressPhone from "./customComponent/addressPhone";
import bottomInfo from "./customComponent/bottomInfo";
import topNavigation from "./customComponent/topNavigation";
import richText from "./customComponent/richtext";
import freeLayout from "./customComponent/freeLayout";
import productGroup from "./customComponent/productGroup";
import product from "./customComponent/product";
import notice from "./customComponent/notice";
import signage from "./customComponent/signage";
import customText from "./customComponent/text";
import auxline from "./customComponent/auxline";
import auxblank from "./customComponent/auxblank";
import weather from "./customComponent/weather";
import pageFooter from "./footer.vue";
import strategy from "./customComponent/strategy";
import strategyGroup from "./customComponent/strategyGroup";
import layer from "./customComponent/layer";
import weatherDetails from "./customComponent/weatherDetails";
import sevenDayForecast from "./customComponent/sevenDayForecast";
import life from "./customComponent/life";

import payResult from "./customComponent/payResult";
export default {
  components: {
    photoAds,
    navigation,
    customTitle,
    search,
    addressPhone, // 地址电话
    topNavigation, // 顶部导航
    bottomInfo, // 底部备案
    richText,
    freeLayout,
    productGroup,
    product,
    notice,
    signage,
    customText,
    auxline,
    auxblank,
    pageFooter,
    weather,
    strategy,
    strategyGroup,
    layer,
    weatherDetails,
    sevenDayForecast,
    life,
    payResult, // 支付结果页固定模板
  },
  data() {
    return {
      topNav: {
        hidden: true,
        range: [],
        imgUrl: "",
        borderColor: "#dcdcdc",
        backgroundColor: "#ffffff",
        right: {
          type: "picture",
          text: '',
          imgUrl: '',
          customLinkObj: {},
          data: []
        },
        left: {
          type: "menu",
          text: '',
          customLinkObj: {},
          data: []
        }
      },
      botInfo: {
        hidden: true,
        range: [],
        imgUrl: "",
        address: "",
        info: "",
        logo: "",
        linkBackgroundColor: "#ffffff",
        backgroundColor: "#ffffff",
        lineNum: '4',
        linkList: [{
          text: '',
          customLinkObj: {},
          backgroundColor: '#fff',
        }],
        codeList: [{
          name: "",
          imgUrl: ""
        }],
      },
      newCustomFooteerData: {},
      bootomFooterShow: false
    };
  },
  props: {
    pageBackFlag: {
      type: String
    },
    customBackgroundColor: {
      type: String,
      default: ""
    },
    comList: {
      type: Array,
      default: []
    },
    otherDatas: {
      type:Object,
      default:() => {return{}}
    }
  },
  methods: {},
  created() {
    console.log(this.$route.path);
    this.getAxios(this.api.aiPapi.getUsePage, {
      pageType: "bottomFilingPage",
      useRange: "wap"
    }).then(res => {
      if (res.data && res.data.content) {
        this.botInfo = JSON.parse(res.data.content);
      }
    });
    this.getAxios(this.api.aiPapi.getUsePage, {
      pageType: "topNavigationPage",
      useRange: "wap"
    }).then(res => {
      if (res.data && res.data.content) {
        let topNav = JSON.parse(res.data.content);
        function addShow(item) {
          if(item.children&&item.children.length){
            item.children.map(ite=>{
              ite.show = false;
              ite.select = false;
              addShow(ite)
            })
          }
        }
        if(topNav.left.type==="menu"){
          topNav.left.data.map(item=>{
            item.show = false;
            item.select = false;
            addShow(item);
          });
        }
        if(topNav.right.type==="menu"){
          topNav.right.data.map(item=>{
            item.show = false;
            item.select = false;
            addShow(item);
          });
        }
        this.topNav = topNav;
      }
    });
    if (this.$route.path == "/custompage") {
      //内置自定义页面
      return;
    }
    this.getAxios(this.api.aiPapi.getUsePage, {
      pageType: "navigationPage",
      useRange: "wap"
    }).then(res => {
      if (res.data && res.data.content) {
        this.newCustomFooteerData = JSON.parse(res.data.content);
        //判断首页是否存在底部导航
        // console.log(1)
        this.bootomFooterShow =
          this.newCustomFooteerData.range.indexOf("homepage") > -1;
      }
    });
  }
};
</script>
<style lang="scss" scoped>
.custom-item {
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
}
.custom-page {
  overflow: hidden;
}
.custom-page.have-footer {
  padding-bottom: 58px;
}
.ICP-link {
  color: #ccc;
  padding: 20px 0 20px;
  text-align: center;
  line-height: 20px;
  font-size: 14px;
  display: block;
}
</style>


