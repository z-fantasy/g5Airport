<template>
  <div class="my-score-view" ref="scoreView">
    <!--<div class="top-rainbow" ref="headLine"></div>-->
    <div class="header-wrapper" ref="headerWrapper">
      <div class="header-info">
        <div class="bonus-info">
          <span class="label">我的积分</span>
          <span class="count">{{bonus}}</span>
        </div>
        <!--积分兑礼按钮先关上-->
        <!--<router-link class="score-change-router" :to="{name: 'scores-to-exchange', query: {from: 1}}">-->
          <!--<i class="icon icon-bonus"></i>-->
          <!--<span class="txt">积分兑礼</span>-->
        <!--</router-link>-->
      </div>
      <title-tabs :tabs="selectOptions" v-model="statusTypeIndex" @switchStatus="switchType" ref="titleTab"/>
    </div>
    <div class="score-content-wrapper" ref="scoreScroll">
      <cube-scroll
        ref="scroll"
        :data="scoreRecords"
        :options="options"
        @pulling-up="onPullingUp">
        <ul v-if="scoreRecords&&scoreRecords.length>0">
          <li class="item" v-for="item in scoreRecords">
            <p class="time">{{item.datetime}}</p>
            <p class="name">{{item.name}}</p>
            <p class="bonus">{{formatBonus(item.score)}}</p>
          </li>
        </ul>
        <no-data v-else/>
        <template slot="pulldown" slot-scope="props">
          <div
            v-if="props.pullDownRefresh"
            class="cube-pulldown-wrapper"
            :style="props.pullDownStyle">
            <div
              v-if="props.beforePullDown"
              class="before-trigger"
              :style="{paddingTop: props.bubbleY + 'px'}">
              <span :class="{rotate: props.bubbleY > 40}">↓</span>
            </div>
            <div class="after-trigger" v-else>
              <div v-if="props.isPullingDown" class="loading">
                <cube-loading></cube-loading>
              </div>
              <div v-else><span>Refresh success</span></div>
            </div>
          </div>
        </template>
      </cube-scroll>
    </div>
  </div>
</template>

<script>
  import TitleTabs from '../title-tabs/title-tabs'
  import {fetchUserScoreRecords} from '../../api/common'
  import {utilMixin} from '../../common/mixins/util'
  import NoData from '../../components/no-result/no-result'
  import {formatNumber} from '../../common/utils'
  import {mapGetters} from 'vuex'

  const COMPONENT_NAME = 'my-score-view'

  export default {
    name: COMPONENT_NAME,
    mixins: [utilMixin],
    data() {
      return {
        statusTypeIndex: 0,
        page: 1,
        options: {
          scrollbar: false,
          pullUpLoad: {
            threshold: 0,
            txt: {
              more: '加载更多',
              noMore: '没有更多了'
            }
          }
        },
        scoreRecords: []
      }
    },
    created() {
      this.selectOptions = ['累计记录', '兑换记录']
      this._getScoreRecords()
    },
    mounted() {
      setTimeout(() => {
        let headLineHeight = 0 // this.$refs.headLine.offsetHeight
        let headHeight = this.$refs.headerWrapper.offsetHeight
        let scoreHeight = this.$refs.scoreView.offsetHeight
        this.$refs.scoreScroll.style.top = `${headHeight + headLineHeight}px`
        this.$refs.scoreScroll.style.height = `${scoreHeight - headHeight - headLineHeight}px`
      }, 80)
    },
    computed: {
      bonus() {
        return formatNumber(this.userInfo.bonus) || '0'
      },
      ...mapGetters([
        'userInfo'
      ])
    },
    methods: {
      formatBonus(bonus) {
        return bonus ? bonus > 0 ? `+${bonus}分` : `${bonus}分` : '0分'
      },
      onPullingUp() {
        if (!this.loadFinish) {
          this.page++
          this._getScoreRecords()
        } else {
          this.$refs.scroll.forceUpdate()
        }
      },
      switchType(index) {
        if (this.statusTypeIndex === index) return
        this.statusTypeIndex = index
        this.page = 1
        this.loadFinish = false
        this._getScoreRecords()
      },
      resetData() {
        this.statusTypeIndex = 0
        this.page = 1
        this.loadFinish = false
        this._getScoreRecords()
      },
      _getScoreRecords() {
        this._openToast('搜索中...', {mask: true})
        let info = {
          action: this.statusTypeIndex,
          page: this.page,
          pageSize: 10
        }
        fetchUserScoreRecords(info).then(res => {
          this._closeToast()
          if (this.page === 1) {
            this.scoreRecords = []
            this.$refs.scroll.scrollTo(0, 0)
          }
          if (res.length) {
            this.scoreRecords = this.scoreRecords.concat(this._normalizeList(res))
          } else {
            this.loadFinish = true
            this.$refs.scroll.forceUpdate()
          }
        }).catch(e => {
          this._closeToast()
          this._openAlert(e.errmsg)
        })
      },
      _normalizeList(list) {
        let result = []
        list.forEach(item => {
          result.push({
            action: item.ReasonCode,
            score: item.Bonus,
            name: item.ReasonDesci || item.ActionDesci,
            datetime: item.CreateDateTime
          })
        })
        return result
      }
    },
    components: {
      TitleTabs,
      NoData
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @require "~common/stylus/variables.styl"
  @require "~common/stylus/mixin.styl"
  .my-score-view
    position: relative
    height:100%
  .header-wrapper
    .header-info
      display: flex
      align-items: center
      justify-content: center
      padding: 30px 16px
      bg-image('./user_icon_bg_s')
      background-size : 100%
      .bonus-info
        flex: 1
        color: #fff
        .label
          font-size: $fontsize-large-xx
        .count
          font-size: $fontsize-large-xxxx
      .score-change-router
        display: flex
        align-items: center
        justify-content: center
        flex: 0 0 120px
        width: 120px
        height: 32px
        background-color: #fff
        color: $color-orange
        border-radius: 24px
        .icon-bonus
          width: 24px
          height: 24px
          bg-image('./bonus_change')
          margin-right: 4px
        .txt
          font-size: $fontsize-large
          line-height: 42px
  .score-content-wrapper
    position: absolute
    overflow:hidden
    left: 0
    right: 0
    ul
      padding: 0 6px
    .item
      display: flex
      align-items: center
      justify-content: center
      padding: 16px 0 10px
      line-height: 24px
      font-size: $fontsize-large
      color: $color-title-gray
      border-bottom-1px()
      &:last-child
        border-none()
      .time
        flex: 0 0 180px
        width: 180px
        padding-left: 15px
      .name
        flex: 1
        txt-overflow-2()
      .bonus
        flex: 0 0 80px
        width: 80px
        text-align: right
  .score-content-wrapper
    .cube-pullup-wrapper
      .before-trigger
        font-size: $fontsize-medium
</style>
