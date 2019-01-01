<template>
  <div class="lottery-rank-box">
    <div class="lottery-rank-title">
      最新中奖榜单
    </div>
    <div class="scroll-box">
      <scroll :data="listData" :class-option="optionSingleHeight" class="seamless-wrap">
        <ul class="lottery-rank-list">
          <li v-for="item in listData">
            <div>
              <span class="yellow">恭喜</span>
              <span class="user-name">{{item.username|formatName}}</span>
            </div>
            <div class="lottery-name">{{item.game_name}}</div>
            <div class="lottery-money">喜中{{item.winning_amount}}元</div>
          </li>
        </ul>
      </scroll>
    </div>
  </div>
</template>
<script>
import Scroll from 'vue-seamless-scroll'

export default {
  components: {
    Scroll
  },
  data() {
    return {
      listData: [],
      rows: 30
    }
  },
  computed: {
    optionSingleHeight() {
      return {
        singleHeight: 30,
        openTouch: false
      }
    }
  },
  created() {
    this.GET_LOTTERY_RANK_LIST({
      rows: this.rows
    }).then(res => {
      console.log(res)
      this.listData = res.data.list
    })
  },
  methods: {
    ...Vuex.mapActions(['GET_LOTTERY_RANK_LIST'])
  },
  filters: {
    formatName(name) {
      return '******' + name.slice(-3)
    }
  }
}
</script>

<style scoped>
.scroll-box {
  padding: 10px;
  box-shadow: 0px 2px 2px #e8eaf2bd;
}
.lottery-rank-box {
  background-color: white;
  margin: 10px 0;
  border-radius: 4px;
  font-size: 14px;
}
.lottery-rank-title {
  height: 42px;
  font-size: 14px;
  color: #333;
  padding: 0 12px;
  line-height: 42px;
  border-bottom: solid 0.5px #ebe8f5;
  font-weight: 500;
}

.seamless-wrap {
  height: 180px;
  overflow: hidden;
}
.lottery-rank-list > li {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
}

.lottery-rank-list > li > div {
  text-align: left;
}

.lottery-rank-list > li > div:nth-child(2) {
  text-align: center;
}

.lottery-rank-list > li > div:last-child {
  text-align: right;
}

.lottery-rank-box .yellow {
  color: #ff8400;
}
.user-name {
  color: #999;
}
.lottery-name {
  color: #666;
}
.lottery-money {
  color: #f10215;
}
</style>

