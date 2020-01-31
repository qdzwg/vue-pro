<template>
    <div class="card-warp">
        <div class="card-list card-detail">
            <div class="card-list-item">
                <img :src="listData.cardCover +'?imageMogr2/thumbnail/640x/strip/quality/100'" alt="">
                <div class="card-list-item-logo">
                    <img :src="listData.cardLogo+'?imageMogr2/thumbnail/640x/strip/quality/100'" alt="">
                </div>
                <div class="card-list-item-flog" v-if="listData.isInvalid=='F'">有效</div>
                <div class="card-list-item-flog disable" v-else>失效</div>
                <div class="card-list-item-content">
                    <p class="card-list-item-content__title">{{listData.productName}}</p>
                    <p class="card-list-item-content__detail">{{listData.accName}}</p>
                    <p class="card-list-item-content__number">{{listData.cardNo}}</p>
                </div>
                <div class="card-list-item-time">有效期：{{listData.beginDate }}至{{listData.invalidDate }}</div>
                <div class="card-mask" v-if="listData.isInvalid=='T'"></div>
            </div>
        </div>
        <!-- <div class="card-continue-btn" >
            续费
        </div> -->
        <div v-if="listData.qrCode === 'T'" class="card-other-list" style="margin:0 auto .8rem" @click="toShowQr">
            <div class="card-other-list-item">
                <div class="card-other-list-item__title">使用电子二维码</div>
                <div class="card-other-list-item__arraw">
                    <!-- <span>仅限本人年卡使用</span> -->
                    <i class="xx-icon icon-xiangyoujiantou"></i>
                </div>
            </div>
        </div>
        <!-- 每年11月份开放 -->
        <div class="card-continue-btn selected" @click="continueUse">
            续费
        </div>
        <div class="card-other-list">
            <div v-if="listData.qrCode === 'F'" class="card-other-list-item" @click="toBind">
                <div class="card-other-list-item__title">绑定电子二维码</div>
                <div class="card-other-list-item__arraw">
                    <span>仅限本人年卡使用</span>
                    <i class="xx-icon icon-xiangyoujiantou"></i>
                </div>
            </div>
            <div v-else-if="listData.qrCode === 'T'" class="card-other-list-item" @click="unBind">
                <div class="card-other-list-item__title">解绑电子二维码</div>
                <div class="card-other-list-item__arraw">
                    <i class="xx-icon icon-xiangyoujiantou"></i>
                </div>
            </div>
            <div class="card-other-list-item" @click="show8=true">
                <div class="card-other-list-item__title">使用须知</div>
                <div class="card-other-list-item__arraw">
                    <i class="xx-icon icon-xiangyoujiantou"></i>
                </div>
            </div>
            <div class="card-other-list-item" @click="show9=true">
                <div class="card-other-list-item__title">使用范围</div>
                <div class="card-other-list-item__arraw">
                    <i class="xx-icon icon-xiangyoujiantou"></i>
                </div>
            </div>
        </div>
        <x-dialog hide-on-blur v-model="show8">
            <div class="notice-modal">
                <div class="title">
                    <div class="text">使用须知</div>
                    <i @click="show8=false" class="xx-icon icon-guanbi2"></i>
                </div>
                <div class="notice-book-content">{{listData.useNotice}}</div>
                <div class="position-horizontal-demo" @click="show8 = false">
                    <span class="vux-close">我知道了</span>
                </div>
            </div>
        </x-dialog>
        <x-dialog hide-on-blur v-model="show9">
            <div class="notice-modal">
                <div class="title">
                    <div class="text">使用范围</div>
                    <i @click="show9=false" class="xx-icon icon-guanbi2"></i>
                </div>
                <div class="notice-book-content">{{listData.useScope}}</div>
                <div class="position-horizontal-demo" @click="show9 = false">
                    <span class="vux-close">我知道了</span>
                </div>
            </div>
        </x-dialog>
    </div>
</template>

