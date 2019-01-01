<template>
  <div
    class="my-bankcard-container"
    v-show="hasLoadData"
  >
    <x-header :left-options="{backText: ''}">{{$route.query.from==='bankcardManage'?'我的银行卡':'提现申请'}}</x-header>
    <div style="margin-top:44px">
      <div v-show="hasBank">
        <div
          class="white-bg card-swiper"
          v-if="bankCardList.length"
        >
          <!-- <swiper :options="swiperOption" v-model="activeCardIndex">
            <swiper-slide v-for="(item,index) in bankCardList" :key="index">
							<div>{{item}}</div>
              <BankCard :cardData="item" />
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper> -->

          <popup-radio
            id="a"
            style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:20;opacity: 0"
            :options="selectList"
            v-model="activeCard"
          >
            <p
              slot="popup-header"
              class="chooseBank"
            >选择银行</p>
          </popup-radio>
          <BankCard :cardData="selectItem(activeCard)" />
          <div class="rightBtn"></div>
        </div>
        <div class="white-bg mt10">
          <div class="transfer-input-box">
            <div class="fw500">提现金额</div>
            <div class="transfer-input-main">
              <div class="money-icon">￥</div>
              <div>
                <input
                  type="text"
                  :placeholder="`输入提现金额 最低金额${minWithdrawMoney}元`"
                  v-model="withdrawMoney"
                  @keyup="checkDisabled"
                  onkeyup="value=value.replace(/[^\d]/g,'')"
                />
              </div>
              <div style="font-size:17px;color:red;font-weight:bold">元</div>
            </div>
          </div>
        </div>
        <div class="withdraw-intro white-bg mt10">
          <div>
            <span class="fs14">可提现金额:</span>
            <span class="avail-money fs14">{{$store.getters.balance}}元</span>
          </div>
          <div
            class="withdraw-all fs12"
            @click="withdrawMoney=Math.floor($store.getters.balance);"
          >全部提现</div>
        </div>
        <div class="withdraw-pwd">
          <div class="fs14">
            提现密码
          </div>
          <div class="number-list-box">
            <InputNumberList
              type="password"
              @change="handlePwdChange"
              :numberLen="pwdLen"
            />
          </div>
        </div>
        <button
          class="btn-confirm"
          :disabled="withdrawDisabled"
          @click="handleWithdraw"
        >立即提现</button>
      </div>
      <div v-show="!hasBank">
        <EmptyPage type="bank" />
      </div>
    </div>
  </div>
</template>

