// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
// import FastClick from 'fastclick'
import store from "./store";
import VueCookie from "vue-cookie";
import VideoPlayer from "vue-video-player";
// import 'babel-polyfill'
// import Es6Promise from 'es6-promise'
import "@/assets/weatherFont/iconfont.js";
import "@/assets/font/iconfont.js";
require("video.js/dist/video-js.css");
require("vue-video-player/src/custom-theme.css");
import apiAxios from "./api/axios.js";
import * as filters from "./filters";
import api from "./api/api";
import VueAMap from "vue-amap";
import {
  imageIsExist
} from '@/common/common.js';
import {
  LoadingPlugin,
  ToastPlugin,
  ConfirmPlugin,
  AlertPlugin
} from 'vux';
// import clipper from './common/clipper'
import {
  linkBaseUrl,
  pubUrl
} from "../config/index";
import clipboard from "clipboard";
import Vconsole from "vconsole";

// Es6Promise.polyfill()
// if ('addEventListener' in document) {
//   document.addEventListener('DOMContentLoaded', function () {
//     FastClick.attach(document.body);
//   }, false);
// }

// alert(test.value)
//自适应
import "lib-flexible/flexible.js";
Vue.prototype.filter = filters;
Vue.prototype.clipboard = clipboard;
//定义全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});
//vuecookie
Vue.use(VueCookie);
Vue.use(VideoPlayer);
// 引入高德地图
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: "b547d05d07535668173a50b6d644ffce",
  plugin: [
    "Autocomplete",
    "PlaceSearch",
    "Scale",
    "ToolBar",
    "PolyEditor",
    "AMap.CircleEditor",
    "Geolocation"
  ],
  // 默认高德 sdk 版本为 1.4.4
  v: "1.4.4"
});
Vue.use(VueCookie)
Vue.use(VideoPlayer)
//全局使用,js调用
Vue.use(LoadingPlugin);
Vue.use(ToastPlugin);
Vue.use(ConfirmPlugin);
Vue.use(AlertPlugin);

//图片剪切（后续优化）
// Vue.use(clipper)

//全局初始化axios请求
Vue.use(apiAxios);
Vue.config.productionTip = false;
if (process.env.env_config !== "prod") {
  const vConsole = new Vconsole();
  Vue.use(vConsole);
}

