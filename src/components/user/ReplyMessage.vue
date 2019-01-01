<template>
  <div class="mailer-wrapper">
    <transition name="slide">
      <div class="message-box" v-show="messageShow">
        <div class="message-head">
          <div class="theme-color" @click="cancel">取消</div>
          <div class="message-title">{{addLinkerBtnShow? '发邮箱':'回信'}}</div>
          <div class="theme-color" @click="submit">发送</div>
        </div>
        <div class="message-body">
          <div class="Recipient">
            <div class="label">收件人:</div>
            <div class="users-name">
              <div class="text">{{user.username}}</div>
              <i v-if="addLinkerBtnShow" @click="addLinkerHandle" class="iconfont icon-jiahao text-theme"></i>
            </div>
          </div>
          <div class="title">
            <div class="label">主题:</div>
            <div v-if="title" class="text">{{title}}</div>
            <input v-else type="text" v-model="titleInput">
          </div>
          <div class="content">
            <textarea placeholder="在此输入你要发送的信息" v-model="content"></textarea>
          </div>
        </div>
      </div>
    </transition>
    <transition name="slide">
      <div class="addLinker" v-show="linkerShow">
        <div class="linker-head">
          <div class="theme-color" @click="selectAll">全选({{checkList.length}})</div>
          <div class="message-title">选择联系人</div>
          <div class="theme-color" @click="addHandle">{{checkList.length?'完成':'取消'}}</div>
        </div>
        <checker type="checkbox" v-model="checkList" default-item-class="check-item" selected-item-class="check-item-selected" >
          <div class="linker-list">
            <div class="linker-item" v-for="item in linkerList" :key="item.id" @click="changeItemHandle(item)">
              <div class="text">{{item.username}}</div>
              <checker-item :value="`${item.username}&&${item.id}`"></checker-item>
            </div>
          </div>
        </checker>
      </div>
    </transition>
  </div>
</template>

<script>
  import {Checker, CheckerItem} from 'vux'

  export default {
    props: {
      messageShow: {
        type: Boolean,
        default: false
      },
      linkerShow: {
        type: Boolean,
        default: false
      },
      addLinkerBtnShow: {
        type: Boolean,
        default: false
      },
      user: {},
      linkerList: {
        type: Array,
        default: () => {
          return []
        }
      },
      title: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        userInput: '',
        titleInput: '',
        content: '',
        checkList: []
      }
    },
    methods: {
      selectAll() {
        if (this.checkList.length === this.linkerList.length) {
          this.checkList = []
        } else {
          this.checkList = this.linkerList.map(item => {
            return `${item.username}&&${item.id}`
          })
        }
      },
      changeItemHandle(item) {
        let value = `${item.username}&&${item.id}`
        let checkList = this.checkList
        if (checkList.includes(value)) {
          checkList = checkList.splice(checkList.indexOf(`${item.username}&&${item.id}`), 1)
        } else {
          checkList = checkList.push(value)
        }
      },
      addLinkerHandle() {
        this.$emit('addLinkerHandle')
      },
      addHandle() {
        this.$emit('addBtnHandle', this.checkList)
      },
      submit() {
        let data = {
          user: this.user ? this.user : {},
          title: this.title ? this.title : this.titleInput,
          content: this.content
        }
        this.$emit('submit', data)
      },
      cancel() {
        this.userInput = ''
        this.titleInput = ''
        this.content = ''
        this.$emit('cancel')
      }
    },
    watch: {
      '$store.state.app.maskLayerShow': function (bool) {
        if (!bool) {
          this.$emit('cancel')
        }
      }
    },
    components: {
      Checker,
      CheckerItem
    }
  }
</script>

<style scoped>
  .mailer-wrapper > div {
    border-radius: 7px 7px 0 0;
    background-color: white;
    position: fixed;
    width: 100%;
    height: 455px;
    bottom: 0;
    overflow: hidden;
    z-index: 14;
  }

  .message-head, .linker-head {
    display: flex;
    justify-content: space-between;
    height: 49px;
    align-items: center;
    font-size: 17px;
    padding: 0 12px;
    background-color: #f2f2f5;
  }

  .message-title {
    font-size: 17px;
    font-weight: 500;
    color: #666;
  }

  .Recipient,
  .title {
    display: flex;
    padding-left: 12px;
    height: 49px;
    align-items: center;
    border-bottom: 0.5px solid #e2e4ef;
  }

  .users-name {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .users-name .text {
    flex: 1;
  }

  .users-name .iconfont {
    padding: 10px 0 10px 10px;
    flex: 0 0 12px;
  }

  .users-name,
  .theme {
    width: calc(100% - 72px);
  }

  .users-name .text,
  .theme .text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .title input {
    flex: 1;
    padding-right: 10px;
    border: none;
    outline: none;
    font-size: 14px;
    color: #333333;
    background-color: transparent;
  }

  .label {
    flex: 0 0 60px;
    width: 60px;
    font-size: 15px;
    color: #666;
  }

  textarea {
    width: 100%;
    height: 300px;
    padding: 12px;
    box-sizing: border-box;
    outline: none;
    font-size: 15px;
    color: #333333;
    resize: none;
  }

  .linker-list {
    width: 100%;
    height: calc(100% - 49px);
    padding-left: 12px;
    box-sizing: border-box;
  }

  .linker-item {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    height: 49px;
    border-bottom: .5px solid #e3e6ec;
  }

  .linker-item .text {
    font-size: 14px;
    color: #333333;
  }

  .check-item {
    display: inline-block;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    margin-right: 10px;
    background-color: #ffffff;
    border: 1px solid #e2e4ef;
  }

  .check-item-selected {
		/* background-color: red; */
		border:none;
  }

  .slide-enter-active,
  .slide-leave-active {
    transition: all ease-out 0.2s;
  }

  .slide-enter,
  .slide-leave-to {
    transform: translateY(455px);
    opacity: 0;
  }

</style>
