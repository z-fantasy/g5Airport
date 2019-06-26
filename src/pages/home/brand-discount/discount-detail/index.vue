<template>
  <page type="discount-detail" title="折扣详情" ref="brandDetail">
    <!--<div class="top-rainbow"></div>-->
    <brand-detail-view></brand-detail-view>
  </page>
</template>

<script>
  import Page from '../../../../components/page/page'
  import PageView from '../../../../components/page-view/page-view'
  import BrandDetailView from '../../../../components/brand-detail/brand-detail'
  import EventBus, {EVENT_IMG_BRAND_DETAIL_LOAD} from '../../../../common/eventBus'

  const PAGE_NAME = 'discount-detail'

  export default {
    name: PAGE_NAME,
    mounted() {
      EventBus.$on(EVENT_IMG_BRAND_DETAIL_LOAD, () => {
        if (this.$refs.brandDetail) {
          this.$refs.brandDetail.refresh()
        }
      })
    },
    components: {
      Page,
      PageView,
      BrandDetailView
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">

</style>
