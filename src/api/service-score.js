import {METHOD_POST, API_URL, MALL_ID} from './config'
import {KEY_APP_ID} from '../common/config'
import {parseQuery} from '../common/utils'
import fetchData from '../common/fetch-data'
import store from '../store'
import {openidUtils} from '../common/wx-utils'
import storage from 'good-storage'

// 自助积分
export function selfServicePoints(QRCode) {
  const url = parseQuery(API_URL, {
    method: 'Consume_QRCode_WebService'
  }, false)
  return fetchData(url, METHOD_POST, {
    data: {
      VipCode: store.getters.userInfo.code,
      QRCode
    },
    runtimeData: {
      EB_ACTION: 'Consume_QRCode_WebService'
    }
  })
}

// 自助积分-上传图片相关接口
// 查询店铺
export function inqStore(stName) {
  const url = parseQuery(API_URL, {
    method: 'WechatSite_StoreListByName',
    ext: 1
  })
  const proData = [
    {
      key: '@storename',
      value: stName
    }
  ]
  return fetchData(url, METHOD_POST, {
    data: proData,
    runtimeData: {
      EB_ACTION: 'WechatSite_StoreListByName'
    }
  })
}
// 上传图片id （假的，没用）
export function upImgFile(id) {
  const url = parseQuery(API_URL, {
    method: 'Consume_QRCode_WebService'
  }, false)
  return fetchData(url, METHOD_POST, {
    data: {
      VipCode: store.getters.userInfo.code,
      QRCode
    },
    runtimeData: {
      EB_ACTION: 'Consume_QRCode_WebService'
    }
  })
}

// 拍照积分提交
export function servicePtoSub(data) {
  const url = parseQuery(API_URL, {
    method: 'WechatSite.SelfFillBonus'
  }, false)
  return fetchData(url, METHOD_POST, {
    data: {
      openid: openidUtils.get(),
      mallid: MALL_ID(),
      storeid: data.storeId,
      buy_time: data.time,
      order_amount: data.money,
      buy_order: data.num,
      img_url: data.imgUrl,
      mode: 'media_id',
      appid: window.env ? storage.session.get(KEY_APP_ID, 'wxd769cea7178b70e2') : storage.session.get(KEY_APP_ID, 'wx93e5e0f9a200beff')
    },
    runtimeData: {
      EB_ACTION: 'WechatSite.SelfFillBonus'
    }
  })
}
