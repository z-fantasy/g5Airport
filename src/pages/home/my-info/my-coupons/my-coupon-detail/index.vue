<template>
  <page type="my-coupon-detail" title="券包详情">
    <div class="top-rainbow"></div>
    <coupon-detail-view @use="onUse"/>
    <div slot="children-view">
      <scan-user-code id="card-detail-code" ref="codePopup" @hide="onPopupClose"/>
    </div>
  </page>
</template>

<script type="text/ecmascript-6">
  import Page from '../../../../../components/page/page'
  import CouponDetailView from '../../../../../components/my-coupon-detail-view/my-coupon-detail-view'
  import ScanUserCode from '../../../../../components/scan-user-code/scan-user-code'

  const PAGE_NAME = 'my-coupon-detail'
  export default {
    name: PAGE_NAME,
    methods: {
      onPopupClose() {
        this.$router.back()
      },
      onUse(info) {
        this.$refs.codePopup.show(info)
      }
    },
    components: {
      Page,
      CouponDetailView,
      ScanUserCode
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
