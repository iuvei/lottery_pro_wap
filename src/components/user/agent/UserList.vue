<template>
  <div class="user-list-box" :style="{height:$window.innerHeight-90+'px'}">
    <pull-to @infinite-scroll="loadmore" :BOTTOM_DEFAULT_CONFIG="{triggerDistance:70}">
      <ul class="user-list">
        <li v-for="item in userList" @click="goToUserDetail(item)">
          <div>
            <div class="user-info">
              <div class="account-type">
                <img :src="`../../../../static/images/icon/${item.is_agent==='1'?'agent':'membership'}-icon@3x.png`" class="account-type-icon" />
              </div>
              <div class="account-name ml5">{{item.username}}</div>
              <div class="money-label">余额</div>
              <div class="money red-color ml5">{{item.balance}}</div>
            </div>
            <div class="register-time">
              注册时间: {{item.create_time*1000|formatTime}}
            </div>
          </div>
          <div class="user-info-right">
            <div>
              <div class="red-color">
                {{item.bonus}}/{{item.rebate}}%
              </div>
              <div class="rebate-label">
                奖金/返点
              </div>
            </div>
            <div>
              <x-icon type="ios-arrow-right" size="20"></x-icon>
            </div>
          </div>
        </li>
      </ul>
    </pull-to>
  </div>
</template>

<script>
import PullTo from 'vue-pull-to'

export default {
  components: {
    PullTo
  },
  data() {
    return {
      userList: [],
      rows: 10,
      page: 1
    }
  },
  created() {
    this.initPage()
  },
  methods: {
    ...Vuex.mapActions(['GET_SUB_AGENT_LIST']),
    initPage() {
      this.GET_SUB_AGENT_LIST({
        rows: this.rows,
        page: this.page
      }).then(res => {
        this.userList = res.data.users
      })
    },
    loadmore() {},
    goToUserDetail(item) {
      this.$router.push({
        path: '/user/userListDetail',
        query: {
          cid: item.id
        }
      })
    }
  }
}
</script>

<style scoped>
.user-list {
  justify-content: space-between;
  align-items: center;
}
.user-list > li {
  display: flex;
  background-color: white;
  margin-bottom: 10px;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding: 0 15px;
}
.account-type-icon {
  width: 40px;
  vertical-align: middle;
}
.user-info {
  display: flex;
  align-items: center;
}
.user-info-right {
  display: flex;
  align-items: center;
}
.account-name {
  font-size: 14px;
}
.money-label {
  margin-left: 5px;
  font-size: 11px;
}
.money {
  font-size: 14px;
  font-weight: bold;
}
.register-time {
  color: #999;
  font-size: 12px;
  margin-top: 5px;
}
.rebate {
  font-size: 13px;
  font-weight: 500;
}
.rebate-label {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}
</style>

<style>
.user-list-box .user-info-right svg {
  fill: #999;
}
</style>

