<template>
  <cube-popup ref="rulePopup">
    <div class="game-rule-dialog">
      <div class="game-title">
        <span>抽奖规则</span>
        <i class="cubeic-close" @click="close"></i>
      </div>
      <div class="game-rule-cont">
        <div v-if="ruleTxt">
          <p v-html="ruleTxt"></p>
        </div>
        <div v-else>
          <p>1.登录抽奖页面，每次抽奖所需积分根据页面提示扣除；</p>
          <p>2.中奖名单每日统一公正抽取，保证公平公正公开；</p>
          <p>3.每款商品抽奖次数不限，抽奖机会一经兑换即不可取消或更改；</p>
        </div>
      </div>
      <div class="game-rule-sure">
        <span @click="close">我知道了</span>
      </div>
    </div>
  </cube-popup>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'game-rule-dialog',
    data() {
      return {
        ruleTxt: ''
      }
    },
    methods: {
      show(ruleTxt) {
        this.ruleTxt = ruleTxt
        this.$refs.rulePopup.show()
      },
      close() {
        this.$refs.rulePopup.hide()
      }
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import '~common/stylus/variables.styl'
  .game-rule-dialog
    background: #ffffff
    font-size : $fontsize-large
    /*margin: 0 10%*/
    border-radius : 8px
    overflow : hidden
    min-width: 200px
    max-width : 278px
    .game-title
      position relative
      height: 40px
      line-height : 40px
      text-align : center
      font-size : $fontsize-large-x
      color: #fff
      background: linear-gradient(to right, #f75d00, orange);
      .cubeic-close
        position : absolute
        right: 16px
        font-size : 20px
    .game-rule-cont
      padding: 20px
      color: #666
      /deep/ p
        padding-bottom: 14px
    .game-rule-sure
      padding-bottom: 24px
      text-align : center
      span
        display: inline-block
        padding: 8px 24px
        color: $color-orange
        border : 1px solid $color-orange
        border-radius : 4px
</style>
