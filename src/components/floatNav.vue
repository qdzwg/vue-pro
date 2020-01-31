<template>
  <div class="float-contain">
    <div class="float-page">
      <div v-if="listShow"
           @click="hide"
           class="float-mask"></div>
      <div :style="{top:yPum+'px',left:xPum+'px'}"
           ref="floatNav"
           @click="show"
           @mousedown="down"
           @touchstart="down"
           @mousemove="move"
           @touchmove="move"
           @mouseup="end"
           @touchend="end"
           class="float-box"
           id="moveDiv">
        <div class="img-box">
          <img v-show="!listShow"
               class="bg-img"
               src="../assets/images/my_face_bg.png"
               alt />
          <template v-show="!listShow">
            <img v-if="userImg"
                 class="default-logo"
                 :src="userImg"
                 alt />
            <img v-else
                 class="default-logo"
                 src="../assets/images/defaultFace.jpg"
                 alt />
          </template>

          <div class="default-icon"
               :class="{'icon-open':listShow}">
            <i class="xx-icon icon-guanbi1"></i>
          </div>
          <div v-if="!listShow"
               class="my-text">我的</div>
          <ul class="list"
              :class="{open:listShow,'is-top':topFlag,'is-right':rightFlag}">
            <li v-if="qyyxFlag"
                @click.stop="goQyyx"
                class="item clearfix">
              <div class="icon fr">
                <i class="xx-icon icon-qiandai"></i>
              </div>
              <span class="text fr">全员营销</span>
            </li>
            <li @click.stop="goHome"
                class="item clearfix">
              <div class="icon fr">
                <i class="xx-icon icon-shouye"></i>
              </div>
              <span class="fr text">首页</span>
            </li>
            <li @click.stop="goCenter"
                class="item clearfix">
              <div class="icon fr">
                <i class="xx-icon icon-member"></i>
              </div>
              <span class="fr text">个人中心</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 是否需要创建全员账号 -->
    <div class="promote-limit"
         v-if="isShowFlag"
         @click="close">
      <div class="limit">
        <h3 class="title">推广员招募令</h3>
        <div class="contain">
          <p class="title-desc mb">邀请好友购买产品并核销完成后，即可赚取对应推广佣金!多推多赚,上不封顶</p>
          <div class="item"
               v-if="keybindingFlag">
            <span class="left-icon">NEW</span>
            <p class="main"
               @click="bindPromoter">
              <span class="name">一键成为推广员</span>
              <span class="desc">自动生成推广账号,降低门槛</span>
            </p>
            <i class="xx-icon icon-iconfont-jiantou"></i>
          </div>
          <div class="item vip"
               v-if="bindPromoterFlag"
               @click="createdBind">
            <span class="left-icon">VIP</span>
            <p class="main">
              <span class="name">绑定全员营销账号</span>
              <span class="desc">绑定已有账号,同步推广数据</span>
            </p>
            <i class="xx-icon icon-iconfont-jiantou"></i>
          </div>
        </div>
      </div>
      <div class="close"
           @click="close">
        <span class="vux-close"></span>
      </div>
    </div>
  </div>

