<template>
  <div class="score-exchange-view" ref="exchangeView">
    <!--<div class="top-rainbow" ref="headLine"></div>-->
    <div class="exchange-title" ref="exchangeTitle">
      <div class="title-desc">
        <p class="bonus"><span>我的积分</span><strong class="count">{{bonusTxt}}</strong></p>
        <!--<div class="gift-img"></div>-->
      </div>
      <div class="selectAreaChange">
        <div class="title-tabs-area">
          <div class="title-tabs-wrapper">
            <div class="title-tabs">
              <div class="tab-item" v-for="(item, index) in tabArr" ref="tabItem" :class="{'item-active': activeTabIndex === index}" @click="switchTab(index)">
                <span class="name">{{index?item.text:variableText}}</span>
                <i class="icon icon_exchange_arrow" :class="{'active': childActiveFlag}" v-if="item.hasChild"></i>
              </div>
            </div>
            <div class="active-line" ref="activeLine"></div>
          </div>
        </div>
      </div>
      <transition name="fade">
        <div class="child-tab-wrapper" v-show="childActiveFlag">
          <div class="child-tab-item"
               :class="{'active':childTabActiveIndex===index}"
               v-for="(item, index) in childTabArr"
               @click.stop.prevent="selectMenu(item, index)">
            {{item.text}}
          </div>
        </div>
      </transition>
    </div>
    <div class="exchange-content" ref="exchangeContent">
      <cube-scroll
        ref="scroll"
        :data="couponList"
        :scroll-events="['before-scroll-start']"
        @before-scroll-start="onBeforeScrollStart"
        :options="options">
        <ul v-if="couponList&&couponList.length>0">
          <li class="coupon-item" v-for="item in couponList">
            <coupon :couponId="item.id"
                    :isUsed="item.isUsed"
                    :redeemId="item.redeemCode"
                    :status="item.status"
                    @use="onUse"
                    @detail="onDetail"
                    :imgUrl="item.logoUrl"
                    :title="item.name"
                    :score="Number(item.score)"
                    :tipScore="tipScore(item.score)"
                    :subTitle="item.listDesc"
                    :couponType="item.couponType"
                    :tipTime="couponValidTime(item.validStartTime, item.validEndTime)"
                    :btnText="'立即兑换'"/>
          </li>
        </ul>
        <no-data v-else/>
      </cube-scroll>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Coupon from '../coupon/coupon'
  import {fetchGiftGroup, fetchCouponListById, fetchCouponListByUser, fetchCarCouponList, exchangeCoupon} from '../../api/coupon'
  import {createCouponObj} from '../../common/models/Coupon'
  import NoData from '../no-result/no-result'
  import {utilMixin} from '../../common/mixins/util'
  import {userMixin} from '../../common/mixins/user'
  import {formatNumber} from '../../common/utils'
  import {mapGetters} from 'vuex'

  const COMPONENT_NAME = 'score-exchange-view'
  const TAB_ARR = [
    {
      text: '全部',
      value: 0,
      hasChild: 'true'
    },
    {
      text: '我能兑换',
      value: 1
    },
    {
      text: '停车券',
      value: 2
    }
  ]
  export default {
    name: COMPONENT_NAME,
    mixins: [utilMixin, userMixin],
    props: {
      detailUrl: {
        type: String,
        default: 'exchange-detail'
      }
    },
    data() {
      return {
        tabArr: TAB_ARR,
        childTabArr: [],
        activeTabIndex: 0,
        childActiveFlag: false,
        childTabActiveIndex: -1,
        couponList: [],
        options: {
          scrollbar: false
        }
      }
    },
    computed: {
      variableText() {
        let childTabIndex = this.childTabActiveIndex
        return childTabIndex !== -1 ? this.childTabArr[childTabIndex].text : this.tabArr[0].text
      },
      bonusTxt() {
        return (this.userInfo && this.userInfo.bonus) ? formatNumber(this.userInfo.bonus) : 0
      },
      ...mapGetters([
        'userInfo'
      ])
    },
    created() {
      this._getCouponGroup()
      this.$nextTick(() => {
        this.tabItemWidth = this.$refs.tabItem[0].offsetWidth
      })
    },
    mounted() {
      setTimeout(() => {
        this.$refs.activeLine.style.width = `${this.tabItemWidth}px`

        let docHeight = this.$refs.exchangeView.offsetHeight
        let headLineHeight = 0 // this.$refs.headLine.offsetHeight
        let titleHeight = this.$refs.exchangeTitle.offsetHeight
        this.$refs.exchangeContent.style.top = `${headLineHeight + titleHeight}px`
        this.$refs.exchangeContent.style.height = `${docHeight - headLineHeight - titleHeight}px`
      }, 80)
    },
    methods: {
      switchTab(index) {
        console.log(this.activeTabIndex, index)
        if (!this.activeTabIndex && !index) {
          (this.childTabArr && this.childTabArr.length > 0) && (this.childActiveFlag = true)
          console.log('1111')
          return
        } else if (index) {
          if (this.activeTabIndex === index) return
          this.childTabActiveIndex = -1
          this.childActiveFlag = false
          if (index === 2) {
            this._getListDataByUser('car')
          } else {
            this._getListDataByUser()
          }
        } else {
          this.childActiveFlag = false
          this._getListDataById()
        }

        this.activeTabIndex = index
        this.$refs.activeLine.style.transform = `translate(${this.tabItemWidth * this.activeTabIndex}px, 0)`
      },
      selectMenu(menu, index) {
        this.childActiveFlag = false
        this.childTabActiveIndex = index

        this._getListDataById(menu.value)
      },
      onUse(id, couponData) {
        this.childActiveFlag && (this.childActiveFlag = false)
        let tipTxt = `兑换此券需要花费${couponData.score}个积分，确定立即兑换？`
        this._openConfirm(tipTxt, {
          onConfirm: () => {
            this._exchangeTicket(couponData.redeemId)
          }
        })
      },
      onDetail(id, couponData) {
        this.childActiveFlag && (this.childActiveFlag = false)
        this.$router.push({
          name: this.detailUrl,
          params: {id, couponData}
        })
      },
      couponValidTime(startTime, endTime) {
        return `${startTime.split(' ')[0].replace(/\//g, '.')}-${endTime.split(' ')[0].replace(/\//g, '.')}`
      },
      tipScore(score) {
        return score ? `兑换积分  ${formatNumber(score)}` : ''
      },
      onBeforeScrollStart() {
        this.childActiveFlag && (this.childActiveFlag = false)
      },
      _getCouponGroup() {
        this.childTabArr = [
          {
            text: '全部',
            value: ''
          }
        ]
        this._openToast('分组信息加载中...', {mask: true})
        fetchGiftGroup().then(res => {
          this._closeToast()
          if (res) {
            res.forEach(item => {
              let obj = {}
              obj.text = item.XF_DESCI
              obj.value = item.XF_TICKETGROUPID
              this.childTabArr.push(obj)
            })
            this._getListDataById()
          }
        }).catch(err => this._errorCatchHandler(err))
      },
      _getListDataById(id) {
        this._openToast('加载中...', {mask: true})
        fetchCouponListById(id).then(couponList => {
          this._closeToast()
          if (couponList) {
            this.couponList = []
            couponList.forEach(item => {
              const cuType = this.couponTypeWit(item.XF_TICKETGROUPID)
              this.couponList.push(createCouponObj({...item, EB_USED: '未使用'}, cuType))
            })
            console.log(this.couponList)
          }
        }).catch(err => this._errorCatchHandler(err))
      },
      _getListDataByUser(carSign) {
        this._openToast('加载中...', {mask: true})
        let ticketListFun = carSign ? fetchCarCouponList : fetchCouponListByUser
        ticketListFun().then(couponList => {
          this._closeToast()
          if (couponList) {
            this.couponList = []
            couponList.forEach(item => {
              const cuType = this.couponTypeWit(item.XF_TICKETGROUPID)
              this.couponList.push(createCouponObj({...item, EB_USED: '未使用'}, cuType))
            })
          }
        }).catch(err => this._errorCatchHandler(err))
      },
      _exchangeTicket(id) {
        this._openToast('兑换中...', {mask: true})
        exchangeCoupon(id).then(res => {
          this._closeToast()
          this._getUserInfo()
          if (res) {
            this._openAlert('兑换成功，请到我的账户>我的券包查看')
          } else {
            this._openAlert('兑换失败，请重试')
          }
        }).catch(err => this._errorCatchHandler(err))
      },
      couponTypeWit(coupType) {
        if (coupType) {
          let cpType = ''
          switch (coupType) {
            case 'Y0001':
              cpType = 'discount'
              break
            case 'Y0002':
              cpType = 'discount'
              break
            case 'Y00003':
              cpType = 'discount'
              break
            case 'Y0004':
              cpType = 'discount'
              break
            case 'T000001':
              cpType = 'car'
              break
            default:
              cpType = 'discount'
          }
          return cpType
        } else {
          return 'discount'
        }
      }
    },
    components: {
      Coupon,
      NoData
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variables.styl"
  @import "~common/stylus/mixin.styl"
  .top-rainbow
    position : relative
    z-index: 4
  .score-exchange-view
    position: relative
    height: 100%
    background-color: $color-white
    .exchange-title
      position: relative
      background-color: $color-white
      z-index: 2
      .title-desc
        position: relative
        z-index: 3
        display: flex
        align-items: center
        justify-content: space-around
        bg-image('./user_icon_bg_s')
        height: 80px
        .bonus
          flex: 1
          line-height: 32px
          font-size: $fontsize-large
          text-align:  center
          color: #fff
          display: flex
          justify-content : center
          align-items : center
          margin-left: 16px
          span
            position : relative
            &::after
              content: ''
              position : absolute
              left: -42px
              top: 0px
              bg-image('./user_icon_score')
              background-size : 100%
              background-repeat : no-repeat
              width: 32px
              height:32px
          .count
            margin-left: 15px
            font-size: 32px
            color: #fff
        .gift-img
          flex: 0 0 180px
          width: 180px
          height: 80px
          background-repeat: no-repeat
          background-size: contain
          background-position: center
          // bg-image('./user_icon_bg_s')
      .title-tabs
        display: flex
        align-items: center
        justify-content: space-around
        // border-bottom: 2px solid #c4c4c4
        border:1px solid $color-weight-orange
        border-radius : 4px
        .tab-item
          flex: 1
          padding: 3px 0
          line-height: 22px
          font-size: $fontsize-large
          text-align: center
          color: $color-orange
          border-right: 1px solid $color-weight-orange
          &.active
            font-weight: 700
          .name
            vertical-align: middle
          .icon_exchange_arrow
            margin-left: 10px
            width: 12px
            height: 12px
            vertical-align: middle
            transition: all .3s
            bg-image('./activity_icon_open')
            &.active
              transform: rotate(180deg)
        .item-active
          background: $color-weight-orange
          color: #fff
      .selectAreaChange
        background-color: $color-white
        z-index: 3
        position : relative
        .title-tabs-area
          padding: 10px 15%
      .title-tabs-wrapper
        position: relative
        z-index: 3
        background-color: $color-white
        .active-line
          position: absolute
          bottom: 0
          left: 0
          height: 2px
          pointer-events:none
          transition: all .3s
          background-color: $color-red
          display: none
      .child-tab-wrapper
        position: absolute
        left: 0
        top: 126px
        z-index: 2
        width: 188px
        /*max-height: 140px*/
        overflow-y: scroll
        transition: all .6s
        box-shadow: 0 0  20px #ccc // $color-purple
        background-color: $color-white
        .child-tab-item
          padding: 4px 10px
          line-height: 24px
          font-size: $fontsize-large
          text-align: center
          color: $color-grey
          txt-overflow-1()
          border-bottom-1px()
          &.active
            color: $color-red
          &:last-child
            border-none()
      .fade-enter-active, .fade-leave-active
        transform: translate3d(0, 0, 0)
      .fade-enter, .fade-leave-to
        transform: translate3d(0, -100%, 0)
    .exchange-content
      position: absolute
      left: 0
      right: 0
      z-index: 1
      ul
        padding: 16px
</style>
