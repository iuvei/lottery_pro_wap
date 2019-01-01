<template>
  <div class="message-detail">
    <x-header :left-options="{backText: `${type == 1 ? '发件箱':'收件箱'}`, preventGoBack: true}" @on-click-back="goBack">
      <div slot="right" class="arrow-change-box">
        <div>
          <div>
            <x-icon type="ios-arrow-up" size="30"></x-icon>
          </div>
          <div class="up-text" @click="toggleMessage('back')">上一条</div>
        </div>
        <div style="margin-left:18px">
          <div>
            <x-icon type="ios-arrow-down" size="30"></x-icon>
          </div>
          <div class="next-text" @click="toggleMessage('next')">下一条</div>
        </div>
      </div>
    </x-header>
    <div class="other-side-name">{{otherName}}</div>
    <div class="message-main" :style="isMass == '0' ? 'padding-bottom: 50px':'padding-bottom: 0'">
      <div class="message-item" v-for="item in messageList" :key="item.id">
        <div class="message-title">
          <div class="message-left" v-if="item.from_username == selfName">
            <div class="dib"><span class="text-theme">{{selfName}}</span> 回复 <span
              class="text-theme">{{otherName}}</span></div>
          </div>
          <div class="message-left" v-else>
            <div class="dib">来自 <span class="text-theme">{{otherName}}</span></div>
          </div>
          <div class="message-time">
            {{item.create_time}}
          </div>
        </div>
        <div class="message-content">
          {{item.content}}
        </div>
      </div>
    </div>
    <div class="reply-btn-area" v-if="isMass == '0'">
      <button @click="replyMessageModal">回信</button>
    </div>
    <ReplyMessage v-if="messageList.length" :user="{username: otherName, userId: otherId}" :title="nowMailer.title" :messageShow="messageShow" @submit="replyMessageSubmit" @cancel="handleMessageCancel"/>
  </div>
</template>

<script>
  import ReplyMessage from '../../../components/user/ReplyMessage'
  import Vue from 'vue'
  import {mapActions, mapGetters} from 'vuex'

  export default {
    components: {
      ReplyMessage
    },
    data() {
      return {
        messageShow: false,
        messageList: [],
        selfName: '',
        otherName: '',
        otherId: '',
        isMass: '',
        nowMailer: {},
        mailer_list: [],
        type: ''
      }
    },
    created() {
      this._initPage()
    },
    methods: {
      ...mapActions(['FIND_MESSAGE', 'REPLY_MESSAGE']),
      ...mapGetters(['get_mailer_list']),
      goBack() {
        this.$router.push(`/user/message/list?type=${this.type}`)
      },
      registerGlobalEvents() {
        this.$eventBus.$on('clickLayer', data => {
          this.messageShow = false
        })
      },
      replyMessageModal() {
        this.messageShow = true
        this.$store.commit('setMaskLayerShow', true)
      },
      handleMessageCancel() {
        this.messageShow = false
        this.$store.commit('setMaskLayerShow', false)
      },
      refresh() {
        this.messageShow = false
        this.$store.commit('setMaskLayerShow', false)
        this._getMailerDetail()
      },
      replyMessageSubmit(data) {
        if (!data.content) {
          Vue.$vux.toast.show('请输入内容！')
          return
        }
        this.REPLY_MESSAGE({
          replied_id: this.nowMailer.id,
          type: this.nowMailer.type == 2? 2 : 1,
          to_user: data.user.userId,
          title: data.title,
          content: data.content
        }).then(res => {
          setTimeout(() => {
            this.refresh()
          }, 1000)
        })
      },
      toggleMessage(flag) {
        let index = this.index
        if (flag === 'next') {
          ++index
          if (index <= this.mailer_list.length - 1) {
            this.index = index
            this._getNowMailer()
          } else {
            Vue.$vux.toast.show('已到最后一页!')
          }
        } else {
          --index
          if (index >= 0) {
            this.index = index
            this._getNowMailer()
          } else {
            Vue.$vux.toast.show('已到第一页!')
          }
        }
      },
      _getNowMailer() {
        this.nowMailer = this.mailer_list.find((item, index) => {
          return this.index == index
        })
        this.isMass = this.nowMailer.is_mass
        this._getMailerDetail()
      },
      _getMailerDetail() {
        this.FIND_MESSAGE({
          type: this.type,
          id: this.nowMailer.id
        }).then(res => {
          this.messageList = res.data.list
          this.selfName = this.$store.state.user.userInfo.username
          this.otherName = res.data.list[0].from_username == this.selfName ? res.data.list[0].to_username : res.data.list[0].from_username
          this.otherId = res.data.list[0].from_username == this.selfName ? res.data.list[0].to_uid : res.data.list[0].from_uid
        })
      },
      _initPage() {
        this.index = this.$route.query.index
        this.type = this.$route.query.type
        this.mailer_list = this.get_mailer_list()
        if (!this.mailer_list.length) {
          this.goBack()
        }
        this._getNowMailer()
        this.registerGlobalEvents()
      }
    }
  }
</script>

<style scoped>
  .other-side-name {
    margin-top: 44px;
    width: 100%;
    height: 44px;
    line-height: 44px;
    padding: 0 12px;
    box-sizing: border-box;
    font-size: 16px;
    font-weight: bold;
    color: #333333;
  }

  .message-main {
    position: relative;
    height: calc(100vh - 88px);
    padding: 0;
    box-sizing: border-box;
  }

  .message-item {
    padding: 12px;
    margin-bottom: 10px;
    background-color: #ffffff;
  }

  .message-item:last-child {
    margin-bottom: 50px;
  }

  .up-text,
  .next-text {
    color: #eee;
  }

  .message-title {
    margin-bottom: 5px;
    font-weight: 500;
    color: #333;
    display: flex;
    justify-content: space-between;
    align-items: self-start;
    line-height: 30px;
  }

  .message-left {
    flex: 1;
  }

  .message-left .dib {
    line-height: 1.2;
    font-size: 14px;
  }

  .message-time {
    flex: 0 0 102px;
    font-size: 12px;
    font-weight: normal;
    color: #999999;
  }

  .message-content {
    color: #333;
    font-size: 12px;
  }

  .arrow-change-box {
    display: flex;
  }

  .arrow-change-box > div {
    line-height: 5px;
    text-align: center;
  }

  .reply-btn-area {
    position: fixed;
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    bottom: 0;
    left: 0;
    background-color: #e2e4ef;
  }

  .reply-btn-area button {
    width: 270px;
    height: 37px;
    border-radius: 3px;
    background-color: white;
    border: none;
    color: #666;
    font-size: 17px;
  }
</style>

<style>
  .message-detail .vux-check-icon > .weui-icon-success:before,
  .vux-check-icon > .weui-icon-success-circle:before {
    color: red;
  }

  .message-detail .vux-header .vux-header-right {
    top: 0px;
    font-size: 10px;
  }

  .message-detail svg {
    fill: white;
  }
</style>


