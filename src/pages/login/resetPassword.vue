<template>
  <div class="register-page">
    <div class="input-box">
      <input v-model="loginPass" placeholder="请输入6-20位字母、数字或符号密码" class="password" type="password">
      <p class="error-text" v-if="loginPassShow">请输入长度在 6 到 20 之间的字符串</p>
    </div>
    <div class="input-box">
      <input v-model="sureLoginPass" placeholder="请确认密码" class="sure-password" type="password">
      <p class="error-text" v-if="show">两次密码输入不一致</p>
    </div>
    <div @click="reset" class="register-btn">确定修改</div>
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
      if (this.loginPass) {
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
    reset() {
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
      if (!this.sureLoginPass) {
        this.$vux.toast.text("请输入确认密码", "middle");
        return false;
      }
      if (this.sureLoginPass != this.loginPass) {
        this.$vux.toast.text("两次密码输入不一致", "middle");
        return false;
      }
      this.postAxios("/leaguer/api/userLeaguer/resetPwd", {
        leaguerId: this.$route.query.id,
        password: this.loginPass
      }).then(res => {
        this.$vux.toast.text("密码重置成功", "middle");
        setTimeout(() => {
          this.$router.push("/login");
        }, 1500);
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
</style>



