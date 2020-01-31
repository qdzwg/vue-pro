<template>
  <div>
    <custompage
      v-if="comList.length"
      :comList="comList"
      :customBackgroundColor="customBackgroundColor"
      :pageBackFlag="pageBackFlag"
    />
  </div>
</template>
<script>
import custompage from "@/components/custompage";
import { wxShare } from "@/common/wxshare";
import { formatterData } from "@/common/utils";
export default {
  components: {
    custompage
  },
  data() {
    return {
      comList: [],
      customBackgroundColor: "",
      pageBackFlag: ""
    };
  },
  computed: {
    query() {
      return this.$route.query;
    }
  },
  watch: {
    query(val) {
      this.getPageData();
    }
  },
  created() {
    this.getPageData();
  },
  methods: {
    getPageData() {
      this.getAxios(this.api.aiPapi.getRenovationById, {
        id: this.$route.query.id
      }).then(res => {
        //判断最新的自定义有没有返回
        this.comList = formatterData(JSON.parse(res.data.content));
        document.title = res.data.renovationPageName;
        this.customBackgroundColor = res.data.renovationPageBack
          ? res.data.renovationPageBack
          : "";
        this.pageBackFlag = res.data.pageBackFlag;
        // console.log("this.comList1231331231", this.comList);
        let sharImg = "";
        let sharDesc = "";
        for (let i = 0; i < this.comList.length; i++) {
          let item = this.comList[i];
          if (item.category == "banner" && !sharImg) {
            //缓存第一个轮播图
            let imgUrl = item.data.list[0].picAddr;
          }
          if (item.category == "shopinfo" && !sharDesc) {
            sharDesc = item.data.introduction ? item.data.introduction : "";
          }
        }
        wxShare({
          title:
            res.data && res.data.renovationPageName
              ? res.data.renovationPageName
              : "",
          desc: sharDesc,
          imgUrl: sharImg
        });
      });
    }
  }
};
</script>