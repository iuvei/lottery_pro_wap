<template>
  <div :class="{'hide-tab-box':['six','kl8','lucky28'].includes($store.state.game.currentGameInfo.type)}">
    <div class="lottery-history-detail-head" style="padding-bottom:44px">
      <x-header :left-options="{backText: ''}">
        {{lotteryName}}
        <a slot="right" @click="calendarShow=true" v-show="currentTabIndex===0" class="calendar-box">
          <i class=" iconfont icon-rili"></i>
          <div class="selector-box">
            <!-- <selector v-model="date" :options="dateList" @on-change="handleDateChange"></selector> -->
            <popup-picker :show.sync="calendarShow" :data="dateList" v-model="date" @on-change="handleDateChange"></popup-picker>
          </div>
        </a>
      </x-header>
    </div>
    <div>
      <!-- <div v-show="!['six','kl8','lucky28'].includes($store.state.game.currentGameInfo.type)">
        <div class="play-tab-list">
          <button-tab v-model="currentTabIndex">
            <button-tab-item @on-item-click="changePlayType">开奖号码</button-tab-item>
            <button-tab-item @on-item-click="changePlayType">开奖走势</button-tab-item>
          </button-tab>
        </div>
      </div> -->
      <div class="lottery-history-detail">
        <div v-if="currentTabIndex===0">
          <div class="sub-tab-box black-level1">
            <div class="lottery-history-header-intro">
              <div class="fs12">
                期号
              </div>
              <div class="fs14">
                {{detailData.includes&&detailData.includes[currentSubTabIndex].list[0].round}}
              </div>
            </div>
            <div>
              <ul class="sub-tab-list">
                <li v-for="(item,index) in subTabList" :class="{'sub-tab-selected':index===currentSubTabIndex}" @click="currentSubTabIndex=index">
                  {{item}}
                </li>
              </ul>
            </div>
          </div>
          <div class="infinite-scroll-container" :style="{'height':$window.innerHeight-106+'px'}">
            <pull-to @infinite-scroll="loadmore" :BOTTOM_DEFAULT_CONFIG="{triggerDistance:70}">
              <div>
                <ul class="lottery-history-list" v-for="item in detailData.includes&&detailData.includes[currentSubTabIndex].list">
                  <li>
                    <div class="black-level5 fs12">
                      <div>
                        {{item.round}}期
                      </div>
                      <div>
                        {{item.end_time*1000|formatTime('MM-DD HH:mm:ss')}}
                      </div>
                    </div>
                    <div>
                      <ul class="peroid-number-list" :class="detailData.type">
                        <li v-for="number in item.number.split(',')" :class="[`peroid-number-item-${number}`,setBgColor(detailData.type,number)]">
                          <div :class="number==='大'||number==='双'?'big-double':number==='小'||number==='单'?'small-single':''">
                            {{subTabList[currentSubTabIndex]==='号码'&&detailData.type==='k3'?'':number}}
                          </div>
                        </li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="pull-text">
                {{pullStatus|pullTextFilter}}
              </div>
            </pull-to>
          </div>
        </div>
        <div v-if="currentTabIndex===1" style="margin-top:46px">
          <TrendAnalysis :game_code="$route.params.game_code" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PullTo from 'vue-pull-to'

