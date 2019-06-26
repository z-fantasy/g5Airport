import {saveUser, loadUser, clearUser} from '../../common/cache'
import {User} from '../../common/models/User'
import {openidUtils} from '../../common/wx-utils'
import * as types from './mutation-types'
const infoModule = {
  id: '',
  code: '',
  cardNo: '',
  name: '',
  email: '',
  mobile: '',
  sex: '',
  cardType: '',
  bonus: '',
  bornYear: '',
  bornMonth: '',
  bornDay: '',
  birthday: '',
  circleId: '',
  grade: '',
  createTime: '',
  validTime: '',
  invalidTime: '',
  freezing: '',
  inCircle: '',
  postal: '',
  remark: '',
  openId: openidUtils.get() ? openidUtils.get() : '',
  inWhiteList: '',
  mallId: '',
  address: '',
  carNo: '',
  addressInfo: '',
  provinceText: '',
  cityText: '',
  areaText: '',
  // bigAddress: '广东省广州市越秀区'
  // 卡券数量
  cardCount: 0,
  // 此处有问题，做一个默认值处理
  selectTags: '',
  headImg: ''
}
function backInfoMobild(data) {
  let infoMo = []
  if (Array.isArray(data)) {
    infoMo = data[0]
  } else {
    if (typeof data === 'string') {
      infoMo = JSON.parse(data)
    } else {
      infoMo = data
    }
  }
  return {
    id: infoMo.VipId || '',
    code: infoMo.VipCode || '',
    cardNo: infoMo.VipCardNo || '',
    name: infoMo.SurName || '',
    email: infoMo.VipEmail || '',
    mobile: infoMo.Mobile || '',
    sex: infoMo.Sex || '',
    cardType: infoMo.IdCardType || '',
    bonus: infoMo.Bonus || '',
    bornYear: infoMo.BirthdayYYYY || '',
    bornMonth: infoMo.BirthdayMM || '',
    bornDay: infoMo.BirthdayDD || '',
    birthday: infoMo.BirthdayDD ? [infoMo.BirthdayYYYY, infoMo.BirthdayMM, infoMo.BirthdayDD].join('/') : '',
    circleId: infoMo.CircleId || '',
    grade: infoMo.Grade || '',
    createTime: infoMo.JoinDate || '',
    validTime: infoMo.EffectDate || '',
    invalidTime: infoMo.ExpiryDate || '',
    freezing: infoMo.IsFreeze || '',
    inCircle: infoMo.IsThisCircle || ''
  }
}
export const saveUserInfo = function({commit}, userInfo) {
  // 兼容后台返回数据
  const oldUser = loadUser() ? loadUser() : {}
  if (Array.isArray(userInfo)) {
    // let userData = userInfo.VipDis && userInfo.VipDis.length ? userInfo.VipDis[0] : userInfo.length && typeof userInfo !== 'string' ? userInfo[0] : JSON.parse(userInfo)[0]
    // let user = new User(userData)
    let user = new User(userInfo[0])
    user = Object.assign({}, oldUser, user)
    saveUser(user, false)
    commit(types.SET_USER_INFO, user)
  } else {
    if (typeof userInfo === 'string') {
      userInfo = Object.assign({}, oldUser, JSON.parse(userInfo))
    } else {
      userInfo = Object.assign({}, oldUser, userInfo)
    }
    saveUser(userInfo, false)
    commit(types.SET_USER_INFO, userInfo)
  }
}

export const clearUserInfo = function({commit}) {
  clearUser()
  commit(types.SET_USER_INFO, {})
}
