<template>
  <transition name="zoom">
    <div class="mask-layer" v-if="show">
      <div class="verify-box">
        <div class="close-btn" @click="$emit('cancel')"></div>
        <div class="verify-title">万游欢迎您</div>
        <div class="verify-input-wrap">
          <input maxlength="4" v-model="verify_code" type="text" placeholder="请输入验证码"/>
          <ImgVerify class="img-code"  @imgCode="loadVerifyCode" ref="imgVerify" name="imgVerify" :shouldReload="verifyCodeShouldReload"
                     @setReload="setReload" @getVerifyToken="getVerifyToken"/>
        </div>
        <div class="tips loginkefu">试玩账户仅供熟悉游戏使用有效期72小时</div>
        <div class="btn-group">
          <button type="button" class="cancel border-theme text-theme" @click="$emit('cancel')">取消</button>
          <button type="button" class="confirm bg-theme" @click="loginAsTourist">立即试玩</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import ImgVerify from '../../../components/global/v-img-verify'

  export default {
    components: {
      ImgVerify
    },
    props: ['show'],
    data() {
      return {
        verifyCodeShouldReload: false,
        verify_code: '',
        verify_key: ''
      }
    },
    created() {
    },
    methods: {
      ...Vuex.mapActions(['LOGIN_AS_TOURIST']),
      loadVerifyCode(code) {
      },
      setReload(bool) {
        this.verifyCodeShouldReload = bool
      },
      getVerifyToken(key) {
        this.verify_key = key
      },
      loginAsTourist() {
        // 验证verify_code
        if (
          !(
            this.verify_code.match(/^[A-Za-z0-9]+$/g) &&
            this.verify_code.match(/^[A-Za-z0-9]+$/g)[0].length == 4
          )
        ) {
          this.$vux.toast.show({
            type: 'warn',
            text: '验证码不符合规则',
            time: 1000
          })
          return
        }
        this.LOGIN_AS_TOURIST({
          verify_code: this.verify_code,
          verify_key: this.verify_key
        })
          .then(res => {
            if (res.result) {
              this.$store.commit('setUser', res.data)
              this.$router.push({
                path: '/home'
              })
              this.show = false
            }
          })
          .catch(err => {
            this.verifyCodeShouldReload = true
          })
      }
    }
  }
</script>

<style scoped>
  .verify-box {
    position: relative;
    background-color: white;
    border-radius: 3px;
    width: 80vw;
    padding: 30px 22px 20px;
    box-sizing: border-box;
    margin: 0 auto;
  }

  .verify-box .close-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 18px;
    height: 18px;
    background: url("/static/images/icon/close-icon.png") no-repeat center center;
    background-size: contain;
  }

  .verify-box .verify-title {
    margin-bottom: 20px;
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    color: #333333;
  }

  .verify-box .tips {
    margin-bottom: 15px;
    text-align: center;
    font-size: 12px;
  }

  .verify-box input {
    width: 90%;
    padding-left: 10px;
    font-size: 13px;
    background-color: hsla(0, 0%, 100%, 0);
    box-sizing: border-box;
    border: none;
    outline: none;
  }

  .btn-group {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
  }

  .btn-group button {
    border: none;
    outline: none;
  }

  .cancel,
  .confirm {
    flex: 1;
    width: 120px;
    height: 40px;
    line-height: 40px;
    border-radius: 40px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
  }

  .cancel {
    margin-right: 10px;
    background-color: #ffffff;
  }

  .confirm {
    color: #ffffff;
  }

  .verify-input-wrap {
    display: flex;
    border: 1px solid #e2e4ef;
    align-items: center;
    margin-bottom: 10px;
    width: 100%;
    height: 40px;
    border-radius: 4px;
  }

  .img-code {
    height: 40px;
  }

  .img-verify img {
    border-top-right-radius: 4px !important;
    border-bottom-right-radius: 4px !important;
  }


  .zoom-enter-active,
  .zoom-leave-active {
    transition: all ease-out 0.2s;
  }

  .zoom-enter,
  .zoom-leave-to {
    transform: scale(0.8, 0.8);
    opacity: 0;
  }
</style>
