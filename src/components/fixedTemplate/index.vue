<template>
  <div>
    <!-- {{templateCode}} -->
    <template1 :pageData='pageData' @goUrl='navGoUrl' :productData='productData' v-if="templateCode=='MTI20180316172401'"></template1>
    <template2 :pageData='pageData' @goUrl='navGoUrl' :productData='productData' v-if="templateCode=='MTI20180316172801'"></template2>
    <template3 :pageData='pageData' @goUrl='navGoUrl' :productData='productData' v-if="templateCode=='MTI20180316173101'"></template3>
    <template4 :pageData='pageData' @goUrl='navGoUrl' :productData='productData' v-if="templateCode=='MTI18062213232769'"></template4>
  </div>
</template>
<script>
import template1 from "./template/template1";
import template2 from "./template/template2";
import template3 from "./template/template3";
import template4 from "./template/template4";
import { linkBaseUrl } from "../../../config/index"
export default {
  components: {
    template1,
    template2,
    template3,
    template4,
  },
  props: {
    templateCode: {
      type: String,
      default: ""
    }
  },
  data(){
    return {
      pageData:{},
      productData:{}
    }
  },
  created(){
    //图片
    this.getAxios(this.api.main.findPicInfo).then(res=>{
      this.pageData = res.data
      this.$emit("getData",res.data)
    })
    //精品热销
    this.getAxios(this.api.main.merchant.listMerchantPushInfo,{
      templementId: "MTI20180316172401"//没起作用，随意传
    }).then(res=>{
      this.productData = res.data
      console.log(this.productData)
    })
  },
  methods:{
    navGoUrl(linkType){
      console.log(linkType)
      //  let baseUrl = process.env.NODE_ENV === 'production'?'https://wap.lotsmall.cn/':'http://testwap.lotsmall.cn/';
      let m_id = localStorage.getItem('xjsc_vue_2018_12_19_mid')
      let url = ''
      if(linkType=='ticket'){
       url = '/list/ticket?m_id='
      }else if(linkType=='hotel'){
         url = '/list/hotel?m_id='
      }else if(linkType=='shop'){
         url = '/list/shop?m_id='
      }else if(linkType=='strategy'){
         url = '/list/strategy?m_id='
      }
      console.log(linkBaseUrl + url + m_id)
      window.location.href = linkBaseUrl + url + m_id
    }
  }
};
</script>

