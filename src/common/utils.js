import { randomSort } from "./common"

//自定义页面组件统一初始化调整
function initTagArr(itemData) {
    if (
        !itemData.tagArr ||
        (itemData.tagArr && itemData.tagArr.length != itemData.dataList.length)
    ) {
        //需要初始化环tagArr
        itemData.tagArr = new Array(itemData.dataList.length).fill([]);
    }
    return itemData;
}
function initImgArr(itemData) {
    if (
        !itemData.imgArr ||
        (itemData.imgArr && itemData.imgArr.length != itemData.dataList.length)
    ) {
        //需要初始化环imgArr
        itemData.imgArr = new Array(itemData.dataList.length).fill("");
    }
    return itemData;
}
function initSort(itemData) {
    if (
        itemData.dataList &&
        itemData.tagArr &&
        itemData.imgArr &&
        itemData.dataList.length == itemData.tagArr.length &&
        itemData.tagArr.length == itemData.imgArr.length
    ) {
        let sortObj = randomSort([
            itemData.dataList,
            itemData.tagArr,
            itemData.imgArr
        ]);
        itemData.dataList = sortObj[0];
        itemData.tagArr = sortObj[1];
        itemData.imgArr = sortObj[2];
    }
    return itemData;
}
function formatterInit(it) {
    it = initTagArr(it);
    it = initImgArr(it);
    it = initSort(it);
    return it;
}
function formatterData(comlist) {
    //数据初始化或者格式化
    //预处理攻略和攻略分组中的乱序
    comlist.forEach(item => {
        if (item.category == "strategy") {
            let itemData = item.data;
            if (itemData.sortRule && itemData.sortRule == "randomSort") {
                itemData = formatterInit(itemData);
            }
        }
        if (item.category == "strategyGroup") {
            if (item.data.sortRule && item.data.sortRule == "randomSort") {
                let list = item.data.list;
                list.forEach(it => {
                    it = formatterInit(it);
                });
            }
        }
    });
    return comlist;
}
module.exports = {
    formatterData
}