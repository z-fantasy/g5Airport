<template>
  <div class="brand-detail-view">
    <detail-content :detailInfo="detailInfo" :type="'brand'"/>
  </div>
</template>

<script type="text/ecmascript-6">
  import {fetchBrandDetail} from '../../api/brand'
  import {createBrandObj} from '../../common/models/Brand'
  import DetailContent from '../detail-content/detail-content'
  import {utilMixin} from '../../common/mixins/util'

  const COMPONENT_NAME = 'brand-detail'
  export default {
    name: COMPONENT_NAME,
    mixins: [utilMixin],
    data() {
      return {
        detailInfo: {}
      }
    },
    activated() {
      let brandId = this.$route.params.id
      if (brandId) {
        this._getBrandInfo(brandId)
      } else {
        this.$router.back()
      }
    },
    methods: {
      _getBrandInfo(id) {
        this._openToast('信息加载中...', {mask: true})
        fetchBrandDetail(id).then(brand => {
          this._closeToast()
          this.detailInfo = createBrandObj(brand)
        }).catch(err => this._errorCatchHandler(err))
      }
    },
    components: {
      DetailContent
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
