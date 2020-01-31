import axios from "axios"
import { isWxAli } from "@/common/common";
import { baseUrl } from "../../config/index";

/**
 * 添加微信卡包
 * @param {Array} codeList 卡包信息
 * @param {funtion} callback  回调函数
 */
const wxPackage = ($this, codeList, callback) => {
  let code = []
  , cardId = [];
  console.log(this)
  debugger
  for(let i=0,les=codeList.length;i < les; i++){
    if (codeList[i].checkNo && codeList[i].card_id && codeList.checkNo !== 'null') {
      code.push(codeList[i].checkNo);
      cardId.push(codeList[i].card_id);
    } 
  }

  let curURL = encodeURI(window.location.href);
  axios.get(baseUrl+"merchant/api/merchantInfo/getWxSignature",
   {
    params: {
      merchantInfoId: localStorage.getItem('xjsc_vue_2018_12_19_mid'),
      url:curURL,
      code: code.join(','),
      cardId: cardId.join(',')
    }
   }
   ).then(res => {

   })
}

module.exports = {
  wxPackage 
}