<template>
    <div class="richtext" v-bind:style="{backgroundColor:pageData.backgroundColor}">
      <div v-html="pageData.content">{{pageData.content}}</div>
        <!-- <wxParse :imageProp='config' :content="pageData.content" @preview="preview" @navigate="navigate" /> -->
    </div>
</template>
<script>
// import wxParse from "mpvue-wxparse";
export default {
  // components: {
  //   wxParse
  // },
  props: {
    pageData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      article: "<div>我是富文本</div>",
      config: {
        mode: "widthFix"
      }
    };
  },
  watch: {
    pageData: function(val) {
      this.article = val;
    }
  },
  created() {
    // console.log("showzzz");
  },
  methods: {
    preview(src, e) {
      // do something
    },
    navigate(href, e) {
      // do something
    }
  }
};
</script>

<style lang='scss'>
.richtext {
  padding:5px 5px;
  font-size:14px;
  background-color: #fff;
  img {
    width: 100% !important;
    height: auto !important;
  }
  em{
    font-style: italic
  }
   strong {
    font-weight: bold
   }
}
</style>
