/*
 * @Author: mikey.qiaoyang 
 * @Date: 2019-09-19 11:39:47 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-10-23 15:42:33
 */
//管理app.vue中loading的显示
import {getAxios} from '@/api/axios.js';
import Vm from '@/main.js';
const Traffic = {
  namespaced: true, //不要修改,命名空间
  state: {
    lineInfo: {},
    orderDate: {}, //下单时间
    manList: [], //所有联系人
    userInfo: {}, //缓存用户信息
    linkManInfo: {
      name: '',
      certNo: '',
      phone: '',
    },
    buyManList: [
      {
        name: '',
        certNo: '',
        idcardType: 'id',
        key: new Date ().getTime (),
      },
    ],
  },
  getters: {
    totalPrice (state) {
      let len = state.buyManList.length;
      let totalPrice = len
        ? (len * (state.lineInfo.priceRetail * 100) / 100).toFixed (2)
        : '0.00';
      return totalPrice;
    },
  },
  mutations: {
    setLineIno (state, payload) {
      state.lineInfo = payload;
    },
    setOrderDate (state, payload) {
      state.orderDate = JSON.parse (JSON.stringify (payload));
    },
    setManList (state, payload) {
      state.manList = payload;
    },
    setUserInfo (state, payload) {
      state.userInfo = payload;
    },
    setLinkMan (state, payload) {
      state.linkManInfo = payload;
    },
    setBuyMan (state, payLoad) {
      state.buyManList = payLoad;
    },
  },
  actions: {
    getManAxios({commit}) {
      Vm.getAxios ('/leaguer/api/leaguerContacts/getContactsList')
        .then (res => {
          if (res.status === 200) {
            let data = res.data;
            if (data.length) {
              commit ('setManList', data);
            }
          }
        })
        .catch (err => {
          console.log (err);
        });
    },
    getUserInfoAxios({commit}) {
      Vm.getAxios ('/leaguer/api/userLeaguer/manage/leaguerInfo', {
        leaguerId: localStorage.getItem ('xjsc_login_userId_2019_3_8') ||
          Vm.$cookie.get ('leaguerInfoId'),
      }).then (res => {
        let {realName: name, idcard: certNo, mobile: phone} = res.data;
        commit ('setUserInfo', res.data);
        commit ('setLinkMan', {
          name,
          certNo,
          phone,
        });
      });
    },
    emptyData({commit}) {
      commit ('setBuyMan', [
        {
          name: '',
          certNo: '',
          idcardType: 'id',
          key: new Date ().getTime (),
        },
      ]);
    },
  },
};

export default Traffic;
