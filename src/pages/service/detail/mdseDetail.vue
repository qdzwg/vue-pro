<template>
  <div class="goods-detail"
       :class="{overflow:skuShow}">
    <div>
      <!--详情页轮播图开始-->
      <swiper v-if="imgUrls.length"
              auto
              loop
              :interval="2000"
              height="5.906667rem"
              class="text-scroll"
              dots-position="center">
        <swiper-item v-for="(imgUrl,index) in imgUrls"
                     :key="index">
          <img style="width:100%;height:100%"
               :src="imgUrl + '?imageMogr2/thumbnail/640x/strip/quality/100'"
               alt>
        </swiper-item>
      </swiper>
      <!--详情页轮播图结束-->
      <!--详情页主要信息-->
      <div class="detail-info clearfix boxshadow">
        <div class="detail-info-main">
          <div class="detail-info-title two-line">{{pageData.nickName}}</div>
          <div class="detail-price-info">
            <div class="show-price">
              <div class="last-price">
                <template v-if="min&&max&&min!=max">
                  <span class="unit">￥</span>
                  <span class="price">{{min}}~{{max}}</span>
                </template>
                <template v-if="min&&max&&min==max">
                  <span class="unit">￥</span>
                  <span class="price">{{min}}</span>
                </template>
              </div>
              <div class="old-price">￥{{pageData.priceShow}}</div>
            </div>
            <div class="sell-num">
              <span class="text">已售:</span>
              <span class="num">{{pageData.virtualSale}}</span>
            </div>
          </div>
          <div>
            <div class="spec"
                 @click="skuModelShow(false)">规格</div>
          </div>
        </div>
      </div>
      <!--评论-->
      <div class="detail-info-content mb10">
        <div class="info-content-item">
          <span class="content-item-title">评论{{commentList.length?('('+commentList.length+')'):''}}</span>
        </div>
        <div class="info-content-main boxshadow">
          <!--评论有数据-->
          <div v-if="commentList.length"
               class="detail-comment-ul">
            <div v-for="(item,index) in commentList"
                 :key="index"
                 class="detail-comment-li">
              <p class="clearfix">
                <img v-if="item.headImg"
                     :src="item.headImg"
                     class="comment-img">
                <i v-else
                   class="xx-icon icon-member fl member-svg"></i>
                <span class="comment-name">{{item.userName}}</span>
                <em class="comment-date">{{item.createTime}}</em>
              </p>
              <p class="comment-content">{{item.content}}</p>
            </div>
          </div>
          <!--评论无数据-->
          <div v-else
               class="noData">
            <!-- <i class="xx-icon icon-iconfont-gantanhaom nodata-svg"></i> -->
            <span class="nodata-text">暂无评论</span>
          </div>
        </div>
      </div>

      <!--景点详情-->
      <div class="detail-info-content">
        <div class="info-content-item">
          <span class="content-item-title">商品详情</span>
        </div>
        <div class="info-content-main boxshadow"
             id="info-content-main">
          <!-- <wx-parse :contentstr="str"></wx-parse> -->
          <div v-html="str"></div>
        </div>
      </div>
      <!--详情页预订-->
      <div class="order-footer">
        <div class="order-total float-layer">
          <div class="order-total-left">
            <div class="gotoHome item"
                 @click="go('/')">
              <i class="xx-icon icon-shouye"></i>
              <span class="foot-menu-text">首页</span>
            </div>
            <div @click="go('goods/card')"
                 class="gouwuche item">
              <i class="xx-icon icon-gouwuche11"></i>
              <span class="foot-menu-text">购物车</span>
            </div>
          </div>
          <div class="order-right">
            <div class="add-buyer btn-handle"
                 @click="skuModelShow(true)">加入购物车</div>
            <div class="detail-order btn-handle"
                 @click="skuModelShow(false)">立即下单</div>
          </div>
        </div>
      </div>

      <!-- 预订弹框 -->
      <popup v-model="skuShow">
        <!--预订弹框-->
        <div class="toast-box">
          <div class="modal pre-order">
            <div class="modal-head clearfix">
              <div class="fl goods-info">
                <img class="goods-img"
                     :src="imgArr[imgIndex]"
                     alt>
                <div class="price-spec">
                  <div class="price-info">
                    <span class="unit">￥</span>
                    <span class="price">{{showPrice?showPrice:''}}</span>
                  </div>
                  <div class="spec">
                    <span class="text">请选择</span>
                    <span v-for="(item,index) in specArr"
                          :key="index"
                          class="text">{{item.specKey}}</span>
                  </div>
                </div>
              </div>
              <i @click="skuShow=false"
                 class="fr close xx-icon icon-guanbi2"></i>
            </div>
            <div class="modal-content">
              <div class="order-px">
                <div class="spec-ul">
                  <div v-for="(item,index) in specArr"
                       :key="index"
                       class="spec-li">
                    <div class="spec-name">{{item.specKey}}</div>
                    <div class="spec-list">
                      <template v-for="(it,i) in item.list">
                        <div v-if="it.disabled"
                             :key="i"
                             @click="selected(index,i)"
                             class="spec-item"
                             :class="{selected:selectObj['' + index]==i}">{{it.val}}</div>
                        <div v-else
                             :key="i"
                             class="spec-item under">{{it.val}}</div>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="next-step">
              <div class="add-count">
                <div class="text">数量</div>
                <div class="add-del">
                  <span class="num">{{num}}</span>
                  <div class="handle clearfix">
                    <span @click="sub"
                          v-if="num>1"
                          class="sub btn fl">-</span>
                    <span v-else
                          class="sub btn disabble-color fl">-</span>
                    <span @click="add"
                          class="add btn fl">+</span>
                  </div>
                </div>
              </div>
              <template v-if="skuData.stockNum>0">
                <template>
                  <div v-if="cart"
                       @click="addCart"
                       class="sure next-step-btn">加入购物车</div>
                  <div v-else
                       @click="sureClick"
                       class="sure next-step-btn">确定</div>
                </template>
              </template>
              <template v-else>
                <div class="sure next-step-btn no-stock">已售罄</div>
              </template>
            </div>
          </div>
        </div>
      </popup>
    </div>
    <float-nav></float-nav>
  </div>
