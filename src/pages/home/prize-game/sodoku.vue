<template>
  <page type="home" ref="page">
    <div ref="gameWrapper" class="turntable-game" :style="{height: height}">
      <div class="game-box" ref="gameBox">
        <sudoku-lottery></sudoku-lottery>
      </div>
      <game-dialog ref="gameDialog" @close="onDialogClose"/>
      <game-rule-dialog ref="gameRuleDia"/>
    </div>
  </page>
</template>

<script type="text/ecmascript-6">
  import Page from '../../../components/page/page'
  import {utilMixin} from '../../../common/mixins/util'
  import {userMixin} from '../../../common/mixins/user'
  import {fetchEnabledGame, fetchGameInfo, fetchValidLotteryCount, playGame} from '../../../api/prize'
  import {getchUserBouns} from '../../../api/common'
  import {GameInfo, PrizeItem} from '../../../common/models/Game'
  import SudokuLottery from '../../../components/sudoku-lottery/sudoku-lottery.vue'
  import GameDialog from '../../../components/game-dialog/game-dialog'
  import GameRuleDialog from '../../../components/game-rule-dialog/game-rule-dialog'
  export default {
    name: 'prize-game',
    data() {
      return {
        height: `${document.body.clientHeight}px`
      }
    },
    methods: {
      onDialogClose() {
      }
    },
    components: {
      Page,
      GameDialog,
      GameRuleDialog,
      SudokuLottery
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .game-box
    height: 100%
</style>
