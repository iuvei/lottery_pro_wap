<template>
  <div class="bankcard-manage-container" v-show="hasLoadData">
    <x-header :left-options="{backText: ''}">银行卡管理</x-header>
    <div v-show="hasBank">
      <ul class="bank-card-list mt10">
        <li class="bankcard-img" @click="bankCardDetail(bank)" v-for="bank in bankCardList">
          <BankCard :cardData="bank" />
        </li>
      </ul>
      <div class="bankcard-manage-btn" @click="addBankCards">
        <x-button class="add-bankcard-btn" action-type="button">
          <div>
            <i class="iconfont icon-jiahao1"></i>
          </div>
          <div>
            添加银行卡
          </div>
        </x-button>
      </div>
    </div>
    <div v-show="!hasBank">
      <NoBankCard />
    </div>
  </div>
</template>

<script>
import { XButton } from 'vux'

import BankCard from '../../components/user/BankCard'
import NoBankCard from '../../components/user/NoBankCard'
export default {
  components: {
    XButton,
    BankCard,
    NoBankCard
  },
  data() {
    return {
      cardNum: ['**** **** **** 0980'],
      bankCardList: [],
      hasLoadData: false,
      hasBank: false
    }
  },
  created() {
    this.initPage()
  },
  methods: {
    ...Vuex.mapActions(['GET_USER_BANK_LIST']),
    initPage() {
      this.GET_USER_BANK_LIST().then(res => {
        this.bankCardList = res.data
        this.hasLoadData = true
        if (res.data.length) {
          this.hasBank = true
        }
      })
    },
    addBankCards() {
      this.$router.push({
        path: '/bank/addBankCards'
      })
    },
    bankCardDetail(bank) {
      this.$router.push({
        path: '/bank/bankCardDetail',
        query: bank
      })
    }
  },
  filters: {
    accountFilter: function(val) {
      return '**** **** **** ' + val.slice(-4)
    }
  }
}
</script>

<style scoped>
.bank-card-list {
  margin-top: 44px;
  padding: 10px 12px;
  background-color: white;
  padding-bottom: 0;
}

.bank-card-list li {
  padding-bottom: 10px;
}
.bankcard-manage-btn {
  padding-top: 20px;
  position: relative;
}
.bankcard-manage-btn .weui-btn {
  width: 240px;
  border-radius: 50px;
	color: #fff;
	padding-left: 20px;
}
.weui-btn:after{
	border:none;
}
.btns > div {
  display: inline-flex;
  justify-content: space-around;
  padding-bottom: 20px;
  margin: 0 10px;
  background-color: #fff;
}
.add-bankcard-btn {
	line-height: 40px;
	border: none!important;
}
.add-bankcard-btn .iconfont {
  font-size: 22px;
}
.add-bankcard-btn > div {
  display: inline-flex;
  vertical-align: middle;
}
</style>

