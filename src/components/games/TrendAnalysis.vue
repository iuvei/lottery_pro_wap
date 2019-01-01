<template>
  <div class="trend-analysis" :class="trendType">
    <div>
      <!--<div @click="toggleLotteryShow=true">-->
        <!--&lt;!&ndash; 切换彩种 &ndash;&gt;-->
        <!--切换彩种-->
      <!--</div>-->
      <!--<div>-->
        <!--&lt;!&ndash; 切换位数 &ndash;&gt;-->
        <!--<ul>-->
          <!--<li v-for="(item,index) in lotteryNumberLen" @click="togglePosition(index)">-->
            <!--{{index+1}}位走势-->
          <!--</li>-->
        <!--</ul>-->
      <!--</div>-->
      <!--<div>-->
        <!--&lt;!&ndash; 设置 &ndash;&gt;-->
      <!--</div>-->
    </div>
    <div>
      <table class="table-lottery-head">
        <tr>
          <td class="empty-cell"></td>
          <td v-for="item in lotteryNumber">{{item}}</td>
        </tr>
      </table>
    </div>
    <div class="lottery-main">
      <!-- table号码列表 -->
      <div class="lottery-main-table">
        <table>
          <tr v-for="item in lotteryData">
            <td class="lottery-peroid">{{item.round.slice(-3)}}期</td>
            <td v-for="number in lotteryNumber" :class="{'active':number==item.number.split(',')[activeLotteryPosition]}">
              <div>
                {{number}}
              </div>
            </td>
          </tr>
        </table>
      </div>

      <!-- 折线图 -->
      <div class=" lottery-chart-table">
        <svg width="100%" :height="svgHeight">
          <polyline :points="svgCoords" class="polyline">

          </polyline>
        </svg>
      </div>
    </div>
    <ToggleLottery :toggleLotteryShow="toggleLotteryShow" @closeToggle="closeToggle" @toggleLottery="toggleLottery" />
  </div>
</template>
<script>
import ToggleLottery from '../../components/games/ToggleLottery'
import { generateNumber } from '../../util/generateBetTplData'

export default {
  components: {
    ToggleLottery
  },
  props: ['game_code'],
  data() {
    return {
      lotteryNumber: [],
      lotteryData: [],
      activeGametab: [0, 0],
      currentPage: 1,
      rows: 30,
      activeLotteryPosition: 0,
      svgCoords: '',
      svgHeight: '0px',
      toggleLotteryShow: false,
      lotteryNumberLen: 0,
      trendType: ''
    }
  },
  created() {
    this.initPage({ game_code: this.game_code })
    this.$window.onresize = this.generateSvgCoords
  },
  methods: {
    ...Vuex.mapActions(['GET_GAME_RESULT']),
    initPage({ game_code }) {
      let min, max, addZero
      this.$store.state.game.gameInfo.map(item => {
        item.includes.map(item1 => {
          if (item1.game_code === this.game_code) {
            this.lotteryNumberLen = item.num
            this.trendType = item.type
            min = item.min
            max = item.max
            addZero = item.addZero
          }
        })
      })
      this.lotteryNumber = generateNumber({ min, max, addZero })
      this.getLotteryData(game_code)
    },
    getLotteryData(game_code) {
      this.GET_GAME_RESULT({
        game_code: game_code,
        type: 1,
        page: this.currentPage,
        rows: this.rows
      }).then(res => {
        this.lotteryData = res.data.includes.find(
          item => item.name === '号码'
        ).list
        this.generateSvgCoords()
        setTimeout(() => {
          this.svgHeight = getComputedStyle(
            document.querySelector('.lottery-main-table'),
            null
          ).height
          console.log(this.svgHeight)
        }, 20)
      })
    },
    generateSvgCoords() {
      let cellWidth =
        (document.body.clientWidth * 0.85) / this.lotteryNumber.length
      let cellHeight = 36
      console.log(this.lotteryNumber)
      let coords = this.lotteryData.map((item, index) => {
        let number = item.number.split(',')[this.activeLotteryPosition]
        number = this.lotteryNumber.indexOf(number)
        let x = cellWidth * (number * 1) + cellWidth / 2
        let y = cellHeight * index + cellHeight / 2
        return [x, y]
      })
      this.svgCoords = coords.join(' ')
    },
    closeToggle() {
      this.toggleLotteryShow = false
    },
    toggleLottery(item) {
      this.$router.replace({
        path: `/lotteryHistory/${item.game_code}`,
        query: {
          type: 'trend'
        }
      })
    },
    togglePosition(index) {
      this.activeLotteryPosition = index
      this.generateSvgCoords()
    }
  }
}
</script>

<style scoped>
.trend-analysis {
  background-color: white;
  font-size: 14px;
  color: #434343;
}
.table-lottery-head,
.lottery-main-table table {
  width: 100%;
}
/* 默认 */
.table-lottery-head .empty-cell,
.lottery-peroid {
  width: 15%;
}

/* 11选5 */
.syxw .table-lottery-head .empty-cell,
.syxw .lottery-peroid {
  width: 12%;
}

/* 快三 */
.k3 .table-lottery-head .empty-cell,
.k3 .lottery-peroid {
  width: 16%;
}

.table-lottery-head td:not(.empty-cell) {
  width: 8.5%;
}
.syxw .table-lottery-head td:not(.empty-cell) {
  width: 8%;
}

.k3 .table-lottery-head td:not(.empty-cell) {
  width: 14%;
}

.table-lottery-head td,
.lottery-main-table td {
  text-align: center;
  border-top: 1px solid #e3e3e3;
  border-right: 1px solid #e3e3e3;
  border-bottom: 1px solid #e3e3e3;
  box-sizing: border-box;
  height: 35px;
  line-height: 35px;
  text-align: center;
}
.lottery-main-table table tr:nth-child(odd) {
  background-color: #f7f7f7;
}

.lottery-main-table td:not(.lottery-peroid) {
  width: 8.5%;
}
.syxw .lottery-main-table td:not(.lottery-peroid) {
  width: 8%;
}

.k3 .lottery-main-table td:not(.lottery-peroid) {
  width: 14%;
}
.lottery-main {
  position: relative;
  height: calc(100vh - 35px);
  overflow: auto;
}
.lottery-chart-table {
  position: absolute;
  left: 0;
  top: 0;
  margin-left: 15%;
  width: 85%;
}

.lottery-main-table td.active div {
  background: #ea5051;
  border-radius: 100%;
  color: #fff;
  position: relative;
  z-index: 2;
  width: 25px;
  height: 25px;
  line-height: 25px;
  margin-left: auto;
  margin-right: auto;
}
.polyline {
  fill: none;
  stroke: red;
  stroke-width: 2;
}
</style>

