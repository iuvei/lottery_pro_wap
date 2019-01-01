<template>
  <div class="order-filter">
    <x-header :left-options="{backText: ''}">筛选</x-header>
    <div style="margin-top:44px">
      <group label-width="5em">
        <datetime title="开始时间" v-model="dateStart" @on-change="(time)=>handleTimeChange(time,'start')" :start-date="dateStartMin" :end-date="dateStartMax" format="YYYY-MM-DD" :max-year="2018" year-row="{value}年" month-row="{value}月" day-row="{value}日" hour-row="{value}点" minute-row="{value}分"></datetime>
        <datetime title="结束时间" v-model="dateEnd" @on-change="(time)=>handleTimeChange(time,'end')" :start-date="dateEndMin" :end-date="dateEndMax" format="YYYY-MM-DD" year-row="{value}年" month-row="{value}月" day-row="{value}日" hour-row="{value}点" minute-row="{value}分"></datetime>
      </group>
      <button class="btn-confirm" @click="query">查询</button>
    </div>
  </div>
</template>

<script>
import { Datetime, PopupPicker, Group, dateFormat } from 'vux'
export default {
  components: {
    PopupPicker,
    Group,
    Datetime
  },
  data() {
    return {
      dateStart: '',
      dateEnd: '',
      dateStartMin: '',
      dateStartMax: '',
      dateEndMin: '',
      dateEndMax: '',
      id: '',
      user: ''
    }
  },
  created() {
    this.id = this.$route.query.id
    this.user = this.$route.query.user
    this.initPage()
  },
  methods: {
    initPage() {
      this.dateStartMax = dateFormat(new Date(), 'YYYY-MM-DD')
      this.dateEndMax = dateFormat(new Date(), 'YYYY-MM-DD')
    },
    handleTimeChange(time, type) {
      if (type === 'start') {
        this.dateEndMin = time
      }
      if (type === 'end') {
        this.dateStartMax = time
      }
    },
    query() {
      this.$router.replace({
        path: '/user/agent/3/detail',
        query: {
          id: this.id,
          user: this.user,
          dateStart: this.dateStart,
          dateEnd: this.dateEnd
        }
      })
    }
  }
}
</script>

<style>
.order-filter .weui-cells,
.order-filter .weui-cell {
  font-size: 14px;
}
</style>


<style scoped>
.order-filter {
  overflow: hidden;
}
.btn-query {
  height: 40px;
  font-size: 18px;
  color: white;
  background-color: #f10215;
  border: none;
  width: 200px;
  border-radius: 40px;
  margin-top: 15px;
  margin-bottom: 20px;
}
</style>
