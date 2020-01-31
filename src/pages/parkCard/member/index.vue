<template>
  <div class="card-member">
    <div class="card-member-header">
      <div class="card-member-header-face">
        <img
          :src=" userInfo.headImg || '//statics.lotsmall.cn/wappublic/images/member/defaultFace.jpg'"
          alt
        >
      </div>
      <div class="card-member-header-name">{{userInfo.realName || userInfo.nickName}}</div>
      <div class="card-member-header-border"></div>
    </div>
    <div class="card-member-tabs">
      <div class="card-member-tabs-item" @click="toOrderList('order_init')">
        <img src="../../../assets/images/card/icon-unpay.svg" alt="待支付">
        <p>待付款</p>
      </div>
      <div class="card-member-tabs-item" @click="toOrderList('recharge_success')">
        <img src="../../../assets/images/card/icon-checked.svg" alt="已完成">
        <p>已完成</p>
      </div>
      <div class="card-member-tabs-item" @click="toOrderList('order_refund')">
        <img src="../../../assets/images/card/icon-tui.svg" alt="退款">
        <p>退款</p>
      </div>
      <div class="card-member-tabs-item" @click="toOrderList('')">
        <img src="../../../assets/images/card/icon-all.svg" alt="全部">
        <p>全部</p>
      </div>
    </div>
    <div class="card-other-list">
      <div class="card-other-list-item" v-if="openInvoice" @click="goInovice">
        <div class="card-other-list-item__title">电子发票</div>
        <div class="card-other-list-item__arraw">
          <i class="xx-icon icon-xiangyoujiantou"></i>
        </div>
      </div>
      <div class="card-other-list-item" @click="toBind">
        <div class="card-other-list-item__title">绑定电子二维码</div>
        <div class="card-other-list-item__arraw">
          <i class="xx-icon icon-xiangyoujiantou"></i>
        </div>
      </div>
      <a class="card-other-list-item" :href="questionUrl">
        <div class="card-other-list-item__title">常见问题</div>
        <div class="card-other-list-item__arraw">
          <i class="xx-icon icon-xiangyoujiantou"></i>
        </div>
      </a>
      <a class="card-other-list-item" :href="'tel:'+consultPhone">
        <div class="card-other-list-item__title">咨询投诉</div>
        <div class="card-other-list-item__arraw">
          <i class="xx-icon icon-xiangyoujiantou"></i>
        </div>
      </a>
    </div>
    <card-footer></card-footer>
  </div>
</template>

<script>
import cardFooter from "./../component/footer";
export default {
  components: {
    cardFooter
  },
  data() {
    return {
      userInfo: {},
      consultPhone: "",
      cardId:'',
      merchantInfoId:'',
      questionUrl:'',
      openInvoice:false
    };
  },
  created() {
    document.title = '个人中心'
    let _this = this;
    this.merchantInfoId = this.$route.query.m_id;
    this.cardId = this.$route.query.id || localStorage.getItem('park_card_id')
    // 获取用户信息
    this.getAxios(this.api.member.info, {}).then(res => {
      _this.userInfo = res.data;
      if (res.data.isLogin !== "T") {
        _this.$router.push({
          path: "/parkCard/login",
          query: { ..._this.$route.query }
        });
      }
    });

    this.getAxios(this.api.member.yearcard.normalQuestions, {
            merchantInfoId: this.merchantInfoId
        }).then(res => {
            if (res.status === 200) {
              this.questionUrl = res.data.questionUrl;
              this.consultPhone = res.data.tel;
            } else {
              console.log(res)
            }
        });
    // 是否支持电子发票    
    this.getAxios(this.api.invoices.enabled, {
      merchantInfoId: this.merchantInfoId
    },null,true).then( res => {
      if (res.status === 200) {
          if(res.data.flag == 1) this.openInvoice = true
      }
    })
  },
  methods: {
    toOrderList(status) {
      this.$cookie.set('park_order_status_'+ this.merchantInfoId,status,(2*60*1000))
      this.$router.push({
        path: "/parkCard/order/list",
        query: { m_id:this.merchantInfoId , id:this.cardId}
      });
    },
    goInovice(){
      this.$router.push({
        path: "/parkCard/invoice/list",
        query: { m_id:this.merchantInfoId}
      });
    },
    toBind(){
      this.$router.push('/parkCard/bindQr')
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../common.scss";
@import "./index.scss";
</style>

