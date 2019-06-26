import axios from 'axios'
import {NETWORK_ERROR_CODE, TIME_OUT_ERROR_CODE, REQUEST_TIME_OUT, REQUEST_BASE_URL, REQUEST_TIME_OUT_TEXT, REQUEST_FAILED_TEXT, NETWORK_ERROR_TEXT} from './config'
import {METHOD_POST, METHOD_GET, commonParams, commonOptions} from '../api/config'
import {isEmpty, mergeParam} from './utils'

/*
  解决不能传递自定义header的问题需要服务器做如此配置：https://blog.csdn.net/qq_39985511/article/details/78947099
  */
const service = axios.create({
  timeout: REQUEST_TIME_OUT,
  baseURL: REQUEST_BASE_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

service.interceptors.request.use(config => {
  /**
   * if (store.getters.token) {
   *    config.headers['X-Token'] = getToken() // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
   *  }
   */
  return config
}, error => Promise.reject(error))

service.interceptors.response.use(res => {
  if (res.data.Header && parseInt(res.data.Header.errcode) !== 0) {
    // 单独抛出会员卡未激活错误码
    const cardNotActive = 'wx0001'
    if (res.data.Header.errcode === cardNotActive) {
      return Promise.reject(new Error(cardNotActive))
    }
    let errMsg = res.data.Header.errmsg ? res.data.Header.errmsg : REQUEST_FAILED_TEXT
    return Promise.reject(new Error(errMsg))
  } else {
    if (res.data.success && res.data.Data === null) return res.data.success
    return res.data.Data
  }
}, error => {
  console.log(error.message)
  if (error.message.toLowerCase().indexOf('timeout') > -1) {
    return Promise.reject(new Error(TIME_OUT_ERROR_CODE))
  } else if (error.message.toLowerCase().indexOf('network error') > -1) {
    return Promise.reject(new Error(NETWORK_ERROR_CODE))
  }
  return Promise.reject(error)
})

/**
 * 请求公共方法
 * @param url 请求地址
 * @param type 请求方式
 * @param params 用户请求参数对象
 * @param options 请求配置
 * @returns :
 * {
 *   // `data` is the response that was provided by the server
 *    data: {},
 *    // `status` is the HTTP status code from the server response
 *    status: 200,
 *    // `statusText` is the HTTP status message from the server response
 *    statusText: 'OK',
 *    // `headers` the headers that the server responded with
 *    // All header names are lower cased
 *    headers: {},
 *    // `config` is the config that was provided to `axios` for the request
 *    config: {},
 *    // `request` is the request that generated this response
 *    // It is the last ClientRequest instance in node.js (in redirects)
 *    // and an XMLHttpRequest instance the browser
 *    request: {}
 *   }
 */
export default function fetchData(url, type = METHOD_POST, params = {}, options = {}) {
  if (typeof type !== 'string') {
    params = type
    type = METHOD_POST
    options = params
  }
  params = mergeParam(commonParams(), params, 'runtimeData')
  options = Object.assign({}, commonOptions, options)
  const reqOptions = {}
  if (type === METHOD_GET) {
    reqOptions.params = params
  } else {
    reqOptions.data = params
  }
  reqOptions.transformRequest = [function(data, headers) {
    if (headers['Content-Type'] && headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      let strData = ''
      if (!isEmpty(data)) {
        for (let k in data) {
          if (data.hasOwnProperty(k)) {
            let val = data[k] !== undefined ? data[k] : ''
            strData += `&${k}=${encodeURIComponent(JSON.stringify(val))}`
          }
        }
      }
      strData = strData ? strData.substring(1) : ''
      return strData
    }
    return data
  }]
  reqOptions.method = type
  reqOptions.url = url
  reqOptions.responseType = options.responseType
  reqOptions.maxRedirects = options.maxRedirects
  return service.request(reqOptions)
}
