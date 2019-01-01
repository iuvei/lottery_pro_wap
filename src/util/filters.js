import _ from 'lodash'
import { dateFormat } from 'vux'
// 下注内容
export function betOrderContent({ type, content }) {
  let navTitle = type.split('-')[0]
  let subNavTitle = type.split('-')[1]
  let checkedStr = ''
  let result = ''
  result = content
    .split(';')
    .filter(item => item !== '')
    .join('|')
  if (
    navTitle.indexOf('任选') !== -1 &&
    navTitle !== '任选复式' &&
    navTitle !== '任选胆拖' &&
    navTitle !== '任选单式' &&
    subNavTitle !== '直选复式' &&
    this.$store.state.game.currentGameInfo.type !== 'kl8'
  ) {
    result = content
      .split(';')
      .filter(item => item !== '')
      .join(' | ')
    if (
      subNavTitle === '组选4' ||
      subNavTitle === '组选6' ||
      subNavTitle === '组选12' ||
      subNavTitle === '组选24'
    ) {
      result = _.filter(content.split(';'), (item, index) => index > 0).map(
        item => {
          item = item.split(',').join(' | ')
          return item
        }
      )
    } else {
      result = _.filter(content.split(';'), (item, index) => index > 0).join(
        ' ; '
      )
    }
  } else if (
    subNavTitle === '直选单式' ||
    subNavTitle === '混合组选' ||
    subNavTitle === '组三单式' ||
    subNavTitle === '组六单式' ||
    subNavTitle === '组选单式'
  ) {
    result = content.split(';').map(item => item.split(',').join(''))
  }

  if (
    subNavTitle === '直选和值' ||
    subNavTitle === '组选和值' ||
    subNavTitle === '直选跨度' ||
    navTitle === '不定位' ||
    subNavTitle === '和值尾数' ||
    subNavTitle === '组选包胆' ||
    subNavTitle === '组三复式' ||
    subNavTitle === '组六复式' ||
    subNavTitle === '后三组合'
  ) {
    result = content
  }
  if (navTitle === '龙虎') {
    result = content
      .replace(/0/g, '万位')
      .replace(/1/g, '千位')
      .replace(/2/g, '百位')
      .replace(/3/g, '十位')
      .replace(/4/g, '个位')
  }
  return content
    .split(';')
    .filter(item => item !== '')
    .join(' | ')
}

export function formatTime(timeStamp, format) {
  if (timeStamp) {
    return dateFormat(new Date(timeStamp), format || 'YYYY-MM-DD HH:mm:ss')
  } else {
    return dateFormat(format || 'YYYY-MM-DD HH:mm:ss')
  }
}

// 多维数组递归，通过判断每一个item的is_menu字段，来处理数据
// 当is_menu为0的时候，该字段的children为空，给改item多家一个betData的字段

export function tranformMenuData(array, position, parent) {
  if (position === 1) {
    array = array.map((item, index) => {
      if (item.is_menu === '0') {
        parent.betData ? parent.betData.push(item) : (parent.betData = [item])
        parent.children = []
      }
      if (item.is_menu === '1' && item.children.length) {
        tranformMenuData(item.children, position, item)
      }
      item.name = item.name.replace('-', '至')
      return item
    })
  }
  return array
}

export function setBgColor(type, number) {
  let bgClass = ''
  if (type === 'six') {
    if (
      [
        '1',
        '2',
        '7',
        '8',
        '12',
        '13',
        '18',
        '19',
        '23',
        '24',
        '29',
        '30',
        '34',
        '35',
        '40',
        '45',
        '46'
      ].includes(number)
    ) {
      bgClass = 'redNum'
    }
    if (
      [
        '3',
        '4',
        '9',
        '10',
        '14',
        '15',
        '20',
        '25',
        '26',
        '31',
        '36',
        '37',
        '41',
        '42',
        '47',
        '48'
      ].includes(number)
    ) {
      bgClass = 'blueNum'
    }
    if (
      [
        '5',
        '6',
        '11',
        '16',
        '17',
        '21',
        '22',
        '27',
        '28',
        '32',
        '33',
        '38',
        '39',
        '43',
        '44',
        '49'
      ].includes(number)
    ) {
      bgClass = 'greenNum'
    }
  }
  return bgClass
}
