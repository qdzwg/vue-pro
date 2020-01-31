<template>
    <div class="freeLayout">
        <!-- 两左两右 -->
        <div class="free-box" :style="{'backgroundColor': pageData.bgTransparent && pageData.bgTransparent === 'T'?'':'#ffffff'}" v-if="pageData.type=='freeLayout1'">
            <div @click='gotoTarget(item)' class="free-item"  :style="{'padding-left':imgSpace,'padding-right':imgSpace}" v-for="(item,index) in pageData.list" :key="index">
                <img style="width:100%;" class="item-img" :class="{'h-a':pageData.imgHeightAuto&&pageData.imgHeightAuto ==='T'}" :src="item.picAddr +'?imageMogr2/thumbnail/640x/strip/quality/100'" alt="">
                <div v-if="pageData.hideText&&pageData.hideText=='F'" class="item-txt">
                  {{item.text?item.text:''}}
                </div>
            </div>
        </div>
        <!-- 一行两图 -->
        <div class="free-box" :style="{'backgroundColor': pageData.bgTransparent && pageData.bgTransparent === 'T'?'':'#ffffff'}" v-if="pageData.type=='freeLayout2'">
          <template  v-for="(item,index) in pageData.list">
            <div @click='gotoTarget(item)' class="free-item" :style="{'padding-left':imgSpace,'padding-right':imgSpace}" v-if="index<2" :key="index" >
                <img  style="width:100%;" class="item-img" :class="{'h-a':pageData.imgHeightAuto&&pageData.imgHeightAuto ==='T'}" :src="item.picAddr +'?imageMogr2/thumbnail/640x/strip/quality/100'" alt="">
                 <div v-if="pageData.hideText&&pageData.hideText=='F'" class="item-txt">
                  {{item.text?item.text:''}}
                </div>
            </div>
          </template>
        </div>
        <!-- 一行三图 -->
        <div class="free-box" :style="{'backgroundColor': pageData.bgTransparent && pageData.bgTransparent === 'T'?'':'#ffffff'}" v-if="pageData.type=='freeLayout3'">
          <template v-for="(item,index) in pageData.list">
            <div @click='gotoTarget(item)' class="free-item" :style="{'padding-left':imgSpace,'padding-right':imgSpace}" :class="{free3:pageData.type=='freeLayout3'}" v-if="index<3"  :key="index">
                <img style="width:100%;"  class="item-img" :class="{'h-a':pageData.imgHeightAuto&&pageData.imgHeightAuto ==='T'}" :src="item.picAddr" alt="">
                <div v-if="pageData.hideText&&pageData.hideText=='F'" class="item-txt">
                  {{item.text?item.text:''}}
                </div>
            </div>
          </template>
        </div>
        <!-- 一上两下 -->
        <div class="free-box" :style="{'backgroundColor': pageData.bgTransparent && pageData.bgTransparent === 'T'?'':'#ffffff'}" v-if="pageData.type=='freeLayout4'">
            <div @click='gotoTarget(pageData.list[0])' class="free-top">
                <img  :class="{'h-a':pageData.imgHeightAuto&&pageData.imgHeightAuto ==='T'}" :src="pageData.list[0].picAddr" alt="">
                 <div v-if="pageData.hideText&&pageData.hideText=='F'" class="item-txt">
                  {{pageData.list[0].text?pageData.list[0].text:''}}
                </div>
            </div>
            <div class="free-bottom">
              <div class="bottom-item" :style="{'padding-left':imgSpace,'padding-right':imgSpace}">
                <img  @click='gotoTarget(pageData.list[1])' :class="{'h-a':pageData.imgHeightAuto&&pageData.imgHeightAuto ==='T'}" :src="pageData.list[1].picAddr+'?imageMogr2/thumbnail/640x/strip/quality/100'" alt="">
                <div v-if="pageData.hideText&&pageData.hideText=='F'" class="item-txt">
                  {{pageData.list[1].text?pageData.list[1].text:''}}
                </div>
              </div>
              <div class="bottom-item" :style="{'padding-left':imgSpace,'padding-right':imgSpace}">
                <img  @click='gotoTarget(pageData.list[2])' :class="{'h-a':pageData.imgHeightAuto&&pageData.imgHeightAuto ==='T'}" :src="pageData.list[2].picAddr+'?imageMogr2/thumbnail/640x/strip/quality/100'" alt="">
                <div v-if="pageData.hideText&&pageData.hideText=='F'" class="item-txt">
                  {{pageData.list[2].text?pageData.list[2].text:''}}
                </div>
              </div>
            </div>
        </div>  
        <!-- 一左两右 -->
        <div class="free-left-box list5 clearfix" :class='{"list6":pageData.type=="freeLayout6"}' :style="{'backgroundColor': pageData.bgTransparent && pageData.bgTransparent === 'T'?'':'#ffffff'}" v-if="pageData.type=='freeLayout5' || pageData.type=='freeLayout6' ">
            <div class="list5-left fl" :style="{'width': (pageData.mainImgWidth ? pageData.mainImgWidth : 64.5) +'%'}">
              <div class="list5-left-content item" :class="{'fixed-height6':pageData.imgHeightAuto ==='F'}" :style="{'background': pageData.list[0].picAddr?'transparent':'#f9f9f9','margin': '0 '+ imgSpace}">
                <div class="left-img-box" :class="{'left-main-box':pageData.hideText&&pageData.hideText=='T'}" >
                  <img class="cover-img"  @click='gotoTarget(pageData.list[0])' :src="pageData.list[0].picAddr +'?imageMogr2/thumbnail/640x/strip/quality/100'" alt="">
                </div>            
                <template v-if="pageData.hideText&&pageData.hideText=='F'">
                  <div class="item-txt">
                    {{pageData.list[0].text}}
                  </div>
                </template>
              </div>                  
            </div>
            <div class="list5-right fr" :style="{'width': (pageData.mainImgWidth ? (100 - pageData.mainImgWidth) : 34.5) +'%'}">
               <div v-for="(item,index) in pageData.list" :key='index' v-if='index!=0' class="list5-right-content  item" :class="{'fixed-height6':pageData.imgHeightAuto=='F'}" :style="{'background': item.picAddr?'transparent':'#f9f9f9', 'marginRight': imgSpace, 'marginTop': (index>1 && index<limit)?imgSpace: '0px'}">
                  <div class="right-img-box" :class="{'right-main-box':pageData.hideText&&pageData.hideText=='T'}">
                    <img class="cover-img" @click='gotoTarget(item)' :src="item.picAddr +'?imageMogr2/thumbnail/640x/strip/quality/100'" alt="">
                  </div>            
                  <template v-if="pageData.hideText&&pageData.hideText=='F'">
                    <div class="item-txt">
                      {{item.text}}
                    </div>
                  </template>
                </div>
            </div>
        </div>
        <!-- 一左三右 -->
        <!-- <div class="free-left-box clearfix" :style="{'background-color': pageData.bgTransparent &&  pageData.bgTransparent == 'T'?'':'#ffffff'}" v-if="pageData.type=='freeLayout5'">
            <div class="free-left fl" :class="{freeHieght:pageData.type=='freeLayout5'}">
                <img @click='gotoTarget(pageData.list[0])' :src="pageData.list[0].picAddr" alt="">
            </div>
            <div class="free-right fr" :class="{freeHieght:pageData.type=='freeLayout5'}">
                <img @click='gotoTarget(pageData.list[1])' class="free-lay" :src="pageData.list[1].picAddr" alt="">
                <img @click='gotoTarget(pageData.list[2])' class="free-lay" :src="pageData.list[2].picAddr" alt="">
                <img @click='gotoTarget(pageData.list[3])' class="free-lay" :src="pageData.list[3].picAddr" alt="">
            </div>
        </div> -->

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
  computed: {
    imgSpace(){
      if(this.pageData.height||this.pageData.height==0){
        return (this.pageData.height/37.5).toFixed(5) +'rem'
      }else{
        return  0
      }
    },
    limit() {
      return this.pageData.type == "freeLayout5" ? 4 : 3;
    }
  },
  data() {
    return {};
  },
  methods: {
    gourl(linkUrl, id) {
      if(linkUrl){
            this.goNavurl(linkUrl, id);
        }
    }
  }
};
</script>

