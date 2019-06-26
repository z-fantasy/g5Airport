<template>
  <signin-daily></signin-daily>
</template>

<script>
  import SigninDaily from '../../signin-daily'
  import {userMixin} from '../../../../common/mixins/user'
  import {utilMixin} from '../../../../common/mixins/util'

  const PAGE_NAME = 'center-signin-daily'
  let now = new Date()

  export default {
    name: PAGE_NAME,
    mixins: [userMixin, utilMixin],
    data() {
      return {}
    },
    components: {
      SigninDaily
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @require '~common/stylus/variables'
  @require '~common/stylus/mixin.styl'

  .signin-daily-page
    .sign-content
      box-sizing:border-box
      padding:30px 20px
      .top-info
        text-align:center
        color:$color-purple
        .sub-title
          line-height: 18px
          font-size:16px
  .operation
    padding: 20px 16px
  .nail-wrapper
    position: relative
    background-color: pink
    z-index: 1
    .icon-nail
      position: absolute
      top: 5px
      width: 20px
      height: 30px
      background-repeat: no-repeat
      background-position: center
      background-size:contain
      bg-image('./nail')
      &:after
        position: absolute
        bottom: -5px
        left: 2px
        width: 15px
        height: 15px
        content: ''
        border-radius: 50%
        background-color: #fff
        z-index: -1
      &:first-child
        left: 40px
      &:last-child
        right: 40px
</style>
