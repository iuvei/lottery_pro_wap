<template>
  <div>
    <div>
      <div
        class="lottery-game-bottom"
        :style="{'z-index':optionDetailShow?15:8}"
      >
        <div class="lottery-game-order-box">
          <div
            class="icon-delete-area"
            @click="clearSelected"
          >
            <img
              :src="require('../../../static/images/icon/delete-icon@3x.png')"
              alt=""
            >
          </div>
          <div
            class="summary-area"
            @click="optionDetailShow = !optionDetailShow"
          >
            <div class="icon-summary-area">
              <img
                :src="require('../../../static/images/home-blue/order-icon@3x.png')"
                alt=""
              >
              <transition name="scale">
                <div
                  class="point"
                  v-show="$store.state.game.betTotalNum"
                ></div>
              </transition>
            </div>
            <div>
              <div class="fw500">
                <span class="red-color dib fw500">{{(betTotalMoney*multiple).toFixed(3)}}</span>
                <span class="fs14 dib">元</span>
              </div>
              <div
                class="fs12 black-level6"
                style="margin-top:-2px"
              >
                共
                <span class="red-color">{{$store.state.game.betTotalNum}}</span> 注
              </div>
            </div>
          </div>
          <div>
            <button
              class="btn btn-bet"
              :disabled="!$store.state.game.betTotalNum"
              @click="addToBet"
            >投注</button>
          </div>
        </div>
      </div>
      <transition name="slide">
        <div
          class="order-option-detail"
          v-show="optionDetailShow"
          @click.stop
          :class="[$store.state.game.currentGameInfo.type,`gametype-${$store.state.game.currentGameInfo.position}`,
          {'special-num':$store.state.game.playInfo.name==='特殊号'}
          ]"
        >
          <div class="order-option-title x-padding12">
            <div>
              注单设定
            </div>
            <div @click="optionDetailShow = false">
              <div class="iconfont icon-jiahao1"></div>
            </div>
          </div>
          <div>
            <div class="fs14 input-box">
              <span v-if="$store.state.game.currentGameInfo.position===0">
                倍数
              </span>
              <span
                v-else
                class="black-level3"
              >
                单注金额
              </span>
              <div>
                <div
                  v-if="$store.state.game.currentGameInfo.position===0"
                  class="input-multiple"
                >
                  <div
                    @click="multiple>1?multiple-=1:''"
                    :class="{'disabled':multiple<=1}"
                  >
                    <i class="iconfont icon-jianhao"></i>
                  </div>
                  <div class="input-main">
                    <InputNumber
                      :value="multiple"
                      @handleNumberChange="handleMultipleChange"
                    />
                    <span>倍</span>
                  </div>
                  <div @click="multiple=multiple?parseInt(multiple)+1:1">
                    <i class="iconfont icon-jiahao1"></i>
                  </div>
                </div>
                <div
                  v-else
                  class="input-number"
                >
                  <InputNumber
                    :value="moneyNum"
                    @handleNumberChange="handleNumberChange"
                  />
                  <span>元</span>
                </div>
              </div>
            </div>

            <div>
              <ul
                class="playmode-list"
                v-show="$store.state.game.currentGameInfo.position===0"
              >
                <li
                  :class="{'active':item===$store.state.game.playMode}"
                  v-for="(item,index) in playModeMenus"
                  @click="handlePlayModeChange(index)"
                >{{item}}</li>
              </ul>
            </div>
          </div>
          <div
            v-show="$store.state.game.currentGameInfo.type!=='six'"
            class="fs12"
          >
            <div>
              <div class="red-color fs12">{{rebate}}%</div>
            </div>
            <div v-show="$store.state.game.currentGameInfo.position===0">
              <div class="red-color odds-text fs12">{{odds}}</div>
            </div>
          </div>
          <div
            class="fs14 slider-main"
            :class="{ 'have-odds':$store.state.game.currentGameInfo.position===0}"
            v-show="$store.state.game.currentGameInfo.type!=='six'"
          >
            <div class="black-level6">
              返利
            </div>
            <div
              class="slider-area"
              v-if="optionDetailShow"
            >
              <range
                v-model="sliderNumber"
                :range-bar-height="6"
                :step="0.1"
                @on-change="handleSliderChange"
              ></range>
            </div>
            <div v-show="$store.state.game.currentGameInfo.position===0">
              赔率
            </div>
          </div>
          <div
            class="reward-text"
            v-show="$store.state.game.currentGameInfo.position===0"
          >
            <div>
              若中奖,单注最高:
              <span class="red-color">{{maxLotteryMoney.toFixed(3)}}</span>元
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div
      class="mask-layer"
      v-show="optionDetailShow"
      @click="optionDetailShow=false"
    ></div>
  </div>
