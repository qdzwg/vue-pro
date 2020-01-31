<template>
  <div>
    <div>
      <h2>防抖</h2>
      <button type="button" @click="fd">點擊</button>
    </div>
    <div>
      <h2>節流</h2>
      <button type="button" @click="jl">點擊</button>
    </div>
    <div>
      <h1>支付宝唤起前置摄像头，并拍照{{testUrl.length}}</h1>
      {{testUrl}}
      <button id="J_chooseImage" class="btn">选择图片</button>
      <img id="J_imageViewer" class="img">
    </div>

    <img v-if="show" :src="src">
    <h2>上传功能测试</h2>
    <input type="file" accept="image/*" capture="user" value="上传">
    <!-- 图片转base64并低质处理 -->
    <h2>图片转base64并低质处理</h2>
    {{src}}
    <input type="file" @change="get" value="1231321">
    <h2>asdadsadada</h2>
    <rlsb ref="rlsb" @getImgUrl="imgUrl"></rlsb>
    <div>
      <button @click="selectImg">选择图片</button>
    </div>
    <div class="demo">
      <div class="left" style="background:red;">1</div>
      <div class="right" style="background:yellow">2</div>
    </div>
    <div class="demo">
      <div style="background:red;flex-grow:1">1</div>
      <div style="background:yellow;flex-grow:2">2</div>
      <div style="background:green;flex-grow:3">3</div>
    </div>
    <div class="demo demo1">
      <div class="item" v-for="i in 11" :key="i">{{i}}</div>
    </div>
    <div class="demo demo2">
      <div class="item" v-for="i in 5" :key="i">{{i}}</div>
    </div>
    <div class="demo demo3">
      <div class="item" v-for="i in 5" :key="i">{{i}}</div>
    </div>
    <div class="demo demo4">
      <div class="item" v-for="i in 5" :key="i">{{i}}</div>
    </div>
    <div class="demo demo5">
      <div class="item" style="height:50px">123131A</div>
      <div class="item" style="height:100px">123131B</div>
      <div class="item" style="height:150px">123131C</div>
      <div class="item" style="height:200px">123131D</div>
    </div>
    <div class="demo demo6">
      <div class="item" style="height:50px">123131A</div>
      <div class="item" style="height:100px">123131B</div>
      <div class="item" style="height:150px">123131C</div>
      <div class="item" style="height:200px">123131D</div>
    </div>
    <div class="demo7">
      <div class="item1" style="font-size:12px">1231A</div>
      <div class="item1" style="font-size:16px">1131B</div>
      <div class="item1" style="font-size:22px">1231C</div>
      <div class="item1" style="font-size:36px">131D</div>
    </div>
  </div>
