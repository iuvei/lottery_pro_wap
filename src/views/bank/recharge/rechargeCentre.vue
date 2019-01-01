<template>
  <div class="recharage-centre-container bg-gray">
    <x-header :left-options="{backText: ''}">充值中心</x-header>
    <group class="recharage-top">
      <cell
        title="用户名："
        value-align="left"
        class="recharage-username"
      >
        <div class="username">{{$store.getters.username}}</div>
        <div class="balance">余额：
          <span>{{$store.getters.balance}}</span>元</div>
      </cell>
    </group>
    <group title="在线支付">
      <cell
        :key="item.category_id"
        class="flex-layout"
        value-align="left"
        is-link
        :link="`/bank/${item.code}?code=${item.code}&category_id=${item.category_id}`"
        v-for="item in onlineList"
      >
        <img
         	slot="icon"
          :src="`../../../../static/images/icon/${rechargeInfo[item.code].icon}`"
          alt=""
        >
        <div>{{item.name}}</div>
      </cell>
    </group>
    <group title="线下支付">
      <cell
        :key="item.category_id"
        class="flex-layout"
        value-align="left"
        is-link
        :link="`/bank/${item.code}?code=${item.code}&category_id=${item.category_id}`"
        v-for="item in offlineList"
      >
        <img
          slot="icon"
          :src="`../../../../static/images/icon/${rechargeInfo[item.code].icon}`"
          alt=""
        >
        <div>{{item.name}}</div>
      </cell>
    </group>
  </div>
</template>

<script>
import { Cell } from 'vux'

import rechargeInfo from '../../../config/rechargeInfo'
export default {
  data() {
    return {
      onlineList: [],
      offlineList: [],
      rechargeInfo
    }
  },
  components: {
    Cell
  },
  created() {
    this.initPage()
  },
  methods: {
    ...Vuex.mapActions(['GET_RECHARGE_LIST']),
    initPage() {
      this.GET_RECHARGE_LIST().then(res => {
        this.onlineList = res.data.online
        this.offlineList = res.data.offline
        console.log(res.data.online)
      })
    }
  }
}
</script>

<style scoped>
.vux-header {
  position: relative;
}
img {
  width: 23px;
}
.recharage-top {
  margin-top: -20px;
}
.recharage-top span {
  color: red;
}
.recharage-top div {
  color: #252525;
}
.recharage-username {
  height: 40px;
  font-weight: 700;
  box-sizing: border-box;
}
.recharage-username .balance {
  font-weight: 500;
}
.flex-layout img,
.flex-layout div {
  display: flex;
  align-items: center;
}
.flex-layout div {
  color: #000;
  height: 30px;
  padding-left: 12px;
}
</style>
<style>
.recharage-centre-container .weui-cells {
  color: #333;
  font-size: 14px;
}
</style>

