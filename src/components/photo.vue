<template>
  <div class="photo-page">
    <template v-if="isAli">
      <!-- 支付宝 -->
      <div class="ali-p" @click="up">
        <slot></slot>
      </div>
    </template>
    <div class="h5-p" v-else>
      <!-- <h2>H5拍照</h2> -->
      <input
        v-if="isOnlyCamera"
        type="file"
        accept="image/*"
        :id="id"
        :ref="id"
        style="display:none"
        @change="fileChange"
        capture="user"
        value="上传"
      >
      <input
        v-else
        type="file"
        accept="image/*"
        :id="id"
        :ref="id"
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
import { baseUrl } from "../../config/index";
import EXIF from "exif-js";
export default {
  props: {
    idStr: {
      //用于保证input中id的唯一性，防止  Math.random()产生重复的值
      type: String | Number,
      default: ""
    },
    noAb: {
      //默认是否需要艾比对比
      type: Boolean,
      default: true
    },
    isOnlyCamera: {
      //默认是能拍照上传
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isWx: false,
      isAli: false,
      qulity: 1,
      imgUrl: "",
      faceUrl: "",
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
  mounted() {},
  methods: {
    abi() {
      //  base64编码
      let base64 = this.imgUrl.replace(/^(data:\s*image\/(\w+);base64,)/, "");
      if (this.noAb) {
        this.postAxios("/admin/api/aibeeFace/getQuality", {
          photo: base64
        }).then(resaibee => {
          if (resaibee.data.error_no != 0) {
            this.$vux.toast.text(resaibee.data.error_msg, "middle");
          } else {
            this.imgUpBase64(base64);
          }
        });
      } else {
        this.imgUpBase64(base64);
      }
    },
    imgUpBase64(base64) {
      axios({
        method: "POST",
        url: "/admin/api/ui/uplodeBase64",
        data: base64,
        headers: {
          "content-type": "application/json"
        },
        baseURL: process.env.NODE_ENV == "production" ? baseUrl : ""
      }).then(res => {
        if (res.status == 200) {
          this.$vux.toast.text("上传成功!", "middle");
          this.faceUrl = res.message;
          this.$emit("returnFaceUrl", this.faceUrl);
        }
      });
    },
    rotateImg(img, direction, canvas) {
      //最小与最大旋转方向，图片旋转4次后回到原方向
      const min_step = 0;
      const max_step = 3;
      if (img == null) return;
      //img的高度和宽度不能在img元素隐藏后获取，否则会出错
      let height = img.height;
      let width = img.width;
      let step = 2;
      if (step == null) {
        step = min_step;
      }
      if (direction == "right") {
        step++;
        //旋转到原位置，即超过最大值
        step > max_step && (step = min_step);
      } else {
        step--;
        step < min_step && (step = max_step);
      }
      //旋转角度以弧度值为参数
      let degree = (step * 90 * Math.PI) / 180;
      console.log(step);
      switch (step) {
        case 0:
          canvas.width = width;
          canvas.height = height;
          this.ctx.drawImage(img, 0, 0);
          break;
        case 1:
          canvas.width = height / 4;
          canvas.height = width / 4;
          this.ctx.rotate(degree);
          this.ctx.drawImage(img, 0, -height / 4, width / 4, height / 4);
          break;
        case 2:
          canvas.width = width;
          canvas.height = height;
          this.ctx.rotate(degree);
          this.ctx.drawImage(img, -width, -height);
          break;
        case 3:
          canvas.width = height / 4;
          canvas.height = width / 4;
          this.ctx.rotate(degree);
          this.ctx.drawImage(img, -width / 4, 0, width / 4, height / 4);
          break;
      }
    },
    getUrlBase64(url) {
      let _this = this;
      var canvas = document.createElement("canvas"); //创建canvas DOM元素
      this.ctx = canvas.getContext("2d");
      var img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = function() {
        let u = navigator.userAgent;
        // console.log(u);
        if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
          //ios系统
          // alert("ios" + _this.Orientation)
          // _this.Orientation = 3
          if (_this.Orientation && _this.Orientation != 1) {
            console.log("IOS,需要旋转");
            switch (_this.Orientation) {
              case 6: //需要顺时针（向左）90度旋转
                _this.rotateImg(this, "left", canvas);
                break;
              case 8: //需要逆时针（向右）90度旋转
                _this.rotateImg(this, "right", canvas);
                break;
              case 3: //需要180度旋转
                canvas.width = img.width / 4;
                canvas.height = img.height / 4;
                _this.ctx.rotate((180 * Math.PI) / 180);
                _this.ctx.drawImage(
                  img,
                  -img.width / 4,
                  -img.height / 4,
                  img.width / 4,
                  img.height / 4
                );
                break;
            }
          } else {
            //不需要旋转
            // alert("是ios但是不需要旋转")
            let h = img.height;
            let w = img.width;
            canvas.height = h / 4; //指定画板的高度,自定义
            canvas.width = w / 4; //指定画板的宽度，自定义
            _this.ctx.drawImage(img, 0, 0, w / 4, h / 4); //参数可自定义
          }
        } else {
          if (_this.Orientation && _this.Orientation != 1) {
            console.log("bushiios,需要旋转");
            switch (_this.Orientation) {
              case 6: //需要顺时针（向左）90度旋转
                _this.rotateImg(this, "left", canvas);
                break;
              case 8: //需要逆时针（向右）90度旋转
                _this.rotateImg(this, "right", canvas);
                break;
              case 3: //需要180度旋转
                canvas.width = img.width / 4;
                canvas.height = img.height / 4;
                _this.ctx.rotate((180 * Math.PI) / 180);
                _this.ctx.drawImage(
                  img,
                  -img.width / 4,
                  -img.height / 4,
                  img.width / 4,
                  img.height / 4
                );
                break;
            }
          } else {
            console.log("不是ios系统");
            let h = img.height;
            let w = img.width;
            canvas.height = h / 4; //指定画板的高度,自定义
            canvas.width = w / 4; //指定画板的宽度，自定义
            _this.ctx.drawImage(img, 0, 0, w / 4, h / 4); //参数可自定义
          }
        }
        let qulity = parseFloat(_this.qulity);
        _this.imgUrl = canvas.toDataURL("image/jpeg", qulity);
        //清空input的值，防止不能反复提交
        if (!_this.isAli) {
          //不是支付宝H5
          _this.$refs[_this.id].value = "";
        }

        _this.abi();
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

      if (imgfile.size > 200 * 1024) {
        //图片大于200kb
        console.log("大于200KB");
        this.qulity = ((200 * 1024) / imgfile.size).toFixed(5);
      } else {
        console.log("小于等于200KB");
        this.qulity = 1;
      }
      //获取照片方向角属性，用户旋转控制
      let _this = this;
      EXIF.getData(imgfile, function() {
        EXIF.getAllTags(this);
        _this.Orientation = EXIF.getTag(this, "Orientation");
        let imgUrl = _this.getObjectURL(imgfile);
        _this.getUrlBase64(imgUrl);
      });
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
      let option = this.isOnlyCamera
        ? {
            count: 1,
            sourceType: ["camera"],
            publicDomain: false,
            useFrontCamera: true,
            allowEdit: true
          }
        : {
            count: 1,
            sourceType: ["camera", "album"],
            publicDomain: false,
            allowEdit: true
          };
      ap.chooseImage(option, function(res) {
        _this.getUrlBase64(res.apFilePaths[0]);
      });
    },

    wxUp() {
      //   alert(wx);
      console.log(wx);
      // alert(1);
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          // alert(JSON.stringify(res));
        }
      });
    }
  }
};
</script>
<style lang='scss'>
.photo-page {
  .up-img {
    width: 0.773333rem;
    height: 0.68rem;
  }
  .show-img {
    width: 0.746667rem;
    height: 0.746667rem;
  }
  .text {
    color: rgba(65, 56, 56, 0.5);
    margin-left: 0.266667rem;
    font-size: 0.32rem;
  }
  .ali-p {
    display: flex;
    align-items: center;
  }
  .h5-p {
    display: flex;
    .change-label {
      display: flex;
      align-items: center;
      width: 100%;
    }
  }
}
</style>


