<template>
  <page type="my-orders" title="我的预约">
    <!--<div class="top-rainbow"></div>-->
    <my-orders-view ref="myYuYue"></my-orders-view>
    <div slot="children-view">
      <page-view/>
    </div>
  </page>
</template>

<script>
  import Page from '../../../../components/page/page'
  import PageView from '../../../../components/page-view/page-view'
  import MyOrdersView from '../../../../components/my-orders-view/my-orders-view'

  const PAGE_NAME = 'my-orders'

  export default {
    name: PAGE_NAME,
    beforeRouteUpdate (to, from, next) {
      if (to.name === PAGE_NAME && from.name !== PAGE_NAME) {
        this.$refs.myYuYue._getMyActivity()
      }
      next()
    },
    components: {
      Page,
      PageView,
      MyOrdersView
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">

</style>
