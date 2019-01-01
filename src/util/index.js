
// 将一维数组转化为含有层级关系得多维数组
// nodes一维数组，id每一个item的id，parentId每一个item对应的parentId
export function transformArrayToTree(nodes, id, parentId) {
  const map = {}
  const root = []
  // var nodes= nodes.concat([]);
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    const nodeId = node[id]
    map[nodeId] = i
  }
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    const nodeParent = node[parentId]
    const parentIndex = map[nodeParent]
    if (parentIndex !== 0 && !parentIndex) {
      root.push(node)
    } else {
      nodes[parentIndex].children = nodes[parentIndex].children || []
      nodes[parentIndex].children.push(node)
    }
  }
  return root
}

/* 时间转换 */
export function transformSecondsToTime(second) {
  let hours = Math.floor(second / 3600)
  let mins = Math.floor((second / 60) % 60)
  let secs = Math.floor(second % 60)
  hours = hours < 10 ? `0${hours}` : hours
  mins = mins < 10 ? `0${mins}` : mins
  secs = secs < 10 ? `0${secs}` : secs
  return second <= 0 ? '00:00:00' : `${hours}:${mins}:${secs}`
}

/* 判断数组的值是否相等 */
export function isAllEqual(array) {
  if (array.length > 0) {
    return !array.some(function(value, index) {
      return value !== array[0]
    })
  } else {
    return true
  }
}

/* 等分切割字符串 */
// 切割字符
export function sliceStrToArr(str, sliceLen) {
  let strLen = str.length
  let arr = []
  if (strLen > sliceLen) {
    let loopLen = Math.ceil(strLen / sliceLen)
    for (let index = 0; index < loopLen; index++) {
      arr.push(str.slice(sliceLen * index, sliceLen * (index + 1)))
    }
    return arr
  } else {
    return [str]
  }
}

// 组合数组
export function getComposeByArrays(arrays) {
  let arr = [''] // 开始时待组合数组为空
  for (
    let i = 0;
    i < arrays.length;
    i++ // 遍历二维数组 让当前数组与下一个数组继续组合
  ) {
    arr = two_compose(arr, arrays[i]) // 两个数组组合 并返回组合后的数组
  }
  return arr
}

function two_compose(
  arr1,
  arr2 // arr1为上次组合形成的数组 arr2 为二维数组里的下一个数组
) {
  let arr = []
  for (let i = 0; i < arr1.length; i++) {
    let v1 = arr1[i]

    for (let j = 0; j < arr2.length; j++) {
      let v2 = arr2[j]
      let value = v1 + ',' + v2 // 每一项进行组合
      arr.push(value)
    }
  }
  return arr.map(item => {
    item = _.compact(item.split(',')).join(',')
    return item
  })
}
