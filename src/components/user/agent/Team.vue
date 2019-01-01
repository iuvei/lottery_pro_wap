<template>
  <div style="margin-top: -10px">
    <div class="team-tab">
      <div class="btn-group">
        <div class="border-theme text-theme" :class="{'team-tab-active':activeIndex===0}" @click="handleTabChange(0)">
          团队报表
        </div>
        <div class="border-theme text-theme" :class="{'team-tab-active':activeIndex===1}" @click="handleTabChange(1)">
          团队转账
        </div>
      </div>
      <div class="time-range" v-show="activeIndex===0">
        <div class="input-box date-box">
          <datetime placeholder="开始时间" v-model="startTime" @on-change="(time)=>handleTimeChange(time,'start')"
                    :start-date="dateStartMin" :end-date="dateStartMax" format="YYYY-MM-DD" :max-year="2018"
                    year-row="{value}年" month-row="{value}月" day-row="{value}日" hour-row="{value}点"
                    minute-row="{value}分"></datetime>
        </div>
        <div class="black-level6">至</div>
        <div class="input-box date-box">
          <datetime placeholder="结束时间" v-model="endTime" @on-change="(time)=>handleTimeChange(time,'end')"
                    :start-date="dateEndMin" :end-date="dateEndMax" format="YYYY-MM-DD" year-row="{value}年"
                    month-row="{value}月" day-row="{value}日" hour-row="{value}点" minute-row="{value}分"></datetime>
        </div>
      </div>
    </div>
    <div>
      <div v-show="activeIndex===0">
        <ul class="report-list">
          <vue-pull-to :bottom-load-method="bottomPullHandle" :is-top-bounce=false :bottom-config="bottom_config">
            <li v-for="item in reportList" :class="{'active':item.checked}">
              <router-link tag="div" :to="`/user/agent/3/detail?id=${item.user_id}&user=${item.username}`">
                <div class="report-list-left">
                  <div class="user-type">
                    <img :src="`../../../../static/images/icon/${item.is_agent?'agent':'membership'}-icon@3x.png`"
                         alt="">
                  </div>
                  <div class="user-name">{{item.username}}</div>
                </div>
                <div class="report-list-right">
                  <div>
                    <div class="money" :class="{'red-color':item.team_profit > 0}">{{item.team_profit || '0.000'}}
                    </div>
                    <div class="icon-user-type">总盈亏额</div>
                  </div>
                  <div class="icon-triangle" :class="{transform180:item.checked}">
                    <img src="/static/img/arrow-right-icon@3x.6887a96.png" alt="">
                  </div>
                </div>
              </router-link>
            </li>
          </vue-pull-to>
        </ul>
      </div>
      <div v-show="activeIndex===1">
        <div class="team-transfer-top">
          <div class="black-level3 fs14">可用余额</div>
          <div class="fs14 red-color fw500">{{availTransferMoney}}元</div>
        </div>
        <div class="team-tranfer-main">
          <ul class="transfer-list">
            <li>
              <div>下级会员</div>
              <div class="transfer-input-box">
                <input type="text" placeholder="请输入下级会员用户名" v-model="transferName" @keyup="handleNameChange">
              </div>
            </li>
            <li>
              <div>转账金额</div>
              <div class="transfer-input-box">
                <input type="text" placeholder="请输入转账金额" v-model="transferMoney" @keyup="handleMoneyChange"></div>
            </li>
            <li>
              <div>转账说明</div>
              <div class="transfer-input-box">
                <input type="text" disabled placeholder="为下级充值">
              </div>
            </li>
            <li>
              <div>资金密码</div>
              <div>
                <InputNumberList type="password" @change="handlePwdChange" :numberLen="pwdLen"/>
              </div>
            </li>
          </ul>
        </div>
        <button class="btn-confirm" :disabled="transferDisabled" @click="handleMoneyTransfer">转账</button>
      </div>
    </div>
  </div>
</template>

