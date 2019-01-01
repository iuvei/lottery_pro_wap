<template>
  <div
    class="confirm-order-box"
    :style="{'min-height':$window.innerHeight+'px'}"
  >
    <div style="padding-bottom:44px">
      <x-header :left-options="{backText: ''}">
        <div class="header-title">
          <div>确认投注单</div>
        </div>
      </x-header>
    </div>
    <LotteryGameTop />
    <div class="confirm-btn-list">
      <div @click="goToGame">
        <i class="iconfont icon-jiahao"></i>
        <div>自选号码</div>
      </div>
      <button
        @click="generateRandomBet(1)"
        :disabled="!($store.state.game.betData.length&&orderData.list&&orderData.list.length)"
      >
        <i class="iconfont icon-jiahao"></i>
        <div>机选一注</div>
      </button>
      <button
        @click="clearSelectedList"
        :disabled="!(orderData.list&&orderData.list.length)"
      >
        <i class="iconfont icon-jianhao-copy"></i>
        <div>清空列表</div>
      </button>
    </div>
    <!-- 注单 -->
    <div style="padding-bottom:120px">
      <div class="order-drag-bg">
        <!-- 注单背景 -->
      </div>
      <div class="confirm-order-content">
        <!-- 注单列表 -->
        <ul class="confirm-order-list">
          <li v-for="(item,index) in orderData.list">
            <div class="order-item-content red-color">
              <div>{{betOrderContent({content:item.content||item.betContent,type:item.type})}}</div>
            </div>
            <div class="order-item-info">
              <div>
                <div class="dib">赔率:
                  <span class="red-color">{{parseFloat(item.odds).toFixed(3)}}</span>
                </div>
                <div
                  class="dib ml10"
                  v-show="$store.state.game.currentGameInfo.type!=='six'"
                >返利:{{item.rebate}}%</div>
              </div>
              <div class="black-level5 lh30">
                <div class="dib">{{`${item.type}${item.betTitle?'-'+item.betTitle:''}`}}</div>
                <div class="dib ml10">{{item.betNum}}注/{{(item.betNum*item.amount*item.multiple).toFixed(2)}}元</div>
              </div>
            </div>
            <div
              @click="clearOrderItem(item,index)"
              class="order-item-delete"
            >
              <i class="iconfont icon-jiahao"></i>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="confirm-order-bottom">
      <div class="order-input-box">
        <div
          class="binge-check-area"
          @click="bingeChecked=!bingeChecked"
        >
          <div
            class="check-box"
            :class="{'checked':bingeChecked}"
          >
            <i
              class="iconfont icon-gouxuan"
              v-show="bingeChecked"
            ></i>
          </div>
          <div class="dib">中奖后停止追号</div>
        </div>
        <div>连续买<input
            type="number"
            v-model="bingeNum"
            inputmode="numeric"
            pattern="[0-9]*"
            class="period-input"
          >期</div>
      </div>
      <div class="order-confirm-box">
        <div class="order-confirm-summary">
          <div class="dib ml10">共
            <span class="red-color">{{(parseInt(bingeNum)?bingeNum:1)*totalBetNum}}</span>注</div>
          <div class="dib">合计:
            <span class="red-color">{{(parseInt(bingeNum)?bingeNum:1)*totalBetMoney}}</span> 元</div>
        </div>
        <button @click="bet">确认投注</button>
      </div>
    </div>
    <div class="order-clear-confirm">
      <confirm
        v-model="confirmShow"
        @on-confirm="onConfirm"
        cancel-text="取消"
        @on-hide="handleConfirmHide"
      >
        <p style="text-align:center;">是否清除所有注单</p>
      </confirm>
    </div>
    <BetSuccess
      :show="betSuccessShow"
      @cancel="handleBetSuccessCancel"
      :bingeNum="bingeNum"
      :totalBetNum="totalBetNum"
      :totalBetMoney="totalBetMoney"
    />
    <!-- :betDetail="" -->
  </div>
</template>

