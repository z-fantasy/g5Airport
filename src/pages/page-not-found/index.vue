<template>
  <page class="page-not-found" :bgColor="'#EFF0F4'" :customScroll="false">
    <div class="icon-img"></div>
    <p class="desc">亲，对应内容飞走了</p>
    <!--找不到页面-->
  </page>
</template>

<script>
  import Page from '../../components/page/page'
  const PAGE_NAME = 'page-not-found'

  export default {
    name: PAGE_NAME,
    components: {
      Page
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/mixin.styl'
  .icon-img
    margin: 100px 0 30px
    height: 120px
    background-repeat: no-repeat
    background-position: center
    background-size: contain
    /*background-image: url('./404.png')*/
    bg-image('./index_icon_empty')
  .desc
    line-height: 26px
    font-size: 22px
    text-align: center
    color: #666

</style>
