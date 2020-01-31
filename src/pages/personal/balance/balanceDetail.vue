<template>
  <div class="balcance-detail">
    <div class="balcance-header">
      <div class="type-select" @click="show=!show">
        <span class="txt">全部交易类型</span>
        <i class="icon iconfont icondaosanjiao"></i>
      </div>
      <div @click="timeShow=!timeShow" class="time">
        <i class="icon iconfont iconrili"></i>
      </div>
    </div>
    <div class="balcance-content">
      <div class="balcance-list">
        <router-link tag="div" class="balcance-item" to="/cost/detail">
          <div class="name-time">
            <h2>小鲸商城-消费</h2>
            <div class="time">2019-12-12 06:06:06</div>
          </div>
          <span class="price">+300.00</span>
        </router-link>
        <router-link tag="div" class="balcance-item" to="/cost/detail">
          <div class="name-time">
            <h2>小鲸商城-消费</h2>
            <div class="time">2019-12-12 06:06:06</div>
          </div>
          <span class="price">+300.00</span>
        </router-link>
        <router-link tag="div" class="balcance-item" to="/cost/detail">
          <div class="name-time">
            <h2>小鲸商城-消费</h2>
            <div class="time">2019-12-12 06:06:06</div>
          </div>
          <span class="price">+300.00</span>
        </router-link>
      </div>
    </div>
    <popup class="type-pop" v-model="show" scoped>
      <div>
        <div class="type-header">选择积分类型</div>
        <div class="type-list">
          <div v-for="(item,index) in typeList" :key="index" class="type-item">
            <div class="bar" @click="select(item.key)" :class="{on:active==item.key}">{{item.value}}</div>
          </div>
          <!-- <div class="type-item">
            <div class="bar">增加</div>
          </div>
          <div class="type-item">
            <div class="bar">减扣</div>
          </div>-->
        </div>
        <div class="cancel" @click="show=false">取消</div>
      </div>
    </popup>
    <popup v-model="timeShow" class="time-warper">
      <div class="time-content">
        <div class="opt-bar">
          <button class="sure btn" type="button">确定</button>
          <button class="cancel btn" type="button">关闭</button>
        </div>
        <datetime-view v-model="value1" ref="datetime" format="YYYY-MM-DD"></datetime-view>
      </div>
    </popup>
  </div>
</template>
<style lang="scss" scoped>
.balcance-detail {
  .type-pop {
    background: #fff;
    .cancel {
      height: 35px;
      line-height: 35px;
      font-size: 16px;
      color: #333;
      text-align: center;
    }
    .type-header {
      text-align: center;
      font-size: 18px;
      color: #000;
      padding: 10px 0px;
      border-bottom: 1px solid #ebecf1;
    }
    .type-list {
      display: flex;
      border-bottom: 7px solid #ccc;
      .type-item {
        flex: 1;
        padding: 10px 15px;
        .bar {
          border: 1px solid #ebecf1;
          text-align: center;
          height: 50px;
          line-height: 50px;
          font-size: 16px;
          color: #333;
          &.on {
            border-color: #ff0000;
            color: #fff;
            background: #ff0000;
          }
        }
      }
    }
  }
  .time-warper {
    .time-content {
      background: #fff;
      .opt-bar {
        padding: 5px;
        display: flex;
        justify-content: space-between;
        .btn {
          outline: none;
          border: none;
          padding: 3px 10px;
          font-size: 14px;
        }
        .sure {
          color: #333;
        }
        .cancel {
          // color: #fff;
        }
      }
    }
  }
  .balcance-content {
    background: #fff;
    .balcance-list {
      .balcance-item {
        padding: 0 12.5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 70px;
        border-bottom: 1px solid #ebecf1;
        .price {
          font-size: 16px;
          color: #ff0000;
        }
        .name-time {
          h2 {
            font-size: 17px;
            color: #333333;
          }
          .time {
            font-size: 12px;
            color: #a1a1a1;
          }
        }
      }
    }
  }
  .balcance-header {
    text-align: center;
    position: relative;
    height: 45px;
    line-height: 45px;
    background: #fff;
    margin-bottom: 7px;
    .type-select {
      display: inline-block;
    }
    .txt {
      font-size: 15px;
      color: #333;
      padding-right: 3px;
    }
    .icon-daosanjiao {
      font-size: 12px;
    }
    .time {
      position: absolute;
      right: 0;
      top: 0;
      height: 45px;
      line-height: 45px;
      padding: 0 12.5px;
      .iconrili {
        font-size: 20px;
      }
    }
  }
}
</style>

<script>
import { Popup, DatetimeView } from "vux";
export default {
  components: {
    Popup,
    DatetimeView
  },
  created() {
    document.title = "余额明细";
    this.getData();
  },
  data() {
    return {
      active: "0",
      value1: "2017-12-12",
      timeShow: false,
      show: false,
      typeList: [
        {
          key: "0",
          value: "全部"
        },
        {
          key: "1",
          value: "增加"
        },
        {
          key: "2",
          value: "减扣"
        }
      ]
    };
  },
  methods: {
    select(key) {
      this.active = key;
      this.show = false;
      this.getData();
    },
    getData() {
      this.getAxios("/leaguer/api/balance/history", {
        currPage: 1,
        pageSize: 10,
        transType:""
      });
    }
  }
};
</script>
