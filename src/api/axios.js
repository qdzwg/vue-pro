import qs from 'qs';
import store from '@/store';
import router from '../router';
// import Promise from "es6-promise"
// import jsonp from "jsonp"
import querystring from 'querystring';
import {isWxAli} from '@/common/common';
// 在config.js文件中统一存放一些公共常量，方便之后维护
import {baseUrl, linkBaseUrl} from '../../config/index';
import vueCookie from 'vue-cookie';
// Promise.polyfill()
import axios from 'axios';
//阿里、wx登录
// console.log(vueCookie)
let env = isWxAli ();

function wxAliLogin (channl) {
  let rediurl;
  let nextPath = localStorage.getItem ('xjsc_nextpath_2019_4_20');
  if (nextPath) {
    rediurl = nextPath;
    localStorage.removeItem ('xjsc_nextpath_2019_4_20');
  } else {
    rediurl = window.location.href;
  }
  // console.log(rediurl)
  // rediurl = window.location.href
  let params = {
    channl,
    redirectUrl: encodeURIComponent (rediurl),
    merchantInfoId: localStorage.getItem ('xjsc_vue_2018_12_19_mid'),
  };
  // console.log(params)
  // console.log(querystring.stringify(params))
  let url =
    baseUrl + 'leaguer/api/authApi/auth?' + querystring.stringify (params);
  // console.log(baseUrl)
  window.location.href = url;
}

axios.defaults.withCredentials = true
// 添加请求拦截器，在发送请求之前做些什么(**具体查看axios文档**)--------------------------------------------
axios.interceptors.request.use(function (config) {
  // console.log(config)
  // 显示loading
  // console.log('开始请求...')
  let token
  if (env.isWx || env.isAliPay) {
    //微信，支付宝
    token = localStorage.getItem("xjsc_login_access_token_2019_3_7") || vueCookie.get("token")
  } else {
    //
    token = vueCookie.get("token") || localStorage.getItem("xjsc_login_access_token_2019_3_7")
  }
  //获取全员营销的登录账号和密码，绝对不能添加请求头的access-token，不然请求会报错
  if (config.url != '//qyyxcs.sendinfo.com.cn/wap/enterPromote.htm' && config.url != '//qyyx.zhiyoubao.com/wap/enterPromote.htm') {
    config.headers['access-token'] = token ? token : ''
  }
  store.dispatch('updateLoadingStatus', true)

    return config;
  },
  function (error) {
    // 请求错误时弹框提示，或做些其他事
    store.dispatch ('updateLoadingStatus', false);
    return Promise.reject (error);
  }
);

// 添加响应拦截器(**具体查看axios文档**)----------------------------------------------------------------
axios.interceptors.response.use (
  function (response) {
    // 对响应数据做点什么，允许在数据返回客户端前，修改响应的数据
    // 如果只需要返回体中数据，则如下，如果需要全部，则 return response 即可
    // console.log('请求结束。。。')
    store.dispatch ('updateLoadingStatus', false);
    return response.data;
    // if (response.data && (response.data.status == 200 || (response.data.status && response.data.status.success) || response.data.success)) {
    //   //请求成功
    //   // store.dispatch('addAction')
    //   return response.data
    // } else if (response.data.status == 400) {
    //   console.log("asdada")
    // } else {
    //   if (response.config.url.indexOf('/api/merchantInfo/getWxSignature') === -1){
    //     alert(response.data.message);
    //   }
    // }
  },
  function (error) {
    // 对响应错误做点什么
    store.dispatch ('updateLoadingStatus', false);
    // console.log(error)
    return Promise.reject (error);
  }
);

// 封装数据返回失败提示函数---------------------------------------------------------------------------
function errorState (response) {
  // alert(JSON.stringify(response))
  // 隐藏loading
  // 如果http状态码正常，则直接返回数据
  // console.log(response.response.status)
  if (response && response.response) {
    if (response.response.status == 400) {
      //token过期、token不存在
      let channl = ''
      // console.log(env)
      if (env.isWx) {
        //微信内置浏览器
        apiAxios("GET", "/pay/api/getPayInfo", {
          payCode: 'wxZyb'
        }).then(res => {
          let wxAccount = {
            appid: '',
            appsecret: ''
          }
          if (res && res.data && res.data.details && res.data.details.length) {
            res.data.details.forEach(element => {
              if (element.payKey === 'appid')
                wxAccount.appid = element.payValue;
              if (element.payKey === 'appsecret')
                wxAccount.appsecret = element.payValue;
            })
          }
          localStorage.setItem("xjsc_vue_2019_3_19_wxAccount", JSON.stringify(wxAccount))
          channl = 'WEIXIN';
          wxAliLogin(channl)
        })

      } else if (env.isAliPay) {
        //支付宝内置浏览器
        channl = 'ALI';
        wxAliLogin(channl)
      } else {
        if (process.env.NODE_ENV === 'production') {
          //正式环境
          //跳转node版本
          let nextPath = localStorage.getItem('xjsc_nextpath_2019_4_20')
          let redir = nextPath ? encodeURIComponent(nextPath) : encodeURIComponent(window.location.href)
          if (nextPath) {
            localStorage.removeItem("xjsc_nextpath_2019_4_20")
          }
          window.location.href = linkBaseUrl + "/login?m_id=" + localStorage.getItem('xjsc_vue_2018_12_19_mid') + "&redir=" + redir
        } else {
          //本地开发环境
          //其他浏览器
          router.push({
            path: "/login?token=lose&m_id=" + localStorage.getItem('xjsc_vue_2018_12_19_mid')
          })
        }
      }
    } else if (response.response.status == 410) {
      //手机浏览器登录用户直接用手机号码登录不需要绑定手机号码，也就支付宝和微信H5用户需要
      //410状态微信h5及支付宝h5用户登录后未绑定手机号码
      //需要跳转手机号码绑定页面
      let rediurl = encodeURIComponent(window.location.href)
      if (process.env.NODE_ENV === 'production') {
        let url = linkBaseUrl + "/vue/bind/mobile?m_id=" + localStorage.getItem('xjsc_vue_2018_12_19_mid') + "&rediurl=" + rediurl
        if (window.location.href != url) {
          window.location.href = url
        }
      } else {
        router.push({
          path: "/bind/mobile?rediurl=" + rediurl
        })
      }

    }
  }

}

