export const IS_PRODUCTION = process.env.NODE_ENV === 'production'

export const REQUEST_BASE_URL = '/'
export const REQUEST_TIME_OUT = 20000
export const TIME_OUT_ERROR_CODE = -1
export const NETWORK_ERROR_CODE = -2
export const REQUEST_TIME_OUT_TEXT = '请求超时'
export const REQUEST_FAILED_TEXT = '服务器出问题了'
export const NETWORK_ERROR_TEXT = '网络异常，请检查当前网络是否顺畅'

export const TOAST_NAME = 'toast'
export const ALERT_NAME = 'alert'
export const CONFIRM_NAME = 'confirm'

export const CAMELIZE_RE = /-(\w)/g

export const TRIM_PATTERN_ALL = 'all'
export const TRIM_PATTERN_BETWEEN = 'between'
export const TRIM_PATTERN_LEFT = 'left'
export const TRIM_PATTERN_RIGHT = 'right'

export const DEFAULT_SECRET_KEY = 'brainsdafaqj23ou89ZXcj@#$@#$#@KJdjklj;D../dSF.,'
export const USER_INFO_SECRET_KEY = 'brainsdnfkhcj@#$@#$#@KJdjklj;D../|*_dSF.,'

const STORAGE_PREFIX = 'G5Plaza'
export const KEY_OPENID = window.env === 0 ? `__${STORAGE_PREFIX}_openid__` : `__${STORAGE_PREFIX}_test_openid__`
export const KEY_USER_INFO = window.env === 0 ? `__${STORAGE_PREFIX}_user_info__` : `__${STORAGE_PREFIX}_test_user_info__`
export const KEY_APP_INIT = window.env === 0 ? `__${STORAGE_PREFIX}_app_init__` : `__${STORAGE_PREFIX}_test_app_init__`
export const KEY_APP_ID = window.env === 0 ? `__${STORAGE_PREFIX}_app_id__` : `__${STORAGE_PREFIX}_test_app_id__`
export const KEY_OTHER_USER_BASIC_INFO = window.env === 0 ? `__${STORAGE_PREFIX}_other_user_info__` : `__${STORAGE_PREFIX}_test_other_user_info__`
export const KEY_ALL_GRADES = window.env === 0 ? `__${STORAGE_PREFIX}_app_all_grades__` : `__${STORAGE_PREFIX}_test_app_all_grades__`
export const KEY_ASSETS_PREFIX = window.env === 0 ? `__${STORAGE_PREFIX}_assets_prefix__` : `__${STORAGE_PREFIX}_test_assets_prefix__`
export const KEY_HAS_SUBSCRIBED = window.env === 0 ? `__${STORAGE_PREFIX}_is_subscribed__` : `__${STORAGE_PREFIX}_test_is_subscribed__`
export const KEY_VIP_LOCATION = window.env === 0 ? `__${STORAGE_PREFIX}_vip_location__` : `__${STORAGE_PREFIX}_test_vip_location__`
export const KEY_LOCATION_TEXT = window.env === 0 ? `__${STORAGE_PREFIX}_vip_location_text__` : `__${STORAGE_PREFIX}_test_vip_location_text__`
export const KEY_DEFAULT_MALL = window.env === 0 ? `__${STORAGE_PREFIX}_default_mall__` : `__${STORAGE_PREFIX}_test_default_mall__`

// 会员类型
// 18918662360 其他会场的手机号
// 1无任何注册，2非本商场注册，3本商场会员
export const NOT_REGISTER = 1
export const IS_NOT_SYSTEM_USER = 2
export const IS_SYSTEM_USER = 3

export const REGEX_NORMAL_PHONE = /^1(3|4|5|6|7|8|9)\d{9}$/
export const REGEX_NORMAL_PASSWORD = /^[a-zA-Z0-9]{1,10}$/
export const REGEX_CAR_NO = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4,5}[A-Z0-9挂学警港澳]{1}$/

export const MAIN_COLOR = '#333' // 6C5F95

// 性别数据
export const SEX_DATA = [
  {
    value: 'M',
    text: messages.common.txt_sex_male
  },
  {
    value: 'F',
    text: messages.common.txt_sex_female
  }
]
