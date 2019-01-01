<template>
  <div class="modify-pass setWithdrawPass">
    <x-header :left-options="{backText: ''}">设置提现密码</x-header>
    <div style="margin-top:44px">
      <div class=" intro">
        <!-- <span>请输入6位数字密码</span> -->
      </div>
      <div class="white-bg">
        <x-input title="提现密码" :is-type="passValidator" required type="password" placeholder="请输入6位数字密码" v-model="newPass1" :min="6" :max="6" @on-change="handleInputChange"></x-input>
        <x-input title="确认密码" :is-type="passValidator" required v-model="newPass2" type="password" placeholder="确认新密码" :equal-with="newPass1" :min="6" :max="16" @on-change="handleInputChange"></x-input>
      </div>
      <div>
        <button class="modify-btn" :disabled="modifyDisabled" @click="modifyPass">确认</button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  components: {
  },
  data() {
    return {
      newPass1: '',
      newPass2: '',
      passValidator: function(val) {
        let validateBool = /^[0-9]{6}$/.test(val)
        return {
          valid: validateBool,
          msg: '必须输入6-16位数字字母组合喔'
        }
      },
      modifyDisabled: true
    }
  },
  methods: {
    ...Vuex.mapActions(['MODIFY_WITHDRAW_PWD']),
    handleInputChange(val) {
      let regExp = /^[0-9]{6}$/
      let disabled = !(
        regExp.test(this.newPass1) &&
        regExp.test(this.newPass2) &&
        this.newPass1 === this.newPass2
      )
      this.modifyDisabled = disabled
    },
    modifyPass() {
      this.MODIFY_WITHDRAW_PWD({
        withdraw_password: this.newPass1,
        re_withdraw_password: this.newPass2
      }).then(res => {
        if (res.result) {
          this.$router.replace({
            path: '/user/login'
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.white-bg {
  background-color: white;
}

.intro {
  color: #666;
  font-size: 14px;
  text-indent: 15px;
  line-height: 40px;
}

.modify-btn {
  width: 240px;
  height: 40px;
  color: #fff;
  font-size: 20px;
  border-radius: 30px;
  border: none;
  margin: 20px auto;
  border: none;
  display: block;
}

.modify-btn[disabled] {
  background-color: #e2e4ef;
}
.weui-icon-success {
	font-size:18px;
	color:#e52020
}

</style>
