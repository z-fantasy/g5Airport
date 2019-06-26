<template>
  <page type="carHome" ref="page">
    <div :style="{height: cHeight}">
      <div class="car-home-content">
        <cube-scroll ref="scroll">
          ... // carhome
          <div>
            <img src="" alt="">
            <div>
            </div>
          </div>
        </cube-scroll>
      </div>
      <car-park-bar></car-park-bar>
    </div>
    <div slot="children-view">
      <page-view/>
    </div>
  </page>
</template>

<script type="text/ecmascript-6">
  import Page from '../../../components/page/page.vue'
  import PageView from '../../../components/page-view/page-view'
  import CarParkBar from '../../../components/car-park-bar/car-park-bar.vue'
  export default {
    name: 'carHome',
    data() {
      return {
        cHeight: `${document.body.clientHeight}px`
      }
    },
    activated() {
      this.cHeight = `${document.body.clientHeight}px`
    },
    components: {
      Page,
      PageView,
      CarParkBar
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .car-home-content
    height: calc(100% - 50px)
    padding-bottom: 50px
</style>
