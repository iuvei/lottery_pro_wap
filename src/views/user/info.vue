<template>
  <div class="info-container">
    <x-header
      :left-options="{backText: '', preventGoBack: true}"
      @on-click-back="goBack"
    >个人信息<router-link
        :to="`/user/setInfo?rebate=${userInfo.rebate}`"
        tag="a"
        slot="right"
      >修改</router-link>
    </x-header>
    <div
      class="info-group"
      style="margin-top: 44px"
    >
      <div class="info-item img-item">
        <div class="text">头像</div>
        <div class="value">
          <img
            class="PersonPhoto"
            :src="photoSrcPath?photoSrcPath:'../../../static/images/home-blue/avatar-icon@3x.png'"
            alt=""
          >
        </div>
      </div>
      <div class="info-item">
        <div class="text">用户名</div>
        <div class="value"><span class="value-text">{{userInfo.username}}</span></div>
      </div>
      <div class="info-item">
        <div class="text">昵称</div>
        <div class="value"><span class="value-text">{{userInfo.nick_name}}</span></div>
      </div>
      <div class="info-item">
        <div class="text">性别</div>
        <div class="value"><span class="value-text">{{userInfo.sex == '1' ? '女':'男'}}</span></div>
      </div>
      <div class="info-item">
        <div class="text">生日</div>
        <div class="value"><span class="value-text">{{userInfo.birthday? formatTime(userInfo.birthday) : ''}}</span></div>
      </div>
    </div>
    <div class="info-group">
      <div class="info-item">
        <div class="text">账户余额</div>
        <div class="value"><span class="bonusDetail red-color">{{userInfo.balance}}</span></div>
      </div>
      <div
        class="info-item"
        @click="goBonus()"
      >
        <div class="text">奖金组</div>
        <div class="value"><span class="bonusDetail red-color">查看详情</span></div>
      </div>
      <div class="info-item">
        <div class="text">会员返点</div>
        <div class="value"><span class="value-text">{{userInfo.rebate}}%</span></div>
      </div>
      <div class="info-item">
        <div class="text">自身保留返点</div>
        <div class="value"><span class="value-text">{{userInfo.rebate_diff}}%</span></div>
      </div>
      <div class="info-item">
        <div class="text">上周投注</div>
        <div class="value"><span class="value-text">{{parseFloat(userInfo.bets_last_week || 0).toFixed(3)}}</span></div>
      </div>
      <div class="info-item">
        <div class="text">本周投注</div>
        <div class="value"><span class="value-text">{{parseFloat(userInfo.bets_this_week || 0).toFixed(3)}}</span></div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { getYYYY_MM_HH } from '../../assets/js/formatDate'
import { Cell, PopupRadio, Datetime, AlertPlugin } from 'vux'
export default {
  data() {
    return {
      userInfo: '',
      photoSrcPath: ''
    }
  },
  created() {
    this._initPage()
    this.photoSrcPath = localStorage.getItem('photoSrcPath')
  },
  components: {
    Cell,
    PopupRadio,
    Datetime,
    AlertPlugin
  },
  methods: {
    ...mapActions(['GET_MEMBER_INFO', 'GET_GAME_SETTING']),
    formatTime(date) {
      return getYYYY_MM_HH(date * 1000)
    },
    goBack() {
      this.$router.push('/my')
    },
    _initPage() {
      this.GET_MEMBER_INFO({ type: 1 }).then(res => {
        this.userInfo = res.data.user
        console.log(res.data.user)
      })
    },
    goBonus() {
      this.$router.push({
        path: '/user/bonusDetail'
      })
    }
  }
}
</script>

<style scoped lang="scss">
.info-group {
  padding-left: 12px;
  background-color: #ffffff;
  box-sizing: border-box;
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
  .info-item {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    height: 48px;
    padding: 4px 15px 4px 0;
    border-bottom: 0.5px solid #e2e4ef;
    box-sizing: border-box;
    &:last-child {
      border-bottom: none;
    }
    &.img-item {
      height: 80px;
    }
    .text {
      flex: 0 0 100px;
      font-size: 14px;
      color: #333333;
    }
    .value {
      flex: 1;
      text-align: right;
      img {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        padding-top: 6px;
      }
      .value-text {
        font-size: 14px;
        color: #333333;
			}
			.bonusDetail {
				font-size: 14px;
			}
    }
  }
}
</style>
