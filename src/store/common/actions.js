import * as types from './mutation-types'
export const showVipBind = function({commit}) {
  commit(types.SET_SHOW_BIND, true)
}
export const closeVipBind = function({commit}) {
  commit(types.SET_SHOW_BIND, false)
}
