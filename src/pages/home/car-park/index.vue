<template>
  <page type="car-park" ref="page">
    <div :style="{height: cHeight}">
      <div class="car-home-content" @click="otherViewCloseKey">
        <cube-scroll ref="scroll">
          <div>
            <img src="./carPark.jpg" alt="" class="carParkImg">
            <div class="nedShow">
              <div class="carNoArea" v-show="showSure === 1">
                <p class="placeHolder">请输入您的车牌号</p>
                <ul>
                  <li class="carNoLi flex-center" v-for="(item, index) in carNoArr" v-bind:key="index"
                      @click.stop.prevent="carNoIndex(index)"
                      :class="{active: nowInputLen === index, newCarNo: index === 7 && !item}">
                    {{item}}
                  </li>
                </ul>
                <div class="carNoSubmit" :class="{canSubmit: !canInquire}" @click="inquireCar">
                  查询停车费
                </div>
              </div>
              <ul class="handSelectArea" v-show="showSure === 2">
                <li @click="carHandFun('car-payment', bindCarNo)" v-show="bindCarNo">
                  <span class="carIcon">
                    <img src="./caricon.png" alt="">
                  </span>
                  <p class="carName">
                    {{bindCarNo}}
                  </p>
                </li>
                <li @click="carHandFun('car-mine-manage')">
                  <span class="carIcon">
                    <img src="./caricon.png" alt="">
                  </span>
                  <p class="carName">
                    使用其他已有车牌缴费
                  </p>
                </li>
                <li @click="carHandFun('car-payment')">
                  <span class="carIcon">
                    <img src="./caricon.png" alt="">
                  </span>
                  <p class="carName">
                    为其它车辆缴费
                  </p>
                </li>
              </ul>
              <div class="isLoading" v-show="!showSure">
                <cube-loading :size="28"></cube-loading>
              </div>
            </div>
          </div>
        </cube-scroll>
      </div>
      <car-park-keyboard ref="keyboardCom" :outInputLen="nowInputLen" @carNoVal="carNoVal($event)" @clear="clearCarVal"
                         @close="closeKeyboard"></car-park-keyboard>
      <car-park-bar ref="carParkBar"></car-park-bar>
    </div>
    <!--<div slot="children-view">-->
      <!--<page-view :cache="false"/>-->
    <!--</div>-->
  </page>
</template>

