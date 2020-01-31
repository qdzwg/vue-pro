<template>
  <div class="ticket-detail-warpper m-b-10">
    <h2 class="ticket-w-title">评论({{total}}) <span
                   class="more"
                   v-if="loadNum!='all'" @click="gourl">查看全部</span>
    </h2>
    <div v-if="commentData.length"
         class="ticket-detail-box comment-ul">
      <div v-for="(item,index) in commentData"
           :key="index"
           class="comment-li">
        <div class="user-info">
          <div class="img-name">
            <img v-if="item.headImg"
                 class="logo-img"
                 :src="item.headImg"
                 alt>
            <i v-else
               class="xx-icon icon-member member-svg"></i>
            <span class="name"
                  v-if="item.isAnonymous=='F'">{{item.userName}}</span>
            <span class="name"
                  v-else>匿名用户</span>
            <span class="start">
              <i class="xx-icon icon-star-full"
                 v-for="index in item.score"
                 :key="index"></i>
            </span>
          </div>
          <span class="comment-time">{{item.createTime | dateFtt('yyyy-MM-dd')}}</span>
        </div>
        <div class="comment-content">{{item.content}}
          <p class="commit-list-item-editer changeMyCommit"
             v-if="item.beUpdate=='T'">
            <span @click="edit(item)">修改评论</span>
            <i class="xx-icon icon-iconfont-xie"> </i>
          </p>
        </div>
        <p class="comment-reply"
           v-if="item.replyContent">
          商家回复：{{item.replyContent}}
        </p>
      </div>
    </div>
    <div v-else
         class="no-comment">暂无评论</div>
    <div class="addressLayer"
         :class="{'show':editShow}">
      <div class="addressLayer-handle">
        <a href="javascript:;"
           class="userEditer-close"
           @click="close"><i class="xx-icon icon-guanbi1"></i></a></div>
      <div style="display:block;"
           class="layerContent newAddress">
        <form id="form"
              novalidate="novalidate">
          <div class="comment-panel">
            <p>
              <group>
                <x-textarea v-model="commentForm.content"
                            placeholder="请写下您对我们的感受吧"
                            class="order-textarea"
                            :rows="10"></x-textarea>
              </group>
            </p>
          </div>
          <div class="common-num-box">
            <p><strong>满意度评分</strong>
              <span class="pfxtFen">
                <template v-for="count in 5">
                  <i class="xx-icon icon-iconfont-aixin"
                     v-if="count>commentForm.score"
                     @click="setScore(count)"></i>
                  <i class="xx-icon icon-iconfont-aixin star-full"
                     @click="setScore(count)"
                     v-else></i>
                </template>
              </span>
            </p>
            <p class="comment-checked">
              <check-icon :value.sync="checked"
                          type="plain">匿名评论</check-icon>
            </p>
          </div>
          <div class="btn-handle">
            <x-button type="primary"
                      :show-loading="loading"
                      @click.native.prevent="submit">发表评论</x-button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import { CheckIcon, XButton, XTextarea, Group } from 'vux'
