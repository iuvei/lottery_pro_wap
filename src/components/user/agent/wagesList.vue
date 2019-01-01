<template>
  <div
    class="wages-wrapper"
    style="margin-top: -10px"
  >
    <div class="team-tab">
      <div class="btn-group">
        <div
          class="border-theme text-theme"
          :class="{'team-tab-active':activeIndex===0}"
          @click="handleTabChange(0)"
        >
          领取记录
        </div>
        <div
          class="border-theme text-theme"
          :class="{'team-tab-active':activeIndex===1}"
          @click="handleTabChange(1)"
        >
          日工资契约
        </div>
      </div>
      <div
        class="time-range"
        v-show="activeIndex===0"
      >
        <div class="input-box date-box">
          <datetime
            placeholder="开始时间"
            v-model="startTime"
            @on-change="(time)=>handleTimeChange(time,'start')"
            :start-date="dateStartMin"
            :end-date="dateStartMax"
            format="YYYY-MM-DD"
            :max-year="2018"
            year-row="{value}年"
            month-row="{value}月"
            day-row="{value}日"
            hour-row="{value}点"
            minute-row="{value}分"
          ></datetime>
        </div>
        <div class="black-level6">至</div>
        <div class="input-box date-box">
          <datetime
            placeholder="结束时间"
            v-model="endTime"
            @on-change="(time)=>handleTimeChange(time,'end')"
            :start-date="dateEndMin"
            :end-date="dateEndMax"
            format="YYYY-MM-DD"
            year-row="{value}年"
            month-row="{value}月"
            day-row="{value}日"
            hour-row="{value}点"
            minute-row="{value}分"
          ></datetime>
        </div>
        <img
          class="closeTime"
          v-show="cancelTime==true"
          @click="handleTime()"
          src="../../../../static/images/icon/close-icon.png"
          alt=""
        >
      </div>
    </div>
    <div class="tab-box">
      <div v-show="activeIndex===0">
        <div class="scrollBox">
          <vue-pull-to
            :bottom-load-method="bottom_pull"
            :is-top-bounce=false
            :bottom-config="bottom_config"
          >
            <div
              class="wagesLogGroup"
              v-for="item in logList"
              :key="item.id"
            >
              <div class="create-time">{{formatFullDate(item.create_time * 1000)}}</div>
              <div class="info-group">
                <div class="info-left">
                  <div class="value">{{item.valid_member}}</div>
                  <div class="text">有效人数</div>
                </div>
                <div class="info-middle">
                  <div class="value">{{item.valid_money ? parseFloat(item.valid_money).toFixed(3) : ''}}</div>
                  <div class="text">有效投注</div>
                </div>
                <div class="info-right">
                  <div class="value red-color">{{item.amount ? parseFloat(item.amount).toFixed(3) : ''}}</div>
                  <div class="text">领取金额</div>
                </div>
              </div>
            </div>
          </vue-pull-to>
        </div>
      </div>
      <div v-show="activeIndex===1">
        <div class="scrollBox">
          <vue-pull-to
            :bottom-load-method="contract_bottom_pull"
            :is-top-bounce=false
            :bottom-config="bottom_config"
          >
            <div
              class="contractGroup"
              v-for="item in contractsList"
              :key="item.id"
            >
              <div class="title">{{item.title}}</div>
              <div class="group-middle">
                <div class="info-item">
                  <div class="text">日工资比例</div>
                  <div class="value">{{item.rebate}}%</div>
                </div>
                <div class="info-item">
                  <div class="text">有效投注</div>
                  <div class="value">{{item.valid_money ? parseFloat(item.valid_money).toFixed(3) : ''}}</div>
                </div>
                <div class="info-item">
                  <div class="text">有效人数</div>
                  <div class="value">{{item.valid_member}}</div>
                </div>
              </div>
              <div class="group-bottom">
                <div class="status-box">
                  <div class="text">当前状态</div>
                  <div class="value">{{item.statusTxt}}</div>
                </div>
                <div
                  class="btn-box"
                  v-if="item.isOperate"
                >
                  <div class="text">{{item.operateText}}</div>
                  <div class="btn-group">
                    <button
                      type="button"
                      class="bg-theme"
                      @click="setContractStatusHandle(1, item.id)"
                    >接受</button>
                    <button
                      type="button"
                      class="border-theme text-theme"
                      @click="setContractStatusHandle(0, item.id)"
                    >拒绝</button>
                  </div>
                </div>
              </div>
            </div>
          </vue-pull-to>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Datetime, dateFormat } from 'vux'
