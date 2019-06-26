<template>
  <page type="my-info" title="我的账户">
    <!--<div class="top-rainbow"></div>-->
    <div class="account-wrapper">
      <div class="avatar-wrapper">
        <div class="avatar-border">
          <router-link tag="div" :to="{name: 'edit-info'}" class="avatar">
            <img v-lazy="avatar">
          </router-link>
        </div>
      </div>
      <div class="info-wrapper">
        <div class="name">{{userInfo.name}}</div>
        <div class="phone">{{userInfo.mobile}}</div>
      </div>
      <!--<router-link tag="div" :to="{name: 'edit-info'}" class="user-detail"></router-link>-->
    </div>

    <div class="option-list">
      <ul>
        <!--<router-link class="option-item" tag="li" :to="{name: 'my-coupons'}">-->
          <!--<div class="item-inner">-->
            <!--<i class="icon"></i>-->
            <!--<span class="title">我的券包</span>-->
          <!--</div>-->
        <!--</router-link>-->
        <router-link tag="li" class="option-item" :to="{name: 'edit-info'}">
          <div class="item-inner">
            <i class="icon"></i>
            <span class="title">账户信息</span>
          </div>
        </router-link>
        <router-link tag="li" class="option-item" :to="{name: 'my-coupons'}">
          <div class="item-inner">
            <i class="icon"></i>
            <span class="title">我的券包</span>
          </div>
        </router-link>
        <!--<li class="option-item" @click="_openAlert('敬请期待')">-->
          <!--<div class="item-inner">-->
            <!--<i class="icon"></i>-->
            <!--<span class="title">我的积分</span>-->
          <!--</div>-->
        <!--</li>-->
        <router-link class="option-item" tag="li" :to="{name: 'my-scores'}">
          <div class="item-inner">
            <i class="icon"></i>
            <span class="title">我的积分</span>
          </div>
        </router-link>
        <!--<li class="option-item" @click="_openAlert('敬请期待')">-->
          <!--<div class="item-inner">-->
            <!--<i class="icon"></i>-->
            <!--<span class="title">我的预约</span>-->
          <!--</div>-->
        <!--</li>-->
        <router-link class="option-item" tag="li" :to="{name: 'my-orders'}">
          <div class="item-inner">
            <i class="icon"></i>
            <span class="title">我的预约</span>
          </div>
        </router-link>

        <!--<router-link class="option-item" tag="li" :to="{name: 'set-password'}">-->
          <!--<div class="item-inner">-->
            <!--<i class="icon"></i>-->
            <!--<span class="title">设置密码</span>-->
          <!--</div>-->
        <!--</router-link>-->

        <!--<li class="option-item" @click="_openAlert('敬请期待')">-->
          <!--<div class="item-inner">-->
            <!--<i class="icon"></i>-->
            <!--<span class="title">我的邀请码</span>-->
          <!--</div>-->
        <!--</li>-->

        <!--<router-link class="option-item" tag="li" :to="{name: 'my-invite-code'}">-->
          <!--<div class="item-inner">-->
            <!--<i class="icon"></i>-->
            <!--<span class="title">我的邀请码</span>-->
          <!--</div>-->
        <!--</router-link>-->
        <!--每日签到先关上-->
        <!--<router-link class="option-item" tag="li" :to="{name: 'center-signin-daily'}">-->
          <!--<div class="item-inner">-->
            <!--<i class="icon"></i>-->
            <!--<span class="title">每日签到</span>-->
          <!--</div>-->
        <!--</router-link>-->
      </ul>
    </div>

    <div slot="children-view">
      <page-view :excludePages="['my-coupons']"/>
    </div>
  </page>
</template>

<script>
  import Page from '../../../components/page/page'
  import PageView from '../../../components/page-view/page-view'
  import {utilMixin} from '../../../common/mixins/util'
  import {userMixin} from '../../../common/mixins/user'
  import {getUserAvatar} from '../../../api/user'

  const PAGE_NAME = 'my-info'

  export default {
    name: PAGE_NAME,
    mixins: [utilMixin, userMixin],
    data() {
      return {
        avatar: ''
      }
    },
    created() {
      this._getAvatar()
    },
    beforeRouteUpdate(to, from, next) {
      if (to.name === PAGE_NAME) {
        this._getUserInfo()
      }
      next()
    },
    methods: {
      _getAvatar() {
        if (this.userInfo && this.userInfo.headImg) {
          this.avatar = this.userInfo.headImg
        } else {
          getUserAvatar().then(res => {
            this.avatar = res
          }).catch(e => console.warn(e))
        }
      }
    },
    components: {
      Page,
      PageView
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @require '~common/stylus/mixin'
  @require '~common/stylus/variables'

  .my-info-page
    .account-wrapper
      position: relative
      display:flex
      flex-direction: column
      justify-content : center
      align-items : center
      text-align : center
      padding:20px 15px
      background-color: $color-weight-orange
      bg-image('./sign_icon_bg')
      background-repeat : no-repeat
      background-size : 100%
      .avatar-wrapper
        display:flex
        /*flex:0 0 100px*/
        width:100px
        flex-direction: column
        justify-content : center
        align-items : center
        .avatar-border
          background-color: $color-purple
          border-radius: 50%
          .avatar
            position: relative
            width: 70px
            height:70px
            padding:2px
            background-color: $color-purple
            border-radius:50%
            overflow:hidden
            transform: rotate(0)
            border: 2px solid $color-purple
            img
              position: absolute
              left: 50%
              top: 50%
              width: auto
              height: 100%
              transform: translate(-50%, -50%)
            img[lazy=loading], img[lazy=error]
              background: url('~common/images/user_avatar@2x.png') no-repeat center
              background-size: contain
      .info-wrapper
        display:flex
        flex-direction:column
        justify-content:center
        color:#fff
        flex:1
        .name,.phone
          font-size:16px
        .name
          padding:10px
      .user-detail
        position: absolute
        right:15px
        top:20px
        width:24px
        height:24px
        background-size:100% auto
        bg-image-props()
        bg-image('~common/images/icon_user')
    .option-list
      margin-top:20px
      .option-item
        padding:20px 15px
        box-sizing:border-box
        color:$color-title-gray
        background-size:100% auto
        background-repeat:no-repeat
        background-position: left bottom
        border-bottom-1px()
        /*background-image: url('./linear_gradient_row.jpg')*/
        .icon
          bg-image-props()
        &:nth-of-type(1)
          .icon
            bg-image('./my_coupons')
        &:nth-of-type(2)
          .icon
            bg-image('./my_scores')
        &:nth-of-type(3)
          .icon
            bg-image('./my_orders')
        &:nth-of-type(4)
          .icon
            bg-image('./user_icon_bespeak')
        &:nth-of-type(5)
          .icon
            bg-image('./user_icon_sign')
        .item-inner
          font-size:0
          line-height:24px
          .icon,.title
            display:inline-block
            vertical-align:middle
          .icon
            margin-left:20px
            width:24px
            height:24px
          .title
            line-height:24px
            margin-left:5px
            font-size:16px
</style>
