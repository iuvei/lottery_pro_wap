<template>
  <div class="modify-pass">
    <x-header :left-options="{backText: ''}">修改登录密码</x-header>
    <div style="margin-top:44px">
      <div class="white-bg">
        <x-input title="旧登录密码" :is-type="passValidator" required type="password" placeholder="输入旧密码" v-model="originPass" :min="6" :max="16" @on-change="handleInputChange"></x-input>
      </div>
      <div class=" intro">
        为了您的账号安全,请输入<span>6-16位字母数字组合密码</span>
      </div>
      <div class="white-bg">
        <x-input title="新登录密码" :is-type="passValidator" novalidate required type="password" placeholder="请输入6-16位字母数字组合密码" v-model="newPass1" :min="6" :max="16" @on-change="handleInputChange"></x-input>
        <x-input title="确认新密码" :is-type="passValidator" required v-model="newPass2" type="password" placeholder="请确认新密码" :equal-with="newPass1" :min="6" :max="16" @on-change="handleInputChange"></x-input>
      </div>
      <div>
        <button class="modify-btn" :disabled="modifyDisabled" @click="modifyPass">确认修改</button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  components: {},
  data() {
    return {
      originPass: '',
      newPass1: '',
      newPass2: '',
      iconType: '',
      passValidator: function(val) {
        let validateBool = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(
          val
        )
        this.iconType = validateBool && 'success'
        return {
          valid: validateBool,
          msg: '必须输入6-16位数字字母组合喔'
        }
      },
      modifyDisabled: true
    }
  },
  methods: {
    ...Vuex.mapActions(['MODIFY_LOGIN_PWD']),
    handleInputChange(val) {
      let regExp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
      let disabled = !(
        regExp.test(this.originPass) &&
        regExp.test(this.newPass1) &&
        regExp.test(this.newPass2) &&
        this.newPass1 === this.newPass2
      )
      this.modifyDisabled = disabled
    },
    modifyPass() {
      this.MODIFY_LOGIN_PWD({
        password: this.originPass,
        new_password: this.newPass1
      }).then(res => {
        if (res.result) {
          this.$vux.toast.show('密码更换成功，请重新登录')
          setTimeout(() => {
            this.$router.replace({
              path: '/user/login'
            })
          }, 2000)
        }
      })
    }
  }
}
</script>

<style scoped>
.modify-pass {
  font-size: 14px;
}
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
</style>
