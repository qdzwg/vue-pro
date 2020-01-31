<template>
  <div class="headr-logo-warpper">
    <div class="header-logo">
      <img class="header-logo-img" :src="pageData.logoUrl" alt>
      <div class="spance-line"></div>
      <div class="intro">
        <div class="intro-name">{{pageData.name}}</div>
        <div class="intro-detail">{{pageData.intro}}</div>
      </div>
      <a v-if="pageData.tel" :href="'tel:'+pageData.tel" class="serveice-tel">
        <img class="serveice-tel-img" src="../../../assets/images/kefu.png" alt>
      </a>
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
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
.headr-logo-warpper {
  background: #fff;
  .header-logo {
    display: flex;
    align-items: center;
    margin: 0 1.5%;
    padding: 5px 0;
    .header-logo-img {
      width: 69px;
      height: 45px;
    }
    .spance-line {
      width: 1px;
      background: #ddd;
      height: 30px;
      margin-left: 10px;
      margin-right: 10px;
    }
    .intro {
      flex: 1;
      margin-right: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .intro-name {
        width: 100%;
        font-size: 18px;
        color: #3f98f6;
         overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .intro-detail {
        font-size: 10px;
        color: #999;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .serveice-tel {
      margin-right: 10px;
      background: #e6e6e6;
      border-radius: 50%;
      .serveice-tel-img {
        padding: 8px;
        height: 20px;
        width: 20px;
      }
    }
  }
}
</style>