<script>
import LotteryGameTop from '../../../components/games/LotteryGameTop'
import { betOrderContent } from '../../../util/filters'
import { randomBetSelect } from '../../../util/game/randomSelect'
import { generateBetContent } from '../../../util/lotteryAlgorithmUtil'
import BetSuccess from '../../../components/global/bet_success'
export default {
  components: {
    LotteryGameTop,
    BetSuccess
  },
  data() {
    return {
      orderData: JSON.parse(localStorage.getItem('tplBetOrder')) || {},
      confirmShow: false,
      totalBetNum: 0,
      totalBetMoney: 0,
      bingeChecked: true,
      bingeNum: 1,
      betSuccessShow: false
    }
  },
  created() {
    this.registerGlobalEvents()
    // 初始化页面
    this.initPage()
    console.log(history)
    if (!(this.orderData.list && this.orderData.list.length)) {
      this.$router.replace({
        path: `/game/${this.$route.params.game_code}`
      })
    }
  },
  methods: {
    ...Vuex.mapActions(['BET', 'GET_MEMBER_INFO']),
    betOrderContent,
    goToGame() {
      this.$router.replace({
        path: `/game/${this.$route.params.game_code}`
      })
    },
    setBetSummary() {
      let totalBetNum = 0
      let totalBetMoney = 0
      this.orderData.list &&
        this.orderData.list.map(item => {
          totalBetNum += item.betNum
          totalBetMoney += item.amount * item.betNum * item.multiple
        })
      this.totalBetNum = totalBetNum
      this.totalBetMoney = totalBetMoney.toFixed(2)
    },
    initPage() {
      /*
       *判断当前的游戏是否和缓存里面的游戏一致,如果不一致需要删除当前注单数据
       *localStorage中有注单的时候,需要将round值更新到当前接口返回的round值
       */
      if (this.orderData.game_code) {
        if (this.$route.params.game_code !== this.orderData.game_code) {
        }
      }
      // 下注注数和下注总金额
      this.setBetSummary()
    },
    setStyle(text) {
      let style = {}
      if (text === ',') {
        return {
          width: '10px'
        }
      }
    },
    registerGlobalEvents() {
      this.$eventBus.$on('clearSelectedBet', () => {
        this.clearAll()
      })
    },
    generateRandomBet(num) {
      // 随机选中一个注单
      let list = randomBetSelect({ randomNum: num, store: this.$store })
      let { betTplType } = this.$store.state.game
      if (betTplType === 'textArea') {
        list = [list.join('')]
      }

      let content = generateBetContent({
        betData: list,
        store: this.$store
      })

      this.addOrderToLocalStorage(this.generateTplOrder(content))
    },
    generateTplOrder(content) {
      // 特殊号需要特殊处理
      let {
        amount,
        betNum,
        multiple,
        odds,
        rebate,
        id
      } = this.orderData.list[0]
      if (
        this.$store.state.game.playInfo.children.length ||
        this.$store.state.game.playInfo.betData
      ) {
        let arr = []
        let betData = this.$store.state.game.betData
        _.map(betData, item => item.selectedList).forEach(item => {
          item.forEach(item1 => {
            let odds = (
              item1.odds_max -
              (item1.odds_max - item1.odds_min) *
                (this.$store.state.game.sliderNum / 100)
            ).toFixed(3)
            arr.push({ id: item1.id, odds })
          })
        })
        betData[0].selectedList.map(item => {
          this.$store.state.game.playInfo.children.map(item1 => {
            if (item === item1.name) {
              arr.push({ id: item1.id, odds: item1.odds })
            }
          })
        })
        return arr.map(item => {
          return {
            game_code: this.$store.state.game.currentGameInfo.game_code,
            round: this.$store.state.game.currentGameInfo.round,
            id: item.id,
            rebate,
            odds: item.odds,
            amount,
            betContent: ' ',
            content: content.content,
            multiple,
            type: this.$store.state.game.playMenuTitle,
            betNum: betNum
          }
        })
      }
      return [
        {
          game_code: this.$store.state.game.currentGameInfo.game_code,
          round: this.$store.state.game.currentGameInfo.round,
          id,
          rebate,
          odds,
          amount,
          betContent: content.betContent,
          content: content.content,
          multiple,
          type: this.$store.state.game.playMenuTitle,
          betNum: this.$store.state.game.betTotalNum
        }
      ]
    },
    addOrderToLocalStorage(betArr) {
      // 把符合条件的注单添加到localStorage中
      let tplBetOrder = JSON.parse(localStorage.getItem('tplBetOrder')) || {
        list: []
      }
      tplBetOrder.game_code = this.$store.state.game.currentGameInfo.game_code
      tplBetOrder.round = this.$store.state.game.currentGameInfo.round
      tplBetOrder.list = [...betArr, ...tplBetOrder.list]
      this.orderData = tplBetOrder
      localStorage.setItem('tplBetOrder', JSON.stringify(tplBetOrder))
    },
    clearAll() {
      localStorage.removeItem('tplBetOrder')
      this.orderData = {}
    },
    clearSelectedList() {
      this.confirmShow = true
    },
    onConfirm() {
      this.clearAll()
    },
    handleConfirmHide() {},
    clearOrderItem(item, index) {
      this.orderData.list = this.orderData.list.filter(
        (orderItem, index1) => index !== index1
      )
      localStorage.setItem('tplBetOrder', JSON.stringify(this.orderData))
    },
    updateOrderList(round) {
      // 更新localStorage存放的期数
      let orderData = JSON.parse(localStorage.getItem('tplBetOrder')) || {
        list: []
      }
      if (orderData.list) {
        orderData.list = orderData.list.map(item => {
          item.round = round
          return item
        })
      }
      orderData.round = round
      this.orderData = orderData
      localStorage.setItem('tplBetOrder', JSON.stringify(orderData))
    },
    generateBetParams(orderData) {
      let params = []
      let bingeMode = this.bingeChecked ? 1 : 0
      console.log(orderData.list)

      orderData.list.map(item => {
        let {
          game_code,
          round,
          id,
          odds,
          rebate,
          amount,
          content,
          betContent,
          multiple
        } = item
        params.push({
          game_code,
          token: this.$store.getters.token,
          round,
          id,
          odds,
          rebate,
          amount,
          content: betContent,
          multiple,
          binge_mode: bingeMode,
          binge_round: this.generateBingeBet(multiple)
        })
      })
      return params
    },
    generateBingeBet(multiple){
      if(this.bingeNum>this.$store.state.game.gameResult.binge_max){
        //超过最大追号
      }
      var bingeRoundList = this.$store.state.game.gameResult.binge_round.slice(0, this.bingeNum)
      let bingeRoundStr = ''
      for (var i in bingeRoundList){
        bingeRoundStr += bingeRoundList[i] + "," + multiple +";"
      }
      console.log(bingeRoundStr)
      return bingeRoundStr

    },
    bet() {
      this.betSuccessShow = true
      this.BET(this.generateBetParams(this.orderData)).then(res => {
        console.log(res)
        if (res.result) {
          // 更新余额
          this.GET_MEMBER_INFO({ item: 'balance' })
          // 跳转至下注页面
          setTimeout(() => {
            // 清空注单
            this.clearAll()
            this.$router.replace({
              path: `/game/${this.$route.params.game_code}`
            })
          }, 3000)
        }
      })
    },
    handleBetSuccessCancel() {
      this.betSuccessShow = false
    }
  },
  watch: {
    orderData: {
      deep: 'true',
      handler: function(val, oldVal) {
        this.setBetSummary()
      }
    },
    '$store.state.game.currentGameInfo.round': function(val) {
      this.updateOrderList(val)
    }
  }
}
</script>

