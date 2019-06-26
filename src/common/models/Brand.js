import {htmlDecode} from '../utils'
import {KEY_ASSETS_PREFIX} from '../../common/config'
import storage from 'good-storage'

export class BrandObj {
  constructor ({id, logoUrl, listTitle, name, detailImg, storeNum, discountDesc, detailTip, useStartTime, useEndTime}) {
    this.id = id
    this.logoUrl = logoUrl
    this.listTitle = listTitle
    this.name = name
    this.detailImg = detailImg
    this.storeNum = storeNum
    this.discountDesc = discountDesc
    this.detailTip = detailTip
    this.useStartTime = useStartTime
    this.useEndTime = useEndTime
  }
}

export function createBrandObj(info) {
  return new BrandObj({
    id: info.EB_BRAND_AGIO_ID || '',
    logoUrl: info.EB_BRAND_AGIO_LISTIMG ? storage.session.get(KEY_ASSETS_PREFIX) + encodeURIComponent(info.EB_BRAND_AGIO_LISTIMG.substr(1)) : require('../images/no_image_list.jpg'),
    listTitle: info.EB_BRAND_AGIO_LISTTITLE || '',
    name: info.EB_BRAND_AGIO_TITLE || '',
    detailImg: info.EB_BRAND_AGIO_DETIALIMG ? storage.session.get(KEY_ASSETS_PREFIX) + encodeURIComponent(info.EB_BRAND_AGIO_DETIALIMG.substr(1)) : require('../images/no_image_list.jpg'),
    storeNum: info.EB_BERTH_NUMBER || '',
    discountDesc: info.EB_AGIO_DESC ? htmlDecode(info.EB_AGIO_DESC) : '',
    detailTip: info.EB_AGIO_REMINDER ? htmlDecode(info.EB_AGIO_REMINDER) : '',
    useStartTime: info.EB_AGIO_SARTTIME || '',
    useEndTime: info.EB_AGIO_ENDTIME || ''
  })
}
