<template>
  <page type="car-park" ref="page">
    <div class="carParkArea" :style="{height: carParkAreaHeight}">
      <div class="carDetailArea">
        <cube-scroll
          ref="scroll"
          :options="options">
          <div class="carDetailCon">
            <div class="carUtil">
              <div class="carNoInput">
                <div class="carNoCubeInput" :class="{hasCarNo: carNo}" @click="showKeyBoard">
                  {{carNo ? carNo : '请输入您的车牌号'}}
                </div>
                <div class="carNoSure" @click="inQuireCar" v-show="canShowKeyboard">确定</div>
              </div>
              <div class="carNoInput secCarPark">
                <div class="carNoCubeInput">
                  车场选择
                </div>
                <div class="carNoSure">
                  <cube-select
                    v-model="carParkSec.value"
                    :options="carParkSec.options"
                    @change="change">
                  </cube-select>
                </div>
              </div>
              <div class="carParkDet">
                <div class="carLocal">{{carParkDeatail.carParkName}}</div>
                <div class="carDb">
                  <p>
                    <span>
                      入场时间：
                    </span>
                  </p>
                  <p>
                    <span>
                      {{carParkDeatail.intoTime ? carParkDeatail.intoTime : '--'}}
                    </span>
                  </p>
                </div>
                <div class="carDb">
                  <p>
                    <span>
                      停放时间：
                    </span>
                  </p>
                  <p>
                    <span>
                      {{carParkDeatail.parkTime ? carParkDeatail.parkTime : '--'}}
                    </span>
                  </p>
                </div>
                <div class="carDb">
                  <p>
                    <span>
                      停车费：
                    </span>
                  </p>
                  <p>
                    <span>
                      <i class="red">
                        {{carParkDeatail.allPayMoeney}}
                      </i> 元
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div class="carUtil">
              <div class="ticketChoice">
                <div class="ticketDis bottomBorder padBom" @click="showKey = 1">
                  <div class="ticDiscount">
                    <span>优惠券</span>
                    <small v-if="disTickMoneyNum">已选{{disTickMoneyNum}}张</small>
                  </div>
                  <div class="disAreaCou">
                    {{disTicCheck}}
                  </div>
                </div>
                <div class="ticketDis padTop" @click="showKey = 2">
                  <div class="ticDiscount">
                    <span>积分抵现</span>
                    <small v-if="bounsDeduction">已用{{bounsDeduction}}积分</small>
                  </div>
                  <div class="disAreaCou">
                    {{bounsTicCheck}}
                  </div>
                </div>
              </div>
            </div>
            <div class="dlTit">
              优惠使用说明
            </div>
            <div class="carUtil">
              <ul>
                <li class="ruleSm">
                  优惠券有使用期限限制，过了有效期不能使用；
                </li>
                <li class="ruleSm">
                  优惠券只能抵扣订单金额，优惠金额超出订单金额部分不能再次使用，不能兑换现金
                </li>
              </ul>
            </div>
          </div>
          <!--<no-data v-else/>-->
        </cube-scroll>
      </div>
      <div class="carPayFor">
        <div class="carPayMoney">
          ¥ {{needPayMoney > 0 ? needPayMoney.toFixed(2) : '0.00'}}
          <span v-if="allDiscMoney">
            已使用优惠
          <!--之前已优惠：¥ {{allDiscMoney}}-->
          </span>
        </div>
        <div class="payForMoney" :class="{canPayfor: this.carParkDeatail.parkTime && this.carParkDeatail.carReqData.charge && this.carParkDeatail.carReqData.charge.unpaid}" @click="payForMoney">
          马上支付
        </div>
      </div>
      <transition name="diaViewMask">
        <!--@click="showKey = 0"-->
        <div class="diaMask" v-show="showKey">
        </div>
      </transition>
      <transition name="diaViewKeys">
        <!--@click="showKey = 0"-->
        <div class="diaShadeKeys" v-show="showKey">
          <div class="shadeView" v-on:click.stop.prevent>
            <p class="keyTitele"><span>{{showKey === 2 ? '积分抵现' : '优惠券'}}</span> <span class="cubeic-close"
                                                                                       @click="closeDisView"></span></p>
            <p class="warnTit">请选择{{showKey === 2 ? '积分抵现' : '优惠券'}} <span
              v-show="showKey === 2" class="red">最多抵现{{`${bounsMostNum}元/${bounsMostjf}积分`}}</span></p>
            <div class="keyLiArea">
              <cube-scroll
                ref="ticScroll"
                :options="options">
                <ul class="keyUl" v-if="showKey === 1">
                  <li class="ticketDiLi" v-for="(ticItem, index) in disTicket" v-bind:key="index"
                      @click="coupSlect(ticItem)">
                    <!--<div class="ticketDArea">-->
                      <!--<div class="carTicMoney ">-->
                        <!--<p>-->
                          <!--<small>¥ </small>-->
                          <!--{{ticItem.money}}-->
                        <!--</p>-->
                        <!--&lt;!&ndash;<small>满180元可用</small>&ndash;&gt;-->
                      <!--</div>-->
                    <!--</div>-->
                    <div class="ticDetails">
                      <div class="ticConCheck">
                        <p class="ticRulLimit">{{ticItem.XF_DESCI}}</p>
                        <div class="ticRulCheck">
                          <div class="ticLimit">
                            <p>生效日期:{{ticItem.EB_USE_EFFECTDATE}}</p>
                            <p>失效日期:{{ticItem.EB_USE_EXPIRATIONDATE}}</p>
                          </div>
                          <span :class="{'ticCheckIcon': ticItem.checked, 'cubeic-right': ticItem.checked}"></span>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
                <ul class="keyUl bounsTicUl" v-if="showKey === 2">
                  <li class="bounsDisLl" v-for="(item, index) in bonusTic" v-bind:key="index"
                      :class="{bounsDisLlActive: item.checked}" @click=bonusSelc(item)>
                    <div class="bounsRecMon">
                      <p>{{item.money}}元</p>
                      <small>抵扣积分{{item.bouns}}</small>
                    </div>
                  </li>
                </ul>
                <noData v-if="(showKey === 1 && !disTicket.length) || (showKey === 2 && !bonusTic.length)"></noData>
              </cube-scroll>
            </div>
          </div>
        </div>
      </transition>
      <car-park-keyboard ref="keyboardCom" :showCarNo="true" :showMask="true"
                         @carNoVal="getBoardVal($event)"></car-park-keyboard>
    </div>
  </page>
</template>

