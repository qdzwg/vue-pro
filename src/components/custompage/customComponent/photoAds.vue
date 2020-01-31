<template>
  <div class="photoAds" :class="{'white-spce':pageData.imgFill=='white'}">
    <!-- 轮播 -->
    <div class="photoAds-box" v-if="pageData.type=='banner1'">
      <swiper dots-position="center" :auto="true" height="4.84rem" dots-class="bottom-dots">
        <swiper-item class="swiper-demo-img" v-for="(item, index) in pageData.list" :key="index">
          <img style="width:100%;height:100%" :src="item.picAddr+'?imageMogr2/thumbnail/640x/strip/quality/100'" @click="gotoTarget(item)" />
          <div v-if="pageData.hideText=='F'" class="banner-text-content">
            <span class="banner-text">{{item.title}}</span>
          </div>
        </swiper-item>
      </swiper>
    </div>
    <!-- 单图横滑 -->
    <div class="photoAds-shuffling" style="line-height: 0px;" v-if="pageData.type=='banner4'">
      <div class="shuffling-item" style="overflow-x:scroll">
        <div
          @click="gotoTarget(item)"
          class="shuff-img shuff-bcg"
          v-for="(item,index) in pageData.list"
          :key="index"
          style="overflow: hidden;"
          :style="{backgroundImage:item.picAddr?('url('+item.picAddr+'?imageMogr2/thumbnail/640x/strip/quality/100)'):'none',borderRadius: pageData.imgRadius=='special'?'5px':'0px'}"
        >
          <!-- <img style="height:100%;width:100%" :src="item.picAddr+'?imageMogr2/thumbnail/640x/strip/quality/100'" alt /> -->
          <div v-if="pageData.hideText=='F'" class="text">{{item.title}}</div>
        </div>
      </div>
    </div>
    <!-- 左右滑动 -->
    <div class="photoAds-shuffling" v-if="pageData.type=='banner3'">
      <div class="shuffling-item" style="overflow-x:scroll">
        <div
          @click="gotoTarget(item)"
          class="shuff-img"
          v-for="(item,index) in pageData.list"
          :key="index"
        >
          <img style="height:100%;width:100%" :src="item.picAddr+'?imageMogr2/thumbnail/640x/strip/quality/100'" alt />
          <div v-if="pageData.hideText=='F'" class="text">{{item.title}}</div>
        </div>
      </div>
    </div>
    <!-- 一行一图 -->
    <div class="line-figure" v-if="pageData.type=='banner2'">
      <div
        @click="gotoTarget(item)"
        class="line-figure-item"
        v-bind:style="{height:pageData.imgHeightAuto=='F'?'4.626667rem':'100%'}"
        v-for="(item,index) in pageData.list"
        :key="index"
      >
        <div
          v-if="pageData.hideText=='F'"
          class="text"
          :style="{bottom:pageData.imgHeightAuto=='F'?'0':'5px'}"
        >
          <span style="margin-left:10px;">{{item.title}}</span>
        </div>
        <img
          :src="item.picAddr+'?imageMogr2/thumbnail/640x/strip/quality/100'"
          alt
          :style="{height:pageData.imgHeightAuto=='T'?'auto':'4.626667rem',width:'100%'}"
        />
        <!--是否存在热区-->
        <template v-if="item.hotList && item.hotList.length">
          <div
            v-for="(sitem,sindex) in item.hotList"
            :key="sindex"
            @click.stop="gotoTarget(sitem)"
            :style="{height:filter.px2rem(sitem.height/2+'px'),
                       width:filter.px2rem(sitem.width/2+'px'),
                       left:filter.px2rem(sitem.left/2+'px'),
                       top:filter.px2rem(sitem.top/2+'px'),
                       zIndex:sitem.zIndex,
                       position:'absolute',
                       }"
          ></div>
        </template>
      </div>
    </div>
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
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      indicatorDots: true,
      circular: true,
      autoplay: true,
      interval: 3000,
      duration: 500,
      activeIndex: 0
    };
  },
  methods: {
    gourl(linkUrl, id) {
      if (linkUrl) {
        this.goNavurl(linkUrl, id);
      }
    },
    currentChange(test) {
      //轮播图下标改变
      this.activeIndex = test.mp.detail.current;
    }
  }
};
</script>
<style lang='scss'>
.photoAds {
  width: 100%;
  .banner-text-content {
    position: absolute;
    left: 0;
    bottom: 0;
    color: #fff;
    width: 100%;
    white-space: nowrap;
    .banner-text {
      margin-left: 10px;
      font-size: 15px;
    }
  }
  .photoAds-box {
    .vux-slider {
      .bottom-dots {
        a {
          .vux-icon-dot {
            width: 7px;
            height: 7px;
            background: #f4aaa0;
          }
          .vux-icon-dot.active {
            background: #f05b47;
          }
        }
      }
    }
    position: relative;
    .photoAds-item {
      height: 181px;
      position: relative;
      image {
        width: 100%;
        height: 181px;
        display: inline-block;
      }
      .text {
        width: 100%;
        height: 30px;
        line-height: 30px;
        color: #fff;
        font-size: 15px;
        background-color: rgba(31, 30, 30, 0.418);
        position: absolute;
        bottom: 0;
        left: 0;
      }
    }
    .dots-list {
      position: absolute;
      width: 100%;
      bottom: 12.5px;
      left: 0px;
      display: flex;
      justify-content: center;
      .dots-item {
        height: 7px;
        width: 7px;
        margin: 0 5px;
        border-radius: 50%;
        background: #f4aaa0;
      }
      .dots-item.active {
        background: #f05b47;
      }
    }
  }
  .photoAds-shuffling {
    // padding: 5px 4px;
    background-color: #fff;
    .shuffling-item {
      box-sizing: border-box;
      overflow: hidden;
      white-space: nowrap;
      ::-webkit-scrollbar {
        width: 0;
        height: 0;
        color: transparent;
      }
    }
    .shuff-img {
      margin-right: 4px;
      display: inline-block;
      position: relative;
      width: 160px;
      height: 110px;
      &:last-child {
        margin-right: 0;
      }
      image {
        width: 100%;
        height: 100%;
      }
      .text {
        width: 155px;
        height: 25px;
        line-height: 25px;
        margin-bottom: 5px;
        color: #fff;
        font-size: 13px;
        padding-left: 5px;
        background-color: rgba(31, 30, 30, 0.418);
        position: absolute;
        bottom: 0;
        left: 0;
      }
    }
    .shuff-bcg {
      width: 320px;
      height: 140px;
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100% auto;
      overflow: hidden;
      .text {
        font-size: 18px;
        background-color: unset;
      }
    }
  }

  .line-figure {
    width: 100%;
    .line-figure-item {
      position: relative;
      margin: 0px auto;
      // margin-bottom: 10px;
      overflow: hidden;
      img {
        width: 100%;
        display: block;
      }
      .imgHeight {
        width: 100%;
        mode: widthFix;
      }
      .text {
        width: 100%;
        height: 30px;
        line-height: 30px;
        color: #fff;
        font-size: 15px;
        background-color: rgba(31, 30, 30, 0.418);
        //   background: hsla(0,0,100%,.16);
        position: absolute;
        bottom: 5px;
        left: 0;
      }
    }
  }
  .width {
    // width: 98%;
    margin: 0 5px;
  }
}
.white-spce {
  width: calc(100% - 10px);
  padding: 0 5px;
}
</style>
