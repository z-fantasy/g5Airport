<template>
  <page type="salon-order" title="活动预约">
    <!--<div class="top-rainbow"></div>-->
    <div class="salon-order-wrapper">
      <div class="content-area">
        <verify-input type="text"
                      key="1"
                      ref="verifyNameInput"
                      :label="'姓名'"
                      :labelColor="inputLabelColor"
                      :placeholder="'请输入姓名'"
                      :rules="{required: true}"
                      class="salonOrdInput"
                      v-model="validateResult[0]"/>
        <verify-input type="phone"
                      key="2"
                      ref="verifyPhoneInput"
                      :label="'手机号'"
                      :labelColor="inputLabelColor"
                      :placeholder="'请输入手机号'"
                      class="salonOrdInput"
                      :rules="{type: 'tel', required: true}"
                      v-model="validateResult[1]"/>
        <div v-if="pikerOptions.selectedStage.length === 0">
          <div class="sex-box">
            <verify-input type="text"
                          key="3"
                          ref="verifyStageInput"
                          :label="'参与场次'"
                          :labelColor="inputLabelColor"
                          :placeholder="'目前暂无可预约场次'"
                          :disabled="true"/>
          </div>
          <div class="sex-box">
            <verify-input type="text"
                          key="4"
                          ref="verifyCountInput"
                          :label="'参与人数'"
                          :labelColor="inputLabelColor"
                          :placeholder="'请选择参与人数'"
                          :disabled="true"/>
          </div>
          <div class="sex-box">
            <verify-input type="text"
                          key="5"
                          ref="verifyDriveInput"
                          :label="'是否驾车'"
                          :labelColor="inputLabelColor"
                          :placeholder="'请选择是否驾车'"
                          :disabled="true"/>
          </div>
        </div>
        <div v-if="pikerOptions.selectedStage.length > 0">
          <div class="sex-box" @click="pickStage">
            <verify-input type="text"
                          key="3"
                          ref="verifyStageInput"
                          :label="'参与场次'"
                          :labelColor="inputLabelColor"
                          :placeholder="'请选择场次'"
                          :rules="{required: true}"
                          :readonly="true"
                          v-model="validateResult[2]"/>
          </div>
          <div class="sex-box" @click="pickMemberCount">
            <verify-input type="text"
                          key="4"
                          ref="verifyCountInput"
                          :label="'参与人数'"
                          :labelColor="inputLabelColor"
                          :placeholder="'请选择参与人数'"
                          :rules="{required: true}"
                          :readonly="true"
                          v-model="showResult[3]"/>
          </div>
          <div class="sex-box" @click="pickDriveInfo">
            <verify-input type="text"
                          key="5"
                          ref="verifyDriveInput"
                          :label="'是否驾车'"
                          :labelColor="inputLabelColor"
                          :placeholder="'请选择是否驾车'"
                          :rules="{required: true}"
                          :readonly="true"
                          v-model="showResult[4]"/>
          </div>
        </div>
      </div>
      <div class="btn-area">
        <base-button :disabled="isOkClick" @click="order">立即预约</base-button>
      </div>
    </div>
  </page>
</template>

