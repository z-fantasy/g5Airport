<template>
  <div class="brand-list-view">
    <list-view :listData="brandList" :showType="showType"/>
  </div>
</template>

<script type="text/ecmascript-6">
  import {fetchBrandList} from '../../api/brand'
  import {utilMixin} from '../../common/mixins/util'
  import {createBrandObj} from '../../common/models/Brand'
  import ListView from '../brand-salon-list-view/brand-salon-list-view'

  const COMPONENT_NAME = 'brand-list-view'
  export default {
    name: COMPONENT_NAME,
    mixins: [utilMixin],
    data() {
      return {
        brandList: [],
        showType: 'brand'
      }
    },
    created() {
      this._getListData()
    },
    methods: {
      _getListData() {
        this._openToast('加载中...', {mask: true})
        fetchBrandList().then(list => {
          this.brandList = []
          this._closeToast()
          if (list) {
            list.forEach(item => {
              this.brandList.push(createBrandObj(item))
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