<script type="text/ecmascript-6">
  import NoData from '../../../../components/no-result/no-result'
  import Page from '../../../../components/page/page.vue'
  import CarParkKeyboard from '../../../../components/car-park-keyboard/car-park-keyboard.vue'
  import storage from 'good-storage'
  import {utilMixin} from 'common/mixins/util'
  import {fetchMyCoupons} from '../../../../api/coupon'
  import {
    getCarParkShopId,
    getCoupSelFun,
    getBonusSelFun,
    getCarPackCost,
    getBounsSet,
    getparkCode,
    carPayDeduction,
    tcwDeduction,
    getparkSpace,
    getHasPayRec,
    carPayforBack
  } from '../../../../api/carPark'
  import {mapGetters} from 'vuex'
  import {API_URL, MALL_ID, uuid} from '../../../../api/config'
  import {parseQuery, formatDate} from '../../../../common/utils'

  export default {
    name: 'car-payment-detail',
    mixins: [utilMixin],
    data() {
      return {
        carParkSec: {
          options: [],
          value: '',
          allData: []
        },
        carNo: '',
        canShowKeyboard: true,
        carParkAreaHeight: `${document.body.clientHeight}px`,
        showKey: 0, // 0 关闭，1优惠券，2 积分抵扣
        options: {
          scrollbar: false,
          click: false
        },
        disTicket: [
//          {
//            money: 10,
//            checked: false
//          }
        ],
        disTickMoney: 0,
        disTickMoneyNum: 0,
        bonusTic: [
//          {
//            money: 10,
//            bouns: 1000,
//            checked: false
//          }
        ],
        bounsMoney: 0,
        bounsDeduction: 0,
        bounsMostNum: 0, // 积分最大单次兑换金额
        bounsMostjf: 0,  // 最大单次兑换积分
        needPayMoney: 0,
        carParkDeatail: {
          intoTime: '',
          parkTime: '',
          allPayMoeney: '',
          carParkName: '',
          carReqData: {}
        },
        otherCoupon: {
          type: '',
          money: '',
          name: '',
          bonusOldDes: 0
        },
        bounsSecFun: 0, // 积分抵扣0单选，1多选
        coupSecFun: 0, // 0停车优惠券单选，1多选
        bounsRecData: {
          select: 0, // 单选0， 多选1
          used: 0, // 有无使用过积分抵现，0没有，1用过
          canTimes: 0 // 是否可以多次使用积分抵现：0只能用一次，1： 可以用多次
        }
      }
    },
    created() {
      this.initGetData()
    },
    activated() {
      this.initGetData()
    },
    mounted() {
      setTimeout(() => {
        this.$refs.scroll.refresh()
      }, 80)
    },
    watch: {
      disTickMoney(n) {
        // this.needPayMoney = (this.carParkDeatail.carReqData.charge.unpaid / 100) - n - this.bounsMoney
      },
      bounsMoney(n) {
        this.needPayMoney = (this.carParkDeatail.carReqData.charge.unpaid / 100) - n - this.disTickMoney
      },
      showKey(n, o) {
//        if (n === 0 && o !== 1) {
//          // 优惠券、积分抵扣有变，重新请求，暂时先不请求了，点击去支付的时候再请求
// //          this.inQuireCar()
//        }
      }
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ]),
      allDiscMoney() {
        if (this.carParkDeatail.carReqData.coupon && this.carParkDeatail.carReqData.coupon.records && this.carParkDeatail.carReqData.coupon.records.length) {
          return true
        } else {
          return false
        }
        /** 原逻辑 */
//        if (this.carParkDeatail.carReqData && this.carParkDeatail.carReqData.charge) {
//          return (this.carParkDeatail.carReqData.charge['total_fee'] - this.carParkDeatail.carReqData.charge['unpaid']) / 100
//        } else {
//          return ''
//        }
      },
      disTicCheck() {
        if (this.disTicket.length) {
          const disTicData = this.disTicket.filter(item => item.checked)
          this.disTickMoneyNum = disTicData.length
          if (disTicData.length) {
            this.disTickMoney = disTicData.reduce((a, b) => {
              return b.money + a
            }, 0)
            return `优惠${(this.disTickMoney / 4).toFixed()}小时` // `优惠${parseFloat(this.disTickMoney).toFixed(2)}元`
          } else {
            this.disTickMoney = 0
            return `${this.disTicket.length}张可用`
          }
        } else {
          return '无可用优惠券'
        }
      },
      bounsTicCheck() {
        if (this.bonusTic.length) {
          const bonusTicData = this.bonusTic.filter(item => item.checked)
          this.bounsDeduction = bonusTicData.reduce((a, b) => {
            return b.bouns + a
          }, 0)
          if (bonusTicData.length) {
            this.bounsMoney = bonusTicData.reduce((a, b) => {
              return b.money + a
            }, 0)
            return `优惠${parseFloat(this.bounsMoney).toFixed(2)}元`
          } else {
            this.bounsMoney = 0
            return `${this.bonusTic.length}张可用`
          }
        } else {
          return '无积分抵现券'
        }
      }
    },
    methods: {
      closeDisView() {
        if (this.showKey === 1) {
          // 优惠券
          const couponList = this.disTicket.filter(item => {
            if (item.checked) {
              return item
            }
          }).map(checkItem => {
            return {
              'e_type': 67, // 类型（这里全弄成小时券）
              'validbtime': checkItem['EB_USE_EFFECTDATE'], // 生效日期
              'validetime': checkItem['EB_USE_EXPIRATIONDATE'], // 作废日期
              'ecoupon_serialno': checkItem['EB_SERIALID'], // 序列号
              'value': checkItem.money / 4 * 60, // 值，金额券对应XX分，小时优惠券对应的是XX分钟，折扣券对应XX折
              'moneyValue': ~~(checkItem.money * 100) // 添加一个金额字段，自己使用
            }
          })
          if (couponList.length) {
            let inQueryPrm = {
              carNo: this.carNo,
              isDisFun: true
            }
            inQueryPrm.couponList = {
              'e_coupon_list': couponList,
              'vpr_plate': this.carNo, // 车牌号
              'pay_flag': 2 // this.needPayMoney > 0 ? 1 : 2
//              "in_time": "2018-03-02 10:00:00", // 进场时间
//              "out_time": "2018-03-02 10:00:00", // 计费时间
            }
            const confirmCon = `确定使用${couponList.length ? couponList.length + '张电子券' : ''}？确认后无法退回，请确认!`
            this.selfConfirm(confirmCon, this.$options.methods.disCoupsFun.bind(this, inQueryPrm), this.$options.methods.cacleCoupsFun.bind(this))
          } else {
            this.showKey = 0
          }
        } else if (this.showKey === 2) {
          // 积分
          // 积分抵扣优惠
          const bonusTicMoney = this.bonusTic.reduce((a, b) => {
            if (b.checked) {
              return b.money + a
            } else {
              return a
            }
          }, 0)
          const bonusAllDis = parseFloat(parseFloat(bonusTicMoney).toFixed(2))
          let dDAmount = ~~bonusAllDis * 100
          if (dDAmount) {
            let dduArms = {
              bill_id: this.carParkDeatail.carReqData['bill_id'], // 单号，
              vpl_number: this.carNo, // 车牌
              park_code: storage.session.get('parkCode'), // 停车场id
              amount: dDAmount, // int 分
              pay_type: 5 // 有券就传6，没券传5; 因为pm骚逻辑，现在分券分开传，所以这里都是传积分5
            }
            let bonusText = ''
            if (this.bonusTic.length && bonusAllDis > 0) {
              bonusText += `${~~(this.bonusTic[0].bouns / this.bonusTic[0].money) * bonusAllDis}积分`
            } else if (!this.bonusTic.length && bonusAllDis > 0) {
              bonusText += `${bonusAllDis}积分`
            }
            const confirmCon = `确定使用${bonusText}？确认后无法退回，请确认!`
            this.selfConfirm(confirmCon, this.$options.methods.disBounsFun.bind(this, dduArms), this.$options.methods.cacleBounsFun.bind(this))
          } else {
            this.showKey = 0
          }
        } else {
          this.showKey = 0
        }
        //        this.showKey = 0
      },
      disCoupsFun(inQueryPrm) {
        this._openToast('抵扣中', {mask: true})
        // 优惠券自己这边抵扣，然后第三方抵扣查询
        const parArgs = this.getcarParkParms(2)
        carPayDeduction(parArgs).then(res => {
          this.showKey = 0
          // coupSecFun: 0, // 0停车优惠券单选，1多选
          // 抵扣券并查询接口
          this.getCarParkDefatile(inQueryPrm)
          // 整个页面刷新
//             this.initGetData()
          // 查询车牌
          // this.inQuireCar()
        }).catch(err => {
          this._closeToast()
          this.showKey = 0
          this._openAlert(`${err}`, {
            title: 'crm卡券扣减失败',
            onConfirm: () => {
              this.cacleCoupsFun()
//              if (this.coupSecFun) {
//                // 多选
//                this.initGetData()
//              } else {
//                // 单选
//                this.cacleCoupsFun()
//              }
            }
          })
        })
      },
      cacleCoupsFun() {
        this.disTicket = this.disTicket.map(item => {
          return {...item, checked: false}
        })
        this.showKey = 0
      },
      cacleBounsFun() {
        this.bonusTic = this.bonusTic.map(item => {
          return {...item, checked: false}
        })
        this.showKey = 0
      },
      disBounsFun(dduArms) {
        this._openToast('抵扣中', {mask: true})
        // 积分第三方抵扣，自己这边抵扣，第三方查询
        tcwDeduction(dduArms).then(res => {
          const resStatus = JSON.parse(res)
          if (resStatus.status) {
            // 自己这边再扣减
            const parArgs = this.getcarParkParms(1)
            carPayDeduction(parArgs).then(res => {
              this.showKey = 0
              //            bounsRecData: {
//            select: 0, // 单选0， 多选1
//              used: 0, // 有无使用过积分抵现，0没有，1用过
//              canTimes: 0 // 是否可以多次使用积分抵现：0只能用一次，1： 可以用多次
//          }
//              if (this.bounsRecData.select) {
//                // 整个页面刷新
//                 this.initGetData()
//              } else {
//                // 只刷新车牌数据
//                this.inqueryCarDetail(false, {
//                  carNo: this.carNo
//                })
//              }
              // 整个页面刷新
//              this.initGetData()
              // 只刷新车牌数据
              this._openToast()
              this.getCarParkDefatile({
                carNo: this.carNo,
                isDisFun: true
              })
            }).catch(err => {
              this.showKey = 0
              this._closeToast()
              // 如果扣减失败，储存一下，下次进入再扣减
              storage.set('nedDeduction', parArgs)
              this._openAlert(`${err}`, {
                title: 'crm积分扣减失败',
                onConfirm: () => {
                  // 只刷新车牌数据
                  this._openToast()
                  this.getCarParkDefatile({
                    carNo: this.carNo,
                    isDisFun: true
                  })
//                  if (this.bounsRecData.select) {
//                    // 整个页面刷新
//                    this.initGetData()
//                  } else {
//                    // 只刷新车牌数据
//                    this.inqueryCarDetail(false, {
//                      carNo: this.carNo
//                    })
//                  }
                }
              })
            })
          } else {
            this._closeToast()
            this._openAlert(resStatus.message || '', {
              title: '车场扣减失败',
              onConfirm: () => {
                // 只刷新车牌数据
                this.cacleBounsFun()
//                if (this.bounsRecData.select) {
//                  // 整个页面刷新
//                  this.showKey = 0
//                  this.initGetData()
//                } else {
//                  // 只刷新车牌数据
//                  this.cacleBounsFun()
//                }
              }
            })
          }
        }).catch(err => {
          this._closeToast()
          this._openAlert(err, {
            title: '车场扣减失败',
            onConfirm: () => {
              // 只刷新车牌数据
              this.cacleBounsFun()
//              if (this.bounsRecData.select) {
//                // 整个页面刷新
//                this.showKey = 0
//                this.initGetData()
//              } else {
//                // 只刷新车牌数据
//                this.cacleBounsFun()
//              }
            }
          })
        })
      },
      change(value, index, text) {
        const parkCode = this.carParkSec.allData.filter(item => item.P_PDESC === value)[0]['P_PARKINGCODE']
        storage.session.set('parkCode', parkCode)
        if (this.carNo) {
          this.inQuireCar()
        }
      },
      initGetData() {
        this.carParkAreaHeight = `${document.body.clientHeight}px`
//        this.userInfo.bonus
        getCoupSelFun().then(res => {
          if (res['STR_VALUE'] === '2') {
            // 停车券可多选
            this.coupSecFun = 1
          } else {
            this.coupSecFun = 0
          }
        }).catch(err => {
          this._openAlert(`查询停车券选择规则失败：${err}`)
        })
        // 查询车场
        if (!storage.session.get('parkCode', false) && !this.carNo && !storage.session.get('allPackCode', false)) {
          getparkCode().then(res => {
            if (res) {
              storage.session.set('parkCode', res[0]['P_PARKINGCODE'])
              this.carParkSec = {
                options: res.map(item => item.P_PDESC),
                allData: res,
                value: res[0].P_PDESC
              }
              storage.session.set('allPackCode', this.carParkSec)
            } else {
              this._openAlert(`停车场参数获取错误`)
            }
          }).catch(err => {
            this._openAlert(err, {title: '停车场参数获取失败'})
          })
        } else {
          if (storage.session.get('allPackCode', false)) {
            this.carParkSec = storage.session.get('allPackCode')
            storage.session.set('parkCode', this.carParkSec.allData[0]['P_PARKINGCODE'])
            console.log(storage.session.get('parkCode'))
          }
        }
        // 查询积分抵扣是否可多选
//        bounsSecFun
//        getBonusSelFun().then(res => {
//          if (res.STR_VALUE === '2') {
//            this.bounsSecFun = 1
//          } else {
//            this.bounsSecFun = 0
//          }
//        }).catch(err => {
//          this._openAlert(`查询积分选择规则失败：${err}`)
//        })
        // todo 查询停车券（卡包券）
        this.queryCarCoupons()
//        fetchMyCoupons(2, 0).then(res => {
// //        && ite['EB_DateState'] === '未过期'
//          const ticList = res.filter(ite => ite['EB_USED'] === '未使用')
//          this.disTicket = ticList.map(item => {
//            return {
//              ...item,
//              money: ~~item['XF_AMOUNT'],
//              checked: false
//            }
//          })
//        }).catch(err => {
//          console.warn(err)
//          this._openAlert(err, {title: '查询停车券失败'})
//        })
        // 先查询到停车店铺号
        getCarParkShopId().then(shopRes => {
          // 查询积分抵现规则
          getBounsSet(shopRes['STR_VALUE']).then(res => {
            console.log(res)
            const baseBonus = res['BaseBonus'] // 基础积分
            const baseBonusAmount = res['BaseBonus_To_Amount'] // 基础金额
            const bonusInc = res['Bonus_Incremental'] // 递进积分
            const baseBonMax = res['BaseBonus_SingleMAX_Amount'] // 最大单次兑换金额
            this.bounsMostNum = baseBonMax
            this.bounsMostjf = ((baseBonus / baseBonusAmount) * parseFloat(baseBonMax)).toFixed(2)
            const baseIncMoney = parseFloat(parseFloat(bonusInc).toFixed(2)) / (parseFloat(parseFloat(baseBonus).toFixed(2)) / parseFloat(parseFloat(baseBonusAmount).toFixed(2))) // 递进金额
            let nowMaxBnus = baseBonus // 当前列表最大积分值
            let nowMaxMoney = baseBonusAmount // 当前列表最大金额
            let surplusBnus = parseFloat(this.userInfo.bonus) // 当前剩余积分
            let nowBonusData = []
            if (this.userInfo.bonus) {
              while (surplusBnus > 0) {
                surplusBnus = surplusBnus - baseBonus // nowMaxBnus
                if (surplusBnus >= 0 && (nowMaxMoney <= baseBonMax)) {
                  nowBonusData.push({
                    money: parseFloat(parseFloat(nowMaxMoney).toFixed(2)),
                    bouns: parseFloat(parseFloat(nowMaxBnus).toFixed(2)),
                    checked: false,
                    'EB_EFFECT_DATETIME': res['EB_EFFECT_DATETIME'],
                    'EB_EXPIRYDATE': res['EB_EXPIRYDATE'],
                    'XF_BONUSWORTHID': res['XF_BONUSWORTHID']
                  })
                  nowMaxBnus += parseFloat(parseFloat(bonusInc).toFixed(2))
                  nowMaxMoney += parseFloat(parseFloat(baseIncMoney).toFixed(2))
                } else {
                  if (nowMaxMoney > baseBonMax) {
                    surplusBnus = -1
                  }
                }
              }
              this.bonusTic = nowBonusData
            }
          }).catch(err => {
            console.log(err)
            // this._openAlert(`查询积分抵现规则失败：${err}`)
          })
        }).catch(errs => {
          this._openAlert(errs, {title: '查询积分抵现规则店铺号失败'})
        })

        if (this.$route.query.carNo) {
          this.canShowKeyboard = false
          this.carNo = this.$route.query.carNo // 京BBB123
          this.inQuireCar()
        } else {
          if (storage.session.get('carParkTime', false)) storage.session.remove('carParkTime')
          this.carNo = ''
          this.canShowKeyboard = true
        }
      },
      queryCarCoupons() {
        fetchMyCoupons(2, 0).then(res => {
//        && ite['EB_DateState'] === '未过期'
          const ticList = res.filter(ite => ite['EB_USED'] === '未使用')
          this.disTicket = ticList.map(item => {
            return {
              ...item,
              money: ~~item['XF_AMOUNT'],
              checked: false
            }
          })
        }).catch(err => {
          console.warn(err)
          this._openAlert(err, {title: '查询停车券失败'})
        })
      },
      queryBonusData(id) {
        getBonusSelFun(id).then(res => {
          if (res.bonuschange === 2) {
            this.bounsSecFun = 1
          } else {
            this.bounsSecFun = 0
          }
          this.bounsRecData = {
            select: res.bonuschange === 2 ? 1 : 0, // 单选0， 多选1
            used: res.bonusledger, // 有无使用过积分抵现，0没有，1用过
            canTimes: res.bonusCount === 2 ? 1 : 0 // 是否可以多次使用积分抵现：0只能用一次，1： 可以用多次
          }
        }).catch(err => {
          this._openAlert(err, {title: '查询积分选择规则失败'})
        })
      },
      ticCheck(item) {
        item.checked = !item.checked
      },
      bounsCheck(item) {
        item.checked = !item.checked
      },
      showKeyBoard() {
        if (this.canShowKeyboard) {
          this.$refs.keyboardCom._showKeyboard()
        }
      },
      getBoardVal(e) {
        if (e.carNo) {
          this.carNo = e.carNo
          this.inQuireCar()
        } else {
        }
      },
      inQuireCar(isPayFor) {
        if (!storage.session.get('parkCode', false)) {
          setTimeout(() => {
            this._openToast('请稍等', {mask: true})
          }, 1)
          getparkCode().then(res => {
            if (res) {
              storage.session.set('parkCode', res[0].P_PARKINGCODE)
              this.carParkSec = {
                options: res.map(item => item.P_PDESC),
                allData: res,
                value: res[0].P_PDESC
              }
              storage.session.set('allPackCode', this.carParkSec)
              this.inQuireCar(isPayFor)
            } else {
              this._closeToast()
              this._openAlert(`停车场参数获取错误：${JSON.stringify(res)}`)
            }
          }).catch(err => {
            this._closeToast()
            this._openAlert(`停车场参数获取失败：${err}`)
          })
        } else {
          /** 查询车辆信息 */
          if (this.carNo) {
            setTimeout(() => {
              this._openToast('请稍等', {mask: true})
            }, 1)
            // 积分抵扣优惠
            const bonusTicMoney = this.bonusTic.reduce((a, b) => {
              if (b.checked) {
                return b.money + a
              } else {
                return a
              }
            }, 0)
            const bonusAllDis = parseFloat(parseFloat(bonusTicMoney).toFixed(2))
            const bonusDisc = bonusAllDis ? [{
              'e_type': 69, // 类型
              'validbtime': this.bonusTic.length ? this.bonusTic[0]['EB_EFFECT_DATETIME'] : '', // 生效日期
              'validetime': this.bonusTic.length ? this.bonusTic[0]['EB_EXPIRYDATE'] : '', // 作废日期
              'ecoupon_serialno': new Date().getTime() + uuid(10, 10),
//                this.bonusTic.length ? this.bonusTic[0]['XF_BONUSWORTHID'] : '', // 序列号
              'value': ~~(bonusAllDis * 100)// 值，金额券对应XX分，小时优惠券对应的是XX分钟，折扣券对应XX折
            }] : []
            // 66：按次数优惠 67：按分钟数优惠 68：按时间段免费 69：减免金额 70：折扣券 71：通用金额优惠券
            // 电子券优惠
            const couponList = this.disTicket.filter(item => {
              if (item.checked) {
                return item
              }
            }).map(checkItem => {
              return {
                'e_type': 67, // 类型（这里全弄成小时券）
                'validbtime': checkItem['EB_USE_EFFECTDATE'], // 生效日期
                'validetime': checkItem['EB_USE_EXPIRATIONDATE'], // 作废日期
                'ecoupon_serialno': checkItem['EB_SERIALID'], // 序列号
                'value': checkItem.money / 4 * 60, // 值，金额券对应XX分，小时优惠券对应的是XX分钟，折扣券对应XX折
                'moneyValue': ~~(checkItem.money * 100) // 添加一个金额字段，自己使用
              }
            })
            /** 现逻辑 积分抵扣和券抵扣分别使用接口，所以此处不再添加积分参数 */
            const discountsList = couponList
            /** 原逻辑 */
            // const discountsList = [...couponList, ...bonusDisc]
            let inQueryPrm = {
              carNo: this.carNo
            }
            if (typeof isPayFor === 'boolean' && isPayFor) {
              inQueryPrm.couponList = {
                'e_coupon_list': discountsList,
                'vpr_plate': this.carNo, // 车牌号
                'pay_flag': 2 // this.needPayMoney > 0 ? 1 : 2
//              "in_time": "2018-03-02 10:00:00", // 进场时间
//              "out_time": "2018-03-02 10:00:00", // 计费时间
              }
              if (bonusAllDis > 0 || couponList.length) {
                setTimeout(() => {
                  this._closeToast()
                }, 1)
                let bonusText = ''
                if (this.bonusTic.length && bonusAllDis > 0) {
                  bonusText += `,${~~(this.bonusTic[0].bouns / this.bonusTic[0].money) * bonusAllDis}积分`
                } else if (!this.bonusTic.length && bonusAllDis > 0) {
                  bonusText += `,${bonusAllDis}积分`
                }
                const disMoneys = this.carParkDeatail.carReqData['charge'].unpaid / 100 - (this.needPayMoney > 0 ? parseFloat(this.needPayMoney.toFixed(2)) : 0)
//                const confirmCon = `您确定使用${couponList.length ? couponList.length + '张电子券' : ''}${bonusText}抵扣${disMoneys.toFixed(2)}元停车费吗？点击确认后将抵扣车费无法退回，请确认是否抵扣!`
                const confirmCon = `确定使用${couponList.length ? couponList.length + '张电子券' : ''}${bonusText}？确认后无法退回，请确认!`
                this.selfConfirm(confirmCon, this.$options.methods.oldLogic.bind(this, inQueryPrm, bonusAllDis, couponList))
//                this.$createDialog({
//                  type: 'confirm',
//                  icon: '',
//                  confirmBtn: {
//                    text: '确定',
//                    active: true,
//                    disabled: false,
//                    href: 'javascript:;'
//                  },
//                  cancelBtn: {
//                    text: '取消',
//                    active: false,
//                    disabled: false,
//                    href: 'javascript:;'
//                  },
//                  onConfirm: () => {
//
//                  },
//                  onCancel: () => {
//                    // 点击取消按钮
//                  }
//                }, (createElement) => {
//                  return [
//                    createElement('div', {
//                      'class': {
//                        'my-title': true
//                      },
//                      style: {
//                        'padding-top': '12px'
//                      },
//                      slot: 'title'
//                    }, [
//                      createElement('div', {
//                        'class': {
//                          'my-title-img': true
//                        }
//                      }),
//                      createElement('p', '提示')
//                    ]),
//                    createElement('p', {
//                      'class': {
//                        'my-content': true
//                      },
//                      style: {
//                        'padding': '0 12px',
//                        'color': 'red'
//                      },
//                      slot: 'content'
//                    }, confirmCon)
//                  ]
//                }).show()
              } else {
                /** 现逻辑 */
                 this.thirdDis('', '', '', inQueryPrm)
                  /** 原逻辑 */
                 // this.inqueryCarDetail(isPayFor, inQueryPrm, bonusAllDis, couponList)
              }
            } else {
              this.disTicket = this.disTicket.map(item => {
                return {...item, checked: false}
              })
              this.bonusTic = this.bonusTic.map(item => {
                return {...item, checked: false}
              })
              this.inqueryCarDetail(isPayFor, inQueryPrm, bonusAllDis, couponList)
            }
          } else {
            this._openAlert('请输入需要查询的车牌号！')
          }
        }
      },
      oldLogic(inQueryPrm, bonusAllDis, couponList) {
        this._openToast('请稍等', {mask: true})
        /** 现逻辑 为了兼容第三方的SB接口和逻辑 */
          // 扣券
          // const hasTicketDd = couponList && couponList.length
        let dDAmount = ~~bonusAllDis * 100
        if (dDAmount) {
          // 券信息
//                      dDAmount += couponList.reduce((a, b) => {
//                        if (b.value) {
//                          return b.moneyValue + a
//                        } else {
//                          return a
//                        }
//                      }, 0)
          let dduArms = {
            bill_id: this.carParkDeatail.carReqData['bill_id'], // 单号，
            vpl_number: this.carNo, // 车牌
            park_code: storage.session.get('parkCode'), // 停车场id
            amount: dDAmount, // int 分
            pay_type: 5 // 有券就传6，没券传5; 因为pm骚逻辑，现在分券分开传，所以这里都是传积分5
          }
          this.thirdDis(dduArms, bonusAllDis, couponList, inQueryPrm)
        } else {
          this.thirdDis('', bonusAllDis, couponList, inQueryPrm)
        }
        /** 原逻辑 这里注释掉 */
        // this.inqueryCarDetail(isPayFor, inQueryPrm, bonusAllDis, couponList, true)
      },
      selfConfirm(confirmCon, func, cacleFunc) {
        this.$createDialog({
          type: 'confirm',
          icon: '',
          confirmBtn: {
            text: '确定',
            active: true,
            disabled: false,
            href: 'javascript:;'
          },
          cancelBtn: {
            text: '取消',
            active: false,
            disabled: false,
            href: 'javascript:;'
          },
          onConfirm: () => {
            // 执行函数
            func && func()
          },
          onCancel: () => {
            // 点击取消按钮
            cacleFunc && cacleFunc()
          }
        }, (createElement) => {
          return [
            createElement('div', {
              'class': {
                'my-title': true
              },
              style: {
                'padding-top': '12px'
              },
              slot: 'title'
            }, [
              createElement('div', {
                'class': {
                  'my-title-img': true
                }
              }),
              createElement('p', '提示')
            ]),
            createElement('p', {
              'class': {
                'my-content': true
              },
              style: {
                'padding': '0 12px',
                'color': 'red'
              },
              slot: 'content'
            }, confirmCon)
          ]
        }).show()
      },
      getcarParkParms(selectDis = 0) {
        // selectDis 0:券和积分都要，1：只要积分，2：只要券
        const coups = this.disTicket.filter(item => {
          if (item.checked) {
            return item
          }
        }).map(checkItem => {
          return {
            'e_type': 67, // 类型（这里全弄成小时券）
            'validbtime': checkItem['EB_USE_EFFECTDATE'], // 生效日期
            'validetime': checkItem['EB_USE_EXPIRATIONDATE'], // 作废日期
            'ecoupon_serialno': checkItem['EB_SERIALID'], // 序列号
            'value': checkItem.money / 4 * 60, // 值，金额券对应XX分，小时优惠券对应的是XX分钟，折扣券对应XX折
            'moneyValue': ~~(checkItem.money * 100) // 添加一个金额字段，自己使用
          }
        })
        // 积分抵扣优惠
        const bonusTicMoney = this.bonusTic.reduce((a, b) => {
          if (b.checked) {
            return b.money + a
          } else {
            return a
          }
        }, 0)
        const bonus = parseFloat(parseFloat(bonusTicMoney).toFixed(2))
        const cpDCharge = this.carParkDeatail.carReqData
        let carParkParms = {
          'ParkCompleteData': {
            'VipCode': this.userInfo.code,
            'TradeNo': cpDCharge['bill_id'] + '',
            'TxDateTime': '',
            'User': this.userInfo.name,
            'MallId': MALL_ID(),
            'ParkId': cpDCharge['park'].code,
            'CardNumber': this.carNo,
            'ParkArea': cpDCharge['park'].name,
            'ParkStartDateTime': cpDCharge['in'].time,
            'ParkEndDateTime': cpDCharge['out'].time,
            'TotalTime': cpDCharge['charge'].duration,
            'TotalAmount': cpDCharge['charge'].total_fee, // parseFloat(),
            'PayAmount': cpDCharge['charge'].unpaid, // parseFloat(()),
            'DiscountAmount': cpDCharge['charge'].total_fee - cpDCharge['charge'].unpaid, // parseFloat(this.carParkDeatail.allPayMoeney) - parseFloat((this.needPayMoney > 0 ? this.needPayMoney : 0)),
            'Remark': '',
            'Group1': '',
            'Group2': '',
            'Group3': '',
            'Group4': '',
            'Group5': ''
          }
        }
        if (coups && coups.length && (selectDis === 2 || !selectDis)) {
          carParkParms.TicketDatas = coups.map(item => {
            return {
              'VipCode': this.userInfo.code,
              'TradeNo': cpDCharge['bill_id'] + '',
              'TxDateTime': '',
              'User': this.userInfo.name,
              'MallId': MALL_ID(),
              'Ticket_Amount': item['moneyValue'], // item['value'],
              'Ticket_SerialId': item['ecoupon_serialno'],
              'Remark': cpDCharge.id
            }
          })
        }
        if (bonus && bonus > 0 && (selectDis === 1 || !selectDis)) {
          carParkParms.BonusWorthData = {
            'VipCode': this.userInfo.code,
            'TradeNo': cpDCharge['bill_id'] + '',
            'TxDateTime': '',
            'User': this.userInfo.name,
            'MallId': MALL_ID(),
            'BonusWorth_Amount': bonus,
            'Remark': cpDCharge.id
          }
        }
        return carParkParms
      },
      thirdDis(dduArms, bonus, coups, inQueryPrm) {
        const cpDCharge = this.carParkDeatail.carReqData
        let carParkParms = {
          'ParkCompleteData': {
            'VipCode': this.userInfo.code,
            'TradeNo': cpDCharge['bill_id'] + '',
            'TxDateTime': '',
            'User': this.userInfo.name,
            'MallId': MALL_ID(),
            'ParkId': cpDCharge['park'].code,
            'CardNumber': this.carNo,
            'ParkArea': cpDCharge['park'].name,
            'ParkStartDateTime': cpDCharge['in'].time,
            'ParkEndDateTime': cpDCharge['out'].time,
            'TotalTime': cpDCharge['charge'].duration,
            'TotalAmount': cpDCharge['charge'].total_fee, // parseFloat(),
            'PayAmount': cpDCharge['charge'].unpaid, // parseFloat(()),
            'DiscountAmount': cpDCharge['charge'].total_fee - cpDCharge['charge'].unpaid, // parseFloat(this.carParkDeatail.allPayMoeney) - parseFloat((this.needPayMoney > 0 ? this.needPayMoney : 0)),
            'Remark': '',
            'Group1': '',
            'Group2': '',
            'Group3': '',
            'Group4': '',
            'Group5': ''
          }
        }
        if (coups && coups.length) {
          carParkParms.TicketDatas = coups.map(item => {
            return {
              'VipCode': this.userInfo.code,
              'TradeNo': cpDCharge['bill_id'] + '',
              'TxDateTime': '',
              'User': this.userInfo.name,
              'MallId': MALL_ID(),
              'Ticket_Amount': item['moneyValue'], // item['value'],
              'Ticket_SerialId': item['ecoupon_serialno'],
              'Remark': cpDCharge.id
            }
          })
        }
        if (bonus && bonus > 0) {
          carParkParms.BonusWorthData = {
            'VipCode': this.userInfo.code,
            'TradeNo': cpDCharge['bill_id'] + '',
            'TxDateTime': '',
            'User': this.userInfo.name,
            'MallId': MALL_ID(),
            'BonusWorth_Amount': bonus,
            'Remark': cpDCharge.id
          }
        }
        if (dduArms) {
          tcwDeduction(dduArms).then(res => {
            const resStatus = JSON.parse(res)
            if (resStatus.status) {
              this.mineDeductionFun(carParkParms, inQueryPrm)
            } else {
              this._closeToast()
              this._openAlert('车场扣减失败：' + resStatus.message || '')
            }
          }).catch(err => {
            this._closeToast()
            this._openAlert(err, {title: '车场扣减失败'})
          })
        } else {
          this.mineDeductionFun(carParkParms, inQueryPrm)
        }
      },
      getCarParkDefatile(inQueryPrm, isPayFor, bonusAllDis, couponList, nedDeduction) {
        getCarPackCost(inQueryPrm).then(res => {
          const resJson = JSON.parse(res)
          if (resJson.status) {
            // 给个时间,作为支付的时候的时间判断依据
            //              storage.session.set('carParkTime', new Date().getTime())
            const parkDetail = resJson.data
            console.log(parkDetail)
            /** 查询积分规则及是否兑换过 **/
            this.queryBonusData(parkDetail.id)
            // todo set
            this.carParkDeatail = {
              intoTime: parkDetail['in'].time,
              parkTime: this.getHourTime(parkDetail.charge.duration),
              allPayMoeney: parkDetail.charge['total_fee'] / 100,
              carParkName: parkDetail['park'].name,
              carReqData: parkDetail
            }
            this.needPayMoney = parkDetail.charge['unpaid'] / 100
            if (parkDetail['coupon']['records'] && parkDetail['coupon']['records'].length) {
              const recDis = parkDetail['coupon']['records']
              let couponType = 0
              let bonusOldDes = 0
              const disRecMoney = recDis.reduce((a, b) => {
                if (b.value) {
                  // b.type === 47 && b.name === '电子通用金额券'
                  if (b.type !== 16) {
                    couponType = 1
                  } else {
                    bonusOldDes += b.value
                  }
                  return b.value + a
                } else {
                  return a
                }
              }, 0)
              this.otherCoupon = {
                type: couponType ? 47 : recDis[0].type,
                money: disRecMoney / 100,
                name: couponType ? '电子通用金额券' : recDis[0].name,
                bonusOldDes: bonusOldDes / 100
              }
//                if (this.needPayMoney) {
//                } else {
//                }
            } else {
              this.otherCoupon = {
                type: '',
                money: '',
                name: '',
                bonusOldDes: 0
              }
            }
            // 调用扣除积分和卡券的接口
            if ((typeof isPayFor === 'boolean') && isPayFor) {
              this.toCarPayUrl(bonusAllDis, couponList, nedDeduction)
            } else {
              if (inQueryPrm.isDisFun) {
                this.queryCarCoupons()
                if (!this.needPayMoney) {
                  const carParkParms = this.getcarParkParms()
                  // this.toSkip(carParkParms)
                  carPayforBack(carParkParms).then(res => {
                    this._closeToast()
                  }).catch(err => {
                    this._closeToast()
                    this._openAlert(err.message || err, {title: '缴费记录失败'})
                  })
                } else {
                  this._closeToast()
                }
              } else {
                this._closeToast()
              }
            }
          } else {
            this._closeToast()
            this.needPayMoney = 0
            this.carParkDeatail = {
              intoTime: '',
              parkTime: '',
              allPayMoeney: '',
              carParkName: '',
              carReqData: {}
            }
            this.otherCoupon = {
              type: '',
              money: '',
              name: '',
              bonusOldDes: 0
            }
            if (resJson.message === '无停车记录') {
              /** 轮询调用查询车牌 */
              const nowParkCode = storage.session.get('parkCode')
              const nowParkAllData = this.carParkSec.allData
              for (let i = 0; i < nowParkAllData.length; i++) {
                if (nowParkCode === nowParkAllData[i]['P_PARKINGCODE']) {
                  if (i < nowParkAllData.length - 1) {
                    storage.session.set('parkCode', nowParkAllData[i + 1]['P_PARKINGCODE'])
                    this.carParkSec.value = nowParkAllData[i + 1]['P_PDESC']
                    this.inQuireCar()
                  } else {
                    this._openAlert(resJson.message)
                  }
                  break
                }
              }
            } else {
              this._openAlert(resJson.message)
            }
          }
        }).catch(err => {
          this._closeToast()
          this._openAlert(err, {title: '查询停车费用失败'})
        })
      },
      inqueryCarDetail(isPayFor, inQueryPrm, bonusAllDis, couponList, nedDeduction) {
        // todo 查询车辆信息
        this.getCarParkDefatile(inQueryPrm, isPayFor, bonusAllDis, couponList, nedDeduction)
//        getCarPackCost(inQueryPrm).then(res => {
//          const resJson = JSON.parse(res)
//          if (resJson.status) {
//            // 给个时间,作为支付的时候的时间判断依据
//            //              storage.session.set('carParkTime', new Date().getTime())
//            const parkDetail = resJson.data
//            console.log(parkDetail)
//            /** 查询积分规则及是否兑换过 **/
//            this.queryBonusData(parkDetail.id)
//            // todo set
//            this.carParkDeatail = {
//              intoTime: parkDetail['in'].time,
//              parkTime: this.getHourTime(parkDetail.charge.duration),
//              allPayMoeney: parkDetail.charge['total_fee'] / 100,
//              carParkName: parkDetail['park'].name,
//              carReqData: parkDetail
//            }
//            this.needPayMoney = parkDetail.charge['unpaid'] / 100
//            if (parkDetail['coupon']['records'] && parkDetail['coupon']['records'].length) {
//              const recDis = parkDetail['coupon']['records']
//              let couponType = 0
//              let bonusOldDes = 0
//              const disRecMoney = recDis.reduce((a, b) => {
//                if (b.value) {
//                  // b.type === 47 && b.name === '电子通用金额券'
//                  if (b.type !== 16) {
//                    couponType = 1
//                  } else {
//                    bonusOldDes += b.value
//                  }
//                  return b.value + a
//                } else {
//                  return a
//                }
//              }, 0)
//              this.otherCoupon = {
//                type: couponType ? 47 : recDis[0].type,
//                money: disRecMoney / 100,
//                name: couponType ? '电子通用金额券' : recDis[0].name,
//                bonusOldDes: bonusOldDes / 100
//              }
// //                if (this.needPayMoney) {
// //                } else {
// //                }
//            } else {
//              this.otherCoupon = {
//                type: '',
//                money: '',
//                name: '',
//                bonusOldDes: 0
//              }
//            }
//            // 调用扣除积分和卡券的接口
//            if ((typeof isPayFor === 'boolean') && isPayFor) {
//              this.toCarPayUrl(bonusAllDis, couponList, nedDeduction)
//            } else {
//              this._closeToast()
//            }
//          } else {
//            this._closeToast()
//            this.needPayMoney = 0
//            this.carParkDeatail = {
//              intoTime: '',
//              parkTime: '',
//              allPayMoeney: '',
//              carParkName: '',
//              carReqData: {}
//            }
//            this.otherCoupon = {
//              type: '',
//              money: '',
//              name: '',
//              bonusOldDes: 0
//            }
//            if (resJson.message === '无停车记录') {
//              /** 轮询调用查询车牌 */
//              const nowParkCode = storage.session.get('parkCode')
//              const nowParkAllData = this.carParkSec.allData
//              for (let i = 0; i < nowParkAllData.length; i++) {
//                if (nowParkCode === nowParkAllData[i]['P_PARKINGCODE']) {
//                  if (i < nowParkAllData.length - 1) {
//                    storage.session.set('parkCode', nowParkAllData[i + 1]['P_PARKINGCODE'])
//                    this.carParkSec.value = nowParkAllData[i + 1]['P_PDESC']
//                    this.inQuireCar()
//                  } else {
//                    this._openAlert(resJson.message)
//                  }
//                  break
//                }
//              }
//            } else {
//              this._openAlert(resJson.message)
//            }
//          }
//        }).catch(err => {
//          this._closeToast()
//          this._openAlert(err, {title: '查询停车费用失败'})
//        })
      },
      getHourTime(sec) {
        let nowSec = ~~sec
        let totalTime = ''
        const daySec = Math.floor(nowSec / 86400)
        totalTime += daySec ? `${daySec}天` : ''
        nowSec -= daySec * 86400
        const hourSec = Math.floor(nowSec / 3600)
        totalTime += hourSec ? `${hourSec}小时` : ''
        nowSec -= hourSec * 3600
        const minSec = Math.ceil(nowSec / 60)
        totalTime += minSec ? `${minSec}分` : ''
        return totalTime
      },
      payForMoney() {
        // todo 根据之前的时间进行对比，如果超时，重新请求停车信息
        if (this.carParkDeatail.parkTime) {
          if (this.carParkDeatail.carReqData.charge['unpaid']) {
//            this.inQuireCar(true)
            const carParkParms = this.getcarParkParms()
            this.toSkip(carParkParms)
          }
        }
      },
      coupSlect(item) {
        if (!this.carNo) {
          this._openAlert('请先输入车牌号！')
          return
        }
        if ((this.otherCoupon.name === '电子通用金额券' || this.otherCoupon.type === 47) && !this.coupSecFun) {
          this._openAlert('之前已使用了优惠券，不允许再次使用！')
          return
        }
        if (!item.checked && !this.needPayMoney) {
          this._openAlert('待支付金额已经为0了')
          return
        }
        if (item.checked) {
          item.checked = !item.checked
        } else {
          if (this.coupSecFun) {
            if (this.needPayMoney > 0) {
              item.checked = !item.checked
            } else {
              this._openAlert(`待支付金额已经为0了！`)
            }
          } else {
            this.disTicket = this.disTicket.map(ite => {
              if (ite['EB_SERIALID'] === item['EB_SERIALID']) {
                return {...ite, checked: true}
              } else {
                return {...ite, checked: false}
              }
            })
          }
        }
      },
      bonusSelc(item) {
        if (!this.carNo) {
          this._openAlert('请先输入车牌号！')
          return
        }
        if (!item.checked && !this.needPayMoney) {
          this._openAlert('待支付金额已经为0了')
          return
        }
        if (item.checked) {
          item.checked = !item.checked
        } else {
          if (this.needPayMoney > 0) {
            if (this.bounsRecData.used && !this.bounsRecData.canTimes) {
//              !this.bounsSecFun && (this.otherCoupon.bonusOldDes > 0)
              this._openAlert(`已使用过积分抵扣！`)
            } else if (!this.bounsRecData.select && (parseFloat(parseFloat(this.bounsMoney).toFixed(2)) > 0)) {
//              !this.bounsSecFun && (parseFloat(parseFloat(this.bounsMoney).toFixed(2)) > 0)
              this.bonusTic = this.bonusTic.map(ite => {
                if (item.money === ite.money) {
                  return {...ite, checked: true}
                } else {
                  return {...ite, checked: false}
                }
              })
            } else {
              if ((this.bounsMoney + item.money + this.otherCoupon.bonusOldDes) > this.bounsMostNum) {
                this._openAlert(`单次积分抵扣最多抵扣${this.bounsMostNum}元!`)
              } else {
                item.checked = !item.checked
              }
            }
          } else {
            this._openAlert(`待支付金额已经为0了！`)
          }
        }
      },
      toCarPayUrl(bonus, coups, nedDeduction) {
        // todo 跳转支付地址（什么JB停车王支付地址）
        /**
         *  测试：
         https://dev.parkingwang.com/fee_charge/parking_detail?vpl=
         车牌号码车牌号码&return_url=跳转链接（urlencoded）
         线上：
         https://wx.parkingwang.com/fee_charge/parking_detail?vpl=
         车牌号码车牌号码&return_url=跳转链接（urlencoded）
         */
        const cpDCharge = this.carParkDeatail.carReqData
        let carParkParms = {
          'ParkCompleteData': {
            'VipCode': this.userInfo.code,
            'TradeNo': cpDCharge['bill_id'] + '',
            'TxDateTime': '',
            'User': this.userInfo.name,
            'MallId': MALL_ID(),
            'ParkId': cpDCharge['park'].code,
            'CardNumber': this.carNo,
            'ParkArea': cpDCharge['park'].name,
            'ParkStartDateTime': cpDCharge['in'].time,
            'ParkEndDateTime': cpDCharge['out'].time,
            'TotalTime': cpDCharge['charge'].duration,
            'TotalAmount': cpDCharge['charge'].total_fee, // parseFloat(),
            'PayAmount': cpDCharge['charge'].unpaid, // parseFloat(()),
            'DiscountAmount': cpDCharge['charge'].total_fee - cpDCharge['charge'].unpaid, // parseFloat(this.carParkDeatail.allPayMoeney) - parseFloat((this.needPayMoney > 0 ? this.needPayMoney : 0)),
            'Remark': '',
            'Group1': '',
            'Group2': '',
            'Group3': '',
            'Group4': '',
            'Group5': ''
          }
        }
        if (coups && coups.length) {
          carParkParms.TicketDatas = coups.map(item => {
            return {
              'VipCode': this.userInfo.code,
              'TradeNo': cpDCharge['bill_id'] + '',
              'TxDateTime': '',
              'User': this.userInfo.name,
              'MallId': MALL_ID(),
              'Ticket_Amount': item['moneyValue'], // item['value'],
              'Ticket_SerialId': item['ecoupon_serialno'],
              'Remark': cpDCharge.id
            }
          })
        }
//        (bonus && ~~bonus > 0) || this.otherCoupon.bonusOldDes
        if (bonus && bonus > 0) {
          carParkParms.BonusWorthData = {
            'VipCode': this.userInfo.code,
            'TradeNo': cpDCharge['bill_id'] + '',
            'TxDateTime': '',
            'User': this.userInfo.name,
            'MallId': MALL_ID(),
            'BonusWorth_Amount': bonus,
            'Remark': cpDCharge.id
          }
        }
        if (nedDeduction) {
          // 有扣减的情况
          // 临上线三方又加个什么支付接口，……看都看不懂了……
          const hasTicketDd = carParkParms.TicketDatas && carParkParms.TicketDatas.length
          let dDAmount = ~~bonus * 100
          if (hasTicketDd) {
            dDAmount += carParkParms.TicketDatas.reduce((a, b) => {
              if (b.moneyValue) {
                return b.moneyValue + a
              } else {
                return a
              }
            }, 0)
          }
          let dduArms = {
            bill_id: cpDCharge['bill_id'], // 单号，
            vpl_number: this.carNo, // 车牌
            park_code: storage.session.get('parkCode'), // 停车场id
            amount: dDAmount, // int 分
            pay_type: hasTicketDd ? 6 : 5 // 有券就传6，没券传5
          }
          tcwDeduction(dduArms).then(res => {
            const resStatus = JSON.parse(res)
            if (resStatus.status) {
              this.mineDeductionFun(carParkParms)
            } else {
              this._closeToast()
              this._openAlert('车场扣减失败：' + resStatus.message || '')
            }
          }).catch(err => {
            this._closeToast()
            this._openAlert(err, {title: '车场扣减失败'})
            // 车场扣减失败就屏蔽不给跳转
 //            {
 //              onConfirm: () => {
 //                this.toSkip(carParkParms)
 //              }
 //            }
          })
        } else {
          this.toSkip(carParkParms)
        }
      },
      mineDeductionFun(parArgs, inQueryPrm) {
        // 自己这边再扣减
        carPayDeduction(parArgs).then(res => {
          /** 现逻辑 查询车辆信息(开闸用的查询) */
          let openZha = inQueryPrm
          // 是否调用查询费扣减
          if (inQueryPrm.couponList && inQueryPrm.couponList['e_coupon_list'].length) {
            getCarPackCost(openZha).then(res => {
              // 再查询并抵扣券
              const resJson = JSON.parse(res)
              if (resJson.status) {
                // 给个时间,作为支付的时候的时间判断依据
                //              storage.session.set('carParkTime', new Date().getTime())
                const parkDetail = resJson.data
                //              console.log(parkDetail, 'needPayMoney: ', this.needPayMoney)
                this.needPayMoney = parseFloat((parkDetail.charge['unpaid'] / 100).toFixed(2))
                this.toSkip(parArgs)
              } else {
                this._closeToast()
                this._openAlert(resJson.message, '支付查询失败！')
              }
            }).catch(err => {
              this._closeToast()
              this._openAlert(err, {title: '查询停车费用失败'})
            })
          } else {
            this.toSkip(parArgs)
          }
          /** 原逻辑 */
          // this.toSkip(parArgs)
        }).catch(err => {
          this._closeToast()
          // 如果扣减失败，储存一下，下次进入再扣减
          storage.set('nedDeduction', parArgs)
          this._openAlert(`crm扣减失败：${err}`, {
            onConfirm: () => {
              this.toSkip(parArgs)
            }
          })
        })
      },
      toSkip(carParkParms) {
        const carParkNo = encodeURIComponent(JSON.stringify(carParkParms))
        if (this.needPayMoney > 0) {
          this._closeToast()
          const payUrl = 'https://wx.parkingwang.com/fee_charge/parking_detail' // window.env === 1 ? 'https://dev.parkingwang.com/fee_charge/parking_detail' : 'https://wx.parkingwang.com/fee_charge/parking_detail'
          let callBackUrl = `${window.globalData.homeUrl}/#/car-park-result`
          // 为适应第三方坑毙接口，只能缓存本地参数
          storage.set('carParkNo', carParkNo)
          let toPayFullUrl = `${payUrl}?vpl=${this.carNo}&return_url=${encodeURIComponent(callBackUrl)}`
          window.location.href = toPayFullUrl
        } else {
          // 这里查询一下是否已经有缴费记录了
          getHasPayRec({
            'carCode': carParkParms['ParkCompleteData']['CardNumber'],
            'inTime': carParkParms['ParkCompleteData']['ParkStartDateTime'],
            'totalFree': carParkParms['ParkCompleteData']['TotalAmount']
          }).then(res => {
            this._closeToast()
            if (~~res === 1) {
              this._openAlert(`该车牌已经缴过费，无需再次缴费，请尽快离场`)
            } else {
              this.$router.push({
                name: 'car-park-result',
                query: {
                  carParkNo: carParkNo,
                  disCouponAll: true
                }
              })
            }
          }).catch(err => {
            this._closeToast()
            this._openAlert(`查询是否已经缴费记录失败：${err}`, {
              confirm: () => {
                this.$router.push({
                  name: 'car-park-result',
                  query: {
                    carParkNo: carParkNo,
                    disCouponAll: true
                  }
                })
              }
            })
          })
        }
      }
    },
    beforeDestroy() {
      if (this.$refs.keyboardCom) {
        this.$refs.keyboardCom.maskFun()
      }
    },
    deactivated() {
      if (this.$refs.keyboardCom) {
        this.$refs.keyboardCom.maskFun()
      }
    },
    components: {
      Page,
      NoData,
      CarParkKeyboard
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~common/stylus/variables.styl"
  @import "~common/stylus/mixin.styl"
  .my-content {
    color: red
    padding: 0 12px
  }

  .my-title {
    padding-topS: 12px
  }

  .carParkArea
    position: relative
    /*height: 100%
    overflow-y: auto*/
    font-size: $fontsize-medium
    background: $color-page-rights
    color: #666
    .carPayFor
      position: fixed
      bottom: 0
      width: 100%
      height: 50px
      background: #fff
      z-index: 9
      display: flex
      justify-content: space-between
      align-items: center
      .carPayMoney
        color: #E34548
        font-weight: bold
        font-size: $fontsize-large-xx
        padding-left: 14px
        flex: 2
        span
          margin-left: 14px
          font-size: $fontsize-medium
      .payForMoney
        height: 100%
        text-align: center
        color: #ffffff
        font-size: $fontsize-large-xx
        flex: 1
        line-height: 50px
        background: linear-gradient(to left, #999999, #ffffff)
      .canPayfor
        background: linear-gradient(to left, orange, #f75d00)
    .carDetailArea
      height: calc(100% - 50px)
      z-index: 1
      .carDetailCon
        /*padding-bottom: 50px*/
        .carUtil
          margin-top: 12px
          padding: 16px 14px
          background: #fff
          .carNoInput
            display: flex
            padding: 10px 0
            align-items: center
            border-bottom-1px()
            .carNoSure
              padding: 6px 14px
              border: 1px solid $color-weight-orange
              color: $color-orange
              border-radius: 4px
            .carNoCubeInput
              flex: 1
              font-size: $fontsize-large-x
              color: #666
              &::after
                border: none
              input
                height: 36px
            .hasCarNo
              color: #333
          .secCarPark
            display: flex
            padding: 6px 0
            .carNoSure
              flex: 1
              padding: 0px 14px
              border: none
              /deep/ .cube-select::after
                border: none
          .carParkDet
            margin-top: 6px
            color: #666
            > div
              display: flex
              padding-top: 10px
            .carDb
              p:nth-child(2)
                padding-left: 4px
                flex: 1px
                table-layout: fixed;
                word-break: break-all;
                overflow: hidden;
            .red
              font-style: normal
              font-size: $fontsize-large-x
              color: #E34548
          .ticketChoice
            .bottomBorder
              border-bottom-1px()
            .ticketDis
              position: relative
              display: flex
              justify-content: space-between
              .disAreaCou
                padding-right: 18px
              .ticDiscount
                small
                  border-radius: 10px
                  margin-left: 5px
                  font-size: 12px
                  padding: 0 4px
                  color: #E34548
                  border: 1px solid #E34548
              &::before
                content: ''
                position: absolute
                right: 0
                width: 10px
                height: 14px
                background: transparent url('./parking_icon_arrow_right@3x.png') no-repeat center
                background-size: auto 100%
            .padTop
              padding-top: 14px
              &::before
                margin-top: -1px
                top: 50%
            .padBom
              padding-bottom: 14px
              &::before
                top: 0
          .ruleSm
            padding-bottom: 14px
            position: relative
            padding-left: 16px
            line-height: 1.3
            &::after
              content: ''
              position: absolute
              top: 4px
              left: 0
              width: 8px
              height: 8px
              border-radius: 50%
              background: $color-weight-orange
      .dlTit
        padding-left: 14px
        font-size: $fontsize-medium
        font-weight: bold
        line-height: 30px
        margin-top: 10px

  .diaViewKeys-enter-active, .diaViewKeys-leave-active
    transition: all .3s ease
    transform: translateY(0px)

  .diaViewKeys-enter, .diaViewKeys-leave-to
    opacity: 0
    transform: translateY(500px)

  .diaViewMask-enter-active, .diaViewMask-leave-active
    transition: all .4s ease

  .diaViewMask-enter, .diaViewMask-leave-to
    opacity: 0

  .diaShadeKeys, .diaMask
    position: fixed
    left: 0px
    bottom: 0
    width: 100%
    height: 100%
    z-index: 11
    .shadeView
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      z-index: 12
      background: #fff
      .warnTit
        background: #FFEDD7
        padding: 8px 12px
        font-size: 12px
        .red
          color: red
      .keyTitele
        padding: 4px 12px
        height: 50px
        line-height: 50px
        display: flex
        justify-content: space-between
        color: #333
        position: relative
        font-size: $fontsize-large-xx
      .keyLiArea
        height: 374px
        /deep/ .bounsTicUl
          display: flex
          flex-wrap: wrap
        /deep/ .keyUl
          height: 100%
          margin: 0 12px
          padding-bottom: 12px
          .ticketDiLi
            color: #333
            display: flex
            height: 100px
            box-shadow: 1px 2px 4px #E0E0E0
            margin-top: 10px
            .ticketDArea, .ticDetails
              display: flex
              justify-content: center
              flex-direction: column
              align-items: center
            .ticketDArea
              flex: 2
              position: relative
              padding-left: 10px
              background: linear-gradient(89deg, #CDA457 0%, #D8B669 89%);
              color: #fff
              .carTicMoney
                text-align: center
                font-size: $fontsize-large-xxxx
                p
                  small
                    font-size: $fontsize-large-x
                small
                  font-size: 12px
              &::after
                content: ''
                position: absolute
                width: 16px
                top: 0
                left: 0
                height: 100%
                background: radial-gradient(circle at 50% 50%, #fff 0, #fff 50%, transparent 0), radial-gradient(circle at 50% 50%, #fff 0, #fff 50%, transparent 0);
                background-repeat: repeat-y;
                background-size: 11px 11px;
                background-position: -6px 0px
            .ticDetails
              flex: 6
              .ticConCheck
                width: 92%
              .ticRulLimit
                border-bottom: 1px #ccc dashed
                font-size: $fontsize-large
                line-height: 30px
              .ticRulCheck
                display flex
                justify-content: space-between
                align-items: center
                color: #666
                padding: 16px 0
                .ticLimit p
                  line-height: 1.5
                span
                  height: $fontsize-large-xxx
                .ticCheckIcon
                  color: $color-weight-orange
                  font-size: $fontsize-large-xxx
          .bounsDisLl
            width: 31%
            min-width: 31%
            padding: 12px 0
            display: flex
            justify-content: center
            align-items: center
            text-align: center
            margin-left: 1.6%
            color: $color-weight-orange
            border: 1px solid $color-weight-orange
            border-radius: 4px
            margin-top: 12px
            .bounsRecMon
              p
                font-size: $fontsize-large-xxx
                margin-bottom: 4px
              small
                font-size: 12px
          .bounsDisLlActive
            color: #fff
            background: $color-weight-orange

  .diaMask
    z-index: 10
    background: rgba(0, 0, 0, .5)
</style>
