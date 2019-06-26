<template>
  <div class="page" :class="pageCls" ref="page" :style="{backgroundColor: bgColor}">
    <header class="header" v-if="title">
      <h1>{{title}}</h1>
      <div class="back" @click="back" v-if="showBack"></div>
    </header>
    <div class="wrapper" ref="bodyWrapper">
      <main class="content" ref="contentWrapper">
        <div class="scroll-view" ref="scrollWrapper">
          <slot>{{content}}</slot>
        </div>
      </main>
    </div>
    <slot name="children-view"></slot>
  </div>
</template>

<script>
  import {isValidColor} from '../../common/utils'
  import BScroll from 'better-scroll'

  const COMPONENT_NAME = 'page'

  export default {
    name: COMPONENT_NAME,
    props: {
      title: {
        type: String,
        default: ''
      },
      showBack: {
        type: Boolean,
        default: true
      },
      type: {
        type: String,
        default: ''
      },
      desc: {
        type: String,
        default: ''
      },
      content: {
        type: String,
        default: ''
      },
      customScroll: {
        type: Boolean,
        default: true
      },
      initScroll: {
        type: Boolean,
        default: true
      },
      bgColor: {
        type: String,
        default: '#FFF',
        validator(color) {
          return isValidColor(color)
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.dom()
      })
    },
    computed: {
      pageCls() {
        return {
          [`${this.type}-page`]: this.type ? `${this.type}-page` : ''
        }
      }
    },
    methods: {
      dom() {
        const bodyWrapper = this.$refs.bodyWrapper
        const contentWrapper = this.$refs.contentWrapper
        const scrollWrapper = this.$refs.scrollWrapper
        if (this.title) {
          bodyWrapper.style.height = this.$refs.page.offsetHeight - 44 + 'px'
        }
        if (this.customScroll && !this.initScroll) {
          contentWrapper.style.height = bodyWrapper.offsetHeight + 'px'
          contentWrapper.style.overflow = 'hidden'
          scrollWrapper.style.height = `${contentWrapper.offsetHeight}px`
        }
        if (this.initScroll && this.customScroll && !this.scroll) {
          this.scroll = new BScroll(bodyWrapper, {
            observeDOM: true,
            click: true,
            scrollbar: true
          })
        }
      },
      back() {
        this.$router.back()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @require '~common/stylus/mixin'

  .page
    position: absolute
    z-index:10
    top:0
    left:0
    width:100%
    height:100%
    overflow:hidden
    .header
      position: relative
      height: 44px
      line-height: 44px
      text-align: left
      padding-left:40px
      background-color: #f7f7f7
      box-shadow: 0 1px 6px #ccc
      -webkit-backface-visibility: hidden
      backface-visibility: hidden
      z-index: 5
      h1
        font-size: 16px
        font-weight: 700
      .back
        position: absolute
        top: 0
        left: 0
        margin-left:5px
        margin-top:10px
        color: #fc9153
        width:24px
        height:24px
        bg-image-props()
        bg-image('./back')
    .wrapper
      height:100%
      width: 100%
      overflow:hidden
</style>
