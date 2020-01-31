<template>
  <div class="show-parkcard-qr">
    <div class="show-qr-bg">
      <div class="show-qr-box">
        <div class="show-qr-title">
          <p>{{card.productName}}</p>
        </div>
        <div class="show-qr-image">
          <qrcode v-if="value" :value="value" class="qr-image"></qrcode>
        </div>
        <div class="show-qr-refresh">
          <i class="xx-icon icon-shuaxin"></i> 二维码{{timeOut}}秒内有效 <span @click.stop="refreshQr">刷新</span> 
        </div>
      </div>
    </div>
    <div class="show-qr-notice">此电子二维码仅适用西湖风景名胜区管委会所属景点</div>
  </div>
</template>
<script>
import { Qrcode } from 'vux'

export default {
  components: {
    Qrcode
  },
  data() {
    return {
      card:{},
      timer:null,
      value:"",
      recordid:'',
      merchantInfoId:'',
      underLineCode:'',
      mobile:'',
      timeOut:120 
    };
  },
  created(){
    let _this = this
    document.title='扫码入园'
    this.recordid = this.$route.query.recordid;
    this.merchantInfoId = this.$route.query.m_id
    this.underLineCode = this.$route.query.underCode
    this.mobile = this.$route.query.mobile
    this.getUserInfo() 
    this.getAxios(this.api.yearcard.qr.beforGetQr,{
      rechargeId:this.recordid,
      merchantInfoId:this.merchantInfoId,
      underLineCode:this.underLineCode,
      mobile:this.mobile
    },null,true).then(res => {
        if (res.status === 200 && res.success) {
          this.recordid = res.data
          this.getDetail()
          this.getQr()
        } 
    }, err => {
      this.value = ''
      this.$vux.loading.hide()
      switch (err.status) {
        case 1002:
          if (typeof err.data !== 'undefined' && err.data.renewals) {
            this.$router.push({path:'/parkCard/showQr/warning',query:{code:err.status,recordid:err.data.rechargeId}})
          } else {
            this.$vux.confirm.show({
              content:err.message,
              confirmText:"我知道了",
              // 组件除show外的属性
              onCancel : () => {
              },
              onConfirm : () => {
              }
            })
          }   
          break;
        case 1003:
          if (typeof err.data !== 'undefined') {
            this.$router.push({path:'/parkCard/showQr/warning',query:{code:err.status,recordid:err.data.rechargeId}})
          } else {
            this.$router.push({path:'/parkCard/showQr/warning',query:{code:err.status}})
          }   
          break;
        case 1001:  
        case 1004:
          this.$router.push({path:'/parkCard/showQr/warning',query:{code:err.status}})
          break;
        case 400:
          this.getUserInfo();
          break;
        default:
          // this.$vux.toast.text(err.message || "展示电子二维码异常" ,"middle")
          break;
      }
    })
  },
  methods:{
    getUserInfo(){
      let _this = this;
      this.getAxios(this.api.member.info, {}).then( res => {
          _this.userInfo = res.data;
          if (res.data.isLogin !== 'T'){
            _this.$router.push({path:'/parkCard/login',query:{..._this.$route.query}})
          } 
      });
    },
    getDetail(){
      let _this = this
      this.getAxios(this.api.yearcard.order.detail, {
        id: this.recordid,
      })
      .then(res => {
        if (res.status === 200) {
          _this.card = res.data;
        } else {
          _this.$vux.toast.text(res.message || "数据未正常加载", "middle");
        }
      });
    },
    getQr(){
      this.$vux.loading.show()
      this.getAxios(this.api.yearcard.qr.getQr,{rechargeId:this.recordid},null,true)
        .then(res => {
          this.$vux.loading.hide()
          if (res.status === 200 && res.success) {
            this.value = res.data.barCode
            this.timeOut = res.data.offset
            this.time()
          } 
        },err => {
          this.$vux.loading.hide()
          this.$vux.toast.text(err.message || "生成二维码失败，稍后再试", "middle");
        })
    },
    time(){
      let s = 0;
      let t = Number(this.timeOut)
      this.timer = window.setInterval(() => {
        s++
        if (s === t) {
          window.clearInterval(this.timer)
          this.getQr()
        }
      }, 1000);
    },
    refreshQr() {
      window.clearInterval(this.timer)
      this.getQr()
    }
  }
};
</script>
<style lang="scss" scope>
.show-parkcard-qr {
  height: 100%;
  width: 100%;
  background: linear-gradient(
    0deg,
    rgba(125, 225, 192, 1),
    rgba(82, 202, 155, 1)
  );
  .show-qr-bg {
    width: 345px;
    height: 500px;
    margin: 0 auto;
    background: url(../../../assets/images/parkcard/qr_box.png) no-repeat center
      40px;
    background-size: 345px auto;
    position: relative;
    .show-qr-box {
      position: absolute;
      top: 46px;
      left: 0;
      width: 345px;
      height: 436px;
      .show-qr-title {
        margin-top: 7px;
        height: 62px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 15px 30px;
        p {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2; //显示几行
          max-height: 58px;
          overflow: hidden;
          font-size: 18px;
          font-family: PingFang SC;
          font-weight: bold;
          color: #000000;
        }
      };
      .show-qr-image {
        width: 204px;
        height: 205px;
        margin: 0 auto;
        background: #eeeeee;
        .qr-image {
          width: 100%;
          height: 100%;
        }
        img {
          width: 100%!important;
          height: 100%!important
        }
      }
      .show-qr-refresh {
        margin-top: 48px;
        height: 60px;
        line-height: 60px;
        font-size:12px;
        font-family:PingFang SC;
        font-weight:500;
        color:#BBBBBB;
        width: 100%;
        text-align: center;
        > i {
          margin-right: 3px;
          font-size: 11px;
          font-weight: 600;
        }
        > span {
          color: #4FC898;
          margin-left: 4px;
        }
      }
    }
  }
  .show-qr-notice {
    width: 9.2rem;
    font-size: 0.346667rem;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    margin: 0 auto;
    line-height: 0.48rem;
    text-align: center;
    color: white;
  }
}
</style>