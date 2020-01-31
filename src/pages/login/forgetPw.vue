<template>
  <div class="register-page">
    <div class="input-box">
      <input class="tel" v-model="loginName" placeholder="请输入手机号码" type="number">
      <p class="error-text" v-if="loginNameShow">请输入正确格式电话号码</p>
    </div>
    <div class="tel-code input-box">
      <input v-model="checkCode" placeholder="请输入验证码" class="code" type="text">
      <button @click="getCode" class="get-code" type="button">获取验证码</button>
    </div>
    <div @click="submit" class="register-btn">提交</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      checkCode: "",
      loginName: "",
      loginNameShow: false
    };
  },
  watch: {
    loginName() {
      if (this.loginName) {
        this.loginNameShow = !/^1[3|4|5|7|8][0-9]{9}$/.test(this.loginName);
      } else {
        this.loginNameShow = false;
      }
    }
  },
  methods: {
    submit() {
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
      this.getAxios("/leaguer/api/userLeaguer/checkPhoneCode", {
        loginName: this.loginName,
        checkCode: this.checkCode
      }).then(res => {
        if (res.status == 200) {
          this.$vux.toast.text("验证成功!", "middle");
          setTimeout(() => {
            this.$router.push("/reset/password?id=" + res.data.id);
          }, 1000);
        }
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
        sendType: "pwd"
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



