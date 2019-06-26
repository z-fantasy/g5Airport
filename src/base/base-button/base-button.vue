<template>
  <cube-button class="base-button" v-bind="$props" @click="clickHandler">
    <slot></slot>
  </cube-button>
</template>

<script>
  const COMPONENT_NAME = 'base-button'

  const EVENT_CLICK = 'click'

  export default {
    name: COMPONENT_NAME,
    props: {
      icon: {
        type: String,
        default: ''
      },
      active: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      inline: {
        type: Boolean,
        default: false
      },
      primary: {
        type: Boolean,
        default: false
      },
      outline: {
        type: Boolean,
        default: false
      },
      light: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: 'button'
      }
    },
    methods: {
      clickHandler(e) {
        this.$emit(EVENT_CLICK, e)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @require '~common/stylus/variables'

  .cube-btn
    &.base-button
      border-radius: 8px
      background: linear-gradient(to left, orange, #f75d00); // $color-purple
      &.cube-btn_active, &:active
        background: $color-gray
        &::after
         border:none
      &:not(:last-child)
        margin-bottom:15px
      &.cube-btn_disabled
        background: $color-gray
        &::after
          border:none
</style>
