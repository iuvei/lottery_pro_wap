<template>
  <div class="message-box">
    <x-header
      :left-options="{backText: '', preventGoBack: true}"
      @on-click-back="goBack"
    >
      站内信
      <div
        slot="right"
        class="edit"
        @click="isEditting=!isEditting;if (!isEditting) {checkList = []} "
      >{{isEditting?'取消':'编辑'}}</div>
    </x-header>
    <div class="tab-box">
      <ul class="tab-list">
        <li
          :class="{'active':tabIndex===0}"
          @click="changeTab(0)"
        >
          收件箱
        </li>
        <li :class="{'active':tabIndex===1}" @click="changeTab(1)">
          发件箱
        </li>
        <li
          :class="{'active':tabIndex===2}"
          @click="showMailerHandle"
        >
          <x-icon
            type="ios-plus-empty"
            size="26"
          ></x-icon>
          <div style="margin-left:-2px;">发邮件</div>
        </li>
      </ul>
    </div>
    <div class="input-box">
      <x-input
        type="text"
        v-model="filterTitle"
        placeholder="请输入搜索标题"
				label-width="100px"
      ></x-input>
      <button
        class="bg-theme"
        type="button"
        @click="filterHandle"
      >搜索</button>
      <span class="close-icon" v-show="filterTitle" @click="deleteInputChange"></span>
    </div>
    <div
      class="message-main"
      v-show="messageList.length"
    >
      <pull-to
        :bottom-load-method="bottomPullHandle"
        :is-top-bounce=false
        :bottom-config="bottom_config"
      >
        <ul class="message-list">
          <checker
            type="checkbox"
            v-model="checkList"
            default-item-class="check-item"
            selected-item-class="check-item-selected"
          >
            <li
              v-for="(item,index) in messageList"
              @click="handleMessageClick(item,index)"
            >
              <div style="width: 100%">
                <div v-show="isEditting">
                  <checker-item :value="item.id"></checker-item>
                </div>
                <div style="width: 100%">
                  <div class="message-title">
                    <div class="message-left">
                      <div
                        class="dib unread-point"
                        v-show="item.is_readed == '0'"
                      ></div>
                      <div class="dib users">{{tabIndex ? '发给':'来自'}}<span class="text-theme">{{tabIndex ? item.to_username : item.from_username}}</span>消息
                      </div>
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
            </li>
          </checker>
        </ul>
      </pull-to>
      <transition name="slide">
        <div
          v-show="isEditting"
          class="message-option-bottom"
        >
          <div @click="selectAll">{{checkList.length === messageIdList.length?'取消全选':'全选'}}</div>
          <div
            @click="markRead"
            v-show="checkList.length"
          >标记已读</div>
          <div
            @click="deleteMessage"
            v-show="checkList.length"
          >删除</div>
        </div>
      </transition>
    </div>
    <div
      class="noMessage-items"
      v-show="!messageList.length"
    >
      <img
        src="../../../../static/images/home-blue/nomessage@2x.png"
        alt=""
      >
      <p>暂无消息</p>
    </div>
    <reply-message
      :user="mailer_user"
      :messageShow="messageShow"
      :linkerList="linkerList"
      :addLinkerBtnShow="true"
      :linkerShow="linkerShow"
      @cancel="handleMessageCancel"
      @submit="handleMessageSubmit"
      @addLinkerHandle="addLinkerHandle"
      @addBtnHandle="addBtnHandle"
    ></reply-message>
  </div>
</template>

<script>
import PullTo from 'vue-pull-to'
import { Checker, CheckerItem } from 'vux'
import { mapActions, mapMutations } from 'vuex'
import ReplyMessage from '../../../components/user/ReplyMessage'
import { TOP_DEFAULT_CONFIG } from '../../../assets/js/pull_config'

