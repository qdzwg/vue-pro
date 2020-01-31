<template>
  <div class="home">
    <!-- 头部检索 -->
    <div class="search-warper">
      <div class="search-t"></div>
      <div class="search-b"></div>
      <div class="search-ab-warpper">
        <div class="shadow-box"></div>
        <div class="input-warper">
          <div class="s-e-address">
            <div class="input-item vux-1px-b">
              <label class="input-title">出发站</label>
              <input @blur="iosBlur"
                     class="input-text"
                     v-model.trim="start"
                     placeholder="请选择出发地"
                     type="text" />
            </div>
            <div class="input-item vux-1px-b">
              <label class="input-title">到达站</label>
              <input @blur="iosBlur"
                     class="input-text"
                     v-model.trim="end"
                     placeholder="请选择到达地"
                     type="text" />
            </div>
            <div @click="change"
                 class="change-icon-warper">
              <img src="../../assets/images/change.png"
                   alt />
            </div>
          </div>
          <div class="input-item"
               @click="showCalendar">
            <label class="input-title">日期</label>
            <span class="today-date">{{ showDate }}</span>
            <span class="today-text">{{ showDay }}</span>
          </div>
          <button class="searcn-btn"
                  @click="search"
                  type="button">查询</button>
          <!-- <div class="search-history"
               v-if="siteData.length"> -->
          <scroller lock-y
                    :scrollX="true">
            <div class="search-content"
                 ref="searchWrap">
              <div v-for="(item, index) in siteData"
                   :key="index"
                   ref="searchItem"
                   class="search-history-item"
                   @click="easySearch(item)">{{ item.bgSiteName}}-{{item.edSiteName}}</div>
            </div>
          </scroller>
          <!-- <div class="search-content"
                 :style="{width:searchWidth}">
              <div v-for="(item, index) in siteData"
                   :key="index"
                   ref="searchItem"
                   class="search-history-item"
                   @click="easySearch(item)">{{ item.bgSiteName}}-{{item.edSiteName}}</div>
            </div> -->
          <!-- </div> -->
        </div>
      </div>
    </div>
    <!-- 热门线路 -->
    <div class="hot-route">
      <h2 class="hot-route-title">热门景点</h2>
      <div class="hot-spot-conts"
           v-if="listData.length">
        <scroller lock-y
                  :scrollX="true">
          <div class="hot-spot-list"
               ref="spotWrap">
            <div class="hot-spot-item"
                 ref="spotItem"
                 v-for="(v,index) in listData"
                 :key="v.id+index"
                 @click="spotToDetail(v)">
              <img :src="v.img"
                   class="hot-spot-img"
                   alt />
              <div class="hot-spot-txt">
                <span>{{v.spotName}}</span>
              </div>
            </div>
          </div>
        </scroller>

      </div>
    </div>
    <!-- 地图 -->
    <!-- <el-amap class="amap-box" vid="amap-home" :center="center" :plugin="plugin"></el-amap> -->
    <calendar @dateChange="getDate"
              ref="calendar"></calendar>
  </div>
