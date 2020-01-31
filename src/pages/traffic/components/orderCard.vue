<template>
  <div class="order-card">
    <div class="ypym-warpper">
      <div class="ypyp-section add-sub-section">
        <div>
          <span class="ticket-num">购票份数：</span>
          <span>单笔订单限5人</span>
        </div>
        <numSpinner v-model="num"
                    :min="1"
                    :max="maxNum"
                    :precision="0"></numSpinner>
      </div>
    </div>
    <div v-if="buyManList.length"
         class="real-list-box">
      <div v-for="(card,index) in buyManList"
           :key="card.key"
           class="info-list">
        <div class="info-list-title">
          <div class="info-title-left">
            <span class="title-text">
              游玩人
              <template>{{index+1}}</template>
            </span>
          </div>
          <div class="img-content"
               @click="ypymContact('buyer',index)">
            <img src="http://statics.lotsmall.cn/wx/img/icon-contact.png"
                 class="img" />
            <span class="text">选择</span>
          </div>
        </div>
        <div class="order-item-box">
          <div class="order-item-left">
            <div class="info-item">
              <div class="info-title">姓名</div>
              <input @blur="iosBlur"
                     maxlength="10"
                     placeholder-class="input-style"
                     placeholder="须与证件上的名字一致"
                     @input="changBuyerInput(index)"
                     v-model="card.name" />
            </div>
            <div class="info-item">
              <div class="info-title">
                <span>身份证</span>
              </div>
              <input @blur="iosBlur"
                     placeholder-class="input-style"
                     placeholder="请填写证件号"
                     @input="changBuyerInput(index)"
                     v-model="card.certNo" />
            </div>
          </div>
          <div class="order-item-right">
            <div @click="getCardType(index)">
              <card-getdata :idStr="'ypyp_card_'+index"
                            @returnCardUrl="getCardUrl">
                <img class="card-img"
                     src="../../../assets/images/camera-icon.png"
                     alt />
                <span class="card-text">拍照识别</span>
                <span class="card-text">身份证</span>
              </card-getdata>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="real-list-box">
      <div class="info-list">
        <div class="info-list-title">
          <div class="info-title-left">
            <span class="link-title-text">联系人</span>
            <span class="link-title-desc">(用于接收出票信息)</span>
          </div>
          <div class="img-content"
               @click="ypymContact('link')">
            <img src="http://statics.lotsmall.cn/wx/img/icon-contact.png"
                 class="img" />
            <span class="text">选择</span>
          </div>
        </div>
        <div class="order-item-box">
          <div class="order-item-left">
            <div class="info-item">
              <div class="info-title">姓名</div>
              <input @blur="iosBlur"
                     maxlength="10"
                     placeholder-class="input-style"
                     placeholder="须与证件上的名字一致"
                     v-model="linkManInfo.name" />
            </div>
            <div class="info-item">
              <div class="info-title">
                <span>手机号</span>
              </div>
              <input @blur="iosBlur"
                     placeholder-class="input-style"
                     placeholder="请填写手机号"
                     v-model="linkManInfo.phone" />
            </div>
            <div class="info-item">
              <div class="info-title">
                <span>身份证</span>
              </div>
              <input @blur="iosBlur"
                     placeholder-class="input-style"
                     placeholder="请填写证件号"
                     v-model="linkManInfo.certNo" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <pop-contacts :contactShow.sync="contactShow"
                  @getContacts="getContactInfo"></pop-contacts>
  </div>
</template>

