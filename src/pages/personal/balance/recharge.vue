<template>
  <div class="recharge-page">
    <div class="recharge-bar">
      <h3>充值金额</h3>
      <div class="num-bar">
        <span class="unit">￥</span>
        <input class="num-input" type="number" />
      </div>
    </div>
    <div class="submit-bar">
      <button class="btn" type="button" @click="go('/recharge/pay')">立即充值</button>
    </div>
    <div class="list">
      <!-- <div class="item">
        <div class="item-box">
          <div class="price">
            <span class="unit">￥</span>
            <span class="num">200</span>
          </div>
          <span class="line"></span>
          <div class="give-bar">
            <div class="txt-box">充值赠送 ￥20</div>
            <div class="px-info">赠品：新时代门票*1</div>
          </div>
          <div class="recharge-warper">
            <div class="txt">
              <span>立即</span>
              <span>充值</span>
            </div>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="item-box">
          <div class="price">
            <span class="unit">￥</span>
            <span class="num">200</span>
          </div>
          <span class="line"></span>
          <div class="give-bar">
            <div class="txt-box">充值赠送 ￥20</div>
            <div class="px-info">赠品：新时代门票*1</div>
          </div>
          <div class="recharge-warper">
            <div class="txt">
              <span>立即</span>
              <span>充值</span>
            </div>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="item-box">
          <div class="price">
            <span class="unit">￥</span>
            <span class="num">200</span>
          </div>
          <span class="line"></span>
          <div class="give-bar">
            <div class="txt-box">充值赠送 ￥20</div>
            <div class="px-info">赠品：新时代门票*1</div>
          </div>
          <div class="recharge-warper">
            <div class="txt">
              <span>立即</span>
              <span>充值</span>
            </div>
          </div>
        </div>
      </div> -->
      <div v-for="(item,index) in list" :key="index" class="item">
        <div class="item-box">
          <div class="price">
            <span class="unit">￥</span>
            <span class="num">{{item.rechargeValue}}</span>
          </div>
          <span class="line"></span>
          <div class="give-bar">
            <div class="txt-box">充值赠送 ￥{{item.rechargeGift}}</div>
            <div class="px-info" v-for="(it,i) in item.product" :key='i'>赠品：{{it.productName}}*{{it.num}}</div>
          </div>
          <div class="recharge-warper">
            <div class="txt">
              <span>立即</span>
              <span>充值</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: []
    };
  },
  methods: {
    getData() {
      this.getAxios("/leaguer/api/recharge/list").then(res => {
        this.list = res.data;
      });
    },
    go(path) {
      this.$router.push(path);
    }
  },
  created() {
    this.getData();
  }
};
</script>
<style lang="scss" scoped>
.recharge-page {
  .list {
    padding: 0 12.5px;
    .item {
      background: #fff;
      padding: 5px;
      margin-bottom: 10px;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
      .item-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        // height: 80px;
        border: 1px solid #d9e7ff;
        padding: 15px 10px;
        .recharge-warper {
          background: #3f86ff;
          border-radius: 50%;
          padding: 2px;
          .txt {
            font-size: 13px;
            color: #fff;
            height: 45px;
            width: 45px;
            border-radius: 50%;
            border: 1px solid #fff;
            display: flex;
            flex-direction: column;
            // align-content: center;
            justify-content: center;
            text-align: center;
            span {
              line-height: 16px;
            }
          }
        }
        .give-bar {
          .px-info {
            font-size: 12px;
            color: #3f86ff;
            padding-top: 3px;
          }
          .txt-box {
            line-height: 22px;
            display: inline-block;
            height: 20px;
            color: #fff;
            background: #3f86ff;
            padding: 0 6px;
            font-size: 12px;
            position: relative;
            &::before {
              position: absolute;
              content: "";
              top: 5px;
              left: -5px;
              border-right: 8px solid #3f86ff;
              border-top: 5px solid transparent;
              border-bottom: 5px solid transparent;
            }
          }
        }
        .price {
          // display: flex;
          // align-items: baseline;
          color: #3f86ff;
          .unit {
            font-size: 20px;
            display: inline-block;
            vertical-align: bottom;
          }
          .num {
            font-size: 50px;
            height: 34px;
            line-height: 34px;
          }
        }

        .line {
          height: 40px;
          width: 1px;
          background: #d9e7ff;
        }
      }
    }
  }
  .submit-bar {
    padding: 20px 12.5px 25px 12.5px;
    .btn {
      width: 100%;
      text-align: center;
      color: #fff;
      height: 45px;
      line-height: 45px;
      background: #3f86ff;
      outline: none;
      border: none;
      border-radius: 2px;
      font-size: 16px;
    }
  }
  .recharge-bar {
    background: #fff;
    padding: 0 12.5px;
    height: 127px;
    h3 {
      font-size: 17px;
      color: #333;
      padding-top: 13px;
    }
    .num-bar {
      display: flex;
      margin-top: 18px;
      .unit {
        color: #333;
        font-size: 30px;
        display: inline-block;
      }
      .num-input {
        flex: 1;
        padding-left: 10px;
        border: none;
        outline: none;
        font-size: 24px;
        color: #333;
      }
    }
  }
}
</style>
