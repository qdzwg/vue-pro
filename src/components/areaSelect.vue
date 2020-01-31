<template>
  <div v-if="show" class="area-select-page">
    <popup class="area-pop" v-model="show">
      <div class="handle-box">
        <button @click="show=false" class="btn del-btn">取消</button>
        <button @click="sure" class="btn sure-btn">确定</button>
      </div>
      <div class="picker-list">
        <picker
          class="picker-item"
          :columns="1"
          :data="provinces"
          v-model="province"
          @on-change="provinceChange"
        ></picker>
        <picker
          class="picker-item"
          :columns="1"
          :data="citys"
          v-model="city"
          @on-change="cityChange"
        ></picker>
        <picker
          class="picker-item"
          :columns="1"
          :data="areas"
          v-model="area"
          @on-change="areaChange"
        ></picker>
      </div>
    </popup>
  </div>
</template>
<script>
import { Picker, Popup } from "vux";
export default {
  components: {
    Picker,
    Popup
  },
  props: {
    areaArrStr: {
      type: String,
      default: "110000-110100-110100"//默认值
    }
  },
  data() {
    return {
      year3: ["2005"],
      years: [],
      show: false,
      provinces: [],
      citys: [],
      areas: [],
      province: [],
      city: [],
      area: []
    };
  },
  methods: {
    init() {
      this.show = true;
    //   this.areaArrStr = this.areaArrStr?this.areaArrStr:'110000-110100-110100'
      let arr = this.areaArrStr.split(",")
      console.log(arr)
      this.province = [arr[0]];
      this.city = [arr[1]];
      this.area = [arr[2]];
      this.getProvinceList();
      this.getCityList(arr[0]);
      this.getAreaList(arr[1]);
    },
    sure() {
        // alert(11)
      let arr1 = this.provinces.find(item => item.value == this.province[0]);
      let arr2 = this.citys.find(item => item.value == this.city[0]);
      let arr3 = this.areas.find(item => item.value == this.area[0]);
      let arr = [arr1, arr2, arr3];
      // console.log(arr);
      this.$emit("getAddress", arr);
      this.show = false;
    },
    getProvinceList() {
      console.log("111")
      this.getAxios("/admin/api/area/selectByPcode", {}).then(res => {
        this.provinces = res.data.map(item => {
          return {
            value: item.areaCode,
            name: item.areaName
          };
        });
      });
    },
    provinceChange() {
      //市
      this.getCityList(this.province[0]);
    },
    getCityList(code) {
      console.log("2222")
      this.getAxios("/admin/api/area/selectByPcode", {
        parentCode: code ? code : ""
      }).then(res => {
        this.citys = res.data.map(item => {
          return {
            value: item.areaCode,
            name: item.areaName
          };
        });
      });
    },
    cityChange() {
      //市
      this.getAreaList(this.city[0]);
    },
    getAreaList(code) {
       console.log("333")
      this.getAxios("/admin/api/area/selectByPcode", {
        parentCode: code ? code : ""
      }).then(res => {
        this.areas = res.data.map(item => {
          return {
            value: item.areaCode,
            name: item.areaName
          };
        });
      });
    },
    areaChange() {}
  }
};
</script>
<style lang="scss">
.area-select-page {
  .area-pop {
    background: #fff;
  }
  .picker-list {
    display: flex;
    .picker-item {
      width: 33.3%;
    }
  }
  .handle-box {
    margin-top: 5px;
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    .btn {
      background: red;
      color: #413838;
      font-size: 16px;
      outline: none;
      border: 1px solid #aaa;
      background: #ccc;
      padding: 3px 10px;
    }
  }
}
</style>
