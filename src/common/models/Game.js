import storage from 'good-storage'
import {KEY_ASSETS_PREFIX} from '../config'
import {htmlDecode} from '../utils'

/*
* XF_GAMEID
* XF_GAMENAME
* EB_EFFECT_DATETIME
* EB_EXPIRY_DATETIME
* XF_COUNT_DAY 每人每天可进行游戏的次数
* XF_COUNT_MONTH 每人每月可进行游戏的次数
* XF_COUNT_YEAR 每人每年可进行游戏的次数
* XF_COUNT_MAX 每人可进行的游戏次数
* EB_MAINTENANCE_GAMEBG
* EB_MAINTENANCE_GAMERULES
* */
export class GameInfo {
  constructor({XF_GAMEID, XF_GAMENAME, EB_EFFECT_DATETIME, EB_EXPIRY_DATETIME, XF_COUNT_DAY, XF_COUNT_MONTH,
                XF_COUNT_YEAR, XF_COUNT_MAX, EB_MAINTENANCE_GAMEBG, EB_MAINTENANCE_GAMERULES}) {
    const sourceUrl = storage.session.get(KEY_ASSETS_PREFIX, false)
    this.id = XF_GAMEID
    this.name = XF_GAMENAME
    this.validStartTime = EB_EFFECT_DATETIME
    this.validEndTime = EB_EXPIRY_DATETIME
    this.lotteryBgUrl = sourceUrl ? `${sourceUrl + encodeURIComponent(EB_MAINTENANCE_GAMEBG.substr(1))}` : ''
    this.rules = htmlDecode(EB_MAINTENANCE_GAMERULES)
  }
}

export class PrizeItem {
  constructor({XF_GAMEGIFTID, XF_DESCI, XF_REMARK, EB_CREATE_DATETIME, EB_LASTMODIFY_DATETIME,
              XF_VIPGAMEGIFT_EXT}) {
    const sourceUrl = storage.session.get(KEY_ASSETS_PREFIX, false)
    this.id = XF_GAMEGIFTID
    this.desc = XF_DESCI
    this.createTime = EB_CREATE_DATETIME
    this.updateTime = EB_LASTMODIFY_DATETIME
    this.remark = sourceUrl ? `${sourceUrl + encodeURIComponent(XF_REMARK.substr(1))}` : ''
    if (XF_VIPGAMEGIFT_EXT.length) {
      this.list = XF_VIPGAMEGIFT_EXT.map(item => {
        return {
          ticketName: item.XF_TICKETNAME,
          ticketId: item.XF_TICKETID,
          type: item.XF_TYPE,
          value: item.XF_VALUE,
          prizeId: XF_GAMEGIFTID
        }
      })
    } else {
      this.list = []
    }
  }
}
