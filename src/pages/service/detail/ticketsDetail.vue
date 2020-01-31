

<template>
  <div class="tickets-detail" :class="{ overflow: show }">
    <swiper
      v-if="imgUrls.length > 1"
      auto
      loop
      :interval="2000"
      height="5.906667rem"
      class="text-scroll"
      dots-position="center"
    >
      <swiper-item v-for="(imgUrl, index) in imgUrls" :key="index">
        <img
          style="width:100%;height:100%"
          :src="imgUrl + '?imageMogr2/thumbnail/640x/strip/quality/100'"
          alt
        />
      </swiper-item>
    </swiper>
    <img
      v-if="imgUrls.length == 1"
      style="width:100%;height:5.906667rem;"
      :src="imgUrls[0] + '?imageMogr2/thumbnail/640x/strip/quality/100'"
      alt
    />
    <div class="tickets-info">
      <h3 class="tickets-name">{{ detailData.name }}</h3>
      <h5 class="tickets-subtitle">{{ detailData.subTitle }}</h5>
      <div class="tickets-labels">
        <span
          class="tickets-label"
          v-for="(ite, index) in detailData.labels"
          :key="index"
          >{{ ite }}</span
        >
      </div>
      <div class="tickets-sell-core">
        <div class="tickets-core-wrap">
          <span class="tickets-core">{{ detailData.commentScore }}</span
          >分
        </div>
        <div class="tickets-num">{{ detailData.salesNum }}人已购买</div>
      </div>
    </div>
    <div class="tickets-reason">
      <div class="tickets-reason-title-wrap">
        <div class="tickets-reason-title">
          <img src="../../../assets/images/jinpai.png" alt="" />
          <span>推荐理由</span>
        </div>
      </div>
      <div class="tickets-reason-content">
        <ul>
          <li v-for="(ite, index) in detailData.recommendReason" :key="index">
            <span></span>{{ ite }}
          </li>
        </ul>
      </div>
    </div>
    <!--景区门票票型交互直接展示-->
    <div class="order-content-box m-b-10">
      <div class="order-content">
        <!-- 日历选择 -->
        <group class="play-date">
          <slideCalendar
            :showPrice="showPrice"
            ref="slideCalendar"
            :slideDate="value2"
            @selectCalendar="playDateChange"
          ></slideCalendar>
        </group>
      </div>
    </div>
    <div class="tickets-content-list-wrap">
      <div :class="isFixed ? 'tickets-content-list-fixed' : ''">
        <div class="tickets-content-list">
          <div
            class="tickets-content-item-wrap"
            @click="scrollTo('detail0', 0)"
            :class="current == 0 ? 'tickets-content-current' : ''"
          >
            <div class="tickets-content-item">
              套票
            </div>
          </div>
          <div
            class="tickets-content-item-wrap"
            @click="scrollTo('detail1', 1)"
            :class="current == 1 ? 'tickets-content-current' : ''"
          >
            <div class="tickets-content-item">
              详情
            </div>
          </div>
          <div
            class="tickets-content-item-wrap"
            @click="scrollTo('detail2', 2)"
            :class="current == 2 ? 'tickets-content-current' : ''"
          >
            <div class="tickets-content-item">
              须知
            </div>
          </div>
          <div
            class="tickets-content-item-wrap"
            @click="scrollTo('detail3', 3)"
            :class="current == 3 ? 'tickets-content-current' : ''"
          >
            <div class="tickets-content-item">
              评论
            </div>
          </div>
          <div
            class="tickets-content-block"
            :style="{ left: 12.5 * current * 2 + 12.5 + '%' }"
          ></div>
        </div>
      </div>
      <div ref="refHeight" id="navBar"></div>
    </div>
    <div class="ticket-detail-warpper m-b-10" ref="detail0">
      <div class="tickets-arr">
        <!-- <div class="tickets-arr-title">{{arr.groupName}}</div> -->
        <div
          class="tickets-content"
          v-for="(item, inde) in noGroupList"
          :key="inde"
          :class="inde + 1 == noGroupList.length ? 'tickets-content-last' : ''"
        >
          <div class="tickets-content-left">
            <div class="tickets-content-title">{{ item.modelName }}</div>
            <div class="tickets-content-label">
              <span
                v-for="(ite, ind) in item.modelLabel"
                style="border-width:0.5px;"
                :key="ind"
                >{{ ite }}</span
              >
            </div>
            <div
              class="tickets-content-detail"
              @click="productDetail(item)"
              :class="
                item.modelLabel.length <= 1
                  ? 'tickets-content-detail-inline'
                  : ''
              "
            >
              查看详情 >
            </div>
          </div>
          <div class="tickets-content-right">
            <div class="tickets-price"><span>￥</span>{{ item.salePrice }}</div>
            <div class="tickets-buy-btn" @click="goBook(item)">立即预定</div>
          </div>
        </div>
      </div>
      <div class="tickets-arr" v-for="(arr, index) in groupVos" :key="index">
        <div v-show="arr.merchantFamilyTicketVos.length">
          <div class="tickets-arr-title">{{ arr.groupName }}</div>
          <div
            class="tickets-content"
            v-for="(item, inde) in arr.merchantFamilyTicketVos"
            :key="inde"
            :class="
              inde + 1 == arr.merchantFamilyTicketVos.length
                ? 'tickets-content-last'
                : ''
            "
          >
            <div class="tickets-content-left">
              <div class="tickets-content-title">{{ item.modelName }}</div>
              <div class="tickets-content-label">
                <span
                  v-for="(ite, ind) in item.modelLabel"
                  style="border-width:0.5px;"
                  :key="ind"
                  >{{ ite }}</span
                >
              </div>
              <div
                class="tickets-content-detail"
                @click="productDetail(item)"
                :class="
                  item.modelLabel.length <= 1
                    ? 'tickets-content-detail-inline'
                    : ''
                "
              >
                查看详情 >
              </div>
            </div>
            <div class="tickets-content-right">
              <div class="tickets-price">
                <span>￥</span>{{ item.salePrice }}
              </div>
              <div class="tickets-buy-btn" @click="goBook(item)">立即预定</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="ticket-detail-warpper m-b-10" ref="detail1">
      <h2 class="ticket-w-title">详情</h2>
      <div class="ticket-detail-box">
        <div v-html="proDetail"></div>
      </div>
    </div>
    <div class="ticket-detail-warpper m-b-10" ref="detail2">
      <h2 class="ticket-w-title">须知</h2>
      <div class="ticket-detail-box">
        <div v-html="buyNotes"></div>
      </div>
    </div>
    <!-- 评论列表 -->
    <div ref="detail3">
      <comment
        :data="commentData"
        mold="family"
        :id="$route.query.merchantFamilyInfoId"
        :param="commentParam"
        :url="commentUrl"
      ></comment>
    </div>
    <div v-if="shardFlag" @click="closeModal" class="shard-where">
      <img src="@/assets/images/weixin_sharetip.png" alt />
    </div>
    <float-nav></float-nav>
    <!-- 产品详情 -->
    <div v-show="productDetailShow" class="order-detail-modal">
      <div class="order-detail-wrap">
        <div class="order-detail-close">
          <i class="xx-icon icon-cha1" @click="productDetailShow = false"></i>
        </div>
        <img
          v-show="currentProduct.linkMobileImg"
          :src="currentProduct.linkMobileImg"
          style="width: 100%;"
          alt=""
        />
        <div class="order-detail-title">{{ currentProduct.modelName }}</div>
        <div class="order-detail-content">
          <div class="order-detail-h1">费用明细</div>
          <ul>
            {{
              currentProduct.feeDetail
            }}
          </ul>
        </div>
      </div>
      <div class="order-detail-mask" @click="productDetailShow = false"></div>
    </div>
    <!-- 预定须知 -->
    <x-dialog v-model="modalNoticeFlag" class="dialog-demo">
      <div class="notice-body">
        <h2 class="notice-title">预定提醒</h2>
        <div class="notice-content" v-html="product.bookRemind"></div>
        <div class="tickets-footer">
          <span @click="modalNoticeFlag = false" class="no-agree">不同意</span>
          <span @click="bookAgree" class="agree">同意</span>
        </div>
      </div>
    </x-dialog>
    <page-footer v-if="footerShow" :pageData="footerData"></page-footer>
    <!-- <mutil-calendar ref="singeCalendar" @getDate="getAbleDate" :activeDate="playDate"></mutil-calendar> -->
  </div>
