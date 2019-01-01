<template>
  <div class="empty" :style="{height:$window.innerHeight-44+'px'}">
    <div>
      <div>
        <img :src="`../../../static/images/home-blue/${emptyPic}@3x.png`" alt="">
      </div>
      <div class="black-level6 empty-intro">
        {{emptyIntro}}
      </div>
      <div v-if="type==='bank'">
        <button class="btn-confirm" @click="handleBtnClick">
          <div>
            <div class="iconfont icon-jiahao1 dib vm"></div>
            添加银行卡
          </div>
        </button>
      </div>

      <div v-if="type==='emptyBet'">
        <button class="btn-confirm" @click="handleBtnClick">
          <div>
            投一注
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['type'],
  data() {
    return {
      emptyIntro: '',
      emptyPic: ''
    }
  },
  created() {
    this.initPage()
  },
  methods: {
    initPage() {
      switch (this.type) {
        case 'bank':
          this.emptyIntro = '您尚未添加银行卡'
          this.emptyPic = 'nobankcard'
          break
        case 'message':
          this.emptyIntro = '暂无消息'
          this.emptyPic = 'nomessage'
          break
        case 'emptyBet':
          this.emptyIntro = '您还没有投注喔'
          this.emptyPic = 'nobet'
          break
        case 'timeout':
          this.emptyIntro = '暂时出了些状况，请稍后再试'
          this.emptyPic = 'timeout'
          break
        case 'emptyList':
          this.emptyIntro = '暂时没有内容'
          this.emptyPic = 'nomessage'
          break
      }
    },
    handleBtnClick() {
      if (this.type === 'bank') {
        this.$router.push({
          path: '/bank/addBankCards'
        })
      }
      if (this.type === 'bet') {
        this.$router.push({
          path: '/lotteryHall'
        })
      }
    }
  }
}
</script>

<style scoped>
.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.empty img {
  width: 120px;
}
.empty-intro {
  margin-top: 22px;
  margin-bottom: 33px;
  font-size: 14px;
  color: #999;
}
.btn-confirm .iconfont {
  font-size: 20px;
  font-weight: bold;
}
</style>
