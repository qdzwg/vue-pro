<template>
  <div class="register-page">
    <div class="input-box">
      <input class="tel" v-model="loginName" placeholder="请输入手机号码" type="number">
    </div>
    <div class="tel-code input-box">
      <input v-model="checkCode" placeholder="请输入验证码" class="code" type="text">
      <button @click="getCode" class="get-code" type="button">获取验证码</button>
    </div>
    <div class="input-box">
      <input v-model="loginPass" placeholder="请输入6-20位字母、数字或符号密码" class="password" type="password">
      <p class="error-text" v-if="loginPassShow">请输入长度在 6 到 20 之间的字符串</p>
    </div>
    <div class="input-box">
      <input v-model="sureLoginPass" placeholder="请确认密码" class="sure-password" type="password">
      <p class="error-text" v-if="show">两次密码输入不一致</p>
    </div>
    <div class="protocol">
      <div class="checkbox-box">
        <label>
          <input type="checkbox" name="mdsecheckbox" v-model="checkBoxValue">
          <div class="checkbox-moli"></div>
          <span class="text">点击注册表示同意</span>
        </label>
      </div>
      <span @click="go('/reg/deal')" class="user-protocol">《用户协议》</span>
    </div>
    <div @click="register" class="register-btn">立即注册</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      checkBoxValue: true,
      mobile: "",
      loginName: "",
      loginPass: "",
      checkCode: "",
      sureLoginPass: "",
      show: false,
      loginPassShow: false
    };
  },
  watch: {
    loginPass() {
      //   if (this.sureLoginPass != this.loginPass) {
      //     this.$vux.toast.text("两次输入密码buy", "middle");
      //   }
      if (this.loginPass) {
        //   if(/\s+/g.test(this.loginPass)){
        //       //有空格
        //   }else{

        //   }
        if (
          this.loginPass.trim().length >= 6 &&
          this.loginPass.trim().length <= 20
        ) {
          this.loginPassShow = false;
        } else {
          this.loginPassShow = true;
        }
      } else {
        this.loginPassShow = false;
      }
    },
    sureLoginPass() {
      if (this.loginPass && this.sureLoginPass) {
        this.show = this.sureLoginPass != this.loginPass;
      }
    }
  },
  methods: {
    register() {
      if (!this.loginName) {
        this.$vux.toast.text("请输入手机号码", "middle");
        return false;
      }
      if (!/^1[3|4|5|7|8][0-9]{9}$/.test(this.loginName)) {
        this.$vux.toast.text("手机号码格式错误", "middle");
        return false;
      }
      if (!this.checkCode) {
        this.$vux.toast.text("请输入验证码", "middle");
        return false;
      }
      if (!this.loginPass) {
        this.$vux.toast.text("请输入密码", "middle");
        return false;
      }
      if (
        !(
          this.loginPass.trim().length >= 6 &&
          this.loginPass.trim().length <= 20
        )
      ) {
        this.$vux.toast.text("密码格式不正确", "middle");
        return false;
      }
      //   console.log()
      if (!this.sureLoginPass) {
        this.$vux.toast.text("请输入确认密码", "middle");
        return false;
      }
      if (this.sureLoginPass != this.loginPass) {
        this.$vux.toast.text("两次密码输入不一致", "middle");
        return false;
      }
      if (!this.checkBoxValue) {
        this.$vux.toast.text("请勾选注册协议", "middle");
        return false;
      }
      this.getAxios("/leaguer/api/userLeaguer/leaguerRegister", {
        loginName: this.loginName,
        loginPass: this.loginPass,
        checkCode: this.checkCode,
        channl: "wap"
      }).then(res => {
        this.$router.back();
      });
    },
    getCode() {
      if (!this.loginName) {
        this.$vux.toast.text("请输入手机号码", "middle");
        return false;
      }
      if (!/^1[3|4|5|7|8][0-9]{9}$/.test(this.loginName)) {
        this.$vux.toast.text("手机号码格式错误", "middle");
        return false;
      }
      this.postAxios("/leaguer/api/userLeaguer/sendCheckCode", {
        mobile: this.loginName,
        sendType: "reg"
      }).then(res => {
        this.$vux.toast.text(res.message, "middle");
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.register-page {
  padding: 0 20px;
  padding-top: 15px;
  .checkbox-box {
    display: inline-block;
    // height: 20px;
    // padding: 0 5px;
    label {
      display: flex;
      align-items: center;
    }
    .text {
      font-size: 14px;
      color: #413838;
      margin-left: 5px;
    }
    input {
      display: none;
    }
    .text {
      font-size: 14px;
      color: #999;
    }
    .checkbox-moli {
      display: inline-block;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 1px solid #9a9a9a;
      background: #ffffff;
      position: relative;
    }
    div.checkbox-moli::after {
      position: absolute;
      left: 0;
      top: 0;
      content: "";
      width: 16px;
      height: 16px;
    }
    input:checked + .checkbox-moli {
      border-color: transparent;
    }
    input:checked + .checkbox-moli::after {
      background: url("../../assets/images/checkbox.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      -moz-background-size: 100% 100%;
      transform: scale(1.3);
    }
  }
  .protocol {
    margin-bottom: 20px;
    padding-top: 10px;
    display: flex;
    align-items: center;
    .user-protocol {
      font-size: 14px;
      color: #ff9900;
    }
  }
  .register-btn {
    display: block;
    height: 49px;
    line-height: 49px;
    font-size: 16px;
    color: #fff;
    background: #ff9900;
    text-align: center;
    border-radius: 4px;
  }
}
.input-box {
  background: #fff;
  border-radius: 4px;
  margin-bottom: 15px;
  position: relative;
  .error-text {
    color: red;
    font-size: 12px;
    position: absolute;
    left: 0;
    bottom: -20px;
    z-index: 999;
  }
  input {
    border-radius: 4px;
    padding: 0 10px;
    width: calc(100% - 20px);
    border: none;
    outline: none;
    height: 49px;
    line-height: 49px;
  }
}
.tel-code {
  padding: 0;
  display: flex;
  justify-content: space-between;
  height: 49px;
  background: #f4f4f4;
  input {
    width: 161px;
    background: #fff;
    padding-left: 10px;
  }
  .get-code {
    height: 49px;
    text-align: center;
    border: none;
    outline: none;
    background: #f3bc69;
    color: #fff;
    font-size: 14px;
    border-radius: 4px;
    width: 118px;
  }
}
</style>