</template>
<script>
import { mapState } from "vuex";
import photo from "@/components/photo";
import floatNav from "@/components/floatNav";
import pageFooter from "@/components/custompage/footer.vue";
import comment from "@/components/comment";
// import slideCalendar from "@/components/slideCalendar"; // 滑动日期组件
import slideCalendar from "@/components/ticketsSlideCalendar"; // 套票滑动日期组件
import mutilCalendar from "@/components/mutilCalendar"; // 单票日历组件
import { isWxAli } from "@/common/common";
import { linkBaseUrl } from "../../../../config/index";
import { wxShare } from "@/common/wxshare";
import {
  Swiper,
  SwiperItem,
  Popup,
  DatetimeView,
  Group,
  Calendar,
  XDialog
} from "vux";
export default {
  components: {
    photo,
    Swiper,
    floatNav,
    pageFooter,
    SwiperItem,
    Popup,
    DatetimeView,
    Group,
    Calendar,
    XDialog,
    comment,
    slideCalendar,
    mutilCalendar
  },
  computed: {
    ...mapState({
      pageNoScroll: state => {
        //   console.log(state)
        return state.pageNoScroll;
      }
    })
  },
  data() {
    return {
      footerShow: false,
      footerData: {},
      product: {
        // 票型详情
        bookRemind: ""
      },
      productDetailShow: false, // 产品详情
      groupVos: [],
      noGroupList: [],
      current: 0,
      refHeight: 0,
      documentScrollHeight: 0,
      isFixed: false,
      pxType: "",
      expandedShow: false, //是否展示推广
      routeContentFlag: false,
      routeContent: "", //跟团游信息
      routeData: [], //跟团游信息
      shardFlag: false, //分享wx
      modalNoticeFlag: false, //预订须知弹框
      modalNotice: "", //门票预定须知
      modalNoticeTitle: "", //弹框标题
      timeArr: [], //分时预约数组
      timeIndexArr: [],
      fsyuArr: [],
      indexArr: [],
      number: 0,
      addNum: 0,
      noticeStr: "",
      noticeShow: false,
      totalPrice: 0,
      isSinglebuy: 1,
      itemData: [],
      value2: this.getCurDate(),
      show: false,
      wayType: 1,
      playDate: "",
      detailData: {},
      commentData: {},
      imgUrls: [],
      currentProduct: {}, // 当前查看产品详情
      proDetail: "", // 产品详情
      buyNotes: "", // 预定须知
      activeIndexArr: [], //缓存需要提示购票的下标index
      expandedParam: {
        businessId: this.$route.query.id,
        businessType: "park"
      },
      commentUrl: "",
      commentParam: {
        wayType: 1,
        productType: "family",
        id: this.$route.query.merchantFamilyInfoId,
        leaguerId:
          localStorage.getItem("xjsc_login_userId_2019_3_8") ||
          this.$cookie.get("leaguerInfoId")
      },
      wxshareinfo: {},
      showPrice: false
    };
  },
  created() {
    document.title = "套票详情";
    this.commentUrl = this.api.main.comment.list;
    let _this = this;
    this.getAxios(this.api.aiPapi.getUsePage, {
      pageType: "navigationPage",
      useRange: "wap"
    }).then(res => {
      if (res.data && res.data.content) {
        let data = JSON.parse(res.data.content);
        //判断首页是否存在底部导航
        // console.log(1)
        // this.bootomFooterShow =
        //   this.newCustomFooteerData.range.indexOf("homepage") > -1;

        if (data.list && data.list.length) {
          this.footerShow = true;
          this.footerData = data;
        }
      }
    });
    this.playDate = this.getCurDate();
    let detailUrl = this.api.tickets.detail.main;
    let dParam = {
      merchantInfoId: this.$route.query.m_id,
      merchantFamilyInfoId: this.$route.query.merchantFamilyInfoId
    };
    // 是否展示推广
    // this.getAxios("/merchant/api/merchantInfo/showQyTab", {
    //   leaguerInfoId:
    //     localStorage.getItem("xjsc_login_userId_2019_3_8") ||
    //     this.$cookie.get("leaguerInfoId") ||
    //     ""
    // }).then(res => {
    //   this.expandedShow = res.message == "T";
    // });

    //产品详情
    let pd = this.postAxios(detailUrl, dParam);
    // 套票分组
    this.getArr();
    Promise.all([pd])
      .then(result => {
        this.$nextTick(() => {
          window.addEventListener("scroll", () => {
            this.refHeight = this.$refs.refHeight
              ? this.$refs.refHeight.offsetTop
                ? this.$refs.refHeight.offsetTop
                : 450
              : 450;
            this.documentScrollHeight =
              document.documentElement.scrollTop ||
              document.body.scrollTop ||
              window.pageYOffset;
            let height =
              window.innerHeight ||
              document.documentElement.clientHeight ||
              document.body.clientHeight;
            let offsetHeight =
              document.body.scrollHeight ||
              document.documentElement.scrollHeight;
            let scrollHeight = this.documentScrollHeight;
            let offsetTop1 = this.$refs.detail1
              ? this.$refs.detail1.offsetTop
                ? this.$refs.detail1.offsetTop
                : this.$refs.refHeight.offsetTop
                ? this.$refs.refHeight.offsetTop
                : 450
              : 450;
            let offsetTop2 = this.$refs.detail2
              ? this.$refs.detail2.offsetTop
                ? this.$refs.detail2.offsetTop
                : offsetTop1
              : offsetTop1;
            let offsetTop3 = this.$refs.detail3
              ? this.$refs.detail3.offsetTop
                ? this.$refs.detail3.offsetTop
                : offsetTop2
              : offsetTop2;
            if (
              scrollHeight > this.refHeight &&
              scrollHeight < offsetTop1 - 42
            ) {
              this.current = 0;
            } else if (
              scrollHeight >= offsetTop1 - 42 &&
              scrollHeight < offsetTop2 - 42
            ) {
              this.current = 1;
            } else if (
              scrollHeight >= offsetTop2 - 42 &&
              scrollHeight < offsetTop3 - 42
            ) {
              this.current = 2;
            } else if (
              scrollHeight >= offsetTop3 - 42 ||
              scrollHeight + height == offsetHeight
            ) {
              this.current = 3;
            }
            if (this.documentScrollHeight >= this.refHeight) {
              this.isFixed = true;
            } else {
              this.isFixed = false;
            }
          });
        });

        _this.detailData = result[0].data;
        _this.detailData.labels = JSON.parse(_this.detailData.labels);
        _this.detailData.recommendReason = JSON.parse(
          _this.detailData.recommendReason
        );
        _this.showPrice = result[0].data.isDisplayPrice === "T"; // 是否展示日历价格
        _this.imgUrls = result[0].data.carouselImg
          ? result[0].data.carouselImg
          : [];
        let contentStr = result[0].data.proDetail;
        wxShare({
          title: result[0].data.name ? result[0].data.name : "",
          desc: _this.detailData.subTitle ? _this.detailData.subTitle : "",
          imgUrl: _this.imgUrls.length ? _this.imgUrls[0] : ""
        });
        _this.wxshareinfo = {
          title: result[0].data.name ? result[0].data.name : "",
          desc: _this.detailData.subTitle ? _this.detailData.subTitle : "",
          imgUrl: _this.imgUrls.length ? _this.imgUrls[0] : ""
        };
        contentStr = contentStr.replace(
          /<img [^>]*src=['"]([^'"]+)[^>]*>/gi,
          function(match, capture) {
            //capture,返回每个匹配的字符串
            var newStr =
              '<img src="' +
              capture +
              "?imageMogr2/thumbnail/750x/strip/quality/100" +
              '" alt="" />';
            return newStr;
          }
        );
        _this.proDetail = contentStr;
        _this.buyNotes = result[0].data.buyNotes.replace(
          /<img [^>]*src=['"]([^'"]+)[^>]*>/gi,
          function(match, capture) {
            //capture,返回每个匹配的字符串
            var newStr =
              '<img src="' +
              capture +
              "?imageMogr2/thumbnail/750x/strip/quality/100" +
              '" alt="" />';
            return newStr;
          }
        );
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
      .catch(error => {});
  
  
  
  },
  destroyed() {
    window.addEventListener("scroll", null);
  },
  mounted() {
    // this.commentUrl = this.api.main.comment.list;
  },
  destroyed() {
    clearInterval(this.setIntervalTime);
  },
  methods: {
    getArr() {
      this.postAxios("/merchant/api/merchantFamilyInfo/familyTicketList", {
        merchantInfoId: this.$route.query.m_id,
        merchantFamilyInfoId: this.$route.query.merchantFamilyInfoId,
        dateStr: this.playDate
      }).then(res => {
        if (res.status == 200) {
          this.groupVos = res.data.groupVos || [];
          this.noGroupList = res.data.noGroupList || [];
          this.groupVos.map(item => {
            item.merchantFamilyTicketVos.map(ite => {
              ite.modelLabel = JSON.parse(ite.modelLabel);
            });
          });
          this.noGroupList.map(item => {
            item.modelLabel = JSON.parse(item.modelLabel);
          });
        } else {
        }
      });
    },
    productDetail(item) {
      this.currentProduct = item;
      this.currentProduct.linkMobileImg =
        item.carousalImg && item.carousalImg.length ? item.carousalImg[0] : "";
      this.productDetailShow = true;
    },
    scrollTo(detail, current) {
      window.scrollTo(
        0,
        this.$refs[detail].offsetTop - this.$refs.refHeight.clientHeight
      );
      this.$nextTick(() => {
        this.current = current;
      });
    },
    closeModal() {
      this.shardFlag = false;
      this.show = false;
    },
    goBook(item) {
      this.product = item;
      if (item.ticketNotice == "T") {
        this.modalNoticeFlag = true;
      } else {
        this.bookAgree();
      }
    },
    bookAgree() {
      localStorage.setItem("productDetal", JSON.stringify(this.product));
      this.$router.push({
        path: "/order/tickets",
        query: {
          merchantFamilyInfoId: this.$route.query.merchantFamilyInfoId,
          merchantFamilyTicketId: this.product.id,
          playDate: this.playDate,
          m_id: this.$route.query.m_id
        }
      });
    },
    showRouteContent(content) {
      this.routeContentFlag = true;
      this.routeContent = content;
    },
    showShard(flag) {
      this.shardFlag = flag;
      this.show = true;
    },
    showTicketNotice(item) {
      // console.log(item);
      this.modalNotice = item.bookRemind;
      this.modalNoticeTitle = item.nickName || item.modelName;
      this.modalNoticeFlag = true;
    },
    settimeIndex(index, i, timeIndex, num) {
      if (num && num > 0) {
        this.$set(this.timeIndexArr[index], i, timeIndex);
      }
    },
    order() {
      // this.checkToken().then(res => {
      //   this.show = true;
      // });
      // this.show = true;
      this.goOrder();
    },
    goOrder() {
      let nArr = [];
      this.itemData.forEach((item, index) => {
        item.ticketList.forEach((it, i) => {
          if (it.num > 0) {
            nArr.push(
              Object.assign(
                it,
                it.isFsyy == "T"
                  ? this.timeArr[index][i] && this.timeArr[index][i].length
                    ? {
                        FsyyTimes: this.timeArr[index][i][
                          this.timeIndexArr[index][i]
                        ]
                      }
                    : {}
                  : {}
              )
            );
          }
        });
      });
      // console.log(nArr);
      if (nArr.length) {
        localStorage.setItem(
          "xjxc_vue_wap_2019_3_7_ticket_orderData",
          JSON.stringify(nArr)
        );
        let env = isWxAli();
        let url, nextUrl;

        if (nArr.length === 1) {
          // 一票一码
          url =
            "/order/ticket?playDate=" +
            this.playDate +
            "&scenicId=" +
            this.detailData.id +
            "&ticketId=" +
            nArr[0].id +
            "&m_id=" +
            this.$route.query.m_id;
        } else {
          // console.log("11");
          //阿里。微信
          url =
            "/order/ticket?playDate=" +
            this.playDate +
            "&m_id=" +
            this.$route.query.m_id;
        }

        if (this.$route.query.spread_code || this.$route.query.promoteCode) {
          //如果有推广码
          url +=
            "&spread_code=" + this.$route.query.spread_code ||
            this.$route.query.promoteCode;
        }
        if (this.$route.query.isSpecial) {
          url += "&isSpecial=" + this.$route.query.isSpecial;
        }

        nextUrl =
          document.location.protocol +
          "//" +
          window.location.host +
          "/vue" +
          url;
        this.checkToken(nextUrl).then(res => {
          //保证在登陆状态，详情页面跳转下单页面的时候缓存的下个页面地址被清除，防止换个店铺后token在过期状态下使用nextUrl进入别的地址
          localStorage.removeItem("xjsc_nextpath_2019_4_20");

          this.$router.push(url);
        });
      } else {
        // this.$vux.toast.text('请选择票型', 'middle')
      }
    },
    agree() {
      this.noticeShow = false;
      //缓存激活的票型下标
      // console.log('activeIndexArr',this.activeIndexArr)
      this.realAdd();
    },
    //加减运算
    sub(index, i) {
      let item = this.itemData[index].ticketList[i];
      if (item.num > 0) {
        item.num--;
        if (item.num == 0) {
          //当减少到0的时候，分时预约列表不展示,重置对应的分时预约和激活下标
          // this.timeArr.splice(index, 1, []);
          // this.timeIndexArr.splice(index, 1, 0);
          // //最终要的一部，当num==0的时候，一定要去除activeIndexArr中的下标
          // this.activeIndexArr.splice(this.activeIndexArr.indexOf(index),1)
        }
        this.getTotal();
      }
    },
    realAdd() {
      if (
        this.activeIndexArr.indexOf(
          this.addActiveIndex + "-" + this.addActiveI
        ) < 0
      ) {
        this.activeIndexArr.push(this.addActiveIndex + "-" + this.addActiveI);
      }
      if (this.isSinglebuy == "2") {
        //单票新
        // let sttArr = [];
        if (
          this.indexArr.indexOf(this.addActiveIndex + "-" + this.addActiveI) < 0
        ) {
          this.indexArr.push(this.addActiveIndex + "-" + this.addActiveI);
          this.addNum++;
        }

        this.itemData.forEach((item, index) => {
          item.ticketList.forEach((it, i) => {
            let item = this.itemData[index].ticketList[i];
            if (this.addActiveIndex == index && this.addActiveI == i) {
              item.num++;
            } else {
              item.num = 0;
            }
          });
        });
      } else {
        //多票型
        this.itemData[this.addActiveIndex].ticketList[this.addActiveI].num++;
      }
      this.getTotal();
    },
    ifShowModel() {
      let item = this.itemData[this.addActiveIndex].ticketList[this.addActiveI];
      if (item.isShowTicketNotice == "T") {
        //// 购票是否提醒
        // console.log('show')
        //判断原先是够已经同意了提醒
        if (
          this.activeIndexArr.indexOf(
            this.addActiveIndex + "-" + this.addActiveI
          ) < 0 ||
          item.num == 0
        ) {
          this.noticeStr = item.ticketNotice ? item.ticketNotice : "";
          this.noticeShow = true;
        } else {
          this.realAdd();
        }
      } else {
        this.realAdd();
      }
    },
    add(index, i) {
      //缓存当前index
      this.addActiveIndex = index;
      this.addActiveI = i;
      if (this.itemData[index].ticketList[i].isFsyy == "T") {
        //是不是分时预约
        if (!this.timeArr[index][i]) {
          this.postAxios("/order/api/timeReserveList", {
            externalCode: this.itemData[index].ticketList[i].externalCode,
            startTime: this.playDate,
            endTime: this.playDate
          }).then(res => {
            this.timeArr[index].splice(i, 1, res.data);
            // console.log(this.timeArr);
            if (res.data.length) {
              this.ifShowModel();
            } else {
              if (
                this.activeIndexArr.indexOf(
                  this.addActiveIndex + "-" + this.addActiveI
                ) < 0
              ) {
                this.activeIndexArr.push(
                  this.addActiveIndex + "-" + this.addActiveI
                );
              }
            }
          });
        } else {
          this.ifShowModel();
        }
      } else {
        this.ifShowModel();
      }

      // this.getTotal();
    },
    //价格计算
    getTotal() {
      let _this = this,
        sum = 0;
      _this.number = 0;
      _this.itemData.forEach((item, index) => {
        item.ticketList.forEach((it, i) => {
          _this.number += it.num;
          sum += it.num * ((it.priceSettle ? it.priceSettle : 0) * 100);
        });
      });
      _this.totalPrice = (sum / 100).toFixed(2);
      return _this.totalPrice;
    },
    // 查看可选日期
    showAbleDate(it) {
      this.$refs.singeCalendar.show({
        date: this.playDate,
        ticketId: it.id
      });
    },
    formatterPx(res) {
      let timeArr = [];
      let timeIndexArr = [];
      res.data.forEach((item, index) => {
        //初始化分时预约数组
        timeArr[index] = new Array(item.ticketList.length);
        //初始化分时预约激活下标数组
        timeIndexArr[index] = new Array(item.ticketList.length).fill(0);
        item.ticketList.forEach((it, i) => {
          res.data[index].ticketList[i].num = 0;
        });
      });
      this.timeIndexArr = timeIndexArr;
      this.timeArr = timeArr;
      this.itemData = res.data;
    },
    playDateChange(date) {
      this.playDate = date;
      this.addNum = 0;
      this.number = 0;
      this.totalPrice = 0;
      this.getArr();
    },
    getAbleDate(day) {
      this.playDate = day.date;
      this.$refs.slideCalendar.getSingeDate({ day });
      this.addNum = 0;
      this.number = 0;
      this.totalPrice = 0;
    },
    goNotice() {
      this.$router.push({
        path: "/detail/ticketNotice",
        query: {
          merchantParkInfoId: this.$route.query.id,
          productType: "ticket"
        }
      });
    },
    //获取当前日期
    getCurDate() {
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
      return currentdate;
    },
    //打开地图
    openMap(latlnt, addr) {
      window.location.href =
        "//uri.amap.com/navigation?to=" +
        latlnt +
        "," +
        addr +
        "&mode=car&callnative=1";
    }
  }
};
</script>
<style lang="scss">
@import "../../../assets/styles/mixin.scss";

.vux-popup-dialog {
  z-index: 601 !important;
}
.tickets-detail {
  padding-bottom: 49px;
  .notcie {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 15px;
    background: #fff;
    margin-bottom: 5px;
    .notice-title {
      white-space: nowrap;
      display: flex;
      align-items: center;
      padding-right: 16px;
      @include sc(14px, #f05b47);
      .notice-img {
        height: 14px;
        width: 14px;
        margin-right: 2px;
      }
    }
    .notice-content {
      flex: 1;
      overflow: hidden;
      @include sc(14px, #413838);
      &.notice-no-padding {
        padding: 0;
      }
      .notice-info {
        white-space: nowrap;
        display: inline-block;
      }
    }
  }
  .route-content {
    .route-warpper {
      max-height: 200px;
      word-break: break-all;
      text-align: left;
      overflow: auto;
      img {
        width: 100%;
      }
    }

    padding: 15px 15px;
  }
  .shard-where {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    img {
      width: 250px;
      height: 300px;
      position: absolute;
      top: 0;
      right: -22px;
    }
  }
  &.overflow {
    overflow: hidden;
    height: 100%;
    padding-bottom: 0;
  }
  .notice-modal {
    padding: 10px;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .text {
        text-align: left;
        width: 75%;
        font-size: 16px;
        word-break: break-all;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        /* ! autoprefixer: off */
        -webkit-box-orient: vertical;
        /* autoprefixer: on */
        overflow: hidden;
      }
      .xx-icon {
        font-size: 20px;
        padding: 5px;
      }
    }
    .notice-book-content {
      width: 100%;
      margin-top: 10px;
      max-height: 250px;
      overflow-y: auto;
      text-align: left;
      word-break: break-all;
      padding: 0;
      img {
        width: 100%;
      }
    }
  }
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
    .tickets-footer {
      height: 48px;
      @include fbc;
      .no-agree {
        border-top: 1px solid #eeeee7;
        color: #413838;
        font-size: 16px;
        height: 48px;
        line-height: 48px;
        text-align: center;
        width: 50%;
      }
      .agree {
        color: #fff;
        background: #f05b47;
        font-size: 16px;
        height: 48px;
        line-height: 48px;
        text-align: center;
        width: 50%;
      }
    }
  }
  .px-ul {
    background: #fff;
    // padding: 15px 0;
    // padding-top: 0px;
    margin-bottom: 10px;
    padding-bottom: 5px;
    // height: 235px;
    // overflow: auto;
    .fsyy-error {
      margin-top: 5px;
      color: #f05b47;
      font-size: 14px;
      margin-left: 15px;
    }
    .time-list {
      margin-top: 5px;
      margin-left: 15px;
      .time-item {
        padding: 3px 5px;
        display: inline-block;
        margin-right: 5px;
        border: 1px solid #aaa;
        border-radius: 4px;
        font-size: 12px;
        color: #413838;
        margin-bottom: 5px;
        &.active {
          border-color: #f05b47;
          color: #f05b47;
        }
        &.no-num {
          border-color: #ccc;
          color: #ccc;
        }
      }
    }
    .px-li-content {
      margin-bottom: 15px;
      .px-li-title {
        display: flex;
        align-items: center;
        height: 36px;
        padding: 5px 15px;
        // margin-bottom: 10px;
        border-bottom: 1px solid #eee;
        border-top: 1px solid #eee;
        // &:first-child{
        //   border-top: none;
        // }
        .icon-box {
          background: #19a0f0;
          margin-right: 5px;
          width: 18px;
          height: 18px;
          line-height: 18px;
          border-radius: 50%;
          text-align: center;
          .xx-icon {
            font-size: 12px;
            color: #fff;
          }
        }
        .px-li-text {
          display: flex;
          align-items: center;
          flex: 1;
          font-size: 18px;
          color: #413838;
          i.icon-icon-ticket {
            font-size: 0.25rem;
            display: inline-block;
            vertical-align: middle;
            // margin-left: 0.75rem;
            width: 0.55rem;
            height: 0.55rem;
            line-height: 0.55rem;
            /* display: block; */
            border-radius: 100%;
            background-color: #19a0f0;
            color: #fff;
            text-align: center;
          }
          span {
            display: inline-block;
            vertical-align: middle;
            margin-left: 0.05rem;
            width: 75%;
            word-break: break-all;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            /* ! autoprefixer: off */
            -webkit-box-orient: vertical;
            /* autoprefixer: on */
            overflow: hidden;
            margin-left: 5px;
          }
        }
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
    .px-li-list {
      padding-top: 10px;
    }
    .px-li {
      @include fbc;
      padding: 0 15px;
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
            @include sc(12px, #f05b47);
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
        .show-able-canelndar {
          font-size: 12 px;
          height: 29px;
          line-height: 29px;
          display: inline-block;
          width: 90px;
          border: 1px solid #cacaca;
          text-align: center;
          color: #ababab;
          border-radius: 4px;
        }
      }
    }
  }
  .order-pop.vux-popup-dialog {
    z-index: 501 !important;
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
  .order-content-box {
    padding-top: 0.125rem;
  }
  .order-content {
    // height: 464.5px;
    // padding-bottom: 50px;
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
      // .num-price {
      //   margin-left: 15px;
      //   display: flex;
      //   flex-direction: column;
      //   justify-content: center;
      //   .select-num {
      //     @include sc(13px, #413838);
      //     height: 12px;
      //   }
      //   .price {
      //     @include sc(13px, #413838);
      //     .text {
      //     }
      //     .price-info {
      //       display: inline-block;
      //       .price-unit {
      //         @include sc(12px, #f05b47);
      //       }
      //       .price-num {
      //         @include sc(18px, #f05b47);
      //       }
      //     }
      //   }
      // }
      .px-next {
        width: 50%;
        background: #cbcbcb;
        &.active {
          background: #f05b47;
        }
      }
    }
    .select-ticket-title {
      @include sc(14px, #413838);
      height: 36px;
      line-height: 36px;
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
      background: #fff;
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
      height: 56px;
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
    height: 49px;
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
      width: 60px;
      overflow: hidden;
      @include sc(14px, #ffa628);
      .market-icon {
        line-height: 18px;
        @include sc(22px, #ffa628);
        margin-bottom: -5px;
        margin-top: 5px;
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
      // width: 172px;
      width: 120px;
      opacity: 0.4;
    }
    .active {
      opacity: 1;
    }
  }
  .ticket-detail-warpper {
    background: #fff;
    .ticket-w-title {
      @include sc(18px, #413838);
      font-weight: 600;
      padding: 20px 15px;
    }
    .ticket-detail-box {
      padding: 0px 15px 20px 15px;
      overflow: hidden;
      word-break: break-all;
      img {
        max-width: 100%;
        height: auto;
      }
      .route-ul {
        .route-li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          &:last-child {
            margin-bottom: 0;
          }
          .li-l {
            .li-l-title {
              font-size: 16px;
              color: #333;
              width: 250px;
              word-break: break-all;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              /* ! autoprefixer: off */
              -webkit-box-orient: vertical;
              /* autoprefixer: on */
              overflow: hidden;
            }
            .li-detail {
              color: #15bea1;
              font-size: 12px;
              margin-top: 8px;
            }
          }
          .li-r-btn {
            display: inline-block;
            text-align: center;
            height: 30px;
            line-height: 30px;
            font-size: 14px;
            width: 60px;
            border-radius: 3px;
            color: #fff;
            background-color: #f63;
            border: none;
          }
        }
      }
    }
    .comment-ul {
      .comment-li {
        margin-bottom: 20px;
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
  .tickets-info {
    width: 100%;
    background-color: #fff;
    margin-bottom: 10px;
    padding-top: 12px;
    .tickets-name {
      @include sc(16px, #413838);
      line-height: 22px;
      padding-left: 10px;
      padding-right: 12px;
      font-weight: bold;
      @include oh;
    }
    .tickets-subtitle {
      @include sc(14px, #777777);
      line-height: 30px;
      padding-left: 10px;
      padding-right: 15px;
      @include oh;
    }
    .tickets-labels {
      padding-bottom: 12px;
      margin-left: 10px;
      padding-top: 5px;
      border-bottom: 1px solid #e1e1e1;
      .tickets-label {
        display: inline-block;
        padding: 0px 8px;
        font-size: 12px;
        background-color: #ffefea;
        color: #ff6633;
        line-height: 20px;
        margin-right: 4px;
      }
    }
    .tickets-sell-core {
      padding: 10px;
      padding-right: 15px;
      @include fbc;
      .tickets-core-wrap {
        margin-right: 7px;
        display: inline-block;
        color: #0086f6;
        font-size: 12px;
        span {
          font-weight: bold;
          font-size: 20px;
          line-height: 20px;
        }
      }
      .tickets-num {
        color: #777777;
        font-size: 12px;
      }
    }
  }
  .tickets-arr {
    background-color: #fff;
    padding-top: 1px;
    .tickets-arr-title {
      font-weight: bold;
      line-height: 35px;
      padding-left: 10px;
      @include sc(14px, #413838);
      background-color: #f8f8f8;
      margin: 10px 10px 5px;
    }
    .tickets-content {
      @include fbc;
      border-bottom: 1px solid #e1e1e1;
      padding-right: 15px;
      margin-left: 15px;
      padding-bottom: 15px;
      align-items: center;
      .tickets-content-left {
        width: 239px;
        flex-grow: 1;
        margin-right: 30px;
      }
      .tickets-content-right {
        width: 76px;
        flex-grow: 1;
      }
      .tickets-content-title {
        font-weight: bold;
        line-height: 22px;
        padding-top: 16px;
        @include sc(14px, #413838);
        @include oh(2);
      }
      .tickets-content-label {
        span {
          display: inline-block;
          vertical-align: middle;
          border: 1px solid #ff9b7a;
          margin-right: 5px;
          @include sc(11px, #ff6633);
          padding: 4px 8px;
          margin-top: 4px;
          margin-bottom: 4px;
        }
      }
      .tickets-content-detail-inline {
        display: inline-block;
      }
      .tickets-content-detail {
        padding-top: 10px;
        @include sc(12px, #777777);
      }
      .tickets-price {
        text-align: center;
        font-size: 18px;
        margin-bottom: 8px;
        color: #ff6600;
        span {
          font-size: 10px;
        }
      }
      .tickets-buy-btn {
        line-height: 32px;
        text-align: center;
        color: #fff;
        background-color: #f05b47;
      }
    }
    .tickets-content-last {
      border-bottom: none;
    }
  }
  .tickets-reason {
    padding-top: 10px;
    background-color: #fff;
    margin-bottom: 10px;
    .tickets-reason-title-wrap {
      background-color: #faf7f1;
      margin: 0px 10px;
      .tickets-reason-title {
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-image: -webkit-gradient(
          linear,
          0 0,
          0 bottom,
          from(#f99854),
          to(#ff3a4d)
        );
        // color: #FF3A4D;
        font-weight: bold;
        font-size: 16px;
        display: flex;
        align-items: center;
        height: 36px;
        img {
          display: inline-block;
          vertical-align: middle;
          width: 12px;
          height: 14px;
          margin-left: 10px;
          margin-right: 5px;
        }
      }
    }
    .tickets-reason-content {
      font-size: 14px;
      padding: 10px 0px;
      line-height: 28px;
      li {
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: bold;
        background-image: -webkit-gradient(
          linear,
          0 0,
          0 bottom,
          from(#f99854),
          to(#ff3a4d)
        );
        span {
          display: inline-block;
          background: linear-gradient(to bottom, #f99854, #ff3a4d);
          vertical-align: middle;
          margin-left: 10px;
          margin-right: 7px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
        }
      }
    }
  }
  .tickets-content-list-wrap {
    height: 42px;
  }
  .tickets-content-list {
    padding-top: 5px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    border-bottom: 1px solid #e1e1e1;
    position: relative;
    .tickets-content-block {
      position: absolute;
      transition: 0.5s all;
      top: 39px;
      margin-left: -10px;
      width: 20px;
      line-height: 0px;
      font-size: 0px;
      height: 2px;
      background-color: #fc8778;
    }
    .tickets-content-item-wrap {
      flex-grow: 1;
      padding-bottom: 2px;
      color: #999;
      text-align: center;
      .tickets-content-item {
        line-height: 34px;
        font-size: 14px;
      }
    }
    .tickets-content-current {
      color: #f05b47;
    }
  }
  .tickets-content-list-fixed {
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
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
          @include sc(16px, #f05b47);
        }
      }
    }
  }
  .order-detail-modal {
    position: fixed;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
  }
  .order-detail-mask {
    background-color: rgba(0, 0, 0, 0.5);
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
  }
  .order-detail-wrap {
    z-index: 1;
    border-radius: 2px 2px 0px 0px;
    font-size: 16px;
    color: #413838;
    background-color: #fff;
    text-align: left;
    position: absolute;
    bottom: 0px;
    width: 100%;
    left: 0px;
    .order-detail-close {
      position: absolute;
      top: 15px;
      right: 15px;
      font-size: 12px;
    }
    .order-detail-title {
      text-align: center;
      line-height: 56px;
      font-weight: bold;
      border-bottom: 1px solid #e2e2e2;
    }
    .order-detail-content {
      max-height: 385px;
      min-height: 332px;
      font-size: 14px;
      overflow: auto;
      .order-detail-h1 {
        margin: 0px 10px;
        margin-top: 10px;
        background-color: #f8f8f8;
        line-height: 28px;
        font-weight: bold;
        padding-left: 10px;
      }
      ul {
        padding-top: 5px;
        padding-bottom: 5px;
        padding-right: 10px;
        padding-left: 20px;
        line-height: 24px;
        li {
          padding-bottom: 5px;
          display: flex;
          align-items: flex-start;
          span {
            display: inline-block;
            vertical-align: middle;
            margin-left: 10px;
            margin-top: 10px;
            margin-right: 6px;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background-color: #413838;
          }
        }
      }
      .order-detail-total {
        line-height: 54px;
        font-size: 14px;
        font-weight: bold;
        text-align: right;
        margin-left: 15px;
        padding-right: 15px;
        border-top: 1px solid #e1e1e1;
      }
    }
  }
}
</style>
