<template>
  <page type="edit-info" title="账户信息">
    <!--<div class="top-rainbow"></div>-->
    <div class="toolbar">
      <div class="icon icon-edit" v-if="!editState" @click="editState=true"></div>
      <div class="btn btn-cancel" v-if="editState" @click="editState=false">
        <span>取消修改</span>
      </div>
    </div>
    <div class="edit-panel">
      <div class="panel display-panel" v-if="!editState">
        <ul>
          <li class="option-item">
            <div class="item-inner">
              <div class="title">卡号</div>
              <div class="item-content">
                <span>{{userInfo.cardNo}}</span>
              </div>
            </div>
          </li>
          <li class="option-item">
            <div class="item-inner">
              <div class="title">姓名</div>
              <div class="item-content">
                <span>{{userInfo.name}}</span>
              </div>
            </div>
          </li>
          <li class="option-item">
            <div class="item-inner">
              <div class="title">性别</div>
              <div class="item-content">
                <span>{{userInfo.sex === 'M' ? '男' : userInfo.sex === 'F' ? '女' : '未知'}}</span>
              </div>
            </div>
          </li>
          <li class="option-item">
            <div class="item-inner">
              <div class="title">生日</div>
              <div class="item-content">
                <span>{{userInfo.birthday ? userInfo.birthday : '暂无填写'}}</span>
              </div>
            </div>
          </li>
          <li class="option-item">
            <div class="item-inner">
              <div class="title">手机号</div>
              <div class="item-content">
                <span>{{userInfo.mobile}}</span>
              </div>
            </div>
          </li>
          <li class="option-item">
            <div class="item-inner">
              <div class="title">车牌号</div>
              <div class="item-content">
                <span>{{userInfo.carNo ? userInfo.carNo : '暂无填写'}}</span>
              </div>
            </div>
          </li>
          <li class="option-item">
            <div class="item-inner tages-item">
              <div class="title">我是</div>
              <div class="tags item-content" v-if="userInfo.selectTags.length">
                <span v-for="tag in userTags">
                  {{tag.text}}
                </span>
              </div>
              <div class="item-content" v-else>
                <span>暂无个性标签</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="panel edit-panel" v-else>
        <verify-input type="text"
                      key="1"
                      ref="verifyNameInput"
                      :label="'姓名'"
                      :labelColor="inputLabelColor"
                      :placeholder="'请输入姓名'"
                      :maxlength="16"
                      minlength="2"
                      v-model="validateResult[0]"/>
        <verify-input type="number"
                      key="5"
                      ref="verifyCarNoPhone"
                      :label="'手机号'"
                      :labelColor="inputLabelColor"
                      :placeholder="'请输入手机号'"
                      :rules="{pattern: regexPhone}"
                      v-model="validateResult[4]"/>
        <!--,required: true-->
        <div class="" @click.stop.prevent="selectAddress">
          <verify-input type="text"
                        key="3"
                        :label="'地址'"
                        :labelColor="inputLabelColor"
                        :placeholder="'请选择地址'"
                        :readonly="true"
                        v-model="validateResult[2]"/>
        </div>
        <verify-input type="text"
                      key="4"
                      :label="'详细地址'"
                      :labelColor="inputLabelColor"
                      :placeholder="'请输入详细地址'"
                      v-model="validateResult[3]"/>
        <verify-input type="text"
                      key="2"
                      ref="verifyCarNoInput"
                      :label="'车牌号'"
                      :labelColor="inputLabelColor"
                      :placeholder="'请输入车牌号'"
                      :rules="{pattern: regexCarNo}"
                      :messages="{
                        pattern: '车牌号格式应为格式:川A00000'
                      }"
                      v-model="validateResult[1]"/>
        <div class="btn-area">
          <base-button class="btn-update" @click="updateBasicInfo">确认修改</base-button>
        </div>
      </div>
      <div class="service-phone">
        <!--<p class="phone-wrapper">-->
          <!--客服热线：<a class="phone" :href="`tel:${messages.common.txt_service_phone}`">{{messages.common.txt_service_phone}}</a>-->
        <!--</p>-->
      </div>
    </div>
  </page>
</template>

