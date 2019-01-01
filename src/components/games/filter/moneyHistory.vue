<template>
  <div class="order-filter">
    <x-header :left-options="{backText: ''}">
      筛选
      <div slot="right" class="date-toggle-box">
        <div>
          <span v-show="dateType===0" @click="handleDateTypeChange(1)">按月</span>
          <span v-show="dateType===1" @click="handleDateTypeChange(0)">按日</span>
        </div>
        <div>
          <div class="iconfont"></div>
        </div>
      </div>
    </x-header>
    <div style="margin-top:44px">
      <group label-width="5em" v-if="dateType===0">
        <datetime title="月份" v-model="monthDate" @on-change="(time)=>handleTimeMonthChange(time)" :end-date="dateEndMax" format="YYYY-MM"></datetime>
      </group>
      <group label-width="5em" v-else>
        <datetime title="开始时间" v-model="dateStart" @on-change="(time)=>handleTimeChange(time,'start')" :start-date="dateStartMin" :end-date="dateStartMax" format="YYYY-MM-DD"></datetime>
        <datetime title="结束时间" v-model="dateEnd" @on-change="(time)=>handleTimeChange(time,'end')" :start-date="dateEndMin" :end-date="dateEndMax" format="YYYY-MM-DD"></datetime>
      </group>
      <div class="mt10" style="background-color:white">
        <popup-picker title="状态" confirm-text="确定" :data="billingStatusList" v-model="lotteryStatus"></popup-picker>
      </div>
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
      monthDate: '',
      dateStart: '',
      dateEnd: '',
      dateStartMin: '',
      dateStartMax: '',
      dateEndMin: '',
      dateEndMax: '',
      lotteryStatus: ['全部'],
      billingStatusList: [['全部', '转账', '充值', '提现', '消费', '收益', '其他']],
      betParams: {},
      dateType: 0
    }
  },
  created() {
    this.initPage()
  },
  methods: {
    ...Vuex.mapActions(['GET_MONEY_HISTORY']),
    handleDateTypeChange(type) {
      this.betParams = {}
      this.dateType = type
    },
    initPage() {
      this.dateStartMax = dateFormat(new Date(), 'YYYY-MM-DD')
      this.dateEndMax = dateFormat(new Date(), 'YYYY-MM-DD')
    },
    handleTimeMonthChange(time) {
      this.betParams.month_date = time
    },
    handleTimeChange(time, type) {
      if (type === 'start') {
        this.betParams.start_date = time
        this.dateEndMin = time
      }
      if (type === 'end') {
        this.betParams.end_date = time
        this.dateStartMax = time
      }
    },
    query() {
      let result = this.billingStatusList[0].indexOf(this.lotteryStatus[0])
      this.$router.replace({
        path: '/money/history',
        query: {
          ...this.$route.query,
          ...this.betParams,
          status: result,
          mode: this.dateType
        }
      })
    }
  }
}
</script>


<style scoped>
.date-toggle-box {
  display: flex;
  align-items: center;
  color: white;
}
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


<style>
.order-filter .weui-cells,
.order-filter .weui-cell {
  font-size: 14px;
}
</style>

