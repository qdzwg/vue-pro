<template>
  <div class="wrapper">
    <sd-action-sheet v-model="dropShow"
                     title='选择推广方式'>
      <ul class="expandList">
        <li class="item"
            @click="selectPostType(0)"
            v-if="shareInfo.imgUrl.length">
          <span class="name poster">生成海报</span>
          <i class="xx-icon icon-iconfont-jiantou"></i>
        </li>
        <li class="item"
            @click="selectPostType(1)">
          <span class="name write">生成文案</span>
          <i class="xx-icon icon-iconfont-jiantou"></i>
        </li>
        <li class="item clip-link"
            @click="selectPostType(2)"
            :data-clipboard-text="shareInfo.proUrl">
          <span class="name link">链接推广</span>
          <i class="xx-icon icon-iconfont-jiantou"></i>
        </li>
      </ul>
    </sd-action-sheet>
    <div v-transfer-dom>
      <x-dialog v-model="posteModal"
                class="dialog-poste">
        <template v-if="type===0">
          <div class="swiper-wrap">
            <swiper :options="swiperOption"
                    ref="mySwiper"
                    v-if="type===0">
              <swiper-slide v-for="(item,index) in shareInfo.imgUrl"
                            :key="index">
                <img :src="item"
                     alt=""
                     class="swiper-slide">
              </swiper-slide>
            </swiper>
          </div>
          <div class="poster-desc">长按海报保存相册</div>
          <div @click="posteModal=false">
            <span class="vux-close"></span>
          </div>
        </template>
        <template v-if="type===1">
          <div class="generate-write">
            <h4 class="title">生成文案</h4>
            <textarea id="write"
                      class="write-content"
                      cols="30"
                      rows="10"
                      v-model="write"></textarea>
            <x-button class="write-btn"
                      type="default"
                      data-clipboard-target="#write">{{btnText}}</x-button>
          </div>
          <div @click="posteModal=false">
            <span class="vux-close"></span>
          </div>
        </template>
      </x-dialog>
    </div>
    <div v-if="shardFlag"
         @click="closeWxModal"
         class="shard-where">
      <img src="@/assets/images/weixin_sharetip.png"
           alt />
    </div>
  </div>
</template>

