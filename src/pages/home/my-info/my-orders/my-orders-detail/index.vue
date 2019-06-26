<template>
  <page type="my-orders-detail" title="沙龙详情">
    <salon-detail-view ref="salonView"/>
  </page>
</template>

<script>
  import Page from '../../../../../components/page/page'
  import SalonDetailView from '../../../../../components/salon-detail-view/salon-detail-view'

  const PAGE_NAME = 'my-orders-detail'

  export default {
    name: PAGE_NAME,
    components: {
      Page,
      SalonDetailView
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">

</style>
