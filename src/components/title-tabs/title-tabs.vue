<template>
  <div class="title-tabs">
    <div class="tabs">
      <div @click="switchItem(index)"
           ref="tabItems"
           class="tab-item"
           :class="{'title-tabs_active': index === selectedIndex}"
           v-for="(tabItem,index) in tabs">
        <span>{{tabItem}}</span>
      </div>
      <div class="indicator" ref="indicator"></div>
    </div>
  </div>
</template>

<script>
  import {prefixStyle} from '../../common/utils'

  const COMPONENT_NAME = 'title-tabs'

  const transform = prefixStyle('transform')

  const EVENT_INPUT = 'input'

  export default {
    name: COMPONENT_NAME,
    props: {
      tabs: {
        type: Array,
        default() {
          return []
        }
      },
      value: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        selectedIndex: this.value
      }
    },
    mounted() {
      setTimeout(() => {
        this.itemWidth = this.$refs.tabItems[0].offsetWidth
        this.$refs.indicator.style.width = `${this.itemWidth}px`
      }, 20)
    },
    methods: {
      switchItem(index) {
        this.selectedIndex = index
        this.$refs.indicator.style[transform] = `translate3d(${this.itemWidth * index}px,0,0)`
        this.$emit('switchStatus', index)
      }
    },
    watch: {
      value(val) {
        this.selectedIndex = val
      },
      selectedIndex(val) {
        this.$refs.indicator.style[transform] = `translate3d(${this.itemWidth * val}px,0,0)`
        this.$emit(EVENT_INPUT, val)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @require '~common/stylus/variables.styl'

  .title-tabs
    .tabs
      position: relative
      display:flex
      font-size:16px
      color: $color-title-gray
      .tab-item
        flex:1
        padding:15px 0
        box-sizing:border-box
        text-align:center
        // border-bottom:1px solid $color-gray
      .title-tabs_active
        color: $color-orange
      .indicator
        position: absolute
        left:0
        bottom:0
        height:2px
        transition:all .2s ease-in-out
        background: linear-gradient(
          to right,
          rgba(0,0,0,0) 0%,
          rgba(0,0,0,0) 20%,
          rgb(274,117,0, 0.9) 40%,
          rgb(274,117,0) 50%,
          rgba(274,117,0, 0.9) 60%,
          rgba(0,0,0,0) 80%,
          rgba(0,0,0,0) 100%) // $color-weight-orange
</style>
