import Vue from 'vue'
import Router from 'vue-router'
import {
  isWxAli
} from "@/common/common"
import VueCookies from 'vue-cookies'
import axios from "axios"
import querystring from "querystring";
import {
  linkBaseUrl,
  qyyxUrl
} from "../../config/index"
import trafficRoutes from "./trafficRoutes.js"
// import store from '@/store'

Vue.use(Router)
const router = new Router({
  strict: process.env.NODE_ENV !== 'production',
  mode: process.env.NODE_ENV === 'production' ? 'history' : 'hash',
  base: 'vue',
  routes: [{
      path: '/',
      name: 'Home',
      component: r => require.ensure([], () => r(require('@/pages/home/home')), 'Home')
    },
    {
      path: '/login',
      name: 'Login',
      component: r => require.ensure([], () => r(require('@/pages/login/login')), 'Login')
    },
    {
      path: '/bind/mobile',
      name: 'BindMobile',
      component: r => require.ensure([], () => r(require('@/pages/login/bindMobile')), 'Login')
    },
    {
      path: '/register',
      name: 'Register',
      meta: {
        keepAlive: true
      },
      component: r => require.ensure([], () => r(require('@/pages/login/register')), 'Register')
    },
    {
      path: '/forgetPw',
      name: 'ForgetPw',
      component: r => require.ensure([], () => r(require('@/pages/login/forgetPw')), 'ForgetPw')
    },
    {
      path: '/reset/password',
      name: 'ResetPassword',
      component: r => require.ensure([], () => r(require('@/pages/login/resetPassword')), 'ResetPassword')
    },
    {
      path: '/reg/deal',
      name: 'RegDeal',
      component: r => require.ensure([], () => r(require('@/pages/login/regDeal')), 'RegDeal')
    },
    {
      path: '/test',
      name: 'Test',
      component: r => require.ensure([], () => r(require('@/pages/HelloWorld')), 'Test')
    },
    {
      path: '/scroll',
      name: 'Scroll',
      component: r => require.ensure([], () => r(require('@/pages/scroll')), 'Scroll')
    },
    {
      path: '/demo',
      name: 'Demo',
      component: r => require.ensure([], () => r(require('@/pages/vuex')), 'Demo')
    },
    {
      path: '/custompage',
      name: 'Custompage',
      component: r => require.ensure([], () => r(require('@/pages/custompage')), 'Custompage')
    },
    {
      path: '/list/rmsRepast',
      name: 'ListRmsRepast',
      meta: {
        keepAlive: true
      },
      component: r => require.ensure([], () => r(require('@/pages/service/list/pmsRepastList')), 'ListRmsRepast')
    },
    {
      path: '/detail/rmsRepast',
      name: 'DetailRmsRepast',
      component: r => require.ensure([], () => r(require('@/pages/service/detail/pmsRepastDetail')), 'DetailRmsRepast')
    },
    {
      path: '/order/rmsRepast',
      name: 'OrderRmsRepast',
      component: r => require.ensure([], () => r(require('@/pages/service/order/pmsRepastOrder')), 'OrderRmsRepast')
    },
    {
      path: '/personal',
      name: 'Personal',
      component: r => require.ensure([], () => r(require('@/pages/personal/personal')), 'Personal')
    },
    {
      path: '/personal/balance',
      name: 'PersonalBalance',
      component: r => require.ensure([], () => r(require('@/pages/personal/balance')), 'PersonalBalance')
    },
    {
      path: '/personal/balanceDetail',
      name: 'PersonalBalanceDetail',
      component: r => require.ensure([], () => r(require('@/pages/personal/balance/balanceDetail')), 'PersonalBalanceDetail')
    },
    {
      path: '/cost/detail',
      name: 'CostDetail',
      component: r => require.ensure([], () => r(require('@/pages/personal/balance/costDetail')), 'CostDetail')
    },
    {
      path: '/recharge/pay',
      name: 'RechargePay',
      component: r => require.ensure([], () => r(require('@/pages/personal/balance/rechargePay')), 'RechargePay')
    },
    {
      path: '/member/recharge',
      name: 'MemberRecharge',
      component: r => require.ensure([], () => r(require('@/pages/personal/balance/recharge')), 'MemberRecharge')
    },
    {
      path: '/list/ticket',
      name: 'ListTicket',
      meta: {
        keepAlive: true
      },
      component: r => require.ensure([], () => r(require('@/pages/service/list/ticketList')), 'ListTicket')
    },
    {
      path: '/list/hotel',
      name: 'ListHotel',
      meta: {
        keepAlive: true
      },
      component: r => require.ensure([], () => r(require('@/pages/service/list/hotelList')), 'ListHotel')
    },
    {
      path: '/list/pmsHotel',
      name: 'ListPmsHotel',
      meta: {
        keepAlive: true
      },
      component: r => require.ensure([], () => r(require('@/pages/service/list/pmsHotelList')), 'ListPmsHotel')
    },
    {
      path: '/list/mdse',
      name: 'ListMdse',
      meta: {
        keepAlive: true
      },
      component: r => require.ensure([], () => r(require('@/pages/service/list/mdseList')), 'ListMdse')
    },
    {
      path: '/list/repast',
      name: 'ListRepast',
      meta: {
        keepAlive: true
      },
      component: r => require.ensure([], () => r(require('@/pages/service/list/repastList')), 'ListRepast')
    },
    {
      path: '/list/route',
      name: 'ListRoute',
      meta: {
        keepAlive: true
      },
      component: r => require.ensure([], () => r(require('@/pages/service/list/routeList')), 'ListRoute')
    },
    {
      path: '/list/strategy',
      name: 'ListStrategy',
      meta: {
        keepAlive: true
      },
      component: r => require.ensure([], () => r(require('@/pages/service/list/strategyList')), 'ListStrategy')
    },
    {
      path: '/list/theater',
      name: 'ListTheater',
      meta: {
        keepAlive: true
      },
      component: r => require.ensure([], () => r(require('@/pages/service/list/theaterList')), 'ListTheater')
    },
    {
      path: '/list/tickets',
      name: 'ListTickets',
      meta: {
        keepAlive: true
      },
      component: r => require.ensure([], () => r(require('@/pages/service/list/ticketsList')), 'ListTickets')
    },
    {
      path: '/list/guide',
      name: 'ListGuide',
      meta: {
        keepAlive: true
      },
      component: r => require.ensure([], () => r(require('@/pages/service/list/guideList')), 'ListGuide')
    },
    {
      path: '/list/comment/:mold/:id',
      name: 'ListComment',
      meta: {
        keepAlive: true
      },
      component: r => require.ensure([], () => r(require('@/pages/service/list/commentList')), 'ListComment')
    }, {
      path: '/detail/ticket',
      name: 'DetailTicket',
      component: r => require.ensure([], () => r(require('@/pages/service/detail/ticketDetail')), 'DetailTicket')
    }, {
      path: '/detail/tickets',
      name: 'DetailTickets',
      component: r => require.ensure([], () => r(require('@/pages/service/detail/ticketsDetail')), 'DetailTickets')
    }, {
      path: '/detail/guide',
      name: 'DetailGuide',
      component: r => require.ensure([], () => r(require('@/pages/service/detail/guideDetail')), 'DetailGuide')
    }, {
      path: '/detail/theater',
      name: 'DetailTheater',
      component: r => require.ensure([], () => r(require('@/pages/service/detail/theaterDetail')), 'DetailTheater')
    }, {
      path: '/detail/router',
      name: 'DetailRouter',
      component: r => require.ensure([], () => r(require('@/pages/service/detail/routerDetail')), 'DetailRouter')
    }, {
      path: '/detail/repast',
      name: 'DetailTepast',
      component: r => require.ensure([], () => r(require('@/pages/service/detail/repastDetail')), 'DetailTepast')
    }, {
      path: '/detail/eatery',
      name: 'DetailEatery',
      component: r => require.ensure([], () => r(require('@/pages/service/detail/eateryDetail')), 'DetailEatery')
    }, {
      path: '/detail/mdse',
      name: 'DetailMdse',
      component: r => require.ensure([], () => r(require('@/pages/service/detail/mdseDetail')), 'DetailMdse')
    },
    {
      path: '/detail/hotel',
      name: 'DetailHotel',
      component: r => require.ensure([], () => r(require('@/pages/service/detail/hotelDetail')), 'DetailHotel')
    },
    {
      path: '/detail/pmsHotel',
      name: 'DetailPmsHotel',
      component: r => require.ensure([], () => r(require('@/pages/service/detail/pmsHotelDetail')), 'DetailPmsHotel')
    },
    {
      path: '/detail/strategy',
      name: 'DetailStrategy',
      component: r => require.ensure([], () => r(require('@/pages/service/detail/strategyDetail')), 'DetailStrategy')
    },
    {
      path: '/order/ticket',
      name: 'OrderTicket',
      component: r => require.ensure([], () => r(require('@/pages/service/order/ticketOrder')), 'OrderTicket')
    }, {
      path: '/order/tickets',
      name: 'OrderTickets',
      component: r => require.ensure([], () => r(require('@/pages/service/order/ticketsOrder')), 'OrderTickets')
    }, {
      path: '/order/guide',
      name: 'OrderGuide',
      component: r => require.ensure([], () => r(require('@/pages/service/order/guideOrder')), 'OrderGuide')
    }, {
      path: '/order/theater',
      name: 'OrderTheater',
      component: r => require.ensure([], () => r(require('@/pages/service/order/theaterOrder')), 'OrderTheater')
    }, {
      path: '/order/router',
      name: 'OrderRouter',
      component: r => require.ensure([], () => r(require('@/pages/service/order/routerOrder')), 'OrderRouter')
    }, {
      path: '/order/repast',
      name: 'OrderTepast',
      component: r => require.ensure([], () => r(require('@/pages/service/order/repastOrder')), 'OrderTepast')
    }, {
      path: '/order/mdse',
      name: 'OrderMdse',
      component: r => require.ensure([], () => r(require('@/pages/service/order/mdseOrder')), 'OrderMdse')
    },
    {
      path: '/order/hotel',
      name: 'OrderHotel',
      component: r => require.ensure([], () => r(require('@/pages/service/order/hotelOrder')), 'OrderHotel')
    },
    {
      path: '/order/pmsHotel',
      name: 'OrderPmsHotel',
      component: r => require.ensure([], () => r(require('@/pages/service/order/pmsHotelOrder')), 'OrderPmsHotel')
    },
    {
      path: '/pay/ticket',
      name: 'PayTicket',
      component: r => require.ensure([], () => r(require('@/pages/service/pay/ticketPay')), 'PayTicket')
    }, {
      path: '/pay/theater',
      name: 'PayTheater',
      component: r => require.ensure([], () => r(require('@/pages/service/pay/theaterPay')), 'PayTheater')
    }, {
      path: '/pay/router',
      name: 'PayRouter',
      component: r => require.ensure([], () => r(require('@/pages/service/pay/routerPay')), 'PayRouter')
    }, {
      path: '/pay/repast',
      name: 'PayTepast',
      component: r => require.ensure([], () => r(require('@/pages/service/pay/repastPay')), 'PayTepast')
    }, {
      path: '/pay/mdse',
      name: 'PayMdse',
      component: r => require.ensure([], () => r(require('@/pages/service/pay/mdsePay')), 'PayMdse')
    },
    {
      path: '/pay/hotel',
      name: 'PayHotel',
      component: r => require.ensure([], () => r(require('@/pages/service/pay/hotelPay')), 'PayHotel')
    },
    {
      path: '/detail/ticketNotice',
      name: 'DetailTicketNotice',
      component: r => require.ensure([], () => r(require('@/pages/service/detail/ticket/notice')), 'DetailTicketNotice')
    },
    {
      path: '/detail/routerNotice',
      name: 'DetailRouterNotice',
      component: r => require.ensure([], () => r(require('@/pages/service/detail/router/notice')), 'DetailRouterNotice')
    },
    {
      path: '/detail/theaterShow',
      name: 'DetailTheaterShow',
      component: r => require.ensure([], () => r(require('@/pages/service/detail/theater/show')), 'DetailTheaterShow')
    },
    {
      path: '/detail/theaterSelect',
      name: 'DetailTheaterSelect',
      component: r => require.ensure([], () => r(require('@/pages/service/detail/theater/select')), 'DetailTheaterSelect')
    },
    {
      path: '/personal/contacts',
      name: 'PersonalContacts',
      component: r => require.ensure([], () => r(require('@/pages/personal/contacts/contacts')), 'PersonalContacts')
    },
    {
      path: '/personal/contactsAdd',
      name: 'PersonalContactsAdd',
      component: r => require.ensure([], () => r(require('@/pages/personal/contacts/contactsAdd')), 'PersonalContactsAdd')
    },
    {
      path: '/personal/receiveCoupon',
      name: 'PersonalReceiveCoupon',
      component: r => require.ensure([], () => r(require('@/pages/personal/coupon/receiveCoupon')), 'PersonalReceiveCoupon')
    },
    {
      path: '/personal/myCoupon',
      name: 'PersonalMyCoupon',
      component: r => require.ensure([], () => r(require('@/pages/personal/coupon/myCoupon')), 'PersonalMyCoupon')
    },
    {
      path: '/personal/userInfo',
      name: 'PersonalUserInfo',
      component: r => require.ensure([], () => r(require('@/pages/personal/user/userInfo')), 'PersonalUserInfo')
    },
    {
      path: '/personal/editInfo',
      name: 'PersonalEditInfo',
      component: r => require.ensure([], () => r(require('@/pages/personal/user/editInfo')), 'PersonalEditInfo')
    },
    {
      path: '/changePassword',
      name: 'changePassword',
      component: r => require.ensure([], () => r(require('@/pages/personal/user/changePassword')), 'changePassword')
    },
    {
      path: '/orderList',
      name: 'orderList',
      component: r => require.ensure([], () => r(require('@/pages/personal/order/orderList')), 'orderList')
    },
    {
      path: '/orderDetail',
      name: 'orderDetail',
      component: r => require.ensure([], () => r(require('@/pages/personal/order/orderdetail')), 'orderDetail')
    },
    {
      path: '/refund',
      name: 'refund',
      component: r => require.ensure([], () => r(require('@/pages/personal/order/refund')), 'refund')
    },
    {
      path: '/refundDetail',
      name: 'refundDetail',
      component: r => require.ensure([], () => r(require('@/pages/personal/order/refundDetail')), 'refundDetail')
    },
    {
      path: '/evaluate',
      name: 'evaluate',
      component: r => require.ensure([], () => r(require('@/pages/personal/order/evaluate')), 'evaluate')
    },
    {
      path: '/goodsSend',
      name: 'goodsSend',
      component: r => require.ensure([], () => r(require('@/pages/personal/order/goodsSend')), 'goodsSend')
    },
    {
      path: '/yearcard',
      name: 'yearcard',
      component: r => require.ensure([], () => r(require('@/pages/personal/yearcard/yearcard')), 'yearcard')
    },
    {
      path: '/yearcardDetail',
      name: 'yearcardDetail',
      component: r => require.ensure([], () => r(require('@/pages/personal/yearcard/yearcardDetail')), 'yearcardDetail')
    },
    {
      path: '/yearcardPay',
      name: 'yearcardPay',
      component: r => require.ensure([], () => r(require('@/pages/personal/yearcard/yearcardPay')), 'yearcardPay')
    },
    {
      path: '/yearcardRecord',
      name: 'yearcardRecord',
      component: r => require.ensure([], () => r(require('@/pages/personal/yearcard/yearcardRecord')), 'yearcardRecord')
    },
    {
      path: '/parkCard/login',
      name: 'parkCardLogin',
      component: r => require.ensure([], () => r(require('@/pages/parkCard/login')), 'parkCardLogin')
    },
    {
      path: '/parkCard/home',
      name: 'parkCardHome',
      component: r => require.ensure([], () => r(require('@/pages/parkCard/home')), 'parkCardHome')
    },
    {
      path: '/parkCard/list',
      name: 'parkCardList',
      component: r => require.ensure([], () => r(require('@/pages/parkCard/list')), 'parkCardList')
    },
    {
      path: '/parkCard/detail',
      name: 'parkCardDetail',
      component: r => require.ensure([], () => r(require('@/pages/parkCard/detail')), 'parkCardDetail')
    },
    {
      path: '/parkCard/saveOrder',
      name: 'parkCardSaveOrder',
      component: r => require.ensure([], () => r(require('@/pages/parkCard/saveOrder')), 'parkCardSaveOrder')
    },
    {
      path: '/parkCard/topay',
      name: 'parkCardTopay',
      component: r => require.ensure([], () => r(require('@/pages/parkCard/topay')), 'parkCardTopay')
    },
    {
      path: '/parkCard/member',
      name: 'parkCardMember',
      component: r => require.ensure([], () => r(require('@/pages/parkCard/member')), 'parkCardMember')
    },
    {
      path: '/parkCard/order/list',
      name: 'parkCardOrderList',
      component: r => require.ensure([], () => r(require('@/pages/parkCard/order/list')), 'parkCardOrderList')
    },
    {
      path: '/parkCard/invoice/list',
      name: 'parkCardInvoiceList',
      component: r => require.ensure([], () => r(require('@/pages/parkCard/invoice/list')), 'parkCardInvoiceList')
    },
    {
      path: '/parkCard/invoice/detail',
      name: 'parkCardInvoiceDetail',
      component: r => require.ensure([], () => r(require('@/pages/parkCard/invoice/detail')), 'parkCardInvoiceDetail')
    },
    {
      path: '/parkCard/invoice/create',
      name: 'parkCardInvoiceCreate',
      component: r => require.ensure([], () => r(require('@/pages/parkCard/invoice/create')), 'parkCardInvoiceCreate')
    },
    {
      path: '/parkCard/order/detail',
      name: 'parkCardOrderDetail',
      component: r => require.ensure([], () => r(require('@/pages/parkCard/order/detail')), 'parkCardOrderDetail')
    },
    {
      path: '/parkCard/showQr',
      name: 'parkCardShowQr',
      component: r => require.ensure([], () => r(require('@/pages/parkCard/qr/showQr')), 'parkCardShowQr')
    },
    {
      path: '/parkCard/showQr/warning',
      name: 'parkCardShowQrWarning',
      component: r => require.ensure([], () => r(require('@/pages/parkCard/qr/message')), 'parkCardShowQrWarning')
    },
    {
      path: '/parkCard/bindQr',
      name: 'parkCardBindQr',
      component: r => require.ensure([], () => r(require('@/pages/parkCard/qr/bindQr')), 'parkCardBindQr')
    },
    {
      path: '/recordDetail',
      name: 'recordDetail',
      component: r => require.ensure([], () => r(require('@/pages/personal/yearcard/recordDetail')), 'recordDetail')
    },
    {
      path: '/invoiceList',
      name: 'invoiceList',
      component: r => require.ensure([], () => r(require('@/pages/personal/invoice/invoiceList')), 'invoiceList')
    },
    {
      path: '/invoicePay',
      name: 'invoicePay',
      component: r => require.ensure([], () => r(require('@/pages/personal/invoice/invoicePay')), 'invoicePay')
    },
    {
      path: '/invoiceDetail',
      name: 'invoiceDetail',
      component: r => require.ensure([], () => r(require('@/pages/personal/invoice/invoiceDetail')), 'invoiceDetail')
    },
    {
      path: '/address/list',
      name: 'AddressList',
      component: r => require.ensure([], () => r(require('@/pages/service/order/address/addressList')), 'AddressList')
    },
    {
      path: '/address/mgt',
      name: 'AddressMgt',
      component: r => require.ensure([], () => r(require('@/pages/service/order/address/addressMgt')), 'AddressMgt')
    },
    {
      path: '/selfPlace',
      name: 'SelfPlace',
      component: r => require.ensure([], () => r(require('@/pages/service/order/selfPlace/selfPlace')), 'SelfPlace')
    },
    {
      path: '/refundDetail',
      name: 'refundDetail',
      component: r => require.ensure([], () => r(require('@/pages/personal/order/refundDetail')), 'refundDetail')
    },
    {
      path: '/shopping/cart',
      name: 'ShoppingCart',
      component: r => require.ensure([], () => r(require('@/pages/shoppingCart/shoppingCart')), 'ShoppingCart')
    },
    {
      path: '/transition',
      name: 'Transition',
      component: r => require.ensure([], () => r(require('@/pages/transition')), 'Transition')
    },
    {
      path: '/flex',
      name: 'Flex',
      component: r => require.ensure([], () => r(require('@/pages/flex')), 'Flex')
    },
    {
      path: '/flexDemo',
      name: 'flexDemo',
      component: r => require.ensure([], () => r(require('@/pages/flexDemo')), 'flexDemo')
    },
    {
      path: '/list',
      name: 'List',
      component: r => require.ensure([], () => r(require('@/pages/list11')), 'List')
    },
    {
      path: '/pay/result',
      name: 'PayResult',
      component: r => require.ensure([], () => r(require('@/pages/payResult')), 'PayResult')
    },
    {
      path: '/404',
      name: '404',
      component: r => require.ensure([], () => r(require('@/pages/404')), '404')
    },
    ...trafficRoutes
  ],
  scrollBehavior(to, from, savedPosition) {
    // console.log(savedPosition)
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop;
      }
      return {
        x: 0,
        y: to.meta.savedPosition || 0
      }
    }
  }
})

