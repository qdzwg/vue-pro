
<template>
  <div class="card-box">
    <template v-if="isAli">
      <!-- 支付宝 -->
      <div class="ali-p" @click="up">
        <slot></slot>
      </div>
      <!-- 微信 -->
      <!-- <div v-if="isWx">
        <button type="button" @click="wxUp">图片上传</button>
      </div>-->
    </template>
    <div class="h5-p" v-else>
      <!-- <h2>H5拍照</h2> -->
      <!-- <input
        type="file"
        accept="image/*"
        :id="id"
        style="display:none"
        @change="fileChange"
        capture="user"
        value="上传"
      > -->
         <input
        type="file"
        accept="image/*"
        :id="id"
        :ref='id' 
        style="display:none"
        @change="fileChange"
        value="上传"
      >
      <label class="change-label" :for="id">
        <slot></slot>
      </label>
    </div>
  </div>
</template>
<script>
import { isWxAli } from "@/common/common";
// import Exif from '@/common/exif'
import axios from "axios";
// import { baseUrl } from "../../config/index";
// import EXIF from "exif-js";
export default {
  props: {
    idStr: {
      //用于保证input中id的唯一性，防止  Math.random()产生重复的值
      type: String | Number,
      default: ""
    }
  },
  data() {
    return {
      isWx: false,
      isAli: false,
      qulity: 1,
      imgUrl: "",
      cardUrl: "",
      Orientation: null,
      id:
        "change_" +
        Math.random()
          .toString(16)
          .slice(-6) +
        this.idStr
    };
  },
  mountd() {
    // console.log(Exif,this.Exif);
  },
  created() {
    let env = isWxAli();
    this.isWx = env.isWx;
    this.isAli = env.isAliPay;
  },
  mounted() {
    // console.log(EXIF);
  },
  methods: {
    idCard() {
      //  base64编码
      let base64 = this.imgUrl.replace(/^(data:\s*image\/(\w+);base64,)/, "");      
      this.postAxios("/marketing/api/marketBaiduService/idCardDentificate", {
        image: base64
      }).then(residcard => {
        if(residcard.status == 200){
          // console.log(residcard.data);
          this.cardUrl = JSON.parse(residcard.data);
          this.$emit('returnCardUrl', this.cardUrl);
        }        
      });
    },
    getUrlBase64(url) {
      let _this = this;
      var canvas = document.createElement("canvas"); //创建canvas DOM元素
      this.ctx = canvas.getContext("2d");
      var img = new Image();
      img.crossOrigin = "anonymous";
      // console.log(11)
      img.onload = function() {
          let h = img.height;
          let w = img.width;
          canvas.height = h / 2; //指定画板的高度,自定义
          canvas.width = w / 2; //指定画板的宽度，自定义
          _this.ctx.drawImage(img, 0, 0, w / 2, h / 2); //参数可自定义
        let qulity =  parseFloat(_this.qulity)
        // alert(qulity)
        _this.imgUrl = canvas.toDataURL("image/jpeg",qulity);
        //清空input的值，防止不能反复提交
         if(!_this.isAli){
           //不是支付宝H5
           _this.$refs[_this.id].value = ''
         }
        _this.idCard();
      };
      img.src = url;
    },
    fileChange(e) {
      let file = e.target.files || e.dataTransfer.files;
      // console.log(file)
      if (!file.length) {
        return;
      }
      let imgfile = file[0];

      if (imgfile.size > 1*1024* 1024) {
        //图片大于200kb
        // console.log("大于2m");
        this.qulity = ((1*1024 * 1024) / imgfile.size).toFixed(5);
      } else {
        // console.log("2m");
        this.qulity = 1;
      }
      let imgUrl = this.getObjectURL(imgfile);
      this.getUrlBase64(imgUrl);
    },
    getObjectURL(file) {
      var url = null;
      if (window.createObjectURL != undefined) {
        // basic
        url = window.createObjectURL(file);
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    },
    up() {
      let _this = this;
      ap.chooseImage(
        {
          count: 1,
          sourceType: ["camera","album"],
          // publicDomain: false,
          // useFrontCamera: true,
          // allowEdit: true
        },
        function(res) {
          _this.getUrlBase64(res.apFilePaths[0]);
        }
      );
    },

    wxUp() {
      //   alert(wx);
      // console.log(wx);
      // alert(1);
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          alert(JSON.stringify(res));
        }
      });
    }
    // base64(url) {
    //   let _this = this;
    //   let canvas = document.createElement("canvas"); //创建canvas DOM元素
    //   let ctx = canvas.getContext("2d");
    //   let img = new Image();
    //   img.crossOrigin = "anonymous";
    //   img.onload = function() {
    //     // alert("333");
    //     let h = img.height;
    //     let w = img.width;
    //     // alert("444");
    //     canvas.height = h / 4; //指定画板的高度,自定义
    //     canvas.width = w / 4; //指定画板的宽度，自定义
    //     // alert("555");
    //     ctx.drawImage(img, 0, 0, w / 4, h / 4); //参数可自定义
    //     alert("转换前");
    //     let dataURL = canvas.toDataURL("image/jpeg", 0.1);
    //     // canvas.toDataURL('image/jpeg');
    //     alert("转换后");
    //     alert("成功！");
    //     alert(dataURL.length);
    //   };
    //   img.src = url;
    // }
  }
};
</script>
<style lang="scss">
    .card-box{
        .h5-p{
           .change-label{
              //  display: flex;
              //  align-items: center;
           }
        }
    }
</style>





