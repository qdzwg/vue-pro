<template>
    <div class="card-warp">  
        <div class="topay-banner">
            <img :src="cardInfo.cardCover+'?imageMogr2/thumbnail/640x/strip/quality/100'" alt="">
        </div>
        <div class="order-info">
            <div class="order-info-item title">{{orderInfo.yearCardName}}</div>
            <div class="order-info-item list">
                <div class="order-info-item__name">姓名</div>
                <div class="order-info-item__value">{{orderInfo.accName}}</div>
            </div>
            <div class="order-info-item list">
                <div class="order-info-item__name">身份证</div>
                <div class="order-info-item__value">{{orderInfo.cardNo}}</div>
            </div>
            <div class="order-info-item list">
                <div class="order-info-item__name">类型</div>
                <div class="order-info-item__value pink">{{orderInfo.openFlag | cardType}}</div>
            </div>
        </div> 
        <div class="order-notice">{{cardInfo.handleCost}}</div>  
        <div class="pay-footer">
            <div class="pay-footer-content">
                <div class="pay-footer-totalprice">
                    <em>￥</em>
                    <strong>{{payMoney}}</strong>
                </div>
                <div class="able-btn pay-footer-btn" @click="openPaySure">去支付</div>
            </div>  
        </div> 
        <div>
            <div v-html="formStr"></div>
        </div>
        <pay ref="pay" :totalprice="payMoney" :isWxPay="isWxPay"></pay>
    </div>
</template>

<script>
import { isWxAli } from "@/common/common";
import pay from "@/pages/service/order/public/pay";
export default {
    components:{
        pay
    },
    data(){
        return {
            merchantInfoId:'',
            orderInfo:{},
            payOrderNo:'',
            cardInfo:{},
            payMoney:0,
            userInfo:{},
            isWxPay:false,
            payType:null,
            formStr: "",
        }
    },
    created(){
        let _this = this;
        document.title = '订单信息确认'
        // 获取用户信息
        this.getUserInfo()
        // 获取支付订单详情
        this.merchantInfoId = this.$route.query.m_id;
        this.payOrderNo = this.$route.query.payOrderNo;
        this.getAxios(this.api.member.yearcard.selectOrderDetil,{
                payOrderNo:this.payOrderNo,
                merchantInfoId:this.merchantInfoId
            }).then(res=>{
                if (res.status === 200) {
                    _this.orderInfo = res.data
                    _this.payMoney = res.data.paySum
                    // 获取卡信息
                    _this.getCardInfo(res.data.cardId)
                }
                else {
                    _this.$vux.toast.text(res.message || "数据加载异常", "middle");
                }
            })

    },
    filters:{
        cardType(openFlag){
            return openFlag ? '充值' : '首次办理' ;
        }
    },
    methods: {
        getUserInfo(){
            let tUrl = this.api.member.info; 
            let _this = this;
            this.getAxios(tUrl, {}).then(res => {
                _this.userInfo = res.data;
                if (res.data.isLogin !== 'T'){
                    _this.$router.push({path:'/parkCard/login',query:{..._this.$route.query}})
                } 
            });
        },
        // 去支付
        openPay() {
            let _this = this
            let extendParam = {
                orderInfo: this.orderInfo.yearCardName,
                redirectUrl: '/parkCard/order/list?m_id='+this.merchantInfoId,
                openId: this.userInfo.openId ? this.userInfo.openId : ""
            };
            this.getAxios(this.api.main.pay.goPay, {
                accountId: this.merchantInfoId,
                extendParamJson: JSON.stringify(extendParam),
                operateId: localStorage.getItem("xjsc_login_userId_2019_3_8"),
                payOrderNo: this.payOrderNo,
                paySum: this.payMoney,
                payType: this.payType,
                userType: "C",
                wayType: 1
            }).then(res => {
                if (res.status === 200 ) {
                    let env = isWxAli();
                    _this.formStr = res.data;
                    _this.isWxPay = env.isWx;
                    _this.$refs.pay.aliPayShow = true;
                } else if (res.status === 400){
                    _this.getUserInfo()
                } else {
                    _this.$vux.toast.text(res.message || '去支付异常，请重试')
                }
                
            });
        },
        openPaySure(){
            let env = isWxAli();
            this.getAxios("/merchant/api/merchantPayType/getMerchantPayType", {
                businessType: env.isWx ? "WEIXIN" : env.isAliPay ? "ALI" : "WAP"
            }).then(res => {
                this.payType = JSON.parse(res.message)[0]; 
                this.openPay();
            });
        },
        getCardInfo(id){
            let  _this = this;
            this.getAxios(this.api.yearcard.detail.main, {
                id: id,
                merchantInfoId: this.merchantInfoId
            })
            .then(res => {
                console.log(res);
                if (res.status === 200) {
                    _this.cardInfo = res.data;
                } else {
                    console.log(res)
                }
            });
        }   
    },
}
</script>
<style lang="scss" scoped>
    @import '../common.scss';
    @import './index.scss';
</style>