router.beforeEach((to, from, next) => {
  // store.dispatch('updateLoadingStatus', {isLoading: true})
  if (to.matched && to.matched.length) {
    if (to.path == '/pay/result') {
      next()
    } else {
      if (to.fullPath == '/404') {
        next()
      } else {
        if (to.query.m_id) {
          localStorage.setItem('xjsc_vue_2018_12_19_mid', to.query.m_id)
          //同步node端M_id,spreadCode,marketDisAccount
          let obj = {
            merchantInfoId: to.query.m_id
          }
          let spread_code = to.query.spread_code || to.query.promoteCode
          if (spread_code) {
            //存在cookie中
            VueCookies.set('spread_code_' + to.query.m_id, spread_code)
            let code = spread_code.split("-")[1]
            if (spread_code && code) {
              obj = Object.assign(obj, {
                spreadCode: spread_code,
                marketDisAccount: code
              })
            }
          }
          //全员营销推广
          let promoteCode = to.query.spread_code || to.query.code
          if (promoteCode) {
            VueCookies.set('promote_code', promoteCode)
          }
          // 判断环境
          let env = isWxAli()
          //微信或者阿里的时候
          if (env.isWx || env.isAliPay) {
            //判断token是否纯在
            if (to.query.token) {
              //是否是数组
              if (to.query.token instanceof Array) {
                localStorage.setItem(
                  "xjsc_login_access_token_2019_3_7",
                  to.query.token[to.query.token.length - 1]
                );
              } else {
                localStorage.setItem(
                  "xjsc_login_access_token_2019_3_7",
                  to.query.token
                );
              }
              obj = Object.assign(obj, {
                token: localStorage.getItem("xjsc_login_access_token_2019_3_7")
              })
            }
            if (to.query.leaguerInfoId) {
              //是否是数组
              if (to.query.leaguerInfoId instanceof Array) {
                localStorage.setItem(
                  "xjsc_login_userId_2019_3_8",
                  to.query.leaguerInfoId[to.query.leaguerInfoId.length - 1]
                );
              } else {
                localStorage.setItem(
                  "xjsc_login_userId_2019_3_8",
                  to.query.leaguerInfoId
                );
              }
              obj = Object.assign(obj, {
                leaguerId: localStorage.getItem("xjsc_login_userId_2019_3_8")
              })
            }

          } else {

          }

          axios.get(window.location.protocol + "//" + window.location.host + "/merchant/api/node/changeInfo", {
            params: obj
          })
          if (process.env.NODE_ENV == "production") {
            //处理微信H5分享只能分享首页的问题
            //原因ios系统对于spa单页面应用的路径变化无法监听
            //生产环境判断是不是ios环境iso环境路由跳转的时候用location.assign处理
            let agent = navigator.userAgent
            //是否是iso系统
            let isiOS = !!agent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
            //是否是微信浏览器
            let isWx = /MicroMessenger/.test(window.navigator.userAgent)
            console.log(isiOS)
            console.log(isWx)
            //ios微信浏览器端
            if (isWx && isiOS && (('/vue' + to.path) != global.location.pathname)) {
              console.log(1)
              if (to.query.token || to.query.leaguerInfoId) {
                delete to.query.token
                delete to.query.leaguerInfoId
                console.log(3)
                console.log(querystring.stringify(to.query))
                location.assign('/vue' + to.path + '?' + querystring.stringify(to.query))
              } else {
                location.assign('/vue' + to.fullPath)
              }
            } else if (isWx && isiOS) {
              console.log(4)
              if (to.query.token || to.query.leaguerInfoId) {
                delete to.query.token
                delete to.query.leaguerInfoId
                console.log(5)
                location.assign('/vue' + to.path + '?' + querystring.stringify(to.query))
              } else {
                next()
                // location.assign('/vue' + to.fullPath)
              }
            } else {
              console.log(22)
              if (to.query.token || to.query.leaguerInfoId) {
                //如果有token值，删除参数token和leaguerInfoId后，replace当前路由
                delete to.query.token
                delete to.query.leaguerInfoId
                next({
                  ...to
                })
              } else {
                next()
              }

            }
          } else {
            if (to.query.token || to.query.leaguerInfoId) {
              //如果有token值，删除参数token和leaguerInfoId后，replace当前路由
              delete to.query.token
              delete to.query.leaguerInfoId
              next({
                ...to
              })
            } else {
              next()
            }
          }
          // next()
        } else {
          if (from.query.m_id) {
            to.query.m_id = from.query.m_id
            next({
              ...to
            })
          } else {
            next('/404')
          }
        }
      }
    }

  } else {
    next('/404')
  }
})


export default router
