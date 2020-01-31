<template>
    <div class="card-home">
            <div class="card-home-banner">
                <img :src="listData.cardCover +'?imageMogr2/thumbnail/640x/strip/quality/100'" alt="">
                <div class="cardName">{{listData.cardName}}</div>
            </div>
            <div class="card-home-btn" @click="cardPay(listData.id)">去办理</div>
            <div class="card-home-tabs">
                <div class="card-home-tabs-item" :class="{'selected':derailShow=='1'}" @click="barShow('1')">
                    <p class="card-home-tabs-item__content">适用范围</p>
                    <span class="card-home-tabs-item__border"></span>
                </div>
                <div class="card-home-tabs-item" :class="{'selected':derailShow=='2'}" @click="barShow('2')">
                    <p class="card-home-tabs-item__content">办理费用</p>
                    <span class="card-home-tabs-item__border"></span>
                </div>
                <div class="card-home-tabs-item" :class="{'selected':derailShow=='3'}" @click="barShow('3')">
                    <p class="card-home-tabs-item__content">使用人群</p>
                    <span class="card-home-tabs-item__border"></span>
                </div>
            </div>
            <div class="card-home-content">
                <p v-if="derailShow=='1'">{{listData.useScope}}</p>
                <p v-if="derailShow=='3'">{{listData.useDateLimit}}</p>
                <p v-if="derailShow=='2'">{{listData.handleCost}}</p>
            </div>
            
            <card-footer></card-footer>
        </div>
</template>

<script>
import cardFooter from './../component/footer'
export default {
    components:{
        cardFooter
    },
  data() {
    return {
      merchantInfoId: "",
      userInfo: null,
      params: {
        currPage: 1,
        pageSize: 6
      },
      listData: [],
      derailShow:"1",
 
    };
  },
  created() {
    document.title = '年卡详情'
    this.merchantInfoId = this.$route.query.m_id;
    let tUrl = this.api.member.info;
    let _this = this;
    this.getAxios(tUrl, {}).then(res => {
      _this.userInfo = res.data;
      _this.isLogin = res.data.isLogin;
      _this.qyyxFlag = res.data.qyyxFlag;
      _this.show = true;
      if (_this.isLogin !== "T") {
        _this.$router.push("/parkCard/login", { ..._this.$route.query });
      } else {
      }
    });
    if(this.$route.query.id){
         this.getAxios("/marketing/api/yearCardTob/selectById", {
            id: this.$route.query.id
          }).then(res => {
            this.listData = res.data;
          });
        // 保存cardid
        if (this.$route.query.id) {
          localStorage.setItem("park_card_id", this.$route.query.id);
        }
    }
   
  },
  methods: {
      barShow(num){
         this.derailShow=num
      },
      cardPay(id) {
      this.$router.push("/parkCard/saveOrder?id=" + id +'&m_id='+this.merchantInfoId );
    },
  }
};
</script>
<style lang="scss" scoped>
@import "../common.scss";
@import "./index.scss";
</style>

