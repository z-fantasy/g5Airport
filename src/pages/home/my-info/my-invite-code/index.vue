<template>
  <page type="my-invite-code" title="我的邀请码">
    <div class="top-rainbow"></div>
    <div class="page-content">
      <p class="title">
        邀请好友扫二维码注册会员
      </p>
      <p class="desc">
        <span>{{desc}}</span>
      </p>
      <div class="card-no-qr-code" ref="qrCode"></div>
    </div>
  </page>
</template>

<script>
  import Page from '../../../../components/page/page'
  import QRCode from '../../../../common/libs/qrcode'
  import {utilMixin} from '../../../../common/mixins/util'
  import {userMixin} from '../../../../common/mixins/user'
  import {fetchInviteCodeDesc} from '../../../../api/common'
  import {HOME_URL} from '../../../../api/config'

  const PAGE_NAME = 'my-invite-code'

  export default {
    name: PAGE_NAME,
    mixins: [utilMixin, userMixin],
    data() {
      return {
        desc: ''
      }
    },
    created() {
      this.getInviteCodeDesc()
    },
    mounted() {
      setTimeout(this.generateQrCode, 20)
    },
    activated() {
      setTimeout(this.generateQrCode, 20)
    },
    methods: {
      getInviteCodeDesc() {
        fetchInviteCodeDesc().then(res => {
          if (res.length) {
            this.desc = res[0].STR_VALUE
          }
        }).catch(e => this._openAlert(e.message))
      },
      generateQrCode() {
        const url = `${HOME_URL}/#/register?invite_code=${this.userInfo.code}&invite_user=${encodeURIComponent(this.userInfo.name)}`
        if (!this.qrCode) {
          this.qrCode = new QRCode(this.$refs.qrCode, {
            text: url,
            width: 240,
            height: 240,
            colorDark: '#6C5F95'
          })
        } else {
          this.qrCode.makeCode(url)
        }
      }
    },
    components: {
      Page
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @require '~common/stylus/variables'

  .my-invite-code-page
    .page-content
      padding-top:30px
      .title
        text-align:center
        color:$color-purple
        font-size:18px
      .desc
        margin:0 40px
        text-align:justify
        text-indent:2em
        color:#E036F5
        font-size:16px
        line-height:1.25
        margin-top:30px
      .card-no-qr-code
        margin-top:30px
</style>