<script>
  import InputNumberList from '../../global/InputNumberList'
  import { initTeamItem } from '../../../assets/js/initTeamList'
  import { Datetime, dateFormat } from 'vux'
  import VuePullTo from 'vue-pull-to/src/vue-pull-to'
  import { TOP_DEFAULT_CONFIG } from '../../../assets/js/pull_config'

  export default {
    components: {
      VuePullTo,
      InputNumberList,
      Datetime
    },
    data() {
      return {
        tab_id: '',
        activeIndex: 0,
        reportList: [],
        pwdLen: 6,
        transferDisabled: true,
        transferName: '',
        transferMoney: '',
        availTransferMoney: '',
        pwdList: [],
        startTime: '',
        endTime: '',
        dateStartMin: '',
        dateStartMax: '',
        dateEndMin: '',
        dateEndMax: '',
        rows: 10,
        page: 1,
        totalPage: 1,
        startVisibility: false,
        endVisibility: false,
        bottom_config: TOP_DEFAULT_CONFIG
      }
    },
    created() {
      this.availTransferMoney = this.$store.getters.balance
      this.initPage()
    },
    methods: {
      ...Vuex.mapActions(['GET_TEAM_REPORT', 'TRANSFER_MONEY_TO_SUB_AGENT']),
      initPage() {
        this.dateStartMax = dateFormat(new Date(), 'YYYY-MM-DD')
        this.dateEndMax = dateFormat(new Date(), 'YYYY-MM-DD')
        this.getTeamReport()
      },
      bottomPullHandle(loaded) {
        if (this.page < this.totalPage) {
          this.page = this.page + 1
          this.getTeamReport(() => { loaded('done') })
        } else {
          this.$vux.toast.show('已加载全部')
          setTimeout(() => {
            loaded('done')
          }, 1000)
        }
      },
      handleTabChange(index) {
        this.activeIndex = index
      },
      handlePwdChange(val) {
        this.pwdList = val
        this.checkTransfer()
      },
      checkTransfer() {
        this.transferDisabled = !(
          this.transferMoney &&
          parseInt(this.transferMoney) <= parseInt(this.availTransferMoney) &&
          this.pwdList.length === this.pwdLen
        )
      },
      handleNameChange() {
        this.checkTransfer()
      },
      handleMoneyChange() {
        this.checkTransfer()
      },
      handleTimeChange(time, type) {
        if (type === 'start') {
          this.dateEndMin = time
        }
        if (type === 'end') {
          this.dateStartMax = time
        }
        this.getTeamReport()
      },
      getTeamReport(callback) {
        this.GET_TEAM_REPORT({
          type: 0,
          date_start: this.startTime,
          date_end: this.endTime,
          rows: this.rows,
          page: this.page
        }).then(res => {
          if (res.data) {
            let totalRows = parseInt(res.data.total_rows)
            let pageSize = parseInt(this.rows)
            this.totalPage = Math.ceil(totalRows / pageSize)
            this.reportList = initTeamItem(res.data.list)
          } else {
            this.totalPage = 1
            this.reportList = []
          }
          callback && callback()
        }).catch(res => {
          callback && callback()
        })
      },
      deleteAllNumber() {
        let inputList = document.querySelector('.number-input-list').children
        for (var i = 0; i < inputList.length; i++) {
          inputList[i].querySelector('input').value = ''
        }
      },
      handleMoneyTransfer() {
        this.TRANSFER_MONEY_TO_SUB_AGENT({
          username: this.transferName,
          amount: this.transferMoney,
          withdraw_password: this.pwdList.join('')
        }).then(res => {
          this.availTransferMoney = res.data.balance
          this.transferName = ''
          this.transferMoney = ''
          this.deleteAllNumber()
        })
      }
    }
  }
</script>

