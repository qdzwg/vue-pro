// 'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.
let date = new Date()
let year = date.getFullYear() + '';//年
let month = date.getMonth() + 1;//月
let day = date.getDate();//日
let hour = date.getHours();//获取系统时间
let minute = date.getMinutes(); //分
let second = date.getSeconds();//秒
const Version = year + (month < 10 ? ("0" + month) : month) + (day < 10 ? ("0" + day) : day) + (hour < 10 ? ("0" + hour) : hour) + (minute < 10 ? ("0" + minute) : minute) + (second < 10 ? ("0" + second) : second)
const path = require('path')
const env_config = process.env.env_config
console.log('env_config',env_config)
let baseUrl, linkBaseUrl, qyyxUrl, pubUrl
//通过process.env.env_config值来判断正式环境   test为线上测试环境  pre为线上预发布环境  prod为线上正式环境
if (env_config == 'prod') {
  //线上正式
  baseUrl = 'https://www.lotsmall.cn/'
  linkBaseUrl = '//wap.lotsmall.cn'
  qyyxUrl = '//qyyx.zhiyoubao.com'
  pubUrl = '//pubswap.zhiyoubao.com'
} else if (env_config == 'proddev') {
  //开发环境
  baseUrl = 'https://devwww.lotsmall.cn/'
  linkBaseUrl = '//devwap.lotsmall.cn'
  qyyxUrl = '//qyyxcs.sendinfo.com.cn'
  pubUrl = '//pubswap.sendinfo.com.cn'
} else if (env_config == 'pre') {
  //预发布
  baseUrl = 'https://prewww.lotsmall.cn/'
  linkBaseUrl = '//prewap.lotsmall.cn'
  qyyxUrl = '//qyyx.zhiyoubao.com'
  pubUrl = '//pubswap.zhiyoubao.com'
} else {
  //测试环境或者本地开发环境
  baseUrl = 'https://testwww.lotsmall.cn/'
  linkBaseUrl = '//testwap.lotsmall.cn'
  qyyxUrl = '//qyyxcs.sendinfo.com.cn'
  pubUrl = '//pubswap.sendinfo.com.cn'
}
module.exports = {
  baseUrl: baseUrl,
  linkBaseUrl: linkBaseUrl,
  qyyxUrl: qyyxUrl,
  pubUrl: pubUrl,
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {

      // '/qy': {
      //   target: 'http://192.168.200.40:8180',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/qy': '/'
      //   }
      // },
      '/': {
        target: 'https://testwww.lotsmall.cn/',
        // target: 'http://192.168.66.37:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/': '/'
        },
        secure: true
      },
    },

    // Various Dev Server settings
    host: '0.0.0.0', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist/' + Version),
    assetsSubDirectory: 'static',
    assetsPublicPath: env_config == 'prod' || env_config == 'pre' ? 'https://statics.lotsmall.cn/lotsmallwapvue/' + Version + '/' : '/' + Version + "/",
    // assetsPublicPath: '/' + Version + "/",

    /**
     * Source Maps
     */
    //测试环境和预发布环境关闭SourceMap
    productionSourceMap: env_config != 'prod',
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
