<template>
    <div class="yearcard-list">
        <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
            <div class="item-ul">
                <div class="item-li" v-for="(item,index) in listData" :key="index" @click="gourl(item.id)">
                    <img :src="item.cardCover +'?imageMogr2/thumbnail/640x/strip/quality/100'" alt="">
                    <div class="cardLogo">
                        <img :src="item.cardLogo +'?imageMogr2/thumbnail/640x/strip/quality/100'" alt="">
                        <div class="cardName">{{item.cardName}}</div>
                    </div>
                    <!-- <div class="card-mask"></div> -->
                </div>
                <!-- <div class="card-mask"></div> -->
            </div>
             <div v-if="listData instanceof Array && !listData.length">
                <div class="no-data">暂无数据</div>
            </div>
        </mescroll-vue>
        <card-footer></card-footer>
    </div>
</template>

<script>
import cardFooter from './../../parkCard/component/footer'
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
  components: {
    MescrollVue,
    cardFooter
  },
  data() {
    return {
      listData: [],
      mescroll: null, // mescroll实例对象
      mescrollDown: {}, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
      mescrollUp: {
        // 上拉加载的配置.
        callback: this.getList, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
        //以下是一些常用的配置,当然不写也可以的.
        page: {
          num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 6 //每页数据条数,默认10
        },
        noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
        htmlNodata: '<p class="upwarp-nodata">加载完成</p>',
        htmlContent:
          '<p class="downwarp-progress"></p><p class="downwarp-tip">下拉刷新 </p>', //布局内容
        empty: {
          tip: "暂无年卡" //提示
        }
      },
      merchantInfoId:'',
      userInfo:{}
    };
  },
  created() {
    // 保存cardid
    document.title = '年卡列表'
    if (this.$route.query.id) {
      localStorage.setItem("park_card_id", this.$route.query.id);
    }
  },
  methods: {
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    getList(page, mescroll) {
      let _this = this;
      let tUrl = this.api.member.info;
      this.getAxios(tUrl, {}).then(res => {
        _this.userInfo = res.data;
        if (res.data.isLogin !== "T") {
          _this.$router.push("/parkCard/login", { ..._this.$route.query });
        } else {
        }
      });
      this.getAxios("/marketing/api/yearCardToc/selectList", {
        currPage: page.num,
        pageSize: page.size,
        status: "T",
        modelName: ""
      }).then(res => {
        if (res.status == 200) {
          // 如果是第一页需手动制空列表
          if(res.data.total===1){
              this.$router.push("/parkCard/home?id=" + res.data.rows[0].id);
              return
          }
          let arr = res.data.rows;
          if (page.num === 1) this.listData = [];
          // 把请求到的数据添加到列表
          this.listData = this.listData.concat(arr);
          // 数据渲染成功后,隐藏下拉刷新的状态
          _this.$nextTick(() => {
            // mescroll.endBySize(arr.length, res.data.total);
            mescroll.endByPage(arr.length,res.data.pages);
          });
        } else {
          // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          mescroll.endErr();
        }
      });
    },
    gourl(id) {
      this.$router.push("/parkCard/home?id=" + id);
    }
  }
};
</script>

<style lang="scss" scoped>
.yearcard-list {
  width: 100%;
  .mescroll {
    position: fixed;
    // padding-bottom: 1rem;
    top: 0;
    bottom:30px;
    height: auto;
  }
  .item-ul {
    padding: 0 15px;
    .item-li {
      height: 130px;
      margin: 15px 0;
      position: relative;
      .card-mask {
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.26);
        z-index: 2;
        left: 0;
        top: 0;
        border-radius: 6px;
      }
      img {
        width: 100%;
        height: 100%;
        border-radius: 6px;
      }
      .cardLogo {
        width: 90%;
        position: absolute;
        top: 12%;
        left: 15px;
        z-index: 99;
        img {
          width: 40px;
          height: 40px;
          border: 2px solid #fff;
          border-radius: 50%;
          vertical-align: top;
        }
        .cardName {
          width: 75%;
          margin-left: 10px;
          color: #fff;
          font-size: 15px;
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
}
 .no-data {
        padding: 20px 15px;
        width: 345px;
        text-align: center;
        color: #BBBBBB;
        font-family:PingFangSC-Regular;
        font-size: 18px;
    }
</style>


