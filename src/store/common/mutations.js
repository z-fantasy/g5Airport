import * as types from './mutation-types'

const mutations = {
  [types.SET_LOADING_STATUS](state, loadingStatus) {
    state.loadingStatus = loadingStatus
  },
  [types.SET_IMG_HOST](state, imgHost) {
    state.imgHost = imgHost
  },
  [types.SET_SHOW_BIND](state, showBind) {
    state.showBind = showBind
  }
}

export default mutations
