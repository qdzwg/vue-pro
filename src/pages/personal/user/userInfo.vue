<template>
  <div class="member-info-box">

      <div class="info-ul boxshadow">
        <div class="info-li clearfix" @click="goUrl(name,'name')">
          <span class="info-title">姓名</span>
          <input type="text" v-model="name" disabled class="info-input">
          <img src="http://statics.lotsmall.cn/wx/img/arrow-left-icon.png" class="arrow-left-icon">
        </div>
        <div class="info-li clearfix" @click="openPayModal">
          <span class="info-title">性别</span>
          <input type="text" v-model="sex" disabled class="info-input">
          <img src="http://statics.lotsmall.cn/wx/img/arrow-left-icon.png" class="arrow-left-icon">
        </div>
      </div>

      <div class="info-ul boxshadow">
        <div class="info-li clearfix" @click="goUrl(idcard,'idcard')">
          <span class="info-title">身份证</span>
          <input type="text" disabled v-model="idcard" class="info-input">
          <img src="http://statics.lotsmall.cn/wx/img/arrow-left-icon.png" class="arrow-left-icon">
        </div>
        <div class="info-li clearfix" @click="goUrl(mobile,'mobile')">
          <span class="info-title">手机号</span>
          <input type="text" v-model="mobile" disabled class="info-input">
          <img src="http://statics.lotsmall.cn/wx/img/arrow-left-icon.png" class="arrow-left-icon">
        </div>
        <div class="info-li clearfix" @click="goUrl(email,'email')">
          <span class="info-title">邮箱</span>
          <input type="text" v-model="email" disabled class="info-input">
          <img src="http://statics.lotsmall.cn/wx/img/arrow-left-icon.png" class="arrow-left-icon">
        </div>
      </div>
      <div class="info-ul boxshadow">
          <div class="info-li clearfix" @click="editPassword()">
          <span class="info-title">修改密码</span>
          <input type="text" disabled class="info-input">
          <img src="http://statics.lotsmall.cn/wx/img/arrow-left-icon.png" class="arrow-left-icon">
        </div>
      </div>
      <popup class="order-pop" v-model="payShow" height=30% position="bottom">        
          <div class="modal-content">
            <x-button class="btn-sub man" type="default" @click.native="getSave('男')">男</x-button>
            <x-button class="btn-sub woman" type="default" @click.native="getSave('女')">女</x-button>
            <x-button type="primary" class="btn-sub btn-bottom" @click.native="closePayModal">取消</x-button>
          </div>
      </popup>
    
  </div>
</template>

<script>
import { XButton,Popup  } from "vux";
export default {
  components: {
  XButton,Popup
  },
  data() {
    return {
      name: "",
      sex: "",
      mobile: "",
      idcard: "",
      email: "",
      payAnimation: null,
      payAnimationData: {},
      payShow: false
    };
  },
  created() {
      document.title="个人信息"
    this.getList();
  },
  methods: {
    //弹框
    openPayModal() {
      this.payShow = true;
     
    },
    closePayModal() {
      this.payShow = false;
    },
    getList() {
      this.getAxios(this.api.member.info, {
        leaguerId: localStorage.getItem("xjsc_login_userId_2019_3_8")
      }).then(res => {
        if (res.status == 200) {
          this.name = res.data.nickName === null ? "" : res.data.nickName;
          this.sex = res.data.sex === null ? "" : res.data.sex;
          this.mobile = res.data.mobile === null ? "" : res.data.mobile;
          this.idcard = res.data.idcard === null ? "" : res.data.idcard;
          this.email = res.data.email === null ? "" : res.data.email;
        } else {
          this.$vux.toast.show({
              type:'cancel',
              text:res.message
          })
        }
      });
    },
    getSave(text) {
      this.postAxios(this.api.member.modify, {
        id: "",
        sex: text
      }).then(res => {
        if (res.status == 200) {
          this.closePayModal();
          this.getList();
        }
      });
    },editPassword(){
        this.$router.push('/changePassword')
    },
    goUrl(val, path) { 
        this.$router.push({path:'/personal/editInfo',query:{name:path,value:val}})     
    }
  }
};
</script>

<style lang='scss'>
.member-info-box {
  width: 100%;
   .order-pop.vux-popup-dialog {
    z-index: 700 !important;
  }
  .info-ul {
    width: 100%;
    background-color: #fff;
    margin-bottom: 10px;
    .info-li {
      width: 100%;
      height: 53px;
      line-height: 53px;
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
        text-align: right;
        width: 270px;
        padding-left: 5px;
        background-color: #fff;
        border:none;
      }
      .arrow-left-icon {
        width: 5px;
        height: 10px;
        float: right;
        margin-top: 24px;
        margin: 24px 13px 0 10px;
      }
    }
  }
   .modal-content {
        .btn-sub {
          width: 100%;
        }
        .man {
          margin: 20px 0;
          color: #1aad19;
        }
        .woman {
          color: #fc4150;
        }
        .btn-bottom {
          margin-top: 20px;
        }
      }
}
</style>
