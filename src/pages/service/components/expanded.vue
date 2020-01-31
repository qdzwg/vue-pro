<template>
  <div class="market-page">
    <div @click="shareBox">
      <div class="market-icon">
        <i class="xx-icon icon-fukuan"></i>
      </div>推广
    </div>
    <div class="share-content-box" v-show="shareShow" @click.stop>
      <h4 class="share-content-title">
        推广
        <span class="close" @click="close">
          <i class="xx-icon icon-guanbi1"></i>
        </span>
      </h4>
      <ul class="share-content-main">
        <li @click="createLink" v-if="wxFlag">生成链接</li>
        <li v-else ref="copy" :data-clipboard-text="shareInfo.proUrl">生成链接</li>
        <li v-if="shareInfo.imgUrl" @click="createPoster">生成海报</li>
      </ul>
    </div>
    <x-dialog v-model="show" hide-on-blur @on-hide="dialogHide" class="share-dialog">
      <div class="img-box">
        <img :src="shareInfo.imgUrl" style="max-width:100%">
      </div>
      <div @click="show=false">
        <span class="vux-close"></span>
      </div>
    </x-dialog>
  </div>
</template>
<script>
import { XDialog } from "vux";
import { wxShare } from "@/common/wxshare";
import { isWxAli } from "@/common/common";
import { baseUrl } from "../../../../config/index";
import axios from "axios"
export default {
  data() {
    return {
      wxFlag: false,
      shareShow: false,
      shareInfo: { proUrl: "" },
      show: false,
      copyBtn: null
    };
  },
  props: ["param", "wxshareinfo"],
  components: {
    XDialog
  },
  created() {
    let env = isWxAli();
    this.wxFlag = env.isWx;
  },
  mounted() {
    let _this = this;
    if (!this.wxFlag) {
      this.copyBtn = new this.clipboard(this.$refs.copy);
      this.copyBtn.on("success", e => {
        this.$vux.toast.text("复制链接成功！快分享给小伙伴吧~");
        // clipboard.destroy()
      });
      this.copyBtn.on("error", e => {
        this.$vux.toast.text("复制链接失败！工程师正在加紧修复~");
        // clipboard.destroy()
      });
    }
  },
  methods: {
    shareBox() {
      // console.log(this.param)
      // let url = this.api.main.merchant.getQyyxPromoteBar
      this.getAxios(
        "/merchant/api/merchantWholeMarket/getQyyxPromoteBar",
        this.param
      )
        .then(res => {
          if (res.status === 200) {
            this.shareShow = true;
            this.shareInfo = res.data;
            // console.log(res.data.proUrl.split("?")[1])
            let objStr = res.data.proUrl.split("?")[1]
            let code = objStr.split("=")[1]
            console.log(code)
            this.shareLink = window.location.href + "&spread_code=" + code
          } else {
            this.$vux.alert.show({
              title: "",
              content: result.message
            });
          }
        })
        .catch(err => {});
    },
    close() {
      this.shareShow = false;
    },
    createLink() {
      this.$emit("shardShow", true);
        this.wxshareinfo.link = this.shareLink
      let shareObj = this.wxshareinfo;
      wx.ready(function() {
        // console.log("shareObjzzz",shareObj)
        // alert(JSON.stringify(shareObj))
        //分享给朋友
        axios
          .get(baseUrl + "merchant/api/merchantInfo/getMerchantInfoById", {
            params: {
              merchantInfoId: localStorage.getItem("xjsc_vue_2018_12_19_mid")
            }
          })
          .then(res => {
            shareObj.desc = shareObj.desc
              ? shareObj.desc
              : res.data.briefIntroduction
              ? res.data.briefIntroduction
              : "小鲸商城，旅行购物好平台";
            // shareObj.link =
            shareObj.imgUrl = shareObj.imgUrl
              ? shareObj.imgUrl
              : res.data.logoAddr
              ? res.data.logoAddr
              : "//statics.lotsmall.cn/wappublic/images/member/defaultFace.png";
            //  console.log("sharObj",shareObj)
            wx.onMenuShareAppMessage({
              title: shareObj.title, // 分享标题
              desc: shareObj.desc, // 分享描述
              link: shareObj.link, // 分享链接
              imgUrl: shareObj.imgUrl, // 分享图标
              type: "", // 分享类型,music、video或link，不填默认为link
              dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
              success: function() {
                alert("asdada")
                callback && callback();
                // 用户确认分享后执行的回调函数

              },
              cancel: function() {
                // 用户取消分享后执行的回调函数
              }
            });

            //分享到朋友圈
            wx.onMenuShareTimeline({
              title: shareObj.title, // 分享标题
              desc: shareObj.desc, // 分享描述
              link: shareObj.link, // 分享链接
              imgUrl: shareObj.imgUrl, // 分享图标
              success: function() {
                // 用户确认分享后执行的回调函数
                 alert("asdada")
                callback && callback();
              },
              cancel: function() {
                // 用户取消分享后执行的回调函数
              }
            });

            //分享到QQ
            wx.onMenuShareQQ({
              title: shareObj.title, // 分享标题
              desc: shareObj.desc, // 分享描述
              link: shareObj.link, // 分享链接
              imgUrl: shareObj.imgUrl, // 分享图标
              success: function() {
                 alert("asdada")
                callback && callback();
                // 用户确认分享后执行的回调函数
              },
              cancel: function() {
                // 用户取消分享后执行的回调函数
              }
            });
            //分享到QQ空间
            wx.onMenuShareQZone({
              title: shareObj.title, // 分享标题
              desc: shareObj.desc, // 分享描述
              link: shareObj.link, // 分享链接
              imgUrl: shareObj.imgUrl, // 分享图标
              success: function() {
                 alert("asdada")
                callback && callback();
              },
              cancel: function() {
                // 用户取消分享后执行的回调函数
              }
            });
          });
      });
      wxShare(this.wxshareinfo);
    },
    createPoster() {
      this.show = true;
    },
    dialogHide() {
      this.shareShow = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.share-content-box {
  position: absolute;
  bottom: 60px;
  width: 140px;
  left: 50%;
  margin-left: -70px;
  padding: 5px 10px;
  border-radius: 10px;
  z-index: 19;
  background: #fff;
  box-shadow: 0 0 7px rgba(0, 0, 0, 0.4);
  text-align: left;
  .share-content-title {
    height: 32px;
    line-height: 32px;
    border-bottom: 1px solid #dcdcdc;
    padding: 0 5px;
    .close {
      display: block;
      float: right;
      color: #666;
      font-size: 16px;
    }
  }
  .share-content-main {
    padding: 5px;
    li {
      padding: 5px 0;
      color: #555;
      border-bottom: 1px solid #dcdcdc;
    }
    li:last-child {
      border-bottom: none;
    }
  }
}
.share-dialog {
  .weui-dialog {
    border-radius: 8px;
    padding-bottom: 8px;
  }
  .dialog-title {
    line-height: 30px;
    color: #666;
  }
  .img-box {
    padding: 10px;
  }
  .vux-close {
    margin-top: 8px;
    margin-bottom: 8px;
  }
}
</style>
