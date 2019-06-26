import {htmlDecode} from '../utils'
import {KEY_ASSETS_PREFIX} from '../../common/config'
import storage from 'good-storage'

export class BlendsTypeObj {
  constructor ({id, imgUrl, unReadNum}) {
    this.id = id
    this.imgUrl = imgUrl
    this.unReadNum = unReadNum
  }
}

export function createBlendsTypeObj(info) {
  return new BlendsTypeObj({
    id: info.EB_MORTIFICATION_TYPEID || '',
    imgUrl: info.EB_MORTIFICATION_TYPE_IMG ? storage.session.get(KEY_ASSETS_PREFIX) + encodeURIComponent(info.EB_MORTIFICATION_TYPE_IMG.substr(1)) : require('../images/no_image_list.jpg'),
    unReadNum: Number(info.TOTALITY) - Number(info.READINGS) // info.READINGS 为已读
  })
}

export class BlendsObj {
  constructor ({id, typeId, imgUrl, title, isRead, scope, startTime, endTime, desc, tip, detailUrl}) {
    this.id = id
    this.typeId = typeId
    this.imgUrl = imgUrl
    this.title = title
    this.isRead = isRead
    this.scope = scope
    this.startTime = startTime
    this.endTime = endTime
    this.desc = desc
    this.tip = tip
    this.detailUrl = detailUrl
    this.isShow = false
  }
}

export function createBlendsObj(info) {
  return new BlendsObj({
    id: info.EB_MORTIFICATION_ID || '',
    typeId: info.EB_MORTIFICATION_TYPEID || '',
    imgUrl: info.EB_MORTIFICATION_IMG ? storage.session.get(KEY_ASSETS_PREFIX) + encodeURIComponent(info.EB_MORTIFICATION_IMG.substr(1)) : require('../images/no_image_list.jpg'),
    title: info.EB_MORTIFICATION_TITLE || '',
    isRead: info.isRead ? Number(info.isRead) !== 0 : false,
    scope: info.EB_SCOPE,
    startTime: info.EB_AIRTIME ? info.EB_AIRTIME.split(' ')[0] : '',
    endTime: info.EB_ENDTIME ? info.EB_ENDTIME.split(' ')[0] : '',
    desc: info.EB_MORTIFICATION_DESC ? htmlDecode(info.EB_MORTIFICATION_DESC) : '',
    tip: info.EB_WARM_TIPS ? htmlDecode(info.EB_WARM_TIPS) : '',
    detailUrl: info.EB_MORTIFICATION_URL || ''
  })
}

export function createUiZd(info) {
  return {
    id: info.EB_MORTIFICATION_TYPEID || '',
    isShow: false,
    imgUrl: info.EB_MORTIFICATION_TYPE_IMG ? storage.session.get(KEY_ASSETS_PREFIX) + encodeURIComponent(info.EB_MORTIFICATION_TYPE_IMG.substr(1)) : require('../images/no_image_list.jpg'),
    name: info.EB_MORTIFICATION_TYPE_TITLE || '',
    timeLimit: `${info.EB_AIRTIME.split(' ')[0].replace(/\//g, '.')} - ${info.EB_ENDTIME.split(' ')[0].replace(/\//g, '.')}`,
    detailUrl: info.EB_MORTIFICATION_URL || '',
    desc: info.EB_MORTIFICATION_DESC ? htmlDecode(info.EB_MORTIFICATION_DESC) : '',
    tip: info.EB_WARM_TIPS ? htmlDecode(info.EB_WARM_TIPS) : '',
    scope: info.EB_SCOPE,
    unReadNum: '' // Number(info.TOTALITY) - Number(info.READINGS) // info.READINGS 为已读
  }
}
