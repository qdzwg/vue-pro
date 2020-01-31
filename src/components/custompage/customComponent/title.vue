<template>
    <div class="title">
        <div class="title-box clearfix" v-bind:style="{color:pageData.titleColor,backgroundColor:pageData.backgroundColor}">
            <div class="main-heading" :class="{width:pageData.navigationName==''}" v-bind:style="{textAlign:pageData.position,fontSize:pageData.titleFontSize+'px'}">
                <!-- <img :src="pageData.icon" :style="{width: pageData.titleFontSize+'px',height: pageData.titleFontSize+'px'}" v-if="pageData.icon" alt=""> -->
                <span :style="{paddingLeft: (Number(pageData.titleFontSize)+2)+'px',backgroundImage: 'url('+pageData.icon+')',backgroundSize: pageData.titleFontSize+'px '+pageData.titleFontSize+'px',backgroundPosition:'left center'}">{{pageData.title}}</span> 
            </div>
            <div v-if="pageData.subtitle" class="subhead" :class="{width:pageData.navigationName==''}" v-bind:style="{textAlign:pageData.position}">
               <span style="margin-left:5px;"></span> {{pageData.subtitle}}
            </div>
            <div class="title-nav" @click='gotoTarget(pageData)' v-if="pageData.navigationName!=''">
                <span class="navname">{{pageData.navigationName}}</span>
                <i class="xx-icon icon-more icon-navname"></i>
            </div>
        </div>

    </div>
</template>
<script>
export default {
  props: {
    pageData: {
      type: Object,
      default: {}
    }
  },
  methods: {
    gourl(linkUrl, id) {
        if(linkUrl){
            this.goNavurl(linkUrl, id);
        }
      
    },
  }
};
</script>
<style lang='scss'>
.title {
  width: 100%;
  .title-box {
    width: 100%;
    // background-color: #fff;
    padding: 10px 0;
    // text-align: right;
    position: relative;
    .main-heading {
      width: 75%;
      height: auto;
      // margin:0 auto;
      padding-left:9px;
      font-size: 12px;
      overflow: hidden;
      span {
        max-width: 100%;
        box-sizing: border-box;
        background-repeat: no-repeat;
        padding-left: 20px;
        vertical-align: middle;
        display: inline-block;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
    .subhead {
      width: 75%;
      height: 17px;
      // margin:5px auto;
      padding: 0 9px;
      line-height: 17px;
      font-size: 12px;
    }
    .width{
        width:100%;
        padding:0;
    }
    .title-nav {
      position: absolute;
      top: 50%;
      right: 6px;
      font-size: 12px;
      margin-top: -8px;
      .icon-navname {
        font-size: 12px;
        display: inline-block;
      }
    }
    .font-left {
      text-align: left;
    }
    .font-center {
      text-align: center;
    }
    .font-right {
      text-align: right;
    }
  }
}
</style>