<script>
import { TransferDomDirective as TransferDom, XDialog, XButton, Toast } from 'vux';
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { isWxAli } from "@/common/common";
import { baseUrl } from "../../../../config/index";
import SdActionSheet from './actionSheet.vue'
import axios from "axios"
import "swiper/dist/css/swiper.css";
const CLIB_LINK = 'clip-link';
const CLIB_WRITE = 'write-btn'
export default {
  directives: {
    TransferDom
  },
  components: {
    SdActionSheet,
    XDialog,
    XButton,
    swiper,
    swiperSlide,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    param: {
      type: Object
    },
    wxshareinfo: {
      type: Object,
      default: () => {
        return {
          title: '', link: '', imgUrl: [], desc: ''
        }
      }
    },
    nickName: '',
  },
  computed: {
    dropShow: {
      get () {
        return this.show
      },
      set (val) {
        this.$emit('update:show', val)
      }
    },
    // function(val,oldVal){
    //   return this.show
    // },
    swiper () {
      return this.$refs.mySwiper.swiper
    }
  },
  data () {
    return {
      posteModal: false,
      shardFlag: false,
      type: -1,
      write: '', //分享文案
      btnText: '复制文案',
      clipboardClass: '',
      posteList: [
        {
          img: 'https://statics.lotsmall.cn/image/20181010/201810101500118yp4il.jpg?imageMogr2/thumbnail/750x/strip/quality/100',
        },
        {
          img: 'https://statics.lotsmall.cn/image/20181010/201810101500118yp4il.jpg?imageMogr2/thumbnail/750x/strip/quality/100',
        },
        {
          img: 'https://statics.lotsmall.cn/image/20181010/201810101500118yp4il.jpg?imageMogr2/thumbnail/750x/strip/quality/100',
        }
      ],
      swiperOption: {
        slidesPerView: 1.1,
        spaceBetween: 10,
        roundLengths: true,
        setWrapperSize: true,
      },
      shareInfo: {
        imgUrl: [],
        proUrl: ''
      }
    };
  },
  watch: {

  },
  methods: {
    //选择推广方式
    selectPostType (num) {
      this.type = num
      this.closeType()
      switch (num) {
        case 0:
          this.posteModal = true
          break;
        case 1:
          this.posteModal = true
          this.clipboardClass = CLIB_WRITE;
          this.write = `【${this.nickName}】 \r ${this.shareInfo.proUrl} \r `
          this.copyWrite(1)
          break;
        case 2:
          this.clipboardClass = CLIB_LINK;
          if (isWxAli().isWx) {
            let wxshareinfo = { ...this.wxshareinfo }
            wxshareinfo.imgUrl = this.shareInfo.imgUrl
            wxshareinfo.link = '//' + window.location.host + '/redirctNewUrl?reUrl=' + encodeURIComponent(this.shareInfo.proUrl)
            wxshareinfo.title = this.nickName
            this.shardFlag = true
            this.wxShare(wxshareinfo)
          } else {
            this.copyWrite(2)
          }
          break;
        default:
      }
    },
    closeType () {
      this.dropShow = false
      // this.$emit('update:show', false)
    },
    close () {
      this.posteModal = false
      this.btnText = '复制文案'
    },
    closeWxModal () {
      this.shardFlag = false
    },
    copyWrite (num) {
      let calssName = '.' + this.clipboardClass
      let self = this
      this.writeClip = new this.clipboard(calssName, {
        text: function (trigger) {
          // if(num==1){
          //   return `【${self.nickName}】${self.shareInfo.proUrl}${self.write}`
          // }else 
          if (num == 2) {
            return self.shareInfo.proUrl
          }
        }
      });
      this.writeClip.on('success', (e) => {
        this.$vux.toast.text("复制链接成功！快分享给小伙伴吧~");
        this.btnText = '再次复制'
      });
      this.writeClip.on('error', (e) => {
        this.$vux.toast.text("复制链接失败！工程师正在加紧修复~");
      });
    },
    /**
     * title:分享标题
     * link:分享链接
     * imgUrl:分享图标
     */
    wxShare (obj = { title: '', link: '', imgUrl: '', desc: '' }) {
      let self = this
      let curURL = encodeURI(window.location.href);
      let shareObj = {
        title: obj.title ? obj.title : document.title,
        desc: "",
        link: obj.link ? obj.link : window.location.href,
        imgUrl: ""
      };

      axios.get(baseUrl + "merchant/api/merchantInfo/getWxSignature",
        {
          params: {
            merchantInfoId: localStorage.getItem('xjsc_vue_2018_12_19_mid'),
            url: curURL
          }
        }).then(res => {
          if (res.status !== 200) {
            this.copyWrite(2)
            return false
          }
          let data = res.data;
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appid, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名，见附录1
            jsApiList: [
              "onMenuShareTimeline",
              "onMenuShareAppMessage",
              "onMenuShareQQ",
              "onMenuShareQZone",
            ]
          });
          wx.error((res) => {
            this.copyWrite(2)
          });
          wx.ready(function () {
            //分享给朋友
            axios.get(baseUrl + "merchant/api/merchantInfo/getMerchantInfoById",
              {
                params: {
                  merchantInfoId: localStorage.getItem('xjsc_vue_2018_12_19_mid')
                }
              }).then(
                res => {
                  shareObj.desc = obj.desc ? obj.desc : (res.data.briefIntroduction ? res.data.briefIntroduction : '小鲸商城，旅行购物好平台');
                  // shareObj.link =
                  shareObj.imgUrl = obj.imgUrl ? obj.imgUrl : (res.data.logoAddr ? res.data.logoAddr : '//statics.lotsmall.cn/wappublic/images/member/defaultFace.png');
                  wx.onMenuShareAppMessage({
                    title: shareObj.title, // 分享标题
                    desc: shareObj.desc, // 分享描述
                    link: shareObj.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: shareObj.imgUrl, // 分享图标
                    type: "", // 分享类型,music、video或link，不填默认为link
                    dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                      // 用户确认分享后执行的回调函数
                      self.shardFlag = false
                    },
                    cancel: function () {
                      // 用户取消分享后执行的回调函数
                      self.shardFlag = false
                    }
                  });

                  //分享到朋友圈
                  wx.onMenuShareTimeline({
                    title: shareObj.title, // 分享标题
                    desc: shareObj.desc, // 分享描述
                    link: shareObj.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: shareObj.imgUrl, // 分享图标
                    success: function () {
                      // 用户确认分享后执行的回调函数
                      self.shardFlag = false
                    },
                    cancel: function () {
                      // 用户取消分享后执行的回调函数
                      self.shardFlag = false
                    }
                  });

                  //分享到QQ
                  wx.onMenuShareQQ({
                    title: shareObj.title, // 分享标题
                    desc: shareObj.desc, // 分享描述
                    link: shareObj.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: shareObj.imgUrl, // 分享图标
                    success: function () {
                      // 用户确认分享后执行的回调函数
                      self.shardFlag = false
                    },
                    cancel: function () {
                      // 用户取消分享后执行的回调函数
                      self.shardFlag = false
                    }
                  });
                  //分享到QQ空间
                  wx.onMenuShareQZone({
                    title: shareObj.title, // 分享标题
                    desc: shareObj.desc, // 分享描述
                    link: shareObj.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: shareObj.imgUrl, // 分享图标
                    success: function () {
                      self.shardFlag = false
                    },
                    cancel: function () {
                      // 用户取消分享后执行的回调函数
                      self.shardFlag = false
                    }
                  });
                }
              );
          });
        });
    },
    //详情页推广
    /**type:0单票行推广，1景区推广 */
    shareBox (params, type) {
      this.getAxios(
        "/merchant/api/merchantWholeMarket/getQyyxPromoteCode",
        params, '', true
      ).then(res => {
        if (res.status === 200) {
          this.dropShow = true
          let shareInfo = res.data;
          this.shareInfo = {
            imgUrl: shareInfo.imgUrl,
            proUrl: shareInfo.proUrl
          }
        } else {
          this.$vux.alert.show({
            title: "",
            content: res.message
          });
        }
      })
        .catch(err => {
          if (err && err.status == 402) {
            let msg = err.message
            this.$vux.toast.text(msg, 'top')
            // if (msg === '请求异常:推广员信息不存在' || msg === '用户全员营销账户不存在！' || msg === '您还不是推广员,请先注册') {
            //   this.$emit('open-promoto')
            // }
          }
        });
    },
    getQueryVariable (proUrl, variable) {
      var query = proUrl.split("?")[1]
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
      }
      return false;
    }
  },
  created () { },
  mounted () {
  },
  destroyed () {
    this.writeClip = null;
  }
};
</script>

