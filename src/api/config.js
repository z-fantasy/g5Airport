import storage from 'good-storage'
import {IS_PRODUCTION, KEY_APP_ID, KEY_LOCATION_TEXT, KEY_VIP_LOCATION, KEY_DEFAULT_MALL} from '../common/config'
import {deviceInfo, formatDate, MD5Encode} from '../common/utils'
import {openidUtils} from '../common/wx-utils'

const G = window.globalData

export const METHOD_POST = 'post'
export const METHOD_GET = 'get'
export function MALL_ID() {
  let mallid = storage.get(KEY_DEFAULT_MALL, 'G5')
  if (typeof mallid === 'string' && mallid.indexOf('{') > -1) {
    mallid = JSON.parse(mallid).STR_VALUE
  }
  if (typeof mallid !== 'string') {
    mallid = mallid.STR_VALUE
  }
  if (mallid === 'CDSY001') {
    storage.set(KEY_DEFAULT_MALL, 'G5')
    mallid = 'G5'
  }
  return mallid
}
// 'G5'
export const OPERATOR_USER = 'webservice'
export const EXTEND_CODE = '105'

const systemInfo = deviceInfo()

// 请求公共参数
export function commonParams() {
  return {
    runtimeData: {
      EB_IP: '',
      EB_MAC: '',
      EB_DEVICE_ID: '',
      EB_USER_ID: openidUtils.get(),
      EB_TOUCHPOINT_ID: '',
      EB_PAGE_ID: '',
      EB_INTERFACE_VERSOIN: '',
      EB_PUSH_CID: '',
      EB_MALLID: MALL_ID(),
      EB_LOCATION: storage.session.get(KEY_LOCATION_TEXT, false) || '暂未获取到有效位置',
      EB_POSITION_LON: storage.session.get(KEY_VIP_LOCATION, '').lon,
      EB_POSITION_LAT: storage.session.get(KEY_VIP_LOCATION, '').lat,
      EB_OS_VERSOIN: `${systemInfo.os} ${systemInfo.osVersion}`,
      EB_APPID: storage.session.get(KEY_APP_ID, ''),
      EB_CREATE_DATETIME: formatDate(new Date()),
      EB_ACTION: '',
      EB_TICKETID: '',
      EB_EXTEND_PARAM: ''
    }
  }
}

// 请求url公共拼接参数
export const commonQueryParams = {}

// 请求公共配置参数
export const commonOptions = {
  method: METHOD_POST,
  responseType: 'json',
  maxRedirects: 5
}

export function uuid(len, radix) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  let uuid = []
  radix = radix || chars.length

  if (len) {
    // Compact form
    for (let i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
  } else {
    // rfc4122, version 4 form
    let r

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (let i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return uuid.join('')
}

export function utilParm(method, data) {
  const nowTime = formatDate(new Date()).split(' ')
  const utilParms = {
    'method': method,
    'crc': uuid(20, 10),
    'reqdate': nowTime[0].replace(/-/g, ''),
    'reqtime': nowTime[1].replace(/:/g, ''),
    'user': 'TEST'
  }
  // MD5Encode => md5
  if (data) {
    utilParms.sign = MD5Encode(`${method + JSON.stringify(data) + utilParms.crc + '20161220102452'}`)
    utilParms.data = data
  } else {
    utilParms.sign = MD5Encode(`${method + utilParms.crc + '20161220102452'}`)
  }
  return utilParms
}

/// API前缀地址
export const API_URL_PREFIX = IS_PRODUCTION ? G.apiUrl : G.apiUrl

// 领取会员卡至微信卡包地址
export const WX_API_URL = IS_PRODUCTION ? G.apiUrl : G.apiUrl // 'http://110.185.172.245:8287/Query.ashx'

// 主机地址
export const ROOT_PATH = 'http://wxapp.tech-trans.com.cn'
/// 根路径地址
const LOCAL_HOST_IP = 'http://192.168.160.174:5000'
const HOME_URL_PREFIX = G.homeUrl
export const HOME_URL = IS_PRODUCTION ? HOME_URL_PREFIX : LOCAL_HOST_IP

/// 微信相关数据请求地址
export const WX_URL = `${HOME_URL_PREFIX}/DataHandler.ashx`
/// API接口请求地址
export const API_URL = `${API_URL_PREFIX}/Query.ashx`

// 积分记录查询开始时间
export const QUERY_SCORE_RECORD_START_TIME = '20171215'

// 积分记录对应名字
// export const BONUS_ACTION = {
//   A: '积分调整',
//   E: '积分补入',
//   G: '兑换礼品',
//   R: '积分清零',
//   O: '开卡',
//   T: '退货',
//   S: '消费',
//   H: '参加活动',
//   C: '礼品退货',
//   L: '储物柜',
//   W: '完善会员资料',
//   M: '积分购买',
//   J: '获取电子券抵扣积分',
//   F: '积分兑换电子券',
//   I: '批量送积分',
//   P: '绑定服务号',
//   B: '满赠',
//   N: '积分抵现',
//   K: '游戏',
//   Q: '会员签到',
//   V: '邀请会员',
//   X: '被邀请加入会员',
//   0: '获得被邀请人首单消费后的赠送积分',
//   1: '被邀请人获得首单消费赠送的积分',
//   2: '升级赠送积分',
//   3: '预约沙龙'
// }
