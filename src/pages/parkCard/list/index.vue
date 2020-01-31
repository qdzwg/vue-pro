<template>
    <div class="card-warp">  
        <div class="card-list">
            <div class="card-list-item" v-for="item in listData" :key="item.id" @click="goUrl(item.id)">
                <img :src="item.cardCover +'?imageMogr2/thumbnail/640x/strip/quality/100'" alt="">
                <div class="card-list-item-logo">
                    <img :src="item.cardLogo +'?imageMogr2/thumbnail/640x/strip/quality/100'" alt="">
                </div>
                <div class="card-list-item-content">
                    <p class="card-list-item-content__title">{{item.productName}}</p>
                    <p class="card-list-item-content__detail">{{item.accName}}</p>
                    <p class="card-list-item-content__number">{{item.cardNo}}</p>
                </div>
                <div class="card-list-item-qr" :class="{'able': item.qrCode === 'T'}" @click.stop="handleQrClick(item)">
                    <dir class="item-qr-pos">
                        <i class="xx-icon icon-ico"></i>
                    </dir>   
                </div>
            </div>
            <div v-if="listData instanceof Array && !listData.length">
                <div class="no-data">暂无数据</div>
            </div>
        </div>
      <card-footer></card-footer>
    </div>
</template>

<script>
import cardFooter from './../component/footer'
export default {
    components:{
        cardFooter,
    },
    data(){
        return {
            merchantInfoId:'',
            userInfo:{},
            listData:[]
        }
        
    },
    created(){
        document.title = '年卡管理'
        this.merchantInfoId = this.$route.query.m_id;
        let tUrl = this.api.member.info;
        let _this = this;
        this.getAxios(tUrl, {}).then(res => {
            _this.userInfo = res.data;   
        });
        this.getAxios('/yearcard/orderApi/rechargeRecord').then(res=>{
            if(res.status==200){
                this.listData=res.data || []
                this.listData.forEach(item=>{
                    item.cardNo= (item.cardNo.slice(0, 6) + "******" + item.cardNo.slice(item.cardNo.length - 6))
                })
               
            }
        })

    },
    methods:{
        goUrl(id){
            this.$router.push('/parkCard/detail?recordid='+id)
        },
        handleQrClick(item){
            if (item.qrCode === 'T') {
                this.$router.push('/parkCard/showQr?recordid=' + item.id)
            } else {
                this.toShowQr(item.id)
            }
        },
        toShowQr(id){
            this.getAxios(this.api.yearcard.qr.beforBindQr,{
                rechargeId:id
            },null,true).then(res => {
                if (res.status === 200 && res.success) {
                    this.$router.push('/parkCard/bindQr?recordid='+ id)
                } 
            }, err => {
                this.handleErr(err)
            }) 
        },
        handleErr(err){
            switch (err.status) {
                case 1002: 
                    if (typeof err.data !== 'undefined' && err.data.renewals === 'T') {
                        this.$vux.confirm.show({
                            content:err.message,
                            confirmText:"去续费",
                            // 组件除show外的属性
                            onCancel : () => {
                            },
                            onConfirm : () => {
                                this.$router.push('/parkCard/bindQr?recordid='+ err.data.rechargeId)
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
                case 400:
                    this.getUserInfo();
                    break;
                default:
                    this.$vux.toast.text(err.message || "展示电子二维码异常" ,"middle")
                    break;
            }
        },
    }
}
</script>
<style lang="scss" scoped>
    @import '../common.scss';
    @import './index.scss';
    .no-data {
        padding: 20px 15px;
        width: 345px;
        text-align: center;
        color: #BBBBBB;
        font-family:PingFangSC-Regular;
        font-size: 18px;
    }
</style>

