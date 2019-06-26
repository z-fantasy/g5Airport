<template>
  <page type="home" ref="page">
    <!--<div class="top-rainbow"></div>-->
    <!--backgroundImage: `url(${gameInfo.lotteryBgUrl})`-->
    <div ref="gameWrapper" class="turntable-game" :style="{height: height}">
      <!--<div class="close" @click="isVisible=false">-->
        <!--<i class="cubeic-wrong"></i>-->
      <!--</div>-->
      <div class="turntable-name">
        <p>你有{{enableGameCount}}次抽奖机会</p>
        <!--<span>{{gameInfo.name}}</span>-->
      </div>
      <div class="game-box" ref="gameBox">
        <div class="box-wrapper">
          <div class="radius-group"></div>
          <div class="radius-bg default" :class="{toggle: circleLight}"></div>
          <div class="prize-list" ref="turntable">
            <div class="prize" ref="prizes" :key="index" v-for="(item, index) in prizeList">
              <div class="prize-item">
                <img v-show="item.remark" class="prize-img" :src="item.remark">
              </div>
            </div>
          </div>
          <div class="point"></div>
          <div class="btn-start" @click="startRotate"></div>
        </div>
        <div class="game-detail-tip">
          <!--<p>已抽{{currentGameCount}}次,还剩{{enableGameCount}}次机会</p>-->
          <span @click="lookDetail">活动规则</span>
        </div>
        <!--<div class="game-content">-->
        <!--<div class="desc" v-html="gameInfo.rules"></div>-->
        <!--</div>-->
        <!--<div class="count-panel">-->
        <!--<span>已抽{{currentGameCount}}次,还剩{{enableGameCount}}次机会</span>-->
        <!--</div>-->
      </div>
      <game-dialog ref="gameDialog" @close="onDialogClose"/>
      <game-rule-dialog ref="gameRuleDia"/>
    </div>
  </page>
</template>

