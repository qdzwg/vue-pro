<template>
  <div class="hello">
    <page-header :isBack="false" title="测试首页"></page-header>
    <span style="font-size:1rem" class="xx-icon icon-chanpinfengfu"></span>
    <div>asdasda{{test("sdfsdfs")}}</div>
    {{'200adsad'|px2rem}}{{"132131"|px2rem}}
    <router-link to="/demo">跳转21</router-link>
    <div :style="{width:this.filter.px2rem('200px')}">{{this.$route.query.m_id}}</div>
    <img src alt>
    <div>
      <router-link to="/list">list</router-link>
    </div>
    <div>
      <router-link to="/sasdada">no-apge</router-link>
    </div>

    <div>
      <router-link to="/404">40411</router-link>
    </div>

    <div class="remdemo">
      <div class="test"></div>
    </div>
    <div style="height:250px;">
      <router-link to="/demo">跳转2</router-link>
    </div>
    <div style="height:250px;">
      <router-link to="/demo">跳转2</router-link>
    </div>
    <div style="height:250px;">
      <router-link to="/demo">跳转2</router-link>
    </div>
    <div style="height:250px;">
      <router-link to="/demo">跳转2</router-link>
    </div>
    <div style="height:250px;">
      <router-link to="/demo">跳转2</router-link>
    </div>
    <div style="height:250px;">
      <router-link to="/demo">跳转2</router-link>
    </div>
    <div style="height:250px;">
      <router-link to="/demo">跳转2</router-link>
    </div>
    <div style="height:250px;">
      <router-link to="/demo">跳转2</router-link>
    </div>
    <div style="height:250px;">
      <router-link to="/demo">跳转2</router-link>
    </div>

    <div style="height:250px;">
      <router-link to="/demo">跳转2</router-link>
    </div>
    <div style="height:250px;">
      <router-link to="/demo">跳转2</router-link>
    </div>
    <footer-bottom></footer-bottom>
  </div>
</template>

<script>
import pageHeader from "@/components/header";
import footerBottom from "@/components/footer";
export default {
  name: "HelloWorld",
  components: {
    pageHeader,
    footerBottom
  },
  data() {
    return {
      msg: "Welcome to Your Vue.js App"
    };
  },
  mounted() {
    // this.getAxios("/asdsada");
  },
  methods: {
    test(val) {
      return val + "px";
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
// @import "../assets/font/iconfont.css";
.hello {
  padding-top: 49px;
  padding-bottom: 49px;
}
.remdemo {
  width: 100px;
  height: 250px;
  background: red;
  .test {
    width: 50px;
    height: 50px;
    background: yellow;
  }
}
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
