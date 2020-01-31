<template>
  <div v-transfer-dom>
    <popup v-model="contactShow"
           @on-hide="actionContact('hide')"
           @on-show="actionContact('show')">
      <div class="contacts-page">
        <div class="modal">
          <slot name="header">
            <div class="modal-head clearfix">
              <i @click="actionContact('hide')"
                 class="fr close xx-icon icon-cha1"></i>
              <span>常用联系人</span>
            </div>
          </slot>
          <div class="modal-content">
            <div v-if="contactList.length"
                 class="contacter-ul">
              <div v-for="(item, index) in contactList"
                   :key="index"
                   class="contacter-li vux-1px-b">
                <div class="c-li-left">
                  <p class="contacter-name">{{item.name}}</p>
                  <p class="contacter-tel">
                    <span class="contacter-label">
                      <img src="http://statics.lotsmall.cn/wx/img/icon-tel.png"
                           class="tel-icon">
                    </span>
                    <span class="tel-text">{{item.phone}}</span>
                  </p>
                  <p class="contacter-idcard">
                    <span v-if="item.certNo"
                          class="contacter-label">
                      <img src="http://statics.lotsmall.cn/wx/img/icon-idcard.png"
                           class="idcard-icon">
                    </span>
                    <span v-if="item.certNo"
                          class="idcard-text">{{item.certNo}}</span>
                    <span v-else
                          class="add-information"
                          @click="go('/personal/contactsAdd?id=' + item.id)">信息不全，点击补充</span>
                  </p>
                </div>
                <div class="c-li-right"
                     @click.stop="popContantsInfo(item)">使用</div>
              </div>
            </div>
            <div v-else
                 class="noData contact-nodata">
              <span class="nodata-text">暂无常用联系人</span>
            </div>
          </div>
        </div>
      </div>
    </popup>
  </div>

</template>

<script>
import { Popup, TransferDom } from "vux";
import { mapState } from "vuex";
export default {
  components: {
    Popup
  },
  directives: {
    TransferDom
  },
  props: {
    contactShow: {
      type: Boolean,
      default: false
    }
  },
  created () {

  },
  computed: {
    ...mapState('traffic/', {
      contactList: state => state.manList
    })
  },
  data () {
    return {

    };
  },
  methods: {
    popContantsInfo (item) {
      let { certNo, name, phone } = item
      this.$emit("getContacts", { certNo, name, phone });
      this.actionContact('hide')
    },
    showContacts () {
      this.contractShow = true;
    },
    // //获取联系人
    // getContacts () {
    //   let cListUrl = this.api.contacts.getContactsList;
    //   let data = {};
    //   this.getAxios(cListUrl).then(res => {
    //     this.contactList = [...res.data, ...res.data, ...res.data];
    //   });
    // },
    /**r
      return @params type:show展示
     */
    actionContact (type) {
      let contactShow = false
      if (type == 'show') {
        contactShow = true
      }
      this.$emit('update:contactShow', contactShow)
    }
  }
};
</script>

<style lang="scss">
@import "../../../assets/styles/mixin.scss";
.contacts-page {
  // position: fixed;
  // left: 0;
  // bottom: -100%;
  // width: 100%;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background: #fff;
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
        padding: 18px 0px;
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
            line-height: 18px;
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
      .contacter-li:last-child {
        &:after {
          border: none;
        }
      }
    }
  }
}
</style>
