<template>
  <info-bar title="入住须知">
    <p>
      <span>• 入离时间：</span>
      <span class="timeText">{{detailData.checkInTime}}</span> 以后入住，
      <span class="timeText">{{detailData.checkOutTime}}</span> 以前退房
    </p>
    <p v-if="detailData.ifPet!=''">
      <span>• 宠物携带：</span>
      {{detailData.ifPet=='T'?'允许宠物携带':'不允许宠物携带'}}
    </p>
    <div class="clearfix" v-for="ele in detailData.checkInJson" :key="ele.name">
      <div class="fl" v-if="ele.value">• {{ele.key}}：</div>
      <div v-if="ele.value" style="margin-left: 82px;">{{ele.value}}</div>
    </div>
  </info-bar>
</template>
<script>
import infoBar from "./infoBar";
export default {
  components: {
    infoBar
  },
  props: {
    pageData: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    pageData: {
      handler(val) {
        this.detailData = val;
      },
      deep: true
    }
  },
  data() {
    return {
      detailData: {}
    };
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/styles/mixin.scss";
 .timeText {
      color: #1ec08a;
      font-weight: bold;
    }
</style>