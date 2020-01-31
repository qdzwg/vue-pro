<template>
  <div class="sevenDayForecast">
    <div class="title">7天预报</div>
    <ul class="list">
      <li v-for="(item, index) in list" :key="index" class="item">
        <span class="week">{{item.week}}</span>
        <span style="margin-top: 2px">{{item.date}}</span>
        <span  style="display: inline-block;width:100%; height: 40px;text-align: center;margin-top: 2px">{{item.weatherPhenomenon1}}</span>
        <div style="text-align: center;vertical-align: middle">
          <svg class="svg-icon" aria-hidden="true">
            <use :xlink:href="item.weatherPhenomenon1 ? `#${matchWeather(item.weatherPhenomenon1)}` : ''"></use>
          </svg>
        </div>
        <div style="margin-top: 130px;display: flex;align-items: center;justify-content: center">
          <svg class="svg-icon" aria-hidden="true">
            <use :xlink:href="item.weatherPhenomenon2 ? `#${matchWeather(item.weatherPhenomenon2)}` : ''"></use>
          </svg>
        </div>
        <span style="display: inline-block;width:100%; height: 40px;text-align: center;">{{item.weatherPhenomenon2}}</span>
        <span style="display: inline-block;width:100%; height: 80px;text-align: center;margin-top: 2px">{{item.wind}}</span>
      </li>
    </ul>
    <div class="echart-wraper" style="height: 100px;">
      <div id="main" ref="myEchart" :style="{width: '100%',height:'100px'}"></div>
    </div>
<!--    <div class="echart-wraper2" style="height:50px">-->
<!--      <div id="main2" ref="myEchart2" :style="{width: '100%',height:'50px'}"></div>-->
<!--    </div>-->
  </div>
</template>
<script>
    import weather from '../../../assets/data/weather.json'
    var echarts = require('echarts/lib/echarts');
    // 引入折线图
    require('echarts/lib/chart/line');
    // 引入提示框和标题组件
    require('echarts/lib/component/legend');
    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/title');
    export default {
        props: {
            pageData: {
                type: Object,
                default: {}
            }
        },
        data() {
            return {
                minTemperature: [12, 10, 9, 6, 11, 2, -1, 3],
                maxTemperature: [12, 10, 9, 6, 11, 2, -1, 3]
            }
        },
        computed: {
            list(){
              let data = this.pageData.dataList
              return data
            }
        },
        created() {
        },
        mounted(){
            this.$nextTick(()=>{
                this.initChart()
            })
        },
        destroyed() {},
        methods: {
            matchWeather (name) {
                let key = ''
                let item = weather.filter(item => item.name == name)
                key = item[0] && item[0].key
                return key
            },
            initChart () {
                let minTemp = []
                let maxTemp = []
                this.list.forEach(item => {
                    minTemp.push(item.minTemperature)
                    maxTemp.push(item.maxTemperature)
                })
                this.minTemperature = minTemp
                this.maxTemperature = maxTemp
                console.log('initChart', this.$refs.myEchart)
                let chart = echarts.init(this.$refs.myEchart)
                chart.setOption({
                    grid: { // 设置折现图与table单元格的距离
                        top: 0,
                        bottom: 5,
                        left: 0,
                        right: 0,
                        width: '100%',
                        // containLabel: true
                    },
                    xAxis: [{
                        show: false,
                        type: 'category',
                        axisLabel : {
                            formatter: '{value} °C'
                        }
                    }],
                    yAxis: [{
                        show: false,
                        type: 'value',
                        min: function (value) {
                            return value.min - 10
                        },
                        max: function (value) {
                            return value.max + 10
                        }
                    }],
                    series: [
                        {
                        name: 'temperature',
                        type: 'line',
                        // showSymbol: false,
                        color: ['#66AEDE'],
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                formatter: function (params) {
                                    return `${params.data}°C`
                                }
                            }
                        },
                        data: this.maxTemperature
                    },
                      {
                          name: 'temperature',
                          type: 'line',
                          // showSymbol: false,
                          color: ['#df5000'],
                          label: {
                              normal: {
                                  show: true,
                                  position: 'bottom',
                                  formatter: function (params) {
                                      return `${params.data}°C`
                                  }
                              }
                          },
                          data: this.minTemperature
                      }
                      ]
                })

                setTimeout(function (){
                    window.onresize = function () {
                        chart.resize();
                    }
                },200)

                // let chart2 = echarts.init(this.$refs.myEchart2)
                // chart2.setOption({
                //     grid: { // 设置折现图与table单元格的距离
                //         top: 10,
                //         bottom: 5,
                //         left: 0,
                //         width: '100%',
                //         // containLabel: true
                //     },
                //     xAxis: [{
                //         show: false,
                //         type: 'category'
                //     }],
                //     yAxis: [{
                //         show: false,
                //         type: 'value',
                //         min: function (value) {
                //             return value.min - 20
                //         },
                //         max: function (value) {
                //             return value.max + 20
                //         }
                //     }],
                //     series: [{
                //         name: 'price',
                //         type: 'line',
                //         // showSymbol: false,
                //         color: ['#df5000'],
                //         label: {
                //             normal: {
                //                 show: true,
                //                 position: 'bottom',
                //                 formatter: function (params) {
                //                     return `${params.data}°C`
                //                 }
                //             }
                //         },
                //         data: this.minTemperature
                //     }]
                // })
            }
        }
    };
</script>
<style lang="scss" scoped>
  .sevenDayForecast {
    position: relative;
    width: 96%;
    margin: 0 auto;
    margin-top: -90px;
    border-radius:10px;
    background: #fff;
    .svg-icon {
      width: 2em;
      height: 2em;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
    }
    .title{
      padding: 16px 0 16px 10px;
      font-size: 15px;
      font-weight: bold;
    }
    .echart-wraper{
      width: 100%;
      position: absolute;
      left: 0;
      top: 180px;
    }
    .echart-wraper2{
      width: 100%;
      position: absolute;
      left: 0;
      top: 160px;
    }
    .list{
      padding: 0 0 20px;
      .item{
        width: 12.2%;
        vertical-align: top;
        display: inline-block;
        min-height: 310px;
        &:not(:first-child){
          border-left: 1px solid #F0F0F0;
        }
        .week{
          font-size: 15px;
          color: #000;
          font-weight: 500;
        }
        span, i{
          display: block;
          text-align: center;
        }
      }
    }
  }
</style>
