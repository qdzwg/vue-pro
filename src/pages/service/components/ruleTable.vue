<template>
  <info-bar v-if="tableData.length||quantuiTime>0||ruleCancel" title="取消及退款政策">
    <rule :quantuiTime="quantuiTime" :quantuiType="quantuiType" :ruleCancel="ruleCancel" :tableData="tableData"></rule>
  </info-bar>
</template>
<script>
import infoBar from "./infoBar";
import rule from "./rule";
export default {
  components: {
    infoBar,
    rule
  },
  props: {
    quantuiTime: {
      type: String | String
    },
    quantuiType: {
      type: String
    },
    ruleCancel:{
        type: Object
    },
    tableData: {
      type: Array,
      default: () => []
    }
  }
};
</script>
