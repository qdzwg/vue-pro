<template>
    <div>
        <transition name="fade">
            <div class="action-sheet" v-if="value">
                <h3 class="title">{{title}}<span class="vux-close" @click="close"></span></h3>
                <slot></slot>
            </div>
        </transition>
        <transition name="mask">
            <div class="mask" v-if="value" @click="close">

            </div>
        </transition>
    </div>
    
</template>

<script>
export default {
  components: {},
  props: {
      title:{
          type:String,
          default:'',
      },
      value:{
        type:Boolean,
        default:false,
      }
  },
  data() {
    return {
    };
  },
  watch: {},
  computed: {},
  methods: {
      close(){
          this.$emit('input', false)
          this.$emit('close')
      }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
.action-sheet{
    position: fixed;
    bottom:0;
    left:0;
    right:0;
    z-index:99;
    background-color: #fff;
    .title{
        position: relative;
        height:50px;
        text-align:center;
        line-height: 50px;
        font-size: 16px;
        color:#323233;
        overflow: hidden;
    &:after{
        position: absolute;
        box-sizing: border-box;
        content: ' ';
        pointer-events: none;
        right: 0;
        bottom: 0;
        left: 0;
        border-bottom: 1px solid #e1e1e1;
        transform: scaleY(0.5);
      }
    }
    .vux-close {
        float: right;
        position: relative;
        // display: inline-block;
        vertical-align: middle;
        color: #999;
        width: 40px;
        height: 50px;
        &:before,
        &:after {
            content: '';
            position: absolute;
            left: 0;
            top: 25px;
            width: 30px;
            height: 1px;
            background-color: currentColor;
            transform: rotate(-45deg);
        }
        &:after {
            transform: rotate(45deg);
        }
    }
}
.mask{
    position: fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    z-index:66;
    background-color: rgba(0,0,0,0.8);
}
.fade-enter-active, .fade-leave-active {
    transition: all .3s ease;
    transform: translate3d(0,0,0)
}
.fade-enter, .fade-leave-to /* .fade-leave-active 在低于版本 2.1.8 中 */ {
    transform: translate3d(0,100%,0)
}
.mask-enter-active, .mask-leave-active {
    transition: opacity .5s;
}
.mask-enter, .mask-leave-to /* .fade-leave-active 在低于版本 2.1.8 中 */ {
    opacity: 0;
}
</style>