// 组合算法
import { algorithmCombination } from '../util/lotteryAlgorithmUtil'
import setGameSixColor from '../util/game/setGameSixColor'
// 生成最小数到最大数之间的数字
export function generateNumber({ min, max, addZero }) {
  let list = []
  for (var i = min; i <= max; i++) {
    if (addZero && i <= 9) {
      list.push(`0${i}`)
    } else {
      list.push(`${i}`)
    }
  }
  return list
}

// 生成左侧标题
function generateLeftTitle({ lotteryType, num, navTitle, subNavTitle }) {
  let allTitleList = []
  if (lotteryType === 'ssc') {
    allTitleList = ['万位', '千位', '百位', '十位', '个位']
  }
  if (lotteryType === 'pk10') {
    allTitleList = [
      '冠军',
      '亚军',
      '季军',
      '第四名',
      '第五名',
      '第六名',
      '第七名',
      '第八名',
      '第九名',
      '第十名'
    ]
  }
  if (lotteryType === 'syxw') {
    allTitleList = ['第一位', '第二位', '第三位', '第四位', '第五位']
  }
  if (lotteryType === 'three') {
    allTitleList = ['百位', '十位', '个位']
  }
  let slice = {
    start: 0,
    end: num
  }
  let filteredTitleList = []
  if (navTitle === '四星') {
    slice = {
      start: 1,
      end: num
    }
  }
  if (navTitle === '三星') {
    slice = {
      start: 0,
      end: num
    }
  }

  if (navTitle === '前三' || subNavTitle === '前三大小单双') {
    slice = {
      start: 0,
      end: 3
    }
  }
  if (navTitle === '后三' || subNavTitle === '后三大小单双') {
    slice = {
      start: num - 3,
      end: num
    }
  }
  if (navTitle === '中三') {
    slice = {
      start: 1,
      end: 4
    }
  }
  if (
    navTitle === '前二' ||
    subNavTitle === '前二大小单双' ||
    subNavTitle === '冠亚' ||
    subNavTitle === '冠亚军' ||
    (subNavTitle && subNavTitle.search('前二') !== -1)
  ) {
    slice = {
      start: 0,
      end: 2
    }
  }

  if (
    navTitle === '后二' ||
    (subNavTitle && subNavTitle.search('后二') !== -1)
  ) {
    slice = {
      start: num - 2,
      end: num
    }
  }

  if (navTitle === '前一') {
    slice = {
      start: 0,
      end: 1
    }
  }

  if (navTitle === '六至十名') {
    slice = {
      start: 5,
      end: 10
    }
  }
  if (navTitle === '一至五名') {
    slice = {
      start: 0,
      end: 5
    }
  }

  filteredTitleList = allTitleList.slice(slice.start, slice.end)
  if (lotteryType === 'pk10') {
    if (
      [
        '冠亚季',
        '冠亚季军',
        '冠亚',
        '冠亚军',
        '冠军',
        '亚军',
        '季军',
        '第四名',
        '第五名',
        '第六名',
        '第七名',
        '第八名',
        '第九名',
        '第十名'
      ].indexOf(subNavTitle) !== -1
    ) {
      filteredTitleList = [subNavTitle]
    }
  }

  // 任选四
  if (navTitle === '任选四') {
    if (subNavTitle === '组选4') {
      filteredTitleList = ['三重号', '单号']
    }
    if (subNavTitle === '组选6') {
      filteredTitleList = ['二重号']
    }
    if (subNavTitle === '组选12') {
      filteredTitleList = ['二重号', '单号']
    }
    if (subNavTitle === '组选24') {
      filteredTitleList = ['组选24']
    }
  }

  // 任选胆拖(广东11选5任选胆拖，重庆幸运农场任选胆拖)
  if (
    (navTitle && navTitle.search('胆拖') !== -1) ||
    (subNavTitle && subNavTitle.search('胆拖') !== -1)
  ) {
    filteredTitleList = []
  }

  if (navTitle === '定位胆') {
    filteredTitleList = allTitleList
  }

  // 幸运农场选三-前直玩法
  if (navTitle === '选三' && subNavTitle === '前直') {
    filteredTitleList = ['第一位', '第二位', '第三位']
  }

  // 幸运农场选二-连直玩法

  if (navTitle === '选二' && subNavTitle === '连直') {
    filteredTitleList = ['前位', '后位']
  }

  // 组选复式,和值尾数,直选跨度,组选包胆.组三复式,组六复式,不定位等等只有一个左侧标题的
  if (
    (subNavTitle && subNavTitle.search('组选复式') !== -1) ||
    subNavTitle === '和值尾数' ||
    subNavTitle === '直选跨度' ||
    subNavTitle === '组选包胆' ||
    subNavTitle === '组三复式' ||
    subNavTitle === '组六复式' ||
    navTitle === '不定位' ||
    navTitle === '任选复式' ||
    (lotteryType === 'xync' &&
      (subNavTitle === '任选' || subNavTitle === '任选二')) ||
    subNavTitle === '连组' ||
    subNavTitle === '前组' ||
    subNavTitle === '数投' ||
    (navTitle === '三不同号' && subNavTitle === '标准') ||
    (navTitle === '二不同号' && subNavTitle === '标准')
  ) {
    let title =
      subNavTitle === '组选复式'
        ? '组选'
        : subNavTitle === '直选跨度'
        ? '跨度'
        : subNavTitle === '组选包胆'
        ? '包胆'
        : subNavTitle === '组三复式'
        ? '组三'
        : subNavTitle === '组六复式'
        ? '组六'
        : subNavTitle
    filteredTitleList = [title]
  }

  // 两面盘玩法
  if (navTitle === '1至5球') {
    filteredTitleList = ['第一球', '第二球', '第三球', '第四球', '第五球']
  }

  if (navTitle === '龙虎斗') {
    let title = []
    if (lotteryType === 'ssc' || lotteryType === 'syxw') {
      title = ['第一球', '第二球', '第三球', '第四球', '第五球']
    }
    if (lotteryType === 'xync') {
      title = [
        '第一球',
        '第二球',
        '第三球',
        '第四球',
        '第五球',
        '第六球',
        '第七球',
        '第八球'
      ]
    }
    let combineList = algorithmCombination(title, 2)
    combineList = combineList.map(item => {
      item = item.join('vs')
      return item
    })
    filteredTitleList = combineList
    if (lotteryType === 'pk10') {
      filteredTitleList = [
        '第一名vs第十名',
        '第二名vs第九名',
        '第三名vs第八名',
        '第四名vs第七名',
        '第五名vs第六名'
      ]
    }
  }

  if (navTitle === '两面' && lotteryType === 'ssc') {
    filteredTitleList = [
      '总和',
      '第一球',
      '第二球',
      '第三球',
      '第四球',
      '第五球'
    ]
  }

  return filteredTitleList
}

