<template>
    <div class="card-warp">
        <div class="card-list card-detail">
            <div class="card-list-item">
                <img :src="cardInfo.cardCover +'?imageMogr2/thumbnail/640x/strip/quality/100'" alt="">
                <div class="card-list-item-logo">
                    <img :src="cardInfo.cardLogo" alt="">
                </div>
                <!-- <div class="card-list-item-flag">{{orderInfo.orderStatusCH}}</div>   -->
                      
                <div class="card-list-item-content">
                    <p class="card-list-item-content__title">{{orderInfo.yearCardName}}</p>
                    <!-- <p class="card-list-item-content__detail">{{orderInfo.accName}}</p>
                    <p class="card-list-item-content__number">{{orderInfo.cardNo}}</p> -->
                </div>
                <div class="card-list-item-time">交易流水号：{{payOrderNo}}</div>
            </div>
        </div>
        <!-- 待支付 -->
        <div v-if="orderInfo.payStatus === 'wait_pay'&& orderInfo.orderStatus === 'order_init'" class="card-continue-btn wait_pay" >
            <div @click="openPay()" class="able-btn">继续支付</div>
            <div @click="cancelOrder()" class="disable-btn">取消订单</div>
        </div>
        <!-- 已完成 -->
        <!-- <div v-if="orderInfo.payStatus === 'pay_success'&& (orderInfo.orderStatus === 'recharge_success' || orderInfo.orderStatus === 'recharge_failure' )" class="card-continue-btn" >
            <div @click="refund()" class="disable-btn">申请退款</div>
        </div> -->
        <div class="order-info">
            <div class="order-info-item title">{{orderInfo.yearCardName}}</div>
            <div class="order-info-item list">
                <div class="order-info-item__name">姓名</div>
                <div class="order-info-item__value">{{orderInfo.secretAccName}}</div>
            </div>
            <div class="order-info-item list">
                <div class="order-info-item__name">身份证</div>
                <div class="order-info-item__value">{{orderInfo.secretCardNo}}</div>
            </div>
            <div class="order-info-item list">
                <div class="order-info-item__name">类型</div>
                <div class="order-info-item__value pink">{{orderInfo.openFlag | cardType}}</div>
            </div>
            <div class="order-info-item list">
                <div class="order-info-item__name">订单状态</div>
                <div class="order-info-item__value">{{orderInfo.orderStatusCH}}</div>
            </div>
            <div class="order-info-item list">
                <div class="order-info-item__name">交易时间</div>
                <div class="order-info-item__value">{{orderInfo.createTime}}</div>
            </div>
        </div>
        <div style="height:0.5rem"></div> 
        <div>
            <div v-html="formStr"></div>
        </div>
        <pay ref="pay" :totalprice="payMoney" :isWxPay="isWxPay"></pay>
        <confirm v-model="confirmShow" @on-confirm="onConfirm">
            <p style="text-align:center;">{{confirmText}}</p>
        </confirm>
    </div>
</template>

