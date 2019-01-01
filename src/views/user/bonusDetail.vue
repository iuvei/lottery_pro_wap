<template>
  <div>
    <x-header :left-options="{backText: ''}">查看奖金组</x-header>
    <div
      class="lottery-detail-head"
      style="margin-top:44px;"
    >
      <div
        class="lottery-select-area"
        @click="lotteryListPopupShow=true"
      >
        <div>{{lotteryName[0]}}</div>
        <x-icon
          type="ios-arrow-down"
          size="20"
        ></x-icon>
      </div>
    </div>
    <table class="lottery-detail-table" style="margin-top:80px;">
      <thead>
        <tr>
          <td v-for="item in lotteryDetailData.header">{{item.name}}</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in lotteryDetailData.body">
          <td>{{item.group_name}}</td>
          <td>{{item.name}}</td>
          <td>
            <div>{{item.lottery_max}}</div>
            <div class="black-level6">+{{item.rebate_min}}%</div>
          </td>
          <td>
            <div>{{item.lottery_min}}</div>
            <div class="black-level6">+{{item.rebate_max}}%</div>
          </td>
        </tr>
      </tbody>
    </table>
    <popup-picker
      :show.sync="lotteryListPopupShow"
      :show-cell="false"
      :data="lotteryNameList"
      v-model="lotteryName"
      @on-change="handleLotteryChange"
    ></popup-picker>
  </div>
</template>

<script>
import { PopupPicker } from 'vux'
export default {
  components: {
    PopupPicker
  },
  data() {
    return {
      bonusList: [],
      lotteryName: [],
      lotteryNameList: [[]],
      currentLottery: {},
      lotteryListPopupShow: false,
      lotteryDetailData: {
        header: [
          {
            name: '玩法组'
          },
          {
            name: '玩法名称'
          },
          {
            name: '高奖金'
          },
          {
            name: '高返点'
          }
        ],
        body: []
      }
    }
  },
  created() {
    this._initPage()
  },
  methods: {
    ...Vuex.mapActions(['GET_GAME_SETTING']),
    _initPage() {
      this.lotteryName = [this.$store.state.game.gameInfo[0].includes[0].name]
      this.$store.state.game.gameInfo.map(item => {
        this.lotteryNameList[0].push(...item.includes.map(item1 => item1.name))
      })
      this.GET_GAME_SETTING({ game_code: 'cqssc' }).then(res => {
        console.log(res)
        this.lotteryDetailData.body = res.data.games
      })
    },
    getCurrentLottery() {
      this.$store.state.game.gameInfo.map(item => {
        item.includes.map(item1 => {
          if (item1.name === this.lotteryName[0]) {
            this.currentLottery = item1
          }
        })
      })
    },
    getLotteryDetail() {
      this.GET_GAME_SETTING({
        game_code: this.currentLottery.game_code,
        position: this.activePlayTab
      }).then(res => {
        this.lotteryDetailData.body = res.data.games
      })
    },
    handleLotteryChange() {
      this.getCurrentLottery()
      this.getLotteryDetail()
    }
  }
}
</script>

<style scoped>
.lottery-select-area {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: white;
  height: 40px;
}

.lottery-detail-head {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: white;
  font-size: 14px;
	padding: 0 12px;
	position: fixed;
	top:0;
	left:0;
	width:100%;
}

.lottery-detail-head > div {
  flex: 1;
}

.lottery-detail-head > div:first-child {
  justify-content: flex-start;
}

/* .lottery-detail-head > div:last-child {
  justify-content: flex-end;
} */
table {
  width: 100%;
  text-align: center;
}

thead {
  font-size: 14px;
  color: #999;
}

thead tr {
  height: 45px;
  border-bottom: solid 0.7px #d8dce2;
}

tbody {
  font-size: 14px;
  color: #333;
}

tbody tr {
  height: 50px;
  border-bottom: solid 0.7px #d8dce2;
  /* border-collapse:collapse; */
}

.tab-box {
  position: relative;
  z-index: 10;
  margin-top: 44px;
}
</style>
