<template>
  <div class="onlinePay-container">
    <x-header :left-options="{backText: ''}">{{rechargeInfo[$route.query.code].name}}</x-header>
    <div
      class="recharge-top"
      :class="{'have-bank-list':$route.query.code==='quickpay'}"
    >
      <div>
        <img
          class="onlinePayLogo"
          :src="`../../../../static/images/imgs/${rechargeInfo[$route.query.code].paybg}`"
          alt=""
        >
      </div>
      <div
        class="select-bank-card"
        v-show="$route.query.code==='quickpay'"
      >
        <group label-width="5em">
          <popup-picker
            :title="'银行:'"
            :data="bankList"
            confirm-text="确定"
            v-model="bankName"
            @on-show="onShow"
            @on-hide="onHide"
            @on-change="onChange"
          >
          </popup-picker>
        </group>
      </div>
    </div>
    <div class="recharge-main">
      <div v-show="$route.query.code!=='quickpay'">
        <div>
          <ul class="recharge-channel-list">
            <li
              v-for="(item,index) in rechargechannelList"
              :class="{'recharge-channel-item-active':index===activeChannelIndex}"
              @click="handleChannelChange(index)"
            >{{item.name}}</li>
          </ul>
        </div>
        <div class="recharge-channel-intro">
          若充值失败,请更换其他通道重试
        </div>
      </div>
      <div>
        <div class="recharge-input-box">
          <div>
            ￥
          </div>
          <div class="recharge-input-main">
            <input
              type="number"
              v-model="rechargeMoney"
              inputmode="numeric"
              pattern="[0-9]*" onkeyup="this.value=this.value.replace(/\D|^0/g,'')"
              placeholder="请输入充值金额"
            >
          </div>
          <div @click="rechargeMoney='';activeMoneyIndex=null">
            <i class="iconfont icon-jiahao"></i>
          </div>
        </div>
        <div class="money-limit-intro">
          单笔下限{{rechargeMin}},单笔上限{{rechargeMax}}
        </div>
      </div>
      <div>
        <ul class="money-list">
          <li
            v-for="(item,index) in moneyList"
            @click="setSelected(item,index)"
            :class="{'active':index===activeMoneyIndex}"
          >{{item}}</li>
        </ul>
      </div>
    </div>
    <div>
      <button
        class="btn-confirm"
        :disabled="!rechargeMoney"
        @click="handleRecharge()"
      >确认充值</button>
    </div>
  </div>
</template>

<script>
import { PopupPicker } from 'vux'

import rechargeInfo from '../../../config/rechargeInfo'
export default {
  data() {
    return {
      rechargeInfo,
      rechargechannelList: [],
      moneyList: [51, 102, 301, 503, 801, 1003, 2002, 3001],
      rechargeMoney: '',
      activeChannelIndex: 0,
      bankName: ['招商银行'],
      bankList: [
        ['招商银行', '建设银行', '工商银行', '北京银行', '中国银行', '交通银行']
      ],
      rechargeMin: '',
      rechargeMax: '',
      activeMoneyIndex: null
    }
  },
  components: {
    PopupPicker
  },
  created() {
    this.initPage()
  },
  methods: {
    ...Vuex.mapActions(['GET_RECHARGE_CHANNEL_LIST']),
    initPage() {
      let { category_id } = this.$route.query
      this.GET_RECHARGE_CHANNEL_LIST({
        category_id,
        type: '0'
      }).then(res => {
        console.log(res)
        this.rechargechannelList = res.data
        this.setRechargeRange()
      })
    },
    onShow() {},
    onHide(type) {},
    onChange(val) {},
    setRechargeRange() {
      this.rechargeMin = this.rechargechannelList[this.activeChannelIndex].min
      this.rechargeMax = this.rechargechannelList[this.activeChannelIndex].max
    },
    handleChannelChange(index) {
      this.activeChannelIndex = index
      this.setRechargeRange()
    },
    setSelected(item, index) {
      this.rechargeMoney = item
      this.activeMoneyIndex = index
    },
    handleRecharge() {
      let rechargeUrl = unescape(this.rechargechannelList[0].url)
      console.log(rechargeUrl, typeof rechargeUrl)
      this.$router.push({
        path: '/bank/onlinePayJump',
        query: {
          url: rechargeUrl,
          pay: this.rechargechannelList[0].id,
          username: this.$store.state.user.userInfo.username,
          amount: this.rechargeMoney
        }
      })
      // location.href =
      //   this.rechargechannelList[0].url +
      // '?pay=' +
      // this.rechargechannelList[0].id +
      // '&username=' +
      // this.$store.state.user.userInfo.username +
      // '&amount=' +
      // this.rechargeMoney
    }
  }
}
</script>

<style scoped>
.vux-header {
  position: relative;
}
.recharge-top {
  background-color: white;
  min-height: 82px;
}

.recharge-top:not(.have-bank-list) {
  display: flex;
  justify-content: center;
  align-items: center;
}

.recharge-top.have-bank-list > div:first-child {
  padding-top: 14px;
}
.recharge-main {
  padding: 12px 23px;
  background-color: white;
  margin-top: 10px;
}
.onlinePayLogo {
  width: 150px;
  display: block;
  margin: 0 auto;
}
.recharge-btn {
  background: linear-gradient(to right, #f10215, #ff3d4c);
  border: none;
  color: white;
  line-height: 40px;
  width: 240px;
  border-radius: 40px;
  margin: 20px auto 0 auto;
  display: block;
}
.recharge-channel-list,
.money-list {
  display: flex;
  flex-wrap: wrap;
  text-align: center;
}

.recharge-channel-list > li,
.money-list > li {
  border: solid 0.5px #e2e4ef;
  box-sizing: border-box;
  background-color: white;
  border-radius: 4px;
}
.money-list > li.active {
  color: white;
}
.recharge-channel-list > li {
  width: calc(50% - 5px);
  line-height: 34px;
}
.recharge-channel-list > li:nth-child(2n-1) {
  margin-right: 10px;
}
.money-list > li {
  width: calc(25% - 7.5px);
  margin-right: 10px;
  box-sizing: border-box;
  margin-bottom: 10px;
  line-height: 40px;
}
.money-list > li:nth-child(4n) {
  margin-right: 0;
}
.recharge-channel-intro {
  font-size: 11px;
  color: #555;
  margin-top: 10px;
  margin-bottom: 20px;
}
.money-limit-intro {
  font-size: 11px;
  color: #f10215;
  margin-top: 12px;
  margin-bottom: 10px;
}
.recharge-input-box {
  line-height: 50px;
  border: solid 0.5px #e2e4ef;
  border-radius: 3px;
  display: flex;
  height: 50px;
}

.recharge-input-box > div {
  width: 40px;
  text-align: center;
  font-size: 18px;
}

.recharge-input-box > div:first-child {
  color: #555;
  font-size: 22px;
}

.recharge-input-box .iconfont {
  display: block;
  font-size: 25px;
  transform: rotate(45deg);
  color: #e2e4ef;
}

.recharge-input-main {
  flex: 1;
}
.recharge-input-main input {
  width: 100%;
  height: 50px;
  line-height: 50px;
  border: none;
  outline: none;
  text-align: left;
  font-size: 14px;
}
.recharge-btn[disabled] {
  background: #e2e4ef;
}
.have-bank-list {
}
</style>
