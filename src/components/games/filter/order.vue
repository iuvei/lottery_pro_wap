<template>
  <div class="order-filter">
    <x-header :left-options="{backText: ''}">筛选</x-header>
    <div style="margin-top:44px">
      <group label-width="5em">
        <datetime title="开始时间" v-model="dateStart" @on-change="(time)=>handleTimeChange(time,'start')" :start-date="dateStartMin" :end-date="dateStartMax" format="YYYY-MM-DD" :max-year="2018" year-row="{value}年" month-row="{value}月" day-row="{value}日" hour-row="{value}点" minute-row="{value}分"></datetime>
        <datetime title="结束时间" v-model="dateEnd" @on-change="(time)=>handleTimeChange(time,'end')" :start-date="dateEndMin" :end-date="dateEndMax" format="YYYY-MM-DD" year-row="{value}年" month-row="{value}月" day-row="{value}日" hour-row="{value}点" minute-row="{value}分"></datetime>
      </group>
      <div class="mt10" style="background-color:white">
        <popup-picker :title="title1" confirm-text="确定" :data="lotteryNameList" v-model="lotteryName" @on-change="(name)=>onChange(name,'lotteryName')"></popup-picker>
        <popup-picker :title="title1" confirm-text="确定" :data="billingStatusList" v-model="billingStatus" @on-change="(name)=>onChange(name,'billingStatus')">
          <template slot="title" slot-scope="props">
            <span :class="props.labelClass" :style="props.labelStyle" style="height:24px;">
              <span style="vertical-align:middle;">结算状态</span>
            </span>
          </template>
        </popup-picker>
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
      dateStart: '',
      dateEnd: '',
      dateStartMin: '',
      dateStartMax: '',
      dateEndMin: '',
      dateEndMax: '',
      title1: '彩种名称',
      lotteryNameList: [[]],
      billingStatusList: [['全部', '未结算', '已中奖', '未中奖']],
      lotteryName: ['全部'],
      billingStatus: ['全部'],
      betParams: {}
    }
  },
  created() {
    this.initPage()
  },
  methods: {
    onChange(val, type) {
      if (type === 'lotteryName') {
        if (val[0] === '全部') {
          delete this.betParams.game_code
        } else {
          this.$store.state.game.gameInfo.map(item => {
            item.includes.map(item1 => {
              if (item1.name === val[0]) {
                this.betParams.game_code = item1.game_code
              }
            })
          })
        }
      }
      if (type === 'billingStatus') {
        if (val[0] === '全部') {
          this.betParams.type = '0'
        }
        if (val[0] === '未结算') {
          this.betParams.type = '1'
        }
        if (val[0] === '已中奖') {
          this.betParams.type = '2'
        }
        if (val[0] === '未中奖') {
          this.betParams.type = '3'
        }
      }
      console.log(val, type)
    },
    initPage() {
      this.$store.state.game.gameInfo.map(item => {
        this.lotteryNameList[0].push(...item.includes.map(item1 => item1.name))
      })
      this.lotteryNameList[0].unshift('全部')
      this.dateStartMax = dateFormat(new Date(), 'YYYY-MM-DD')
      this.dateEndMax = dateFormat(new Date(), 'YYYY-MM-DD')
    },
    handleTimeChange(time, type) {
      if (type === 'start') {
        this.betParams.date_start = time
        this.dateEndMin = time
      }
      if (type === 'end') {
        this.betParams.date_end = time
        this.dateStartMax = time
      }
    },
    query() {
      this.$router.replace({
        path: '/order/history',
        query: {
          ...this.$route.query,
          ...this.betParams
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
