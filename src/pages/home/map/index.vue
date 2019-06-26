<template>
  <page type="map-navigate" title="地图导航" :initScroll="false">
    <div class="map-container" ref="mapContainer"></div>
  </page>
</template>

<script>
  import Page from '../../../components/page/page'

  const PAGE_NAME = 'map-navigate'

  // 104.06426,30.588943 测试使用坐标
  // 104.064215,30.58904 五号停车坪购物广场购物中心

  const METHOD_CAR = 0
  const METHOD_BUS = 1
  const METHOD_WALK = 2
  const METHOD_RIDE = 3

  const UFUN_LON = 104.064215
  const UFUN_LAT = 30.58904

  export default {
    name: PAGE_NAME,
    created() {
      this.way = this.$route.query.way
      this.lon = this.$route.query.lon
      this.lat = this.$route.query.lat
    },
    mounted() {
      setTimeout(() => {
        this.initMap()
      }, 100)
    },
    methods: {
      initMap() {
        if (!this.map) {
          this.map = new BMap.Map(this.$refs.mapContainer)
          this.start = new BMap.Point(this.lon, this.lat)
          this.map.centerAndZoom(this.start, 14)
          this.end = new BMap.Point(UFUN_LON, UFUN_LAT)
          this.renderOptions = {
            map: this.map,
            autoViewport: true
          }
          if (this.way === METHOD_RIDE) this.useRidingWay()
          if (this.way === METHOD_CAR) this.useCarWay()
          if (this.way === METHOD_BUS) this.useBusWay()
          if (this.way === METHOD_WALK) this.useWalkWay()
        }
      },
      useRidingWay() {
        let riding = new BMap.RidingRoute(this.map, {
          renderOptions: this.renderOptions
        })
        riding.search(this.start, this.end)
      },
      useCarWay() {
        let driving = new BMap.DrivingRoute(this.map, {
          renderOptions: this.renderOptions
        })
        driving.search(this.start, this.end)
      },
      useBusWay() {
        let bus = new BMap.TransitRoute(this.map, {
          renderOptions: this.renderOptions,
          intercityPolicy: BMAP_INTERCITY_POLICY_EARLY_START,
          transitTypePolicy: BMAP_TRANSIT_TYPE_POLICY_AIRPLANE
        })
        bus.search(this.start, this.end)
      },
      useWalkWay() {
        console.log('---')
        let walking = new BMap.WalkingRoute(this.map, {
          renderOptions: this.renderOptions
        })
        walking.search(this.start, this.end)
      }
    },
    components: {
      Page
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .map-navigate-page
    .map-container
      position:relative
      height:100%
      overflow:hidden
</style>
