<template>
  <div class="li-a" @click="go(data.merchantStrategyId)">
    <div class="raiders-img">
      <img :src="data.picAddr+'?imageMogr2/thumbnail/640x/strip/quality/100'" alt />
      <tag-list :list="data.strategyTags"></tag-list>
    </div>
    <div class="raiders-info">
      <div class="title">{{data.name}}</div>
      <div class="publish-info">
        <div class="icon-bar">
          <img class="publish-head" :src="data.headImg?data.headImg:strategyHead" alt />
          <span class="text-info time publish-name">{{data.nickName?data.nickName:''}}</span>
        </div>
        <span class="text-info">{{data.pv?data.pv+10:10}}次浏览</span>
      </div>
    </div>
  </div>
</template>
<script>
import tagList from "./tagList";
export default {
  data() {
    return {
      strategyHead: require("../../../../assets/images/strategyHead.png")
    };
  },
  components: {
    tagList
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    timeFormatter(time) {
      let date = new Date(time);
      let sp = "/";
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      month = month < 10 ? "0" + month : month;
      day = day < 10 ? "0" + day : day;
      return year + sp + month + sp + day;
    },
    go(id) {
      this.$router.push("/detail/strategy?id=" + id + "&source=strategy");
    }
  }
};
</script>
<style lang="scss" scoped>
.li-a {
  .raiders-img {
    width: 100%;
    height: 145px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      border-radius: 4px;
    }
  }
  .raiders-info {
    height: 66.5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .publish-info {
      padding-left: 7px;
      padding-right: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .icon-bar {
        display: flex;
        align-self: center;
      }
      .publish-head {
        height: 20px;
        width: 20px;
        border-radius: 50%;
        margin-right: 7px;
      }
      .publish-name {
        width: 150px;
        max-width: 160px;
        white-space: nowrap; /*强制不换行*/
        overflow: hidden; /*超出部分隐藏*/
        text-overflow: ellipsis;
      }
      .small-img {
        height: 20px;
        width: 20px;
        border-radius: 50%;
        margin-right: 5px;
      }
      .text-info {
        font-size: 13px;
        color: #999;
      }
    }
    .title {
      font-weight: bold;
      padding-left: 6px;
      font-size: 18px;
      color: #333;
      height: 38px;
      line-height: 38px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .raiders-title {
      font-size: 15px;
      max-height: 40px;
      line-height: 20px;
      color: #413838;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    .raiders-description {
      font-size: 12px;
      max-height: 40px;
      line-height: 20px;
      margin-top: 6px;
      color: #5f5a5a;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      .img-box {
        padding: 0 !important;
      }
    }
  }
}
</style>