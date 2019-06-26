import storage from 'good-storage'
import {KEY_OPENID} from './config'
/**
 * 判断是否在微信环境下
 * @returns {boolean}
 */
export function isWXEnv() {
  const ua = window.navigator.userAgent.toLowerCase()
  return /MicroMessenger/i.test(ua) || /wechatdevtools/.test(ua)
}

export function isDevTool() {
  const ua = window.navigator.userAgent.toLowerCase()
  return /wechatdevtools/.test(ua)
}

/**
 * set 返回值：设置完毕的openid
 * get 返回值：有则返回设置完毕的openid，无则返回false
 * has 返回值：本地有openid则返回true，没有则返回false
 * @type {{set: (function(*=): *), get: (function(): (*|Object)), has: (function(): *), remove: (function(): (*|void))}}
 */
export const openidUtils = {
  set: (val) => storage.set(KEY_OPENID, val),
  get: () => storage.get(KEY_OPENID, false),
  has: () => storage.has(KEY_OPENID),
  remove: () => storage.remove(KEY_OPENID)
}
