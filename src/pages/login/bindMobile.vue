<template>
  <div class="bind-mobile">
    <p class="notice">请选绑定手机号码</p>
    <div class="i-p-w tell-w">
      <input v-model.trim="tel" placeholder="请先绑定手机号码" class="i-p i-p-tell" type="number" />
    </div>
    <div class="p-w">
      <div class="i-p-w">
        <input v-model.trim="code" placeholder="请输入短信验证码" class="i-p check-no" type="number" />
      </div>
      <span class="get-code" :class="{'time-show':timeShow}" @click="getCode">
        <template v-if="timeShow">{{time}}S</template>
        <template v-else>获取验证码</template>
      </span>
    </div>
    <button class="bind-btn" @click="bind">立即绑定</button>
  </div>
</template>
<script>
import { setTimeout } from "timers";
export default {
  destroyed() {
    clearInterval(this.setIntervalTime);
    this.timeShow = false;
  },
  methods: {
    //手机号验证
    checkMobile(val) {
      return /1[3-9][0-9]{9}$/.test(val);
    },
    timeOut() {
      // 时间倒计时
      this.timeShow = true;
      this.setIntervalTime = setInterval(() => {
        this.time--;
        if (this.time == 0) {
          clearInterval(this.setIntervalTime);
          this.time = 60;
          this.timeShow = false;
        }
      }, 1000);
    },
    getCode() {
      if (!this.timeShow) {
        if (this.tel) {
          if (this.checkMobile(this.tel)) {
            this.postAxios("/leaguer/api/userLeaguer/sendCheckCode", {
              mobile: this.tel,
              sendType: "bindingTel"
            }).then(res => {
              this.$vux.toast.text("发送成功！", "middle");
              this.timeOut();
            });
          } else {
            this.$vux.toast.text("手机号码格式错误", "middle");
          }
        } else {
          this.$vux.toast.text("请输入手机号码", "middle");
        }
      }
    },
    bind() {
      this.postAxios("/leaguer/api/userLeaguer/bindingMobile", {
        mobile: this.tel,
        checkCode: this.code
      }).then(res => {
        if (this.$route.query.rediurl) {
          window.location.href = decodeURIComponent(this.$route.query.rediurl);
        } else {
          this.$router.back();
        }
      });
    }
  },
  data() {
    return {
      timeShow: false,
      time: 60,
      tel: "",
      code: ""
    };
  },
  created() {
    document.title = "绑定手机号码";
  }
};
</script>
<style lang="scss" scoped>
.bind-mobile {
  background: #fff;
  padding: 0 12.5px;
  padding-bottom: 26px;
  .bind-btn {
    background: #3f86ff;
    width: 100%;
    text-align: center;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
    border: none;
    margin-top: 20px;
  }
  .notice {
    font-size: 12px;
    color: #333;
    font-weight: 600;
    height: 35px;
    line-height: 35px;
    padding-left: 8px;
  }
  .p-w {
    display: flex;
    justify-content: space-between;
    .i-p-w {
      flex: 1;
      margin-right: 10px;
    }
    .get-code {
      display: inline-block;
      color: #3f86ff;
      border: 1px solid #3f86ff;
      border-radius: 2px;
      height: 38px;
      line-height: 40px;
      text-align: center;
      width: 84px;
      &.time-show {
        color: #dedee2;
        font-size: 16px;
        border-color: #dedee2;
      }
    }
  }
  .i-p-w {
    border: 1px solid #dedee2;
    border-radius: 2px;
    &.tell-w {
      margin-bottom: 10px;
    }
    .i-p {
      width: calc(100% - 16px);
      font-size: 14px;
      color: #333;
      height: 38px;
      border: none;
      outline: none;
      padding: 0 8px;
    }
    .i-p::-webkit-input-placeholder {
      color: #999;
      font-size: 13px;
    }
    .i-p:-moz-placeholder {
      color: #999;
      font-size: 13px;
    }
    .i-p:-ms-input-placeholder {
      color: #999;
      font-size: 13px;
    }
  }
}
</style>