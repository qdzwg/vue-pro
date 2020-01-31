<template>
  <div class="evaluate-warper">
    <div>
      <div class="remark">
        <textarea class="remark-item" v-model='content' fixed='true' placeholder-class='remak-placeholder' placeholder="请写下您对我们的感受吧" />
        </div>

    <div class="start-warper">
      <span class="start-title">满意度评分</span>
      <span @click="sub(index)" v-for='(item,index) in likeList' class="xx-icon like icon-iconfont-aixin start-svg"></span>
      <span @click="add(index)" v-for='(item,index) in noLikeList' class="xx-icon nolike icon-jushoucang start-svg"></span>
    </div>
    <div class="hidde-evaluate">
         <check-icon :value.sync="isHiden"></check-icon>  <span class="title">匿名评价</span>
       
    </div>
    <div @click="submit" class="submit">发表评论</div>
  </div>
  </div>
</template>

<script>
import { CheckIcon  } from 'vux'
export default {
  components: {
    CheckIcon 
  },
  data() {
    return {
      isHiden: false,
      list: [1],
      likeList: 5,
      noLikeList: 0,
      content: "",
      realName:""
    };
  },
  created(){
       this.getAxios(this.api.member.info, {
        leaguerId: localStorage.getItem("xjsc_login_userId_2019_3_8")||this.$cookie.get("leaguerInfoId")
      }).then(res => {
        if (res.status == 200) {
          this.realName=res.data.realName
        } else {
          this.$vux.toast.show({
              type:'cancel',
              text:res.message
          })
        }
      });
  },
  methods: {
    submit() {
      // console.log(this.isHiden.length==1)
      if(this.content){
          this.postAxios(this.api.main.comment.add, {
        orderId: this.$route.query.orderId,
        goodsCode: this.$route.query.goodsCode,
        userInfoId: localStorage.getItem("xjsc_login_userId_2019_3_8")||this.$cookie.get("leaguerInfoId"),
        userName: this.realName,
        content: this.content,
        isAnonymous: this.isHiden ? "T" : "F",
        score: this.likeList,
        productType: this.$route.query.type
      }).then(res => {
           this.$vux.toast.show({
              type:'success',
              text:"评价成功！"
          })
          this.$nextTick(()=>{
              this.$router.back()
          })
      });
      }else{
           this.$vux.toast.show({
              type:'cancel',
              text:'评价内容不能为空',
              width:'200px'
          })
      }
      
    },
    sub(index) {
      this.likeList = index+1;
      this.noLikeList = 5 - this.likeList;
    },
    add(index) {
      this.likeList = this.likeList + index +1;
      this.noLikeList = 5 - this.likeList;
    }
  }
};
</script>

<style lang="scss">
.evaluate-warper {
  .submit {
    height: 49px;
    line-height: 49px;
    text-align: center;
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    background: #009ded;
    color: #fff;
    font-size: 16px;
    font-family: PingFangSC-Medium, sans-serif;
  }
  checkbox .wx-checkbox-input {
    border-radius: 50%; /* 圆角 */
    // width: 40rpx; /* 背景的宽 */
    // height: 40rpx; /* 背景的高 */
  }
  /* 选中后的 背景样式 （红色背景 无边框 可根据UI需求自己修改） */
  checkbox .wx-checkbox-input.wx-checkbox-input-checked {
    border-color: #f05b47;
    background: #f05b47;
  }
  /* 选中后的 对勾样式 （白色对勾 可根据UI需求自己修改） */
  checkbox .wx-checkbox-input.wx-checkbox-input-checked::before {
    border-radius: 50%; /* 圆角 */
    // width: 40rpx; /* 选中后对勾大小，不要超过背景的尺寸 */
    // height: 40rpx; /* 选中后对勾大小，不要超过背景的尺寸 */
    // line-height: 40rpx;
    text-align: center;
    font-size: 26rpx; /* 对勾大小 30rpx */
    color: #fff; /* 对勾颜色 白色 */
    background: transparent;
    transform: translate(-50%, -50%) scale(1);
    -webkit-transform: translate(-50%, -50%) scale(1);
  }
  .remark {
    margin: 10px 0;
    height: 162px;
    background: #ffffff;
    padding: 20px 15px;
    font-size: 14px;
    color: #5c5c5c;
    font-family: PingFangSC-Medium, sans-serif;
    .remark-item {
      width: 100%;
      height: 140px;
      border:none;
      outline: none;
    }
  }
  .remak-placeholder {
    font-size: 14px;
    color: #5c5c5c;
    font-family: PingFangSC-Medium, sans-serif;
  }
  .start-warper {
    padding-left: 15px;
    margin: 20px 0px;
    display: flex;
    align-items: center;
    background-color: #fff;
    .start-title {
      font-size: 14px;
      color: #5c5c5c;
      font-family: PingFangSC-Medium, sans-serif;
      margin-right: 7px;
      margin-bottom: 1px;
    }
    .start-svg {
      margin-right: 7px;
      font-size: 19px;
    }
    .like {
      color: #f05b47;
    }
    .nolike {
      color: #a0a0a0;
    }
  }
  .hidde-evaluate {
    padding-left: 10px;
    background-color: #fff;
    .evaluate-checkbox {
      transform: scale(0.7);
    }
    .title {
      font-size: 14px;
      color: #5c5c5c;
      font-family: PingFangSC-Medium, sans-serif;
      margin-left: 7px;
    }
  }
}
</style>
