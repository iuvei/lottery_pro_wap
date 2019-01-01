<template>
  <div>
    <x-header :left-options="{backText: ''}">代理中心</x-header>
    <div class="agent-main">
      <div class="user-info">
        <div class="user-info-left">
          <div class="user-pic">
            <img
              src="../../../../static/images/home-blue/avatar-icon@3x.png"
              alt=""
            >
          </div>
          <div>
            <div class="user-name">
              {{$store.state.user.userInfo.username}}
            </div>
            <div class="user-money">
              <span class="red-color label">￥</span>
              <span class="red-color money-number">{{$store.getters.balance}}</span>
            </div>
          </div>
        </div>
        <div class="divider-line">

        </div>
        <div class="user-info-right">
          <div>
            <div class="red-color">0.000</div>
            <div class="black-level6 label">本月总收益</div>
          </div>
          <div>
            <div class="red-color">
              0.000
            </div>
            <div class="black-level6 label">昨日收益</div>
          </div>
        </div>
      </div>
    </div>
    <div class="empty"></div>
    <div
      class="user-content"
      id="vux_view_box_body"
    >
      <div class="sticky-tab tab-box">
        <tab
          v-if="showTabList"
          :line-width="1"
          v-model="activeTab"
          custom-bar-width="30px"
        >
          <tab-item
            v-for="item in tabList"
            :selected="item.id===activeTab"
            :key="item.id"
            @on-item-click="handleTabClick(item.id)"
          >{{item.name}}</tab-item>
        </tab>
      </div>
      <div
        class="tab-detail"
        v-if="hasLoadUserInfo"
      >
        <UserList v-show="activeTab===0" />
        <OpenAccount v-show="activeTab===1" />
				<Promotion v-show="activeTab===2" />
        <Team v-show="activeTab===3" />
        <wages-list v-show="activeTab===4" />
        <bonus-list v-show="activeTab===5" />
      </div>
    </div>
  </div>
</template>

<script>
import { Tab, TabItem, Sticky } from 'vux'
import OpenAccount from '../../../components/user/agent/OpenAccount'
import Promotion from '../../../components/user/agent/Promotion'
import UserList from '../../../components/user/agent/UserList'
import Team from '../../../components/user/agent/Team'
import WagesList from '../../../components/user/agent/wagesList'
import BonusList from '../../../components/user/agent/bonusList'
export default {
  components: {
    BonusList,
    WagesList,
    Tab,
    TabItem,
    Sticky,
    OpenAccount,
    Promotion,
    UserList,
    Team
  },
  data() {
    return {
      activeTab: 0,
      hasLoadUserInfo: false,
      tabList: [
        {
          id: 0,
          name: '用户列表'
        },
        {
          id: 1,
          name: '开户中心'
        },
        {
          id: 2,
          name: '推广'
        },
        {
          id: 3,
          name: '团队'
        },
        {
          id: 4,
          name: '日工资'
        },
        {
          id: 5,
          name: '分红'
        }
      ],
      showTabList: false
    }
  },
  created() {
    this.activeTab = parseInt(this.$route.query.tab) || 0
    this.initPage()
  },
  methods: {
    ...Vuex.mapActions(['GET_MEMBER_INFO', 'GET_AGENT_INFO']),
    initPage() {
      this._getTabList()
      this.GET_MEMBER_INFO({ type: 1 }).then(res => {
        this.hasLoadUserInfo = true
      })
      this.activeTab = this.$route.params.tab
        ? parseInt(this.$route.params.tab)
        : 0
    },
    _getTabList() {
      this.GET_AGENT_INFO().then(res => {
        let list = this.tabList
        if (!res.data.has_contract.wage) {
          list = list.filter(item => {
            return item.id !== 4
          })
        }
        if (!res.data.has_contract.dividend) {
          list = list.filter(item => {
            return item.id !== 5
          })
        }
        this.tabList = list
        this.showTabList = true
      })
    },
    handleTabClick(tab) {
      this.$router.replace({
        path: `/user/agent/${tab}?tab=${tab}`
      })
    }
  }
}
</script>

<style scoped>
.fs9 {
  font-size: 9px;
}
.agent-main {
  position: relative;
  z-index: 10;
  margin-top: 44px;
}
.empty {
  position: relative;
  z-index: 10;
  height: 10px;
  background-color: #f9fafe;
}
.user-info {
  height: 90px;
  background-color: white;
  padding: 0 12px;
}
.user-info,
.user-info-left,
.user-info-right {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.user-info-right {
  text-align: center;
  flex: 1;
  border-left: 0.5px solid #e2e4ef;
}
.user-pic {
  display: flex;
  align-items: center;
  margin-right: 5px;
}
.user-pic > img {
  width: 50px;
  height: 50px;
}
.divider-line {
  width: 30px;
}
.user-info-right .label {
  font-size: 11px;
}
.user-money .label {
  font-size: 11px;
}
.user-money .money-number {
  font-size: 12px;
}
.user-info-right > div > div:first-child {
  font-size: 17px;
}
.sticky-tab {
  height: 44px;
  position: sticky;
  top: 44px;
  z-index: 10;
}
.tab-detail {
  margin: 10px 0 20px 0px;
}
</style>
