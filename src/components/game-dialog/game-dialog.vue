<template>
  <cube-popup ref="popup">
    <div class="game-dialog extend-popup-content">
      <div class="content-wrapper">
         <!--<div class="title-dialog">-->
           <!--<span>中奖提示</span>-->
         <!--</div>-->
         <div class="content-dialog">
           <div class="img">
             <!--<img class="prize-img" :src="prizeImg">-->
           </div>
           <p class="prize-tip">{{prizeTip}}</p>
           <p class="prize-list-tip" v-if="prizeList.length > 1">本奖品还包含以下福利：</p>
           <ul class="prize-list" v-if="prizeList.length > 1" v-for="item in prizeList">
             <li>{{item}}</li>
           </ul>
           <p v-if="prizeList.length > 1">
             详情请到我的券包中查看
           </p>
         </div>
      </div>
      <div class="btn-confirm" @click="hide">
        <span>确定</span>
      </div>
    </div>
  </cube-popup>
</template>

<script>
  const COMPONENT_NAME = 'game-dialog'

  const EVENT_CLOSE = 'close'

  export default {
    name: COMPONENT_NAME,
    data() {
      return {
        prizeImg: '',
        prizeTip: '',
        prizeList: []
      }
    },
    methods: {
      show(imgUrl, tip, list) {
        this.prizeImg = imgUrl
        this.prizeTip = tip
        this.prizeList = list
        this.$refs.popup.show()
      },
      hide() {
        this.$emit(EVENT_CLOSE)
        this.$refs.popup.hide()
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/mixin.styl'
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
        background-image:url(./dialog-title.png)
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
          bg-image('./game_icon_prize')
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
