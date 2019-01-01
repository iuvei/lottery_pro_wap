<template>
  <div>
    <ul class="card-list">
      <li
        v-for="item in list"
        @click="goToPath(item)"
      >
        <div>
          <div :class="item.alias">
            <img
              class="card-item-left-icon"
              :src="`../../../static/images/icon/${item.icon}`"
              alt=""
            >
          </div>
          <div style="margin-left:6px">{{item.title}}</div>
        </div>
        <div>
          <img
            class="arrow-right"
            src="../../../static/images/icon/arrow-right-icon@3x.png"
            alt=""
          >
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  props: ['list'],
  methods: {
    goToPath(item) {
      if ((item.path === '/user/modifyPwd' || item.path === '/user/message/list')&&(this.$store.state.user && this.$store.state.user.userInfo.guest === "1")) {
        Vue.$vux.toast.text('请登录正式账号操作')
        return
      }
      if (item.title === '每日签到') {
        Vue.$vux.toast.show('尚未开通')
        return
      }
      this.$router.push({
        path: item.path
      })
    }
  }
}
</script>

<style scoped>
.card-list > li > div {
  display: flex;
  align-items: center;
}

.card-list li {
  display: flex;
  line-height: 40px;
  justify-content: space-between;
  font-size: 14px;
  position: relative;
  margin-left: 12px;
  padding-right: 12px;
	border-bottom: solid 0.5px #e2e4ef;
	color:#333;
}

.card-list li:last-child {
  border: none;
}

.card-list img {
  display: block;
}

.card-list li > div:first-child {
  display: flex;
}

.card-item-left-icon {
  width: 20px;
}

.arrow-right {
  zoom: 0.4;
}

.notification .card-item-left-icon {
  margin-left: 2px;
}
</style>
