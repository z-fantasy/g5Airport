<template>
  <page type="car-payment-record" ref="page">
    <div class="car-payment-record" :style="{height: cHeight}">
      <div class="car-home-content">
        <cube-scroll
          ref="scroll"
          :options="options"
          @pulling-up="onPullingUp"
        >
          <ul v-if="carPayData.length" class="carPayUl">
            <li class="carPayDLi" v-for="item in carPayData" v-bind:key="item.LedgerId">
              <div class="">
                <p><span>订单号：</span></p>
                <p><span>{{item.TradeNo}}</span></p>
              </div>
              <div class="">
                <p><span>车牌号：</span></p>
                <p><span>{{item.CarNumber}}</span></p>
              </div>
              <div class="">
                <p><span>进场时间：</span></p>
                <p><span>{{item.ParkStartDateTime}}</span></p>
              </div>
              <div class="">
                <p><span>停车时长：</span></p>
                <p><span>{{item.ParkDuration}}</span></p>
              </div>
              <div class="">
                <p><span>停车费用：</span></p>
                <p><span>{{item.TotalAmount}} 元</span></p>
              </div>
              <div class="">
                <p><span>是否享受优惠：</span></p>
                <p><span>{{item.Group1 === '1' ? '是' : '否'}}</span></p>
              </div>
              <div class="">
                <p><span>优惠费用：</span></p>
                <p><span>{{item.ParkDiscount}}元</span></p>
              </div>
            </li>
          </ul>
          <!--<template slot="pullup">-->
            <!--<div v-show="isPullUpLoad" class="isUpLoad flex-center">-->
              <!--<cube-loading :size="28"></cube-loading>&nbsp;&nbsp;加载中-->
            <!--</div>-->
          <!--</template>-->
          <div class="noCarList" v-else>
            <img src="./noCar.png" alt="" v-show="!isReqData">
            <p v-show="!isReqData">
              暂无缴费记录
            </p>
          </div>
        </cube-scroll>
      </div>
      <car-park-bar></car-park-bar>
    </div>
  </page>
</template>

<script type="text/ecmascript-6">
  import Page from '../../../components/page/page.vue'
  import CarParkBar from '../../../components/car-park-bar/car-park-bar.vue'
  import {utilMixin} from 'common/mixins/util'
  import {getCarPackRec} from '../../../api/carPark'
  import {mapGetters} from 'vuex'
  export default {
    name: 'carPaymentRecord',
    mixins: [utilMixin],
    data() {
      return {
        cHeight: `${document.body.clientHeight}px`,
        carPayData: [],
        options: {
          probeType: 2,
          pullUpLoad: {
            threshold: 0,
            text: '加载中'
          }
        },
        reqDat: {
          VipCode: '',
          pageSize: 10,
          pageNow: 1,
          LedgerId: '',
          TradeNo: ''
        },
        isPullUpLoad: false,
        isReqData: true
      }
    },
    activated() {
      this.isReqData = true
      this.carPayData = []
      this.options.pullUpLoad = {
        threshold: 0,
        text: '加载中'
      }
      if (this.userInfo.code) {
        this.reqDat.VipCode = this.userInfo.code
        this.getRecord(true)
      } else {
        this.isReqData = false
        this._openAlert('未获取到会员号！')
      }
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    methods: {
      getRecord(isFirstInto) {
        if (isFirstInto) {
          this._openToast('Loading')
          this.reqDat = {
            VipCode: this.userInfo.code,
            pageSize: 10,
            pageNow: 1,
            LedgerId: '',
            TradeNo: ''
          }
        }
        getCarPackRec(this.reqDat).then(res => {
          this.isReqData = false
          if (isFirstInto) {
            this._closeToast()
          }
          const ptlList = res.ParkingTranssalesLedger_List
          this.carPayData = [...this.carPayData, ...ptlList]
          if (ptlList.length >= this.reqDat.pageSize) {
            this.reqDat.pageNow = this.reqDat.pageNow + 1
            this.$nextTick(() => {
              this.$refs.scroll.forceUpdate()
              this.$refs.scroll.refresh()
            })
          } else {
            this.options.pullUpLoad = false
            this.$nextTick(this.$refs.scroll.refresh)
          }
        }).catch(err => {
          this.isReqData = false
          if (isFirstInto) {
            this._closeToast()
          }
          this._openAlert(`获取缴费记录失败：${err}`)
          this.$nextTick(this.$refs.scroll.refresh)
        })
      },
      onPullingUp() {
        this.getRecord()
      }
    },
    deactivated() {
      this._closeToast()
    },
    components: {
      Page,
      CarParkBar
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import '~common/stylus/mixin.styl'
  @import '~common/stylus/variables.styl'
  .car-home-content
    font-size: $fontsize-large
    height: calc(100% - 50px)
    padding-bottom: 50px
    background: #f7f3f7
    color: #333
    .noCarList
      text-align :center
      margin: 20px auto
      color : #999
      img
        display: block
        width: 160px
        height: auto
        margin: 40px auto
    .carPayUl
      padding: 12px
      .carPayDLi
        padding: 10px 14px 6px
        margin-bottom: 12px
        background: #ffffff
        font-size: $fontsize-medium
        border-radius: 8px
        >div
          display: flex
          p
            margin-bottom: 6px
          p:nth-child(2)
            padding-left: 4px
            flex: 1px
            table-layout: fixed;
            word-break: break-all;
            overflow: hidden;
      .isUpLoad
        display: flex
        justify-content : center
        align-items : center
</style>
