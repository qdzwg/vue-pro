<template>
  <div class="card-warp">
    <div v-if="cardInfo.cardCover" class="topay-banner">
      <img :src="cardInfo.cardCover+'?imageMogr2/thumbnail/750x/strip/quality/100'" alt="">
    </div>
    <div class="order-info">
      <div class="order-info-item list">
        <div class="order-info-item__name">姓名</div>
        <input
          class="order-info-item__value"
          v-model="form.accName"
          :disabled="disabled"
          type="text"
          placeholder="请输入您的姓名"
        >
      </div>
      <div class="order-info-item list">
        <div class="order-info-item__name">身份证</div>
        <input
          type="text"
          v-model="form.cardNo"
          :disabled="disabled"
          class="order-info-item__value"
          placeholder="请输入您的身份证号"
        >
      </div>
      <div class="order-info-item list card">
        <div class="order-info-item__name">人脸识别</div>
        <div class="order-info-item__img">
          <photo  @returnFaceUrl="getSrc">
            <img v-if="form.faceUrl" :src="form.faceUrl" alt />
            <span v-else class="placeholder">人脸图片用于实名认证</span>
            <div v-if="!form.faceUrl" class="order-info-item__ico">
              <i class="xx-icon icon-camera"></i>
            </div>
          </photo>
        </div>   
      </div>
    </div>
    <div class="order-notice">  
      <p>仅限本人实名办理的年卡可生成二维码</p>
      <p>未办理杭州市民卡的游客，暂不支持生成二维码</p>
      <p>每张年卡仅可在一个账号绑定电子二维码服务</p>
      <p>扫码入园时校验持卡人信息，非本人将无法使用</p>
    </div>
    <div class="able-btn order-next-step" @click="nextStep">绑定电子二维码</div>
    
  </div>
</template>

<script>
import photo from "@/components/photo";
import { debuglog } from 'util';
export default {
  components:{
    photo
  },
  data() {
    return {
      merchantInfoId: "78",
      recordid: "",
      disabled:false,
      cardInfo: {
        cardCover:'',
        productName:''
      },
      userInfo:{},
      form: {
        accName: "",
        cardNo: "",
        faceUrl:""
      },
      validator: true,
    };
  },
  created() {
    document.title = '绑定电子二维码'
    this.recordid = this.$route.query.recordid;
    this.disabled = !!this.$route.query.recordid;
    let _this = this;
    this.getUserInfo() 
    if (this.recordid) {
      this.getAxios(this.api.yearcard.order.detail, {
        id: this.recordid,
      })
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          _this.cardInfo = res.data;
          _this.form.accName = res.data.accName
          _this.form.cardNo = res.data.cardNo
        } else {
          _this.$vux.toast.text(res.message || "数据未正常加载", "middle");
        }
      });
    } else {
      
    }
  },
  methods: {
    getSrc(value){
      this.form.faceUrl = value;
    },
    getUserInfo(){
      let _this = this; 
      let tUrl = this.api.member.info; 
      this.getAxios(tUrl, {}).then(res => {
          _this.userInfo = res.data;
          if (res.data.isLogin !== 'T'){
              _this.$router.push({path:'/parkCard/login',query:{..._this.$route.query}})
          } 
      });
    },
    nextStep() {
      if (!this.form.accName) {
        this.validator = false;
        this.$vux.toast.text("姓名不能为空！", "middle");
        return;
      }
      else if (this.form.accName) {
        if (this.form.accName.length > 10) {
          this.validator = false;
          this.$vux.toast.text("姓名长度不可超过10个字符", "middle");
          return;
        }
      }
      if (!this.form.cardNo) {
            this.validator = false;
            this.$vux.toast.text("身份证号码不能为空！", "middle");
            return;
      }else if (!this.checkIdcard(this.form.cardNo)){
            this.validator = false;
            this.$vux.toast.text("请输入正确的身份证号码！", "middle");
            return;
      }
      if (!this.form.faceUrl) {
            this.validator = false;
            this.$vux.toast.text("人脸图片不能为空！", "middle");
            return;
      }

      let _this = this;
      if (this.validator) {
        this.getAxios(this.api.yearcard.qr.bind, {
          id:this.recordid || '',
          name:this.form.accName,
          idCard: this.form.cardNo,
          faceUrl: this.form.faceUrl,
        },null,true).then(res => {
          console.log(res);
          if (res.status === 200) {
            _this.$router.push("/parkCard/showQr?recordid="+ res.data);
          } 
        }, err => {
          switch (err.status) {
            case 400:
              _this.getUserInfo();
              break;
            case 1001:
              this.$vux.confirm.show({
                content:err.message,
                confirmText:"去购买",
                // 组件除show外的属性
                onCancel : () => {},
                onConfirm : () => {
                  this.$router.push('/yearcard')
                }
              })
              break;
            case 1002: 
              if (typeof err.data !== 'undefined' && err.data.renewals) {
                this.$vux.confirm.show({
                  content:err.message,
                  confirmText:"去续费",
                  // 组件除show外的属性
                  onCancel : () => {
                  },
                  onConfirm : () => {
                    this.$router.push({path:'/parkCard/detail',query:{recordid: err.data.rechargeId}})
                  }
                })
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
            default:
              this.$vux.toast.text(err.message || "绑定电子二维码异常","middle")
              break;
            }
        });
      }
      this.validator = true;
    },
    checkIdcard(val) {
      let ID = val;
      if (!ID) return callback();
      if (typeof ID !== "string") {
        callback(new Error("非法字符串"));
        return;
      }
      let city = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江 ",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北 ",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏 ",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外"
      };
      let birthday =
        ID.substr(6, 4) +
        "/" +
        Number(ID.substr(10, 2)) +
        "/" +
        Number(ID.substr(12, 2));
      let d = new Date(birthday);
      let newBirthday =
        d.getFullYear() +
        "/" +
        Number(d.getMonth() + 1) +
        "/" +
        Number(d.getDate());
      let currentTime = new Date().getTime();
      let time = d.getTime();
      let arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      let arrCh = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
      let sum = 0,
        i,
        residue;
      if (!/^\d{17}(\d|x)$/i.test(ID))
        return false;
      if (city[ID.substr(0, 2)] === undefined)
        return false;
      if (time >= currentTime || birthday !== newBirthday)
        return false;
      for (i = 0; i < 17; i++) {
        sum += ID.substr(i, 1) * arrInt[i];
      }
      residue = arrCh[sum % 11];
      if (residue !== ID.substr(17, 1).toUpperCase())
        return false;
      return true;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../common.scss";
@import "../topay/index.scss";
.order-next-step {
  margin: 20px auto;
}
.order-info-item__value,.order-info-item__name {
  font-size: 17px;
}
.order-info-item input {
  border: none;
}
::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #999;
  font-size: 15px;
  font-family: PingFangSC-Regular;
}
.order-info-item {
   input:disabled {
    background: white;
    // color: #999;
  }
  &.card {
    border-top: 1px solid rgba(230,230,230,0.6);
    .placeholder {
      flex: 1;
      font-size: 0.4rem;
      font-family: PingFangSC-Semibold;
      font-weight: 600;
      color: #999;
      line-height: 0.56rem;
    }
    .order-info-item__img {
       flex: 1;
       img {
         width: 60px;
         max-height: 60px;
         border-radius: 4px;
       }
    }
    .order-info-item__ico {
      width: 20px;
      padding-right: 10px;
      .xx-icon {
        font-size: 24px;
        color: #4FC898;
        line-height: 1;
      }
    }
  }
}
.order-notice {
  text-align: center;
}
</style>

