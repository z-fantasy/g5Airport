import {WX_API_URL, API_URL, METHOD_POST, MALL_ID} from './config'
import {parseQuery} from '../common/utils'
import {KEY_APP_ID} from '../common/config'
import fetchData from '../common/fetch-data'
import {openidUtils} from '../common/wx-utils'
import store from '../store'
import storage from 'good-storage'

// 检查是否有领取微信会员卡
export function checkCardStatus() {
  const url = parseQuery(API_URL, {
    method: 'WechatSite.GetVIPCardID' // GetVIPCardID
  }, false)
  const queryParams = {
    // vipcode: '101046026',
    vipcode: store.getters.userInfo.code,
    provider: storage.session.get(KEY_APP_ID, 'wx93e5e0f9a200beff')
    // mallid: MALL_ID()
  }
  return fetchData(url, METHOD_POST, {
    data: queryParams,
    runtimeData: {
      EB_ACTION: 'WechatSite.GetVIPCardID'
    }
  })
}

// 获取领取微信卡所需信息
export function fetchWXCardInfo(carid) {
  const url = parseQuery(API_URL, {
    method: 'WechatSite.getWxCardJsApiTicket' // getWxCardJsApiTicket
  }, false)
  console.log(carid)
  return fetchData(url, METHOD_POST, {
    data: {carid},
    runtimeData: {
      EB_ACTION: 'WechatSite.getWxCardJsApiTicket'
    }
  })
}

// 激活会员卡
export function activeUserCard() {
  const url = parseQuery(API_URL, {
    method: 'WechatSite.JiHuoCradJuan' // JiHuoCradJuan
  })

  let queryParam = {j: {
    mallid: MALL_ID(),
    // vipcode: '101046026',
    vipcode: store.getters.userInfo.code,
    openid: openidUtils.get()
    // openid: 'o-EAywC-BErH_mpRahdh7bF8MIp4'
  }}
  console.log(queryParam)
  return fetchData(url, METHOD_POST, {
    data: queryParam,
    runtimeData: {
      EB_ACTION: 'WechatSite.JiHuoCradJuan'
    }
  })
}
