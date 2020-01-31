<template>
  <div class="list-warper-pmshotel">
    <four-month @getDate="select" ref="calendar"></four-month>
    <div class="hotel-date">
      <div class="hotel-item" @click="showCalendar">
        <div class="date-box">
          <span>住</span>
          <span class="date-text">{{beginDate.substring(5)}}</span>
        </div>
        <div class="date-box">
          <span>离</span>
          <span class="date-text">{{endDate.substring(5)}}</span>
        </div>
      </div>
      <div class="hotel-line"></div>
      <div class="search-warper">
        <input
          v-model="searchword"
          class="search-input"
          placeholder="搜索"
          type="text"
          @keyup.enter="search"
        />
        <i @click="search" class="xx-icon icon-chaxun1 search-icon"></i>
      </div>
    </div>

    <div class="hotel-filter" v-if="sortShow">
      <div
        class="hotel-filter-item clearfix"
        @click="sortFilter"
        :style="{color:sortFilterShow?'#0086F6':'#413838'}"
      >
        <span class="hotel-text fl">{{sortName}}</span>
        <i
          class="xx-icon icon-header-tab-b icon-filter fl"
          :class="sortFilterShow?'icon-header-tab-t':'filter-icon'"
          :style="{color:sortFilterShow?'#0086F6':'#413838'}"
        ></i>
      </div>
      <div
        class="hotel-filter-item clearfix"
        @click="hotelFilter"
        :style="{color:showFilter?'#0086F6':'#413838'}"
      >
        <span class="hotel-text fl">{{hotelTypeName==''?'酒店类型':hotelTypeName}}</span>
        <i
          class="xx-icon icon-header-tab-b icon-filter fl"
          :class="showFilter?'icon-header-tab-t':'filter-icon'"
          :style="{color:showFilter?'#0086F6':'#413838'}"
        ></i>
      </div>
      <div
        class="hotel-filter-item clearfix"
        @click="hotelFilter"
        :style="{color:showFilter?'#0086F6':'#413838'}"
      >
        <span class="hotel-text fl">{{hotelLeaveName==''?'酒店星级':hotelLeaveName}}</span>
        <i
          class="xx-icon icon-header-tab-b icon-filter fl"
          :class="showFilter?'icon-header-tab-t':'filter-icon'"
          :style="{color:showFilter?'#0086F6':'#413838'}"
        ></i>
      </div>
    </div>
    <div class="showFilter" v-if="sortFilterShow">
      <group class="sortRadio" style="margin-top:-1.94647059em;">
        <radio
          style="font-size:14px;color:#413838;"
          :options="sortList"
          :value="sortType"
          :selected-label-style="{color:'#0086F6',fontSize:'14px'}"
          @on-change="sortTypeChange"
        >
          <!-- <template slot-scope="props" slot="each-item" :selected-label-style="{color:'#0086F6',fontSize:'14px'}">
          <p style="font-size:14px;padding:7.5px 5px;">
            {{ props.label }}
          </p>
          </template>-->
        </radio>
      </group>
    </div>
    <div class="showFilter" v-if="showFilter">
      <div class="maskFilter">
        <div class="hotelType">
          <div class="hotelType-title">酒店类型</div>
          <div class="hotelType-item">
            <checker
              v-model="hotelTypeList"
              type="checkbox"
              default-item-class="demo1-item"
              selected-item-class="demo1-item-selected"
            >
              <checker-item
                @on-item-click="selectType"
                v-for="item in hotelType"
                :value="item.value"
                :key="item.value"
                style="position:relative;"
              >
                {{ item.label }}
                <!-- <img
                  class="img-selected"
                  src="./../../../assets/images/icon-hotel.png"
                  alt=""
                  style="display:none;width:17px;height:14px;position:absolute;bottom:0;right:0;"
                >-->
              </checker-item>
            </checker>
          </div>
        </div>
        <div class="hotelType">
          <div class="hotelType-title">酒店星级</div>
          <div class="hotelType-item">
            <checker
              v-model="hotelLeaveList"
              type="checkbox"
              default-item-class="demo1-item"
              selected-item-class="demo1-item-selected"
            >
              <checker-item
                @on-item-click="selectLeave"
                v-for="item in hotelLeave"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</checker-item>
            </checker>
          </div>
        </div>
        <div class="filter-handle">
          <div class="handle-btn" @click="outFilter">重置</div>
          <div class="handle-btn btn-sub" @click="hideFilter">确认</div>
        </div>
      </div>
    </div>
    <!-- <div class="coupon-receive">
      <img src="./../../../assets/images/coupon.png" alt />
    </div>-->
    <mescroll-vue
      ref="mescroll"
      :down="mescrollDown"
      :up="mescrollUp"
      @init="mescrollInit"
      class="scrollView"
      :class="{'footer-waprper':footerShow,'sore-top':!sortShow}"
    >
      <div class="good-list">
        <template v-if="bigGoodImg">
          <div
            @click="godetail(item)"
            class="big-good-item"
            v-for="(item,index) in dataList"
            :key="index"
          >
            <div class="big-img">
              <img v-if="item.fullFlag&&item.fullFlag=='T'" class="full-img" :src="fullImg" alt />
              <div class="big-img-item">
                   <img :class="{'gray':item.fullFlag&&item.fullFlag=='T'}" :src="item.hotelImg + '?imageMogr2/thumbnail/640x/strip/quality/100'" alt />
              </div>
             
              <div class="score" v-if="scoreShow">
                <span style="font-size:17px;font-weight: Bold;">{{item.score}}</span>
                <span style="font-size:12px;">分</span>
              </div>
            </div>
            <div class="big-good-content">
              <div class="big-good-title">
                <span class="title-name" style="font-weight: Bold;">{{item.name}}</span>
                <span class="star-hotel">{{item.hotelTypeStr}}</span>
              </div>
              <div class="scenic-distance" v-if="item.tag">
                <span class="scenic-left"  :class="{'scenic-color':item.fullFlag&&item.fullFlag=='T'}">{{item.tag?item.tag[0].name:''}}</span>
                <span class="scenic-center"  :class="{'scenic-color':item.fullFlag&&item.fullFlag=='T'}">{{item.tag?item.tag[1].name:''}}</span>
                <span class="scenic-right"  :class="{'scenic-color':item.fullFlag&&item.fullFlag=='T'}">{{item.tag?item.tag[2].name:''}}</span>
              </div>
              <div class="price-num" :class="{'price-color':item.fullFlag&&item.fullFlag=='T'}">
                <span class="unit">￥</span>
                <span class="price">{{item.showSales}}</span>
                <span style="color:#777777;font-size: 12px;">起</span>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div
            @click="godetail(item)"
            v-for="(item,index) in dataList"
            :key="index"
            class="good-item clearfix"
          >
            <img v-if="item.fullFlag&&item.fullFlag=='T'" class="full-img" :src="fullImg" alt />
            <div class="fl good-img">
              <img :class="{'gray':item.fullFlag&&item.fullFlag=='T'}" :src="item.hotelImg + '?imageMogr2/thumbnail/640x/strip/quality/100'" alt />
            </div>

            <div class="good-detail">
              <div class="good-title">
                <span class="title-name" style="font-weight: Bold;">{{item.name}}</span>
                <span class="star-hotel">{{item.hotelTypeStr}}</span>
              </div>
              <div class="hotel-address">
                <span>距你{{item.range}}千米</span>
                <span v-if="item.areaName">• {{item.areaName.split('-')[2]}}</span>
              </div>
              <div class="scenic-distance" v-if="item.tag">
                <span class="scenic-left" :class="{'scenic-color':item.fullFlag&&item.fullFlag=='T'}">{{item.tag?item.tag[0].name:''}}</span>
                <span class="scenic-center" :class="{'scenic-color':item.fullFlag&&item.fullFlag=='T'}">{{item.tag?item.tag[1].name:''}}</span>
                <span class="scenic-right" :class="{'scenic-color':item.fullFlag&&item.fullFlag=='T'}">{{item.tag?item.tag[2].name:''}}</span>
              </div>
              <div class="good-sell">
                <div class="buy-box" :class="{'buy-color':item.fullFlag&&item.fullFlag=='T'}">
                  <span v-if="scoreShow" style="font-size:17px;font-weight: Bold;">{{item.score}}</span>
                  <span v-if="scoreShow" style="font-size:12px;">分</span>
                  <span
                  v-if="scoreShow"
                    style="font-weight: Bold;"
                  >{{+item.score>=4.6?'非常好':(+item.score<4.6&&+item.score>=4.1)?'很好':(+item.score<4.1&&+item.score>=3.6)?'好':(+item.score<3.6&&+item.score>=3.1)?'不错':'一般'}}</span>
                  <span class="buy-num">{{item.salesAmount}}人已购买</span>
                </div>
              </div>
              <div class="price-num" :class="{'price-color':item.fullFlag&&item.fullFlag=='T'}">
                <span class="unit">￥</span>
                <span class="price">{{item.showSales}}</span>
                <span style="color:#777777;font-size: 12px;">起</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </mescroll-vue>
    <page-footer v-if="footerShow" :pageData="footerData"></page-footer>
  </div>