</template>

<script>
import { Range } from 'vux'

import { generateBetContent } from '../../util/lotteryAlgorithmUtil'
import { getComposeByArrays } from '../../util/index'
import InputNumber from '../../components/global/InputNumber'
export default {
  components: {
    Range,
    InputNumber
  },
  data() {
    return {
      sliderNumber: 0,
      playModeMenus: ['元', '角', '分'],
      rate: 1,
      optionDetailShow: false,
      moneyNum: 2,
      multiple: 1
    }
  },
  computed: {
    betTotalMoney: function() {
      let rate
      switch (this.$store.state.game.playMode) {
        case '元':
          rate = 2
          break
        case '角':
          rate = 0.2
          break
        case '分':
          rate = 0.02
          break
      }
      this.rate =
        this.$store.state.game.currentGameInfo.position === 0
          ? rate
          : this.moneyNum
      return this.rate * this.$store.state.game.betTotalNum
    },
    maxLotteryMoney: function() {
      return this.rate * this.odds
    },
    odds: function() {
      let playInfo = this.$store.state.game.playInfo
      let betListData =
        playInfo.children && playInfo.children.length
          ? playInfo.children
          : playInfo.betData
      if (betListData && betListData.length) {
        let arr = []
        betListData.map(item => {
          arr.push(
            (
              item.odds_max -
              (item.odds_max - item.odds_min) * (this.sliderNumber / 100)
            ).toFixed(3)
          )
        })
        return Array.from(new Set(arr)).join(' | ')
      }
      return (
        playInfo.odds_max -
        (playInfo.odds_max - playInfo.odds_min) * (this.sliderNumber / 100)
      ).toFixed(3)
    },
    rebate: function() {
      let playInfo = this.$store.state.game.playInfo
      let rebateMax =
        playInfo.rebate_max ||
        (playInfo.children &&
          playInfo.children.length &&
          playInfo.children[0].rebate_max)
      let rebateMin = parseInt(
        playInfo.rebate_min ||
          (playInfo.children &&
            playInfo.children.length &&
            playInfo.children[0].rebate_min)
      )
      return (
        rebateMin +
        (rebateMax - rebateMin) * (this.sliderNumber / 100)
      ).toFixed(1)
    }
  },
  created() {},
  methods: {
    ...Vuex.mapActions(['BET']),
    clearSelected() {
      this.optionDetailShow = false
      this.$eventBus.$emit('clearSelectedBet')
    },
    handleNumberChange(e) {
      this.moneyNum = e.target.value
    },
    handlePlayModeChange(index) {
      this.$store.commit('changePlayMode', this.playModeMenus[index])
    },
    handleSliderChange(val) {
      this.$store.commit('setSliderNum', val)
    },
    handleMultipleChange(e) {
      this.multiple = e.target.value
    },
    generateTplOrder() {
      let game = this.$store.state.game
      let lotteryType = game.currentGameInfo.type
      let betData = game.betData
      let { playInfo, betTplType } = this.$store.state.game
      let playMenuTitle = game.playMenuTitle
      let navTitle = playMenuTitle.split('-')[0]
      let { position } = this.$store.state.game.currentGameInfo
      let betParams = []

      // 对betData按照index索引进行排序
      if (betTplType !== 'textArea') {
        betData.map(item => {
          item.selectedList = item.selectedList.sort(
            (n1, n2) => n1.index - n2.index
          )
        })
      }
      // 筛选出选中含有id的下注项
      // 含有id的下注项不需要传content值
      let selectedIdArray =
        betTplType !== 'textArea' &&
        _.flattenDeep(
          betData.map(item => {
            return item.selectedList
              .filter(item1 => !!item1.id)
              .map(item2 => {
                item2.title = item.title
                return item2
              })
          })
        )

      // 筛选出不含有id的下注内容
      let removedIdBetData =
        betTplType !== 'textArea' && betData.filter(item => !item.list[0].id)
      // 筛选去除含有id的item，将odds_max的下注项进行归类
      let betNum =
        (position === 1 &&
          removedIdBetData.length &&
          removedIdBetData
            .map(item => item.selectedList.length)
            .reduce((n1, n2) => n1 + n2)) ||
        this.$store.state.game.betTotalNum
      let content = generateBetContent({
        betData: removedIdBetData || betData,
        store: this.$store
      })

      let groupedBetData = _.groupBy(
        _.flattenDeep(
          _.map(
            _.filter(removedIdBetData, item => item.selectedList.length),
            item => item.selectedList
          )
        ),
        item => item.odds_max
      )

      let basicParams = {
        game_code: game.currentGameInfo.game_code,
        round: game.currentGameInfo.round,
        id: game.playInfo.id,
        rebate: this.rebate,
        odds: this.odds,
        amount: this.rate,
        content: content.content,
        betContent: content.betContent,
        multiple: this.multiple,
        type: playMenuTitle,
        betNum: betNum
      }
      console.log(basicParams)
      if (selectedIdArray.length) {
        betParams.push(
          ...selectedIdArray.map((item, index) => {
            let odds = (
              item.odds_max -
              (item.odds_max - item.odds_min) * (game.sliderNum / 100)
            ).toFixed(3)
            return {
              ...basicParams,
              id: item.id,
              rebate: this.rebate,
              betContent: '',
              odds,
              betNum: 1,
              content: item.name,
              betTitle: item.title
            }
          })
        )
      }

      // 特殊号需要特殊处理
      // 时时彩龙虎斗
      if (playMenuTitle === '龙虎斗' && lotteryType === 'ssc') {
        let arr = []
        let titleList = ['第一球', '第二球', '第三球', '第四球', '第五球']
        betData.map(item => {
          if (item.selectedList.length) {
            let compareArr = []
            item.title.split('vs').forEach(item1 => {
              titleList.forEach((item2, index) => {
                if (item1 === item2) {
                  compareArr.push(index)
                }
              })
            })
            let str = compareArr.join(',')
            _.map(item.selectedList, item1 => {
              let odds = (
                item1.odds_max -
                (item1.odds_max - item1.odds_min) * (game.sliderNum / 100)
              ).toFixed(3)
              if (item1.name === '龙') {
                arr.push({
                  betContent: `${str},5`,
                  odds,
                  content: '龙',
                  betTitle: `${titleList[compareArr[0]]}vs${
                    titleList[compareArr[1]]
                  }`
                })
              }
              if (item1.name === '虎') {
                arr.push({
                  betContent: `${str},6`,
                  odds,
                  content: '虎'
                })
              }
              if (item1.name === '和') {
                arr.push({
                  betContent: `${str},7`,
                  odds,
                  content: '和',
                  betTitle: `${titleList[compareArr[0]]}vs${
                    titleList[compareArr[1]]
                  }`
                })
              }
            })
          }
        })
        betParams = arr.map(item => {
          return {
            ...basicParams,
            id: game.playInfo.betData[0].id,
            betContent: item.betContent,
            content: item.content,
            odds: item.odds,
            betTitle: item.betTitle
          }
        })
        console.log(arr)
      }
      // 幸运农场第n球玩法
      if (
        lotteryType === 'xync' &&
        [
          '第一球',
          '第二球',
          '第三球',
          '第四球',
          '第五球',
          '第六球',
          '第七球',
          '第八球'
        ].includes(navTitle)
      ) {
        let filteredRemovedIdBetData = removedIdBetData
          .filter(item => item.selectedList.length)
          .map(item => {
            let odds =
              item.selectedList[0].odds_max -
              (item.selectedList[0].odds_max - item.selectedList[0].odds_min) *
                (game.sliderNum / 100)
            if (item.title === '单码') {
              return {
                ...basicParams,
                betContent: item.selectedList
                  .map(item1 => item1.name)
                  .join(','),
                content: item.selectedList.map(item1 => item1.name).join(','),
                betNum: item.selectedList.length,
                odds,
                id: item.id
              }
            } else {
              return {
                ...basicParams,
                betContent: item.selectedList
                  .map(item1 => item1.index)
                  .join(','),
                content: item.selectedList.map(item1 => item1.name).join(','),
                betNum: item.selectedList.length,
                odds,
                id: item.id
              }
            }
          })
        return [...betParams, ...filteredRemovedIdBetData]
      }
      // 除了时时彩之外的龙虎斗
      if (playMenuTitle === '龙虎斗' && lotteryType === 'pk10') {
        let list = _.map(betData, item => item.selectedList).map(item =>
          item.map(item1 =>
            item1.name === '龙' ? 0 : item1.name === '虎' ? 1 : ''
          )
        )
        betParams.push({
          ...basicParams,
          betContent: list.join(';'),
          content: content.content
        })
      }
      // 梭哈,牛牛,11选5两面玩法特殊处理
      if (lotteryType === 'syxw' && navTitle === '两面' && position === 1) {
        let arr = []
        // 大小单双赔率
        let oddsMax = game.playInfo.betData[1].odds_max
        let oddsMin = game.playInfo.betData[1].odds_max
        let odds = (
          oddsMax -
          (oddsMax - oddsMin) * (game.sliderNum / 100)
        ).toFixed(3)
        betParams.push({
          ...basicParams,
          odds,
          id: game.playInfo.betData[1].id
        })
        console.log(betParams)
      }
      if (lotteryType === 'k3' && position === 1) {
        let betParams = []
        if (navTitle === '三军/大小') {
          let sanjunContent = betData
            .find(item => item.title === '三军')
            .selectedList.map(item => item.name)
            .join(',')
          let daxiaoContent = betData
            .find(item => item.title === '总和')
            .selectedList.map(item =>
              ['大', '小', '单', '双'].indexOf(item.name)
            )
            .join(',')
          sanjunContent &&
            betParams.push({
              ...basicParams,
              id: playInfo.betData[0].id,
              betContent: sanjunContent,
              odds: (
                playInfo.betData[0].odds_max -
                (playInfo.betData[0].odds_max - playInfo.betData[0].odds_min) *
                  (game.sliderNum / 100)
              ).toFixed(3)
            })
          daxiaoContent &&
            betParams.push({
              ...basicParams,
              id: playInfo.betData[1].id,
              betContent: daxiaoContent,
              odds: (
                playInfo.betData[1].odds_max -
                (playInfo.betData[1].odds_max - playInfo.betData[1].odds_min) *
                  (game.sliderNum / 100)
              ).toFixed(3)
            })
        }
        if (navTitle === '点数') {
          betData[0].selectedList.map(item => {
            betParams.push({
              ...basicParams,
              id: item.id,
              odds: (
                item.odds_max -
                (item.odds_max - item.odds_min) * (game.sliderNum / 100)
              ).toFixed(3),
              betContent: ' '
            })
          })
        }

        if (navTitle === '长牌/短牌') {
          let changpaiContent = betData
            .find(item => item.title === '长牌')
            .selectedList.map(item => item.name)
            .join(';')
          let duanpaiContent = betData
            .find(item => item.title === '短牌')
            .selectedList.map(item => item.name)
            .join(',')
          changpaiContent &&
            betParams.push({
              ...basicParams,
              id: playInfo.betData[0].id,
              odds: (
                playInfo.betData[0].odds_max -
                (playInfo.betData[0].odds_max - playInfo.betData[0].odds_min) *
                  (game.sliderNum / 100)
              ).toFixed(3),
              betContent: changpaiContent
            })
          duanpaiContent &&
            betParams.push({
              ...basicParams,
              id: playInfo.betData[1].id,
              odds: (
                playInfo.betData[1].odds_max -
                (playInfo.betData[1].odds_max - playInfo.betData[1].odds_min) *
                  (game.sliderNum / 100)
              ).toFixed(3),
              betContent: duanpaiContent
            })
        }

        if (navTitle === '围骰/全骰') {
          // 围骰
          let weishaiContent = betData
            .find(item => item.title === '围骰')
            .selectedList.map(item => item.name)
            .join(',')
          weishaiContent &&
            betParams.push({
              ...basicParams,
              id: playInfo.betData[0].id,
              odds: (
                playInfo.betData[0].odds_max -
                (playInfo.betData[0].odds_max - playInfo.betData[0].odds_min) *
                  (game.sliderNum / 100)
              ).toFixed(3),
              betContent: weishaiContent
            })
          // 全骰
          betData
            .find(item => item.title === '全骰')
            .selectedList.map(item => {
              betParams.push({
                ...basicParams,
                id: playInfo.betData[1].id,
                odds: (
                  playInfo.betData[1].odds_max -
                  (playInfo.betData[1].odds_max -
                    playInfo.betData[1].odds_min) *
                    (game.sliderNum / 100)
                ).toFixed(3),
                betContent: ' '
              })
            })
        }
        return betParams
      }
      if (lotteryType === 'three' && position === 1) {
        let betParams = []
        if (navTitle === '二字组合' || navTitle === '三字组合') {
          let composedArray = getComposeByArrays(
            betData
              .map(item => item.selectedList)
              .map(item => item.map(item1 => item1.name))
          ).map(item =>
            item
              .split(',')
              .sort((n1, n2) => n1 - n2)
              .join(',')
          )
          betParams.push({
            ...basicParams,
            betContent: Array.from(new Set(composedArray)).join(';')
          })
        }
        if (
          navTitle.indexOf('定位') !== -1 ||
          navTitle === '两面' ||
          navTitle === '一字组合' ||
          navTitle === '跨度'
        ) {
          let betContent = betData
            .map(item => item.selectedList)
            .map(item => {
              if (navTitle === '两面') {
                return item.map(item1 =>
                  ['大', '小', '单', '双', '质', '合'].indexOf(item1.name)
                )
              }
              return item.map(item1 => item1.name)
            })
            .join(';')
          let odds = (
            playInfo.odds_max -
            (playInfo.odds_max - playInfo.odds_min) * (game.sliderNum / 100)
          ).toFixed(3)
          betParams.push({
            ...basicParams,
            id: playInfo.id,
            odds,
            betContent
          })
        }
        if (navTitle === '二字和数' || navTitle === '三字和数') {
          // 和值数据需要特殊处理
          let sumBetData = betData.find(item => item.title === '和值')
          let filteredSumBetData = sumBetData.selectedList
            .map(item =>
              sumBetData.list.map(item1 => item1.name).indexOf(item.name)
            )
            .join(',')
          betData
            .filter(item => item.selectedList.length)
            .map(selectedRows => {
              let betContent = ' '
              let selectedPlayData = playInfo.betData.find(
                item => item.name === selectedRows.title
              )
              let id = selectedPlayData.id
              let odds = (
                selectedPlayData.odds_max -
                (selectedPlayData.odds_max - selectedPlayData.odds_min) *
                  (game.sliderNum / 100)
              ).toFixed(3)
              if (selectedRows.title === '和值') {
                betContent = selectedRows.selectedList
                  .map(item =>
                    selectedRows.list
                      .map(item1 => item1.name)
                      .indexOf(item.name)
                  )
                  .join(',')
              }
              if (selectedRows.title === '尾数') {
                betContent = selectedRows.selectedList
                  .map(item => item.name)
                  .join(',')
              }
              // 三字和数大小单双玩法
              if (selectedRows.title === '大小单双') {
                betContent = selectedRows.selectedList
                  .map(item => ['大', '小', '单', '双'].indexOf(item.name))
                  .join(',')
              }
              // 二字和数单双玩法
              if (selectedRows.title === '和值单双') {
                betContent = selectedRows.selectedList
                  .map(item => ['单', '双'].indexOf(item.name))
                  .join(',')
              }
              if (
                selectedRows.title === '尾数双面' ||
                selectedRows.title === '尾数双面'
              ) {
                betContent = selectedRows.selectedList
                  .map(item => ['大', '小', '质', '合'].indexOf(item.name))
                  .join(',')
              }
              betParams.push({
                ...basicParams,
                odds,
                id,
                betContent
              })
            })
        }
        return betParams
      }
      if (lotteryType === 'six' && position === 1) {
        // includesNum是否包含1-49下注
        let includesNum = !!playInfo.odds_array.find(
          oddsData => oddsData.name === '1-49'
        )
        if (
          navTitle === '连码' ||
          navTitle === '合肖' ||
          navTitle === '连肖' ||
          navTitle === '尾数连' ||
          navTitle === '全不中'
        ) {
          betParams.push({
            ...basicParams,
            odds: playInfo.odds_array[0].odds,
            betContent: betData[0].selectedList
              .map(item =>
                navTitle === '连码' || navTitle === '全不中'
                  ? item.name
                  : item.index
              )
              .join(','),
            betNum: 1
          })
        } else {
          if (includesNum) {
            Object.keys(groupedBetData).map(key => {
              let indexList = groupedBetData[key].map(item => {
                let betContent = ''
                if (isNaN(parseInt(item.name))) {
                  let index = playInfo.odds_array
                    .map(odd => odd.name)
                    .indexOf(item.name)
                  betContent = index + 49
                } else {
                  // 1-49球下注
                  betContent = item.name
                }

                betParams.push({
                  ...basicParams,
                  content: item.name,
                  betContent,
                  odds: key,
                  betNum: 1
                })
              })
            })
          } else {
            betData[0].selectedList.map(item => {
              betParams.push({
                ...basicParams,
                odds: item.odds_max,
                betContent: item.index,
                content: item.name,
                betNum: 1
              })
            })
          }
        }
      }
      if (lotteryType === 'lucky28' && navTitle === '混合') {
        let betContent = betData[0].selectedList
          .map(item =>
            playInfo.odds_array.map(odds => odds.name).indexOf(item.name)
          )
          .join(',')

        betParams.push({
          ...basicParams,
          odds: playInfo.odds_array[0].odds_max,
          betContent
        })
      }
      if (!betParams.length) {
        betParams = [basicParams]
      }
      return betParams
    },
    addOrderToLocalStorage(betArr) {
      // 把符合条件的注单添加到localStorage中
      let tplBetOrder = JSON.parse(localStorage.getItem('tplBetOrder')) || {
        list: []
      }
      tplBetOrder.game_code = this.$store.state.game.currentGameInfo.game_code
      tplBetOrder.round = this.$store.state.game.currentGameInfo.round
      tplBetOrder.list = [...betArr, ...tplBetOrder.list]
      // 清除不属于当前游戏的临时注单
      this.clearAdditionalOrder(tplBetOrder)
      localStorage.setItem('tplBetOrder', JSON.stringify(tplBetOrder))
    },
    clearAdditionalOrder(order) {
      order.list = order.list.filter(item => item.game_code === order.game_code)
    },
    addToBet() {
      if (!this.checkBetContent()) {
        return
      }
      if (!this.optionDetailShow) {
        this.optionDetailShow = true
        this.$store.commit('setMaskLayerZIndex', 12)
        return
      }

      this.addOrderToLocalStorage(this.generateTplOrder())
      this.optionDetailShow = true

      /* 生成临时注单 ,需要放在localStorage中*/
      // (game_code,round,)
      /* 跳转到确认投注单页面 */
      // return
      this.$router.push({
        path: `/confirmOrder/${this.$route.params.game_code}`,
        query: {}
      })
    },
    checkBetContent() {
      /* 不满足下注条件时 */
      // errorInfo:下注不满足条件时候的错误提示

      let betTplType = this.$store.state.game.betTplType
      let errorInfo =
        betTplType === 'textArea'
          ? '输入号码不规范,请重新输入'
          : '号码选择不完整,请重新选择'
      if (!this.$store.state.game.betTotalNum) {
        this.$eventBus.$emit('toast', {
          type: 'warn',
          time: 2000,
          text: errorInfo
        })
        // 无法通过过滤
        return false
      }
      if(!this.multiple && this.optionDetailShow){
        this.$vux.toast.show({
          type: 'warn',
          text: '倍数不能为0',
          time: 2000
        })
        return false
      }
      // 通过过滤
      return true
    }
  },
  watch: {
    '$store.state.game.currentGameInfo': function() {
      // 切换玩法之后需要重置对应的数据
      this.multiple = 1
      this.sliderNumber = 0
      this.rate = 1
      this.moneyNum = 2
    }
  }
}
</script>

