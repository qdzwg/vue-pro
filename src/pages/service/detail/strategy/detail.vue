<template>
  <div class="detail-strategy">
    <div class="info">
      <h2 class="info-title">{{data.name}}</h2>
      <div class="time-pv">
        <span class="time">上传日期:{{timeFormatter(data.createTime)}}</span>
        <span>浏览量:{{data.pv?data.pv+10:10}}</span>
      </div>
    </div>
    <div v-if="data.musicAddr" class="audio-warper" @click="startPlayOrPause">
      <div class="audio-img">
        <img :src="audioStart?stop:start" alt />
      </div>
      <div class="audio-content">
        <div class="audio-title">{{data.name}}</div>
        <vue-audio ref="vueAudio" :isDrag="false" @audioEnd="audioEnd" :audioSrc="data.musicAddr"></vue-audio>
      </div>
    </div>
    <template v-for="(item,index) in data.contentVoList">
      <div v-if="returnFlag(index)" :key="index">
        <!-- <div class="title-time">{{item.subHeading}}</div> -->
        <div class="content" v-html="item.content"></div>
      </div>
    </template>

    <div v-if="data.latitudeLongitude" class="address" @click="openMap(data.latitudeLongitude)">
      <i class="icon iconfont icondingweiweizhi"></i>
      <span class="address-text">点击去这里</span>
    </div>
    <slot></slot>
  </div>
</template>
<script>
import vueAudio from "@/components/vueAudio";
export default {
  components: {
    vueAudio
  },
  props: {
    activeIndex: {
      type: String | Number,
      default: 0
    },
    isTab: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  computed: {},
  watch: {
    activeIndex(val) {
      this.showIndex = val;
    }
  },
  methods: {
    audioEnd() {
      this.audioStart = false;
    },
    startPlayOrPause() {
      this.audioStart = !this.audioStart;
      this.$refs.vueAudio.startPlayOrPause();
    },
    openMap(latlnt, addr) {
      window.location.href =
        "//uri.amap.com/navigation?to=" +
        latlnt +
        "," +
        "&mode=car&callnative=1";
    },
    timeFormatter(time) {
      if (time) {
        time = time.replace(/-/g, "/");
        let date = new Date(time);
        let sp = "/";
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        month = month < 10 ? "0" + month : month;
        day = day < 10 ? "0" + day : day;
        return year + sp + month + sp + day;
      } else {
        return "";
      }
    },
    returnFlag(index) {
      let flag = true;
      if (this.isTab) {
        flag = index == this.showIndex;
      }
      return flag;
    }
  },
  data() {
    return {
      audioStart: false,
      start: require("@/assets/images/start.png"),
      stop: require("@/assets/images/stop.png"),
      showIndex: this.activeIndex
    };
  }
};
</script>
<style lang="scss">
.detail-strategy {
  .content {
    img {
      display: block !important;
      width: 100% !important;
    }
  }
}
</style>
<style lang="scss" scoped>
.detail-strategy {
  padding: 0 10px;
  background: #fff;
  padding-bottom: 10px;
  .audio-warper {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border: 2px solid #17ab29;
    border-radius: 4px;
    .audio-content {
      // flex: 1;
      width: 260px;
      padding-left: 10px;
      .audio-title {
        font-size: 14px;
        color: #333;
        font-weight: bold;
        white-space: nowrap; /*强制不换行*/
        overflow: hidden; /*超出部分隐藏*/
        text-overflow: ellipsis;
      }
    }
    .audio-img {
      height: 58px;
      width: 67px;
      img {
        height: 100%;
        width: 100%;
      }
    }
  }
  .address {
    display: inline-block;
    margin-top: 20px;
    color: #d43e00;
    margin-bottom: 10px;
    .address-text {
      display: inline-block;
      font-size: 13px;
      line-height: 13px;
      border-bottom: 1px solid #d43e00;
    }
  }
  .content {
    padding-top: 5px;
  }
  .info {
    .info-title {
      font-size: 19px;
      color: #333;
      font-weight: bold;
      padding-top: 8px;
    }
    .time-pv {
      font-size: 12px;
      color: #666;
      .time {
        margin-right: 35px;
      }
    }
  }
  .title-time {
    height: 20px;
    line-height: 20px;
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-top: 10px;
  }
}
</style>