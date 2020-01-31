<template>
  <div class="layer-cover-fixed"
       v-if="show">
    <div class="pay-agreement-layer center-fixed">
      <div class="pay-agreement-cont">
        <div class="pay-agreement-scroll">
          <slot></slot>
        </div>
      </div>
      <div class="pay-agreement-foot vux-1px-t">
        <x-button class="btn"
                  type="primary"
                  mini
                  @click.native="hide">确认</x-button>
      </div>
    </div>
  </div>
</template>
<script>
import { XButton } from "vux";

export default {
  data () {
    return {
      show: false
    };
  },
  components: { XButton },
  methods: {
    hide () {
      this.show = false;
    }
  }
};
</script>
<style lang='scss' scoped>
.center-fixed {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.layer-cover-fixed {
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 99;
  top: 0;
  left: 0;
}

.pay-agreement-layer {
  background-color: #fff;
  max-height: 380px;
  width: 300px;
  border-radius: 5px;
}
.pay-agreement-cont {
  max-height: 330px;
  padding: 15px;
  box-sizing: border-box;
}
.pay-agreement-scroll {
  max-height: 300px;
  overflow: scroll;
}
.pay-agreement-foot {
  text-align: center;
  // border-top: 1px solid #d1d1d1;
  height: 50px;
  padding: 7px 15px;
  box-sizing: border-box;
  .btn {
    color: #fff;
    background: #de6550;
  }
}
</style>