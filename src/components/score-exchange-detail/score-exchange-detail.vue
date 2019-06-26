<template>
  <div class="score-exchange-detail-view">
    <detail-content
      :detailInfo="detailInfo"
      :hasBtn="true"
      :btnTxt="'立即兑换'"
      :type="'gift'"
      @goNext="goExchange"/>
  </div>
</template>

<script>
  import DetailContent from '../detail-content/detail-content'
  import {fetchGiftDetail, exchangeCoupon} from '../../api/coupon'
  import {utilMixin} from '../../common/mixins/util'
  import {userMixin} from '../../common/mixins/user'
  import {createCouponObj} from '../../common/models/Coupon'

  const COMPONENT_NAME = 'score-exchange-detail'
  export default {
    name: COMPONENT_NAME,
    mixins: [utilMixin, userMixin],
    data() {
      return {
        detailInfo: {}
      }
    },
    activated() {
      let ticketId = this.$route.params.id
      if (ticketId) {
        this._getDetailInfo(ticketId)
      } else {
        this.$router.back()
      }
    },
    methods: {
      goExchange() {
        let tipTxt = `兑换此券需要花费${this.detailInfo.score}个积分，确定立即兑换？`
        this._openConfirm(tipTxt, {
          onConfirm: () => {
            this._exchangeTicket()
          }
        })
      },
      _getDetailInfo (id) {
        this._openToast('信息加载中...', {mask: true})
        fetchGiftDetail(id).then(coupon => {
          this._closeToast()
          this.detailInfo = createCouponObj(coupon)
        }).catch(err => this._errorCatchHandler(err))
      },
      _exchangeTicket() {
        this._openToast('兑换中...', {mask: true})
        exchangeCoupon(this.detailInfo.id).then(flag => {
          this._closeToast()
          this._getUserInfo()
          if (flag) {
            this._openAlert('兑换成功，请到我的账户>我的券包查看')
          } else {
            this._openAlert('兑换失败，请重试')
          }
        }).catch(err => this._errorCatchHandler(err))
      }
    },
    components: {
      DetailContent
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
