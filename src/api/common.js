import storage from 'good-storage'
import {API_URL, MALL_ID, OPERATOR_USER, QUERY_SCORE_RECORD_START_TIME, METHOD_POST} from './config'
import {parseQuery, formatDate} from '../common/utils'
import fetchData from '../common/fetch-data'
import store from '../store'
import {KEY_APP_ID} from '../common/config'
import {openidUtils} from '../common/wx-utils'

// 注册
export function fetchRegister(info) {
  const url = parseQuery(API_URL, {
    method: 'VipCreate_WebService' // WechatSite.WctRegisterVip
  }, false)
  return fetchData(url, {
    data: info,
    runtimeData: {
      EB_ACTION: 'VipCreate_WebService'
    }
  })
}

// 用户登录
export function fetchLogin(info) {
  const url = parseQuery(API_URL, {method: 'WechatSite.WctLogin'}, false)
  return fetchData(url, {
    data: info,
    runtimeData: {
      EB_ACTION: 'WechatSite.WctLogin'
    }
  })
}

// 根据用户手机号获取验证码
export function fetchPhoneVCode(phone, pageName = 'Login') {
  const url = parseQuery(API_URL, {method: 'WechatSite.sendSMS'}, false)
  return fetchData(url, {
    data: {phone, VerifyingVip: pageName},
    runtimeData: {
      EB_ACTION: 'WechatSite.sendSMS'
    }
  })
}

// 绑定openid
export function bindOpenid(vipCode) {
  const url = parseQuery(API_URL, {
    ext: 1,
    method: 'Wct_BindOpenId'
  }, false)
  const openid = openidUtils.get()
  const appId = storage.session.get(KEY_APP_ID, 'wxd769cea7178b70e2')
  const data = {
    XF_VIPMEDIALIST: {
      XF_VIPCODE: vipCode,
      XF_TYPE: 'WX',
      XF_REMARK: '备注',
      XF_MEDIABUSINESSID: appId,
      EB_MEDIAID: openid
    }
  }
  return fetchData(url, {
    data,
    runtimeData: {
      EB_ACTION: 'Wct_BindOpenId'
    }
  })
}

// 解绑openid
export function unbindOpenid() {
  const url = parseQuery(API_URL, {
    ext: 1,
    method: 'Wct_DelOpenIdMedia'
  }, false)
  const openid = openidUtils.get()
  const userInfo = store.getters.userInfo
  const queryParams = {
    XF_TYPE: 'WX',
    XF_VIPCODE: userInfo.code,
    EB_MEDIAID: openid
  }
  return fetchData(url, {
    data: queryParams,
    runtimeData: {
      EB_ACTION: 'Wct_DelOpenIdMedia'
    }
  })
}

// 根据商场获取等级
export function fetchAllGrades() {
  const url = parseQuery(API_URL, {
    ext: 1,
    method: 'Wct_GetAllGrade'
  }, false)
  const queryParams = [{
    key: '@mallid',
    value: MALL_ID()
  }]
  return fetchData(url, {
    data: queryParams,
    runtimeData: {
      EB_ACTION: 'Wct_GetAllGrade'
    }
  })
}

// 获取邀请码文案
export function fetchInviteCodeDesc() {
  const url = parseQuery(API_URL, {
    method: 'Wct_InviteCode',
    ext: 1
  }, false)
  return fetchData(url, {
    runtimeData: {
      EB_ACTION: 'Wct_InviteCode'
    }
  })
}

// 获取资源地址
export function fetchSourceHost() {
  const url = parseQuery(API_URL, {
    method: 'Wct_ServerImageRoot',
    ext: 1
  }, false)
  const queryParams = [{key: '@str_key', value: 'ServerImageRoot'}]
  return fetchData(url, {
    data: queryParams,
    runtimeData: {
      EB_ACTION: 'Wct_ServerImageRoot'
    }
  })
}

