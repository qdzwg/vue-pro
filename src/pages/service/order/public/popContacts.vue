<template>
  <div class="contacts-page">
    <div class="pop-contacts-wrap">
      <!--联系人弹框-->
      <div class="toast-box" :class="{on:contractShow}">
        <div class="modal">
          <slot name="header">
            <div class="modal-head clearfix">
              <i @click="contractShow=false" class="fr close xx-icon icon-cha1"></i>
              <span>常用联系人</span>
            </div>
          </slot>
          <div class="modal-content">
            <div v-if="contactList.length" class="contacter-ul">
              <div
                v-for="(item, index) in contactList"
                :key="index"
                @click="popContantsInfo(item)"
                class="contacter-li"
              >
                <div class="c-li-left">
                  <p class="contacter-name">{{item.name}}</p>
                  <p class="contacter-tel">
                    <span class="contacter-label">
                      <img src="http://statics.lotsmall.cn/wx/img/icon-tel.png" class="tel-icon" />
                    </span>
                    <span class="tel-text">{{item.phone}}</span>
                  </p>
                  <p class="contacter-idcard">
                    <span v-if="item.certNo" class="contacter-label">
                      <img
                        src="http://statics.lotsmall.cn/wx/img/icon-idcard.png"
                        class="idcard-icon"
                      />
                    </span>
                    <span v-if="item.certNo" class="idcard-text">{{item.certNo}}</span>
                    <span
                      v-else
                      class="add-information"
                      @click="go('/personal/contactsAdd?id=' + item.id)"
                    >信息不全，点击补充</span>
                  </p>
                </div>
                <div class="c-li-right" @click.stop="popContantsInfo(item)">使用</div>
              </div>
            </div>
            <div v-else class="noData contact-nodata">
              <!-- <i class="xx-icon icon-iconfont-gantanhaom"></i> -->
              <span class="nodata-text">暂无常用联系人</span>
              <!-- <button>去添加</button> -->
            </div>
          </div>
          <!-- <div
            class="fixed-bottom"
            @click="go('/personal/contactsAdd')"
          >去添加</div>-->
        </div>
      </div>
      <div v-if='contractShow' @click="contractShow=false" class="pop-contacts-mask"></div>
    </div>
    <confirm v-model="delShow" @on-confirm="onConfirm">
      <p style="text-align:center;">确定删除此联系人吗？</p>
    </confirm>
  </div>
</template>

<script>
import { Popup, Confirm } from "vux";
export default {
  components: {
    Popup,
    Confirm
  },
  data() {
    return {
      contractShow: false,
      contactList: [],
      delShow: false
    };
  },
  methods: {
    popContantsInfo(item) {
      this.$emit("getContactsInfo", item);
      this.contractShow = false;
    },
    //删除常用联系人
    delContact(id) {
      this.delShow = true;
      this.delContactId = id;
    },
    onConfirm() {
      let delUrl = this.api.contacts.deleteContacts;
      this.getAxios(delUrl, {
        id: this.delContactId
      }).then(result => {
        this.$vux.toast.text("联系人删除成功!", "middle");
        this.getContacts();
      });
    },
    showContacts() {
     
      this.getContacts();
    },
    //获取联系人
    getContacts() {
      let cListUrl = this.api.contacts.getContactsList;
      let data = {};
      this.getAxios(cListUrl).then(res => {
        this.contactList = res.data;
        // this.openModal();
         this.contractShow = true;
      });
    }
  }
};
</script>

<style lang="scss">
@import "../../../../assets/styles/mixin.scss";
.contacts-page {
  .toast-box {
    z-index: 21;
    position: fixed;
    bottom: -100%;
    width: 100%;
    left: 0;
    transition: all 1s;
    &.on{
      bottom: 50px;
    }
    .fixed-bottom {
      position: absolute;
      left: 0;
      bottom: 0;
      text-align: center;
      width: 100%;
      background: #f05b47;
      color: #fff;
      font-size: 16px;
      height: 49px;
      line-height: 49px;
      font-family: PingFangSC-Regular, sans-serif;
    }
    .modal {
      // position: fixed;
      // left: 0;
      // bottom: -100%;
      // width: 100%;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      background: #fff;
      padding-bottom: 10px;
      position: relative;
      z-index: 710;
      .modal-head {
        text-align: center;
        font-size: 16px;
        border-bottom: 1px solid #e1e1e1;
        color: #413838;
        span {
          line-height: 56px;
        }
        .close {
          font-size: 12px;
          color: #b2b2b2;
          margin-right: 15px;
          margin-top: 15px;
        }
      }
      .modal-content {
        max-height: 385px;
        overflow: auto;
        .contacter-ul {
          padding-left: 15px;
          .contacter-li {
            width: 100%;
            margin-bottom: 16px;
            border-bottom: 1px solid #e1e1e1;
            padding: 20px 0px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .c-li-left {
              width: 240px;
              .contacter-label {
                width: 17px;
                display: inline-block;
                vertical-align: middle;
              }
              .contacter-name {
                font-size: 16px;
                font-weight: bold;
                line-height: 16px;
                color: #413838;
                @include oh(2);
              }
              .contacter-tel {
                height: 12px;
                margin-top: 10px;
                line-height: 12px;
                .tel-icon {
                  width: 7.5px;
                  height: 11px;
                  display: block;
                }
                .tel-text {
                  font-size: 12px;
                  color: #999;
                  display: inline-block;
                  vertical-align: middle;
                }
              }
              .contacter-idcard {
                height: 12px;
                line-height: 12px;
                margin-top: 10px;
                .idcard-icon {
                  width: 10.5px;
                  height: 8.5px;
                  display: block;
                }
                .idcard-text {
                  font-size: 12px;
                  color: #999;
                  display: inline-block;
                  vertical-align: middle;
                }
              }
            }
            .c-li-right {
              width: 86px;
              line-height: 40px;
              border: 1px solid #f05b47;
              color: #f05b47;
              text-align: center;
              margin-left: 20px;
              margin-right: 20px;
            }
            .add-information {
              color: #f05b47;
              font-size: 11px;
            }
          }
        }
      }
    }
  }
}
// .pop-contacts-wrap {
//   position: fixed;
//   z-index: 1;
//   bottom: 50px;
//   left: 0px;
//   width: 100%;
// }
.pop-contacts-mask {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 18;
}
</style>