export default {
  data () {
    return {
      commentData: [],
      leaguerId: localStorage.getItem("xjsc_login_userId_2019_3_8") || this.$cookie.get("leaguerInfoId"),
      checked: false,
      loading: false,
      editShow: false,
      commentForm: {
        wayType: '',
        content: '',
        isAnonymous: 'F',
        score: 0,
        userInfoId: localStorage.getItem("xjsc_login_userId_2019_3_8") || this.$cookie.get("leaguerInfoId")
      },
      total: 0
    }
  },
  components: {
    CheckIcon,
    XButton,
    XTextarea, Group
  },
  props: {
    data: {
    },
    loadNum: {
      type: String,
      default: '5'
    },
    mold: {
      type: String
    },
    id: {
      type: String
    },
    url: {
      type: String
    },
    param: {
      type:Object
    }
  },
  created(){
    this.init()
  },
  watch:{
    'param.id'(val){
      this.init()
    }
  },
  methods: {
    init() {
      if (this.url) {
        this.commentForm.wayType = this.param.wayType
        this.getComment()
      }  
    },
    getComment () {
      this.getAxios(this.url, this.param).then(result => {
        this.total = result.data.length
        if (this.loadNum !== "all") {
          this.commentData = result.data.slice(0, this.loadNum)
        } else {
          this.commentData = result.data
        }
      });
    },
    edit (item) {
      this.editShow = true
      this.commentForm.content = item.content
      this.commentForm.isAnonymous = item.isAnonymous
      this.commentForm.id = item.id
      this.commentForm.score = item.score
    },
    close () {
      this.editShow = false
    },
    setScore (count) {
      this.commentForm.score = count
    },
    submit () {
      this.loading=true
      this.commentForm.isAnonymous = this.checked ? 'T' : 'F'
      if (!this.commentForm.content) {
        this.$vux.toast.text("评论内容不能为空！", "middle");
        this.loading=false
        return false;
      }
      console.log(this.commentForm)
      let url = this.api.main.comment.update
      this.postAxios(url, this.commentForm).then(result => {
        this.loading=false
        if (result.status === 200) {
          this.editShow = false
          this.getComment()
        } else {
          this.$vux.toast.text(result.message, "middle");
        }
      }).catch(err => {

      })
    },
    gourl(){
      this.$router.push('/list/comment/'+this.mold+'/'+this.id)
    }
  }
}
</script>
<style lang="scss">
@import "../assets/styles/mixin.scss";
.ticket-detail-warpper {
  background: #fff;
  .ticket-w-title {
    @include sc(18px, #413838);
    font-weight: 600;
    padding: 20px 15px 20px 15px;
    .more {
      float: right;
      font-weight: normal;
      font-size: 14px;
      color: #0086F6;
    }
  }
  .ticket-detail-box {
    padding: 0px 15px 20px 15px;
    img {
      max-width: 100%;
      height: auto;
    }
  }
  .comment-ul {
    .comment-li {
      margin-bottom: 20px;
      .user-info {
        @include fbc;
        .img-name {
          @include fbc;
          .logo-img {
            width: 20px;
            height: 20px;
            border-radius: 10px;
            background: url(../assets/images/header.png) no-repeat;
            background-size: contain;
          }
          .name {
            @include sc(14px, #5c5c5c);
            margin-left: 12px;
          }
          .start {
            margin-left: 20px;
            i {
              color: #f05b47;
              font-size: 12px;
            }
          }
        }
        .comment-time {
          @include sc(12px, #999);
        }
      }
      .comment-content {
        margin-top: 8px;
        @include sc(14px, #413838);
        .commit-list-item-editer {
          color: #19a0f0;
        }
      }
      .comment-reply {
        background-color: #f0f0f0;
        padding: 5px;
        line-height: 160%;
        margin-top: 5px;
      }
    }
  }
  .no-comment {
    @include sc(12px, #767676);
    text-align: center;
    padding: 82px 0;
    padding-top: 14px;
  }
  .addressLayer {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 999;
    background-color: #fff;
    top: 0;
    left: 100%;
    transition: left 0.4s;
  }

  .addressLayer.show {
    left: 0;
  }

  .addressLayer-colse {
    float: right;
    margin-right: 10px;
    color: #fff;
  }

  .addressLayer-handle {
    height: 36px;
    line-height: 36px;
    background-color: #ff5400;
  }
  .userEditer-close {
    float: right;
    margin-right: 10px;
    color: #fff;
    font-size: 16px;
  }
  .comment-panel {
    background-color: #fff;
    padding: 15px;
    margin-top: 15px;
  }

  .comment-panel .order-textarea {
    width: 100%;
  }
  .order-textarea {
    width: 100%;
    background: none;
    border: none;
    font-size: 12px;
    line-height: 24px;
    color: #666;
    outline: none;
    resize: none;
  }

  .common-num-box {
    margin: 20px;
  }

  .common-num-box p {
    font-size: 14px;
    line-height: 48px;
    color: #333;
  }
  .common-num-box strong {
    margin-right: 5px;
  }

  .common-num-box .pfxtFen {
    padding: 0 5px;
  }

  .common-num-box .pfxtFen i {
    font-size: 24px;
    vertical-align: middle;
    color: #999;
  }

  .common-num-box .pfxtFen i.icon-star-empty {
    color: #999;
  }

  .common-num-box .pfxtFen i.star-full {
    color: #f63;
  }

  .common-num-box strong,
  .common-num-box span {
    display: inline-block;
    *zoom: 1;
    *display: inline;
    vertical-align: middle;
  }
  .comment-checked {
    .vux-check-icon {
      .weui-icon-circle,
      .weui-icon-success-circle {
        font-size: 16px;
      }
      span {
        font-size: 12px;
      }
    }
  }
  .btn-handle {
    padding: 0 20px;
    .weui-btn_primary {
      background-color: #19a0f0;
    }
    .weui-btn_primary:not(.weui-btn_disabled):active {
      background-color: #19a0f0;
    }
  }
}
</style>