// 獲取商城號
export function getMallNo() {
  const url = parseQuery(API_URL, {
    ext: 1,
    method: 'WechatSite_DefaultMall'
  }, false)
  return fetchData(url, {
    data: {},
    runtimeData: {
      EB_ACTION: 'WechatSite_DefaultMall'
    }
  })
}
export function getchUserBouns() {
  const url = parseQuery(API_URL, {
    ext: 1,
    method: 'WechatSite_GetBonusRecord'
  }, false)
  return fetchData(url, {
    data: [{key: '@openid', value: openidUtils.get()}, {key: '@count', value: 0}],
    runtimeData: {
      EB_ACTION: 'WechatSite_GetBonusRecord'
    }
  })
}
// 获取会员权益和绑定声明：
// typeid: 1 VIP权益维护 2 转正会员页面
export function getRightAndBind(typeid = 2) {
  const url = parseQuery(API_URL, {
    ext: 1,
    method: 'Wct_getRules'
  }, false)
  return fetchData(url, {
    data: [{key: '@typeid', value: typeid}],
    runtimeData: {
      EB_ACTION: 'Wct_getRules'
    }
  })
}
/**
 * 获取用户积分流水
 * @param action
 * @param currentPage
 * @param pageSize
 */
export function fetchUserScoreRecords({action = 0, page = 1, pageSize = 15}) {
  let actionList = ['A', 'E', 'G', 'R', 'O', 'T', 'S', 'H', 'C', 'L', 'W', 'M', 'J', 'F', 'I', 'P', 'B', 'N', 'K', 'Q', 'V', 'X', 'Y', '0', '1', '2', '3']
  let heJingAdd = ['00065', '00066', '00068', '00060', 'AC00001', 'AC00002']
  let resultActionList = actionList.concat(heJingAdd)
  // 等于1为兑换记录,0为获取记录
  if (action === 1) {
    resultActionList = ['J', 'F', 'G']
  }
  const url = parseQuery(API_URL, {
    method: 'SelectBonusLedger_WebService'
  })
  const currentDateTime = formatDate(new Date(), 'yyyyMMdd')
  const user = store.getters.userInfo
  const queryParams = {
    VipCode: user.code,
    user: OPERATOR_USER,
    MallId: user.mallId,
    CircleId: user.circleId,
    StartTxDate: QUERY_SCORE_RECORD_START_TIME,
    EndTxDate: currentDateTime,
    // A:积分调整 E:积分补入 G:兑换礼品 R:积分清零 O:开卡 T:退货 S:销售 H:参加活动 C:礼品退货
    // L:储物柜 W:完善会员资料 M:积分购买 J:获取电子券抵扣积分 F:积分兑换电子券 I:批量送积分
    // P:绑定服务号 B:满赠 N:积分抵现 K:游戏 Q:会员签到 V:推荐会员
    // 0:邀请人获得被邀请人的首单消费赠送的积分 1:被邀请人获得首单消费赠送的积分 2:升级赠送积
    // 00065:卡维护，00066积分补录有误，00068异常，00060停车场积分， AC00001：微信积分，AC00002：客服积分
    Action: resultActionList,
    PageNo: page,
    PageSize: pageSize
  }
  return fetchData(url, METHOD_POST, {
    data: queryParams,
    runtimeData: {
      EB_ACTION: 'SelectBonusLedger_WebService'
    }
  })
}

// 检测是否可以关注了此公众号
export function checkSubscribed() {
  const url = parseQuery(API_URL, {
    method: 'Wechat.IsFans'
  }, false)
  const openid = openidUtils.get()
  return fetchData(url, {
    data: {openid},
    runtimeData: {
      EB_ACTION: 'Wechat.IsFans'
    }
  })
}

// 获取所有地址
export function fetchAllAddress() {
  const url = parseQuery(API_URL, {
    method: 'Wct_ProvincialArea',
    ext: 1
  }, false)
  return fetchData(url, {
    runtimeData: {
      EB_ACTION: 'Wct_ProvincialArea'
    }
  })
}
