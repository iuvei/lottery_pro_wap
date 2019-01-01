<template>
  <div>
    <div>
      <div>
        <x-header
          :left-options="{backText: '', preventGoBack: true}"
          @on-click-back="goBack"
        >
          资金记录
          <a
            slot="right"
            @click="jumpToFilter"
            class="fs17"
          >筛选</a>
        </x-header>
        <div style="margin-top:44px;">
          <div class="date-box">
            {{this.mode ? `${start_date}至${end_date}` : month_date }}
          </div>
          <div class="month-title">
            <div class="month-title-intro">
              支出 ￥{{budget ? budget.expenses.replace('-','') : '0.000'}} &nbsp;&nbsp;收入 ￥{{budget ? budget.income : '0.000'}}
            </div>
          </div>
          <div class="history-box">
            <pull-to
              :bottom-load-method="bottomPullHandle"
              :is-top-bounce=false
              :bottom-config="bottom_config"
            >
              <ul class="history-list">
                <li v-for="history in moneyHistoryList">
                  <div>
                    <div class="history-head">
                      {{history.type}}
                    </div>
                    <div class="history-time">
                      {{history.create_time}}
                    </div>
                  </div>
                  <div class="history-item-right">
                    <div
                      class="money"
                      :class="{'positive-num':history.amount>0}"
                    >
                      {{history.amount>0?`+${history.amount}`:history.amount}}
                    </div>
                    <div class="history-item-intro">
                      {{history.remark}}
                    </div>
                  </div>
                </li>
              </ul>
            </pull-to>
          </div>
          <div v-if="!moneyHistoryList.length">
            <EmptyPage type="emptyList" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import EmptyPage from '../../components/global/EmptyPage'
import { formatTime } from '../../util/filters'
import PullTo from 'vue-pull-to'
import { TOP_DEFAULT_CONFIG } from '../../assets/js/pull_config'

export default {
  components: {
    EmptyPage,
    PullTo
  },
  data() {
    return {
      mode: 0,
      page: 1,
      totalPage: 1,
      start_date: '',
      end_date: '',
      month_date: '',
      moneyHistoryList: [],
      budget: '',
      type: 0,
      bottom_config: TOP_DEFAULT_CONFIG
    }
  },
  created() {
    this.initPage()
    this.registerGlobalEvents()
  },
  methods: {
    ...Vuex.mapActions(['GET_MONEY_HISTORY']),
    goBack() {
      this.$router.push('/my')
    },
    formatTime(date, rule) {
      return formatTime(date, rule)
    },
    bottomPullHandle(loaded) {
      if (this.page < this.totalPage) {
        this.page = this.page + 1
        this._getLogList(() => {
          loaded('done')
        })
      } else {
        this.$vux.toast.show('已加载全部')
        setTimeout(() => {
          loaded('done')
        }, 1000)
      }
    },
    _getLogList(callback) {
      this.GET_MONEY_HISTORY({
        mode: this.mode,
        page: this.page,
        date_start: this.mode === 1 ? this.start_date : '',
        date_end: this.mode === 1 ? this.end_date : '',
        cur_date: this.mode === 0 ? this.month_date + '-00' : '',
        type: this.type,
        rows: 10
      })
        .then(res => {
          this.moneyHistoryList = [...this.moneyHistoryList, ...res.data.list]
          let expenses = 0
          let income = 0
          res.data.budget.forEach(item => {
            expenses += parseFloat(item.expenses)
            income += parseFloat(item.income)
          })
          this.budget = {
            expenses: String(expenses.toFixed(3)),
            income: String(income.toFixed(3))
          }
          let totalRows = parseInt(res.data.total_rows)
          this.totalPage = Math.ceil(totalRows / 10)
          callback && callback()
        })
        .catch(() => {
          callback && callback()
        })
    },
    initPage() {
      this.mode = this.$route.query.mode ? parseInt(this.$route.query.mode) : 0
      this.type = this.$route.query.status
        ? parseInt(this.$route.query.status)
        : 0
      if (this.mode === 1) {
        this.start_date = this.$route.query.start_date
        this.end_date = this.$route.query.end_date
      } else {
        this.month_date = this.$route.query.month_date
          ? this.$route.query.month_date
          : this.formatTime(new Date(), 'YYYY-MM')
      }
      this._getLogList()
    },
    registerGlobalEvents() {
      this.$eventBus.$on('clickLayer', data => {
        this.filterShow = false
      })
    },
    jumpToFilter() {
      this.$router.push({
        path: '/money/filter'
      })
    }
  }
}
</script>

<style scoped>
.history-box {
  height: calc(100vh - 90px);
  background-color: white;
}

.date-box {
  position: relative;
  z-index: 10;
  padding: 0 12px;
  font-size: 17px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  background-color: #f9fafe;
}

.month-title {
  z-index: 10;
  background-color: #f9fafe;
  font-size: 17px;
  padding: 0 12px;
  position: relative;
  /*top: 44px;*/
}

/*.month-title > div:first-child {*/
/*display: flex;*/
/*align-items: center;*/
/*padding-top: 6px;*/
/*}*/

.history-list > li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: solid 0.5px #e2e4ef;
  height: 60px;
  margin-left: 12px;
}

.history-list > li > div:last-child {
  margin-right: 12px;
}

.month-title-intro {
  font-size: 12px;
  color: #555;
}

.history-head {
  font-size: 14px;
  font-weight: bold;
}

.history-time {
  color: #999;
  font-size: 12px;
}

.history-item-right {
  font-size: 12px;
  text-align: right;
}

.history-item-right .money {
  font-weight: bold;
  font-size: 14px;
}

.history-item-intro {
  color: #ff3d4c;
  font-size: 12px;
}

.history-list > li:last-child {
  border: none;
}

.positive-num {
  color: #ff3d4c;
}
</style>
