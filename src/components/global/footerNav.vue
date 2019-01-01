<template>
  <div>
    <!-- 撑开固定定位的高度 -->
    <div class="placeholder"></div>
    <ul class="nav-list">
      <li v-for="item in navs" :class="{'active':`/${item.path}`===$route.path}" @click="goToPage(item)">
        <div class="nav-item-icon">
          <img :src="require(`../../../static/images/home-blue/${'/'+item.path===$route.path?item.activeIcon:item.icon}`)" alt="">
        </div>
        <div>
          {{item.name}}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import navMenu from '../../config/navMenu'
export default {
  data() {
    return {
      navs: navMenu
    }
  },
  created() {
    this.updateNav()
  },
  updated() {
    this.updateNav()
  },
  methods: {
    updateNav() {
      // 当未登录的时候,我的页面需要显示成登录,并且路径为登录页面
      if (!this.$store.getters.token) {
        this.navs = this.navs.map(item => {
          if (item.name === '我') {
            item.name = '登录'
            item.path = 'user/login'
          }
          return item
        })
      } else {
        this.navs = this.navs.map(item => {
          if (item.name === '登录') {
            item.name = '我'
            item.path = 'my'
          }
          return item
        })
      }
    },
    goToPage(navItem) {
      this.$router.push({
        path: `/${navItem.path}`
      })
    }
  }
}
</script>

<style scoped>
.placeholder {
  height: 49px;
}
.nav-list {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: fixed;
  width: 100%;
  height: 49px;
  left: 0;
  bottom: 0;
  border-top: solid 0.5px #e2e4ef;
  background-color: white;
  font-size: 11px;
  color: #98a7bb;
  z-index: 2;
}
.nav-list > li {
  flex: 1;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.nav-item-icon {
  width: 40px;
  height: 20px;
}
.nav-item-icon > img {
  width: 20px;
}
</style>

