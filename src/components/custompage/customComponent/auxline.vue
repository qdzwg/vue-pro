<template>
    <div class="auxline">
        <div style="border-width: 1px;" v-if="pageData.sideWidth=='type1'&&pageData.style=='solid'" class="line-item" v-bind:style="{borderColor:pageData.lineColor}"></div>
        <div style="border-width: 1px;" v-if="pageData.sideWidth=='type2'&&pageData.style=='solid'" class="line-item2" v-bind:style="{borderColor:pageData.lineColor}"></div>
        <div style="border-width: 1px;" v-if="pageData.sideWidth=='type1'&&pageData.style=='dashed'" class="line-item3" v-bind:style="{borderColor:pageData.lineColor}"></div>
        <div style="border-width: 1px;" v-if="pageData.sideWidth=='type2'&&pageData.style=='dashed'" class="line-item4" v-bind:style="{borderColor:pageData.lineColor}"></div>
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
  methods: {}
};
</script>
<style lang='scss'>
.auxline{
    width:100%;
    .line-item,.line-item2{
        width:100%;
         border-top:1px solid #999999;
    }
    .line-item2{
        width:95%;
        margin:0 auto;
    }
    .line-item3,.line-item4{
        width:100%;
       border-top:1px dashed #999999;
    }
    .line-item4{
        width:95%;
        margin:0 auto;
    }

}
</style>
