<template>
  <div class="blends-list-view">
    <ul v-if="blendsList&&blendsList.length>0">
      <li class="blends-item" v-for="item in blendsList">
        <div class="title" @click="showContent(item)">
          <img :src="item.imgUrl" class="blends-img">
          <div class="name">
            <div class="txt">
              <p>{{item.title}}</p>
              <i class="icon icon-arrow" :class="{'open':item.isShow}"></i>
            </div>
            <p class="status">{{item.isRead?'已读':'未读'}}</p>
          </div>
        </div>
        <transition name="fade">
          <div class="content" v-show="item.isShow">
            <p class="desc-item" v-if="item.scope">优惠范围：{{item.scope}}</p>
            <p class="desc-item" v-if="item.startTime&&item.endTime">优惠有效期：{{item.startTime}}-{{item.endTime}}</p>
            <p class="desc-item" v-if="item.desc">优惠说明：</p>
            <div v-if="item.desc" v-html="item.desc"></div>
            <p class="desc-item" v-if="item.tip">温馨提示：</p>
            <div v-if="item.tip" v-html="item.tip"></div>
            <a :href="item.detailUrl" class="desc-item">点击查看更多</a>
          </div>
        </transition>
      </li>
    </ul>
    <no-data v-else></no-data>
  </div>
</template>

<script type="text/ecmascript-6">
  import {fetchBlendsList, changeBlendsStatus} from '../../api/blends'
  import {createBlendsObj} from '../../common/models/Blends'
  import {utilMixin} from '../../common/mixins/util'
  import NoData from '../no-result/no-result'

  const COMPONENT_NAME = 'blends-list'
  export default {
    name: COMPONENT_NAME,
    mixins: [utilMixin],
    data() {
      return {
        isShow: false,
        blendsList: []
      }
    },
    created() {
      let typeId = this.$route.params.id
      if (typeId) {
        this._getBlendsList(typeId)
      } else {
        this.$router.back()
      }
    },
    methods: {
      showContent(item) {
        this.blendsList.forEach((blends, index) => {
          if (blends.id === item.id) {
            this.blendsList[index].isShow = !this.blendsList[index].isShow
          }
        })
        if (!item.isRead) {
          changeBlendsStatus(item).then(res => {
            if (res) {
              this.blendsList.forEach((blends, index) => {
                if (blends.id === item.id) {
                  this.blendsList[index].isRead = true
                }
              })
            }
          }).catch(e => console.warn(e.message))
        }
      },
      _getBlendsList(id) {
        this._openToast('活动荟萃列表加载中...')
        fetchBlendsList(id).then(res => {
          this._closeToast()
          if (res) {
            res.forEach(item => {
              this.blendsList.push(createBlendsObj(item))
            })
          } else {
            this._openAlert('活动荟萃列表信息加载失败，请重试')
          }
        })
      }
    },
    components: {
      NoData
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variables.styl"
  @import "~common/stylus/mixin.styl"

  .blends-list-view
    padding: 10px
    .blends-item
      margin-bottom: 20px
      border: 1px solid $color-light-grey
      .title
        position: relative
        z-index: 2
        width: 100%
        height: auto
        font-size: 0
        background-color: $color-white
        .blends-img
          width: 100%
        .name
          display: flex
          align-items: center
          justify-content: space-between
          padding: 10px
          line-height: 22px
          font-size: $fontsize-large-x
          color: $color-purple
          .txt
            display: flex
            flex: 1
            p
              txt-overflow-1()
          .icon-arrow
            flex: 0 0 22px
            margin-left: 10px
            width: 20px
            height: 18px
            bg-image('./arrow')
            transform: rotate(0deg)
            transition: all .4s
            &.open
              transform: rotate(180deg)
          .status
            flex: 0 0 60px
            width: 60px
            text-align: right
            font-size: $fontsize-medium
            color: $color-grey
      .content
        position: relative
        z-index: 1
        width: 100%
        padding: 10px
        line-height: 22px
        box-sizing: border-box
        font-size: $fontsize-large
        color: $color-grey
        border-top-1px(#F7DBC6)
        .desc-item
          display: block
          margin-top: 6px
        &.fade-enter-active, &.fade-leave-active
          transition: all .4s
        &.fade-enter, &.fade-leave-to
          opacity: 0
</style>
