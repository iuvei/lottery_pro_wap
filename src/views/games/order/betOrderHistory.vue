<template>
  <!-- 投注记录 -->
  <div>
    <div>
      <div style="height:88px">
        <x-header :left-options="{backText: ''}">
          投注记录
          <a
            slot="right"
            @click="goToFilter"
            class="fs17"
          >筛选</a>
        </x-header>
        <div class="order-tab tab-box">
          <tab custom-bar-width="30px">
            <tab-item
              v-for="item in tabs"
              :key="item.type"
              @on-item-click="handleTabChange(item)"
              :selected="item.type==$route.query.type"
            >{{item.name}}</tab-item>
          </tab>
        </div>
      </div>
      <div
        class="infinite-scroll-container"
        :style="{'height':$window.innerHeight-98+'px'}"
        v-if="hasLoadedData&&hasBetList"
      >
        <pull-to
          @infinite-scroll="loadmore"
          :BOTTOM_DEFAULT_CONFIG="{triggerDistance:70}"
        >
          <ul class="order-list">
            <li
              v-for="item in orderList"
              @click="goToOrderDetail(item)"
            >
              <div class="lottery-icon">
                <img :src="item.icon_3x" />
              </div>
              <div class="order-item-main">
                <div class="order-item-top">
                  <div>输赢: <span :class="setMoneyColor(item)">{{(item.winning_amount*1||item.win_amount*1).toFixed(3)}}</span>元</div>
                  <div :class="setStatusColor(item)">{{setStatusText(item.status,item.winning_amount*1||item.win_amount*1)}}</div>
                </div>
                <div class="order-item-bottom">
                  <div class="order-content">
                    {{item.content}}
                  </div>
                  <div class="order-time">
                    {{item.create_time * 1000|formatTime}}
                  </div>
                </div>
              </div>
              <div>
                <i class="iconfont icon-jiantou"></i>
              </div>
            </li>
          </ul>
          <div class="pull-text">{{pullStatus|pullTextFilter}}</div>
        </pull-to>
      </div>
      <div v-if="hasLoadedData&&!hasBetList">
        <EmptyPage :type="emptyType" />
      </div>
    </div>
  </div>
</template>

<script>
import PullTo from 'vue-pull-to'
import { Tab, TabItem } from 'vux'

import EmptyPage from '../../../components/global/EmptyPage'
export default {
  components: {
    Tab,
    TabItem,
    PullTo,
    EmptyPage
  },
  data() {
    return {
      tabs: [
        {
          name: '全部',
          type: '0'
        },
        {
          name: '未结算',
          type: '1'
        },
        {
          name: '已中奖',
          type: '2'
        },
        {
          name: '未中奖',
          type: '3'
        }
      ],
      pullStatus: 0,
      orderList: [],
      currentPage: 1,
      rows: 20,
      total: 0,
      hasLoadedData: false,
      hasBetList: false,
      emptyType: ''
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    ...Vuex.mapActions(['GET_BET_HISTORY']),
    getOrderList() {
      this.GET_BET_HISTORY({
        type: this.$route.query.type,
        page: this.currentPage,
        rows: this.rows,
        ...this.$route.query
      }).then(res => {
        this.hasLoadedData = true
        if (!(res.data && res.data.bills && res.data.bills.length)) {
          this.hasBetList = false
          this.pullStatus = 0
          if (this.$route.query.type === '0') {
            this.emptyType = 'emptyBet'
          } else {
            this.emptyType = 'emptyList'
          }
          return
        } else {
          this.hasBetList = true

          this.orderList = [...this.orderList, ...res.data.bills]
          this.total = res.data.total_rows
        }
        if (this.rows * this.currentPage >= this.total) {
          this.pullStatus = 2
        } else {
          this.pullStatus = 1
        }
      })
    },
    handleTabChange(item) {
      this.$router.replace({
        path: '/order/history',
        query: {
          type: item.type
        }
      })
      this.currentPage = 1
      this.orderList = []
      this.getOrderList(item.type)
    },
    goToOrderDetail(item) {
      console.log(item, 'item')
      this.$router.push({
        path: '/order/detail',
        query: {
          ...item,
          amount: (item.amount * 1).toFixed(3),
          amount_total: (item.amount_total * 1).toFixed(3)
        }
      })
    },
    loadmore() {
      // 判断是否已经加载完投注记录列表
      if (this.rows * this.currentPage < this.total) {
        this.currentPage += 1
        this.getOrderList({ page: this.currentPage })
      }
    },
    setStatusText(status, winning_amount) {
      if (status === '0') {
        return '未结算'
      }
      if (status === '1' && winning_amount > 0) {
        return '已中奖'
      }
      if (status === '1' && winning_amount < 0) {
        return '未中奖'
      }
    },
    setMoneyColor(item) {
      if (item.winning_amount * 1 || item.win_amount * 1 > 0) {
        return 'win-color'
      }
      if (item.winning_amount * 1 || item.win_amount * 1 < 0) {
        return 'lose-color'
      }
    },
    setStatusColor(item) {
      let text = this.setStatusText(
        item.status,
        item.winning_amount * 1 || item.win_amount * 1
      )
      if (text === '已中奖') {
        return 'win-color'
      }
      if (text === '未中奖') {
        return 'lose-color'
      }
    },
    goToFilter() {
      this.$router.replace({
        path: '/order/filter',
        query: { type: this.$route.query.type }
      })
    }
  },
  filters: {
    pullTextFilter: function(status) {
      // status0 暂无数据 1 上拉加载更多 2 加载完成
      switch (status) {
        case 0:
          return '暂无数据'
        case 1:
          return '上拉加载更多...'
        case 2:
          return '加载完成'
        case 3:
          return ''
      }
    }
  }
}
</script>

<style scoped>
.order-tab {
  position: fixed;
  width: calc(100% + 32px);
  height: 46px;
  top: 44px;
  left: 0;
  z-index: 2;
  margin: 0 -20px;
}
.order-list > li {
  display: flex;
  background-color: white;
  border-bottom: solid 0.5px #e2e4ef;
  padding: 10px 12px;
  align-items: center;
}

.order-list > li > div:nth-child(2) {
  flex: 1;
}
.order-item-main {
  padding-left: 10px;
  padding-right: 12px;
}

.lottery-icon > img {
  width: 60px;
}
.order-item-top,
.order-item-bottom {
  display: flex;
  justify-content: space-between;
}
.order-item-top > div {
  font-size: 14px;
}

.order-content {
  width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  margin-top: 6px;
}
.order-time {
  font-size: 12px;
  color: #999;
  margin-top: 6px;
}
.order-list > li .iconfont {
  font-size: 20px;
  color: #999;
}

.pull-text {
  text-align: center;
  line-height: 40px;
  color: #999;
}
.win-color {
  color: red;
}
.lose-color {
  color: green;
}
.infinite-scroll-container {
  padding-top: 10px;
}
</style>
