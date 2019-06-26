<template>
  <div class="no-result">
    <i class="icon" :class="iconClass"></i>
    <p class="tip">{{tipTxt}}</p>
  </div>
</template>

<script>
  const COMPONENT_NAME = 'no-result'

  export default {
    name: COMPONENT_NAME,
    props: {
      options: Object
    },
    data() {
      return {
        tipTxt: '',
        iconClass: ''
      }
    },
    created() {
      this.tipTxt = this.options && this.options.txt ? this.options.txt : '抱歉，暂无对应内容'
      this.iconClass = this.options && this.options.icon ? `icon-${this.options.icon}` : 'icon-no-result'
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  .no-result
    padding: 30px
    .icon
      display: block
      margin: 0 auto
      width: 100px
      height: 100px
    .icon-no-result
      bg-image('./no_result')
    .icon-no_coupon
      bg-image('./no_coupon')
    .tip
      line-height: 40px
      text-align: center
      font-size: 16px
      color: #888
</style>
