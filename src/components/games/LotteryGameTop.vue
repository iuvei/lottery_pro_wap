<template>
  <div>
    <div>
      <div :style="{height:openHeight}"></div>
      <div class="lottery-game-top">
        <div
          class="lottery-area-top"
          :class="{'top-area-oneline':openListShow===undefined}"
        >
          <div>
            <div class="lottery-name">
              {{lotteryName}}
            </div>
            <div class="fs14">
              <span class="black-level5">
                余额:
              </span>
              <span class="red-color helvetica fw500">
                {{$store.getters.balance||'0.00'}}
              </span>
            </div>
          </div>
          <div v-show="showCloseBox == 1">
            <div class="black-level5 tr fs14">
              距第<span class="fw500">{{lotteryAreaData.periodNumber}}</span>期
            </div>
            <div>
              <span class="theme-color countdown-box helvetica fw500">{{openTime}}</span>
            </div>
          </div>
          <div v-show="showCloseBox == 0">
            <div class="black-level5 tr fs14">
              封盘中
            </div>
            <div>
              <span class="theme-color countdown-box helvetica fw500">{{openTime}}</span>
            </div>
          </div>
        </div>
        <div
          class="lottery-area-open-list"
          @click="toggleLotteryList"
          v-show="openListShow"
        >
          <div>
            <div class="peroid-number black-level5 fs12">
              第{{lotteryAreaData.openedLotteryList&&lotteryAreaData.openedLotteryList[0].round.slice(-3)}}期
            </div>
            <div>
              <ul
                class="peroid-number-list"
                :class="$store.state.game.currentGameInfo.type"
              >
                <li
                  v-for="number in lotteryAreaData.openedLotteryList&&lotteryAreaData.openedLotteryList[0].number.split(',')"
                  :class="[`peroid-number-item-${number}`,setBgColor($store.state.game.currentGameInfo.type,number)]"
                >
                  <div>
                    {{$store.state.game.currentGameInfo.type==='k3'?'':number}}
                  </div>
                </li>
              </ul>
            </div>
            <div class="icon-dropdown">
              <i
                class="iconfont icon-htmal5icon03 "
                :class="{'rotate180':recentLotteryShow}"
              ></i>
            </div>
          </div>
        </div>
      </div>

      <transition name="slide">
        <div
          class="lottery-area-open-list-box"
          v-show="recentLotteryShow&&openListShow"
        >
          <div
            v-for="(item,index) in lotteryAreaData.openedLotteryList&&lotteryAreaData.openedLotteryList.slice(0,lotteryAreaData.openedLotteryList.length)"
            class="lottery-area-open-list"
          >
            <div style="padding-right:33px">
              <div class="peroid-number black-level5 fs12">
                第{{item.round.slice(-3)}}期
              </div>
              <div>
                <ul
                  class="peroid-number-list"
                  :class="$store.state.game.currentGameInfo.type"
                >
                  <li
                    v-for="number in item.number.split(',')"
                    :class="[`peroid-number-item-${number}`,setBgColor($store.state.game.currentGameInfo.type,number)]"
                  >
                    <div>
                      {{$store.state.game.currentGameInfo.type==='k3'?'':number}}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="btn-more-container">
            <div
              class="btn-more"
              @click="moreHistory()"
            >查看更多
            </div>
          </div>
        </div>
      </transition>

    </div>
    <!-- 清空投注弹窗 -->
    <div class="order-clear-confirm">
      <confirm
        v-model="confirmShow"
        @on-confirm="onConfirm"
        :cancel-text="cancelText"
        @on-hide="handleConfirmHide"
      >
        <div
          class="close-btn"
          @on-cancel="$emit('cancel')"
        ></div>
        <h3>温馨提示</h3>
        <p style="text-align:center;">{{`当前${lotteryAreaData.periodNumber}期已经结束,是否清除投注内容进入下一期?`}}</p>
      </confirm>
    </div>
    <div
      v-show="showCloseBox == 0"
      class="closeLottery-box"
      :style="`height: calc(100% - 44px);top: calc(44px)`"
    >
      <div class="closeTime">{{openTime}}</div>
      <div class="close-text">封盘中</div>
      <div class="text">彩票玩不了？</div>
      <div
        class="other-game"
        @click="otherGame()"
      >{{`试试 ${game_name} >`}}</div>
    </div>
  </div>
</template>

<script>
/* 秒转时间 */
import { transformSecondsToTime } from '../../util/index'

