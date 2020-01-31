<template>
  <div class="strategy-details">
    <!-- 店铺设置-顶部导航 -->
    <top-navigation :pageData="topNav"></top-navigation>
    <div class="head-bar">
      <div class="bottom-cover"></div>
      <template v-if="detailData.vedioAddr">
        <player :videoSrc="detailData.vedioAddr"></player>
      </template>
      <template v-else>
        <img class="strategy-img"
             v-if="detailData.picAddr"
             :src="detailData.picAddr"
             alt />
      </template>
    </div>

    <strategyDetailGroup ref="strategyDetailGroup"
                         :detailData="detailData"
                         @stragegyIdChange="stragegyIdChange"
                         v-if="detailType=='strategyGroup'"></strategyDetailGroup>
    <strategyDetail :detailData="detailData"
                    v-if="detailType=='strategy'"></strategyDetail>
    <listDetail :detailData="detailData"
                v-if="detailType=='list'"></listDetail>
    <!-- <float-nav :bindPromoterFlag.sync="bindPromoter"></float-nav> -->
    <!-- 店铺设置-底部备案 -->
    <bottom-info :pageData="botInfo"></bottom-info>
  </div>
</template>

<script>
// import floatNav from "@/components/floatNav";
import strategyDetail from "./strategy/strategyDetail"
import strategyDetailGroup from "./strategy/strategyDetailGroup"
import bottomInfo from "@/components/custompage/customComponent/bottomInfo"
import topNavigation from "@/components/custompage/customComponent/topNavigation"
import listDetail from "./strategy/listDetail"
import player from "./strategy/video"

export default {
  name: "stargegy-detail",
  components: {

    player,
    // floatNav,
    strategyDetail,
    strategyDetailGroup,
    topNavigation, // 顶部导航
    bottomInfo, // 底部备案
    listDetail,
  },
  data() {
    return {
      topNav: {
        hidden: true,
        range: [],
        imgUrl: "",
        borderColor: "#dcdcdc",
        backgroundColor: "#ffffff",
        right: {
          type: "picture",
          text: "",
          imgUrl: "",
          customLinkObj: {},
          data: [],
        },
        left: {
          type: "menu",
          text: "",
          text: "",
          customLinkObj: {},
          data: [],
        },
      },
      botInfo: {
        hidden: true,
        range: [],
        imgUrl: "",
        address: "",
        info: "",
        logo: "",
        linkBackgroundColor: "#ffffff",
        backgroundColor: "#ffffff",
        lineNum: "4",
        linkList: [
          {
            text: "",
            customLinkObj: {},
            backgroundColor: "#fff",
          },
        ],
        codeList: [
          {
            name: "",
            imgUrl: "",
          },
        ],
      },
      detailData: {},
      detailType: "list",
      bindPromoter: false,
      show: false,
      raidersTitle: "",
      raidersContent: "",
      nodes: [
        {
          name: "div",
          attrs: {
            class: "div_class",
            style: "line-height: 60px; color: red;",
          },
          children: [
            {
              type: "text",
              text: "Hello&nbsp;World!",
            },
          ],
        },
      ],
    }
  },
  methods: {
    stragegyIdChange (id) {
      this.getDetailData(id);
    },
    getDetailData (id) {
      this.getAxios(
        "/merchant/api/merchantStrategy/getMerchantStrategyByIdNew",
        {
          merchantStrategyId: id
        }
      ).then(res => {
        this.detailData = res.data;
      });
    }
  },
  mounted () {
    if (this.detailType == "strategyGroup") {
      this.$on("on-strategy-detail-id-change", obj => {
        this.$refs.strategyDetailGroup.setObj(obj)
        this.getDetailData(obj.id)
        return false
      })
    }
  },
  created() {
    document.title = "详情";
    this.detailType = this.$route.query.source ? this.$route.query.source : "list"
    this.getDetailData(this.$route.query.id)
    this.getAxios(this.api.aiPapi.getUsePage, {
      pageType: "bottomFilingPage",
      useRange: "wap",
    }).then(res => {
      if (res.data && res.data.content) {
        this.botInfo = JSON.parse(res.data.content)
      }
    })
    this.getAxios(this.api.aiPapi.getUsePage, {
      pageType: "topNavigationPage",
      useRange: "wap"
    }).then(res => {
      if (res.data && res.data.content) {
        let topNav = JSON.parse(res.data.content);
        function addShow (item) {
          if (item.children && item.children.length) {
            item.children.map(ite => {
              ite.show = false;
              ite.select = false;
              addShow(ite)
            })
          }
        }
        if (topNav.left.type === "menu") {
          topNav.left.data.map(item => {
            item.show = false;
            item.select = false;
            addShow(item);
          });
        }
        if (topNav.right.type === "menu") {
          topNav.right.data.map(item => {
            item.show = false;
            item.select = false;
            addShow(item);
          });
        }
        this.topNav = topNav
      }
    })
  },
  watch: {
    // route(val) {
    //   this.getDetailData();
    // }
  },
  computed: {
    // route() {
    //   return this.$route;
    // }
  },
}
</script>

<style lang="scss" scoped>
.strategy-details {
  .head-bar {
    position: relative;
    .bottom-cover {
      background: #ffffff;
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 10px;
      z-index: 999;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }
  }
  .strategy-img {
    display: block;
    height: 175px;
    width: 100%;
  }
}
</style>
