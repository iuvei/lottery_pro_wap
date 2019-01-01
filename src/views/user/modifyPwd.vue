<template>
  <div class="mod-pwd-container">
    <x-header :left-options="{backText: ''}">修改密码</x-header>
    <div class="vux-tabbar">
      <div class="mod-pwd-items">
        <div class="mod-pwd-child" @click='modLoginPwd'>
          <p>
            <label class="vux-label">修改登录密码</label>
          </p>
          <x-icon type="ios-arrow-right" class="right-arrow"></x-icon>
        </div>
        <div class="mod-pwd-child" @click='modWithdrawPwd'>
          <p>
            <label class="vux-label">{{$store.state.user.userInfo.isset_withdraw_password?'修改':'设置'}}提现密码</label>
          </p>
          <x-icon type="ios-arrow-right" class="right-arrow"></x-icon>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {}
  },
  methods: {
    modLoginPwd() {
      this.$router.push({
        path: '/user/modloginPwd'
      })
    },
    modWithdrawPwd() {
      if (this.$store.state.user.userInfo.isset_withdraw_password) {
        this.$router.push({
          path: '/user/modWithdrawPwd'
        })
      } else {
        this.$router.push({
          path: '/user/setWithdrawPwd'
        })
      }
    }
  }
}
</script>

<style scoped>
.mod-pwd-container {
  background-color: #fff;
  font-size: 14px
}
.vux-header {
  position: relative;
}
.vux-x-icon {
  fill: #e2e4ef;
}
.mod-pwd-items {
  padding-left: 20px;
}
.mod-pwd-child {
  padding: 10px 0;
  position: relative;
}
.mod-pwd-child:first-child {
  border-bottom: 0.5px solid #e2e4ef;
}
.right-arrow {
  position: absolute;
  width: 24px;
  height: 24px;
  top: 10px;
  right: 10px;
}
</style>



