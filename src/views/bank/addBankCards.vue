<template>
	<div class="add-bank-card">
		<x-header :left-options="{backText: ''}">添加银行卡</x-header>
		<div style="margin-top:46px">
			<group>
				<popup-picker title="选择银行" placeholder="点击选择银行" confirm-text="确定" :data="lotteryNameList" v-model="lotteryName" @on-change="handleBankChange"></popup-picker>
			</group>
			<group><x-input title="卡号" label-width="5em" :is-type="cardValidator" required type="text" placeholder="输入卡号" v-model="cardNumber1" :min="16" :max="21" @on-change="handleCardChange"></x-input>
				<x-input title="确认卡号" :is-type="cardValidator" required type="text" placeholder="确认输入卡号" v-model="cardNumber2" :min="16" :max="21" @on-change="handleCardChange" :equal-with="cardNumber1"></x-input>
				<x-input title="开户地址" required type="text" placeholder="确认输入开户地址" v-model="accountAdress" @on-change="handleAddressChange"></x-input>
			</group>
		</div>
			<button class="btn-confirm" :disabled="addDisabled" @click="addCard">确认添加</button>
	</div>
</template>

<script>
import { PopupPicker, Group } from 'vux'

export default {
  components: {
    PopupPicker,
    Group
  },
  data() {
    return {
      lotteryName: ['点击选择银行'],
      lotteryNameList: [[]],
      cardNumber1: '',
      cardNumber2: '',
      accountAdress: '',
      cardValidator: function(val) {
        let regExp = /^\d{16,21}$/
        return {
          valid: regExp.test(val),
          msg: '银行卡卡号应该是16到21位数字'
        }
      },
      bankData: [],
      addDisabled: true,
      addBankParams: {}
    }
  },
  created() {
    this.initPage()
  },
  methods: {
    ...Vuex.mapActions(['GET_AVAIL_BANKLIST', 'ADD_BANK_CARD']),
    initPage() {
      this.GET_AVAIL_BANKLIST().then(res => {
        this.bankData = res.data
        this.lotteryNameList[0].push(...res.data.map(item => item.name))
        console.log(this.lotteryNameList)
      })
    },
    onChange() {},
    handleCardChange(val) {
      if (this.cardNumber1 === this.cardNumber2 && /^\d{16,21}$/.test(val)) {
        this.addBankParams.card_number = val
      }
      this.checkDisabled()
    },
    handleAddressChange(val) {
      this.addBankParams.bank_address = val

      this.checkDisabled()
    },
    checkDisabled() {
      let disabled = !(
        this.cardNumber1 === this.cardNumber2 &&
        /^\d{16,21}$/.test(this.cardNumber1) &&
        this.accountAdress &&
        this.addBankParams.code
      )
      this.addDisabled = disabled
    },
    addCard() {
      this.ADD_BANK_CARD(this.addBankParams).then(res => {
        if (res.result) {
          this.$router.replace({
            path: '/bank/bankCardManage'
          })
        }
      })
    },
    handleBankChange(name) {
      let bankItem = this.bankData.find(item => item.name === name[0])
      this.addBankParams.code = bankItem.code
      this.checkDisabled()
    }
  }
}
</script>

<style>
.add-bank-card .weui-cells {
  font-size: 14px;
}

.add-bank-card .weui-cell_access .weui-cell__ft:after {
  transform: rotate(135deg);
  margin-left: 10px;
  right: 0;
  margin-top: -6px;
}
</style>


<style scoped>
.add-btn {
  width: 200px;
  height: 40px;
  background: linear-gradient(to right, #f10215, #ff3d4c);
  color: #fff;
  font-size: 20px;
  border-radius: 30px;
  border: none;
  margin: 20px auto;
  border: none;
  display: block;
}
.add-btn[disabled] {
  background: #e2e4ef;
}
</style>
