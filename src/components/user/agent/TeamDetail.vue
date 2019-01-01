<template>
  <div>
		<!-- 报表详情{{reportDetail.is_agent == '0'?'会员':'代理'}}{{userName}} -->
    <x-header :left-options="{backText: ''}">代理
      <a slot="right" @click="goToFilter" class="fs17">筛选</a>
    </x-header>
    <div style="margin-top: 44px" class="report-detail-title">团队报表</div>
    <ul class="report-detail-list" style="margin-bottom: 10px" >
      <li>
        <div>总盈亏额</div>
        <div>{{reportDetail.team_profit||'0.000'}}</div>
      </li>
      <li>
        <div>投注总额</div>
        <div>{{reportDetail.children_amount_total}}</div>
      </li>
      <li>
        <div>有效投注</div>
        <div>{{reportDetail.children_valid_total}}</div>
      </li>
      <li>
        <div>投注盈利</div>
        <div>{{reportDetail.children_win_amount||'0.000'}}</div>
      </li>
      <li>
        <div>投注奖金</div>
        <div>{{reportDetail.children_winning_amount||'0.000'}}</div>
      </li>
      <li>
        <div>投注返点</div>
        <div>{{reportDetail.children_rebate_amount}}</div>
      </li>
      <li>
        <div>返点差总额</div>
        <div>{{reportDetail.children_rebates||'0'}}</div>
      </li>
      <li>
        <div>注单总数</div>
        <div>{{reportDetail.children_bill_rows||'0'}}</div>
      </li>
      <li style="border-bottom:none;">
        <div>投注人数</div>
        <div>{{reportDetail.user_rows||'0'}}</div>
      </li>
    </ul>
    <div class="report-detail-title">个人报表</div>
    <ul class="report-detail-list">
      <li>
        <div>总盈亏额</div>
        <div>{{reportDetail.self_profit||'0.000'}}</div>
      </li>
      <li>
        <div>投注总额</div>
        <div>{{reportDetail.amount_total||'0.000'}}</div>
      </li>
      <li>
        <div>有效投注</div>
        <div>{{reportDetail.valid_total||'0.000'}}</div>
      </li>
      <li>
        <div>投注盈利</div>
        <div>{{reportDetail.win_amount||'0.000'}}</div>
      </li>
      <li>
        <div>投注奖金</div>
        <div>{{reportDetail.winning_amount||'0.000'}}</div>
      </li>
      <li>
        <div>投注返点</div>
        <div>{{reportDetail.rebate_amount}}</div>
      </li>
      <li>
        <div>返点差总额</div>
        <div>{{reportDetail.rebates||'0'}}</div>
      </li>
      <li>
        <div>注单总数</div>
        <div>{{reportDetail.bill_rows||'0'}}</div>
      </li>
    </ul>
  </div>
</template>

<script>
  import { initTeamItem } from '../../../assets/js/initTeamList'

  export default {
    name: 'TeamDetail',
    data() {
      return {
        userId: '',
        userName: '',
        startTime: '',
        endTime: '',
        reportDetail: ''
      }
    },
    created() {
      this.userId = this.$route.query.id
      this.userName = this.$route.query.user
      this.startTime = this.$route.query.dateStart
      this.endTime = this.$route.query.dateEnd
      this.getTeamReport()
    },
    methods: {
      ...Vuex.mapActions(['GET_TEAM_REPORT']),
      goToFilter() {
        this.$router.replace({
          path: `/user/agent/3/teamfilter?id=${this.userId}&user=${this.userName}`
        })
      },
      getTeamReport() {
        this.GET_TEAM_REPORT({
          type: 0,
          user_id: this.user_id,
          date_start: this.startTime,
          date_end: this.endTime
        }).then(res => {
          if (res.data) {
            this.reportDetail = initTeamItem(res.data.list)[0]
          }
        })
      }
    }
  }
</script>

<style scoped>
  .report-detail-title {
    padding-left: 15px;
    height: 40px;
    line-height: 40px;
    border-bottom: 0.5px solid #e2e4ef;
    color: #333;
    font-size: 14px;
    font-weight: bold;
    background-color: #ffffff;
  }

  .report-detail-list {
    color: #666;
    font-size: 14px;
  }

  .report-detail-list > li {
    display: flex;
    justify-content: space-between;
    height: 40px;
    padding-left: 15px;
    line-height: 40px;
    border-bottom: 0.5px solid #e2e4ef;
    background-color: #ffffff;
	}
	.report-detail-list > li:last-child() {
		border-bottom: none;
	}
  .report-detail-list > li:first-child > div:last-child {
    color: #f10215;
  }

  .report-detail-list > li > div:last-child {
    margin-right: 20px;
    font-weight: 500;
    color: #333333;
  }
</style>
