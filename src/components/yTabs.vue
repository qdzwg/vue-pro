<template>
  <div class="card-order-tabs card-home">
    <div class="card-home-tabs">
      <div
        v-for="(item,index) in list"
        :key="index"
        @click="tabsChange(item)"
        class="card-home-tabs-item"
        :class="{'selected': status === item.status}"
        >
        <p class="card-home-tabs-item__content">{{item.label}}</p>
        <span class="card-home-tabs-item__border"></span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    list: {
      type: Array,
      default: []
    },
    activeIndex: {
      type:Number,
      default:0
    }
  },
  data() {
    return {
      status: ""
    };
  },
  watch: {
    activeIndex(index){
      this.status = this.list[index].status
    }
  },
  created() {
    this.status = this.list[this.activeIndex].status
  },
  methods: {
    tabsChange(item) {
      this.status = item.status;
      this.$emit('select',item)
    }
  }
};
</script>
<style lang="scss" scope>
@import '../pages/parkCard/common.scss';
.card-order-tabs {
  .card-home {
    &-tabs {
      height: 87px;
      @extend .flex;
      align-items: center;
      justify-content: center;
      &-item {
        flex: 1;
        max-width: 130px;
        height: 28px;
        font-size: 20px;
        font-family: $font-r;
        font-weight: 400;
        color: #bbbbbb;
        line-height: 28px;
        text-align: center;
        &__border {
          display: block;
          width: 16px;
          height: 3px;
          border-radius: 2px;
          margin: 6px auto 0;
        }
        &.selected {
          font-size: 20px;
          font-family: $font-s;
          font-weight: 600;
          color: rgba(51, 51, 51, 1);
          .card-home-tabs-item__border {
            background: $color-main;
          }
        }
      }
    }
  }
}
</style>