<style scoped>
  .date-box .weui-cell{
		padding:  0 5px;
		font-size: 12px;
  }

  .time-range {
    flex: 0 0 226px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10px;
  }

  .time-range > div:nth-child(2) {
    width: 20px;
		text-align: center;
		font-size: 14px;
  }

  .input-box {
    flex: 0 0 110px;
  }

  .input-box input {
    width: 100%;
  }

  .team-tab {
    position: relative;
    z-index: 10;
    width: 100%;
    height: 50px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    background-color: #f9fbfe;
  }

  .team-tab .btn-group {
    flex: 0 0 126px;
    padding-left: 15px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
  }

  .team-tab .btn-group > div {
    flex: 1;
    height: 27px;
    line-height: 25px;
    box-sizing: border-box;
    text-align: center;
    font-size: 12px;
    background-color: #ffffff;
    color: #666;
  }

  .team-tab .btn-group > div:first-child {
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }

  .team-tab .btn-group > div:last-child {
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    border-left: none;
  }

  .user-type > img {
    width: 40px;
    vertical-align: middle;
  }

  .report-list {
    height: calc(100vh - 234px);
  }

  .report-list li {
    margin-bottom: 10px;
  }
  .report-list li:last-child {
    margin-bottom: 0;
  }

  .report-list li > div:first-child {
    display: flex;
    height: 64px;
    justify-content: space-between;
    padding: 0 15px;
    background-color: white;
    align-items: center;
    position: relative;
    z-index: 2;
  }

  .report-list-left,
  .report-list-right {
    display: flex;
    align-items: center;
  }

  .icon-user-type {
    line-height: 1.2;
    font-size: 12px;
    color: #666666;
    text-align: right;
  }

  .money {
    line-height: 1.2;
    margin-bottom: 8px;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
  }

  .icon-triangle img {
    width: 10px;
  }

  .icon-triangle {
    margin-left: 10px;
  }

  .report-detail-title {
    padding-left: 15px;
    line-height: 50px;
    border-bottom: 0.5px solid #e2e4ef;
    color: #333;
    font-size: 14px;
    font-weight: bold;
  }

  .report-detail-list {
    padding-left: 15px;
    color: #666;
    font-size: 14px;
  }

  .report-detail-list > li {
    display: flex;
    justify-content: space-between;
    line-height: 50px;
    border-bottom: 0.5px solid #e2e4ef;
  }

  .report-detail-list > li:first-child > div:last-child {
    color: #f10215;
  }

  .report-detail-list > li > div:last-child {
    margin-right: 20px;
    font-weight: 500;
    color: #333333;
  }

  .money-label {
    color: #666;
    font-size: 14px;
  }

  .money-value {
    font-size: 14px;
    font-weight: 500;
    color: #f10215;
  }

  .team-transfer-top {
    display: flex;
    justify-content: space-between;
    line-height: 40px;
    padding: 0 14px;
    margin-top: -10px;
  }

  .team-tranfer-main {
    background-color: white;
  }

  .transfer-list > li {
    display: flex;
    justify-content: space-between;
    padding-left: 12px;
    height: 54px;
    align-items: center;
    border-bottom: solid 0.5px #e2e4ef;
  }

  .transfer-list > li > div:last-child {
    margin-right: 20px;
  }

  .transfer-input-box {
    width: 266px;
    height: 34px;
    border: solid 0.5px #e2e4ef;
    border-radius: 4px;
    background-color: #f9fafe;
  }

  .transfer-input-box input {
    border: none;
    outline: none;
    width: 100%;
    background-color: transparent;
    padding-left: 10px;
    box-sizing: border-box;
    height: 35px;
    line-height: 35px;
  }

  .transfer-list > li > div:first-child {
    font-size: 14px;
    color: #666;
  }

  .slide-enter-active,
  .slide-leave-active {
    transition: all ease-out 0.4s;
  }

  .slide-enter,
  .slide-leave-to {
    transform: translateY(-55px);
    opacity: 0;
	}
</style>

<style>
  .time-range .weui-cell_access .weui-cell__ft:after {
    transform: rotate(135deg);
    margin-left: 10px;
    right: -2px;
    margin-top: -6px;
  }
</style>
