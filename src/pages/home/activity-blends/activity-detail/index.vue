<template>
  <!--title="荟萃详情"-->
  <page type="activity-detail">
    <!--<div class="top-rainbow"></div>-->
    <blends-list></blends-list>
  </page>
</template>

<script>
  import Page from '../../../../components/page/page'
  import PageView from '../../../../components/page-view/page-view'
  import BlendsList from '../../../../components/blends-list/blends-list'

  const PAGE_NAME = 'activity-detail'

  export default {
    name: PAGE_NAME,
    components: {
      Page,
      PageView,
      BlendsList
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">

</style>
