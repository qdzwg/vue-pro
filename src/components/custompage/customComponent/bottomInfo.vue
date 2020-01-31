<template>
<div>
  <div
    v-if="show"
    :style="{backgroundColor:pageData.backgroundColor,backgroundImage:'url('+pageData.imgUrl+')'}"
    class="bottom-info-box"
  >
    <div class="bottom-info-logo">
      <img :src="pageData.logo" alt="">
    </div>
    <div class="bottom-info-code-list">
      <div class="bottom-info-code-item" v-for="(item, index) in pageData.codeList" :key='index'>
        <img :src="item.imgUrl" alt="">
        <div>{{item.name}}</div>
      </div>
    </div>
    <div class="bottom-info-link-list">
      <div class="bottom-info-link-item" @click='linkTo(item)' :style="{width:100/pageData.lineNum+'%'}" v-for="(item, index) in pageData.linkList" :key='index'><div :style="{backgroundColor:pageData.linkBackgroundColor}">{{item.text}}</div></div>
    </div>
    <div class="bottom-info-text">
      <div>{{pageData.address}}</div>
      <div>{{pageData.info}}</div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    pageData: {
      type: Object,
      default: {
        range: [],
        imgUrl: "",
        address: "",
        info: "",
        logo: "",
        linkBackgroundColor: "#ffffff",
        backgroundColor: "#ffffff",
        lineNum: '4',
        linkList: [{
          text: '',
          customLinkObj: {},
          backgroundColor: '#fff',
        }],
        codeList: [{
          name: "",
          imgUrl: ""
        }],
      },
    }
  },
  data() {
    return {
      
    };
  },
  computed: {
    show() {
      let path = this.$route.path;
      let range = this.pageData.range;
      if(path === '/'){
        return range.indexOf("homepage") > -1;
      }else if(path === '/custompage'){
        return range.indexOf("custompage") > -1;
      }else if(path === '/list/strategy'){
        return range.indexOf("strategyListPage") > -1;
      }else if(path === '/detail/strategy'){
        return range.indexOf("strategyDetaliPage") > -1;
      }
      return false;
    }
  },
  created() {
    
  },
  methods: {
    linkTo(item) {
      this.gotoTarget(item.customLinkObj);
    },
  }
};
</script>
<style lang='scss'>
.bottom-info-box {
  padding: 10px 0px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  border: 1px solid rgba(215, 215, 215, 1);
  color: #fff;
  text-align: center;
  min-height: 180px;
  .bottom-info-logo {
    margin: 15px 0px;
    img {
      width: 136px;
      height: 48px;
    }
  }
  .bottom-info-code-list {
    display: flex;
    font-size: 14px;
    line-height: 32px;
    justify-content: center;
    flex-wrap: wrap;
    .bottom-info-code-item {
      display: flex;
      align-items: center;
      flex-grow: 0;
      flex-shrink: 0;
      margin: 0px 10px;
      flex-direction: column;
      img {
        width: 82px;
        height: 82px;
      }
    }
  }
  .bottom-info-link-list {
    display: flex;
    flex-wrap: wrap;
    color: #ccc;
    justify-content: center;
    font-size: 16px;
    line-height: 36px;
    margin: 10px 2px 5px;
    .bottom-info-link-item {
      flex-grow: 0;
      flex-shrink: 0;
      box-sizing: border-box;
      border: 1px solid transparent;
    }
  }
}
</style>
