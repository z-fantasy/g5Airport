<template>
  <page type="salon-detail" title="沙龙详情">
    <salon-detail-view ref="salonView"/>
    <div slot="children-view">
      <page-view/>
    </div>
  </page>
</template>

<script>
  import Page from '../../../../components/page/page'
  import PageView from '../../../../components/page-view/page-view'
  import SalonDetailView from '../../../../components/salon-detail-view/salon-detail-view'
  import store from '../../../../store/index'

  const PAGE_NAME = 'salon-detail'

  export default {
    name: PAGE_NAME,
    beforeRouteUpdate(to, from, next) {
      to.name === PAGE_NAME && this.$refs.salonView._getBrandInfo(this.$route.params.id || store.state.userModule.activityId)
      next()
    },
    components: {
      Page,
      PageView,
      SalonDetailView
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">

</style>
