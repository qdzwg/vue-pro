<template>
  <div class="member-wrap">
    <div v-if="contentShow">
      <div class="member-banner">
        <template v-if="show">
          <div class="bg-img">
            <img :src="memberData.contentData.imgUrl?memberData.contentData.imgUrl:personCenterBg?personCenterBg:'http://statics.lotsmall.cn/wx/img/default-memberbg.jpg'" />
          </div>
          <div class="member-info"
               v-bind:style="{textAlign:memberData.contentData.position}">
            <p class="member-name">{{userInfo.nickName}}</p>
            <p class="member-touxiang"
               :class="{fl:memberData.contentData.position=='left',fr:memberData.contentData.position=='right',cer:memberData.contentData.position=='center'}"
               @click="goUrl('user')">
              <img :src="userInfo.avatarUrl" />
            </p>
          </div>
        </template>
        <!-- <template v-else>
        <button open-type="getUserInfo" @getuserinfo='getUserInfo'>授权</button>
        </template>-->
      </div>
      <!-- <button @click="goUrl('pages/testpage/list/main')">艾比入口</button> -->
      <div>
        <grid>
          <grid-item>
            <div @click="goPath('/personal/balance')">
              <div>余额</div>
              <div>0.00</div>
            </div>
          </grid-item>
          <grid-item>
            <div>积分</div>
            <div>0</div>
          </grid-item>
          <grid-item>
            <div>会员等级</div>
            <div>注册会员</div>
          </grid-item>
        </grid>
      </div>
      <div class="member-nav boxshadow">
        <p class="my-order">我的订单</p>
        <div class="nav-ul">
          <div class="nav-li"
               @click="goswitchTab('all')">
            <img src="http://statics.lotsmall.cn/wx/img/order-icon.png"
                 class="order-icon" />
            <p class="order-text nav-li-text">全部订单</p>
          </div>
          <div class="nav-li"
               @click="goswitchTab('WAIT_PAY')">
            <img src="http://statics.lotsmall.cn/wx/img/fukuan-icon.png"
                 class="fukuan-icon" />
            <p class="fukuan-text nav-li-text">待付款</p>
          </div>
          <div class="nav-li"
               @click="goswitchTab('WAIT_CONSUME')">
            <img src="http://statics.lotsmall.cn/wx/img/xiaofei-icon.png"
                 class="xiaofei-icon" />
            <p class="xiaofei-text nav-li-text">待消费</p>
          </div>
          <div class="nav-li"
               @click="goswitchTab('FINISH')">
            <img src="http://statics.lotsmall.cn/wx/img/gouxuan-icon.png"
                 class="gouxuan-icon" />
            <p class="gouxuan-text nav-li-text">已完成</p>
          </div>
          <div class="nav-li"
               @click="goswitchTab('REFUNDING')">
            <img src="http://statics.lotsmall.cn/wx/img/shouhou-icon.png"
                 class="shouhou-icon" />
            <p class="shouhou-text nav-li-text">售后</p>
          </div>
        </div>
      </div>

      <!-- <div class="member-item boxshadow clearfix" @click="goUrl('pages/member/group/main')">
            <span class="item-title">我的拼团</span>
            <img src="http://statics.lotsmall.cn/wx/img/arrow-left-icon.png" class="arrow-left-icon">
      </div>-->
      <div class="coupons-box boxshadow">
        <div class="coupons-ul">
          <div class="coupons-li clearfix"
               @click="goUrl('youhuiquan')">
            <span class="item-title">我的优惠券</span>
            <img src="http://statics.lotsmall.cn/wx/img/arrow-left-icon.png"
                 class="arrow-left-icon">
          </div>
          <div class="coupons-li clearfix"
               @click="goUrl('receiveCoupon')">
            <span class="item-title">领取优惠券</span>
            <img src="http://statics.lotsmall.cn/wx/img/arrow-left-icon.png"
                 class="arrow-left-icon">
          </div>
          <div class="coupons-li clearfix"
               @click="goUrl('contacts')">
            <span class="item-title">常用联系人</span>
            <img src="http://statics.lotsmall.cn/wx/img/arrow-left-icon.png"
                 class="arrow-left-icon">
          </div>
          <div v-if="showWholeMarket==='T'"
               class="coupons-li clearfix"
               @click="salesPromotion()">
            <span v-if="qyyxFlag==='T'"
                  class="item-title">去推广</span>
            <span v-else
                  class="item-title">成为推广员</span>
            <img src="http://statics.lotsmall.cn/wx/img/arrow-left-icon.png"
                 class="arrow-left-icon">
          </div>
          <div class="coupons-li clearfix"
               @click="goUrl('electronicInvoices')">
            <span class="item-title">电子发票</span>
            <img src="http://statics.lotsmall.cn/wx/img/arrow-left-icon.png"
                 class="arrow-left-icon">
          </div>
          <div class="coupons-li clearfix"
               @click="goUrl('yearcard')">
            <span class="item-title">公园年卡</span>
            <img src="http://statics.lotsmall.cn/wx/img/arrow-left-icon.png"
                 class="arrow-left-icon">
          </div>
          <div class="coupons-li clearfix"
               @click="getout">
            <span class="item-title">退出登录</span>
            <img src="http://statics.lotsmall.cn/wx/img/arrow-left-icon.png"
                 class="arrow-left-icon">
          </div>
        </div>
      </div>

      <!-- <div class="member-item boxshadow" @click="goUrl('pages/paymentFail/main')">
            <span class="item-title">支付失败</span>
      </div>-->
      <!-- <div class="h49"></div> -->
    </div>
    <!-- <vue-tab-bar v-if="componentShow" :pageData="navigationData" @fetch-index="clickIndexNav" :selectNavIndex="selectNavIndex"></vue-tab-bar> -->
    <vue-tab-bar v-if="componentShow"
                 :pageData="navigationData"></vue-tab-bar>
    <float-nav></float-nav>
  </div>
