<template>
  <page type="carHome" ref="page">
    <div :style="{height: cHeight}">
      <div class="car-home-content">
        <div class="mineCarTitle">
          <div>
            我的车辆
          </div>
          <!--（{{bindNum}}/1）-->
          <div class="sizeBlock">
          </div>
        </div>
        <div class="mineCarArea">
          <cube-scroll
            :options="options"
            ref="scroll">
            <ul v-if="carList.length">
              <li v-for="item in carList" v-bind:key="item.carNo">
                <div>{{item.carNo}}</div>
                <div><span @click="toPayFor(item.carNo)">缴费</span><span @click="bindCarNo(item)">{{item.isBind ? '已绑定' : '绑定'}}</span><span @click="deleteCarNo(item)">删除</span></div>
              </li>
            </ul>
            <div class="noCarList" v-else>
              <img src="./noCar.png" alt="" v-show="!isReqData">
              <p v-show="!isReqData">
                您还没绑定车辆
              </p>
            </div>
          </cube-scroll>
        </div>
        <div class="addCarArea">
          <div class="addCarBtn" @click="showCarboard">
            添加爱车
          </div>
        </div>
      </div>
      <car-park-keyboard ref="keyboardCom" :showCarNo="true" :showMask="true" @carNoVal="getBoardVal($event)" :sureText="'添加车牌'"></car-park-keyboard>
      <car-park-bar></car-park-bar>
    </div>
    <!--<div slot="children-view">-->
      <!--<page-view :cache="false"/>-->
    <!--</div>-->
  </page>
</template>

<script type="text/ecmascript-6">
  import Page from '../../../components/page/page.vue'
  import PageView from '../../../components/page-view/page-view'
  import CarParkBar from '../../../components/car-park-bar/car-park-bar.vue'
  import CarParkKeyboard from '../../../components/car-park-keyboard/car-park-keyboard.vue'
  import {utilMixin} from '../../../common/mixins/util'
  import {getMineCar, addMineCar, bindCarNumber, delCarNo} from '../../../api/carPark'
  import {mapGetters} from 'vuex'
  export default {
    name: 'carMineManage',
    mixins: [utilMixin],
    data() {
      return {
        cHeight: `${document.body.clientHeight}px`,
        carList: [],
        addCarVal: '',
        bindNum: 0,
        options: {
          click: false
        },
        isReqData: true
      }
    },
    activated() {
      this.cHeight = `${document.body.clientHeight}px`
      this._openToast()
      this.initGetCarList()
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    methods: {
      initGetCarList() {
        if (!this.userInfo.code) return
        getMineCar(this.userInfo.code).then(res => {
          if (res.length) {
            this.carList = res.map(item => {
              if (item.XF_ISBIND === '0') {
                this.bindNum = 1
              }
              return {...item, carNo: item.XF_CARNUMBER, isBind: item.XF_ISBIND === '0'}
            })
          } else {
            this.carList = []
            this.bindNum = 0
          }
          this.isReqData = false
          this.$nextTick(this.$refs.scroll.refresh)
          this._closeToast()
        }).catch(err => {
          this.isReqData = false
          this._closeToast()
          this._openAlert(`我的车辆查询失败：${err}`)
        })
      },
      showCarboard() {
        this.$refs.keyboardCom._showKeyboard()
      },
      getBoardVal(e) {
        if (e.carNo) {
          this.addCarVal = e.carNo
          const hasSameCarNo = this.carList.filter(item => item.carNo === e.carNo).length
          if (hasSameCarNo) {
            this._openAlert('已经有相同车牌号了！')
            return
          }
          this._openToast('添加中')
          /** 添加车牌 */
          addMineCar({
            carNo: this.addCarVal,
            vipCode: this.userInfo.code,
            isBind: false
          }).then(res => {
            this.initGetCarList()
          }).catch(err => {
            this._closeToast()
            this._openAlert(`添加失败：${err}`)
          })
        } else {
          console.log(e)
        }
      },
      toPayFor(cNo) {
        this.$router.push({
          name: 'car-payment',
          query: {
            carNo: cNo
          }
        })
      },
      bindCarNo(item) {
        if (item.isBind) {
          this._openToast('已绑定！', {time: 800, type: 'warn'})
        } else {
          /** 绑定 */
          this._openToast('绑定中')
          bindCarNumber({vipCode: this.userInfo.code, carid: item['XF_CARID']}).then(res => {
            this.initGetCarList()
          }).catch(err => {
            this._closeToast()
            this._openAlert(`绑定失败：${err}`)
          })
        }
      },
      deleteCarNo(item) {
        if (item.isBind) {
          this._openToast('绑定车牌号无法删除！', {time: 1000, type: 'warn'})
        } else {
          /** 删除 */
          this._openToast('删除中')
          delCarNo(item['XF_CARID']).then(res => {
            this.initGetCarList()
          }).catch(err => {
            this._closeToast()
            this._openAlert(`删除失败：${err}`)
          })
        }
      }
    },
    deactivated() {
      if (this.$refs.keyboardCom) {
        this.$refs.keyboardCom.maskFun()
      }
      this._closeToast()
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
  @import "~common/stylus/variables.styl"
  .car-home-content
    height: calc(100% - 50px)
    padding-bottom: 50px
    width: 80%
    margin: 0 auto
    dispaly: flex
    flex-direction : column
    font-size: $fontsize-large
    .mineCarTitle
      height: 16%
      display : flex
      flex-direction : column
      justify-content : flex-end
      box-sizing : border-box
      .sizeBlock
        height: 3px
        width: 100%
        border-radius : 1px
        background: #666666
        margin: 10px 0
    .mineCarArea
      height: 70%
      flex: 1
      overflow : hidden
      ul
        li
          display: flex
          line-height:36px
          div:nth-child(1)
            flex: 1
          div:nth-child(2)
            flex: 2
            display: flex
            span
              margin-right: 12px
      .noCarList
        text-align :center
        margin: 10px auto
        color : #999
        img
          display: block
          width: 120px
          height: auto
          margin: 12px auto
    .addCarArea
      height: 14%
      display : flex
      flex-direction : column
      justify-content : center
      .addCarBtn
        line-height : 36px
        margin: 0 auto
        color: #ffffff
        border-radius : 6px
        text-align : center
        background: $color-weight-orange
        width: 80%
  /deep/ .carNoSubmit, /deep/ .keyboardClose
    font-size : $fontsize-large-x
</style>
