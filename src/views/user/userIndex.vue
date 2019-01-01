<template>
  <div>
    <!-- 个人中心页面 -->
    <div class="user-area">
      <div class="user-top">
        <div>
          <div class="user-info">
            <div
              v-if="!$store.getters.token"
              class="dib username"
              @click="handleLogin"
            >登录/注册</div>
            <div
              v-else
              @click="goToPath('/user/info')"
            >{{$store.getters.username}}</div>
            <div class="dib">
              <img
                src="../../../static/images/icon/gold-member-icon@3x.png"
                alt=""
              >
            </div>
          </div>
          <div v-show="$store.getters.token">余额:{{$store.getters.balance}}元</div>
        </div>
        <div
          class="user-avatar"
          @click="goToPath('/user/info')"
        >
          <img :src="photoSrcPath?photoSrcPath:'../../../static/images/home-blue/avatar-icon@3x.png'" />
        </div>
      </div>

      <div class="user-main">
        <div>
          <ul class="money-link-list">
            <li @click="goToPath('/bank/rechargeCentre')">
              <div>
                <img src="../../../static/images/icon/charge-icon@3x.png" />
              </div>
              <div>
                充值
              </div>
            </li>
            <li @click="goToPath('/bank/withdraw')">
              <div>
                <img src="../../../static/images/icon/withdraw-icon@3x.png" />
              </div>
              <div>
                提现
              </div>
            </li>
            <!--  @click="goToPath('/money/transfer')" -->
            <li @click='noHave()'>
              <div>
                <img src="../../../static/images/icon/transfer-icon@3x.png" />
              </div>
              <div>
                转账
              </div>
            </li>
            <li @click="goToPath('/bank/bankCardManage')">
              <div>
                <img src="../../../static/images/icon/bankcard-icon@3x.png" />
              </div>
              <div>
                银行卡
              </div>
            </li>
          </ul>
        </div>
        <div>
          <div
            class="my-order-title"
            @click="goToOrder(0)"
          >
            <div>
              我的注单
            </div>
            <div>
              <div class="dib">查看全部订单</div>
              <div class="df">
                <img
                  class="arrow-right"
                  src="../../../static/images/icon/arrow-right-icon@3x.png"
                  alt=""
                >
              </div>
            </div>
          </div>
          <div>
            <ul class="order-link-list">
              <li @click="goToOrder(1)">
                <div>
                  <!-- <img src="../../../static/images/icon/reward-red-icon@3x.png" alt=""> -->
                  <img
                    src="../../../static/images/icon/wating-clock-icon@3x.png"
                    alt=""
                  >
                </div>
                <div>
                  待开奖订单
                </div>
                <badge
                  :text="bill_unsettlement_nums"
                  class="badge"
                  v-show="bill_unsettlement_nums"
                />
              </li>
              <li @click="goToOrder(2)">
                <div>
                  <img
                    src="../../../static/images/icon/reward-red-icon@3x.png"
                    alt=""
                  >
                </div>
                <div>
                  中奖订单
                </div>
              </li>
              <li @click="goToOrder(3)">
                <div>
                  <img
                    src="../../../static/images/icon/not-win-icon@3x.png"
                    alt=""
                  >
                </div>
                <div>
                  未中奖订单
                </div>
              </li>
            </ul>
          </div>
        </div>
        <CardList :list="userCardList.slice(0,1)" />
        <CardList
          v-if="is_agent"
          :list="userCardList.slice(1,2)"
        />
        <!-- <CardList :list="userCardList.slice(2,3)" /> -->
        <!-- <CardList :list="userCardList.slice(2,3)" /> -->
        <CardList :list="userCardList.slice(2,8)" />
        <div
          class="quit-area"
          v-show="$store.getters.token"
        >
          <button
            class="btn-quit"
            @click="logOut"
          >退出登录</button>
        </div>
      </div>
    </div>
    <FooterNav />
  </div>
</template>

