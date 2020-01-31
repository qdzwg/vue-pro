<template>
  <div>
    <title-list
      @indexChange="change"
      :detailIndex="detailIndex"
      titleType="strategyGroup"
      :list="data.list"
      :class="{'m-b-10':detailIndex!=activeIndex}"
    ></title-list>
    <strategy-content
      :data="data"
      :showIndex="activeIndex"
      :detailIndex="detailIndex"
      :menuType="data.menuType"
      :listType="data.listType"
      :list="data.list"
    >
      <detail ref="detail" :data="detailData">
        <!-- <pre-next
          ref="preNext"
          @detailIdchange="idChange"
          :data="data.list[detailIndex]"
          :detailId="detailId"
        ></pre-next> -->
      </detail>
    </strategy-content>
  </div>
</template>

<script>
import strategyContent from "@/components/custompage/customComponent/module/strategyContent";
import titleList from "./titleList";
import detail from "./detail";
import preNext from "./preNext";
export default {
  props: {
    detailData: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    titleList,
    // strategyMenu,
    strategyContent,
    detail,
    preNext
  },
  data() {
    return {
      detailId: this.$route.query.id,
      data: {},
      detailIndex: 0,
      activeIndex: 0 //那个分组展示详情信息
    };
  },
  watch: {},
  computed: {},
  created() {
    this.getLocalStorageData();
  },
  methods: {
    idChange(id) {
      this.$emit("stragegyIdChange", id);
    },
    setObj(obj) {
      this.detailIndex = obj.detailIndex ? obj.detailIndex : 0;
      this.detailId = obj.id;
    },
    getLocalStorageData() {
      let data = JSON.parse(
        localStorage.getItem("xj_czc_strategy_detail_data_20191017")
      );
      this.detailIndex = this.$route.query.detailIndex;
      this.activeIndex = this.$route.query.detailIndex;
      this.data = data;
    },
    change(index) {
      this.activeIndex = index;
    }
  }
};
</script>
