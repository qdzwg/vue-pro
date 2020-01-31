<template>
  <div class="info-item">
    <span class="info-title">积分抵扣</span>
    <div class="bonus-bar">
      <span>使用积分{{bonusDeductionData.bonus}}抵扣￥{{bonusDeductionData.price}}</span>
      <check v-model="checked"></check>
    </div>
  </div>
</template>
<script>
import check from "@/components/check";
export default {
  components: {
    check
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    bonusDeductionData: {
      type: Object,
      default: {}
    }
  },
  watch: {
    value(val) {
      this.checked = val;
    },
    checked(val) {
      this.$emit("input", val);
      this.$emit("useHandle", val);
    }
  },
  data() {
    return {
      checked: this.value,
    };
  }
};
</script>
<style lang="scss" scoped>
.bonus-bar {
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: auto;
}
.bonus-btn {
  outline: none;
  border: none;
  background: #f05b47;
  color: #fff;
  height: 24px;
  font-size: 12px;
  line-height: 24px;
  border-radius: 4px;
  margin-left: 10px;
  padding: 0 5px;
  &.used {
    background: rgba(240, 91, 71, 0.5);
  }
}
</style>