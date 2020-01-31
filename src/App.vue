<template>
  <div id="app">
    <loading v-model="isLoading"></loading>

    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>

    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
<script>
import "./assets/font/iconfont.css";
import "./assets/weatherFont/iconfont.css";
import "./assets/styles/common.less";
import { Loading } from "vux";
import { mapState } from "vuex";
import { qyyxUrl } from "../config/index";
import VueCookies from "vue-cookies";
export default {
  name: "app",
  components: {
    Loading
  },
  watch: {
    code(val) {
      //获取cookie中的spread_code，spread_code来源两种：1、上面代码存储 2、node页面存储
      let spread_code_local = VueCookies.get(
        "spread_code_" + localStorage.getItem("xjsc_vue_2018_12_19_mid")
      );
      if (spread_code_local) {
        let local_code = spread_code_local.split("-")[1];
        if (local_code) {
          //保证节点的唯一性
          VueCookies.set("qyyx_code_" + local_code, spread_code_local);
          let idObject = document.getElementById("statis-qyyx");
          if (idObject != null) {
            //js已加载过
            //保证window["_bdhm_loaded_" + local_code]是undefined才能正常执行pro.js中的
            //     function F() {
            //     if (typeof window["_bdhm_loaded_" + c.id] == "undefined") window["_bdhm_loaded_" + c.id] = true_g,
            //     this.a = {},
            //     this.Start_G();
            // }

            window["_bdhm_loaded_" + local_code] = undefined;
            idObject.parentNode.removeChild(idObject);
          }
          let hm = document.createElement("script");
          hm.id = "statis-qyyx";
          hm.src = qyyxUrl + "/static/h-ui/js/pro.js?" + local_code;
          let s = document.getElementsByTagName("script")[0];
          s.parentNode.insertBefore(hm, s);
        }
      }
    }
  },
  created() {
    //this.disposeVuexSaasInfo();
    this.setLotsUnitCookie();
  },
  computed: {
    ...mapState({
      isLoading: state => state.load.isLoading
    }),
    code() {
      return this.$route.query;
    }
  },
  methods: {
    getUrlValue(name) { //获取url里的参数
      return (
        (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(
          location.href
        ) || [, ''])[1].replace(/\+/g, '%20')
        || ''
      );
    },
    setLotsUnitCookie(){ //全局（许忠林要求）注入联盟cookie，用于分润
      const mkPromoteCode = this.getUrlValue("mkPromoteCode")
      console.log("mkPromoteCode:" +mkPromoteCode)
      const m_id = this.getUrlValue("m_id")
      if(typeof mkPromoteCode !== "undefined" && mkPromoteCode && typeof m_id !== "undefined" && m_id){
        VueCookies.set("mk_promote_code"+m_id,mkPromoteCode, (2*60*1000), null, ".lotsmall.cn")
        VueCookies.set("mk_promote_code",mkPromoteCode, (2*60*1000), null, ".lotsmall.cn")
      }
    },
    disposeVuexSaasInfo() {// vuex  saas状态刷新保存
      const saas_local_info = localStorage.getItem("saas_info");
      if (saas_local_info) this.$store.state.saas = JSON.parse(saas_local_info);

      window.addEventListener("beforeunload", () => {
        localStorage.setItem(
          "saas_info",
          JSON.stringify(this.$store.state.saas)
        );
      });

      window.onload = function() {
        localStorage.removeItem("saas_info");
      };
    }
  }
  // mounted() {
  //   console.log("zz")
  //   let spread_code = this.$cookie.get("spread_code_" + this.$route.query.m_id);
  //   if (spread_code) {
  //       let code = spread_code.split("-")[1];
  //       if (code) {
  //         let hm = document.createElement("script");
  //         hm.id = "statis-qyyx";
  //         hm.src = qyyxUrl + "/static/h-ui/js/pro.js?" + code;
  //         let s = document.getElementsByTagName("script")[0];
  //         s.parentNode.insertBefore(hm, s);
  //       }
  //   }
  // }
};
</script>
<style lang="scss">
// @import "./assets/styles/mixin.scss";
#app {
  height: 100%;
}
.overflow {
  overflow: hidden;
  height: 100%;
}
.router-fade-enter-active,
.router-fade-leave-active {
  transition: opacity 0.3s;
}
.router-fade-enter,
.router-fade-leave-active {
  opacity: 0;
}

//全局自定义样式
.m-b-10 {
  margin-bottom: 10px;
}

.f-b {
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
}

.f-b-btn {
  height: 49px;
  line-height: 49px;
  text-align: center;
  color: #fff;
  font-size: 16px;
}

.add-sub {
  display: flex;
  .handle-btn {
    height: 29px;
    line-height: 29px;
    display: inline-block;
    width: 44px;
    border: 1px solid #f05b47;
    text-align: center;
    color: #f05b47;
    font-size: 18px;
  }
  .sub {
    width: 39px;
    border-right: none;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  .add {
    width: 38px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  .no-num {
    border-color: #ffc9c9;
    color: #ffc9c9;
  }
}
</style>

<style lang="less">
@import "~vux/src/styles/1px.less";
html,
body {
  width: 100%;
  height: 100%;
}
// .page-box {
//   padding-top: 49px;
// }
// #app {
//   height: 100%;
//   width: 100%;
// }
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
body {
  background-color: #fbf9fe;
}
// * {
//   touch-action: none;
// }

/*css reset*/
html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
font,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
caption {
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0;
  font-weight: inherit;
  font-style: inherit;
  font-family: inherit;
  vertical-align: baseline;
}

body {
  font-family: "Helvetica Neue", Helvetica, STHeiTi, sans-serif;
  min-height: 100%;
  height: auto;
  position: relative;
}
html {
  font-size: 20px;
  min-height: 100%;
  height: auto;
}
ol,
ul {
  list-style: none;
}
table {
  border-collapse: collapse;
}
caption,
th,
td {
  font-weight: normal;
}
blockquote:before,
blockquote:after,
q:before,
q:after {
  content: "";
}
blockquote,
q {
  quotes: "" "";
}
a {
  text-decoration: none;
}
input {
  vertical-align: middle;
}
// img {
//   border: none;
//   vertical-align: middle;
// }
input[type="text"],
input[type="password"] {
  outline: medium;
}
input[type="submit"],
input[type="reset"],
input[type="button"],
button,
input[type="number"] {
  -webkit-appearance: none;
}

.clearfix:after {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
  font-size: 0;
  line-height: 0;
}
.clearfix {
  display: inline-block;
}
.clearfix {
  display: block;
}
html,
body {
  -webkit-text-size-adjust: none;
}
.body-ce {
  background-color: #cecece;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="text"]::-webkit-inner-spin-button,
input[type="password"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
  border-radius: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}

.fr {
  float: right;
}
.fl {
  float: left;
}
.tr {
  text-align: right;
}
.ofh {
  overflow: hidden;
}
.ml10 {
  margin-left: 1rem;
}
.mt10 {
  margin-top: 1rem;
}
.w100 {
  width: 100%;
}

.color1 {
  color: #999;
}
.none {
  display: none;
}
</style>
