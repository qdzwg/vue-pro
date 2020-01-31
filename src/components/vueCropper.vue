<template>
  <div class="cropper-page">
    <div id="demo">
      <!-- 遮罩层 -->
      <div class="container" v-show="panel">
        <div class="cropper-box">
          <img id="image" :src="url" alt="Picture">
        </div>
        <div class="bottom-btn-box">
          <button type="button" class="del-btn" @click="stopCrop">取消</button>
          <button type="button" class="sure-btn" @click="crop">确定</button>
        </div>
      </div>

      <div class="cropper-warpper">
        <input
          type="file"
          id="change"
          :value="filevalue"
          class="cropper-hidden"
          accept="image"
          @change="change"
        >
        <label class="cropper-label" for="change">
          <slot></slot>
        </label>
      </div>
    </div>
  </div>
</template>
<script>
import Cropper from "cropperjs";
export default {
  props: {
    quality: Number,
    default: 1
  },
  components: {},
  data() {
    return {
      headerImage: "",
      picValue: "",
      cropper: "",
      croppable: false,
      panel: false,
      url: "",
      filevalue: ""
    };
  },
  mounted() {
    //初始化这个裁剪框
    var self = this;
    var image = document.getElementById("image");
    this.cropper = new Cropper(image, {
      aspectRatio: 1,
      viewMode: 1,
      background: false,
      zoomable: false,
      ready: function() {
        self.croppable = true;
      }
    });
  },
  methods: {
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
    change(e) {
      console.log(e);
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      // this.panel = true;
      this.picValue = files[0];
      this.url = this.getObjectURL(this.picValue);
      //每次替换图片要重新得到新的url
      if (this.cropper) {
        this.cropper.replace(this.url);
      }
      this.panel = true;
      // //对图片压缩处理
      // let img_size = this.picValue.size;
      // this.filename = this.picValue.name;
      // let render = new FileReader();
      // render.readAsDataURL(this.picValue);
      // render.onload = e => {
      //   if (img_size >= 1024 * 1024 * 0.5) {
      //     console.log("图片过大");
      //     //调用自定义方法来处理图片
      //     this.compressImage(e.target.result);
      //   } else {
      //     this.url = this.getObjectURL(this.picValue);
      //     //每次替换图片要重新得到新的url
      //     if (this.cropper) {
      //       this.cropper.replace(this.url);
      //     }
      //     this.panel = true;
      //   }
      // };

      // this.$vux.loading.show();
    },
    compressImage: function(bdata) {
      //压缩图片
      var _this = this;
      var quality = 0.3; //压缩图片的质量
      var oldimglength = bdata.length; //压缩前的大小
      var compresRadio = 0; // 压缩率

      var canvas = document.createElement("canvas"); //创建画布
      var ctx = canvas.getContext("2d");

      var img = new Image();
      img.src = bdata;
      img.onload = function() {
        var width = img.width;
        var height = img.height;
        canvas.width = 100; //这里可以自定义你的图片大小
        canvas.height = 100 * (img.height / img.width);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        var cdata = canvas.toDataURL("image/jpeg", quality); //将图片转为Base64 之后预览要用

        // _this.HeadUrl = cdata; //预览你压缩后的图片
        var newimglength = cdata.length;
        console.log(newimglength);
        console.log("img-blob:" + oldimglength); //压缩前大小
        console.log("ctx-blob:" + newimglength); //压缩后大小
        compresRadio =
          (((oldimglength - newimglength) / oldimglength) * 100).toFixed(2) +
          "%";
        console.log("压缩率:" + compresRadio);
        //base64转成file
        let arr = cdata.split(",");
        let mime = arr[0].match(/:(.*?);/)[1];
        let bstr = atob(arr[1]);
        let n = bstr.length;
        let u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        let newFile = new File([u8arr], _this.filename, { type: mime });
        //  console.log(this.picValue)
        _this.url = _this.getObjectURL(newFile);
        //每次替换图片要重新得到新的url
        if (_this.cropper) {
          _this.cropper.replace(this.url);
        }
        _this.panel = true;
      };
    },

    stopCrop() {
      this.panel = false;
    },
    crop() {
      console.log(this.quality);
      // let quality = 0.3
      this.$vux.loading.show();
      var croppedCanvas;
      var roundedCanvas;
      if (!this.croppable) {
        return;
      }
      // Crop
      croppedCanvas = this.cropper.getCroppedCanvas();
      console.log(this.cropper);
      // Round
      roundedCanvas = this.getRoundedCanvas(croppedCanvas);

      this.headerImage = roundedCanvas.toDataURL("image/jpeg", this.quality);
      this.$emit("getUrlBase64", this.headerImage);
      console.log(this.headerImage);
      this.$vux.loading.hide();
      this.panel = false;
    },
    getRoundedCanvas(sourceCanvas) {
      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");
      var width = sourceCanvas.width;
      var height = sourceCanvas.height;

      canvas.width = width;
      canvas.height = height;

      context.imageSmoothingEnabled = true;
      context.drawImage(sourceCanvas, 0, 0, width, height);
      context.globalCompositeOperation = "destination-in";
      context.beginPath();
      //圆形
      // context.arc(
      //   width / 2,
      //   height / 2,
      //   Math.min(width, height) / 2,
      //   0,
      //   2 * Math.PI,
      //   true
      // );
      //矩形
      context.rect(0, 0, width, height);
      context.fill();

      return canvas;
    }
  }
};
</script>
<style lang="scss">
.cropper-page {
  * {
    margin: 0;
    padding: 0;
  }
  .cropper-warpper{
    display: flex;
    align-items: center;
  }
  .cropper-box {
    width: 100%;
    height: 80%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  #demo #button {
    position: absolute;
    right: 10px;
    top: 10px;
    width: 80px;
    height: 40px;
    border: none;
    border-radius: 5px;
    background: white;
  }
  .bottom-btn-box {
    display: flex;
    justify-content: space-between;
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
    button {
      outline: none;
      border: none;
      padding: 5px 20px;
      border-radius: 2px;
      font-size: 16px;
      color: #fff;
      background: #f05b47;
      margin: 15px;
      &.del-btn {
        background: #aaa;
      }
    }
  }
  #demo .show {
    width: 100px;
    height: 100px;
    overflow: hidden;
    position: relative;
    border-radius: 50%;
    border: 1px solid #d5d5d5;
  }
  #demo .picture {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  #demo .container {
    z-index: 99;
    position: fixed;
    // padding-top: 60px;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 1);
  }
  #demo #image {
    max-width: 100%;
  }
  .cropper-view-box,
  .cropper-face {
    // border-radius: 50%;
  }
  /*!  
 * Cropper.js v1.0.0-rc  
 * https://github.com/fengyuanchen/cropperjs  
 *  
 * Copyright (c) 2017 Fengyuan Chen  
 * Released under the MIT license  
 *  
 * Date: 2017-03-25T12:02:21.062Z  
 */
  .cropper-container {
    font-size: 0;
    line-height: 0;
    position: relative;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    direction: ltr;
    -ms-touch-action: none;
    touch-action: none;
  }

  .cropper-container img {
    /* Avoid margin top issue (Occur only when margin-top <= -height) */
    display: block;
    min-width: 0 !important;
    max-width: none !important;
    min-height: 0 !important;
    max-height: none !important;
    width: 100%;
    height: 100%;
    image-orientation: 0deg;
  }
  .cropper-wrap-box,
  .cropper-canvas,
  .cropper-drag-box,
  .cropper-crop-box,
  .cropper-modal {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  .cropper-wrap-box {
    overflow: hidden;
  }
  .cropper-drag-box {
    opacity: 0;
    background-color: #fff;
  }
  .cropper-modal {
    opacity: 0.5;
    background-color: #000;
  }
  .cropper-view-box {
    display: block;
    overflow: hidden;
    width: 100%;
    height: 100%;
    outline: 1px solid #39f;
    outline-color: rgba(51, 153, 255, 0.75);
  }

  .cropper-dashed {
    position: absolute;
    display: block;
    opacity: 0.5;
    border: 0 dashed #eee;
  }
  .cropper-dashed.dashed-h {
    top: 33.33333%;
    left: 0;
    width: 100%;
    height: 33.33333%;
    border-top-width: 1px;
    border-bottom-width: 1px;
  }
  .cropper-dashed.dashed-v {
    top: 0;
    left: 33.33333%;
    width: 33.33333%;
    height: 100%;
    border-right-width: 1px;
    border-left-width: 1px;
  }
  .cropper-center {
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    width: 0;
    height: 0;
    opacity: 0.75;
  }
  .cropper-center:before,
  .cropper-center:after {
    position: absolute;
    display: block;
    content: " ";
    background-color: #eee;
  }
  .cropper-center:before {
    top: 0;
    left: -3px;
    width: 7px;
    height: 1px;
  }
  .cropper-center:after {
    top: -3px;
    left: 0;
    width: 1px;
    height: 7px;
  }
  .cropper-face,
  .cropper-line,
  .cropper-point {
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    opacity: 0.1;
  }
  .cropper-face {
    top: 0;
    left: 0;
    background-color: #fff;
  }
  .cropper-line {
    background-color: #39f;
  }
  .cropper-line.line-e {
    top: 0;
    right: -3px;
    width: 5px;
    cursor: e-resize;
  }
  .cropper-line.line-n {
    top: -3px;
    left: 0;
    height: 5px;
    cursor: n-resize;
  }
  .cropper-line.line-w {
    top: 0;
    left: -3px;
    width: 5px;
    cursor: w-resize;
  }
  .cropper-line.line-s {
    bottom: -3px;
    left: 0;
    height: 5px;
    cursor: s-resize;
  }
  .cropper-point {
    width: 5px;
    height: 5px;

    opacity: 0.75;
    background-color: #39f;
  }
  .cropper-point.point-e {
    top: 50%;
    right: -3px;
    margin-top: -3px;
    cursor: e-resize;
  }
  .cropper-point.point-n {
    top: -3px;
    left: 50%;
    margin-left: -3px;
    cursor: n-resize;
  }
  .cropper-point.point-w {
    top: 50%;
    left: -3px;
    margin-top: -3px;
    cursor: w-resize;
  }
  .cropper-point.point-s {
    bottom: -3px;
    left: 50%;
    margin-left: -3px;
    cursor: s-resize;
  }
  .cropper-point.point-ne {
    top: -3px;
    right: -3px;
    cursor: ne-resize;
  }
  .cropper-point.point-nw {
    top: -3px;
    left: -3px;
    cursor: nw-resize;
  }
  .cropper-point.point-sw {
    bottom: -3px;
    left: -3px;
    cursor: sw-resize;
  }
  .cropper-point.point-se {
    right: -3px;
    bottom: -3px;
    width: 20px;
    height: 20px;
    cursor: se-resize;
    opacity: 1;
  }
  @media (min-width: 768px) {
    .cropper-point.point-se {
      width: 15px;
      height: 15px;
    }
  }
  @media (min-width: 992px) {
    .cropper-point.point-se {
      width: 10px;
      height: 10px;
    }
  }
  @media (min-width: 1200px) {
    .cropper-point.point-se {
      width: 5px;
      height: 5px;
      opacity: 0.75;
    }
  }
  .cropper-point.point-se:before {
    position: absolute;
    right: -50%;
    bottom: -50%;
    display: block;
    width: 200%;
    height: 200%;
    content: " ";
    opacity: 0;
    background-color: #39f;
  }
  .cropper-invisible {
    opacity: 0;
  }
  .cropper-bg {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC");
  }
  .cropper-hide {
    position: absolute;
    display: block;
    width: 0;
    height: 0;
  }
  .cropper-hidden {
    display: none !important;
  }
  .camera{
      width:30px;
      height:26px;
      display: block;
      margin-left:30px;
      img{
          width:100%;
          height:100%;
      }
  }
  .cropper-move {
    cursor: move;
  }
  .cropper-crop {
    cursor: crosshair;
  }
  .cropper-disabled .cropper-drag-box,
  .cropper-disabled .cropper-face,
  .cropper-disabled .cropper-line,
  .cropper-disabled .cropper-point {
    cursor: not-allowed;
  }
}
</style>


