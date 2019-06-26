<template>
  <cube-validator ref="inputValidator" class="verify-input" v-model="inputValid" :model="inputTxt" :rules="rules" :messages="messages">
    <div class="input-content">
      <div class="label" v-if="label" :style="{color: labelColor}">
        <span>{{label}}</span>
      </div>
      <cube-input class="input-control" v-model="inputTxt"
                  :placeholder="placeholder"
                  :type="type"
                  :maxlength="maxlength"
                  :readonly="readonly"
                  :disabled="disabled"
                  :autofocus="autofocus"
                  :autocomplete="autocomplete"
                  :clearable="clearable"/>
    </div>
    <div slot="message" class="custom-msg" slot-scope="props">
      <div v-if="(props.dirty || props.validated) && !inputValid">
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
  const COMPONENT_NAME = 'verify-input'

  const EVENT_INPUT = 'input'
  const EVENT_VALIDATE_SUCCESS = 'validate-success'

  export default {
    name: COMPONENT_NAME,
    props: {
      value: String,
      required: {
        type: Boolean,
        default: true
      },
      type: {
        type: String,
        default: 'text'
      },
      maxlength: {
        type: Number,
        default: 60
      },
      readonly: {
        type: Boolean,
        default: false
      },
      autofocus: {
        type: Boolean,
        default: false
      },
      autocomplete: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      clearable: {
        type: Boolean,
        default: true
      },
      label: {
        type: String,
        default: '字段'
      },
      placeholder: {
        type: String,
        default: '请输入字段'
      },
      rules: {
        type: Object,
        default() {
          return {}
        }
      },
      messages: {
        type: Object,
        default() {
          return {}
        }
      },
      labelColor: {
        type: String,
        default: '#666'
      }
    },
    data() {
      return {
        inputValid: false,
        inputTxt: ''
      }
    },
    created() {
      this.inputTxt = this.value
    },
    methods: {
      validate() {
        return this.$refs.inputValidator.validate()
      }
    },
    watch: {
      inputTxt(val) {
        this.$emit(EVENT_INPUT, val)
        setTimeout(() => {
          this.validate().then(rs => rs && this.$emit(EVENT_VALIDATE_SUCCESS))
        }, 20)
      },
      value(val) {
        this.inputTxt = val
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @require '~common/stylus/variables'

  .verify-input
    .input-content
      display:flex
      padding:0 16px
      .label
        position: relative
        flex:0 0 85px
        width:85px
        font-size:16px
        color: $color-title-gray
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
    .custom-msg
      margin:4px 0 0 101px
      box-sizing:border-box
      min-height:24px
      color:$color-red
      padding:5px 0
      font-size:14px
</style>