<script>
  import Page from '../../../../../components/page/page'
  import VerifyInput from '../../../../../base/verify-input/verify-input'
  import BaseButton from '../../../../../base/base-button/base-button'
  import {MAIN_COLOR} from '../../../../../common/config'
  import {fetchSalonDetail, fetchBookActivity} from '../../../../../api/salon'
  import {utilMixin} from '../../../../../common/mixins/util'
  import {userMixin} from '../../../../../common/mixins/user'
  import {formatDate} from '../../../../../common/utils'
  import store from '../../../../../store/index'

  const PAGE_NAME = 'salon-order'

  export default {
    name: PAGE_NAME,
    mixins: [utilMixin, userMixin],
    data() {
      return {
        activityInfo: '', // 提交时获取活动信息接口返回的数据
        pikerOptions: {
          selectedStage: [],  // 可选场次
          participantsNumber: [] // 参与人数
        },
        validateResult: ['', '', '', '', ''],
        showResult: ['', '', '', '', ''],
        activityId: '',
        allReserved: '',
        stageSelectedVal: '',
        stageId: ''
      }
    },
    computed: {
      isOkClick () {
        if (this.pikerOptions.selectedStage.length > 0) {
          return false
        } else {
          return true
        }
      }
    },
    created() {
      store.commit('setActivityId', this.$route.params.salonInfo.id)
      this.activityId = this.$route.params.salonInfo.id
      this.validateResult[0] = store.getters.userInfo.name
      this.validateResult[1] = store.getters.userInfo.mobile
      this.inputLabelColor = MAIN_COLOR
      this.getPikerOptions()
    },
    methods: {
      validateTimeRange(startTime, endTime) {
        return `${startTime.split(' ')[0]}-${endTime.split(' ')[0]}`
      },
      getPikerOptions () {
        const self = this
        self.selectedStageArr = self.$route.params.salonInfo.ActivityStage  // 可选场次
        self.selectedStageArr.forEach(res => {
          let validityTime = self.validateTimeRange(res.EB_WCT_AIR_TIME, res.EB_WCT_END_TIME)
          let endTime = res.EB_WCT_END_TIME
          const nowDate = formatDate(new Date(), 'yyyy/MM/dd hh:mm:ss')
          if (endTime && endTime > nowDate) {   //  判断活动时间段是否失效
            self.pikerOptions.selectedStage.push(
              {value: validityTime, text: validityTime}
            )
          }
        })

        let LimitEnrollVipNum = parseInt(self.$route.params.salonInfo.LimitEnrollVipNum)   //  每个会员可参与人数
        for (let i = 1; i <= LimitEnrollVipNum; i++) {
          i = i.toString()
          self.pikerOptions.participantsNumber.push(
            {value: i, text: i + '人'}
          )
        }
      },
      getStageId () {
        const self = this
        self.selectedStageArr.forEach(res => {
          let validityTime = self.validateTimeRange(res.EB_WCT_AIR_TIME, res.EB_WCT_END_TIME)
          if (validityTime.indexOf(self.stageSelectedVal) !== -1) {
            self.stageId = res.EB_STAGE_ID
          }
        })
       // console.log(self.stageId, '传到后台的stageId')
      },
      pickStage() {
        if (!this.picker) {
          this.picker = this.$createPicker({
            title: '请选择场次',
            data: [this.pikerOptions.selectedStage],
            visible: false,
            selectedIndex: ['0'],
            onSelect: (selectedVal, selectedIndex, selectedText) => {
              this.validateResult.splice(2, 1, selectedVal[0])
              this.stageSelectedVal = selectedVal
              this.getStageId()
              // console.log(this.stageSelectedVal, '用户选择的场次的时间')
            }
          })
        }
        this.picker.show()
      },
      pickMemberCount() {
        if (!this.memberPicker) {
          this.memberPicker = this.$createPicker({
            title: '请选择参与人数',
            data: [this.pikerOptions.participantsNumber],
            selectedIndex: ['1'],
            onSelect: (selectedVal, selectedIndex, selectedText) => {
              this.validateResult.splice(3, 1, selectedVal[0])
              this.showResult.splice(3, 1, selectedText[0])
            }
          })
        }
        this.memberPicker.show()
      },
      pickDriveInfo() {
        if (!this.drivePicker) {
          this.drivePicker = this.$createPicker({
            title: '请选择是否驾车',
            data: [
              [
                {
                  value: '否',
                  text: '否',
                  confirmVal: '2'
                },
                {
                  value: '是',
                  text: '是',
                  confirmVal: '1'
                },
                {
                  value: '待定',
                  text: '待定',
                  confirmVal: ''
                }
              ]
            ],
            selectedIndex: ['1'],
            onSelect: (selectedVal, selectedIndex, selectedText) => {
              this.showResult.splice(4, 1, selectedText[0])
              let index = selectedIndex[0]
              let confirmVal = this.drivePicker.data[0][index].confirmVal
              this.validateResult.splice(4, 1, confirmVal)
            }
          })
        }
        this.drivePicker.show()
      },
      order() {
        let checkPhone = this.$refs.verifyPhoneInput.validate()
        let checkName = this.$refs.verifyNameInput.validate()
        let checkMember = this.$refs.verifyCountInput.validate()
        let checkDrive = this.$refs.verifyDriveInput.validate()
        let checkStage = this.$refs.verifyStageInput.validate()
        Promise.all([checkPhone, checkName, checkMember, checkDrive, checkStage]).then(rs => {
          if (!rs.every(item => item)) {
            this._openAlert(messages.common.txt_invalid_input)
            return
          }
          this._openToast(messages.common.txt_submit, {mask: true})

          let [name, phone, stage, count, isDrive] = this.validateResult
          // 获取表单提交参数
          const data = {
            EB_ENROLL_NAME: name,
            EB_ENROLL_PHONE: phone,
            EB_STAGE_ID: this.stageId,
            EB_ENROLL_PEPOPLE_NUM: count,
            EB_ENROLL_ISDRIVE: isDrive,
            EB_ACTIVITY_ID: this.activityId
          }
          this._orderHandler(data)
        })
      },
      _orderHandler(data) {
       // console.log(data, '提交到后台的data')
        const self = this
        fetchSalonDetail(this.activityId).then(brand => {  //  获取本场活动报名人数信息
          this._closeToast()
          this.activityInfo = brand
          brand.ActivityStage.forEach(item => {
            if (self.stageId === item.EB_STAGE_ID) {
              self.allReserved = item.AllReserved   //  本场活动已经报名的预约人数
            }
          })
          let LimitPeople = brand.LimitPeople   // 每场活动限制报名人数
          let inputPeople = data.EB_ENROLL_PEPOPLE_NUM // 会员填写的实际参与人数
          let lastReservedPeople = LimitPeople - self.allReserved  //  本场活动还可以报名人数

          // console.log(self.allReserved + '本场活动已经报名的预约人数', LimitPeople + '每场活动限制报名人数', this.activityInfo.LimitEnrollVipNum +
          //   '会员可参与人数', lastReservedPeople + '本场活动还可以报名人数', inputPeople + '会员填写的实际参与人数')
          if (lastReservedPeople === 0) {
            this._openAlert('该场次活动已无名额！')
          } else if (inputPeople > lastReservedPeople) {
            this._openAlert('该场次活动名额剩余 ' + lastReservedPeople + ' 个')
          } else {
            fetchBookActivity(data).then(res => {  // 提交预约信息
              this._getUserInfo()
              this._openGAlert({title: '预约成功'}, 'signin', this.toDetailPage)
            }).catch(e => { this._openAlert(e.message) })
          }
        }).catch(err => this._errorCatchHandler(err))
      },
      toDetailPage() {
        this.$router.back()
//        this.$router.replace({
//          name: 'salon-detail'
//        })
      }
    },
    components: {
      Page,
      VerifyInput,
      BaseButton
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  .sex-box,.salonOrdInput
    border-bottom-1px()
    padding: 4px
  /deep/ .input-control
    flex:1
    &::after
      border-radius: 16px
      border: none
    &.cube-input_active
      &::after
        border: none
  .salon-order-wrapper
    padding: 24px 0
    .btn-area
      padding: 20px 16px
</style>
