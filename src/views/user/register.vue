<template>
  <div
    class="register-box"
    :style="{height:$window.innerHeight+'px'}"
  >
    <div>
      <x-icon
        type="ios-arrow-left"
        size="30"
        class="back"
        @click="goBack"
      ></x-icon>
      <span
        class="service loginkefu"
        @click="goKefu()"
      >在线客服</span>
    </div>
    <div class="img-group">
      <img
        src="/static/images/home-blue/login_logo.png"
        class="red-block"
      />
    </div>
    <div
      class="container"
      novalidate
    >

      <div
        class="user-register fs14"
        novalidate
        v-show="!$route.query.code"
      >
        <x-input
          title="邀请码"
          v-validate="'required|username'"
          type="text"
          placeholder="输入邀请码"
          label-width="70px"
          v-model="inviteCode"
        ></x-input>
      </div>
      <div
        class="user-register fs14"
        novalidate
      >
        <x-input
          title="用户名"
          v-validate="'required|username'"
          type="text"
          placeholder="输入用户名"
          label-width="70px"
          :min="4"
          :max="16"
          name="username"
          v-model="username"
        ></x-input>
      </div>
      <span v-show="xErrors.has('username')">{{ xErrors.first('username') }}</span>
      <div class="password">
        <x-input
          title="密码"
          :type="pwdType"
          placeholder="6-16位字母数字组合"
          label-width="70px"
          v-model="password"
          name="password"
          v-validate="'required|password'"
          ref="password"
        ></x-input>
        <i
          class="iconfont icon-eye1"
          id="regPwdEye"
          @click="hideShowPsw"
        ></i>
      </div>
      <span v-show="xErrors.has('password')">{{ xErrors.first('password') }}</span>
      <div class="confirm-password">
        <x-input
          title="确认密码"
          :type="pwdType1"
          placeholder="请确认密码"
          id="confirmPwd"
          label-width="70px"
          v-model="confirmPassword"
          :equal-with="password"
          name="confirmPassword"
          v-validate="'required|confirmPassword|confirmed:password'"
        ></x-input>
        <i
          class="iconfont icon-eye1"
          id="confirmPwdEye"
          @click="hideShowConfirmPsw"
        ></i>
      </div>
      <span v-show="xErrors.has('confirmPassword')">{{ xErrors.first('confirmPassword') }}</span>
      <div
        class="user-register fs14"
        novalidate
      >
        <x-input
          :max="10"
          title="真实姓名"
          type="text"
          placeholder="输入真实姓名"
          label-width="70px"
          v-model="realName"
          onkeyup="realName=realName.replace(/[^\u4E00-\u9FA5]/g,'')"
        ></x-input>
      </div>
      <div class="verify">
        <div class="verify-input">
          <x-input
            title="验证码"
            type="text"
            placeholder="输入验证码"
            name="verifyInput"
            label-width="70px"
            v-model="verifyInput"
            id="fverify"
          >
          </x-input>
        </div>
        <div class="verify-img">
          <ImgVerify
            @imgCode="loadVerifyCode"
            :shouldReload="verifyCodeShouldReload"
            @setReload="setReload"
            @getVerifyToken="getVerifyToken"
          />
        </div>
      </div>
      <span v-show="xErrors.has('verifyInput')">{{ xErrors.first('verifyInput') }}</span>
      <div
        class="agree"
        @click="agreeChecked=!agreeChecked"
      >
        <!-- <input type="checkbox" id="agree" name="agree" v-validate="'required'"> -->
        <div
          id="agree"
          class="check-box"
          :class="{checked:agreeChecked}"
        >
          <i
            class="iconfont icon-gouxuan"
            v-show="agreeChecked"
          ></i>
        </div>
        <label for="agree">已阅读并同意
          <span @click="goAgreement()">《288彩票服务条款》</span>
        </label>
      </div>

      <div>
        <span v-show="xErrors.has('agree')">{{ xErrors.first('agree') }}</span>
      </div>
      <button
        class="btn-confirm"
        @click="handleRegister"
      >注册
      </button>
      <div class="linkToGroup">
        <a
          href="javascript:;"
          @click="loginAsTourist"
        >免费试玩</a> |
        <a
          href="javascript:void(0)"
          @click="login"
        >立即登录</a>
      </div>
    </div>
    <TouristLogin
      :show="touristLoginShow"
      @cancel="handleTouristLoginCancel"
    />
  </div>
</template>

<script>
import ImgVerify from '../../components/global/v-img-verify'
import VeeValidate, { Validator } from 'vee-validate'
import TouristLogin from '../../components/games/user/TouristLogin'
import { setTimeout } from 'timers'

