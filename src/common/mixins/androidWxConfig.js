import storage from 'good-storage'
import wx from 'weixin-js-sdk'
import {deviceInfo} from '../utils'
import {fetchConfigInfo} from '../../api/wx'
export const androidWxConfig = {
  data() {
    return {
      configOpt: {}
    }
  },
  methods: {
    _wxConfig() {
      // 用于某些android要多次验证使用
      if (storage.session.get('wxConfig') && deviceInfo().android) {
        wx.config(storage.session.get('wxConfig'))
        wx.error(res => {
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
          this.configOpt = storage.session.get('wxConfig')
          storage.session.removeItem('wxConfig')
          this._wxConfig()
        })
      } else {
        this._openToast()
        fetchConfigInfo().then(res => {
          const wxConfig = Object.assign({}, this.configOpt, {
            appId: res.appId,
            timestamp: res.timestamp,
            nonceStr: res.nonceStr,
            signature: res.signature
          })
          storage.session.set('wxConfig', wxConfig)
          wx.config(wxConfig)
          this._closeToast()
        }).catch(err => {
          this._closeToast()
          this._openAlert(err)
        })
      }
    }
  }
}
