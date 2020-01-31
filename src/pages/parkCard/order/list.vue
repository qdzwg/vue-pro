<template>
    <div class="card-warp">  
        <y-tabs :list='tabsList' :activeIndex="currentindex" @select="tabsChange"></y-tabs>
        <div class="card-order-list">
            <div v-for="(order,index) in listData" :key="index" class="card-order-item">
                <div class="card-order-item-top">
                    <div class="card-order-item-top__date">{{order.createTime}}</div>
                    <div class="card-order-item-top__status">{{order.orderStatusCH}}</div>
                </div>
                <div @click="toOrderDetail(order)" class="card-order-item-body">
                    <div class="card-order-item-body__img">
                        <img :src="order.cardCover+'?imageMogr2/thumbnail/640x/strip/quality/100'" alt="">
                    </div>
                    <div class="card-order-item-body__title">{{order.yearCardName}}</div>
                    <div class="card-order-item-body__price">
                        <p class="price">￥{{order.paySum}}</p>
                        <p class="amount">×1</p>
                    </div>
                </div>
                <div class="card-order-item-total">
                    共1件商品，合计：
                    <span  class="total-price">￥{{order.paySum}}</span>
                </div>
                <!-- 待支付 -->
                <div  v-if="order.payStatus === 'wait_pay'&& order.orderStatus === 'order_init' " class="card-order-item-btns">
                    <div @click="cancelOrder(order)" class="btns pray">取消订单</div>
                    <div @click="openPay(order)" class="btns green">去支付</div>
                </div>
                <!-- 已完成 -->
                <div  v-if="order.orderStatus === 'recharge_success'" class="card-order-item-btns">
                    <div v-if="order.enableInvoices === 'INVOICESING'" @click="openCreatInvoice(order)" class="btns green">申请发票</div>
                    <div v-if="order.enableInvoices === 'INVOICED'" @click="openCreatInvoice(order)" class="btns pray">发票详情</div>
                </div>
                <!-- 已完成 -->
                <!-- <div v-if="order.payStatus === 'pay_success'&& (order.orderStatus === 'recharge_success' || order.orderStatus === 'recharge_failure' )" class="card-order-item-btns">
                    <div @click="refund(order)" class="btns green">申请退款</div>
                </div> -->
            </div>
            <div v-if="listData instanceof Array && !listData.length">
                <div class="no-data">暂无数据</div>
            </div>
        </div>
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
import { Confirm } from 'vux'
import pay from "@/pages/service/order/public/pay";
import yTabs from "@/components/yTabs"
export default {
    components:{
        pay,
        Confirm,
        yTabs
    },
    data(){
        return {
            status:'',
            listData:[],
            orderInfo:{},
            userInfo:{},
            cardId:'',
            merchantInfoId:'',
            formStr:'',
            isWxPay:'',
            payMoney:'',
            confirmShow:false,
            confirmText:'',
            confirmType:'',
            tabsList:[
                {
                    status:'',
                    label:'全部'
                },
                {
                    status:'order_init',
                    label:'待支付'
                },
                {
                    status:'recharge_success',
                    label:'已完成'
                },
                {
                    status:'order_refund',
                    label:'退款'
                },
            ],
            currentindex:0
        }
    },
    created(){
        document.title = '我的订单'
        let _this = this
        this.payOrderNo = this.$route.query.payOrderNo;
        this.merchantInfoId = this.$route.query.m_id;
        this.cardId = this.$route.query.id;
        this.status = this.$cookie.get('park_order_status_'+this.merchantInfoId) ||  ''   
        this.tabsList.forEach( (item,index) => {
            if(item.status === this.status) this.currentindex = index;
        })
        // 获取用户信息
        let tUrl = this.api.member.info; 
        this.getAxios(tUrl, {}).then(res => {
            _this.userInfo = res.data;
            if (res.data.isLogin !== 'T'){
                _this.$router.push({path:'/parkCard/login',query:{..._this.$route.query}})
            } 
        });
       
        this.getList()
        // 初始化支付 
        this.openPaySure();
    },
    methods:{
        getList(){
            let _this = this;
            this.getAxios(this.api.member.yearcard.selectOrderList,{
                cardId:this.cardId,
                orderStatus:this.status,
                merchantInfoId:this.merchantInfoId
            }).then(res=>{
                if (res.status === 200) {
                    _this.listData = res.data
                }
                else {
                    _this.$vux.toast.text(res.message || "数据加载异常", "middle");
                }
            }) 
        },
        tabsChange(item) {
            this.status = item.status;
            this.$cookie.set('park_order_status_'+ this.merchantInfoId,status,(2*60*1000))
            this.getList()
        },
        toOrderDetail(order){
            this.$router.push({path:'/parkCard/order/detail',query:{m_id:this.merchantInfoId,id:this.cardId,code:order.payOrderNo}})
        },
        // 支付宝支付
        openPay(order) {
            let env = isWxAli();
            let _this = this;
            let extendParam = {
                orderInfo: order.yearCardName,
                redirectUrl: encodeURIComponent(window.location.href),
                openId: this.userInfo.openId ? this.userInfo.openId : ""
            };
            this.payMoney = order.paySum;
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
         * 开发票
         */
        openCreatInvoice(order){
            // parkCard/invoice/create?payOrderNo=C2019061520000400001382&m_id=78
            // /parkCard/invoice/detail?payOrderNo=O2018091310344800020953&m_id=78
            switch (order.enableInvoices) {
                case 'INVOICESING':
                    this.$router.push({path:'/parkCard/invoice/create',query:{payOrderNo: order.payOrderNo}})
                    break;
                case 'INVOICED':
                    this.$router.push({path:'/parkCard/invoice/detail',query:{payOrderNo: order.payOrderNo}})
                    break;
                default:
                    break;
            }
            
        },
        /**
         * 退单
         */
        cancelOrder(order){
            this.confirmType = 'cancel' 
            this.confirmText = '确认取消订单？'
            this.confirmShow = true
            this.orderInfo = order
        },
        /**
         * 退款
         */
        refund(order) {
            this.confirmType = 'refund' 
            this.confirmText = '确认退款？'
            this.confirmShow = true
            this.orderInfo = order
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
                        this.listData.forEach(item => {
                            if (item.orderNo === _this.orderInfo.orderNo) {
                                item.orderStatus = 'recharge_cancel'
                                item.orderStatusCH = '取消充值'
                            }
                        })
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
                        this.listData.forEach(item => {
                            if (item.orderNo === _this.orderInfo.orderNo) {
                                item.orderStatus = 'order_refund'
                                item.orderStatusCH = '退款处理中'
                            }
                        })
                    } else {
                        this.$vux.toast.text(res.message || "数据未正常加载", "middle");
                    }
                });
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    @import '../common.scss';
    @import './list.scss';
</style>

