<template>
  <page type="signin-daily" title="每日签到" ref="page">
    <!--<div class="top-rainbow"></div>-->
    <div class="sign-content">
      <div class="top-info">
        <div class="top-info-signBonus" :class="{disable: isSigned || isSigning}" @click="sign">
          <p class="score">
            {{isSigned ? '已签': '签到'}}
          </p>
          <span class="sub-title" v-show="!isSigned">
            +{{signOneBouns ? signOneBouns : 0}}积分
          </span>
          <!--<p class="score">当前积分:{{userInfo.bonus}}</p>-->
          <!--<span class="sub-title">{{currentYearMonthTxt}}签到记录</span>-->
        </div>
        <p class="signinDays">已连续签到{{lxts}}天</p>
      </div>
      <div class="sumAreas">
        <div class="sumBox">
          <div class="sumSignItem">
            <p>{{userInfo.bonus}}</p>
            <span>总积分</span>
          </div>
          <!--<div class="sumSignItem">-->
            <!--<p>{{userInfo.bonus}}</p>-->
            <!--<span>可用积分</span>-->
          <!--</div>-->
        </div>
        <router-link :to="'/score-exchange'" class="bonusShore">去兑换</router-link>
      </div>
      <div class="nail-wrapper">
        <i class="icon-nail"></i>
        <i class="icon-nail"></i>
      </div>
      <div class="signin-component">
        <!--ctlColor="#fff"-->
        <vue-better-calendar mode="sign"
                             ref="calendar"
                             class="siginin-comcla"
                             :signedDates="signedDates"
                             :showLunar="false"
                             @select-sign-date="onSign"
                             @select-year="selectYear"
                             @select-month="selectMonth"
                             @ready="onPanelReady"
                             signSuccessTxt="会员签到成功"/>
      </div>
    </div>
    <div class="operation" ref="bottom">
      <!--<base-button :disabled="isSigned || isSigning" @click="sign">{{isSigned ? '今日已签到' : (isSigning ? '正 在 签 到' : '立 即 签 到')}}</base-button>-->
    </div>
  </page>
</template>

