<template>
  <div class="banner-warpper">
    <swiper dots-position="center" :auto="true" height="4.84rem" dots-class="bottom-dots">
      <swiper-item class="swiper-demo-img" v-for="(item, index) in pageData" :key="index">
        <img @click="go(item.picLink)" style="width:100%;height:100%" :src="item.picAddr">
      </swiper-item>
    </swiper>
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
  methods: {
    go(url) {
      if (url) {
        window.location.href = url;
      }
    }
  }
};
</script>
<style lang="scss">
.banner-warpper {
  .bottom-dots {
    // padding: 10px;
    a {
      .vux-icon-dot {
        width: 8px !important;
        height: 8px !important;
        border: 4px;
        background: rgba(0, 0, 0, 0.4) !important;
      }
      .vux-icon-dot.active {
        width: 15px !important;
        background: #fff !important;
      }
    }
  }
}
</style>