<script>
import Vue from 'vue'
import FooterNav from '../../components/global/footerNav'
import cardCollection from '../../config/cardCollection'
import CardList from '../../components/global/CardList'
import { Badge } from 'vux'
export default {
  components: {
    FooterNav,
    CardList,
    Badge
  },
  data() {
    return {
      userCardList: cardCollection.user,
      bill_unsettlement_nums: '',
      photoSrcPath: '',
      is_agent: 1
    }
  },
  created() {
    // 获取余额
    this.GET_MEMBER_INFO({ type: 1 }).then(res => {
      this.is_agent = res.data.user.is_agent
        ? parseInt(res.data.user.is_agent)
        : 0
    })
    this.GET_MEMBER_INFO2().then(res => {
      this.bill_unsettlement_nums = res.data.bill_unsettlement_nums
    })
    this.photoSrcPath = localStorage.getItem('photoSrcPath')
    var _this = this
    this.$bus.$on("logout",function () {
      _this.logOut()
    })
  },
  methods: {
    ...Vuex.mapActions(['GET_MEMBER_INFO', 'GET_MEMBER_INFO2']),
    handleLogin() {
      this.$router.push({
        path: '/user/login'
      })
    },
    logOut() {
      this.clearUserData()
      this.$router.push({
        path: '/user/login'
      })
    },
    clearUserData() {
      // 清空session
      sessionStorage.clear()
      // 重置store中和用户相关的数据
      this.$store.commit('resetUserData')
    },
    goToOrder(type) {
      this.$router.push({
        path: '/order/history',
        query: {
          type
        }
      })
    },
    goToPath(path) {
      //限制登录
      if (this.$store.state.user && this.$store.state.user.userInfo.guest === "1") {
        Vue.$vux.toast.text('请登录正式账号操作')
        return
      }
      if (path === '/money/transfer') {
        this.$vux.toast.show('尚未开通')
        return
      }
    },
    noHave() {
      Vue.$vux.toast.text('暂未开通')
    }
  }
}
</script>

<style scoped>
.user-area {
  background-color: #f9fafe;
  padding-bottom: 20px;
}
.user-top {
  height: 167px;
  background-size: 100% 100%;
  color: white;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  padding-top: 40px;
  box-sizing: border-box;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-info .username {
  font-size: 18px;
  font-weight: bold;
}

.user-info img {
  width: 25px;
}

.user-avatar img {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin-right: 10px;
}
.user-main {
  padding: 0 10px;
  margin-top: -40px;
  color: #252525;
}

.user-main > div:not(.quit-area) {
  background-color: white;
  border-radius: 7px;
  margin-bottom: 10px;
}
.user-main div:nth-child(5) {
  margin-bottom: 0;
	/* border-bottom: solid 0.5px #e2e4ef; */
}

.money-link-list,
.order-link-list {
  display: flex;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  padding: 0 12px;
  text-align: center;
}
.money-link-list > li,
.order-link-list > li {
  align-items: center;
  flex-direction: column;
  padding: 10px 0;
  position: relative;
}
.money-link-list > li img {
  width: 32px;
}
.money-link-list {
  height: 76px;
  padding: 0 25px;
}
.order-link-list > li img {
  width: 43px;
}

.order-link-list .badge {
  position: absolute;
  left: 58%;
  top: 6px;
}
.money-link-list > li > div:last-child {
  font-weight: bold;
  font-size: 12px;
  color: #252525;
}
.my-order-title,
.my-fund-title {
  display: flex;
  justify-content: space-between;
  line-height: 40px;
  padding: 0 10px;
  border-bottom: solid 0.5px #e2e4ef;
}
.my-order-title > div:first-child,
.my-fund-title > div:first-child {
  font-size: 14px;
  font-weight: bold;
  color: #252525;
}
.my-fund-title > div:first-child {
  display: flex;
  align-items: center;
}
.my-order-title > div:last-child,
.my-fund-title > div:last-child {
  display: flex;
  align-items: center;
  font-size: 12px;
}
.arrow-right {
  zoom: 0.4;
}
.fund-record-icon {
  width: 20px;
  margin-top: 5px;
}
.quit-area {
  display: flex;
  justify-content: center;
}
.btn-quit {
  height: 40px;
  font-size: 18px;
  color: white;
  background-color: #e2e4ef;
  border: none;
  width: 200px;
  border-radius: 40px;
  margin-top: 15px;
  margin-bottom: 20px;
}
</style>
