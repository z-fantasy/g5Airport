<template>
  <div class="salon-list-view">
    <!--<div class="top-rainbow"></div>-->
    <list-view :listData="salonList" :detailUrl="'salon-detail'"/>
  </div>
</template>

<script>
  import {fetchSalonList} from '../../api/salon'
  import {utilMixin} from '../../common/mixins/util'
  import {createSalonObj} from '../../common/models/Salon'
  import ListView from '../brand-salon-list-view/brand-salon-list-view'

  const COMPONENT_NAME = 'brand-list-view'
  export default {
    name: COMPONENT_NAME,
    mixins: [utilMixin],
    data() {
      return {
        salonList: []
      }
    },
    created() {
      this._getListData()
    },
    methods: {
      _getListData() {
        this._openToast('加载中...', {mask: true})
        fetchSalonList().then(list => {
          this.salonList = []
          this._closeToast()
          if (list) {
            list.forEach(item => {
              this.salonList.push(createSalonObj(item))
            })
          }
        }).catch(err => this._errorCatchHandler(err))
      }
    },
    components: {
      ListView
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