//混合，全局使用api
Vue.mixin({
  data() {
    return {
      api
    };
  },
  methods: {
    //解决IOS12以上微信内置浏览器下键盘收起底部空白的问题，导致底部点击失效问题
    iosBlur() {
      let ua = window.navigator.userAgent;
      //$alert('浏览器版本: ' + app + '\n' + '用户代理: ' + ua);
      if (!!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
        //ios系统
        let currentPosition, timer;
        let speed = 1;
        timer = setInterval(function () {
          currentPosition =
            document.documentElement.scrollTop || document.body.scrollTop;
          currentPosition -= speed;
          window.scrollTo(0, currentPosition); //页面向上滚动
          currentPosition += speed;
          window.scrollTo(0, currentPosition); //页面向下滚动
          clearInterval(timer);
          // alert("失去焦点")
          console.log("失去焦点");
        }, 100);
      }
    },
    checkToken(nextPath) {
      //用于验证当前token过期或者不存在的问题
      if (nextPath) {
        //用于window.locatin.href 跳转
        localStorage.setItem("xjsc_nextpath_2019_4_20", nextPath);
      }
      //在该方法then后面主动清理xjsc_nextpath_2019_4_20，具体使用可以查看门票详情页面
      return this.getAxios("/leaguer/api/leaguerContacts/getContactsList");
    },
    go(path) {
      if (path) {
        this.$router.push(path);
      }
    },
    goLinkUrl(text) {
      let m_id = localStorage.getItem("xjsc_vue_2018_12_19_mid");
      let url = "";
      if (text == "home") {
        url = "/" + "?m_id=" + m_id;
      } else if (text == "personal") {
        url = "/personal" + "?m_id=" + m_id;
      } else if (text == "order") {
        url = "/orderList" + "?m_id=" + m_id;
      } else if (text == "") {
        url = "/" + "?m_id=" + m_id;
      } else if (text == "") {
        url = "/" + "?m_id=" + m_id;
      } else if (text == "publicservice") {
        this.getAxios(api.main.marketing.selectServiceUse, {
            serviceType: "guide"
          })
          .then(response => {
            if (response.status == "200" && response.data.guide) {
              this.getAxios(api.main.merchant.gotoPublic, {
                  merchantId: m_id
                })
                .then(res => {
                  if (res.status == 200) {
                    // window.location.href = "http://pubswap.sendinfo.com.cn/publicMap/index/?acc=" + res.message
                    window.location.href =
                      "//pubswap.zhiyoubao.com/publicMap/index/?acc=" +
                      res.message;
                    // window.location.href = pubUrl + '/publicMap/index/?acc=' + res.message;
                  } else {
                    console.log("没找到手机号码");
                  }
                })
                .catch(e => {
                  console.log(e);
                });
            } else {
              this.$vux.alert.show({
                title: "",
                content: "你还没有购买此服务或者你购买的此服务已过期"
              });
            }
          })
          .catch(e => {
            console.log(e);
          });
        return;
      }
      this.$router.push(url);
    },
    goUrl(item) {
      let m_id = localStorage.getItem("xjsc_vue_2018_12_19_mid");
      let url = "";
      if (item.businessType == "ticket") {
        // 门票
        url =
          "/detail/ticket/" +
          item.merchantProdcutId +
          "/" +
          item.productCode +
          "?m_id=" +
          m_id;
      } else if (item.businessType == "room") {
        //酒店
        url =
          "/detail/hotel/" +
          item.merchantProdcutId +
          "/" +
          item.productCode +
          "?m_id=" +
          m_id;
      } else if (item.businessType == "mdse") {
        url =
          "/detail/shop/" +
          item.merchantProdcutId +
          "/" +
          item.productCode +
          "?m_id=" +
          m_id;
      } else if (item.businessType == "repast") {
        url =
          "/detail/repast/" +
          item.merchantProdcutId +
          "/" +
          item.productCode +
          "?m_id=" +
          m_id;
      } else if (item.businessType == "route") {
        url =
          "/detail/route/" +
          item.merchantProdcutId +
          "/" +
          item.productCode +
          "?m_id=" +
          m_id;
      }else if(item.businessType == "pmsHotelTypeProduct"){
        this.$router.push(
          "/detail/pmsHotel?id=" +
          item.merchantProdcutId +
            "&m_id=" +
            m_id
        );
    }
      window.location.href = linkBaseUrl + url;
    },
    //新自定义页面跳转
    gotoTarget(item) {
      // let baseUrl = process.env.NODE_ENV == 'production' ? 'https://wap.lotsmall.cn' : 'http://testwap.lotsmall.cn';
      let baseUrl = linkBaseUrl;
      let m_id = localStorage.getItem("xjsc_vue_2018_12_19_mid");
      let url = "";
      if (item.linkUrl == "personal") {
        url = "/member?m_id=" + m_id;
      } else if (item.linkUrl == "home") {
        url = "/?m_id=" + m_id;
        // 如果当前是首页着不跳转
        // window.location.reload()

        // return false
        // router.push(url)
      } else if (item.linkUrl == "traffic") {
        url = "/vue/traffic_home?m_id=" + m_id;
      } else if (item.linkUrl == 'shopcart') {
        url = '/cart?m_id=' + m_id;
      } else if (item.linkUrl == 'order') {
        url = '/list/order?m_id=' + m_id;
      } else if (item.linkUrl == 'groupbooking') {
        url = '/group/orderList?m_id=' + m_id;
      } else if (item.linkUrl == 'coupon') {
        url = '/coupons/member?m_id=' + m_id;
      } else if (item.linkUrl == 'receivecoupons') {
        url = '/coupons/list?m_id=' + m_id;
      } else if (item.linkUrl == 'accountcenter') {
        url = '/member/user?m_id=' + m_id;
      } else if (item.linkUrl == 'ticket') {
        url = '/vue/list/ticket?m_id=' + m_id;
      } else if (item.linkUrl == 'guide') {
        url = '/vue/list/guide?m_id=' + m_id;
      } else if (item.linkUrl == 'tickets') {
        url = '/vue/list/tickets?m_id=' + m_id;
      } else if (item.linkUrl == "cloud_repast") {
        url = "/vue/list/rmsRepast?m_id=" + m_id;  
      } else if (item.linkUrl == 'hotel') {
        url = '/list/hotel?m_id=' + m_id;
      } else if (item.linkUrl == "pmsHotel") {
        url = "/list/pmsHotel?m_id=" + m_id;
        router.push(url);
        return false;
      } else if (item.linkUrl == "shop") {
        url = "/list/shop?m_id=" + m_id;
      } else if (item.linkUrl == "repast") {
        url = "/list/repast?m_id=" + m_id;
      } else if (item.linkUrl == "route") {
        url = "/list/route?m_id=" + m_id;
      } else if (item.linkUrl == "strategy") {
        let arr = [];
        if (item.strategyArr) {
          arr = item.strategyArr.map(item => item.key);
        }
        if (arr.length) {
          url =
            "/vue/list/strategy?strategyTypeIds=" +
            arr.join(",") +
            "&m_id=" +
            m_id;
        } else {
          url = "/vue/list/strategy?m_id=" + m_id;
        }
      } else if (item.linkUrl == "custompage") {
        // url = '/custompage?id=' + item.customPageId + '&m_id=' + m_id;
        this.$router.push("/custompage?id=" + item.customPageId);
      } else if (item.linkUrl == "customtel") {
        window.location.href = "tel:" + item.customTel;
      } else if (item.linkUrl == "customlink") {
        // url = item.customLinkurl;
        let reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
        if (reg.test(item.customLinkurl)) {
          window.location.href = item.customLinkurl;
        } else {
          let strUrl = "//" + item.customLinkurl;
          window.location.href = strUrl;
        }
        return;
      } else if (item.linkUrl == "publicservice") {
        this.getAxios(api.main.marketing.selectServiceUse, {
            serviceType: "guide"
          })
          .then(response => {
            if (response.status == "200" && response.data.guide) {
              this.getAxios(api.main.merchant.gotoPublic, {
                  merchantId: m_id
                })
                .then(res => {
                  if (res.status == 200) {
                    // window.location.href = "http://pubswap.sendinfo.com.cn/publicMap/index/?acc=" + res.message
                    window.location.href =
                      "//pubswap.zhiyoubao.com/publicMap/index/?acc=" +
                      res.message;
                    // window.location.href = pubUrl + '/publicMap/index/?acc=' + res.message;
                  } else {
                    console.log("没找到手机号码");
                  }
                })
                .catch(e => {
                  console.log(e);
                });
            } else {
              this.$vux.alert.show({
                title: "",
                content: "你还没有购买此服务或者你购买的此服务已过期"
              });
            }
          })
          .catch(e => {
            console.log(e);
          });
        return;
      } else if (item.linkUrl == "parkcard") {
        this.getAxios(api.main.marketing.selectServiceUse, {
            serviceType: "gynk"
          })
          .then(res => {
            if (res.status == 200 && res.data.gynk) {
              window.location.href = baseUrl + "/list/yearcard?m_id=" + m_id;
            } else {
              this.$vux.alert.show({
                title: "",
                content: "你还没有购买此服务或者你购买的此服务已过期"
              });
            }
          })
          .catch(e => {
            console.log(e);
          });
        return;
      } else if (item.linkUrl == "theater") {
        this.getAxios(api.main.marketing.selectServiceUse, {
            serviceType: "theater"
          })
          .then(res => {
            if (res.status == 200 && res.data.theater) {
              window.location.href = baseUrl + "/list/theater?m_id=" + m_id;
            } else {
              this.$vux.alert.show({
                title: "",
                content: "你还没有购买此服务或者你购买的此服务已过期"
              });
            }
          })
          .catch(e => {
            console.log(e);
          });
        return;
      } else if (item.linkUrl == "ai_p") {
        this.$vux.alert.show({
          title: "",
          content: "暂未开放"
        });
        return;
      } else if (item.linkUrl == "information") {
        // 中台-cms 自定义链接
        // 获取企业码
        this.getAxios("/merchant/api/merchantInfo/getCorpCode", {
            merchantInfoId: m_id
          })
          .then(res => {
            if (res.status == 200) {
              let corpcode = res.message;
              if (item.columnId && item.columnId.length)
                window.location.href =
                "//pubswap.zhiyoubao.com/wap/#/news?colId=" +
                item.columnId[item.columnId.length - 1] +
                "&corpCode=" +
                corpcode;
            } else {
              this.$vux.alert.show({
                title: "",
                content: res.message
              });
            }
          })
          .catch(e => {
            console.log(e);
          });
        return;
      }
      if (url) {
        window.location.href = baseUrl + url;
      }
    },
    getSingleAxios() {
      let leaguerId = localStorage.getItem("xjsc_login_userId_2019_3_8") || this.$cookie.get("leaguerInfoId")
      let merchantInfoId = localStorage.getItem('xjsc_vue_2018_12_19_mid')
      return this.getAxios(`/merchant/api/merchantWholeMarket/getOpenSingle`)
    }
  },
});

//用于加载图片失败情况的指令
Vue.directive("error-img", async function (el, binding) {
  if (el.src) return;
  //初始化设置加载默认失败时图片
  el.src = require("./assets/images/none_img.jpg");
  let imgURL = binding.value; //获取图片地址
  if (imgURL) {
    let exist = await imageIsExist(imgURL);
    if (exist) {
      el.setAttribute("src", imgURL);
    }
  }
});

/* eslint-disable no-new */
const Vm = new Vue({
  el: "#app",
  store,
  router,
  components: {
    App
  },
  template: "<App/>"
});

export default Vm;
