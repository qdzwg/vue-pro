<template>
  <div v-if="preData.merchantStrategyId||nextData.merchantStrategyId" class="pre-next">
    <div class="title-bar">
      <div v-show="preData.merchantStrategyId" class="bar-item fl">
        <span @click="pre(preData.merchantStrategyId)" class="last">上一篇</span>
        <span class="line"></span>
        <span class="name">{{preData.name}}</span>
      </div>
      <div v-show="nextData.merchantStrategyId" class="bar-item fr">
        <span @click="next(nextData.merchantStrategyId)" class="next">下一篇</span>
        <span class="line"></span>
        <span class="name">{{nextData.name}}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    detailId: {
      type: String | Number,
      default: -1
    },
    data: {
      type: Object,
      default: () => {}
    },
    detailIndex: {
      type: String | Number,
      default: -1
    }
  },
  computed: {
    currentIndex() {
      let index = this.data.dataList.findIndex(
        item => item.merchantStrategyId == this.merchantStrategyId
      );
      return index;
    },
    preData() {
      let obj;
      if (this.currentIndex > 0 && this.data.dataList.length >= 1) {
        obj = this.data.dataList[this.currentIndex - 1];
      } else {
        obj = {};
      }
      return obj;
    },
    nextData() {
      let obj;
      if (
        this.currentIndex < this.data.dataList.length - 1 &&
        this.data.dataList.length >= 1
      ) {
        obj = this.data.dataList[this.currentIndex + 1];
      } else {
        obj = {};
      }
      return obj;
    }
  },
  watch: {
    detailId(val) {
      this.merchantStrategyId = val;
    }
  },
  methods: {
    pre(id) {
      this.go(id);
    },
    next(id) {
      this.go(id);
    },
    go(id) {
      this.merchantStrategyId = id;
      this.$emit("detailIdchange", id);
      // this.$router.push("/detail/strategy?id=" + id + "&source=strategyGroup");
    }
  },
  data() {
    return {
      merchantStrategyId: this.detailId
    };
  },
  mounted() {
    // console.log(this.data.dataList);
  }
};
</script>
<style lang="scss" scoped>
.pre-next {
  .title-bar {
    padding: 0 15px;
    height: 45px;
    background: #f3f3f3;
    margin-top: 20px;
    .bar-item {
      font-size: 13px;
      color: #666;
      display: flex;
      height: 45px;
      line-height: 45px;
      align-items: center;
      &.fr {
        flex-direction: row-reverse;
      }
      .name {
        // display: inline-block;
        max-width: 100px;
        white-space: nowrap; /*强制不换行*/
        overflow: hidden; /*超出部分隐藏*/
        text-overflow: ellipsis;
      }
      .line {
        width: 1px;
        height: 10px;
        background: #c4c4c4;
        margin: 0 7px;
        display: inline-block;
      }
    }
  }
  .change {
    margin-top: 10px;
    display: flex;
    height: 45px;
    justify-content: center;
    align-items: center;
    background: #f3f3f3;
    .btn {
      display: inline-block;
      text-align: center;
      height: 29px;
      line-height: 29px;
      width: 69px;
      border: 1px solid #999;
      font-size: 13px;
      color: #999;
      border-radius: 2px;
      margin: 0 17.5px;
    }
  }
}
</style>