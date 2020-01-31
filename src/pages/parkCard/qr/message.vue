<template>
  <div class="handle-qr-error">
      <!-- 未办理 -->
      <div v-if="code == 1001" class="error-model">
        <div class="handle-qr-type">
          <img src="../../../assets/images/parkcard/02.png" alt="">
        </div>
        <div class="handle-qr-message">
          <p>当前账号未购买年卡</p>
          <p>无法使用二维码功能</p>   
        </div>
        <div class="handle-qr-btns">
          <div class="btn buy" @click="toBuy">立即办理</div>
        </div>
      </div> 

    
      <!-- 已过期 -->
      <div v-else-if="code == 1002" class="error-model">
        <div class="handle-qr-type">
          <img src="../../../assets/images/parkcard/03.png" alt="">
        </div>
        <div class="handle-qr-message">
          <p>当前账号购买的年卡已过期</p>
          <p>无法使用二维码功能</p>   
        </div>
        <div class="handle-qr-btns">
          <div class="btn buy" @click="toDetail">立即续费</div>
        </div>
      </div> 

       <!-- 未绑定 -->
      <div v-else-if="code == 1003" class="error-model">
        <div class="handle-qr-type">
          <img src="../../../assets/images/parkcard/01.png" alt="">
        </div>
        <div class="handle-qr-message">
          <p>当前账号购买的年卡未绑定电子二维码</p>
          <p>请绑定后重试</p>   
        </div>
        <div class="handle-qr-btns">
          <div class="btn buy" @click="toBind">立即绑定</div>
        </div>
      </div> 


      <!-- 多个二维码 -->
      <div v-else-if="code == 1004" class="error-model">
        <div class="handle-qr-type">
          <img src="../../../assets/images/parkcard/01.png" alt="">
        </div>
        <div class="handle-qr-message">
          <p>当前账号绑定了多个电子二维码</p>
          <p>需要选择要查看的电子的二维码</p> 
        </div>
        <div class="handle-qr-btns">
          <div class="btn buy" @click="toSelect">立即选择</div>
        </div>
      </div> 

      <!-- 其他 -->
      <div v-else class="error-model">
        <div class="handle-qr-type">
          <img src="../../../assets/images/parkcard/01.png" alt="">
        </div>
        <div class="handle-qr-message">
          <p>未成功加载</p> 
        </div>
        <div class="handle-qr-btns">
          <div class="btn buy" @click="myList">年卡管理</div>
        </div>
      </div> 
  </div>
</template>
<script>
export default {
    data(){
      return {
        code:'',
        recordid:''
      }
    },
    created(){
      this.code = this.$route.query.code || ''
      this.recordid = this.$route.query.recordid || ''
    },
    methods:{
      toBuy(){
        this.$router.push('/yearcard')
      },
      toBind(){
        this.$router.push('/parkCard/bindQr?recordid='+this.recordid)
      },
      toDetail(){
        this.$router.push('/parkCard/detail?recordid='+this.recordid)
      },
      myList(){
        this.$router.push('/parkCard/list')
      },
      toSelect(){
        this.$router.push('/parkCard/list')
      }
    }
}
</script>
<style lang="scss" scope>
.handle-qr-error {
  width:100%;
  height: 100%;
  .handle-qr-type {
    margin: 60px auto;
    width: 220px;
    height: 125px;
    img {
      width: 100%;
    }
  }
  .handle-qr-message {
    margin-top: 52px;
    text-align: center;
    font-size:13px;
    font-family:PingFang SC;
    font-weight:500;
    color:#CCCCCC;
    line-height:18px;
  }
  .handle-qr-btns {
    margin-top: 33px;
    > .btn {
      width:180px;
      height:45px;
      background:white;
      border:1px solid #4FC898;
      border-radius:23px;
      margin: 0 auto;
      line-height: 45px;
      text-align: center;
      font-size:18px;
      font-family:PingFang SC;
      font-weight:500;
      color:#4FC898;
    }
  }
}
</style>