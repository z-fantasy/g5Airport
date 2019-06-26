import {API_URL, MALL_ID, OPERATOR_USER} from './config'
import {parseQuery} from '../common/utils'
import fetchData from '../common/fetch-data'
import store from '../store'
import {openidUtils} from '../common/wx-utils'

// 根据openid判断是否会员
export function isVipByOpenid() {
  // IsVipByOpenid
  const url = parseQuery(API_URL, {
    method: 'IsVipByOpenid',
    ext: 1
  }, false)
  return fetchData(url, {
    data: [{key: '@openid', value: openidUtils.get()}],
    runtimeData: {
      EB_ACTION: 'IsVipByOpenid'
    }
  })
}
// 获取用户信息
export function fetchUserInfo(code) {
  const url = parseQuery(API_URL, {
    method: 'GetVipDis'
  }, false)
  const userInfo = store.getters.userInfo
  const queryParams = {
    MallId: MALL_ID(),
    CardNo: '', // userInfo.cardNo || '',
    VipCode: code || userInfo.code,
    SurName: userInfo.name || userInfo.SurName || '',
    Mobile: '',
    VipId: '',
    IsThisCircle: true,
    openid: openidUtils.get()
  }
  return fetchData(url, {
    data: queryParams,
    runtimeData: {
      EB_ACTION: 'GetVipDis'
    }
  })
}

// 根据手机号码获取会员信息
export function fetchUserInfoByPhone(phone) {
  const url = parseQuery(API_URL, {
    method: 'GetVipBaseInfoByMobile'
  }, false)
  const queryParams = {
    Mobile: phone,
    Mallid: MALL_ID()
  }
  return fetchData(url, {
    data: queryParams,
    runtimeData: {
      EB_ACTION: 'GetVipBaseInfoByMobile'
    }
  })
}

// 修改用户信息（目前只允许修改姓名和车牌号和地址）
export function updateUserInfo(username, carNo, province, city, area, addressArray, mobile) {
  const url = parseQuery(API_URL, {
    method: 'VipUpdate_WebService'
  }, false)
  const userInfo = store.getters.userInfo
  const queryParams = {
    VipUpdateData: {
      VipCode: userInfo.code,
      MallId: MALL_ID(),
      User: OPERATOR_USER,
      SurName: username,
      CarNumber: carNo,
      Sheng: province,
      Shi: city,
      Qu: area,
      Group20: addressArray,
      Mobile: mobile
    }
  }
  console.log(queryParams)
  return fetchData(url, {
    data: queryParams,
    runtimeData: {
      EB_ACTION: 'VipUpdate_WebService'
    }
  })
}

// 修改用户密码
export function updateUserPassword(password, verifyCode, mobile) {
  const url = parseQuery(API_URL, {
    method: 'WechatSite.VipDataModifyPwd'
  }, false)
  const userInfo = store.getters.userInfo
  const queryParams = {
    objPwd: {
      vipcode: userInfo.code,
      mallid: MALL_ID(),
      User: OPERATOR_USER,
      newmobile: mobile,
      Pwd: password,
      ConfirmPwd: password,
      Captcha: verifyCode
    }
  }
  return fetchData(url, {
    data: queryParams,
    runtimeData: {
      EB_ACTION: 'WechatSite.VipDataModifyPwd'
    }
  })
}

// 获取用户头像
export function getUserAvatar() {
  const url = parseQuery(API_URL, {
    method: 'WechatSite.GetPhoto'
  }, false)
  return fetchData(url, {
    data: {openid: openidUtils.get()},
    runtimeData: {
      EB_ACTION: 'WechatSite.GetPhoto'
    }
  })
}

// 获取微信用户基本信息的接口
export function wxUserInfo () {
  const url = parseQuery(API_URL, {
    method: 'WechatSite.GetUserInfoByOpenid'
  }, false)
  return fetchData(url, {
    data: {openid: openidUtils.get()},
    runtimeData: {
      EB_ACTION: 'WechatSite.GetUserInfoByOpenid'
    }
  })
}