</template>

<script>
// import {
//   getData,
//   postData,
//   merchantInfoId,
//   isauthorization,
//   setUserInfo
// } from "@/common/common";
// import api from "@/api/api";
// import wxParse from "@/components/htmlParse";
// import navbar from "@/components/navbar";
// import swiper from "@/components/swiper";
import floatNav from "@/components/floatNav";
import {
  Swiper,
  SwiperItem,
  Popup,
  DatetimeView,
  Group,
  Calendar,
  XDialog
} from "vux";
export default {
  components: {
    // wxParse,
    // navbar
    floatNav,
    Swiper,
    SwiperItem,
    Popup
  },
  data () {
    return {
      skuShow: false, //sku-modal
      modelCode: null,
      authorization: false,
      showPrice: "", //sku展示价
      skuData: {}, //当前选中的sku data
      cart: false, //是否是加入购物车
      str: "",
      autoplay: true,
      interval: 2500,
      duration: 500,
      activeIndex: 0,
      indicatorDots: false,
      imgUrls: [],
      show: false,
      pageData: {},
      min: null,
      max: null,
      commentList: [],
      specArr: [],
      selectObj: {
        0: 0,
        1: 0,
        2: 0
      },
      imgArr: [],
      imgIndex: null,
      num: 1,
      stockNum: 0, //库存
      specStrArr: [], //规格
      sellPrice: null //售价
    };
  },
  onUnload () {
    // console.log("onUnload");
    this.modelCode = null;
    this.commentList = [];
    this.pageData = {};
    this.imgArr = [];
  },
  onShow () {
    if (!this.isEmptyObject(this.pageData)) {
      //如果不是空对象的话,重新请求借口
      getData(api.shop.detail.main, {
        //详情
        merchantMsdeInfoId: this.$root.$mp.query.id
      }).then(res => {
        this.pageData = res.data;
      });
    }

    this.closeModal();
  },
  methods: {
    skuModelShow (flag) {
      this.checkToken().then(res => {
        this.cart = flag;
        this.skuShow = true;
        this.getSku();
      });
    },
    isEmptyObject (obj) {
      //判断是不是空对象
      for (var key in obj) {
        return false;
      }
      return true;
    },
    addCart () {
      //加入购物车
      // console.log(1)
      // console.log(this.skuData)
      var obj = Object.assign(this.skuData, {
        merchantInfoName: "test",
        num: this.num,
        merchantMdseInfoId: this.skuData.merchantMsdeInfoId,
        mdseDetailId: this.skuData.msdeDetailId,
        productAmount: "1",
        prodFrom: this.pageData.prodFrom,
        productCode: this.pageData.productCode,
        productName: this.pageData.name,
        userID: localStorage.getItem("xjsc_login_userId_2019_3_8"),
        wapUrl: this.skuData.linkImg,
        wayType: "1"
      });
      // console.log(obj)
      this.getAxios(this.api.main.cart.add, obj).then(res => {
        //  console.log("添加成功");
        // wx.navigateTo({
        //   url: this.router + "pages/shoppingCart/main"
        // });
        this.go("/shopping/cart")
      });
    },
    sureClick () {
      // console.log(this.modelCode);
      let arr = [
        {
          img: this.imgArr[this.imgIndex],
          specStrArr: this.specStrArr,
          name: this.pageData.nickName,
          sellPrice: this.sellPrice,
          num: this.num,
          modelCode: this.modelCode, //商品规格
          productCode: this.pageData.productCode,
          modeId: this.$route.query.id
        }
      ];
      localStorage.setItem("xjsc_vue_mode_info_2019_3_22", JSON.stringify(arr));
      this.go("/order/mdse");
    },
    add () {
      if (this.num < this.stockNum) {
        this.num++;
      }
    },
    sub () {
      this.num--;
    },
    selected (index, i) {
      this.selectObj["" + index] = i;
      if (index == 0) {
        //显性规格改变的时候图片变化
        this.imgIndex = i;
      }
      //选项改变后获取匹配的sku值
      this.getStockNum();
    },
    getStockNum () {
      //获取对应sku商品的对应项目
      // console.log(' this.specArr', this.specArr)
      var strArr = [];
      var specArr = [];
      this.specArr.forEach((item, index) => {
        let key = item.specKey;
        let val = item.specList[this.selectObj[index + ""]];
        specArr.unshift(val);
        strArr.push('{"' + key + '":"' + val + '"}');
      });
      var str = strArr.join(",");
      // console.log(str);
      let item = this.skuList.find(item => {
        return str == item.specParam;
      });
      this.showPrice = item.sellPrice;
      //   console.log(item);
      if (item) {
        //如果存在
        this.modelCode = item.modelCode; //产品编码
        this.stockNum = item.stockNum;
        this.specStrArr = specArr; //缓存规格
        this.sellPrice = item.sellPrice; //缓存价格
        // console.log(this.specStrArr);
        this.skuData = item;
        if (item.stockNum > 0) {
          this.num = 1;
        } else {
          this.num = 0;
        }
        // console.log(this.skuData)
      } else {
        this.stockNum = 0;
        this.num = 0;
      }
    },
    teszzzzt () {
      // console.log("11");
    },
    currentChange (test) {
      //轮播图下标改变
      this.activeIndex = test.mp.detail.current;
    },
    //地图
    openMap () {
      let that = this;
      wx.getLocation({
        type: "gcj02",
        success: function (res) {
          // console.log(res);
          var latitude = res.latitude;
          var longitude = res.longitude;
          wx.openLocation({
            latitude: latitude,
            longitude: longitude,
            name: that.addr,
            scale: 28
          });
        }
      });
    },
    openModal (flag) {
      // let p2 = getData(api.shop.detail.sku, {
      //   //sku
      //   merchantMsdeInfoId: this.$root.$mp.query.id
      // });

      this.cart = flag;
      this.show = true;
      this.handleToggle(0);
      this.getSku();
    },
    closeModal () {
      this.show = false;
      this.handleToggle(-415);
    },
    handleToggle (num) {
      this.animation.bottom(num * 2 + "rpx").step();
      this.animationData = this.animation.export();
    },
    scrolltolower () {
      // console.log(7);
    },
    scroll (e) {
      // console.log(6);
      // console.log(e);
    },
    goUrl (path) {
      this.closeModal();
      this.navigatePageTo(this.router + path);
    },
    goTab (path) {
      this.closeModal();
      // this.navigatePageTo(this.router + path);
      wx.switchTab({
        url: this.router + path
      });
    },
    currentChange (test) {
      //轮播图下标改变
      this.activeIndex = test.mp.detail.current;
    },
    getSku () {
      let arr = [];
      let p1 = this.getAxios(this.api.shop.detail.sku, {
        //sku
        merchantMsdeInfoId: this.$route.query.id
      });
      Promise.all([p1])
        .then(result => {
          let _this = this;
          this.skuList = result[0].data;
          console.log(result);
          // wx.hideLoading();
          //sku
          result[0].data.forEach(item => {
            arr.push(item.sellPrice);
          });
          arr.sort(); //从小到大排序
          if (arr.length == 0) {
            //不存在
            this.min = null;
            this.max = null;
          } else if (arr.length == 1) {
            this.min = arr[0];
            this.max = arr[0];
          } else if (arr.length > 1) {
            this.min = arr[0];
            this.max = arr[arr.length - 1];
          }

          //sku提取数组规格名称
          let specArr = [];
          if (result[0].data && result[0].data.length) {
            result[0].data[0].specParam.split(",").forEach(item => {
              let obj = {};
              obj.specKey = Object.keys(JSON.parse(item))[0];
              obj.specList = [];
              specArr.push(obj);
            });
          }

          //按照规格名称提取对应的规格值
          result[0].data.forEach(item => {
            item.specParam.split(",").forEach(it => {
              let specObj = JSON.parse(it);
              let key = Object.keys(specObj)[0];
              let val = specObj[key];
              specArr.forEach(specItem => {
                if (specItem.specKey == key) {
                  //规格名称相同
                  if (specItem.specList.indexOf(val) == -1) {
                    //没有找到
                    specItem.specList.push(val);
                  }
                }
              });
            });
          });
          // console.log(specArr);
          //生成数组  [{specKey:'规格1',specList:['key1','key2',key:'key3']}]
          // => 目标生成  [{specKey:'规格1',specList:[{val:'key1',disabled:false},{val:'key2',disabled:false},{val:'key3',disabled:false}]}]

          specArr.forEach((item, index) => {
            specArr[index].list = [];
            specArr[index].specList.forEach((it, sort) => {
              let obj = {
                val: it,
                disabled: false
              };
              specArr[index].list.push(obj);
            });
          });
          // console.log("zzz", specArr, specArr.length);

          let flag = true; //开关保证 选中第一组可用sku
          // 判断当前规格值属性对应的别的属性库存是否为空
          // 三种情况  specArr的长度分别为1，2, 3的时候
          // 1
          if (specArr.length == 1) {
            let key = specArr[0].specKey;
            specArr[0].specList.forEach((item, index) => {
              let specName = '{"' + key + '":"' + item + '"}';
              result[0].data.forEach(it => {
                if (specName == it.specParam) {
                  if (it.stockNum > 0) {
                    specArr[0].list[index].disabled = true;
                    if (flag) {
                      _this.selectObj["0"] = index;
                      _this.imgIndex = index;
                      flag = false;
                    }
                  }
                }
              });
            });
            //   console.log("1", specArr);
          }
          // 2  [{specKey:'规格1',specList:['key1','key2',key:'key3'],list:[{val:'key1',disabled:false},{val:'key2',disabled:false},{val:'key3',disabled:false}]}]
          if (specArr.length == 2) {
            let firstKey = specArr[0].specKey;
            let secondKey = specArr[1].specKey;
            specArr[0].specList.forEach((item, index) => {
              specArr[1].specList.forEach((it, i) => {
                let specName =
                  '{"' +
                  firstKey +
                  '":"' +
                  item +
                  '"},{"' +
                  secondKey +
                  '":"' +
                  it +
                  '"}';
                result[0].data.forEach(resItem => {
                  if (specName == resItem.specParam) {
                    if (resItem.stockNum > 0) {
                      specArr[0].list[index].disabled = true;
                      specArr[1].list[i].disabled = true;
                      if (flag) {
                        _this.selectObj["0"] = i;
                        _this.selectObj["1"] = index;
                        _this.imgIndex = index;
                        flag = false;
                      }
                      // return false;
                    }
                  }
                });
              });
            });
            //   console.log("2", specArr);
          }
          //3
          if (specArr.length == 3) {
            let firstKey = specArr[0].specKey;
            let secondKey = specArr[1].specKey;
            let thridKey = specArr[2].specKey;
            specArr[0].specList.forEach((item, index) => {
              specArr[1].specList.forEach((it, i) => {
                specArr[2].specList.forEach((thiridItem, thiridIndex) => {
                  let specName =
                    '{"' +
                    firstKey +
                    '":"' +
                    item +
                    '"},{"' +
                    secondKey +
                    '":"' +
                    it +
                    '"},{"' +
                    thridKey +
                    '":"' +
                    thiridItem +
                    '"}';
                  result[0].data.forEach(resItem => {
                    if (specName == resItem.specParam) {
                      if (resItem.stockNum > 0) {
                        specArr[0].list[index].disabled = true;
                        specArr[1].list[i].disabled = true;
                        specArr[2].list[thiridIndex].disabled = true;
                        if (flag) {
                          _this.selectObj["0"] = thiridIndex;
                          _this.selectObj["1"] = i;
                          _this.selectObj["2"] = index;
                          _this.imgIndex = thiridIndex;
                          flag = false;
                        }
                        // return false;
                      }
                    }
                  });
                });
              });
            });
            // console.log("3", specArr);
          }
          // specArr.reverse(); //数组倒置
          // console.log()
          this.specArr = specArr;
          this.getStockNum(); //获取当前sku商品对应的库存
          let imgArr = [];
          // console.log("specArr", specArr);
          let length = specArr[0].list.length;
          if (specArr.length == 1) {
            //一组属性
            for (let i = 0; i < length; i++) {
              imgArr.push(result[0].data[i].linkImg);
            }
          } else if (specArr.length == 2) {
            //2组属性
            let arrlength = specArr[1].list.length;
            for (let i = 0; i < length; i++) {
              imgArr.push(result[0].data[i * arrlength].linkImg);
            }
          } else if (specArr.length == 3) {
            //3组属性
            let arrlength = specArr[1].list.length * specArr[2].list.length;
            for (let i = 0; i < length; i++) {
              imgArr.push(result[0].data[i * arrlength].linkImg);
            }
          }
          // for (let i = 0; i < length; i++) {
          //   // console.log(result[1].data[i].linkImg)
          //   imgArr.push(result[1].data[i * length].linkImg);
          // }
          this.imgArr = imgArr;
          this.num = 1;
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  created () {
    // 初始化数据

    //判断用户是否授权
    // isauthorization("userInfo").then(res => {
    //   this.authorization = res;
    // });

    this.num = 1;
    // let recommendFlag = this.$root.$mp.query.recommendFlag,
    //   leagureId = wx.getStorageSync("WxXjscUserInfo").leaguerId,
    //   payOrderNo = this.$root.$mp.query.payOrderNo;

    // if (recommendFlag && leagureId && payOrderNo) {
    //   var p1 = getData(api.shop.detail.main, {
    //     merchantMsdeInfoId: this.$root.$mp.query.id,
    //     recommendFlag: recommendFlag,
    //     payOrderNo: payOrderNo,
    //     leaguerId: leagureId
    //   });
    // } else {
    //   var p1 = getData(api.shop.detail.main, {
    //     //详情
    //     merchantMsdeInfoId: this.$root.$mp.query.id
    //   });
    // }
    let p1 = this.getAxios(this.api.shop.detail.main, {
      //详情
      merchantMsdeInfoId: this.$route.query.id
    });
    let arr = [];
    let p2 = this.getAxios(this.api.shop.detail.sku, {
      //sku
      merchantMsdeInfoId: this.$route.query.id
    });
    //获取评论
    let p3 = this.getAxios(this.api.main.comment.list, {
      id: this.$route.query.id,
      productType: "mdse"
    });
    Promise.all([p1, p2, p3])
      .then(result => {
        let _this = this;
        this.skuList = result[1].data;
        // console.log(result);
        // wx.hideLoading();
        //详情
        this.pageData = result[0].data;
        this.str = result[0].data.summary;
        // console.log(this.str);
        if (
          result[0].data.merchantPictureLibVo &&
          result[0].data.merchantPictureLibVo.wapUrl
        ) {
          this.imgUrls = result[0].data.merchantPictureLibVo.wapUrl.split(",");
        }
        //sku
        result[1].data.forEach(item => {
          arr.push(item.sellPrice);
        });
        arr.sort(); //从小到大排序
        if (arr.length == 0) {
          //不存在
          this.min = null;
          this.max = null;
        } else if (arr.length == 1) {
          this.min = arr[0];
          this.max = arr[0];
        } else if (arr.length > 1) {
          this.min = arr[0];
          this.max = arr[arr.length - 1];
        }

        //sku提取数组规格名称
        let specArr = [];
        if (result[1].data && result[1].data.length) {
          result[1].data[0].specParam.split(",").forEach(item => {
            let obj = {};
            obj.specKey = Object.keys(JSON.parse(item))[0];
            obj.specList = [];
            specArr.push(obj);
          });
        }

        //按照规格名称提取对应的规格值
        result[1].data.forEach(item => {
          item.specParam.split(",").forEach(it => {
            let specObj = JSON.parse(it);
            let key = Object.keys(specObj)[0];
            let val = specObj[key];
            specArr.forEach(specItem => {
              if (specItem.specKey == key) {
                //规格名称相同
                if (specItem.specList.indexOf(val) == -1) {
                  //没有找到
                  specItem.specList.push(val);
                }
              }
            });
          });
        });
        // console.log(specArr);
        //生成数组  [{specKey:'规格1',specList:['key1','key2',key:'key3']}]
        // => 目标生成  [{specKey:'规格1',specList:[{val:'key1',disabled:false},{val:'key2',disabled:false},{val:'key3',disabled:false}]}]

        specArr.forEach((item, index) => {
          specArr[index].list = [];
          specArr[index].specList.forEach((it, sort) => {
            let obj = {
              val: it,
              disabled: false
            };
            specArr[index].list.push(obj);
          });
        });
        // console.log("zzz", specArr, specArr.length);

        let flag = true; //开关保证 选中第一组可用sku
        // 判断当前规格值属性对应的别的属性库存是否为空
        // 三种情况  specArr的长度分别为1，2, 3的时候
        // 1
        if (specArr.length == 1) {
          let key = specArr[0].specKey;
          specArr[0].specList.forEach((item, index) => {
            let specName = '{"' + key + '":"' + item + '"}';
            result[1].data.forEach(it => {
              if (specName == it.specParam) {
                if (it.stockNum > 0) {
                  specArr[0].list[index].disabled = true;
                  if (flag) {
                    _this.selectObj["0"] = index;
                    _this.imgIndex = index;
                    flag = false;
                  }
                }
              }
            });
          });
          //   console.log("1", specArr);
        }
        // 2  [{specKey:'规格1',specList:['key1','key2',key:'key3'],list:[{val:'key1',disabled:false},{val:'key2',disabled:false},{val:'key3',disabled:false}]}]
        if (specArr.length == 2) {
          let firstKey = specArr[0].specKey;
          let secondKey = specArr[1].specKey;
          specArr[0].specList.forEach((item, index) => {
            specArr[1].specList.forEach((it, i) => {
              let specName =
                '{"' +
                firstKey +
                '":"' +
                item +
                '"},{"' +
                secondKey +
                '":"' +
                it +
                '"}';
              result[1].data.forEach(resItem => {
                if (specName == resItem.specParam) {
                  if (resItem.stockNum > 0) {
                    specArr[0].list[index].disabled = true;
                    specArr[1].list[i].disabled = true;
                    if (flag) {
                      _this.selectObj["0"] = i;
                      _this.selectObj["1"] = index;
                      _this.imgIndex = index;
                      flag = false;
                    }
                    // return false;
                  }
                }
              });
            });
          });
          //   console.log("2", specArr);
        }
        //3
        if (specArr.length == 3) {
          let firstKey = specArr[0].specKey;
          let secondKey = specArr[1].specKey;
          let thridKey = specArr[2].specKey;
          specArr[0].specList.forEach((item, index) => {
            specArr[1].specList.forEach((it, i) => {
              specArr[2].specList.forEach((thiridItem, thiridIndex) => {
                let specName =
                  '{"' +
                  firstKey +
                  '":"' +
                  item +
                  '"},{"' +
                  secondKey +
                  '":"' +
                  it +
                  '"},{"' +
                  thridKey +
                  '":"' +
                  thiridItem +
                  '"}';
                result[1].data.forEach(resItem => {
                  if (specName == resItem.specParam) {
                    if (resItem.stockNum > 0) {
                      specArr[0].list[index].disabled = true;
                      specArr[1].list[i].disabled = true;
                      specArr[2].list[thiridIndex].disabled = true;
                      if (flag) {
                        _this.selectObj["0"] = thiridIndex;
                        _this.selectObj["1"] = i;
                        _this.selectObj["2"] = index;
                        _this.imgIndex = thiridIndex;
                        flag = false;
                      }
                      // return false;
                    }
                  }
                });
              });
            });
          });
          // console.log("3", specArr);
        }
        // specArr.reverse(); //数组倒置
        console.log(specArr);
        this.specArr = specArr;
        this.getStockNum(); //获取当前sku商品对应的库存
        let imgArr = [];
        // console.log("specArr", specArr);
        let length = specArr[0].list.length;
        if (specArr.length == 1) {
          //一组属性
          for (let i = 0; i < length; i++) {
            imgArr.push(result[1].data[i].linkImg);
          }
        } else if (specArr.length == 2) {
          //2组属性
          let arrlength = specArr[1].list.length;
          for (let i = 0; i < length; i++) {
            imgArr.push(result[1].data[i * arrlength].linkImg);
          }
        } else if (specArr.length == 3) {
          //3组属性
          let arrlength = specArr[1].list.length * specArr[2].list.length;
          for (let i = 0; i < length; i++) {
            imgArr.push(result[1].data[i * arrlength].linkImg);
          }
        }
        // for (let i = 0; i < length; i++) {
        //   // console.log(result[1].data[i].linkImg)
        //   imgArr.push(result[1].data[i * length].linkImg);
        // }
        this.imgArr = imgArr;
        // console.log(this.imgArr)
        //评论
        result[2].data.forEach(item => {
          var reg = /^(.{1}).*(.{1})$/;
          if (item.isAnonymous == "T") {
            item.userName = item.userName
              ? item.userName.replace(reg, "$1***$2")
              : "";
          }
        });
        this.commentList = result[2].data;
        // console.log(this.commentList);
      })
      .catch(error => {
        console.log(error);
      });
    // this.animation = wx.createAnimation({
    //   duration: 500,
    //   timingFunction: "ease"
    // });
  },
  onHide () {
    console.log("hide");
    this.closeModal();
  }
};
</script>

<style lang="scss">
.goods-detail {
  width: 100%;
  background-color: #f7f7f7;
  &.overflow {
    overflow: hidden;
    height: 100%;
  }
  .swiper-container {
    position: relative;
    .swiper {
      width: 100%;
      height: 221.5px;
      image {
        width: 100%;
        height: 221.5px;
      }
    }
    .dots-list {
      position: absolute;
      width: 100%;
      bottom: 9px;
      left: 0px;
      display: flex;
      justify-content: center;
      .dots-item {
        height: 5px;
        width: 5px;
        margin: 0 5px;
        border-radius: 50%;
        background: #fff;
        opacity: 0.5;
      }
      .dots-item.active {
        background: #fff;
        opacity: 1;
      }
    }
  }
  .detail-info {
    background-color: #fff;
    padding: 15px 20px 27.5px;
    padding-left: 15px;
    padding-bottom: 16px;
    .detail-info-main {
      // width: 100%;
      // height: 146px;
      .detail-info-title {
        margin-bottom: 10px;
        font-size: 18px;
        color: #413838;
        font-family: PingFangSC-Regular, sans-serif;
      }
      .detail-price-info {
        width: 100%;
        margin-bottom: 5px;
        display: flex;
        justify-content: space-between;
        .show-price {
          display: flex;
          justify-content: space-between;
          .last-price {
            font-size: 18px;
            color: #fc4150;
            font-family: PingFangSC-Regular, sans-serif;
            .unit {
              font-size: 12px;
            }
            .price {
              font-size: 18px;
            }
          }
          .old-price {
            margin-left: 10px;
            height: 25px;
            line-height: 29px;
            text-decoration: line-through;
            vertical-align: bottom;
            font-size: 12px;
            color: #999999;
            font-family: PingFangSC-Regular, sans-serif;
          }
        }
        .sell-num {
          font-size: 12px;
          color: #5c5c5c;
          font-family: PingFangSC-Regular, sans-serif;
          .text {
            height: 25px;
            line-height: 29px;
          }
          .num {
            margin-left: 8px;
            height: 25px;
            line-height: 29px;
          }
        }
      }
      .spec {
        height: 16px;
        line-height: 16px;
        padding: 0 6px;
        display: inline-block;
        border: 1px solid #5c5c5c;
        border-radius: 4px;
        font-size: 13px;
        color: #5c5c5c;
        font-family: PingFangSC-Regular, sans-serif;
      }
      .detail-info-ftitle {
        font-size: 12px;
        color: #413838;
        margin-left: 28px;
        margin-top: 7.5px;
        margin-right: 7.5px;
        line-height: 20px;
      }
    }
    .detail-info-location {
      width: 60px;
      height: 123.5px;
      background-color: #fafafa;
      display: block;
      .detail-gotoLocetion {
        width: 21.5px;
        height: 20px;
        margin-top: 50px;
        margin-left: 19.5px;
        .location-icon {
          width: 21.5px;
          height: 20px;
        }
      }
    }
  }
  .detail-info-content {
    width: 100%;
    background-color: #fff;
    margin-top: 10px;
    .info-content-item {
      margin-left: 15px;
      padding-top: 18px;
      .content-item-title {
        font-size: 18px;
        color: #413838;
        font-weight: bold;
        display: inline-block;
        vertical-align: middle;
      }
    }
    .info-content-main {
      padding: 24px 15px;
      font-size: 12px;
      color: #413838;
      line-height: 20px;
      .img-box {
        padding: 0;
      }
      image {
        margin-top: 10px;
      }
      .detail-comment-ul {
        width: 100%;
        .detail-comment-li {
          margin-bottom: 17.5px;
          .comment-img {
            width: 20px !important;
            height: 20px;
            border-radius: 50%;
            float: left;
            margin-top: 0;
          }
          .member-svg {
            font-size: 20px;
          }
          .comment-name {
            font-size: 14px;
            color: #413838;
            float: left;
            height: 20px;
            line-height: 20px;
            margin-left: 13px;
          }
          .comment-date {
            font-size: 12px;
            color: #413838;
            float: right;
          }
          .comment-content {
            color: #413838;
            font-size: 14px;
            margin-top: 8.5px;
          }
        }
      }
      .noData {
        width: 100%;
        .nodata-svg {
          font-size: 34.5px;
          color: #cbcbcb;
        }
        .nodata-img {
          width: 34.5px !important;
          height: 34.5px;
          display: block;
          margin: 0 auto;
        }
        .nodata-text {
          font-size: 16px;
          color: #999999;
          text-align: center;
          width: 100%;
          display: block;
          margin: 7px auto 0;
        }
      }
    }
  }

  .order-footer {
    // padding-top: 49px;
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 0;
    z-index: 29;
    .order-total {
      height: 49px;
      background: #f05b47;
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      .order-right {
        flex: 1;
        display: flex;
      }
      .order-total-left {
        background: #fff;
        height: 100%;
        width: 157px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .item {
          display: flex;
          flex-direction: column;
          text-align: center;
          width: 33%;
          .xx-icon {
            font-size: 20px;
            color: #5c5c5c;
          }
          .foot-menu-text {
            margin-top: 4px;
            font-size: 14px;
            color: #5c5c5c;
            font-family: PingFangSC-Regular, sans-serif;
          }
        }
        .gotoHome {
          .xx-icon {
            // color: #f05b47;
            font-size: 23px;
            height: 23px;
          }
        }
        .gouwuche {
          margin-left: 30px;
          .xx-icon {
            font-size: 23px;
            height: 23px;
          }
        }
      }
      .btn-handle {
        height: 49px;
        line-height: 49px;
        display: inline-block;
        font-size: 16px;
        color: #fff;
        width: 50%;
        font-family: PingFangSC-Regular, sans-serif;
        text-align: center;
      }
      .add-buyer {
        background: #ffa628;
      }
      .detail-order {
        // width: calc(100% - 266px);
        background: #f05b47;
      }
    }
  }

  .toast-box {
    .modal {
      position: relative;
      // height: 413px;
      padding-top: 14px;
      border-top-left-radius: 2px;
      border-top-right-radius: 2px;
      background: #fff;
      z-index: 710;
      &.pre-order {
        padding-bottom: 98px;
      }
      .modal-head {
        // margin-top: 14px;
        padding: 0 15px 0 15px;
        .goods-info {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          .goods-img {
            height: 50px;
            width: 50px;
          }
          .price-spec {
            width: 243px;
            margin-left: 17px;
            overflow: hidden;
            .price-info {
              margin-bottom: 5px;
              color: #fc4150;
              font-family: PingFangSC-Regular, sans-serif;
              .price {
                font-size: 18px;
              }
              .unit {
                font-size: 12px;
              }
            }
            .spec {
              font-size: 12px;
              color: #999999;
              font-family: PingFangSC-Regular, sans-serif;
              .text {
                padding-right: 10px;
              }
            }
          }
        }
        .close {
          font-size: 23px;
          color: #b2b2b2;
        }
      }
      .modal-content {
        max-height: 300px;
        overflow-y: scroll;
        .order-px {
          padding: 0 20px 0 15px;
          .spec-ul {
            width: 100%;
            font-size: 12px;
            color: #413838;
            font-family: PingFangSC-Regular, sans-serif;
            .spec-li {
              .spec-name {
                height: 62px;
                line-height: 62px;
              }
              .spec-list {
                display: flex;
                flex-wrap: wrap;
                .spec-item {
                  border-radius: 4.5px;
                  background: #f6f6f6;
                  margin-right: 26px;
                  margin-bottom: 5px;
                  padding: 0 10px;
                  height: 25.5px;
                  line-height: 25.5px;
                }
                .spec-item.under {
                  color: #999999;
                }
                .spec-item.selected {
                  color: #fff;
                  background: #f05b47;
                }
              }
            }
          }
        }
      }
      .next-step {
        position: absolute;
        width: 100%;
        left: 0;
        bottom: 0;
        .add-count {
          display: flex;
          justify-content: space-between;
          height: 49px;
          align-items: center;
          padding: 0 15px;
          font-size: 18px;
          color: #413838;
          font-family: PingFangSC-Regular, sans-serif;
          .text {
          }
          .add-del {
            width: 225px;
            display: flex;
            justify-content: flex-end;
            .num {
              height: 29px;
              line-height: 29px;
              margin-right: 15px;
            }
            .handle {
              .btn {
                height: 29px;
                line-height: 29px;
                display: inline-block;
                //  border-color: #ff6363;
                text-align: center;
                color: #f05b47;
              }
              .sub {
                border: 1px solid #f05b47;
                border-right: none;
                border-top-left-radius: 3.5px;
                border-bottom-left-radius: 3.5px;
                width: 44px;
              }
              .add {
                border: 1px solid #f05b47;
                border-top-right-radius: 3.5px;
                border-bottom-right-radius: 3.5px;
                width: 43px;
              }
              .disabble-color {
                border-color: #ffc9c9;
                border-right: none;
                color: #ffc9c9;
              }
            }
          }
        }
        .next-step-btn {
          color: #fff;
          font-size: 18px;
          font-family: PingFangSC-Regular, sans-serif;
          height: 49px;
          line-height: 49px;
          text-align: center;
        }
        .next-step-btn.no-stock {
          color: #fff;
          background: #cbcbcb;
        }
        .sure {
          background: #f05b47;
        }
        .sell-out {
          background: #cbcbcb;
        }
      }
    }
  }
  .vux-slider {
    .vux-indicator {
      bottom: 2px;
      a {
        margin-left: 5.5px;
        i {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.4);
          &.active {
            background-color: #fff !important;
          }
        }
      }
    }
  }
}
</style>
