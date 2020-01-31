<template>
  <div class="search-warpper">
    <div class="search">
      <input v-model="keyword" class="search-input" placeholder="请输入您要搜索的产品" type="text">
      <button @click="search" @keyup.enter="search" class="search-btn">
        <i class="xx-icon icon-ico-search search-icon"></i>
      </button>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      keyword:''
    }
  },
  methods:{
    search(){
      let baseUrl = process.env.NODE_ENV === 'production'?'https://wap.lotsmall.cn/':'http://testwap.lotsmall.cn/';
      window.location.href = baseUrl + 'csearch?modelName=' + this.keyword + '&m_id=' + localStorage.getItem('xjsc_vue_2018_12_19_mid')
    }
  }
}
</script>

<style lang="scss" scoped>
.search-warpper {
  .search {
    display: flex;
    justify-content: space-between;
    width: 90%;
    margin: 0 auto;
    .search-input {
      padding: 0 10px;
      flex: 1;
      border: 1px solid #dddddd;
      border-right: none;
      outline: none;
      color: #999;
       font-size: 14px;
    }
    .search-input::-webkit-input-placeholder {
      color: #999;
      font-size: 13px;
    }
    .search-input:-moz-placeholder {
      color: #999;
       font-size: 13px;
    }
    .search-input:-ms-input-placeholder {
      color: #999;
       font-size: 13px;
    }
    .search-btn {
      padding: 0 7px;
      border: none;
      height: 28px;
      line-height: 28px;
      background: #3f98f6;
      .search-icon {
        color: #fff;
        font-size: 18px;
      }
    }
  }
}
</style>


