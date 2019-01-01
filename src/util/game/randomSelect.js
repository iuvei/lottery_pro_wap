import { getPlayInfo } from '../../util/lotteryAlgorithmUtil'

import { generateNumber } from '../generateBetTplData'

/*
 *betTplType 下注类型
 *betData 下注数据
 *lotteryType 彩票类型
 *playType 玩法标题
 *position 官方玩法,信用玩法
 */
export function randomBetSelect({ randomNum = 1, store }) {
  let list = []
  let { betTplType } = store.state.game
  // 需要清空已经选中的betData和betText
  // 需要去除占位的betItem
  let originalBetData = store.state.game.betData
  let betData = {}
  let lotteryType = store.state.game.currentGameInfo.type
  let playTitle = store.state.game.playMenuTitle
  // betData每一个item最少需要选择的个数
  let minChunkList

  let generatedRandomList
  /* 重置全,大,小,单,双,清状态 */
  if (betTplType !== 'textArea') {
    betData = _.cloneDeep(originalBetData).map(item => {
      item.list = item.list.filter(item1 => !item1.empty)
      return item
    })
    betData.map(item => {
      item.selectedList = []
      if (item.selectedBtnType !== undefined) {
        item.selectedBtnType = ''
      }
      return item
    })
  }

  let { navTitle, subNavTitle, min, max, len, repeat, addZero } = getPlayInfo(
    store
  )
  // 只需要选中一个号码
  ;['和值', '跨度', '包胆', '特殊号'].forEach(item => {
    if (playTitle.indexOf(item) !== -1) {
      len = 1
    }
  })

  if (subNavTitle === '组选4' || subNavTitle === '组三复式') {
    repeat = false
    len = 2
  }

  if (subNavTitle === '组选6') {
    repeat = false
    len = 2
    minChunkList = [2]
  }

  if (subNavTitle === '组选12') {
    len = 3
    repeat = false
    minChunkList = [1, 2]
  }
  // 只有一个选择列表,并且需要选择多个号码,比如组选复式等等
  if (len > betData.length && betData.length === 1) {
    minChunkList = [len]
    repeat = false
  }
  // 胆拖投注
  if (
    navTitle.indexOf('胆拖') !== -1 ||
    (subNavTitle && subNavTitle.indexOf('胆拖') !== -1)
  ) {
    minChunkList = [1, len - 1]
    repeat = false
  }

  // 定位胆
  if (
    navTitle === '定位胆' ||
    (lotteryType === 'syxw' && navTitle === '不定位') ||
    navTitle === '三连号' ||
    (store.state.game.currentGameInfo.position === 1 &&
      navTitle !== '连码' &&
      navTitle !== '合肖' &&
      navTitle !== '连肖' &&
      navTitle !== '尾数连' &&
      navTitle !== '全不中')
  ) {
    len = 1
  }

  // 组选单式,组六单式不允许重号
  if (subNavTitle === '组选单式' || subNavTitle === '组六单式') {
    repeat = false
  }

  // 组三单式,生成两个不重复的号码
  if (subNavTitle === '组三单式') {
    len = 2
    repeat = false
  }

  // 福彩3d二字定位
  if (navTitle == '二字定位' || navTitle === '二字组合') {
    len = 2
  }

  // 福彩3d三字定位
  if (navTitle == '三字定位' || navTitle === '三字组合') {
    len = 3
  }

  // 快乐十分
  if (lotteryType === 'xync' && navTitle === '任选') {
    ;[
      { name: '任一中一', len: 1 },
      { name: '任二中二', len: 2 },
      { name: '任三中三', len: 3 },
      { name: '任四中四', len: 4 },
      { name: '任五中五', len: 5 }
    ].map((item, index) => {
      if (item.name === subNavTitle) {
        len = item.len
      }
    })
  }

  if (betTplType === 'textArea') {
    let listNumber = generateNumber({ min, max, addZero })
    list = generateRandomList({ list: listNumber, len, repeat })
    if (subNavTitle === '组三单式') {
      list[2] = list[1]
    }
    if (subNavTitle === '混合组选' && Array.from(new Set(list)).length === 1) {
      // 生成了豹子号之后,需要重新生成
      list = randomBetSelect({ randomNum, store })
    }
  }
  if (
    betTplType === 'roundList' ||
    betTplType === 'rectList' ||
    betTplType === 'rectOddsList'
  ) {
    // 需要随机位数的,先随机出位数,如定位胆,时时彩任选3-直选复式玩法,还有一些两面盘玩法
    if (len < betData.length) {
      // 将位数随机出来
      let generatedPostionNumber = generateRandomList({
        list: generateNumber({ min: 0, max: betData.length - 1 }),
        len,
        repeat: false
      })
      // 然后再生成机选列表
      generatedRandomList = generateRandomList({
        list: betData[generatedPostionNumber[0]].list,
        len,
        repeat
      })
      // 生成随机号码
      generatedPostionNumber.forEach((item, index) => {
        betData[item].selectedList = [generatedRandomList[index]]
      })
      list = betData
      originalBetData.map((item, index) => {
        list[index].list = item.list
      })
      return list
    }
    // 生成机选列表
    generatedRandomList = generateRandomList({
      list: betData[0].list,
      len,
      repeat
    })
    // betData的每一个item
    // 默认机选选中
    list = _.cloneDeep(betData).map((item, index) => {
      if (minChunkList) {
        let chunkList = arrayToChunk(generatedRandomList, minChunkList)
        item.selectedList = chunkList[index]
      } else if (generatedRandomList[index] !== undefined) {
        item.selectedList = [generatedRandomList[index]]
      }
      return item
    })

    // 至少需要选中len个
    if (subNavTitle === '组选6') {
      len = 2
    }
    if (betData.length === 2 && len !== betData.length) {
      if (subNavTitle === '组选12') {
        repeat = false
      }
    }
    // 北京快乐8任选需要单独处理
    if (lotteryType === 'kl8' && navTitle === '任选') {
      let randomList = generateRandomList({
        list: generateNumber({ min: 1, max: 80, addZero }),
        len,
        repeat: false
      })
      list = betData.map(item => {
        item.list.map(item1 => {
          if (randomList.includes(item1.name)) {
            item.selectedList.push(item1)
          }
        })
        return item
      })
    }
    // 快三 二同号单选需要特殊处理
    if (navTitle === '二同号' && subNavTitle === '单选') {
      // 随机两个0-5的索引值
      let index0 = _.random(0, 5)
      let index1 = [0, 1, 2, 3, 4, 5].filter(item => item !== index0)[
        _.random(0, 4)
      ]
      list = betData.map((item, index) => {
        item.selectedList = [item.list[index === 0 ? index0 : index1]]
        return item
      })
    }
  }

  if (betTplType === 'vsList') {
    if (lotteryType === 'ssc' && navTitle === '龙虎') {
      let randomList = [_.random(0, 10), _.random(0, 1)]
      // 清空已选中的
      betData.map(item => {
        item.selectedList = []
        return item
      })
      betData[randomList[0]].selectedList = [
        betData[randomList[0]].list[randomList[1]]
      ]
      list = betData
    }
  }
  // 还原去掉的空的betItem
  if (betTplType !== 'textArea' && betTplType !== 'vsList') {
    originalBetData.map((item, index) => {
      list[index].list = item.list
    })
  }
  return list
}

export function generateRandomList({ list, len, repeat }) {
  // 从list个数字里面随机选出len个数字,repeat 代表随机出来的数字是否能够重复
  let generatedRandomList = []
  let filteredList = list
  for (let i = 0; i < len; i++) {
    let generatedItem = filteredList[_.random(0, filteredList.length - 1)]
    generatedRandomList.push(generatedItem)
    if (!repeat) {
      filteredList = list.filter(item => !generatedRandomList.includes(item))
    }
  }
  return generatedRandomList
}

export function arrayToChunk(array, chunkList) {
  // 把数组拆分成块
  // [1,2,3,4,5] [2,3]
  let result = []
  chunkList.forEach((item, index) => {
    if (index === 0) {
      result.push(array.slice(0, chunkList[0]))
    } else {
      let start = _.sum(chunkList.slice(0, index))
      let end = start + chunkList[index]
      result.push(array.slice(start, end))
    }
  })
  return result
}
