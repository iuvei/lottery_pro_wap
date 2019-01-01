/*
 *存放与用户相关的数据
 *storeDataToSession 将接口返回的数据存在session里面，避免重复请求接口
 */
// 将数据存到
import {
  register,
  login,
  loginAsTourist,
  logout,
  getRechargeList,
  getMemberInfo,
  getMemberInfo2,
  getRechargeChannelList,
  getVerifyData,
  modifyLoginPwd,
  modifyWithdrawPwd,
  getAvailBankList,
  addBankCard,
  getUserBankList,
  getMoneyHistory,
  withdrawReq,
  unbindBank,
  getPromotionInfo,
  setPromotionInfo,
  deletePromotionInfo,
  getSubAgentList,
  getSubAgentInfo,
  updateSubAgentInfo,
  transferMoneyToSubAgent,
  offlinePay,
  agentAddMember,
  teamReport,
  updateUserInfo,
  getRebateData,
  getWageOrBonus,
  getContracts,
  setContractsStatus,
  createContracts,
  getAgentInfo
} from '../../api/user'
import storeDataToSession from '../../util/storeDataToSession'
export default {
  state: {
    userInfo: JSON.parse(sessionStorage.getItem('user') || '{}'),
    mailer_list: []
  },
  getters: {
    token: state => state.userInfo && state.userInfo.token,
    username: state => state.userInfo && state.userInfo.username,
    balance: state => state.userInfo && state.userInfo.balance,
    get_mailer_list: state => state.mailer_list
  },
  mutations: {
    setUser(state, userInfo) {
      state.userInfo = userInfo
    },
    resetUserData(state) {
      state.userInfo = {}
    },
    set_mailer_list(state, list) {
      state.mailer_list = list
    }
  },
  actions: {
    LOGIN: async ({ commit, state }, params) => {
      let res = await login(params)
      // 登录成功之后,先清空sessionStorage
      sessionStorage.clear()
      commit('setUser', res.data)
      sessionStorage.setItem('user', JSON.stringify(res.data))
      return res
    },
    LOGIN_AS_TOURIST: async ({ commit, state }, params) => {
      let res = await loginAsTourist(params)
      // 登录成功之后,先清空sessionStorage
      sessionStorage.clear()
      commit('setUser', res.data)
      sessionStorage.setItem('user', JSON.stringify(res.data))
      return res
    },
    REGISTER: async ({ commit, state }, params) => {
      let res = await register(params)
      // 注册成功之后,先清空sessionStorage
      sessionStorage.clear()
      commit('setUser', res.data)
      sessionStorage.setItem('user', JSON.stringify(res.data))
      return res
    },
    GET_MEMBER_INFO: async ({ commit, state }, params) => {
      let res = await getMemberInfo({ ...params, loop: true })
      // 更新余额
      if (params && params.item === 'balance') {
        commit('setUser', {
          ...state.userInfo,
          balance: res.data.user.balance
        })
        console.log({
          ...state.userInfo,
          balance: res.data.user.balance
        })
      } else {
        commit('setUser', { ...state.userInfo, ...res.data.user })
      }
      return res
    },
    GET_MEMBER_INFO2: async ({ commit, state, dispatch }, params) => {
      // 获取用户信息
      let memberInfo = await getMemberInfo2(params)
      return memberInfo
    },
    GET_RECHARGE_LIST: async ({ commit, state, dispatch }, params) => {
      // 获取用户信息
      let memberInfo = await dispatch('GET_MEMBER_INFO', params)
      // commit memberInfo
      commit('setUser', {
        ...state.userInfo,
        balance: memberInfo.data.user.balance
      })
      let res = await getRechargeList(params)
      return res
    },
    GET_RECHARGE_CHANNEL_LIST: async ({ commit, state, dispatch }, params) => {
      let channelList = await getRechargeChannelList(params)
      return channelList
    },
    GET_VERIFY_DATA: async ({ commit, state, dispatch }, params) => {
      let verifyData = await getVerifyData(params)
      return verifyData
    },
    MODIFY_LOGIN_PWD: async ({ commit, state, dispatch }, params) => {
      let res = await modifyLoginPwd(params)
      return res
    },
    MODIFY_WITHDRAW_PWD: async ({ commit, state, dispatch }, params) => {
      let res = await modifyWithdrawPwd(params)
      return res
    },
    GET_AVAIL_BANKLIST: async ({ commit, state, dispatch }, params) => {
      let res = await getAvailBankList(params)
      return res
    },
    ADD_BANK_CARD: async ({ commit, state, dispatch }, params) => {
      let res = await addBankCard(params)
      return res
    },
    GET_USER_BANK_LIST: async ({ commit, state, dispatch }, params) => {
      let res = await getUserBankList(params)
      return res
    },
    GET_MONEY_HISTORY: async ({ commit, state, dispatch }, params) => {
      let res = await getMoneyHistory(params)
      return res
    },
    WITHDRAW_REQ: async ({ commit, state, dispatch }, params) => {
      let res = await withdrawReq(params)
      return res
    },
    UNBIND_BANK: async ({ commit, state, dispatch }, params) => {
      let res = await unbindBank(params)
      return res
    },
    GET_PROMOTION_INFO: async ({ commit, state, dispatch }, params) => {
      let res = await getPromotionInfo(params)
      return res
    },
    SET_PROMOTION_INFO: async ({ commit, state, dispatch }, params) => {
      let res = await setPromotionInfo(params)
      return res
    },
    DELETE_PROMOTION_INFO: async ({ commit, state, dispatch }, params) => {
      let res = await deletePromotionInfo(params)
      return res
    },
    GET_SUB_AGENT_LIST: async ({ commit, state, dispatch }, params) => {
      let res = await getSubAgentList(params)
      return res
    },
    GET_SUB_AGENT_INFO: async ({ commit, state, dispatch }, params) => {
      let res = await getSubAgentInfo(params)
      return res
    },
    UPDATE_SUB_AGENT_INFO: async ({ commit, state, dispatch }, params) => {
      let res = await updateSubAgentInfo(params)
      return res
    },
    TRANSFER_MONEY_TO_SUB_AGENT: async (
      { commit, state, dispatch },
      params
    ) => {
      let res = await transferMoneyToSubAgent(params)
      return res
    },
    OFFLINE_PAY: async ({ commit, state, dispatch }, params) => {
      let res = await offlinePay(params)
      return res
    },
    AGENT_ADD_MEMBER: async ({ commit, state, dispatch }, params) => {
      let res = await agentAddMember(params)
      return res
    },
    GET_TEAM_REPORT: async ({ commit, state, dispatch }, params) => {
      let res = await teamReport(params)
      return res
    },
    UPDATE_USERINFO: async ({ commit, state, dispatch }, params) => {
      let res = await updateUserInfo(params)
      return res
    },
    GET_REBATE_DATA: async ({ commit, state, dispatch }, params) => {
      let res = await getRebateData(params)
      return res
    },
    GET_WAGE_OR_BONUS: async ({commit, state, dispatch}, params) => {
      let res = await getWageOrBonus(params)
      return res
    },
    GET_CONTRACTS: async ({commit, state, dispatch}, params) => {
      let res = await getContracts(params)
      return res
    },
    SET_CONTRACTS_STATUS: async ({commit, state, dispatch}, params) => {
      let res = await setContractsStatus(params)
      return res
    },
    CREATE_CONTRACTS: async ({commit, state, dispatch}, params) => {
      let res = await createContracts(params)
      return res
    },
    GET_AGENT_INFO: async ({commit, state, dispatch}, params) => {
      let res = await getAgentInfo(params)
      return res
    }
  }
}
