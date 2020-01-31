<template>
  <div
    class="buyer-info"
    :class="{'p-t-0':isNeedHidden}"
    v-if="!(isNeedHidden&&formArr.length-fixedNum==0)"
    :style="merchantInfoId === '658'? 'padding-top:0':''"
  >
    <!-- isNeedHidden：{{isNeedHidden}}
    fixedNum；{{fixedNum}}-->
    <div v-if="merchantInfoId !== '658'&&!isNeedHidden" class="info-head">
      <div class="head-title">
        <span class="text">联系人</span>
        <span class="link-tips">（用于接收出票信息）</span>
      </div>
      <div class="select-content" @click="showContactsPop">
        <img src="http://statics.lotsmall.cn/wx/img/icon-contact.png" class="contacter-icon" />
        <span class="text">选择</span>
      </div>
    </div>
    <div
      :class="{'p-t-0':isNeedHidden}"
      class="info-list contact-info"
      :style="merchantInfoId === '658'? 'padding-top:0':''"
    >
      <div
        v-for="(item,index) in formArr"
        :key="index"
        class="info-item"
        v-show="!((item.type=='buyerName' || item.type=='buyerIdNo') && merchantInfoId === '658')&&!((item.type=='buyerMobile' ||item.type=='buyerName' || item.type=='buyerIdNo')&&isNeedHidden)"
        :class="{'text-area':item.type=='lvManyText','date-time-warper':item.type=='lvTime'||item.type=='lvDate','img-warper':item.type=='lvPic'}"
        :style="merchantInfoId === '658'? 'padding-top:0':''"
      >
        <template
          v-if="item.type=='buyerMobile' ||item.type=='buyerName' || item.type=='buyerIdNo'"
        >
          <div class="info-title">{{item.title}}</div>
          <template v-if="item.type=='buyerName'||item.type=='buyerMobile'">
            <input
              v-if="item.type=='buyerName'"
              type="text"
              @blur="iosBlur"
              oninput="if(value.length>10)value=value.slice(0,10)"
              placeholder-class="input-style"
              :placeholder="item.tips"
              v-model="formItem[item.name]"
            />
            <input
              v-if="item.type=='buyerMobile'"
              type="text"
              @focus="buyerMobileFocus"
              @blur="iosBlur"
              placeholder-class="input-style"
              :placeholder="item.tips"
              v-model="formItem[item.name]"
            />
          </template>
          <input
            v-else
            type="text"
            @blur="iosBlur"
            placeholder-class="input-style"
            :placeholder="item.tips"
            v-model="formItem[item.name]"
          />
        </template>
        <template v-else>
          <!-- <div class="info-item"> -->
          <div class="info-title">{{item.title}}</div>
          <template v-if="item.type == 'lvIdCard'">
            <input
              type="text"
              @blur="iosBlur"
              placeholder-class="input-style"
              :placeholder="item.tips"
              v-model="formItem[item.name + index]"
            />
          </template>
          <template v-if="item.type == 'lvOneText'">
            <input
              type="text"
              @blur="iosBlur"
              oninput="if(value.length>50)value=value.slice(0,50)"
              placeholder-class="input-style"
              :placeholder="item.tips"
              v-model="formItem[item.name + index]"
            />
          </template>
          <template v-if="item.type == 'lvManyText'">
            <textarea
              @blur="iosBlur"
              :placeholder="item.tips"
              oninput="if(value.length>200)value=value.slice(0,200)"
              v-model="formItem[item.name + index]"
              name
              id
              cols="30"
              rows="10"
            ></textarea>
          </template>
          <template v-if="item.type == 'lvPic'">
            <div class="img-list clearfix" @click="keyTest(item.type+index)">
              <!-- {{formItem[item.type+index]}} -->
              <div class="img-item fl" v-for="(item,i) in formItem[item.type+index]" :key="i">
                <img
                  @touchstart="start"
                  @touchend="end('lvPic'+index,i)"
                  onselectstart="return false;"
                  :src="item"
                  alt
                />
                <div class="img-notice" v-if="i==0&&noticeShow">
                  <span class="img-text">长按照片可删除</span>
                  <!-- <x-icon type="ios-close-outline" size="18"></x-icon> -->
                  <i @click="noticeShow=false" class="icon-cha2 xx-icon"></i>
                  <span class="jiao"></span>
                </div>
              </div>

              <photo
                v-if="formItem[item.type+index].length<5"
                class="fl"
                ref="phNoRlsb"
                :idStr="'lvPic' + index"
                :noAb="false"
                :isOnlyCamera="false"
                @returnFaceUrl="getUrl"
              >
                <img class="up-img" src="../../../../assets/images/camera-icon.png" alt />
                <!-- <img class="show-img" v-else :src="formItem[item.type+index]" alt> -->
                <span class="text">{{item.tips}}</span>
              </photo>
            </div>
          </template>
          <template v-if="item.type=='lvMumber'">
            <input
              type="number"
              pattern="\d*"
              @blur="iosBlur"
              placeholder-class="input-style"
              :placeholder="item.tips"
              v-model="formItem[item.name + index]"
            />
          </template>
          <!-- 邮箱 -->
          <template v-if="item.type == 'lvEmail'">
            <input
              type="text"
              @blur="iosBlur"
              placeholder-class="input-style"
              :placeholder="item.tips"
              v-model="formItem[item.name + index]"
            />
          </template>
          <!-- 日期 -->
          <template v-if="item.type == 'lvDate'">
            <div class="warper">
              <group title>
                <datetime
                  class="date-time"
                  v-model="formItem[item.name + index]"
                  :start-date="startDate"
                  :end-date="endDate"
                  format="YYYY-MM-DD"
                >
                  <span
                    class="show-time"
                    :class="{'pl-style':!formItem[item.name + index]}"
                  >{{formItem[item.name + index]?formItem[item.name + index]:item.tips}}</span>
                  <i class="xx-icon date-time-icon icon-xiangyoujiantou"></i>
                </datetime>
              </group>
            </div>
          </template>
          <!-- 时间 -->
          <template v-if="item.type == 'lvTime'">
            <div class="warper">
              <group title>
                <datetime
                  class="date-time"
                  v-model="formItem[item.name + index]"
                  :start-date="startDate"
                  :end-date="endDate"
                  format="YYYY-MM-DD HH:mm"
                >
                  <span
                    class="show-time"
                    :class="{'pl-style':!formItem[item.name + index]}"
                  >{{formItem[item.name + index]?formItem[item.name + index]:item.tips}}</span>
                  <i class="xx-icon date-time-icon icon-xiangyoujiantou"></i>
                </datetime>
              </group>
            </div>
          </template>
          <!-- 手机号 -->
          <template v-if="item.type == 'lvMobile'">
            <input
              type="number"
              @blur="iosBlur"
              placeholder-class="input-style"
              :placeholder="item.tips"
              v-model="formItem[item.name + index]"
            />
          </template>
        </template>
      </div>
      <div v-if="isface" class="info-item">
        <div class="info-title">人脸照</div>
        <div>
          <photo ref="phRlsb" @returnFaceUrl="getAbUrl">
            <img
              class="up-img"
              v-if="!formItem.faceUrl"
              src="../../../../assets/images/camera-icon.png"
              alt
            />
            <img class="show-img" v-else :src="formItem.faceUrl" alt />
            <span class="text">人脸图片用于入园对比</span>
          </photo>
        </div>
      </div>
    </div>
    <!-- 常用联系人 -->
    <pop-contacts ref="contactsList" @getContactsInfo="fillContact"></pop-contacts>
  </div>
