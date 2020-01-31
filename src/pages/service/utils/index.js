function getTimeValue(item) {
    let time;

        // 时间格式为分钟
        time = item.minutes * 60 * 1000;
    

    return time;
}
function getTime(item) {
    let time = item.hour + ":" + item.minute;;
    // if (item.timeType == "hour") {
    //     // 时间格式为小时
    //     time = item.hour + ":00";
    // }
    // if (item.timeType == "minute") {
    //     // 时间格式为分钟
    //     time = item.hour + ":" + item.minute;
    // }
    // if (item.timeType == "second") {
    //     // 时间格式为秒
    //     time = item.hour + ":" + item.minute + ":" + item.seconds;
    // }
    // console.log(time)
    return time;
}
function formatterTime(checkInTime, timeArr) {
    //checkInTime 入住时间
    //格式化开始结束时间
    let beginDate = checkInTime.replace(/-/g, '/') 
    //入住时间时间戳
    let beginDateValue = new Date(beginDate).valueOf()+24*60*60*1000
    let list = [];
    timeArr.forEach((item, index) => {
        let value = getTimeValue(item);
        let preDateValue = beginDateValue - value;
        let preDate = new Date(preDateValue);
        let year = preDate.getFullYear(); // 获取完整的年份(4位,1970)
        let month = preDate.getMonth() + 1; // 获取月份(0-11,0代表1月,用的时候记得加上1)
        let day = preDate.getDate(); // 获取日(1-31)
        let hour = preDate.getHours(); // 获取小时数(0-23)
        let minute = preDate.getMinutes(); //分
        // let seconds = preDate.getSeconds(); //秒
        list.push({
            year: year,
            month: month < 10 ? "0" + month : month,
            day: day < 10 ? "0" + day : day,
            hour: hour < 10 ? "0" + hour : hour,
            minute: minute < 10 ? "0" + minute : minute,
            // seconds: seconds < 10 ? "0" + seconds : seconds,
            timeType: item.timeType
        });
    });
    // console.log("list",list)
    let arr = [];

    list.forEach((item, index) => {
        item.showTime = getTime(item);
        if (index > 0) {
            arr.push({
                start: list[index - 1],
                end: item,
                proportion: timeArr[index].per
            });
        }
    });
    if (list.length) {
        arr = [
            { end: list[0], proportion: timeArr[0].per }
        ].concat(arr);
    }
    if (list.length > 0) {
        arr.push({
            start: list[list.length - 1]
        });
    }

    return arr
}
export {
    formatterTime
}