</template>

<script>
import "mpvue-calendar/src/browser-style.css";
import MescrollVue from "mescroll.js/mescroll.vue";
import {
  XHeader,
  XInput,
  Group,
  Radio,
  Popup,
  Checker,
  CheckerItem
} from "vux";
import { setTimeout } from "timers";
import { wxShare } from "@/common/wxshare";
import pageFooter from "@/components/custompage/footer.vue";
import fourMonth from "@/components/fourMonthSelect";
export default {
  components: {
    pageFooter,
    MescrollVue,
    XHeader,
    XInput,
    fourMonth,
    Popup,
    Checker,
    CheckerItem,
    Group,
    Radio
  },
  beforeCreate(){
       if(localStorage.getItem("selectBegin")){
        if(new Date(localStorage.getItem("selectBegin")).getTime()<new Date().getTime()){
            localStorage.removeItem("selectBegin")
            localStorage.removeItem("selectEnd")
        }
    }
  },
  created() {
    document.title = "云PMS酒店列表";
   
    this.getAxios("/merchant/api/merchantPmsInfoApi/getByInfoId?merchantInfoId="+this.$route.query.m_id).then(res => {
        if(res.status==200){
           this.bigGoodImg= res.data.listShow!= "small";
           this.sortShow= res.data.selectShow!= "F";
           this.scoreShow= res.data.scoreShow!= "F";
        }
    });
    this.getAxios(this.api.aiPapi.getUsePage, {
      pageType: "navigationPage",
      useRange: "wap"
    }).then(res => {
      if (res.data && res.data.content) {
        let data = JSON.parse(res.data.content);
        //判断首页是否存在底部导航
        // this.bootomFooterShow =
        //   this.newCustomFooteerData.range.indexOf("homepage") > -1;

        if (data.list && data.list.length) {
            this.footerShow = true;
          this.footerData = data;
        }
      }
    });
  },
  mounted() {},
  data() {
    return {
      fullImg: require("../../../assets/images/full.png"),
      bigGoodImg: true,
      sortShow:true,
      scoreShow:true,
      sortName: "默认排序",
      hotelTypeName: "",
      hotelLeaveName: "",
      sortList: [
        {
          key: "default",
          value: "默认排序"
        },
        {
          key: "rangeFine",
          value: "距离优先，按距离由近到远"
        },
        {
          key: "downPriceFine",
          value: "低价优先，按最低起价从低到高"
        },
        {
          key: "highPriceFine",
          value: "高价优先，按最低起价由高到低"
        },
        {
          key: "salesFine",
          value: "人气优先，按销售数量由高到低"
        }
      ],
      hotelType: [
        {
          value: "all",
          label: "全部"
        }
      ],
      hotelLeave: [
        {
          value: "all",
          label: "全部"
        }
      ],

      hotelTypeList: ["all"],
      hotelLeaveList: ["all"],
      sortType: "default",
      sortFilterShow: false,
      showFilter: false,
      pmsHotelLevelList: [],
      pmsHotelTypeList: [],
      footerShow: false,
      footerData: {},
      show: false,
      beginDate: localStorage.getItem("selectBegin")
      ? localStorage.getItem("selectBegin")
      : this.GetDateStr(0),
      endDate: localStorage.getItem("selectEnd")
      ? localStorage.getItem("selectEnd")
      : this.GetDateStr(1),
      begin: this.GetbDate(),
      searchword: "",
      keyword: "",
      dataList: [],
      mescroll: null, // mescroll实例对象
      mescrollDown: {}, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
      mescrollUp: {
        // 上拉加载的配置.
        callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
        //以下是一些常用的配置,当然不写也可以的.
        page: {
          num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 6 //每页数据条数,默认10
        },
        noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
        // toTop: {
        //   //回到顶部按钮
        //   src: "http://statics.lotsmall.cn/image/20181219/20181219111919wvv3zy.jpeg", //图片路径,默认null,支持网络图
        //   offset: 1000 //列表滚动1000px才显示回到顶部按钮
        // },
        htmlNodata: '<p class="upwarp-nodata">加载完成</p>',
        htmlContent:
          '<p class="downwarp-progress"></p><p class="downwarp-tip">下拉刷新 </p>', //布局内容
        empty: {
          //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          // warpId: "xxid", //父布局的id (1.3.5版本支持传入dom元素)
          // icon: "./static/mescroll/mescroll-empty.png", //图标,默认null,支持网络图
          tip: "暂无相关数据" //提示
        }
      }
    };
  },
  beforeRouteEnter(to, from, next) {
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
    next(vm => {
      vm.$refs.mescroll.beforeRouteEnter(); // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
    });
  },
  beforeRouteLeave(to, from, next) {
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
    this.$refs.mescroll.beforeRouteLeave(); // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
    next();
  },
  methods: {
    hotelFilter() {
      this.showFilter = !this.showFilter;
      this.sortFilterShow = false;
    },
    sortFilter() {
      this.sortFilterShow = !this.sortFilterShow;
      this.showFilter = false;
    },
    sortTypeChange(value, label) {
      this.sortName = label;
      this.sortType = value
      this.search();
      this.sortFilterShow = false;
    },
    selectType(val) {
      if (val == "all") {
        this.hotelTypeList = ["all"];
      } else {
        if (val != val) this.hotelTypeList.push(val);
        var index = this.hotelTypeList.indexOf("all");
        if (index >= 0) {
          this.hotelTypeList.splice(index, 1);
        }
      }
    },
    selectLeave(val) {
      if (val == "all") {
        this.hotelLeaveList = ["all"];
      } else {
        if (val != val) this.hotelLeaveList.push(val);
        var index = this.hotelLeaveList.indexOf("all");
        if (index >= 0) {
          this.hotelLeaveList.splice(index, 1);
        }
      }
    },
    hideFilter() {
      if (this.hotelTypeList != ["all"]) {
        let arr = [];
        this.hotelTypeList.forEach((el, index) => {
          this.pmsHotelTypeList.forEach((it, i) => {
            if (it.key == el) {
              arr.push(it.value);
            }
          });
        });
        this.hotelTypeName = arr.join(",");
      }
      if (this.hotelLeaveList != ["all"]) {
        let all = [];
        this.hotelLeaveList.forEach((el, index) => {
          this.pmsHotelLevelList.forEach((it, i) => {
            if (it.key == el) {
              all.push(it.value);
            }
          });
        });
        this.hotelLeaveName = all.join(",");
      }
      this.search();
      this.showFilter = false;
    },
    outFilter() {
      this.hotelTypeList = ["all"];
      this.hotelLeaveList = ["all"];
      this.hotelTypeName = "";
      this.hotelLeaveName = "";
      this.search();
      this.showFilter = false;
    },
    godetail(item) {
        if(item.fullFlag&&item.fullFlag=='T'){
             this.$vux.toast.show({
                text:"该酒店已满房",
                time:1000,
                type:'text',
                width:"13.5em",
              });
        }else{
           this.$router.push("/detail/pmsHotel?id=" + item.merchantHotelId); 
        }
      
    },
    search() {
      this.keyword = this.searchword;
      //滚动到顶部
      this.mescroll.scrollTo(0, 0);
      this.upCallback(
        { num: 1, size: this.mescrollUp.page.size },
        this.mescroll
      );
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    upCallback(page, mescroll) {
      let _this = this;
      if (this.pmsHotelLevelList.length) {
        this.getData(page, mescroll);
      } else {
        function getPosition() {
          //判断浏览器是否支持HTML5 定位 发布到服务器上以后一定是https协议才可以的

          if (window.navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              successfulCallback,
              failCallback
            );
          } else {
            alert("你的浏览器不能使用HTML5定位");
          }
        }

        function successfulCallback(position) {
          var latitude = position.coords.latitude;
          var longitude = position.coords.longitude;
          _this.userItude = longitude + "," + latitude;
          // alert("成功获取位置信息");
          _this.getList(page, mescroll);
        }

        function failCallback(error) {
          var text;

          switch (error.code) {
            case error.PERMISSION_DENIED:
              text = "用户拒绝对获取地理位置的请求。";

              break;
            case error.POSITION_UNAVAILABLE:
              text = "位置信息是不可用的。";

              break;

            case error.TIMEOUT:
              text = "请求用户地理位置超时。";

              break;

            case error.UNKNOWN_ERROR:
              text = "未知错误。";

              break;
          }
          _this.getList(page, mescroll);
        }
        getPosition();
      }
      //  this.getData(page);
    },
    getList(page, mescroll) {
      this.getAxios(
        "/pmsproduct/api/pmsHotelToc/getSerchByMerchantId"
      ).then(res => {
        // this.hotelTypeFacilityList = res.data;
        this.pmsHotelLevelList = res.data.pmsHotelLevel;
        this.pmsHotelTypeList = res.data.pmsHotelType;
        res.data.pmsHotelType.forEach((item, index) => {
          this.hotelType.push({
            value: item.key,
            label: item.value
          });
        });
        res.data.pmsHotelLevel.forEach((item, index) => {
          this.hotelLeave.push({
            value: item.key,
            label: item.value
          });
        });
        this.getData(page, mescroll);
      });
    },
    getData(page, mescroll) {
      this.jsonAxios(
        "/merchant/api/pmsMerchantHotelInfo/listHotelInfo",

        {
          currPage: page.num,
          pageSize: page.size,
          // merchantInfoId:78,
          startDate: this.beginDate,
          endDate: this.endDate,
          sortType: this.sortType,
          name: this.keyword,
          hotelTypes:
            this.hotelTypeList.join(",") == "all"
              ? null
              : this.hotelTypeList.join(","),
          hotelLevels:
            this.hotelLeaveList.join(",") == "all"
              ? null
              : this.hotelLeaveList.join(","),
          userItude: this.userItude ? this.userItude : ""
        }
      )
        .then(response => {
          // 请求的列表数据
          let arr = response.data.rows;
          arr.forEach((el, index) => {
            if (el.tag) {
              el.tag = JSON.parse(el.tag);
            }
            let item = this.pmsHotelLevelList.find((it, i) => {
              return it.key == el.hotelLevel;
            });

            arr[index].hotelLevelStr = item ? item.value : "";

            let ele = this.pmsHotelTypeList.find((it, i) => {
              return it.key == el.hotelType;
            });
            arr[index].hotelTypeStr = ele ? ele.value : "";
          });
          // 如果是第一页需手动制空列表
          if (page.num === 1) {
            this.dataList = [];
          }
          // 把请求到的数据添加到列表
          this.dataList = this.dataList.concat(arr);
          // 数据渲染成功后,隐藏下拉刷新的状态
          this.$nextTick(() => {
            if (this.dataList.length >= response.data.total) {
              mescroll.endSuccess(0);
            } else {
              mescroll.endSuccess(arr.length);
            }
          });
        })
        .catch(e => {
          // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          mescroll.endErr();
        });
    },
    //获取当前日期格式yyyy-mm-dd
    GetDateStr(AddDayCount) {
      var dd = new Date();
      dd.setDate(dd.getDate() + AddDayCount);
      var y = dd.getFullYear();
      var m = dd.getMonth() + 1;
      var mm = m < 10 ? "0" + m : m;
      var d = dd.getDate();
      var dd = d < 10 ? "0" + d : d;
      return y + "-" + mm + "-" + dd;
    },
    //获取当前日期格式[yyyy,mm,dd]
    GetbDate() {
      var dd = new Date();
      var y = dd.getFullYear();
      var m = dd.getMonth() + 1;
      var d = dd.getDate();
      return [y, m, d];
    },
    //日历选择
    showCalendar() {
      this.$refs.calendar.show();
    },
    select(val, val2) {
      this.beginDate = val;
      this.endDate = val2;
      window.localStorage.setItem("selectBegin", val);
      window.localStorage.setItem("selectEnd", val2);
      this.upCallback(
        { num: 1, size: this.mescrollUp.page.size },
        this.mescroll
      );
    },
    processingDate(obj) {
      let month = obj[1],
        day = obj[2];
      return (
        obj[0] +
        "-" +
        (month < 10 ? "0" + month : month) +
        "-" +
        (day < 10 ? "0" + day : day)
      );
    }
  }
};
</script>
<style >
.weui-cells_radio .weui-check:checked + .weui-icon-checked:before {
  color: #0086f6 !important;
}
.weui-cell {
  padding: 17px 15px !important;
}
.weui-check__label:active {
  background-color: #f6f6f8 !important;
}
</style>
<style lang="scss" scoped>
.list-warper-pmshotel {
  // padding-top: 49px;
  height: 100%;
overflow: hidden;
width: 100%;
position: fixed;
//   overflow-y: hidden;
    // -webkit-overflow-scrolling: touch; 
    ::-webkit-scrollbar {
    display: none;
}
  .showFilter.vux-popup-dialog {
    z-index: 501 !important;
  }
  .mask,
  .showFilter {
    width: 100%;
    height: 100%;
    position: fixed;
    background: rgba(0, 0, 0, 0.3);
    z-index: 700;

  
  }
   .weui-cells.vux-no-group-title {
    margin-top: 0!important;
  }
  .weui-cells {
    margin-top: 0!important;
  }
 

  .maskFilter {
    height: auto;
    background-color: #fff;
    // position: relative;
    border-top: 0.5px solid #e1e1e1;
    .hotelType {
      padding: 9px;
      border-bottom: 0.5px solid #e1e1e1;
      overflow: hidden;
      .hotelType-title {
        color: #413838;
        font-size: 15px;
        margin-bottom: 5px;
        margin-left: 5px;
      }
      .hotelType-item {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        .demo1-item {
          //  flex:1;
          width: 79px;
          height: 37px;
          line-height: 37px;
          background-color: #f5f5f5;
          color: #413838;
          margin: 7.5px 5px;
          border-radius: 2px;
          font-size: 12px;
          text-align: center;
        }
        .demo1-item-selected {
          color: #0086f6;
          //   background-color: #e0f0fe;
          background: url("./../../../assets/images/icon-hotel2.png") no-repeat;
          background-size: 79px 37px;
        }
      }
    }
    .filter-handle {
      height: 55px;
      line-height: 55px;
      font-size: 14px;
      text-align: center;
      color: #413838;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .handle-btn {
        height: 35px;
        line-height: 35px;
        width: 161px;
        border: 1px solid #999999;
        border-radius: 2px;
      }
      .btn-sub {
        background-color: #009ded;
        border: 1px solid #009ded;
        color: #fff;
      }
    }
  }
  .draw-enter, .draw-leave-to /* .fade-leave-active below version 2.1.8 */ {
    height: 0;
  }
  .draw-enter-active {
    animation: draw-in 0.5s;
  }
  .draw-leave-active {
    animation: draw-in 0.5s reverse;
  }
  @keyframes draw-in {
    0% {
      transform: translate(200px, 0);
    }
    100% {
      transform: translate(0, 0);
    }
  }

  .hotel-date {
    height: 36px;
    display: flex;
    background-color: #fff;
    margin:10px 8px;
    .hotel-item {
      margin-left: 12px;
      .date-box {
        width: 1.3rem;
        color: #413838;
        .date-text {
          font-size: 11px;
          display: inline-block;
          vertical-align: middle;
          color: #f05b47;
        }
      }
    }
    .hotel-line {
      width: 1px;
      height: 24px;
      background: #eeeee7;
      margin-left: 12px;
      margin-top: 6px;
    }

    .search-warper {
      background: #f7f7f7;
      width: 100%;
      position: relative;
      .search-icon {
        position: absolute;
        font-size: 18px;
        top: 5px;
        right: 15.5px;
        color: #c4c4c4;
      }
      .search-input {
        padding: 0 5px;
        outline: none;
        border: none;
        width: calc(100% - 10px);
        height: 36px;
        text-align: center;
        border-radius: 2px;
        // border-left: 1px solid #eeeee7;
      }
      ::-webkit-input-placeholder {
        text-align: center;
      }
      :-moz-placeholder {
        /* Firefox 18- */
        text-align: center;
        color: #999;
        font-size: 13px;
      }
      ::-moz-placeholder {
        text-align: center;
        /* Firefox 19+ */
        color: #999;
        font-size: 13px;
      }
      :-ms-input-placeholder {
        text-align: center;
        color: #999;
        font-size: 13px;
      }
    }
  }
  .hotel-filter {
    height: 43px;
    line-height: 43px;
    background-color: #fff;
    color: #413838;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    box-shadow: 0px 2px 5px rgb(236, 236, 236);
    padding: 0 15px;
    .hotel-filter-item {
      // width:33%;
      text-align: right;
      .hotel-text {
        display: inline-block;
        width: 80px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .icon-filter {
        display: inline-block;
      }
    }
  }
  .coupon-receive {
    height: 43px;
    margin: 10px 0;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .mescroll {
    position: fixed;
    // padding-bottom: 1rem;
    top: 110px;
    bottom: 0;
    height: auto !important;
    &.footer-waprper {
      bottom: 59px;
    }
    &.sore-top{
        top:60px;
    }
  }

  .good-list {
    .big-good-item {
      background: #fff;
      margin-bottom: 10px;
      box-shadow: 0px 2px 5px rgb(236, 236, 236);
      height: 224px;
      .big-img {
        width: 100%;
        height: 150px;
        position: relative;
             .gray { 
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);

  filter: grayscale(100%);
//上面代码是兼容火狐与谷歌的样式
//下面代码是兼容ie9以下浏览器的样式，包括ie9
  filter: gray;
}
        .full-img {
          position: absolute;
          height: 46px;
          width: 46px;
          top: 0;
          right: 0;
          z-index:2;
        }
        .big-img-item{
             width: 375px;
        height: 150px;
        text-align: center;
        background-repeat: no-repeat;
        background-position: center center;
        overflow: hidden;
        img {
          width: 375px;
          height: 150px;    
          object-fit:cover;
        }
        }
        img {
          width: 100%;
          height: 100%;
        }
        .score {
          width: 82px;
          height: 24px;
          color: #e8b83e;
          text-align: center;
          line-height: 24px;
          font-family: PingFang-SC-Bold;
          border-radius: 2px;
          background-color: rgba(0, 0, 0, 0.6);
          position: absolute;
          right: 10px;
          bottom: 8px;
        }
      }
      .big-good-content {
        margin: 10px;
        .big-good-title {
          font-size: 16px;
          color: #413838;
          font-family: PingFang-SC-Bold;
          word-break: break-all;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          /* ! autoprefixer: off */
          -webkit-box-orient: vertical;
          /* autoprefixer: on */
          overflow: hidden;
          line-height: 22px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
           .title-name{
              max-width:calc(85% - 5px);
            white-space: nowrap;  
            overflow: hidden;  
            text-overflow: ellipsis; 
          }
          .star-hotel {
            font-size: 12px;
            padding-left:5px;
            color: #777777;
          }
        }
      }
      .scenic-distance {
        font-size: 11px;
        .scenic-left {
          border: 1px solid #0086f6;
          color: #0086f6;
          padding: 2px 6px;
          margin-right: 5px;
        }
        .scenic-center {
          border: 1px solid #ff6633;
          color: #ff6633;
          padding: 2px 6px;
          margin-right: 5px;
        }
        .scenic-right {
          border: 1px solid #1ec08a;
          color: #1ec08a;
          padding: 2px 6px;
          margin-right: 5px;
        }
        .scenic-color{
             border: 1px solid #999999;
          color:#999999;
      }
      }
      .price-num {
        text-align: right;
        color: #ff6600;
        font-size: 10px;
        margin-top: -20px;
        .price {
          font-size: 18px;
          font-weight: bold;
        }
      }
      .price-color{
          color:#999999;
      }
    }
    .good-item {
      background: #fff;
      margin-bottom: 10px;
      box-shadow: 0px 2px 5px rgb(236, 236, 236);
      position: relative;
      &:last-child {
        margin-bottom: 0;
      }
      .full-img {
        height: 46px;
        width: 46px;
        position: absolute;
        top: 0;
        right: 0;
        z-index:2;
      }
      .good-img {
        width: 95px;
        height: 140px;
        background-repeat: no-repeat;
        background-position: center center;
        overflow: hidden;
        img {
          width: 155px;
          height: 140px;
          margin-left: -30px;
          margin-right: -30px;
        }
        .gray { 
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);

  filter: grayscale(100%);
//上面代码是兼容火狐与谷歌的样式
//下面代码是兼容ie9以下浏览器的样式，包括ie9
  filter: gray;
}
      }
      .good-detail {
        margin-left: 95px;
        height: 93px;
        width: calc(100% - 95px);
        padding-top: 7px;
        position: relative;
        .good-title {
          font-size: 16px;
          color: #413838;
          font-family: PingFang-SC-Bold;
          padding-left: 11px;
          padding-right: 5px;
          word-break: break-all;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          /* ! autoprefixer: off */
          -webkit-box-orient: vertical;
          /* autoprefixer: on */
          overflow: hidden;
          line-height: 22px;
          display: flex;
          align-items: center;
          .title-name{
              max-width:calc(80% - 5px);
            white-space: nowrap;  
            overflow: hidden;  
            text-overflow: ellipsis; 
          }
          &.full-title {
            padding-right: 35px;
          }
          .star-hotel {
              padding-left:5px;
            font-size: 12px;
            color: #777777;
          }
        }
        .hotel-address {
          padding: 0 11px;
          margin: 5px 0;
          font-size: 12px;
          color: #777777;
        }
        .scenic-distance {
          font-size: 11px;
          padding: 0 11px;
          .scenic-left {
            border: 1px solid #0086f6;
            color: #0086f6;
            padding: 2px 6px;
            margin-right: 5px;
          }
          .scenic-center {
            border: 1px solid #ff6633;
            color: #ff6633;
            padding: 2px 6px;
            margin-right: 5px;
          }
          .scenic-right {
            border: 1px solid #1ec08a;
            color: #1ec08a;
            padding: 2px 6px;
            margin-right: 5px;
          }
          .scenic-color{
             border: 1px solid #999999;
          color:#999999;
      }
        }

        .good-sell {
          padding: 0 11px;
          margin-top: 5px;
          //   width: calc(100% - 21px);
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          .buy-box {
            color: #0086f6;
            font-size: 16px;
            font-family: PingFangSC-Regular, sans-serif;
            .buy-num {
            //   margin-left: 5px;
              font-size: 10px;
              color: #777777;
            }
          }
          .buy-color{
              color:#413838;
          }
        }
        .price-num {
          padding: 0 11px;
          text-align: right;
          color: #ff6600;
          font-size: 10px;
          margin-top: -5px;
          .price {
            font-size: 18px;
            font-weight: bold;
          }
        }
        .price-color{
          color:#999999;
      }
      }
    }
  }
}
</style>



