<template>
  <div class="editPassword">
      <div class="info-ul boxshadow">
        <div class="info-li clearfix" >
          <input type="password" placeholder="请输入您的原密码" maxlength="20" v-model="loginPass" class="info-input">
       </div>
        <div class="info-li clearfix" >
          <input type="password"  placeholder="请输入6-20位字母、数字或符号的新密码" maxlength="20" v-model="newPass" class="info-input">
        </div>
        <div class="info-li clearfix" >
          <input type="password"  placeholder="请重新输入新密码" maxlength="20" v-model="enterpassword" class="info-input">
        </div>
        <x-button type="primary" @click.native="submit" class="btn-sub">确定修改</x-button>
      </div> 
  </div>
</template>

<script>
import { XButton,XInput   } from "vux";
export default {
  components: {
    XButton ,XInput 
  },
  data() {
    return {
      loginPass: "",
      newPass: "",
      enterpassword: "",
    };
  },
  created(){
      document.title="修改密码"
  },
  methods: {
     
    submit() {
      let _this = this;
      let data = {};
      if (this.loginPass != "") {
        
          data.loginPass= this.loginPass
        
      } else {
        this.$vux.toast.text("请输入原密码",'middle')
         return false;
      }

      if (this.newPass != "") {
      
            data.newPass=this.newPass
         
        } else {
           this.$vux.toast.text("请输入新密码",'middle')
         return false;
        } 
      if ((this.enterpassword != ""&&this.newPass != "")&&(this.enterpassword==this.newPass)) {
         
            data.enterpassword= this.enterpassword
        
      }else{
          this.$vux.toast.text("两次密码不一致，请重新输入",'middle')
          return false;
      }
      this.getAxios("/leaguer/api/userLeaguer/manage/leaguerFixPwd", data).then(res => {
        if (res.status == 200) {
          this.$vux.toast.show({
              type:'success',
              text:"操作成功"
          })
          this.$router.back()
        }
      });
    }
  }
};
</script>

<style lang='scss'>
.editPassword {
  width: 100%;
  .info-ul {
    width: 100%;
    
    
    .info-li {
      width: 90%;
      height: 53px;
      line-height: 53px;
      margin: 10px auto;
      background-color: #fff;
      .info-title {
        font-size: 14px;
        color: #413838;
        float: left;
        // padding-left: 15px;
        width: 57px;
        margin-left: 15px;
      }
      .info-input {
        font-size: 14px;
        color: #999999;
        float: left;
        height: 53px;
        line-height: 53px;
        width: 270px;
        padding-left: 15px;
        border:none;
        background-color: #fff;
        outline: none;
      }
      .arrow-left-icon {
        width: 5px;
        height: 10px;
        float: right;
        margin-top: 24px;
        margin: 24px 13px 0 10px;
      }
    }
    .btn-sub {
      width: 90%;
      margin-top: 20px;
      background-color: #ff9900;
      button::after {
        border-radius: 0;
        border: none;
      }
    }
  }
}
</style>
