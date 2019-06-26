<template>
  <page type="service-scores" title="自助">
    <!--<div class="top-rainbow"></div>-->
    <div class="page-content">
      <div class="btn-scan">
        <div class="btn-sub">
          <i class="icon icon-photo" @click="toPhotoIng"></i>
          <span>拍照</span>
        </div>
        <div class="btn-sub">
          <i class="icon icon-scan" @click="scanQR"></i>
          <span>扫码</span>
        </div>
      </div>
      <div class="tip-area">
        <!--<h3 class="title">温馨提示：</h3>-->
        <p class="txt">请扫描销售小票二维码，</p>
        <p class="txt">若无法扫描请到服务台&nbsp;&nbsp;&nbsp;&nbsp;</p>
      </div>
    </div>
    <div slot="children-view">
      <page-view :cache="false"/>
    </div>
  </page>
</template>

<script>
  import Page from '../../../components/page/page'
  import PageView from '../../../components/page-view/page-view'
  import wx from 'weixin-js-sdk'
  import storage from 'good-storage'
  import {utilMixin} from '../../../common/mixins/util'
  import {selfServicePoints} from '../../../api/service-score'
  import {deviceInfo} from '../../../common/utils'

  const PAGE_NAME = 'service-scores'

  export default {
    name: PAGE_NAME,
    mixins: [utilMixin],
    data() {
      return {
        qrCode: ''
      }
    },
    activated() {
      // 兼容直接调用微信扫一扫的操作
      if (this.$route.query.code) {
        this.qrCode = this.$route.query.code
        this.serviceScoreFn()
      }
      this.wxConfiFun()
    },
    beforeRouteUpdate(to, from, next) {
      if (to.name === PAGE_NAME) {
        this.wxConfiFun()
      }
      next()
    },
    methods: {
      wxConfiFun() {
        if (storage.session.get('wxConfig') && deviceInfo().android) {
          wx.config(storage.session.get('wxConfig'))
        }
      },
      toPhotoIng() {
        this._openAlert('敬请期待！')
//        this.$router.push({
//          name: 'service-photo'
//        })
      },
      scanQR() {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
          success: res => {
            const codeFlag = '?code='
            if (res.resultStr.indexOf(codeFlag) !== -1) {
              console.log('res.resultStr', res.resultStr)
              let resultArr = res.resultStr.split(codeFlag)
              this.qrCode = resultArr[1]
 //              http://wxapp.tech-trans.com.cn/G5Plaza_test/#/service-scores?code=
                this.serviceScoreFn()
            } else {
              console.warn('二维码异常，无法获取code')
              this._openAlert(`二维码异常，无法获取code：${res.resultStr},或请使用拍照积分！`)
            }
          },
          complete: res => {
            console.log(res)
          }
        })
      },
      serviceScoreFn() {
        if (this.qrCode) {
          this._openToast('录入中，请稍后', {mask: true})
          selfServicePoints(this.qrCode).then(() => {
            this._closeToast()
            this._openAlert('自助积分成功，请查看积分记录')
          }).catch(err => {
            this._closeToast()
            if (err.message !== '网络异常，请检查当前网络是否顺畅') {
              this._openAlert(err.message)
            }
          })
        }
      }
    },
    components: {
      Page,
      PageView
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @require '~common/stylus/mixin'
  @require '~common/stylus/variables'

  .service-scores-page
    .page-content
      padding: 0 30px
    .btn-scan
      /*margin-bottom: 10px*/
      padding-top: 20px
      padding-bottom: 40px
      text-align: center
      // border-bottom: 1px dotted $color-purple
      font-size: $fontsize-large-xx
      .btn-sub
        display: flex
        flex-direction : column
        justify-content : center
        align-items : center
        padding: 25px 0
        .icon-scan, .icon-photo
          width: 120px
          height: 120px
          padding: 10px 0
          bg-image('./service_score')
        .icon-photo
          bg-image('./photo')
    .tip-area
      padding: 10px 0px
      margin: 0 6%
      color: $color-title-gray
      border: 1px dotted $color-title-gray
      text-align : center
      .title
        line-height: 34px
        font-size: $fontsize-large-xx
      .txt
        line-height: 24px
        font-size: $fontsize-large

</style>