import TrendAnalysis from '../../../components/games/TrendAnalysis'
import { PopupPicker, dateFormat } from 'vux'
import { formatTime } from '../../../util/filters'
export default {
  components: {
    PullTo,
    TrendAnalysis,
    PopupPicker
  },
  data() {
    return {
      lotteryName: '',
      currentTabIndex: 0,
      currentSubTabIndex: 0,
      detailData: {},
      subTabList: [],
      currentPage: 1,
      rows: 20,
      total: 0,
      pullStatus: 0,
      date: [],
      dateList: [[]],
      calendarShow: false
    }
  },
  created() {
    this.initPage()
  },
  methods: {
    ...Vuex.mapActions(['GET_GAME_RESULT']),
    initPage() {
      this.getLotteryName()
      this.getLotteryData()
      this.initDate()
      if (!this.$route.query.type || this.$route.query.type === 'number') {
        this.currentTabIndex = 0
      }
      if (this.$route.query.type === 'trend') {
        this.currentTabIndex = 1
      }
    },
    getLotteryName() {
      this.$store.state.game.gameInfo.forEach(item => {
        item.includes.forEach(gameItem => {
          if (gameItem.game_code === this.$route.params.game_code) {
            this.lotteryName = gameItem.name
          }
        })
      })
    },
    getLotteryData() {
      // if(this.date[0]='今天')
      this.GET_GAME_RESULT({
        game_code: this.$route.params.game_code,
        type: 1,
        page: this.currentPage,
        rows: this.rows,
        date:
          this.date[0] === '今天'
            ? formatTime(new Date().getTime(), 'YYYY-MM-DD')
            : this.date[0]
      }).then(res => {
        res.data.includes.map(item => {
          if (this.detailData.includes) {
            item.list = [
              ...this.detailData.includes.find(
                item1 => item1.name === item.name
              ).list,
              ...item.list
            ]
          }
        })
        this.detailData = res.data
        console.log(this.detailData, 'detailData')
        this.subTabList = res.data.includes.map(item => item.name)
        this.total = res.data.total_rows
        if (!this.total) {
          this.pullStatus = 0
          return
        }
        if (this.rows * this.currentPage >= this.total) {
          this.pullStatus = 2
        } else {
          this.pullStatus = 1
        }
      })
    },
    changePlayType() {},
    loadmore() {
      // 判断是否已经加载完投注记录列表
      console.log(this.rows * this.currentPage, this.total)
      if (this.rows * this.currentPage < this.total) {
        this.currentPage += 1
        this.getLotteryData()
      }
    },
    setBgColor(type, number) {
      let bgClass = ''
      if (type === 'six') {
        if (
          [
            '1',
            '2',
            '7',
            '8',
            '12',
            '13',
            '18',
            '19',
            '23',
            '24',
            '29',
            '30',
            '34',
            '35',
            '40',
            '45',
            '46'
          ].includes(number)
        ) {
          bgClass = 'redNum'
        }
        if (
          [
            '3',
            '4',
            '9',
            '10',
            '14',
            '15',
            '20',
            '25',
            '26',
            '31',
            '36',
            '37',
            '41',
            '42',
            '47',
            '48'
          ].includes(number)
        ) {
          bgClass = 'blueNum'
        }
        if (
          [
            '5',
            '6',
            '11',
            '16',
            '17',
            '21',
            '22',
            '27',
            '28',
            '32',
            '33',
            '38',
            '39',
            '43',
            '44',
            '49'
          ].includes(number)
        ) {
          bgClass = 'greenNum'
        }
      }
      return bgClass
    },
    handleDateChange(val) {
      let date = ''
      if (val === '今天') {
        date = dateFormat(new Date(), 'YYYY-MM-DD')
      } else {
        date = val
      }
      // 重置当前page
      this.currentPage = 1
      this.date = date
      this.detailData = {}
      this.getLotteryData()
    },
    initDate(num) {
      // 生成最近一个星期的数据
      let filterDayNum = num || 7
      let oneDayTime = 24 * 60 * 60 * 1000
      let todayTimestamp = new Date().getTime()
      let result = []
      for (var i = 1; i < filterDayNum; i++) {
        let date = new Date(todayTimestamp - i * oneDayTime)
        result.push(dateFormat(new Date(date), 'YYYY-MM-DD'))
      }
      result.unshift('今天')
      this.dateList[0] = result
      console.log(this.dateList)
    }
  },
  filters: {
    pullTextFilter: function(status) {
      // status0 暂无数据 1 上拉加载更多 2 加载完成
      switch (status) {
        case 0:
          return '暂无数据'
        case 1:
          return '上拉加载更多...'
        case 2:
          return '加载完成'
        case 3:
          return ''
      }
    }
  }
}
</script>

<style scoped>
.play-tab-list {
  padding: 10px;
  background-color: white;
  position: fixed;
  width: calc(100% - 20px);
  top: 44px;
  z-index: 10;
}
.sub-tab-list {
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  font-size: 14px;
  margin-left: 15px;
  padding-top: 10px;
}

.sub-tab-list > li {
  width: calc(25% - 10px);
  border: solid 0.8px #e2e4ef;
  box-sizing: border-box;
  background-color: white;
  border-radius: 4px;
  padding: 2px 0;
  margin: 0 5px;
}

.sub-tab-list > li:first-child {
  margin-left: 0;
}

.sub-tab-list .sub-tab-selected {
  color: white;
  border: none;
}

.hide-tab-box .sub-tab-box {
  top: 44px;
}

.hide-tab-box .infinite-scroll-container {
  margin-top: 66px;
}

.sub-tab-box {
  display: flex;
  justify-content: space-between;
  background-color: white;
  margin: 10px 0;
  padding: 0 10px;
  padding-right: 5px;
  position: fixed;
  width: 100%;
  height: 45px;
  /* top: 100px; */
  top: 47px;
  z-index: 10;
  box-sizing: border-box;
}
.sub-tab-box > div:last-child {
  flex: 1;
}
.lottery-history-list {
  background-color: white;
}
.lottery-history-list > li {
  display: flex;
  align-items: center;
  padding: 10px;
  border-top: solid 0.5px #e2e4ef;
}
.scroll-container .lottery-history-list:first-child > li {
  border: none;
}
.lottery-history-list > li > div:last-child {
  flex: 1;
  margin-left: 15px;
}

.peroid-number-list {
  display: flex;
  flex-wrap: wrap;
}

.peroid-number-list > li {
  width: 10%;
  color: white;
  text-align: center;
  line-height: 22px;
  font-size: 14px;
  margin: 4px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Helvetica;
}

.peroid-number-list > li > div {
  width: 22px;
  height: 22px;
  border-radius: 22px;
  background-color: #f10215;
}

.pull-text {
  text-align: center;
  color: #333;
}

.infinite-scroll-container {
  margin-top: 65px;
}

.peroid-number-list .big-double {
  background-color: rgb(249, 152, 46);
}

.peroid-number-list .small-single {
  background-color: rgb(127, 138, 176);
}

.lottery-history-detail-head .iconfont {
  font-size: 24px;
}
.calendar-box {
  position: relative;
}
.calendar-box .selector-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}
.lottery-history-header-intro {
  color: #333;
  font-size: 14px;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
  width: 86px;
}
</style>