import { initSelfContractsItem } from '../../../assets/js/initContracts'
import { getYYYY_MM_HH, getMM_HH } from '../../../assets/js/formatDate'
import VuePullTo from 'vue-pull-to/src/vue-pull-to'
import { TOP_DEFAULT_CONFIG } from '../../../assets/js/pull_config'

export default {
  name: 'wagesList',
  components: { Datetime, VuePullTo },
  data() {
    return {
      activeIndex: 0,
      startTime: '',
      endTime: '',
      dateStartMin: '',
      dateStartMax: '',
      dateEndMin: '',
      dateEndMax: '',
      cancelTime: false,
      logList: [],
      totalPage: 1,
      nowPage: 1,
      contractsTotalPage: 1,
      contractsNowPage: 1,
      pageSize: 10,
      contractsList: [],
      bottom_config: TOP_DEFAULT_CONFIG
    }
  },
  created() {
    this.dateStartMax = dateFormat(new Date(), 'YYYY-MM-DD')
    this.dateEndMax = dateFormat(new Date(), 'YYYY-MM-DD')
    this.initPage()
  },
  methods: {
    ...Vuex.mapActions([
      'GET_WAGE_OR_BONUS',
      'GET_CONTRACTS',
      'SET_CONTRACTS_STATUS'
    ]),
    handleTabChange(index) {
      this.activeIndex = index
      this.nowPage = 1
      this.contractsNowPage = 1
      this.totalPage = 1
      this.contractsTotalPage = 1
      this.logList = []
      this.contractsList = []
      if (index === 0) {
        this.getWagesList()
      }
      if (index === 1) {
        this.getContractsList()
      }
    },
    bottom_pull(loaded) {
      if (this.nowPage < this.totalPage) {
        this.nowPage = this.nowPage + 1
        this.getWagesList(() => {
          loaded('done')
        })
      } else {
        this.$vux.toast.show('已加载全部')
        setTimeout(() => {
          loaded('done')
        }, 1000)
      }
    },
    contract_bottom_pull(loaded) {
      if (this.contractsNowPage < this.contractsTotalPage) {
        this.contractsNowPage = this.contractsNowPage + 1
        this.getContractsList(() => {
          loaded('done')
        })
      } else {
        this.$vux.toast.show('已加载全部')
        setTimeout(() => {
          loaded('done')
        }, 1000)
      }
    },
    formatFullDate(date) {
      return getYYYY_MM_HH(date)
    },
    formatDate(date) {
      return getMM_HH(date)
    },
    handleTimeChange(time, type) {
      if (type === 'start') {
        this.dateEndMin = time
        this.logList = []
        this.getWagesList()
        this.cancelTime = true
      }
      if (type === 'end') {
        this.dateStartMax = time
        this.logList = []
        this.getWagesList()
        this.cancelTime = true
      }
      console.log(time, type)
    },
    handleTime() {
      let time = ''
      this.handleTimeChange(time, 'start')
      this.handleTimeChange(time, 'end')
      this.startTime = ''
      this.endTime = ''
      this.getWagesList()
      this.cancelTime = false
    },
    setContractStatusHandle(status, id) {
      this.SET_CONTRACTS_STATUS({
        id: id,
        status: status,
        type: 0
      }).then(res => {
        setTimeout(() => {
          this.getContractsList()
        }, 1000)
      })
    },
    getWagesList(callback) {
      this.GET_WAGE_OR_BONUS({
        type: 0,
        rows: this.pageSize,
        page: this.nowPage,
        date_start: this.startTime,
        date_end: this.endTime
      })
        .then(res => {
          let totalRows = res.data.total_rows
          this.totalPage = Math.ceil(totalRows / this.pageSize)
          this.logList = [...this.logList, ...res.data.wages]
          callback && callback()
        })
        .catch(() => {
          callback && callback()
        })
    },
    getContractsList(callback) {
      this.GET_CONTRACTS({
        type: 0,
        rows: this.pageSize,
        page: this.contractsNowPage
      })
        .then(res => {
          let totalRows = res.data.total_rows
          this.contractsTotalPage = Math.ceil(totalRows / this.pageSize)
          this.contractsList = [
            ...this.contractsList,
            ...initSelfContractsItem(res.data.contracts)
          ]
          callback && callback()
        })
        .catch(() => {
          callback && callback()
        })
    },
    initPage() {
      this.getWagesList()
    }
  }
}
</script>

