export function initTeamItem(data) {
  let list = data.map(item => {
    return {
      username: item.username,
      user_id: item.user_id,
      is_agent: item.is_agent,
      children_amount_total: (parseFloat(item.amount_total) + parseFloat(item.children_amount_total)).toFixed(3),
      children_valid_total: (parseFloat(item.valid_total) + parseFloat(item.children_valid_total)).toFixed(3),
      children_win_amount: (parseFloat(item.win_amount) + parseFloat(item.children_win_amount)).toFixed(3),
      children_winning_amount: (parseFloat(item.winning_amount) + parseFloat(item.children_winning_amount)).toFixed(3),
      children_rebate_amount: (parseFloat(item.rebate_amount) + parseFloat(item.children_rebate_amount)).toFixed(3),
      children_rebates: (parseFloat(item.rebates) + parseFloat(item.children_rebates)).toFixed(3),
      children_bill_rows: parseFloat(item.bill_rows) + parseFloat(item.children_bill_rows),
      user_rows: item.user_rows || 0,
      team_profit: parseFloat(item.team_profit).toFixed(3),
      self_profit: parseFloat(item.profit).toFixed(3),
      amount_total: (parseFloat(item.amount_total)).toFixed(3),
      valid_total: (parseFloat(item.valid_total)).toFixed(3),
      win_amount: parseFloat(item.win_amount).toFixed(3),
      winning_amount: parseFloat(item.winning_amount).toFixed(3),
      rebate_amount: parseFloat(item.rebate_amount).toFixed(3),
      rebates: (parseFloat(item.rebates)).toFixed(3),
      bill_rows: parseFloat(item.bill_rows)
    }
  })
  return list
}
