<template>
  <page type="service-photo" title="拍照积分" ref="page">
    <div @click="addEvtList">
        <ul class="service-photo-ul">
          <li class="service-photo-li">
            <div class="inputName">
              所在店铺
            </div>
            <div class="inputValue" @click.stop.prevent>
              <cube-loading class="cubeLoad" v-show="inputLoad"></cube-loading>
              <input type="text" placeholder="消费商户"
                     v-model.stop.prevent.trim="shopName" @focus="inputFocus()" ref="input1">
              <ul class="store-select" v-show="showSN && shopNameList.length">
                <li v-for="item in shopNameList" @click="choiceSName(item)">
                  {{item.EB_NAME}}</li>
              </ul>
            </div>
          </li>
          <li class="service-photo-li">
            <div class="inputName">
              小票编号
            </div>
            <div class="inputValue" @click.stop.prevent>
              <input v-model.trim="inquireData.oddNum" type="text" placeholder="非必填，填写后审批效率更高" ref="input2">
            </div>
          </li>
          <li class="service-photo-li">
            <div class="inputName">
              消费金额
            </div>
            <div class="inputValue" @click.stop.prevent>
              <input v-model.trim="inquireData.moneys" type="tel" placeholder="消费金额" ref="input3">
            </div>
          </li>
          <li class="service-photo-li">
            <div class="inputName">
              消费时间
            </div>
            <div class="selectValue">
              <p class="selectValueDate" @click="showDatePicker"><span class="sTime">{{inquireData.timeDate}}</span><i class="cubeic-arrow"></i></p>
            </div>
          </li>
          <li class="service-photo-li">
            <div class="inputName">
              缩略图
            </div>
            <div class="imgChoiseArea">
              <div class="imgChoiseBox">
                <div class="imgShowBox" :class="{noneImg: !choiceImg.localId}" @click="choiseImgFun">
                  <img class="imgLocation" :src="choiceImg.localId" alt="">
                </div>
              </div>
            </div>
          </li>
        </ul>
      <div class="subArea">
        <div class="subBtn" @click="subBtn">
          提交
        </div>
      </div>
    </div>
  </page>
</template>

