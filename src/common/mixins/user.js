import {mapActions, mapGetters} from 'vuex'
import wx from 'weixin-js-sdk'
import {
  NETWORK_ERROR_CODE,
  TIME_OUT_ERROR_CODE
} from '../config'
import {openidUtils} from '../wx-utils'
import {fetchUserInfo} from '../../api/user'

export const userMixin = {
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  methods: {
    _getUserInfo(callback) {
      const openid = openidUtils.get()
      if (!openid) return
      fetchUserInfo().then(res => {
        this.saveUserInfo(res)
        if (!res[0].OpenId || res[0].OpenId !== openid) {
          this.clearUserInfo()
          this._openAlert(`信息不符：${res[0].OpenId ? ('Lopenid:' + openid + 'Nopenid:' + res[0].OpenId) : '返回信息中无openid'}`)
          // 有方的判断
          // this._openAlert('登录失效，请重新登录！', {
          //   onConfirm: () => {
          //     this.$router.push({
          //       name: 'login'
          //     })
          //   }
          // }, false, 'userAuthDialog')
          return
        }
        callback && callback.call(this)
      }).catch(e => {
        callback && callback.call(this)
        if (parseInt(e.message) === NETWORK_ERROR_CODE ||
          parseInt(e.message) === TIME_OUT_ERROR_CODE) {
          return
        }
        this._openAlert(e.message, {
          onConfirm: () => {
            this.clearUserInfo()
            if (e.message === '找不到该条件下的会员信息') {
              setTimeout(() => {
                wx.closeWindow()
              }, 100)
            }
            // 获取用户信息异常，回到登录页
            // this.$router.push({
            //   name: 'login'
            // })
          }
        })
      })
    },
    ...mapActions([
      'saveUserInfo',
      'clearUserInfo'
    ])
  }
}
