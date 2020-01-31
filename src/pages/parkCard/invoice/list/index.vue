<template>
  <div class="invoiceList" :style="{'padding-bottom':69+'px'}">
    <y-tabs :list="tabsList" :activeIndex="currentindex" @select="tabsChange"></y-tabs>
    <swiper
      v-model="currentindex"
      ref="swiper"
      :show-dots="false"
      class="state-content"
      :min-moving-distance=100
      @on-index-change="switchTab"
    >
      <swiper-item>
        <scroll
          :data="listData[0]"
          :pullup="pullup"
          @scrollToEnd="getBottom(0)"
          class="content-item yearcard-scroll"
        >      
          <div v-if="listData[0].length" class="content-item-ul">
            <div v-for="(item,index) in listData[0] " :key="index" class="content-item-li">
              <div class="content-item-li__top">
                <div class="content-item-li__top-time">{{item.payTime}}</div>
                <div class="content-item-li__top-btn greey" @click="gourl(item.payOrderNo)">开票</div>
              </div>
              <div class="content-item-li__content">
                <div class="content-item-li__content-list">
                  <div class="list-label">消费明细</div>
                  <div class="list-value">
                    <span v-for="(info,i) in item.infoList" :key="i">{{info.orderInfo}}</span>
                  </div>
                </div>
                <div class="content-item-li__content-list">
                  <div class="list-label">支付订单号</div>
                  <div class="list-value">{{item.payOrderNo}}</div>
                </div>
                <div class="content-item-li__content-list">
                  <div class="list-label">订单总额</div>
                  <div class="list-value">{{item.paySum}}</div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="no-data">暂无数据</div>
        </scroll>
      </swiper-item>
      <swiper-item>
        <scroll
          :data="listData[1]"
          :pullup="pullup"
          @scrollToEnd="getBottom(1)"
          class="content-item yearcard-scroll"
        >
          <div v-if="listData[1].length" class="content-item-ul">
            <div v-for="(item,index) in listData[1] " :key="index" class="content-item-li">
              <div class="content-item-li__top">
                <div class="content-item-li__top-time">{{item.invoiceTime}}</div>
                <div class="content-item-li__top-btn" @click="getDetail(item.payOrderNo)">查看</div>
              </div>
              <div class="content-item-li__content">
                <div class="content-item-li__content-list">
                  <div class="list-label">消费明细</div>
                  <div class="list-value">
                    <span>{{item.orderInfo}}</span>
                  </div>
                </div>
                <div class="content-item-li__content-list">
                  <div class="list-label">开票状态</div>
                  <div class="list-value">{{item.status}}</div>
                </div>
                <div class="content-item-li__content-list">
                  <div class="list-label">支付订单号</div>
                  <div class="list-value">{{item.payOrderNo}}</div>
                </div>
                <div class="content-item-li__content-list">
                  <div class="list-label">开票金额</div>
                  <div class="list-value">{{item.nontaxAmount}}</div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="no-data">暂无数据</div>
        </scroll>
      </swiper-item>
    </swiper>
    <div class="uesr-btn" @click="show=true">开票说明</div>
    <popup v-model="show" height="39.5%">
      <div class="box">
        <div class="title">开票说明</div>
        <span class="back" @click="show=false">
          <i class="xx-icon icon-guanbi2"></i>
        </span>
        <ul>
          <li>● 部分商品或不支持开具发票，如有特殊需求，请向商家客服咨询。</li>
          <li>● 开票金额为用户实际支付的金额（不含订单内不支持开具发票的商品实付金额）</li>
          <li>● 单笔支付订单只支持开具一种类型的发票且不可重复开（订单明细全部核销完成才可开票）</li>
          <li>● 暂不支持补开纸质发票、增值税专用发票</li>
        </ul>
      </div>
    </popup>
  </div>
</template>

<script>
import { Swiper, SwiperItem, Popup } from "vux";
import scroll from "@/components/BScroll";
import yTabs from "@/components/yTabs";
import { parse } from "path";
import { debuglog } from 'util';
export default {
  components: {
    Swiper,
    SwiperItem,
    scroll,
    Popup,
    yTabs
  },
  data() {
    return {
      show: false,
      currentindex: 0,
      listData: [[], []],
      pageList: [1, 1],
      pageLimt: [null, null],
      pullup: true,
      activestate: "",
      total: 0,
      tabsList: [
        {
          status: 0,
          label: "未开票"
        },
        {
          status: 1,
          label: "已开票"
        }
      ]
    };
  },
  created() {
    document.title = "电子发票";
    this.getList(0);
    if (this.$route.query.flag  && Number(this.$route.query.flag) === 1)  {
      this.tabsChange(this.tabsList[1])
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.swiper.xheight = window.innerHeight - 39 + "px";
    });
  },
  methods: {
    gourl(num) {
      this.$router.push("/parkCard/invoice/create?payOrderNo=" + num);
    },
    getDetail(num) {
      this.$router.push("/parkCard/invoice/detail?payOrderNo=" + num);
    },
    switchTab(i) {
      this.currentindex = i;
      if (!this.listData[i].length) {
        this.getList(i);
      }
    },
    select(state, index) {
      this.activestate = state;
      this.currentindex = index;
      //   this.getList(index);
    },
    tabsChange(item) {
      this.currentindex = Number(item.status);
    },
    getBottom(index) {
      this.pageList[index]++;
      console.log('page:'+ this.pageList[index],'limit:'+ this.pageLimt[index])
      if (this.pageList[index] <= this.pageLimt[index]) {
        // console.log(this.pageList);
        this.getList(index);
      }
    },
    getList(index) {
      let _this = this;
      // let url=this.api.member.invoices.pageList
      let url = "/marketing/api/marketElectronicInvoices/pageInvoiceReq";
      let data = {
        currPage: _this.pageList[index],
        pageSize: 6,
        membersId:
          localStorage.getItem("xjsc_login_userId_2019_3_8") ||
          this.$cookie.get("leaguerInfoId"),
        flag: index,
        dataSource: 'yearCard'
      };
      this.getAxios(url, data).then(res => {
        // console.log(res);
        _this.pageLimt[index] = res.data.pages;
        // this.total = res.data.total;
        if (res.data.rows) {
          this.$set(
            this.listData,
            index,
            this.listData[index].concat(res.data.rows)
          );
        }
      });
    }
  }
};
</script>

