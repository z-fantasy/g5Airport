import {formatDate, htmlDecode} from '../utils'
import {KEY_ASSETS_PREFIX} from '../../common/config'
import storage from 'good-storage'

export class CouponObj {
  constructor ({id, logoUrl, bannerUrl, detailImg, listDesc, detailDesc, detailTip, name, itemNo,
               itemName, score, group, useStartTime, useEndTime, statusImg, validStartTime, validEndTime,
                 redeemCode, status, isUsed, serialId, couponType}) {
    this.id = id
    this.logoUrl = logoUrl
    this.bannerUrl = bannerUrl
    this.detailImg = detailImg
    this.listDesc = listDesc
    this.detailDesc = detailDesc
    this.detailTip = detailTip
    this.name = name
    this.itemNo = itemNo
    this.itemName = itemName
    this.score = score
    this.group = group
    this.useStartTime = useStartTime
    this.useEndTime = useEndTime
    this.statusImg = statusImg
    this.validStartTime = validStartTime
    this.validEndTime = validEndTime
    this.redeemCode = redeemCode
    this.status = status
    this.isUsed = isUsed
    this.serialId = serialId
    this.couponType = couponType
  }
}

export function createCouponObj(info, couponType = 'discount') {
  return new CouponObj({
    id: info.XF_TICKETID || '',
    logoUrl: info.EB_LOG_URL ? storage.session.get(KEY_ASSETS_PREFIX) + encodeURIComponent(info.EB_LOG_URL.substr(1)) : require('../images/no_image_list.jpg'),
    bannerUrl: info.EB_BANNER_URL ? storage.session.get(KEY_ASSETS_PREFIX) + encodeURIComponent(info.EB_BANNER_URL.substr(1)) : '',
    detailImg: info.EB_BANNER_URL ? storage.session.get(KEY_ASSETS_PREFIX) + encodeURIComponent(info.EB_BANNER_URL.substr(1)) : '',
    listDesc: info.EB_LIST_DESC,
    detailDesc: info.EB_DETAIL_DESC ? htmlDecode(info.EB_DETAIL_DESC) : '',
    detailTip: info.EB_DETAIL_USE_DESC ? htmlDecode(info.EB_DETAIL_USE_DESC) : '',
    name: info.XF_TICKETNAME || info.XF_DESCI,
    itemNo: info.XF_ITEMNO,
    itemName: info.XF_ITEMNAME,
    score: info.XF_BONUS,
    group: {
      id: info.XF_TICKETGROUPID,
      name: info.XF_TICKETGROUPNAME
    },
    useStartTime: info.EB_USE_EFFECTDATE,
    useEndTime: info.EB_USE_EXPIRATIONDATE,
    statusImg: info.EB_TICKET_STAMP_IMG,
    validStartTime: info.EB_RECEIVE_EFFECTDATE,
    validEndTime: info.EB_RECEIVE_EXPIRATIONDATE,
    redeemCode: info.EB_SERIALID || info.XF_TICKETID,
    status: info.EB_DateState,
    isUsed: info.EB_USED,
    serialId: info.EB_SERIALID,
    couponType: couponType
  })
}

function timeRange(startTime, endTime) {
  if (!startTime || !endTime) {
    console.warn('startTime or endTime is not exist')
    if (!new Date(startTime) || !new Date(endTime)) {
      console.warn('startTime or endTime is not date')
      return ''
    }
    return ''
  }
  let startDate = new Date(startTime)
  let endDate = new Date(endTime)
  return `${formatDate(startDate, 'yyyy.MM.dd')} - ${formatDate(endDate, 'yyyy.MM.dd')}`
}

function isOutOfTime(deadline) {
  if (!deadline) {
    console.warn('deadline is not exist')
    if (!new Date(deadline)) {
      console.warn('deadline is not date')
      return false
    }
    return false
  }
  let deadlineDate = new Date(deadline).getTime()
  let now = new Date().getTime()
  return deadlineDate < now
}
