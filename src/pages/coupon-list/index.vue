<template>
  <page type="coupon-list" title="我的券包" :customScroll="false">
    <div class="top-rainbow"></div>
    <my-coupons-view></my-coupons-view>
    <div slot="children-view">
      <page-view/>
    </div>
  </page>
</template>

<script>
  import Page from '../../components/page/page'
  import PageView from '../../components/page-view/page-view'
  import MyCouponsView from '../../components/my-coupons-view/my-coupons-view'

  const PAGE_NAME = 'coupon-list'

  export default {
    name: PAGE_NAME,
    components: {
      Page,
      PageView,
      MyCouponsView
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">

</style>
