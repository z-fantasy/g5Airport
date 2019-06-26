<template>
  <div class="select-tags">
    <div class="weui-cells__title title">
      <span>{{label}}</span>
      <span>{{limitTips}}</span>
    </div>
    <div class="weui-cells weui-cells_checkbox">
      <label class="weui-cell weui-check__label role-item" :for="item.name" v-for="item in tags" :class="{'checked':retRoles.includes(item.id)}">
        <div class="weui-cell__hd">
          <input type="checkbox" class="weui-check" :id="item.name" :value="item.id" v-model="selectedRoles">
          <i class="weui-icon-checked"></i>
        </div>
        <div class="weui-cell__bd">
          <p>{{item.text}}</p>
        </div>
      </label>
    </div>
  </div>
</template>

<script>
  import {utilMixin} from '../../common/mixins/util'

  const COMPONENT_NAME = 'select-tags'

  const EVENT_SELECT = 'select'

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
    name: COMPONENT_NAME,
    mixins: [utilMixin],
    props: {
      label: {
        type: String,
        default: messages.common.txt_label_style_tag
      },
      tags: {
        type: Array,
        default() {
          return TAGS
        }
      },
      selected: {
        type: Array,
        default() {
          return []
        }
      },
      min: {
        type: Number,
        default: 1
      },
      max: {
        type: Number,
        default: 4
      }
    },
    data() {
      return {
        selectedRoles: this.selected.length ? this.selected : [this.tags[0].id]
      }
    },
    mounted() {
      this.$emit(EVENT_SELECT, this.selectedRoles.join(','))
    },
    computed: {
      retRoles() {
        return this.selectedRoles.join(',')
      },
      limitTips() {
        return `(请选择${this.min}-${this.max}项)`
      }
    },
    watch: {
      selectedRoles(newVal) {
        if (!newVal.length) {
          this._openToast(`选择角色不能少于${this.min}个`, {
            type: 'warn',
            time: 1500,
            mask: true
          })
          this.selectedRoles.push(this.tags[0].id)
        }
        if (newVal.length > 4) {
          this.selectedRoles.pop()
          this._openToast(`选择角色不能超过${this.max}个`, {
            type: 'warn',
            time: 1500,
            mask: true
          })
        }
        this.$emit(EVENT_SELECT, newVal.join(','))
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @require '~common/stylus/variables.styl'

  .select-tags
    .title
      font-size:0
      margin-bottom:5px
      > span
        font-size:$fontsize-large
    background-color: transparent
    .weui-cells__title
      margin-top:0
      margin-bottom: .3em
      padding-left: 15px
      padding-right: 15px
      color: $color-purple
      font-size: 16px
    .weui-cells_checkbox
      margin:0
      padding: 10px 15px
      background-color: transparent
      line-height: 1.47058824
      font-size: 17px
      overflow: hidden
      position: relative
      .role-item
        float: left
        margin: 5px 2%
        padding: 8px 0
        width: 29%
        font-size: 12px
        background-color: $color-light-grey-ss
        color: $color-grey
        text-align: center
        border-radius: 15px
        &:before
          border-top: none
        &.checked
          background-color: $color-rose-red
          color: $color-white
        .weui-cell__hd
          padding-right: 0.35em
          display: none
        .weui-check
          position: absolute
          left: -9999em
          pointer-events:none
</style>
