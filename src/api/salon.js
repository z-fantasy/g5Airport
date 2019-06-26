import {API_URL, METHOD_POST, MALL_ID} from './config'
import {parseQuery} from '../common/utils'
import fetchData from '../common/fetch-data'
import store from '../store'

// 获取活动列表
export function fetchSalonList() {
  const url = parseQuery(API_URL, {
    method: 'Wct_GetActivites',
    ext: 1
  }, false)
  const queryParams = [
      {
        key: '@VipCode',
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
      EB_ACTION: 'Wct_GetActivites'
    }
  })
}

// 获取活动详情
export function fetchSalonDetail(id) {
  const url = parseQuery(API_URL, {
    method: 'Wct_GetActivitesById',
    ext: 1
  }, false)
  const queryParams = [
    {
      key: '@VipCode',
      value: store.getters.userInfo.code
    },
    {
      key: '@activityId',
      value: id
    }
  ]
  return fetchData(url, METHOD_POST, {
    data: queryParams,
    runtimeData: {
      EB_ACTION: 'Wct_GetActivitesById',
      EB_TICKETID: id
    }
  })
}
// 活动预约提交表单
export function fetchBookActivity(info) {
  const url = parseQuery(API_URL, {
    ext: 1,
    method: 'Wct_ReservationNow'
  }, false)
  const commonInfo = {
    XF_VIPCODE: store.getters.userInfo.code,
    // XF_VIPCODE: '105000094',
    EB_ENROLL_REMIND: '1', // 提醒方式，已经不需要再选择，但是字段保留
    EB_ENROLL_ID: '1'
  }
  return fetchData(url, METHOD_POST, {
    data: {EB_WECHAT_ACTIVITY_ENROLL: Object.assign({}, commonInfo, info)},
    runtimeData: {
      EB_ACTION: 'Wct_ReservationNow'
    }
  })
}

// 我的预约，获取预约的活动
export function fetchMyActivity() {
  const url = parseQuery(API_URL, {
    ext: 1,
    method: 'Wct_GetActivitesVip'
  }, false)
  const data = {
    key: '@VipCode',
    value: store.getters.userInfo.code
  }
  return fetchData(url, METHOD_POST, {
    data: [data],
    runtimeData: {
      EB_ACTION: 'Wct_GetActivitesVip'
    }
  })
}

// 获取预约的活动
export function cancleActivity(actID) {
  const url = parseQuery(API_URL, {
    ext: 1,
    method: 'Wct_CalcalTake'
  }, false)
  const data = {
    key: '@enroll',
    value: actID
  }
  return fetchData(url, METHOD_POST, {
    data: [data],
    runtimeData: {
      EB_ACTION: 'Wct_CalcalTake'
    }
  })
}
