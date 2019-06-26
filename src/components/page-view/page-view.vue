<template>
  <transition name="page-move">
    <template v-if="cache">
      <keep-alive :include="includePages" :exclude="excludePages">
        <router-view class="page-view"/>
      </keep-alive>
    </template>
    <template v-else>
      <router-view class="page-view"/>
    </template>
  </transition>
</template>

<script>
  const COMPONENT_NAME = 'page-view'

  export default {
    name: COMPONENT_NAME,
    props: {
      cache: {
        type: Boolean,
        default: true
      },
      excludePages: [String, Array],
      includePages: [String, Array]
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .page-view
    transition: all 0.3s
    transform: translate3d(0, 0, 0)
    &.page-move-enter-active, &.page-move-leave-active
      transform: translate3d(100%, 0, 0)
</style>