<script type="text/ecmascript-6">
  import Page from '../../../components/page/page'
  import {prefixStyle} from '../../../common/utils'
  import {utilMixin} from '../../../common/mixins/util'
  import {userMixin} from '../../../common/mixins/user'
  import {fetchEnabledGame, fetchGameInfo, fetchValidLotteryCount, playGame, getGameBgImg} from '../../../api/prize'
  import {getchUserBouns} from '../../../api/common'
  import {GameInfo, PrizeItem} from '../../../common/models/Game'
  import GameDialog from '../../../components/game-dialog/game-dialog'
  import GameRuleDialog from '../../../components/game-rule-dialog/game-rule-dialog'

  const transform = prefixStyle('transform')
  const transitionEnd = prefixStyle('transitionEnd')

  const EVENT_CLOSE = 'close'
  export default {
    name: 'prize-game',
    mixins: [utilMixin, userMixin],
    data() {
      return {
        showLottery: true,
        circleLight: true,
        prizeList: [],
        prizeItemIndex: -1,
        gameInfo: {},
        enableGameCount: 0,
        totalGameCount: 0,
        currentGameCount: 0,
        isVisible: false,
        height: `${document.body.clientHeight}px`,
        backgroundImg: ''
      }
    },
    created() {
      this.isVisible = this.showLottery
      this.getGameInfo()
    },
    mounted() {
      setTimeout(() => {
        this.init()
      }, 20)
//      setTimeout(() => {
//        this.$refs.page.refresh()
//      }, 1000)
    },
    methods: {
      gameBgImgGet(gameid) {
        getGameBgImg(gameid).then(res => {
            this.backgroundImg = (this.imgPrefix + res['EB_MAINTENANCE_GAMEBG'].substring(1, res['EB_MAINTENANCE_GAMEBG'].length)).replace(/\\/g, '/')
            this.$nextTick(() => {
              this.$refs.gameWrapper.style.backgroundImage = `url(${this.backgroundImg})`
            })
          }
        ).catch(err => {
          this._openAlert(`获取活动背景图片失败：${err}`)
        })
//        if (!this.backgroundImg) {
//
//        }
      },
      onDialogClose() {
        fetchValidLotteryCount(this.gameInfo.id).then(res => {
          if (res.end || res.over === 0) {
            this.isVisible = false
          }
        })
      },
      init() {
        const gameBox = this.$refs.gameBox
        this.boxWidth = this.$refs.gameWrapper.offsetWidth - 80
        this.colorList = ['#FE7573', '#FE6563']
        this.rotateCount = 0
        gameBox.style.width = gameBox.style.height = `${this.boxWidth}px`
        // gameBox.style.width = `${this.boxWidth - 40}px`
        this.toggleLight()
      },
      toggleLight() {
        setTimeout(() => {
          this.circleLight = !this.circleLight
          this.toggleLight()
        }, 500)
      },
      renderTurntable() {
        let itemSize = this.$refs.turntable.offsetHeight / 2
        const len = this.prizeList.length
        for (let i = 0; i < len; i++) {
          this.$refs.prizes[i].style.width = `${itemSize}px`
          this.$refs.prizes[i].style.height = `${itemSize}px`
          let itemAngle = 360 / len
          let skewY = 30
          this.$refs.prizes[i].style[transform] = `rotate(${itemAngle * i}deg) skewY(${skewY}deg)`
          if (i % 2 === 0) {
            this.$refs.prizes[i].style.backgroundColor = this.colorList[0]
          } else {
            this.$refs.prizes[i].style.backgroundColor = this.colorList[1]
          }
          let prizeItem = this.$refs.prizes[i].querySelector('.prize-item')
          prizeItem.style[transform] = `skewY(-${skewY}deg) rotate(-${skewY}deg)`
          prizeItem.style.width = `${itemSize * 0.75}px`
          prizeItem.style.height = `${itemSize * 0.75}px`
          prizeItem.style.top = `${itemSize * 0.1}px`
          prizeItem.style.left = `${itemSize * 0.25}px`
          let prizeImg = this.$refs.prizes[i].querySelector('.prize-img')
          prizeImg.style.width = `${itemSize * 0.4}px`
          prizeImg.style.height = `${itemSize * 0.4}px`
          prizeImg.style.marginTop = `${itemSize * 0.25}px`
          prizeImg.style.marginLeft = `${itemSize * 0.12}px`
        }
        // 转盘停止旋转后的回调
        this.$refs.turntable.addEventListener(transitionEnd, () => {
          // 表示中奖
          if (this.prizeItemIndex !== this.prizeList.length - 1) {
            let prize = this.prizeList[this.prizeItemIndex]
            let tip = `恭喜你抽中${prize.desc}!`
            let prizeArr = []
            if (prize.list.length) {
              prize.list.forEach(item => {
                prizeArr.push(item.ticketName)
              })
            }
            let imgUrl = prize.remark
            this.$refs.gameDialog.show(imgUrl, tip, prizeArr)
          } else {
            this._openAlert('很遗憾~没有抽中哦~', {
              onConfirm: () => {
                this.isVisible = false
              }
            })
          }
        })
      },
      startRotate() {
        if (this.totalGameCount - this.currentGameCount === 0) {
          this._openAlert('当前抽奖机会已用完!', {
            onConfirm: () => {
              this.isVisible = false
            }
          })
          return
        }
        this._openToast('即将开始')
        this.enableGameCount -= 1
        this.currentGameCount += 1
        /*
        * {
        * "Header":{"errcode":"0","errmsg":"","exbox":null,"count":0},"success":true,
        * "Data":{
        *   "$id":"1",
        *   "EB_LEDGERID":"81823158539448565743",
        *   "XF_VIPCODE":"105000034",
        *   "XF_VIPGAME_GIFT":{
        *   "$id":"2",
        *   "XF_GAMEGIFTID":"20180515180508786088",
        *   "XF_SERIAL_LIST":[{
        *     "$id":"3",
        *     "XF_TICKETID":"20180515180403619667",
        *     "XF_DESCI":"10元代金券B",
        *     "EB_SERIALID":"28786626495219941635"
        *   },{
        *     "$id":"4",
        *     "XF_TICKETID":"20180517111703751339",
        *     "XF_DESCI":"50元代金券A",
        *     "EB_SERIALID":"37682314135681758926"
        *   }],
        *   "XF_BONUS_LIST":[],
        *   "XF_DESCI":"测试奖品",
        *   "XF_REMARK":"/乒乓球.jpg"
        *  }
        * }
        *}
        * */
        fetchValidLotteryCount(this.gameInfo.id).then(res => {
          if (res.end) {
            this._closeToast()
            this._openAlert('biubiubiu～您来晚了一步，礼品已发完了哟，但您和的故事才刚开始，超多惊喜等着您！', {
              onConfirm: () => {
                this.isVisible = false
              }
            })
            return
          }
          if (res.over === 0) {
            this._closeToast()
            this._openAlert('当前抽奖机会已用完!', {
              onConfirm: () => {
                this.isVisible = false
              }
            })
            return
          }
          playGame(this.gameInfo.id).then(res => {
            this._closeToast()
            getchUserBouns().then(res => {
              if (res && res.total) {
                this.saveUserInfo({bonus: res.total})
              }
            }).catch(e => {
              console.warn(`抽奖后查询总积分失败：${e}`)
            })
            let index = this.prizeList.findIndex(item => {
              return res.XF_VIPGAME_GIFT && res.XF_VIPGAME_GIFT.XF_GAMEGIFTID && res.XF_VIPGAME_GIFT.XF_GAMEGIFTID === item.id
            })
            if (index > -1) this.rotateTurnable(index)
            else this.rotateTurnable(this.prizeList.length - 1)
          }).catch(e => {
            this._closeToast()
            if (e.message.indexOf('扣减失败') > -1) {
              this.enableGameCount -= 1
              this.currentGameCount += 1
            }
            this._openAlert(e.message, {
              onConfirm: () => {
                this.isVisible = false
              }
            })
          })
        }).catch(e => this._openAlert(e.message))
      },
      rotateTurnable(prizeItemIndex) {
        // 获取随机数0-5 取回获奖数据下标代替 此处获取获奖数据使用异步方法
        const len = this.prizeList.length
        // if (this.prizeList.length) prizeItemIndex = rnd(0, len - 1)
        this.prizeItemIndex = prizeItemIndex
        // 记录旋转的次数，依次叠加旋转度数，防止往回倒转  transform属性的值必须依次增加，否则会发生倒转
        this.rotateCount += 1
        let rotateAngles = 0
        // 让转盘停止项与数组对应
        // 旋转角度 = 旋转6圈（2160度）* 已经旋转的次数 + 最少旋转的圈数（5圈）+ 每个奖品下标对应的角度
        rotateAngles = 2160 * this.rotateCount + (1800 + (60 * (len - prizeItemIndex) + 30))
        this.$refs.turntable.style[transform] = `rotate(${rotateAngles}deg)`
      },
      getGameInfo() {
        this._openToast('游戏初始化中')
        fetchEnabledGame().then(res => {
          this.gameInfo = Object.assign({}, this.gameInfo, new GameInfo(res))
          if (this.gameInfo.id) {
            this.gameBgImgGet(this.gameInfo.id)
            fetchValidLotteryCount(this.gameInfo.id).then(res => {
              if (res.end) {
                this._closeToast()
                this._openAlert('biubiubiu～您来晚了一步，礼品已发完了哟，但您和5号停机坪购物广场的故事才刚开始，超多惊喜等着您！', {
                  onConfirm: () => {
                    this.isVisible = false
                  }
                })
                return
              }
              if (res.over === 0) {
                this._closeToast()
                this._openAlert('当前抽奖机会已用完!', {
                  onConfirm: () => {
                    this.isVisible = false
                  }
                })
                return
              }
              this.totalGameCount = res.sum
              this.currentGameCount = res.now
              this.enableGameCount = res.over
              fetchGameInfo(this.gameInfo.id).then(list => {
                this.prizeList = this._normalizeList(list.VipGameInfo[0].XF_VIPGAMETYPE_List)
                setTimeout(() => {
                  this._closeToast()
                  if (this.prizeList.length) {
                    this.renderTurntable()
                  } else {
                    this._openAlert('暂无奖品项', {
                      onConfirm: () => {
                        this.isVisible = false
                      }
                    })
                  }
                }, 20)
              }).catch(e => {
                this._closeToast()
                this._openAlert(e.message, {
                  onConfirm: () => {
                    this.isVisible = false
                    this.$router.back()
                  }
                })
              })
            }).catch(e => {
              this._closeToast()
              this._openAlert(e.message, {
                onConfirm: () => {
                  this.isVisible = false
                }
              })
            })
          } else {
            this._closeToast()
            // '抽奖信息获取失败,暂时无法抽奖'
            this._openAlert('活动暂未开始', {
              onConfirm: () => {
                this.isVisible = false
              }
            })
          }
        }).catch(e => {
          this._closeToast()
          this._openAlert(e.message, {
            onConfirm: () => {
              this.isVisible = false
            }
          })
        })
      },
      lookDetail() {
        this.$refs.gameRuleDia.show(this.gameInfo.rules)
//        this._openAlert(this.gameInfo.rules)
      },
      _normalizeList(list) {
        let rs = []
        const defaultImg = require('components/turntable-game/no-prize.png')
        list.forEach(item => {
          if (item.VIPGameGift) rs.push(new PrizeItem(item.VIPGameGift))
          else rs.push({id: -1, desc: '谢谢参与', remark: defaultImg})
        })
        if (rs.length < 6) {
          let l = 6 - list.length
          for (let i = 0; i < l; i++) {
            rs.push({id: -1, desc: '谢谢参与', remark: defaultImg})
          }
        }
        console.log(rs.length)
        return rs
      }
    },
    components: {
      Page,
      GameDialog,
      GameRuleDialog
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variables.styl"
  .turntable-game
    /*position: absolute
    z-index:100
    top:0
    left:0
    width:100%
    height:100%*/
    /*bg-image('./game_icon_bg')
    background-color: orange
    background-size: 100% auto
    background-position: left top*/
    background-size : 100% 100%
    background-repeat:no-repeat
    padding:20px
    box-sizing:border-box
    display: flex
    justify-content : center
    flex-direction : column
    align-items : center
    .close
      position: absolute
      right:20px
      top:20px
      font-size:30px
      color:#5F9AEA
    .turntable-name
      margin-top:30%
      color:#fff
      text-align:center
      font-size:18px
      margin-bottom: 20px
      p
        position : relative
        color: #EB3C6A
        &::after, &::before
          content: ''
          position : absolute
          top: 0
          width: 20%
          height: 100%
          background-size: 100% auto
          background-position: center
          background-repeat:no-repeat
          bg-image('./game_icon_decorate')
        &::after
          left: -25%
        &::before
          right: -25%
    .game-box
      /*position: absolute*/
      /*top:100%*/
      /*transform:translateY(-50%)*/
      .box-wrapper
        position: relative
        width:100%
        height:100%
        .radius-bg,.radius-group
          overflow:hidden
          position:absolute
          width:100%
          height:100%
          background-size:100% 100%
        .radius-group
          background-color: transparent // #fe2e8b
          border: 12px solid #ff4563 // #fe2e8b
          border-radius:50%
          box-sizing: border-box
        .radius-bg
          &.default
            background-image:url('../../../components/turntable-game/radius-1.png')
          &.toggle
            background-image:url('../../../components/turntable-game/radius-2.png')
        .turntable,.prize-list
          position: absolute
          left:4%
          top:4%
          transform-origin: 50% 50%
          border-radius:50%
          overflow:hidden
          width: 92%
          height:92%
          transition: transform 6s
          background-color: #5F9AEA
        .prize-list
          width: 86%
          height:86%
          left: 7%
          top: 7%
        .point,.btn-start
          position:absolute
          left:50%
        .point
          top:80px
          width:30px
          height:50px
          background-repeat:no-repeat
          background-size: 100% auto
          background-position: center
          background-image: url('../../../components/turntable-game/point.png')
          transform:translate(-50%,0) rotate(180deg)
        .btn-start
          top:50%
          height:90px
          width:90px
          transform:translate(-50%,-50%)
          background-repeat:no-repeat
          background-size: 100% auto
          background-position: center
          background-image: url('../../../components/turntable-game/btn.png')
        .prize
          position: absolute
          transform-origin: right bottom
          .prize-item
            position: absolute
            overflow:hidden
            text-align:center
            .text
              font-size:14px
            .prize-img
              display:block
              overflow:hidden
      .game-detail-tip
        margin-top:20px
        text-align:center
        font-size:16px
        color:#fff
        p
          margin-bottom:10px
          text-decoration:none
        span
          /*text-decoration:underline*/
          position : relative
          &::after
            content: '>>'
</style>
