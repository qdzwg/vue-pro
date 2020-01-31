<template>
  <div class="search-box">
    <!-- <div class="search-warper" v-bind:style="{background:pageData.backgroundColor,borderColor:pageData.borderColor,height:this.filter.px2rem(pageData.height),'border-radius':this.filter.px2rem(pageData.height)}" :class="{fillet:pageData.type=='search2'}">
           <i class="xx-icon icon-ico-search icon-search" @click="goOperation" v-bind:style="{'margin-top':(pageData.height*0.35<10?pageData.height*0.35:pageData.height*0.35+2)+'rpx'}"></i>
            <input @confirm='goOperation' class="search-input" v-bind:style="{color:pageData.textColor,height:this.filter.px2rem(pageData.height),lineHeight:this.filter.px2rem(pageData.height),textAlign:pageData.position}" v-model="seachName" placeholder-class="place-holder" :placeholder="pageData.placeholder?pageData.placeholder:'请输入您要搜索的产品'" />
    </div>-->
    <div class="search-bar">
      <div
        class="search-content"
        :style="{background:pageData.backgroundColor,border:'1px solid' + pageData.borderColor,'border-radius':pageData.type=='search2'?radiusWidth:''}"
      >
        <input
          @keyup.enter="goOperation"
          :style="{background:pageData.backgroundColor,color:pageData.textColor,height:this.filter.px2rem(pageData.height),'border-radius':pageData.type=='search2'?radiusWidth:'',textAlign:pageData.position}"
          :placeholder="pageData.placeholder?pageData.placeholder:'请输入您要搜索的产品'"
          v-model="seachName"
          placeholder-class="place-holder"
          class="search-input"
          type="text"
        />
        <i @click="goOperation" class="xx-icon icon-ico-search icon-search"></i>
      </div>
    </div>

    <!-- <div v-if="pageData.hostWordList&&pageData.hostWordList.length" class="hot-bar">
      <p class="hot-txt">大家都在搜...</p>
      <div class="hot-content">
        <div
          v-for="(item,index) in pageData.hostWordList"
          @click="csearch(item.hotWord)"
          :key="index"
          class="hot-item"
        >
          <div class="txt">{{item.hotWord}}</div>
        </div>
      </div>
    </div> -->
  </div>
</template>
<script>
// import { getData } from "@/common/common";
import { linkBaseUrl } from "../../../../config/index";
export default {
  props: {
    pageData: {
      type: Object,
      default: {}
    }
  },
  computed: {
    radiusWidth() {
      return this.filter.px2rem(this.pageData.height);
    }
  },
  data() {
    return {
      seachName: ""
    };
  },
  onShow() {},
  methods: {
    csearch(word) {
      window.location.href =
        linkBaseUrl +
        "/csearch?modelName=" +
        word +
        "&m_id=" +
        this.$route.query.m_id;
    },
    goOperation() {
      window.location.href =
        linkBaseUrl +
        "/csearch?modelName=" +
        this.seachName +
        "&m_id=" +
        this.$route.query.m_id;
    }
  }
};
</script>
<style lang='scss'>
.search-box {
  .search-bar {
    width: calc(100% - 30px);
    padding: 0 15px;
  }
  .fillet {
    // border-radius: var(--radius);
  }
  .hot-bar {
    .hot-txt {
      padding: 0 15px;
      font-size: 13px;
      color: #413838;
      height: 40px;
      line-height: 40px;
    }
    .hot-content {
      display: flex;
      flex-wrap: wrap;
      // justify-content: space-between;
      padding: 0 7.5px;
      .hot-item {
        padding: 0 7.5px;
        margin-bottom: 15px;
        .txt {
          height: 31px;
          line-height: 31px;
          padding: 0 14px;
          background: #f2f2f2;
          border-radius: 2px;
          color: #5c5c5c;
          font-size: 12px;
        }
      }
    }
  }
  .search-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    .search-input {
      flex-grow: 1;
      border: none;
      padding-left: 12px;
      font-size: 14px;
    }
    .search-input::-webkit-input-placeholder {
      color: #999;
      font-size: 13px;
      text-align: center;
    }
    .search-input:-moz-placeholder {
      color: #999;
      font-size: 13px;
      text-align: center;
    }
    .search-input:-ms-input-placeholder {
      color: #999;
      font-size: 13px;
      text-align: center;
    }
    .icon-search {
      font-size: 18px;
      font-weight: 700;
      color: #999999;
      padding: 0 8px;
    }
    .place-holder {
      font-family: PingFangSC-Regular, sans-serif;
      color: red;
      font-size: 14px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
  .search-warper {
    position: relative;
    width: 345px;
    margin: 0 auto;
    border: 0.5px solid #cbcbcb;
    .place-holder {
      font-family: PingFangSC-Regular, sans-serif;
      color: #acacac;
      font-size: 14px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .search-input {
      font-family: PingFangSC-Regular, sans-serif;
      color: #999999;
      font-size: 14px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    input {
      //   height: 35px;
      //   line-height: 35px;
      padding-left: 15px;
      font-size: 14px;
      padding-right: 35px;
    }
    .icon-search {
      // width:15px;
      position: absolute;
      top: var(--top);
      right: 8px;
      font-size: 20px;
      font-weight: 700;
      color: #999999;
      //   z-index: 999;
    }
  }
}
</style>