<style scoped>
.lottery-game-bottom {
  position: fixed;
  width: 100%;
  height: 100%;
  bottom: 0px;
  height: 49px;
  border-top: solid 0.5px #e2e4ef;
  z-index: 8;
}

.lottery-game-bottom > .lottery-game-order-box {
  display: flex;
}

.game-mode-box {
  width: 60px;
  font-size: 14px;
}

.lottery-game-multiunit-box {
  background-color: #f9fafe;
  border-top: solid 0.5px #e2e4ef;
  border-bottom: solid 0.5px #e2e4ef;
  height: 46px;
  padding: 5px 6px;
  box-sizing: border-box;
  display: none;
}
.game-benifit-slider-box {
  margin-left: 6px;
}

.game-benifit-slider-box > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.slider-area {
  width: calc(100% - 130px);
  margin: 0 10px;
}

.game-benifit-slider-box .iconfont {
  font-size: 1.8rem;
  color: #e2e4ef;
  padding: 5px;
  font-size: 22px;
}

.game-benifit-slider-box > div:first-child {
  height: 25px;
}

.game-benifit-slider-box > div:last-child {
  font-size: 12px;
  margin-top: -6px;
  padding: 0 6px;
}

.lottery-game-order-box {
  background-color: white;
  height: 49px;
  font-size: 17px;
}

