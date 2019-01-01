/* {
  "token": "",
  "game_code": "cqssc",
  "round": "20180716116",
  "id": "28",
  "odds": "95",
  "rebate": "5",
  "content": "1,2,3",
  "amount": "2",
  "multiple": "3"
}
/*
*点击下注,获取betData的内容,获取当前的game_code,round,当前玩法的id,odds,rebate,amount,multiple等信息
*存到localStorge中,
*到了下一期的时候需要清空
*{
  game_code,
  round,
  binge,
  binge_mode
  list:[
    {
      playName  玩法名称
      id 玩法id
      content 下注内容
      multiple 倍数
      amount 单注金额
      odds 下注赔率
      rebate 返点比例
    }
  ]
}
{
  game_info:{
    game_code:'cqssc',
    round:''
  }
}
*
*/

function generateBetOrderList({game_code, round, list}) {

}
