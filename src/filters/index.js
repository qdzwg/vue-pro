//全局过滤器


//px转rem
const px2rem = (val) => {
  val = (parseFloat(val) / 37.5).toFixed(6)
  return val + 'rem'
}

//业态类别
const getBusinessType = (key) => {
  let obj = {
    ticket: '门票',
    room: '酒店',
    mdse: '商品',
    repast: '餐饮',
    route: '跟团游',
    pmsHotelTypeProduct:'pms酒店'
  }
  return obj[key]
}
//姓名关键字加*
const replaceStr = (str) => {
  let phnumAfter = str
  if (str) {
    let length = phnumAfter.length
    let start = ''
    for (let i = 0; i < length - 4; i++) {
      start += "*"
    }
    phnumAfter = str.substr(0, 2) + start + str.substr(length - 2, 2);
  }
  return phnumAfter
}

const dateFtt = (d, fmt) => {
  if(typeof d === 'string') {
    d = d.replace(/-/g,'/');
  }
  let date = new Date(d)
  var o = {
    "M+": date.getMonth() + 1, //月份   
    "d+": date.getDate(), //日   
    "h+": date.getHours(), //小时   
    "m+": date.getMinutes(), //分   
    "s+": date.getSeconds(), //秒   
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
    "S": date.getMilliseconds() //毫秒   
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
export {
  px2rem,
  getBusinessType,
  replaceStr,
  dateFtt
}
