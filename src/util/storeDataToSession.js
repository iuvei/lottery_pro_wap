/*
*commit   store中的commit
*state    store中的state
*mutation mutation某个state的名称
*request  请求接口的名称
*params   接口的参数
*storeKey store里面的key值和session里面存的key值一致
*/
export default async function storeDataToSession({
  commit,
  state,
  params,
  storeKey,
  request,
  mutation
}) {
  let data = JSON.parse(sessionStorage.getItem(storeKey))
  if (data) {
    commit(mutation, data)
    return data
  } else {
    // store中无数据时需要重新请求
    let res = await request(params)
    // 存到sessionStorage中
    sessionStorage.setItem(storeKey, JSON.stringify(res))
    // 存到store中
    commit(mutation, res)
    return res
  }
}
