<template>
  <div class="bank-box">
    <div class="card-intro">
      <div class="bankcard-wrap">
        <img
          :src="`../../../static/images/bank/${cardData.code}-icon@3x.png`"
          alt=""
          class="bank-icon"
        >
      </div>
      <div class="card-text">
        <div class="fs14 fw500">
          {{cardData.name}}
        </div>
        <div class="fs12">
          {{cardData.type||'储蓄卡'}}
        </div>
      </div>
    </div>
    <div class="card-number">
      {{cardData.bank_account}}
    </div>
  </div>
</template>

<script>
export default {
  props: ['cardData']
}
</script>

<style scoped>
.bank-box {
  width: 100%;
  height: 90px;
  background: url('../../../static/images/imgs/bankcard-background@2x.png')
    no-repeat center center;
  background-size: cover;
  border-radius: 7px 7px 0 0;
  padding: 16px 17px 12px 12px;
  box-sizing: border-box;
  z-index: 3;
}
.bank-icon {
  width: 34px;
  height: 34px;
  vertical-align: middle;
}
.card-text {
  color: white;
  margin-left: 10px;
}
.card-intro {
  display: flex;
  align-items: center;
}
.card-number {
  text-align: right;
  color: white;
  font-weight: bold;
  font-size: 17px;
}
.bankcard-wrap {
  width: 34px;
  height: 34px;
  border-radius: 34px;
  background-color: white;
  text-align: center;
}
.bankcard-wrap > img {
  max-width: 100%;
  vertical-align: middle;
}
</style>
