<template>
  <div class="img-verify" @click="loadVerifyImg">
   <img :src="verifySrc" alt="" v-if="verifyShow" @load="handleLoad">
  </div>
</template>

<script>

export default {
  props: ['shouldReload'],
  data() {
    return {
      pool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', // 字符串
      width: 120,
      height: 40,
      verifySrc: 'http://lottery.lebole5.com/index/captcha',
      verifyShow: true
    }
  },
  created() {
    this.loadVerifyImg()
  },
  methods: {
    ...Vuex.mapActions(['GET_VERIFY_DATA']),
    loadVerifyImg() {
      this.GET_VERIFY_DATA().then(res => {
        this.verifyShow = false
        this.verifySrc = `data:image/png;base64, ${res.data.img}`
        this.$emit('getVerifyToken',res.data.key)
        setTimeout(() => {
          this.verifyShow = true
          this.$emit('setReload', false)
        }, 10)
      })
    },
    handleLoad() {
      console.log(document.cookie)
    },
    // 1.随机数
    randomNum(min, max) {
      return parseInt(Math.random() * (max - min) + min)
    },
    // 2.随机颜色
    randomColor(min, max) {
      const r = this.randomNum(min, max)
      const g = this.randomNum(min, max)
      const b = this.randomNum(min, max)
      return `rgb(${r},${g},${b})`
    },
    // 点击图片重新绘制
    handleDraw() {
      this.draw()
    }
  },
  watch: {
    shouldReload: function(val) {
      console.log(val)
      if (val) {
        this.loadVerifyImg()
      }
    }
  }
}
</script>
<style scoped>
.img-verify img {
  height: 100%;
}
</style>
