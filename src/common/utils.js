import storage from 'good-storage'
import wx from 'weixin-js-sdk'
import CryptoJS from 'crypto-js'
import {TRIM_PATTERN_ALL, TRIM_PATTERN_BETWEEN, TRIM_PATTERN_LEFT, TRIM_PATTERN_RIGHT, CAMELIZE_RE, DEFAULT_SECRET_KEY} from './config'
import {commonQueryParams} from '../api/config'

export function isValidColor(value) {
  const colorReg = /^#([a-fA-F0-9]){3}(([a-fA-F0-9]){3})?$/
  const rgbaReg = /^[rR][gG][bB][aA]\(\s*((25[0-5]|2[0-4]\d|1?\d{1,2})\s*,\s*){3}\s*(\.|\d+\.)?\d+\s*\)$/
  const rgbReg = /^[rR][gG][bB]\(\s*((25[0-5]|2[0-4]\d|1?\d{1,2})\s*,\s*){2}(25[0-5]|2[0-4]\d|1?\d{1,2})\s*\)$/
  return colorReg.test(value) || rgbaReg.test(value) || rgbReg.test(value)
}

export function camelize(str) {
  str = String(str)
  return str.replace(CAMELIZE_RE, (m, c) => {
    return c ? c.toUpperCase() : ''
  })
}

// 对数字字符串进行补0操作
export function pad(num, n = 2, str = '0') {
  let len = num.toString().length
  while (len < n) {
    num = str + num
    len++
  }
  return num
}

// 格式化数字19000 -> 19,000
export function formatNumber(n) {
  let b = parseInt(n).toString()
  const len = b.length
  if (len <= 3) return b
  let r = len % 3
  return r > 0 ? b.slice(0, r) + ',' + b.slice(r, len).match(/\d{3}/g).join(',') : b.slice(r, len).match(/\d{3}/g).join(',')
}

/**
 *  过滤特殊字符
 * @param s
 * @returns {string}
 */
