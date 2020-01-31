<template>
  <div class="nav-layout-warpper">
    <div v-for="(item,index) in pageData" :key="index" @click="goLinkUrl(item)" class="nav-item">
      <div class="nav-icon" :style="{background:item.bgColor}">
        <img v-if="item.picAddr" class="nav-img" :src="item.picAddr" alt>
        <i v-else class="xx-icon" :class="item.icon" :style="{color:item.iconColor}"></i>
      </div>
      <div class="nav-title">{{item.title}}</div>
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
      }else if(item.businessType == 'guide'){
       url = 'list/guide?m_id=' + m_id
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
.nav-layout-warpper {
  background: #fff;
  display: flex;
  justify-content: space-around;
  .nav-item {
    text-align: center;
    flex: 1;
    overflow: hidden;
    .nav-icon {
      background: red;
      border-radius: 50%;
      display: inline-flex;
      height: 50px;
      width: 50px;
      justify-content: center;
      align-items: center;
      .nav-img {
        width: 26px;
        height: 26px;
      }
      .xx-icon {
        color: #fff;
        font-size: 30px;
      }
    }
    .nav-title {
      height: 30px;
      line-height: 30px;
      color: #666;
    }
  }
}
</style>