</template>
<script>
    import photo from "@/components/photo";
    import popContacts from "./popContacts";
    import { Datetime, Group } from "vux";
    import { setTimeout } from "timers";
    export default {
        computed: {},
        props: {
            isNeedHidden: {
                type: Boolean,
                default: false
            },
            isface: {
                type: Boolean,
                default: false
            },
            formArr: {
                type: Array,
                default: []
            },
            toGContractInfo: {
                type: Object,
                default: () => {return {}}
            },
            // 是否为套票
            isFamilyTicket: {
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                fixedNum: 0,
                noticeShow: true,
                currateDate: "2019-06-24 10:11",
                startDate: "2019-06-24",
                endDate: "2099-12-12",
                formKey: "",
                formItem: {
                    faceUrl: ""
                },
                merchantInfoId: ""
            };
        },
        components: {
            photo,
            popContacts,
            Datetime,
            Group
        },
        watch: {
            formArr() {
                this.init();
            },
            toGContractInfo(){
                this.init();
            }
        },
        created() {
            this.merchantInfoId = this.$route.query.m_id;
        },

        mounted() {},
        methods: {
            start(e) {
                e.preventDefault();
            },
            move(event) {
                event.preventDefault();
            },
            end(key, index) {
                setTimeout(() => {
                    this.formItem[this.formKey].splice(index, 1);
                }, 200);
            },
            stop() {
                console.log("stop");
            },
            keyTest(key) {
                this.formKey = key;
            },
            init() {
                //后续直接用接口获取
                let time = this.getTime();
                let date = this.getCurDate();
                this.startDate = date;
                this.formArr.forEach((item, index) => {
                    // this.$set(this.formItem, item.name, "");
                    if (
                        item.type == "buyerName" ||
                        item.type == "buyerIdNo" ||
                        item.type == "buyerMobile"
                    ) {
                        //固定是没有重复
                        this.fixedNum++;
                        // 判断是否是2G跳转过来的
                        if(this.$route.query.touristId){
                            if(item.type == "buyerName"){
                                this.$set(this.formItem, item.name, this.toGContractInfo.name);
                            }else if(item.type == "buyerIdNo"){
                                this.$set(this.formItem, item.name, this.toGContractInfo.idNo);
                            }else if(item.type == "buyerMobile"){
                                this.$set(this.formItem, item.name, this.toGContractInfo.phone);
                            }
                        }else{
                            this.$set(this.formItem, item.name, "");
                        }
                    } else if(item.type == 'lvIdCard'){
                        if(this.$route.query.touristId){
                            this.$set(this.formItem, item.name+index, this.toGContractInfo.idNo);
                        }
                    } else {
                        if (item.type == "lvTime") {
                            this.$set(
                                this.formItem,
                                item.name + index,
                                item.isRequired ? time : ""
                            );
                        } else if (item.type == "lvDate") {
                            this.$set(
                                this.formItem,
                                item.name + index,
                                item.isRequired ? date : ""
                            );
                        } else if (item.type == "lvPic") {
                            this.$set(this.formItem, item.name + index, []);
                        } else {
                            this.$set(this.formItem, item.name + index, "");
                        }
                    }
                });
                this.getAxios("/leaguer/api/userLeaguer/manage/leaguerInfo").then(res => {
                    let tel = res.data.mobile ? res.data.mobile : "";
                    this.saveBuyerMobile = tel;
                    if (tel) {
                        this.buyerMobile =
                            tel.slice(0, 3) + "****" + tel.slice(tel.length - 4);
                        if (this.formItem.hasOwnProperty("buyerMobile")) {
                            //判断是否有电话号码
                            this.formItem.buyerMobile =
                                tel.slice(0, 3) + "****" + tel.slice(tel.length - 4);
                        }
                    }
                    if (typeof isFamilyTicket !=='undefined' && !isFamilyTicket) {
                        this.buyerName = res.data.nickName ? res.data.nickName : "";
                        if (this.formItem.hasOwnProperty("buyerName")) {
                            //判断是否有默认姓名
                            this.formItem.buyerName = res.data.nickName ? res.data.nickName : "";
                        }
                    }
                    // 658店铺门票特殊处理
                    if (this.merchantInfoId == "658") {
                        this.formItem.buyerName = "无姓名";
                    }
                    if(this.$route.query.touristId){
                        this.$set(this.formItem, 'buyerName', this.toGContractInfo.name);
                        this.$set(this.formItem, 'buyerMobile', this.toGContractInfo.phone);
                        this.$set(this.formItem, 'buyerIdNo', this.toGContractInfo.idNo);
                    }
                });
            },
            getTime() {
                var date = new Date();
                var seperator1 = "-";
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var strDate = date.getDate();
                var hour = date.getHours();
                var minute = date.getMinutes();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                if (hour >= 0 && hour <= 9) {
                    hour = "0" + hour;
                }
                if (minute >= 0 && minute <= 9) {
                    minute = "0" + minute;
                }
                var currentTime =
                    year +
                    seperator1 +
                    month +
                    seperator1 +
                    strDate +
                    " " +
                    hour +
                    ":" +
                    minute;
                return currentTime;
            },
            getCurDate() {
                var date = new Date();
                var seperator1 = "-";
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                var currentdate = year + seperator1 + month + seperator1 + strDate;
                return currentdate;
            },
            check() {
                //姓名、手机号码、身份证号不需要改变原先逻辑判断
                let flag = true;
                let formObj = JSON.parse(JSON.stringify(this.formItem));
                if (!this.$route.query.touristId) {
                    if (formObj.hasOwnProperty("buyerMobile")) {
                        formObj.buyerMobile = this.buyerMobileShow
                            ? formObj.buyerMobile
                            : this.saveBuyerMobile;
                    }
                }

                // console.log("formObj", formObj);
                for (let i = 0; i < this.formArr.length; i++) {
                    let item = this.formArr[i];
                    if (!this.isNeedHidden) {
                        if (item.type == "buyerName") {
                            //联系人姓名,有联系人
                            if (!formObj.buyerName) {
                                flag = false;
                                this.$vux.toast.text("联系人姓名不能为空！", "middle");
                                // throw new Error("联系人姓名不能为空！");
                                break;
                            }
                        }
                        //联系人电话判断
                        if (item.type == "buyerMobile") {
                            //联系人电话
                            if (!formObj.buyerMobile) {
                                //手机号不存在
                                flag = false;
                                this.$vux.toast.text("联系人手机号不能为空！", "middle");
                                break;
                                // throw new Error("联系人手机号不能为空！");
                            } else {
                                //手机号存在
                                if (this.checkMobile(formObj.buyerMobile)) {
                                    flag = false;
                                    this.$vux.toast.text("请输入正确的手机号码！", "middle");
                                    break;
                                    // throw new Error("请输入正确的手机号码！");
                                }
                            }
                        }
                        // 身份证号;
                        if (item.type == "buyerIdNo") {
                            //身份证号
                            //身份证小写x转成大写X
                            if (formObj.buyerIdNo) {
                                formObj.buyerIdNo = formObj.buyerIdNo.toUpperCase();
                            }
                            if (this.isface) {
                                if (!formObj.buyerIdNo) {
                                    flag = false;
                                    this.$vux.toast.text("联系人身份证不能为空！", "middle");
                                    break;
                                } else if (this.checkIdCard(formObj.buyerIdNo, "id")) {
                                    flag = false;
                                    this.$vux.toast.text("联系人身份证格式错误！", "middle");
                                    break;
                                }
                            } else {
                                if (
                                    formObj.buyerIdNo &&
                                    this.checkIdCard(formObj.buyerIdNo, "id")
                                ) {
                                    flag = false;
                                    this.$vux.toast.text("联系人身份证格式错误！", "middle");
                                    break;
                                }
                            }
                        }
                    }

                    //留言-身份证
                    if (item.type == "lvIdCard") {
                        //留言-身份证号
                        let key = "lvIdCard" + i;
                        //小写字母x转成大写X
                        if (formObj[key]) {
                            formObj[key] = formObj[key].toUpperCase();
                        }
                        if (item.isRequired) {
                            //必填

                            if (formObj[key]) {
                                if (this.checkIdCard(formObj[key], "id")) {
                                    flag = false;
                                    this.$vux.toast.text(
                                        item.title + "不能为空，请输入正确的身份证号",
                                        "middle"
                                    );
                                    break;
                                }
                            } else {
                                flag = false;
                                this.$vux.toast.text(
                                    item.title + "不能为空，请输入正确的身份证号",
                                    "middle"
                                );
                                break;
                            }
                        } else {
                            //非必填
                            if (formObj[key] && this.checkIdCard(formObj[key], "id")) {
                                flag = false;
                                this.$vux.toast.text(
                                    item.title + "格式错误，请输入正确的身份证号！",
                                    "middle"
                                );
                                break;
                            }
                        }
                    }
                    //留言-单行文本
                    if (item.type == "lvOneText") {
                        //留言-单行文本
                        let key = "lvOneText" + i;
                        if (item.isRequired) {
                            //必填
                            if (!formObj[key]) {
                                flag = false;
                                this.$vux.toast.text("单行文本不能为空！", "middle");
                                break;
                            }
                        }
                    }
                    //留言-多行文本
                    if (item.type == "lvManyText") {
                        //留言-多行文本
                        let key = "lvManyText" + i;
                        if (item.isRequired) {
                            //必填
                            if (!formObj[key]) {
                                flag = false;
                                this.$vux.toast.text("多行文本不能为空！", "middle");
                                break;
                            }
                        }
                    }
                    //留言-图片
                    if (item.type == "lvPic") {
                        let key = "lvPic" + i;
                        if (item.isRequired) {
                            //必填
                            if (!formObj[key].length) {
                                flag = false;
                                this.$vux.toast.text("请上传图片！", "middle");
                                break;
                            }
                        }
                    }
                    //留言-数字格式
                    if (item.type == "lvMumber") {
                        //留言-数字格式
                        let key = "lvMumber" + i;
                        if (item.isRequired) {
                            //必填
                            if (!formObj[key]) {
                                flag = false;
                                this.$vux.toast.text(item.title + "不能为空！", "middle");
                                break;
                            } else {
                                if (this.checkNumber(formObj[key])) {
                                    flag = false;
                                    this.$vux.toast.text("数字格式错误！", "middle");
                                    break;
                                }
                            }
                        }
                    }
                    //留言-邮箱
                    if (item.type == "lvEmail") {
                        let key = "lvEmail" + i;
                        if (item.isRequired) {
                            //必填
                            if (!formObj[key]) {
                                flag = false;
                                this.$vux.toast.text("邮箱不能为空！", "middle");
                                break;
                            } else {
                                if (this.checkEmail(formObj[key])) {
                                    flag = false;
                                    this.$vux.toast.text("邮箱格式错误！", "middle");
                                    break;
                                }
                            }
                        } else {
                            if (formObj[key] && this.checkEmail(formObj[key])) {
                                flag = false;
                                this.$vux.toast.text("邮箱格式错误！", "middle");
                                break;
                            }
                        }
                    }
                    //留言-日期
                    if (item.type == "lvDate") {
                        let key = "lvDate" + i;
                        if (item.isRequired) {
                            //必填
                            if (!formObj[key]) {
                                flag = false;
                                this.$vux.toast.text("请选择日期！", "middle");
                                break;
                            } else {
                                if (this.checkDate(formObj[key])) {
                                    flag = false;
                                    this.$vux.toast.text("日期格式错误！", "middle");
                                    break;
                                }
                            }
                        } else {
                            if (formObj[key] && this.checkDate(formObj[key])) {
                                flag = false;
                                this.$vux.toast.text("日期格式错误！", "middle");
                                break;
                            }
                        }
                    }
                    //留言-时间-组件返回的格式坑定是YYYY-MM-DD HH:mm
                    if (item.type == "lvTime") {
                        let key = "lvTime" + i;
                        if (item.isRequired) {
                            //必填
                            if (!formObj[key]) {
                                flag = false;
                                this.$vux.toast.text("时间不能为空！", "middle");
                                break;
                            }
                        }
                    }
                    //留言-手机号
                    if (item.type == "lvMobile") {
                        let key = "lvMobile" + i;
                        if (item.isRequired) {
                            //必填
                            if (!formObj[key]) {
                                flag = false;
                                this.$vux.toast.text(item.title + "手机号不能为空！", "middle");
                                break;
                            } else {
                                if (this.checkMobile(formObj[key])) {
                                    flag = false;
                                    this.$vux.toast.text(item.title + "手机号格式错误！", "middle");
                                    break;
                                }
                            }
                        } else {
                            if (formObj[key] && this.checkMobile(formObj[key])) {
                                flag = false;
                                this.$vux.toast.text(item.title + "手机号格式错误！", "middle");
                                break;
                            }
                        }
                    }
                }
                // this.formArr.forEach(item => {});
                // alert(flag)
                let arr = [],
                    returnObj = {};
                this.formArr.forEach((item, index) => {
                    if (
                        !(
                            item.type == "buyerName" ||
                            item.type == "buyerIdNo" ||
                            item.type == "buyerMobile"
                        )
                    ) {
                        let obj = {
                            title: item.title,
                            type: item.type,
                            tips:
                                item.type == "lvPic"
                                    ? formObj[item.type + index].join(",")
                                    : formObj[item.type + index]
                        };
                        arr.push(obj);
                    } else {
                        returnObj[item.type] = formObj[item.type];
                    }
                });
                // console.log(arr);
                // console.log(returnObj);
                return {
                    flag: flag,
                    formObj: Object.assign(returnObj, {
                        faceUrl: this.isface ? this.formItem.faceUrl : ""
                    }),
                    tips: arr
                };
            },
            //日期验证
            checkDate(val) {
                return !/^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/.test(
                    val
                );
            },
            //手机号验证
            checkMobile(val) {
                if (!/1[3-9][0-9]{9}$/.test(val) && val.length != 11) {
                    return true;
                }
            },
            //邮箱验证
            checkEmail(val) {
                return !/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(
                    val
                );
            },
            checkNumber(val) {
                return !(/^(([0-9]*))$/.test(val) && val.length < 41);
            },
            //身份证验证
            checkIdCard(vla, type) {
                let reg;
                if (type == "id") {
                    //身份证
                    reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|(X|x))$/;
                } else if ((type = "pass")) {
                    //通行证
                    reg = /^[a-zA-Z0-9]{5,17}$/;
                } else if ((type = "passport")) {
                    //护照
                    reg = /^[a-zA-Z0-9]{5,17}$/;
                }
                if (!reg.test(vla)) {
                    return true;
                }
            },
            fillContact(item) {
                this.formItem.faceUrl = item.faceUrl ? item.faceUrl : "";
                if (this.formItem.hasOwnProperty("buyerName")) {
                    this.formItem.buyerName = item.name ? item.name : "";
                }
                if (this.formItem.hasOwnProperty("buyerMobile")) {
                    this.formItem.buyerMobile = item.phone ? item.phone : "";
                }
                if (this.formItem.hasOwnProperty("buyerIdNo")) {
                    this.formItem.buyerIdNo = item.certNo ? item.certNo : "";
                }

                this.buyerMobileShow = true;
            },
            buyerMobileFocus() {
                //开关控制只有第一次才执行
                if (!this.buyerMobileShow) {
                    this.buyerMobileShow = true;
                    if(this.$route.query.touristId){
                        return
                    }else{
                        this.buyerMobile = this.saveBuyerMobile;
                        if (this.formItem.hasOwnProperty("buyerMobile")) {
                            //是否有联系人电话
                            this.formItem.buyerMobile = this.saveBuyerMobile;
                        }
                    }
                }
            },
            getUrl(url) {
                if (this.formKey) {
                    this.formItem[this.formKey].push(url);
                }
            },
            delImg(key) {
                this.formItem[this.formKey].pop();
            },
            getAbUrl(url) {
                this.formItem.faceUrl = url;
            },
            showContactsPop() {
                //联系人
                //   this.contactType = "linker";
                this.$refs.contactsList.showContacts();
            }
        }
    };
