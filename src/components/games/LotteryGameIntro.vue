<template>
  <div>
    <div class="lottery-game-content-top">
      <div class="lottery-game-main-intro black-level5">
        <div>{{$store.state.game.playInfo.remark}}</div>
      </div>
      <div class="theme-color game-intro-text" @click="toggleBoundBoxShow(true, $store.state.game.playInfo)" v-show="$store.state.game.playInfo">
        玩法提示
      </div>
      <div class="lottery-game-main-random" @click="generateRandomBet(1)">
        <button class="btn btn-random1">机选</button>
      </div>
    </div>
    <div v-show="checkListShow">
      <ul class="check-box-list">
        <li v-for="(item,index) in checkList" class="check-box-item" :class="{'checked':item.checked}" @click="toggleChecked(item,index)">
          <div class="check-box">
            <i class="iconfont icon-gouxuan" v-show="item.checked"></i>
          </div>
          <div class="check-box-label">{{item.title}}位</div>
        </li>
      </ul>
    </div>
    <BoundLayer title="玩法提示" :content="playContent" :boundBoxShow="boundBoxShow" @toggleBoundBoxShow="toggleBoundBoxShow" />
  </div>
</template>

<script>
import BoundLayer from '../../components/global/boundLayer'
import { ACAlgorithm } from '../../util/lotteryAlgorithmUtil'
import { randomBetSelect } from '../../util/game/randomSelect'
export default {
  components: {
    BoundLayer
  },
  data() {
    return {
      checkList: [
        {
          title: '万',
          checked: false
        },
        {
          title: '千',
          checked: false
        },
        {
          title: '百',
          checked: false
        },
        {
          title: '十',
          checked: false
        },
        {
          title: '个',
          checked: false
        }
      ],
      minCheck: 0,
      boundBoxShow: false,
      checkListShow: false,
      randomBtnList: [],
      content: '',
      playContent: ''
    }
  },
  created() {
    // this.setDefaultCheck()
  },
  methods: {
    toggleBoundBoxShow(bool, content) {
      this.playContent = this.formatRule(content)
      this.boundBoxShow = bool
    },
    formatRule(data = {}) {
      let str1 = data.description || ''
      let str2 = data.example || ''
      let result = `
        <div style="color: #333333;font-weight: bold;margin-left:-7px;">【玩法说明】</div>
        <div style="color: #666666">${str1}</div><br />
        <div style="color: #333333;font-weight: bold;margin-left:-7px;">【中奖说明】</div>
        <div style="color: #666666">${str2}</div>
      `
      return result
    },
    toggleChecked(item, index) {
      let selectedLen = this.checkList.filter(item => item.checked).length
      // 根据玩法类型计算至少应该勾选几个项
      if (item.checked && selectedLen === this.minCheck) {
        return
      }
      item.checked = !item.checked
      let combineNum = ACAlgorithm(
        this.checkList.filter(item => item.checked).length,
        this.minCheck
      )
      let checkedList = _.filter(
        _.map(this.checkList, (item, index) => item.checked && index),
        item => item !== false
      )
      // 设置checkbox的组合数
      this.$store.commit('setCheckListCombineNum', combineNum)
      // 设置checkbox列表
      this.$store.commit('setCheckedList', checkedList)
    },
    setDefaultCheck(playMenuTitle) {
      let navTitle = playMenuTitle.split('-')[0]
      let subNavTitle = playMenuTitle.split('-')[1]

      if (navTitle === '任选二') {
        this.minCheck = 2
      }
      if (navTitle === '任选三') {
        this.minCheck = 3
      }
      if (navTitle === '任选四') {
        this.minCheck = 4
      }
      let start = this.checkList.length - this.minCheck
      this.checkList.map((item, index) => {
        if (index >= start) {
          item.checked = true
        } else {
          item.checked = false
        }
        return item
      })

      if (
        navTitle.indexOf('任选') !== -1 &&
        navTitle !== '任选复式' &&
        navTitle !== '任选胆拖' &&
        navTitle !== '任选单式' &&
        subNavTitle !== '直选复式' &&
        this.$store.state.game.currentGameInfo.type !== 'kl8' &&
        this.$store.state.game.currentGameInfo.position !== -1 &&
        this.$store.state.game.currentGameInfo.type !== 'xync'
      ) {
        this.checkListShow = true
      } else {
        this.checkListShow = false
        this.checkList.map(item => {
          item.checked = false
          return item
        })
      }
    },
    generateRandomBet(num) {
      // 随机选中一个注单
      let randomList = randomBetSelect({ store: this.$store })
      this.$eventBus.$emit('randomSelect', randomList)
      // console.log(this.$store.state.game.betData)
    }
  },
  watch: {
    '$store.state.game.playMenuTitle': function(val, oldVal) {
      this.setDefaultCheck(val)
      let checkedList = _.filter(
        _.map(this.checkList, (item, index) => item.checked && index),
        item => item !== false
      )
      this.$store.commit('setCheckListCombineNum', 1)
      // 设置checkbox列表
      this.$store.commit('setCheckedList', checkedList)
    }
  }
}
</script>


<style scoped>
.lottery-game-content-top {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  padding: 10px;
  padding-bottom: 0;
  line-height: 2.5rem;
}

.lottery-game-main-intro {
  display: flex;
  line-height: 20px;
  align-items: center;
  flex: 1;
  font-size: 12px;
}

.btn {
  line-height: 27px;
  border-radius: 5px;

  color: white;
  border: none;
}

.check-box {
  width: 19px;
  height: 19px;
  border: solid 0.5px #e2e4ef;
  border-radius: 19px;
  transition: all linear 0.2s;
  color: white;
}

.check-box-list {
  display: flex;
  align-items: center;
  padding: 0 5px;
  margin-top: 15px;
}

.check-box-item {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
}

.check-box-label {
  margin-left: 5px;
  color: #555;
  font-size: 12px;
}

.checked .check-box {
  position: relative;
  border: solid 0.5px red;
}
.check-box-list .checked .check-box {
  display: flex;
  align-items: center;
  justify-content: center;
}
.checked .icon-gouxuan {
  font-size: 0.9rem;
  font-weight: bold;
}

.btn.btn-random1,
.game-intro-text {
  width: 54px;
  font-size: 12px;
  font-weight: bold;
}
.game-intro-text {
  margin-left: 5px;
  word-break: keep-all
}
</style>

