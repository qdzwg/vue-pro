<template>
  <div class="old-custom-warpper" :class="{'have-footer':isHaveFooter}">
    <template v-for="(item,index) in comList">
      <div :key="index" class="old-custom-item">
        <search v-if="item.type=='Search__normal'"></search>
        <head-logo v-if="item.type=='Header__logo'" :pageData="item.data"></head-logo>
        <banner v-if="item.type=='Banner__swiper1'" :pageData="item.data"></banner>
        <side-banner v-if="item.type=='Bill__normal'" :pageData="item.data"></side-banner>
        <free-layout v-if="item.type=='Nav__normal'" :pageData="item.data"></free-layout>
        <nav-layout v-if="item.type=='Nav__normal2'" :pageData="item.data"></nav-layout>
        <product-group v-if="item.type=='ProductList__normal'" :pageData="item.data"></product-group>
        <product v-if="item.type=='Product__normal'" :pageData="item.data"></product>
        <product2 v-if="item.type=='Product__normal2'" :pageData="item.data"></product2>
        <page-footer v-if="item.type=='Footer__normal'&&item.data.list.length" :pageData="item.data"></page-footer>
      </div>
    </template>
  </div>
</template>
<script>
import search from "./customComponent/search";
import headLogo from "./customComponent/headLogo";
import banner from "./customComponent/banner";
import sideBanner from "./customComponent/sideBanner";
import freeLayout from "./customComponent/freeLayout";
import navLayout from "./customComponent/navLayout";
import productGroup from "./customComponent/productGroup";
import product from "./customComponent/product";
import product2 from "./customComponent/product2";
import pageFooter from "./customComponent/footer";
export default {
  components: {
    search,
    headLogo,
    banner,
    sideBanner,
    freeLayout,
    navLayout,
    productGroup,
    product,
    product2,
    pageFooter
  },
  props: {
    comList: {
      type: Array,
      default: []
    }
  },
  computed:{
    isHaveFooter(){
      let flag = false
      this.comList.forEach(item=>{
        if(item.type =="Footer__normal"&&item.data.list.length){
          //存在底部导航，并且，底部导航是有内容的
          flag = true
        }
      })
      return flag
    }
  },
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
.old-custom-warpper {
  .old-custom-item {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
.have-footer{
  padding-bottom: 60px;
}
</style>


