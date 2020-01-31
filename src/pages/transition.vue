<template>
  <div>
    <transition name="fade">
      <div class="test" v-if="show">adsada</div>
    </transition>

    <div style="margin-top:50px;">
      <button @click="toggle">toggle</button>
    </div>
    <button @click="maskShow=!maskShow">toggl123131e</button>
    <transition name="test">
      <template v-if="maskShow">
        <div class="demo">
            <button @click="maskShow=!maskShow">test</button>
        </div>
      </template>
    </transition>
    <div @click="maskShow=!maskShow"  v-if="maskShow" class="mask"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      show: true,
      maskShow: false
    };
  },
  methods: {
    toggle() {
      this.show = !this.show;
    }
  }
};
</script>

<style>
.mask {
    position: fixed;
    top:0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 1;
    background: rgba(0,0,0,0.6);
}
.demo {
    z-index: 99;
  position: fixed;
  width: 100%;
  /* bottom: -250px; */
  left: 0;
  bottom: 0;
  height: 250px;
  background: red;
}

.test-enter-active,
.test-leave-active {
  transition: all 0.5s;
}
.test-enter, .test-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateY(250px);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  color: red;
}
.fade-enter {
  /* margin-top: 250px; */
  transform: translateX(450px);
}
</style>

