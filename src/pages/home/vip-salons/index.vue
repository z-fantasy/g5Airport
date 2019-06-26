<template>
  <page type="vip-salons" title="特邀沙龙" :bgColor="'#f7f3f7'">
    <salon-list-view></salon-list-view>
    <div slot="children-view">
      <page-view/>
    </div>
  </page>
</template>

<script>
  import Page from '../../../components/page/page'
  import PageView from '../../../components/page-view/page-view'
  import SalonListView from '../../../components/salon-list-view/salon-list-view'

  const PAGE_NAME = 'vip-salons'

  export default {
    name: PAGE_NAME,
    components: {
      Page,
      PageView,
      SalonListView
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
</style>