<script>
import {  XDialog } from "vux";
export default {
  components: {  XDialog },
  data() {
    return {
      listData: {},
      show8: false,
      show9: false,
      recordid:''
    };
  },
  created() {
    document.title = '年卡管理'
    if (this.$route.query.recordid) {
      this.recordid = this.$route.query.recordid
      this.getAxios( this.api.yearcard.order.detail , {
          id: this.$route.query.recordid
        }
      ).then(res => {
        if (res.status == 200) {
          this.listData = res.data;
          this.listData.cardNo =
            this.listData.cardNo.slice(0, 6) +
            "******" +
            this.listData.cardNo.slice(this.listData.cardNo.length - 6);
          this.listData.beginDate = this.listData.beginDate.slice(0, 10);
          this.listData.invalidDate = this.listData.invalidDate.slice(0, 10);
        }
      });
    }

    if(this.$route.query.fromPay&&this.$route.query.fromPay==='T'){
        this.show8=true
    }
  },
  methods: {
    continueUse(){
       this.postAxios(this.api.yearcard.order.renewals,{
          id:this.recordid
       }).then(res => {
        if (res.status == 200) {
          this.$router.push({path:'/parkCard/topay',query: {m_id:this.$route.query.m_id,id:res.data.cardId,payOrderNo:res.data.payOrderNo}})
        }
        else {
         this.$vux.toast.text(res.message || "续费不成功")
        }
      });
    },
    toBind(){
      this.getAxios(this.api.yearcard.qr.beforBindQr,{
        rechargeId:this.recordid
      },null,true).then(res => {
          if (res.status === 200 && res.success) {
            this.$router.push('/parkCard/bindQr?recordid='+ this.recordid)
          } 
      }, err => {
        this.handleErr(err)
      })
    },
    toShowQr(){
      this.getAxios(this.api.yearcard.qr.beforGetQr,{
        rechargeId:this.recordid
      },null,true).then(res => {
          if (res.status === 200 && res.success) {
            this.$router.push('/parkCard/showQr?recordid='+ this.recordid)
          } 
      }, err => {
        this.handleErr(err)
      }) 
    },
    handleErr(err){
      switch (err.status) {
        case 1001:
          this.$vux.confirm.show({
            content:err.message,
            confirmText:"去购买",
            // 组件除show外的属性
            onCancel : () => {
              this.$router.push('/yearcard')
            },
            onConfirm : () => {}
          })
          break;
        case 1002: 
          this.$vux.confirm.show({
            content:err.message,
            confirmText:"我知道了",
            // 组件除show外的属性
            onCancel : () => {
            },
            onConfirm : () => {
            }
          })
          break;
        case 400:
          this.getUserInfo();
          break;
        default:
          this.$vux.toast.text(err.message || "展示电子二维码异常" ,"middle")
          break;
      }
    },
    unBind(){
      this.$vux.confirm.show({
        content:'解绑电子二维码后，将只能通过刷身份证、市民卡的方式入园游玩。',
        // 组件除show外的属性
        onCancel : () => {
        },
        onConfirm : () => {
          this.getAxios(this.api.yearcard.qr.unbind, {rechargeId: this.recordid})
            .then( res => {
              if (res.status === 200 && res.success) {
                this.listData.qrCode = 'F'
                this.$vux.toast.text(res.data || "解绑成功")
              }
            })
        }
      })
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../common.scss";
@import "../list/index.scss";
@import "./index.scss";
.popup-content {
  height: 100%;
  padding: 15px;
  background-color: #fff;
}
.notice-modal {
  height: auto;
  .title {
    color:#333333;
    position:relative;
    .text{
        font-size: 18px;
        line-height:2;
    }
    .icon-guanbi2 {
      position:absolute;
      top:5px;
      right:10px;
      font-size: 22px;
    }
  }
  .notice-book-content{
      padding:15px;
      text-align: left;
  }
  .position-horizontal-demo {
    margin: 15px auto;
    height: 36px;
    width: 80%;
    line-height: 36px;
    text-align: center;
    border-radius: 20px;
    background: linear-gradient(
      146deg,
      rgba(135, 230, 201, 1) 0%,
      rgba(79, 200, 152, 1) 100%
    );
    box-shadow: 0px 4px 15px 0px rgba(135, 230, 201, 1);
    .vux-close {
      transform: translateX(-50%) translateY(-50%) scale(4);
      color: #fff;

      font-size: 15px;
    }
  }
}
</style>

