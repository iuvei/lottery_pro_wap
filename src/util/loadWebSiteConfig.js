// 加载网页基本的数据配置,彩种信息
import { getGameList } from '../api/game'
export async function loadGameInfo() {
  let res = await getGameList({type: 1})
  return res.data ? res.data.lottery : ''
}
