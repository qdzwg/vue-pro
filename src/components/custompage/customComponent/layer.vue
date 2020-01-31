<template>
  <transition name="fade">
    <div class="layer-box-mask" v-show="isShowLayer">
      <div class="layer-show-box" ref="box">
        <div class="img-box" @click="gotoTarget(pageData)" v-if="pageData.type === 'ad'">
          <img v-if="pageData.picAddr"
               class="img"
               :src="pageData.picAddr" ref="img" :style="imgStyle"
               @load="loadImage">
          <div v-else class="no-img-box">
            <img
              class="no-img"
              src="../../../assets/images/bannertype2.png">
          </div>
        </div>
        <div v-else class="warning-content">
          <h3 style="text-align: center">气象预警</h3>
          {{pageData.warningDesc}}
        </div>
        <!--<div v-else class="img-box">-->
        <!--<img class="no-img" src="../../../assets/images/bannertype2.png" @click="gotoTarget(pageData)">-->
        <!--</div>-->
        <div class="close">
          <span  @click.prevent.stop="close">X</span>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  import moment from 'moment'//导入文件
export default {
  props: {
    pageData: {
      type: Object,
      default: {},
    }
  },
  data() {
    return {
      imgStyle:{
        marginTop:""
      },

      isShowLayer:false,
      timeOutShow:null,
      timeOut:null
    };
  },
  computed: {

  },
  watch:{
    // pageData:{
    //   handler:function(val,oldval){
    //     console.log(val.picAddr)
    //     if(val.picAddr){
    //       this.$nextTick(this.resetImgPosition())
    //     }
    //   },
    //   immediate:true
    // },
  },
  created() {

  },
  mounted(){
    //  判断规定时间内是否已经弹出了设置的次数
    this.isOutRate()
    // // 图片高度过高，截取头部图片
    // this.$nextTick(()=>{this.resetImgPosition()})
  },
  destroyed() {},
  methods: {
    // 图片加载完成时
    loadImage(){
      // 图片高度过高，截取头部图片
      this.$nextTick(()=>{this.resetImgPosition()})
    },
    close () {
      if(this.isShowLayer){
        if(this.timeOut){
          clearTimeout(this.timeOut)
        }
        this.isShowLayer = false
      }
    },
    // 根据设置的展示时间，时间到了隐藏弹框
    timeOutClose(){
      if(this.isShowLayer){
        if(this.timeOut){
          clearTimeout(this.timeOut)
        }
        this.timeOut = setTimeout(()=>{
          this.close()
        },this.pageData.time*1000)
      }
    },
    // 判断规定时间内是否已经弹出了设置的次数
    isOutRate(){
      // 设置的次数
      let rate = this.pageData.rate
      // 已经弹出的次数
      let hasRate = 0
      if(rate){
        // 时间周期限制
        let interval = this.pageData.interval
        // 需要存储到浏览器的次数
        let rateStore = {}
        // 一天内打开的次数
        let rateStoreObj = JSON.parse(localStorage.getItem('rateStore') || '{}')
        // 当前时间
        let nowDayStr
        if(interval == 'oneDay'){
          // 一天
          // 获取当前年月日
          nowDayStr = moment().format("YYYY-MM-DD")
        }else if(interval == 'oneWeek'){
          // 一周
          let week1 = moment().weekday('1').format("YYYY-MM-DD");//周一
          let week2 = moment().weekday('7').format("YYYY-MM-DD");//周日
          // 获取当前年月日
          nowDayStr = week1+"至"+week2

        }else if(interval == 'oneMonth'){
          // 一月
          // 获取当前年月日
          nowDayStr = moment().format("MM")
        }else if(interval == 'oneYear'){
          // 一年
          // 获取当前年月日
          nowDayStr = moment().format("YYYY")
        }
        if(rateStoreObj[nowDayStr]){
          hasRate = rateStoreObj[nowDayStr]
          if(hasRate>=rate){
            // 已经弹出了设置的次数
            this.isShowLayer = false
            return
          }
          rateStore[nowDayStr]=rateStoreObj[nowDayStr]+1
        }else{
          rateStore[nowDayStr] = 1
        }
        localStorage.setItem('rateStore',JSON.stringify(rateStore))
        if(this.timeOutShow){
          clearTimeout(this.timeOutShow)
        }
        this.timeOutShow = setTimeout(()=>{
          this.isShowLayer = true
          if(this.pageData.time != 'unlimit'){
            this.timeOutClose()
          }
        },200)
      }else{
        this.isShowLayer = false
      }
    },
    // 图片高度过高，截取头部图片
    resetImgPosition(){
      if(this.$refs.img && this.$refs.box){
        let imgh = this.$refs.img.offsetHeight+40;
        let boxh = this.$refs.box.offsetHeight;
        if(imgh>boxh){
          this.imgStyle.marginTop = -(imgh-boxh)+"px"
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
  /*渐入渐出*/
  .fade-enter,
  .fade-leave-to{
    opacity: 0;
  }
  .fade-enter-to,.fade-leave{
    opacity: 1;
  }
  .fade-enter-active,
  .fade-leave-active{
    transition: opacity 1s;
  }

  .layer-box-mask {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.5);
    z-index: 10;
    .layer-show-box{
      box-sizing: border-box;
      position: absolute;
      top:50%;
      left: 50%;
      max-height: 80%;
      overflow: hidden;
      transform: translate(-50%,-50%);
      width: 100%;
      padding: 0 20px;
      .img-box {
        overflow: hidden;
        border-radius: 10px;
        box-sizing: border-box;
        width: 100%;
        /*background-color: #fff;*/
        text-align: center;
        padding-bottom: 40px;
        .img{
          border-radius: 10px;
          width: 100%;
        }
        .no-img-box{
          background-color: #fff;
          border-radius: 10px;
          padding: 10px 0;
        }
        .no-img {
          border-radius: 10px;
          width: 174px;
          height: 101px;
          margin-top: 30px;
          margin-right: 21px;
        }
        .no-text{
          font-size: 13px;
          color: #999;
          margin-top: 6px;
        }
      }
      .warning-content{
        background: #fff;
        padding: 20px;
      }
      .close{
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 0.693333rem;
        /*background-color: #fff;*/
        bottom: -10px;
        left: 0;
        position: absolute;
        width: 100%;
        color: #fff;
      }
    }
  }
</style>

