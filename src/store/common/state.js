import storage from 'good-storage'
import {KEY_ASSETS_PREFIX} from '../../common/config'

const state = {
  loadingStatus: false,
  imgHost: storage.session.get(KEY_ASSETS_PREFIX, ''),
  showBind: false
}

export default state
