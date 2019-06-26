import {METHOD_POST, API_URL} from './config'
import {parseQuery} from '../common/utils'
import fetchData from '../common/fetch-data'
import {openidUtils} from '../common/wx-utils'

// 获取已签到的全部日期
export function fetchCheckedDate() {
  const url = parseQuery(API_URL, {
    method: 'WechatSite.GetSignInDate'
  }, false)
  return fetchData(url, METHOD_POST, {
    data: {openid: openidUtils.get()},
    runtimeData: {
      EB_ACTION: 'WechatSite.GetSignInDate'
    }
  })
}
// 获取签到加的积分
export function getSininBouns() {
  const url = parseQuery(API_URL, {
    method: 'GetSignBounsNow',
    ext: 1
  }, false)
  return fetchData(url, METHOD_POST, {
    data: [{
      key: '@openid',
      value: openidUtils.get()
    }],
    runtimeData: {
      EB_ACTION: 'GetSignBounsNow'
    }
  })
}
// 点击签到
export function checkToday() {
  const url = parseQuery(API_URL, {
    method: 'WechatSite.SignIn'
  }, false)
  return fetchData(url, METHOD_POST, {
    data: {openid: openidUtils.get()},
    runtimeData: {
      EB_ACTION: 'WechatSite.SignIn'
    }
  })
}
