<template>
  <div class="schedule-conts">
    <ul v-if="busSchedule.length > 0">
      <li class="title-list">
        <span class="schedule-no">站序</span>
        <span class="schedule-name">车名</span>
        <span class="title">到达时间</span>
        <span class="title">出发时间</span>
        <span class="title">历时</span>
      </li>
      <li v-for="v in busSchedule" :key="v.id" class="schedule-list vux-1px-b">
        <span class="schedule-no">{{v.siteSerial >= 9 ? v.siteSerial : "0" + v.siteSerial}}</span>
        <span class="schedule-name">{{v.siteAliasName || '---'}}</span>
        <span class="schedule-item">{{v.arriveEndTime || '---'}}</span>
        <span class="schedule-item">{{v.arriveBeginTime || '---'}}</span>
        <span class="schedule-item">{{v.betweenTime || '---'}}</span>
      </li>
    </ul>
    <span v-else>暂无该班次的时刻信息</span>
  </div>
</template>
<script>
export default {
  data() {
    return {
      busSchedule: []
    };
  },
  methods: {
    // 获取时刻表
    getSchedule() {
      this.getAxios("/merchant/api/traffic/getSchedules", {
        routeCode: this.$route.query.routeCode,
        trainCode: this.$route.query.trainId || 0
      }).then(res => {
        this.busSchedule = res.data && res.data.length ? res.data : [];
      });
    }
  },
  created() {
    this.getSchedule();
  }
};
</script>
<style lang='scss' scoped>
.schedule-conts {
  background-color: #f7f7f7;
  min-height: 100vh;
  .schedule-no {
    width: 40px;
  }
  .schedule-name {
    width: 130px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    padding-right: 8px;
  }
}
.schedule-list {
  padding: 0 15px;
  background-color: #fff;
  // border-bottom: 1px solid #dedede;
  display: flex;
  line-height: 45px;
  font-size: 13px;
  &:last-child {
    &:after{
      border: 0;
    }
  }
  .schedule-item {
    flex: 1;
  }
}
.title-list {
  display: flex;
  margin-bottom: 5px;
  background-color: #fff;
  padding: 10px 15px;
  font-size: 12px;
  color: #999;
  .title {
    flex: 1;
  }
}
</style>