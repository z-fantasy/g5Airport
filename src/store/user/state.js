import {loadUser} from '../../common/cache'

const state = {
  userInfo: loadUser(),
  activityId: ''
}

export default state
