<template>
  <div class="login-page">
    <img class="top-img"
         src="https://statics.lotsmall.cn/image/20190115/20190115163559xvw1e5.jpg"
         alt>
    <div class="login-warper">
      <div class="login-content">
        <div class="l-w-div">
          <input class="login-i"
                 v-model="tel"
                 type="text"
                 placeholder="请输入您的手机号码">
        </div>
        <div class="l-w-div">
          <input class="login-i"
                 v-model="password"
                 type="password"
                 placeholder="请输入密码">
        </div>
      </div>

      <div class="login-btn">
        <button @click="login">登录</button>
      </div>
      <div class="reg-pw">
        <div @click="go('/register')"
             class="reg-pw-d">
          <i class="xx-icon icon-iconfont-zhanghu"></i>
          注册账号
        </div>
        <div @click="go('/forgetPw')"
             class="reg-pw-d">
          <i class="xx-icon icon-iconfont-suo"></i>
          忘记密码
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import vueCookie from "vue-cookie"
export default {
  data () {
    return {
      tel: "",
      password: ""
    };
  },
  methods: {
    login () {
      // console.log(this.tel, this.password);
      this.getAxios("leaguer/api/userLeaguer/leaguerLogin", {
        loginName: this.tel,
        loginPass: this.password
      }).then(res => {
        //将最新的token存在vux中
        localStorage.setItem(
          "xjsc_login_access_token_2019_3_7",
          res.data.token
        );
        localStorage.setItem("xjsc_login_userId_2019_3_8", res.data.leaguerId);
        this.$router.back();
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.login-page {
  .top-img {
    width: 100%;
    height: 205px;
  }
  .login-warper {
    padding: 12px;
    .reg-pw {
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      .reg-pw-d {
        display: flex;
        align-items: center;
        i {
          font-size: 18px;
          color: #413838;
          margin-right: 5px;
        }
      }
    }
    .login-btn {
      padding: 18px;
      button {
        outline: none;
        border: none;
        background: #ff9900;
        width: 100%;
        text-align: center;
        color: #ffffff;
        font-size: 18px;
        height: 50px;
        line-height: 50px;
        border-radius: 6px;
      }
    }
    .login-content {
      background: #fff;
      .l-w-div {
        padding: 12px 18px;
        border-bottom: 1px solid #eee;
        &:last-child {
          border-bottom: none;
        }
        .login-i {
          width: 170px;
          height: 34px;
          font-size: 14px;
          line-height: 34px;
          padding-left: 12px;
          border: none;
          outline: none;
        }
        .login-i::-webkit-input-placeholder {
          color: #999;
          font-size: 13px;
        }
        .login-i:-moz-placeholder {
          color: #999;
          font-size: 13px;
        }
        .login-i:-ms-input-placeholder {
          color: #999;
          font-size: 13px;
        }
      }
    }
  }
}
</style>


