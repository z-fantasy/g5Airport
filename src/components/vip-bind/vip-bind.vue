<template>
  <transition name="vip-bind-slide">
    <div ref="gameWrapper" class="vip-bind" v-show="showBind">
      <!--showBind-->
      <div class="vipBindCont">
        <div class="vipBindLogo">
        </div>
        <div class="vipBindshuom">
          <div class="scroll-list-wrap" v-show="ruleText">
            <cube-scroll ref="scrollBind" :options="{scrollbar: true}">
              <div v-html="ruleText">
              </div>
              <!--<ul>-->
                <!--<li>-->
                  <!--为会员打造定制一套回馈、增值奖励方案，会员级别越高享受的权益越多；-->
                <!--</li>-->
                <!--<li>-->
                  <!--当会员级别到期后，如未能达到省级标准，单反会员到期前12个月消费金额大于0元。-->
                <!--</li>-->
              <!--</ul>-->
            </cube-scroll>
          </div>
          <!--<h3>-->
            <!--G5购物中心会员系统已经上线，你是否愿意成为我们的正式会员，成为正式会员将享受如下优惠：-->
          <!--</h3>-->
          <!--<div class="scroll-list-wrap">-->
            <!--<cube-scroll ref="scroll">-->
              <!--<ul>-->
                <!--<li>-->
                  <!--为会员打造定制一套回馈、增值奖励方案，会员级别越高享受的权益越多；-->
                <!--</li>-->
                <!--<li>-->
                  <!--当会员级别到期后，如未能达到省级标准，单反会员到期前12个月消费金额大于0元。-->
                <!--</li>-->
              <!--</ul>-->
            <!--</cube-scroll>-->
          <!--</div>-->
        </div>
        <div class="vipBindBtn">
          <div class="vipBindSure" @click="vipBindWay">
            确定
          </div>
          <div class="vipBindCancle" @click="cancleBind">
            拒绝
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {utilMixin} from '../../common/mixins/util'
  import {userMixin} from '../../common/mixins/user'
  import {mapGetters, mapActions} from 'vuex'
  import {fetchRegister, getRightAndBind} from '../../api/common'
  import {wxUserInfo, isVipByOpenid} from '../../api/user'
  import {OPERATOR_USER, MALL_ID, EXTEND_CODE} from '../../api/config'
  import {formatDate, htmlDecode} from '../../common/utils'
  import {openidUtils} from '../../common/wx-utils'
  import storage from 'good-storage'
  import {KEY_APP_ID, KEY_DEFAULT_MALL} from '../../common/config'
  import wx from 'weixin-js-sdk'
  export default {
    name: 'vip-bind',
    mixins: [utilMixin, userMixin],
    data() {
      return {
        ruleText: ''
      }
    },
    created() {
      if (!this.userInfo || !this.userInfo.code) {
        this.getRTxt()
      }
    },
    methods: {
      getRTxt() {
        getRightAndBind().then(res => {
          this.ruleText = htmlDecode(res.EB_RULE_CONDITION)
//          this.$nextTick(setTimeout(this.$refs.scrollBind.refresh(), 100))
        }).catch(errs => {
          this._openAlert(`获取会员绑定规则失败：${errs}`)
        })
      },
      vipBindWay() {
        // 绑定会员流程；1：从 userInfo里面拿出用户名出来注册绑定：fetchRegister() || bindOpenid() =》 成功：返回会员信息；2：this.saveUserInfo(res) =》 储存会员信息，并全局更新store状态。
        if (this.userInfo && (this.userInfo.name || this.userInfo.SurName)) {
          let today = formatDate(new Date())
          let info = {
            VipCreateData: {
              User: OPERATOR_USER,
              Mobile: '',
              code: '', // 验证码
              SurName: this.userInfo.name || this.userInfo.SurName,
              Sex: this.userInfo.sex === '1' ? 'M' : this.userInfo.sex === '0' ? 'F' : !this.userInfo.sex ? 'U' : this.userInfo.sex,
              Birthday: '',
              Password: '',
              CharacterTitle: '', // this.selectedTags,
              MediaBusinessId: storage.session.get(KEY_APP_ID),
              MediaType: 'WX',
              MediaId: openidUtils.get(),
              MallId: MALL_ID(),
              JoinDate: today,
              Extend_Vipcode: EXTEND_CODE,
              Sheng: '',
              Shi: '',
              Qu: '',
              Address1: '',
              Group20: ''
            }
          }
          this._openToast('绑定中…')
          fetchRegister(info).then(res => {
            if (res) {
//              this.saveUserInfo({cardNo: res})
              isVipByOpenid().then(bindRes => {
                if (bindRes.XF_VIPCODE) {
                  this.saveUserInfo({code: bindRes.XF_VIPCODE})
                  // 创建会员成功，然后获取会员信息并本地储存
                  this._getUserInfo(function () {
                    this._closeToast()
                    if (this.userInfo.code) {
                      this._openToast('绑定成功！', {time: 1000, type: 'correct'})
                      this.closeVipBind()
                    } else {
                      this._openAlert('创建会员成功，获取失败！')
                    }
                  })
                }
              }).catch(errs => {
                this._closeToast()
                this._openAlert(`查询是否会员失败：${errs}`)
              })
            } else {
              this._closeToast()
              this._openAlert('创建会员成功！' + res)
            }
          }).catch(errs => {
            this._closeToast()
            this._openAlert('创建会员失败！' + errs)
          })
        } else {
          this._openAlert('未获取到有效个人信息，重新获取！', {
            onConfirm: () => {
              this._openToast('获取中…', {mask: true})
              this.getWXInfo()
            }
          })
        }
      },
      cancleBind() {
        wx.closeWindow()
      },
      getWXInfo() {
        wxUserInfo().then(wxRes => {
          if (this.userInfo && this.userInfo.name) {
            this.saveUserInfo({headImg: wxRes.headimgurl})
          } else {
            this.saveUserInfo({
              name: wxRes.nickname,
              headImg: wxRes.headimgurl,
              sex: wxRes.sex === '1' ? 'M' : wxRes.sex === '0' ? 'F' : 'U'
            })
          }
          this._closeToast()
        }).catch(errs => {
          this._closeToast()
          this._openAlert('获取微信个人信息失败：' + errs)
        })
      },
      ...mapActions([
        'showVipBind',
        'closeVipBind',
        'saveUserInfo'
      ])
    },
    watch: {
      showBind(n) {
        if (n && !this.ruleText) {
          this.getRTxt()
        }
      }
    },
    computed: {
      ...mapGetters([
        'showBind'
      ])
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variables.styl"
  .vip-bind
    font-size : $fontsize-large
    position: absolute
    z-index: 100
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: #f77d00
    bg-image('../../pages/home/index_icon_bg')
    background-size: 100%
    background-position: center
    background-repeat: no-repeat
    box-sizing: border-box
    display: flex
    align-items: center
    justify-content: space-around
    &.vip-bind-slide-enter-active, &.vip-bind-slide-leave-active
      transition: all .4s
    &.vip-bind-slide-enter, &.vip-bind-slide-leave-to
      // transform: translate3d(0, 100%, 0)
      opacity : 0
    .vipBindCont
      height: 61%
      width: 75%
      background: #fff
      border-radius: 4px
      padding: 10px 5%
      .vipBindLogo
        bg-image('./index_icon_member')
        background-position: center
        background-repeat: no-repeat
        background-size: 80px auto
        height: 30%
      .vipBindshuom
        height: 50%
        font-size: $fontsize-large
        line-height : 1.3
        overflow : hidden
        text-align : justify
        >h3
          font-weight : 600
        .scroll-list-wrap
          height: 100% // 70%
          ul
            overflow : scroll
            font-size : $fontsize-medium
            >li
              color: #666
              position : relative
              padding-left: 12px
              margin-top: 10px
              &:after
                content: ' '
                position : absolute
                left: 0
                top: 3px
                width: 3px
                height: $fontsize-small
                background: $color-weight-orange
                border-radius:2px
      .vipBindBtn
        height: 20%
        display: flex
        align-items: center
        justify-content: space-between
        text-align : center
        .vipBindSure,.vipBindCancle
          width: 44%
          height: 40px
          line-height : 40px
          border-radius : 4px
        .vipBindSure
          color: #fff
          background: linear-gradient(to right, #f75d00, orange);
        .vipBindCancle
          color: $color-orange
          border: 1px solid $color-orange
</style>
