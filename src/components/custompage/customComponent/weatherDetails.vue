<template>
  <div class="details-show-box">
    <!--{{pageData}}-->
    <div class="details">
      <div class="left-wrap">
        <div class="item">
          <svg class="svg-icon" aria-hidden="true">
            <use :xlink:href="pageData.weather ? `#${matchWeather(pageData.weather)}` : '晴'"></use>
          </svg>
        </div>
        <div class="item">
          <span class="temperature" v-if="pageData.temperature||pageData.temperature==0">{{pageData.temperature}}℃</span>
          <span class="weather">{{pageData.weather ? pageData.weather : '暴雪'}}</span>
        </div>
        <div class="item">
          <span class="week">{{weekDay}}</span>
          <span class="line">|</span>
          <span class="date">{{pageData.date}}</span>
        </div>
      </div>
      <div class="right-wrap">
        <div class="wind right-item">风速<span style="margin-left: 2px">{{pageData.wind ? pageData.wind + '  级' : '2'}}</span> </div>
        <div class="rh right-item">湿度<span style="margin-left: 2px">{{pageData.rh ? pageData.rh + '%' : '6'}}</span></div>
        <div class="prs right-item">气压<span style="margin-left: 2px">{{pageData.prs ? pageData.prs + ' hPa' : ''}}</span></div>
        <div class="publishTime">安吉县气象台{{pageData.publishTime}}发布</div>
      </div>
    </div>
  </div>
</template>
<script>
  import moment from 'moment'
  import weather from '../../../assets/data/weather.json'
  export default {
        props: {
            pageData: {
                type: Object,
                default: {},
            }
        },
        data(){
            return {
                data: {
                    temperature: '6', // 温度
                    date: '2019/1/1',  // 日期
                    wind: '大风', // 风速
                    pr: '1000', // 降水
                    prs: '23', // 气压
                    sunriseTime: '12:00', // 日出时间
                    sunsetTime: '12:00' // 日落时间
                },
                time: '',
                weekDay: ''
            }
        },
        computed: {
            // pageData () {
            //     let data = this.data
            //     return data
            // }
        },
        created () {
            let arr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
            let date = new Date().getDay()
            this.weekDay = arr[date]
            this.time = moment().format('HH:MM')
        },
        methods: {
            matchWeather (name) {
                let key = ''
                let item = weather.filter(item => item.name == name)
                key = item[0] && item[0].key
                return key
            }
        }
    };
</script>
<style lang="scss" scoped>
  .details-show-box {
    width: 100%;
    .details{
      padding: 8px;
      display: flex;
      justify-content: space-between;
      color: #fff;
      background-image: url('../../../assets/images/aj_weather_details.png');
      background-size: 100%;
      background-repeat: no-repeat;
      width: 100%;
      height: 265px;
      box-sizing: border-box;
      .svg-icon {
        width: 60px;
        height: 60px;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
      }
      .left-wrap{
        width: 200px;
        .temperature{
          font-size: 38px;
          margin-right: 2px;
        }
        .weather{
          font-size: 18px;
        }
        .item{
          /*margin-top: 5px;*/
        }
        .week, .date{
          font-size: 14px;
          display: inline-block;
        }
        .line{
          margin: 0 10px;
          vertical-align: top;
          display: inline-block;
          font-size: 14px;
        }
      }
      .right-wrap{
        /*flex: 1;*/
        mni-width: 125px;
        font-size: 13px;
        .right-item{
          /*width: 125px;*/
          /*text-align: left;*/
          margin-top: 6px;
          padding-left: 46px;
          background-size: contain;
          background-position-x: right;
          height: 30px;
          line-height: 30px;
          /*text-align: right;*/
        }
        .wind{
          background: url('../../../assets/images/wind.png') no-repeat;
          background-size: contain;
          background-position-x: right;
          /*height: 30px;*/
          /*line-height: 30px;*/
        }
        .rh{
          background: url('../../../assets/images/shidu.png') no-repeat;
          background-size: contain;
          background-position-x: right;
          /*height: 30px;*/
          /*line-height: 30px;*/
        }
        .prs{
          background: url('../../../assets/images/qiya.png') no-repeat;
          background-size: contain;
          background-position-x: right;
          /*height: 30px;*/
          /*line-height: 30px;*/
        }
        .publishTime{
          text-align: right;
          margin-top: 20px;
        }
      }
    }
  }
</style>
