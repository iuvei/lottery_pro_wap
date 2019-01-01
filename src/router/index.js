import Vue from 'vue'
import Router from 'vue-router'

const Index = () => import('../views/index')

const Test = () => import('../views/test')

const GameIndex = () => import('../views/games/index')
// 主页
const Home = () => import('../views/main/home')
// 彩票大厅
const LotteryHall = () => import('../views/games/main/lotteryHall')
// 开奖记录
const LotteryHistory = () => import('../views/games/main/lotteryHistory')

// 开奖详情:开奖号码和开奖详情
const LotteryHistoryDetail = () =>
  import('../views/games/main/lotteryHistoryDetail')

// 个人中心
const UserIndex = () => import('../views/user/userIndex')

// 用户页面
const Login = () => import('../views/user/login')

const Register = () => import('../views/user/register')
// 个人信息
const UserInfo = () => import('../views/user/info')
// 修改个人信息
const SetUserInfo = () => import('../views/user/setInfo')
// 修改密码
const ModifyPwd = () => import('../views/user/modifyPwd')

// 修改密码详情
const ModifyPwdDetail = () => import('../components/user/ModifyPwd')
// 修改登陆密码
const ModloginPwd = () => import('../views/user/modloginPwd')
// 修改提现密码
const ModWithdrawPwd = () => import('../views/user/modWithdrawPwd')
// 设置提现密码
const SetWithdrawPwd = () => import('../views/user/setWithdrawPwd')
// 公告
const Announcement = () => import('../views/user/announcement')
// 站内信
const MessageList = () => import('../views/user/message/messageList')
// 站内信详情
const MessageDetail = () => import('../views/user/message/messageDetail')

// 协议
const Agreement = () => import('../views/user/agreement')
// 联系我们
const Kefu = () => import('../views/user/kefu')
// 添加银行卡
const AddBankCards = () => import('../views/bank/addBankCards')
// 银行卡管理
const BankCardManage = () => import('../views/bank/bankCardManage')
// 银行卡管理
const BankCardDetail = () => import('../views/bank/bankCardDetail')
// 我的银行卡
const Withdraw = () => import('../views/bank/withdraw')
// 充值中心
const rechargeCentre = () => import('../views/bank/recharge/rechargeCentre')

// 充值
const Recharge = () => import('../views/bank/recharge/index')

// 线上充值跳转第三方
const OnlinePayJump = () => import('../views/bank/recharge/onlinePayJump')

// 额度转换
const MoneyTransfer = () => import('../views/bank/moneyTransfer')

// 资金记录
const MoneyHistory = () => import('../views/bank/moneyHistory')

// 资金详情
const MoneyDetail = () => import('../views/bank/moneyDetail')

// 资金筛选
const MoneyFilter = () => import('../components/games/filter/moneyHistory.vue')

const GameTpl = () => import('../components/games/tpl/betTpl.vue')
// 确认注单
const ConfirmOrder = () => import('../views/games/order/confirmOrder.vue')

// 投注记录
const BetOrderHistory = () => import('../views/games/order/betOrderHistory.vue')

// 投注记录筛选
const BetOrderFilter = () => import('../components/games/filter/order.vue')

// 注单明细
const BetOrderDetail = () => import('../views/games/order/betOrderDetail.vue')

// 用户代理
const UserAgent = () => import('../views/user/agent/index.vue')

// 用户代理>用户列表>详情
const UserlistDetail = () => import('../views/user/agent/userListDetail.vue')

// 个人中心>查看奖金组
const BonusDetail = () => import('../views/user/bonusDetail.vue')

// 活动详情
const ActivityList = () => import('../views/activity/list')

// 新增
const TeamDetail = () => import('../components/user/agent/TeamDetail.vue')
const TeamFilter = () => import('../components/games/filter/teamFilter.vue')

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Index
    },
    {
      path: '/home',
      component: Home
    },
    {
      path: '/lotteryHall',
      component: LotteryHall
    },
    {
      path: '/lotteryHistory',
      component: LotteryHistory
    },
    {
      path: '/lotteryHistory/:game_code',
      component: LotteryHistoryDetail
    },
    {
      path: '/test',
      component: Test
    },
    {
      path: '/game',
      component: GameIndex,
      children: [
        {
          path: ':game_code',
          component: GameTpl
        }
      ]
    },
    {
      path: '/my',
      component: UserIndex
    },
    {
      path: '/user/login',
      component: Login
    },
    {
      path: '/user/register',
      component: Register
    },
    {
      path: '/user/info',
      component: UserInfo
    },
    {
      path: '/user/setInfo',
      component: SetUserInfo
    },
    {
      path: '/user/agreement',
      component: Agreement
    },
    {
      path: '/user/kefu',
      component: Kefu
    },
    {
      path: '/user/modifyPwd',
      component: ModifyPwd
    },
    {
      path: '/user/modloginPwd',
      component: ModloginPwd
    },
    {
      path: '/user/modWithdrawPwd',
      component: ModWithdrawPwd
    },
    {
      path: '/user/setWithdrawPwd',
      component: SetWithdrawPwd
    },
    {
      path: '/user/announcement',
      component: Announcement
    },
    {
      path: '/user/message/list',
      component: MessageList
    },
    {
      path: '/user/message/detail',
      component: MessageDetail
    },
    {
      path: '/user/agent/:tab',
      component: UserAgent
    },
    {
      path: '/user/agent/3/detail',
      component: TeamDetail
    },
    {
      path: '/user/agent/3/teamfilter',
      component: TeamFilter
    },
    {
      path: '/user/userListDetail',
      component: UserlistDetail
    },
    {
      path: '/user/bonusDetail',
      component: BonusDetail
    },
    {
      path: '/bank/addBankCards',
      component: AddBankCards
    },
    {
      path: '/bank/bankCardManage',
      component: BankCardManage
    },
    {
      path: '/bank/bankCardDetail',
      component: BankCardDetail
    },
    {
      path: '/bank/withdraw',
      component: Withdraw
    },
    {
      path: '/bank/rechargeCentre',
      component: rechargeCentre
    },
    {
      path: '/bank/onlinePayJump',
      component: OnlinePayJump
    },
    {
      path: '/money/transfer',
      component: MoneyTransfer
    },
    {
      path: '/money/history',
      component: MoneyHistory
    },
    {
      path: '/money/detail',
      component: MoneyDetail
    },
    {
      path: '/money/filter',
      component: MoneyFilter
    },
    {
      path: '/bank/:type',
      component: Recharge
    },
    {
      path: '/confirmOrder/:game_code',
      component: ConfirmOrder
    },
    {
      path: '/order/history',
      component: BetOrderHistory
    },
    {
      path: '/order/filter',
      component: BetOrderFilter
    },
    {
      path: '/order/detail',
      component: BetOrderDetail
    },
    {
      path: '/activity/list',
      component: ActivityList
    }
  ]
})
