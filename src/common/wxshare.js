
import axios from "axios"
import { isWxAli } from "@/common/common";
import { baseUrl } from "../../config/index";
//微信分享
const wxShare = (obj, callback) => {
 //设置分享信息
 let isWx = isWxAli().isWx;
 if (isWx) {
   var curURL = encodeURI(window.location.href);
   var shareObj = {
     title: obj.title?obj.title:document.title,
     desc: "",
     link: obj.link?obj.link:window.location.href,
     imgUrl: ""
   };
   // 微信授权
  //  axios.get("/merchant/api/merchantInfo/getWxSignature?url=" + curURL +"&merchantInfoId=" + localStorage.getItem('xjsc_vue_2018_12_19_mid')
   axios.get(baseUrl+"merchant/api/merchantInfo/getWxSignature",
   {
    params: {
      merchantInfoId: localStorage.getItem('xjsc_vue_2018_12_19_mid'),
      url:curURL
    }
   }
   ).then(res => {
     if(!(res.status==200||res.success)){
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
         "onMenuShareQZone"
       ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
     });

     wx.ready(function() {
       //分享给朋友
       axios.get(baseUrl + "merchant/api/merchantInfo/getMerchantInfoById",
       {
        params: {
          merchantInfoId: localStorage.getItem('xjsc_vue_2018_12_19_mid')
        }
       }).then(
         res => {
           shareObj.desc = obj.desc?obj.desc:(res.data.briefIntroduction?res.data.briefIntroduction:'小鲸商城，旅行购物好平台');
           // shareObj.link =
           shareObj.imgUrl = obj.imgUrl?obj.imgUrl:(res.data.logoAddr?res.data.logoAddr:'//statics.lotsmall.cn/wappublic/images/member/defaultFace.png');
          //  console.log("sharObj",shareObj)
           wx.onMenuShareAppMessage({
             title: shareObj.title, // 分享标题
             desc: shareObj.desc, // 分享描述
             link: shareObj.link, // 分享链接
             imgUrl: shareObj.imgUrl, // 分享图标
             type: "", // 分享类型,music、video或link，不填默认为link
             dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
             success: function() {
              callback&&callback()
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
               callback&&callback()
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
              callback&&callback()
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
              callback&&callback()
             },
             cancel: function() {
               // 用户取消分享后执行的回调函数
             }
           });
         }
       );
     });
   });
 }
}

module.exports = {
  wxShare
}
