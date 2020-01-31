/*
 * @Author: mikey.qiaoyang 
 * @Date: 2019-09-19 11:39:15 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-10-22 21:45:57
 */

// 添加地图的页面需用import防止报错 TypeError: v.w.uh is not a constructor
import home from '@/pages/traffic/home.vue';
import map from '@/pages/traffic/map.vue';

export default [{
    path: '/traffic_home',
    name: 'TrafficHome',
    // component: resolve => require(['@/views/visitor/home.vue'], resolve)
    component: home
  }, {
    path: '/traffic_route',
    name: 'TrafficRoute',
    component: r => require.ensure([], () => r(require('@/pages/traffic/route-list.vue')), 'TrafficRoute')
  }, {
    path: '/traffic_detail',
    name: 'TrafficDetail',
    component: r => require.ensure([], () => r(require('@/pages/traffic/route-detail.vue')), 'TrafficDetail')
  }, {
    path: '/traffic_schedule',
    name: 'TrafficSchedule',
    component: r => require.ensure([], () => r(require('@/pages/traffic/schedule.vue')), 'TrafficSchedule')
  }, {
    path: '/traffic_order',
    name: 'TrafficOrder',
    component: r => require.ensure([], () => r(require('@/pages/traffic/order.vue')), 'TrafficOrder')
  }, {
    path: '/traffic_success',
    name: 'TrafficSuccess',
    component: r => require.ensure([], () => r(require('@/pages/traffic/pay-result.vue')), 'TrafficSuccess')
  }, {
    path: '/traffic_qrcode',
    name: 'TrafficQrcode',
    component: r => require.ensure([], () => r(require('@/pages/traffic/qrcode.vue')), 'TrafficQrcode')
  },
  {
    path: '/traffic_map',
    name: 'TrafficMap',
    // component: resolve => require(['@/views/visitor/map.vue'], resolve)
    component: map
  }
]
