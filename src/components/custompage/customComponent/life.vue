<template>
  <div class="life">
    <div class="title">生活指数</div>
    <ul class="list">
      <li v-for="(item, index) in list" :key="index" class="item">
        <template v-if="item.weatherIndex === '度假气候指数'">
          <img :src="imgList[0].url" alt="">
        </template>
        <template v-if="item.weatherIndex === '交通气象指数'">
          <img :src="imgList[1].url" alt="">
        </template>
        <template v-if="item.weatherIndex === '空气负氧离子浓度指数'">
          <img :src="imgList[2].url" alt="">
        </template>
        <template v-if="item.weatherIndex === '空气质量指数'">
          <img :src="imgList[3].url" alt="">
        </template>
        <template v-if="item.weatherIndex === '两山游养指数'">
          <img :src="imgList[4].url" alt="">
        </template>
        <template v-if="item.weatherIndex === '舒适度指数'">
          <img :src="imgList[5].url" alt="">
        </template>
        <template v-if="item.weatherIndex === '紫外线指数'">
          <img :src="imgList[6].url" alt="">
        </template>
        <span style="display: block;margin-top: 10px">{{item.weatherIndex}}</span>
        <span style="display: block;margin-top: 6px">{{item.indexDesc}}</span>
      </li>
    </ul>
  </div>
</template>
<script>
    export default {
        props: {
            pageData: {
                type: Object,
                default: {}
            }
        },
        data() {
            return {
                data: {
                    geologicalDisaster: '', // 地质灾害
                    comfort: '',  // 舒适度
                    uv: '', // 紫外线
                    morningExercise: '', // 晨练
                    airDry: '', // 晾晒
                    dress: '', // 穿衣
                    umbrella: '', // 雨伞
                    cold: '' // 感冒
                },
                imgList: [
                    {
                        url: require('../../../assets/images/dujia.png'),
                        name: '度假气候指数'
                    },
                    {
                        url: require('../../../assets/images/jiaotong.png'),
                        name: '交通气象指数'
                    },
                    {
                        url: require('../../../assets/images/fuyang.png'),
                        name: '空气负氧离子浓度指数'
                    },
                    {
                        url: require('../../../assets/images/zhiliang.png'),
                        name: '空气质量指数'
                    },
                    {
                        url: require('../../../assets/images/youyang.png'),
                        name: '两山游养指数'
                    },
                    {
                        url: require('../../../assets/images/shushi.png'),
                        name: '舒适度指数'
                    },
                    {
                        url: require('../../../assets/images/ziwaixian.png'),
                        name: '紫外线指数'
                    }
                ],
                lifeList: [
                    {
                        imgUrl: 'http://dmimg.5054399.com/allimg/pkm/pk/22.jpg',
                        info: '风险较低'
                    },
                    {
                        imgUrl: 'http://dmimg.5054399.com/allimg/pkm/pk/22.jpg',
                        info: '风险较低'
                    },
                    {
                        imgUrl: 'http://dmimg.5054399.com/allimg/pkm/pk/22.jpg',
                        info: '风险较低'
                    },
                    {
                        imgUrl: 'http://dmimg.5054399.com/allimg/pkm/pk/22.jpg',
                        info: '风险较低'
                    },
                    {
                        imgUrl: 'http://dmimg.5054399.com/allimg/pkm/pk/22.jpg',
                        info: '风险较低'
                    },
                    {
                        imgUrl: 'http://dmimg.5054399.com/allimg/pkm/pk/22.jpg',
                        info: '风险较低'
                    }
                ]
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
        destroyed() {},
        methods: {
        }
    };
</script>
<style lang="scss" scoped>
  .life {
    padding-bottom: 10px;
    background: #fff;
    width: 96%;
    margin: 0 auto;
    border-radius: 10px;
    .title{
      padding: 16px 0 10px 10px;
      border-bottom: none;
      font-size: 15px;
      color: #000;
      font-weight: bold;
    }
    .list{
      .item{
        width: 25%;
        display: inline-block;
        /*border-right: 1px solid #ccc;*/
        /*border-bottom: 1px solid #ccc;*/
        padding: 10px 0;
        box-sizing: border-box;
        vertical-align: top;
        /*background: #df5000;*/
        padding: 10px 0;
        &:first-child{
          /*background: #df5000;*/
        }
        img{
          width: 50px;
          height: 50px;
          margin: 0 auto;
          display: block;
        }
        span{
          display: block;
          text-align: center;
        }
      }
    }
  }
</style>
