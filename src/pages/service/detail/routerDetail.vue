<template>
  <div class="router-detail">
    <swiper auto
            loop
            :interval="2000"
            height="5.906667rem"
            class="text-scroll"
            dots-position="center">
      <swiper-item v-for="(imgUrl,index) in imgUrls"
                   :key="index">
        <img style="width:100%;height:100%"
             :src="imgUrl + '?imageMogr2/thumbnail/640x/strip/quality/100'"
             alt>
      </swiper-item>
      <!-- <swiper-item>
        <img style="width:100%;height:100%" src="../../../assets/images/demo.jpeg" alt>
      </swiper-item>
      <swiper-item>
        <img style="width:100%;height:100%" src="../../../assets/images/demo.jpeg" alt>
      </swiper-item>-->
    </swiper>
    <div class="ticket-n-intro">
      <div class="ticket-l">
        <h3 class="ticket-name">{{detailData.nickName}}</h3>
        <h5 class="ticket-subtitle">{{detailData.lineDescription}}</h5>
        <div class="ticket-price">
          <span class="unit">￥</span>
          <span class="price">{{detailData.priceShow}}</span>
          <!-- <span class="min-text">起</span>
                    <span class="t-l-price">45000</span> -->
          <span v-for="(item,index) in detailData.lineTheme"
                :key="index"
                class="router-label">{{item}}</span>
        </div>
        <a href='#lineNotes'
           class="order-t-n">购买须知</a>
      </div>
    </div>
    <div class="linearGradient"></div>
    <div class="router-position">
      <i class="xx-icon icon-location"></i>
      <span>{{detailData.begAddress}}出发</span>
      <i class="xx-icon icon-qunaer m-l-10 m-r-10"></i>
      <span>{{detailData.endAddress}}</span>
    </div>
    <div class="linearGradient"></div>
    <div class="ticket-detail-warpper">
      <h2 class="ticket-w-title">行程详情</h2>
      <div class="ticket-detail-box">
        <div v-html="detailData.lineArrange"></div>
      </div>
    </div>
    <div class="linearGradient"></div>
    <div class="ticket-detail-warpper">
      <h2 class="ticket-w-title">费用须知</h2>
      <div class="ticket-detail-box">
        <div v-html="detailData.costDescription"></div>
      </div>
    </div>
    <div class="linearGradient"></div>
    <div id='lineNotes'
         class="ticket-detail-warpper">
      <h2 class="ticket-w-title">预定须知</h2>
      <div class="ticket-detail-box">
        <div v-html="detailData.lineNotes"></div>
      </div>
    </div>
    <div class="linearGradient"></div>
    <div class="ticket-detail-warpper">
      <div class="comment-title">
        <h2 class="ticket-w-title">评论</h2>
        <div v-if="commentData.length>5"
             @click="commentAll=true"
             class="comment-more">查看全部</div>
      </div>
      <div v-if="commentData.length"
           class="ticket-detail-box comment-ul">
        <div v-for="(item,index) in commentData"
             :key="index"
             class="comment-li">
          <div class="user-info">
            <div class="img-name">
              <img v-if="item.headImg"
                   class="logo-img"
                   :src="item.headImg"
                   alt>
              <i v-else
                 class="xx-icon icon-member member-svg"></i>
              <span class="name">{{item.userName}}</span>
            </div>
            <span class="comment-time">{{item.createTime}}</span>
          </div>
          <p class="comment-content">{{item.content}}</p>
        </div>
      </div>
      <div v-else
           class="no-comment">暂无评论</div>
    </div>
    <div class="linearGradient"></div>
    <div class="f-b bottom-warpper">
      <div @click="go('/')"
           class="home-page">
        <i class="xx-icon icon-shouye"></i>
        <span>首页</span>
      </div>
      <div>
        <div class="market-page">
          <div class="market-icon"><i class="xx-icon icon-fukuan"></i></div>
          <div>推广</div>
        </div>
        <button @click="show=true"
                type="button"
                class="order">立即报名</button>
      </div>
    </div>
    <popup v-model="commentAll"
           position="left">
      <mescroll-vue ref="mescroll"
                    :down="mescrollDown"
                    :up="mescrollUp"
                    @init="mescrollInit"
                    class="scrollView">
        <div class="ticket-detail-warpper">
          <div class="ticket-detail-box comment-ul">
            <div v-for="(item,index) in dataList"
                 :key="index"
                 class="comment-li">
              <div class="user-info">
                <div class="img-name">
                  <img v-if="item.headImg"
                       class="logo-img"
                       :src="item.headImg"
                       alt>
                  <i v-else
                     class="xx-icon icon-member member-svg"></i>
                  <span class="name">{{item.userName}}</span>
                </div>
                <span class="comment-time">{{item.createTime}}</span>
              </div>
              <p class="comment-content">{{item.content}}</p>
            </div>
          </div>
        </div>
      </mescroll-vue>
    </popup>
    <popup class="order-pop"
           v-model="show">
      <!-- <transition name="draw">
                        <div v-if="calendarShow" class="mask" @click="hideCalendar">
                            <Calendar clean now range @select="select" :begin="begin" ref="calendar" />
                        </div>
                    </transition> -->
      <div class="order-content">
        <div class="order-content-title">
          <span class="text">请选择日期</span>
          <i @click="show=false"
             class="xx-icon icon-guanbi2"></i>
        </div>
        <div class="play-date">
          <div class="hotel-date clearfix">
            <div @click="playDateChange(0)"
                 class="date-box"
                 :class='{"date-select":date==0}'>
              <span class="date-text">今天</span>
            </div>
            <div @click="playDateChange(1)"
                 class="date-box"
                 :class='{"date-select":date==1}'>
              <span class="date-text">{{nextDate}}</span>
            </div>
            <div @click="playDateChange(2)"
                 class="date-box"
                 :class='{"date-select":date==2}'>
              <span class="date-text">{{nextDate1}}</span>
            </div>
            <div @click="showCalendar"
                 class="date-box date-more">
              <span class="date-text">查看更多日期</span>
            </div>
          </div>

          <!-- <calendar show-popup-header class="select-play-date" @on-change="playDateChange" @on-show="show1=true" @on-hide="show1=false" v-model="value2" title="游戏时间" disable-past></calendar> -->
        </div>
        <div class="select-ticket-title">
          <span class="select-ticket">请选择人数</span>
          <!-- <span v-if="isSinglebuy=='2'" :class="{active:addNum>1}" class="select-ticket-notice">(一次只能预定一种票型)</span> -->
        </div>
        <div class="px-ul">
          <div v-for="(item,index) in itemData"
               :key="index">
            <div class="linearGradient"
                 v-show='index'></div>
            <div class="px-li">
              <div class="px-li-l">
                <div>
                  <div class="px-name">{{ item.ticketName }}</div>
                  <div class="px-price">
                    <span class="unit">￥</span>
                    <span class="price">{{ item.salePrice }}</span>
                    <!-- <span class="last-price">{{ item.priceSettle }}</span> -->
                  </div>
                </div>
              </div>
              <div class="px-li-r">
                <span class="num">{{item.num}}</span>
                <div class="add-sub">
                  <span @click.stop="sub(index)"
                        class="sub handle-btn"
                        :class="{'no-num':item.num==0}">-</span>
                  <span @click.stop="add(index)"
                        class="add handle-btn">+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="px-footer">
          <div class="num-price">
            <div class="select-num">
              <span>已选：</span>
              <span class="num">{{number}}人</span>
            </div>
            <div class="price">
              <span class="text">总额：</span>
              <div class="price-info">
                <span class="price-unit">￥</span>
                <span class="price-num">{{total}}</span>
              </div>
            </div>
          </div>
          <div class="px-next f-b-btn"
               @click="goOrder"
               :class='{active:number&&total}'>下一步</div>
        </div>
      </div>
    </popup>
    <div v-if="show1"
         class="time-mask"></div>
    <x-dialog v-model="noticeShow"
              class="dialog-demo">
      <div class="notice-body">
        <h2 class="notice-title">购票提醒</h2>
        <div class="notice-content"
             v-html="noticeStr"></div>
        <div class="footer">
          <span @click="noticeShow=false"
                class="no-agree">不同意</span>
          <span @click="agree"
                class="agree">同意</span>
        </div>
      </div>
    </x-dialog>
    <!-- 时间选择 -->
    <mutil-calendar ref="calendar"
                    @getDate="selectDate"
                    :activeDate="playDate"></mutil-calendar>
    <float-nav></float-nav>
  </div>
