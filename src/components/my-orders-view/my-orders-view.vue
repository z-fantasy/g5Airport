<template>
  <div class="my-orders-view" title="我的预约">
    <!--<ul v-if="myActivity.length > 0">-->
    <!--<li class="item font-16" v-for="(list, index) in myActivity" :key="index">-->
    <!--<div class="bg-purple padding-left white height">{{list.ACTIVITYTHEME}}</div>-->
    <!--<div class="margin title-gray ">-->
    <!--<div class="flex flex-justify-between purple margin-bottom">-->
    <!--<div class="bold">{{list.EB_STAGE_DESC}}</div><div class="flex flex-center bold size" v-if="list.EB_ENROLL_PEPOPLE_NUM">{{list.EB_ENROLL_PEPOPLE_NUM}}人</div>-->
    <!--</div>-->
    <!--<div class="margin-bottom font-14">{{list.LOCUS}}</div>-->
    <!--<div class="flex flex-justify-between font-14">-->
    <!--<div class="flex flex-center">{{validateTimeRange(list.EB_WCT_AIR_TIME, list.EB_WCT_END_TIME)}}</div>-->
    <!--<div class="flex flex-center detail size" @click="onActivityDetail(index)">详情</div>-->
    <!--</div>-->
    <!--</div>-->
    <!--</li>-->
    <!--</ul>-->
    <list-view v-if="myActivity.length > 0" :listData="myActivity" :detailUrl="'my-orders-detail'"/>
    <no-data v-else></no-data>
  </div>
</template>

<script>
  import Page from '../../components/page/page'
  import NoData from '../no-result/no-result'
  import {utilMixin} from '../../common/mixins/util'
  import {fetchMyActivity} from '../../api/salon'
  import ListView from '../brand-salon-list-view/brand-salon-list-view'
  import storage from 'good-storage'
  import {KEY_ASSETS_PREFIX} from '../../common/config'

  const COMPONENT_NAME = 'my-orders-view'
  export default {
    name: COMPONENT_NAME,
    mixins: [utilMixin],
    data() {
      return {
        myActivity: ''
      }
    },
    created() {
      this._getMyActivity()
    },
    methods: {
      validateTimeRange(startTime, endTime) {
        return `${startTime.substring(0, startTime.length - 3)}-${endTime.substring(0, endTime.length - 3)}`
      },
      _getMyActivity() {
        const self = this
        this._openToast('加载中...', {mask: true})
        fetchMyActivity().then(res => {
          this._closeToast()
          self.myActivity = res.map(item => {
            return {
              ...item,
              logoUrl: item.IMGURL ? storage.session.get(KEY_ASSETS_PREFIX) + encodeURIComponent(item.IMGURL.substr(1)) : require('../../common/images/no_image_list.jpg'),
              listTitle: item.ACTIVITYTHEME,
              validateTime: this.validateTimeRange(item.EB_WCT_AIR_TIME, item.EB_WCT_END_TIME),
              location: item.LOCUS,
              id: item.ACTIVITYID
            }
          })
        }).catch(err => this._errorCatchHandler(err))
      },
      onActivityDetail(index) {
        this.$router.push({
          name: 'my-orders-detail',
          params: {id: this.myActivity[index].ACTIVITYID}
        })
      }
    },
    components: {
      Page,
      NoData,
      ListView
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variables.styl"
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/common.styl"

  .item
    height: 4rem
    margin: 10px
    border: 1px solid $color-light-grey
    .margin
      margin: 15px 10px
    .height
      height: 1rem
      line-height: 1rem
    .size
      width: 50px
      height: 22px
    .detail
      color: #fff
      background: #ff8a33
      border-radius: 15px
</style>
