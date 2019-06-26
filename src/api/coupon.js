import {API_URL, METHOD_POST, MALL_ID, OPERATOR_USER} from './config'
import {parseQuery} from '../common/utils'
import fetchData from '../common/fetch-data'
import store from '../store'
import {openidUtils} from '../common/wx-utils'

// 获取我的券包列表
export function fetchMyCoupons(indexId, statusIndex) {
  const typeId = indexId ? '2' : '0,1,3,4'
  const parkTick = indexId === 2 ? 'Wct_TicketPackageVipParking' : 'Wct_TicketPackageVip'
  const url = parseQuery(API_URL, {
    ext: 1,
    method: parkTick
  }, false)
  let paramsInfo = [
    {
      key: '@openid',
      value: openidUtils.get()
    },
    {
      key: '@Gid',
      value: indexId === 2 ? 'T000001' : ''
    },
    {
      key: '@action', // 已使用
      value: statusIndex === 1 ? '1' : '' // 2
    },
    {
      key: '@OutOfDate',
      value: statusIndex === 2 ? '1' : '' // 3 已过期
    },
    {
      key: '@PeriodOfTime',
      value: statusIndex === 0 ? '1' : '' // 有效/未使用
    }
  ]
  if (indexId !== 2) {
    paramsInfo.push(
      {
        key: '@Type', // 优惠券值为0,1,3,4  礼品券值为2, 停车券不需要这个值 ;; 券种类：0现金券， 1折扣券
        value: typeId
      }
    )
    // paramsInfo.push(
    //   {
    //     key: '@TicketDue',
    //     value: statusIndex === '' // 1 ? '1' : '' 即将到期
    //   }
    // )
    paramsInfo.push(
      {
        key: '@NotInLY01',
        value: ''
      }
    )
  }
  // console.log(paramsInfo)
  return fetchData(url, METHOD_POST, {
    data: paramsInfo,
    runtimeData: {
      EB_ACTION: 'Wct_TicketPackageVip'
    }
  })
}

// 获取券详情
export function fetchGiftDetail(id) {
  const url = parseQuery(API_URL, {
    method: 'Wct_GetTicketDetail',
    ext: 1
  }, false)
  const queryParams = [{key: '@Tid', value: id}, {key: '@VipCode', value: store.getters.userInfo.code}]
  return fetchData(url, METHOD_POST, {
    data: queryParams,
    runtimeData: {
      EB_ACTION: 'Wct_GetTicketDetail',
      EB_TICKETID: id
    }
  })
}

// 获取积分兑礼分组信息
export function fetchGiftGroup() {
  const url = parseQuery(API_URL, {
    method: 'Wct_GetTicketGroup',
    ext: 1
  }, false)
  return fetchData(url, METHOD_POST, {
    runtimeData: {
      EB_ACTION: 'Wct_GetTicketGroup'
    }
  })
}

// 根据分组获取积分兑礼券
export function fetchCouponListById(id) {
  const url = parseQuery(API_URL, {
    method: 'Wct_GetTicketByGroupID',
    ext: 1
  }, false)
  const queryParams = [
    {
      key: '@VipCode',
      value: store.getters.userInfo.code
    },
    {
      key: '@Mallid',
      value: MALL_ID()
    }
  ]
  id && queryParams.push({key: '@GId', value: id})
  return fetchData(url, METHOD_POST, {
    data: queryParams,
    runtimeData: {
      EB_ACTION: 'Wct_GetTicketByGroupID'
    }
  })
}

// 可兑换的停车券
export function fetchCarCouponList() {
  const url = parseQuery(API_URL, {
    method: 'Wct_GetTicketByGroupIDParking',
    ext: 1
  }, false)
  const queryParams = [
    {
      key: '@VipCode',
      value: store.getters.userInfo.code
    },
    {
      key: '@Mallid',
      value: MALL_ID()
    },
    {
      key: '@GId',
      value: 'T000001'
    }
  ]
  return fetchData(url, METHOD_POST, {
    data: queryParams,
    runtimeData: {
      EB_ACTION: 'Wct_GetTicketByGroupIDParking'
    }
  })
}

// 根据用户可兑换的优惠券
export function fetchCouponListByUser() {
  const url = parseQuery(API_URL, {
    method: 'Wct_GetTicketCanBeCashing',
    ext: 1
  }, false)
  const queryParams = [
    {
      key: '@VipCode',
      value: store.getters.userInfo.code
    },
    {
      key: '@Mallid',
      value: MALL_ID()
    }
  ]
  return fetchData(url, METHOD_POST, {
    data: queryParams,
    runtimeData: {
      EB_ACTION: 'Wct_GetTicketCanBeCashing'
    }
  })
}

// 兑换优惠券
export function exchangeCoupon(ticketId) {
  const url = parseQuery(API_URL, {
    method: 'System_GiveTicket'
  }, false)
  const queryParams = {
    vipcode: store.getters.userInfo.code,
    mallid: MALL_ID(),
    ticketid: ticketId,
    user: OPERATOR_USER,
    action: 'F',
    reasoncode: 'F'
  }
  return fetchData(url, METHOD_POST, {
    data: queryParams,
    runtimeData: {
      EB_ACTION: 'System_GiveTicket',
      EB_TICKETID: ticketId
    }
  })
}