export default {
  props: ['openListShow'],
  data() {
    return {
      lotteryAreaData: {},
      recentLotteryShow: false,
      countDownTimer: null,
      openTime: '',
      confirmShow: false,
      round: 0,
      cancelText: '取消',
      cancelSeconds: 5,
      confirmTimer: null,
      fetchGameTimer: null,
      openHeight: '0px',
      lotteryName: '',
      closeLotteryHeight: '',
      showCloseBox: 1,
      lotteryData: [],
      game_id: '',
      game_code: '',
      game_name: ''
    }
  },
  created() {
    /* 获取开奖结果 */
    this.getGameResult()
    // 设置彩种名称
    this.getLotteryName()
    // 登录之后获取余额
    this.$store.getters.token && this.GET_MEMBER_INFO({ item: 'balance' })
    // 獲取隨機遊戲
    this.getRandomGame()
  },
  methods: {
    ...Vuex.mapActions(['GET_GAME_RESULT', 'GET_MEMBER_INFO', 'GET_ALL_GAMES']),
    getLotteryName() {
      let lotteryName
      let _this = this
      // 彩种名称
      this.$store.state.game.gameInfo &&
        this.$store.state.game.gameInfo.forEach(item => {
          item.includes.forEach(gameItem => {
            if (gameItem.game_code === this.$route.params.game_code) {
              lotteryName = gameItem.name
              _this.lotteryName = lotteryName
            }
          })
        })
    },
    toggleLotteryList() {
      this.recentLotteryShow = !this.recentLotteryShow
      window.scrollTo(0, 0)
    },
    getGameResult() {
      this.GET_GAME_RESULT({
        game_code: this.$route.params.game_code
      }).then(res => {
        this.showCloseBox = res.data.is_open
        // 设置高度撑开fixed定位的层
        setTimeout(() => {
          let height =
            window &&
            window.getComputedStyle(
              document.querySelector('.lottery-game-top'),
              null
            ) &&
            window.getComputedStyle(
              document.querySelector('.lottery-game-top'),
              null
            ).height
          this.openHeight = height
        }, 100)
        if (!res.data.next) {
          return
        }
        console.log(res.data)
        this.$store.commit('setGameResult', res.data)
        // 下一期
        this.round = res.data.next.round
        this.lotteryAreaData.periodNumber = res.data.next.round.slice(-3)

        // 更新确认投注单数据里的期数
        this.updateOrderList()
        // 如果没有获取到当前最新的开奖号码，需要重新获取接口
        if (res.data.next.round - res.data.last.round !== 1) {
          clearTimeout(this.fetchGameTimer)
          this.fetchGameTimer = setTimeout(() => {
            this.getGameResult()
          }, 3000)
        } else {
        }
        if (
          this.$store.state.game.currentGameInfo.round !== res.data.next.round
        ) {
          // 设置当前游戏的信息
          this.$store.commit('setCurrentGameInfo', {
            ...this.$store.state.game.currentGameInfo,
            round: res.data.next.round
          })
        }
        // 倒计时
        this.lotteryAreaData.countDown =
          res.data.next.close_time - res.data.next.current_time

        // 倒计时转换为时间
        this.openTime = transformSecondsToTime(
          this.lotteryAreaData.countDown || 0
        )
        // 最近5期开奖结果
        this.lotteryAreaData.openedLotteryList = res.data.history
        // 重新倒计时
        clearInterval(this.countDownTimer)
        this.countDown()
      })
    },
    updateOrderList() {
      // 更新localStorage存放的期数
      let orderData = JSON.parse(localStorage.getItem('tplBetOrder')) || {
        list: []
      }
      if (orderData.list) {
        orderData.list = orderData.list.map(item => {
          item.round = this.round
          return item
        })
      }
      orderData.round = this.round
      localStorage.setItem('tplBetOrder', JSON.stringify(orderData))
    },
    countDown() {
      this.countDownTimer = setInterval(() => {
        if (this.lotteryAreaData.countDown >= 1) {
          this.lotteryAreaData.countDown -= 1
        }
        this.openTime = transformSecondsToTime(
          this.lotteryAreaData.countDown || 0
        )
        // console.log(this.lotteryAreaData.countDown)
        if (this.lotteryAreaData.countDown === 0) {
          // 弹窗倒计时
          this.setCancelText()
          // 显示清空弹窗
          this.confirmShow = true
          // 清空倒计时
          clearInterval(this.countDownTimer)
          // 重新请求开奖数据,直到开出奖
          this.getGameResult()
        }
      }, 1000)
    },
    onConfirm() {
      this.$eventBus.$emit('clearSelectedBet')
    },
    setCancelText() {
      if (this.cancelSeconds !== 0) {
        this.cancelSeconds -= 1
        this.confirmTimer = setTimeout(() => {
          this.setCancelText()
        }, 1000)
      } else {
        this.confirmShow = false
      }
      this.cancelText = `取消(${this.cancelSeconds + 1}秒)`
    },
    handleConfirmHide() {
      this.cancelSeconds = 5
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
    moreHistory() {
      console.log(this.$route.params.game_code)
      this.$router.push({
        path: `/lotteryHistory/${this.$route.params.game_code}`
      })
    },
    getRandomGame() {
      this.GET_ALL_GAMES().then(res => {
        // console.log(res.data.games)
        this.lotteryData = res.data.games
        if (this.lotteryData.official.includes.length) {
          this.game_id = Math.ceil(
            Math.random() * (this.lotteryData.official.includes.length - 1)
          )
          if (this.game_id == 10) {
            this.game_id = Math.ceil(
              Math.random() * (this.lotteryData.official.includes.length - 1)
            )
          }
          this.lotteryData.official.includes.forEach(item => {
            if (item.game_id == this.game_id) {
              this.game_code = item.game_code
              this.game_name = item.name
            }
          })
        }
      })
    },
    otherGame() {
      this.$router.replace({
        path: '/game/' + this.game_code
      })
    }
  },
  destroyed() {
    clearInterval(this.countDownTimer)
    clearTimeout(this.confirmTimer)
    clearTimeout(this.fetchGameTimer)
  }
}
</script>

<style scoped>
.order-clear-confirm h3 {
  font-size: 24px;
  color: #252525;
  margin-bottom: 27px;
}
.order-clear-confirm p {
  font-size: 19px;
  color: #555;
  line-height: 28px;
}
.order-clear-confirm .close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 20px;
  height: 20px;
  background: url('/static/images/icon/close-icon.png') no-repeat center center;
  background-size: contain;
}
.closeLottery-box {
  position: fixed;
  left: 0;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.7);
}

