<template>
    <div class="notice" ref='noticeWarpper'>
        <div class="notice-box" v-bind:style="{color:pageData.textColor,backgroundColor:pageData.backgroundColor}">
            <i class="xx-icon icon-shengyin icon-notice" v-bind:style="{backgroundColor:pageData.backgroundColor}"></i>
            <div class="icon-text">
                <div style="display:inline-block" ref='noticeContent'>{{pageData.content}}</div>
            </div>
        </div>
    </div>
</template>
<script>
// import { getData } from "@/common/common";
export default {
  data(){
    return {
      setIntervalTime:null
    }
  },
  props: {
    pageData: {
      type: Object,
      default: {}
    }
  },
  computed: {
    // marqueeWidth() {
    //   this.pageData.content.length*10
    // }
  },
  mounted(){
    this.$nextTick(()=>{
      let bodyWidth =  parseFloat(window.getComputedStyle(this.$refs.noticeWarpper).width)
     let width =  parseFloat(window.getComputedStyle(this.$refs.noticeContent).width)
      let num = 0;
     if(width>bodyWidth-40){
       //滚动
       this.setIntervalTime = setInterval(()=>{
         num = num-1
         if(num<-width){
           num=bodyWidth
         }
          this.$refs.noticeContent.style.transform = 'translate(' + num + 'px)'
       },50)
     }
    })
  },
  methods: {},
  destroyed(){
    clearInterval(this.setIntervalTime)
  }
};
</script>
<style lang='scss'>
.notice {
  width: 100%;
  .notice-box {
    width: 100%;
    height: 43px;
    line-height: 43px;
    // color:#999999;
    font-size: 14px;
    // padding: 0 5px;
    // background-color: #fff;
    position: relative;
    .icon-notice {
      width: 20px;
      padding-left: 10px;
      position: absolute;
      top: 0px;
      left: 0px;
      z-index: 9;
    }
    .icon-text {
      //   width: 90%;
      height: 43px;
      overflow: hidden;
      white-space: nowrap;
      position: relative;
      // margin: 0 10px;
      margin-right: 10px;
      margin-left: 30px;
    }
    .animar {
      //   width: 360px;
      box-sizing: border-box;
      overflow: hidden;
      position: absolute;
      transition: all .5s;
      top: 0;
      left:30px;
      white-space: nowrap;
      animation-name: around;
      animation-duration: var(--time); /*过渡时间*/
      animation-iteration-count: infinite;
      animation-timing-function: linear;
    }
  }
  @keyframes around {
    0% {
      left: 375px;
    }
    100% {
      left: var(--marquee-width);
    }
  }

}
</style>
