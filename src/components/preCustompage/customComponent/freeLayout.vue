<template>
  <div class="free-layout-warper">
    <div v-if='pageData.length>=2' class="free-layout top">
      <div class="t-l dis-flex" @click="goLinkUrl(pageData[0])" :style="{'background':pageData[0].bgColor}">
        <img v-if="pageData[0].picAddr" :src="pageData[0].picAddr" alt>
        <i v-else class="xx-icon" :class='pageData[0].icon'></i>
        <div class="free-layout-detail">
          <div class="free-layout-title">{{pageData[0].title}}</div>
          <div class="free-layout-subtitle">{{pageData[0].subtitle}}</div>
        </div>
      </div>
      <div class="t-r dis-flex" @click="goLinkUrl(pageData[1])" :style="{'background':pageData[1].bgColor}">
        <img v-if="pageData[1].picAddr" :src="pageData[1].picAddr" alt>
        <i v-else class="xx-icon" :class='pageData[1].icon'></i>
        <div class="free-layout-detail">
           <div class="free-layout-title">{{pageData[1].title}}</div>
          <div class="free-layout-subtitle">{{pageData[1].subtitle}}</div>
        </div>
      </div>
    </div>
    <div v-if='pageData.length>=4' class="free-layout top">
      <div class="b-l dis-flex" @click="goLinkUrl(pageData[2])" :style="{'background':pageData[2].bgColor}">
         <img v-if="pageData[2].picAddr" :src="pageData[2].picAddr" alt>
        <i v-else class="xx-icon" :class='pageData[2].icon'></i>
        <div class="free-layout-detail">
           <div class="free-layout-title">{{pageData[2].title}}</div>
          <div class="free-layout-subtitle">{{pageData[2].subtitle}}</div>
        </div>
      </div>
      <div class="b-r dis-flex" @click="goLinkUrl(pageData[3])" :style="{'background':pageData[3].bgColor}" >
         <img v-if="pageData[3].picAddr" :src="pageData[3].picAddr" alt>
        <i v-else class="xx-icon" :class='pageData[3].icon'></i>
        <div class="free-layout-detail">
          <div class="free-layout-title">{{pageData[3].title}}</div>
          <div class="free-layout-subtitle">{{pageData[3].subtitle}}</div>
        </div>
      </div>
    </div>
    <div v-if='pageData.length>=6' class="free-layout">
      <div class="t-l dis-flex" @click="goLinkUrl(pageData[4])" :style="{'background':pageData[4].bgColor}">
        <img v-if="pageData[4].picAddr" :src="pageData[4].picAddr" alt>
        <i v-else class="xx-icon" :class='pageData[4].icon'></i>
        <div class="free-layout-detail">
           <div class="free-layout-title">{{pageData[4].title}}</div>
          <div class="free-layout-subtitle">{{pageData[4].subtitle}}</div>
        </div>
      </div>
      <div class="t-r dis-flex" @click="goLinkUrl(pageData[5])" :style="{'background':pageData[5].bgColor}">
         <img v-if="pageData[5].picAddr" :src="pageData[5].picAddr" alt>
        <i v-else class="xx-icon" :class='pageData[5].icon'></i>
        <div class="free-layout-detail">
          <div class="free-layout-title">{{pageData[5].title}}</div>
          <div class="free-layout-subtitle">{{pageData[5].subtitle}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    pageData: {
      type: Array,
      default: {}
    }
  },
  data() {
    return {};
  },
  methods:{
    goLinkUrl(item){
let baseUrl = process.env.NODE_ENV === 'production'?'https://wap.lotsmall.cn/':'http://testwap.lotsmall.cn/';
      let m_id = localStorage.getItem('xjsc_vue_2018_12_19_mid')
      let url = ''
      if(item.businessType=="ticket"){
        // 门票
        url = 'list/ticket?m_id=' + m_id
      }else if(item.businessType == 'hotel'){
        //酒店
        url = 'list/hotel?m_id=' + m_id
      }else if(item.businessType == 'shop'){
       url = 'list/shop?m_id=' + m_id
      }else if(item.businessType == "strategy"){
        url = 'list/strategy?m_id=' + m_id
      }else if(item.businessType == 'route'){
        url = 'list/route?m_id=' + m_id
      }else if(item.businessType == "repast"){
       url = 'list/repast?m_id=' + m_id
      }else if(item.businessType == "publicServer"){
       window.location.href='https://pubswap.zhiyoubao.com/publicMap/index/?acc=15010001000'
       return 
      }
      window.location.href = baseUrl + url
    }
  }
};
</script>
<style lang="scss" scoped>
.free-layout-warper {
  padding: 7.5px;
  background: #fff;
  .free-layout {
    display: flex;
    justify-content: space-between;
    &.top {
      margin-bottom: 10px;
    }
    .dis-flex {
      display: flex;
      height: 82px;
      align-items: center;
      justify-content: center;
      border-radius: 3px;
      .free-layout-detail {
        margin-left: 8px;
        text-align: center;
        color: #ffffff;
        .free-layout-title {
          font-size: 14px;
        }
        .free-layout-subtitle {
          font-size: 12px;
        }
      }
      .xx-icon{
          font-size: 38px;
          color: #ffffff;
      }
    }
    .t-l {
      width: 61%;
      margin-left: 1.5%;
      img {
        width: 54px;
        height: 35px;
      }
    }
    .t-r {
      width: 33%;
      margin-right: 1.5%;
      img {
        width: 39px;
        height: 35px;
      }
    }
    .b-l {
      width: 47%;
      margin-left: 1.5%;
      img {
        width: 44px;
        height: 35px;
      }
    }
    .b-r {
      width: 47%;
      margin-right: 1.5%;
      img {
        width: 50.5px;
        height: 35px;
      }
    }
  }
}
</style>
