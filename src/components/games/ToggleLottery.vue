<template>
  <div class="toggle-box" v-show="toggleLotteryShow" @click="$emit('closeToggle')">
    <transition name="scale">
      <div class="toggle-area" v-show="toggleLotteryShow" @click.stop>
        <ul class="game-type-list">
          <li v-for="(item,index) in gameTypeList" :class="{'active':activeTypeTab===index}" @click="activeTypeTab=index;">{{item}}</li>
        </ul>
        <ul class="game-list">
          <li v-for="(item,index) in gameList" :class="{'active':initialTypeTab===activeTypeTab&&activeGameType===index}" @click="toggleLottery(item)">{{item.name}}</li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: ['toggleLotteryShow'],
  data() {
    return {
      initialTypeTab: 0,
      activeTypeTab: 0,
      activeGameType: 0
    }
  },
  computed: {
    gameTypeList: function() {
      return (
        this.$store.state.game.gameInfo.length &&
        this.$store.state.game.gameInfo.map(item => item.name)
      )
    },
    gameList: function() {
      return (
        this.$store.state.game.gameInfo.length &&
        this.$store.state.game.gameInfo[this.activeTypeTab].includes
      )
    }
  },
  mounted() {
    this.initPage()
  },
  methods: {
    initPage() {},
    setActive() {
      // 切换到对应的activeTab上面
      let _this = this
      this.$store.state.game.gameInfo.map((item1, index1) => {
        item1.includes.map((item2, index2) => {
          if (item2.game_code === _this.$route.params.game_code) {
            this.initialTypeTab = index1
            this.activeTypeTab = index1
            this.activeGameType = index2
          }
        })
      })
    },
    toggleLottery(item) {
      this.$emit('toggleLottery', item)
    }
  },
  watch: {
    toggleLotteryShow() {
      this.setActive()
    }
  }
}
</script>

<style scoped>
.toggle-box {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}
.toggle-area {
  width: 300px;
  height: 265px;
  border-radius: 4px;
  font-size: 15px;
  text-align: center;
  display: flex;
  background-color: white;
  overflow: hidden;
}
.game-type-list {
  width: 110px;
  background-color: #f0f2f5;
  color: #666;
  overflow-y: auto;
}
.game-type-list > li.active {
  background-color: white;
  position: relative;
  color: #333;
}
.game-type-list > li.active:after {
  content: '';
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
}
.game-list {
  width: 190px;
  overflow-y: auto;
  font-size: 15px
}
.game-type-list > li {
  line-height: 45px;
}
.game-list > li {
  line-height: 45px;
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
</style>
