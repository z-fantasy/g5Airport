<template>
  <div class="list-view">
    <ul v-if="listData&&listData.length>0">
      <router-link tag="li" :to="{name: detailUrl, params: {id:item.id}}" class="brand-item" :key="item.id" v-for="(item, index) in listData" :class="{brandItem: showType}">
        <div class="logo-wrapper">
          <img v-lazy="item.logoUrl" class="logo">
        </div>
        <div class="slogan-wrapper" v-if="!showType">
          <p class="slogan" v-if="item.listTitle">{{item.listTitle}}</p>
          <p class="time-desc " v-if="item.validateTime">时间：{{item.validateTime}}</p>
          <p class="time-desc">地点：{{item.location}}</p>
          <p class="time-desc" v-if="detailUrl === 'my-orders-detail'">人数：{{item.EB_ENROLL_PEPOPLE_NUM}}人</p>
          <div class="toBm" :class="{yuYue: detailUrl === 'my-orders-detail'}"><span>{{detailUrl === 'my-orders-detail' ? '详情' : '马上报名'}}</span></div>
        </div>
      </router-link>
    </ul>
    <no-data v-else></no-data>
  </div>
</template>

<script type="text/ecmascript-6">
  import NoData from '../no-result/no-result'

  const COMPONENT_NAME = 'brand-salon-list-view'
  export default {
    name: COMPONENT_NAME,
    props: {
      listData: Array,
      detailUrl: {
        type: String,
        default: 'discount-detail'
      },
      showType: {
        type: String,
        default: ''
      }
    },
    components: {
      NoData
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @require '~common/stylus/variables.styl'
  @require '~common/stylus/mixin.styl'

  .list-view
    padding: 20px 12px
    .brand-item
      display: flex
      align-items: center
      justify-content: center
      margin-bottom: 16px
      padding: 10px
      min-height: 100px
      box-sizing: border-box
      // border-1px($color-purple, 8px)
      border-radius: 6px
      background-color: $color-white
      box-shadow : 0 2px 2px 1px #E0E0E0
      .logo-wrapper
        display: flex
        align-items: center
        justify-content: center
        flex: 0 0 100px
        height: 100%
        overflow: hidden
        .logo
          display: inline-block
          max-width: 100%
          max-height: 100%
        .logo[lazy=loading]
          background: url('~common/images/loading.gif') no-repeat center
          background-size: 16px
        .logo[lazy=error]
          background: url('~common/images/error_200.jpg') no-repeat center
          background-size: contain
      .slogan-wrapper
        flex: 1
        margin-left: 10px
        line-height: 24px
        font-size: $fontsize-large
        color: $color-title-gray
        position : relative
        .slogan
          margin-bottom: 6px
          color: #333
        .time-desc
          line-height: 20px
          font-size: $fontsize-medium
        .toBm
          margin-top: 8px
          text-align : right
          >span
            font-size: $fontsize-small
            display: inline-block
            border: 1px solid $color-weight-orange
            color: $color-weight-orange
            border-radius : 10px
            line-height: 12px
            padding: 4px 4px
        .yuYue
          position : absolute
          right: 0
          bottom: 0px
          >span
            border-radius : 4px
            padding: 4px 20px
    .brandItem
      padding: 0
      height: 130px
      .logo-wrapper
        width: 100%
        height: 100%
        flex: 1
        img
          width: 100%
          height: 100%
</style>
