<template>
  <div>
    <Calendar
      :value="value"
      clean
      now
      range
      @select="select"
      ref="calendar"
    />
  </div>
</template>

<script>
import Calendar from 'mpvue-calendar'
import 'mpvue-calendar/src/browser-style.css'
// import arrowLeft from '../assets/arrowLeft.png' //使用自定义箭头图片

export default {
  data () {
    return {
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      disabledArray: ['2018-6-27','2018-6-25'],
      value: [],
      begin:[2016,1,1],
      end:[2020,1,1],
      events: {'2018-6-7':'今日备注', '2018-6-8':'一条很长的明日备注'},
      almanacs: {'9-3': '抗战胜利日', '11-17': '学生日'},
      tileContent: [
          {date: '2018-9-22', className: 'holiday ', content: '休'},
          {date: '2018-9-23', className: 'holiday ', content: '休'}
      ],
    
    }
  },
  components: {
    Calendar
  },
  methods: {
    prev(year, month, weekIndex) {
      console.log(year, month, weekIndex)
    },
    next(year, month, weekIndex) {
      console.log(year, month, weekIndex)
    },
    selectYear(year) {
      console.log(year)
    },
    selectMonth(month, year) {
      console.log(year, month)
    },
    setToday() {
      this.$refs.calendar.setToday()
    },
    dateInfo() {
      const info = this.$refs.calendar.dateInfo(2018, 8, 23)
      console.log(info);
    },
    renderer() {
      this.$refs.calendar.renderer(2018, 8); //渲染2018年8月份
    },
    select(val, val2) {
      console.log(val)
      console.log(val2)
    }
  }
}
</script>