</template>
<script>
import axios from "axios";
import { isWxAli } from "@/common/common";
import { linkBaseUrl, baseUrl, qyyxUrl } from "../../config/index";
import vueCookie from "vue-cookie";
export default {
  props: {
    left: {
      type: String | Number,
      default: 270
    },
    top: {
      type: String | Number,
      default: 100
    }
  },
  data () {
    return {
      qyyxFlag: false,
      userImg: "",
      topFlag: false,
      listHeight: 250,
      widthHeight: 115,
      listShow: false,
      distance: 10,
      innerHeight: 0,
      flags: false,
      position: { x: 0, y: 0 },
      nx: "", //x移动距离
      ny: "", //y移动距离
      dx: "",
      dy: "",
      xPum: this.left,
      yPum: this.top,
      screenHeight: window.screen.height,
      screenWidth: window.screen.width,
      keybindingFlag: false,
      bindPromoterFlag: false,
      isShowFlag: false
    };
  },
  created () {
    axios
      .get(
        baseUrl +
        this.api.main.merchant.getCorpCode +
        "?merchantInfoId=" +
        localStorage.getItem("xjsc_vue_2018_12_19_mid"),
        {}
      )
      .then(res => {
        this.marketDisAccount =
          res.data && res.data.marketDisAccount
            ? res.data.marketDisAccount
            : "";
      });
    this.getAxios("/merchant/api/merchantInfo/showQyTab", {
      leaguerInfoId: localStorage.getItem("xjsc_login_userId_2019_3_8") ||
        this.$cookie.get("leaguerInfoId") ||
        ""
    }).then(res => {
      this.qyyxFlag = res.message == "T";
    });
    axios
      .get(
        baseUrl +
        "/leaguer/api/userLeaguer/manage/leaguerInfo?merchantInfoId=" +
        localStorage.getItem("xjsc_vue_2018_12_19_mid"),
        {}
      )
      .then(
        res => {
          //是否展示推广
          this.userImg = res.data && res.data.headImg ? res.data.headImg : "";
          // this.qyyxFlag = res.data.qyyxFlag === 'T';
        },
        error => {
          this.userImg = "";
        }
      );
  },
  computed: {
    rightFlag () {
      return this.xPum <= this.widthHeight;
    }
  },
  mounted () {
    let _this = this;
    _this.innerHeight = _this.getInnerHeight();
    this.floatNavWidth = this.$refs.floatNav.offsetWidth;
    this.floatNavHeight = this.$refs.floatNav.offsetHeight;
    window.addEventListener("scroll", function () {
      _this.innerHeight = _this.getInnerHeight();
    });
  },
  methods: {
    salesPromotion () {
      let env = isWxAli();
      let flag = null;
      if (env.isWx) {
        flag = "1";
      } else if (env.isAliPay) {
        flag = "2";
      } else {
        flag = "3";
      }
      let data = {
        flag,
        corpCode: this.marketDisAccount, //req.session.merchantInfo.code
        openId:
          localStorage.getItem("xjsc_login_userId_2019_3_8") ||
          vueCookie.get("leaguerInfoId"),
        ixmgUrl: "",
        merchantInfoId: localStorage.getItem("xjsc_vue_2018_12_19_mid")
      };
      if (!this.qyyxFlag) {
        this.getAxios(this.api.member.qyyxOper).then(res => { });
      }

      axios.get(qyyxUrl + "/wap/enterPromote.htm", {
        headers: {},
        params: data
      }).then(response => {
        window.location.href =
          qyyxUrl +
          "/wap/loginWapAuthor.htm?username=" +
          response.username +
          "&password=" +
          response.password +
          "&redirectUrl=" +
          encodeURIComponent(window.location.href);
      });
    },
    goHome () {
      if (this.listShow) {
        this.go("/");
      }
    },
    goCenter () {
      //如果已经登录，跳转个
      if (this.listShow) {
        let url =
          document.location.protocol +
          "//" +
          window.location.host +
          "/member?m_id=" +
          localStorage.getItem("xjsc_vue_2018_12_19_mid");
        this.checkToken(url).then(res => {
          window.location.href = url;
        });
      }
    },
    /**
     * 只有一件创建推广员时不展示，默认创建；
     * @binded : 是否绑定推广员
     * @corpAllowBindPromoter : 是否允许企业绑定推广员
     * @AllowUpPromoter : 是否允许游客成为推广员
     * @pagePromoterFlag ：区分是页面中推广员还是小球中推广员的逻辑
     * @flag :默认false页面中全员营销逻辑，否则是小球逻辑
     */
    goQyyx (flag = false) {
      return new Promise(async (resolve, reject) => {
        let checkInfo = await this.postAxios('leaguer/api/promoter/checkUserPromoter')
        if (checkInfo.status === 200 && !checkInfo.data.binded) {
          let corpConfig = await this.postAxios('leaguer/api/promoter/getCorpConfig')
          if (corpConfig.status !== 200) return
          let corpConfigInfo = corpConfig.data
          let corpAllowBindPromoter = corpConfigInfo.corpAllowBindPromoter
          let AllowUpPromoter = corpConfigInfo.corpAllowUpPromoter
          this.isShowFlag = corpAllowBindPromoter
          if (corpAllowBindPromoter && AllowUpPromoter) {
            this.keybindingFlag = this.bindPromoterFlag = true
          } else if (corpAllowBindPromoter && !AllowUpPromoter) {
            this.keybindingFlag = false
            this.bindPromoterFlag = true
          } else if (!corpAllowBindPromoter && AllowUpPromoter) {
            this.bindPromoterFlag = false
            this.keybindingFlag = true
            this.bindPromoter()
          } else if (!corpAllowBindPromoter && !AllowUpPromoter) {
            this.keybindingFlag = this.bindPromoterFlag = false
            this.$vux.toast.text('未拥有全员营销账号，当前店铺不允许注册与绑定全员营销', 'top')
          }
        } else if (checkInfo.status == 200 && checkInfo.data.binded) {
          this.keybindingFlag = this.bindPromoterFlag = false
          if (flag) {
            //小球全员逻辑
            this.hide()
            this.salesPromotion();
          } else {
            //执行已绑定全员详情页面中逻辑
            resolve(true)
          }
        }
      })
    },
    hide () {
      this.listShow = false;
      this.topFlag = false;
    },
    show () {
      // console.log(this.xPum);
      // console.log(this.yPum);
      if (this.yPum <= this.innerHeight - this.listHeight) {
        // console.log("下弹");
        this.topFlag = false;
      } else {
        // console.log("上弹");
        this.topFlag = true;
      }
      // if (this.xPum <= this.widthHeight) {
      //   console.log("右弹");
      //   this.rightFlag = true;
      // } else {
      //   console.log("左弹");
      //   this.rightFlag = false;
      // }
      this.$nextTick(() => {
        this.listShow = !this.listShow;
        // this.topFlag = this.listShow;
      });
    },
    getInnerHeight () {
      if (window.innerHeight != undefined) {
        return window.innerHeight;
      } else {
        let B = document.body,
          D = document.documentElement;
        return Math.min(D.clientHeight, B.clientHeight);
      }
    },
    down (event) {
      this.flags = true;
      let touch;
      if (event.touches) {
        touch = event.touches[0];
      } else {
        touch = event;
      }
      // console.log(this.$refs.women,this.$refs.floatNav.offsetLeft,this.$refs.floatNav.offsetTop);
      this.position.x = touch.clientX || event.changedTouches[0].clientX;
      this.position.y = touch.clientY || event.changedTouches[0].clientY;
      this.dx = this.$refs.floatNav.offsetLeft;
      this.dy = this.$refs.floatNav.offsetTop;
    },
    move (event) {
      // console.log(event);
      if (this.flags && !this.listShow) {
        var touch;
        if (event.touches) {
          touch = event.touches[0];
        } else {
          touch = event;
        }
        this.nx = touch.clientX - this.position.x;
        this.ny = touch.clientY - this.position.y;
        this.xPum = this.dx + this.nx;
        this.yPum = this.dy + this.ny;
        event.preventDefault();
      }
    },
    end () {
      this.flags = false;
      if (this.xPum < 0) {
        this.xPum = this.distance;
      }
      if (this.yPum < 0) {
        this.yPum = this.distance;
      }
      if (this.xPum > this.screenWidth - this.floatNavWidth) {
        this.xPum = this.screenWidth - this.distance - this.floatNavWidth;
      }
      if (
        this.yPum >
        this.screenHeight -
        this.floatNavHeight -
        (this.screenHeight - this.innerHeight)
      ) {
        this.yPum =
          this.screenHeight -
          this.distance -
          this.floatNavHeight -
          (this.screenHeight - this.innerHeight);
      }
    },
    close () {
      this.isShowFlag = this.keybindingFlag = this.bindPromoterFlag = false
    },
    //创建新账号绑定
    bindPromoter () {
      this.postAxios('leaguer/api/promoter/createUserAuth', { accType: 3 }).then(res => {
        if (res.status === 200) {
          this.salesPromotion()
        }
      })
    },
    //已有账号绑定
    createdBind () {
      let url = linkBaseUrl + '/marketing?m_id=' + localStorage.getItem('xjsc_vue_2018_12_19_mid')
      window.location.href = url
    },
    //企业是否允许绑定
    firmIsAllowBind () {
      // this.postAxios('leaguer/api/promoter/MerchantQyyxRpcBiz').then(res => {
      //   console.log(res)
      // })
    }
  }
};
</script>

