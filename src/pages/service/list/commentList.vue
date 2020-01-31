<template>
  <div>
    <comment ref="comment" loadNum="all"
             :param="commentParam"
             :url="commentUrl"></comment>
  </div>
</template>
<script>
import comment from "@/components/comment";
export default {
  data () {
    return {
      commentUrl: "",
      commentParam: {
        wayType: "",
        productType: "",
        id: "",
        leaguerId:""
      }
    }
  },
  watch:{
    '$route.params.id'(){
      this.initList()
    }
  },
  created(){
    this.initList()
  },
  methods:{
    initList(){
      this.commentUrl = this.api.main.comment.list;
      this.commentParam = {
        wayType: this.wayType,
        productType: this.$route.params.mold,
        id: this.$route.params.id,
        leaguerId:
          localStorage.getItem("xjsc_login_userId_2019_3_8") ||
          this.$cookie.get("leaguerInfoId")
      }
    }
  },
  components: {
    comment
  }
}
</script>
