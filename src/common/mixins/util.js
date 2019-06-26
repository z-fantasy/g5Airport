import {
  TOAST_NAME,
  ALERT_NAME,
  CONFIRM_NAME,
  NETWORK_ERROR_TEXT,
  NETWORK_ERROR_CODE,
  REQUEST_TIME_OUT_TEXT,
  TIME_OUT_ERROR_CODE
} from '../config'
import {mapGetters} from 'vuex'

export const utilMixin = {
  data() {
    return {
      imgPrefix: ''
    }
  },
  computed: {
    ...mapGetters([
      'imgHost'
    ])
  },
  methods: {
    _openGAlert(options = {}, pageType = '', callBack, name = ALERT_NAME) {
      const opts = Object.assign({}, {
        btnText: '确定',
        title: '',
        content: ''
      }, options)
      this[name] = this.$createDialog({
        type: 'alert',
        confirmBtn: {
          text: opts.btnText,
          active: true
        },
        onConfirm: () => {
          if (callBack) {
            callBack()
          }
        }
      }, (createElement) => {
        return [
          createElement('div', {
            'class': {
              'my-title': true
            },
            slot: 'title'
          }, [
            createElement('div', {
              'class': {
                'my-title-img': true,
                'signinTitIcon': pageType === 'signin'
              }
            }),
            createElement('p', opts.title)
          ]),
          createElement('p', {
            'class': {
              'my-content-alert': true
            },
            slot: 'content'
          }, opts.content)
        ]
      })
      this[name].show()
    },
    _openToast(txt = '加载中', options = {}, isSingle = true, name = TOAST_NAME) {
      const opts = Object.assign({}, {txt, mask: false, time: 0}, options)
      this[name] = this.$createToast(opts, isSingle)
      this[name].show()
    },
    _closeToast(name = TOAST_NAME) {
      this[name].hide()
    },
    _openAlert(content, options = {}, isSingle = true, name = ALERT_NAME) {
      if (parseInt(content) === TIME_OUT_ERROR_CODE) {
        content = REQUEST_TIME_OUT_TEXT + ',请稍后再试'
      }
      const opts = Object.assign({}, {content, icon: 'cubeic-alert'}, options)
      this[name] = this.$createDialog(opts, isSingle)
      this[name].show()
    },
    _closeAlert(name = ALERT_NAME) {
      this[name].hide()
    },
    _openConfirm(content, options = {}, isSingle = true, name = CONFIRM_NAME) {
      const opts = Object.assign({}, {type: 'confirm'}, options)
      this._openAlert(content, opts, isSingle, name)
    },
    _closeConfirm(name = CONFIRM_NAME) {
      this[name].hide()
    },
    _netErrorHandler(message) {
      if (parseInt(message) === NETWORK_ERROR_CODE) {
        this._openAlert(NETWORK_ERROR_TEXT)
      }
      if (parseInt(message) === TIME_OUT_ERROR_CODE) {
        this._openAlert(REQUEST_TIME_OUT_TEXT)
      }
    },
    _errorCatchHandler(err, timeoutFlag, networkFlag) {
      this._closeToast()
      let tip = typeof err === 'string' ? err : err.message ? err.message : ''
      if (tip) {
        if ((timeoutFlag && parseInt(tip) === NETWORK_ERROR_CODE) || (networkFlag && parseInt(tip) === TIME_OUT_ERROR_CODE)) {
          return
        }

        tip = parseInt(tip) === NETWORK_ERROR_CODE ? NETWORK_ERROR_TEXT : parseInt(tip) === TIME_OUT_ERROR_CODE ? REQUEST_TIME_OUT_TEXT : tip

        this._openAlert(tip)
      }
    }
  },
  watch: {
    imgHost: {
      handler(val) {
        this.imgPrefix = val
      },
      immediate: true
    }
  }
}
