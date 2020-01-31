<template>
  <div class="audio-bar">
    <!-- {{audioSrc}} -->
    <!-- {{sourceSrc}} -->
    <!-- {{audio}} -->
    <!-- 此处的ref属性，可以很方便的在vue组件中通过 this.$refs.audio获取该dom元素 -->
    <audio
      ref="audio"
      v-if="show"
      @pause="onPause"
      @play="onPlay"
      @timeupdate="onTimeupdate"
      @canplay="onLoadedmetadata"
      :src="sourceSrc"
      controls="controls"
      style="display:none;"
    ></audio>

    <!-- 音频播放控件 -->
    <div>
      <!-- <button @click="startPlayOrPause">{{audio.playing | transPlayPause}}</button> -->
      <div class="slider" @touchstart="handleTouchStart">
        <div class="slider-track"></div>
        <div class="slider-fill" :style="'width:'+sliderTime+'%'"></div>
        <div v-if="isDrag" class="slider-thumb" :style="'left:'+sliderTime+'%'"></div>
      </div>
      <div class="time-bar">
        <div>{{ audio.currentTime | formatSecond}}</div>
        <div>{{ audio.maxTime | formatSecond}}</div>
      </div>
    </div>
  </div>
</template>

<script>
// 将整数转换成 时：分：秒的格式
function realFormatSecond(second) {
  var secondType = typeof second;

  if (secondType === "number" || secondType === "string") {
    second = parseInt(second);

    var hours = Math.floor(second / 3600);
    second = second - hours * 3600;
    var mimute = Math.floor(second / 60);
    second = second - mimute * 60;

    return (
      hours + ":" + ("0" + mimute).slice(-2) + ":" + ("0" + second).slice(-2)
    );
  } else {
    return "0:00:00";
  }
}

export default {
  props: {
    isDrag: {
      type: Boolean,
      default: true
    },
    audioSrc: {
      type: String,
      default: ""
    }
  },
  watch: {
    audioSrc: {
      handler(val) {
        console.log(val);
        this.initData(val);
        this.sliderTime = 0;
        this.audio = {
          // 该字段是音频是否处于播放状态的属性
          playing: false,
          // 音频当前播放时长
          currentTime: 0,
          // 音频最大播放时长
          maxTime: 0,
          minTime: 0,
          step: 0.1
        };
      },
      immediate: true
    }
  },
  data() {
    return {
      show: false,
      sourceSrc: "",
      sliderTime: 0,
      audio: {
        // 该字段是音频是否处于播放状态的属性
        playing: false,
        // 音频当前播放时长
        currentTime: 0,
        // 音频最大播放时长
        maxTime: 0,
        minTime: 0,
        step: 0.1
      }
    };
  },
  mounted() {
    // this.initData(this.audioSrc);
  },
  methods: {
    initData(src) {
      this.show = false;
      this.$nextTick(() => {
        this.sourceSrc = src;
        this.show = true;
      });
    },
    // 控制音频的播放与暂停
    startPlayOrPause() {
      console.log(this.audio.playing);
      return this.audio.playing ? this.pause() : this.play();
    },
    // 播放音频
    play() {
      console.log("你的播放开启了");
      this.$refs.audio.play();
    },
    // 暂停音频
    pause() {
      this.$refs.audio.pause();
    },
    // 当音频播放
    onPlay() {
      console.log("检测到你播放中");
      this.audio.playing = true;
    },
    // 当音频暂停
    onPause() {
      this.audio.playing = false;
    },
    handleFocus() {
      console.log("focues");
    },
    // 当加载语音流元数据完成后，会触发该事件的回调函数
    // 语音元数据主要是语音的长度之类的数据
    onLoadedmetadata(res) {
      // console.log("loadedmetadata");
      console.log(res);
      console.log(res.target.duration);
      this.audio.maxTime = parseInt(res.target.duration);
    },
    // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
    // 当音频当前时间改变后，进度条也要改变
    onTimeupdate(res) {
      // console.log("timeupdate");
      // console.log(res)
      this.audio.currentTime = res.target.currentTime;
      let time = parseInt((this.audio.currentTime / this.audio.maxTime) * 100);
      this.sliderTime = time > 100 ? 100 : time;
      if (time >= 100) {
        this.$emit("audioEnd");
      }
    },

    // 进度条格式化toolTip
    formatProcessToolTip(index = 0) {
      index = parseInt((this.audio.maxTime / 100) * index);
      return "进度条: " + realFormatSecond(index);
    },

    handleTouchStart(e) {
      if (this.isDrag) {
        this.setValue(e.touches[0]);

        document.addEventListener("touchmove", this.handleTouchMove);
        document.addEventListener("touchup", this.handleTouchEnd);
        document.addEventListener("touchend", this.handleTouchEnd);
        document.addEventListener("touchcancel", this.handleTouchEnd);
      }

      // e.preventDefault();
      // this.onDragStart(e);
    },
    handleTouchMove(e) {
      console.log(e.changedTouches[0]);
      this.setValue(e.changedTouches[0]);
    },
    handleTouchEnd(e) {
      this.setValue(e.changedTouches[0]);
      document.removeEventListener("touchmove", this.handleTouchMove);
      document.removeEventListener("touchup", this.handleTouchEnd);
      document.removeEventListener("touchend", this.handleTouchEnd);
      document.removeEventListener("touchcancel", this.handleTouchEnd);
      // this.onDragStop(e);
    },
    // 从点击位置更新 value
    setValue(e) {
      const $el = this.$el;
      const { maxTime, minTime, step } = this.audio;
      let value =
        ((e.clientX - $el.getBoundingClientRect().left) / $el.offsetWidth) *
        (maxTime - minTime);
      value = Math.round(value / step) * step + minTime;
      value = parseFloat(value.toFixed(5));

      if (value > maxTime) {
        value = maxTime;
      } else if (value < minTime) {
        value = minTime;
      }
      this.$refs.audio.currentTime = value;
    },
    // 拖动进度条，改变当前时间，index是进度条改变时的回调函数的参数0-100之间，需要换算成实际时间
    changeCurrentTime(index) {
      console.log("拖动进度条");
      // this.audio.playing && this.pause();
      // console.log('拖动了',index,this.sliderTime,this.audio.maxTime,parseInt(index / 100 * this.audio.maxTime))
      // !this.audio.playing && this.play();
      this.$refs.audio.currentTime = parseInt(
        (index / 100) * this.audio.maxTime
      );
    }
  },
  filters: {
    // 使用组件过滤器来动态改变按钮的显示
    transPlayPause(value) {
      return value ? "暂停" : "播放";
    },
    // 将整数转化成时分秒
    formatSecond(second = 0) {
      return realFormatSecond(second);
    }
  }
};
</script>

<style lang="scss">
.audio-bar {
  // padding:
}
.time-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
  color: #ccc;
}
.slider {
  // margin-top: 100px;
  width: 100%;
  position: relative;
  height: 12px;
  display: flex;
  align-items: center;
  cursor: default;
  user-select: none;
  outline: none;
}

.slider-track {
  position: absolute;
  height: 4px;
  left: 0;
  right: 0;
  top: 50%;
  margin-top: -2px;
  background-color: #bec2c1;
  border-radius: 2px;
}

.slider-fill {
  position: absolute;
  height: 4px;
  width: 100%;
  background-color: #17ab29;
  left: 0;
  top: 50%;
  margin-top: -2px;
  border-radius: 2px;
}

.slider-thumb {
  position: absolute;
  top: 50%;
  width: 12px;
  height: 12px;
  background-color: #17ab29;
  color: #17ab29;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
}
</style>