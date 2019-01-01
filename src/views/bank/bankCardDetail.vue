<template>
  <div class="bankcard-detail-container">
    <x-header :left-options="{backText: ''}">银行卡详情</x-header>
    <div class="card-box">
      <BankCard :cardData="cardData" />
    </div>
    <div class="button bankcard-detail-btn">
      <button class="btn-confirm" @click="unbindBank">解除绑定</button>
    </div>
  </div>
</template>

<script>

import { XButton, Group } from 'vux'
import BankCard from '../../components/user/BankCard'
export default {
  components: {
    BankCard,
    XButton,
    Group
  },
  data() {
    return {
      cardData: {}
    }
  },
  created() {
    this.cardData = { ...this.$route.query }
  },
  methods: {
    ...Vuex.mapActions(['UNBIND_BANK']),
    unbindBank() {
      this.UNBIND_BANK({ card_id: this.$route.query.card_id }).then(res => {
        if (res.result) {
          this.$router.replace({
            path: '/bank/bankCardManage'
          })
        }
      })
    }
  }
}
</script>

<style>
.bankcard-detail-container .weui-cells {
  font-size: 14px;
}
</style>

<style scoped>
.card-box {
  margin-top: 44px;
  backgrond-color: white;
  padding: 10px 12px;
}
</style>