</template>
<script>
import axios from "axios";
import { qyyxUrl } from "./../../../config/index";
import { isWxAli } from "@/common/common";
import vueTabBar from "@/components/custompage/customComponent/vueTabBar";
import preCustompage from "@/components/preCustompage";
import fixedTemplate from "@/components/fixedTemplate"; //底部导航
import floatNav from "@/components/floatNav";
import { Grid, GridItem } from "vux";
import vueCookie from "vue-cookie"
export default {
  components: {
    Grid,
    GridItem,
    floatNav,
    vueTabBar,
    preCustompage,
    fixedTemplate,
  },
  data() {
    return {
      templateCode: "", //固定模板code
      comList: [],
      preComList: [],
      show: false,
      userInfo: {},
      personCenterBg: "",
      navigationData: {},
      selectNavIndex: 2,
      memberData: {},
      componentShow: false,
      contentShow: false,
      url: "",
      qyyxFlag: "",
      showWholeMarket: "",
      marketDisAccount: "",
    }
  },
  created() {
    document.title = "个人中心"
    let _this = this
    let tUrl = this.api.member.info
    this.getAxios(tUrl, {}).then(res => {
      _this.userInfo = res.data
      this.qyyxFlag = res.data.qyyxFlag
      _this.show = true
    })

    this.getAxios(this.api.aiPapi.getUsePage, {
      pageType: "navigationPage",
      useRange: "small",
    }).then(res => {
      this.navigationData = JSON.parse(res.data.content)
      localStorage.setItem("getNavigationData", res.data.content)
      this.componentShow = true
    })
    this.getAxios(this.api.aiPapi.getUsePage, {
      pageType: "centerPage",
      useRange: "small",
    }).then(res => {
      this.memberData = JSON.parse(res.data.content)
      this.contentShow = true
      // console.log(this.memberData);
    })

    this.getAxios(this.api.main.merchant.showWholeMarket).then(res => {
      this.showWholeMarket = res.message
    })
    this.getAxios(this.api.main.merchant.getCorpCode).then(res => {
      // console.log(res);
      this.marketDisAccount = res.data.marketDisAccount
    })
    // this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      let _this = this
      // 查看是否授权
      wx.getSetting({
        success: function(res) {
          if (res.authSetting["scope.userInfo"]) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: function(res) {
                _this.userInfo = res.userInfo
                _this.show = true
              },
            })
          } else {
            wx.setStorageSync("xjsc_2018_order_url_asds", getCurrentPages().pop().__route__)
            wx.reLaunch({
              url: "/pages/authorization/main",
            })

            // wx.redirectTo({
            //   url: "/pages/authorization/main"
            // });
          }
        },
      })
    },
    goUrl (path) {
      if (path == "contacts") {
        this.$router.push("/personal/contacts")
      } else if (path == "receiveCoupon") {
        this.$router.push("/personal/receiveCoupon")
      } else if (path == "youhuiquan") {
        this.$router.push("/personal/myCoupon")
      } else if (path == "user") {
        this.$router.push("/personal/userInfo")
      } else if (path == "yearcard") {
        this.$router.push("/yearcard")
      } else if (path == "electronicInvoices") {
        this.$router.push("/invoiceList")
      }
    },
    goswitchTab(state) {
      this.$router.push({path: "/orderList", query: {name: state}})
      localStorage.setItem("wxxjsc_orderstate_2019_9_18", state)

      //   wx.navigateTo({
      //     url: "/pages/member/order/main"
      //   });
    },
    getout() {
      this.getAxios(this.api.member.logout).then(res => {
        if (res.status == 200) {
          localStorage.removeItem("xjsc_login_access_token_2019_3_7")
          localStorage.removeItem("xjsc_login_userId_2019_3_8")
          this.$nextTick(() => {
            this.$router.push("/login")
          }, 500)
        }
      })
    },
    salesPromotion() {
      let env = isWxAli()
      let flag = null
      if (env.isWx) {
        flag = "1"
      } else if (env.isAliPay) {
        flag = "2"
      } else {
        flag = "3"
      }
      let data = {
        flag,
        corpCode: this.marketDisAccount, //req.session.merchantInfo.code
        openId: localStorage.getItem("xjsc_login_userId_2019_3_8"),
        ixmgUrl: "",
        merchantInfoId: localStorage.getItem("xjsc_vue_2018_12_19_mid"),
      }
      if (this.qyyxFlag != "T") {
        this.getAxios(this.api.member.qyyxOper).then(res => {})
      }

      axios
        .get((process.env.NODE_ENV === 'production' ? 'http://qyyxcs.sendinfo.com.cn' : 'qy') + "/wap/enterPromote.htm", {
          params: data
        })
        .then((response) => {
          window.location.href =
            "http://qyyxcs.sendinfo.com.cn/wap/loginWapAuthor.htm?username=" +
            response.username +
            "&password=" +
            response.password +
            "&redirectUrl=" +
            window.location.href.split("#")[0];
        });
      //   this.getAxios("qy/wap/enterPromote.htm",{params:data} ).then(res => {
      //       if(res.success){
      //           window.location.href =  'http://192.168.200.40:8180/wap/loginWapAuthor.htm?username='
      //                 + res.username+'&password='+res.password
      //                     + '&redirectUrl=' +window.location.href.split('#')[0];
      //       }
      //       console.log(res)
      //   });
    },
  },
}
</script>
<style lang="scss">
.member-wrap {
  width: 100%;
  height: 100%;
  position: relative;
  .member-banner {
    width: 100%;
    position: relative;
    // background-color: #fff;
    .bg-img {
      width: 100%;
      height: 159px;
      z-index: 1;
      img {
        width: 100%;
        height: 100%;
      }
    }

    .member-info {
      position: absolute;
      top: 23px;
      width: 100%;
      text-align: center;
      z-index: 2;
      .member-name {
        height: 45px;
        line-height: 45px;
        color: #fff;
        font-weight: bold;
        font-size: 18.5px;
      }
      .member-touxiang {
        width: 59.5px;
        height: 59.5px;
        background-color: #fff;
        border-radius: 50%;
        padding: 2px;
        text-align: center;
        // margin: 0 auto;
        image {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .cer {
        margin: 0 auto;
      }
    }
  }
  .member-nav {
    width: 100%;
    background-color: #fff;
    .my-order {
      font-size: 14px;
      color: #413838;
      height: 23px;
      line-height: 23px;
      font-weight: bold;
      padding: 15px;
    }
    .nav-ul {
      width: 100%;
      display: flex;
      .nav-li {
        flex: 1;
        text-align: center;
        .order-icon {
          width: 18px;
          height: 20px;
          vertical-align: middle;
        }
        .fukuan-icon {
          width: 19px;
          height: 20px;
          vertical-align: middle;
        }
        .xiaofei-icon {
          width: 25px;
          height: 20px;
          vertical-align: middle;
        }
        .gouxuan-icon {
          width: 19.5px;
          height: 20px;
          vertical-align: middle;
        }
        .shouhou-icon {
          width: 22.5px;
          height: 20px;
          vertical-align: middle;
        }
        .nav-li-text {
          font-size: 12px;
          color: #5c5c5c;
          margin-top: 6px;
          margin-bottom: 20px;
        }
      }
    }
  }
  .member-item {
    height: 53px;
    line-height: 53px;
    margin-top: 10px;
    background-color: #fff;
    .item-title {
      margin-left: 15px;
      font-size: 14px;
      color: #413838;
      float: left;
    }
    .arrow-left-icon {
      width: 5px;
      height: 10px;
      float: right;
      margin-top: 22px;
      margin-right: 13px;
    }
  }
  .coupons-box {
    margin-top: 10px;
    padding-bottom: 69px;
    //  background-color: #fff;
    .coupons-ul {
      .coupons-li {
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
  }
}
</style>
