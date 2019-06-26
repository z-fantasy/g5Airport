<template>
  <page type="exchange-detail" title="礼券详情">
    <!--<div class="top-rainbow"></div>-->
    <score-exchange-detail></score-exchange-detail>
  </page>
</template>

<script>
  import Page from '../../../../components/page/page'
  import PageView from '../../../../components/page-view/page-view'
  import ScoreExchangeDetail from '../../../../components/score-exchange-detail/score-exchange-detail'

  const PAGE_NAME = 'exchange-detail'

  export default {
    name: PAGE_NAME,
    components: {
      Page,
      PageView,
      ScoreExchangeDetail
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">

</style>