<script>
import { isWxAli } from "@/common/common";
import pay from "@/pages/service/order/public/pay";
import { Confirm } from 'vux'
export default {
    components:{
        pay,
        Confirm
    },
    data() {
        return {
            listData:{},
            orderInfo:{},
            cardInfo:{},
            userInfo:{},
            merchantInfoId:'',
            cardId:'',
            payOrderNo:'',
            formStr:'',
            isWxPay:'',
            confirmShow:false,
            confirmText:'',
            confirmType:'',
            payMoney:''
        };
    },
    filters:{
        cardType(openFlag){
            return openFlag ? '充值' : '首次办理';
        }
    },
  created() {
        document.title = '我的订单'
        let _this = this;
        this.merchantInfoId = this.$route.query.m_id;
        this.payOrderNo = this.$route.query.code;
        this.cardId = this.$route.query.id;
        // 获取用户信息
        let tUrl = this.api.member.info; 
        this.getAxios(tUrl, {}).then(res => {
            _this.userInfo = res.data;
            if (res.data.isLogin !== 'T'){
                _this.$router.push({path:'/parkCard/login',query:{..._this.$route.query}})
            } 
        });
        // 获取支付订单详情
        this.getAxios(this.api.member.yearcard.selectOrderDetil,{
                payOrderNo:this.payOrderNo,
                merchantInfoId:this.merchantInfoId
            }).then(res=>{
                if (res.status === 200) {
                    _this.orderInfo = res.data
                    _this.payMoney = res.data.paySum
                    // 获取卡信息
                    _this.cardId = res.data.cardId
                    _this.getCardInfo()
                }
                else {
                    console.log(res.message || "数据加载异常", "middle");
                }
            })
         
  },
  methods: {
        /**
         * 获取卡信息
         */
        getCardInfo() {
            // 获取卡详情    
            let getDetailUrl = this.api.yearcard.detail.main;
            let _this = this;
            this.getAxios(getDetailUrl, {
                id: _this.cardId,
                merchantInfoId: _this.merchantInfoId
            })
            .then(res => {
                if (res.status === 200) {
                    _this.cardInfo = res.data;
                } else {
                    console.log(res.message || "数据未正常加载", "middle");
                }
            });  
            // 初始化支付
            this.openPaySure() 
        },
        // 支付宝支付
        openPay() {
            const order = this.orderInfo;
            let _this = this;
            let env = isWxAli();
            let extendParam = {
                orderInfo: order.yearCardName,
                redirectUrl: encodeURIComponent(window.location.href),
                openId: this.userInfo.openId ? this.userInfo.openId : ""
            };
            this.getAxios(this.api.main.pay.goPay, {
                accountId: this.merchantInfoId,
                extendParamJson: JSON.stringify(extendParam),
                operateId: localStorage.getItem("xjsc_login_userId_2019_3_8"),
                payOrderNo: order.payOrderNo,
                paySum: order.paySum,
                payType: this.payType,
                userType: "C",
                wayType: 1
            }).then(res => {
                let env = isWxAli();
                _this.formStr = res.data;
                _this.isWxPay = env.isWx;
                _this.$refs.pay.aliPayShow = true;
            });
        },
        openPaySure(){
            let env = isWxAli();
            this.getAxios("/merchant/api/merchantPayType/getMerchantPayType", {
                businessType: env.isWx ? "WEIXIN" : env.isAliPay ? "ALI" : "WAP"
            }).then(res => {
                this.payType = JSON.parse(res.message)[0]; 
            });
        }, 
        /**
         * 退单
         */
        cancelOrder(order){
            this.confirmType = 'cancel' 
            this.confirmText = '确认取消订单？'
            this.confirmShow = true
        },
        /**
         * 退款
         */
        refund(order) {
            this.confirmType = 'refund' 
            this.confirmText = '确认退款？'
            this.confirmShow = true
        },
        /**
         * 确定弹框
         */
        onConfirm(){
            let _this = this;
            if (this.confirmType === 'cancel') {
                this.postAxios(this.api.yearcard.order.cancel, {
                    orderNo:this.orderInfo.orderNo,
                    merchantInfoId:this.merchantInfoId,
                }).then(res => {
                    if (res.status === 200) {
                        this.$vux.toast.text(res.message || "订单取消成功", "middle");
                        _this.orderInfo.orderStatus = 'recharge_cancel'
                        _this.orderInfo.orderStatusCH = '取消充值'
                    } else {
                        this.$vux.toast.text(res.message || "数据未正常加载", "middle");
                    }
                });
            }
            else if(this.confirmType === 'refund') {
                this.postAxios(this.api.yearcard.order.refund, {
                    orderNo:this.orderInfo.orderNo,
                    merchantInfoId:this.merchantInfoId,
                    reason:''
                }).then(res => {
                    if (res.status === 200) {
                        this.$vux.toast.text(res.message || "退款成功", "middle");
                        _this.orderInfo.orderStatus = 'order_refund'
                        _this.orderInfo.orderStatusCH = '退款处理中'
                    } else {
                        this.$vux.toast.text(res.message || "数据未正常加载", "middle");
                    }
                });
            }
        }
  }
};
</script>
<style lang="scss" scoped>
@import "../common.scss";
@import "../list/index.scss";
@import "./detail.scss";
.card-detail {
    padding-bottom:0;
    margin-bottom:20px;
}
.card-list-item-flag {
    position: absolute;
    top: .533333rem;
    right: 0;
    // width: 1.28rem;
    height: .64rem;
    background: -webkit-linear-gradient(304deg,#87e6c9,#4fc898);
    background: linear-gradient(146deg,#87e6c9,#4fc898);
    border-radius: 2.666667rem 0 0 2.666667rem;
    font-size: .346667rem;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: #fff;
    line-height: .64rem;
    text-align: center;
}
.popup-content {
  height: 100%;
  padding: 15px;
  background-color: #fff;
}
.position-horizontal-demo {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 49px;
  width: 100%;
  line-height: 49px;
  text-align: center;
    border-radius: 49px;
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
</style>

