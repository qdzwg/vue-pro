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
    if (this.$route.query.productType == "repast") {
      document.title = "购买须知";
    } else {
      document.title = "预定须知";
    }
    let url;
    if (this.$route.query.productType == "ticket") {
      url = this.api.ticket.detail.main;
      this.getAxios(url, {
        merchantParkInfoId: this.$route.query.merchantParkInfoId
      }).then(res => {
        this.notice = res.data.orderNotice ? res.data.orderNotice : "";
      });
    } else if (this.$route.query.productType == "hotel") {
      url = this.api.hotel.detail.main;
      this.getAxios(url, {
        merchantHotelInfoId: this.$route.query.merchantHotelInfoId
      }).then(res => {
        this.notice = res.data.noticeid ? res.data.noticeid : "";
      });
    } else if (this.$route.query.productType == "repast") {
      url = this.api.repast.detail.main;
      this.getAxios(url, {
        id: this.$route.query.id
      }).then(res => {
        this.notice = res.data.noticeid ? res.data.noticeid : "";
      });
    }
  }
};
</script>
<style lang="scss">
.notice-content {
  padding: 15px;
  //   position: fixed;
  //   height: 100%;
  background: #fff;
  //   width: 100%;
  //   img{
  //     width: 100%;
  //   }
  .notice-content-box {
    img {
      width: 100% !important;
    }
  }
}
</style>


