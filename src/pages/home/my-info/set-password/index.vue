<template>
  <page type="set-password" title="设置密码">
    <div class="top-rainbow"></div>
    <div class="page-content">
      <verify-code key="1" ref="verifyCode" store-key="updatePasswordCode" :labelColor="inputLabelColor" v-model="validateResult[0]" @click="onSendCode"/>

      <verify-input type="number"
                    key="2"
                    ref="verifyCodeInput"
                    :label="'验证码'"
                    :labelColor="inputLabelColor"
                    :placeholder="'请输入验证码'"
                    :maxlength="6"
                    :rules="{len: 6,required: true}"
                    v-model="validateResult[1]"
                    :len="6"/>

      <verify-input type="password"
                    key="3"
                    ref="verifyPwdInput"
                    :label="'密码'"
                    :labelColor="inputLabelColor"
                    :placeholder="'6-10位数字或字母'"
                    :rules="{
                      pattern: pwdRegex,
                      required: true,
                      custom: val => {
                        return val === validateResult[3]
                      }
                    }"
                    :messages="{
                      custom: '密码必须与确认密码相同'
                    }"
                    v-model="validateResult[2]"/>

      <verify-input type="password"
                    key="4"
                    ref="verifyConfirmPwdInput"
                    :label="'确认密码'"
                    :labelColor="inputLabelColor"
                    :placeholder="'6-10位数字或字母'"
                    :rules="{
                      pattern: pwdRegex,
                      required: true,
                      custom: val => {
                        return val === validateResult[2]
                      }
                    }"
                    :messages="{
                      custom: '确认密码必须与密码相同'
                    }"
                    v-model="validateResult[3]"/>

      <div class="btn-area">
        <base-button @click="updatePassword">确 认</base-button>
      </div>
    </div>
  </page>
</template>

<script>
  import storage from 'good-storage'
  import Page from '../../../../components/page/page'
  import VerifyCode from '../../../../base/verify-code/verify-code'
  import VerifyInput from '../../../../base/verify-input/verify-input'
  import BaseButton from '../../../../base/base-button/base-button'
  import {REGEX_NORMAL_PASSWORD, MAIN_COLOR, KEY_USER_INFO} from '../../../../common/config'
  import {fetchPhoneVCode} from '../../../../api/common'
  import {updateUserPassword} from '../../../../api/user'
  import {utilMixin} from '../../../../common/mixins/util'
  import {userMixin} from '../../../../common/mixins/user'

  const PAGE_NAME = 'set-password'

  export default {
    name: PAGE_NAME,
    mixins: [utilMixin, userMixin],
    data() {
      return {
        isSendCode: false,
        validateResult: ['', '', '', '']
      }
    },
    created() {
      this.inputLabelColor = MAIN_COLOR
      this.pwdRegex = REGEX_NORMAL_PASSWORD
    },
    methods: {
      onSendCode() {
        this._openToast(messages.common.txt_send_sms, {mask: true})
        fetchPhoneVCode(this.validateResult[0], 'Update').then(flag => {
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
      updatePassword() {
        let checkPhone = this.$refs.verifyCode.validate()
        let checkVerifyCode = this.$refs.verifyCodeInput.validate()
        let checkPwd = this.$refs.verifyPwdInput.validate()
        let checkConfirmPwd = this.$refs.verifyConfirmPwdInput.validate()
        this.$refs.verifyConfirmPwdInput.validate()
        Promise.all([checkPhone, checkVerifyCode, checkPwd, checkConfirmPwd]).then(rs => {
          if (!this.isSendCode) {
            this._openAlert(messages.common.txt_not_input_sms_code)
            return
          }
          if (!rs.every(item => item)) {
            this._openAlert(messages.common.txt_invalid_input)
            return
          }
          this._openToast(messages.common.txt_submit, {mask: true})
          let [phone, verifyCode, password] = this.validateResult
          updateUserPassword(password, verifyCode, phone).then(flag => {
            // 更新用户密码
            this._closeToast()
            if (flag) {
              this._openAlert('修改密码成功', {
                onConfirm: () => {
                  storage.remove(KEY_USER_INFO)
                  this.$router.back()
                }
              })
            } else {
              this._openAlert('修改失败，请稍后再试')
            }
          }).catch(e => {
            this._closeToast()
            this._openAlert(e.message)
          })
        })
      }
    },
    watch: {
      validateResult(val) {
        // 检测两次输入的密码是否一致，由于无法内部触发validate方法，只能用watch监听
        if (val[2].length && val[3].length) {
          this.$refs.verifyPwdInput.validate()
          this.$refs.verifyConfirmPwdInput.validate()
        }
      }
    },
    components: {
      Page,
      VerifyInput,
      VerifyCode,
      BaseButton
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .set-password-page
    .page-content
      padding-top:25px
      .btn-area
        margin:20px 15px 0
</style>
