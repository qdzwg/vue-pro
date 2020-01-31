<template>
  <div class="shop_box" ref="shopBox">
    <div class="shop_container">
      <div class="shop_header">
         adasda
      </div>
      <div class="shop_header">
         adasda
      </div>
      <div class="shop_header">
         adasda
      </div>
      <div class="shop_header">
         adasda
      </div>
      <div class="shop_header">
         adasda
      </div>
      <div class="shop_header">
         adasda
      </div>
      <div class="shop_header">
         adasda
      </div>
      <div class="shop_header">
         adasda
      </div>
      <div class="shop_header">
         adasda
      </div>
      <div class="shop_header">
         adasda
      </div>


      <div class="shop_header">
         adasda
      </div>
      <div class="shop_header">
         adasda
      </div>
      <div class="shop_header">
         adasda
      </div>
      <div class="shop_header">
         adasda
      </div>
      <div class="shop_header">
         adasda
      </div>
      <div class="shop_header">
         adasda
      </div>
      <div class="shop_header">
         adasda
      </div>

    </div>
  </div>
</template>
<script>
import BScroll from "better-scroll";
export default {
  data() {
    return {};
  },
  mounted() {
      this.$nextTick(()=>{
          this.shopBoxScroll = new BScroll(this.$refs.shopBox, {
                    // better-scroll 会将点击事件去掉，要在这里开启，同时点击在PC 会被执行两次，要在这里控制
                      probeType: 3, //在滚动中触发scroll 事件
                    // click: true
                });
               //  console.log(this.shopBoxScroll)
                this.shopBoxScroll.on('scroll',(pos)=>{
                  //   console.log(pos)
                })
      })
    // let wrapper = document.querySelector(".wrapper");
    // let scroll = new BScroll(wrapper, {
    //   mouseWheel: true,
    //   scrollbar: {
    //     fade: false,
    //     interactive: true
    //   },
    //   dblclick: true,
    //   probeType: 3
    // });
    // // console.log(scroll);
    // scroll.on("scrollStart", () => {
    //   console.log("scrollStart");
    // });

    // scroll.on("scroll", pos => {
    //   console.log("pos:", pos);
    // });

    // scroll.on("scrollEnd", () => {
    //   console.log("scrollEnd");
    // });
  }
};
</script>
<style lang="scss" scoped>
.shop_box{
    height: 250px;
    overflow-y: hidden;
    .shop_container{
        .shop_header{
           padding: 10px;
        }
    }
}
</style>

