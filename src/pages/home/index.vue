<template>
  <page type="home" ref="page">
    <!--<div class="top-rainbow"></div>-->
    <div class="isVbindShow" v-show="showPageShade">
    </div>
    <div class="home-card-bg">
      <div class="card_img_box">
        <!--gradeCardImg-->
        <img @load="onCardLoad" src="./home_icon_card@2x.png" class="card_img">
        <div class="infoArea">
          <div class="infoA-box">
            <div class="minesHimg" @click="toRouteFun('my-info')">
              <img :src="headImg" alt="">
            </div>
            <div class="minesName">
              <p>{{userName}}</p>
              <p>NO.{{userInfo.cardNo ? userInfo.cardNo : '--'}}</p>
            </div>
            <div class="erwei" @click="showEWM">
            </div>
          </div>
          <div class="myInters">
            <div class="intsNum" @click="toRouteFun('score-list')">
              <span>积分 <span>{{userInfo.bonus ? userInfo.bonus : 0}}</span></span>
            </div>
            <div class="langlogo">
            </div>
          </div>
        </div>
        <!--gradeCardImg-->
      </div>
    </div>
    <div class="top-router-panel">
      <!--积分-->
      <!--<router-link tag="div" :to="{name: 'my-scores'}" class="router-item bonus">-->
      <!--<i class="icon icon-bonus"></i>-->
      <!--<span class="txt">{{userInfo.bonus ? userInfo.bonus : 0}}</span>-->
      <!--</router-link>-->
      <!--<div @click="_openAlert('敬请期待')" class="router-item bonus">-->
      <!--<i class="icon icon-bonus"></i>-->
      <!--<span class="txt">{{userInfo.bonus ? userInfo.bonus : 0}}</span>-->
      <!--</div>-->

      <!--卡券张数-->
      <!--<router-link tag="div" :to="{name: 'my-coupons'}" class="router-item coupon">-->
      <!--<i class="icon icon-coupon"></i>-->
      <!--<span class="txt">{{userInfo.cardCount ? userInfo.cardCount : 0}}</span>-->
      <!--</router-link>-->
      <!--<div @click="_openAlert('敬请期待')" class="router-item coupon">-->
      <!--<i class="icon icon-coupon"></i>-->
      <!--<span class="txt">{{userInfo.cardCount ? userInfo.cardCount : 0}}</span>-->
      <!--</div>-->

      <div class="router-item sign" @click="toRouteFun('signin-daily')">
        <i class="icon icon-sign"></i>
        <span class="txt">{{messages.home.txt_label_sign_in}}</span>
      </div>
      <!--<div @click="_openAlert('敬请期待')" class="router-item sign">-->
      <!--<i class="icon icon-sign"></i>-->
      <!--<span class="txt">{{messages.home.txt_label_sign_in}}</span>-->
      <!--</div>-->

      <div @click="aboutWXCard" class="router-item card-bag">
        <i class="icon icon-card-bag"></i>
        <span class="txt">{{messages.home.txt_label_card}}</span>
      </div>

    </div>
    <div class="main-router-panel" ref="mainCont">
      <ul class="router-list">
        <li class="item" @click="toRouteFun('my-info')">
          <i class="icon icon-user"></i>
          <p class="txt">{{messages.home.txt_label_my_account}}</p>
        </li>
        <li class="item" @click="toRouteFun('prize-game')">
          <i class="icon icon-game"></i>
          <p class="txt">{{messages.home.txt_label_prize_game}}</p>
        </li>
        <li class="item" @click="goScan">
          <i class="icon icon-self_bouns"></i>
          <p class="txt">{{messages.home.txt_label_self_bouns}}</p>
        </li>

        <li class="item" @click="toRouteFun('brand-discount', {from: 1})">
          <i class="icon icon-discount"></i>
          <p class="txt">{{messages.home.txt_label_brand_discount}}</p>
        </li>
        <li class="item" @click="toRouteFun('score-exchange')">
          <i class="icon icon-gift"></i>
          <p class="txt">{{messages.home.txt_label_score_exchange}}</p>
        </li>
        <li class="item" @click="toRouteFun('car-park')">
          <i class="icon icon-car-park"></i>
          <p class="txt">{{messages.home.txt_label_car_park}}</p>
        </li>
        <li class="item" @click="toRouteFun('activity-blends')">
          <i class="icon icon-activity"></i>
          <p class="txt">{{messages.home.txt_label_activity_blends}}</p>
        </li>
        <li class="item" @click="toRouteFun('vip-salons')">
          <i class="icon icon-salon"></i>
          <p class="txt">{{messages.home.txt_label_vip_salons}}</p>
        </li>
        <li class="item" @click="toRouteFun('vip-rights')">
          <i class="icon icon-rights"></i>
          <p class="txt">{{messages.home.txt_label_vip_rights}}</p>
        </li>

        <!--我的账户-->
        <!--<router-link tag="li" class="item" :to="{name: 'my-info'}">-->
        <!--<i class="icon icon-user"></i>-->
        <!--<p class="txt">{{messages.home.txt_label_my_account}}</p>-->
        <!--</router-link>-->
        <!--品牌-->
        <!--<router-link tag="li" class="item" :to="{name: 'brand-discount', query: {from: 1}}">-->
        <!--<i class="icon icon-discount"></i>-->
        <!--<p class="txt">{{messages.home.txt_label_brand_discount}}</p>-->
        <!--</router-link>-->
        <!--<li class="item" @click="_openAlert('敬请期待')">-->
        <!--<i class="icon icon-discount"></i>-->
        <!--<p class="txt">{{messages.home.txt_label_brand_discount}}</p>-->
        <!--</li>-->
        <!--积分兑礼-->
        <!--<router-link tag="li" class="item" :to="{name: 'score-exchange', query: {from: 1}}">-->
        <!--<i class="icon icon-gift"></i>-->
        <!--<p class="txt">{{messages.home.txt_label_score_exchange}}</p>-->
        <!--</router-link>-->
        <!--<li class="item" @click="_openAlert('敬请期待')">-->
        <!--<i class="icon icon-gift"></i>-->
        <!--<p class="txt">{{messages.home.txt_label_score_exchange}}</p>-->
        <!--</li>-->

        <!--<li tag="li" class="item" @click="_openAlert(messages.common.txt_in_development)">-->
        <!--<i class="icon icon-parking"></i>-->
        <!--<p class="txt">{{messages.home.txt_label_navigate}}</p>-->
        <!--</li>-->

        <!--如何到达-->
        <!--<li tag="li" class="item" @click="selectNavigate">-->
        <!--<i class="icon icon-parking"></i>-->
        <!--<p class="txt">{{messages.home.txt_label_navigate}}</p>-->
        <!--</li>-->
        <!--活动荟萃-->
        <!--<router-link tag="li" class="item" :to="{name: 'activity-blends'}">-->
        <!--<i class="icon icon-activity"></i>-->
        <!--<p class="txt">{{messages.home.txt_label_activity_blends}}</p>-->
        <!--</router-link>-->
        <!--<li class="item" @click="_openAlert('敬请期待')">-->
        <!--<i class="icon icon-activity"></i>-->
        <!--<p class="txt">{{messages.home.txt_label_activity_blends}}</p>-->
        <!--</li>-->
        <!--特邀沙龙-->
        <!--<router-link tag="li" class="item" :to="{name: 'vip-salons'}">-->
        <!--<i class="icon icon-salon"></i>-->
        <!--<p class="txt">{{messages.home.txt_label_vip_salons}}</p>-->
        <!--</router-link>-->
        <!--<li class="item" @click="_openAlert('敬请期待')">-->
        <!--<i class="icon icon-salon"></i>-->
        <!--<p class="txt">{{messages.home.txt_label_vip_salons}}</p>-->
        <!--</li>-->
        <!--会员权益-->
        <!--<router-link tag="li" class="item" :to="{name: 'vip-rights'}">-->
        <!--<i class="icon icon-rights"></i>-->
        <!--<p class="txt">{{messages.home.txt_label_vip_rights}}</p>-->
        <!--</router-link>-->
        <!--<li class="item" @click="_openAlert('敬请期待')">-->
        <!--<i class="icon icon-rights"></i>-->
        <!--<p class="txt">{{messages.home.txt_label_vip_rights}}</p>-->
        <!--</li>-->
        <!--更多-->
        <!--<li tag="li" class="item" @click="_openAlert(messages.common.txt_in_development)">-->
        <!--<i class="icon icon-more"></i>-->
        <!--<p class="txt">{{messages.home.txt_label_more}}</p>-->
        <!--</li>-->

      </ul>
      <!--<div class="linear-gradient col first"></div>-->
      <!--<div class="linear-gradient col second"></div>-->
      <!--<div class="linear-gradient col three"></div>-->
      <!--<div class="linear-gradient row"></div>-->
    </div>
    <!--<div style="padding-bottom: 60px"></div>-->

    <div slot="children-view">
      <!--<router-link class="qr-code" tag="div" :to="{name: 'service-scores'}">-->
      <!--<div class="qr-code-wrapper">-->
      <!--<i class="icon icon-qrcode"></i>-->
      <!--</div>-->
      <!--</router-link>-->
      <!--<div class="qr-code" @click="goScan">-->
      <!--&lt;!&ndash;<div class="qr-code" @click="_openAlert('敬请期待')">&ndash;&gt;-->
      <!--<div class="qr-code-wrapper">-->
      <!--<i class="icon icon-qrcode"></i>-->
      <!--</div>-->
      <!--</div>-->
      <page-view :excludePages="['prize-game']"/>
      <transition name="card-fade">
        <div class="card-dialog" v-show="cardMaskShow">
          <!--<i class="cubeic-wrong"></i>-->
          <div class="content-wrapper">
            <i class="cubeic-wrong" v-show="cardMaskShow" @click="cardMaskShow = false"></i>
            <div class="info">
              <p class="grade">{{userGrade}}</p>
              <p class="card-no">{{`No.${userInfo.cardNo}`}}</p>
            </div>
            <barcode v-if="userInfo.cardNo" class="bar-code" :value="userInfo.cardNo"
                     :options="{lineColor: '#000', displayValue: false, height:60}"/>
            <div ref="qrCode"></div>
            <p class="tip">向收银员出示使用</p>
          </div>
        </div>
      </transition>
      <turntable v-if="showLottery" :showLottery="showLottery" @close="onTurntableClose"/>
    </div>
  </page>