<style lang="scss">
.wrapper {
  .expandList {
    .item {
      position: relative;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 68px;
      padding: 20px 15px;
      &:after {
        position: absolute;
        box-sizing: border-box;
        content: " ";
        pointer-events: none;
        right: 15px;
        bottom: 0;
        left: 15px;
        border-bottom: 1px solid #e1e1e1;
        transform: scaleY(0.5);
      }
      .poster {
        background: url("../../../assets/images/poster_promote.png") no-repeat
          left center;
        color: #ff7a45;
      }
      .write {
        background: url("../../../assets/images/write_promote.png") no-repeat
          left center;
        color: #40a9ff;
      }
      .link {
        background: url("../../../assets/images/link_promote.png") no-repeat
          left center;
        color: #ffc53d;
      }
      .name {
        height: 47px;
        line-height: 47px;
        font-size: 16px;
        padding-left: 60px;
        background-size: 47px 47px;
      }
    }
    .item:last-child {
      &:after {
        border: none;
      }
    }
  }
  .action-sheet{
z-index:1000 !important;
  }
  .shard-where {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    img {
      width: 250px;
      height: 300px;
      position: absolute;
      top: 0;
      right: -22px;
    }
  }
}
.dialog-poste {
  .weui-dialog {
    left: 0;
    right: 0;
    margin-left: 0;
    margin-right: 0;
    width: 100%;
    max-width: 100%;
    background: none;
  }
  .swiper-wrap {
    box-sizing: border-box;
    width: 100vw;
    // height:400px;
    padding-left: 20px;
    .swiper-slide {
      width: 315px;
    }
    img {
      // height:400px;
    }
  }
  .poster-desc {
    line-height: 47px;
    font-size: 15px;
    text-align: center;
    color: #e1e1e1;
  }
  .generate-write {
    box-sizing: border-box;
    width: 315px;
    height: 340px;
    border-radius: 6px;
    background-color: #fff;
    margin: 0 auto 6px;
    .title {
      position: relative;
      font-size: 15px;
      color: #413838;
      line-height: 55px;
      text-align: center;
      &:after {
        position: absolute;
        box-sizing: border-box;
        content: " ";
        pointer-events: none;
        right: 0px;
        bottom: 0;
        left: 0px;
        border-bottom: 1px solid #e1e1e1;
        transform: scaleY(0.5);
      }
    }
    .write-content {
      position: relative;
      box-sizing: border-box;
      width: 285px;
      height: 160px;
      margin: 25px auto 30px;
      border-color: #e1e1e1;
      padding: 6px;
      font-size: 14px;
      color: #413838;
      text-align: center;
      &::before {
        border-width: 0;
      }
    }
    .write-btn {
      font-size: 12px;
      width: 86px;
      height: 40px;
      line-height: 40px;
      color: #fff;
      background-color: #009ded;
    }
  }
  .vux-close {
    margin-top: 8px;
    margin-bottom: 8px;
    position: relative;
    display: inline-block;
    vertical-align: middle;
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