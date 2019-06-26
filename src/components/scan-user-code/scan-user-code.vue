<template>
  <cube-popup ref="popup">
    <div class="scan-user-code extend-popup-content">
      <div class="content-wrapper">
        <h3 class="title">
          <span>{{title}}</span>
        </h3>
        <p class="code" v-if="code">
          <span v-text="'兑换码: '+this.code"></span>
        </p>
        <p v-if="validTime" class="valid-time" v-text="validTime"></p>
        <barcode class="bar-code" v-if="code && showBarCode" :value="this.code" :options="{displayValue: false, height:80}"/>
        <div ref="qrCode" v-if="code && showQrCode" class="qr-code"></div>
        <img class="tt-image" v-if="!showBarCode && !showQrCode" :src="logoImg" width="100%" height="auto">
      </div>
      <div class="btn-cancel" @click="onClose" v-if="showBack">
        <span>取消</span>
      </div>
    </div>
  </cube-popup>
</template>

<script>
  import VueBarcode from '@xkeshi/vue-barcode'
  import QRCode from '../../common/libs/qrcode'

  export default {
    props: {
      showBarCode: {
        type: Boolean,
        default: true
      },
      showQrCode: {
        type: Boolean,
        default: true
      },
      showBack: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        title: '',
        code: '',
        validTime: ''
      }
    },
    methods: {
      initQRCode (val) {
        this.$nextTick(() => {
          if (!this.qrcode) {
            this.qrcode = new QRCode(this.$refs.qrCode, {
              text: val,
              width: 270,
              height: 270
            })
          } else {
            this.qrcode.makeCode(val)
          }
        })
      },
      show({title = '', time = '', redeemId = ''}) {
        this.title = title
        this.validTime = time
        this.code = redeemId
        this.$refs.popup.show()
        this.initQRCode(this.code)
      },
      hide() {
        this.$refs.popup.hide()
        this.qrcode.clear()
        this.$emit('hide')
      },
      onClose() {
        this.$refs.popup.hide()
        this.qrcode.clear()
        this.$emit('close')
      }
    },
    watch: {
      code(val) {
        this.initQRCode(val)
      }
    },
    components: {
      barcode: VueBarcode
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @require '~common/stylus/mixin'

  .scan-user-code.extend-popup-content
    background-color: #fff
    border-radius:6px
    text-align:center
    .content-wrapper
      padding:10px 20px 0
      line-height: 1.5
      font-size: 16px
      .title
        font-size: 20px
        margin-top:5px
        margin-bottom:5px
      .code
        margin-bottom:5px
      .bar-code
        max-width:270px
      .qr-code
        display:block
        margin:0 auto 10px auto
      .tt-image
        max-width:280px
    .btn-cancel
      padding:10px 0
      font-size:16px
      border-top-1px(#eee,0)
    .cube-popup-center
      .cube-popup-content
        padding: 0 16px
</style>