// 生成和值数据
function generateSumList({ playType, min, max, repeat }) {
  let navTitle = playType.split('-')[0]
  let subNavTitle = playType.split('-')[1]
  let result = []
  let sumNumList = [
    {
      cn: '二',
      num: 2
    },
    {
      cn: '三',
      num: 3
    },
    {
      cn: '四',
      num: 4
    },
    {
      cn: '五',
      num: 5
    }
  ]
  sumNumList.forEach(item => {
    if (navTitle.indexOf(item.cn) !== -1) {
      if (subNavTitle === '直选和值' || subNavTitle === '组六和值') {
        // 判断开奖号码是否重复
        if (!repeat || subNavTitle === '组六和值') {
          // 号码不重复时
          let rangeObj = {
            min: [],
            max: []
          }
          for (var i = min; min === 1 ? i <= item.num : i < item.num; i++) {
            rangeObj.min.push(i)
          }
          for (var k = max; k > max - item.num; k--) {
            rangeObj.max.push(k)
          }
          result = generateNumber({
            min: rangeObj.min.reduce((n1, n2) => n1 + n2),
            max: rangeObj.max.reduce((n1, n2) => n1 + n2)
          })
        } else {
          result = generateNumber({
            min,
            max: item.num * max
          })
        }
      }
      if (subNavTitle === '组选和值') {
        result = generateNumber({
          min: min + 1,
          max: item.num * max - 1
        })
      }
    }
  })
  return result
}