export default {
  data() {
    return {
      inviteCode: '',
      username: '',
      password: '',
      confirmPassword: '',
      verifyInput: '',
      verifyCode: '',
      required: true,
      checked: '',
      pwdType: 'password',
      pwdType1: 'password',
      realName: '',
      verifyCodeShouldReload: false,
      verifyToken: '',
      touristLoginShow: false,
      agreeChecked: false,
      promotion_code: '',
      is_agent: ''
    }
  },
  components: {
    ImgVerify,
    TouristLogin
  },
  created() {
    this.initValidate()
    console.log(this.$route.query.code, this.$route.query.type)
  },
  methods: {
    ...Vuex.mapActions(['REGISTER', 'LOGIN_AS_TOURIST']),
    getVerifyToken(key) {
      this.verifyToken = key
    },
    initValidate() {
      this.validator = new Validator({})
      VeeValidate.Validator.localize('zh_CN', {
        messages: {
          required: field => '*' + field + '不能为空！',
          confirmed: () => '两次密码不一致'
        },
        attributes: {
          username: '用户名',
          password: '密码',
          confirmPassword: '确认密码',
          verifyInput: '验证码',
          agree: '选框'
        }
      })
      Validator.extend('username', {
        getMessage: field => '请输入4-16位字母或数字的用户名',
        validate: value => {
          console.log(value)
          return /^[a-z0-9_]{4,16}$/.test(value)
        }
      })
      let username = new Validator({ trueField: 'username' })
      username.attach({
        name: 'falseField',
        rules: 'username'
      })
      Validator.extend('password', {
        getMessage: field => '6-20位字母数字组合的密码',
        validate: value => {
          return this.confirmPassword
            ? value === this.confirmPassword
            : /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/.test(value)
        }
      })
      let password = new Validator({ trueField: 'password' })
      password.attach({
        name: 'falseField',
        rules: 'password'
      })
      Validator.extend('confirmPassword', {
        getMessage: field => '6-20位字母数字组合的密码',
        validate: value => {
          return (
            // this.password === this.confirmPassword &&
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/.test(value)
          )
        }
      })
      let confirmPassword = new Validator({ trueField: 'confirmPassword' })
      confirmPassword.attach({
        name: 'falseField',
        rules: 'confirmPassword'
      })
      Validator.extend('verifyInput', {
        getMessage: field => '验证码错误，请重新输入',
        validate: value => {
          // console.log(this.verifyCode, value)
          return (
            this.verifyCode === value || this.verifyCode.toLowerCase() === value
          )
        }
      })
      let verifyInput = new Validator({ trueField: 'verifyInput' })
      verifyInput.attach({
        name: 'falseField',
        rules: 'verifyInput'
      })
    },
    loginAsTourist() {
      this.touristLoginShow = true
    },
    goAgreement() {
      this.$router.push({
        path: '/user/agreement'
      })
    },
    goBack() {
      this.$router.go(-1)
    },
    goKefu() {
      this.$router.push({
        path: '/user/kefu'
      })
    },
    handleRegister() {
      if (!this.agreeChecked) {
        this.$vux.toast.show({
          type: 'warn',
          text: '您还未同意相关条款',
          time: 1000
        })
        return
      }
      this.REGISTER({
        username: this.username,
        password: this.password,
        verify_code: this.verifyInput,
        verify_key: this.verifyToken,
        invitation_code: this.inviteCode,
        real_name: this.realName,
        promotion_code: this.promotion_code || this.$route.query.code,
        is_agent: this.is_agent || this.$route.query.type
      })
        .then(res => {
          setTimeout(() => {
            this.$router.push({
              path: '/home'
            })
          }, 1000)
        })
        .catch(err => {
          this.verifyCodeShouldReload = true
        })
    },
    login() {
      this.$router.replace({
        path: '/user/login'
      })
    },
    loadVerifyCode(code) {
      this.verifyCode = code
      // console.log(code.toLowerCase())
    },
    setReload(bool) {
      this.verifyCodeShouldReload = bool
    },
    hideShowPsw() {
      var regPwdEye = document.getElementById('regPwdEye')
      if (this.pwdType == 'password') {
        this.pwdType = 'text'
        regPwdEye.className = 'iconfont icon-eye'
      } else {
        this.pwdType = 'password'
        regPwdEye.className = 'iconfont icon-eye1'
      }
    },
    hideShowConfirmPsw() {
      var confirmPwdEye = document.getElementById('confirmPwdEye')
      if (this.pwdType1 == 'password') {
        this.pwdType1 = 'text'
        confirmPwdEye.className = 'iconfont icon-eye'
      } else {
        this.pwdType1 = 'password'
        confirmPwdEye.className = 'iconfont icon-eye1'
      }
    },
    handleTouristLoginCancel() {
      this.touristLoginShow = false
      this.verifyCodeShouldReload = true
    }
  }
}
</script>


<style>
.register-box .weui-label {
  font-size: 14px;
}
</style>


<style scoped>
.register-box {
  background-color: white;
}

.iconfont {
  font-size: 24px;
}

.back {
  padding: 10px 0 0 10px;
}

.service {
  float: right;
  padding: 14px 20px 0 0;
  color: #fa2939;
  font-size: 14px;
}

.img-group {
  width: 60px;
  height: 60px;
  margin: 34px auto;
}

.red-block {
  width: 60px;
  height: 60px;
  border-radius: 14px;
}

.container .user-register,
.container .password,
.container .confirm-password,
.container .verify {
  font-size: 1em;
  height: 50px;
  line-height: 50px;
  margin: 0px 24px;
  border-bottom: 0.5px solid #e2e4ef;
  position: relative;
}

span {
  margin-left: 24px;
  color: #f10215;
  font-size: 14px;
}

::-webkit-input-placeholder {
  color: gray;
}

.verify,
.password,
.confirm-password {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.verify-img {
  padding-top: 13px;
}

.agree {
  margin-top: 10px;
  margin-left: 24px;
  font-size: 0.8em;
}

#agree {
  width: 20px;
  height: 20px;
  vertical-align: middle;
}

.agree span {
  margin-left: 0;
}

.linkToGroup {
  margin: 0 auto 0;
  font-size: 14px;
  text-align: center;
}
.linkToGroup a {
  display: inline-block;
  margin: 0 5px;
}

.weui-cell {
  padding: 0;
}

.check-box {
  width: 19px;
  height: 19px;
  border: solid 0.5px #e2e4ef;
  border-radius: 19px;
  transition: all linear 0.2s;
  color: white;
  display: inline-block;
  vertical-align: middle;
}

.checked.check-box {
  position: relative;
  color: white;
  border: none;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.checked .icon-gouxuan {
  font-size: 0.8rem;
  font-weight: bold;
  color: #fff;
}

@media (max-width: 320px) {
  .verify-img {
    zoom: 86%;
  }
}
</style>
