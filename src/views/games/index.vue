<template>
  <div>
    <div style="padding-bottom:44px">
      <x-header :left-options="{backText: ''}">
        <div class="header-title">
          <div @click="toggleMenu">
            <div class="header-title-text">
              <span>{{$store.state.game.playMenuTitle.split('-')[0]}}</span>
              <span
                class="icon-combine"
                v-show="$store.state.game.playMenuTitle.split('-').length>1"
              >
                {{$store.state.game.playMenuTitle.split('-').length>1&&'-'||''}}
              </span>
              <span>{{$store.state.game.playMenuTitle.split('-')[1]}}</span>
              <span v-if="$store.state.game.playInfo.id==='357'||$store.state.game.playInfo.id==='359'">
                ({{$store.state.game.playInfo.odds_array[0].odds+'/'+$store.state.game.playInfo.odds_array[1].odds}})
              </span>
            </div>
            <i
              class="iconfont icon-htmal5icon03 transition2"
              :class="{'rotate180':$store.state.game.playMenuShow}"
            ></i>
          </div>
        </div>
        <div
          slot="right"
          class="icon-more"
          @click="showGameOption"
        >
          <i class="iconfont icon-gengduo"></i>
        </div>
      </x-header>
      <LotteryGameOption
        :gameOptionShow="gameOptionShow"
        @showLotteryToggle="showToggleLottery()"
        @hideOptionList="gameOptionShow=false"
      />
    </div>
    <!-- 菜单-->
    <LotteryGameMenu />
    <!-- 开奖-->
    <LotteryGameTop openListShow="true" />
    <div class="bet-area-main">
      <!-- 投注玩法介绍 -->
      <LotteryGameIntro />
      <!-- 下注-->
      <router-view></router-view>
    </div>
    <!-- 投注底部-->
    <LotteryGameBottom />
    <!-- 切换彩种 -->
    <ToggleLottery
      :toggleLotteryShow="toggleLotteryShow"
      @closeToggle="closeToggle"
      @toggleLottery="toggleLottery"
    />
  </div>
</template>

<script>
import LotteryGameTop from '../../components/games/LotteryGameTop'
import LotteryGameOption from '../../components/games/lotteryGameOption'
import LotteryGameMenu from '../../components/games/lotteryGameMenu'
import LotteryGameBottom from '../../components/games/LotteryGameBottom'
import LotteryGameIntro from '../../components/games/LotteryGameIntro'
import ToggleLottery from '../../components/games/ToggleLottery'

export default {
  components: {
    LotteryGameTop,
    LotteryGameOption,
    LotteryGameMenu,
    LotteryGameBottom,
    LotteryGameIntro,
    ToggleLottery
  },
  props: [],
  data() {
    return {
      gameOptionShow: false,
      toggleLotteryShow: false
    }
  },
  created() {
    this.initPage()
  },
  methods: {
    initPage() {
      // 重置标题栏
      this.$store.commit('setMenutitle', '')
      // 重置菜单显示状态
      if (this.$store.state.game.playMenuShow) {
        this.$store.commit('toggleGameMenu', false)
      }
    },
    toggleMenu() {
      this.$store.commit('toggleGameMenu', !this.$store.state.game.playMenuShow)
    },
    onConfirm() {},
    showGameOption() {
      this.gameOptionShow = !this.gameOptionShow
    },
    closeToggle() {
      this.toggleLotteryShow = false
    },
    showToggleLottery() {
      this.toggleLotteryShow = true
      this.gameOptionShow  = false
    },
    toggleLottery(item) {
      this.$router.replace({
        path: `/game/${item.game_code}`,
        query: {
          position: item.position === '2' ? '0' : item.position
        }
      })
    }
  }
}
</script>

<style scoped>
.header-title {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}

.header-title > div {
  display: flex;
}

.header-title .iconfont {
  margin-left: 5px;
}

.header-title-text {
  font-size: 18px;
  font-weight: bold;
}

.header-title-text .icon-combine {
  margin: 0 -5px;
}

.icon-more .iconfont {
  color: white;
  font-size: 25px;
}

.icon-style {
  fill: white;
}
.bet-area-main {
  background-color: #f9fafe;
  min-height: calc(100vh - 152px);
}
</style>
