<template>
  <div>
    <div class="home-top">
      <div class="user-area">
        <div @click="handleUserClick">
          <div class="user-pic dib">
            <img
              src="../../../static/images/home-blue/avatar-icon@2x.png"
              alt=""
            >
          </div>
          <div class="dib user-intro">
            {{hasLogin?$store.state.user.userInfo.username:'登录/注册'}}
          </div>
        </div>
        <div v-show="!hasLogin">
          <button
            class="try-play-btn"
            @click="touristLoginShow=true"
          >试玩</button>
        </div>
        <div
          class="freeReg"
          @click="goRegister()"
          v-show="$store.state.user.userInfo.username == 'guest1'"
        >免费注册</div>
      </div>
      <div>
        <ul class="option-list">
          <li
            v-for="item in optionListData"
            @click="handleOptionClick(item)"
          >
            <div>
              <img
                :src="item.icon"
                alt=""
              >
            </div>
            <div>
              {{item.name}}
            </div>
            <badge
              :text="bill_unsettlement_nums"
              class="badge"
              v-show="showBillNum==true"
            />
          </li>
        </ul>
      </div>
    </div>
    <div
      class="scroll-news-box"
      @click="lingToPage"
    >
      <div class="news-logo">
        <img
          src="../../../static/images/home-blue/wanyou-toutiao@3x.png"
          alt=""
        >
      </div>
      <div class="scroll-main">
        <marquee
          onmouseover="this.stop()"
          onmouseout="this.start()"
        >
          <a
            href="javascript:;"
            v-for="item in hasNoticeList"
            :key="item.title"
            v-if="item.status== 1"
          >{{item.title}}</a>
        </marquee>
      </div>
    </div>
    <div style="padding:12px">
      <LotteryEntry />
      <ActivitySwiper />
      <!-- <ThirdPartyGame /> -->
      <LotteryUserRank />
    </div>
    <TouristLogin
      :show="touristLoginShow"
      @cancel="handleTouristLoginCancel"
    />
    <FooterNav />
  </div>
</template>

<script>
import homeConfig from '../../config/home'
import FooterNav from '../../components/global/footerNav'
import LotteryEntry from '../../components/home/LotteryEntry'
import ActivitySwiper from '../../components/home/ActivitySwiper'
import ThirdPartyGame from '../../components/home/ThirdPartyGame'
import LotteryUserRank from '../../components/home/LotteryUserRank'
import TouristLogin from '../../components/games/user/TouristLogin'
import { Badge } from 'vux'
export default {
  components: {
    LotteryEntry,
    FooterNav,
    ActivitySwiper,
    ThirdPartyGame,
    LotteryUserRank,
    TouristLogin,
    Badge
  },
  data() {
    return {
      optionListData: homeConfig.optionListData,
      touristLoginShow: false,
      hasNoticeList: [],
      bill_unsettlement_nums: '',
      showBillNum: false,
      optionListName: false
    }
  },
  created() {
    this.GET_MEMBER_INFO2().then(res => {
      this.bill_unsettlement_nums = res.data.bill_unsettlement_nums
    })
    this.optionListData.forEach(item => {
      if (item.name === '投注记录') {
        this.optionListName = true
      }
    })
    if (this.bill_unsettlement_nums > 0 && this.optionListName) {
      this.showBillNum = true
    }
    console.log(this.optionListData, 'optionListData')
  },
  computed: {
    hasLogin: function() {
      return this.$store.state.user.userInfo.token
    }
  },
  mounted() {
    this.initPage()
  },
  methods: {
    ...Vuex.mapActions(['GET_NOTICE_LIST', 'GET_MEMBER_INFO2']),
    initPage() {
      this.GET_NOTICE_LIST().then(res => {
        this.hasloadData = true
        this.hasNoticeList = res.data
      })
    },
    lingToPage() {
      this.$router.push('/user/announcement')
    },
    handleTouristLoginCancel() {
      this.touristLoginShow = false
    },
    handleUserClick() {
      if (this.hasLogin) {
        this.$router.push({
          path: '/my'
        })
      } else {
        this.$router.push({
          path: '/user/login'
        })
      }
    },
    handleOptionClick(item) {
      if (item.requireLogin && !this.$store.getters.token) {
        this.$router.push({
          path: '/user/login'
        })
        return
      }
      if((item.path === "/bank/rechargeCentre"||item.path === "/bank/withdraw")&&this.$store.state.user && this.$store.state.user.userInfo.guest === '1') {
        Vue.$vux.toast.text('请登录正式账号操作')
        return
      }
      if (item.path) {
        this.$router.push({
          path: item.path
        })
      }
    },
    goRegister() {
      this.$bus.$emit('logout')
      this.$router.push({
        path: '/user/register'
      })
    }
  }
}
</script>

<style scoped>
.home-top {
  /* background: linear-gradient(to right, #f10215, #ff3d4c); */
  padding: 0 13px;
  color: white;
  height: 154px;
}
.user-pic {
  width: 30px;
  height: 30px;
  border-radius: 30px;
  margin-right: 8px;
}
.user-intro {
  font-size: 13px;
  font-weight: 500;
}
.try-play-btn {
  width: 55px;
  height: 29px;
  font-size: 13px;
  background-color: white;
  border-radius: 3px;
  border: none;
}
.user-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 54px;
}
.freeReg {
  font-size: 14px;
}

.user-pic {
  width: 30px;
  height: 30px;
}
.user-pic > img {
  width: 100%;
}
.user-area > div:first-child {
  display: flex;
  align-items: center;
}
.option-list {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  font-size: 13px;
  text-align: center;
}
.option-list img {
  width: 34px;
  height: 34px;
}
.option-list > li > div:last-child {
  margin-top: 14px;
}

.option-list > li > div {
  height: 48px;
}
.scroll-news-box {
  display: flex;
  justify-content: space-between;
  background-color: white;
  padding: 0 12px;
  line-height: 34px;
  align-items: center;
}
.scroll-news-box > .news-logo {
  width: 60px;
  padding-right: 6px;
}
.scroll-news-box > .news-logo > img {
  width: 100%;
  vertical-align: middle;
  margin-top: -5px;
}
.scroll-news-box > .scroll-main {
  flex: 1;
  height: 34px;
  font-size: 13px;
}
.scroll-main a {
  color: #878a98;
}
</style>
