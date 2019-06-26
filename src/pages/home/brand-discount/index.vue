<template>
  <page type="brand-discount" :title="title">
    <!--<div class="top-rainbow"></div>-->
    <brand-list></brand-list>
    <div slot="children-view">
      <page-view/>
    </div>
  </page>
</template>

<script>
  import Page from '../../../components/page/page'
  import PageView from '../../../components/page-view/page-view'
  import BrandList from '../../../components/brand-list-view/brand-list-view'

  const PAGE_NAME = 'brand-discount'

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
        this.title = '品牌折扣'
      }
    },
    components: {
      Page,
      PageView,
      BrandList
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">

</style>
