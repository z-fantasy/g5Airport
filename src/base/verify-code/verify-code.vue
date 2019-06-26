<!-- 只暴露click事件，只有调用发送验证码接口调用成功后才会开始计时，发送成功调用sendSuccess方法开始计时，要中断计时则调用stop方法-->
<template>
  <cube-validator ref="inputValidator" class="verify-code" v-model="phoneValid" :model="phone" :rules="phoneRule">
    <div class="input-content">
      <div class="label" :style="{color: labelColor}">
        <span>手机号</span>
      </div>
      <cube-input class="input-control" v-model="phone" :placeholder="messages.common.txt_fetch_verify_code_phone"/>
      <base-button @click="onClick" :disabled="!phoneValid || start" class="input-button" :inline="true">{{text}}</base-button>
    </div>
    <div slot="message" class="custom-msg" slot-scope="props">
      <div v-if="(props.dirty || props.validated) && !phoneValid">
        {{props.message}}
        <div>
            <span v-for="(item, index) in Object.values(props.result)" :key="index" v-if="item.inValid">
              {{ item.message + ' ' }}
            </span>
        </div>
      </div>
    </div>
  </cube-validator>
</template>

<script>
  import storage from 'good-storage'
  import BaseButton from '../../base/base-button/base-button'

  const COMPONENT_NAME = 'verify-code'

  const EVENT_CLICK = 'click'
  const EVENT_INPUT = 'input'
  const EVENT_VALIDATE_SUCCESS = 'validate-success'
  const phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/

  export default {
    name: COMPONENT_NAME,
    props: {
      value: {
        type: String,
        default: ''
      },
      seconds: {
        default: 60,
        type: Number,
        validator(value) {
          return /^\d*$/.test(value)
        }
      },
      btnTxt: {
        type: String,
        default: messages.common.txt_fetch_verify_code
      },
      runTxt: {
        type: String,
        default: messages.common.txt_fetch_verify_code_second
      },
      againTxt: {
        type: String,
        default: messages.common.txt_fetch_verify_code_again
      },
      storeKey: {
        type: String,
        default: '__session_verify_code__'
      },
      labelColor: {
        type: String,
        default: '#666'
      }
    },
    data() {
      return {
        phoneValid: false,
        phone: '',
        phoneRule: {
          required: true,
          type: 'number',
          pattern: phoneReg
        },
        start: false,
        text: this.btnTxt,
        runSeconds: this.seconds
      }
    },
    created() {
      this.timer = null
      this.start = false
      this.init()
      this.phone = this.value
    },
    methods: {
      init() {
        const lastSecond = ~~((storage.session.get(this.storeKey) - new Date().getTime()) / 1000)
        if (lastSecond > 0 && this.storeKey) {
          this.text = this._getStr(lastSecond)
          this.start = true
          this.run(lastSecond)
        } else {
          this.btnTxt && (this.text = this.btnTxt)
        }
      },
      onClick() {
        this.$emit(EVENT_CLICK)
      },
      validate() {
        return this.$refs.inputValidator.validate()
      },
      sendSuccess() {
        this.start = true
        this.run()
      },
      run(currentSeconds) {
        let second = currentSeconds || this.runSeconds
        const runSecond = new Date().getTime() + second * 1000
        storage.session.set(this.storeKey, runSecond)
        if (!currentSeconds) {
          this.text = this._getStr(second)
        }
        this.timer = setInterval(() => {
          second--
          this.text = this._getStr(second)
          second <= 0 && this.stop()
        }, 1000)
      },
      stop() {
        this.text = this.againTxt
        this.start = false
        clearInterval(this.timer)
      },
      _getStr(seconds) {
        return this.runTxt.replace(/\{([^{]*?)%s(.*?)\}/g, seconds)
      }
    },
    watch: {
      phone(val) {
        this.$emit(EVENT_INPUT, val)
        setTimeout(() => {
          this.validate().then(rs => rs && this.$emit(EVENT_VALIDATE_SUCCESS))
        }, 20)
      },
      value(val) {
        this.phone = val
      }
    },
    components: {
      BaseButton
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @require '~common/stylus/variables'

  .verify-code
    .input-content
      display:flex
      padding:0 16px
      .label
        position: relative
        flex:0 0 85px
        width:85px
        font-size:16px
        color:#666
        span
          position: absolute
          top:50%
          left:0
          transform:translate(0,-50%)
      .input-control
        flex:1
        &::after
          border-radius: 16px
          border-color:$bdr-color-gray
        &.cube-input_active
          &::after
            border-color:$bdr-color-purple
      .input-button
        margin-left:10px
    .custom-msg
      margin:4px 0 0 101px
      box-sizing:border-box
      min-height:24px
      color:$color-red
      padding:5px 0
      font-size:14px
</style>
