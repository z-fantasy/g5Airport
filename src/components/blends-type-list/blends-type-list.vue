<template>
  <div class="blends-type-list-view">
    <ul v-if="blendTypeList&&blendTypeList.length>0">
      <li class="blend-item" v-for="item in blendTypeList">
        <div class="actContent">
          <p>活动时间：{{item.timeLimit}}</p>
          <router-link tag="div" class="blend-type-item" :key="item.id" :to="{name: 'activity-detail', params: {id: item.id}}">
            <img @load="onPosterLoad" v-lazy="item.imgUrl" class="blend-img">
          </router-link>
          <h3 @click="showDetail(item)" :class="{show: item.isShow}">{{item.name}}</h3>
        </div>
        <div class="content" v-show="item.isShow">
          <div class="desc-item">
            <div class="item-desc-title">
              <span>
                优惠范围：
              </span>
            </div>
            <div class="item-desc-content">
              <div>{{item.scope}}</div>
            </div>
          </div>
          <div class="desc-item" v-if="item.desc">
            <div class="item-desc-title">
              <span>
                优惠说明：
              </span>
            </div>
            <div class="item-desc-content">
              <div v-if="item.desc" v-html="item.desc"></div>
            </div>
          </div>
          <div class="desc-item" v-if="item.tip">
            <div class="item-desc-title">
              <span>
                温馨提示：
              </span>
            </div>
            <div class="item-desc-content">
              <div v-if="item.tip" v-html="item.tip"></div>
            </div>
          </div>
          <div class="desc-item" v-if="item.detailUrl">
            <div class="item-desc-title">
              <span>
                详情链接：
              </span>
            </div>
            <div class="item-desc-content">
              <a :href="item.detailUrl"></a>
            </div>
          </div>
        </div>
      </li>
      <!--<router-link tag="li" class="blend-type-item" v-for="item in blendTypeList" :key="item.id" :to="{name: 'activity-detail', params: {id: item.id}}">-->
        <!--<img @load="onPosterLoad" v-lazy="item.imgUrl" class="blend-img">-->
        <!--<i class="icon status-icon" :class="{'readed-icon':!item.unReadNum}" v-show="item.imgUrl"></i>-->
      <!--</router-link>-->
    </ul>
    <no-data v-else></no-data>
  </div>
</template>

<script>
  import {fetchBlendsType} from '../../api/blends'
  import {createBlendsTypeObj, createUiZd} from '../../common/models/Blends'
  import {utilMixin} from '../../common/mixins/util'
  import NoData from '../no-result/no-result'
  import EventBus, {EVENT_IMG_BRAND_DETAIL_LOAD} from '../../common/eventBus'

  const COMPONENT_NAME = 'blends-type-list'

  export default {
    name: COMPONENT_NAME,
    mixins: [utilMixin],
    data() {
      return {
        blendTypeList: []
      }
    },
    created() {
      this._getBlendTypes()
    },
    methods: {
      showDetail(item) {
        item.isShow = !item.isShow
        EventBus.$emit(EVENT_IMG_BRAND_DETAIL_LOAD)
      },
      _getBlendTypes() {
        this._openToast('活动荟萃信息加载中...')
        fetchBlendsType().then(res => {
          this.blendTypeList = []
          this._closeToast()
          if (res) {
            res.forEach(item => {
              this.blendTypeList.push(createUiZd(item)) // createBlendsTypeObj
            })
//            console.log(this.blendTypeList)
          } else {
            this._openAlert('获取活动荟萃信息失败，请重试')
          }
        }).catch(err => this._errorCatchHandler(err))
      },
      onPosterLoad() {
        EventBus.$emit(EVENT_IMG_BRAND_DETAIL_LOAD)
      }
    },
    components: {
      NoData
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variables.styl"

  .blends-type-list-view
    width: 100%
    padding: 16px 10px
    box-sizing: border-box
    .blend-item
      padding: 12px 10px
      background: #fff
      border-radius : 6px
      margin-bottom: 12px
      box-shadow : 0 4px 4px 2px #E0E0E0
      .actContent
        >p
          color: $color-title-gray
          font-size : $fontsize-medium
        >h3
          font-size : $fontsize-large-xx
          position : relative
          &::after
            content: ''
            position : absolute
            right: 4px
            top: 50%
            margin-top: -5px
            width: 0
            height: 0px
            border: 6px solid transparent
            border-top-color: #999
            transition : all 0.2s
        .show
          &::after
            margin-top: -10px
            transform : rotate(180deg)
        .blend-type-item
          margin: 10px 0
          height: 120px
          border-radius : 6px
          display: flex
          flex-direction : column
          align-items : center
          justify-content :center
          overflow : hidden
          .blend-img
            width: 100%
            height: auto
            .blend-img[lazy=loading]
              height: 120px
              background: url('~common/images/loading.gif') no-repeat center
              background-size: 16px
              box-shadow: 0 0 6px $color-purple
            .blend-img[lazy=error]
              height: 120px
              background: url('~common/images/no_image_list.jpg') no-repeat center
              background-size: contain
              box-shadow: 0 0 6px $color-purple
      .content
        font-size : $fontsize-medium
        color: $color-title-gray
        border-top-1px()
        padding-top: 6px
        margin-top: 6px
        .desc-item
          display: flex
          margin: 6px 0
          .item-desc-content
            flex: 1
      &.fade-enter-active, &.fade-leave-active
        transition: all .4s
      &.fade-enter, &.fade-leave-to
        opacity: 0
    .blend-type-item
      position: relative
      margin-bottom: 10px
      &:last-child
        margin-bottom: 0
      .blend-img
        width: 100%
        height: auto
      .blend-img[lazy=loading]
        height: 136px
        background: url('~common/images/loading.gif') no-repeat center
        background-size: 16px
        box-shadow: 0 0 6px $color-purple
      .blend-img[lazy=error]
        height: 136px
        background: url('~common/images/no_image_list.jpg') no-repeat center
        background-size: contain
        box-shadow: 0 0 6px $color-purple
      .status-icon
        position: absolute
        top: 0
        right: 0
        width: 35px
        height: 35px
        bg-image('./unread')
        &.readed-icon
          bg-image('./readed')
</style>
