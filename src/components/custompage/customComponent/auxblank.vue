<template>
    <div class="auxblank">
        <div class="blank-box" :style="{height:this.filter.px2rem(pageData.height),backgroundColor:pageData.backgroundColor}">
        </div>
    </div>
</template>
<script>
// import { getData } from "@/common/common";
export default {
  props: {
    pageData: {
      type: Object,
      default: {}
    }
  },
  methods: {}
};
</script>
<style lang='scss'>
.auxblank{
    width:100%;
    .blank-box{
        width:100%;
    }

}
</style>