</template>
<script>
import calendar from "./components/calendaer";
import { Scroller } from "vux";
import { isWxAli } from "@/common/common";
// import wx from "weixin-js-sdk";
export default {
  components: {
    calendar,
    Scroller,
  },
  data () {
    let self = this;
    return {
      start: "",
      end: "",
      showDay: "",
      currentdate: "",
      showDate: "",
      listData: [],
      siteData: [],
      // ==================== 地图组件数据 ========================
      center: [121.59996, 31.197646],
      lng: 0,
      lat: 0,
      loaded: false,
      plugin: [
        {
          pName: "Geolocation",
          events: {
            init (o) {
              o.getCurrentPosition((status, result) => {
                // alert("调试-高德获取定位结果：");
                // 微信中使用jssdk获取定位，浏览器用amap
                if (!self.env.isWx) {
                  if (result && result.position) {
                    self.lng = result.position.lng;
                    self.lat = result.position.lat;
                    self.center = [self.lng, self.lat];
                    self.loaded = true;
                    self.getLocationSite();
                    self.$nextTick();
                  } else {
                    self.$vux.toast.text('请开启定位权限，以获取距离最近的出发站点')
                  }
                }
              });
            }
          }
        }
      ]
    };
  },
  created () {
    this.env = isWxAli();
    this.getCurDate();
  },
  mounted () {
    this.getSiteData();
    this.getHotScenic();
    this.wxLocation()
    this.getLocationSite();
  },
  computed: {},
  methods: {
    wxLocation () {
      if (this.env.isWx) {
        let _url = window.location.href.split("#")[0];
        this.jsonAxios("/pay/leaguer/api/weixin/getToken", {
          // corpCode: this.$route.query.corpCode,
          url: _url
        }).then(res => {
          let o = res.data;
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: o.appid, // 必填，公众号的唯一标识
            timestamp: o.timeStamp, // 必填，生成签名的时间戳
            nonceStr: o.nonceStr, // 必填，生成签名的随机串
            signature: o.sign, // 必填，签名
            jsApiList: ["getLocation"] // 必填，需要使用的JS接口列表, 这里只需要调用扫一扫
          });
          wx.ready(function () {
            wx.getLocation({
              type: "gcj02", // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
              success: function (res) {
                _this.lat = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                _this.lng = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                _this.getLocationSite();
              }
            });
          });
        });
      }
    },
    getDate (item) {
      this.selectDate = item.date;
      this.showDate =
        (item.month > 9 ? item.month : "0" + item.month) +
        "月" +
        (item.day > 9 ? item.day : "0" + item.day) +
        "日";
      this.getShowDay(item.date);
    },
    getShowDay (day) {
      let time = new Date(day).valueOf() - new Date(this.currentdate).valueOf();
      let showDay = "";
      if (time == 0) {
        showDay = "今天";
      } else if (time == 86400000) {
        showDay = "明天";
      } else if (time == 172800000) {
        showDay = "后天";
      }
      this.showDay = showDay;
    },
    showCalendar () {
      this.$refs.calendar.show();
    },
    // 热门景点去往线路列表
    spotToDetail (item) {
      if (!this.start) {
        this.$vux.toast.text("请完善出发站信息");
        return;
      }
      this.end = item.spotName;
      this.search();
    },
    search () {
      if (this.start && this.end) {
        this.$router.push(
          "/traffic_route?startSite=" +
          this.start +
          "&endSite=" +
          this.end +
          "&date=" +
          this.selectDate
        );
      } else {
        this.$vux.toast.text("请完善出发站及到达站信息");
      }
    },
    // 点击热门站点快捷查询
    easySearch (item) {
      this.start = item.bgSiteName;
      this.end = item.edSiteName;
      this.search();
    },
    change () {
      let start = this.start;
      this.start = this.end;
      this.end = start;
    },
    getCurDate () {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }

      this.currentdate = year + seperator1 + month + seperator1 + strDate;
      this.selectDate = year + seperator1 + month + seperator1 + strDate;
      this.showDate = month + "月" + strDate + "日";
      this.getShowDay(this.currentdate);
    },
    async getSiteData () {
      let sites = await this.getAxios(
        "/merchant/api/traffic/getHotSites"
      );
      this.siteData = sites.data && sites.data.length ? sites.data : [];
      this.$nextTick(() => {
        let width = 0;

        if (this.$refs.searchItem) {
          this.$refs.searchItem.map(v => {
            width += v.getBoundingClientRect().width;
          });
          this.$refs.searchWrap.style.width = width + 'px';
        }

      });
    },
    // 获取定位最近的站点
    getLocationSite () {
      this.getAxios("/merchant/api/traffic/getNearestStation", {
        currentLatSite: this.lat || 30.291779,
        currentlngSite: this.lng || 120.112879
      }).then(res => {
        if (this.start === "") {
          this.start = res.data && res.data.siteAliasName;
        }
      });
    },
    // 获取热门景点
    async getHotScenic () {
      let scenic = await this.getAxios(
        "/merchant/api/traffic/getHotSpot"
      );
      this.listData = scenic.data && scenic.data.length ? scenic.data : [];
      this.$nextTick(() => {
        let width = 0;
        if (this.$refs.spotItem) {
          this.$refs.spotItem.map(v => {
            width += v.getBoundingClientRect().width;
            width += (20 / 750) * window.innerWidth;
          });
        }
        this.$refs.spotWrap.style.width = width + 'px';
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.home {
  min-height: 100%;
  background-color: #fff;
}
.search-warper {
  position: relative;
  .search-t {
    background: #fff;
    height: 100px;
  }
  .search-b {
    height: 175px;
    background: #fff;
  }
  .search-ab-warpper {
    position: absolute;
    // box-shadow: 0 2.5px 4px 2.5px rgba(242, 242, 242, 0.5);
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 325px;
    height: 210px;
    background: #fff;
    border-radius: 8px;
    padding: 15px 10px;

    .shadow-box {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 160px;
      box-shadow: 0 2px 2px 1.5px rgba(242, 242, 242, 0.5);
    }
    .input-warper {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      padding: 0 10px;
      .search-content {
        position: relative;
        // width: 2000px;
        margin-top: 18px;
        height: 20px;
        display: flex;
        .search-history-item {
          // flex: 1;
          // float: left;
          padding: 0 5px;
          white-space: nowrap;
          // min-width: 33.33%;
          text-align: center;
          font-size: 12px;
          color: #999;
        }
      }
      .s-e-address {
        position: relative;
        .change-icon-warper {
          position: absolute;
          right: 0;
          bottom: 0;
          height: 100%;
          display: flex;
          align-items: center;
          img {
            width: 30px;
            height: 30px;
            padding-left: 6px;
            padding-right: 4px;
            background: #fff;
          }
        }
      }
      .today-date {
        font-size: 18px;
        color: #333333;
      }
      .today-text {
        font-size: 18px;
        color: #333333;
        margin-left: 22px;
      }
      .searcn-btn {
        text-align: center;
        color: #fff;
        height: 45px;
        line-height: 45px;
        border-radius: 2px;
        background: #de6550;
        width: 100%;
        border: none;
        font-size: 17px;
        margin-top: 10px;
      }
    }
  }
}
.hot-route {
  background: #fff;
  padding: 0 0 12px 15px;
  .hot-route-title {
    font-size: 17px;
    color: #333333;
    font-weight: 600;
  }
}
.hot-spot-conts {
  margin-top: 12px;
  overflow-x: scroll;
  height: 115px;
  overflow-y: hidden;
  .hot-spot-list {
    min-width: 100%;
    height: 115px;
  }
  .hot-spot-item {
    width: 130px;
    height: 115px;
    position: relative;
    float: left;
    margin-right: 10px;
  }
  .hot-spot-img {
    width: 130px;
    height: 115px;
  }
  .hot-spot-txt {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    line-height: 20px;
    height: 20px;
    background-color: rgba(0, 0, 0, 0.7);
    font-size: 12px;
    padding: 0 7px;
    max-width: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>

