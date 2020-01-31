<template>
  <popup v-model="hotelDetailShow" class="hotelDetail-modal" position="right" width="100%" :show-mask="false" :should-scroll-top-on-show="true">
    <div class="hotelDetail-top">
      <div class="hotelDetail-top-title">
        <span>{{detailData.name}}</span>
      </div>
      <div class="hotelDetail-top-content">
        <span>{{detailData.hotelTypeStr}} |</span>
        <span>{{detailData.trimTime}}年装修 |</span>
        <span>{{detailData.openTime}}年开业</span>
      </div>
      <div class="hotel-phone" v-if="detailData.isShow=='F'">
        <a
          style="color:#0086F6;"
          :href="'tel:'+detailData.linkTel"
         
        >酒店电话 {{detailData.linkTel}}</a>
        <!-- <span v-else>酒店电话 {{detailData.linkTel}}</span> -->
      </div>
    </div>
    <div class="hotelDetail-con">
      <div class="hotelDetail-con-title">设施与服务</div>
      <!-- 酒店设施 -->
      <wrapper title="酒店设施">
        <div class="list" :style="{'height':detailData.facilitys&&detailData.facilitys.length<9?Math.ceil(detailData.facilitys.length/3)*40+'px':hotelServiceShow?'auto':'110px'}">
          <div v-show="!hotelServiceShow?index<9:index<detailData.facilitys.length" class="list-item" v-for="(item,index) in detailData.facilitys" :key="index">
            <i class="xx-icon icon-gou2 icon-facility"></i>
            <span>{{item.name}}</span>
          </div>
        </div>
      </wrapper>
      <!-- <template v-if='detailData.services&&detailData.services.length'> -->
        <!-- 酒店服务 -->
        <wrapper v-show="hotelServiceShow" title="酒店服务">
          <div class="list">
            <div class="list-item" v-for="(el,i) in detailData.services" :key="i">
              <i class="xx-icon icon-gou2 icon-facility"></i>
              <span>{{el.name}}</span>
            </div>
          </div>
        </wrapper>
        
      <!-- </template> -->
      <div class="hotel-service-all" @click="hotelServiceShow=!hotelServiceShow">
          <span>{{hotelServiceShow?'收起':'查看全部设置'}}</span>
          <div
            style="display:inline-block;"
            :class="hotelServiceShow?'icon-service-down':'icon-service-up'"
          >
            <i class="xx-icon icon-xiangxiajiantou" style="font-size:12px;color:#0086f6;"></i>
          </div>
        </div>
    </div>
    <!-- 预定说明 -->
    <checkin-info :pageData="detailData"></checkin-info>
    
    <div class="hotelDetail-con" style="padding-bottom:45px;">
      <div class="hotelDetail-con-title">酒店图文介绍</div>
      <div class="hotel-detail-box">
        <div v-html="detailData.summary"></div>
      </div>
    </div>
    <div class="hotelDetail-bottom" @click="lookHotelType">
      <p class="hotelDetail-bottom-text">
        <i class="xx-icon icon-icon-hotel"></i>
        <span>查看房型</span>
      </p>
    </div>
  </popup>
</template>
<script>
import { Popup } from "vux";
import wrapper from "../../components/wrapper";
import checkinInfo from "../../components/checkinInfo";
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Popup,
    wrapper,
    checkinInfo
  },
  watch: {
    data(val) {
      this.detailData = val;
    },
    value(val) {
      this.hotelDetailShow = this.value;
    },
    hotelDetailShow(val) {
      this.$emit("input", val);
    }
  },
  data() {
    return {
      hotelServiceShow: false,
      detailData: {},
      hotelDetailShow: this.value
    };
  },
  methods: {
    lookHotelType() {
      this.hotelDetailShow = false;
      this.$emit("close")
       window.history.back();
      // this.$nextTick(() => {
      //   document.getElementById("hotelType-cotent").scrollIntoView();
      // });
    }
  }
};
</script>
<style lang="scss">
</style>