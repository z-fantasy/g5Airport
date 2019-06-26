import {API_URL, MALL_ID} from './config'
import {parseQuery} from '../common/utils'
import fetchData from '../common/fetch-data'
import store from '../store'
import {openidUtils} from '../common/wx-utils'

// 判断用户能否进行抽奖（注册后24小时内可以抽奖）
export function userCanLottery() {
  const url = parseQuery(API_URL, {
    method: 'WechatSite.GetDateByVipcode'
  }, false)
  const userInfo = store.getters.userInfo
  const data = {
    vipcode: userInfo.code,
    mallid: MALL_ID()
  }
  return fetchData(url, {
    data,
    runtimeData: {
      EB_ACTION: 'WechatSite.GetDateByVipcode'
    }
  })
}

// 获取所要进行游戏的基本信息
export function fetchEnabledGame() {
  const url = parseQuery(API_URL, {
    method: 'WechatSite_GetGameId',
    ext: 1
  })
  const data = [{
    key: '@type',
    value: 1
  }]
  return fetchData(url, {
    data,
    runtimeData: {
      EB_ACTION: 'WechatSite_GetGameId'
    }
  })
}

// 获取游戏奖项列表
export function fetchGameInfo(gameId) {
  const url = parseQuery(API_URL, {
    method: 'WechatSite.VIPGame_Query'
  })
  const openid = openidUtils.get()
  const queryParams = {
    openid,
    gameid: gameId
  }
  return fetchData(url, {
    data: queryParams,
    runtimeData: {
      EB_ACTION: 'WechatSite.VIPGame_Query'
    }
  })
}

// 获取当前用户可抽奖的次数
export function fetchValidLotteryCount(gameId) {
  const url = parseQuery(API_URL, {
    method: 'WechatSite.GetGamePlayCount'
  })
  const openid = openidUtils.get()
  const queryParams = {
    openid,
    gameid: gameId
  }
  return fetchData(url, {
    data: queryParams,
    runtimeData: {
      EB_ACTION: 'WechatSite.GetGamePlayCount'
    }
  })
}

// 点击开始游戏
export function playGame(gameId) {
  const url = parseQuery(API_URL, {
    method: 'WechatSite.VIPGame_Play'
  })
  const openid = openidUtils.get()
  const queryParams = {
    openid,
    gameid: gameId
  }
  return fetchData(url, {
    data: queryParams,
    runtimeData: {
      EB_ACTION: 'WechatSite.VIPGame_Play'
    }
  })
}

// 大转盘背景图片
export function getGameBgImg(gameid) {
  const url = parseQuery(API_URL, {
    method: 'WechatSite_GameBackImage',
    ext: 1
  })
  const data = [{
    key: '@gameid',
    value: gameid
  }]
  return fetchData(url, {
    data: data,
    runtimeData: {
      EB_ACTION: 'WechatSite_GameBackImage'
    }
  })
}
