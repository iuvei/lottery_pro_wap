<template>
  <div class="no-bank" :style="{height:$window.innerHeight-44+'px'}">
    <div>
      <div>
        <img src="../../../static/images/home-blue/nobankcard@3x.png" alt="">
      </div>
      <div class="black-level6 no-bank-intro">您尚未添加银行卡</div>
      <div>
        <button class="btn-confirm" @click="addBank">
          <div>
            <div class="iconfont icon-jiahao1 dib vm"></div>
            添加银行卡
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    addBank() {
      this.$router.push({
        path: '/bank/addBankCards'
      })
    }
  }
}
</script>

<style scoped>
.no-bank {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.no-bank img {
  width: 120px;
}
.no-bank-intro {
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
