<template>
  <div class="hello">
    <button @click="dispatchTest">dispatchTest</button>
    <button @click="showLoad">showloading</button>
    <div class="demo-test">1322321313213211231312</div>
    <span>saddas</span>
    <router-link to="/home">跳转2</router-link>
    <div>数量{{count}}</div>
    <button @click="testAdd">storeAdd</button>
    <button @click="addAction">add</button>
    <button @click="addtest">add2</button>
    <div>user{{userCount}}</div>
    <button @click="add(10)">add10</button>
    <button @click="add(5)">add5</button>
    <div class="clearfix">
      <div class="fl">123131</div>
      <div class="fr">asdadsa</div>
    </div>
    <div style="padding: 15px;">
      <x-icon type="ios-ionic-outline" size="30"></x-icon>
      <x-icon type="ios-arrow-back" size="30"></x-icon>
      <x-icon type="ios-arrow-forward" size="30"></x-icon>
      <x-icon type="ios-arrow-up" size="30"></x-icon>
      <x-icon type="ios-arrow-right" size="30"></x-icon>
      <x-icon type="ios-arrow-down" size="30"></x-icon>
      <x-icon type="ios-arrow-left" size="30"></x-icon>
      <x-icon type="ios-arrow-thin-up" size="30"></x-icon>
      <x-icon type="ios-arrow-thin-right" size="30"></x-icon>
      <x-icon type="ios-arrow-thin-down" size="30"></x-icon>
      <x-icon type="ios-arrow-thin-left" size="30"></x-icon>
      <x-icon type="ios-circle-filled" size="30"></x-icon>
      <x-icon type="ios-circle-outline" size="30"></x-icon>
      <x-icon type="ios-checkmark-empty" size="30"></x-icon>
      <x-icon type="ios-checkmark-outline" size="30"></x-icon>
      <x-icon type="ios-checkmark" size="30"></x-icon>
      <x-icon type="ios-plus-empty" size="30"></x-icon>
      <x-icon type="ios-plus-outline" size="30"></x-icon>
      <x-icon type="ios-plus" size="30"></x-icon>
      <x-icon type="ios-close-empty" size="30"></x-icon>
      <x-icon type="ios-close-outline" size="30"></x-icon>
      <x-icon type="ios-close" size="30"></x-icon>
      <x-icon type="ios-minus-empty" size="30"></x-icon>
      <x-icon type="ios-minus-outline" size="30"></x-icon>
      <x-icon type="ios-minus" size="30"></x-icon>
      <x-icon type="ios-information-empty" size="30"></x-icon>
      <x-icon type="ios-information-outline" size="30"></x-icon>
      <x-icon type="ios-information" size="30"></x-icon>
      <x-icon type="ios-help-empty" size="30"></x-icon>
      <x-icon type="ios-help-outline" size="30"></x-icon>
      <x-icon type="ios-help" size="30"></x-icon>
      <x-icon type="ios-search" size="30"></x-icon>
      <x-icon type="ios-search-strong" size="30"></x-icon>
      <x-icon type="ios-star" size="30"></x-icon>
      <x-icon type="ios-star-half" size="30"></x-icon>
      <x-icon type="ios-star-outline" size="30"></x-icon>
      <x-icon type="ios-heart" size="30"></x-icon>
      <x-icon type="ios-heart-outline" size="30"></x-icon>
    </div>
    <div>
      <icon type="success"></icon>
      <icon type="info"></icon>
      <icon type="info-circle"></icon>
      <icon type="warn"></icon>
      <icon type="waiting"></icon>
      <icon type="waiting-circle"></icon>
      <icon type="safe-success"></icon>
      <icon type="safe_warn"></icon>
      <icon type="success-circle"></icon>
      <icon type="success-no-circle"></icon>
      <icon type="circle"></icon>
      <icon type="download"></icon>
      <icon type="cancel"></icon>
      <icon type="search"></icon>
      <icon type="clear"></icon>
      <br>
      <icon type="success" is-msg></icon>
      <icon type="info" is-msg></icon>
      <icon type="warn" is-msg></icon>
      <icon type="waiting" is-msg></icon>
      <icon type="safe_success" is-msg></icon>
      <icon type="safe_warn" is-msg></icon>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { Group, Cell, Icon, Box } from "vux";
import store from "@/store";
import { setTimeout } from "timers";
export default {
  name: "HelloWorld",
  mounted() {
    // console.log(this.$store);
    // this.getAxios("/merchant/api/merchantAdvManage/findPicInfo", {
    //   merchantInfoId: 78
    // }).then(res => {
    //   console.log(res);
    // });
    // this.getAxios("/merchant/api/theater/merchantTheaterShowCalendar?showCode=201812010000002466&merchantInfoId=44&month=2018-12")
    // this.postAxios("/admin/getMenu",{id:22,name:"3333"})
    // this.getAxios("/admin/getMenu")
    // this.postAxios(
    //   "/merchant/webApi/merchantRenovationTob/selectRenovationPage",
    //   {
    //     page: 1,
    //     limit: 10,
    //     useFlag: "T"
    //   }
    // );
  },
  components: {
    Group,
    Cell,
    Icon,
    Box
  },
  computed: {
    ...mapState({
      count: state => {
        //   console.log(state)
        return state.count;
      },
      userCount: state => {
        return state.user.count;
      }
    })
  },
  data() {
    return {
      msg: "Welcome to Your Vue.js App"
    };
  },
  methods: {
    dispatchTest(){
      this.$store.dispatch('add',5)
    },
    showLoad() {
      this.$vux.loading.show({
        text: "Loading"
      });
      setTimeout(() => {
        this.$vux.loading.hide();
      }, 2000);
    },
    testAdd() {
      store.dispatch("addAction");
    },
    ...mapActions(["addAction"]),
    ...mapActions("user", ["add"]),
    addtest() {
      this.$store.dispatch("addAction");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}d
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.demo-test {
  width: 375px;
  height: 40px;
  font-size: 12px;
  border: 2px solid red;
}
</style>
