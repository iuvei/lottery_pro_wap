import axios from '../util/request'
// 注册
export const register = params => axios.post('/member/register', params)

// 登录
export const login = params => axios.post('/member/login', params)

// 试玩
export const loginAsTourist = params => axios.post('/member/guest', params)

// 登出
export const logout = params => axios.post('/member/logout', params)

// 用户信息1
export const getMemberInfo = params => axios.post('/member/info', params)

// 用户信息2
export const getMemberInfo2 = params => axios.post('/member/index', params)

// 可用充值方式
export const getRechargeList = params =>
  axios.post('/transaction/index', params)

// 获取充值通道列表
export const getRechargeChannelList = params =>
  axios.post('/transaction/get_category_pay', params)

// 获取注册和试玩验证码
export const getVerifyData = params => axios.post('/member/captcha', params)

// 修改密码
export const modifyLoginPwd = params =>
  axios.post('/member/change_password', params)

// 修改充值密码
export const modifyWithdrawPwd = params =>
  axios.post('/transaction/set_withdraw_password', params)

// 获取可用开户银行列表
export const getAvailBankList = params =>
  axios.post('/transaction/get_bank_list', params)

// 添加银行卡
export const addBankCard = params =>
  axios.post('/transaction/set_bankcard', params)

// 获取用户银行卡列表
export const getUserBankList = params =>
  axios.post('transaction/my_bankcard', params)

// 查看资金记录
export const getMoneyHistory = params =>
  axios.post('transaction/history', params)

// 申请提款
export const withdrawReq = params =>
  axios.post('transaction/withdraw_request', params)

// 解绑银行卡
export const unbindBank = params =>
  axios.post('transaction/unbind_bankcard', params)

// 获取推广信息
export const getPromotionInfo = params =>
  axios.post('member/promotions', params)

// 设置推广信息
export const setPromotionInfo = params =>
  axios.post('member/set_promotion', params)

// 删除一条推广信息
export const deletePromotionInfo = params =>
  axios.post('member/delete_promotion', params)

// 代理中心>下级用户列表
export const getSubAgentList = params => axios.post('member/children', params)

// 代理中心>下级用户信息
export const getSubAgentInfo = params => axios.post('member/view_child', params)

// 代理中心>设置下级用户信息
export const updateSubAgentInfo = params =>
  axios.post('member/update_child', params)

// 代理中心>转账给下级用户
export const transferMoneyToSubAgent = params =>
  axios.post('member/transfer', params)

// 线下入款申请
export const offlinePay = params =>
  axios.post('transaction/offline_request', params)

// 代理开户
export const agentAddMember = params => axios.post('member/add_child', params)

// 团队报表
export const teamReport = params => axios.post('bill/report', params)

// 修改用户信息
export const updateUserInfo = params => axios.post('member/update_info', params)

// 获取返点比例
export const getRebateData = params => axios.post('member/get_rebate', params)

// 代理中心
export const getAgentInfo = params => axios.post('member/agent', params)

// 获取工资/分红领取记录
export const getWageOrBonus = params => axios.post('member/wages', params)

// 获取契约列表
export const getContracts = params => axios.post('member/contracts', params)

// 修改锲约(状态)
export const setContractsStatus = params => axios.post('member/change_contract', params)

// 创建(新)锲约
export const createContracts = params => axios.post('member/create_contract', params)