</template>

<script>
  import storage from 'good-storage'
  import Page from '../../components/page/page'
  import {utilMixin} from '../../common/mixins/util'
  import {userMixin} from '../../common/mixins/user'
  import PageView from '../../components/page-view/page-view'
  import {fetchAllGrades} from '../../api/common'
  import {Grade} from '../../common/models/Grade'
  import {KEY_ALL_GRADES, KEY_APP_INIT, KEY_VIP_LOCATION} from '../../common/config'
  import QRCode from '../../common/libs/qrcode'
  import VueBarcode from '@xkeshi/vue-barcode'
  import Turntable from '../../components/turntable-game/turntable-game'
  import {userCanLottery} from '../../api/prize'
  import wx from 'weixin-js-sdk'
  import {checkCardStatus, fetchWXCardInfo, activeUserCard} from '../../api/vip-card'
  import {carPayDeduction} from '../../api/carPark'
  import {openidUtils} from '../../common/wx-utils'
  import {mapActions} from 'vuex'
  import {loadUser} from '../../common/cache'
  import {wxUserInfo, isVipByOpenid, getUserAvatar} from '../../api/user'
  import {SET_LOADING_STATUS} from '../../store/common/mutation-types'

  const PAGE_NAME = 'home'
  const routerWhiteList = ['vip-rights']
  export default {
    name: PAGE_NAME,
    mixins: [utilMixin, userMixin],
    data() {
      return {
        cardMaskShow: false,
        grades: [],
        showLottery: false,
        // lon: 104.06426,
        // lat: 30.588943
        lon: 0,
        lat: 0,
        userName: '--',
        headImg: require('./logo@2x.png'),
        showPageShade: true
      }
    },
    computed: {
      userGrade() {
        if (!this.userInfo || !this.userInfo.code || !this.userInfo.grade) return ''
        if (this.grades.length) {
          const gardItem = this.grades.filter(item => item.id === this.userInfo.grade)
          if (gardItem.length) {
            return gardItem[0].name
          }
//          return this.grades.find(item => {
//            return item.id === this.userInfo.grade
//          }).name
        }
        return ''
      },
      gradeCardImg() {
        if (!this.userInfo || !this.userInfo.code) return ''
        let imgUrl = ''
        if (this.grades.length) {
          let imgItem = this.grades.find(item => {
            return item.id === this.userInfo.grade
          })
          imgItem.img && (imgUrl = imgItem.img)
        }
        return `${this.imgPrefix}${encodeURIComponent(imgUrl)}`
      }
    },
    activated() {
//      this._openGAlert()
      // 把拉取openid标识位设为false，防止退出登录后不拉取openid
//      this._openToast('加载中…', {mask: true})
      storage.session.set('__fetching_openid__', false)
      if (storage.get('nedDeduction', false)) {
        // 有优惠券未抵扣的情况
        carPayDeduction(storage.get('nedDeduction')).then(res => {
          storage.remove('nedDeduction')
        }).catch(err => {
          // 如果扣减失败下次进入再扣减
          console.log(`扣减失败：${err}`)
          storage.remove('nedDeduction')
        })
      }
      if (this.showPageShade) {
        this.$store.commit(SET_LOADING_STATUS, true)
      }
      this.initMapActionSheet()
      if (this.userInfo && this.userInfo.code) {
        this.accountJudge()
        this.getMineInfo()
      } else {
        // 判断是否会员
        isVipByOpenid().then(res => {
          if (res && res.XF_VIPCODE) {
            this.$store.commit(SET_LOADING_STATUS, false)
            this.showPageShade = false
            // 返回会员号， 如果有，并请求获取会员信息。
            this.saveUserInfo({code: res.XF_VIPCODE})
            this.getMineInfo()
          } else {
            this.showVipBind()
            // 如果没有，直接获取微信信息代替
            this.getWXInfo()
          }
        }).catch(errs => {
          this.showVipBind()
          this.$store.commit(SET_LOADING_STATUS, false)
//          this._closeToast()
          this._openAlert(`查询是否绑定会员失败：${errs}`)
        })
      }
    },
    updated() {
      this.$refs.page.refresh()
    },
    methods: {
      ...mapActions([
        'showVipBind'
      ]),
      getMineInfo() {
        this._getUserInfo(function () {
          // 在回调函数内查询
          const getUInfo = loadUser()
          if (getUInfo && getUInfo.code) {
            // 获取到了个人信息, 并确认是会员用户，获取微信头像
            this.userName = this.userInfo.name || this.userInfo.SurName || ''
            this.getWXHeadImg()
            this.initRootData()
            this.$store.commit(SET_LOADING_STATUS, false)
            this.showPageShade = false
          } else {
            // 没有获取到信息,获取微信信息代替
            this.getWXInfo()
          }
        })
      },
      accountJudge() {
        isVipByOpenid().then(res => {
          if (!res.XF_VIPCODE) {
            this._openAlert('会员账号已注销,请重新绑定！', {
              onConfirm: () => {
                this.clearUserInfo()
                this.showVipBind()
              }
            })
            return
          }
          if (res.XF_VIPCODE !== this.userInfo.code) {
            this.clearUserInfo()
            this._openAlert('查询到的会员号与储存信息不符，请重新进入！', {
              onConfirm: () => {
                wx.closeWindow()
              }
            })
          }
        }).catch(errs => {
          this.$store.commit(SET_LOADING_STATUS, false)
          this.showPageShade = false
          console.log(`查询是否会员失败：${errs}`)
        })
      },
      getWXHeadImg() {
        if (this.headImg.indexOf('http://thirdwx.qlogo.cn') === -1) {
          getUserAvatar().then(res => {
            this.headImg = res
            this.saveUserInfo({headImg: res})
          }).catch(e => console.warn(e))
        }
      },
      getWXInfo() {
        wxUserInfo().then(wxRes => {
          this.$store.commit(SET_LOADING_STATUS, false)
          this.showPageShade = false
          if (this.userInfo && (this.userInfo.name || this.userInfo.SurName)) {
            this.saveUserInfo({headImg: wxRes.headimgurl})
          } else {
            this.saveUserInfo({
              ...wxRes,
              name: wxRes.nickname,
              headImg: wxRes.headimgurl,
              sex: wxRes.sex === '1' ? 'M' : wxRes.sex === '0' ? 'F' : 'U'
            })
          }
        }).catch(errs => {
          this.$store.commit(SET_LOADING_STATUS, false)
//          this._closeToast()
          if (this.userInfo && this.userInfo.headImg) {
            this.headImg = this.userInfo.headImg
          }
          if (this.userInfo && this.userInfo.code) {
            this.showPageShade = false
          }
          this._openAlert('获取微信个人信息失败：' + errs)
        })
      },
      showEWM() {
        if (this.userInfo && this.userInfo.code) {
          this.cardMaskShow = true
        } else {
          this.showVipBind()
        }
      },
      toRouteFun(paths, qus) {
//        if (paths === 'car-park') {
//          window.location.href = 'http://wx.parkingwang.com/fee_charge/charge_fee'
//          return
//        }
//        if (paths === 'prize-game') {
//          this.showLottery = true
//          return
//        }
        if (paths === 'signin-daily' || paths === 'score-exchange' || paths === 'prize-game' || paths === 'vip-salons') {
          this._openAlert('敬请期待!')
          return
        }
        let routQue = {
          name: paths
        }
        if (qus) {
          routQue.query = qus
        }
        if (routerWhiteList.indexOf(paths) > -1) {
          this.$router.push(routQue)
        } else if (!this.userInfo || !this.userInfo.code) {
          this.showVipBind()
        } else {
          this.$router.push(routQue)
        }
      },
      selectNavigate() {
        // wx.getLocation({
        //   type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        //   success: function (res) {
        //     var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
        //     var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
        //     var speed = res.speed; // 速度，以米/每秒计
        //     var accuracy = res.accuracy; // 位置精度
        //   }
        // })
        const location = storage.session.get(KEY_VIP_LOCATION, false)
        if (!location) {
          this._openAlert('暂未获取到位置信息，无法使用此功能')
          return
        }
        this.lat = location.lat
        this.lon = location.lon
        this.mapActionSheet.show()
      },
      initMapActionSheet() {
        if (!this.userInfo || !this.userInfo.code) return
        if (!this.mapActionSheet) {
          this.mapActionSheet = this.$createActionSheet({
            title: '到达方式',
            active: -1,
            data: [
              {
                content: '驾车'
              },
              {
                content: '公交'
              },
              {
                content: '步行'
              },
              {
                content: '骑行'
              }
            ],
            onSelect: (item, index) => {
              this.$router.push({
                name: 'map-navigate',
                query: {
                  way: index,
                  lon: this.lon,
                  lat: this.lat
                }
              })
            }
          })
        }
      },
      onTurntableClose() {
        this.showLottery = false
        this._getUserInfo()
      },
      generateQrCode() {
        if (!this.qrCode) {
          this.qrCode = new QRCode(this.$refs.qrCode, {
            text: this.userInfo.cardNo,
            width: 270,
            height: 270,
            colorDark: '#000'
          })
        } else {
          this.qrCode.makeCode(this.userInfo.cardNo)
        }
      },
      initRootData() {
        if (!this.userInfo || !this.userInfo.code) return
        this._getGrades()
        const isAppInit = storage.session.get(KEY_APP_INIT, 1)
        if (isAppInit === 1) {
          storage.session.set(KEY_APP_INIT, 2)
          /** 领取至微信卡包 */
           this.aboutWXCard()
          /** 抽奖 */
//            userCanLottery().then(flag => {
//              if (flag) {
//                this._openConfirm('您获得抽奖机会,马上去抽奖?', {
//                  onConfirm: () => {
//                    this.showLottery = true
//                  }
//                })
//              }
//            })
        }
//        this._getUserInfo(function () {
//        })
      },
      aboutWXCard() {
        if (this.userInfo.code) {
          let openid = openidUtils.get()
          console.log(openid)
          this._openToast('查询中')
          // TODO 用于测试领取卡包，只有测试人员才能点击
//        if (!(openid === 'o-EAywFTcvAChrxD64fu7U6BlpOA' || openid === 'o-EAywC-BErH_mpRahdh7bF8MIp4' || openid === 'o-EAywBSdlufsQUZk__auit1Nkag')) return
          checkCardStatus().then(res => {
            this._closeToast()
            if (res === true) return
            const cardId = res.card_id
            console.log(res)
            if (!res.code) {
              this._openConfirm('是否领取VIP卡至微信卡包', {
                confirmBtn: {
                  text: '领取'
                },
                cancelBtn: {
                  text: '取消'
                },
                onConfirm: () => {
                  this._getWXCardInfo(cardId)
                }
              })
            } else {
              wx.openCard({
                cardList: [{
                  cardId,
                  code: res.code
                }]
              })
            }
          }).catch(e => {
            this._closeToast()
            if (e.message && e.message === 'wx0001') {
              this._openConfirm('当前会员卡未激活，是否激活此会员卡？', {
                onConfirm: () => {
                  this._openToast('激活会员卡中')
                  this._WXCardActivate()
                }
              }, false, 'couponCardDialog')
            } else {
              this._openAlert(`${e}`)
            }
          })
        } else {
          this.showVipBind()
        }
      },
      goScan() {
        if (!this.userInfo || !this.userInfo.code) {
          this.showVipBind()
        } else {
          this.$router.push({
            name: 'service-scores'
          })
        }
//        this.$router.push({
//          name: 'service-scores'
//        })
      },
      _getWXCardInfo(cardId) {
        this._openToast('获取信息中...')
        fetchWXCardInfo(cardId).then(cardInfo => {
          this._closeToast()
          return Promise.resolve(cardInfo)
        }).then(cardInfo => {
          if (cardInfo) {
            let cardExt = JSON.stringify({
              timestamp: cardInfo.timestamp,
              signature: cardInfo.signature,
              nonce_str: cardInfo.nonceStr
            })
            wx.addCard({
              cardList: [{
                cardId,
                cardExt
              }],
              success: (res) => {
                if (res.cardList.length) {
                  this._WXCardActivate()
                } else {
                  this._openAlert('会员卡开通失败，请稍后再试')
                }
              },
              fail: (err) => {
                if (err.errMsg.indexOf('addCard:fail') > -1) err.errMsg = '加入卡包失败'
                this._openAlert(err.errMsg)
              }
            })
          } else {
            this._openAlert('会员卡生成失败，请稍后再试')
          }
        }).catch(e => {
          if (e.message === '网络异常，请检查当前网络是否顺畅') {
            return
          }
          this._closeToast()
          this._openAlert(e.message)
        })
      },
      _WXCardActivate() {
        this._openToast('激活会员卡中...')
        activeUserCard().then(flag => {
          this._closeToast()
          if (flag) {
            this._openAlert('激活成功，可在您的卡包中查看')
          } else {
            this._openAlert('激活失败，请稍后再试')
          }
        }).catch(err => this._errorCatchHandler(err, false, true))
      },
      _getGrades() {
//        if (!storage.session.get(KEY_ALL_GRADES, false)) {
//          fetchAllGrades().then(grades => {
//            this._normalizeGrades(grades)
//          })
//        } else {
//          this.grades = storage.session.get(KEY_ALL_GRADES, [])
//        }
        this.grades = storage.session.get(KEY_ALL_GRADES, [])
        if (!this.grades.length) {
          fetchAllGrades().then(grades => {
            this._normalizeGrades(grades)
          })
        }
      },
      _normalizeGrades(list) {
        this.grades = list.map(item => new Grade(item))
        storage.session.set(KEY_ALL_GRADES, this.grades)
      },
      onCardLoad() {
        setTimeout(() => {
          this.$refs.page.refresh()
        }, 40)
      }
    },
    beforeRouteUpdate(to, from, next) {
      if (to.name === PAGE_NAME) {
        this.initRootData()
      }
      next()
    },
    mounted() {
      if (document.body.clientHeight >= 724) {
        console.log(document.body.clientHeight)
        this.$nextTick(() => {
          this.$refs.mainCont.style.marginTop = `50px`
          this.$refs.page.refresh()
        })
      }
    },
    watch: {
      cardMaskShow(val) {
        if (val && !this.qrCode) {
          setTimeout(this.generateQrCode, 20)
        }
      },
      userInfo: {
        handler(n) {
          const intoAppTimes = storage.session.get(KEY_APP_INIT, 1)
          if (n && n.cardNo && n.code && intoAppTimes === 1) {
            this.initRootData()
          }
          if (n && n.headImg) {
            this.userName = n.name || n.SurName || '--'
            this.headImg = n.headImg
          }
        },
        deep: true,
        immediate: true
      }
    },
    components: {
      Page,
      PageView,
      barcode: VueBarcode,
      Turntable
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variables.styl"
  .isVbindShow
    position: fixed
    top: 0px
    left: 0px
    height: 100%
    width: 100%
    background: #fff

  .home-card-bg
    position: relative
    width: 100%
    height: 220px
    background-image: url('./home_banner_bg.png')
    background-repeat: no-repeat
    background-position: center
    background-size: 100% auto
    overflow: hidden
    .card_img_box
      width: 88%
      height: 180px
      max-height: 180px
      position: absolute
      bottom: -6px
      left: 6%
      overflow: hidden
      z-index: 2
      color: #fff
      .infoArea
        position: absolute
        left: 0px
        top: 0px
        width: 100%
        height: 100%
        z-index: 2
        display: flex
        flex-direction column
        justify-content: center
        .infoA-box
          font-size: 14px
          display: flex
          vertical-align: center
          align-items: center
          justify-items: center
          padding-left: 10px
          .minesHimg
            border: 3px solid #DEBE94
            border-radius: 50%
            overflow: hidden
            margin-left: 14px
            height: 46px
            width: 46px
            img
              height: 46px
              width: 46px
          .minesName
            line-height: 1.4
            padding: 10px 14px
          .erwei
            height: 36px
            width: 36px
            bg-image('./home_icon_erweima')
            background-size: 100%
            background-repeat: no-repeat
        .myInters
          margin-top: 10%
          padding-left: 10px
          display: flex
          justify-content space-between
          .langlogo
            width: 45%
            height: 44px
            bg-image('./home_icon_logo')
            background-repeat: no-repeat
            background-position: center
            background-size: 100% auto
            margin-right: 10px
          .intsNum
            padding: 10px 0px 10px 14px
            > span
              padding: 8px 12px
              font-size: 16px
              border: 1px solid #E7C794
              border-radius: 4px
              > span
                font-size: $fontsize-large-xx
      .card_img
        position: absolute
        top: 0px
        left: 0
        display: block
        width: 100%
        height: 100%
        /* -webkit-box-reflect: below -2px  -webkit-linear-gradient(transparent,transparent 80%,rgba(255,255,255,.2)) */
        border-top-left-radius: 12px
        border-top-right-radius: 12px
        z-index: 1

  .top-router-panel
    /*margin-top: 10px*/
    display: flex
    align-items: center
    justify-content: space-around
    font-size: $fontsize-medium
    color: $color-hs
    padding: 18px 0
    background: linear-gradient(to right, orange, #f75d00);
    .router-item
      display: flex
      align-items: center
      background: #f9f9f9
      padding: 8px 20px
      border-radius: 16px
      color: $color-orange
      .icon
        width: 16px
        height: 20px
        margin-right: 5px
        vertical-align: middle
      .txt
        line-height: 16px
        vertical-align: middle

  .main-router-panel
    position: relative
    /*margin-top: 10px*/
    padding: 12px 0 18px
    /*@media (max-width: 320px)*/
    /*margin-top: 10px*/
    /*@media (min-width: 414px)*/
    /*margin-top: 35px*/
    .router-list
      display: flex
      align-items: center
      justify-content: center
      flex-wrap: wrap
      .item
        padding: 12px 0
        width: 33.333%
        text-align: center
        .icon
          margin: 2px auto
          width: 44px
          height: 44px
          @media (max-width: 320px)
            margin: 0
        .txt
          margin-top: 4px
          font-size: $fontsize-medium
          color: $color-hs
          @media (max-width: 320px)
            font-size: $fontsize-small

    .linear-gradient
      position: absolute
      background-repeat: no-repeat
      background-size: contain
      &.row
        width: 100%
        height: 3px
        left: 0
        top: 50%
        background-image: url('./linear_gradient_row.jpg')
      &.col
        width: 3px
        height: 100%
        top: 0
        background-image: url('./linear_gradient_col.png')
        &.first
          left: 25%
        &.second
          left: 50%
        &.three
          right: 25%

  .qr-code
    position: absolute
    bottom: 0
    left: 50%
    transform: translate(-50%, 0)
    .qr-code-wrapper
      position: relative
      margin: 0 auto
      width: 100px
      height: 50px
      border-radius: 50px 50px 0 0
      background: $color-hs
      .icon
        position: absolute
        left: 27px
        bottom: -10px
        width: 46px
        height: 46px

  .icon-bonus
    bg-image('./bonus')

  .icon-coupon
    bg-image('./coupon')

  .icon-sign
    bg-image('./sign')

  .icon-card-bag
    bg-image('./card_bag')

  .icon-user
    bg-image('./user')

  .icon-game
    bg-image('./game_prize')

  .icon-self_bouns
    bg-image('./self_integral')

  .icon-discount
    bg-image('./discount')

  .icon-gift
    bg-image('./gift')

  .icon-car-park
    bg-image('./car_park')

  .icon-parking
    bg-image('./parking')

  .icon-activity
    bg-image('./activity')

  .icon-salon
    bg-image('./salon')

  .icon-rights
    bg-image('./rights')

  .icon-more
    bg-image('./more')

  .icon-qrcode
    bg-image('./QRcode')

  .card-dialog
    position: absolute
    z-index: 100
    top: 0
    left: 0
    width: 100%
    height: 100%
    display: flex
    justify-content: center
    flex-direction: column
    align-items: center
    bg-image('./index_icon_bg')
    .cubeic-wrong
      position: absolute
      right: 3%
      top: 15px
      font-size: 30px
      color: $color-hs
    &.card-fade-enter, &.card-fade-leave-to
      opacity: 0
    &.card-fade-enter-active, &.card-fade-leave-active
      transition: all .3s
    .content-wrapper
      width: 84% /*position: absolute
      left: 50%
      top: 20%
      transform: translate(-50%, -10%)*/
      text-align: center
      background: #fff
      padding: 20px 12px
      border-radius: 4px
      position: relative
      .bar-code
        width: 100%
      .card-no, .grade
        color: #666
        text-align: center
        font-size: 20px
      .grade
        margin-bottom: 10px
      .tip
        margin-top: 20px
        text-align: center
        color: #666
        font-size: 16px
</style>
