<template>
  <div class="transfer-box">
    <x-header :left-options="{backText: ''}">额度转换</x-header>
    <div>
      <div>
        <ul class="money-transfer-list">
          <li v-for="item in moneyList">
            <div>{{item.money}}</div>
            <div>{{item.title}}</div>
          </li>
        </ul>
      </div>
      <div>
        <group label-width="5em">
          <popup-picker title="转出" :data="transferOutTypeList" confirm-text="确定" v-model="outName" @on-change="handleSelectorChange">
          </popup-picker>
          <popup-picker title="转入" :data="transferInTypeList" confirm-text="确定" v-model="inName" @on-change="handleSelectorChange">
          </popup-picker>
        </group>
      </div>
      <div class="transfer-input-box">
        <div>转换额度</div>
        <div class="transfer-input-main">
          <div class="money-icon">￥</div>
          <div>
            <input type="text" placeholder="请输入整数金额"  onkeyup="this.value=this.value.replace(/\D|^0/g,'')"/>
          </div>
          <div style="font-size:17px;color:red;font-weight:bold">元</div>
        </div>
      </div>
      <div>
        <button class="btn-confirm">确定转换</button>
        <button class="collect-btn" @click="collect">一键归集</button>
      </div>
    </div>

    <confirm title="一键归集" v-model="confirmShow" @on-confirm="onConfirm" @on-cancel="onCancel" cancel-text="取消">
      <p style="text-align:center;">您所有游戏余额将归集至彩票余额</p>
    </confirm>
  </div>
</template>

<script>
import { Group, PopupPicker } from 'vux'
export default {
  components: {
    Group,
    PopupPicker
  },
  data() {
    return {
      moneyList: [
        {
          money: 2000,
          title: '彩票余额'
        },
        {
          money: 2000,
          title: '体育余额'
        },
        {
          money: 2000,
          title: '视讯余额'
        },
        {
          money: 2000,
          title: '捕鱼余额'
        },
        {
          money: 2000,
          title: '老虎机余额'
        }
      ],
      transferTypeList: [['彩票', '体育', '视讯', '捕鱼', '老虎机']],
      transferOutTypeList: [[]],
      transferInTypeList: [[]],
      outName: [],
      inName: [],
      confirmShow: false
    }
  },
  created() {
    this.transferOutTypeList = [...this.transferTypeList]
    this.transferInTypeList = [...this.transferTypeList]
  },
  methods: {
    handleSelectorChange() {
      this.transferInTypeList = [
        this.transferTypeList[0].filter(item => item !== this.outName[0])
      ]
      this.transferOutTypeList = [
        this.transferTypeList[0].filter(item => item !== this.inName[0])
      ]
    },
    onConfirm() {},
    onCancel() {},
    collect() {
      this.confirmShow = true
    }
  },
  watch: {
    outName: function() {
      this.handleSelectorChange()
    },
    inName: function() {
      this.handleSelectorChange()
    }
  }
}
</script>

<style scoped>
.money-transfer-list {
  margin-top: 44px;
  text-align: center;
  background-color: white;
  padding: 10px 12px 0 12px;
}
.money-transfer-list > li {
  background-image: url('../../../static/images/icon/transfer-money-bg@3x.png');
  background-size: 100% 100%;
  width: calc(33.3% - 10px);
  margin-right: 10px;
  margin-bottom: 10px;
  height: 64px;
}

.money-transfer-list > li {
  display: flex;
  flex-direction: column;
}

.money-transfer-list > li > div:first-child {
  flex: 2;
  font-size: 17px;
  color: #da1d1d;
  display: flex;
  justify-content: center;
  align-items: center;
}

.money-transfer-list > li > div:last-child {
  flex: 1;
  font-size: 13px;
  color: #252525;
}

.money-transfer-list > li:nth-child(3n) {
  margin-right: 0;
}
.money-transfer-list {
  display: flex;
  flex-wrap: wrap;
}

.transfer-input-box {
  background-color: white;
  margin-top: 10px;
  padding: 20px 12px 0 12px;
}
.transfer-input-main {
  display: flex;
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
  height: 75px;
  font-weight: bold;
  font-size: 14px;
  color: #999;
}
.collect-btn {
  border: none;
  line-height: 40px;
  width: 240px;
  border-radius: 40px;
  display: block;
  background-color: transparent;
  color: #fa2939;
  border: solid 1px #fa2939;
  line-height: 38px;
  margin-left: auto;
  margin-right: auto;
  font-size: 18px;
}

.money-icon {
  font-size: 29px;
  font-weight: bold;
}
</style>

<style>
.transfer-box .weui-dialog__ft > a:first-child {
  order: 1;
}
.transfer-box .weui-dialog__ft > a:last-child {
  order: 2;
}

.transfer-box .weui-label {
  font-size: 14px;
  color: #555;
}

.transfer-box .weui-cell_access .weui-cell__ft:after {
  transform: rotate(135deg);
  margin-left: 10px;
  right: 0;
  margin-top: -6px;
}
</style>

