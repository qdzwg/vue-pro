<template>
  <div class="theater-select-content">
    <div class="theater-content-box">
      <div class="theater-list">
        <div>演出名称：{{sessionInfo.sessionName}}</div>
        <div>座位区域：{{canSale.areaName}}</div>
        <div>演出时间：{{sessionInfo.playDate+" "+sessionInfo.startTime}}</div>
        <div>
          <group>
            <selector title="" @on-change='ticketChange' :options='ticketList' v-model="ticketCode"></selector>
          </group>
        </div>
        <div class="theater-seat-model">
          <i class="theater-seat-model-zuo"></i>
          <span class="theater-seat-model-zuo">可选</span>
          <i class="theater-seat-model-suo"></i>
          <span>已售</span>
        </div>
      </div>
    </div>
    <div class="theater-seat">
      <div class="theater-seat-head"></div>
      <div class="theater-seat-body">
        <div class="theater-seat-content" :style="{'left':pageX+'px','top':pageY+'px'}">
          <div class="theater-seat-row" @touchend='touch' @touchstart='touch' @touchmove='touch' v-for="(row,index) in seats" :key="index">
            <div class="theater-seat-col" v-for="(col,inde) in row" :class='{"theater-seat-selected": col.selected, "theater-seat-suo": col.seatStatus == 0}' @click='selectItem(col, row, index,inde)' :key="inde"></div>
          </div>
        </div>
        <div class="theater-seat-rows" :style="{'top':pageY+'px'}">
          <div v-for="(row,index) in seats" :key="index">{{index+1}}</div>
        </div>
        <div class="seats-select-scroll" v-if='seatSelect.length'>
          <scroller lock-y scrollbar-x :bounce=false>
            <div class="seat-scrollbar" :style='{"width":(130*seatSelect.length+10)+"px"}'>
              <div class="seat-scrollbar-item-wrap" v-for="(seat,index) in seatSelect" :key="index">
                <div class="seat-scrollbar-item">
                  <i class="seat-scrollbar-item-icon"></i>
                  <div class="seat-scrollbar-item-name"><span>{{seat.snRow}}排{{seat.seatName}}座</span></div>
                  <div class="seat-scrollbar-item-price"><span>{{seat.price}}元</span></div>
                  <i class="close-btn xx-icon icon-guanbi1" @click='deleteSeat(seat,index)'></i>
                </div>
              </div>
            </div>
          </scroller>
        </div>
      </div>
    </div>
    <div class="bottom-box">
        <div class="left-warper">
            <div class="selected">
                <span class="title">已选 :</span>
                <span>{{seatSelect.length}}张</span>
            </div>
            <div class="money">
                <span class="title">总额 :</span>
                <span class="unit">￥</span>
                <span class="price">{{seatSelect.length*ticket.price}}</span>
            </div>
        </div>
        <div class="right-warper" @click="goOrder" :class='{active:seatSelect.length}'>
            立即预定
        </div>
    </div>
    <popup v-model="imgShow">
        <div class="imgShow-body">
            <img :src="sessionInfo.linkImg" alt="">
        </div>
    </popup>
  </div>
