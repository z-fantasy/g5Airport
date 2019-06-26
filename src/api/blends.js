import {API_URL, METHOD_POST, MALL_ID} from './config'
import {parseQuery} from '../common/utils'
import fetchData from '../common/fetch-data'
import store from '../store'

// 获取活动荟萃类型
export function fetchBlendsType() {
  const url = parseQuery(API_URL, {
    method: 'Wct_GetMortificationType',
    ext: 1
  }, false)
  const queryParams = [
    {
      key: '@vipCode',
      value: store.getters.userInfo.code
    },
    {
      key: '@mallid',
      value: MALL_ID()
    }
  ]
  return fetchData(url, METHOD_POST, {
    data: queryParams,
    runtimeData: {
      EB_ACTION: 'Wct_GetMortificationType'
    }
  })
}

// 获取活动荟萃列表
export function fetchBlendsList(id) {
  const url = parseQuery(API_URL, {
    method: 'Wct_GetMortificationDetail',
    ext: 1
  }, false)
  const queryParams = [
    {
      key: '@vipCode',
      value: store.getters.userInfo.code
    },
    {
      key: '@Tid',
      value: id
    }
  ]
  return fetchData(url, METHOD_POST, {
    data: queryParams,
    runtimeData: {
      EB_ACTION: 'Wct_GetMortificationDetail'
    }
  })
}

// 更改活动荟萃状态为已读
export function changeBlendsStatus(item) {
  const url = parseQuery(API_URL, {
    method: 'Wct_MortificationVipSee',
    ext: 1
  }, false)
  const queryParams = {
    EB_WECHAT_MORTIFICATION_VIP: {
      EB_MORTIFICATION_ID: item.id,
      XF_VIPCODE: store.getters.userInfo.code,
      EB_MORTIFICATION_TYPEID: item.typeId
    }
  }
  return fetchData(url, METHOD_POST, {
    data: queryParams,
    runtimeData: {
      EB_ACTION: 'Wct_MortificationVipSee'
    }
  })
}
