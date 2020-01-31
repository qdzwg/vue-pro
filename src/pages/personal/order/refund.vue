<template>
    <div class="back-warp">
            <div class="back-box">
                <!-- 景区 -->
                <template v-if="pageData.orderType=='park'">
                    <div v-if='!(pageData.realNameList&&pageData.realNameList.length)' class="back-num clearfix bg-w m-b-10 boshadow">
                        <!-- 非实名制 -->
                        <span class="fl title">退订份数</span>
                        <div class="count-box fr">
                            <span @click='sub' v-if="num>1" class="sub handle-span">-</span>
                            <span v-else class="sub handle-span disabled">-</span>
                            <span class="num handle-span">{{num}}</span>
                            <span v-if='num<limitNum' @click="add" class="add handle-span">+</span>
                            <span v-else class="add handle-span disabled">+</span>
                        </div>
                    </div>
                    <!-- 景区门票实名制 -->
                    <div class="realname-list" v-else>
                        <div class="go-pay">
                            <span class="title-realname">请选择退票游客</span>
                        </div>
                        <div class="go-pay">
                            <div class="select-all">
                                <checkbox-group @change="toggleSelectAll">
                                    <label class="checkbox quanxuan" v-for='(item,index) in selected' :key='index'>
                                        <checkbox :value="item.value" :checked="item.checked" class="allselect-radio" />
                                        <span class="text">全选</span>
                                    </label>
                                </checkbox-group>
                            </div>
                        </div>
                        <div class="go-pay">
                            <div class="select-all">
                                <checkbox-group @change='checkboxChange'>
                                    <label class="checkbox item-info" v-for='(item,index) in pageData.realNameList' :key='index'>
                                        <checkbox class="allselect-radio" :checked="item.checked" :value="item.id" />
                                        <span class="text">{{item.linkMan}}</span>
                                        <span class="idno">{{item.idcardNo}}</span>
                                    </label>
                                </checkbox-group>
                            </div>
                        </div>
                    </div>
                </template>
                <!-- 商品 -->
                <template v-if="pageData.orderType=='mdse'">
                    <div class="remark clearfix m-b-10 boxshadow bg-w">
                        <span class="title fl">退款金额</span>
                        <input class="remark-input" v-model='handleRefundMoney' type="digit" placeholder="请输入退款金额">
                    </div>
                    <!-- 待收货-退款需要手动选择退款还是退款又退货，但是如果是待发货状态只能是退款 -->
                    <radio-group v-if="pageData.orderState=='2'" class="radio-group m-b-10 boxshadow bg-w" @change="radioChange">
                        <label class="radio" v-for="(item,index) in refundTypeList" :key='index'>
                            <radio :value="item.value" class="state-radion" :checked='item.checked' />{{item.name}}
                        </label>
                    </radio-group>
                </template>
                <!-- 酒店 -->
                <template v-if="pageData.orderType=='hotel'||pageData.orderType=='eatery'">
                    <div class="back-num clearfix m-b-10 boxshadow bg-w">
                        <span class="fl title">退订份数</span>
                        <div class="count-box fr">
                            <span @click='sub' v-if="num>1" class="sub handle-span">-</span>
                            <span v-else class="sub handle-span disabled">-</span>
                            <span class="num handle-span">{{num}}</span>
                            <span v-if='num<limitNum' @click="add" class="add handle-span">+</span>
                            <span v-else class="add handle-span disabled">+</span>
                        </div>
                    </div>
                </template>
                <!--跟团游-->
                <template v-if="orderType=='route'">
                    <div class="back-num clearfix m-b-10 boxshadow bg-w">
                        <p class="title">退订份数</p>
                        <div v-for="(item, index) in pageData" :key="index" class="refund-num-box clearfix">
                            <span class="refund-type-name fl">
                                {{item.orderTypeName}}
                            </span>
                            <div class="count-box fl">
                                <span @click='sub(orderType,index)' v-if="item.num>1" class="sub handle-span">-</span>
                                <span v-else class="sub handle-span disabled">-</span>
                                <span class="num handle-span">{{item.num}}</span>
                                <span v-if='item.num<item.limitNum' @click="add(orderType,index)" class="add handle-span">+</span>
                                <span v-else class="add handle-span disabled">+</span>
                            </div>
                        </div>
                    </div>
                </template>
                <div @click="openModal" class="reason-select m-b-10 boxshadow bg-w">
                    <div class="title-box">退款原因 </div>
                    <div class="select">
                        <span v-if='selectReason'>{{selectReason}}</span>
                        <span v-else>请选择</span>
                        <span class="icon-more xx-icon"></span>
                    </div>
                </div>
                <div class="remark  m-b-10 boxshadow bg-w">
                    <div class="title">退款说明</div>
                    <!-- <input class="remark-input" v-model='reson' type="text" maxlength="200" placeholder="选填"> -->
                    <textarea v-if='!show' class="remark-textarea"  maxlength="200" v-model='reson' auto-height placeholder="选填" />
                    <div v-else class="reson-div">{{reson}}</div>
                </div>
            </div>
            <div class="bottom-sumit">
                <div v-if="pageData.realNameList">
                    <div @click="submit" class="button-btn" v-if="selectedNum>0&&(selectReason||reson)">提交申请</div>
                    <div class="button-btn btn-disabled" v-else>提交申请</div>
                </div>
                <div v-else>
                    <div @click="submit" v-if="selectReason" class="button-btn">提交申请</div>
                    <div class="button-btn btn-disabled" v-else>提交申请</div>
                </div>

            </div>
            <!--弹框-拒绝原因-->
            <popup v-model="show">
            <div class="toast-box">
                <div class="modal">
                    <!-- <div class="modal-head clearfix">
          请选择退款原因
          <i @click="closeModal" class="fr close xx-icon icon-guanbi2"></i>
        </div> -->
                    <div class="modal-content">
                        <div class="reason-list">
                            <div class="reason-item">
                                <span>请选择退款原因</span>
                                <div class="fr close">
                                    <i @click="closeModal" class="xx-icon icon-guanbi2 close-svg"></i>
                                </div>
                            </div>
                            <div v-for='(item,index) in reasonList' :key='index' @click="reasonSelect(item)" class="reason-item">
                                <span>{{item}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </popup>
    </div>
</template>

<script>
// Use Vuex
import { Popup} from "vux";
export default {
  components: {Popup},
  data() {
    return {
      refundTypeList: [
        {
          value: 0,
          checked: true,
          name: "仅退款"
        },
        {
          value: 1,
          checked: false,
          name: "退款退货"
        }
      ],
      selected: [{ value: 1, checked: false }],
      pageData: {},
      orderType: "",
      reson: "",
      limitNum: null,
      num: null,
      refundType: 0,
      handleRefundMoney: null,
      animation: null,
      animationData: {},
      show: false,
      reasonList: ["日期下错了", "天气原因", "身体原因", "临时不想去了"],
      selectReason: "", //错误原因选择
      routeNum: []
    };
  },
  computed: {
    selectedNum() {
      let _this = this;
      let i = 0;
      if (this.pageData.realNameList && this.pageData.realNameList.length) {
        this.pageData.realNameList.forEach(ele => {
          if (ele.checked) {
            i++;
          }
        });
        if (this.pageData.realNameList.length == i) {
          this.selected[0].checked = true;
        } else {
          this.selected[0].checked = false;
        }
        return i;
      }
    }
  },
  created() {
    let data =JSON.parse(localStorage.getItem("xjscwxrefunddata_2019_3_15"));

    if (data.orderType == "park") {
      //景区门票
      if (data.realNameList && data.realNameList.length) {
        //实名制门票
        data.realNameList.forEach((item, index) => {
          data.realNameList[index].checked = false;
        });
        this.pageData = data;
      } else {
        // 非实名制
        this.pageData = data;
        this.limitNum = this.pageData.num;
        this.num = this.pageData.num;
        // console.log(this.pageData);
      }
    }
    //商品
    if (data.orderType == "mdse") {
      this.pageData = data;

      this.num = this.pageData.num;
      this.handleRefundMoney = this.pageData.payNum;
      if (this.pageData.orderState == "1") {
        // 待发货状态
        // 没有产生运费 退款今个为商品+运费
        this.limitNum = this.pageData.payNum;
        this.handleRefundMoney = this.pageData.payNum;
      }
      if (this.pageData.orderState == "2") {
        //已发货，邮费已经产生，只能退回商品的钱
        this.limitNum = this.pageData.realNum;
        this.handleRefundMoney = this.pageData.realNum;
      }
    }

    if (data.orderType == "hotel") {
      //酒店
      this.pageData = data;
      this.limitNum = this.pageData.num;
      this.num = this.pageData.num;
    }
    if (data.orderType == "eatery") {
      //餐饮
      this.pageData = data;
      this.limitNum = this.pageData.num;
      this.num = this.pageData.num;
    }
    if (data.orderType == "route") {
      //跟团游
      data.orderDetail.forEach((item, index) => {
        data.orderDetail[index].limitNum = item.amount;
        data.orderDetail[index].num = item.amount;
      });
      this.pageData = data.orderDetail;
      this.orderType = data.orderType;
    }
  },
  methods: {
    checkboxChange(e) {
      this.pageData.realNameList.forEach((item, index) => {
        if (e.mp.detail.value.indexOf(item.id + "") > -1) {
          this.pageData.realNameList[index].checked = true;
        } else {
          this.pageData.realNameList[index].checked = false;
        }
      });
    },
    toggleSelectAll(e) {
      if (e.mp.detail.value.length) {
        //全选
        this.pageData.realNameList.forEach((item, index) => {
          this.pageData.realNameList[index].checked = true;
        });
        this.selected[0].checked = true;
      } else {
        //取消全选
        this.pageData.realNameList.forEach((item, index) => {
          this.pageData.realNameList[index].checked = false;
        });
        this.selected[0].checked = false;
      }
    },
    selectCheck(index) {
      this.pageData.realNameList[index].checked = !this.pageData.realNameList[
        index
      ].checked;
    },
    reasonSelect(str) {
      // 错误原因选择
      this.selectReason = str;
      this.reson = str;
      this.closeModal();
    },
    openModal() {
      this.show = true;   
    },
    closeModal() {
      this.show = false;
    },
    radioChange(e) {
      this.refundType = e.mp.detail.value;
      // this.refundTypeList[index].checked = true;
      this.refundTypeList.forEach((item, index) => {
        this.refundTypeList[index].checked = item.value == this.refundType;
      });
    },
    add(orderType, index) {
      if (orderType == "route") {
        this.pageData[index].num++;
      } else {
        this.num++;
      }
    },
    sub(orderType, index) {
      if (orderType == "route") {
        this.pageData[index].num--;
      } else {
        this.num--;
      }
      // this.num--;
      // this.pageData[index].num--;
    },
    submit() {
        let _this=this
      let data = {};
      //景区门票
      if (this.pageData.orderType == "park") {
        if (this.pageData.realNameList) {
          //门票实名制
          let arr = [];
          //判断实名制是否选择了退单人
          this.pageData.realNameList.forEach(ele => {
            if (ele.checked) {
              //已选择
              arr.push(ele.id);
            }
          });
          if (!arr.length) {
            this.$vux.toast.show({
              type: "warn",
              text: "请选择实名制人员"
            });
            return false;
          }
          data = {
            refundAmount: this.selectedNum,
            orderDetaimModelId: arr.join(","),
            orderId: this.pageData.orderId,
            orderDetailId: this.pageData.orderDetailId,
            refundType: 0
          };
        } else {
          //门票非是实名制
          data = {
            refundAmount: this.num,
            orderId: this.pageData.orderId,
            orderDetailId: this.pageData.orderDetailId,
            refundType: 0
          };
        }
      }
      // 商品
      if (this.pageData.orderType == "mdse") {
        if (this.handleRefundMoney > this.pageData.payNum) {
          this.$vux.toast.show({
            type: "warn",
            text: "退款金额不能超过" + this.pageData.payNum + "元",
            width:"200px"
          });
          return false;
        }
        data = {
          refundAmount: this.pageData.num,
          handleRefundMoney: this.handleRefundMoney,
          orderId: this.pageData.orderId,
          orderDetailId: this.pageData.orderDetailId,
          refundType: this.pageData.orderState == "2" ? this.refundType : 0
        };
      }

      if (
        this.pageData.orderType == "hotel" ||
        this.pageData.orderType == "eatery"
      ) {
        // 酒店
        data = {
          refundType: 0,
          refundAmount: this.num,
          orderId: this.pageData.orderId,
          orderDetailId: this.pageData.orderDetailId
        };
      }
      if (this.reson != "" && this.reson.length < 4) {
        this.$vux.toast.show({
          type: "warn",
          text: "退款说明不能少于4个字符",
          width:'200px'
        });

        return false;
      }
      if (this.orderType == "route") {
        let routeParams = [],
          refundAmount = 0;
        for (let q = 0; q < this.pageData.length; q++) {
          let obj = {
            orderDetailId: this.pageData[q].id,
            refundAmount: this.pageData[q].num
          };
          refundAmount += this.pageData[q].num;
          routeParams.push(obj);
        }
        //跟团游
        data = {
          refundType: 0,
          routeParams: JSON.stringify(routeParams),
          refundAmount: refundAmount,
          orderId: this.pageData[0].orderId
        };
      }

      this.postAxios(
        this.api.member.order.refund,
        Object.assign(data, {
          wayType: 22,
          reason: this.reson ? this.reson : this.selectReason
        })
      ).then(res => {
        if (res.status == 200) {
          _this.$vux.toast.show({
            type: "success",
            text: res.message,
            width:'200px'
          });

          _this.$nextTick(() => {
            _this.$router.back();
          }, 3000);
        } else {
          _this.$vux.toast.show({
            type: "warn",
            text: res.message,
             width:'200px'
          });
        }
        // 页面跳转成功后待定
      });
    }
  }
};
</script>

<style lang="scss">
.back-warp {
  .topShadow {
    width: 100%;
    height: 0.5px;
    background-color: rgba(146, 144, 144, 0.2);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
  }
  .toast-box {
    .modal {
    //   position: relative;
      height: 273px;
    //   position: fixed;
    //   left: 0;
    //   bottom: -100%;
      width: 100%;
      border-top-left-radius: 2px;
      border-top-right-radius: 2px;
      background: #fff;
      // padding-top: 20px;
      z-index: 710;
      font-size: 16px;
      color: #413838;
      font-family: PingFangSC-Medium, sans-serif;
      .modal-head {
        margin-top: 14px;
        padding: 0 15px 0 15px;
        text-align: center;
        .close {
          font-size: 16.5px;
          color: #b2b2b2;
          padding: 7.5px;
        }
      }
      .modal-content {
        .reason-list {
          .reason-item {
            padding: 0 15px;
            border-bottom: 0.5px solid #d7d7d7;
            height: 54.5px;
            line-height: 54.5px;
            text-align: center;
            .close {
              height: 54.5px;
              line-height: 54.4px;
              font-size: 16px;
              color: #b5b5b5;
              .close-svg {
                padding: 0 7.5px;
              }
            }
          }
          .reason-item:last-child {
            border-bottom: none;
          }
        }
      }
    }
  }

  .back-box {
    // padding: 20px 15px;
    .refund-money {
      font-size: 12px;
      font-family: PingFangSC-Medium, sans-serif;
      color: #413838;
      .title {
        float: left;
        width: 90px;
        height: 24px;
        line-height: 24px;
      }
      .refund-input {
        margin-left: 90px;
        height: 24px;
      }
    }
  }
  .bottom-sumit {
    padding: 0 15px;
    .button-btn {
      margin-top: 20px;
      text-align: center;
      color: #fff;
      border-radius: 2px;
      height: 44px;
      line-height: 44px;
      background: #009ded;
      font-size: 16px;
      font-family: PingFangSC-Medium, sans-serif;
    }
    .btn-disabled {
      background-color: #cbcbcb;
    }
  }

  // .title {
  //   font-size: 14px;
  //   color: #413838;
  //   width: 90px;
  //   font-family: PingFangSC-Medium, sans-serif;
  // }
  .remark {
    font-size: 14px;
    color: #413838;
    font-family: PingFangSC-Medium, sans-serif;
    padding: 0 15px;
    // height: 53px;
    display: flex;
    align-items: center;
    background-color: #fff;
    .title {
      margin-right: 10px;
      width: 75px;
      white-space: nowrap;
      height: 53px;
      line-height: 53px;
    }
    .remark-textarea {
      padding: 5px 0;
      overflow: hidden;
      border:none;
      outline: none;
    }
    .remark-input{
        border:none;
      outline: none;
    }
    .reson-div {
      padding: 5px 0;
      overflow: hidden;
      font-size: 14px;
      color: #413838;
      font-family: PingFangSC-Medium, sans-serif;
    }
  }
  .radio-group {
    padding: 15px;
    font-size: 14px;
    color: #413838;
    font-family: PingFangSC-Medium, sans-serif;
    .state-radion {
      transform: scale(0.7);
    }
  }
  .reason-select {
    padding: 0 15px;
    display: flex;
    justify-content: space-between;
    height: 53px;
    align-items: center;
    font-size: 14px;
    color: #413838;
    font-family: PingFangSC-Medium, sans-serif;
    background-color: #fff;
    .title-box {
    }
    .select {
      color: #999999;
    }
  }
  .back-num {
    padding: 16px 15px;
    background-color: #fff;
    .title {
      font-size: 14px;
      color: #413838;
      font-family: PingFangSC-Medium, sans-serif;
      width: auto !important;
    }
    .refund-num-box {
      margin-top: 10px;
      .refund-type-name {
        font-size: 12px;
        color: #333;
        display: block;
      }
    }
    .count-box {
      margin-left: 16px;
      height: 21px;
      text-align: center;
      font-size: 10px;
      color: #5c5c5c;
      .handle-span {
        text-align: center;
        display: inline-block;
        line-height: 21px;
        height: 21px;
        border: 0.5px solid #7d7d7d;
        width: 27.5px;
      }
      .sub {
        // border: 1px solid red;
        border-top-left-radius: 2.5px;
        border-bottom-left-radius: 2.5px;
      }
      .handle-span.disabled {
        border-color: #cccccc;
        color: #cccccc;
      }
      .num {
        border-left: none;
        border-right: none;
        width: 31.5px;
      }
      .add {
        border-top-right-radius: 2.5px;
        border-bottom-right-radius: 2.5px;
      }
    }
  }
  .realname-list {
    checkbox .wx-checkbox-input {
      border-radius: 50%; /* 圆角 */
      // width: 40rpx; /* 背景的宽 */
      // height: 40rpx; /* 背景的高 */
    }
    /* 选中后的 背景样式 （红色背景 无边框 可根据UI需求自己修改） */
    checkbox .wx-checkbox-input.wx-checkbox-input-checked {
      border-color: #f05b47;
      background: #f05b47;
    }
    /* 选中后的 对勾样式 （白色对勾 可根据UI需求自己修改） */
    checkbox .wx-checkbox-input.wx-checkbox-input-checked::before {
      border-radius: 50%; /* 圆角 */
      // width: 40rpx; /* 选中后对勾大小，不要超过背景的尺寸 */
      // height: 40rpx; /* 选中后对勾大小，不要超过背景的尺寸 */
      // line-height: 40rpx;
      text-align: center;
      font-size: 26rpx; /* 对勾大小 30rpx */
      color: #fff; /* 对勾颜色 白色 */
      background: transparent;
      transform: translate(-50%, -50%) scale(1);
      -webkit-transform: translate(-50%, -50%) scale(1);
    }

    .go-pay {
      //   height: 55px;
      width: 100%;
      font-size: 14px;
      color: #5c5c5c;
      display: flex;
      justify-content: space-between;
      background: #fff;
      margin-bottom: 0.5px;
      .title-realname {
        margin-left: 15px;
        line-height: 55px;
      }
      .select-all {
        display: flex;
        align-items: center;
        padding-left: 10px;
        .item-info,
        .quanxuan {
          display: inline-block;
          height: 55px;
          line-height: 55px;
          margin: 0.5px 0;
        }
        .allselect-radio {
          transform: scale(0.7);
        }
        .text {
          color: #5c5c5c;
          width: 50px;
          display: inline-block;
          font-family: PingFangSC-Medium, sans-serif;
        }
        .idno {
          margin-left: 125px;
        }
      }
    }
  }
}
</style>
