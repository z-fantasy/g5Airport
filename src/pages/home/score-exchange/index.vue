<template>
  <page type="score-exchange" :title="title" :initScroll="false">
    <score-exchange-view></score-exchange-view>
    <div slot="children-view">
      <page-view/>
    </div>
  </page>
</template>

<script>
  import Page from '../../../components/page/page'
  import PageView from '../../../components/page-view/page-view'
  import ScoreExchangeView from '../../../components/score-exchange-view/score-exchange-view'

  const PAGE_NAME = 'score-exchange'

  export default {
    name: PAGE_NAME,
    data() {
      return {
        title: ''
      }
    },
    created() {
      if (!this.$route.query.from) {
        this.title = ''
      } else {
        this.title = '积分兑礼'
      }
    },
    components: {
      Page,
      PageView,
      ScoreExchangeView
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">

</style>
