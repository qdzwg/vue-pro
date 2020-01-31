<template>
  <div
    :style="{background:pageData.backgroundColor,border:'1px solid ' + pageData.borderColor}"
    class="top-navigation-box"
  >
    <div class="top-navigation-block" v-if="show">
      <div class="top-navigation-left">
        <div v-if='pageData.left.type==="menu"'>
          <div>
            <svg class="icon svg-icon top-navigation-menu-icon" @click='menuShowC' aria-hidden="true">
              <use xlink:href="#iconmenu"></use>
            </svg>
          </div>
        </div>
        <div v-if='pageData.left.type==="picture"'>
          <div class="top-navigation-picture" @click='linkTo(pageData.left)'>
            <img :src="pageData.left.imgUrl" alt="">
            <div v-show="pageData.left.text">{{pageData.left.text}}</div>
          </div>
        </div>
      </div>
      <div class="top-navigation-center">
        <img :src="pageData.imgUrl" alt="">
      </div>
      <div class="top-navigation-right">
        <div v-if='pageData.right.type==="menu"'>
          <div>
            <svg class="icon svg-icon top-navigation-menu-icon" @click='menuShowC' aria-hidden="true">
              <use xlink:href="#iconmenu"></use>
            </svg>
          </div>
        </div>
        <div v-if='pageData.right.type==="picture"'>
          <div class="top-navigation-picture" @click='linkTo(pageData.right)'>
            <img :src="pageData.right.imgUrl" alt="">
            <div v-show="pageData.right.text">{{pageData.right.text}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="top-nav-menu-body" v-show="menuShow">
      <div class="top-nav-menu-wrap">
        <div class="top-nav-menu-block">
          <div class="top-nav-menu-item-wrap" style="background-color: #6db3c3;" :key="index" v-for="(item, index) in (pageData.left.type==='menu'?pageData.left.data:pageData.right.data)">
            <div class="top-nav-menu-item" :style="{background: item.select?'#f5cc58':''}">
              <div class="top-nav-menu-item-con" @click='selectItem(item)'>
                <img :src="item.log" alt="">
                <div>{{item.title}}</div>
              </div>
              <div class="top-nav-menu-item-btn" v-if="item.children&&item.children.length" @click='showItem(item)'>{{item.show?'-':'+'}}</div>
            </div>
            <template v-if="item.children&&item.children.length&&item.show">
              <div class="top-nav-menu-item-wrap" :key="index" v-for="(item1, index) in item.children">
                <div class="top-nav-menu-item" :style="{background: item1.select?'#f5cc58':''}">
                  <div class="top-nav-menu-item-con" style="padding-left: 45px;" @click='selectItem(item1)'>
                    <!-- <img :src="item1.log" alt=""> -->
                    <div>{{item1.title}}</div>
                  </div>
                  <div class="top-nav-menu-item-btn" v-if="item1.children&&item1.children.length" @click='showItem(item1)'>{{item1.show?'-':'+'}}</div>
                </div>
                <template v-if="item1.children&&item1.children.length&&item1.show">
                  <div class="top-nav-menu-item-wrap" :key="index" v-for="(item2, index) in item1.children">
                    <div class="top-nav-menu-item" :style="{background: item2.select?'#f5cc58':''}">
                      <div class="top-nav-menu-item-con" style="padding-left: 55px;" @click='selectItem(item2)'>
                        <!-- <img :src="item2.log" alt=""> -->
                        <div>{{item2.title}}</div>
                      </div>
                      <div class="top-nav-menu-item-btn" v-if="item2.children&&item2.children.length" @click='showItem(item2)'>{{item2.show?'-':'+'}}</div>
                    </div>
                    <template v-if="item2.children&&item2.children.length&&item2.show">
                      <div class="top-nav-menu-item-wrap" :key="index" v-for="(item3, index) in item2.children">
                        <div class="top-nav-menu-item" :style="{background: item3.select?'#f5cc58':''}">
                          <div class="top-nav-menu-item-con" style="padding-left: 65px;" @click='selectItem(item3)'>
                            <!-- <img :src="item3.log" alt=""> -->
                            <div>{{item3.title}}</div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                </template>
              </div>
            </template>
          </div>
          
        </div>
      </div>
      <div class="top-nav-menu-mask" @click='menuShowC'></div>
      <!-- <Menu theme="dark" style="width: 100%;">
        <template v-for="(item, index) in (pageData.left.type==='menu'?pageData.left.data:pageData.right.data)">
          <Submenu :name="item.title" :key="index" v-if="item.children&&item.children.length">
            <template slot="title">
              <i class="xx-icon icon-shengyin"></i>
              {{item.title}}
            </template>
            <template v-for="(item1, index1) in item.children">
              <Submenu :name="item1.title" :key="index1" v-if="item1.children&&item1.children.length">
                <template slot="title">
                  <i class="xx-icon icon-shengyin"></i>
                  {{item1.title}}
                </template>
                <template v-for="(item2, index2) in item1.children">
                  <Submenu :name="item2.title" :key="index2" v-if="item2.children&&item2.children.length">
                    <template slot="title">
                      <i class="xx-icon icon-shengyin"></i>
                      {{item2.title}}
                    </template>
                    <MenuItem v-for="(item3, index3) in item2.children" :name="item3.title" :key="index3">{{item3.title}}</MenuItem>
                  </Submenu>
                  <MenuItem :name="item2.title" :key="index2" v-else>{{item2.title}}</MenuItem>
                </template>
              </Submenu>
              <MenuItem :name="item1.title" :key="index1" v-else>{{item1.title}}</MenuItem>
            </template>
          </Submenu>
          <MenuItem :name="item.title" v-else :key="index">{{item.title}}</MenuItem>
        </template>
      </Menu> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pageData: {
      type: Object,
      default: {
        range: [],
        imgUrl: "",
        borderColor: "#dcdcdc",
        backgroundColor: "#ffffff",
        right: {
          type: "picture",
          text: '',
          imgUrl: '',
          customLinkObj: {},
          data: []
        },
        left: {
          type: "menu",
          text: '',
          text: '',
          customLinkObj: {},
          data: []
        }
      },
    }
  },
  data() {
    return {
      menuShow: false,
    };
  },
  computed: {
    show() {
      let path = this.$route.path;
      let range = this.pageData.range;
      if(path === '/'){
        return range.indexOf("homepage") > -1;
      }else if(path === '/custompage'){
        return range.indexOf("custompage") > -1;
      }else if(path === '/list/strategy'){
        return range.indexOf("strategyListPage") > -1;
      }else if(path === '/detail/strategy'){
        return range.indexOf("strategyDetaliPage") > -1;
      }
      return false;
    }
  },
  created() {
    
  },
  methods: {
    linkTo(item) {
      this.gotoTarget(item.customLinkObj);
    },
    addShow(item) {
      if(item.children&&item.children.length){
        item.children.map(ite=>{
          ite.select = false;
          this.addShow(ite)
        })
      }
    },
    selectItem(current) {
      if(this.pageData.left.type==="menu"){
        this.pageData.left.data.map(item=>{
          item.select = false;
          this.addShow(item);
        });
      }
      if(this.pageData.right.type==="menu"){
        this.pageData.right.data.map(item=>{
          item.select = false;
          this.addShow(item);
        });
      }
      if(current.customLinkObj){
        this.gotoTarget(current.customLinkObj)
      }
      current.select = true;
    },
    menuShowC() {
      this.menuShow = !this.menuShow;
    },
    showItem(item) {
      item.show = !item.show;
    }
  }
};
</script>
<style lang='scss'>
.top-navigation-box {
  border: 1px solid rgba(215, 215, 215, 1);
  .top-navigation-block {
    line-height: 0px;
    font-size: 10px;
    padding: 0px 10px;
    height: 44px;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: space-between;
    img {
      width: 28px;
      height: 28px;
    }
    .top-navigation-menu-icon {
      width: 28px;
      height: 28px;
    }
    .top-navigation-center {
      min-width: 120px;
      img {
        width: 120px;
        height: 39px;
      }
    }
    .top-navigation-picture {
      div {
        margin-top: 3px;
        white-space: nowrap;
        height: 10px;
        line-height: 10px;
      }
    }
  }
}
.top-nav-menu-body {
  position: fixed;
  top: 44px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: auto;
  .top-nav-menu-wrap {
    position: absolute;
    flex-grow: 1;
    left: 0px;
    right: 0px;
    .top-nav-menu-block {
      line-height: 50px;
      font-size: 14px;
      color: #fff;
      .top-nav-menu-item-wrap {
        background-color: #348395;
        .top-nav-menu-item {
          display: flex;
          align-items: center;
          height: 50px;
          .top-nav-menu-item-con {
            flex-grow: 1;
            padding-left: 10px;
            img {
              width: 20px;
              height: 20px;
              display: inline-block;
              vertical-align: middle;
              margin-right: 5px;
            }
            div {
              display: inline-block;
              vertical-align: middle;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }
          .top-nav-menu-item-btn {
            flex-shrink: 0;
            font-size: 24px;
            width: 50px;
            text-align: center;
          }
        }
        .top-nav-menu-item-select {
          background-color: #348395;
        }
      }
    }
  }
  .top-nav-menu-mask {
    height: 100%;
    flex-shrink: 1;
    background-color: rgba(0, 0, 0, 0.5);
  }
}
</style>
