<template>
  <div class="rlsb-page">
    <div class="section-c-box" :class="{'g-img':faceUrl}">
      <vue-cropper @getUrlBase64="getImgUrl" :quality="0.3">
        <img
          class="cropper-img"
          :src="faceUrl?faceUrl:'http://statics.lotsmall.cn/wx/img/camera-icon.png'"
          alt
        >
      </vue-cropper>
    </div>
    <span class="camera-tips">（用于非实名票刷脸入园）</span>
  </div>
</template>
<script>
import vueCropper from "./vueCropper";
import axios from "axios";
import { baseUrl } from "../../config/index";
export default {
  components: {
    vueCropper
  },
  data() {
    return {
      faceUrl: ""
    };
  },
  methods: {
    getImgUrl(src) {
      let bUrl = src;
      //  base64编码
      let base64 = src.replace(/^(data:\s*image\/(\w+);base64,)/, "");
      // console.log(base64);
      this.postAxios("/admin/api/aibeeFace/getQuality", {
        photo: base64
      }).then(resaibee => {
        if (resaibee.data.error_no != 0) {
          this.$vux.toast.text(resaibee.data.error_msg, "middle");
        } else {
          axios({
            method: "POST",
            url: "/admin/api/ui/uplodeBase64",
            data: base64,
            headers: {
              "content-type": "application/json"
            },
            baseURL: process.env.NODE_ENV !== "production" ? baseUrl : ""
          }).then(res => {
            if (res.status == 200) {
              this.faceUrl = res.message;
              this.$emit("getImgUrl",this.faceUrl)
            }
          });
        }
      });
    }
  }
};
</script>
<style lang='scss'>
.rlsb-page {
  display: flex;
  align-items: center;
  .section-c-box {
    .cropper-label {
      width: 29px;
      height: 25.5px;
    }
    .cropper-img {
      height: 100%;
      width: 100%;
    }
    &.g-img {
      .cropper-label {
        width: 28px;
        height: 28px;
      }
    }
  }
}
</style>