</script>
<style lang="scss">
  .buyer-info {
    &.p-t-0 {
      padding-top: 0;
    }
    .info-list {
      &.p-t-0 {
        padding-top: 0;
      }
      .info-item {
        &.img-warper {
          height: auto;
          padding: 20px 0;
          .img-list {
            .photo-page {
              margin: 5px;
              .h5-p {
                .change-label {
                  .up-img {
                    height: auto !important;
                    width: 35px;
                    margin-top: 3px;
                  }
                }
              }
            }
            .img-item {
              margin: 5px;
              height: 35px;
              width: 35px;
              position: relative;
              &:last-child {
              }
              img {
                border-radius: 4px;
                display: block;
                height: 100%;
                width: 100%;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -khtml-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
              }
              .img-notice {
                position: absolute;
                border-radius: 4px;
                left: 0;
                top: -30px;
                font-size: 12px;
                padding: 2px 8px;
                padding-right: 0;
                background: #cbcbcb;
                display: flex;
                white-space: nowrap;
                align-items: center;
                color: #5c5c5c;
                .img-text {
                  margin-top: 2px;
                }
                .icon-cha2 {
                  font-size: 12px;
                  padding-left: 10px;
                  padding-right: 8px;
                }
                .jiao {
                  display: inline-block;
                  position: absolute;
                  left: 8px;
                  bottom: -14px;
                  width: 0;
                  height: 0;
                  border-left: 10px solid transparent;
                  border-right: 10px solid transparent;
                  border-top: 10px solid #cbcbcb;
                  border-bottom: 10px solid transparent;
                  color: #999;
                }
              }
            }
          }
        }
        &.date-time-warper {
          justify-content: space-between;
        }
        &.text-area {
          align-items: flex-start;
          padding: 5px 0;
          height: 70px;
          .info-title {
            // height: 53px;
            // line-height: 53px;
            margin-top: 10px;
          }
          textarea {
            width: 250px;
            height: 50px;
            border-color: #eeeee7;
            border-radius: 2px;
            outline: none;
            padding: 10px 5px;
            font-size: 14px;
          }
          textarea::-webkit-input-placeholder {
            color: #999;
            font-size: 13px;
          }
          textarea:-moz-placeholder {
            color: #999;
            font-size: 13px;
          }
          textarea:-ms-input-placeholder {
            color: #999;
            font-size: 13px;
          }
        }
        .warper {
          display: flex;
          align-items: center;
          .date-time-icon {
            color: #f05b47;
            font-size: 12px;
            width: 9px;
            padding-left: 7px;
            // padding-right: 13px;
          }
          .weui-cells.vux-no-group-title {
            display: flex;
            align-items: center;
            margin-top: 0;
            .show-time {
              font-size: 14px;
              color: #413838;
              &.pl-style {
                color: #999;
              }
            }
            .date-time {
              .vux-datetime-value {
                padding-right: 0;
                &::after {
                  display: none;

                  border-color: #f05b47;
                }
              }
            }
            &::after {
              border: none;
            }
            &::before {
              border: none;
            }
          }
        }
      }
    }
  }
</style>
