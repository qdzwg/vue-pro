<template>
    <div class="custext" v-bind:style="{fontSize:pageData.fontSize,color:pageData.textColor,textAlign:pageData.position,backgroundColor:pageData.backgroundColor}">
        <div class="custext-box" @click='gotoTarget(pageData)'>
            {{pageData.content}}
        </div>
    </div>
</template>
<script>
export default {
  props: {
    pageData: {
      type: Object,
      default: {}
    }
  },
  methods: {
  }
};
</script>
<style lang='scss'>
.custext {
  width: 100%;
  .custext-box {
    width: calc(100% - 10px);
    height:auto;
    line-height: 1.35;
    padding: 5px 5px;
    word-wrap: break-word;
    word-break: normal;
  }
}
</style>
