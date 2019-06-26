<template>
  <!--<page type="my-scores" title="我的积分" :customScroll="false">-->
  <page type="my-scores" title="我的积分" :initScroll="false">
    <my-score-view ref="scoreView"></my-score-view>
    <page-view/>
  </page>
</template>

<script>
  import Page from '../../../../components/page/page'
  import PageView from '../../../../components/page-view/page-view'
  import MyScoreView from '../../../../components/my-score-view/my-score-view'

  const PAGE_NAME = 'my-scores'

  export default {
    name: PAGE_NAME,
    beforeRouteUpdate(to, from, next) {
      if (to.name === PAGE_NAME) {
        this.$refs.scoreView.resetData()
      }
      next()
    },
    components: {
      Page,
      PageView,
      MyScoreView
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">

</style>
