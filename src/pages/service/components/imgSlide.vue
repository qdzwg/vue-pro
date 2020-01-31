<template>
  <div class="img-box" :style="{height:height}">
    <swiper
      @on-index-change="indexChange"
      :auto="autoFlag"
      loop
      :show-dots="false"
      :interval="2000"
      :height="height"
      class="text-scroll"
      dots-position="center"
    >
      <swiper-item v-for="(item,index) in urlList" :key="index">
        <img
          style="width:100%;height:100%"
          :src="item.imgUrl + '?imageMogr2/thumbnail/640x/strip/quality/100'"
          alt
        />
      </swiper-item>
    </swiper>
    <div class="dots-box">
      <i class="xx-icon icon-tupian1" style="font-size:12px;color:#fff;"></i>
      <span>{{currentIndex}} / {{urlList.length}}</span>
    </div>
  </div>
</template>
<script>
import {
  Swiper,
  SwiperItem,
  Popup,
  Group,
  XDialog,
  Checker,
  CheckerItem
} from "vux";
export default {
  props: {
    height: {
      type: String,
      default: "0"
    },
    
    imgList: {
      type: Array,
      default: () => []
    },autoFlag:{
        type:Boolean,
        default:true
    }
  },
  components: {
    Swiper,
    SwiperItem
  },
  data() {
    return {
      currentIndex: 1,
      urlList: this.imgList
    };
  },
  watch: {
    imgList(val) {
      console.log(val)
      this.urlList = val;
    }
  },
  methods: {
    indexChange(currentIndex) {
      this.currentIndex = currentIndex + 1;
    }
  }
};
</script>
<style lang="scss">
.img-box {
  position: relative;
  .dots-box {
    text-align: center;
    position: absolute;
    right: 10px;
    bottom: 8px;
    width: 64px;
    height: 23px;
    line-height: 23px;
    border-radius: 2px;
    font-size: 12px;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
  }
}
</style>