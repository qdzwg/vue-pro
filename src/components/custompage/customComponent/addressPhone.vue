<template>
  <div class="address-phone-box" :style='{background:pageData.backgroundColor,}'>
    <!-- {{pageData}} -->
    <div class="address-phone">
      <div class="address-icon" @click="openMap" v-if="pageData.phonePosition==='right'"><span class="icon-phone-span">
        <svg class="icon svg-icon" aria-hidden="true">
          <use xlink:href="#icondingweiweizhi"></use>
        </svg>
      </span></div>
      <a class="phone-block" :href="'tel:' + pageData.phone" v-if="pageData.phonePosition==='left'" :style='{background:pageData.phoneBackgroundColor,}'>
        <svg class="icon svg-icon" aria-hidden="true">
          <use xlink:href="#iconcontact"></use>
        </svg>
      </a>
      <div class="address-block" :style='{border:"1px solid"+ pageData.borderColor,"text-align":pageData.textPosition,color:pageData.textColor}'>
        <div class="address-text">{{pageData.text}}</div>  
      </div>
      <div class="address-icon" @click="openMap" v-if="pageData.phonePosition==='left'"><span class="icon-phone-span">
        <svg class="icon svg-icon" aria-hidden="true">
          <use xlink:href="#icondingweiweizhi"></use>
        </svg>  
      </span></div>
      <a class="phone-block" :href="'tel:' + pageData.phone" v-if="pageData.phonePosition==='right'" :style='{background:pageData.phoneBackgroundColor,}'>
        <svg class="icon svg-icon" aria-hidden="true">
          <use xlink:href="#iconcontact"></use>
        </svg>
      </a>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      pageData: {
        type: Object
      }
    },
    data() {
      return {
        
      };
    },
    methods: {
      //打开地图
      openMap() {
        window.location.href =
          "//uri.amap.com/navigation?to=" +
          this.pageData.position +
          "," +
          this.pageData.text +
          "&mode=car&callnative=1";
      },
    }
  };
</script>
<style lang="scss">
  .address-phone-box {
    
    padding: 10px 15px;
    .address-phone {
      display: flex;
      .address-icon {
        font-size: 14px;
        height: 40px;
        width: 40px;
        text-align: center;
        .icon-phone-span {
          display: inline-block;
          background-color: #f1f1f1;
          height: 30px;
          margin-top: 5px;
          line-height: 30px;
          border-radius: 50%;
          width: 30px;
        }
        .svg-icon {
          vertical-align: middle;
          width: 20px;
          height: 20px;
        }
      }
      .address-block {
        flex-grow: 1;
        padding: 0px 10px;
        // background-color: #fff;
        height: 38px;
        display: flex;
        align-items: center;
        div {
          flex-grow: 1;
        }
      }
      .phone-block {
        width: 40px;
        color: #fff;
        text-align: center;
        flex-shrink: 0;
        height: 40px;
        line-height: 40px;
        .svg-icon {
          vertical-align: middle;
          width: 20px;
          height: 20px;
        }
      }
    }
  }
</style>
