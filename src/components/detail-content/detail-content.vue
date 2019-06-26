<template>
    <div class="detail-content-wrapper">
      <div class="detail-poster">
        <img @load="onPosterLoad" @click.prevent :src="imgUrl" ref="detailPoster">
      </div>
      <div class="detail-content">
        <p class="section-item name">{{detailInfo.name}}</p>
        <!--卡券详情 我的券包 start-->
        <div class="card" v-if="type==='card'">
          <div class="section-item">
            <p class="item">使用时间：</p>
            <p class="item" v-if="detailInfo.useStartTime&&detailInfo.useEndTime">{{validateTimeRange(detailInfo.useStartTime, detailInfo.useEndTime)}}</p>
          </div>
        </div>
        <!--卡券详情 end-->
        <!--卡券详情 积分兑礼 start-->
        <div class="card" v-if="type==='gift'">
          <div class="section-item">
            <p class="item">兑换积分：{{bonusTxt(detailInfo.score)}}</p>
            <p class="item" v-if="detailInfo.validStartTime&&detailInfo.validEndTime">兑换时间：{{validateTimeRange(detailInfo.validStartTime, detailInfo.validEndTime)}}</p>
            <p class="item" v-if="detailInfo.useStartTime&&detailInfo.useEndTime">使用时间：{{validateTimeRange(detailInfo.useStartTime, detailInfo.useEndTime)}}</p>
          </div>
        </div>
        <!--卡券详情 end-->
        <!--品牌详情 start-->
        <div class="card" v-if="type==='brand'">
          <div class="section-item">
            <p class="item" v-if="detailInfo.storeNum">铺号：{{detailInfo.storeNum}}</p>
            <p class="item" v-if="detailInfo.useStartTime&&detailInfo.useEndTime">优惠有效期：{{validateTimeRange(detailInfo.useStartTime, detailInfo.useEndTime)}}</p>
            <p class="item" v-if="detailInfo.discountDesc">优惠说明：</p>
            <p class="item" v-html="detailInfo.discountDesc"></p>
          </div>
        </div>
        <!--品牌详情 end-->
        <!--沙龙详情 start-->
        <div class="card" v-if="type==='salon'">
          <div class="section-item salonArea">
            <div class="nedPadd">
              <p class="itemTitle" v-if="detailInfo.ActivityTheme">活动主题: {{detailInfo.ActivityTheme}}</p>
              <p class="item" v-if="detailInfo.startTime&&detailInfo.endTime">活动时间：{{validateTimeRange(detailInfo.startTime, detailInfo.endTime)}}</p>
              <p class="item" v-if="detailInfo.location">活动地点：{{detailInfo.location}}</p>
              <div class="item" v-if="detailInfo.costDesc" v-html="textHtmlCombine('活动费用：',detailInfo.costDesc)"></div>
              <p class="item" v-if="detailInfo.memberCount">活动名额：{{detailInfo.memberCount}}个/场</p>
              <p class="item" v-if="detailInfo.EnrollNum">报名人数：{{detailInfo.EnrollNum}} 个</p>
              <div class="btn-area salonBtn">
                <base-button :disabled="Boolean(btnStatus)" @click.prevent.stop="goSubmit" class="salonBtnButt">{{btnTxt}}</base-button>
              </div>
            </div>
            <p class="item salonDetailP" v-if="detailInfo.activityRemark">活动详情：</p>
            <div class="nedPadd salonDetailCon">
              <div class="item" v-html="detailInfo.activityRemark"></div>
            </div>
          </div>
        </div>
        <!--沙龙详情 end-->
      </div>
      <div class="btn-area" v-if="hasBtn">
        <base-button :disabled="Boolean(btnStatus)" @click.prevent.stop="goSubmit">{{btnTxt}}</base-button>
      </div>
      <div class="detail-tips border-top-1px" v-if="!noTips&&detailInfo.detailTip">
        <p class="title">{{tipsTitle}}</p>
        <div class="tips" v-html="detailInfo.detailTip"></div>
      </div>
    </div>
</template>