export default {
  components: {
    PullTo,
    Checker,
    CheckerItem,
    ReplyMessage
  },
  data() {
    return {
      isEditting: false,
      messageList: [],
      messageIdList: [],
      tabIndex: 0,
      filterTitle: '',
      totalPage: 1,
      nowPage: 1,
      pageSize: 15,
      checkList: [],
      messageShow: false,
      linkerShow: false,
      mailer_user: '',
      linkerList: [],
      bottom_config: TOP_DEFAULT_CONFIG
    }
  },
  created() {
    this.tabIndex = parseInt(this.$route.query.type) || 0
    this.$store.commit('setMaskLayerShow', false)
    this._initPage()
  },
  methods: {
    ...mapActions([
      'GET_RECEIVE_MESSAGE_LIST',
      'GET_SEND_MESSAGE_LIST',
      'READ_MESSAGE',
      'DELECT_MESSAGE',
      'GET_ALL_LOWER',
      'SEND_MESSAGE'
    ]),
    ...mapMutations(['set_mailer_list']),
    goBack() {
      this.$router.push('/my')
    },
    deleteInputChange() {
      this.filterTitle = ''
    },
    handleMessageClick(item, index) {
      let checkList = this.checkList
      if (!this.isEditting) {
        this.$router.push(
          `/user/message/detail?index=${index}&type=${this.tabIndex}`
        )
      }
      if (checkList.includes(item.id)) {
        checkList.splice(checkList.indexOf(item.id), 1)
      } else {
        checkList.push(item.id)
      }
      this.checkList = checkList
    },
    selectAll() {
      if (this.checkList.length === this.messageIdList.length) {
        this.checkList = []
      } else {
        this.checkList = this.messageIdList
      }
    },
    markRead() {
      this.READ_MESSAGE({
        ids: this.checkList.join(',')
      }).then(res => {
        setTimeout(() => {
          this.refresh()
        }, 1000)
      })
    },
    deleteMessage() {
      this.DELECT_MESSAGE({
        ids: this.checkList.join(',')
      }).then(res => {
        setTimeout(() => {
          this.refresh()
        }, 1000)
      })
    },
    changeTab(index) {
      this.tabIndex = index
      this.refresh()
    },
    showMailerHandle() {
      this.tabIndex = 2
      this.messageShow = true
      this.$store.commit('setMaskLayerShow', true)
    },
    handleMessageCancel() {
      this.tabIndex = 0
      this.linkerShow = false
      this.messageShow = false
      this.$store.commit('setMaskLayerShow', false)
    },
    handleMessageSubmit(data) {
      if (!data.user.id) {
        this.$vux.toast.show('请选择联系人！')
        return
      }
      if (!data.title) {
        this.$vux.toast.show('请输入主题！')
        return
      }
      if (!data.content) {
        this.$vux.toast.show('请输入内容！')
        return
      }
      this.SEND_MESSAGE({
        type: 0,
        to_user: data.user.id,
        title: data.title,
        content: data.content
      }).then(res => {
        setTimeout(() => {
          this.tabIndex = 0
          this.refresh()
        }, 1000)
      })
    },
    addLinkerHandle() {
      this.linkerShow = true
    },
    addBtnHandle(list) {
      let result, username, id
      if (list.length) {
        result = list.map(item => {
          let value = item.split('&&')
          return {
            username: value[0],
            id: value[1]
          }
        })
        username = result.map(item => {
          return item.username
        })
        id = result.map(item => {
          return item.id
        })
        this.mailer_user = {
          username: username.join(','),
          id: id.join(',')
        }
      }
      this.linkerShow = false
    },
    filterHandle() {
      this.nowPage = 1
      this.totalPage = 1
      this.messageList = []
      this.messageIdList = []
      this.checkList = []
      this._getMailerList()
    },
    refresh() {
      this.nowPage = 1
      this.totalPage = 1
      this.isEditting = false
      this.messageList = []
      this.messageIdList = []
      this.checkList = []
      this.filterTitle = ''
      this.messageShow = false
      this.linkerShow = false
      this.$store.commit('setMaskLayerShow', false)
      this._getMailerList()
    },
    bottomPullHandle(loaded) {
      if (this.nowPage < this.totalPage) {
        this.nowPage = this.nowPage + 1
        this._getMailerList(() => {
          loaded('done')
        })
      } else {
        this.$vux.toast.show('已加载全部')
        setTimeout(() => {
          loaded('done')
        }, 1000)
      }
    },
    // 获取下级会员
    _getLower() {
      this.GET_ALL_LOWER().then(res => {
        this.linkerList = res.data
      })
    },
    _getMailerList(callback) {
      if (this.tabIndex === 0) {
        this.GET_RECEIVE_MESSAGE_LIST({
          page: this.nowPage,
          rows: this.pageSize,
          title: this.filterTitle
        })
          .then(res => {
            let totalRows = parseInt(res.data.total_rows)
            let pageSize = parseInt(this.pageSize)
            this.totalPage = Math.ceil(totalRows / pageSize)
            this.messageList = [...this.messageList, ...res.data.list]
            this.messageIdList = this.messageList.map(item => {
              return item.id
            })
            this.set_mailer_list(this.messageList)
            callback && callback()
          })
          .catch(e => {
            this.messageList = []
          })
      } else {
        this.GET_SEND_MESSAGE_LIST({
          page: this.nowPage,
          rows: this.pageSize,
          title: this.filterTitle
        })
          .then(res => {
            let totalRows = parseInt(res.data.total_rows)
            let pageSize = parseInt(this.pageSize)
            this.totalPage = Math.ceil(totalRows / pageSize)
            this.messageList = [...this.messageList, ...res.data.list]
            this.messageIdList = this.messageList.map(item => {
              return item.id
            })
            this.set_mailer_list(this.messageList)
            callback && callback()
          })
          .catch(e => {
            this.messageList = []
            callback && callback()
          })
      }
    },
    _initPage() {
      this._getLower()
      this._getMailerList()
    }
  }
}
</script>