.lottery-game-order-box > div {
  align-items: center;
  font-size: 18px;
}

.lottery-game-order-box > div:nth-child(2) {
  flex: 2;
  font-size: 17px;
  color: #252525;
}

.lottery-game-order-box .btn {
  font-size: 17px;
  font-weight: bold;
}

.lottery-game-order-box .btn-clear {
  background-color: white;
  border: solid 0.5px red;
  border-radius: 4px;
  margin: 5px;
  height: 34px;
  line-height: 34px;
}

.lottery-game-order-box .btn-bet {
  color: white;
  width: 115px;
  height: 49px;
  border: none;
}
.lottery-game-order-box .btn-bet[disabled] {
  background: #e2e4ef;
}
.odds-text {
  white-space: nowrap;
}
.icon-delete-area {
  width: 60px;
  border-right: solid 0.5px #e2e4ef;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-delete-area img {
  width: 30px;
}

.icon-summary-area {
  width: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.icon-summary-area .point {
  content: '';
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 6px;
  position: absolute;
  top: -4px;
	right: 20%;
	border:1px solid #fff;
}

.icon-summary-area img {
  width: 28px;
}

.icon-summary-area + div {
  padding: 5px 0;
}
.summary-area {
  display: flex;
}

.order-option-detail {
  position: fixed;
  bottom: 49px;
  width: 100%;
  height: 225px;
  background-color: white;
  border-radius: 10px 10px 0 0;
  z-index: 14;
  color: #666;
}

.order-option-detail.special-num {
  height: 185px;
}

.order-option-detail.six.gametype-1 {
  height: 130px;
}
.order-option-detail.gametype-1 {
  height: 180px;
}
.order-option-detail > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
}