// 封装数据返回成功提示函数---------------------------------------------------------------------------
function successState(response) {
  if (response && (response.status == 200 || (response.status && response.status.success) || response.success)) {
    //请求成功
  } else if (response.status == 400) {
    //目前后端的返回400状态码直接在errorState方法中处理
  } else {
    alert (response.message);
    //阻止代码继续执行
    return false;
  }
}


// 封装axios--------------------------------------------------------------------------------------
// igError （true | false） 是否启用公用错误处理
function apiAxios (method, url, params, base, igError, jsonFlag) {
  // console.log(localStorage.getItem('xjsc_vue_2018_12_19_mid'))
  let merchantInfoId = localStorage.getItem ('xjsc_vue_2018_12_19_mid');
  if (jsonFlag) {
    axios.defaults.headers.post['Content-Type'] =
      'application/json;charset=UTF-8';
  } else {
    axios.defaults.headers.post['Content-Type'] =
      'application/x-www-form-urlencoded;charset=UTF-8';
  }
  const promoteCode = vueCookie.get("mk_promote_code"+localStorage.getItem('xjsc_vue_2018_12_19_mid'))
  
  if(typeof promoteCode !== "undefined" && promoteCode){ //全局注入联盟cookies
    // console.log("promoteCode:",promoteCode)
    // alert(promoteCode)
    axios.defaults.headers.post['cookies'] = document.cookie;
  }
  // console.log(merchantInfoId)
  params = Object.assign(params, {
    merchantInfoId: merchantInfoId,
    xj_time_stamp_2019_11_28: new Date().getTime()
  })
  let httpDefault = {
    method: method,
    // baseURL: baseURL,
    url: url,
    // `params` 是即将与请求一起发送的 URL 参数
    // `data` 是作为请求主体被发送的数据
    params: method === 'GET' || method === 'DELETE' ? params : null,
    data: method === 'POST' || method === 'PUT'
      ? jsonFlag ? params : qs.stringify (params)
      : null,
    timeout: 10000,
    baseURL: base ? base : process.env.NODE_ENV === 'production' ? baseUrl : '',
  };
  // alert(JSON.stringify(httpDefault))
  // 注意**Promise**使用(Promise首字母大写)

  return new Promise ((resolve, reject) => {
    axios (httpDefault)
      // 此处的.then属于axios
      .then (response => {
        // successState(response)
        if (
          response &&
          (response.status == 200 ||
            (response.status && response.status.success) ||
            response.success)
        ) {
          //请求成功
          resolve (response);
        } else {
          reject (response);
          if (!igError) alert (response.message);
          //阻止代码继续执行
        }
      }).catch((response) => {

        errorState(response)
        //过滤410和400错误，410绑定手机号码和400未登录在errorState中已经针对这两个做了处理，不需要页面处理
        if (response && response.response && response.response.status && (response.response.status != 400 && response.response.status != 410)) {
          reject(response)
        }
      })
      .catch (response => {
        errorState (response);
        reject (response);
      });
  });
}

// 输出函数getAxios、postAxios、putAxios、delectAxios，供其他文件调用-----------------------------
// Vue.js的插件应当有一个公开方法 install。这个方法的第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象。
export default {
  install: function (Vue) {
    Vue.prototype.getAxios = (url, params, base, igError) =>
      apiAxios ('GET', url, params ? params : {}, base, igError);
    Vue.prototype.jsonAxios = (url, params, base, igError) =>
      apiAxios ('POST', url, params ? params : {}, base, igError, true);
    Vue.prototype.postAxios = (url, params, base, igError) =>
      apiAxios ('POST', url, params ? params : {}, base, igError);
    Vue.prototype.putAxios = (url, params, base, igError) =>
      apiAxios ('PUT', url, params ? params : {}, base, igError);
    Vue.prototype.delectAxios = (url, params, base, igError) =>
      apiAxios ('DELECT', url, params ? params : {}, base, igError);
  },
};
