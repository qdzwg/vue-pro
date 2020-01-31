<template>
  <div class="card-warp">
    <div class="topay-banner">
      <img :src="cardInfo.cardCover+'?imageMogr2/thumbnail/640x/strip/quality/100'" alt="">
    </div>
    <div class="order-info">
      <div class="order-info-item title">{{cardInfo.cardName}}</div>
      <div class="order-info-item list">
        <div class="order-info-item__name">姓名</div>
        <input
          class="order-info-item__value"
          v-model="form.accName"
          type="text"
          placeholder="请输入您的姓名"
        >
      </div>
      <div class="order-info-item list">
        <div class="order-info-item__name">身份证</div>
        <input
          type="text"
          v-model="form.cardNo"
          class="order-info-item__value"
          placeholder="请输入您的身份证号"
        >
      </div>
    </div>
    <div class="able-btn order-next-step" @click="nextStep">下一步</div>
    <div class="order-notice">
      <p>温馨提醒：{{cardInfo.warmPrompt}}</p>
      <p>咨询电话：{{cardInfo.consultPhone}}（工作时间：{{cardInfo.workTimes}}）</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      merchantInfoId: "78",
      cardId: "",
      cardInfo: {},
      userInfo:{},
      form: {
        accName: "",
        cardNo: ""
      },
      validator: true
    };
  },
  created() {
    // /marketing/api/yearCardTob/selectById
    document.title = '公园年卡业务办理'
    this.cardId = this.$route.query.id;
    let _this = this;
    this.getUserInfo() 
    let getDetailUrl = _this.api.yearcard.detail.main;
    _this.getAxios(getDetailUrl, {
        id: _this.cardId,
        merchantInfoId: _this.merchantInfoId
      })
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          _this.cardInfo = res.data;
        } else {
          _this.$vux.toast.text(res.message || "数据未正常加载", "middle");
        }
      });
  },
  methods: {
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
      let analyzeAge = this.analyzeIDCard()
      if (analyzeAge > 69) {
          let $this = this;
          this.$vux.confirm.show({
            content:'70岁以上市民，凭身份证等有效证件在杭州西湖风景名胜区所辖范围内的收费景点可免费参观，是否继续办理?', 
            showInput:false,
            confirmText:"是",
            cancelText:"否",
            onCancel () {},
            onConfirm () {
              $this.submitFrom()
            }
          })
      } else {
        this.submitFrom()
      } 
    },
    submitFrom(){
      let _this = this;
      if (this.validator) {
        this.postAxios(this.api.yearcard.order.newMain, {
          accName: this.form.accName,
          cardNo: this.form.cardNo,
          yearCardId: this.cardId,
          merchantInfoId: this.merchantInfoId
        }).then(res => {
          console.log(res);
          if (res.status === 200) {
              _this.$router.push({ path: "/parkCard/toPay", query: { ..._this.$route.query,payOrderNo:res.data.payOrderNo} });
          } else if (res.status === 400) {
            _this.getUserInfo();
          }
          else {
              _this.$vux.toast.text(res.message || "订单提交失败","middle")
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
    },
    analyzeIDCard() {
      //获取用户身份证号码
      let userCard = this.form.cardNo;
      //如果身份证号码为undefind则返回空
      if(!userCard){
        return null;
      }
    
      //获取出生年月日
      //userCard.substring(6,10) + "-" + userCard.substring(10,12) + "-" + userCard.substring(12,14);
      let yearBirth = userCard.substring(6,10);
      let monthBirth = userCard.substring(10,12);
      let dayBirth = userCard.substring(12,14);
      //获取当前年月日并计算年龄
      let myDate = new Date();
      let monthNow = myDate.getMonth() + 1;
      let dayNow = myDate.getDay();
      let age = myDate.getFullYear() - yearBirth;
      if(monthNow < monthBirth || (monthNow == monthBirth && dayNow < dayBirth)){
        age--;
      }
      //得到年龄
      return age
    }
  }  
}
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
</style>

