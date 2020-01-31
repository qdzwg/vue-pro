<template>
  <div class="theater-show-content">
    <div class="theater-content-box">
      <div class="theater-list">
        <div>演出名称：{{sessionInfo.sessionName}}</div>
        <div>演出场所：{{sessionInfo.theaterName}}</div>
        <div>演出时间：{{sessionInfo.playDate}}</div>
        <div>演出场次：{{sessionInfo.startTime}}</div>
      </div>
      <div class="theater-img" @click="imgShow=true">
        <div><i class="xx-icon icon-zuoweiyuyue"></i></div>
        <div>座位分布图</div>
      </div>
    </div>
    <div class="linearGradient"></div>
    <div class="theater-model-list">
      <div class="theater-model-item" v-for="(item,index) in sessionInfo.canSales.canSale" :class='{"theater-model-item1":index,"theater-model-sel":item.select}' @click='selectItem(item,index)' :key="index">{{item.areaName}}</div>
    </div>
    <div class="bottom-warpper">
        <div class="home-page"></div>
        <div>
          <button type="button" class="order" @click='goOrder' :class='{active:selected}'>请选择座位</button>
        </div>
    </div>
    <popup v-model="imgShow">
        <div class="imgShow-body">
            <img :src="sessionInfo.linkImg" alt="">
        </div>
    </popup>
  </div>
</template>
<script>
import { Popup } from "vux";
export default {
  data() {
    return {
      imgShow: false,
      sessionInfo: {},
      itemData: []
    };
  },
  components: {
    Popup,
  },
  created() {
    document.title = "区域信息";
    this.sessionInfo = JSON.parse(localStorage.getItem("theater"));
    this.itemData = this.sessionInfo.canSales.canSale;
    this.getAxios("/merchant/api/theater/merchantTheaterShow", {
      id: this.$route.query.id,
      merchantParkInfoId: this.$route.query.merchantParkInfoId
    }).then(res => {
      this.sessionInfo.saleCorpCode = res.data.saleCorpcode
    });
    
  },
  computed: {
    selected() {
      for (let index = 0; index < this.itemData.length; index++) {
        const element = this.itemData[index];
        if(element.select){
          return true
        }
      }
      return false
    }
  },
  methods: {
    goOrder() {
      if(!this.selected){
        return
      }
      let canSale;
      this.sessionInfo.canSales.canSale.map(item=>{
        if(item.select){
          canSale = item;
        }
      })
      this.sessionInfo.areaCode = canSale.areaCode;
      localStorage.setItem("theater", JSON.stringify(this.sessionInfo));
      localStorage.setItem("canSale", JSON.stringify(canSale));
      this.$router.push({path: "/detail/theaterSelect", query: this.$route.query});
    },
    selectItem(item,index) {
      this.itemData.map(item=>{
        item.select = false;
      })
      item.select = true;
      this.$set(this.itemData,index,item);
    },
  }
};
</script>
<style lang="scss">
@import "../../../../assets/styles/mixin.scss";
.theater-show-content {
  padding-bottom: 52px;
  .theater-content-box {
    background-color: #fff;
    @include fbc;
    .theater-list {
      @include sc(14px, #413838);
      padding: 14px;
      div {
        margin-top: 6px;
      }
    }
    .theater-img {
      @include fbc;
      flex-direction: column;
      text-align: center;
    }
  }
  .linearGradient {
    background-image: linear-gradient(to bottom,#f2f2f2,#fff);
    height: 20px;
  }
  .theater-model-list {
    background-color: #fff;
    @include sc(14px, #413838);
    line-height: 41px;
    .theater-model-item {
      text-align: center;
      padding: 8px 5%;
    }
    .theater-model-item1 {
      border-top: 1px solid #eaeaea;
    }
    .theater-model-sel {
      background-color: #f05b47;
      color: #fff;
    }
  }
  .bottom-warpper {
    position: fixed;
    bottom: 0px;
    right: 0px;
    left: 0px;
    @include fbc;
    background: #fff;
    .order {
      border: none;
      outline: none;
      background: #f05b47;
      opacity: .4;
      @include sc(16px, #fff);
      text-align: center;
      height: 49px;
      line-height: 49px;
      width: 172px;
    }
    .active {
      opacity: 1;
      background: #f05b47;
    }
  }
  .imgShow-body {
    img {
      width: 100%;
    }
  }
}
</style>