<script>
import { Group, PopupRadio } from 'vux'
import InputNumberList from '../../components/global/InputNumberList'
import BankCard from '../../components/user/BankCard'
import EmptyPage from '../../components/global/EmptyPage'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  components: {
    InputNumberList,
    BankCard,
    swiper,
    swiperSlide,
    EmptyPage,
    PopupRadio,
    Group
  },
  data() {
    return {
      pwdValidator: function(val) {
        return {
          valid: '',
          msg: ''
        }
      },
      withdrawMoney: '',
      bankCardList: [],
      selectList: [],
      swiperOption: {
        pagination: {
          el: '.swiper-pagination'
        },
        spaceBetween: 20
      },
      bankcardOptions: [],
      activeCardIndex: '',
      activeCard: '',
      pwdLen: 6,
      pwdList: [],
      withdrawDisabled: true,
      minWithdrawMoney: 100,
      hasBank: false,
      hasLoadData: false
    }
  },
  created() {
    if (!this.$store.state.user.userInfo.isset_withdraw_password) {
      this.$vux.toast.show('请设置提现密码后提现')
      setTimeout(() => {
        this.$router.replace('/user/setWithdrawPwd')
      }, 2000)
    }
    this.initPage()
  },
  methods: {
    ...Vuex.mapActions([
      'GET_USER_BANK_LIST',
      'GET_MEMBER_INFO',
      'WITHDRAW_REQ'
    ]),
    initPage() {
      this.GET_USER_BANK_LIST().then(res => {
        this.hasLoadData = true
        if (res.data.length) {
          this.hasBank = true
        } else {
          this.hasBank = false
        }
        this.bankCardList = res.data
        this.selectList = this.bankCardList.map(item => {
          var obj = {key:item.card_id ,value: item.name}
          return obj
        })
        this.activeCard = this.selectList[0].key
      })
      this.GET_MEMBER_INFO()
    },
    selectItem(name) {
      console.log("name: ", name)
      return this.bankCardList.find(item => {
        return item.card_id === name
      })
    },
    checkDisabled() {
      if (
        this.pwdList.length === this.pwdLen &&
        this.withdrawMoney >= this.minWithdrawMoney
      ) {
        this.withdrawDisabled = false
      } else {
        this.withdrawDisabled = true
      }
    },
    handlePwdChange(val) {
      this.pwdList = val
      // console.log(this.pwdList, val)
      this.checkDisabled(val)
    },
    deleteAllNumber() {
      let inputList = document.querySelector('.number-input-list').children
      for (var i = 0; i < inputList.length; i++) {
        inputList[i].querySelector('input').value = ''
      }
    },
    handleWithdraw() {
      this.activeCardIndex = _.indexOf(_.map(this.bankCardList, function(item){return item.card_id}), this.activeCard)
      let withdrawParams = {
        amount: this.withdrawMoney,
        card_id: this.bankCardList[this.activeCardIndex].card_id,
        withdraw_password: this.pwdList.join('')
      }
      this.WITHDRAW_REQ(withdrawParams)
        .then(res => {
          this.withdrawMoney = ''
          this.deleteAllNumber()
        })
        .catch(res => {
          this.deleteAllNumber()
        })
    }
  }
}
</script>

<style scoped>
.chooseBank {
  text-align: center;
  padding: 8px 0;
  color: #888;
}
.rightBtn {
  width: 18px;
  height: 18px;
  line-height: 16px;
  text-align: center;
  position: absolute;
  right: 10px;
  bottom: 26px;
	background: #fff url('../../../static/images/icon/arrow-right-icon@2x.png') no-repeat;
	background-size: 70%;
	background-position: 3px 3px;
  border-radius: 10px 0 0 10px;
  z-index: 2;
}
.card-swiper {
  position: relative;
  width: 100%;
  height: 90px;
  box-sizing: border-box;
  padding: 10px 12px;
}

.transfer-input-box {
  background-color: white;
  margin-top: 10px;
  padding: 20px 12px 0 12px;
}
.transfer-input-main {
  display: flex;
  padding: 25px 0;
  align-items: center;
}
.transfer-input-main > div:nth-child(2) {
  flex: 1;
}

.transfer-input-main input {
  text-align: center;
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 18px;
  border: none;
}

.money-icon {
  font-size: 29px;
  font-weight: bold;
}
.withdraw-intro {
  line-height: 50px;
  display: flex;
  justify-content: space-between;
  padding: 0 12px;
  color: #252525;
}
.avail-money {
  color: #da1d1d;
  font-size: 14px;
}
.withdraw-all {
  color: #2d7eaa;
  font-size: 12px;
}
.withdraw-pwd {
  background-color: white;
  display: flex;
  margin-top: 10px;
  height: 50px;
  align-items: center;
  padding: 0 12px;
}
.number-list-box {
  margin-left: 15px;
}
</style>

<style>
@import url('../../../static/css/swiper.css');
.card-swiper .swiper-pagination-bullet.swiper-pagination-bullet-active {
  background: #f10215;
  border-radius: 5px;
}

.card-swiper .swiper-pagination-bullet {
  width: 7px;
  height: 7px;
}
.card-swiper .swiper-pagination-fraction,
.card-swiper .swiper-pagination-custom,
.card-swiper .swiper-container-horizontal > .swiper-pagination-bullets {
  bottom: 0;
}
</style>