<style lang="scss">
.freeLayout {
  width: 100%;
  .free-box {
    width: 100%;
    height: auto;
    // background-color: #fff;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    .free-item {
      box-sizing: border-box;
      flex-direction: column;
      width: 49%;
      padding: 5px 0;
      .item-img{
        height: 173px;
        display: block;
        &.h-a{
          height: auto;
        }
      }
      .item-txt{
        height: 25px;
        line-height: 25px;
        font-size: 11px;
        color: #999;
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .free3 {
      width: 33%;
      .item-img{
        height: 114px;
      }
    }
    & img {
      width: 100%;
      height: 100%;
    }
    .free-top {
      width: 100%;
      padding: 0 3px;
      margin-bottom: 5px;
      .item-txt{
        text-align: center;
        font-size: 11px;
        color: #999;
        line-height: 25px;
        height: 25px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      & img {
        width: 100%;
        height: 173px;
        display: block;
        &.h-a{
          height: auto;
        }
      }
    }
    .free-bottom {
      width: 100%;
      height: auto;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      .bottom-item{
        box-sizing: border-box;
        width: 48.5%;
        display: inline-block;
        .item-txt{
          text-align: center;
          font-size: 11px;
          color: #999;
          line-height: 25px;
          height: 25px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        img{
           width: 100%;
           height: 125px;
           display: block;
           &.h-a{
             height: auto;
           }
        }
      }
    }
  }
  .list5 {
    // background: #fff;
    // padding: 8px 4px;
    // padding: 8px 4px 20px 4px;
    line-height:1;
    .item {
      background: #f9f9f9;
      font-size: 11px;
      color: #999;
      text-align: center;
      .cover-img {
        height: 100%;
        width: 100%;
        line-height:normal;
      }
    }
    .list5-left {
      width: 234px;
      .item {
        font-size: 13px;
        // height: 274px;
      }
      .fixed-height6{
        // height: 274px;
        height: 299px;
        .left-img-box{
          height: 274px;
        }
        .item-txt{
            text-align: center;
            font-size: 11px;
            color: #999;
            line-height: 25px;
            height: 25px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        .left-main-box{
          height: 299px;
        }
      }
      .item-img {
        width: 158.5px;
        height: 84px;
        margin-top: 80px;
      }
    }
    .list5-right {
      width: 121px;
      .item-img {
        width: 71px;
        height: 38.5px;
        margin-top: 16px;
      }
      .item {
        // height: 88.5px;
        // margin-bottom: 4px;
      }
      .fixed-height6{
        // height: 88.5px;
        height: 96px;
        .right-img-box{
          height: 71px
        }
        .item-txt{
            text-align: center;
            font-size: 11px;
            color: #999;
            line-height: 25px;
            height: 25px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        .right-main-box{
          height: 96px;
        }
      }
    }
  }
  .list6 {
    .list5-left {
      // width: 234px;
      .item {
        // font-size: 13px;
        // height: 234px;
      }
      .fixed-height6{
        // height: 234px;
        height: 259px;
        .left-img-box{
          height: 234px;
        }
        .item-txt{
            text-align: center;
            font-size: 11px;
            color: #999;
            line-height: 25px;
            height: 25px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        .left-main-box{
          height: 259px;
        }
      }
      .item-img {
        width: 158.5px;
        height: 84px;
        margin-top: 80px;
      }
    }
    .list5-right {
      width: 121px;
      .item-img {
        width: 71px;
        height: 38.5px;
        margin-top: 16px;
      }
      .item {
        // height: 115px;
        // margin-bottom: 4px;
      }
      .fixed-height6{
        // height: 115px;
        height: 125px;
        .right-img-box{
          height: 100px;
        }
        .item-txt{
            text-align: center;
            font-size: 11px;
            color: #999;
            line-height: 25px;
            height: 25px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        .right-main-box{
          height: 125px;
        }
      }
    }
  }
  .list1 {
    // background: #fff;
    padding: 6px 2px;
    .list1-item {
      .list1-item-content {
        background: #f9f9f9;
        text-align: center;
        // height: 173.5px;
        font-size: 13px;
        // margin: 4px 2px;
        color: #999;
        
        .small-size {
          font-size: 11px;
        }
        .list1-item-img {
          margin-top: 44px;
          width: 106px;
          height: 56.5px;
          margin-right: 13px;
        }
        .list3-item-img {
          margin-top: 28px;
          height: 38.5px;
          width: 71px;
        }
        .list4-item-img {
          margin-top: 28px;
          height: 43px;
          width: 80px;
        }
        .list1-cover-img {
          width: 100%;
          height: 100%;
        }
      }
      .list3-item-content {
        // height: 113.5px;
      }
      .fixed-height3{
        height: 113.5px;
        .list3-img-box{
          height: 88.5px;
        }
        .list3-main-box{
          height: 113.5px;
        }
      }
      .fixed-height4{
        height: 113.5px;
        .top-img-box{
          height: 88.5px;
        }
        .top-main-box{
          height: 113.5px;
        }
      }
    }
    .fixed-height{
      height: 173.5px;
      .list1-img-box {
        height: 148.5px;
      }
      .list1-main-box{
        height: 173.5px;
      }
    }
    .list1-item.list4-first-item {
      .list1-item-content {
        // height: 175px;
        .list4-item-img {
          width: 157.5px;
          height: 84px;
        }
      }
      .fixed-height4{
        height: 175px;
        .top-img-box{
          height: 150px;
        }
        .top-main-box{
          height: 175px;
        }
      }
    }
  }
}
</style>

