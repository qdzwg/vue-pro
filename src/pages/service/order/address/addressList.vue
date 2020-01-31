<template>
  <div class="address-warper">
    <!-- <navbar title='选择收货地址'></navbar> -->
    <div>
      <div v-if="addressList.length" class="address-list">
        <!-- <radio-group class="radio-group" @change="radioChange"> -->
        <label class="radio" v-for="(item,index) in addressList" :key="index">
          <div class="address-item boxshadow">
            <div class="address-info">
              <div class="checkbox-box">
                <label>
                  <input type="radio" @change="radioChange" :value="item.id" name="radioAddress" v-model="radiovalue">
                  <div class="checkbox-moli"></div>
                </label>
              </div>
              <div class="buyer-info">
                <div class="name-tel">
                  <span class="name">{{item.linName}}</span>
                  <span class="tel">{{item.likPhone}}</span>
                </div>
                <div class="address two-line">{{item.areaName+item.addressDetail}}</div>
              </div>
            </div>
            <div class="handle-warper">
              <i class="xx-icon icon-fankui edit" @click.stop="edit(item.id)"></i>
              <i class="xx-icon icon-shanchu del" @click.stop="del(item.id)"></i>
            </div>
          </div>
          <!-- <radio value="{{item.name}}" checked="{{item.checked}}" />{{item.value}} -->
        </label>
        <!-- </radio-group> -->
      </div>
      <div class="no-address" v-else>暂无数据</div>
      <div @click="go('/address/mgt')" class="add-address">添加新地址</div>
    </div>
  </div>
</template>

<script>
// import { getData, postData, merchantInfoId } from "@/common/common";
// import api from "@/api/api";
// import navbar from "@/components/navbar";
import { CheckIcon } from "vux";
export default {
  components: {
    // navbar
    CheckIcon
  },
  data() {
    return {
      radiovalue: null,
      addressList: []
      // isIos:true//是否是苹果手机
    };
  },
  computed: {},
  onLoad() {},
  created() {
    this.initData();
  },
  methods: {
    edit(id) {
      this.go("/address/mgt?id=" + id);
    },
    del(id) {
      this.postAxios(this.api.main.address.delete, {
        leaguerAddressId: id
      }).then(res => {
        // wx.showToast({
        //   title: "删除成功",
        //   duration: 2000
        //   //  icon: "none"
        // });
        this.$vux.toast.text("删除成功", "middle");
        this.initData();
      });
    },
    initData() {
      this.getAxios(this.api.main.address.list, {
        currPage: 1,
        pageSize: 50
      }).then(res => {
        if (res.status == 400) {
          //如果token不存在或者过期
          this.initData();
        } else {
          res.data.rows.forEach((item, index) => {
            // res.data.rows[index].isDefault = item.defaultAddr == "T";
            if(item.defaultAddr == "T"){
                this.radiovalue = item.id
            }
          });
          this.addressList = res.data.rows;
        }
      });
    },
    radioChange() {
      this.postAxios(this.api.main.address.default, {
        leaguerAddressId: this.radiovalue
      }).then(res => {
         this.$vux.toast.text("默认地址设置成功", "middle");
      });
    },
    goUrl(path) {
      // this.closeModal();
      this.navigatePageTo(this.router + path);
    }
  }
};
</script>

<style lang="scss">
.address-warper {
  .checkbox-box {
    display: inline-block;
    height: 20px;
    padding: 0 10px;
    input {
      display: none;
    }
    .checkbox-moli {
      display: inline-block;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 1px solid #9a9a9a;
      background: #ffffff;
      position: relative;
    }
    div.checkbox-moli::after {
      position: absolute;
      left: 0;
      top: 0;
      content: "";
      width: 16px;
      height: 16px;
    }
    input:checked + .checkbox-moli {
      border-color: transparent;
    }
    input:checked + .checkbox-moli::after {
      background: url("../../../../assets/images/checkbox.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      -moz-background-size: 100% 100%;
      transform: scale(1.3);
    }
  }
  .address-list {
    padding-top: 10px;
    padding-bottom: 55px;
    .address-item {
      background: #fff;
      height: 93px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: PingFangSC-Regular, sans-serif;
      color: #413838;
      .address-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .address-radio {
          transform: scale(0.7);
          margin: 0 10px;
          margin-right: 6.5px;
        }
        .buyer-info {
          .name-tel {
            margin-bottom: 5px;
            .name {
              font-size: 14px;
              margin-right: 11px;
            }
            .tel {
              font-size: 12px;
              color: #5c5c5c;
            }
          }
          .address {
            width: 223px;
            font-size: 12px;
          }
        }
      }

      .handle-warper {
        display: flex;
        justify-content: space-between;
        padding-right: 19px;
        color: #999;
        .xx-icon {
          font-size: 22px;
        }
        .edit {
          margin-right: 17.5px;
        }
        .del {
          margin-right: 2.5px;
        }
      }
    }
  }
  .no-address {
    // background: #fff;
    text-align: center;
    font-family: PingFangSC-Regular, sans-serif;
    color: #413838;
    font-size: 18px;
    margin-top: 10px;
    padding: 15px;
  }
  .add-address {
    position: fixed;
    width: 100%;
    height: 49px;
    line-height: 49px;
    left: 0;
    bottom: 0;
    background: #f05b47;
    text-align: center;
    color: #fff;
    font-size: 16px;
    font-family: PingFangSC-Regular, sans-serif;
  }
}
</style>