<script type="text/ecmascript-6">
  import Page from '../../../../components/page/page'
  import { debounce, formatDate, deviceInfo } from '../../../../common/utils'
  import {utilMixin} from '../../../../common/mixins/util'
  import {inqStore, servicePtoSub} from '../../../../api/service-score'
  import wx from 'weixin-js-sdk'
  import storage from 'good-storage'
  const outDayNum = 7
  export default {
    name: 'service-photo',
    mixins: [utilMixin],
    data() {
      return {
        inquireData: {
          timeDate: formatDate(new Date(), 'yyyy-MM-dd'),
          oddNum: '',
          moneys: ''
        },
        shopName: '',
        shopNameList: [],
        shopId: '',
        showSN: false,
        inputLoad: false,
        choiceImg: {
          localId: '',
          localBase: ''
        }
      }
    },
    created() {
      if (storage.session.get('wxConfig') && deviceInfo().android) {
        wx.config(storage.session.get('wxConfig'))
      }
    },
    watch: {
      shopName: function (n) {
        if (!n) {
          this.shopId = ''
        }
        this.searchInqu()
      }
    },
    methods: {
      addEvtList() {
        this.$refs.input1.blur()
        this.$refs.input2.blur()
        this.$refs.input3.blur()
      },
      choiseImgFun() {
        wx.chooseImage({
          count: 1, // 默认9
          success: (res) => {
            const localIds = res.localIds // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            this.choiceImg.localId = localIds[0]
            this.$nextTick(() => {
              setTimeout(() => {
                this.$refs.page.refresh()
              }, 20)
            })
          }
        })
      },
      inputFocus () {
        // 获得焦点的时候
        this.showSN = true
        if (this.shopName) {
          // 开始请求 请求成功后
          inqStore(this.shopName).then(res => {
            console.log(res)
//            this.shopNameList = res ? res : []
          }).catch(err => {
            this._openAlert(JSON.stringify(err))
          })
        } else {
          this.shopNameList = []
        }
      },
      searchInqu: debounce(
        function () {
          if (this.shopName && this.showSN) {
            // 开始请求
            // 请求成功后显示
            this.inputLoad = true
            inqStore(this.shopName).then(res => {
              this.inputLoad = false
              this.shopNameList = res ? res : []
            }).catch(err => {
              this.inputLoad = false
              this._openAlert(err.errmsg)
            })
          } else {
            // 没有内容的情况
            this.shopNameList = []
          }
        }, 600
      ),
      choiceSName (sn) {
        this.shopName = sn.EB_NAME
        this.shopId = sn.EB_STOREID
        this.showSN = false
      },
      showDatePicker() {
        if (!this.datePicker) {
          const nowDate = new Date()
          const minDate = new Date(nowDate.setDate(nowDate.getDate() + 1 - outDayNum))
          this.datePicker = this.$createDatePicker({
            title: '请选择',
            min: minDate,
            max: new Date(),
            value: new Date(),
            onSelect: this.selectHandle,
            onCancel: this.cancelHandle
          })
        }
        this.datePicker.show()
      },
      selectHandle(date) {
        this.inquireData.timeDate = formatDate(date, 'yyyy-MM-dd')
      },
      cancelHandle() {
      },
      subBtn() {
        const canSubmit = this.inquireData.moneys && ~~this.inquireData.moneys ? this.choiceImg.localId ? '通过' : '请选择要上传的图片！' : '请填写小票金额！'
        if (canSubmit === '通过') {
          // 先上传图片id返回图片路径后再提交
          wx.uploadImage({
            localId: this.choiceImg.localId, // 需要上传的图片的本地ID，由chooseImage接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: (res) => {
              const serverId = res.serverId // 返回图片的服务器端ID
              // 请求
              this._openToast('提交中')
              const subData = {
                num: this.inquireData.oddNum,
                money: this.inquireData.moneys,
                imgUrl: serverId,
                storeId: this.shopId,
                time: this.inquireData.timeDate
              }
              servicePtoSub(subData).then(subRes => {
                this._closeToast()
                this._openAlert('提交成功！', {
                  onConfirm: () => {
                    this.$router.back()
                  }
                })
              }).catch(err => {
                this._closeToast()
                this._openAlert(err.message)
              })
//              upImgFile(serverId).then(res => {
//                // 得到返回路径
//
//              }).catch(imgErr => {
//                this._closeToast()
//                this._openToast(imgErr.errmsg)
//              })
            }
          })
        } else {
          this._openAlert(canSubmit)
        }
      }
    },
    components: {
      Page
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @require '~common/stylus/mixin'
  @require '~common/stylus/variables'
  .service-photo-ul
    padding: 20px
    font-size: $fontsize-large
    .service-photo-li
      padding-bottom: 14px
      display: flex
      align-items : center
      .inputName
        width: 100px
        min-width: 100px
        text-align : center
      .inputValue
        flex: 1
        border-bottom-1px()
        position : relative
        padding: 10px 0 10px 10px
        input
          width: 100%
          line-height: 1.6
          overflow : hidden
        .cubeLoad
          position : absolute
          right: 0
          top: 50%
          font-size: 22px
          margin-top: -11px
        .store-select
          position: absolute
          z-index: 3
          background: #fff
          overflow-y: auto
          width:100%
          li
            border-bottom-1px()
            padding: 12px
      .selectValue
        flex: 1
        color: #333
        .selectValueDate
          display: flex
          padding: 10px
          .sTime
            flex: 1
      .imgChoiseArea
        flex: 1
        padding: 0 10px
        .imgChoiseBox
          width: 100%
          max-width : 198px
          .imgShowBox
            min-height: 100px
            position : relative
            .imgLocation
              width: 100%
              height: auto
              display: block
          .noneImg::after
            content: ' + '
            line-height : 100px
            color: #999
            position: absolute
            left: 0
            top: 50%
            margin-top: -50px
            width: 100px
            height: 100px
            text-align : center
            border: 1px dashed #999
            border-radius : 8px
            font-size: 34px
  .subArea
    padding: 12px 0 40px 0
    .subBtn
      font-size: 20px
      border: 1px solid $color-orange
      letter-spacing :3px
      color: #333
      border-radius : 22px
      width: 100px
      margin: 0 auto
      line-height: 44px
      text-align : center
</style>
