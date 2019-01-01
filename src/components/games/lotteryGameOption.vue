<template>
  <div
    class="lottery-game-option-box"
    v-show="gameOptionShow && rightShow"
    @click="$emit('hideOptionList')"
  >
    <transition name="slide">
      <div
        class="lottery-game-option"
        v-show="gameOptionShow"
        @click.stop
      >
        <ul class="game-option-list">
          <li
            v-for="item in currentOptionList"
            @click="handleClick(item)"
          >
            <div>{{item.name}}</div>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
  import Vue from 'vue'
export default {
  props: ['gameOptionShow'],
  data() {
    return {
      optionList: [
        {
          name: '切换彩种'
        },
        {
          name: '投注记录',
          path: '/order/history',
          query: {
            type: 0
          }
        },
        {
          name: '开奖历史'
        },
        {
          name: '走势图表'
        },
        {
          name: '资金记录',
          path: '/money/history'
        },
        {
          name: '我要充值',
          path: '/bank/rechargeCentre'
        },
        {
          name: '我要提款',
          path: '/bank/withdraw'
        }
      ],
      currentOptionList: [],
      rightShow: true
    }
  },
  created() {
    this.initPage()
  },
  methods: {
    ...Vuex.mapActions(['GET_TREND']),
    initPage() {
      this.optionList.map(item => {
        if (item.name === '开奖历史') {
          item.path = `/lotteryHistory/${this.$route.params.game_code}`
        }
        /*if (item.name === '走势图表') {
          item.path = `/lotteryHistory/${this.$route.params.game_code}`
          item.query = {
            type: 'trend'
          }
        }*/
      })
      this.setOptionList()
    },
    handleClick(item) {
      if (item.name === '走势图表') {
        this.GET_TREND({
          game_code: this.$route.params.game_code,
          type: 1
        }).then(res => {
          if(res.result){
            window.location.replace(res.data)
          }else{
            this.$parent.gameOptionShow = false
            Vue.$vux.toast.text('请登录正式账号操作')
          }
        })
        return
      }
      if (item.path) {
        this.$router.push({
          path: item.path,
          query: item.query
        })
      }
      if (item.name === '切换彩种') {
        this.$parent.gameOptionShow = false
        this.$emit('showLotteryToggle')
      }
    },
    setOptionList() {
      // 快乐彩，六合彩，pc蛋蛋
      if (
        ['kl8', 'six', 'lucky28'].includes(
          this.$store.state.game.currentGameInfo.type
        )
      ) {
        this.currentOptionList = this.optionList.filter(
          item => item.name !== '走势图表'
        )
        console.log(this.currentOptionList)
      } else {
        this.currentOptionList = this.optionList
      }
    }
  },
  watch: {
    gameOptionShow: function() {
      this.setOptionList()
    }
  }
}
</script>

<style scoped>
.lottery-game-option-box {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 100;
}
.game-option-box {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 100;
}
.lottery-game-option {
  background-color: #050715;
  border-radius: 3px 0 3px 3px;
  color: white;
  text-align: center;
  position: fixed;
  z-index: 100;
  width: 100px;
  right: 15px;
  top: 40px;
  opacity: 0.9;
}
.game-option-list > li {
	font-size: 15px;
  line-height: 35px;
  border-bottom: solid 0.5px #585c74;
}
.lottery-game-option:after {
  content: '';
  display: block;
  position: absolute;
  width: 0;
  height: 0;
  right: 0;
  top: -10px;
  border-bottom: 10px solid #050715;
  border-left: 8px solid transparent;
  opacity: 0.9;
}

.slide-enter-active,
.slide-leave-active {
  transition: all ease-out 0.2s;
}
.slide-enter,
.slide-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
