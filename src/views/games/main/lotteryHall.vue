<template>
  <div style="background-color:#f9fafe">
    <!-- 彩票大厅 -->
    <x-header :left-options="{showBack: false}">购彩大厅</x-header>
    <div class="tab-box">
      <tab
        custom-bar-width="30px"
        v-model="activeTab"
        v-if="hasLoadedLotteryData"
      >
        <tab-item
          v-for="item in tabList"
          :key="item.type"
          @on-item-click="handleTabChange(item)"
          :selected="item.name==='全部彩种'"
        >{{item.name}}</tab-item>
      </tab>
    </div>
    <div style="height:88px"></div>
    <div class="swiper-container">
      <swiper
        v-model="activeTab"
        :height="setSwiperHeight()"
        :show-dots="false"
        @on-index-change="handleSwiperChange"
      >
        <swiper-item
          v-for="(item, index) in tabList"
          :key="index"
        >
          <div class="tab-swiper vux-center">
            <div class="lottery-hall-main">
              <ul class="lottery-list">
                <li
                  v-for="item in gameInfo"
                  @click="goToGame(item)"
                >
                  <div class="lottery-icon-wrapper">
                    <img
                      v-if="item.icon_3x"
                      :src="item.icon_3x"
                      alt=""
                    >
                  </div>
                  <div class="lottery-name">{{item.name}}</div>
                  <div class="countdown-intro">截止投注</div>
                  <div class="countdown-time">{{item.countdown ? transformTime(item.countdown) : '封盘'}}</div>
                </li>
              </ul>
            </div>
          </div>
        </swiper-item>
      </swiper>
    </div>

    <FooterNav />
  </div>
</template>

<script>
import { Tab, TabItem, Swiper, SwiperItem } from 'vux'

import FooterNav from '../../../components/global/footerNav'
import { transformSecondsToTime } from '../../../util/index'
import { setTimeout, clearTimeout } from 'timers'
export default {
  components: {
    FooterNav,
    Tab,
    TabItem,
    Swiper,
    SwiperItem
  },
  data() {
    return {
      gameInfo: [],
      tabList: [],
      activeTab: 0,
      lotteryData: [],
      gameAll: '',
      hasLoadedLotteryData: false,
      countDownTimer: null,
      requestStartTime: '',
      loopTime: 3000,
      getGameListTimer: null,
      timeoutTimer: null,
      intervalTimer: null
    }
  },
  created() {
    this.getGameList('all')
  },
  destroyed() {
    clearInterval(this.intervalTimer)
    clearInterval(this.timeoutTimer)
    this.intervalTimer = null
    this.timeoutTimer = null
  },
  methods: {
    ...Vuex.mapActions(['GET_GAME_LIST']),
    getGameList(type) {
      this.requestStartTime = new Date().getTime()
      this.GET_GAME_LIST().then(res => {
        this.lotteryData = res.data.lottery
        this.gameAll = res.data.all
        this.hasLoadedLotteryData = true
        this.getTabList()
        this.filterGameList(type)
        // 倒计时
        this.countDown()
        this.updateDate()
      })
    },
    transformTime(seconds) {
      return transformSecondsToTime(seconds || 0)
    },
    updateDate() {
      this.intervalTimer = setInterval(() => {
        clearTimeout(this.timeoutTimer)
        this.timeoutTimer = null
        this.GET_GAME_LIST({ type: 1 }).then(res => {
          this.gameAll = res.data.all
          this.filterGameList(this.tabList[this.activeTab].type)
          // 倒计时
          this.countDown()
        })
      }, 10000)
    },
    countDown() {
      let { gameAll } = this
      gameAll.forEach(item => {
        item.countdown -= 1
        // 重新请求接口
        if (item.countdown <= 0) {
          item.countdown = 0
        }
        return item
      })
      this.timeoutTimer = setTimeout(() => {
        this.countDown()
      }, 1000)
    },
    // countDown() {
    //   let { gameInfo } = this
    //   let shouldRequest
    //   gameInfo.map(item => {
    //     // 重新请求接口
    //     if (item.countdown <= 0) {
    //       // clearTimeout(this.countDownTimer)
    //       // this.getGameList(this.tabList[this.activeTab].type)
    //       shouldRequest = true
    //     } else {
    //       item.countdown -= 1
    //     }
    //     return item
    //   })
    //   if (shouldRequest) {
    //     // 开奖接口返回数据异常的时候(countdown始终为负数或者等于0的时候)
    //     // 同时需要满足下一次请求上一次请求间隔时间需要n秒
    //     let interval = new Date().getTime() - this.requestStartTime
    //     console.log(this.loopTime - interval)
    //     this.getGameListTimer = setTimeout(() => {
    //       this.getGameList(this.tabList[this.activeTab].type)
    //     }, this.loopTime - interval)
    //   }
    //   clearTimeout(this.countDownTimer)
    //   /*  this.countDownTimer = setTimeout(() => {
    //     this.countDown()
    //   }, 1000) */
    // },
    handleSwiperChange(index) {
      this.filterGameList(this.tabList[index].type)
    },
    setSwiperHeight() {
      let height = window.innerHeight - 147
      let swiperHeight
      swiperHeight = height + 'px'
      return swiperHeight
    },
    customizeTabBarWidth(item) {
      return '20px'
    },
    goToGame(item) {
      this.$store.commit('setPlayTabStatus', item.position)
      this.$router.push({
        path: `/game/${item.game_code}`
      })
    },
    handleTabChange(item) {
      this.filterGameList(item.type)
    },
    filterGameList(type) {
      if (type === 'all') {
        this.gameInfo = this.gameAll
      } else {
        this.gameInfo = this.gameAll.filter(item => {
          return item.type === type
        })
      }
    },
    getTabList() {
      let gameInfo = this.lotteryData
      this.tabList = []
      this.tabList = gameInfo.map(item => {
        return {
          type: item.type,
          name: item.name
        }
      })
      this.tabList.unshift({
        type: 'all',
        name: '全部彩种'
      })
    }
  }
  // destroyed() {
  //   clearTimeout(this.getGameListTimer)
  // }
}
</script>

<style scoped>
.tab-box {
  position: fixed;
  top: 45px;
  left: 0;
  width: 100%;
  z-index: 10;
}
.tab-swiper {
  padding: 10px;
  min-height: calc(100vh - 120px);
  background-color: white;
  background-clip: content-box;
  border-radius: 7px;
  overflow: hidden;
}
.lottery-list {
  display: flex;
  flex-wrap: wrap;
  padding-top: 15px;
  border-radius: 7px;
  flex: 1;
}
.lottery-list > li {
  width: 33.3%;
  margin-bottom: 14px;
}
.lottery-list > li > div {
  display: flex;
  justify-content: center;
}
.lottery-list > li img {
  width: 51px;
  height: 51px;
}
.countdown-intro {
  color: #c5c7d6;
  font-size: 12px;
}
.countdown-time {
  color: #2d7eea;
  font-size: 12px;
}
.lottery-name {
  font-size: 13px;
  margin-top: 5px;
}
.lottery-hall-main {
  display: flex;
  margin: 0 -5%;
}
.swiper-container .vux-swiper-item {
  overflow-y: auto;
}
.lottery-icon-wrapper {
  width: 50px;
  height: 50px;
  background-color: #c5c7d6;
  border-radius: 50px;
  margin: auto;
}
</style>
