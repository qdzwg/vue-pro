<template>
  <div class="notice-content">
    <div class="notice-content-box" v-html="notice"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      notice: ""
    };
  },
  created() {
    // console.log("zzz")
    document.title = "预定须知";
    this.getAxios(this.api.route.detail.main, {
      wayType: this.wayType,
      merchantRouteInfoId: this.$route.query.merchantRouteInfoId
    }).then(res => {
      this.notice = res.data.orderNotice ? res.data.orderNotice : "";
    });
  }
};
</script>
<style lang="scss">
.notice-content {
  // padding: 15px;
  // position: fixed;
  // height: 100%;
  // background: #fff;
  // width: 100%;
  // img{
  //   width: 100%;
  // }
  // .notice-content-box {
  //   padding: 15px;
  //   margin-bottom: 500px;
  //   img {
  //     width: 100% !important;
  //   }
  // }
}
</style>


