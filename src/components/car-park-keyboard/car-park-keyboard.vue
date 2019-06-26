<template>
  <div class="carParkKeyBoard" @touchmove.prevent @click.stop.prevent v-show="showKeyboardView">
    <transition name="diaViewMask">
      <div class="keyboard-blockView diaMask" v-show="showMask" @click="maskFun(0)">
      </div>
    </transition>
    <transition name="diaViewKeys">
      <div class="keyboardArea diaShadeKeys">
        <p class="placeHolder" v-show="showCarNo">请输入您的车牌号</p>
        <div class="carNoView" v-show="showCarNo">
          <ul>
            <li class="carNoLi flex-center" v-for="(item, index) in carNoArr" v-bind:key="index" @click="carNoIndex(index)" :class="{active: nowInputLen === index, newCarNo: index === 7 && !item}">
              {{item}}
            </li>
          </ul>
          <div class="carNoSubmit" @click="maskFun(1)">
            {{sureText}}
          </div>
        </div>
        <div class="keyboardFunbar">
          <div class="keyboardClose" @click="maskFun(0)">
            关闭
          </div>
        </div>
        <div class="keyboardKeysView">
          <div class="keyBodardUl" v-show="!nowInputLen">
            <div class="flex-center" v-for="(item, kind) in keyData.prov" v-bind:key="kind">
              <ul>
                <li v-for="(boardItem, index) in item" v-bind:key="index" :class="{funKey: boardItem === '返回' || boardItem === 'ABC' || boardItem === 'clear', clear: boardItem === 'clear'}" @click="keyboardVal(boardItem)">
                  <div>
                    {{boardItem}}
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="keyBodardUl" v-show="nowInputLen">
            <div class="flex-center" v-for="(item, kind) in keyData.engNum" v-bind:key="kind">
              <ul>
                <li v-for="(boardItem, index) in item" v-bind:key="index" :class="{funKey: boardItem === '返回' || boardItem === 'ABC' || boardItem === 'clear', clear: boardItem === 'clear', gray: nowInputLen < 6 && (boardItem === '学' || boardItem === '港' || boardItem === '澳')}" @click="keyboardVal(boardItem)">
                  <div>
                    {{boardItem}}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import {utilMixin} from 'common/mixins/util'
  const generalNo = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4,5}[A-Z0-9挂学警港澳]{1}$/
  const specialNo = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{5}[A-Z0-9挂学警港澳]{1}$/
  const keyboardKey = {
    prov: [
      ['京', '沪', '粤', '津', '冀', '晋', '蒙', '辽', '吉', '黑'],
      ['苏', '浙', '皖', '闽', '赣', '鲁', '豫', '鄂', '湘', '桂'],
      ['琼', '渝', '川', '贵', '云', '藏', '陕', '甘', '青', '宁'],
      ['返回', '新', '使', '领', '警', '学', '港', '澳', 'clear']
    ],
    engNum: [
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'],
      ['L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V'],
      ['返回', 'W', 'X', 'Y', 'Z', '学', '港', '澳', 'clear']
    ]
  }
  export default {
    name: 'carParkKeyboard',
    mixins: [utilMixin],
    props: {
      showCarNo: {
        type: Boolean,
        default: false
      },
      showMask: {
        type: Boolean,
        default: false
      },
      outInputLen: {
        type: Number,
        default: 0
      },
      sureText: {
        type: String,
        default: '确定'
      }
    },
    data() {
      return {
        showKeyboardView: false,
        carNo: '',
        carNoArr: ['', '', '', '', '', '', '', ''],
        keyData: keyboardKey,
        nowInputLen: 0
      }
    },
    watch: {
      outInputLen(n) {
        this.nowInputLen = n
      }
    },
    mounted() {
      if (this.carNo) {
        this.carNoArr = this.carNo.split('')
        if (!this.nowInputLen) {
          this.nowInputLen = this.carNo.length >= 7 ? 0 : this.carNo.length
        }
      }
    },
    methods: {
      keyboardVal(val) {
        if (this.nowInputLen < 6 && this.nowInputLen > 0 && (val === '学' || val === '港' || val === '澳')) {
          return
        }
        if (this.nowInputLen >= 8) {
          return
        }
        if (val === 'ABC' && !this.nowInputLen) {
        } else if (val === 'clear') {
          if (this.showCarNo) {
            const nowNoAry = this.carNoArr
            this.carNoArr = [...nowNoAry.slice(0, this.nowInputLen), '', ...nowNoAry.slice(this.nowInputLen + 1, nowNoAry.length)]
            if (this.nowInputLen !== 0) {
              this.nowInputLen -= 1
            }
          } else {
            this.$emit('clear', true)
          }
        } else if (val === '返回') {
          // this.$router.back()
          this.carNo = ''
          this.nowInputLen = 0
          this.carNoArr = ['', '', '', '', '', '', '', '']
          this.showKeyboardView = false
          this.$router.back()
        } else {
          if (this.showCarNo) {
            this.carNoArr[this.nowInputLen] = val
            this.nowInputLen += 1
            if (this.nowInputLen > 7) {
              this.nowInputLen = 7
            }
          }
        }
        this.carNo = this.carNoArr.join('')
        if (!this.showCarNo && (val !== '返回' && val !== 'clear' && val !== 'ABC')) {
          // 不显示车牌号的情况下，需要传给父组件时时的数值
          this.$emit('carNoVal', {keyboardVal: val})
        }
      },
      _showKeyboard() {
        this.showKeyboardView = true
      },
      carNoIndex(ind) {
        this.nowInputLen = ind
      },
      maskFun(nedEmit) {
        if (nedEmit) {
          if (this.carNo.length === 7 && this.carNoArr[this.carNoArr.length - 1]) {
            this._openToast('请完善车牌！', {time: 1500, type: 'warn'})
            return
          }
          if ((this.carNo.length === 7 || this.carNo.length === 8) && generalNo.test(this.carNo)) {
            this.$emit('carNoVal', {carNo: this.carNo, carNoArr: this.carNoArr})
            this.showKeyboardView = false
          } else {
            if (this.carNo) {
              this._openToast('车牌号输入有误！', {time: 1500, type: 'warn'})
            } else {
              this._openToast('未填写车牌号！', {time: 1500, type: 'warn'})
            }
            this.$emit('carNoVal', {carNoArr: this.carNoArr})
          }
        } else {
          this.carNo = ''
          this.nowInputLen = 0
          this.carNoArr = ['', '', '', '', '', '', '', '']
          this.$emit('close', true)
          this.showKeyboardView = false
        }
      }
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import '~common/stylus/mixin.styl'
  @import '~common/stylus/variables.styl'
  .carParkKeyBoard
    display: flex
    bottom: 0
    .keyboardArea
      .placeHolder
        padding: 12px
        text-align :center
        color: #999
        font-size : 12px
      .carNoView
        margin: 0px 12px
        .carNoSubmit
          margin-top: 8px
          text-align : center
          line-height : 36px
          border-radius : 4px
          background: $color-weight-orange
          color: #fff
        ul
          display: flex
          justify-content : space-around
          height: 40px
          li
            width: 11%
            height: 100%
            color: #333
            display: flex
            justify-content : center
            align-items : center
            position : relative
            border-radius: 2px
            border: 1px solid #ccc
            box-sizing : border-box
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
              position : absolute
              left: 0
              top: 0
              font-size : 8px
              color: #999
              width: 100%
              height: 100%
              white-space : nowrap
              display: flex
              justify-content : center
              align-items : center
              margin-top: 7px
              transform:scale(1)
      .keyboardFunbar
        box-shadow : 0px 0px 6px #ccc
        margin-top: 8px
        padding: 10px
        display: flex
        justify-content : flex-end
        .keyboardClose
          color: $color-orange
      .keyboardKeysView
        background: #D6D3DE
        padding: 10px 3px
        ul
          display: flex
          justify-content : space-around
          li
            color: #333
            width: 9%
            background: #fff
            border-radius : 4px
            box-shadow : 1px 1px 3px #666
            height: 36px
            margin-bottom: 4px
            display: flex
            justify-content : center
            align-items : center
            font-size: 16px
            &:active
              background: #D6D3DE
              color: #fff
          .funKey
            background: #D6D3DE
            width: 12%
          .clear
            position : relative
            &::before
              content: ''
              position : absolute
              width: 100%
              height: 100%
              background-image: url('./clear.png')
              background-repeat : no-repeat
              background-position : center
              background-color : #D6D3DE
              background-size : 24px auto
          .gray
            background: #D6D3DE
          li:active
            background: #D6D3DE
            color: #fff


  .diaViewKeys-enter-active, .diaViewKeys-leave-active, .diaViewMask-enter-active, .diaViewMask-leave-active
    transition: all .3s ease

  .diaViewKeys-enter, .diaViewKeys-leave-to, .diaViewMask-enter, .diaViewMask-leave-to
    opacity: 0

  /*.diaViewMask-enter-active, .diaViewMask-leave-active*/
    /*transition: all .4s ease*/

  /*.diaViewMask-enter, .diaViewMask-leave-to*/
    /*opacity: 0*/

  .diaShadeKeys, .diaMask
    position: fixed
    left: 0px
    bottom: 0
    width: 100%
  .diaMask
    z-index: 100
    height: 100%
    background : rgba(0,0,0,0.5)
  .diaShadeKeys
    background: #f7f7f7
    z-index: 101
</style>