export function stripScript(s) {
  /* eslint-disable */
  let pattern = /[\=\-\_\,\!\|\~\`\(\)\#\$\%\^\&\*\{\}\:\;\"\L\<\>\?]/gi
  let rs = ''
  for (let i = 0; i < s.length; i++) {
    rs = (rs + s.substr(i, 1)).replace(pattern, '')
  }
  return rs
}

/**
 * html 解码
 * @param str
 * @returns {string}
 */
export function htmlDecode(str) {
  let s = ''
  if (!str.length) return ''
  s = str.replace(/&amp;/g, '&')
  s = s.replace(/&lt;/g, '<')
  s = s.replace(/&gt;/g, '>')
  // s = s.replace(/&nbsp;/g, ' ')
  s = s.replace(/&#39;/g, '\'')
  s = s.replace(/&quot;/g, '"')
  return s
}

/**
 * html编码
 * @param str
 * @returns {string}
 */
export function htmlEncode(str) {
  let s = ''
  if (!str.length) return ''
  s = str.replace(/&/g, '&amp;')
  s = s.replace(/</g, '&lt;')
  s = s.replace(/>/g, '&gt;')
  s = s.replace(/ /g, '&nbsp;')
  s = s.replace(/'/g, '&#39;')
  s = s.replace(/"/g, '&quot;')
  return s
}

/**
 * 将queryParams转化为查询字符串并添加到目标url中
 * 如: {a:1,b:2} => a=1&b=2 => www.abc.com?a=1&b=2
 * @param queryParams
 */
export function parseQuery(url, queryParams, parse = true) {
  const params = Object.assign({}, commonQueryParams, queryParams)
  let queryString = ''
  if (!isEmpty(params)) {
    for (let k in params) {
      if (params.hasOwnProperty(k)) {
        let val = params[k] !== undefined ? params[k] : ''
        if (parse) {
          queryString += `&${k}=${encodeURIComponent(val)}`
        } else {
          queryString += `&${k}=${val}`
        }
      }
    }
  }
  queryString = queryString ? queryString.substring(1) : ''
  url += (url.indexOf('?') < 0 ? '?' : '&') + queryString
  return url
}

/**
 * 解析url参数
 * @example ?id=12345&a=b
 * @return Object {id:12345,a,b}
 */
export function queryParse() {
  let url = window.location.search
  let obj = {}
  let reg = /[?&][^?&]+=[^?&]+/g
  let arr = url.match(reg)
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('=')
      let key = decodeURIComponent(tempArr[0])
      obj[key] = decodeURIComponent(tempArr[1])
    })
  }
  return obj
}

/**
 * 判断对象是否为空
 * @param obj
 * @returns {boolean}
 */
export function isEmpty(obj) {
  return Object.keys(obj).length === 0
}

/**
 * 去除字符串空格
 * @param str
 * @param pattern
 * @param c
 * @returns {*}
 */
export function trim(str, pattern = TRIM_PATTERN_ALL, c = '') {
  if (pattern === TRIM_PATTERN_ALL) {
    return str.replace(/\s+/g, c)
  } else if (pattern === TRIM_PATTERN_LEFT) {
    return str.replace( /^\s*/, '')
  } else if (pattern === TRIM_PATTERN_BETWEEN) {
    return str.replace(/(^\s*)|(\s*$)/g, c)
  } else if (pattern === TRIM_PATTERN_RIGHT) {
    return str.replace(/(\s*$)/g, '')
  }
  return str
}

export function debounce(func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

let elementStyle = document.createElement('div').style
let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }
  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  return false
})()

export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }
  if (vendor === 'standard') {
    if (style === 'transitionEnd') {
      return 'transitionend'
    }
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}

/**
 * 格式化日期
 * @param date
 * @param fmt
 * @returns {*}
 * formatDate(new Date(), 'yyyy-MM-dd h:m:s.S') -> 2018-01-16 16:56:44.329
 */
export function formatDate(date, fmt = 'yyyy-MM-dd hh:mm:ss') {
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

export function getZeroDate(date = new Date()) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return new Date(year + '/' + month + '/' + day + ' 00:00:00')
}

function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  // 如果要插入的元素就是数组的第一个元素则不做处理直接返回
  if (index === 0) return
  // 把原来存在数组中的相同的元素移除后将元素加在数组首位
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function saveArray(storageKey, val, maxLen = 0) {
  const arr = storage.get(storageKey, [])
  insertArray(arr, val, item => item === val, maxLen)
  storage.set(storageKey, arr)
  return arr
}

export function deleteArray(storageKey, val) {
  const arr = storage.get(storageKey, [])
  deleteFromArray(arr, item => item === val)
  storage.set(storageKey, arr)
  return arr
}

export function clearArray(storageKey) {
  storage.remove(storageKey)
  return []
}

export function loadArray(storageKey) {
  return storage.get(storageKey, [])
}

export function splitArray(data, count = 3) {
  const result = []
  for (let i = 0, len = data.length; i < len; i += count) {
    result.push(data.slice(i, i + count))
  }
  return result
}

export function uniqueArray(arr) {
  return [...new Set(arr)]
}

export function uniqueMap(arr) {
  const map = new Map()
  return arr.filter(k => !map.has(k) && map.set(k, 1))
}

export function AESEncode(content, secretKey = DEFAULT_SECRET_KEY) {
  return CryptoJS.AES.encrypt(content, secretKey).toString()
}

export function AESDecode(cipherText, secretKey = DEFAULT_SECRET_KEY) {
  return CryptoJS.AES.decrypt(cipherText, secretKey).toString(CryptoJS.enc.Utf8)
}

export function MD5Encode(data) {
  return CryptoJS.MD5(data).toString()
}

export function isAndroid() {
  const u = navigator.userAgent;
  return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
}

export function isNumber(val) {
  return !isNaN(parseFloat(val)) && isFinite(val)
}

export function rnd(n, m) {
  return Math.floor(Math.random() * (m - n + 1) + n)
}

export function deviceInfo() {
  const ua = navigator.userAgent
  const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/)
  const ipad = ua.match(/(iPad).*OS\s([\d_]+)/)
  const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/)
  const iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/)
  let info = {}
  if (android) {
    info.os = 'android'
    info.osVersion = android[2]
    info.android = true
    info.androidChrome = ua.toLowerCase().indexOf('chrome') >= 0
  }
  if (ipad || iphone || ipod) {
    info.os = 'ios'
    info.ios = true
  }
  // iOS
  if (iphone && !ipod) {
    info.osVersion = iphone[2].replace(/_/g, '.')
    info.iphone = true
  }
  if (ipad) {
    info.osVersion = ipad[2].replace(/_/g, '.')
    info.ipad = true
  }
  if (ipod) {
    info.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null
    info.iphone = true
  }
  // iOS 8+ changed UA
  if (info.ios && info.osVersion && ua.indexOf('Version/') >= 0) {
    if (info.osVersion.split('.')[0] === '10') {
      info.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0]
    }
  }
  // Webview
  info.webView = (iphone || ipad || ipod) && ua.match(/.*AppleWebKit(?!.*Safari)/i)
  // Minimal UI
  if (info.os && info.os === 'ios') {
    let osVersionArr = info.osVersion.split('.')
    info.minimalUi = !info.webView &&
      (ipod || iphone) &&
      (osVersionArr[0] * 1 === 7 ? osVersionArr[1] * 1 >= 1 : osVersionArr[0] * 1 > 7) &&
      document.querySelectorAll('meta[name="viewport"]').length &&
      document.querySelectorAll('meta[name="viewport"]')[0].getAttribute('content').indexOf('minimal-ui') >= 0
  }

  // keng..
  info.isWeixin = /MicroMessenger/i.test(ua)
  return info
}

export function getRect(el) {
  if (el instanceof window.SVGElement) {
    let rect = el.getBoundingClientRect()
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    }
  } else {
    return {
      top: el.offsetTop,
      left: el.offsetLeft,
      width: el.offsetWidth,
      height: el.offsetHeight
    }
  }
}

export function mergeParam(commonParam, newParam, objName) {
  let newObj = {}
  if (commonParam[objName] && newParam[objName]) {
    newObj[objName] = Object.assign({}, commonParam[objName], newParam[objName])
    return Object.assign({}, newParam, newObj)
  } else {
    return Object.assign({}, commonParam, newParam)
  }
}

export function getAreaData(res, oldAddressIdList) {
  const res1 = [
    {
      text: '云南省',
      value: '530000',
      parentId: '1'
    },
    {
      text: '四川省',
      value: '510000',
      parentId: '1'
    },
    {
      text: '昆明市',
      value: '530100',
      parentId: '530000'
    },
    {
      text: '楚雄市',
      value: '532300',
      parentId: '530000'
    },
    {
      text: '曲靖市',
      value: '530300',
      parentId: '530000'
    },
    {
      text: '成都市',
      value: '510100',
      parentId: '510000'
    },
    {
      text: '自贡市',
      value: '510300',
      parentId: '510000'
    },
    {
      text: '攀枝花市',
      value: '510400',
      parentId: '510000'
    },
    // 区
    {
      text: '五华区',
      value: '530102',
      parentId: '530100'
    },
    {
      text: '官渡区',
      value: '530106',
      parentId: '530100'
    },
    {
      text: '楚雄市',
      value: '532301',
      parentId: '532300'
    },
    {
      text: '双柏县',
      value: '532322',
      parentId: '532300'
    },
    {
      text: '市辖区',
      value: '510101',
      parentId: '510100'
    },
    {
      text: '锦江区',
      value: '510104',
      parentId: '510100'
    }
  ]
  let provinceList = []
  let cityList = {}
  let areaList = {}

  // 获取省
  let newProvince = {}
  res.forEach(item => {
    if (item.parentId === '1') {
      newProvince = {}
      newProvince.value = item.value
      newProvince.text = item.text
      provinceList.push(newProvince)
    }
  })

  provinceList.forEach(province => {
    cityList[province.value] = [province.text]
  })

  let newCity = {}
  for (let pro in cityList) {
    let province = cityList[pro][0]
    cityList[pro] = []
    res.forEach(address => {
      if (address.parentId === pro) {
        newCity = {}
        newCity.province = province
        newCity.value = address.value
        newCity.text = address.text
        cityList[pro].push(newCity)
      }
    })
  }

  // 获取区的数据
  for (let provinceId in cityList) {
    cityList[provinceId].forEach(city => {
      areaList[city.value] = [city.text]
    })
  }

  let newArea = {}
  for (let area in areaList) {
    let city = areaList[area][0]
    areaList[area] = []
    res.forEach(address => {
      if (address.parentId === area) {
        newArea = {}
        newArea.city = city
        newArea.value = address.value
        newArea.text = address.text
        areaList[area].push(newArea)
      }
    })
  }
  const addressData = provinceList
  addressData.forEach(province => {
    province.children = cityList[province.value]
    province.children.forEach(city => {
      city.children = areaList[city.value]
    })
  })

  // 获取对应下标
  let selectedIndex = []
  if (oldAddressIdList) {
    addressData.forEach((province, provinceIndex) => {
      if (province.value === oldAddressIdList[0]) {
        selectedIndex[0] = provinceIndex
        province.children.forEach((city, cityIndex) => {
          if (city.value === oldAddressIdList[1]) {
            selectedIndex[1] = cityIndex
            city.children.forEach((area, areaIndex) => {
              if (area.value === oldAddressIdList[2]) {
                selectedIndex[2] = areaIndex
              }
            })
          }
        })
      }
    })
  }

  return {addressData, selectedIndex}
}

/**
 * 由 上海-上海市-浦东区
 * 变成 上海-浦东区
 */
export function showAddressFormat(province, city, area) {
  return city.indexOf(province) === -1 ? `${province}-${city}-${area}` : `${province}-${area}`
}
