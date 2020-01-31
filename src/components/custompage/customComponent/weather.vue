<template>
  <div class="weather-warpper" :style="{background: pageData.type=='basic' ? pageData.backgroundColor : ''}">
    <!--{{pageData}}-->
    <template v-if="pageData.type=='basic'">
      <div class="weather-content">
        <div class="weather-content-left">
          <template v-if="weatherIndex>=0">
            <template v-if="weatherIndex==0">
              <svg style="font-size:1.5467rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#iconqing"></use>
              </svg>
            </template>
            <template v-if="weatherIndex==1">
              <svg style="font-size:1.3333rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#iconduoyun"></use>
              </svg>
            </template>
            <template v-if="weatherIndex==2">
              <svg style="font-size:1.3333rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#iconyin"></use>
              </svg>
            </template>
            <template v-if="weatherIndex==3">
              <svg style="font-size:1.3333rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#iconzhenxue"></use>
              </svg>
            </template>
            <template v-if="weatherIndex==4">
              <svg style="font-size:1.226667rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#iconleizhenyu"></use>
              </svg>
            </template>
            <template v-if="weatherIndex==5">
              <svg style="font-size:1.3333rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#iconleizhenyubanbingbao"></use>
              </svg>
            </template>
            <template v-if="weatherIndex==6">
              <svg style="font-size:1.3333rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#iconyujiaxue"></use>
              </svg>
            </template>
            <template v-if="weatherIndex==7">
              <svg style="font-size:1.3333rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#iconxiaoyu"></use>
              </svg>
            </template>
            <template v-if="weatherIndex==8">
              <svg style="font-size:1.3333rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#iconzhongyu"></use>
              </svg>
            </template>
            <template v-if="weatherIndex==9">
              <svg style="font-size:1.3333rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#icondayu"></use>
              </svg>
            </template>
            <template v-if="weatherIndex==10">
              <svg style="font-size:1.3333rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#iconbaoyu"></use>
              </svg>
            </template>
            <template v-if="weatherIndex==11">
              <svg style="font-size:1.3333rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#icondabaoyu"></use>
              </svg>
            </template>
            <template v-if="weatherIndex==12">
              <svg style="font-size:1.3333rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#icontedabaoyu"></use>
              </svg>
            </template>
            <template v-if="weatherIndex==13">
              <svg style="font-size:1.3333rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#iconzhenxue"></use>
              </svg>
            </template>
            <template v-if="weatherIndex==14">
              <svg style="font-size:1.3333rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#iconxiaoxue"></use>
              </svg>
            </template>
            <template v-if="weatherIndex==15">
              <svg style="font-size:1.3333rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#iconzhongxue"></use>
              </svg>
            </template>
            <template v-if="weatherIndex==15">
              <svg style="font-size:1.3333rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#iconzhongxue"></use>
              </svg>
            </template>
            <template v-if="weatherIndex==16">
              <svg style="font-size:1.3333rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#icondaxue"></use>
              </svg>
            </template>
            <template v-if="weatherIndex==17">
              <svg style="font-size:1.3333rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#iconbaoxue"></use>
              </svg>
            </template>
            <template v-if="weatherIndex==18">
              <svg style="font-size:1.3333rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#iconwu"></use>
              </svg>
            </template>
            <template v-if="weatherIndex==19">
              <svg style="font-size:1.3333rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#icondongyu"></use>
              </svg>
            </template>
            <template v-if="weatherIndex==20">
              <svg style="font-size:1.3333rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#icontingchewei"></use>
              </svg>
            </template>
            <template v-if="weatherIndex==21">
              <svg style="font-size:1.3333rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#iconxiaoyu"></use>
              </svg>
              <svg style="font-size:1.3333rem;margin-top:0.16rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#iconzhongyu"></use>
              </svg>
            </template>
            <template v-if="weatherIndex==22">
              <svg style="font-size:1.3333rem;" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#iconzhongyu"></use>
              </svg>
              <svg style="font-size:1.3333rem;margin-top:0.18667rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#icondayu"></use>
              </svg>
            </template>
            <template v-if="weatherIndex==23">
              <svg style="font-size:1.3333rem;margin-top:0.10667rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#icondayu"></use>
              </svg>
              <svg style="font-size:1.3333rem;margin-top:0.10667rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#iconbaoyu"></use>
              </svg>
            </template>
            <template v-if="weatherIndex==24">
              <svg style="font-size:1.3333rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#iconbaoyu"></use>
              </svg>
              <svg style="font-size:1.3333rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#icondabaoyu"></use>
              </svg>
            </template>
            <template v-if="weatherIndex==25">
              <svg style="font-size:1.3333rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#icondabaoyu"></use>
              </svg>
              <svg style="font-size:1.3333rem;margin-top:0.05333rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#icontedabaoyu"></use>
              </svg>
            </template>
            <template v-if="weatherIndex==26">
              <svg style="font-size:1.3333rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#iconxiaoxue"></use>
              </svg>
              <svg style="font-size:1.3333rem;" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#iconzhongxue"></use>
              </svg>
            </template>
            <template v-if="weatherIndex==27">
              <svg style="font-size:1.3333rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#iconzhongxue"></use>
              </svg>
              <svg style="font-size:1.3333rem;" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#icondaxue"></use>
              </svg>
            </template>
            <template v-if="weatherIndex==28">
              <svg style="font-size:1.3333rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#icondaxue"></use>
              </svg>
              <svg style="font-size:1.3333rem;margin-top:0.186667rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#iconbaoxue"></use>
              </svg>
            </template>
            <template v-if="weatherIndex==29">
              <svg style="font-size:1.146667rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#iconfuchen"></use>
              </svg>
            </template>
            <template v-if="weatherIndex==30">
              <svg style="font-size:1.3333rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#iconyangsha"></use>
              </svg>
            </template>
            <template v-if="weatherIndex==31">
              <svg style="font-size:1.3333rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#iconqiangshachenbao"></use>
              </svg>
            </template>
            <template v-if="weatherIndex==32">
              <svg style="font-size:1.3333rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#iconbiao"></use>
              </svg>
            </template>
            <template v-if="weatherIndex==33">
              <svg style="font-size:1.3333rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#iconlongjuanfeng"></use>
              </svg>
            </template>
            <template v-if="weatherIndex==34">
              <svg style="font-size:1.3333rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#iconruogaochuixue"></use>
              </svg>
            </template>
            <template v-if="weatherIndex==35">
              <svg style="font-size:1.3333rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#iconqingwu"></use>
              </svg>
            </template>
            <template v-if="weatherIndex==36">
              <svg style="font-size:1.146667rem" class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#iconwumai"></use>
              </svg>
            </template>
          </template>

          <div style="margin-left:0.25rem">
            <div class="weather-left-top">
              <span>{{weatherData.weather}}</span>
              <span class="week">{{weekDay}}</span>
            </div>
            <div class="weather-left-bottom">
              <span v-if="pageData.province">{{pageData.province?pageData.province:pageData.province}}</span>
              <span v-if="pageData.city">{{pageData.city?pageData.city:pageData.city}}</span>
              <span v-if="pageData.area">{{pageData.area?pageData.area:pageData.area}}</span>
            </div>
          </div>
        </div>
        <div
          v-if="weatherData.temperature||weatherData.temperature==0"
          class="weather-content-right"
        >{{weatherData.temperature}}℃</div>
        <span class="wether-warning" v-show="pageData.warning=='open' && pageData.type=='outer'">气象预警</span>
      </div>
    </template>

    <template v-else>
      <div class="aj-weather-wrap clearfix" @click="goUrl">
        <div class="aj-left">
          <div>
            <span v-if="weatherData.temperature||weatherData.temperature==0" class="temperature">{{weatherData.temperature}}℃</span>
            <span class="weather">{{weatherData.weather}} / {{weekDay}}</span>
            <span class="warning" v-if="pageData.warning === 'open' && pageData.wheatherWarningDesc !== ''">气象预警</span>
          </div>
          <div>
            <i class="xx-icon icon-location1 icon-position"></i>
            <span v-if="pageData.province">{{pageData.province?pageData.province:pageData.province}}</span>
            <span v-if="pageData.city">{{pageData.city?pageData.city:pageData.city}}</span>
            <span v-if="pageData.area">{{pageData.area?pageData.area:pageData.area}}</span>
          </div>
        </div>
        <div class="aj-right">
          <svg class="aj-svg-icon" aria-hidden="true">
            <use :xlink:href="weatherData.weather ? `#${matchWeather(weatherData.weather)}` : '晴'"></use>
          </svg>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
    import weather from '../../../assets/data/weather.json'
    export default {
  props: {
    pageData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      weatherData: {},
      weekDay: "",
      weatherList: [
        "晴", //0
        "多云", //1
        "阴", //2
        "阵雨", //3
        "雷阵雨", //4无
        "雷阵雨并伴有冰雹", //5
        "雨夹雪", //6
        "小雨", //7
        "中雨", //8
        "大雨", //9
        "暴雨", //10
        "大暴雨", //11
        "特大暴雨", //12
        "阵雪", //13
        "小雪", //14
        "中雪", //15
        "大雪", //16
        "暴雪", //17
        "雾", //18
        "冻雨", //19
        "沙尘暴", //20
        "小雨-中雨", //21
        "中雨-大雨", //22
        "大雨-暴雨", //23
        "暴雨-大暴雨", //24
        "大暴雨-特大暴雨", //25
        "小雪-中雪", //26
        "中雪-大雪", //27
        "大雪-暴雪", //28
        "浮尘", //29
        "扬沙", //30
        "强沙尘暴", //31
        "飑", //32
        "龙卷风", //33
        "弱高吹雪", //34
        "轻雾", //35
        "霾" //36
      ]
    };
  },
  computed: {
    weatherIndex() {
      return this.weatherList.indexOf(this.weatherData.weather)
      // return 25;
    }
  },
  created() {
    let _this = this;
    let arr = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    let date = new Date().getDay();
    this.weekDay = arr[date];
    if (this.pageData.province) {
        if(this.pageData.type === 'basic'){
            AMap.plugin("AMap.Weather", function() {
                var weather = new AMap.Weather();
                //查询实时天气信息, 查询的城市到行政级别的城市，如朝阳区、杭州市
                weather.getLive(_this.pageData.provinceCode, function(err, data) {
                    //   console.log(data);
                    if (data.weather) {
                        _this.weatherData = data;
                        if (_this.pageData.cityCode) {
                            weather.getLive(_this.pageData.cityCode, function(err, data) {
                                // console.log(data);
                                if (data.weather) {
                                    if (_this.pageData.areaCode) {
                                        weather.getLive(_this.pageData.areaCode, function(
                                            err,
                                            data
                                        ) {
                                            //   console.log(data);
                                            if (data.weather) {
                                                _this.weatherData = data;
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            });
        }else{
            _this.weatherData.weather = this.pageData.weather
            _this.weatherData.temperature = this.pageData.temperature
        }
    }
  },
  destroyed() {},
  methods: {
      matchWeather (name) {
          let key = ''
          let item = weather.filter(item => item.name == name)
          key = item[0] && item[0].key
          return key
      },
    getMeather(code) {
      let _this = this;
      AMap.plugin("AMap.Weather", function() {
        var weather = new AMap.Weather();
        //查询实时天气信息, 查询的城市到行政级别的城市，如朝阳区、杭州市
        weather.getLive(code, function(err, data) {
          if (!err) {
            console.log(data);
            if (!data.temperature) {
            } else {
              _this.weatherData = data;
              return false;
            }
          }
        });
      });
    },
    preview(src, e) {
      // do something
    },
    navigate(href, e) {
      // do something
    },
    goUrl(){
      window.location.href = this.pageData.linkUrl
    }
  }
};
</script>
<style lang="scss" scoped>
.weather-warpper {
  width: 100%;
  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
  .aj-svg-icon {
    width: 45px;
    height: 45px;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
  /*padding: 0 10px;*/
  .weather-content {
    height: 59px;
    display: flex;
    // margin: 5;
    justify-content: space-between;
    align-items: center;
    position: relative;
    .weather-content-left {
      display: flex;
      align-items: center;
      .weather-left-top {
        font-size: 14px;
        color: #413838;
        .week {
          font-size: 13px;
          margin-left: 10px;
        }
      }
      .weather-left-bottom {
        font-size: 11px;
        color: #413838;
      }
    }
    .weather-content-right {
      font-size: 30px;
      color: #413838;
    }
    .wether-warning{
      /*position: absolute;*/
      /*right: 5px;*/
      /*top: 0;*/
      /*font-size: 12px;*/
      /*color: #df5000;*/
      position: absolute;
      right: 0;
      top: 0;
      color: red;
      font-size: 10px;
    }
  }

  .aj-weather-wrap{
    width: 100%;
    min-height: 90px;
    background-image: url("../../../assets/images/aj-weather-bg.png")!important;
    background-repeat: no-repeat;
    background-size: 100%;
    color: #fff;
    /*padding: 10px 27px 0 21px;*/
    padding-left: 21px;
    padding-right: 27px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .aj-left{
      /*float: left;*/
      flex: 1;
      .temperature{
        font-size: 36px;
      }
      .weather{
        font-size: 15px;
      }
      .warning{
        color: orangered;
        margin-left: 2px;
      }
      .icon-position{
        font-size: 14px;
        margin-right: 2px;
        color: #fff;
      }
    }
    .aj-right{
      /*float: right;*/
      width: 90px;
    }
  }

}
</style>