<style lang="scss" scope>

.invoiceList {
  width: 100%;
  //  overflow: hidden;
  .state-ul {
    display: flex;
    justify-content: space-around;
    font-size: 15px;
    color: #5c5c5c;
    font-family: PingFangSC-Regular, sans-serif;
    background-color: #fff;
    .state-li {
      .state-title {
        padding: 10px 6px;
      }
    }
    .state-li.active {
      color: #f05b47;
      position: relative;
    }
    .state-li.active::after {
      content: "";
      display: block;
      height: 2px;
      width: 100%;
      background: #f05b47;
      position: absolute;
      bottom: 0;
      border-radius: 1px;
    }
  }
  .state-content {
    position: fixed;
    width: 100%;
    left: 0;
    top: 87px;
    bottom: 25px;
    .content-item {  
      &.yearcard-scroll {
        height: calc(100% - 115px);
      }
      touch-action: none;
      .no-data {
        text-align: center;
        font-size: 15px;
        font-weight: 500;
        color: rgba(187, 187, 187, 1);
        font-family: PingFangSC-Regular, sans-serif;
        padding: 25px 0;
      }
      .item-ul {
        .item-box {
          background-color: #fff;
          padding: 10px 20px;
          font-size: 14px;
          margin: 10px 0;
          color: #5c5c5c;
          position: relative;

          .item-li {
            line-height: 30px;
            overflow: hidden; /*超出部分隐藏*/
            white-space: nowrap; /*不换行*/
            text-overflow: ellipsis; /*超出部分文字以...显示*/
          }
          .btn-pay {
            width: 80px;
            text-align: center;
            line-height: 30px;
            height: 30px;
            font-size: 13px;
            border-radius: 2px;
            background-color: #f05b47;
            color: #fff;
            position: absolute;
            top: 50%;
            right: 15px;
          }
          .btn-detail {
            background-color: #fff;
            color: #f05b47;
            border: 1px solid #f05b47;
            top: 35%;
          }
        }
      }
      .content-item-ul {
        // background-color: #fff;
        // padding: 15px 15px;
        // font-size: 14px;
        // margin: 10px 0;
        // color: #5c5c5c;
        // position: relative;
        .content-item-li {
          position: relative;
          width: 315px;
          // height: 140px;
          padding:10px 15px 15px;
          border-radius: 5px;
          background: white;
          margin:15px auto 0;
          &:first-child {
            margin-top: 0;
          }
          &__top {
            height: 50px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            &-time {
              font-size: 15px;
              font-family: PingFang SC;
              font-weight: 500;
              color: rgba(187, 187, 187, 1);
            }
            &-btn {
              width: 80px;
              height: 32px;
              border: 1px solid rgba(221, 221, 221, 1);
              border-radius: 16px;
              line-height: 32px;
              text-align: center;
              font-size: 15px;
              font-family: PingFang SC;
              font-weight: 500;
              &.greey {
                border:1px solid rgba(79,200,152,1);
                color:rgba(79,200,152,1);
              }
            }
          }
          &__content {
            &-list {
              min-height: 32px;
              display: flex;
              align-items: center;
              .list-label {
                width: 100px;
                overflow: hidden;
                font-size: 15px;
                font-family: PingFang SC;
                font-weight: 500;
                color: rgba(187, 187, 187, 1);
              }
              .list-value {
                flex: 1;
                text-align: left;
                font-size:15px;
                font-family:PingFang SC;
                font-weight:500;
                color:rgba(51,51,51,1);
              }
            }
          }
        }
      }
    }
  }
  .uesr-btn {
    width: 100%;
    height: 49px;
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: #fff;
    text-align: center;
    line-height: 49px;
    font-size: 16px;
    border-top: 0.5px solid #eee;
  }
  .box {
    background-color: #fff;
    .back {
      position: absolute;
      top: 5px;
      right: 20px;
      color: #5c5c5c;
      i {
        font-size: 25px;
      }
    }
    .title {
      font-size: 16px;
      text-align: center;
      line-height: 49px;
    }
    ul {
      li {
        padding: 10px;
        color: #5c5c5c;
        //   line-height:30px;
      }
    }
  }
}
</style>





