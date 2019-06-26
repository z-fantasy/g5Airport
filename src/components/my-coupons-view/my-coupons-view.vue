<template>
  <div class="my-coupons-view">
    <div class="head-wrapper" ref="headWrapper">
      <div class="card-head">
        <div class="card-options">
          <div class="card-type-panel">
            <div class="panel-wrapper">
              <div class="panel-item"
                   :class="{active:activeCouponIndex === index}"
                   v-for="(item, index) in selectCouponOptions"
                   @click="switchCouponIndex(index)">
                <i class="icon" :class="iconCls(index)"></i>
                <span class="txt">{{item}}</span>
              </div>
              <!--<div class="panel-item active-type">-->
              <!--<i class="active-coupon-type" :class="activeCouponIndex===0?'discount-active':'gift-active'"></i>-->
              <!--</div>-->
            </div>
          </div>
        </div>
      </div>
      <title-tabs :tabs="selectOptions" v-model="statusTypeIndex" @switchStatus="switchStatus"/>
    </div>
    <div class="my-coupons">
      <cube-scroll
        ref="scroll"
        :options="options">
        <div class="coupon-list-container">
          <template v-if="myCouponList.length">
            <div class="coupon-tab-content">
              <ul>
                <li class="card-item" v-for="item in myCouponList">
                  <coupon :isUsed="item.isUsed"
                          :couponId="item.id"
                          :redeemId="item.redeemCode"
                          :status="item.status"
                          @use="onUse"
                          @detail="onDetail"
                          :imgUrl="item.logoUrl"
                          :title="item.name"
                          :subTitle="item.listDesc"
                          :couponType="item.couponType"
                          :tipTime="couponValidTime(item.useStartTime, item.useEndTime)"
                          :btnText="statusTypeIndex===2?'已过期': statusTypeIndex === 1 ? '已使用' : '立即使用'"
                          :disabled="statusTypeIndex===1 || statusTypeIndex===2"/>
                </li>
              </ul>
            </div>
          </template>
          <template v-else>
            <no-data/>
          </template>
        </div>
      </cube-scroll>
    </div>
    <scan-user-code ref="scanCode" @close="onClose"></scan-user-code>
  </div>
</template>

<script>
  import TitleTabs from '../../components/title-tabs/title-tabs'
  import {utilMixin} from '../../common/mixins/util'
  import {fetchMyCoupons} from '../../api/coupon'
  import Coupon from '../../components/coupon/coupon'
  import NoData from '../../components/no-result/no-result'
  import {createCouponObj} from '../../common/models/Coupon'
  import ScanUserCode from '../../components/scan-user-code/scan-user-code'

  const COMPONENT_NAME = 'my-coupons-view'

  export default {
    name: COMPONENT_NAME,
    mixins: [utilMixin],
    props: {
      selectedIndex: {
        type: Number,
        default: 0
      },
      couponIndex: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        statusTypeIndex: this.selectedIndex,
        activeCouponIndex: this.couponIndex,
        myCouponList: [],
        loading: false,
        options: {
          scrollbar: {
            fade: true,
            interactive: false
          }
        }
      }
    },
    created() {
      this.selectOptions = [
        '未使用',
//        '即将到期',
        '已使用',
        '已过期'
      ]
      this.selectCouponOptions = [
        '优惠券',
        '礼品券',
        '停车券'
      ]
      this._getMyCouponList()
    },
    mounted() {
      setTimeout(() => {
        const docHeight = document.body.clientHeight
        const headerHeight = this.$refs.headWrapper.offsetHeight + this.$refs.headWrapper.offsetTop
        this.$refs.scroll && (this.$refs.scroll.$el.style.height = docHeight - headerHeight + 'px')
      }, 20)
    },
    watch: {
      statusTypeIndex(n) {
        console.log(n)
      }
    },
    methods: {
      iconCls(index) {
        if (index === 0) {
          return 'icon-discount'
        } else if (index === 1) {
          return 'icon-gift'
        }
      },
      switchCouponIndex(index) {
        if (this.loading || index === this.activeCouponIndex) return
        this.activeCouponIndex = index
        this.statusTypeIndex = 0
        this._getMyCouponList()
      },
      switchStatus(index) {
        if (this.statusTypeIndex === index) return
        this.statusTypeIndex = index
        this._getMyCouponList()
      },
      onUse(id, couponData) {
        this.$refs.scanCode.show(couponData)
      },
      onClose() {
        this._getMyCouponList()
      },
      onDetail(id, couponData) {
        this.$router.push({
          name: 'my-coupon-detail',
          params: {id, couponData}
        })
      },
      couponValidTime(startTime, endTime) {
        return `${startTime.split(' ')[0].replace(/\//g, '.')}-${endTime.split(' ')[0].replace(/\//g, '.')}`
      },
      onPopupClose() {
        this._getMyCouponList()
      },
      _getMyCouponList() {
        this._openToast('卡券信息加载中...', {mask: true}, true, 'myCouponsLoading')
        fetchMyCoupons(this.activeCouponIndex, this.statusTypeIndex).then(res => {
          this.myCouponList = []
          const couponType = this.activeCouponIndex ? this.activeCouponIndex === 1 ? 'gift' : ' car' : 'discount'
          res.forEach(item => {
            this.myCouponList.push(createCouponObj(item, couponType))
          })
          this._closeToast('myCouponsLoading')
        }).catch(err => {
          this._closeToast('myCouponsLoading')
          console.warn(err)
          this._openAlert(`${err}`)
        })
      }
    },
    components: {
      TitleTabs,
      Coupon,
      NoData,
      ScanUserCode
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~common/stylus/variables.styl"
  @import "~common/stylus/mixin.styl"
  .my-coupons-view
    width: 100%
    height: 100%
    overflow: hidden

  .card-head
    box-sizing: border-box
    .card-options
      position: relative
      flex: 1
      box-sizing: border-box
      line-height: 1
      font-size: 0
      text-align: right
      background: #f7f3f7
      .card-type-panel
        color: $color-purple
        padding: 20px 0
        margin: 0 15%
        .panel-wrapper
          display: flex
          align-items: center
          text-align: center
          border-radius: 4px
          border: 1px solid $color-weight-orange
          height: 34px
          .panel-item
            height: 100%
            display: flex
            align-items: center
            justify-content: center
            flex: 1
            font-size: 0
            border-right-1px(#f77100)
            &.active-type
              justify-content: flex-end
            &.active
              background: $color-weight-orange
              color: #fff // #cb291e
              .txt
                line-height: 32px
                font-size: $fontsize-large-xx
            /*.icon
              &.icon-discount
                bg-image('./icon_discount_active')
              &.icon-gift
                bg-image('./icon_gift_active')*/
            .txt, .icon
              display: inline-block
              vertical-align: top
            /*.icon
              margin-right:3px
              width:18px
              height:28px
              bg-image-props()
              background-size:18px auto
              &.icon-discount
                bg-image('./icon_discount')
              &.icon-gift
                bg-image('./icon_gift')*/
            .txt
              line-height: 22px
              font-size: $fontsize-large-x
            .active-coupon-type
              display: inline-block
              height: 70px
              width: 66%
              background-repeat: no-repeat
              background-size: contain
              background-position: center
              &.discount-active
                bg-image('./discount')
              &.gift-active
                bg-image('./gift')

  .my-coupons
    .item
      height: 50px
      border-bottom: 1px solid

  .coupon-tab-content
    ul
      padding: 10px
      .card-item
        margin-bottom: 10px
</style>
