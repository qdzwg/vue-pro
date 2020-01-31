<template>
    <div class="card-footer">
        <div class="card-footer-warp">
            <div class="card-footer-tab" :class="{'on':$route.path=='/yearcard'||$route.path=='/parkCard/home'}" @click="pathUrl('/yearcard')">
                <div class="card-footer-tab__icon xx-icon icon-cardhome"></div>
                <div class="card-footer-tab__text">首页</div>
            </div>
            <div class="card-footer-tab" :class="{'on':$route.path=='/parkCard/list'}" @click="pathUrl('/parkCard/list')">
                <div class="card-footer-tab__icon xx-icon icon-card"></div>
                <div class="card-footer-tab__text">年卡管理</div>
            </div>
            <div class="card-footer-tab" :class="{'on':$route.path=='/parkCard/member'}" @click="pathUrl('/parkCard/member')">
                <div class="card-footer-tab__icon xx-icon icon-cardmy"></div>
                <div class="card-footer-tab__text">我的</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    methods:{
        pathUrl(path){
            this.$router.push({path:path,query:{...this.$route.query}})
        }
    }
    
}
</script>
<style lang="scss" scoped>
    @import '../../common.scss';
    .card-footer {
        height: 49px;
        width: 100%;
        .card-footer-warp {
            position: fixed;
            bottom: 0;
            left: 0;
            height: 49px;
            width: 100%;
            background: white;
            border-top: 1px solid #F1F3F8;
            @extend .flex;
            .card-footer-tab {
                flex:1;
                text-align: center;
                &__icon {
                    font-size: 24px;
                    color: #BBBBBB;
                    line-height: 28px;
                    font-family:PingFangSC-Semibold;
                    margin-top: 4px;
                }
                &__text {
                    font-size:11px;
                    font-family:PingFangSC-Regular;
                    font-weight:400;
                    color:#BBBBBB;
                    line-height:16px;
                    margin-top: -2px;
                }
                &.on {
                    .card-footer-tab__icon,.card-footer-tab__text {
                        color: #4FC898; 
                    }
                   
                }
            }
        }
    }
</style>

