import axios from '../util/request'
// 玩法菜单
export const getPlayMenu = params => axios.post('/game/info', params)

// 获取开奖结果
export const getGameResult = params => axios.post('/game/result', { ...params })

// 下注
export const bet = params => axios.post('/game/bet', params)

// 投注记录
export const getBetHistory = params => axios.post('/bill/record', params)

// 获取彩种信息
export const getGameList = params => axios.post('/game/index', params)

// 获取当前用户或下级用户的游戏设置

export const getGameSetting = params => axios.post('game/settings', params)

// 获取所有游戏
export const getAllGames = params => axios.post('game/games', params)

// 获取游戏走势
export const getTrend = params => axios.post('game/get_trend', params)