</template>
<script>
import rlsb from "@/components/rlsb";
import { isWxAli } from "@/common/common";
import { setTimeout, clearTimeout } from "timers";
import { throws } from "assert";
export default {
  components: {
    rlsb
  },
  data() {
    return {
      show: false,
      src: "",
      qulity: 1,
      upImgSrc: "",
      testUrl: ""
    };
  },
  mounted() {
    // async function test(flag) {
    //   if (flag) {
    //     return "ojbk";
    //   } else {
    //     throw "error";
    //   }
    // }
    // // console.log(test(true));
    // // console.log(test(false));
    // test(false).catch(err => {
    //   console.log(err);
    // });
    // console.log("111");
    let _this = this;
    function doubleAfter2seconds() {
      return _this.getAxios("/merchant/api/merchantRenovationToc/getUsePage", {
        pageType: "mianPage",
        useRange: "wap"
      });
    }
    async function testResult() {
      let first = await doubleAfter2seconds();
      console.log(first);
      console.log("zz")
    }
    testResult();
  },
  methods: {
    jl() {},
    jlTest(fn) {
      let flag = true;
      return function() {
        if (!flag) return;
        flag = false;
        setTimeout(() => {
          flag = true;
          fn.apply(this, arguments);
        }, 500);
      };
    },
    fd() {
      this.fdTest(function() {
        console.log("fschengogng");
      })();
    },
    fdTest(fn) {
      let timeOut = null;
      return function() {
        clearTimeout(timeOut);
        timeOut = setTimeout(() => {
          fn.apply(this, arguments);
        }, 500);
      };
    },
    ready(callback) {
      // 如果jsbridge已经注入则直接调用
      if (window.AlipayJSBridge) {
        callback && callback();
      } else {
        // 如果没有注入则监听注入的事件
        document.addEventListener("AlipayJSBridgeReady", callback, false);
      }
    },
    upImg() {
      let env = isWxAli();
      //阿里内置浏览器
      if (env.isAliPay) {
        let _this = this;
        ap.chooseImage(
          {
            count: 1,
            sourceType: ["camera"],
            publicDomain: false,
            useFrontCamera: true,
            allowEdit: true
          },
          function(res) {
            _this.upImgSrc = res.apFilePaths[0];
            alert(res.apFilePaths[0]);
            _this.getUrlBase64(res.apFilePaths[0]);
          }
        );
      } else {
        alert("环境错误");
      }
    },
    readBlobAsDataURL(blob) {
      var a = new FileReader();
      a.onload = function(e) {
        // callback(e.target.result);
        console.log(e);
      };
      a.readAsDataURL(blob);
    },
    getUrlBase64(url) {
      alert("1111");
      var reader = new FileReader();
      reader.onload = function(e) {
        console.log("eeee", e);
      };
      reader.readAsDataURL(url);
      let _this = this;
      var canvas = document.createElement("canvas"); //创建canvas DOM元素
      var ctx = canvas.getContext("2d");
      var img = new Image();
      image.crossOrigin = "anonymous";

      alert("2222");
      img.onload = function() {
        // console.log("img",img.height)
        console.log("img.fileSize", img.fileSize);
        alert("333");
        let h = img.height;
        let w = img.width;
        alert(w);
        canvas.height = h / 4; //指定画板的高度,自定义
        canvas.width = w / 4; //指定画板的宽度，自定义
        alert(h);
        ctx.drawImage(img, 0, 0, w / 4, h / 4); //参数可自定义
        alert("转换前");
        let dataURL = canvas.toDataURL("image/jpeg", 0.1);
        // canvas.toDataURL('image/jpeg');
        alert("转换后");
        alert("成功！");
        alert(dataURL.length);
        _this.src = dataURL;

        // let b = _this.dataURLToBlob(dataURL);
        // console.log(b)
        // console.log(dataURL);
        // console.log(dataURL.length);
        _this.show = true;
      };
      img.src = url;
    },
    dataURLToBlob(dataurl) {
      var arr = dataurl.split(",");
      var mime = arr[0].match(/:(.*?);/)[1];
      var bstr = atob(arr[1]);
      var n = bstr.length;
      var u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
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
    get(e) {
      console.log(e);
      console.log(e.target.files || e.dataTransfer.files);
      let file = e.target.files || e.dataTransfer.files;
      let imgfile = file[0];
      console.log(imgfile);
      if (imgfile.size > 200 * 1024) {
        //图片大于200kb
        console.log("大于200KB");
        this.qulity = ((200 * 1024) / imgfile.size).toFixed(5);
      } else {
        console.log("小于等于200KB");
        this.qulity = 1;
      }
      console.log(imgfile);
      let imgUrl = this.getObjectURL(imgfile);
      alert(imgUrl);
      console.log(imgUrl);
      // this.readBlobAsDataURL(imgUrl);
      this.getUrlBase64(imgUrl);
    },
    imgUrl(src) {
      console.log("sss", src);
    },
    selectImg() {
      alert(1);
      ap.chooseImage()
        .then(function(result) {
          return new Promise(function(resolve, reject) {
            yourImageDom.onload = resolve;
            yourImageDom.onerror = reject;
            yourImageDom.src = result.apFilePaths[0];
          });
        })
        .then(function() {
          return ap.alert("图片加载成功");
        })
        .catch(function() {
          ap.showToast("图片加载失败");
        });
    }
  },
  created() {
    // console.log(ap)
  }
};
</script>
<style scoped lang='scss'>
.left {
  width: 75px;
}
.right {
  flex-grow: 1;
}
.item {
  background: greenyellow;
  height: 30px;
  text-align: center;
  padding: 0 15px;
  line-height: 30px;
}
.item1 {
  background: red;
  text-align: center;
  padding: 0 15px;
}
.demo {
  display: flex;
  display: -webkit-flex;
  border: 1px solid #000;
  //   height: 150px;
}
.demo1 {
  flex-wrap: wrap;
  // flex-direction: column;
  // justify-content:
}
.demo2 {
  justify-content: flex-end;
}
.demo3 {
  justify-content: space-around;
}
.demo4 {
  justify-content: space-between;
}
.demo5 {
  height: 250px;
  align-items: center;
  justify-content: space-around;
}
.demo6 {
  height: 250px;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: flex-end;
}
.demo7 {
  display: flex;
}
</style>


