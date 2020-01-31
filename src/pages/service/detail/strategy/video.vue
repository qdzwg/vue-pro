<template >
  <div>
    <video-player
      class="video-player vjs-custom-skin"
      ref="videoPlayer"
      :playsinline="true"
      :options="playerOptions"
      @play="onPlayerPlay($event)"
      @pause="onPlayerPause($event)"
    ></video-player>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    videoSrc: {
      type: String,
      default: ""
    }
  },
  watch: {
    videoSrc(val) {
      this.src = val;
      this.playerOptions = {
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "video/mp4",
            src: val
          }
        ],
        width: document.documentElement.clientWidth,
        notSupportedMessage: "此视频暂无法播放，请稍后再试"
      };
    }
  },
  methods: {
    onPlayerPlay(player) {
      //   alert("play");
    },
    onPlayerPause(player) {
      //   alert("pause");
    }
  },
  data() {
    return {
      playerOptions: {
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "video/mp4",
            src: this.videoSrc
          }
        ],
        poster: "poster.jpg", //你的封面地址
        width: document.documentElement.clientWidth,
        notSupportedMessage: "此视频暂无法播放，请稍后再试"
      },
      src: this.videoSrc
    };
  }
};
</script>
<style lang="scss">
.video-player.vjs-custom-skin {
  .video-js {
    padding-top: 0;
    height: 198px !important;
    button.vjs-big-play-button {
      height: 49px !important;
      width: 49px !important;
      text-align: center;
      line-height: 43px !important;
      border-radius: 50% !important;
      border-width: 4px;
      background-color: transparent;
      border-color: rgba(255, 255, 255, 0.7);
      margin-left: 0 !important;
      margin-top: 0 !important;
      transform: translate(-50%, -50%);
      .vjs-icon-placeholder {
        font-size: 32px;
        color: rgba(255, 255, 255, 0.7);
      }
    }
    .vjs-control-bar{
      bottom: 8px !important;
    }
  }
}
</style>