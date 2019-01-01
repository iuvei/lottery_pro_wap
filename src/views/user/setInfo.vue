<template>
  <div class="setInfo-wrapper">
    <x-header
      :left-options="{backText: '', preventGoBack: true}"
      @on-click-back="goBack"
    >修改个人信息
    </x-header>
    <div class="form-group">
      <div class="form-item img-group">
        <input
          class="file"
          type="file"
          id="files"
          name="files[]"
          @change="handleFileSelect"
        >
        <div class="text">头像</div>
        <div class="value">
          <img
            id="personImg"
            :src="photoSrcPath?photoSrcPath:'../../../static/images/home-blue/avatar-icon@3x.png'"
            alt="点击上传头像"
          >
        </div>
      </div>
      <div class="form-item nickname-item">
        <div class="text">昵称</div>
        <div class="value">
          <input class="input"
            v-model="nickname"
            placeholder="请输入昵称"
          />
        </div>
      </div>
      <div class="form-item">
        <div class="text">性别</div>
        <div class="value">
          <popup-radio
            :options="sex"
            v-model="sexValue"
            placeholder="男"
            class="person-sex"
          ></popup-radio>
        </div>
      </div>
      <div class="form-item">
        <div class="text">生日</div>
        <div class="value">
          <datetime
            class="person-birthday"
            v-model="birthday"
            placeholder="xxxx-xx-xx"
            :end-date="newDate"
            start-date="1960-01-01"
          ></datetime>
        </div>
      </div>
      <div class="form-item rebate-item">
        <div class="text">自身保留返点</div>
        <div class="value">
          <popup-picker
            class="picker"
            :data="rebate_list"
            v-model="rebeta"
            cancel-text="请选择返点"
            placeholder="请选择自身保留返点"
          ></popup-picker>
        </div>
      </div>
    </div>
    <div class="btn-group">
      <button
        type="button"
        class="bg-theme"
        @click="submitHandle"
      >确认
      </button>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import Vue from 'vue'
  import { Cell, PopupRadio, Datetime, AlertPlugin, PopupPicker } from 'vux'
  import { getYYYY_MM_HH } from '../../assets/js/formatDate'

  export default {
    data() {
      return {
        nickname: '',
        sexValue: '男',
        sex: ['男', '女'],
        birthday: '',
        photoSrcPath: '',
        rebeta: [],
        rebate_list: [
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          ['.'],
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          ['%']
        ]
      }
    },
    components: {
      Cell,
      PopupRadio,
      Datetime,
      AlertPlugin,
      PopupPicker
    },
    created() {
      this._initPage()
      this.newDate = getYYYY_MM_HH(new Date())
      let rebate = this.$route.query.rebate
      if (rebate) {
        this.formatRebateList(rebate)
      } else {
        this.GET_REBATE_DATA().then(res => {
          this.formatRebateList(res.data.rebate)
        })
      }
      this.photoSrcPath = localStorage.getItem('photoSrcPath')
    },
    methods: {
      ...mapActions(['UPDATE_USERINFO', 'GET_REBATE_DATA', 'GET_MEMBER_INFO']),
      _initPage() {
        this.GET_MEMBER_INFO({ type: 1 }).then(res => {
          this.userInfo = res.data.user
          console.log(res.data.user)
          this.nickname = this.userInfo.nick_name
          if (this.userInfo.sex === '1') {
            this.sexValue = '女'
          } else {
            this.sexValue = '男'
          }
          this.birthday = getYYYY_MM_HH(this.userInfo.birthday * 1000)
        })
      },
      goBack() {
        this.$router.push('/user/info')
      },
      getNumberList(num) {
        let list = []
        let point = 0
        while (point <= parseFloat(num)) {
          list.push(parseInt(point))
          point += 1
        }
        return list
      },
      formatRebateList(rebate) {
        rebate = rebate ? String(rebate) : '0'
        if (rebate.length === 1) {
          rebate = [rebate, 0]
        } else {
          rebate = rebate.split('.')
        }
        let value1 = this.getNumberList(rebate[0])
        let value2 = this.getNumberList(rebate[1])
        this.rebate_list = [value1, ['.'], value2, ['%']]
      },
      handleFileSelect(evt) {
        let f = document.querySelector('#files').files[0]
        if (!f.type.match('image.*')) {
          Vue.$vux.toast.show('请上传图片格式文件')
          return false
        }
        if (f.size > 524288) {
          Vue.$vux.toast.show('图片过大，请重新上传！')
          return false
        }
        var reader = new FileReader()
        reader.onload = (function(theFile) {
          return function(e) {
            var img = document.getElementById('personImg')
            img.src = reader.result
            // localStorage.setItem('photoSrcPath', img.src)
          }
        })(f)
        reader.readAsDataURL(f)
      },
      submitHandle() {
        let _this = this
        let data = {
          nick_name: this.nickname,
          sex: this.sexValue === '男' ? 2 : 1,
          birthday: this.birthday,
          rebate_diff: this.rebeta.join('').substr(0, 3)
        }
        this.UPDATE_USERINFO(data).then(res => {
          setTimeout(() => {
            _this.$router.push('/user/info')
          }, 1000)
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .form-group {
    margin-top: 44px;
    padding-left: 12px;
    background-color: #ffffff;
    box-sizing: border-box;
    .form-item {
      position: relative;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      height: 48px;
      padding: 4px 15px 4px 0;
      border-bottom: 0.5px solid #e2e4ef;
      box-sizing: border-box;
      &.nickname-item .text {
        flex: 0 0 40px;
      }
      &:last-child {
        border-bottom: none;
      }
      &.img-group {
        height: 80px;
      }
      &.flex-start {
        justify-content: flex-start;
      }
      &.rebate-item {
        padding-right: 0;
      }
      .file {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
      }
      .text {
        flex: 0 0 100px;
        font-size: 14px;
        color: #333333;
      }
      .value {
        flex: 1;
        text-align: right;
        .weui-cell {
          padding-right: 0 !important;
        }
        img {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          padding-top: 6px;
        }
        .input {
          width: 100%;
          font-size: 14px;
          color: #333333;
          box-sizing: border-box;
          text-align: right !important;
          .weui-input {
            text-align: right !important;
          }
        }
        .picker,
        .vux-cell-value {
          font-size: 14px;
          color: #333333;
        }
        .person-sex {
          font-size: 14px;
          color: #333333;
        }
      }
    }
  }

  .btn-group {
    margin-top: 15px;
    margin-bottom: 20px;
    text-align: center;
    button {
      height: 40px;
      font-size: 18px;
      color: white;
      border: none;
      width: 240px;
      border-radius: 40px;
    }
  }
</style>
