<template>
  <div class="topContacts" @click="noShow">
    <!-- <navbar :backShow='false' title=''></navbar> -->
    <div>
      <!-- <navbar title='常用联系人'></navbar> -->
      <div v-if="dataList.length>0">
        <div class="contact-list clearfix" v-for="(item,index) in dataList" :key="index">
          <div class="con-left">
            <p class="con-name">{{item.name}}</p>
            <div class="con-tel">
              <img src="http://statics.lotsmall.cn/wx/img/icon-tel.png" alt class="con-tel-img">
              <span class="con-text">{{item.phone}}</span>
            </div>
            <div class="con-tel" v-if="item.certNo">
              <img
                src="http://statics.lotsmall.cn/wx/img/icon-idcard.png"
                alt
                class="con-idcard-img"
              >
              <span class="con-text">{{item.certNo}}</span>
            </div>
            <div class="con-tel" v-else>
              <span
                class="con-text text2"
                @click="go('/personal/contactsAdd?id=' + item.id)"
              >信息不全，点击补充</span>
            </div>
          </div>
          <div class="con-box clearfix">
            <div class="del-right" :class="{move:delBtnShow==item.id}" @click="del(item.id)">
              <span class="span-text">删除</span>
            </div>
            <div class="con-right">
              <div class="operation" @click="go('/personal/contactsAdd?id=' + item.id)">
                <img src="http://statics.lotsmall.cn/wx/img/icon-edit.png" alt class="con-edit-img">
              </div>
              <div class="operation" @click.stop="delCon(item.id)">
                <img src="http://statics.lotsmall.cn/wx/img/icon-del.png" alt class="con-del-img">
              </div>
            </div>
          </div>
        </div>
        <div v-if="dataList.length<=0">
          <div class="no-cash">暂无联系人</div>
        </div>
        <div class="addContact" @click="go('/personal/contactsAdd')">
          <span>添加联系人</span>
        </div>
     
  </div>
  </div>
  </div>
</template>

<script>
// Use Vuex
// import { getData, postData, merchantInfoId } from "@/common/common";
// import navbar from "@/components/navbar";
export default {
  components: {
    // navbar
  },
  computed: {},
  data() {
    return {
      delBtnShow: "",
      dataList: []
    };
  },
  created() {
    document.title = "常用联系人";
    this.getContacts();
  },
  methods: {
    //获取联系人
    getContacts() {
      let cListUrl = this.api.contacts.getContactsList;
      let data = {};
      this.getAxios(cListUrl).then(res => {
        this.dataList = res.data;
        // this.openModal();
      });
    },
    noShow(e) {
      this.delBtnShow = "";
    },
    getList() {
      this.getAxios(this.api.contacts.getContactsList, {
        // leaguerId: wx.getStorageSync("WxXjscUserInfo").leaguerId
      }).then(res => {
        if (res.status == 200) {
          this.dataList = res.data;
        } else {
          this.$vux.toast.show({
              type:'cancel',
              text:res.message
          })
        }
      });
    },
    gotoGame(path) {
      this.reLaunchPageTo(this.router + path);
    },
    goUrl(path) {
        if(path=='newContacts'){
            this.$router.push('/personal/contactsAdd')
        }
    },
    editCon(id) {
         this.$router.push({path:'/personal/contactsAdd',query:{id:id}})
    },
    delCon(id) {
      this.delBtnShow = id;
      return false;
    },
    del(id) {
      this.getAxios(this.api.contacts.deleteContacts, {
        id: id
      }).then(res => {
        this.$vux.toast.text("联系人删除成功!", "middle");
        this.getContacts();
      });
    }
  }
};
</script>

<style lang="scss">
.topContacts {
  width: 100%;
  overflow: hidden;
  padding-bottom: 50px;
  .no-cash {
    text-align: center;
    padding: 15px;
    font-size: 16px;
    color: #413838;
    font-family: PingFangSC-Medium, sans-serif;
  }
  .contact-list {
    // width: 100%;
    height: 89.5px;
    background-color: #fff;
    // padding: 0 15px;
    padding-left: 15px;
    margin-bottom: 10px ;
    display: flex;
    align-items: center;
    .con-left {
      width: 70%;
      float: left;
      .con-name {
        color: #413838;
        font-size: 14px;
        font-family: PingFangSC-Medium, sans-serif;
      }
      .con-tel {
        color: #7a7373;

        .con-tel-img {
          display: inline-block;
          vertical-align: middle;
          width: 7.5px;
          height: 11px;
        }
        .con-idcard-img {
          display: inline-block;
          vertical-align: middle;
          width: 10.5px;
          height: 8.5px;
        }
        .con-text {
          margin-left: 10px;
          font-size: 12px;
        }
        .text2 {
          color: #f05b47;
        }
      }
    }
    .con-box {
      width: 102.5px;
      height: 89.5px;
      position: relative;
      .con-right {
        // width: 50px;
        height: 89.5px;
        float: right;
        display: flex;
        align-items: center;
        padding-right: 20px;
        .operation {
          // width: 15%;
          display: inline-block;
          margin-right: 20px;
          .con-edit-img {
            display: inline-block;
            vertical-align: middle;
            width: 19px;
            height: 19.5px;
          }
          .con-del-img {
            display: inline-block;
            vertical-align: middle;
            width: 16.5px;
            height: 18.5px;
          }
        }
        .operation:last-child {
          margin-right: 0;
        }
      }
      .del-right {
        position: absolute;
        width: 102.5px;
        height: 89.5px;
        top: 0;
        right: -115px;
        line-height: 89.5px;
        font-size: 16px;
        text-align: center;
        background-color: #f05b47;
        color: #fff;
        transition: all 0.3s linear;
      }
      .move {
        right: -7px;
      }
    }
  }
  .addContact {
    width: 100%;
    height: 49px;
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: #f05b47;
    color: #fff;
    text-align: center;
    line-height: 49px;
    font-size: 16px;
  }
  .topContacts::-webkit-scrollbar {
    width: 0;

    height: 0;

    color: transparent;
  }
}
</style>
