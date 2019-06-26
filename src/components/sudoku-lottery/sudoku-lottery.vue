<template>
  <div class="sudoku-lottery">
    <div class="lotteryArea">
      <div class="lotteryBox">
        <ul ref="turntable">
          <li class="lottery-gift-play">
            <div>立即抽奖</div>
          </li>
          <li class="lottery-gift-item" v-for="(item, index) in gifts" v-bind:key="index" :style="getAbsLoca(index)">
            {{item}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import SodokuItem from './sodoku-item.vue'

  export default {
    name: 'sudoku-lottery',
    data() {
      return {
        gifts: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      }
    },
    methods: {
      getAbsLoca(index) {
        console.log(this.$refs.turntable)
        let itemSize = this.$refs.turntable.offsetWidth / 4
        let left = 0
        let top = 0
        switch (index) {
          case 1:
            left = index * itemSize
            break
          case 2:
            left = index * itemSize
            break
          case 3:
            left = index * itemSize
            break
          case 4:
            left = 3 * itemSize
            top = itemSize
            break
          case 5:
            left = 3 * itemSize
            top = 2 * itemSize
            break
          case 6:
            left = 3 * itemSize
            top = 3 * itemSize
            break
          case 7:
            left = 2 * itemSize
            top = 3 * itemSize
            break
          case 8:
            left = itemSize
            top = 3 * itemSize
            break
          case 9:
            top = 3 * itemSize
            break
          case 10:
            top = 2 * itemSize
            break
          case 11:
            top = itemSize
        }
        return {
          left: `${left}px`,
          top: `${top}px`
        }
      }
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .sudoku-lottery
    height: 100%
    display: flex
    justify-content: center
    align-items: center
    .lotteryArea
      margin: 0 auto
      border: 3px solid red
      .lotteryBox
        width: 280px
        ul
          width: 100%
          height: 280px
          position: relative
          .lottery-gift-play
            width: 140px
            height: 140px
            position: absolute
            top: 50%
            left: 50%
            margin-left: -70px
            margin-top: -70px
          .lottery-gift-item
            position: absolute
            height: 70px
            width: 70px
            border: 1px solid red
            box-sizing: border-box
</style>
