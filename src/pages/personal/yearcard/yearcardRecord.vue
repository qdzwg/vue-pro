<template>
    <div class="yearcardRecord">
        <div class='state-ul bg-w'>
            <div class="state-li" :class='{active:currentindex=="0"}' @click="select('all',0)">
                <div class="state-title">全部记录</div>
            </div>
            <div class="state-li" :class='{active:currentindex=="1"}' @click="select('success',1)">
                <div class="state-title">交易成功</div>
            </div>
            <div class="state-li" :class='{active:currentindex=="2"}' @click="select('failure',2)">
                <div class="state-title">交易失败</div>
            </div>
        </div>
        <swiper v-model="currentindex" ref="swiper" :show-dots="false" class="state-content" @on-index-change="switchTab">
            <swiper-item>
                <scroll :data="listData[0]" :pullup="pullup" @scrollToEnd="getBottom(0)" class="content-item">
                    <div class="item-ul" @click="gourl(item.payOrderNo)" v-for="(item,index) in listData[0] " :key="index">
                        <div class="item-li">交易流水号：{{item.orderNo}}</div>
                        <div class="item-li">交易时间：{{item.createTime}}</div>
                        <div class="item-li">交易金额：{{item.paySum}}</div>
                        <div v-if="item.payTypeCH" class="item-li">交易方式：{{item.payTypeCH}}</div>
                    </div>
                </scroll>
            </swiper-item>
            <swiper-item v-model="currentindex">
                <scroll :data="listData[1]" :pullup="pullup" @scrollToEnd="getBottom(1)" class="content-item">
                    <div class="item-ul" @click="gourl(item.payOrderNo)" v-for="(item,index) in listData[1] " :key="index">
                        <div class="item-li">交易流水号：{{item.orderNo}}</div>
                        <div class="item-li">交易时间：{{item.createTime}}</div>
                        <div class="item-li">交易金额：{{item.paySum}}</div>
                        <div v-if="item.payTypeCH" class="item-li">交易方式：{{item.payTypeCH}}</div>
                    </div>
                </scroll>
            </swiper-item>
            <swiper-item v-model="currentindex">
                <scroll :data="listData[2]" :pullup="pullup" @scrollToEnd="getBottom(2)" class="content-item">
                    <div class="item-ul" @click="gourl(item.payOrderNo)" v-for="(item,index) in listData[2] " :key="index">
                        <div class="item-li">交易流水号：{{item.orderNo}}</div>
                        <div class="item-li">交易时间：{{item.createTime}}</div>
                        <div class="item-li">交易金额：{{item.paySum}}</div>
                        <div v-if="item.payTypeCH" class="item-li">交易方式：{{item.payTypeCH}}</div>
                    </div>
                </scroll>
            </swiper-item>
        </swiper>
        <div class="uesr-btn" @click="back">返回</div>
    </div>
</template>

<script>
import { Swiper, SwiperItem } from "vux";
import scroll from "@/components/BScroll";
import { parse } from 'path';
export default {
  components: {
    Swiper,
    SwiperItem,
    scroll
  },
  data() {
    return {
      currentindex: 0,
      listData: [[], [], []],
      pullup: true,
      activestate:"all"
    };
  },
  created() {
       document.title = "交易记录";
      this.getList("all",0)
  },
  mounted(){
      this.$nextTick(() => {
      this.$refs.swiper.xheight = window.innerHeight - 39 + "px";
    });
  },
  methods: {
      gourl(num){
          this.$router.push('/recordDetail?payOrderNo='+num)
      },
    switchTab(i) {
      this.currentindex = i;
      if(i==0){
          this.activestate='all'
      }else if(i==1){
          this.activestate='success'
      }else if(i==2){
          this.activestate='failure'
      }
      if (!this.listData[i].length) {
        this.getList(this.activestate,this.currentindex)
      }
    },
    select(state,index) {
        this.activestate=state
        this.currentindex=index  
    },
    getBottom(i) {},
    getList(state,index){
        let url="/leaguer/api/yearCardOrder/selectOrderList"
        let data={
            cardId:this.$route.query.cardId,
            orderStatus: state 
        }
        this.getAxios(url,data).then(res=>{
            this.$set(
          this.listData,
          index,
          this.listData[index].concat(res.data)
        );
        })
    },
    back() {
      this.$router.back();
    }
  }
};
</script>

<style lang="scss">
.yearcardRecord {
  .state-ul {
    display: flex;
    justify-content: space-around;
    font-size: 15px;
    color: #5c5c5c;
    font-family: PingFangSC-Regular, sans-serif;
    background-color: #fff;
    .state-li {
      .state-title {
        padding: 10px 6px;
      }
    }
    .state-li.active {
      color: #f05b47;
      position: relative;
    }
    .state-li.active::after {
      content: "";
      display: block;
      height: 2px;
      width: 100%;
      background: #f05b47;
      position: absolute;
      bottom: 0;
      border-radius: 1px;
    }
  }
  .state-content{
      padding-bottom:69px;
      .content-item{
          height: 100%;
         .item-ul{
             background-color: #fff;
             padding:10px 20px;
             font-size:15px;
             margin:10px 0;
             color:#5c5c5c;
             .item-li{
                 line-height: 30px;
             }
         }
          
      }
  }
  .uesr-btn {
    width: 100%;
    height: 49px;
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: #009ded;
    color: #fff;
    text-align: center;
    line-height: 49px;
    font-size: 16px;
  }
}
</style>


