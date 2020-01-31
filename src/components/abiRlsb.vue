<template>
  <div>
    <photo @returnDataURL='getUrl'>
        <slot></slot>
    </photo>
  </div>
</template>
<script>
import photo from "./photo";
import axios from "axios";
import { baseUrl } from "../../config/index";
export default {
  components: {
    photo
  },
  data() {
    return {
        imgUrl:'',
        faceUrl:''
    };
  },
  methods: {
      getUrl(url){
        //   console.log("url",url)
          this.imgUrl = url
          this.abi()
      },
      abi() {
      //  base64编码
      let base64 = this.imgUrl.replace(/^(data:\s*image\/(\w+);base64,)/, "");
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
              this.$vux.toast.text("上传成功!", "middle");
              this.faceUrl = res.message;
              this.$emit("returnFaceUrl", this.faceUrl);
            }
          });
        }
      });
    },
  }
};
</script>