.closeLottery-box .closeTime {
  line-height: 1.2;
  margin-bottom: 5px;
  font-size: 27px;
  font-weight: bold;
  color: #ffffff;
}

.closeLottery-box .close-text {
  line-height: 1.2;
  margin-bottom: 10px;
  font-size: 15px;
  font-weight: bold;
  color: #ffffff;
}

.closeLottery-box .text {
  line-height: 1.2;
  margin-bottom: 5px;
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
}

.closeLottery-box .other-game {
  line-height: 1.2;
  font-size: 15px;
  font-weight: bold;
  color: #ff4141;
}

.rotate180 {
  transform: rotate(180deg);
}

.lottery-game-top {
  z-index: 10;
  border-bottom: solid 0.5px #e2e4ef;
  margin-top: 1px;
  position: fixed;
  width: 100%;
  top: 43px;
}

.icon-dropdown {
  border: solid 0.5px #e2e4ef;
}

.icon-dropdown > i {
  color: #797d8a;
  display: block;
  transition: all ease-in 0.2s;
  margin-top: 2px;
}

.icon-dropdown > i.rotate180 {
  margin-top: 0;
}

.lottery-area-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 10px;
  background-color: white;
}

.lottery-area-top.top-area-oneline {
  padding: 3px 10px;
}

.lottery-area-top * {
  white-space: nowrap;
}

.lottery-area-top > div {
  display: flex;
  align-items: center;
}

.lottery-area-top > div > div:first-child {
  margin-right: 5px;
}

.lottery-name {
  font-size: 17px;
  font-weight: bold;
  color: #333;
}

.countdown-box {
  width: 70px;
  text-align: center;
  display: inline-block;
  font-weight: bold;
  font-size: 17px;
  text-align: right;
}

.lottery-area-open-list {
  background-color: white;
}

.lottery-area-open-list > div {
  display: flex;
  padding: 3px 10px;
  box-sizing: border-box;
  align-items: center;
}

.lottery-area-open-list > div:not(:first-child) {
  padding-right: 32px;
}

.lottery-area-open-list-box {
  position: relative;
  z-index: 5;
}

.lottery-area-open-list-box > div:nth-child(2n-1) {
  background-color: #f9fafe;
}

.lottery-area-open-list .icon-dropdown {
  border: solid 0.5px #e2e4ef;
}

.lottery-area-open-list .icon-dropdown {
  width: 22px;
  height: 22px;
  text-align: center;
  line-height: 20px;
  border-radius: 22px;
}

.lottery-area-open-list .peroid-number {
  text-align: center;
  line-height: 20px;
}

.peroid-number + div {
  flex: 1;
}

.peroid-number-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-left: 3px;
  font-family: Helvetica;
}

.peroid-number-list > li {
  width: 10%;
  color: white;
  text-align: center;
  line-height: 22px;
  font-size: 14px;
  margin: 7px 0;
  display: flex;
  justify-content: center;
}

.peroid-number-list > li > div {
  width: 22px;
  height: 22px;
  border-radius: 22px;
}

.peroid-number-list.kl8 {
  margin: 2px 0;
}

.peroid-number-list.kl8 > li {
  margin: 3px 0;
}

.btn-more-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  padding: 6px 0;
	line-height: 20px;
	background: #fff;
}

.btn-more {
  background-color: transparent;
  border-radius: 40px;
  padding: 3px 14px;
  font-size: 12px;
}

@media (max-width: 320px) {
  .lottery-name,
  .countdown-box {
    font-size: 15px;
  }

  .fs14 {
    font-size: 12px;
  }

  /*  .peroid-number-list.kl8 > li {
      margin: 2px 1px;
    } */
}

/*
  @media (max-width: 375px) {
    .peroid-number-list.kl8 > li {
      margin: 2px 4px;
    }
  } */

.slide-enter-active,
.slide-leave-active {
  transition: all ease-out 0.2s;
}

.slide-enter,
.slide-leave-to {
  transform: translateY(-100px);
  opacity: 0;
}
</style>
