<template>
  <div class="brand-detail-view">
    <!--<div class="top-rainbow"></div>-->
    <div class="padding-bottom">
      <detail-content :detailInfo="detailInfo" :type="'salon'" :btnStatus="buttonStatus" :btnTxt="buttonTxt" @goNext="order"/>
    </div>
  </div>
</template>

<script>
  import {fetchSalonDetail, fetchMyActivity, cancleActivity} from '../../api/salon'
  import {createSalonObj} from '../../common/models/Salon'
  import {utilMixin} from '../../common/mixins/util'
  import {formatDate} from '../../common/utils'
  import store from '../../store/index'
  import DetailContent from '../detail-content/detail-content'

  const COMPONENT_NAME = 'salon-detail'

  export default {
    name: COMPONENT_NAME,
    mixins: [utilMixin],
    data() {
      return {
        detailInfo: {},
        ActivityId: '',
        activityCost: '',
        buttonTxt: '立即预约',
        buttonStatus: 0,
        enrollId: '',
        paramsId: ''
      }
    },
    activated() {
      let brandId = this.$route.params.id
      if (brandId) {
        this.paramsId = brandId
        this._getBrandInfo(brandId)
      } else {
        this.paramsId = ''
        this.$router.back()
      }
    },
    methods: {
      order() {
        let memberPoints = store.getters.userInfo.bonus
        if (this.activityCost * 1 > memberPoints * 1) {
          this._openAlert('积分不足！')
          return
        }
        if (!this.buttonStatus && this.buttonTxt === '取消预约' && this.enrollId) {
          this._openToast('正在取消', {mask: true})
          cancleActivity(this.enrollId).then(res => {
            if (!res.EB_ENROLL_ID) {
              this.buttonTxt = '预约活动'
              this.buttonStatus = 0
              this.enrollId = ''
              this._getBrandInfo(this.paramsId)
            }
          }).catch(errs => {
            this._openAlert(`取消预约失败：${errs}`)
          })
          return
        }
        this.$router.push({
          name: 'salon-order',
          params: {salonInfo: this.detailInfo}
        })
      },
      _getBrandInfo(id) {
        this._openToast('信息加载中...', {mask: true})
        const self = this
        fetchSalonDetail(id).then(brand => {    //  获取活动详情
          self._closeToast()
          self.detailInfo = createSalonObj(brand)
          self.activityId = brand.ActivityId
          self.activityCost = brand.Cost
          const nowDate = new Date().getTime() // formatDate(new Date(), 'yyyy/MM/dd hh:mm:ss')
          if (brand.EndTime && nowDate > new Date(brand.EndTime).getTime()) {   //  判断活动时间是否已失效
            self.buttonTxt = '活动已结束'
            self.buttonStatus = 1
            return
          }
          self.buttonTxt = '预约活动'
          self.buttonStatus = 0
          fetchMyActivity().then(res => {   //  获取我的预约信息，判断是否预约过该活动
            res.forEach(item => {
              if (item.ACTIVITYID === self.activityId) {
//                self.buttonTxt = '您已预约本次活动'
//                self.buttonStatus = 2
                self.buttonTxt = '取消预约'
                self.buttonStatus = 0
                self.enrollId = item.EB_ENROLL_ID
              } else {
                self.enrollId = ''
              }
            })
          }).catch(err => this._errorCatchHandler(err))
        }).catch(err => this._errorCatchHandler(err))
      }
    },
    components: {
      DetailContent
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .padding-bottom
    padding-bottom: 15px
</style>