<script>
  import VueBetterCalendar from 'vue-better-calendar'
  import Page from '../../../components/page/page'
  import PageView from '../../../components/page-view/page-view'
  import {userMixin} from '../../../common/mixins/user'
  import {utilMixin} from '../../../common/mixins/util'
  import {fetchCheckedDate, checkToday, getSininBouns} from '../../../api/sign'
  import BaseButton from '../../../base/base-button/base-button'
  import {formatDate} from '../../../common/utils'
  import storage from 'good-storage'

  const PAGE_NAME = 'signin-daily'
  let now = new Date()

  export default {
    name: PAGE_NAME,
    mixins: [userMixin, utilMixin],
    data() {
      return {
        signedDates: [],
        isSigned: false,
        isSigning: false,
        currentCalendarYear: now.getFullYear(),
        currentCalendarMonth: now.getMonth() + 1,
        lxts: 0,
        signOneBouns: 0
      }
    },
    created() {
      this._getCheckedDate()
      this.$nextTick(() => {
        this.$refs.bottom.style.paddingBottom = '80px'
      })
    },
    computed: {
      currentYearMonthTxt() {
        return `${this.currentCalendarYear}年${this.currentCalendarMonth}月`
      }
    },
    methods: {
      selectYear(year) {
        this.currentCalendarYear = year
      },
      selectMonth(month, year) {
        this.currentCalendarYear = year
        this.currentCalendarMonth = month
      },
      onPanelReady() {
        this.$refs.page.refresh()
      },
      onSign(signInfo) {
        /* signInfo.status 判断签到是否为当天
        *  signInfo.msg 本次是否签到成功的提示语
        *  signInfo.signedDates 本次签到后目前所有已签到的日期集合
        */
        if (signInfo.status) {
          this.isSigning = true
          this._openToast('签到中...', {mask: true}, true, 'signLoading')
          checkToday().then(res => {
            this._closeToast('signLoading')
            if (res) {
              // 改变签到状态
              this.isSigned = true
              this.lxts += 1
//              this._openAlert(signInfo.msg)
              this._openGAlert({title: '签到成功', content: signInfo.msg}, 'signin')
              this._getUserInfo()
              // 更新已签到日期
              this.signedDates = signInfo.signedDates
            } else {
              this._openAlert('签到失败，请重试')
            }
          }).catch(err => {
            this._closeToast('signLoading')
            this._openAlert(err.message)
          })
        } else {
          /* 需要在当天才能签到的提示，有如下三个属性可设置提示内容
           * notSignInOtherMonthsTxt，签到时点击本月外日期时的文本提示，默认值为“不能在本月外进行签到”
           * notSignInOtherDaysTxt，签到时点击本月内非当天日期时的文本提示，默认值为“notSignInOtherDaysTxt”
           * alreadySignTxt，签到时点击已经签过到的日期时的文本提示，默认值为“本日已经进行过签到”
           */
          this._openAlert(signInfo.msg)
        }
      },
      continuousDays(dayList) {
        let todayTime = formatDate(new Date(), 'yyyy-MM-dd')
        let contiNo = 0
        for (let i = dayList.length - 1; i >= 0; i--) {
          if ((todayTime === dayList[i]) || (new Date(todayTime).getTime() - new Date(dayList[i]).getTime() === 86400000)) {
            contiNo++
            todayTime = dayList[i]
          } else {
            break
          }
        }
        this.lxts = contiNo
      },
      sign() {
        this.$refs.calendar.sign()
      },
      _getCheckedDate() {
        this._openToast('签到信息加载中...', {mask: true}, true, 'signedDateLoading')
        getSininBouns().then(res => {
          this.signOneBouns = res.XF_BONUS
        }).catch(errs => {
          this._openAlert(`获取签到提示积分失败：${errs}`)
        })
        fetchCheckedDate().then(res => {
          this._closeToast('signedDateLoading')
          this.signedDates = res
          this.continuousDays(res)
//          this.signedDates = ['2018-05-21', '2018-05-19']
          const today = formatDate(new Date(), 'yyyy-MM-dd')
          // 判断今日是否已经签到过
          if (this.signedDates.indexOf(today) !== -1) {
            this.isSigned = true
          }
        }).catch(err => {
          this._closeToast('signedDateLoading')
          this._openAlert(err.message)
        })
      }
    },
    components: {
      Page,
      PageView,
      VueBetterCalendar,
      BaseButton
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @require '~common/stylus/variables'
  @require '~common/stylus/mixin.styl'
  .signin-daily-page
    .sign-content
      background: $color-page-bg
      box-sizing:border-box
      /*padding:30px 20px*/
      .top-info
        padding: 30px 0 20px
        display: flex
        flex-direction : column
        align-items : center
        text-align:center
        color: $color-weight-orange
        bg-image('./sign_icon_bg')
        background-repeat : no-repeat
        background-size : 100%
        background-color: $color-weight-orange
        .signinDays
          font-size : $fontsize-large
          color: #fff
          margin-top: 10px
        .top-info-signBonus
          border: 6px solid $color-orange
          border-radius : 50%
          padding: 20px
          background : #fff
          height: 57px
          display: flex
          flex-direction : column
          justify-content : center
          align-items : center
          .sub-title
            line-height: 18px
            font-size:16px
        .disable
          background : $bdr-color-gray
          color: #999
      .sumAreas
        background: #fff
        padding: 16px 40px
        position : relative
        .bonusShore
          position : absolute
          right: 20px
          top: 50%
          font-size: $fontsize-large
          text-decoration : underline
          &::after
            content: '>>'
        .sumBox
          display: flex
          font-size : $fontsize-large
          .sumSignItem
            display: flex
            align-items : center
            flex-direction : column
            justify-content : center
            flex: 1
            p
              font-size : $fontsize-large-xxx
              color: $color-red
              margin-bottom: 6px
            span
              font-size: $fontsize-medium
              color: $color-title-gray
          /*.sumSignItem:nth-child(1)
            border-right-1px()*/
  .operation
    /*padding: 20px 16px*/
    background: $color-page-bg
  .nail-wrapper
    position: relative
    /*background-color: pink*/
    z-index: 1
    .icon-nail
      position: absolute
      top: 5px
      width: 20px
      height: 30px
      background-repeat: no-repeat
      background-position: center
      background-size:contain
      // bg-image('./nail')
      &:after
        position: absolute
        bottom: -5px
        left: 2px
        width: 15px
        height: 15px
        content: ''
        border-radius: 50%
        // background-color: #fff
        z-index: -1
      &:first-child
        left: 40px
      &:last-child
        right: 40px
  .signin-component
    margin: 20px 12px 0px
    background: #ffffff
    border-radius : 8px
    overflow : hidden
    .siginin-comcla
      margin-top: 0
      background: #fff
      /deep/ .calendar-header
        background-color: #fff
        color: #666
      /deep/ .calendar-container .calendar-header .calendar-ctl .calendar-ctl-month .month .select-month-panel .item
        color: #666
      /deep/ .calendar-container .calendar-header .calendar-ctl .calendar-ctl-month .year
        color: #666
      /deep/ .calendar-dates
        background-color: #fff
      /deep/ .calendar-year-panel
        z-index: 4
      /deep/.vue-better-calendar .calendar-body .calendar-dates .date-row ul .calendar-day.disabled
        background-color: #fff
        color: #fff
      /deep/ .calendar-container .calendar-body .calendar-dates .date-row ul .calendar-day.is-today
        background-color: transparent
        border-radius: 50%
        border: none
        width: 50%
        height: 50%
        position : relative
        z-index: 1
        p
          position : relative
          z-index: 1
        &::before
          content: ''
          position : absolute
          left: 15%
          top: 15%
          width: 70%
          height: 70%
          background-color: rgba(0,0,0,0.5)
          border-radius: 50%
          z-index: 0
        /*&::after
          content: ''
          position : absolute
          left: 15%
          top: 15%
          width: 70%
          height: 70%
          background-color: rgba(0,0,0,0.5)
          border-radius: 50%
          z-index: 0*/
      /deep/ .selected
        p
          opacity : 0
      /deep/ .calendar-body .calendar-dates .date-row ul .calendar-day.selected:after
        bg-image('./sign_icon_signed_success')
        background-color: #fff
        background-size : 70%
        background-position : center
        background-repeat : no-repeat
        /deep/ p
          opacity : 0
          &::after
            display: none
        &::after
          color: #fff
          position : absolute
          left: 15%
          top: 15%
          width: 70%
          height: 70%
          z-index: 4
          bg-image('./sign_icon_signed_success')
          background-color: #fff
          background-size : 100%
          background-position : center
          background-repeat : no-repeat
        &::before
          opacity : 0
</style>
