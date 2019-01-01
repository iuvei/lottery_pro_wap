<template>
  <div
    class="login-box"
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
    <div class="container">
      <div class="user">
        <span class="fs14">用户名</span>
        <input
          type="text"
          class="username"
          placeholder="输入用户名"
          title="用户名"
          v-validate="'required|username'"
          label-width="70px"
          :min="4"
          :max="16"
          name="username"
          v-model="username"
        />
        <i
          class="iconfont icon-eye1"
          style="opacity:0"
        ></i>
      </div>
      <span
        class="errorTip"
        v-show="xErrors.has('username')"
      >{{ xErrors.first('username') }}</span>
      <div class="password">
        <span class="fs14">密码</span>
        <input
          type="password"
          placeholder="输入密码"
          id="loginPwd"
          title="密码"
          label-width="70px"
          v-model="password"
          name="password"
          v-validate="'required|password'"
        />
        <i
          class="iconfont icon-eye1"
          id="loginEye"
          @click="hideShowPsw"
        ></i>
      </div>
      <span
        class="errorTip"
        v-show="xErrors.has('password')"
      >{{ xErrors.first('password') }}</span>

      <!--<div class="aboutPassword" @click="remeberChecked=!remeberChecked">-->
      <!--<div class="check-box" :class="{checked:remeberChecked}">-->
      <!--<i class="iconfont icon-gouxuan" v-show="remeberChecked"></i>-->
      <!--</div>-->
      <!--<label for="rememberPassword" class="fs12" style="display:inline-block;margin-top:4px;">记住密码</label>-->
      <!--<a href="javascript:void(0);" class="forgetPassword fs14" @click.stop="modifyPwd">忘记密码</a>-->
      <!--</div>-->

      <button
        @click="handleLogin"
        @click.native="showPosition('middle')"
        class="btn-confirm"
      >登录</button>
      <div class="linkToGroup">
        <a
          href="javascript:void(0)"
          @click="touristLoginShow=true"
        >免费试玩</a> |
        <a
          href="javascript:void(0)"
          @click="register"
        >注册账号</a>
      </div>

    </div>
    <TouristLogin
      :show="touristLoginShow"
      @cancel="handleTouristLoginCancel"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import VeeValidate, { Validator } from 'vee-validate'
import TouristLogin from '../../components/games/user/TouristLogin'
export default {
  components: {
    TouristLogin
  },
  data() {
    return {
      username: '',
      password: '',
      remeberChecked: false,
      touristLoginShow: false,
      position: 'default'
    }
  },
  created() {
    this.initValidate()
  },
  methods: {
    ...Vuex.mapActions(['LOGIN']),
    initValidate() {
      this.validator = new Validator({})
      VeeValidate.Validator.localize('zh_CN', {
        messages: {
          required: field => '*' + field + '不能为空！'
        },
        attributes: {
          username: '用户名',
          password: '密码'
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
          return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/.test(value)
        }
      })
      let password = new Validator({ trueField: 'password' })
      password.attach({
        name: 'falseField',
        rules: 'password'
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
    showPosition(position) {
      this.position = position
    },
    handleLogin() {
      this.LOGIN({
        username: this.username,
        password: this.password
      }).then(res => {
        console.log(res.message)
        Vue.$vux.toast.text(res.message)
        if (res.data.token) {
          this.$router.push({
            path: '/home'
          })
        }
      })
    },
    register() {
      this.$router.replace({
        path: '/user/register'
      })
    },
    // modifyPwd() {
    //   this.$router.push({
    //     path: '/user/modloginPwd'
    //   })
    // },
    hideShowPsw() {
      var loginEye = document.getElementById('loginEye')
      var loginPwd = document.getElementById('loginPwd')
      if (loginPwd.type == 'password') {
        loginPwd.type = 'text'
        loginEye.className = 'iconfont icon-eye'
      } else {
        loginPwd.type = 'password'
        loginEye.className = 'iconfont icon-eye1'
      }
    },
    handleTouristLoginCancel() {
      this.touristLoginShow = false
    }
  }
}
</script>


<style scoped>
.login-box {
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
.container {
  font-size: 18px;
  margin: 40px;
}
.container .user,
.container .password {
  border-bottom: 0.5px solid #e2e4ef;
  display: flex;
  line-height: 50px;
  align-items: center;
}
.container .user span,
.container .password span {
  display: block;
  width: 60px;
}
.container .user input,
.container .password input {
  font-size: 18px;
  border: none;
  background: none;
  outline: none;
  width: calc(100% - 60px);
  /*line-height: 50px;*/
  padding-left: 10px;
}
::-webkit-input-placeholder {
  color: gray;
}

.aboutPassword {
  font-size: 16px;
  margin-top: 10px;
}
.forgetPassword {
  float: right;
  color: #e52020;
  line-height: 36px;
}
.login {
  width: 100%;
  height: 50px;
  background-color: #e52020;
  color: #fff;
  font-size: 20px;
  border-radius: 30px;
  border: none;
  margin: 20px auto;
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
  border: solid 0.5px #fa2939;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
.checked .icon-gouxuan {
  font-size: 0.8rem;
  font-weight: bold;
  color: #fa2939;
}
.errorTip {
  color: #f10215;
  font-size: 14px;
  display: block;
}
</style>

