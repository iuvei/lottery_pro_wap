/*
 *存放与应用相关的数据
 *storeDataToSession 将接口返回的数据存在session里面，避免重复请求接口
 */
import storeDataToSession from '../../util/storeDataToSession'
import {
  getLotteryRankList,
  getNoticeList,
  getReceiveMessageList,
  getSendMessageList,
  replyMessage,
  findMessage,
  delectMessage,
  getAllLower,
  sendMessage,
  readMessage,
  getServices
} from '../../api/app'

export default {
  state: {
    loading: false,
    maskLayerShow: false,
    maskLayerZIndex: 13,
    path: ''
  },
  getters: {},
  mutations: {
    setLoadingState(state, bool) {
      state.loading = bool
    },
    setMaskLayerShow(state, bool) {
      state.maskLayerShow = bool
    },
    setMaskLayerZIndex(state, zIndex) {
      state.maskLayerZIndex = zIndex
    },
    setPath(state, path) {
      state.path = path
    }
  },
  actions: {
    GET_LOTTERY_RANK_LIST: async ({ state, commit }, params) => {
      let res = await getLotteryRankList(params)
      return res
    },
    GET_NOTICE_LIST: async ({ state, commit }, params) => {
      let res = await getNoticeList(params)
      return res
    },
    GET_RECEIVE_MESSAGE_LIST: async ({ state, commit }, params) => {
      let res = await getReceiveMessageList(params)
      return res
    },
    GET_SEND_MESSAGE_LIST: async ({ state, commit }, params) => {
      let res = await getSendMessageList(params)
      return res
    },
    REPLY_MESSAGE: async ({ state, commit }, params) => {
      let res = await replyMessage(params)
      return res
    },
    FIND_MESSAGE: async ({ state, commit }, params) => {
      let res = await findMessage(params)
      return res
    },
    DELECT_MESSAGE: async ({ state, commit }, params) => {
      let res = await delectMessage(params)
      return res
    },
    GET_ALL_LOWER: async ({ state, commit }, params) => {
      let res = await getAllLower(params)
      return res
    },
    SEND_MESSAGE: async ({ state, commit }, params) => {
      let res = await sendMessage(params)
      return res
    },
    READ_MESSAGE: async ({commit, state, dispatch}, params) => {
      let res = await readMessage(params)
      return res
    },
    GET_SERVICES: async ({commit, state, dispatch}, params) => {
      let res = await getServices(params)
      return res
    }
  }
}
