<template>
  <div>
    <div class="search-head">
      <div class="search-head-sort">
        <div class="sort-name" :class="{'active':activeType === 'sort'}" @click="sortPopupShow = true">
          {{sortItem.name}}
        </div>
      </div>
      <div class="search-head-box">
        <input v-model="searchword" style="border:none;" @focus="searchPopup" class="search-input" placeholder="搜索" type="text">
        <i @click="search" class="xx-icon icon-ico-search search-icon tickets-search-icon"></i>

      </div>
      <div class="search-head-filter" @click="filterPopupShow = true">
        <div :class="{'active':activeType === 'filter'}" class="filter-title">筛选<i class="xx-icon icon-shaixuan"></i></div> 
      </div>
    </div>
    <!-- 搜索弹框 -->
    <Popup height="100%" :popup-style="{'background':'#f7f7f7'}" v-model="searchPopupShow">
      <div class="pop-search">
        <div class="pop-search-top">
          <div class="pop-search-input" @click="inputText"  :class="{'show':showPopInput}">
              <i class="xx-icon icon-ico-search search-icon" @click.stop="search" :class="{'show':showPopInput}"></i>
              <div v-if="!showPopInput"  class="pop-search-placeholder">搜索</div>
              <input :class="{'show':showPopInput}" v-model="searchword" @keyup.enter="search" ref="myInput" :autofocus="showPopInput" type="text" placeholder="搜索"/>
              <i v-if="searchword" @click="searchword = ''" class="xx-icon icon-iconfont-pxchaxian tickets-clean-icon" ></i>
          </div>
          <div v-if="showPopInput" class="pop-seach-cancel" @click="cleanSearchPop">取消</div>
        </div>
        <!-- <div class="key-words">
          <div class="key-words-item">奥特曼为什么会拉肚子</div>
          <div class="key-words-item">奥特曼为什</div>
          <div class="key-words-item">奥特曼为拉肚子</div>
        </div> -->
      </div>  
    </Popup> 
    <!-- 排序弹框 -->
    <Popup position="top" :popup-style="{'background':'#f7f7f7'}" v-model="sortPopupShow">
      <div class="sort-list">
        <div 
          v-for="(item,index) in sortList" 
          :key="index" 
          @click.stop="selectSort(index)"
          class="sort-list-item"
          :class="{'selected':item.value === sortItem.value}">
          <div class="sort-list-item-content">{{item.name}}</div> 
          <i class="xx-icon icon-gou sort-select-icon"></i>
        </div>
      </div>
    </Popup>

    <!-- 筛选弹框  -->
    <Popup position="top" :popup-style="{'background':'#f7f7f7'}" v-model="filterPopupShow">
      <div class="filter-module">
        <div class="filter-labels">
          <div 
            v-for="(item,index) in filterLabels"
            :key="index"
            class="filter-labels-group">
            <div v-if="item.title" class="labels-group-title">{{item.title}}</div>
            <div class="labels-group-span">
              <div 
                v-for="(item,index) in item.list"
                :key="index"
                @click.stop="selectLabel(item,index)"
                class="labels-span"
                :class="{'selected': (selectLabels.indexOf(item) !== -1)}">{{item}}</div>
            </div>
          </div>
        </div>
        <div class="filter-footer">
          <div @click.stop="clearSelect" class="filter-footer-btn reset-btn">重置</div>
          <div @click.stop="confirmSelect" class="filter-footer-btn ok-btn">确定</div>
        </div>
      </div>  
    </Popup>
  </div>
  
