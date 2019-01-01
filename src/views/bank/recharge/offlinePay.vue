<template>
  <div class="fs14 offline-pay">
    <div>
      <x-header :left-options="{backText: ''}">{{rechargeInfo[$route.query.code].name}}</x-header>
    </div>
    <div class="recharge-main">
      <div>
        <div class="group-list-title">
          收款方式
        </div>
        <div>
          <ul class="group-list">
            <li>
              <div class="group-item-title">
                收款人:
              </div>
              <div class="group-item-content">
                {{receiveName}}
              </div>
              <button class="btn-copy" v-clipboard:copy="'长治县西申家庄新生活化妆品'" v-clipboard:success="handleCopySuccess" v-clipboard:error="handleCopyError">复制</button>
            </li>
            <li>
              <div class="group-item-title">
                账号:
              </div>
              <div class="group-item-content">
                {{receiveAccount}}
              </div>
              <button class="btn-copy" v-clipboard:copy="'支付时请备注会员账号!'" v-clipboard:success="handleCopySuccess" v-clipboard:error="handleCopyError">复制</button>
            </li>
            <li>
              <div class="group-item-title">
                银行:
              </div>
              <div class="group-item-content">
                {{bankName}}
              </div>
            </li>
          </ul>
        </div>
        <div class="qr-img"><!--qrcode-->
          <qrcode value="qrcode" type="img"></qrcode>
        </div>
      </div>
    </div>
    <div>
      <div class="group-list-title">
        付款账户
      </div>
      <div>
        <ul class="group-list">
          <li>
            <div class="group-item-title">
              账户名称:
            </div>
            <div class="group-item-content">
              <input type="text" placeholder="请输入与转账账户一直的真实姓名" v-model="nick_name" />
            </div>
          </li>
          <li>
            <div class="group-item-title">
              存款金额:
            </div>
            <div class="group-item-content">
              <input type="number" placeholder="请输入存款金额" min="0" onkeyup="this.value=this.value.replace(/\D|^0/g,'')" v-model="amount" />
            </div>
          </li>
          <li>
            <div class="group-item-title">
              交易单号:
            </div>
            <div class="group-item-content">
              <input type="number" placeholder="请输入交易单号后四位" v-model="trans_number" />
            </div>
          </li>
          <li>
            <div class="group-item-title">
              汇款日期:
            </div>
            <div class="group-item-content">
              <group>
                <datetime disabled v-model="datetime" format="YYYY-MM-DD HH:mm" :start-date="startDate"></datetime>
              </group>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <button class="btn-confirm" :disabled="!rechargeble" @click="handleOfflinePay">确认存款</button>
  </div>
</template>


<script>
import rechargeInfo from '../../../config/rechargeInfo'
import { Datetime, dateFormat, Qrcode} from 'vux'

export default {
  components: {
    Datetime,Qrcode
  },
  data() {
    return {
      rechargeInfo,
      startDate: '',
      nick_name: '',
      amount: '',
      trans_number: '',
      datetime: '',
      receiveName: '',
      receiveAccount: '',
      bankName: '',
      qrcode: '',
      amountLimit:{
        min: "10",
        max: "100",
      }
    }
  },
  computed: {
    rechargeble: function() {
      return this.nick_name && this.amount && this.trans_number && this.datetime
    }
  },
  created() {
    this.datetime = this.startDate = dateFormat(new Date(), 'YYYY-MM-DD HH:mm')
    this.getRechargeList();

  },
  methods: {
    ...Vuex.mapActions(['OFFLINE_PAY','GET_RECHARGE_CHANNEL_LIST', 'GET_RECHARGE_LIST']),
    handleCopySuccess() {
      this.$vux.toast.show({
        type: 'success',
        text: '复制成功',
        time: 500
      })
    },
    handleCopyError() {
      this.$vux.toast.show({
        type: 'success',
        text: '复制失败',
        time: 500
      })
    },
    handleOfflinePay() {
      this.OFFLINE_PAY({
        id: this.$route.query.category_id,
        nick_name: this.nick_name,
        amount: this.amount,
        trans_number: this.trans_number,
        datetime: this.datetime
      }).then(res => {
        console.log(res)
      })
    },
    getRechargeList(){
      this.GET_RECHARGE_LIST({
      }).then(res => {
        this.rechargeList = res.data
        this.getRechargeChannelList(res.data.offline[0])
      })
        .catch(err => {
          this.verifyCodeShouldReload = true
        })
    },
    getRechargeChannelList(channel){
      this.GET_RECHARGE_CHANNEL_LIST({
        category_id: channel.category_id,
        type: this.switchTxt === 'online'?"0":"1"
      }).then(res => {
        this.receiveName = res.data[0].account_name
        this.receiveAccount = res.data[0].account
        this.bankName = res.data[0].address
        this.qrcode = res.data[0].qrcode_url
        this.amountLimit.max = res.data[0].max
        this.amountLimit.min = res.data[0].min
      })
        .catch(err => {
          this.verifyCodeShouldReload = true
        })
    },
  }
}
</script>

<style scoped>
.recharge-main {
  margin-top: 44px;
}
.group-list > li {
  display: flex;
  height: 50px;
  line-height: 50px;
  padding: 0 15px 0 12px;
  border-bottom: solid 0.5px #e2e4ef;
  background-color: white;
  font-size: 14px;
  align-items: center;
}
.group-list > li > div:first-child {
  width: 70px;
}
.group-list > li:last-child {
  border-bottom: none;
}
.group-list > li > div:nth-child(2) {
  flex: 1;
}
.group-list-title {
  line-height: 40px;
  color: #252525;
  padding-left: 12px;
  font-size: 14px;
}
.group-item-title {
  font-size: 14px;
  color: #555;
}
.qr-img {
  text-align: center;
  padding: 10px;
}
.qr-img > img {
  width: 150px;
}
.group-item-content input {
  width: 100%;
  height: 48px;
  line-height: 48px;
  border: none;
  outline: none;
}

.recharge-btn {
  background: linear-gradient(to right, #f10215, #ff3d4c);
  border: none;
  color: white;
  line-height: 40px;
  width: 240px;
  border-radius: 40px;
  margin: 20px auto 20px auto;
  display: block;
}
.recharge-btn[disabled] {
  background: #e2e4ef;
}
.btn-copy {
  background-color: white;
  width: 70px;
  height: 28px;
  border-radius: 3px;
}
</style>

<style>
.recharge-main .vux-datetime {
  color: #999;
}

.offline-pay .vux-no-group-title {
  margin-top: 0;
}
.offline-pay .weui-cell {
  padding-right: 0;
  padding-left: 0;
}
.offline-pay .weui-cell_access .weui-cell__ft {
  display: flex;
}

.offline-pay .weui-cell_access .weui-cell__ft:after {
  border-width: 0px 2px 2px 0px;
  right: 4px;
}
</style>
