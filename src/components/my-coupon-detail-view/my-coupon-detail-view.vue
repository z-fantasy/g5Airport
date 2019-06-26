<template>
  <div class="coupon-detail-wrapper">
    <detail-content
      :hasBtn="true"
      :btnTxt="btnTxt"
      :btnStatus="btnStatus"
      :detailInfo="couponDetail"
      :type="'card'"
      @goNext="goNext"
    />
  </div>
</template>

<script>
  import {fetchGiftDetail} from '../../api/coupon'
  import {createCouponObj} from '../../common/models/Coupon'
  import DetailContent from '../../components/detail-content/detail-content'
  import {utilMixin} from '../../common/mixins/util'

  const COMPONENT_NAME = 'my-coupon-detail-view'
  export default {
    name: COMPONENT_NAME,
    mixins: [utilMixin],
    data() {
      return {
        couponDetail: {},
        couponData: {}
      }
    },
    created() {
      const couponId = this.$route.params.id
      if (couponId) {
        this._getCouponDetail(couponId)
        this.couponData = this.$route.params.couponData
        this.getStatus(this.couponData)
      } else {
        this.$router.back()
      }
    },
    methods: {
      goNext() {
        this.$emit('use', this.couponData)
      },
      getStatus(info) {
        if (info.useStatus === '已使用') {
          this.btnTxt = info.useStatus
          this.btnStatus = 1
          return
        }

        if (info.status === '已过期') {
          this.btnTxt = info.status
          this.btnStatus = 2
          return
        }
        this.btnTxt = '立即使用'
        this.btnStatus = 0
      },
      _getCouponDetail(id) {
        this._openToast('信息加载中...', {mask: true}, true, 'detailInfoLoading')
        fetchGiftDetail(id).then(res => {
          this._closeToast('detailInfoLoading')
          this.couponDetail = createCouponObj(res)
        }).catch(err => {
          this._closeToast('detailInfoLoading')
          this._openAlert(err.errmsg)
        })
      }
    },
    components: {
      DetailContent
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .coupon-detail-wrapper
    position: relative
</style>
