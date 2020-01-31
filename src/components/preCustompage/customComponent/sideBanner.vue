<template>
  <div class="side-banner-warpper">
    <img  v-for='(item,index) in pageData' :key='index' @click="go(item.picLink)" class="side-banner-img" :src="item.picAddr" alt="">
  </div>
</template>
<script>
import { Swiper, SwiperItem } from "vux";
export default {
  components: {
    Swiper,
    SwiperItem
  },
  props: {
    pageData: {
      type: Array,
      default: []
    }
  },
  data() {
    return {};
  },
  methods:{
    go(url){
      if(url){
        window.location.href = url
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.side-banner-warpper{
  .side-banner-img{
    width: 100%;
    display: inline-block;
    height: 65px;
  }
}
</style>


