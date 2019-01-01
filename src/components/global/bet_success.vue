<template>
  <transition name="zoom">
    <div
      class="mask-layer"
      v-if="show"
    >
      <div class="bet-success-box">
        <div
          class="close-btn"
          @click="$emit('cancel')"
        ></div>
        <h3>恭喜您，投注成功！</h3>
        <div class="bet-detail">
          共<span>{{(parseInt(bingeNum)?bingeNum:1)*totalBetNum}}</span>注 合计<span>{{(parseInt(bingeNum)?bingeNum:1)*totalBetMoney}}</span>元
        </div>
        <div class="btn-group">
          <button
            type="button"
            class="confirm bg-theme"
            @click="$emit('cancel')"
          >确定</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: ['show', 'totalBetNum', 'totalBetMoney', 'bingeNum'],
  data() {
    return {}
  },
  created() {},
  components: {},
  watch: {}
}
</script>

<style scoped>
.zoom-enter-active,
.zoom-leave-active {
  transition: all ease-out 0.2s;
}
.zoom-enter,
.zoom-leave-to {
  transform: scale(0.8, 0.8);
  opacity: 0;
}
.bet-success-box {
  height: 233px;
  width: 300px;
  background: #fff;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 30px 22px 20px;
  position: relative;
}
.bet-success-box .close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 20px;
  height: 20px;
  background: url('/static/images/icon/close-icon.png') no-repeat center center;
  background-size: contain;
}
.bet-success-box h3 {
  font-size: 24px;
  text-align: center;
  color: #252525;
  margin: 20px 0;
}
.bet-success-box .bet-detail {
  text-align: center;
  font-size: 19px;
  color: #da1d1d;
}

.btn-group {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
}

.btn-group button {
  border: none;
  outline: none;
}

.confirm {
  width: 154px;
  height: 40px;
  line-height: 40px;
  border-radius: 40px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  margin-top: 30px;
}

.confirm {
  color: #ffffff;
}
</style>