<script>
  import Page from '../../../../components/page/page'
  import VerifyInput from '../../../../base/verify-input/verify-input'
  import SelectTags from '../../../../components/select-tags/select-tags'
  import BaseButton from '../../../../base/base-button/base-button'
  import {utilMixin} from '../../../../common/mixins/util'
  import {userMixin} from '../../../../common/mixins/user'
  import {MAIN_COLOR, REGEX_CAR_NO, REGEX_NORMAL_PHONE} from '../../../../common/config'
  import {updateUserInfo} from '../../../../api/user'
  import {fetchAllAddress} from '../../../../api/common'
  import {getAreaData, showAddressFormat} from '../../../../common/utils'
  import {mapGetters} from 'vuex'

  const PAGE_NAME = 'edit-info'

  const TAGS = [
    {
      text: messages.common.txt_tag_pet,
      name: 'pet',
      id: 1
    },
    {
      text: messages.common.txt_tag_fashion,
      name: 'fashion',
      id: 2
    },
    {
      text: messages.common.txt_tag_food,
      name: 'delicacy',
      id: 3
    },
    {
      text: messages.common.txt_tag_art,
      name: 'arts',
      id: 4
    },
    {
      text: messages.common.txt_tag_cool,
      name: 'cool',
      id: 5
    },
    {
      text: messages.common.txt_tag_sport,
      name: 'sport',
      id: 6
    }
  ]

  export default {
    name: PAGE_NAME,
    mixins: [utilMixin, userMixin],
    data() {
      return {
        editState: false,
        provinceId: '',
        cityId: '',
        areaId: '',
        province: '',
        city: '',
        area: '',
        addressArray: '',
        validateResult: ['', '', '', '', '', '']
      }
    },
    computed: {
      userTags() {
        let selectedTags = []
        if (this.userInfo) {
          this.userInfo.selectTags.forEach((tagId) => {
            const selectedTag = TAGS.find((tag) => {
              return tag.id === parseInt(tagId)
            })
            selectedTags.push(selectedTag)
          })
        }
        return selectedTags
      },
      ...mapGetters([
        'userInfo'
      ])
    },
    created() {
      this.inputLabelColor = MAIN_COLOR
      this.regexCarNo = REGEX_CAR_NO
      this.regexPhone = REGEX_NORMAL_PHONE
      this.initEditData()
      this._initAddressPicker()
      if (this.userInfo.provinceText && this.userInfo.cityText && this.userInfo.areaText) {
        this.validateResult.splice(2, 1, showAddressFormat(this.userInfo.provinceText, this.userInfo.cityText, this.userInfo.areaText))
      }
    },
    methods: {
      updateBasicInfo() {
        let checkBirthday = this.$refs.verifyNameInput.validate()
        let checkPwd = this.$refs.verifyCarNoInput.validate()
        let checkPhone = this.$refs.verifyCarNoPhone.validate()
        let checkVLi = []
        if (this.validateResult[1]) {
          checkVLi.push(checkPwd)
        }
        if (this.validateResult[4]) {
          checkVLi.push(checkPhone)
        }
        Promise.all(checkVLi).then(rs => {
          if (!rs.every(item => item)) {
            this._openAlert(messages.common.txt_invalid_input)
            return
          }
          this._openToast(messages.common.txt_submit, {mask: true})
          let [name, carNo] = this.validateResult
          if (this.provinceId) {
            this.addressArray = `${this.provinceId},${this.cityId},${this.areaId},${this.validateResult[3]}`
          }
          updateUserInfo(name, carNo, this.province, this.city, this.area, this.addressArray, this.validateResult[4]).then(flag => {
            this._closeToast()
            if (flag) {
              this._openAlert('修改成功', {
                onConfirm: () => {
                  this.editState = false
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
      },
      initEditData() {
        this.validateResult.splice(0, 1, this.userInfo.name)
        this.userInfo.carNo && this.validateResult.splice(1, 1, this.userInfo.carNo)
      },
      selectAddress() {
        this.addressPicker.show()
      },
      _initAddressPicker() {
        this._openToast(messages.common.txt_load_address, {mask: true})
        fetchAllAddress().then(res => {
          this._closeToast()
          if (!this.addressPicker) {
            let oldAddressIdList = this.messages.register.default_address_id
            if (this.userInfo.addressInfo) {
              let addressArray = this.userInfo.addressInfo.split(',')
              if (addressArray[0] && addressArray[1] && addressArray[2]) {
                oldAddressIdList = []
                oldAddressIdList.push(addressArray[0], addressArray[1], addressArray[2])
              }
              this.validateResult.splice(3, 1, addressArray[3])
            }

            const addressDataInfo = getAreaData(res, oldAddressIdList)
            this.addressPicker = this.$createCascadePicker({
              title: messages.common.txt_address_picker_title,
              data: addressDataInfo.addressData,
              selectedIndex: addressDataInfo.selectedIndex,
              onSelect: (selectedVal, selectedIndex, selectedText) => {
                console.log(selectedVal)
                this.validateResult.splice(2, 1, showAddressFormat(selectedText[0], selectedText[1], selectedText[2]))
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
      }
    },
    components: {
      Page,
      VerifyInput,
      SelectTags,
      BaseButton
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @require '~common/stylus/variables'
  @require '~common/stylus/mixin'

  .edit-info-page
    .toolbar
      display:flex
      justify-content:flex-end
      padding:10px 15px
      // border-bottom-1px(#666)
      .icon-edit
        width:24px
        height:24px
        bg-image-props()
        bg-image('./edit_info')
      .btn
        height:24px
        line-height:24px
        font-size:16px
        &:not(:last-of-type)
         margin-right:15px
        &.btn-cancel
          color:$color-purple
    .edit-panel
      padding-top: 10px
      .btn-area
        margin:20px 15px 0
      .display-panel
        ul
          .option-item
            font-size:16px
            padding:20px 0px
            margin: 0 30px
            box-sizing:border-box
            color:$color-title-gray
            background-size:100% auto
            background-repeat:no-repeat
            background-position: left bottom
            border-bottom-1px()
            /*background-image: url('./linear_gradient_row.jpg')*/
            .item-inner
              display:flex
              justify-content : space-between
              .title
                width:70px
              .item-content
                margin-left:10px
                &.tags
                  span
                    display:inline-block
                    margin-bottom:5px
                    /*background-color: #E94369*/
                    color: $color-weight-orange
                    padding:5px
                    border-radius:10px
                    font-size:14px
                    border: 1px solid $color-weight-orange
                    // box-shadow:1px 1px 4px rgba(0,0,0,.75)
                    &:not(:last-of-type)
                      margin-right:5px
            .tages-item
              justify-content: flex-start
    .service-phone
      margin-top:30px
      .phone-wrapper
        text-align:center
        font-size:16px
        color:$color-title-gray
        .phone
          text-decoration:underline
</style>