<script type="text/ecmascript-6">
  import Page from '../../../components/page/page.vue'
  import PageView from '../../../components/page-view/page-view.vue'
  import CarParkBar from '../../../components/car-park-bar/car-park-bar.vue'
  import CarParkKeyboard from '../../../components/car-park-keyboard/car-park-keyboard.vue'
  import {utilMixin} from 'common/mixins/util'
  import {userMixin} from 'common/mixins/user'
  import {mapGetters} from 'vuex'
  import {getMineCar} from '../../../api/carPark'

  const PAGE_NAME = 'car-park'
  const generalNo = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4,5}[A-Z0-9挂学警港澳]{1}$/
  const specialNo = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{5}[A-Z0-9挂学警港澳]{1}$/
  export default {
    name: PAGE_NAME,
    mixins: [utilMixin, userMixin],
    data() {
      return {
        cHeight: `${document.body.clientHeight}px`,
        canInquire: 1, // 查询按钮0：可以查询，1：无车牌号码，2：车牌号码错误
        carNo: '',
        carNoArr: ['', '', '', '', '', '', '', ''],
        nowInputLen: 0,
        bindCarNo: '',
        showSure: 0 // 0是显示查询中，1显示input, 2显示选项
      }
    },
    activated() {
      this.cHeight = `${document.body.clientHeight}px`
      // todo 查询车牌号列表？ 如果没有，显示输入框，如果有再显示选择项：如果有绑定车牌号情况下显示三个选项，如果没有就两个选项
      if (this.userInfo && this.userInfo.code) {
        this._initRef()
      } else {
        this._getUserInfo(this._initRef)
      }
    },
    beforeRouteUpdate (to, from, next) {
      if (to.name === PAGE_NAME && from.name !== PAGE_NAME) {
        this._initRef()
      }
      next()
    },
    watch: {
      carNoArr(n) {
        const carNoJoin = n.join('')
        if (carNoJoin) {
          if (generalNo.test(carNoJoin) && ((carNoJoin.length === 7 && !n[7]) || (carNoJoin.length === 8 && n[7]))) {
            this.canInquire = 0
          } else {
            this.canInquire = 2
          }
        } else {
          this.canInquire = 1
        }
        this.carNo = carNoJoin
      }
    },
    mounted() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.cHeight = `${document.body.clientHeight}px`
          this.$refs.scroll.refresh()
        }, 20)
      })
    },
    methods: {
      _initRef() {
        this.showSure = 0
        getMineCar(this.userInfo.code).then(res => {
          if (res.length) {
            // todo 车牌号列表内如果有绑定的车牌号就bindCarNo,没有就''
            const carNolist = res.filter(item => item.XF_ISBIND === '0')
            this.bindCarNo = carNolist.length ? carNolist[0].XF_CARNUMBER : ''
            this.showSure = 2
            this.$refs.keyboardCom.maskFun()
          } else {
            this.showSure = 1
            this.carNoIndex()
          }
        }).catch(err => {
          this._openAlert(`我的车辆查询失败：${err}`)
        })
      },
      inquireCar() {
        const canInquire = this.canInquire ? this.canInquire === 1 ? '请输入车牌号码！' : '车牌号错误，请仔细核对！' : '通过'
        if (canInquire === '通过') {
          this.$router.push({
            name: 'car-payment',
            query: {carNo: this.carNo}
          })
        } else {
          this._openAlert(canInquire, {type: 'warn'})
        }
      },
      clearCarVal() {
        const nextNoAry = this.carNoArr
        this.carNoArr = [...nextNoAry.slice(0, this.nowInputLen), '', ...nextNoAry.slice(this.nowInputLen + 1, nextNoAry.length)]
        if (this.nowInputLen !== 0) {
          this.nowInputLen -= 1
        }
      },
      closeKeyboard() {
        this.nowInputLen = -1
      },
      otherViewCloseKey() {
        this.$refs.keyboardCom.maskFun()
      },
      carNoVal(val) {
        if (val.keyboardVal) {
          const nowNoAry = this.carNoArr
          this.carNoArr = [...nowNoAry.slice(0, this.nowInputLen), val.keyboardVal, ...nowNoAry.slice(this.nowInputLen + 1, nowNoAry.length)]
          if (this.nowInputLen === 7) {
            if (this.carNoArr.join('').length >= 7) {
              this.nowInputLen += 1
              this.$refs.keyboardCom.maskFun()
            } else {
              for (let i = 0; i < this.carNoArr.length; i++) {
                if (!this.carNoArr[i]) {
                  this.nowInputLen = i
                  break
                }
              }
            }
          } else {
            this.nowInputLen += 1
          }
        }
      },
      carHandFun(conName, carNo) {
        const carNoQuery = carNo ? {carNo: carNo} : {}
        this.$router.push({
          name: conName,
          query: carNoQuery
        })
      },
      carNoIndex(index = 0) {
        this.nowInputLen = index
        this.$refs.keyboardCom._showKeyboard()
      }
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    deactivated() {
      if (this.$refs.keyboardCom) {
        this.$refs.keyboardCom.maskFun()
      }
    },
    components: {
      Page,
      PageView,
      CarParkBar,
      CarParkKeyboard
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
    .carParkImg
      width: 100%
      height: auto
    .nedShow
      .carNoArea
        margin: 0px 12px
        .placeHolder
          padding: 12px 0 18px
          text-align: center
          color: #999
          font-size: 12px
        .carNoSubmit
          margin-top: 8px
          text-align: center
          line-height: 36px
          border-radius: 4px
          background: #ccc
          color: #fff
        .canSubmit
          background: $color-weight-orange
        ul
          display: flex
          justify-content: space-around
          height: 40px
          li
            width: 11%
            height: 100%
            color: #333
            display: flex
            justify-content: center
            align-items: center
            position: relative
            border-radius: 2px
            border: 1px solid #ccc
            box-sizing: border-box
            font-size: 16px
          .active
            border-color: $color-orange
          .newCarNo
            &::after
              content: '+'
              font-size: 22px
              margin-bottom: 15px
              color: #999
            &::before
              content: '新能源'
              position: absolute
              left: 0
              top: 0
              font-size: 8px
              color: #999
              width: 100%
              height: 100%
              white-space: nowrap
              display: flex
              justify-content: center
              align-items: center
              margin-top: 7px
              transform: scale(0.8)
      .handSelectArea
        margin: 20px 12px
        li
          display: flex
          align-items: center
          margin-bottom: 12px
          padding: 10px
          background: #fff
          position: relative
          border-radius: 4px
          &::after
            content: ''
            position: absolute
            right: 10px
            top: 50%
            width: 12px
            height: 16px
            margin-top: -9px
            bg-image('./parking_icon_arrow_right')
            background-size: 10px auto
            background-repeat: no-repeat
          .carIcon
            height: 32px
            width: 32px
            margin-right: 12px
            background: $color-weight-orange
            display: flex
            justify-content : center
            align-items : center
            border-radius : 4px
            img
              width: 80%
      .isLoading
        padding: 20px
        display: flex
        justify-content: center

  /deep/ .keyboardClose
    font-size: 16px
</style>