.order-option-detail.gametype-1 > div:nth-child(2) {
  justify-content: flex-start;
}

.order-option-detail .slider-main:not(.have-odds) {
  justify-content: initial;
}
.order-option-detail.gametype-1 .slider-area {
  margin-left: 10%;
  width: calc(100% - 160px);
}
.order-option-title {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 0.5px solid #e2e4ef;
  padding: 0 12px;
}
.order-option-title .iconfont {
  transform: rotate(45deg);
  font-size: 28px;
}

.order-option-title > div:first-child {
  font-size: 17px;
  color: #333;
  font-weight: 500;
}
.playmode-list {
  display: flex;
}
.playmode-list > li {
  width: 36px;
  height: 36px;
  border-radius: 3px;
  font-size: 14px;
  border: solid 0.8px #e2e4ef;
  text-align: center;
  line-height: 36px;
}
.playmode-list > li:nth-child(2) {
  margin-left: 10px;
  margin-right: 10px;
}

.order-option-detail > div:nth-child(2) {
  padding: 20px 12px;
}
.reward-text {
  line-height: 40px;
  background-color: #f9fafe;
  font-size: 12px;
  color: #999;
}
.slide-enter-active,
.slide-leave-active {
  transition: all ease-out 0.2s;
}
.slide-enter,
.slide-leave-to {
  transform: translateY(225px);
  opacity: 0;
}

