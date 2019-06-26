<template>
  <!--title="活动荟萃"-->
  <page type="activity-blends" ref="page" :bgColor="'#f7f3f7'">
    <!--<div class="top-rainbow"></div>-->
    <blend-types ref="blendTypeView"></blend-types>
    <div slot="children-view">
      <page-view :cache="false"/>
    </div>
  </page>
</template>

<script>
  import Page from '../../../components/page/page'
  import PageView from '../../../components/page-view/page-view'
  import BlendTypes from '../../../components/blends-type-list/blends-type-list'
  import EventBus, {EVENT_IMG_BRAND_DETAIL_LOAD} from '../../../common/eventBus'

  const PAGE_NAME = 'activity-blends'

  export default {
    name: PAGE_NAME,
    mounted() {
      EventBus.$on(EVENT_IMG_BRAND_DETAIL_LOAD, () => {
        if (this.$refs.page) {
          this.$refs.page.refresh()
        }
      })
    },
    beforeRouteUpdate(to, from, next) {
      if (to.name === PAGE_NAME) {
        this.$refs.blendTypeView._getBlendTypes()
      }
      next()
    },
    components: {
      Page,
      PageView,
      BlendTypes
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">

</style>