// 生成下注列表
function generateBetList(list, playInfo) {
  return list.map(item => {
    return {
      name: item,
      odds_min: playInfo.odds_min,
      odds_max: playInfo.odds_max
    }
  })
}

export function generateBetTplData({
  playType,
  lotteryType,
  playInfo,
  odds_max,
  odds_min,
  lotteryGameInfo
}) {
  /*
   *result 最后返回的结果
   *addZero 下注号码不足10时是否添加0
   *num 彩种的位数
   *min 彩种的最小值
   *max 彩种的最大值
   *playType 彩种的玩法
   *lotteryType 彩种的类型
   */
  let betData = playInfo.betData || []
  let result = {
    playIntro: '',
    betData: []
  }

  // 根据彩种类型,找出对应的最小值,最大值和位数
  let { num, min, max, addZero, repeat } = lotteryGameInfo.find(
    item => item.type === lotteryType
  )
  // 一级玩法
  let navTitle = playType.split('-')[0]
  // 二级玩法
  let subNavTitle = playType.split('-')[1]

  // 菜单层级结构
  let levelClass

  if (betData.length) {
    if (!betData[0].children.length) {
      levelClass = 2
    } else {
      levelClass = 3
    }
  }

  // 生成下注列表的左侧标题
  let filteredTitleList = generateLeftTitle({
    lotteryType,
    num,
    navTitle,
    subNavTitle
  })

  // 两面盘 接口取值生成下注内容
  if (betData.length && navTitle !== '龙虎斗') {
    // 11选5两面玩法需要特别处理
    if (navTitle === '两面' && lotteryType === 'syxw') {
      let list = betData[0].children.map(item => {
        return {
          name: item.name,
          odds_max: item.odds_max,
          odds_min: item.odds_min,
          id: item.id
        }
      })
      result.betData.push({
        title: '总和',
        list,
        selectedList: []
      })
      filteredTitleList.map(item => {
        result.betData.push({
          title: item,
          list: ['大', '小', '单', '双'].map(item => {
            return {
              name: item,
              odds_max: betData[1].odds_max,
              odds_min: betData[1].odds_min
            }
          }),
          selectedList: []
        })
      })
    } else if (levelClass === 3) {
      filteredTitleList = _.map(betData, item => item.name)
      betData
        .map(item => item.children)
        .forEach((item, index) => {
          result.betData.push({
            title: filteredTitleList[index],
            list: _.map(item, item1 => {
              return {
                name: item1.name,
                odds_max: item1.odds_max,
                odds_min: item1.odds_min,
                id: item1.id
              }
            }),
            selectedList: []
          })
        })
    }
  }

  // 直选复式,定位胆,后三组合,任选四,组选复式,和值尾数,直选跨度,组选包胆.组三复式,组六复式,不定位
  if (
    (subNavTitle && subNavTitle.search('直选复式') !== -1) ||
    navTitle === '定位胆' ||
    (subNavTitle && subNavTitle.indexOf('组合') !== -1) ||
    navTitle === '任选四' ||
    (subNavTitle && subNavTitle.search('组选复式') !== -1) ||
    subNavTitle === '和值尾数' ||
    subNavTitle === '直选跨度' ||
    subNavTitle === '组三复式' ||
    subNavTitle === '组六复式' ||
    navTitle === '不定位' ||
    navTitle === '前一' ||
    navTitle === '任选复式' ||
    subNavTitle === '组选胆拖' ||
    (lotteryType === 'xync' &&
      (subNavTitle === '任选' || subNavTitle === '任选二')) ||
    subNavTitle === '连组' ||
    subNavTitle === '前组' ||
    (navTitle === '选三' && subNavTitle === '前直') ||
    (navTitle === '选二' && subNavTitle === '连直') ||
    (navTitle === '三不同号' && subNavTitle === '标准') ||
    (navTitle === '二不同号' && subNavTitle === '标准')
  ) {
    filteredTitleList.map(item => {
      result.betData.push({
        title: item,
        list: generateNumber({ min, max, addZero }).map(item => {
          return {
            name: item,
            odds_min: playInfo.odds_min,
            odds_max: playInfo.odds_max
          }
        }),
        selectedList: [],
        selectedBtnType: ''
      })
    })
  }

  // 组选包胆
  if (subNavTitle === '组选包胆') {
    filteredTitleList.map(item => {
      result.betData.push({
        title: item,
        list: generateNumber({ min, max, addZero }).map(item => {
          return {
            name: item,
            odds_min: playInfo.odds_min,
            odds_max: playInfo.odds_max
          }
        }),
        selectedList: []
      })
    })
  }

  // 龙虎斗
  if (navTitle === '龙虎斗') {
    let list = []
    if (lotteryType === 'ssc') {
      list = betData[0].odds_array
    } else {
      list = [
        {
          name: '龙',
          odds_max,
          odds_min
        },
        {
          name: '虎',
          odds_max,
          odds_min
        }
      ]
    }
    filteredTitleList.map(item => {
      result.betData.push({
        title: item,
        list: list,
        selectedList: []
      })
    })
  }

  if (
    (navTitle && navTitle.search('胆拖') !== -1) ||
    (subNavTitle && subNavTitle.search('胆拖') !== -1)
  ) {
    result.betData.push(
      {
        title: '胆码',
        list: generateNumber({ min, max, addZero }).map(item => {
          return {
            name: item,
            odds_min: playInfo.odds_min,
            odds_max: playInfo.odds_max
          }
        }),
        selectedList: []
      },
      {
        title: '拖码',
        list: generateNumber({ min, max, addZero }).map(item => {
          return {
            name: item,
            odds_min: playInfo.odds_min,
            odds_max: playInfo.odds_max
          }
        }),
        selectedList: [],
        selectedBtnType: ''
      }
    )
  }

  // 龙虎
  if (navTitle === '龙虎') {
    // 时时彩类型
    if (lotteryType === 'ssc') {
      let comparedList = []
      comparedList = ['万位', '千位', '百位', '十位', '个位']
      let len = algorithmCombination(comparedList, 2).length
      for (var i = 0; i < len; i++) {
        result.betData.push({
          list: algorithmCombination(comparedList, 2)[i],
          selectedList: []
        })
      }
      console.log(result.betData)
    }
    // pk10
    if (lotteryType === 'pk10') {
      filteredTitleList.forEach(item => {
        result.betData.push({
          title: item,
          list: generateBetList(['龙', '虎'], playInfo),
          selectedList: []
        })
      })
    }
  }

  // 和值
  if (
    (subNavTitle &&
      (subNavTitle.indexOf('直选和值') !== -1 ||
        subNavTitle.indexOf('组选和值') !== -1)) ||
    subNavTitle === '组六和值'
  ) {
    result.betData.push({
      title: '和值',
      list: generateSumList({ playType, min, max, repeat }).map(item => {
        return {
          name: item,
          odds_min: playInfo.odds_min,
          odds_max: playInfo.odds_max
        }
      }),
      selectedList: [],
      selectedBtnType: ''
    })
  }
  // 大小单双
  if (
    (subNavTitle && subNavTitle.indexOf('大小单双') !== -1) ||
    navTitle === '大小单双'
  ) {
    filteredTitleList.map(item => {
      result.betData.push({
        title: item,
        list: ['大', '小', '单', '双'].map(item => {
          return {
            name: item,
            odds_min: playInfo.odds_min,
            odds_max: playInfo.odds_max
          }
        }),
        selectedList: []
      })
    })
  }
  // 特殊号
  if (subNavTitle === '特殊号') {
    result.betData.push({
      title: '特殊号',
      list: ['豹子', '顺子', '对子'].map(item => {
        let betItem = playInfo.children.find(item1 => item === item1.name)
        return {
          id: betItem.id,
          name: item,
          odds_min: betItem.odds_min,
          odds_max: betItem.odds_max
        }
      }),
      selectedList: []
    })
  }
  // 重庆幸运农场红投
  if (lotteryType === 'xync' && subNavTitle === '红投') {
    result.betData.push({
      title: '红投',
      list: [19, 20].map(item => {
        return {
          name: item,
          odds_min: playInfo.odds_min,
          odds_max: playInfo.odds_max
        }
      }),
      selectedList: []
    })
  }
  // 重庆幸运农场数投
  if (lotteryType === 'xync' && subNavTitle === '数投') {
    result.betData.push({
      title: '数投',
      list: generateNumber({ min: 1, max: 18, addZero: true }).map(item => {
        return {
          name: item,
          odds_min: playInfo.odds_min,
          odds_max: playInfo.odds_max
        }
      }),
      selectedList: [],
      selectedBtnType: ''
    })
  }
  // 重庆幸运农场两面>任选
  if (lotteryType === 'xync' && navTitle === '任选') {
    console.log(playInfo)
    result.betData.push({
      id: playInfo.id,
      title: playInfo.name,
      list: generateNumber({ min: 1, max: 20, addZero: true }).map(number => {
        return {
          name: number,
          odds_min: playInfo.odds_min,
          odds_max: playInfo.odds_max
        }
      }),
      width: 'one-fifth',
      selectedList: []
    })
  }

  if (lotteryType === 'k3') {
    // 快三-三连号
    if (navTitle === '三连号') {
      result.betData.push({
        title: '号码',
        list: [
          {
            name: '三连号通选',
            odds_min: playInfo.odds_min,
            odds_max: playInfo.odds_max
          }
        ],
        selectedList: []
      })
    }

    // 快三-三同号
    if (navTitle === '三同号') {
      if (subNavTitle === '通选') {
        result.betData.push({
          title: '号码',
          list: [
            {
              name: '三同号通选',
              odds_min: playInfo.odds_min,
              odds_max: playInfo.odds_max
            }
          ],
          selectedList: []
        })
      }
      if (subNavTitle === '单选') {
        result.betData.push({
          title: '号码',
          list: generateBetList(
            ['111', '222', '333', '444', '555', '666'],
            playInfo
          ),
          selectedList: []
        })
      }
    }

    if (navTitle === '二同号') {
      // 快三-二同号
      if (subNavTitle === '复选') {
        result.betData.push({
          title: '号码',
          list: generateBetList(['11', '22', '33', '44', '55', '66'], playInfo),
          selectedList: []
        })
      }
      if (subNavTitle === '单选') {
        result.betData.push(
          {
            title: '同号',
            list: generateBetList(
              ['11', '22', '33', '44', '55', '66'],
              playInfo
            ),
            selectedList: []
          },
          {
            title: '不同号',
            list: generateBetList(['1', '2', '3', '4', '5', '6'], playInfo),
            selectedList: []
          }
        )
      }
    }
    if (navTitle === '和值' && subNavTitle !== '大小单双') {
      result.betData = [
        {
          title: '和值',
          list: generateBetList(generateNumber({ min: 3, max: 18 }), playInfo),
          selectedList: [],
          selectedBtnType: ''
        }
      ]
    }
    if (
      navTitle === '大小单双' ||
      (lotteryType === 'k3' && subNavTitle === '大小单双')
    ) {
      result.betData.push({
        title: '大小单双',
        list: ['大', '小', '单', '双'].map(item => {
          return {
            name: item,
            odds_min: playInfo.odds_min,
            odds_max: playInfo.odds_max
          }
        }),
        selectedList: []
      })
    }
  }
  // 3d组三和值
  if (lotteryType === 'three') {
    if (subNavTitle === '组三和值') {
      result.betData.push({
        title: '和值',
        list: generateBetList(generateNumber({ min: 1, max: 26 }), playInfo),
        selectedList: [],
        selectedBtnType: ''
      })
    }
  }
  // 北京快乐8
  if (lotteryType === 'kl8') {
    //
    if (navTitle === '任选') {
      result.betData.push(
        {
          title: '上',
          list: generateBetList(
            generateNumber({ min: 1, max: 40, addZero }),
            playInfo
          ),
          selectedList: [],
          selectedBtnType: ''
        },
        {
          title: '下',
          list: generateBetList(
            generateNumber({ min: 41, max: 80, addZero }),
            playInfo
          ),
          selectedList: [],
          selectedBtnType: ''
        }
      )
    }
    if (navTitle === '两面') {
      result.betData = result.betData.map(item => {
        if (item.title === '和值') {
          item.width = 'one-fourth'
        }
        return item
      })
    }
  }
  // 两面玩法数据
  if (
    navTitle === '1至5球' ||
    (navTitle === '两面' &&
      (lotteryType === 'ssc' || lotteryType === 'pk10')) ||
    navTitle === '全5中1' ||
    navTitle === '六至十名' ||
    navTitle === '一至五名'
  ) {
    let list = []
    if (navTitle === '两面') {
      list = ['大', '小', '单', '双'].map(item => {
        return {
          name: item,
          odds_max,
          odds_min
        }
      })
    }
    if (
      navTitle === '1至5球' ||
      navTitle === '全5中1' ||
      navTitle === '一至五名' ||
      navTitle === '六至十名'
    ) {
      list = _.map(generateNumber({ min, max, addZero }), item1 => {
        return {
          name: item1,
          odds_max,
          odds_min
        }
      })
    }
    filteredTitleList.map(item => {
      result.betData.push({
        title: item,
        list,
        selectedList: []
      })
    })
  }
  if (lotteryType === 'xync') {
    if (
      [
        '第一球',
        '第二球',
        '第三球',
        '第四球',
        '第五球',
        '第六球',
        '第七球',
        '第八球'
      ].includes(navTitle)
    ) {
      result.betData = []
      let numberList = generateNumber({ min, max, addZero }).map(item => {
        return {
          name: item,
          odds_min: betData.find(item => item.name === '单码').odds_min,
          odds_max: betData.find(item => item.name === '单码').odds_max
        }
      })

      let liangmianList = [
        '大',
        '小',
        '单',
        '双',
        '合单',
        '合双',
        '尾大',
        '尾小'
      ].map(item => {
        return {
          name: item,
          odds_min: betData.find(item => item.name === '两面').odds_min,
          odds_max: betData.find(item => item.name === '两面').odds_max
        }
      })
      let positionList = ['东', '南', '西', '北'].map(item => {
        return {
          name: item,
          odds_min: betData.find(item => item.name === '方位').odds_min,
          odds_max: betData.find(item => item.name === '方位').odds_max
        }
      })

      let zhongfabaiList = betData
        .find(item => item.name === '中发白')
        .children.map(item => {
          return {
            id: item.id,
            name: item.name,
            odds_min: item.odds_min,
            odds_max: item.odds_max
          }
        })
      result.betData.push(
        {
          title: '单码',
          list: numberList,
          selectedList: [],
          id: betData.find(item => item.name === '单码').id
        },
        {
          title: '两面',
          list: liangmianList,
          selectedList: [],
          id: betData.find(item => item.name === '两面').id
        },
        {
          title: '方位',
          list: positionList,
          selectedList: [],
          id: betData.find(item => item.name === '方位').id
        },
        {
          title: '中发白',
          list: zhongfabaiList,
          selectedList: [],
          id: betData.find(item => item.name === '中发白').id
        }
      )
    }
  }
  if (lotteryType === 'k3') {
    if (navTitle === '三军/大小') {
      result.betData = [
        {
          title: '三军',
          list: generateNumber({ min: 1, max: 6 }).map(item => {
            return {
              name: item,
              odds_min: betData[0].odds_min,
              odds_max: betData[0].odds_max
            }
          }),
          selectedList: [],
          type: 'dice'
        },
        {
          title: '总和',
          list: ['大', '小', '单', '双'].map(item => {
            return {
              name: item,
              odds_min: betData[1].odds_min,
              odds_max: betData[1].odds_max
            }
          }),
          selectedList: []
        }
      ]
    }
    if (navTitle === '点数') {
      result.betData = [
        {
          title: '点数',
          list: betData.map(item => {
            return {
              name: item.name,
              id: item.id,
              odds_min: item.odds_min,
              odds_max: item.odds_max
            }
          }),
          selectedList: [],
          width: 'one-fifth'
        }
      ]
    }
    if (navTitle === '长牌/短牌') {
      result.betData = [
        {
          title: '长牌',
          list: algorithmCombination([1, 2, 3, 4, 5, 6], 2).map(item => {
            return {
              name: item.join(','),
              odds_min: betData[0].odds_min,
              odds_max: betData[0].odds_max
            }
          }),
          selectedList: [],
          type: 'dice'
        },
        {
          title: '短牌',
          list: generateNumber({ min: 1, max: 6 }).map(item => {
            return {
              name: item,
              odds_min: betData[1].odds_min,
              odds_max: betData[1].odds_max
            }
          }),
          selectedList: [],
          type: 'dice'
        }
      ]
    }
    if (navTitle === '围骰/全骰') {
      result.betData = [
        {
          title: '围骰',
          list: generateNumber({ min: 1, max: 6 }).map(item => {
            return {
              name: item,
              odds_min: betData[0].odds_min,
              odds_max: betData[0].odds_max
            }
          }),
          selectedList: [],
          type: 'dice'
        },
        {
          title: '全骰',
          list: [
            {
              odds_min: betData[1].odds_min,
              odds_max: betData[1].odds_max
            }
          ],
          selectedList: [],
          type: 'dice'
        }
      ]
    }
  }
  if (lotteryType === 'three') {
    if (
      navTitle.search('定位') !== -1 &&
      navTitle !== '不定位' &&
      navTitle !== '定位胆'
    ) {
      ;['百位', '十位', '个位'].map(item => {
        result.betData.push({
          title: item,
          list: generateNumber({ min, max }).map(item => {
            return {
              name: item,
              odds_min,
              odds_max
            }
          }),
          selectedList: []
        })
      })
    }
    if (navTitle === '二字组合' || navTitle === '三字组合') {
      let filteredTitleList = ['选码1', '选码2', '选码3']
      let sliceLen
      if (navTitle === '二字组合') {
        sliceLen = 2
      }
      if (navTitle === '三字组合') {
        sliceLen = 3
      }
      filteredTitleList.slice(0, sliceLen).map(item => {
        result.betData.push({
          title: item,
          list: generateNumber({ min, max }).map(item => {
            return {
              name: item,
              odds_min,
              odds_max
            }
          }),
          selectedList: []
        })
      })
    }
    if (navTitle === '一字组合') {
      // 一字组合
      result.betData.push({
        title: '一字组合',
        list: generateNumber({ min, max, addZero }).map(item => {
          return {
            name: item,
            odds_min,
            odds_max
          }
        }),
        selectedList: []
      })
    }
    if (navTitle === '跨度') {
      result.betData.push({
        title: '跨度',
        list: playInfo.odds_array.map(item => {
          return {
            name: item.name,
            odds_min: item.odds_min,
            odds_max: item.odds_max
          }
        }),
        selectedList: []
      })
    }
    if (navTitle === '两面') {
      ;['第一球', '第二球', '第三球'].map(item => {
        result.betData.push({
          title: item,
          list: ['大', '小', '单', '双', '质', '合'].map(item1 => {
            return {
              name: item1,
              odds_min,
              odds_max
            }
          }),
          selectedList: []
        })
      })
    }
    if (navTitle === '三字和数' || navTitle === '二字和数') {
      result.betData = []
      // 和值数据
      result.betData.push({
        title: '和值',
        list: playInfo.betData.find(item => item.name === '和值').odds_array,
        selectedList: []
      })
      // 尾数数据
      result.betData.push({
        title: '尾数',
        list: generateNumber({ min: 0, max: 9 }).map(item => {
          return {
            name: item,
            odds_min: playInfo.betData.find(item1 => item1.name === '尾数')
              .odds_min,
            odds_max: playInfo.betData.find(item1 => item1.name === '尾数')
              .odds_max
          }
        }),
        selectedList: []
      })
      if (navTitle === '二字和数') {
        ;['和值单双', '尾数双面'].map(playTitle => {
          let list =
            playTitle === '和值单双' ? ['单', '双'] : ['大', '小', '质', '合']
          result.betData.push({
            title: playTitle,
            list: list.map(item => {
              return {
                name: item,
                odds_min: playInfo.betData.find(
                  item1 => item1.name === playTitle
                ).odds_min,
                odds_max: playInfo.betData.find(
                  item1 => item1.name === playTitle
                ).odds_max
              }
            }),
            selectedList: []
          })
        })
      }
      if (navTitle === '三字和数') {
        ;['大小单双', '尾数双面'].map(playTitle => {
          let list =
            playTitle === '大小单双'
              ? ['大', '小', '单', '双']
              : ['大', '小', '质', '合']
          result.betData.push({
            title: playTitle,
            list: list.map(item => {
              return {
                name: item,
                odds_min: playInfo.betData.find(
                  item1 => item1.name === playTitle
                ).odds_min,
                odds_max: playInfo.betData.find(
                  item1 => item1.name === playTitle
                ).odds_max
              }
            }),
            selectedList: []
          })
        })
      }
    }
  }
  // 六合彩
  if (lotteryType === 'six') {
    let arr = []
    playInfo.odds_array.map(item => {
      if (item.name === '1-49') {
        arr.push(
          ...generateNumber({ min: 1, max: 49 }).map(item1 => {
            return {
              name: item1,
              odds_min: item.odds,
              odds_max: item.odds
            }
          })
        )
      } else {
        arr.push({
          name: item.name,
          odds_min: item.odds,
          odds_max: item.odds
        })
      }
    })
    result.betData.push({
      title: playInfo.name,
      list: arr,
      selectedList: [],
      width: 'one-fifth'
    })
    if (navTitle === '连码' || navTitle === '全不中') {
      result.betData = []
      result.betData.push({
        title: playInfo.odds_array[0].name,
        name,
        list: generateNumber({ min: 1, max: 49 }).map(item => {
          return {
            name: item,
            odds_min: playInfo.odds_array[0].odds,
            odds_max: playInfo.odds_array[0].odds,
            color: setGameSixColor(item)
          }
        }),
        selectedList: [],
        width: 'one-fifth'
      })
    }
    if (navTitle === '连肖' || navTitle === '合肖' || navTitle === '特肖') {
      result.betData.map(item => {
        item.width = 'one-fourth'
      })
    }
  }
  if (lotteryType === 'lucky28') {
    result.betData.push({
      title: playInfo.name,
      list: playInfo.odds_array,
      selectedList: []
    })
  }
  generateEmptyCell(result.betData)
  return result
}

function generateEmptyCell(betData) {
  return betData.map(item => {
    let itemLen
    switch (item.width) {
      case 'one-fifth':
        itemLen = 5
        break
      case 'one-fourth':
        itemLen = 4
        break
    }
    if (item.width && item.list.length % itemLen) {
      let pushLen = itemLen - (item.list.length % itemLen)
      for (var i = 0; i < pushLen; i++) {
        item.list.push({
          ...item.list[0],
          empty: true
        })
      }
    }
    return item
  })
}