</template>
<script>
import { Swiper, SwiperItem, Popup, DatetimeView, Group, XDialog } from "vux";
import MescrollVue from "mescroll.js/mescroll.vue";
import mutilCalendar from "@/components/routeCalendar";
import "mpvue-calendar/src/browser-style.css";
import floatNav from "@/components/floatNav";
export default {
  components: {
    floatNav,
    Swiper,
    SwiperItem,
    MescrollVue,
    Popup,
    DatetimeView,
    Group,
    mutilCalendar,
    XDialog
  },
  data () {
    return {
      date: 0,
      beginDate: this.GetDateStr(0),
      endDate: this.GetDateStr(1),
      nextDate: this.formatDate(new Date(Date.now() + 60 * 24 * 60 * 1000), 'MM-dd'),
      nextDate1: this.formatDate(new Date(Date.now() + 2 * 60 * 24 * 60 * 1000), 'MM-dd'),
      calendarShow: false,
      begin: this.GetbDate(),
      indexArr: [],
      number: 0,
      addNum: 0,
      noticeStr: "",
      noticeShow: false,
      totalPrice: 0,
      isSinglebuy: 1,
      itemData: [],
      value2: this.getCurDate(),
      show1: false,
      commentAll: false,
      show: false,
      wayType: 1,
      playDate: "",
      detailData: {},
      commentData: {},
      imgUrls: [],
      scenicDetail: "",
      orderDetail: "",
      activeIndexArr: [], //缓存需要提示购票的下标index
      dataList: [], // 评论列表
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
  created () {
    document.title = "跟团游详情";
    let _this = this;
    this.playDate = this.getCurDate();
    let detailUrl = this.api.route.detail.main,
      commentUrl = this.api.main.comment.list;
    // if (recommendFlag && leagureId && payOrderNo) {
    //   //支付跳转成功后跳转详情页面
    //   var pd = this.getAxios(detailUrl, {
    //     wayType: this.wayType,
    //     merchantParkInfoId: _this.$root.$mp.query.id,
    //     merchantInfoId: merchantInfoId,
    //     recommendFlag: recommendFlag,
    //     payOrderNo: payOrderNo,
    //     leaguerId: leagureId
    //   });
    // } else {
    //   //列表页面跳转详情页面
    //   var pd = this.getAxios(detailUrl, {
    //     wayType: this.wayType,
    //     merchantParkInfoId: this.$route.query.id
    //   });
    // }
    let pd = this.getAxios(detailUrl, {
      id: this.$route.query.id
    });
    let pc = this.getAxios(commentUrl, {
      id: this.$route.query.id,
      productType: "router",
      productCode: this.$route.query.productCode
    });

    Promise.all([pd, pc])
      .then(result => {
        // console.log(result);
        _this.detailData = result[0].data;
        _this.detailData.lineTheme = _this.detailData.lineTheme ? _this.detailData.lineTheme.split(',') : [];
        _this.commentData = result[1].data;
        _this.imgUrls = result[0].data.merchantPictureLibVo.wapUrl
          ? result[0].data.merchantPictureLibVo.wapUrl.split(",")
          : [];

        _this.scenicDetail = result[0].data.summary.replace(/<\/?[>]*>/g, "");
        _this.orderDetail = result[0].data.orderNotice;
        // result[2].data.rows.forEach((item, index) => {
        //   result[2].data.rows[index].num = 0;
        // });
        // _this.itemData = result[2].data.rows;
        _this.isSinglebuy = result[0].data.orderType;
        result[1].data.forEach(item => {
          var reg = /^(.{1}).*(.{1})$/;
          if (item.isAnonymous == "T") {
            item.userName = item.userName
              ? item.userName.replace(reg, "$1***$2")
              : "";
          }
        });
      })
      .catch(error => { });
    //获取当天的票型信息
    this.getPxData();
  },
  computed: {
    total () {
      let _this = this,
        sum = 0,
        itemData = _this.itemData;
      this.number = 0;
      for (let i = 0; i < itemData.length; i++) {
        for (let j = 0; j < itemData[i].clCalendarDayVos.length - 1; j++) {
          if (itemData[i].clCalendarDayVos[j].date == _this.playDate) {
            itemData[i].salePrice = itemData[i].clCalendarDayVos[j].salePrice;
            sum += itemData[i].num * itemData[i].clCalendarDayVos[j].salePrice;
            this.number += itemData[i].num;
          }
        }
      }
      return sum.toFixed(2);
    }
  },
  methods: {
    selectDate (day) {
      // console.log("zzzz", day);
      // this.playDate = day.date;
      // this.num = 0;
      // this.realNameList = [];
      // this.timeFlag = true;
      // this.activeIndex = 0;
      // this.timeList = [];
      // this.noticeFlag = true;
      // this.noticeStr = "";
      // this.noticeShow = false;
      // this.ticketInfo = {};
      // this.getTicketInfo();
    },
    totalComputed () {
      let _this = this,
        sum = 0,
        itemData = _this.itemData;
      for (let i = 0; i < itemData.length; i++) {
        for (let j = 0; j < itemData[i].clCalendarDayVos.length - 1; j++) {
          if (itemData[i].clCalendarDayVos[j].date == _this.playDate) {
            itemData[i].salePrice = itemData[i].clCalendarDayVos[j].salePrice;
            itemData[i].stock = itemData[i].clCalendarDayVos[j].stock;
            sum += itemData[i].num * itemData[i].clCalendarDayVos[j].salePrice;
          }
        }
      }
      return sum.toFixed(2);
    },
    upCallback (page, mescroll) {
      this.getAxios("/merchant/api/merchantHotelInfo/merchantHotelInfoGrid", {
        currPage: page.num,
        pageSize: page.size,
      })
        .then(response => {
          // console.log(response);
          // 请求的列表数据
          let arr = response.data.rows;
          // console.log(arr.length);
          // 如果是第一页需手动制空列表
          if (page.num === 1) this.dataList = [];
          // 把请求到的数据添加到列表
          this.dataList = this.dataList.concat(arr);
          // 数据渲染成功后,隐藏下拉刷新的状态
          this.$nextTick(() => {
            mescroll.endSuccess(arr.length);
          });
        })
        .catch(e => {
          // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          mescroll.endErr();
        });
    },
    mescrollInit (mescroll) {
      this.mescroll = mescroll;
    },
    amap (lat, addr) {
      window.location.href = "https://uri.amap.com/marker?position=" + lat + "&name" + addr
      //   window.location.href ="https:////uri.amap.com/navigation?to=" + lat + ',' + addr+ '&mode=car&callnative=1'
    },
    routeTest () {
      this.$router.replace({
        path: "/login"
      });
    },
    dateToString (time) {
      var thisMonth = "00" + (time.getMonth() + 1);
      var thisDay = "00" + time.getDate();
      return (
        time.getFullYear() +
        "-" +
        thisMonth.substr(thisMonth.length - 2) +
        "-" +
        thisDay.substr(thisDay.length - 2)
      );
    },
    showCalendar () {
      this.$refs.calendar.show();
    },
    hideCalendar () {
      this.calendarShow = false;
    },
    select (val, val2) {
      console.log("准备发起请求！");
      this.beginDate = this.processingDate(val);
      this.endDate = this.processingDate(val2);
      localStorage.setItem("selectBegin", this.processingDate(val));
      localStorage.setItem("selectEnd", this.processingDate(val2));
      this.getPxData()
      setTimeout(() => {
        this.hideCalendar();
      }, 300);
    },
    formatDate (d, fmt) {
      let date;
      if (d instanceof Date) {
        date = d
      } else {
        let newd = !d || d.replace(/-/g, '/')
        date = new Date(newd)
      }
      let padLeftZero = (str) => {
        return ('00' + str).substr(str.length)
      }
      let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + ''
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
        }
      }
      return fmt
    },
    //获取当前日期
    GetDateStr (AddDayCount) {
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
    GetbDate () {
      var dd = new Date();
      var y = dd.getFullYear();
      var m = dd.getMonth() + 1;
      var d = dd.getDate();
      return [y, m, d];
    },
    processingDate (obj) {
      let month = obj[1],
        day = obj[2];
      return (
        obj[0] +
        "-" +
        (month < 10 ? "0" + month : month) +
        "-" +
        (day < 10 ? "0" + day : day)
      );
    },
    goOrder () {
      let nArr = [];
      this.itemData.forEach((item, index) => {
        if (item.num > 0) {
          nArr.push(item);
        }
      });
      localStorage.setItem(
        "ticketType",
        JSON.stringify(nArr)
      );
      // localStorage.setItem("xjxc_vue_wap_2019_3_7_ticket_playDate", this.playDate);
      // this.closeModal();
      // this.goUrl("pages/scenic/order/main");
      this.$router.push("/order/router?playDate=" + this.playDate);
    },
    agree () {
      this.noticeShow = false;
      //缓存激活的票型下标
      if (this.activeIndexArr.indexOf(this.addActiveIndex) < 0) {
        this.activeIndexArr.push(this.addActiveIndex);
      }
      // console.log('activeIndexArr',this.activeIndexArr)
      this.itemData[this.addActiveIndex].num++;
      this.getTotal();
    },
    //加减运算
    sub (index) {
      if (this.itemData[index].num > 0) {
        this.itemData[index].num--;
        this.$set(this.itemData, index, this.itemData[index])
      }
    },
    add (index) {
      if (this.itemData[index].num >= this.itemData[index].stock) {
        this.itemData[index].num = this.itemData[index].stock;
        this.$vux.toast.text("总数量不得超过当前库存：" + this.itemData[index].stock, "middle");
      } else {
        this.itemData[index].num++;
      }
      this.$set(this.itemData, index, this.itemData[index])
    },
    //价格计算
    getTotal () {
      let _this = this,
        sum = 0;
      _this.itemData.forEach((item, index) => {
        sum += item.num * (item.salePrice * 100);
      });
      _this.totalPrice = (sum / 100).toFixed(2);
      return _this.totalPrice;
    },
    getPxData () {
      let _this = this;
      let itemUrl = "/merchant/api/merchantRouteInfo/listCalendarPriceMap";
      this.getAxios(itemUrl, {
        id: this.$route.query.id,
        beginMonth: _this.playDate,
        endMonth: _this.playDate
      }).then(res => {
        // console.log(res);
        this.itemData = res.data;
        this.itemData.map(item => {
          item.num = 0;
        })
        this.totalComputed();
      });
    },
    playDateChange (date) {
      this.date = date;
      this.playDate = this.GetDateStr(date);
      this.totalComputed();
      // this.getPxData();
      this.addNum = 0;
      this.number = 0;
      this.totalPrice = 0;
    },
    goNotice () {
      this.$router.push(
        "/detail/routerNotice?merchantRouteInfoId=" + this.$route.query.id
      );
    },
    //获取当前日期
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
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      // console.log(currentdate)
      return currentdate;
    }
  }
};
</script>
<style lang="scss">
@import "../../../assets/styles/mixin.scss";

