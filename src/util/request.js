import axios from 'axios'
import store from '../store'
import Vue from 'vue'
import { ToastPlugin } from 'vux'
Vue.use(ToastPlugin)

const request = axios.create({
  baseURL: window.apiUrl, // api的base_url
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    let params = config.data || {}
    // 轮询调用的接口不需要设置loading状态
    if (!params.loop) {
      store.commit('setLoadingState', true)
    }
    if (store.getters.token) {
      // 让每个请求携带token
      /* 判断参数是否为数组,因为后台水平有限无法统一参数格式为对象字符串 */
      if (Array.isArray(params)) {
        params.map(item => {
          item.token = store.getters.token
          return item
        })
        config.data = JSON.stringify(params)
      } else {
        config.data = JSON.stringify({
          token: store.getters.token,
          ...params
        })
      }
    } else {
      config.data = JSON.stringify(config.data)
    }
    return config
  },
  error => {
    store.commit('setLoadingState', false)
    // Vue.$vux.toast.text(error.message, 'middle')
    Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    let config = JSON.parse((response.config && response.config.data) || '{}')
    // loading状态
    if (!config.loop) {
      store.commit('setLoadingState', false)
    }
    // 错误提示
    if (!response.data.result) {
      // Vue.$vux.toast.text(response.data.message, 'middle')
      // 会话失效的时候需要跳转到登录页面
      if (response.data.error_no === '1') {
        setTimeout(() => {
          sessionStorage.clear()
          store.commit('resetUserData')
          // location.href = '/user/login'
        }, 1000)
      }
      throw new Error(response.data.message)
    }
    // 成功提示
    if (response.data.result && response.data.message) {
      // Vue.$vux.toast.show(response.data.message, 'middle')
    }
    return response.data
  },
  error => {
    store.commit('setLoadingState', false)
    // Vue.$vux.toast.show(error.message, 'middle')
    return Promise.reject(error)
  }
)

export default request
