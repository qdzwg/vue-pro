<template>
  <div
    class="item"
    @click.stop="goDetail"
    :class="{'side-item':type=='sideslip','sigle-item':type=='singleRow','biserial-item':type=='biserial'}"
  >
    <div class="img-bar">
      <img class="p-img" :src="showImg" alt />
      <tag-list :arr="arr"></tag-list>
    </div>
    <div class="item-info">
      <div class="title">{{pageData.name}}</div>
      <div class="user">
        <template v-if="data.showText=='name'">
          <img class="head-img" v-if="pageData.headImg" :src="pageData.headImg" alt />
        </template>
        <img class="head-img" v-else :src="timeUrl" alt />
        <span
          class="name"
        >{{data.showText=='name'?pageData.nickName:formatterTime(pageData.createTime)}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import tagList from "./tagList";
import Emitter from "../../../../mixins/emitter";
import { parse } from "path";
let num = 0;
export default {
  mixins: [Emitter],
  components: {
    tagList
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    cureenIndex: {
      type: String | Number,
      default: 0
    },
    menuType: {
      type: String,
      default: ""
    },
    list: {
      type: Array,
      default: () => []
    },
    category: {
      type: String
    },
    tagArr: {
      type: Array,
      default: []
    },
    imgSrc: {
      type: String,
      default: ""
    },
    itemData: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: "sideslip"
    }
  },
  methods: {
    formatterTime(time) {
      if (time) {
        let date = new Date(time);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        month = month < 10 ? "0" + month : month;
        day = day < 10 ? "0" + day : day;
        return year + "年" + month + "月" + day + "日";
      } else {
        return "";
      }
    },
    goDetail() {
      num++;
      if (this.category == "strategy") {
        //非分组
        this.$router.push(
          "/detail/strategy?id=" +
            this.pageData.merchantStrategyId +
            "&source=strategy"
        );
      } else {
        //分组
        // 添加clickNum防止相同id的攻略无法触发路由改变
        if (this.$route.path == "/detail/strategy") {
          //如果是详情页面
          this.dispatch("stargegy-detail", "on-strategy-detail-id-change", {
            id: this.pageData.merchantStrategyId,
            detailIndex: this.cureenIndex
          });
        } else {
          window.localStorage.setItem(
            "xj_czc_strategy_detail_data_20191017",
            JSON.stringify({
              // detailIndex: this.cureenIndex,
              list: this.list,
              menuType: this.menuType,
              listType: this.type
            })
          );
          this.$router.push(
            "/detail/strategy?id=" +
              this.pageData.merchantStrategyId +
              "&detailIndex=" +
              this.cureenIndex +
              "&source=strategyGroup&clickNum=" +
              num
          );
        }
      }
    }
  },
  computed: {
    showTime() {
      let time = "";
      if (this.pageData.createTime) {
        let date = new Date(this.pageData.createTime);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        month = month < 10 ? "0" + month : month;
        day = day < 10 ? "0" + day : day;
        time = year + "年" + month + "月" + day + "日";
      }
      return time;
    },
    showImg() {
      return this.imgUrl
        ? this.imgUrl
        : this.pageData.picAddr
        ? this.pageData.picAddr
        : "";
    }
  },
  watch: {
    tagArr(val) {
      this.arr = val;
    },
    imgSrc(val) {
      this.imgUrl = val;
    },
    itemData(val) {
      this.pageData = val;
    }
  },
  data() {
    return {
      timeUrl: require("@/assets/images/time.png"),
      arr: this.tagArr,
      imgUrl: this.imgSrc,
      pageData: this.itemData
    };
  }
};
</script>
<style lang="scss" scoped>
.item {
  .item-info{
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  .img-bar {
    .tag {
      color: #fff;
      font-size: 10px;
    }
  }
  .title {
    font-size: 14px;
    color: #333;
    font-weight: bold;
  }
  .user {
    font-size: 10px;
    color: #999;
    height: 20px;
    line-height: 20px;
  }
}
.strategy-page {
  .biserial-item {
    &:nth-child(2n) {
      margin-left: 10px;
    }
  }
}
.biserial-item {
  width: calc(50% - 5px);
  float: left;
  margin-bottom: 10px;
  &.h-m {
    margin-bottom: 0;
  }
  .img-bar {
    height: 100px;
    .p-img {
      border-bottom-left-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
    }
  }
  .item-info {
    height: 85px;
    background: #fff;
    padding-top: 10px;
    .user {
      padding-left: 10px;
    }
    .title {
      margin-bottom: 10px;
      padding: 0 10px;
      word-break: break-all;
      height: 35px;
      line-height: 18px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
}
.side-item {
  width: 130px;
  float: left;
  .img-bar {
    height: 80px;
    .t-l {
      left: -16px;
      top: 2px;
    }
    .tag {
      height: 20px;
      line-height: 20px;
      width: 56px;
    }
  }
  .item-info {
    .title {
      margin-top: 10px;
    }
  }
}
.sigle-item {
  float: none;
  margin-bottom: 10px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  .img-bar {
    height: 140px;
    .p-img {
      border-bottom-right-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
    }
  }
  .item-info {
    height: 65px;
    background: #fff;
    padding-top: 10px;
    .title {
      margin-bottom: 8px;
      padding: 0 10px;
      box-sizing: border-box;
      display: -webkit-box;
      /* autoprefixer: off */
      -webkit-box-orient: vertical;
      /* autoprefixer: on */
      -webkit-line-clamp: 1;
      overflow: hidden;
    }
    .user {
      padding: 0 5px;
      box-sizing: border-box;
      .name {
        // width: calc(100% - 22px);
        flex: 1;
        display: -webkit-box;
        /* autoprefixer: off */
        -webkit-box-orient: vertical;
        /* autoprefixer: on */
        -webkit-line-clamp: 1;
        overflow: hidden;
      }
    }
  }
}
</style>
