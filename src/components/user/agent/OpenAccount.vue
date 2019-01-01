<template>
  <div class="open-account-center">
    <div>
      <div class="open-account-input-box">
        <div>
          <div class="open-type">
            <div>开户类型</div>
            <div class="account-switcher">
              <div :class="{'switch-active':accountType===0}" @click="accountType=0;is_agent=1">代理</div>
              <div :class="{'switch-active':accountType===1}" @click="accountType=1;is_agent=0">会员</div>
            </div>
          </div>
        </div>
        <div>
          <div>
            <div class="box-title">开户名</div>
            <input type="text" placeholder="6-16位字母或数字" v-model="username">
          </div>
          <div class="require-icon">*</div>
        </div>
        <div>
          <div>
            <div class="box-title">登录密码</div>
            <input type="password" placeholder="6-20位字母数字组合" v-model="password">
          </div>
          <div class="require-icon">*</div>
        </div>
        <div>
          <div class="box-title">用户返点</div>
          <group>
            <popup-picker :data="currentRebateList" v-model="rebate" cancel-text="请选择返点" confirm-text="确认" @on-change="handleRebateChange" @on-shadow-change="handleShadowChange" placeholder="请选择返点"></popup-picker>
          </group>

        </div>
				 <div>
          <div>
            <div class="box-title">真实姓名</div>
            <input type="text" placeholder="请输入真实姓名" v-model="real_name" onkeyup="value=value.replace(/[^\u4E00-\u9FA5]/g,'')" >
          </div>
           <div class="require-icon">*</div>
        </div>
        <div>
          <div>
            <div class="box-title">昵称</div>
            <input type="text" placeholder="请输入账户昵称" v-model="nick_name">
          </div>
        </div>
        <div>
          <div>
            <div class="box-title">手机号码</div>
            <input type="text" placeholder="请输入手机号码" v-model="mobile">
          </div>
        </div>
        <div>
          <div>
            <div class="box-title">qq号码</div>
            <input type="text" placeholder="请输入qq号码" v-model="qq">
          </div>
        </div>
        <div>
          <div>
            <div class="box-title">个人邮箱</div>
            <input type="text" placeholder="请输入个人邮箱" v-model="email">
          </div>
        </div>
      </div>
      <button class="btn-confirm" @click="openAccount" :disabled="openDisabled">执行开户</button>
      <div class="flex-row">
        <div>
          <div class="dib">
            您的邀请码
          </div>
          <div class="dib red-color ml5">
            {{inviteCode}}
          </div>
        </div>
        <div class="copy-btn" v-clipboard:copy="inviteCode" v-clipboard:success="handleCopySuccess" v-clipboard:error="handleCopyError">
          点击复制
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { PopupPicker } from 'vux'

export default {
  components: {
    PopupPicker
  },
  data() {
    return {
      inviteCode: '',
      accountType: 0,
      currentRebate: '',
      rebateList: [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        ['.'],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        ['%']
      ],
      currentRebateList: [],
      is_agent: 1,
      username: '',
      password: '',
      rebate: [],
      nick_name: '',
      real_name: '',
      mobile: '',
      qq: '',
      email: ''
    }
  },
  computed: {
    openDisabled() {
      return !(this.username && this.password && this.rebate)
    }
  },
  created() {
    this.initPage()
  },
  methods: {
    ...Vuex.mapActions(['AGENT_ADD_MEMBER']),
    initPage() {
      this.currentRebate = this.$store.state.user.userInfo.rebate
      this.inviteCode = this.$store.state.user.userInfo.invitation_code
      let max1 = this.currentRebate.split('.')[0]
      this.currentRebateList = this.rebateList
      this.currentRebateList[0] = this.rebateList[0].filter(
        item => item <= max1
      )
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
        type: 'error',
        text: '复制失败',
        time: 500
      })
    },
    handleRebateChange(val) {
      this.rebate = val
      console.log(this.rebate)
    },
    handleShadowChange(val) {
      if (val[0] === this.currentRebate.split('.')[0]) {
        let max2 = this.currentRebate.split('.')[1]
        this.currentRebateList = [
          this.rebateList[0],
          ['.'],
          this.rebateList[2].filter(item => item <= max2),
          ['%']
        ]
      } else {
        this.currentRebateList = this.rebateList
      }
    },
    openAccount() {
      let {
        is_agent,
        username,
        password,
        rebate,
        nick_name,
        real_name,
        mobile,
        qq,
        email
      } = this
      let _this = this
      this.AGENT_ADD_MEMBER({
        is_agent,
        username,
        password,
        rebate: rebate.join('').replace('%', ''),
        nick_name,
        real_name,
        mobile,
        qq,
        email
      }).then(res => {
        _this.accountType = 0
        _this.is_agent = 1
        _this.username = ''
        _this.password = ''
        _this.rebate = []
        _this.nick_name = ''
        _this.real_name = ''
        _this.mobile = ''
        _this.qq = ''
        _this.email = ''
      })
    }
  }
}
</script>

<style scoped>
.account-switcher {
  width: 84px;
  display: flex;
  border-radius: 40px;
  height: 28px;
  line-height: 28px;
  overflow: hidden;
  font-size: 14px;
}
.account-switcher > div {
  flex: 1;
  position: relative;
  text-align: center;
  border-radius: 40px;
}
.account-switcher > div.switch-active {
  color: white;
}
.open-account-center {
  background-color: #f9fafe;
}
.open-btn {
  width: 70%;
  height: 50px;
  background-color: #e52020;
  color: #fff;
  font-size: 20px;
  border-radius: 30px;
  border: none;
  margin: 20px auto;
}
.copy-btn {
  width: 80px;
  height: 29px;
  font-size: 12px;
  text-align: center;
  border-radius: 30px;
  line-height: 29px;
}
.flex-row {
  display: flex;
  justify-content: space-between;
  padding: 0 12px;
  background-color: white;
  height: 40px;
  align-items: center;
}
.open-account-input-box > div {
  display: flex;
  background-color: white;
  align-items: center;
  position: relative;
  padding-left: 12px;
  line-height: 40px;
}

.open-account-input-box > div > div {
  border-bottom: 0.5px solid #e2e4ef;
}
.open-account-input-box > div:last-child > div {
  border-bottom: none;
}
.open-account-input-box > div:last-child:after {
  display: none;
}
.open-account-input-box > div > div {
  display: flex;
  padding-right: 12px;
}
.open-account-input-box > div > div:first-child {
  flex: 1;
}
.open-account-input-box input {
  height: 40px;
  flex: 1;
  border: none;
  outline: none;
  line-height: 40px;
}
.box-title {
  width: 80px;
  line-height: 40px;
  font-size: 14px;
  color: #252525;
}
.require-icon {
  color: red;
}
.picker-area {
  width: 100px;
  height: 30px;
}
.open-type {
  align-items: center;
  justify-content: space-between;
}
</style>

<style>
.open-account-input-box .vux-no-group-title {
  margin-top: 0;
}
.open-account-input-box .weui-cell {
  padding-right: 2px;
}

.open-account-input-box .weui-cell_access .weui-cell__ft:after {
  border-width: 0px 2px 2px 0px;
  top: -2px;
  right: 0;
}
</style>

