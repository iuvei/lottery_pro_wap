<template>
  <div style="background-color:#f9fafe">
    <!-- 彩票大厅 -->
    <x-header :left-options="{showBack: false}">
      开奖记录
    </x-header>
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
        >{{item.name}}
        </tab-item>
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
                  v-for="item in currentLotteryList"
                  @click="goToHistoryDetail(item)"
                >
                  <div>
                    <img
                      :src="item.icon_3x"
                      class="lottery-icon"
                    />
                  </div>
                  <div>
                    <div class="lottery-list-top">
                      <div>
                        {{item.name}}
                      </div>
                      <div class="lottery-peroid">
                        <div class="dib">{{item.round}}期</div>
                      </div>
                    </div>
                    <div>
                      <ul
                        class="peroid-number-list"
                        :class="item.type"
                      >
                        <li
                          v-for="number in item.number.split(',')"
                          :class="[`peroid-number-item-${number}`,setBgColor(item,number)]"
                        >
                          <div>
                            {{item.type==='k3'?'':number}}
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div class="lottery-deadline">
                      <div>
                        距离{{item.next_round}}期截止还有
                      </div>
                      <div class="time-count">
                        {{item.countdown ? transformTime(item.countdown) : '封盘'}}
                      </div>
                    </div>
                  </div>
                  <div>
                    <img
                      src="../../../../static/images/icon/arrow-right-icon@3x.png"
                      alt=""
                    >
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </swiper-item>
      </swiper>
    </div>
    <FooterNav/>
  </div>
</template>

<script>
  import { Tab, TabItem, Swiper, SwiperItem } from 'vux'
  import FooterNav from '../../../components/global/footerNav'

  import { transformSecondsToTime } from '../../../util/index'

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
        currentLotteryList: [],
        lotteryAll: [],
        activeTab: 0,
        hasLoadedLotteryData: false,
        timeoutTimer: null,
        intervalTimer: null
      }
    },
    created() {
      this.initPage()
    },
    destroyed() {
      clearInterval(this.intervalTimer)
      clearInterval(this.timeoutTimer)
      this.intervalTimer = null
      this.timeoutTimer = null
    },
    methods: {
      ...Vuex.mapActions(['GET_GAME_LIST']),
      initPage() {
        this.getLotteryData()
      },
      goToHistoryDetail(item) {
        this.$router.push({
          path: `/lotteryHistory/${item.game_code}`
        })
      },
      getLotteryData() {
        this.GET_GAME_LIST({ type: 1 }).then(res => {
          this.hasLoadedLotteryData = true
          this.gameInfo = res.data.lottery
          this.lotteryAll = res.data.all
          if (!this.tabList.length) {
            this.tabList.unshift({
              type: 'all',
              name: '全部彩种'
            })
            this.getTabList()
          }
          // 倒计时
          this.countDown()
          this.updateDate()
        })
      },
      updateDate() {
        this.intervalTimer = setInterval(() => {
          clearTimeout(this.timeoutTimer)
          this.timeoutTimer = null
          this.GET_GAME_LIST({ type: 1 }).then(res => {
            this.lotteryAll = res.data.all
            this.filterGameList(this.tabList[this.activeTab].type)
            // 倒计时
            this.countDown()
          })
        }, 5000)
      },
      handleSwiperChange(index) {
        let type = this.tabList[index].type
        this.filterGameList(type)
      },
      setSwiperHeight() {
        let height = window.innerHeight - 100
        let swiperHeight
        swiperHeight = height + 'px'
        return swiperHeight
      },
      customizeTabBarWidth(item) {
        return '20px'
      },
      goToGame(item) {
        this.$router.push({
          path: `/game/${item.code}`
        })
      },
      handleTabChange(item) {
        this.filterGameList(item.type)
      },
      filterGameList(type) {
        if (type === 'all') {
          this.currentLotteryList = this.lotteryAll
        } else {
          this.currentLotteryList = this.lotteryAll.filter(item => {
            return item.type === type
          })
        }
      },
      getTabList() {
        this.gameInfo.forEach(item => {
          this.tabList.push({
            type: item.type,
            name: item.name
          })
        })
        this.filterGameList('all')
      },
      transformTime(seconds) {
        return transformSecondsToTime(seconds || 0)
      },
      countDown() {
        let { lotteryAll } = this
        let list = []
        list = lotteryAll.map(item => {
          item.countdown -= 1
          // 重新请求接口
          if (item.countdown <= 0) {
            item.countdown = 0
          }
          return item
        })
        this.lotteryAll = list
        this.timeoutTimer = setTimeout(() => {
          this.countDown()
        }, 1000)
      },
      setBgColor(item, number) {
        let bgClass = ''
        if (item.type === 'six') {
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
      }
    }
  }
</script>

<style lang="less" scoped>
  .tab-box {
    position: fixed;
    top: 45px;
    left: 0;
    width: 100%;
    z-index: 10;
  }

  .lottery-list {
    background-color: white;
    margin: 10px;
    border-radius: 5px;
  }

  .lottery-list > li {
    display: flex;
    padding: 10px;
  }

  .lottery-list > li:not(:last-child) {
    border-bottom: 0.5px solid #e2e4ef;
  }

  .lottery-list > li > div:first-child,
  .lottery-list > li > div:last-child {
    display: flex;
    align-items: center;
  }

  .lottery-list > li > div:last-child img {
    zoom: 0.4;
  }

  .lottery-list > li > div:nth-child(2) {
    flex: 1;
    padding: 10px 5px 10px 10px;
  }

  .peroid-number-list {
    display: flex;
    flex-wrap: wrap;
    margin: 2px 0;
  }

  .peroid-number-list > li {
    width: 10%;
    color: white;
    text-align: center;
    line-height: 22px;
    font-size: 14px;
    margin: 2px 0px;
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

  .lottery-icon {
    width: 51px;
    height: 51px;
  }

  .lottery-list-top {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
  }

  .lottery-deadline {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #666;
    align-items: center;
  }

  .time-count {
    color: #2d7eea;
  }

  .lottery-peroid {
    color: #fc3c4c;
    font-size: 12px;
  }
</style>
