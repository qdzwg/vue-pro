<template>
  <div class="page-box">
    <!-- <top-header v-if="show" :isBack="false" :title="pageTitle?pageTitle:'首页'"></top-header> -->
    <!-- 新自定义 -->
    <custompage
      v-if="comList.length"
      :comList="comList"
      :customBackgroundColor="customBackgroundColor"
      :pageBackFlag="pageBackFlag"
    />
    <pre-custompage v-if="preComList.length" :comList="preComList"></pre-custompage>
    <fixed-template @getData="getFixData" v-if="templateCode" :templateCode="templateCode"></fixed-template>
  </div>
</template>
<script>
// import topHeader from "@/components/header";
// import footerBottom from "@/components/footer";
import custompage from "@/components/custompage";
import preCustompage from "@/components/preCustompage";
import fixedTemplate from "@/components/fixedTemplate";
import { wxShare } from "@/common/wxshare";
import { formatterData } from "@/common/utils";
export default {
  data() {
    return {
      error: "",
      show: false,
      pageTitle: "",
      templateCode: "", //固定模板code
      comList: [],
      customBackgroundColor: "",
      preComList: [],
      newCustomFooteerData: {}
    };
  },
  components: {
    // topHeader,
    // footerBottom,
    custompage,
    preCustompage,
    fixedTemplate
  },
  created() {
    // alert(22222)
    this.getAxios(this.api.aiPapi.getUsePage, {
      pageType: "mianPage",
      useRange: "wap"
    }).then(
      res => {
        if (
          res.data &&
          res.data.content &&
          JSON.parse(res.data.content).length
        ) {
          //判断最新的自定义有没有返回
          let comlist = JSON.parse(res.data.content);
          console.log('comlist',comlist)
          this.comList = formatterData(comlist);
          document.title = res.data.renovationPageName;
          // this.pageTitle = res.data.renovationPageName;
          this.show = true;
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

          this.$nextTick(() => {
            // 页面滚动
            let scrollHeight = window.localStorage.getItem(
              "home_scroll_top_" + this.$route.query.m_id
            );
            if (scrollHeight) {
              setTimeout(() => {
                window.scrollTo(0, scrollHeight);
              }, 200);
            }
          });
        } else {
          //老本自定义页面
          let oldurl = this.api.aiPapi.oldTemplatePage;
          this.getAxios(oldurl).then(res => {
            if (res.data && res.data.version == "new") {
              //老版本自定义页面
              this.preComList = JSON.parse(res.data.templateVO.template);
              document.title = res.data.templateVO.name
                ? res.data.templateVO.name
                : "";
              // this.pageTitle = res.data.templateVO.name?res.data.templateVO.name:'';
              // console.log(this.preComList);
              let sharImg = "";
              this.preComList.forEach((item, index) => {
                if (
                  (item.type == "Banner__swiper1" ||
                    item.type == "Bill__normal") &&
                  !sharImg
                ) {
                  sharImg = item.data[0].picAddr;
                }
              });
              wxShare({
                title:
                  res.data && res.data.templateVO && res.data.templateVO.name
                    ? res.data.templateVO.name
                    : "",
                desc: "",
                imgUrl: sharImg ? sharImg : ""
              });
            } else if (res.data && res.data.version == "old") {
              //固定模板
              document.title = "首页";
              this.templateCode =
                res.data.templateVO && res.data.templateVO.code
                  ? res.data.templateVO.code
                  : "";
            }
            this.show = true;
            this.$nextTick(() => {
              // 页面滚动
              let scrollHeight = window.localStorage.getItem(
                "home_scroll_top_" + this.$route.query.m_id
              );
              if (scrollHeight) {
                setTimeout(() => {
                  window.scrollTo(0, scrollHeight);
                }, 200);
              }
            });
          });
        }
      },
      res => {
        alert("page" + JSON.stringify(res));
      }
    );
  },
  mounted() {
    this.$nextTick(() => {
      // 监听页面滚动
      window.addEventListener("scroll", () => {
        let documentScrollHeight =
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          window.pageYOffset;
        window.localStorage.setItem(
          "home_scroll_top_" + this.$route.query.m_id,
          documentScrollHeight
        );
      });
      let scrollHeight = window.localStorage.getItem(
        "home_scroll_top_" + this.$route.query.m_id
      );
      if (scrollHeight) {
        window.scrollTo(0, scrollHeight);
      }
    });
  },
  methods: {
    getFixData(data) {
      // console.log(data);
      let sharImg =
        data.mainPageFix && data.mainPageFix.length
          ? data.mainPageFix[0].picAddr
          : data.mainPageTop && data.mainPageTop.length
          ? data.mainPageTop[0].picAddr
          : "";
      wxShare({
        title: "首页",
        desc: "",
        imgUrl: sharImg ? sharImg : ""
      });
    }
  }
};
</script>

<style lang='scss' scoped>
</style>

