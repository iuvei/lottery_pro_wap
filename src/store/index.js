import Vue from 'vue'
import Vuex from 'vuex'
import app from './models/app'
import game from './models/game'
import user from './models/user'

// vuex调试插件
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    game,
    user
  },
  // plugins: process.env.NODE_ENV && [createLogger()]
})
