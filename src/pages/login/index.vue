<template>
  <page type="login">
    <div class="top-rainbow"></div>
    <div class="login-wrapper">
      <div class="logo"></div>
      <title-tabs :tabs="[messages.login.txt_verify_code_login, messages.login.txt_password_login]" v-model="activeTabIndex"/>
      <div class="tabs-wrapper">
        <div class="tab-content" v-if="activeTabIndex===0">
          <verify-code @validate-success="validateSuccessHandler" key="1" ref="codeVerifyCode" store-key="loginCode" v-model="verifyCodeLoginResult[0]" @click="onSendCode"/>
          <verify-input placeholder="请输入验证码" key="3" type="number" ref="verifyCodeInput" :label="messages.login.txt_label_verify_code" :maxlength="6" :rules="{len: 6,required: true}" v-model="verifyCodeLoginResult[1]" :len="6"/>
        </div>
        <div class="tab-content" v-else>
          <verify-input placeholder="请输入手机号" @validate-success="validateSuccessHandler" key="2"  :label="messages.login.txt_label_phone" ref="passwordVerifyCode" store-key="loginCode" :rules="{type: 'tel',required: true}" v-model="passwordLoginResult[0]"/>
          <verify-input placeholder="请输入密码" key="4" :label="messages.login.txt_label_password" type="password" ref="passwordVerifyInput" :rules="{pattern: pwdRegex,required: true}" v-model="passwordLoginResult[1]"/>
        </div>
      </div>

      <div class="operations">
        <base-button @click="checkLoginData">{{messages.login.txt_btn_login}}</base-button>
        <router-link tag="span" class="go-register" :to="{name: 'register'}">{{messages.login.txt_go_register}}</router-link>
      </div>
    </div>
  </page>
</template>

<script>
  import Page from '../../components/page/page'
  import VerifyCode from '../../base/verify-code/verify-code'
  import VerifyInput from '../../base/verify-input/verify-input'
  import BaseButton from '../../base/base-button/base-button'
  import TitleTabs from '../../components/title-tabs/title-tabs'
  import {REGEX_NORMAL_PASSWORD, KEY_OTHER_USER_BASIC_INFO, IS_NOT_SYSTEM_USER, NOT_REGISTER} from '../../common/config'
  import {fetchPhoneVCode, fetchLogin, bindOpenid} from '../../api/common'
  import {fetchUserInfoByPhone} from '../../api/user'
  import {utilMixin} from '../../common/mixins/util'
  import {mapActions} from 'vuex'
  import storage from 'good-storage'

  const PAGE_NAME = 'login'

  export default {
    name: PAGE_NAME,
    mixins: [utilMixin],
    data() {
      return {
        verifyCodeLoginResult: ['', ''],
        passwordLoginResult: ['', ''],
        activeTabIndex: 0,
        isSendCode: false
      }
    },
    created() {
      this.pwdRegex = REGEX_NORMAL_PASSWORD
    },
    methods: {
      onSendCode() {
        this._openToast(messages.common.txt_send_sms, {mask: true})
        fetchPhoneVCode(this.verifyCodeLoginResult[0]).then(flag => {
          this._closeToast()
          if (flag) {
            this.isSendCode = true
            this.$refs.codeVerifyCode.sendSuccess()
          } else {
            this.isSendCode = false
          }
        }).catch(e => {
          this.isSendCode = false
          this._closeToast()
          this.$refs.codeVerifyCode.stop()
          this._openAlert(e.message)
        })
      },
      checkLoginData() {
        if (this.activeTabIndex === 0) {
          let checkPhone = this.$refs.codeVerifyCode.validate()
          let checkVerifyCode = this.$refs.verifyCodeInput.validate()
          Promise.all([checkPhone, checkVerifyCode]).then(rs => {
            rs.every(item => item) && this.login(this.verifyCodeLoginResult, 0)
          })
        } else {
          let checkPhone = this.$refs.passwordVerifyCode.validate()
          let checkVerifyCode = this.$refs.passwordVerifyInput.validate()
          Promise.all([checkPhone, checkVerifyCode]).then(rs => {
            rs.every(item => item) && this.login(this.passwordLoginResult, 1)
          })
        }
      },
      login(validArray, type) {
        let params = {}
        if (type === 0) {
          let [phone, verifyCode] = validArray
          params.phone = phone
          params.code = verifyCode
        } else {
          let [phone, password] = validArray
          params.phone = phone
          params.pw = password
        }
        this._openToast(messages.login.txt_login_tip, {time: 0, mask: true})
        fetchLogin(params).then(userInfo => {
          if (userInfo && userInfo.isLogin) {
            bindOpenid(userInfo.VipDis[0].VipCode).then(flag => {
              this._closeToast()
              if (flag) {
                this.saveUserInfo(userInfo)
                this.$router.push({name: 'home'})
              } else {
                this._openAlert(messages.common.txt_bind_user_failed)
              }
            }).catch(e => this._openAlert(e.message))
          } else {
            this._closeToast()
            if (type === 0) {
              this._openAlert(messages.login.txt_verify_code_error)
            } else {
              this._openAlert(messages.login.txt_password_error)
            }
          }
        }).catch(e => {
          this._closeToast()
          this._openAlert(e.message)
        })
      },
      validateSuccessHandler() {
        this._openToast(messages.login.txt_phone_checked, {mask: true})
        let phone = this.passwordLoginResult[0] || this.verifyCodeLoginResult[0]
        fetchUserInfoByPhone(phone).then(res => {
          this._closeToast()
          let flag = parseInt(res.IsWhether)
          if (flag === NOT_REGISTER) {
            this._openConfirm(messages.login.txt_not_mall_user, {
              onConfirm: () => {
                this.$router.push({
                  name: 'register'
                })
              }
            })
          } else if (flag === IS_NOT_SYSTEM_USER) {
            if (res.VipCode) {
              this._openConfirm(messages.login.txt_user_info_exist, {
                onConfirm: () => {
                  let {Birthday, Mobile, Name, Sex, VipCode} = res
                  storage.set(KEY_OTHER_USER_BASIC_INFO, {
                    birthday: Birthday,
                    phone: Mobile,
                    name: Name,
                    sex: Sex,
                    code: VipCode
                  })
                  this.$router.push({
                    name: 'register',
                    query: {
                      prev_user: VipCode
                    }
                  })
                }
              })
            } else {
              this._openAlert(messages.login.txt_user_info_not_exist)
            }
          }
        }).catch(e => {
          this._closeToast()
          this._openAlert(e.message)
        })
      },
      ...mapActions([
        'saveUserInfo'
      ])
    },
    watch: {
      activeTabIndex(val) {
        if (val === 0) {
          this.passwordLoginResult.splice(0, 1, '')
          this.passwordLoginResult.splice(1, 1, '')
        } else {
          this.verifyCodeLoginResult.splice(0, 1, '')
          this.verifyCodeLoginResult.splice(1, 1, '')
        }
      }
    },
    components: {
      Page,
      VerifyCode,
      VerifyInput,
      BaseButton,
      TitleTabs
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @require '~common/stylus/variables'
  @require '~common/stylus/mixin'

  .login-page
    .logo
      width:80px
      height:80px
      margin:40px auto
      background-size: 100% auto
      background-position: center
      bg-image('./logo')
    .tabs-wrapper
      margin-top:20px
    .operations
      margin:20px 16px
      text-align:center
      .go-register
        color:#666
        font-size:16px
</style>
