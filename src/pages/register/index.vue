<template>
  <page type="register">
    <div class="top-rainbow"></div>
    <div class="register-wrapper">
      <verify-code key="1" ref="verifyCode" store-key="registerCode" :labelColor="inputLabelColor" v-model="validateResult[0]" @click="onSendCode"/>
      <verify-input type="number"
                    key="2"
                    ref="verifyCodeInput"
                    :label="messages.register.txt_label_verify_code"
                    :labelColor="inputLabelColor"
                    :placeholder="messages.register.txt_input_verify_code"
                    :maxlength="6"
                    :rules="{len: 6,required: true}"
                    v-model="validateResult[1]"
                    :len="6"/>
      <verify-input type="text"
                    key="3"
                    ref="verifyNameInput"
                    :label="messages.register.txt_label_username"
                    :labelColor="inputLabelColor"
                    :placeholder="messages.register.txt_input_username"
                    :maxlength="16"
                    minlength="2"
                    :rules="{required: true}"
                    v-model="validateResult[2]"/>
      <div class="sex-box" @click="pickSex">
        <verify-input type="text"
                      key="4"
                      ref="verifySexInput"
                      :label="messages.register.txt_label_sex"
                      :labelColor="inputLabelColor"
                      :placeholder="messages.register.txt_select_sex"
                      :rules="{required: true}"
                      :readonly="true"
                      v-model="validateResult[4]"/>
      </div>
      <div class="birthday-box" @click="pickBirthday">
        <verify-input type="text"
                      key="5"
                      ref="verifyBirthdayInput"
                      :label="messages.register.txt_label_birthday"
                      :labelColor="inputLabelColor"
                      :placeholder="messages.register.txt_select_birthday"
                      :rules="{required: true}"
                      :readonly="true"
                      v-model="validateResult[5]"/>
      </div>
      <div class="birthday-box" @click="pickAddress">
        <verify-input type="text"
                      key="7"
                      ref="verifyBigAddressInput"
                      :label="messages.register.txt_label_address"
                      :labelColor="inputLabelColor"
                      :placeholder="messages.register.txt_select_address"
                      :rules="{required: true}"
                      :readonly="true"
                      v-model="validateResult[6]"/>
      </div>
      <div class="birthday-box">
        <verify-input type="text"
                      key="8"
                      ref="verifyDetailAddressInput"
                      :label="messages.register.txt_label_detail_address"
                      :labelColor="inputLabelColor"
                      :placeholder="messages.register.txt_input_address"
                      :rules="{required: true}"
                      v-model="validateResult[7]"/>
      </div>
      <verify-input type="password"
                    key="6"
                    ref="verifyPwdInput"
                    :label="messages.register.txt_label_password"
                    :labelColor="inputLabelColor"
                    :placeholder="messages.register.txt_input_password"
                    :rules="{pattern: pwdRegex,required: true}"
                    v-model="validateResult[3]"/>
      <select-tags @select="selectTags"/>
      <div class="operations">
        <base-button @click="register">{{inviteCode ? '接受邀请并注册' : messages.register.txt_btn_register}}</base-button>
        <router-link tag="span" class="go-login" :to="{name: 'login'}">{{messages.register.txt_go_login}}</router-link>
      </div>
    </div>
  </page>
</template>