.vux-popup-dialog {
  z-index: 601 !important;
}
.router-detail {
  padding-bottom: 49px;
  .notice-body {
    // width: 90%;
    background: #ffffff;
    // border-radius: 2px;
    .notice-title {
      text-align: center;
      color: #413838;
      font-size: 16px;
      // height: 30px;
      // line-height: 30px;
      margin-top: 10px;
    }
    .notice-content {
      padding: 0 10px;
      padding-bottom: 0px;
      max-height: 320px;
      overflow: auto;
      margin: 10px 0;
      text-align: left;
       img {
        width: 100% !important;
        height: auto !important;
      }
      strong,
      b {
        font-weight: bold;
      }
      em,
      i {
        font-style: italic;
      }
    }
    .footer {
      border-top: 0.5px solid #eeeee7;
      @include fbc;
      .no-agree {
        color: #413838;
        font-size: 16px;
        height: 49px;
        line-height: 49px;
        text-align: center;
        width: 50%;
      }
      .agree {
        color: #fff;
        background: #f05b47;
        font-size: 16px;
        height: 49px;
        line-height: 49px;
        text-align: center;
        width: 50%;
      }
    }
  }
  .px-ul {
    background: #fff;
    padding-bottom: 15px;
    height: 235px;
    overflow: auto;
    .px-li {
      @include fbc;
      height: 86px;
      padding: 0px 15px;
      .px-li-l {
        // margin-right: 15px;
        width: 185px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .px-name {
          @include sc(16px, #413838);
          @include oh(2);
        }
        .px-price {
          .unit {
            @include sc(12px, #fc4150);
          }
          .price {
            @include sc(18px, #f05b47);
          }
          .last-price {
            @include sc(12px, #999);
            text-decoration: line-through;
          }
        }
        .px-notice {
          @include sc(12px, #00699e);
          margin-top: 5px;
        }
      }
      .px-li-r {
        @include fbc;
        .num {
          @include sc(18px, #413838);
          margin-right: 15px;
        }
        .add-sub {
          display: flex;
          .handle-btn {
            height: 29px;
            line-height: 29px;
            display: inline-block;
            width: 44px;
            border: 1px solid #f05b47;
            text-align: center;
            color: #f05b47;
            font-size: 18px;
          }
          .sub {
            border-right: none;
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
          }
          .add {
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
          }
          .no-num {
            border-color: #ffc9c9;
            color: #ffc9c9;
          }
        }
      }
    }
  }
  .order-pop.vux-popup-dialog {
    z-index: 501 !important;
  }
  .mask {
    width: 100%;
    height: 100%;
    position: fixed;
    background: rgba(0, 0, 0, 0.3);
    z-index: 700;
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
  .time-select {
    z-index: 601;
    background: #ffffff;
    .handle-box {
      padding: 10px;
      @include fbc;
      .cancel {
        @include sc(16px, #999);
      }
      .sure {
        @include sc(16px, #0ce476);
      }
      .handle-btn {
        padding: 3px 10px;
        border: none;
        background: #fff;
      }
    }
  }
  .time-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 600;
  }
  .order-content {
    height: 464.5px;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    position: relative;
    .px-footer {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      background: #fff;
      @include fbc;
      .num-price {
        margin-left: 15px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .select-num {
          @include sc(13px, #413838);
          height: 12px;
        }
        .price {
          @include sc(13px, #413838);
          .text {
          }
          .price-info {
            display: inline-block;
            .price-unit {
              @include sc(12px, #f05b47);
            }
            .price-num {
              @include sc(18px, #f05b47);
            }
          }
        }
      }
      .px-next {
        width: 50%;
        background: #cbcbcb;
        &.active {
          background: #f05b47;
        }
      }
    }
    .select-ticket-title {
      @include sc(18px, #413838);
      height: 56.5px;
      line-height: 56.5px;
      padding-left: 15px;
      .select-ticket-notice {
        color: #999;
        font-size: 14px;
        padding-left: 5px;
        &.active {
          color: #f05b47;
        }
      }
    }
    .play-date {
      // padding: 1px 0;
      .hotel-date {
        height: 38px;
        padding-left: 15px;
        text-align: center;
        .date-box {
          width: 66px;
          height: 34px;
          line-height: 34px;
          border-radius: 2px;
          margin-right: 15px;
          float: left;
          background-color: #fff;
          color: #413838;
        }
        .date-select {
          background-color: #f05b47;
          color: #fff;
        }
        .date-more {
          width: 109px;
          margin: 0px;
        }
      }

      .weui-cells {
        margin-top: 0;
        .select-play-date {
          .weui-cell {
            .vux-label {
              @include sc(16px, #413838);
            }
            .vux-cell-value {
              @include sc(13px, #413838);
            }
            .weui-cell__ft::after {
              border-width: 1px 1px 0 0;
              border-color: #f05b47;
              height: 7px;
              width: 7px;
            }
          }
        }
      }
    }
    .time-info {
      @include fbc;
      background: #fff;
      height: 45px;
      padding-left: 15px;
      .text {
        @include sc(16px, #413838);
      }
      .time-select {
        padding-right: 15px;
        padding-left: 20px;
        height: 45px;
        line-height: 45px;
        .day {
          @include sc(13px, #413838);
        }
        .icon-iconfont-jiantou {
          @include sc(12px, #f05b47);
        }
      }
    }
    .order-content-title {
      @include fbc;
      height: 58px;
      padding-left: 15px;
      @include sc(18px, #413838);
      .icon-guanbi2 {
        @include sc(22px, #b2b2b2);
        padding: 5px 15px 5px 10px;
      }
    }
  }
  .bottom-warpper {
    @include fbc;
    background: #fff;
    .home-page {
      padding: 0 15px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      .icon-shouye {
        font-size: 25px;
        height: 30px;
      }
    }
    .market-page {
      display: flex;
      border-left: 1px solid #d1d1d1;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      float: left;
      height: 49px;
      width: 70px;
      @include sc(14px, #ffa628);
      .market-icon {
        line-height: 23px;
        @include sc(23px, #ffa628);
      }
    }
    .order {
      border: none;
      outline: none;
      background: #f05b47;
      @include sc(16px, #fff);
      text-align: center;
      height: 49px;
      line-height: 49px;
      width: 172px;
    }
  }
  .router-position {
    line-height: 54px;
    padding: 0px 15px;
    @include sc(16px, #413838);
  }
  .linearGradient {
    background-image: linear-gradient(to bottom, #f2f2f2, #fff);
    height: 20px;
  }
  .ticket-detail-warpper {
    background: #fff;
    .comment-title {
      padding: 0px 15px;
      @include fbc;
      .comment-more {
        @include sc(13px, #f05b47);
        line-height: 18px;
      }
    }
    .ticket-w-title {
      @include sc(18px, #413838);
      font-weight: 600;
      padding: 20px 0px 20px 15px;
    }
    .ticket-detail-box {
      padding: 0px 15px 20px 15px;
      img {
        width: 100%;
      }
    }
    .comment-ul {
      .comment-li {
        .user-info {
          @include fbc;
          .img-name {
            @include fbc;
            .logo-img {
              width: 20px;
              height: 20px;
              border-radius: 10px;
            }
            .name {
              @include sc(14px, #5c5c5c);
              margin-left: 12px;
            }
          }
          .comment-time {
            @include sc(12px, #999);
          }
        }
        .comment-content {
          margin-top: 8px;
          @include sc(14px, #413838);
        }
      }
    }
    .no-comment {
      @include sc(12px, #767676);
      text-align: center;
      padding: 82px 0;
      padding-top: 14px;
    }
  }
  .ticket-n-intro {
    @include fbc;
    height: 123.5px;
    background: #fff;
    margin-bottom: 10px;
    .ticket-l {
      width: calc(100% - 61.5px);
      padding-left: 15px;
      .ticket-name {
        @include sc(18px, #413838);
        font-weight: 600;
        @include oh;
      }
      .ticket-subtitle {
        @include sc(12px, #5c5c5c);
        @include oh;
      }
      .ticket-price {
        margin-top: 5px;
        .unit {
          @include sc(12px, #fc4150);
        }
        .price {
          @include sc(18px, #fc4150);
        }
        .min-text {
          @include sc(9px, #5c5c5c);
          margin-right: 3px;
        }
        .router-label {
          @include sc(9px, #f05b47);
          margin-left: 10px;
          border: 1px solid #f05b47;
          display: inline-block;
          border-radius: 2px;
          padding: 0px 4px;
          vertical-align: text-bottom;
          line-height: 15px;
        }
        .t-l-price {
          @include sc(12px, #5c5c5c);
          text-decoration: line-through;
        }
      }
      .order-t-n {
        @include sc(10px, #00699e);
      }
    }
    .ticket-r {
      display: flex;
      width: 61.5px;
      height: 100%;
      align-items: center;
      background: #fafafa;
      .ticket-r-img {
        height: 20px;
        width: 21.5px;
        margin: 0 auto;
      }
    }
  }
  .vux-slider {
    .vux-indicator {
      bottom: 2px;
      a {
        margin-left: 5.5px;
        i {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.4);
          &.active {
            background-color: #fff !important;
          }
        }
      }
    }
  }
}
</style>


