<template>
  <div class="amap-page-container">
    <el-amap ref="map" vid="amapDemo" :zoom="zoom" :center="center" class="amap-demo">
      <el-amap-marker
        v-for="(marker, index) in markers"
        :key="index"
        :position="marker.position"
        :events="marker.events"
        :vid="index"
        :label="marker.label"
        ref="marker"
      ></el-amap-marker>
    </el-amap>
  </div>
</template>
<script>
module.exports = {
  name: "amap-page",
  data() {
    let self = this;
    return {
      lng: this.$route.query.lng,
      lat: this.$route.query.lat,
      count: 1,
      zoom: 14,
      zoomEnable: true,
      dragEnable: true,
      scrollWheel: true,
      touchZoom: true,
      center: [121.5273285, 31.21515044],
      markers: [
        {
          position: [121.5273285, 31.21515044],
          events: {
            click: e => {
              // alert("click marker");
              // console.log(e);
              // console.log(self.$refs.marker);
              let _ref = self.$refs.marker[0]
              let marker = _ref.$$getInstance();
              // 唤起APP
              marker.markOnAMAP({
                name: self.$route.query.sitename,
                position: _ref.$$getPosition()
              });
              // 跳转到高德地图页面
              // location.href = `https://uri.amap.com/marker?position=${e.lnglat.lng},${e.lnglat.lat}&name=${this.$route.query.sitename}`
            }
          }
        }
      ]
    };
  },
  created() {
    document.title = this.$route.query.sitename;
    this.lng = parseFloat(this.$route.query.lng);
    this.lat = parseFloat(this.$route.query.lat);
    this.center = [this.lng, this.lat];
    this.markers[0].position = [this.lng, this.lat];
    this.markers[0].label = {
      content: "站点：" + this.$route.query.sitename,
      offset: [20, -20]
    };
  }
};
</script>
<style>
.amap-demo {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}
.amap-marker-label {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>