<script>
import cardGetdata from "service/order/public/cardGetdata";
import numSpinner from "service/components/numSpinner";
import popContacts from "./popContacts";
import { mapGetters, mapMutations, mapState, mapActions } from "vuex";
export default {
  components: { cardGetdata, numSpinner, popContacts },
  props: {},
  data () {
    return {
      num: 1,
      maxNum: 5,
      contactShow: false,
      manType: 'buyer',  //buyer:购买人；link:联系人
      buyIndex: -1,
    };
  },
  computed: {
    ...mapState('traffic/', {
      buyManList: state => JSON.parse(JSON.stringify(state.buyManList)),
      linkManInfo: state => state.linkManInfo
    })
  },
  methods: {
    ...mapMutations('traffic/', ['setBuyMan', 'setLinkMan']),
    // 选择联系人
    /**
    * @params type:buyer购买人
    *@params type:link联系人
    *@params index?:购买人索引
    */
    ypymContact (type, index) {
      this.contactShow = true
      this.manType = type
      this.buyIndex = index
    },
    getContactInfo (item) {
      if (this.manType === 'buyer') {
        let selectIndex = this.buyIndex
        let buyManList = this.buyManList
        let { key } = buyManList[selectIndex]
        buyManList.splice(selectIndex, 1, {
          name: item.name,
          certNo: item.certNo,
          idcardType: "id",
          key
        })
        this.setBuyMan(buyManList)
        // linkManInfo.name = item.name
        // linkManInfo.certNo = item.certNo
        // linkManInfo.phone = item.phone
      } else if (this.manType === 'link') {
        let linkManInfo = this.linkManInfo
        linkManInfo.name = item.name
        linkManInfo.certNo = item.certNo
        linkManInfo.phone = item.phone
      }
    },
    //获取身份正信息
    getCardUrl (data) {
      let result = data.words_result
      let buyManList = this.buyManList
      console.log(this.buyIndex)
      let selectIndex = this.buyIndex
      let { key } = buyManList[selectIndex]
      buyManList.splice(selectIndex, 1, {
        name: result['姓名'].words,
        certNo: result['公民身份号码'].words,
        idcardType: "id",
        key
      })
      this.setBuyMan(buyManList)
    },
    getCardType (index) {
      this.buyIndex = index
    },
    changBuyerInput (index) {
      let buyManList = this.buyManList
      let info = this.buyManList[index]
      buyManList.splice(index, 1, info)
      this.setBuyMan(buyManList)
    }
  },
  watch: {
    num: function (newVal, oldVal) {
      let buyManList = this.buyManList
      if (newVal > oldVal) {
        buyManList.push({
          name: "",
          certNo: "",
          idcardType: "id",
          key: new Date().getTime()
        })
      } else {
        let index = buyManList.findIndex(item => {
          return !item.certNo
        })
        buyManList.splice(index, 1)
      }
      this.setBuyMan(buyManList)
    },
    linkManInfo: function (newVal, oldVal) {
      this.setLinkMan(newVal)
    },
  },
  created () { },
  mounted () { }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/styles/mixin.scss";
.order-card {
  .ypyp-section {
    padding: 0 15px;
    background: white;
    border-top: 1px solid #eeeee7;
    @include fbc;
    height: 60px;
    &.add-sub-section {
      align-items: center;
      background: white;
      margin-top: 0;
      margin-bottom: 10px;
      // margin-top: 10px;
    }
    .ticket-name {
      color: #333;
      font-size: 14px;
    }
    .ticket-price {
      color: #333;
      font-size: 14px;
    }
    .ticket-num {
      color: #413838;
      font-size: 14px;
      font-weight: bold;
    }
    .add-sub-num {
      display: flex;
      align-items: center;
      .num {
        margin-right: 15px;
        font-size: 18px;
        color: #413838;
      }
    }
  }
  .real-list-box {
    background: #ffffff;
    // padding: 8px 0;
    margin-bottom: 10px;
    padding-left: 14px;
    .info-list {
      padding: 0;
      border-bottom: 0.5px solid #eeeee7;
      &:last-child {
        border-bottom: none;
      }
      .info-item {
        margin-bottom: 0;
        height: 53px;
        line-height: 53px;
        border-bottom: 0.5px solid #eeeee7;
        // margin-left: 14px;

        .info-title {
          font-size: 14px;
          // padding-left: 14px;
        }
        input {
          font-size: 14px;
          outline: none;
          border: none;
          color: #413838;
        }
        input::-webkit-input-placeholder {
          color: #999;
          font-size: 13px;
        }
        input:-moz-placeholder {
          color: #999;
          font-size: 13px;
        }
        input:-ms-input-placeholder {
          color: #999;
          font-size: 13px;
        }
      }
      .info-item:last-child {
        border-bottom: none;
      }
      .order-item-box {
        border-bottom: 1px solid #eeeee7;
        position: relative;
        .order-item-left {
        }
        .order-item-right {
          position: absolute;
          height: 100%;
          top: 0;
          right: 0;
          padding: 0 15px;
          background: #f7f7f7;
          display: flex;
          align-items: center;
          .card-box {
            .card-img {
              width: 18.5px;
              height: 16.5px;
              display: block;
              margin: 0 auto 10px;
            }
            .card-text {
              color: rgba(65, 56, 56, 0.5);
              // margin-left: 0.266667rem;
              font-size: 12px;
              display: block;
              text-align: center;
            }
          }
        }
      }
      .info-list-title {
        height: 43px;
        // margin-left: 14px;
        border-bottom: 0.5px solid #eeeee7;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .info-title-left {
          display: flex;
          align-items: center;
        }
        .card-box {
          margin-left: 24px;
          display: flex;
          align-items: center;
          .card-img {
            width: 29px;
            height: 25px;
            display: block;
          }
          .card-text {
            color: rgba(65, 56, 56, 0.5);
            margin-left: 0.266667rem;
            font-size: 12px;
          }
        }
        .title-text {
          color: #999;
          font-family: PingFangSC-Regular, sans-serif;
          display: inline-block;
          vertical-align: middle;
          font-size: 14px;
        }
        .link-title-text {
          font-size: 18px;
          color: #413838;
        }
        .link-title-desc {
          color: #999;
        }
        .img-content {
          padding-right: 15px;
          display: flex;
          align-items: center;
          .img {
            width: 17px;
            height: 17px;
            padding: 10px;
            padding-left: 50px;
            padding-right: 5px;
          }
          .text {
            font-size: 12px;
            color: #19a0f0;
            margin-top: 2px;
          }
        }
      }
      .info-item {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 14px;
        color: #413838;
        position: relative;
        .info-title {
          width: 77px;
          font-family: PingFangSC-Regular, sans-serif;
        }
        .preview-img {
          width: 30px;
          height: 30px;
          // margin-left: 35px;
        }
        .input-style {
          color: rgba(65, 56, 56, 0.5);
          font-size: 14px;
          font-family: PingFangSC-Regular, sans-serif;
        }
        input {
          // width: 240px;
          outline: none;
          border: none;
          font-size: 14px;
        }
        input::-webkit-input-placeholder {
          color: #999;
          font-size: 13px;
        }
        input:-moz-placeholder {
          color: #999;
          font-size: 13px;
        }
        input:-ms-input-placeholder {
          color: #999;
          font-size: 13px;
        }
        .coupon-svg {
          font-size: 12px;
          color: #f05b47;
        }
        .coupons-icon {
          width: 9px;
          color: #f05b47;
          padding-left: 15px;
        }
        .camera-icon {
          width: 30px;
          height: 26.5px;
        }
        .rotate {
          transform: rotate(180deg);
          -ms-transform: rotate(180deg);
          -moz-transform: rotate(180deg);
          -webkit-transform: rotate(180deg);
          -o-transform: rotate(180deg);
        }
        .camera-tips {
          color: rgba(65, 56, 56, 0.5);
          margin-left: 10px;
          font-size: 12px;
        }
        .setLink {
          position: absolute;
          right: 0;
          top: 0;
          font-size: 13px;
          color: rgba(65, 56, 56, 0.6);
          border: 1px solid rgba(65, 56, 56, 0.5);
          padding: 2px 5px;
          border-radius: 4px;
        }
      }
      .info-item:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>