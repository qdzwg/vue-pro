<template>
  <label class="checkbox-box">
    <span class="checkbox-warper">
      <input class="checkbox-input" v-model="checked" type="checkbox" />
      <span class="checkbox-show"></span>
    </span>
    <slot></slot>
  </label>
</template>
<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    checked(val) {
      this.$emit("input", val);
    },
    value(val) {
      this.checked = val;
    }
  },
  data() {
    return {
      checked: this.value
    };
  }
};
</script>
<style lang="scss" scoped>
.checkbox-box {
  position: relative;
}

.checkbox-warper {
  display: inline-block;
  vertical-align: middle;
}
.checkbox-input {
  display: none;
}
.checkbox-input:checked + .checkbox-show {
  background: #f05b47;
  border-color: #f05b47;
}
.checkbox-input:checked + .checkbox-show::after {
  display: block;
}

.checkbox-show {
  display: inline-block;
  position: relative;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid #dddee1;
}

.checkbox-show::after {
  display: none;
  content: "";
  position: absolute;
  left: 4px;
  top: 4px;
  width: 10px;
  height: 5px;
  border-bottom: 1px solid #fff;
  border-left: 1px solid #fff;
  transform: rotate(-45deg);
}
</style>