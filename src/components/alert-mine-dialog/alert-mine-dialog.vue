<template>
  <cube-popup ref="alertPopup">
    <div class="game-dialog extend-popup-content">
      <div class="content-wrapper">
        <div class="content-dialog">
          <div class="img">
          </div>
          <p class="prize-tip">{{'prize-tip'}}</p>
          <p class="prize-list-tip">本奖品还包含以下福利：</p>
          <ul class="prize-list">
            <li>{{1}}</li>
          </ul>
          <p>
            详情请到我的券包中查看
          </p>
        </div>
      </div>
      <div class="btn-confirm" @click="close">
        <span>确定</span>
      </div>
    </div>
  </cube-popup>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'alert-mine-dialog',
    data() {
      return {
        ruleTxt: ''
      }
    },
    methods: {
      show(ruleTxt) {
        this.ruleTxt = ruleTxt
        this.$refs.alertPopup.show()
      },
      close() {
        this.$emit('aletMine')
        this.$refs.alertPopup.hide()
      }
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .game-dialog.extend-popup-content
    background-color: #fff
    border-radius:6px
    text-align:center
    .content-wrapper
      max-width:270px
      .title-dialog
        padding:15px 0
        font-size:16px
        color:#fff
        text-align:center
        background-repeat:no-repeat
        /*background-image:url(./dialog-title.png)*/
        background-position: center
        background-size:100% 100%
      .content-dialog
        box-sizing:border-box
        padding:15px
        text-align:justify
        font-size:14px
        display: flex
        flex-direction : column
        justify-content : center
        align-items : center
        .img
          display:flex
          justify-content:center
          width: 104px
          height: 104px
          margin: 15px 0
          bg-image('./sign_icon_tips_success')
          background-size : 100%
          background-repeat : no-repeat
          .prize-img
            margin:0 auto 10px
            max-width:70px
            max-height:70px
        .prize-tip
          font-size:16px
          margin-bottom:10px
        .prize-list-tip
          margin-bottom:5px
        .prize-list
          margin-bottom:5px
    .btn-confirm
      padding: 0 15px 15px 15px
      font-size:16px
      color:#666
      span
        display: inline-block
        padding: 4px 24px
        border-radius : 4px
        color: orange
        border: 1px solid orange
</style>
