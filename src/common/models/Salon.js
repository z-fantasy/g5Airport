import {htmlDecode} from '../utils'
import {KEY_ASSETS_PREFIX} from '../../common/config'
import storage from 'good-storage'

export class SalonObj {
  constructor ({id, ActivityTheme, logoUrl, listTitle, name, detailImg, location, memberCount, bonus, startTime, endTime, LimitPeople, LimitEnrollVipNum, costDesc, activityRemark, ActivityStage, EnrollNum}) {
    this.id = id
    this.ActivityTheme = ActivityTheme
    this.logoUrl = logoUrl
    this.listTitle = listTitle
    this.name = name
    this.detailImg = detailImg
    this.location = location
    this.memberCount = memberCount
    this.bonus = bonus
    this.startTime = startTime
    this.endTime = endTime
    this.validateTime = validateTimeRange(startTime, endTime)
    this.LimitPeople = LimitPeople
    this.LimitEnrollVipNum = LimitEnrollVipNum
    this.costDesc = costDesc
    this.activityRemark = activityRemark
    this.ActivityStage = ActivityStage
    this.EnrollNum = EnrollNum
  }
}

export function createSalonObj(info) {
  return new SalonObj({
    id: info.ActivityId || '',
    ActivityTheme: info.ActivityTheme,
    logoUrl: info.ImgUrl ? storage.session.get(KEY_ASSETS_PREFIX) + encodeURIComponent(info.ImgUrl.substr(1)) : require('../images/no_image_list.jpg'),
    listTitle: info.ActivityTheme || '',
    name: info.EB_BRAND_AGIO_TITLE || '',
    detailImg: info.EB_BRAND_AGIO_DETIALIMG ? storage.session.get(KEY_ASSETS_PREFIX) + encodeURIComponent(info.EB_BRAND_AGIO_DETIALIMG.substr(1)) : require('../images/no_image_list.jpg'),
    location: info.Locus || '',
    memberCount: info.LimitPeople || '',
    // detailTip: info.EB_AGIO_REMINDER ? htmlDecode(info.EB_AGIO_REMINDER) : '',
    startTime: info.AirTime || '',
    endTime: info.EndTime || '',
    LimitEnrollVipNum: info.LimitEnrollVipNum || '',
    LimitPeople: info.LimitPeople || '',
    bonus: info.Cost || '',
    costDesc: info.CostDesc ? htmlDecode(info.CostDesc) : '',
    activityRemark: info.WctRemark ? htmlDecode(info.WctRemark) : '',
    ActivityStage: info.ActivityStage || '',
    EnrollNum: info.EnrollNum || ''
  })
}

function validateTimeRange(startTime, endTime) {
  return `${startTime.split(' ')[0].replace(/-/g, '/')}-${endTime.split(' ')[0].replace(/-/g, '/')}`
}
