<template>
  <div class="strategy-page">
    <!-- 横滑 -->
    <template v-if="pageData.dataList&&pageData.dataList.length">
      <div v-if="listType=='sideslip'" class="warper">
        <div class="list-bar clearfix slip-warper" :style="{width:sideWidth}">
          <strategy-item
            v-for="(item,index) in pageData.dataList"
            :key="index"
            :data="comData"
            :cureenIndex="cureenIndex"
            :menuType="menuType"
            type="sideslip"
            :category="category"
            :itemData="item"
            :list="list"
            :tagArr="formatterTagList(item,pageData.tagArr[index])"
            :imgSrc="pageData.imgArr[index]"
          ></strategy-item>
        </div>
      </div>
      <!-- 单列 -->
      <div v-if="listType=='singleRow'" class="warper">
        <div class="list-bar clearfix single-warper">
          <strategy-item
            v-for="(item,index) in pageData.dataList"
            :key="index"
            :data="comData"
            :cureenIndex="cureenIndex"
            :menuType="menuType"
            type="singleRow"
            :itemData="item"
            :list="list"
            :category="category"
            :tagArr="formatterTagList(item,pageData.tagArr[index])"
            :imgSrc="pageData.imgArr[index]"
          ></strategy-item>
        </div>
      </div>
      <!-- 双列 -->
      <div v-if="listType=='biserial'" class="warper">
        <div class="list-bar clearfix row-warper">
          <strategy-item
            v-for="(item,index) in pageData.dataList"
            :key="index"
            :data="comData"
            :cureenIndex="cureenIndex"
            :menuType="menuType"
            :class="{'h-m':getBoolean(index)}"
            type="biserial"
            :itemData="item"
            :list="list"
            :category="category"
            :tagArr="formatterTagList(item,pageData.tagArr[index])"
            :imgSrc="pageData.imgArr[index]"
          ></strategy-item>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import strategyItem from "./module/strateguItem";
export default {
  components: {
    strategyItem
  },
  computed: {
    sideWidth() {
      let length = this.data.dataList.length;
      return length > 0 ? length * 140 + "px" : "1000px";
    }
  },
  methods: {
    formatterTagList(itemData, arr) {
      // console.log(itemData, arr);
      let tagList = [];
      if (itemData.newlabelVoList && itemData.newlabelVoList.length) {
        tagList = itemData.newlabelVoList.filter(
          item => arr.indexOf(item.labelName) > -1
        );
      }
      return tagList;
    },
    getBoolean(index) {
      let length = this.pageData.dataList.length;
      let flag = false;
      if (this.pageData.dataList.length % 2 == 0) {
        //偶数
        if (index >= this.pageData.dataList.length - 2) {
          flag = true;
        }
      } else {
        //非偶数
        if (index >= this.pageData.dataList.length - 1) {
          flag = true;
        }
      }
      return flag;
    }
  },
  props: {
    comData: {
      type: Object,
      default: () => {}
    },
    cureenIndex: {
      type: Number | String,
      default: 0
    },
    menuType: {
      type: String
    },
    list: {
      type: Array,
      default: () => []
    },
    category: {
      type: String
    },
    listType: {
      type: String
    },
    pageData: {
      type: Object,
      default: () => {}
    }
  }
};
</script>
<style lang="scss">
.strategy-page {
  padding: 0 12.5px;
  .slip-warper {
    .item {
      margin-right: 10px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .warper {
    overflow-x: hidden;
    .list-bar {
      .item {
        .item-info {
          box-sizing: border-box;
          .title {
            box-sizing: border-box;
          }
          .user {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            .head-img {
              width: 18px;
              height: 18px;
              border-radius: 50%;
              margin-right: 3px;
            }
          }
        }

        .img-bar {
          width: 100%;
          position: relative;
          overflow: hidden;
          .tag {
            display: inline-block;
            position: absolute;
            text-align: center;
            background: linear-gradient(left, #e9a059, #ff4b26);
          }
          .t-l {
            -moz-transform: rotate(-45deg);
            -ms-transform: rotate(-45deg);
            -o-transform: rotate(-45deg);
            -webkit-transform: rotate(-45deg);
            transform: rotate(-45deg);
          }
          .p-img {
            height: 100%;
            width: 100%;
            display: block;
            border-radius: 4px;
          }
        }
      }
    }
    .single-warper {
      .sigle-item {
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>