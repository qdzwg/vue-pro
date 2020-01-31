<template>
    <div class="invoiceList" :style="{'padding-bottom':69+'px'}">
        <div class='state-ul bg-w'>
            <div class="state-li" :class='{active:currentindex=="0"}' @click="select('all',0)">
                <div class="state-title">未开票</div>
            </div>
            <div class="state-li" :class='{active:currentindex=="1"}' @click="select('success',1)">
                <div class="state-title">已开票</div>
            </div>
        </div>
        <swiper v-model="currentindex" ref="swiper" :show-dots="false" class="state-content" @on-index-change="switchTab">
            <swiper-item>
                <scroll :data="listData[0]" :pullup="pullup" @scrollToEnd="getBottom(0)" class="content-item">
                    <div v-if="listData[0].length" class="item-ul">
                        <div class="item-box" v-for="(item,index) in listData[0] " :key="index">
                            <div class="item-li">支付订单号：{{item.payOrderNo}}</div>
                            <div v-for="(ele,i) in item.infoList" :key="i" class="item-li">
                                消费明细：{{ele.orderInfo}} ×{{ele.num}}
                            </div>
                            <div class="item-li">消费时间：{{item.payTime}}</div>
                            <div class="item-li">订单总额：{{item.paySum}}</div>
                            <div class="item-li">可开总额：{{item.checkSum}}</div>
                            <div class="btn-pay" @click="gourl(item.payOrderNo)">开票</div>
                        </div>
                    </div>
                    <div v-else class="no-data">暂无数据</div>
                </scroll>
            </swiper-item>
            <swiper-item v-model="currentindex">
                <scroll :data="listData[1]" :pullup="pullup" @scrollToEnd="getBottom(1)" class="content-item">
                    <div v-if="listData[1].length" class="item-ul">
                        <div class="item-box" v-for="(item,index) in listData[1] " :key="index">
                            <div class="item-li">订单号：{{item.payOrderNo}}</div>
                            <div class="item-li">消费时间：{{item.invoiceTime}}</div>
                            <div class="item-li">开票金额：{{item.nontaxAmount}}</div>
                            <div class="btn-pay btn-detail" @click="getDetail(item.payOrderNo)">查看详情</div>
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
                    <li>● 暂不支持补开纸质发票、增值税专用发票 </li>
                </ul>
            </div>
        </popup>
    </div>
</template>

<script>
import { Swiper, SwiperItem, Popup } from "vux";
import scroll from "@/components/BScroll";
import { parse } from "path";
export default {
  components: {
    Swiper,
    SwiperItem,
    scroll,
    Popup
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
      total: 0
    };
  },
  created() {
    document.title = "电子发票";
    this.getList(0);
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.swiper.xheight = window.innerHeight - 39 + "px";
    });
  },
  methods: {
    gourl(num) {
      this.$router.push("/invoicePay?payOrderNo=" + num);
    },
    getDetail(num) {
      this.$router.push("/invoiceDetail?payOrderNo=" + num);
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
    getBottom(index) {
      this.pageList[index]++;
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
        // dataSource: 'yearCard' // 只查年卡
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
    .content-item {
      height: 100%;
      touch-action: none;
      .no-data {
        font-size: 14px;
        text-align: center;
        color: #413838;
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
            overflow: hidden;/*超出部分隐藏*/
            white-space: nowrap;/*不换行*/
            text-overflow:ellipsis;/*超出部分文字以...显示*/
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