</template>
<script>
import { Popup } from "vux";
export default {
  components:{
    Popup
  },
  props:{
    sortList:{
      type:Array,
      default:[]
    },
    filterLabels:{
      type:Array,
      default:[]
    }
  },
  data(){
    return {
      searchPopupShow:false, // 搜索弹框开关
      sortPopupShow:false, //排序弹框的开关
      filterPopupShow:false, // 筛选弹框开关
      searchword:"", // 搜索关键词
      sortItem:null, // 排序数据
      selectLabels:[],
      activeType:"",
      showPopInput:true
    }
  },
  methods:{
    search() {
      this.$emit('search',this.searchword)
      this.searchPopupShow = false;
      this.activeType = 'search'
      console.log(this.keyword)
    },
    searchPopup(){
      this.searchPopupShow = true;
      this.showPopInput = true;
    },
    inputText(){
      this.showPopInput = true;
      // this.$refs.myInput.focus();
    },
    cleanSearchPop(){
      // this.showPopInput = false;
      this.searchword = "";
      this.searchPopupShow = false;
    },
    selectSort(index){
      this.sortItem = this.sortList[index];
      this.activeType = 'sort';
      this.sortPopupShow = false;
      this.$emit('sort',this.sortItem);
    },
    selectLabel(item,index){
      let _in = this.selectLabels.findIndex((it) => {
        return it === item 
      })
      if (_in !== -1) {
        this.selectLabels.splice(_in,1)
      } else {
        this.selectLabels.push(item)
      } 
    },
    clearSelect(){
      this.selectLabels = []
    },
    confirmSelect(){
      this.$emit('filter',this.selectLabels)
      this.filterPopupShow = false
      this.activeType = 'filter';
    }
  },
  created(){
    if (this.sortList instanceof Array && this.sortList.length > 0) {
      this.sortItem = this.sortList[0];
    }
  }
}
</script>
<style lang="scss">
  .search-head {
    height: 57px;
    background: #F7F7F7;
    display: flex;
    align-items: center;
    .search-head-sort {
      width: 86px;
      display: flex;
      justify-content: center;
      .sort-name {
        font-size:13px;
        font-family:PingFang SC;
        font-weight:500;
        color:#413838;
        padding-right: 11px;
        position: relative;
        &:after {
          content: '';
          position: absolute;
          right: 0;
          bottom: 0;
          width: 0;
          height: 0;
          line-height: 0;
          border-bottom: 7px solid #777777;
          border-left: 7px solid transparent;
        };
        &.active {
          color:#0086F6;
          &:after {
            border-bottom: 7px solid #0086F6;
          }
        }
      }
    }
    .search-head-box {
      width:222px;
      height:36px;
      background:#FFFFFF;
      box-shadow:0px 3px 4px 0px rgba(0, 0, 0, 0.02);
      border-radius:2px;
      font-size:14px;
      font-family:PingFang SC;
      font-weight:500;
      color:#999999;
      line-height:22px;
      position: relative;
      display: flex;
      align-items: center;
      .search-input {
        height: 22px;
        font-size:14px;
        text-align: center;
        line-height: 22px;
        width: 100%;
        flex: 1;
        margin-left: 36px;
      }
      .search-icon {
        width: 36px;
        text-align: center;
        font-size: 18px;

        color: #CCCCCC;
        line-height: 22px;
      }
    }
    .search-head-filter {
      width: 67px;
      display: flex;
      justify-content: center;
      align-items: center;
      .filter-title {
        font-size:13px;
        font-family:PingFang SC;
        font-weight:500;
        color:#413838;
        .xx-icon {
          font-size: 13px;
        }
      }
    }
  }
  .pop-search {
    width: 100%;
    height: 100%;
    &-top {
      height: 57px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      .pop-search-input {
        width: 359px;
        height: 36px;
        position: relative;
        display: flex;
        justify-content: center;
        transition: all .5s;
        align-items: center;
        background: white;
        box-shadow:0px 3px 4px 0px rgba(0, 0, 0, 0.02);
        border-radius:2px;
        .search-icon{
          height: 100%;
          line-height: 36px;
          width: 26px;
          text-align: center;
          &.show {
            width: 36px;
          }
        }
        .pop-search-placeholder {
          font-size:14px;
          font-family:PingFang SC;
          font-weight:500;
          color: #666666;
          line-height: 36px;
        }
        input {
          display: none;
          width: 0;
          height: 100%;
          border: none;
          text-align: center;
          font-size:14px;
          font-family:PingFang SC;
          font-weight:500;
          color:#413838;
          &::-webkit-input-placeholder { /* WebKit browsers */
            color: #666666;
            font-size: 14px;
          }
          &.show {
            flex: 1;
            display: flex;
            width: auto;
            text-align: left;
          }
        }
        .tickets-clean-icon {
          display: block;
          height: 36px;
          line-height: 36px;
          width: 26px;
          position: absolute;
          top: 0;
          right: 0;
        }
        &.show {
          width: 306px;
          margin-left: 8px;
        }

      }
      .pop-seach-cancel {
        width: 62px;
        font-size:16px;
        font-family:PingFang SC;
        font-weight:500;
        color:#0086F6;
        text-align: center;
      }
    }
  }
  .key-words {
    padding-left: 15px;
    background:white;
    box-shadow:0px 3px 4px 0px rgba(0, 0, 0, 0.02);
    .key-words-item {
      width: 100%;
      font-size:14px;
      height: 53px;
      font-family:PingFang SC;
      font-weight:500;
      color:#666666;
      line-height: 53px;
      border-bottom: 1px solid #eeeee7;
    }
  }
  .sort-list {
    .sort-list-item {
      height: 53px;
      background: white;
      padding-left: 15px;
      position: relative;
      .sort-list-item-content {
        height: 100%;
        border-bottom: 1px solid #eeeeef;
        font-family:PingFang SC;
        font-weight:500;
        color:#413838;
        font-size:14px;
        line-height:53px;
      }
      .sort-select-icon {
        position: absolute;
        display: none;
        line-height: 53px;
        width: 36px;
        text-align: center;
        color: #0086F6;
        top: 0;
        right: 15px;
      }
      &:last-child {
        border: none
      }
      &.selected {
        background: #F6F6F8;
        color: #0086F6;
         .sort-select-icon {
           display: block;
         }
         .sort-list-item-content {
           color: #0086F6;
         }
      }
    }
  }
  .filter-module {
    background: white;
    .filter-labels {
      padding-left: 15px;
      .filter-labels-group {
        border-bottom: 1px solid #eeeeef;
        :last-child {
          border:none;
        }
        .labels-group-title {
          height: 54px;
          line-height: 54px;
          font-size:15px;
          font-family:PingFang SC;
          font-weight:bold;
          color:#413838;
        }
        .labels-group-span {
          display: flex;
           flex-wrap:wrap;
          .labels-span {
            width:79px;
            height:37px;
            background:#F5F5F5;
            border-radius:2px;
            font-size:12px;
            font-family:PingFang SC;
            font-weight:500;
            color:#413838;
            text-align: center;
            line-height: 37px;
            margin-right: 10px;
            margin-bottom: 15px;
            &.selected {
              background: #E0F0FE;
              color: #0086F6;
            }
          }
        }
      }
    } 
  }
  .filter-footer {
    border-top: 1px solid #eeeeef;
    height: 55px;
    display: flex;
    justify-content: center;
    align-items: center;
    .filter-footer-btn {
      width:161px;
      height:35px;
      background:white;
      border:1px solid rgba(204,204,204,1);
      border-radius:2px;
      font-size:14px;
      font-family:PingFang SC;
      font-weight:500;
      color:#413838;
      margin-right: 17px;
      text-align: center;
      line-height: 35px;
      &.ok-btn {
        background: #009DED;
        color: white;
        margin-right: 0;
      }
    }
  }
</style>