</template>
<script>
import { Scroller, Popup, Selector } from "vux";
export default {
  data() {
    return {
      imgShow: false,
      sessionInfo: {},
      canSale: {},
      ticketCode: '',
      ticketList: [{
              id: 137,
              name: 'piao1',
              price: 0.01
            },{
              id: 138,
              name: 'piao2',
              price: 0.02
            }],
      ticket: {},
      seatSelect: [],
      pageY: 4, // 当前top
      pageX: 38, // 当前left
      pageY0: 0, // touchstart top
      pageX0: 0, // touchstart left
      pageY1: 0, // touchend top
      pageX1: 0, // touchend left
      pageY2: 0, // touchmove前的 top
      pageX2: 0, // touchmove前的 left
      seats: [],
      itemData: []
    };
  },
  components: {
    Scroller,
    Popup,
    Selector
  },
  created() {
    document.title = "区域信息";
    this.sessionInfo = JSON.parse(localStorage.getItem("theater"));
    this.canSale = JSON.parse(localStorage.getItem("canSale"));
    let ticketCode = [];
    this.canSale.ticketList.showTicketModel.map((item, index)=>{
      ticketCode.push(item.code);
    });
    this.sessionInfo.ticketCode = ticketCode.join(',');
    delete this.sessionInfo.canSales;
    this.getAxios("/merchant/api/theater/getSeat", this.sessionInfo).then(res => {
      if(res.data.tickets.length)
      this.ticketList = res.data.tickets;
      if(this.ticketList.length){
        this.ticket = this.ticketList[0];
        this.ticketCode = this.ticketList[0].id;
        this.ticketList.map(item=>{
          item.value = item.name;
          item.key = item.id;
        })
      }
      let sessionAreaInfo = res.data.showResponseDto.sessionAreaInfo;
      let seats = sessionAreaInfo.sessionAreaSeatStatusList.sessionAreaSeatStatus;
      this.seats = [];
      for (let index = 0; index < sessionAreaInfo.rowCounts; index++) {
        let arr = [];
        for (let index = 0; index < sessionAreaInfo.colCounts; index++) {
          arr.push({});
        }
        this.seats.push(arr);
      }
      seats.map(item=>{
        this.seats[item.sRow][item.sCol] = item;
      });
    });
  },
  // computed: {
  //   position() {
  //     let top = this.pageY||-8,
  //       left = this.pageX||38;
  //     top += this.pageY1 - this.pageY0;
  //     left += this.pageX1 - this.pageX0;
  //     return {
  //       top: top+"px",
  //       left: left+"px",
  //     }
  //   }
  // },
  methods: {
    touch(event) {
      let innerHTML;
      switch(event.type){
        case "touchstart":
          this.pageX0 = event.touches[0].clientX;
          this.pageY0 = event.touches[0].clientY;
          this.pageY2 = this.pageY;
          this.pageX2 = this.pageX;
          innerHTML = "Touch started (" +  + "," + event.touches[0].clientY + ")";
          break;
        case "touchend":
          this.pageX1 = event.changedTouches[0].clientX;
          this.pageY1 = event.changedTouches[0].clientY;
          this.pageY = this.pageY2 + this.pageY1 - this.pageY0;
          this.pageX = this.pageX2 + this.pageX1 - this.pageX0;
          innerHTML = "<br>Touch end (" + event.changedTouches[0].clientX + "," + event.changedTouches[0].clientY + ")";
          break;
        case "touchmove":
          this.pageX1 = event.touches[0].clientX;
          this.pageY1 = event.touches[0].clientY;
          this.pageY = this.pageY2 + this.pageY1 - this.pageY0;
          this.pageX = this.pageX2 + this.pageX1 - this.pageX0;
          event.preventDefault();
          innerHTML = "<br>Touch moved (" + event.touches[0].clientX + "," + event.touches[0].clientY + ")";
          break;
      }
      // console.log(innerHTML);
    },
    ticketChange(code) {
      // console.log(arguments)
      this.ticketList.map((item, index)=>{
        if (code == item.id) {
          this.ticket = item;
        }
      });
    },
    swiper(data) {
      // console.log(arguments)
    },
    goOrder() {
      // if(!this.selected){
      //   return
      // }
      localStorage.setItem("theaterTicket", JSON.stringify(this.ticketList));
      localStorage.setItem("seatSelect", JSON.stringify(this.seatSelect));
      this.$router.push({path: "/order/theater", query: this.$route.query});
    },
    deleteSeat(seat,index) {
      seat.selected = false;
      this.seatSelect.splice(index,1);
    },
    selectItem(col,row,index,inde) {
      if(!this.ticketList.length){
        return this.$vux.toast.text("没有票型！", "middle");
      }
      if(col.seatStatus == 0){
        return
      }
      col.selected = !col.selected;
      if(!col.selected) {
        let _index;
        this.seatSelect.map((item,index)=>{
          if(item.fid == col.fid){
            _index = index;
          }
        })
        this.seatSelect.splice(_index,1);
      } else {
        col.ticketId = this.ticket.id;
        col.name = this.ticket.name;
        col.price = this.ticket.price;
        this.seatSelect.push(col);
      }
      this.$set(row,inde,col);
    },
  }
};
</script>
<style lang="scss">
@import "../../../../assets/styles/mixin.scss";
.theater-select-content {
  @include fbc;
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  flex-direction: column;
  .theater-content-box {
    width: 100%;
    position: relative;
    z-index: 2;
    background-color: #fff;
    .theater-list {
      background-color: #fff;
      display: block;
      @include sc(14px, #413838);
      padding: 14px;
      div {
        margin-top: 6px;
      }
      .theater-seat-model {
        line-height: 30px;
        text-align: center;
        i {
          width: 28px;
          height: 28px;
          background-image: url("../../../../assets/images/zuo.png");
          background-size: 24px 24px;
          background-position: center;
          background-repeat: no-repeat;
          display: inline-block;
          vertical-align: middle;
        }
        span.theater-seat-model-zuo {
          margin-right: 10px;
        }
        .theater-seat-model-suo {
          background-image: url("../../../../assets/images/suo.png");
        }
      }
    }
  }
  .linearGradient {
    background-image: linear-gradient(to bottom,#f2f2f2,#fff);
    height: 20px;
  }
  .theater-seat {
    width: 100%;
    background-color: #efeaea;
    @include fbc;
    flex-grow: 1;
    text-align: center;
    flex-direction: column;
    .theater-seat-head {
      height: 28px;
      position: relative;
      width: 100%;
      z-index: 1;
      background-image: url("../../../../assets/images/stage_tit.png");
      background-size: 187px 28px;
      background-position: center;
      background-repeat: no-repeat;
      display: inline-block;
    }
    .theater-seat-body {
      flex-grow: 1;
      width: 100%;
      position: relative;
      .theater-seat-rows {
        width: 18px;
        position: absolute;
        line-height: 34px;
        left: 6px;
        top: -8px;
        background-color: rgba(0,0,0,.25);
        border-radius: 10px;
        color: #fff;
        z-index: 1;
      }
      .seats-select-scroll {
        position: absolute;
        bottom: 10px;
        right: 0px;
        left: 0px;
        text-align: left;
        z-index: 1;
        background-color: #fff;
        .seat-scrollbar {
          white-space: nowrap;
          padding: 0px 5px;
          height: 74px;
          .seat-scrollbar-item-wrap {
            display: inline-block;
            .seat-scrollbar-item {
              text-align: center;
              width: 120px;
              position: relative;
              height: 50px;
              border: 1px solid #ccc;
              margin-top: 12px;
              @include fbc();
              @include sc(12px, #413838);
              justify-content: center;
              flex-direction: column;
              line-height: 14px;
              margin-right: 10px;
              .seat-scrollbar-item-name {
                span {
                  @include oh();
                  display: inline-block;
                  width: 88px;
                }
              }
              .seat-scrollbar-item-price {
                color: #f05b47;
              }
              .seat-scrollbar-item-icon {
                left: -1px;
                top: 50%;
                transform: translateY(-50%);
                width: 6px;
                height: 12px;
                background: #fff;
                position: absolute;
                &:after {
                  position: absolute;
                  content: "";
                  top: 0;
                  left: 0;
                  box-sizing: border-box;
                  width: 100%;
                  height: 100%;
                  border: 1px solid #d1d1d1;
                  border-radius: 0;
                  pointer-events: none;
                  -webkit-transform-origin: 0 0;
                  -ms-transform-origin: 0 0;
                  transform-origin: 0 0;
                  border-radius: 0 12px 12px 0;
                  border-width: 1px 1px 1px 0;
                }
              }
              .close-btn {
                position: absolute;
                right: 1px;
                top: 0;
                width: 16px;
                height: 100%;
                line-height: 50px;
                text-align: left;
                color: #999999;
                font-size: 12px;
              }
            }
          }
        }
      }
      .theater-seat-content {
        position: absolute;
        z-index: 0;
        left: 38px;
        top: -8px;
        .theater-seat-row {
          white-space: nowrap;
          .theater-seat-col {
            vertical-align: middle;
            width: 34px;
            height: 34px;
            background-image: url("../../../../assets/images/zuo.png");
            background-size: 28px 28px;
            background-position: center;
            background-repeat: no-repeat;
            display: inline-block;
          }
          .theater-seat-suo {
            background-image: url("../../../../assets/images/suo.png")
          }
          .theater-seat-selected {
            background-image: url("../../../../assets/images/selected.png")
          }
        }
      }
    }
  }
  .bottom-box {
    width: 100%;
    height: 49px;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    font-family: PingFangSC-Regular, sans-serif;
    background: #ffffff;
    z-index: 700;
    .left-warper {
      width: 204px;
      font-size: 14px;
      font-weight: bold;
      color: #413838;
      padding-left: 15px;
      .title {
        margin-right: 4px;
      }
      .money {
        height: 19px;
        line-height: 15px;
        .unit {
          color: #f05b47;
          font-family: PingFangSC-Regular, sans-serif;
          font-size: 12px;
        }
        .price {
          color: #fc4150;
          font-family: PingFangSC-Regular, sans-serif;
          font-size: 18px;
          //  font-weight: bold;
        }
      }
    }
    .right-warper {
      width: calc(100% - 204px);
      height: 49px;
      line-height: 49px;
      background: #f05b47;
      color: #fff;
      text-align: center;
      font-size: 16px;
      opacity: .4;
    }
    .active {
      opacity: 1;
      background: #f05b47;
    }
  }
  .imgShow-body {
    img {
      width: 100%;
    }
  }
}
</style>