<style scoped>
.check-item {
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: #ffffff;
  border: 1px solid #e2e4ef;
}

.slide-enter-active,
.slide-leave-active {
  transition: all ease-out 0.2s;
}

.slide-enter,
.slide-leave-to {
  transform: translateY(49px);
  opacity: 0;
}

.input-box {
  position: fixed;
  top: 105px;
  left: 0;
  margin: 0 12px 10px;
  padding: 3px 5px 3px 8px;
  width: calc(100% - 24px);
  height: 40px;
  border: 0.5px solid #e2e4ef;
  border-radius: 3px;
  box-sizing: border-box;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
}

.input-box .close-icon {
  position: absolute;
  top: 50%;
  right: 75px;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  /* background: url("/static/images/icon/close2-icon.png") no-repeat center center; */
  /* background-size: contain; */
}

.input-box input {
  flex: 1;
  font-size: 14px;
  color: #333333;
}

.input-box button {
  width: 60px;
  height: 32px;
  line-height: 32px;
  margin-left: 10px;
  border: none;
  border-radius: 4px;
  outline: none;
  text-align: center;
  font-size: 14px;
  color: #ffffff;
}

.message-list li {
  background-color: white;
  padding: 10px 12px;
  margin-bottom: 10px;
}

.message-list li > div {
  display: flex;
  align-items: center;
}

.message-list li > div > div:first-child {
  position: relative;
  left: -5px;
}

.message-main {
  height: calc(100vh - 159px);
  margin-top: 159px;
  position: relative;
  overflow: hidden;
}

.message-title {
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 30px;
}

.message-left {
  flex: 1;
}

.users {
  width: calc(100vw - 160px);
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
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

.edit {
  color: white;
  font-size: 15px;
}

.unread-point {
  background-color: red;
  width: 10px;
  height: 10px;
  border-radius: 10px;
}

.message-option-bottom {
  background-color: white;
  position: absolute;
  width: 100%;
  height: 49px;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  box-sizing: border-box;
  color: #f3091c;
  font-size: 17px;
  font-weight: 500;
  border-top: solid 0.5px #e2e4ef;
}

.noMessage-items {
  padding-top: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.noMessage-items img {
  width: 105px;
  margin-top: 36%;
}

.noMessage-items p {
  margin-top: 20px;
  color: #999;
}

.tab-box {
  position: fixed;
  top: 44px;
  width: 100%;
  height: 37px;
  line-height: 37px;
  font-size: 14px;
  text-align: center;
  padding: 0 12px;
  box-sizing: border-box;
  margin: 12px 0;
}

.tab-list {
  display: flex;
  border-radius: 3px;
}

.tab-list > li {
  flex: 1;
}

.tab-list > li:last-child {
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-list > li:last-child svg {
	padding-bottom: 2px;
}

.tab-list > li.active:last-child svg {
  fill: white;
}

.tab-list > li.active {
  color: white;
}

</style>

<style>
.message-box .vux-check-icon > .weui-icon-success:before,
.vux-check-icon > .weui-icon-success-circle:before {
  color: red;
}
</style>