<style scoped>
.confirm-order-box {
  background-color: #f9fafe;
}
.confirm-btn-list {
  display: flex;
}

.confirm-btn-list .disabled {
  background-color: #e2e4ef;
}

.confirm-btn-list .iconfont {
  font-size: 20px;
}
.confirm-btn-list > * {
  flex: 1;
  color: white;
  display: flex;
  margin: 10px;
  line-height: 30px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  font-size: 14px;
}

.confirm-btn-list button {
  border: none;
}

.confirm-btn-list > div > div {
  margin-left: 2px;
}

.confirm-order-bottom {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #f9fafe;
}

.confirm-order-bottom > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.period-input {
  border: solid 0.8px #e2e4ef;
  width: 60px;
  line-height: 32px;
  border-radius: 5px;
  margin: 0 5px;
  text-align: center;
  background-color: white;
  font-size: 18px;
}
.bet-times-box {
  display: flex;
  align-items: center;
}

.order-input-box {
  font-size: 15px;
  line-height: 42px;
  border-top: solid 0.5px #e2e4ef;
  border-bottom: solid 0.5px #e2e4ef;
  padding: 0 10px;
}

.order-confirm-box {
  line-height: 50px;
}

.order-confirm-summary {
  flex: 1;
  background-color: white;
}

.order-confirm-box button {
  color: white;
  border: none;
  outline: none;
  height: 100%;
  display: block;
  line-height: 50px;
  padding: 0 20px;
  font-size: 17px;
}
.order-drag-bg {
  line-height: 5px;
  border-radius: 5px;
  background-color: #b4bdca;
  height: 10px;
  margin: 0 10px;
}
.confirm-order-content {
  margin-top: -5px;
  padding: 0 15px;
}
.confirm-order-list {
  background-color: white;
}

.confirm-order-list > li {
  border-bottom: dotted thin #e2e4ef;
  position: relative;
  padding: 10px 8px;
}
.confirm-order-list > li:not(:last-child):after,
.confirm-order-list > li:not(:last-child):before {
  content: '';
  display: block;
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 12px;
  background-color: #f9fafe;
}

.confirm-order-list > li:before {
  left: -6px;
  bottom: -6px;
}

.confirm-order-list > li:after {
  right: -6px;
  bottom: -6px;
}

.confirm-order-list > li:last-child {
  border: none;
}
.order-item-delete {
  position: absolute;
  width: 40px;
  height: 40px;
  top: 50%;
  right: 10px;
  margin-top: -20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.order-item-delete > .iconfont {
  color: #b4bdca;
  transform: rotate(45deg);
  font-size: 25px;
}
.order-item-content {
  word-wrap: break-word;
  font-size: 17px;
  font-weight: 500;
  display: flex;
  flex-wrap: wrap;
}

.order-item-content > div {
  letter-spacing: 1px;
}

.check-box {
  width: 1rem;
  height: 1rem;
  border: solid 0.5px #e2e4ef;
  border-radius: 1rem;
  background-color: white;
}
.checked.check-box {
  position: relative;

  color: white;
  border: solid 0.5px red;
}
.checked .icon-gouxuan {
  position: absolute;
  font-size: 0.8rem;
  font-weight: bold;
  left: 2px;
  top: 0;
}
.binge-check-area {
  display: flex;
  align-items: center;
}
.binge-check-area .check-box {
  margin-right: 10px;
  line-height: 1rem;
}
.order-item-info {
  font-size: 14px;
  margin-top: 8px;
}
button[disabled] {
  background-color: #e2e4ef;
}
</style>
