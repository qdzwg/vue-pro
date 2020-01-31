<template>
  <div style="padding-bottom:50px;">
    <div>
      <h2>支付拍照测试</h2>
      <button type="button" @click="up">图片上传</button>
    </div>
    <h2>demo1</h2>
    <div class="demo1">
      <div class="test">
        <p>asdadaasdadsada</p>
        <p>asdadaasdadsada</p>
        <p>asdadaasdadsada</p>
        <p>asdadaasdadsada</p>
        <p>asdadaasdadsada</p>
        <p>asdadaasdadsada</p>
        <p>asdadaasdadsada</p>
        <p>tetest</p>
      </div>
    </div>
    <h2>demo2</h2>
    <ul class="demo2">
      <li>音乐</li></li>
      <li>影视</li>
      <li>旅游</li>
      <li>旅游</li>
      <li>旅游</li>
    </ul>
    <h2>demo3</h2>
    <div class="demo3">
        <div class="left">1</div>
        <div class="right">
          <div class='right-box'>
             <div>1231313</div>
            <div>132131</div>
            <button>立即参与</button>
          </div>
        </div>
    </div>
    <h2>demo4</h2>
    <div class="demo4">
      <div class="left"></div>
      <div class="center">
          <p>description</p>
          <p>description</p>
          <p>description</p>
          <p>description</p>
          <p>description</p>
          <p>description</p>
          <span>description</span>
      </div>
      <div class="btn">确认</div>
      <div class="btn">取消</div>
</div>
<h2>demo5</h2>
<div class="demo5">
  <div class="item item1">1/4</div>
  <div class="item">1/4</div>
  <div class="item">1/4</div>
  <div class="item">1/4</div>
</div>
<h2>demo6</h2>
<div class="demo6">
   <div class="header">头部</div>
   <div class="body">
      <div class="left">left</div>
      <div class="center">
        <p>adsa</p>
        <p>adsa</p>
        <p>adsa</p>
        <p>adsa</p>
        <p>adsa</p>
        <p>adsa</p>
        <p>adsa</p>
        <p>adsa</p>
      </div>
      <div class="right">right</div>
   </div>
   <div class="footer">底部</div>
</div>
<h2>demo7</h2>
<div class="demo7">
   <span class="tip">1233</span>
   <input type="text" name="" />
   <button>search</button>
</div>
<h2>demo8</h2>
<div class="demo8">
   <div class="main">这是主要内容</div>
   <div class="footer">这是底部</div>
</div>
<h2>demo9</h2>
<div class="demo9">
   <div class="item"></div>
   <div class="item"></div>
   <div class="item"></div>
   <div class="item"></div>
</div>
  </div>
</template>
<script>
export default {
  methods:{
    up(){
      let _this = this
      ap.chooseImage(2, function(res){
        _this.base64(res.apFilePaths[0])
        // if ( img instanceof HTMLImageElement ) {
        //   img.src = res.apFilePaths[0];
        // }
    });
    },
    base64(url){
      let _this = this;
      let canvas = document.createElement("canvas"); //创建canvas DOM元素
      let ctx = canvas.getContext("2d");
      let img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = function() {
        let h = img.height;
        let w = img.width;
        canvas.height = h / 4; //指定画板的高度,自定义
        canvas.width = w / 4; //指定画板的宽度，自定义
        ctx.drawImage(img, 0, 0, w / 4, h / 4); //参数可自定义
        let dataURL = canvas.toDataURL("image/jpeg", 0.1);
        // canvas.toDataURL('image/jpeg');
      };
      img.src = url;
    }
  }
};
</script>
<style scoped lang='scss'>
.demo9{
  background: blueviolet;
  display: flex;
  width: 258px;
    height: 300px;
    flex-wrap: wrap;
    align-content: flex-start;
    .item{
    flex: 0 0 33.333333%;
    height: 80px;
    box-sizing: border-box;
    background: yellowgreen;
    border: 1px solid red;
}
}
.demo8{
  height: 500px;
  border: 1px solid red;
  display: flex;
  flex-direction: column;
  .main{
    flex: 1;
  }
  .footer{
    height: 50px;
    background: red;
  }
}
.demo7{
  display: flex;
  input{
    flex: 1;
  }
  .tip{
    height: 34px;
    width: 34px;
    background: greenyellow;
  }
}
.demo {
  display: -webkit-flex;
  display: flex;
}
.demo6{
  display: flex;
  flex-direction: column;
  .header,.footer{
    height: 40px;
    line-height: 40px;
    background: red;
  }
  .body{
    // height: 150px;
    display: flex;
    div{
      flex:1;
    }
    .left{
      flex: 0 0 20%;
      background: #aaa;
    }
    .right{
      flex: 0 0 20%;
      background: #aaa;
    }
  }
}
.demo5{
  @extend .demo;
  .item{
    flex: 1;
    background: #aaa;
    padding: 7px 0;
    text-align: center;
    border-right: 1px solid #fff;
    &:last-child{
      border-right: none;
    }
    &.item1{
      flex: 0 0 150px;
    }
  }
}
.demo4{
  @extend .demo;
  justify-content: space-between;
  align-items: flex-start;
  padding: 15px;
  border: 1px solid red;
  .left{
    width: 80px;
    height: 80px;
    background: goldenrod;
  }
  .btn{
    align-self: flex-end;
    width: 60px;
    text-align: center;
    background: blueviolet;
  }
}
.demo3{
  @extend .demo;
 .left{
    width: 100px;
    height: 100px;
    background: yellowgreen;
    flex-grow: 0;
  }
  .right{
    flex-grow: 1;
    padding: 5px 15px;
    display: flex;
    align-items: center;
    .right-box{
      flex: 1;
    }
  }
}
.demo2{
  @extend .demo;
  justify-content: space-between;
  li{
    flex-grow: 1;
    text-align: center;
    background: blanchedalmond;
    height: 50px;
    line-height: 50px;
    border-right: 1px solid #ffffff;
    &:last-child{
      border-right: none;
    }
  }
}
.demo1 {
  border: 2px solid teal;
  height: 250px;
  width: 300px;
  @extend .demo;
  justify-content: center;
  align-items: center;
  .test {
    border: 4px solid forestgreen;
    padding: 5px;
  }
}
</style>