<script>
    import BaseButton from '../../base/base-button/base-button'
    import {formatNumber} from '../../common/utils'
    import EventBus, {EVENT_IMG_BRAND_DETAIL_LOAD} from '../../common/eventBus'

    export default {
      props: {
        hasBtn: {
          type: Boolean,
          default () {
            return false
          }
        },
        btnTxt: {
          type: String,
          default () {
            return ''
          }
        },
        disabled: {
          type: Boolean,
          default: false
        },
        btnStatus: {
          type: Number,
          default () {
            return 0
          }
        },
        detailInfo: {
          type: Object,
          default () {
            return {}
          }
        },
        type: {
          type: String,
          default () {
            return 'brand'
          }
        },
        noTips: {
          type: Boolean,
          default () {
            return false
          }
        }
      },
      data() {
        return {
         // contentShow: false
        }
      },
      created() {
       // console.log(this.detailInfo)
      },
      computed: {
        tipsTitle () {
          switch (this.type) {
            case 'brand':
              return '活动详情：'
            case 'card':
              return '使用说明：'
            case 'gift':
              return '使用规则：'
            default:
              return '说明：'
          }
        },
        imgUrl() {
//          return this.detailInfo && this.detailInfo.detailImg ? this.detailInfo.detailImg : require('common/images/no_image.jpg')
          return this.detailInfo && this.detailInfo.logoUrl ? this.detailInfo.logoUrl : ''
        }
      },
      methods: {
        textHtmlCombine(txt, html) {
          return txt + html
        },
        bonusTxt(score) {
          return score ? formatNumber(score) : 0
        },
        validateTimeRange(startTime, endTime) {
          return `${startTime.split(' ')[0].replace(/-/g, '/')}-${endTime.split(' ')[0].replace(/-/g, '/')}`
        },
        goSubmit() {
          this.$emit('goNext')
        },
        onPosterLoad() {
          EventBus.$emit(EVENT_IMG_BRAND_DETAIL_LOAD)
        }
      },
      components: {
        BaseButton
      }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @require '~common/stylus/variables.styl'
  @require '~common/stylus/mixin.styl'
  .detail-poster
    background-size: contain
    img
      display:block
      width:100%
      height:auto
  .detail-content
    padding-top: 10px
    .section-item
      margin: 0 20px 20px
    .salonArea
      margin: 0 0 20px
      .nedPadd
        margin: 0 20px
    .name
      margin-bottom: 10px
      line-height: 24px
      font-size: $fontsize-large
      font-weight: 700
      color: $color-red
    .itemTitle
      line-height: 22px
      color: #333
      font-size: $fontsize-large-x
      font-weight: bold
      margin-bottom: 10px
    .salonBtn
      padding: 20px 30%
      .salonBtnButt
        background: transparent
        border:1px solid $color-weight-orange
        color: $color-weight-orange
      .cube-btn_disabled
        background: #d2d2d2
        color: #fff
        border:none
    .item
      margin: 5px 0
      line-height: 22px
      font-size: $fontsize-medium
      color: $color-title-gray
      &.content-item
        strong
          display: inline-block
    .salonDetailP
      line-height : 50px
      background: #f7f3f7
      padding-left: 20px
      color: #333
      font-size: $fontsize-large-x
      font-weight: bold
    .salonDetailCon
      padding-top: 10px
    .detail-link
      display: block
      font-size: $fontsize-medium
      margin: 10px 0
      line-height: 18px
      color: $body-bgc
  .detail-tips
    // margin: 20px
    margin: 16px 0
    // border-top-1px($body-bgc)
    .title
      // line-height: 24px
      line-height : 50px
      padding-left: 20px
      // font-size: $fontsize-large
      background: #f7f3f7
      color: #333 // $color-red
      font-weight: bold
      font-size: $fontsize-large-x
    .tips-list
      padding-left: 14px
      font-size: $fontsize-medium
      color: $color-grey
      .item
        margin: 5px 0
        list-style: unset
        .text
          line-height: 18px
  .tips
    padding:20px
    color: $color-dark-grey
    font-size: $fontsize-medium
    line-height: 22px
  .cut
    height: 10px
    background-color: $color-grey-opacity
  .btn-area
    padding: 0 16px
</style>
