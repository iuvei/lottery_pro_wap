<template>
  <div class="bet-order-detail">
    <!-- 注单明细 -->
    <x-header :left-options="{backText: ''}">
      注单明细
    </x-header>
    <div style="padding-top:45px">
      <group>
        <cell title="订单号" :value="$route.query.order_num">
          <div class="dib ellipsis">{{$route.query.order_num}}</div>
        </cell>
        <cell title="彩种" :value="$route.query.game_name"></cell>
        <cell title="期数" :value="$route.query.round"></cell>
        <cell title="玩法" :value="$route.query.full_name"></cell>
        <cell title="投注内容" :value="$route.query.content"></cell>
        <cell title="开奖号码" :value="$route.query.number||'暂未开奖'"></cell>
        <cell title="投注数量" :value="$route.query.num"></cell>
        <cell title="单注金额" :value="$route.query.amount+'元'"></cell>
        <cell title="倍数" :value="$route.query.multiple"></cell>
        <cell title="赔率-返点" :value="`${$route.query.odds}-${$route.query.rebate}%`"></cell>
        <cell title="返点金额" :value="$route.query.rebate_amount+'元'"></cell>
        <cell title="投注总额" :value="$route.query.amount_total+'元'"></cell>
        <cell title="中奖金额" class="win-color" :value="$route.query.winning_amount < 0 ? '0.000元' :$route.query.winning_amount+'元'"></cell>
        <cell title="交易时间" :value="$route.query.create_time*1000|formatTime"></cell>
        <cell title="状态" :class="setStatusColor($route.query)" :value="setStatusText($route.query.status,$route.query.winning_amount*1||$route.query.win_amount*1)"></cell>
        <cell title="盈亏" :value="$route.query.win_amount+'元'"></cell>
      </group>
    </div>
  </div>
</template>

<script>
import { Cell } from 'vux'
export default {
  components: {
    Cell
  },
  data() {
    return {
      orderDetail: {
        order_num: '订单号',
        game_name: '彩种',
        round: '期数',
        full_name: '玩法',
        content: '投注内容',
        multiple: '投注数量',
        amount: '单注金额'
      }
    }
  },
  created() {
    console.log(this.$route.query)
  },
  methods: {
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
    }
  }
}
</script>

<style scoped>
.btn-copy {
  background-color: white;
  width: 70px;
  height: 28px;
  border-radius: 3px;
}
.ellipsis {
  width: 100%;
  vertical-align: middle;
}
</style>


<style>
.bet-order-detail .weui-cell.win-color .weui-cell__ft {
  color: red;
}
.bet-order-detail .weui-cell.lose-color .weui-cell__ft {
  color: green;
}

.bet-order-detail .weui-cell__ft {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-left: 10px;
}

.bet-order-detail .vux-label {
  word-break: keep-all;
}
</style>

