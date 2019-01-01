import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'
import router from './router/index.js'
import store from './store/index.js'
import { sync } from 'vuex-router-sync'
import * as filters from './util/filters'
import { loadGameInfo } from './util/loadWebSiteConfig'

import VueClipboard from 'vue-clipboard2'
// 注册全局组件
import './components/global/index'

import bus from "vue-bus"

// 表单验证
import VeeValidate, { Validator } from 'vee-validate'
import zh from 'vee-validate/dist/locale/zh_CN'
Validator.localize({
  zh
})
Validator.localize('zh')
Vue.use(VeeValidate, {
  errorBagName: 'xErrors',
  locale: 'zh'
})

Vue.use(bus)
// 复制文本功能
Vue.use(VueClipboard)
// 全局事件
Vue.prototype.$eventBus = new Vue()

Vue.prototype.$window = window

Vue.use(VueRouter)

// 消除手机端点击300ms延迟
FastClick.attach(document.body)

Vue.config.productionTip = false

// 全局过滤函数
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 开发环境下面打开debug模式
Vue.config.debug = process.env.NODE_ENV === 'development' && true

// 路由切换加上loading状态
router.beforeEach(function(to, from, next) {
  store.commit('setPath', {
    from,
    to
  })
  store.commit('setLoadingState', true)
  if (store.state.game.gameInfo.length) {
    next()
  } else {
    loadGameInfo().then(res => {
      store.commit('setGameInfo', res)
      next()
    })
  }
})

router.afterEach(function(to, from) {
  store.commit('setPath', {
    from,
    to
  })
  store.commit('setLoadingState', false)
  // 隐藏遮罩层
  store.commit('setMaskLayerShow', false)
})

sync(store, router)

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app-box')