<style scoped>
.date-box .weui-cell {
  padding: 0 5px;
}
.closeTime {
  width: 16px;
  padding-left: 6px;
}

.time-range {
  /* flex: 1; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
  /* margin-left: 10px; */
}
.time-range > div {
  width: 80px;
}

.time-range > div:nth-child(2) {
  width: 20px;
  text-align: center;
}

.input-box {
  flex: 1;
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
  justify-content: flex-start;
  align-items: center;
  background-color: #f9fbfe;
}

.team-tab .btn-group {
  flex: 0 0 150px;
  padding-left: 15px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
}

.team-tab .btn-group > div {
  flex: 1;
  height: 27px;
  line-height: 27px;
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

.wagesLogGroup {
  width: 100%;
  padding: 10px 12px;
  box-sizing: border-box;
  background-color: #ffffff;
  box-shadow: 0 2px 3px #e9eef5;
  margin-bottom: 10px;
}

.wagesLogGroup .create-time {
  line-height: 1.2;
  margin-bottom: 15px;
  font-size: 14px;
  color: #999999;
}

.wagesLogGroup .info-group {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: flex-start;
}

.wagesLogGroup:last-child {
  margin-bottom: 0;
}

.wagesLogGroup .info-group > div {
  margin-right: 10px;
}

.wagesLogGroup .info-group > div .value {
  margin-bottom: 10px;
  font-size: 15px;
  font-weight: bold;
  color: #333333;
  word-break: break-all;
}

.wagesLogGroup .info-group > div .text {
  font-size: 12px;
  color: #666666;
}

.wagesLogGroup .info-group .info-right {
  flex: 0 0 35%;
  margin-right: 0;
}
.wagesLogGroup .info-group .info-left {
  flex: 0 0 30%;
}
.wagesLogGroup .info-group .info-middle {
  flex: 0 0 35%;
}

/*契约*/
.contractGroup {
  width: 100%;
  background-color: #ffffff;
  box-shadow: 0 2px 4px #e9eef5;
  margin-bottom: 10px;
}

.contractGroup:last-child {
  margin-bottom: 0;
}

.contractGroup .title {
  padding: 14px 12px;
  font-size: 15px;
  font-weight: bold;
  color: #333333;
}

.contractGroup .group-middle {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: stretch;
  padding: 0 12px;
  border-bottom: 0.5px solid #dfdfdf;
}

/*.contractGroup .group-middle .group-middle-left, .contractGroup .group-middle .group-middle-right {*/
/*flex: 0 0 50%;*/
/*}*/

.contractGroup .group-middle .info-item {
  flex: 0 0 50%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 15px;
}

.contractGroup .group-middle .info-item .text {
  flex: 0 0 70px;
  margin-right: 30px;
  font-size: 14px;
  color: #666666;
}

.contractGroup .group-middle .info-item .value {
  line-height: 1.2;
  flex: 1;
  font-size: 15px;
  color: #333333;
  word-break: break-all;
}

.contractGroup .group-bottom {
  padding: 12px;
}

.contractGroup .group-bottom .status-box {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
}

.contractGroup .group-bottom .status-box .text {
  font-size: 14px;
  color: #666666;
}

.contractGroup .group-bottom .status-box .value {
  font-size: 15px;
  color: #333333;
}

.contractGroup .group-bottom .btn-box {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  margin-top: 13px;
}

.contractGroup .group-bottom .btn-box .text {
  font-size: 14px;
  color: #666666;
}

.contractGroup .group-bottom .btn-box .btn-group button {
  width: 72px;
  height: 34px;
  line-height: 34px;
  border-radius: 20px;
  text-align: center;
  font-size: 15px;
}

.contractGroup .group-bottom .btn-box .btn-group button:first-child {
  margin-right: 10px;
  border: none;
  color: #ffffff;
}

.contractGroup .group-bottom .btn-box .btn-group button:last-child {
  background-color: #ffffff;
}

.scrollBox {
  position: fixed;
  top: 244px;
  left: 0;
  width: 100%;
  height: calc(100% - 244px);
}
</style>
