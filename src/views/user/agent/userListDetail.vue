<template>
  <div style="overflow-x: hidden;">
    <x-header :left-options="{backText: ''}">{{userInfoDetail.username ||''}}
    </x-header>
    <div class="tab-box">
      <tab
        v-if="showTabList"
        custom-bar-width="30px"
        :value="activeTab"
      >
        <tab-item
          v-for="(item, index) in tabList"
          :selected="item.id===activeTab"
          @on-item-click="handleTabChange(item)"
          :key="index.id"
        >{{item.name}}
        </tab-item>
      </tab>
    </div>
    <div class="user-list-detail">
      <div
        v-show="activeTab===0"
        class="info-detail"
      >
        <group>
          <group-title slot="title">用户资料</group-title>
          <ul>
            <li v-for="item in userInfoList">
              <cell :title="item.title">
                <div :class="item.title == '可用余额' ? 'red-color':''">
                  {{item.title == '当前返点'?item.value+'%':item.value}}
                </div>
              </cell>
            </li>
          </ul>
        </group>

        <group v-show="userInfoDetail.is_agent==='1'">
          <group-title slot="title">团队余额</group-title>
          <ul>
            <li v-for="item in teamInfoList">
              <cell :title="item.title">
                <div class="red-color">
                  {{item.value}}
                </div>
              </cell>
            </li>
          </ul>
        </group>
      </div>
      <div v-show="activeTab===1">
        <div class="lottery-detail-head">
          <div
            class="lottery-select-area"
            @click="lotteryListPopupShow=true"
          >
            <div>{{lotteryName[0]}}</div>
            <x-icon
              type="ios-arrow-down"
              size="20"
            ></x-icon>
          </div>
          <div
            class="play-tab"
            v-show="showGameTypeBtn"
          >
            <div
              :class="{'active':activePlayTab===0}"
              @click="changePlayTab(0)"
            >官方玩法</div>
            <div
              :class="{'active':activePlayTab===1}"
              @click="changePlayTab(1)"
            >信用玩法</div>
          </div>
        </div>
        <table class="lottery-detail-table">
          <thead>
            <tr>
              <td v-for="item in lotteryDetailData.header">{{item.name}}</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in lotteryDetailData.body">
              <td>{{item.group_name}}</td>
              <td>{{item.name}}</td>
              <td>
                <div>{{item.lottery_max}}</div>
                <div class="black-level6">+{{item.rebate_min}}%</div>
              </td>
              <td>
                <div>{{item.lottery_min}}</div>
                <div class="black-level6">+{{item.rebate_max}}%</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-show="activeTab===2">
        <table class="bet-history-table">
          <thead>
            <tr>
              <td v-for="item in betDetailData.header">{{item.name}}</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in betDetailData.body">
              <td>{{item.bet_time*1000|formatTime}}</td>
              <td>
                <div>{{item.game_name}}</div>
                <div>{{item.full_name}}</div>
              </td>
              <td>{{item.amount_total ? parseFloat(item.amount_total).toFixed(3) : '0.000'}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        class="contracts-wrapper"
        v-show="activeTab===3"
      >
        <div class="contracts-title">
          <div class="text">日工资列表</div>
          <span
            class="add-contracts-btn"
            @click="showAddWagesContractsHandle"
          >+ 新增契约</span>
        </div>
        <div class="scrollBox">
          <vue-pull-to
            :bottom-load-method="wagesBottomPullHandle"
            :is-top-bounce=false
            :bottom-config="bottom_config"
          >
            <div
              class="contractGroup"
              v-for="item in wages_contractsList"
              :key="item.id"
            >
              <div class="title">{{item.title}}</div>
              <div class="group-middle">
                <div class="info-item">
                  <div class="text">分红比例</div>
                  <div class="value">{{item.rebate}}%</div>
                </div>
                <div class="info-item">
                  <div class="text">有效投注</div>
                  <div class="value">{{item.valid_money ? parseFloat(item.valid_money).toFixed(3) : '0.000'}}</div>
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
                <div class="btn-box">
                  <div class="text">{{item.operateText}}</div>
                  <div
                    class="btn-group"
                    v-if="item.operateType"
                  >
                    <button
                      type="button"
                      class="bg-theme"
                      @click="setWagesContractStatusHandle(1, item.id)"
                    >接受</button>
                    <button
                      type="button"
                      class="border-theme text-theme"
                      @click="setWagesContractStatusHandle(0, item.id)"
                    >拒绝</button>
                  </div>
                  <div
                    class="btn-group"
                    v-else
                  >
                    <button
                      class="border-theme text-theme"
                      @click="setWagesContractStatusHandle(0, item.id)"
                      type="button"
                    >{{item.operateText == '是否停用'?'停用':'撤回'}}</button>
                  </div>
                </div>
              </div>
            </div>
          </vue-pull-to>
        </div>
      </div>
      <div
        class="contracts-wrapper"
        v-show="activeTab===4"
      >
        <div class="contracts-title">
          <div class="text">分红列表</div>
          <span
            class="add-contracts-btn"
            @click="showAddBonusContractsHandle"
          >+ 新增契约</span>
        </div>
        <div class="scrollBox">
          <vue-pull-to
            :bottom-load-method="bonusBottomPullHandle"
            :is-top-bounce=false
            :bottom-config="bottom_config"
          >
            <div
              class="contractGroup"
              v-for="item in bonus_contractsList"
              :key="item.id"
            >
              <div class="title">{{item.title}}</div>
              <div class="group-middle">
                <div class="info-item">
                  <div class="text">分红比例</div>
                  <div class="value">{{item.rebate}}%</div>
                </div>
                <div class="info-item">
                  <div class="text">平台盈利</div>
                  <div class="value">{{item.profit ? parseFloat(item.profit).toFixed(3) : '0.000'}}</div>
                </div>
                <div class="info-item">
                  <div class="text">有效人数</div>
                  <div class="value">{{item.valid_member}}</div>
                </div>
                <div class="info-item">
                </div>
                <div class="info-item">
                  <div class="text">有效投注</div>
                  <div class="value">{{item.valid_money ? parseFloat(item.valid_money).toFixed(3) : '0.000'}}</div>
                </div>
                <div class="info-item">
                  <div class="text">契约周期</div>
                  <div class="value">{{item.cycle == '0'? '每日':'每周'}}</div>
                </div>
              </div>
              <div class="group-bottom">
                <div class="status-box">
                  <div class="text">当前状态</div>
                  <div class="value">{{item.statusTxt}}</div>
                </div>
                <div class="btn-box">
                  <div class="text">{{item.operateText}}</div>
                  <div
                    class="btn-group"
                    v-if="item.operateType"
                  >
                    <button
                      type="button"
                      class="bg-theme"
                      @click="setBonusContractStatusHandle(1, item.id)"
                    >接受</button>
                    <button
                      type="button"
                      class="border-theme text-theme"
                      @click="setBonusContractStatusHandle(0, item.id)"
                    >拒绝</button>
                  </div>
                  <div
                    class="btn-group"
                    v-else
                  >
                    <button
                      class="border-theme text-theme"
                      @click="setBonusContractStatusHandle(0, item.id)"
                      type="button"
                    >{{item.operateText == '是否停用'?'停用':'撤回'}}</button>
                  </div>
                </div>
              </div>
            </div>
          </vue-pull-to>

        </div>
      </div>
      <div v-show="activeTab===5">
        <div class="reply-btn-area">
          <button @click="replyMessageHandle">发信</button>
        </div>
      </div>
      <div
        class="add-contracts-modal"
        v-show="showWagesContractsModal"
      >
        <div class="form">
          <div class="input-box">
            <div class="input-group">
              <div class="text">契约名称</div>
              <input
                type="text"
                v-model="wages_contracts_name"
                placeholder="请填写契约名称"
              >
            </div>
            <div class="input-group">
              <div class="text">用户</div>
              <input
                type="text"
                readonly
                :value="userInfoDetail.username"
              >
            </div>
            <div class="input-group">
              <div class="text">分红比例</div>
              <popup-picker
                class="picker"
                :data="wages_rebate_list"
                v-model="wages_contracts_rebeta"
                cancel-text="请选择返点"
                placeholder="请选择分红比例"
              ></popup-picker>
            </div>
            <div class="input-group">
              <div class="text">有效人数</div>
              <input
                type="text"
                v-model="wages_valid_member"
                placeholder="请填写有效人数"
              >
            </div>
            <div class="input-group">
              <div class="text">有效投注</div>
              <input
                type="text"
                v-model="wages_valid_money"
                placeholder="请填写有效投注"
              >
            </div>
          </div>
          <div class="btn-group">
            <button
              type="button"
              class="bg-theme"
              @click="addWagesContractsHandle"
            >添加</button>
            <button
              type="button"
              class="border-theme text-theme"
              @click="() => {this.showWagesContractsModal = false}"
            >取消</button>
          </div>
        </div>
      </div>
      <div
        class="add-contracts-modal"
        v-show="showBonusContractsModal"
      >
        <div class="form">
          <div class="input-box">
            <div class="input-group">
              <div class="text">契约名称</div>
              <input
                type="text"
                v-model="bonus_contracts_name"
                placeholder="请填写契约名称"
              >
            </div>
            <div class="input-group">
              <div class="text">用户</div>
              <input
                type="text"
                readonly
                :value="userInfoDetail.username"
              >
            </div>
            <div class="input-group">
              <div class="text">分红比例</div>
              <popup-picker
                class="picker"
                :data="bonus_rebate_list"
                v-model="bonus_contracts_rebeta"
                cancel-text="请选择返点"
                placeholder="请选择分红比例"
              ></popup-picker>
            </div>
            <div class="input-group">
              <div class="text">有效人数</div>
              <input
                type="text"
                v-model="bonus_valid_member"
                placeholder="请填写有效人数"
              >
            </div>
            <div class="input-group">
              <div class="text">有效投注</div>
              <input
                type="text"
                v-model="bonus_valid_money"
                placeholder="请填写有效投注"
              >
            </div>
            <div class="input-group">
              <div class="text">平台盈利</div>
              <input
                type="text"
                v-model="profit"
                placeholder="请填写有效投注"
              >
            </div>
            <div class="input-group">
              <div class="text">有效投注</div>
              <input
                type="text"
                readonly
                :value="upperInfo ? upperInfo.my_dividend_contract.cycle == 0 ? '每日':'每月' : '' "
              >
            </div>
          </div>
          <div class="btn-group">
            <button
              type="button"
              class="bg-theme"
              @click="addBonusContractsHandle"
            >添加</button>
            <button
              type="button"
              class="border-theme text-theme"
              @click="() => {this.showBonusContractsModal = false}"
            >取消</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 回信 -->
    <ReplyMessage
      :user="{username: userInfoDetail.username,id: userInfoDetail.id}"
      :messageShow="messageShow"
      @submit="handleMessageSubmit"
      @cancel="handleMessageCancel"
    />
    <!-- 彩种下拉列表 -->
    <popup-picker
      :show.sync="lotteryListPopupShow"
      :show-cell="false"
      :data="lotteryNameList"
      v-model="lotteryName"
      @on-change="handleLotteryChange"
    ></popup-picker>
  </div>
</template>

<script>
import { Group, GroupTitle, Cell, Tab, TabItem, PopupPicker } from 'vux'
import VuePullTo from 'vue-pull-to/src/vue-pull-to'
import ReplyMessage from '../../../components/user/ReplyMessage'
import { formatTime } from '../../../util/filters'
import { initSubContractsItem } from '../../../assets/js/initContracts'
import { TOP_DEFAULT_CONFIG } from '../../../assets/js/pull_config'

export default {
  components: {
    Group,
    GroupTitle,
    Cell,
    Tab,
    TabItem,
    ReplyMessage,
    PopupPicker,
    VuePullTo
  },
  data() {
    return {
      activeTab: 0,
      messageShow: false,
      lotteryListPopupShow: false,
      lotteryNameList: [[]],
      lotteryName: [],
      currentLottery: {},
      activePlayTab: 0,
      userInfoDetail: {},
      lotteryDetailData: {
        header: [
          {
            name: '玩法组'
          },
          {
            name: '玩法名称'
          },
          {
            name: '高奖金'
          },
          {
            name: '高返点'
          }
        ],
        body: []
      },
      betDetailData: {
        header: [
          {
            name: '日期'
          },
          {
            name: '彩种-玩法名称'
          },
          {
            name: '金额'
          }
        ],
        body: []
      },
      tabList: [
        { id: 0, name: '详情' },
        { id: 1, name: '彩种详情' },
        { id: 2, name: '投注记录' },
        { id: 3, name: '日工资' },
        { id: 4, name: '分红' },
        { id: 5, name: '发信' }
      ],
      userInfoList: [
        {
          title: '用户名',
          value: '',
          key: 'username'
        },
        {
          title: '用户昵称',
          value: '',
          key: 'nick_name'
        },
        {
          title: '用户类型',
          value: '',
          key: 'is_agent'
        },
        {
          title: '当前返点',
          value: '',
          key: 'rebate'
        },
        {
          title: '可用余额',
          value: '',
          key: 'balance'
        },
        {
          title: '最后登录时间',
          value: '',
          key: 'last_login'
        }
      ],
      teamInfoList: [
        {
          title: '团队余额',
          value: '0.00',
          key: 'total_balance'
        }
      ],
      showTabList: false,
      // 是否显示官方or信用tab
      showGameTypeBtn: 0,
      // 日工资
      wages_contractsList: [],
      wages_contractsTotalPage: 1,
      wages_contractsNowPage: 1,
      wages_pageSize: 10,
      wages_contracts_name: '',
      wages_contracts_rebeta: [],
      wages_rebate_list: [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        ['.'],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      ],
      wages_valid_member: '',
      wages_valid_money: '',
      // 分红
      bonus_contractsList: [],
      bonus_contractsTotalPage: 1,
      bonus_contractsNowPage: 1,
      bonus_pageSize: 10,
      bonus_contracts_name: '',
      bonus_contracts_rebeta: [],
      bonus_rebate_list: [],
      bonus_valid_member: '',
      bonus_valid_money: '',
      profit: '',
      showWagesContractsModal: false,
      showBonusContractsModal: false,
      upperInfo: '',
      agent_config: '',
      bottom_config: TOP_DEFAULT_CONFIG
    }
  },
  created() {
    this.initPage()
    console.log(this.activeTab, 'active')
  },
  methods: {
    ...Vuex.mapActions([
      'GET_SUB_AGENT_INFO',
      'GET_GAME_SETTING',
      'GET_BET_HISTORY',
      'GET_CONTRACTS',
      'CREATE_CONTRACTS',
      'GET_AGENT_INFO',
      'SET_CONTRACTS_STATUS',
      'SEND_MESSAGE',
      'GET_AGENT_INFO',
      'GET_ALL_GAMES'
    ]),
    wagesBottomPullHandle(loaded) {
      if (this.wages_contractsNowPage < this.wages_contractsTotalPage) {
        this.wages_contractsNowPage = this.wages_contractsNowPage + 1
        this._getWagesContractsList(() => {
          loaded('done')
        })
      } else {
        this.$vux.toast.show('已加载全部')
        setTimeout(() => {
          loaded('done')
        }, 1000)
      }
    },
    bonusBottomPullHandle(loaded) {
      if (this.bonus_contractsNowPage < this.bonus_contractsTotalPage) {
        this.bonus_contractsNowPage = this.bonus_contractsNowPage + 1
        this._getBonusContractsList(() => {
          loaded('done')
        })
      } else {
        this.$vux.toast.show('已加载全部')
        setTimeout(() => {
          loaded('done')
        }, 1000)
      }
    },
    haveActiveTab() {
      if (window.location.href.indexOf('cid') < -1) {
        this.activeTab = 1
      }
    },
    initPage() {
      this.GET_AGENT_INFO().then(res => {
        let list = this.tabList
        let agent = {
          showWages: true,
          showBonus: true
        }
        if (!res.data.my_wage_contract.rebate) {
          agent.showWages = false
          list = list.filter(item => {
            return item.id !== 3
          })
        }
        if (!res.data.my_dividend_contract.rebate) {
          agent.showBonus = false
          list = list.filter(item => {
            return item.id !== 4
          })
        }
        this.tabList = list
        this.agent_config = agent
        this.showTabList = true
      })
      this.GET_SUB_AGENT_INFO({
        cid: this.$route.query.cid
      }).then(res => {
        this.userInfoDetail = res.data.detail
        this.userInfoList.map(item => {
          item.value = res.data.detail[item.key]
          if (item.key === 'last_login') {
            item.value = formatTime(item.value * 1000)
          }
          if (item.key === 'is_agent') {
            item.value = item.value == '1' ? '代理' : '会员'
          }
        })
        this.teamInfoList.map(item => {
          item.value = res.data.detail[item.key]
        })
      })
      this.lotteryName = [this.$store.state.game.gameInfo[0].includes[0].name]
      console.log(this.lotteryName, 'lotteryName')
      this.$store.state.game.gameInfo.map(item => {
        this.lotteryNameList[0].push(...item.includes.map(item1 => item1.name))
      })
      this.getCurrentLottery()
      this._getAgentInfo()
    },
    handleMessageSubmit(data) {
      if (!data.title) {
        this.$vux.toast.show('请输入主题！')
        return
      }
      if (!data.content) {
        this.$vux.toast.show('请输入内容！')
        return
      }
      this.SEND_MESSAGE({
        type: 0,
        to_user: data.user.id,
        title: data.title,
        content: data.content
      }).then(() => {
        this.messageShow = false
        this.$store.commit('setMaskLayerShow', false)
      })
    },
    getCurrentLottery() {
      this.$store.state.game.gameInfo.map(item => {
        item.includes.map(item1 => {
          if (item1.name === this.lotteryName[0]) {
            this.currentLottery = item1
          }
        })
      })
    },
    getLotteryDetail() {
      this.GET_GAME_SETTING({
        game_code: this.currentLottery.game_code,
        position: this.activePlayTab
      }).then(res => {
        this.lotteryDetailData.body = res.data.games
      })
    },
    getBetHistory() {
      this.GET_BET_HISTORY({
        cid: this.$route.query.cid
      }).then(res => {
        if (res.data) {
          this.betDetailData.body = res.data.bills
        }
      })
    },
    handleTabChange(item) {
      this.activeTab = item.id
      this.wages_contractsList = []
      this.bonus_contractsList = []
      this.bonus_contractsNowPage = 1
      this.wages_contractsNowPage = 1
      this.bonus_contractsTotalPage = 1
      this.wages_contractsTotalPage = 1
      this.showWagesContractsModal = false
      this.showBonusContractsModal = false
      if (item.name === '彩种详情') {
        this.GET_ALL_GAMES().then(res => {
          let data = res.data.games
          if (data.credit.includes.length && data.official.includes.length) {
            this.showGameTypeBtn = true
          }
          this.getLotteryDetail()
        })
      }
      if (item.name === '投注记录') {
        this.getBetHistory()
      }
      if (item.name === '日工资') {
        this._getWagesContractsList()
      }
      if (item.name === '分红') {
        this._getBonusContractsList()
      }
    },
    replyMessageHandle() {
      this.messageShow = true
      this.$store.commit('setMaskLayerShow', true)
    },
    handleMessageCancel() {
      this.messageShow = false
      this.$store.commit('setMaskLayerShow', false)
    },
    changePlayTab(index) {
      this.activePlayTab = index
      this.getLotteryDetail()
    },
    handleLotteryChange() {
      this.getCurrentLottery()
      this.getLotteryDetail()
    },
    // 日工资
    addWagesContractsVerify(data) {
      if (!data.title) {
        this.$vux.toast.show('请填写契约名称')
        return false
      }
      if (!data.rebate) {
        this.$vux.toast.show('请选择分红比例')
        return false
      }
      if (!data.valid_member) {
        this.$vux.toast.show('请设置有效人数')
        return false
      }
      if (!data.valid_money) {
        this.$vux.toast.show('请设置有效投注')
        return false
      }
      return true
    },
    // 新增契约确认
    addWagesContractsHandle() {
      let data = {
        type: 0,
        title: this.wages_contracts_name,
        cid: this.userInfoDetail.id,
        rebate: parseFloat(this.wages_contracts_rebeta.join('')),
        valid_member: this.wages_valid_member,
        valid_money: this.wages_valid_money
      }
      if (!this.addWagesContractsVerify(data)) {
        return
      }
      this.CREATE_CONTRACTS(data).then(res => {
        setTimeout(() => {
          this.showWagesContractsModal = false
          this._getWagesContractsList()
        }, 1000)
      })
    },
    setWagesContractStatusHandle(status, id) {
      this.SET_CONTRACTS_STATUS({
        id: id,
        status: status,
        type: 0
      }).then(res => {
        setTimeout(() => {
          this.showWagesContractsModal = false
          this._getWagesContractsList()
        }, 1000)
      })
    },
    _getWagesContractsList(callback) {
      this.GET_CONTRACTS({
        cid: this.userInfoDetail.id,
        type: 0,
        rows: this.wages_pageSize,
        page: this.wages_contractsNowPage
      })
        .then(res => {
          this.wages_contractsList = [
            ...this.wages_contractsList,
            ...initSubContractsItem(res.data.contracts || [])
          ]
          let totalRows = res.data.total_rows
          this.wages_contractsTotalPage = Math.ceil(
            totalRows / this.wages_pageSize
          )
          callback && callback()
        })
        .catch(res => {
          callback && callback()
        })
    },
    _getWagesRebateList() {
      let rebate = this.upperInfo.my_wage_contract.rebate
        ? String(this.upperInfo.my_wage_contract.rebate)
        : '0'
      if (rebate.length === 1) {
        rebate = [rebate, 0]
      } else {
        rebate = rebate.split('.')
      }
      let value1 = this.getNumberList(rebate[0])
      let value2 = this.getNumberList(rebate[1])
      this.wages_rebate_list = [value1, ['.'], value2]
    },
    getNumberList(num) {
      let list = []
      let point = 0
      while (point <= parseFloat(num)) {
        list.push(parseInt(point))
        point += 1
      }
      return list
    },
    // 分红
    addBonusContractsVerify(data) {
      if (!data.title) {
        this.$vux.toast.show({
          type: 'warn',
          text: '请填写契约名称',
          time: 1000
        })
        return false
      }
      if (!data.rebate) {
        this.$vux.toast.show({
          type: 'warn',
          text: '请选择分红比例',
          time: 1000
        })
        return false
      }
      if (!data.valid_member) {
        this.$vux.toast.show({
          type: 'warn',
          text: '请设置有效人数',
          time: 1000
        })
        return false
      }
      if (!data.valid_money) {
        this.$vux.toast.show({
          type: 'warn',
          text: '请设置有效投注',
          time: 1000
        })
        return false
      }
      if (!data.profit) {
        this.$vux.toast.show({
          type: 'warn',
          text: '请设置平台盈利',
          time: 1000
        })
        return false
      }
      return true
    },
    // 新增契约确认
    addBonusContractsHandle() {
      let data = {
        type: 1,
        title: this.bonus_contracts_name,
        cid: this.userInfoDetail.id,
        rebate: parseFloat(this.bonus_contracts_rebeta.join('')),
        valid_member: this.bonus_valid_member,
        valid_money: this.bonus_valid_money,
        profit: this.profit,
        cycle: this.upperInfo.my_dividend_contract.cycle
      }
      if (!this.addBonusContractsVerify(data)) {
        return
      }
      this.CREATE_CONTRACTS(data).then(res => {
        setTimeout(() => {
          this.showBonusContractsModal = false
          this._getBonusContractsList()
        }, 1000)
      })
    },
    _getBonusContractsList(callback) {
      this.GET_CONTRACTS({
        cid: this.userInfoDetail.id,
        type: 1,
        rows: this.bonus_pageSize,
        page: this.bonus_contractsNowPage
      })
        .then(res => {
          this.bonus_contractsList = [
            ...this.bonus_contractsList,
            ...initSubContractsItem(res.data.contracts || [])
          ]
          let totalRows = res.data.total_rows
          this.bonus_contractsTotalPage = Math.ceil(
            totalRows / this.bonus_pageSize
          )
          callback && callback()
        })
        .catch(res => {
          callback && callback()
        })
    },
    setBonusContractStatusHandle(status, id) {
      this.SET_CONTRACTS_STATUS({
        id: id,
        status: status,
        type: 1
      }).then(res => {
        setTimeout(() => {
          this.showBonusContractsModal = false
          this._getBonusContractsList()
        }, 1000)
      })
    },
    _getBonusRebateList() {
      let rebate = this.upperInfo.my_dividend_contract.rebate
        ? String(this.upperInfo.my_dividend_contract.rebate)
        : '0'
      if (rebate.length === 1) {
        rebate = [rebate, 0]
      } else {
        rebate = rebate.split('.')
      }
      let value1 = this.getNumberList(rebate[0])
      let value2 = this.getNumberList(rebate[1])
      this.bonus_rebate_list = [value1, ['.'], value2]
    },
    showAddWagesContractsHandle() {
      this.showWagesContractsModal = true
    },
    showAddBonusContractsHandle() {
      this.showBonusContractsModal = true
    },
    _getAgentInfo() {
      this.GET_AGENT_INFO().then(res => {
        this.upperInfo = res.data

        // wage(日工资)：0否,1是，dividend(分红):0否,1是
        var _this = this
        if (
          this.upperInfo.has_contract &&
          (!this.upperInfo.has_contract.dividend ||
            !this.upperInfo.has_contract.wage)
        ) {
          _.forEach(this.tabList, function(value, key) {
            console.log(key)
            if (
              this.tabList[key].name === '分红' &&
              !this.upperInfo.has_contract.dividend
            ) {
              _this.tabList = _.slice(this.tabList, key, key + 1)
            } else if (
              this.tabList[key].name === '日工资' &&
              !this.upperInfo.has_contract.wage
            ) {
              _this.tabList = _.slice(this.tabList, key, key + 1)
            }
          })
          // delete this.tabList
        }
        this._getBonusRebateList()
        this._getWagesRebateList()
      })
    }
  }
}
</script>

<style scoped>
table {
  width: 100%;
  text-align: center;
}

thead {
  font-size: 14px;
  color: #999;
}

thead tr {
  height: 45px;
  border-bottom: solid 0.7px #d8dce2;
}

tbody {
  font-size: 14px;
  color: #333;
}

tbody tr {
  height: 50px;
  border-bottom: solid 0.7px #d8dce2;
  /* border-collapse:collapse; */
}

.tab-box {
  position: relative;
  z-index: 10;
  margin-top: 44px;
}

/* 回信 */

.reply-btn-area {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reply-btn-area button {
  width: 270px;
  height: 37px;
  border-radius: 3px;
  background-color: white;
  border: none;
  color: #666;
  font-size: 17px;
}

.lottery-select-area {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  height: 40px;
}

.lottery-detail-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  font-size: 14px;
  padding: 0 12px;
}

.lottery-detail-head > div {
  flex: 1;
}

.lottery-detail-head > div:first-child {
  justify-content: flex-start;
}

.lottery-detail-head > div:last-child {
  justify-content: flex-end;
}

.play-tab {
  display: flex;
  border: solid 0.5px #f10215;
  border-radius: 3px;
  overflow: hidden;
}

.play-tab > div {
  flex: 1;
  text-align: center;
  border-radius: 0px;
  line-height: 30px;
  height: 30px;
  font-weight: 500;
  color: #fa2939;
}

.play-tab > .active {
  background-color: #fa2939;
  color: white;
}

/*日工资，分红*/
.contracts-wrapper .contracts-title {
  position: relative;
  z-index: 50;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding: 0 14px;
  box-sizing: border-box;
  background-color: #f9fafe;
}

.contracts-wrapper .contracts-title .text {
  font-size: 14px;
  color: #666666;
}

.contracts-wrapper .contracts-title .add-contracts-btn {
  font-size: 14px;
}

.contractGroup {
  width: 100%;
  background-color: #ffffff;
  box-shadow: 0 2px 4px #e9eef5;
  margin-bottom: 10px;
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
  border-bottom: 1px solid #dfdfdf;
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
  flex: 0 0 60px;
  margin-right: 30px;
  font-size: 14px;
  color: #666666;
}

.contractGroup .group-middle > .info-item .value {
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
  border-radius: 40px;
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

.add-contracts-modal {
  position: fixed;
  top: 88px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 500;
  background-color: #f9fafe;
}

.add-contracts-modal .input-box {
  background-color: #ffffff;
}

.add-contracts-modal .input-group {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 50px;
  padding: 0 12px;
  border-bottom: 1px solid #dfdfdf;
  box-sizing: border-box;
}

.add-contracts-modal .input-group .text {
  flex: 0 0 70px;
  margin-right: 5px;
  font-size: 13px;
  color: #666666;
}

.add-contracts-modal .input-group input {
  flex: 1;
  font-size: 13px;
  color: #333333;
}

.add-contracts-modal .btn-group {
  margin-top: 10px;
  text-align: center;
}

.add-contracts-modal .btn-group button {
  width: 114px;
  height: 34px;
  border-radius: 40px;
  font-size: 13px;
  text-align: center;
}

.add-contracts-modal .btn-group button:first-child {
  margin-right: 5px;
  border: none;
  color: #ffffff;
}

.add-contracts-modal .btn-group button:last-child {
  background-color: #ffffff;
}

.add-contracts-modal .picker {
  padding: 0 !important;
  font-size: 13px;
}

.add-contracts-modal .weui-cell {
  padding: 0 !important;
}

.weui-cell_access {
  padding: 0 !important;
}

.scrollBox {
  position: fixed;
  top: 138px;
  left: 0;
  width: 100%;
  height: calc(100% - 138px);
}
</style>
