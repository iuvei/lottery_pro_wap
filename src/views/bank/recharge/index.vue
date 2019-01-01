<template>
  <div>
    <div v-if="rechargeType==='online'">
      <onlinePay />
    </div>
    <div v-if="rechargeType==='offline'">
      <offlinePay />
    </div>
  </div>
</template>

<script>
const onlinePay = () => import('./onlinePay.vue')
const offlinePay = () => import('./offlinePay.vue')
import rechargeInfo from '../../../config/rechargeInfo'
export default {
  components: {
    onlinePay,
    offlinePay
  },
  data() {
    return {
      rechargeType: ''
    }
  },
  created() {
    this.loadRechargeTpl()
  },
  methods: {
    loadRechargeTpl() {
      let { code } = this.$route.query
      this.rechargeType = rechargeInfo[code].type
    }
  }
}
</script>

<style scoped>
</style>
