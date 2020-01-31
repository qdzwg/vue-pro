<template>
    <div class="bg">
        <div class="card-name">西湖公园年卡</div>
        <div class="page-title">快捷登录</div>
        <div class="login-block">
            <div class="login-input-box">
                <div class="login-box-icon">
                    <svg viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g id="登录" transform="translate(-20.000000, -304.000000)" fill="#4FC898" fill-rule="nonzero">
                                <g id="input" transform="translate(15.000000, 280.000000)">
                                    <g id="手机icon" transform="translate(5.000000, 24.000000)">
                                        <path d="M11.6630429,9.65319284 L11.6630429,27.3468072 C11.6630429,27.3914881 11.7092387,27.4361688 11.8016298,27.4361688 L25.2907611,27.4361688 C25.3369568,27.4361688 25.429348,27.3914879 25.429348,27.3468072 L25.429348,9.65319284 C25.429348,9.60851189 25.3831523,9.56383118 25.2907611,9.56383118 L11.7554414,9.56383118 C11.7092457,9.56383118 11.6630503,9.60851213 11.6630503,9.65319284 L11.6630429,9.65319284 Z M10.0461957,9.65319284 C10.0461957,8.75957617 10.7853246,8 11.7554344,8 L25.2445656,8 C26.214673,8 27,8.75957382 27,9.65319284 L27,27.3468072 C27,28.2851048 26.2146754,29 25.2445656,29 L11.7554344,29 C10.785327,29 10,28.2404262 10,27.3468072 L10,9.65319284 L10.0461957,9.65319284 Z M18.6385749,26.7212786 C17.9456418,26.7212786 17.3912933,26.1851071 17.3912933,25.5148952 C17.3912933,24.8446833 17.9456418,24.3085119 18.6385749,24.3085119 C19.3315081,24.3085119 19.8858565,24.8446833 19.8858565,25.5148952 C19.8858565,26.1851071 19.3315081,26.7212786 18.6385749,26.7212786 Z M17.5298804,10.3680928 L19.7472694,10.3680928 C19.932052,10.3680928 20.1168351,10.5468161 20.1168351,10.7702213 C20.1168351,10.9936256 19.9320525,11.1723499 19.7472694,11.1723499 L17.5298804,11.1723499 C17.3450979,11.1723499 17.1603148,10.9936266 17.1603148,10.7702213 C17.1603148,10.5468171 17.3450974,10.3680928 17.5298804,10.3680928 Z" id="Shape"></path>
                                        <path d="M23.9048804,23.5489381 L13.1413031,23.5489381 L13.1413031,11.842543 L23.9048804,11.842543 L23.9048804,23.5489381 Z M22.9809688,12.736162 L14.0652196,12.736162 L14.0652196,22.655319 L22.9809688,22.655319 L22.9809688,12.736162 Z" id="Combined-Shape" fill-opacity="0.40087183"></path>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </svg>
                </div>
                <input type="text" v-model="mobile" class="login-input-tl" placeholder="请输入手机号码">
            </div>
            <div class="login-input-box login-input-box__code">
                <input type="text" v-model="checkCode" class="login-input-ma" placeholder="请输入验证码">
                <div class="login-input-getcheckcode" v-if="!codeSent" @click="getcode">获取验证码</div>
                <div class="login-input-getcheckcode" v-else>{{timer}} s</div>
            </div>

            <div class="login-input-submit" @click="submit">登录</div>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      timer: 60,
      codeSent: false,
      mobile: "",
      checkCode: ""
    };
  },
  created() {
    document.title = '登录'
  },
  methods: {
    timerInterval() {
      let _this = this;
      _this.timer = 60;
      _this.codeSent = true;
      _this.interval = setInterval(() => {
        _this.timer--;
        if (_this.timer < 1) {
          clearInterval(_this.interval);
          _this.codeSent = false;
        }
      }, 1000);
    },
    getcode() {
        if (this.mobile == "") {
        this.$vux.toast.text("请填写手机号", "middle");
        return false;
      }
      if (!/^1[3-9][0-9]{9}$/.test(this.mobile)) {
        this.$vux.toast.text("手机号格式不正确", "middle");
        return false;
      }
      if (this.mobile) {
        this.postAxios("/leaguer/api/userLeaguer/sendCheckCode", {
          mobile: this.mobile,
          merchantInfoId: this.$route.query.m_id,
          sendType: "bindingTel"
        }).then(res => {
          if (res.status == 200) {
            this.timerInterval();
          } else {
          }
        });
      } else {

      }
    },
    submit() {
        if (this.mobile == "") {
        this.$vux.toast.text("请填写手机号", "middle");
        return false;
      }
        if (this.checkCode == "") {
        this.$vux.toast.text("请填写验证码", "middle");
        return false;
      }
      if (this.checkCode) {
        this.postAxios("/leaguer/api/userLeaguer/bindingMobile", {
          mobile: this.mobile,
          merchantInfoId: this.$route.query.m_id,
          checkCode: this.checkCode
        }).then(res => {
          if (res.status == 200) {
              this.$router.back()
          }
        });
      }else{

      }
    }
  }
};
</script>
<style lang="scss" scoped>
  @import "../common.scss";
  @import "./index.scss";
</style>

