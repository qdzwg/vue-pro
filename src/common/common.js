import axios from 'axios'
import qs from 'qs'

function isWxAli() {
  // var ua = req.headers["user-agent"].toLowerCase();
  // if (/MicroMessenger/.test(window.navigator.userAgent)) { 
  //     alert('微信客户端'); 
  // } else if (/AlipayClient/.test(window.navigator.userAgent)) { 
  //     alert('支付宝客户端');
  // } else {
  //     alert('其他浏览器');
  // }
  return {
    isWx: /MicroMessenger/.test(window.navigator.userAgent),
    isAliPay: /AlipayClient/.test(window.navigator.userAgent)
  }
}

//统一处理订单
function order(formData, modelCodes) {
  let env = isWxAli()
  new Promise((resolve, reject) => {
    axios.post("/order/api/saveOrder", qs.stringify(formData)).then(result => {
      let orderNo = result.data.payOrderNo;
      let orderInfo = result.data.orderDescription;
      let orderId = result.data.id;
      let businessType = "";
      if (env.isWx) {
        //如果是微信端
        axios.get("/merchant/api/validateZeroRateTicket", {
          modelCode: modelCodes.join(",")
        }).then(
          res => {
            if (res.message == "T") {
              businessType = "YXT";
            } else {
              businessType = "WEIXIN";
            }
            // getPayType(businessType);
          },
          reject => {
            reject()
          }
        );
      } else {
        //非微信端
        businessType = env.isAliPay ? "ALI" : "WAP";
        // this.getPayType(businessType);
      }
    })
  })

  // this.postAxios(_url, formData)
  //     .then(
  //         result => {
  //             this.orderNo = result.data.payOrderNo;
  //             this.orderInfo = result.data.orderDescription;
  //             this.orderId = result.data.id;
  //             let businessType = "";
  //             if (env.isWx) {
  //                 //如果是微信端
  //                 this.getAxios("/merchant/api/validateZeroRateTicket", {
  //                     modelCode: modelCodes.join(",")
  //                 }).then(
  //                     res => {
  //                         if (res.message == "T") {
  //                             businessType = "YXT";
  //                         } else {
  //                             businessType = "WEIXIN";
  //                         }
  //                         this.getPayType(businessType);
  //                     },
  //                     reject => {
  //                         this.oneSubFrom = true;
  //                     }
  //                 );
  //             } else {
  //                 //非微信端
  //                 businessType = env.isAliPay ? "ALI" : "WAP";
  //                 this.getPayType(businessType);
  //             }
  //             // this.getAxios(
  //             //   "/merchant/api/merchantPayType/getMerchantPayType",
  //             //   {
  //             //     businessType: env.isWx
  //             //       ? "WEIXIN"
  //             //       : env.isAliPay
  //             //       ? "ALI"
  //             //       : "WAP"
  //             //   }
  //             // ).then(res => {
  //             //   this.payType = JSON.parse(res.message)[0];
  //             //   //微信端获取openid
  //             //   if (env.isWx) {
  //             //     this.getAxios(
  //             //       "/leaguer/api/userLeaguer/manage/leaguerInfo",
  //             //       {
  //             //         leaguerId:
  //             //           localStorage.getItem("xjsc_login_userId_2019_3_8") ||
  //             //           this.$cookie.get("leaguerInfoId")
  //             //       }
  //             //     ).then(res => {
  //             //       this.openId = res.data.openId ? res.data.openId : "";
  //             //       this.pay();
  //             //     });
  //             //   } else if (env.isAliPay) {
  //             //     //阿里
  //             //     this.pay();
  //             //   } else {
  //             //     this.pay();
  //             //   }
  //             // });
  //         },
  //         reject => {
  //             this.oneSubFrom = true;
  //         }
  //     )
  //     .catch(error => {
  //         this.oneSubFrom = true;
  //     });
}

function wxPay(payParams) {
  function onBridgeReady() {
    WeixinJSBridge.invoke(
      'getBrandWCPayRequest', payParams.jsons,
      function (res) {
        // alert(JSON.stringify(res))
        if (res.err_msg == "get_brand_wcpay_request:ok") {
          // 使用以上方式判断前端返回,微信团队郑重提示：
          //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          payParams.success()
        } else {
          payParams.fail()
        }
      });
  }

  if (typeof WeixinJSBridge == "undefined") {
    if (document.addEventListener) {
      document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
    } else if (document.attachEvent) {
      document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
      document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
    }
  } else {
    onBridgeReady();
  }
}

/**
 * 检测图片是否存在
 * @param url
 */
let imageIsExist = function (url) {
  return new Promise((resolve) => {
    var img = new Image();
    img.onload = function () {
      if (this.complete == true) {
        resolve(true);
        img = null;
      }
    }
    img.onerror = function () {
      resolve(false);
      img = null;
    }
    img.src = url;
  })
}

// 数据乱序
function randomSort(arr) {
  for (let i = arr[0].length - 1; i >= 0; i--) {
    let rIndex = Math.floor(Math.random() * (i + 1));
    for (let arrIndex = 0; arrIndex < arr.length; arrIndex++) {
      let item = arr[arrIndex]
      let temp = item[rIndex];
      item[rIndex] = item[i];
      item[i] = temp;
    }
  }
  return arr
}

export {
  isWxAli,
  wxPay,
  order,
  imageIsExist,
  randomSort,
};
