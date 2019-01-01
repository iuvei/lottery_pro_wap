import axios from '../util/request'
// 玩法菜单
export const getLotteryRankList = params => axios.post('bill/recently_won', params)

// 公告信息
export const getNoticeList = params => axios.post('notice/get_notice', params)

// 收件箱
export const getReceiveMessageList = params => axios.post('message/receive_list', params)

// 发件箱
export const getSendMessageList = params => axios.post('message/send_list', params)

// 回复消息
export const replyMessage = params => axios.post('message/reply_message', params)

// 发送消息
export const sendMessage = params => axios.post('message/send_message', params)

// 查看消息
export const findMessage = params => axios.post('message/cat_message', params)

// 删除消息
export const delectMessage = params => axios.post('message/del_message', params)

// 已读消息
export const readMessage = params => axios.post('message/read_message', params)

// 查看所有下级
export const getAllLower = params => axios.post('message/get_to_users', params)

// 客服链接
export const getServices = params => axios.post('system/get_config', params)
