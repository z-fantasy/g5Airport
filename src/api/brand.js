import {API_URL, METHOD_POST, MALL_ID} from './config'
import {parseQuery} from '../common/utils'
import fetchData from '../common/fetch-data'

// 获取品牌列表
export function fetchBrandList() {
  const url = parseQuery(API_URL, {
    method: 'Wct_GetBrandAaioList',
    ext: 1
  }, false)
  const queryParams = [{key: '@Mallid', value: MALL_ID()}]
  return fetchData(url, METHOD_POST, {
    data: queryParams,
    runtimeData: {
      EB_ACTION: 'Wct_GetBrandAaioList'
    }
  })
}

// 获取品牌详情
export function fetchBrandDetail(id) {
  const url = parseQuery(API_URL, {
    method: 'Wct_GetBrandAaioDetail',
    ext: 1
  }, false)
  const queryParams = [{key: '@Aid', value: id}]
  return fetchData(url, METHOD_POST, {
    data: queryParams,
    runtimeData: {
      EB_ACTION: 'Wct_GetBrandAaioDetail',
      EB_EXTEND_PARAM: id
    }
  })
}
