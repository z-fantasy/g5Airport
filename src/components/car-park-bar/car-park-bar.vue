<template>
  <div class="car-park-bar">
    <ul>
      <router-link tag="li" :to="{name: item.name}" class="flex-center" v-for="(item, index) in routerData" v-bind:key="index" :class="{active: item.active}">
        <div>
          {{item.title}}
        </div>
      </router-link>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'carParkBar',
    data() {
      return {
        routerData: [
          {
            title: '停车缴费',
            name: 'car-park',
            path: '/car-park',
            active: true
          },
          {
            title: '缴费记录',
            name: 'car-payment-record',
            path: '/car-payment-record',
            active: false
          },
          {
            title: '我的车辆',
            name: 'car-mine-manage',
            path: '/car-mine-manage',
            active: false
          }
        ]
      }
    },
    created() {
      this.routerData.forEach((item) => {
        if (this.$route.name === item.name) {
          item.active = true
        } else {
          item.active = false
        }
      })
    },
    watch: {
      $route(n) {
        this.routerData.forEach((item) => {
          if (n.name === item.name) {
            item.active = true
          } else {
            item.active = false
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~common/stylus/variables.styl"
  .car-park-bar
    height: 50px
    background: #f7f3f7
    position: fixed
    right: 0
    bottom: 0
    width: 100%
    z-index: 10
    ul
      height: 100%
      width: 100%
      display: flex
      li
        flex: 1
        color: #666
        height: 100%
        display: flex
        justify-content : center
        align-items : center
        font-size: $fontsize-large-xx
      .active
        background: $color-weight-orange
        color: #fff
</style>