<style lang="scss" scoped>
.float-page {
  .float-mask {
    position: fixed;
    z-index: 998;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
  }
  .float-box {
    position: fixed;
    z-index: 999;
    .x-num {
      top: 0;
      left: -50px;
      position: absolute;
    }
    .y-num {
      left: 0;
      top: -50px;
      position: absolute;
    }
    .img-box {
      position: relative;
      // background-image: url();
      // background-size: 100% 100%;
      height: 57px;
      width: 87px;
      display: flex;
      align-items: center;
      .bg-img {
        height: 100%;
        width: 100%;
      }
      .default-logo {
        position: absolute;
        left: 16px;
        bottom: 6px;
        margin: 0 auto;
        height: 45px;
        width: 45px;
        border-radius: 50%;
        z-index: 101;
      }
      .default-icon {
        position: absolute;
        z-index: 102;
        left: 16px;
        bottom: 6px;
        height: 45px;
        width: 45px;
        border-radius: 50%;
        background: #f90;
        text-align: center;
        opacity: 0;
        transition: all 2s;
        -webkit-transition: all 0.5s; /* Safari */
        transform: scale(1) rotate(0deg);
        &.icon-open {
          opacity: 1;
          transform: scale(1) rotate(360deg);
        }
        i {
          font-size: 24px;
          line-height: 45px;
          color: #fff;
          font-weight: bold;
        }
      }
      .my-text {
        position: absolute;
        left: 16px;
        bottom: -6px;
        z-index: 300;
        height: 16px;
        line-height: 16px;
        font-size: 11px;
        color: #fff;
        background: #ffba00;
        width: 45px;
        text-align: center;
        border-radius: 8px;
        &.test {
          transform: translateX(100px);
        }
      }
      .list {
        list-style: none;
        .item {
          width: 115px;
          opacity: 0;
          position: absolute;
          right: 27px;
          top: 0;
          transition: all 0.5s;
          -webkit-transition: all 0.5s; /* Safari */
          .icon {
            margin-left: 5px;
            width: 45px;
            height: 45px;
            text-align: center;
            background: #f90;
            border-radius: 50%;
            i {
              font-size: 24px;
              line-height: 45px;
              color: #fff;
              font-weight: bold;
            }
          }
          .text {
            display: inline-block;
            height: 45px;
            line-height: 45px;
            font-size: 14px;
            color: #413838;
          }
        }
        &.open {
          .item {
            opacity: 1;
          }
          .item:nth-child(1) {
            transform: translateY(70px);
          }
          .item:nth-child(2) {
            transform: translateY(140px);
          }
          .item:nth-child(3) {
            transform: translateY(210px);
          }
          &.is-top {
            .item:nth-child(1) {
              transform: translateY(-70px);
            }
            .item:nth-child(2) {
              transform: translateY(-140px);
            }
            .item:nth-child(3) {
              transform: translateY(-210px);
            }
          }
        }
        &.is-right {
          .item {
            right: -38px;
            .icon {
              float: left;
              margin-right: 5px;
            }
            .text {
              float: left;
            }
          }
        }
      }
    }
  }
}
.promote-limit {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1999;
  .limit {
    width: 315px;
    // height: 347px;
    margin: 95px auto 0;
    padding-bottom: 15px;
    background-color: #f7f7f7;
    border-radius: 6px;
    .title {
      font-size: 56px;
      line-height: 56px;
      color: #413838;
      text-align: center;
      font-size: 15px;
      background-color: #fff;
      border-bottom: 1px solid #e1e1e1;
    }
    .title-desc {
      padding-top: 14px;
      font-size: 13px;
      line-height: 25px;
      color: #413838;
      background-color: #f7f7f7;
    }
    .contain {
      margin: 0 15px;
      .mb {
        margin-bottom: 20px;
      }
      .item {
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 81px;
        padding-left: 15px;
        background-color: #fff;
        border-radius: 4px;
        .left-icon {
          width: 60px;
          height: 60px;
          border-radius: 30px;
          background-color: #009ded;
          text-align: center;
          line-height: 60px;
          color: #fff;
          font-size: 14px;
        }
        .main {
          flex: 1;
          padding: 15px 0 15px 10px;
          span {
            display: block;
            color: #999999;
          }
          .name {
            font-size: 15px;
            line-height: 25px;
            margin-bottom: 3px;
            color: #009ded;
          }
          .desc {
            font-size: 13px;
            line-height: 23px;
            background: #fff;
          }
        }
        .icon-iconfont-jiantou {
          width: 18px;
          padding-right: 10px;
        }
      }
      .vip {
        margin-top: 15px;
        .left-icon {
          background-color: #eb5c56;
        }
        .name {
          color: #eb5c56;
        }
      }
    }
  }
  .close {
    display: flex;
    justify-content: center;
    margin-top: 24px;
  }
  .vux-close {
    position: relative;
    color: #999;
    width: 24px;
    height: 24px;
    &:before,
    &:after {
      content: "";
      position: absolute;
      left: 0;
      top: 11px;
      width: 24px;
      height: 1px;
      background-color: #ffffff;
      transform: rotate(-45deg);
    }
    &:after {
      transform: rotate(45deg);
    }
  }
}
</style>


