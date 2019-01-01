<template>
  <div class="dice-box">
    <div v-if="title==='三军'" class="dice-sanjun">
      <img :src="`../../../../static/images/icon/dice-${dicePoint}@3x.png`" alt="" class="dice-pic">
    </div>
    <div v-if="title==='围骰'" class="dice-weishai">
      <img v-for="i in 3" :src="`../../../../static/images/icon/dice-${dicePoint}@3x.png`" alt="" class="dice-pic">
    </div>
    <div v-if="title==='全骰'" class="dice-quanshai">
      <div v-for="x in 3" class="dice-quanshai-row">
        <img v-for="i in 6"  :src="`../../../../static/images/icon/dice-${i}@3x.png`" alt="" class="dice-pic">
      </div>
    </div>
    <div v-if="title==='长牌'" class="dice-changpai">
      <img :src="`../../../../static/images/icon/dice-${dicePoint.split(',')[0]}@3x.png`" alt="" class="dice-pic">
      <img :src="`../../../../static/images/icon/dice-${dicePoint.split(',')[1]}@3x.png`" alt="" class="dice-pic">
    </div>
    <div v-if="title==='短牌'" class="dice-duanpai">
      <img v-for="i in 2" :src="`../../../../static/images/icon/dice-${dicePoint}@3x.png`" alt="" class="dice-pic">
    </div>
  </div>
</template>

<script>
export default {
  props: ['title', 'dicePoint']
}
</script>

<style scoped>
.dice-pic {
  width: 22px;
  height: 22px;
}
.dice-weishai {
  display: flex;
  justify-content: space-around;
}
.dice-box > .dice-quanshai {
  flex-wrap: wrap;
  height: auto;
}
.dice-quanshai-row {
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;
  width: 100%;
}
.dice-quanshai-row:last-child {
  margin-bottom: 0;
}
.dice-box > div {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px 0;
}
.dice-changpai > img:first-child,
.dice-duanpai > img:first-child {
  margin-right: 3px;
}
.dice-weishai > img:nth-child(2) {
  margin: 0 3px;
}
</style>
