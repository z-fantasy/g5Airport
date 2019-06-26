import {API_URL, MALL_ID} from './config'
import {parseQuery} from '../common/utils'
import fetchData from '../common/fetch-data'
import {openidUtils} from '../common/wx-utils'
import storage from 'good-storage'
import store from '../store'

// 获取店铺号
export function getCarParkShopId() {
  const url = parseQuery(API_URL, {
    method: 'WechatSite_DefaultParking',
    ext: 1
  }, false)
  return fetchData(url, {
    runtimeData: {
      EB_ACTION: 'WechatSite_DefaultParking'
    }
  })
}
// 我的车辆
export function getMineCar(vipcode) {
  // IsVipByOpenid
  const url = parseQuery(API_URL, {
    method: 'Wct_MyCar',
    ext: 1
  }, false)
  return fetchData(url, {
    data: [{key: '@vipcode', value: store.getters.userInfo.code}],
    runtimeData: {
      EB_ACTION: 'Wct_MyCar'
    }
  })
}
// 添加车牌
export function addMineCar(carDeai) {
  const url = parseQuery(API_URL, {
    method: 'WechatSite.AddVipCar'
  }, false)
  const queryParams = {
    'vipcar': {
      'XF_CARNUMBER': carDeai.carNo,
      'XF_VIPCODE': store.getters.userInfo.code
    }
  }
  return fetchData(url, {
    data: queryParams,
    runtimeData: {
      EB_ACTION: 'WechatSite.AddVipCar'
    }
  })
}
// 绑定车牌号
export function bindCarNumber(carDeai) {
  const url = parseQuery(API_URL, {
    method: 'WechatSite.BindVipCar'
  }, false)
  const queryParams = {
    vipcode: store.getters.userInfo.code,
    carid: carDeai.carid
  }
  return fetchData(url, {
    data: queryParams,
    runtimeData: {
      EB_ACTION: 'WechatSite.BindVipCar'
    }
  })
}
// 删除车牌号
export function delCarNo(carId) {
  const url = parseQuery(API_URL, {
    method: 'WechatSite.DelVipCar'
  }, false)
  const queryParams = {
    carid: carId
  }
  return fetchData(url, {
    data: queryParams,
    runtimeData: {
      EB_ACTION: 'WechatSite.DelVipCar'
    }
  })
}
// 查询是否有重复缴费记录行为
export function getHasPayRec(carInfo) {
  const url = parseQuery(API_URL, {
    method: 'WechatSite.SelectSameParkingLedger'
  }, false)
  const queryParams = carInfo
  return fetchData(url, {
    data: queryParams,
    runtimeData: {
      EB_ACTION: 'WechatSite.SelectSameParkingLedger'
    }
  })
}
// 查询停车缴费记录
export function getCarPackRec(VipCode) {
  const url = parseQuery(API_URL, {
    method: 'WechatSite.SelectParkingLedger'
  }, false)
  const queryParams = VipCode
  return fetchData(url, {
    data: queryParams,
    runtimeData: {
      EB_ACTION: 'WechatSite.SelectParkingLedger'
    }
  })
}
// 查询停车优惠券是否使用单选或多选
export function getCoupSelFun() {
  const url = parseQuery(API_URL, {
    method: 'Wct_ParkingFreeChange',
    ext: 1
  }, false)
  return fetchData(url, {
    runtimeData: {
      EB_ACTION: 'Wct_ParkingFreeChange'
    }
  })
}
// 查询积分优惠券是否使用单选或多选
export function getBonusSelFun(id) {
  const url = parseQuery(API_URL, {
    method: 'Wct_ParkingBonusChange', // 'WechatSite.SelectSameParkingBonus', // Wct_ParkingBonusChange
    ext: 1
  }, false)
  // const queryParams = {
  //   vipcode: store.getters.userInfo.code,
  //   returnId: id
  // }
  return fetchData(url, {
    // data: queryParams,
    runtimeData: {
      EB_ACTION: 'Wct_ParkingBonusChange'
    }
  })
}
// 查询停车场积分抵现设置
export function getBounsSet(storeId) {
  const url = parseQuery(API_URL, {
    method: 'BonusWorth_Query_WebService'
  }, false)
  const queryParams = {
    StoreId: storeId,
    VipCode: store.getters.userInfo.code,
    MallId: MALL_ID()
  }
  return fetchData(url, {
    data: queryParams,
    runtimeData: {
      EB_ACTION: 'BonusWorth_Query_WebService'
    }
  })
}
// 获取查询停车场车场：
export function getparkSpace() {
  const url = parseQuery(API_URL, {
    method: 'WechatSite_DefaultParkingCode',
    ext: 1
  }, false)
  return fetchData(url, {
    runtimeData: {
      EB_ACTION: 'WechatSite_DefaultParkingCode'
    }
  })
}
// 获取查询停车费所需要的park_code参数：
export function getparkCode(carQurDeal) {
  const url = parseQuery(API_URL, {
    method: 'WechatSite_DefaultParkingCode',
    ext: 1
  }, false)
  return fetchData(url, {
    runtimeData: {
      EB_ACTION: 'WechatSite_DefaultParkingCode'
    }
  })
}

// 查询停车费用
export function getCarPackCost(carQurDeal) {
  const url = parseQuery(API_URL, {
    method: 'WechatSite.GetStopParkingFree'
  }, false)
  const queryParams = {
    vpl_number: carQurDeal.carNo,
    park_code: storage.session.get('parkCode')
  }
  if (carQurDeal.couponList) {
    queryParams.coupon_info = carQurDeal.couponList
  }
  return fetchData(url, {
    data: queryParams,
    runtimeData: {
      EB_ACTION: 'WechatSite.GetStopParkingFree'
    }
  })
}
// 我方积分、卡券抵消扣减
export function carPayDeduction(carQurDeal) {
  const url = parseQuery(API_URL, {
    method: 'WechatSite.ZhiFuKouJian'
  }, false)
  const queryParams = carQurDeal
  return fetchData(url, {
    data: queryParams,
    runtimeData: {
      EB_ACTION: 'WechatSite.ZhiFuKouJian'
    }
  })
}
// 第三方抵扣扣减接口
export function tcwDeduction(data) {
  const url = parseQuery(API_URL, {
    method: 'WechatSite.PayParkingFree'
  }, false)
  // const queryParams = data
  return fetchData(url, {
    data: data,
    runtimeData: {
      EB_ACTION: 'WechatSite.PayParkingFree'
    }
  })
}
// 停车场支付成功后的操作
export function carPayforBack(carQurDeal) {
  const url = parseQuery(API_URL, {
    method: 'WechatSite.EndRecordParkingFeeData'
  }, false)
  const queryParams = carQurDeal
  return fetchData(url, {
    data: queryParams,
    runtimeData: {
      EB_ACTION: 'WechatSite.EndRecordParkingFeeData'
    }
  })
}

// 根据手机号码获取会员信息
export function fetchUserInfoByPhone(phone) {
  const url = parseQuery(API_URL, {
    method: 'GetVipBaseInfoByMobile'
  }, false)
  const queryParams = {
    Mobile: phone,
    Mallid: MALL_ID()
  }
  return fetchData(url, {
    data: queryParams,
    runtimeData: {
      EB_ACTION: 'GetVipBaseInfoByMobile'
    }
  })
}