<script>
  import Page from '../../components/page/page'
  import VerifyCode from '../../base/verify-code/verify-code'
  import VerifyInput from '../../base/verify-input/verify-input'
  import BaseButton from '../../base/base-button/base-button'
  import {REGEX_NORMAL_PASSWORD, SEX_DATA, KEY_APP_ID, MAIN_COLOR, KEY_OTHER_USER_BASIC_INFO} from '../../common/config'
  import SelectTags from '../../components/select-tags/select-tags'
  import {fetchRegister, fetchPhoneVCode, bindOpenid, fetchAllAddress} from '../../api/common'
  import {OPERATOR_USER, MALL_ID, EXTEND_CODE} from '../../api/config'
  import {utilMixin} from '../../common/mixins/util'
  import {formatDate, getAreaData, showAddressFormat} from '../../common/utils'
  import storage from 'good-storage'
  import {mapActions} from 'vuex'
  import {openidUtils} from '../../common/wx-utils'

  const PAGE_NAME = 'register'

  export default {
    name: PAGE_NAME,
    mixins: [utilMixin],
    data() {
      return {
        validateResult: ['', '', '', '', '', '', '', ''],
        selectedTags: '',
        pwdRegex: REGEX_NORMAL_PASSWORD,
        isSendCode: false,
        inputLabelColor: MAIN_COLOR,
        inviteCode: '',
        provinceId: '',
        cityId: '',
        areaId: '',
        province: '',
        city: '',
        area: ''
      }
    },
    created() {
      this.checkIsOtherMallUser()
      this._initAddress()
    },
    methods: {
      checkIsOtherMallUser() {
        let prevUserInfo = this.$route.query.prev_user
        let inviteCode = this.$route.query.invite_code
        let inviteUser = this.$route.query.invite_user
        if (inviteCode) {
          this.inviteCode = inviteCode
          if (inviteUser) {
            this._openAlert(`来自${inviteUser}的邀请，赶紧完善信息注册吧`)
          }
        }
        let basicInfo = storage.get(KEY_OTHER_USER_BASIC_INFO, false)
        let d = new Date(1990, 0, 1)
        let sexSelectedIndex = 0
        if (prevUserInfo && basicInfo) {
          let {birthday, phone, name, sex} = basicInfo
          d = new Date(birthday)
          // 赋值手机号码
          this.validateResult.splice(0, 1, phone)
          // 赋值姓名
          this.validateResult.splice(2, 1, name)
          // 赋值日期
          this.validateResult.splice(5, 1, formatDate(d, 'yyyy-MM-dd'))
          // 赋值性别
          sex === 'M' ? sexSelectedIndex = 0 : sexSelectedIndex = 1
          this.validateResult.splice(4, 1, sex === 'M' ? messages.common.txt_sex_male : messages.common.txt_sex_female)
        } else {
          // 如果未携带prev_user参数过来，则表明不是其他会长的用户
          storage.remove(KEY_OTHER_USER_BASIC_INFO)
        }
        this._initPicker(d, sexSelectedIndex)
      },
      _initPicker(currentDate, index) {
        if (!this.datePicker) {
          this.datePicker = this.$createDatePicker({
            title: messages.common.txt_title_select_birthday,
            min: new Date(1938, 0, 1),
            max: new Date(),
            value: currentDate,
            onSelect: (selectedVal, selectedIndex, selectedText) => this.validateResult.splice(5, 1, formatDate(selectedVal, 'yyyy-MM-dd'))
          })
        }

        if (!this.picker) {
          this.picker = this.$createPicker({
            title: messages.common.txt_title_select_sex,
            data: [SEX_DATA],
            selectedIndex: [index],
            onSelect: (selectedVal, selectedIndex, selectedText) => {
              this.validateResult.splice(4, 1, selectedText[0])
            }
          })
        }
      },
      _initAddress() {
        this._openToast(messages.common.txt_load_address, {mask: true})
        fetchAllAddress().then(res => {
          this._closeToast()
          if (!this.addressPicker) {
            let oldAddressIdList = this.messages.register.default_address_id
            const addressDataInfo = getAreaData(res, oldAddressIdList)
            this.addressPicker = this.$createCascadePicker({
              title: messages.common.txt_address_picker_title,
              data: addressDataInfo.addressData,
              selectedIndex: addressDataInfo.selectedIndex,
              onSelect: (selectedVal, selectedIndex, selectedText) => {
                this.validateResult.splice(6, 1, showAddressFormat(selectedText[0], selectedText[1], selectedText[2]))
                this.provinceId = selectedVal[0]
                this.cityId = selectedVal[1]
                this.areaId = selectedVal[2]
                this.province = selectedText[0]
                this.city = selectedText[1]
                this.area = selectedText[2]
              }
            })
          }
        }).catch(e => this._errorCatchHandler(e))
      },
      onSendCode() {
        this._openToast(messages.common.txt_send_sms, {mask: true})
        fetchPhoneVCode(this.validateResult[0], 'Register').then(flag => {
          this._closeToast()
          if (flag) {
            this.isSendCode = true
            this.$refs.verifyCode.sendSuccess()
          } else {
            this.isSendCode = false
          }
        }).catch(e => {
          this.isSendCode = false
          this._closeToast()
          this.$refs.verifyCode.stop()
          this._openAlert(e.message)
        })
      },
      selectTags(tags) {
        this.selectedTags = tags
      },
      pickSex() {
        this.picker.show()
      },
      pickBirthday() {
        this.datePicker.show()
      },
      pickAddress() {
        if (!this.addressPicker) this._initAddress()
        this.addressPicker.show()
      },
      register() {
         let checkPhone = this.$refs.verifyCode.validate()
         let checkVerifyCode = this.$refs.verifyCodeInput.validate()
         let checkName = this.$refs.verifyNameInput.validate()
         let checkSex = this.$refs.verifySexInput.validate()
         let checkBirthday = this.$refs.verifyBirthdayInput.validate()
         let checkPwd = this.$refs.verifyPwdInput.validate()
         Promise.all([checkPhone, checkVerifyCode, checkName, checkSex, checkBirthday, checkPwd]).then(rs => {
           if (!this.isSendCode) {
             this._openAlert(messages.common.txt_not_input_sms_code)
             return
           }
           if (!rs.every(item => item)) {
             this._openAlert(messages.common.txt_invalid_input)
             return
           }
           this._openToast(messages.common.txt_submit, {mask: true})
           let [phone, verifyCode, username, password, sex, birthday, address, detailAddress] = this.validateResult
           let today = formatDate(new Date())
           let info = {
             VipCreateData: {
               user: OPERATOR_USER,
               Mobile: phone,
               code: verifyCode,
               SurName: username,
               sex: sex === messages.common.txt_sex_male ? 'M' : 'F',
               birthday: birthday,
               Password: password,
               CharacterTitle: this.selectedTags,
               MediaBusinessId: storage.session.get(KEY_APP_ID),
               MediaType: 'WX',
               MediaId: openidUtils.get(),
               MallId: MALL_ID(),
               JoinDate: today,
               Extend_Vipcode: EXTEND_CODE,
               Sheng: this.province,
               Shi: this.city,
               Qu: this.area,
               Address1: `${address.replace(/-/g, '')}${detailAddress}`,
               Group20: `${this.provinceId},${this.cityId},${this.areaId},${detailAddress}`
             }
           }
           if (this.inviteCode) {
             info.VipCreateData.Invite_Vipcode = this.inviteCode
           }
           fetchRegister(info).then(res => {
             let vipCode = JSON.parse(res)[0].VipCode
             this.isSendCode = false
             if (vipCode) {
//                注册成功后将用户信息存入本地，然后再跳转
               bindOpenid(vipCode).then(flag => {
                 this._closeToast()
                 if (flag) {
                   this.saveUserInfo(res)
                   this.$router.push({
                     name: 'home'
                   })
                 } else {
                   this._openAlert(messages.common.txt_bind_user_failed)
                 }
               }).catch(e => {
                 this._closeToast()
                 this._openAlert(e.message)
               })
             } else {
               this._openAlert(messages.common.txt_register_failed)
             }
           }).catch(e => {
             this.isSendCode = false
             this._closeToast()
             this._openAlert(e.message)
           })
         })
      },
      ...mapActions([
        'saveUserInfo'
      ])
    },
    components: {
      Page,
      VerifyCode,
      VerifyInput,
      BaseButton,
      SelectTags
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .register-page
    .register-wrapper
      padding-top: 50px
    .operations
      padding:20px 16px
      text-align:center
      .go-login
        color:#666
        font-size:16px
</style>
