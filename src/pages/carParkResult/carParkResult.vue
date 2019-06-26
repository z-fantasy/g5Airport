<template>
  <page type="car-park" ref="page">
    <div class="carPaySult">
      <div class="payRes">支付完成</div>
      <div class="carPayBtn">
        <router-link to="car-payment-record" class="carPayRec">缴费记录</router-link>
        <router-link to="/" class="toBackHome">回到首页</router-link>
      </div>
      <p class="car-park-rec-red">
        {{resultText}}
      </p>
    </div>
  </page>
</template>

<script type="text/ecmascript-6">
  import Page from '../../components/page/page.vue'
  import {utilMixin} from 'common/mixins/util'
  import {carPayforBack, carPayDeduction, getHasPayRec} from '../../api/carPark'
  import {mapGetters} from 'vuex'
  import storage from 'good-storage'

  export default {
    name: 'car-park-result',
    mixins: [utilMixin],
    data() {
      return {
        resultText: '请20分钟内离场！'
      }
    },
    activated() {
      if (storage.get('nedDeduction', false)) {
        carPayDeduction(storage.get('nedDeduction')).then(res => {
          storage.remove('nedDeduction')
        }).catch(err => {
          // 如果扣减失败，储存一下，下次进入再扣减
          this._openAlert(`扣减失败：${err}`)
          storage.remove('nedDeduction')
        })
      }
      if (this.$route.query.carParkNo || storage.get('carParkNo', false)) {
        if (this.$route.query.disCouponAll) {
          this.resultText = '优惠卷已生效！'
        } else {
          this.resultText = '请20分钟内离场！'
        }
        const cbData = this.$route.query.carParkNo ? this.$route.query.carParkNo : storage.get('carParkNo')
        const carParkData = JSON.parse(decodeURIComponent(cbData))
        console.log(carParkData)
        this._openToast()
        getHasPayRec({
          'carCode': carParkData['ParkCompleteData']['CardNumber'],
          'inTime': carParkData['ParkCompleteData']['ParkStartDateTime'],
          'totalFree': carParkData['ParkCompleteData']['TotalAmount']
        }).then(res => {
          if (~~res === 1) {
            this._closeToast()
            this._openAlert(`该车牌已经缴过费，无需再次缴费，请尽快离场`)
            if (!this.$route.query.carParkNo) {
              storage.remove('carParkNo')
            }
          } else {
            carPayforBack(carParkData).then(res => {
              if (!this.$route.query.carParkNo) {
                storage.remove('carParkNo')
              }
              this._closeToast()
            }).catch(err => {
              this._closeToast()
              console.log(err)
              this.$nextTick(this._openAlert(err.message))
            })
          }
        }).catch(err => {
          this._closeToast()
          this._openAlert(`查询是否已经缴费记录失败：${err}`)
        })
      } else {
        this._openAlert('未获取到传入参数！')
      }
    },
    components: {
      Page
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .carPaySult
    min-height: 504px
    display: flex
    flex-direction column
    justify-content: center
    align-items: center
    .payRes
      line-height: 100px
    .carPayBtn
      padding: 10px 0
    .toBackHome, .carPayRec
      padding: 10px 16px
      font-size: 24px
      color: #fff
      background: #3484F5
      margin: 0 10px
      border-radius: 6px
    .car-park-rec-red
      margin-top: 100px
      font-size: 22px
      color: red
</style>
