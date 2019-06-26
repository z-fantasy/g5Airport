<template>
  <div class="coupon-wrapper" >
    <div class="coupon">
      <div class="couponConArea" :class="`${(isUsed === '未使用' && !disabled) ? couponType : 'used'}-coupon`">
        <div class="coupon-content" @click="onClick('detail')">
          <div class="coupon-desc">
            <div class="coupon-img">
              <div class="badge" v-if="badgeUrl" :style="{backgroundImage: `url(${this.badgeUrl})`}"></div>
              <img class="img" v-lazy="imgUrl" ref="logoImg">
            </div>
            <div class="coupon-title">
              <div class="title" v-text="title"></div>
              <div class="sub-title" v-html="subTitle"></div>
              <div class="excBonus" v-if="score">兑换积分 {{score}}</div>
              <div class="time" v-text="tipTime"></div>
            </div>
          </div>
        </div>
        <div class="coupon-attachment" @click="onClick('use')" :class="{disabled}">
          <div>
            <span v-text="btnText"></span>
          </div>
        </div>
      </div>

    </div>
    <div class="coupon-info">
      <!--<div v-if="tipScore" class="score">-->
        <!--<span v-text="tipScore"></span>-->
      <!--</div>-->
      <!--<div class="time">-->
        <!--<span v-text="tipTime"></span>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
  const COMPONENT_NAME = 'coupon-item'

  export default {
    name: COMPONENT_NAME,
    props: {
      status: {
        type: String,
        default: ''
      },
      isUsed: {
        type: String,
        default: ''
      },
      redeemId: {
        type: String,
        default: ''
      },
      couponId: {
        type: [Number, String],
        default: ''
      },
      badgeUrl: {
        type: String,
        default: ''
      },
      imgUrl: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      },
      subTitle: {
        type: String,
        default: ''
      },
      tipScore: {
        type: String,
        default: ''
      },
      tipTime: {
        type: String,
        default: ''
      },
      btnText: {
        type: String,
        default: '立即使用'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      score: {
        type: Number,
        default: 0
      },
      couponType: {
        type: String,
        default: 'discount'
      }
    },
    methods: {
      onClick(evtName) {
        if (evtName === 'use' && this.disabled) return
        this.$emit(evtName, this.couponId, {
          title: this.title,
          time: this.tipTime,
          redeemId: this.redeemId,
          status: this.status,
          useStatus: this.isUsed,
          score: this.score
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @require '~common/stylus/variables.styl'
  @require '~common/stylus/mixin.styl'
  .coupon-wrapper
    .coupon
      position : relative
      &::after
        content: ''
        position : absolute
        bottom: -5px
        width: 12px
        height: 12px
        right: 60px
        border-radius : 50%
        background : #fff
        margin-right: -6px
      .used-coupon
        background : #c6c7c6
      .gift-coupon
        background : linear-gradient(to left, #FF637C, #FF455E)
      .discount-coupon
        background : linear-gradient(to left, #54ABFF, #3492FF)
      .car-coupon
        background : linear-gradient(to left, #E4C477, #CB9D51)
      .couponConArea
        display: flex
        &::after
          content: ''
          position : absolute
          width: 16px
          height: 100%
          left: 0
          background: radial-gradient(circle at 50% 50%, #fff 0, #fff 50%, transparent 0), radial-gradient(circle at 50% 50%, #fff 0, #fff 50%, transparent 0);
          background-repeat: repeat-y;
          background-size: 11px 11px;
          background-position: -6px 0px
        &::before
          content: ''
          position : absolute
          top: -5px
          width: 12px
          height: 12px
          right: 60px
          border-radius : 50%
          background : #fff
          margin-right: -6px
        .coupon-content
          flex:1
          position: relative
          overflow: hidden
          height: 120px
          padding-left: 10px
          box-sizing:border-box
          // background-color: $color-purple
          background-size: 15px 15px
          background-position: 10px 3px
          border-radius: 6px
          /*&::before
            position: absolute
            content:''
            height:28px
            width:28px
            border-radius:50%
            left:-15px
            top:50%
            background-color: $color-white
            transform:translate(0, -50%)
            pointer-events:none
            */
          .coupon-desc
            display:flex
            height:100%
            box-sizing:border-box
            padding:5% 10px
            .coupon-img
              position: relative
              overflow:hidden
              flex:0 0 100px
              width:100px
              background-color: $color-white
              .img
                position: absolute
                left:50%
                top:50%
                height:100%
                min-width:100%
                transform: translate(-50%, -50%) rotate(0)
                z-index:1
              .img[lazy=loading]
                background: url('~common/images/loading_bg.gif') no-repeat center
                background-size: contain
              .img[lazy=error]
                background: url('~common/images/no_image_list.jpg') no-repeat center
                background-size: contain
              .badge
                position: absolute
                left:0
                top:0
                width:30px
                height:30px
                z-index:2
                background-size:100% auto
                background-repeat:no-repeat
                background-position: -1px -1px
            .coupon-title
              flex:1
              display:flex
              flex-direction:column
              justify-content:center
              box-sizing:border-box
              padding-left: 10px
              color: $color-white
              font-size:$fontsize-large
              .title
                line-height: 18px
                txt-overflow-2()
              .sub-title
                margin-top: 6px
                txt-overflow-1()
              .excBonus
                line-height : 1.5
                font-size : 14px
              .time
                color: #ddd
                font-size : 12px
                white-space: nowrap
        .coupon-attachment
          position: relative
          flex:0 0 60px
          display:flex
          width:60px
          height:120px
          align-items:center
          box-sizing:border-box
          border-radius: 6px
          // background-color: $color-purple
          color: $color-white
          font-size:$fontsize-large
          padding:0 15px
          text-align:center
          &.disabled
            color:#9b9b9b
          &::before
            position: absolute
            content:''
            left:0
            top:10%
            height:80%
            border-left:1px dashed $color-white
            border-radius:4px
            z-index:1
            point-events:none
          /*&::after
            position: absolute
            content:''
            height:30px
            width:30px
            border-radius:50%
            right:-15px
            top:50%
            background-color: $color-white
            transform:translate(0, -50%)
            pointer-events:none*/

    .coupon-info
      display:flex
      justify-content:space-between
      padding:5px 0
      .score,.time
        text-align:center
        color: $color-purple
        line-height:1.5
        font-size:$fontsize-medium
        txt-overflow-1()
        @media(max-width:360px)
          font-size:$fontsize-small
</style>
