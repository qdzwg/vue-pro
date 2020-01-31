<template>
  <div class="numSpinner">
    <div
      class="pinner left"
      :class="{disabled:num<=min}"
      @click="changeNum('minus')"
    >
      -
    </div>
    <div class="pinner-input">
      <input
        type="number"
        pattern="[0-9]*"
        onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
        :value="num"
        @change="change"
        @blur="keyNum"
        @input="convertNum"
        :disabled="disabled"
      />
    </div>

    <div
      class="pinner right"
      :class="{disabled:num>=max}"
      @click="changeNum('add')"
    >
      +
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //   num: this.value,
      currentValue: this.value
    };
  },
  props: {
    value: {
      type: Number
    },
    max: {
      type: Number
    },
    min: {
      type: Number
    },
    disabled: {
      type: Boolean
    },
    precision: {
      type: Number
    },
    parser: {
      type: Function
    }
  },
  watch: {
    value: {
      handler(value) {
        // this.currentValue = this.value?this.value>this.max?this.max:this.value:0;
        this.currentValue = value
      },
      immediate: true
    },
    // value(val, oldVal) {
    //   this.currentValue = val;
    // },
    currentValue(val) {
      this.changeVal(val);
    }
  },
  computed: {
    num() {
      if (this.precisionValue !== null) {
        return this.precisionValue;
      } else {
        return this.precisionValue;
      }
    },
    precisionValue() {
      // can not display 1.0
      if (!this.currentValue) return this.currentValue;
      return this.precision
        ? this.currentValue.toFixed(this.precision)
        : this.currentValue;
    }
  },
  mounted() {
    this.changeVal(this.currentValue);
  },
  methods: {
    changeVal(val) {
      val = Number(val);
    },
    changeNum(mold) {
      switch (mold) {
        case "minus":
          if (
            typeof this.min !== "undefined" &&
            this.currentValue <= this.min
          ) {
            return false;
          } else {
            this.currentValue--;
          }
          break;
        case "add":
          if (
            typeof this.max !== "undefined" &&
            this.currentValue >= this.max
          ) {
          } else {
            this.currentValue++;
          }
          break;
      }
      //   this.$nextTick(() => {
      //     this.$emit("input", this.currentValue);
      //     this.$emit("on-change", this.currentValue);
      //   });
      this.setValue(this.currentValue);
    },
    keyNum() {
      if (typeof this.max !== "undefined" && this.currentValue > this.max) {
        this.currentValue = this.max;
      }
      if (typeof this.min !== "undefined" && this.currentValue < this.min) {
        this.currentValue = this.min;
      }
      if (this.currentValue == null) {
        this.currentValue = this.min;
      }
      this.setValue(this.currentValue);
    },
    convertNum(event) {
      if (
        event.data !== "-" &&
        isNaN(event.data) &&
        (event.data !== "." && isNaN(event.data))
      ) {
        this.currentValue = this.value;
      }else{
        //   this.currentValue=this.min
      }
       
    },
    change(event) {
      if (event.type == "change" && this.activeChange) return;

      if (event.type == "input" && !this.activeChange) return;
      let val = event.target.value.trim();
      if (this.parser) {
        val = this.parser(val);
      }

      const isEmptyString = val.length === 0;
      if (isEmptyString) {
        this.setValue(null);
        return;
      }
      if (event.type == "input" && val.match(/^\-?\.?$|\.$/)) return; // prevent fire early if decimal. If no more input the change event will fire later

      val = Number(val);

      if (!isNaN(val)) {
        this.currentValue = val;
        this.setValue(val);
      } else {
        event.target.value = this.currentValue;
      }
    },
    setValue(val) {
      // 如果 step 是小数，且没有设置 precision，是有问题的
      if (val && !isNaN(this.precision))
        val = Number(Number(val).toFixed(this.precision));

      const { min, max } = this;
      if (val !== null) {
        if (val > max) {
          val = max;
        } else if (val < min) {
          val = min;
        }
      }

      this.$nextTick(() => {
        this.currentValue = val;
        this.$emit("input", val);
        this.$emit("on-change", val);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.numSpinner {
  user-select: none;
  text-align: center;
  overflow: hidden;
  color: #413838;
  display: flex;
  align-items: center;
  font-size: 0;
  .pinner-input {
    display: flex;
    align-items: center;
    height: 31px;
    width: 40px;
    box-sizing: border-box;
    border: 1px solid #f05b47;
    input {
      // height:34px;
      width: 100%;
      border: none;
      outline-style: none;
      text-align: center;
      font-size: 16px;
      
    }
  }
  .pinner {
    width: 40px;
    box-sizing: border-box;
    height: 31px;
    line-height: 31px;
    cursor: pointer;
    display: inline-block;
    border: 1px solid #f05b47;
    vertical-align: middle;
    font-size: 22px;
    color: #f05b47;
  }
  .disabled {
    // cursor: no-drop;
    // background-color: #f3f7fa !important;
    border-color: #ffc9c9;
    color: #ffc9c9;
  }
  .left {
    border-right: none;
    border-bottom-left-radius: 4px;
    border-top-left-radius: 4px;
  }
  .right {
    border-left: none;
    border-bottom-right-radius: 4px;
    border-top-right-radius: 4px;
  }
}
</style>