.order-option-detail > div.slider-main {
  margin: 8px 0;
  justify-content: flex-start;
}
.slider-main > div {
  white-space: nowrap;
}

.scale-enter-active,
.scale-leave-active {
  transition: all ease-out 0.2s;
}
.scale-enter,
.scale-leave-to {
  transform: scale(0, 0);
  opacity: 0;
}

.input-number {
  border: solid 0.5px #ddd;
  border-radius: 3px;
  background-color: #f9fafe;
  height: 35px;
  margin-left: 10px;
}

.input-number input {
  background: transparent;
  height: 100%;
  border: none;
  outline: none;
  padding-left: 10px;
  width: calc(100% - 40px);
  font-size: 18px;
  text-align: center;
}
.input-box {
  display: flex;
  align-items: center;
  word-break: keep-all;
}
.input-multiple {
  border: solid 0.8px #e2e4ef;
  border-radius: 3px;
  display: flex;
  align-items: center;
  margin: 0 10px;
}
.input-multiple .iconfont {
  font-size: 18px;
	font-weight: bold;
	padding-top: 2px;
}
.input-multiple > div:not(.input-main) {
  width: 35px;
	height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.input-multiple > div.disabled {
  background-color: #f3f3f3;
}
.input-multiple > .input-main {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: #f9fafe;
  padding-right: 5px;
  border-left: solid 0.5px #e2e4ef;
  border-right: solid 0.5px #e2e4ef;
}
.input-main span {
	font-size: 12px;
	color:#999;
}
.input-multiple input {
  width: 100%;
  height: 35px;
  border: none;
  outline: none;
  text-align: center;
  border-radius: 0;
  color: #333;
  font-size: 18px;
  font-weight: 500;
  background-color: transparent;
}
.input-multiple svg {
  fill: gray;
  stroke-width: 2;
}
.mask-layer {
  z-index: 13;
}

</style>

<style>
.order-option-detail .weui-cell {
  padding: 0;
}
.slider-area .range-handle:after {
  content: '';
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 10px;
  left: 50%;
  top: 50%;
  margin-left: -5px;
  margin-top: -5px;
  background-color: white;
  position: absolute;
}
</style>
