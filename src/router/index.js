import Vue from 'vue'
import Router from 'vue-router'

// const Login = () => import('../pages/login')
import Login from '../pages/login'
// const Register = () => import('../pages/register')
import Register from '../pages/register'
// const Home = () => import('../pages/home')
import Home from '../pages/home'
const CouponList = () => import('../pages/coupon-list')
// import CouponList from '../pages/coupon-list'
const ScoreList = () => import('../pages/score-list')
// import ScoreList from '../pages/score-list'

// 我的信息
const MyInfo = () => import('../pages/home/my-info')
// import MyInfo from '../pages/home/my-info'
const EditInfo = () => import('../pages/home/my-info/edit-info')
// import EditInfo from '../pages/home/my-info/edit-info'
const MyInviteCode = () => import('../pages/home/my-info/my-invite-code')
// import MyInviteCode from '../pages/home/my-info/my-invite-code'

// 我的预约
const MyOrders = () => import('../pages/home/my-info/my-orders')
// import MyOrders from '../pages/home/my-info/my-orders'
const MyOrdersDetail = () => import('../pages/home/my-info/my-orders/my-orders-detail')
// import ordersDetail from '../pages/home/my-info/my-orders/my-orders-detail'
const MyScores = () => import('../pages/home/my-info/my-scores')
// import MyScores from '../pages/home/my-info/my-scores'
const SetPassword = () => import('../pages/home/my-info/set-password')
// import SetPassword from '../pages/home/my-info/set-password'

// 我的券包
const MyCoupons = () => import('../pages/home/my-info/my-coupons')
// import MyCoupons from '../pages/home/my-info/my-coupons'
const MyCouponDetail = () => import('../pages/home/my-info/my-coupons/my-coupon-detail')
// import MyCouponDetail from '../pages/home/my-info/my-coupons/my-coupon-detail'

// 品牌折扣
const BrandDiscount = () => import('../pages/home/brand-discount')
// import BrandDiscount from '../pages/home/brand-discount'
const DiscountDetail = () => import('../pages/home/brand-discount/discount-detail')
// import DiscountDetail from '../pages/home/brand-discount/discount-detail'

// 积分兑礼
const ScoreExchange = () => import('../pages/home/score-exchange')
// import ScoreExchange from '../pages/home/score-exchange'
const ExchangeDetail = () => import('../pages/home/score-exchange/exchange-detail')
// import ExchangeDetail from '../pages/home/score-exchange/exchange-detail'
// 积分兑礼（从积分记录进入）
const ScoresToExchange = () => import('../pages/home/my-info/my-scores/score-exchange')
// import ScoresToExchange from '../pages/home/my-info/my-scores/score-exchange'
const ExchangeToDetail = () => import('../pages/home/my-info/my-scores/score-exchange/exchange-detail')
// import ExchangeToDetail from '../pages/home/my-info/my-scores/score-exchange/exchange-detail'

// 每日签到
const SigninDaily = () => import('../pages/home/signin-daily')
const CenterSigninDaily = () => import('../pages/home/my-info/signin-daily')
// import SigninDaily from '../pages/home/signin-daily'

// VIP权益
const VIPRights = () => import('../pages/home/vip-rights')
// import VIPRights from '../pages/home/vip-rights'

// 地图导航
const Map = () => import('../pages/home/map')
// import Map from '../pages/home/map'

// 活动荟萃
const ActivityBlends = () => import('../pages/home/activity-blends')
// import ActivityBlends from '../pages/home/activity-blends'
const ActivityDetail = () => import('../pages/home/activity-blends/activity-detail')
// import ActivityDetail from '../pages/home/activity-blends/activity-detail'

// 特邀沙龙
const VIPSalons = () => import('../pages/home/vip-salons')
// import VIPSalons from '../pages/home/vip-salons'
const SalonDetail = () => import('../pages/home/vip-salons/salon-detail')
// import SalonDetail from '../pages/home/vip-salons/salon-detail'
const SalonOrder = () => import('../pages/home/vip-salons/salon-detail/salon-order')
// import SalonOrder from '../pages/home/vip-salons/salon-detail/salon-order'

// 自助积分
const ServiceScores = () => import('../pages/home/service-scores')
const ServicePhoto = () => import('../pages/home/service-scores/service-photo')
// import ServiceScores from '../pages/home/service-scores'
// 首页自助积分
const ScoreRecords = () => import('../pages/score-records')
// import ScoreRecords from '../pages/score-records'

// 游戏抽奖
const PrizeGame = () => import('../pages/home/prize-game') // import('../pages/home/prize-game/sodoku') // import('../pages/home/prize-game')

// 停车优惠
const CarPark = () => import('../pages/home/car-park')
const CarHome = () => import('../pages/home/car-park/car-home.vue')
const CarMineManage = () => import('../pages/home/car-park/car-mine-manage.vue')
const CarPaymentRecord = () => import('../pages/home/car-park/car-payment-record.vue')
const CarPaymentDetail = () => import('../pages/home/car-park/car-payment-detail')
const CarParkResult = () => import('../pages/carParkResult/carParkResult')
// 404
const PageNotFound = () => import('../pages/page-not-found')
// import PageNotFound from '../pages/page-not-found'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: '首页',
        requireAuth: false
      },
      children: [
        {
          path: 'my-info',
          name: 'my-info',
          component: MyInfo,
          meta: {
            title: '我的信息',
            requireAuth: true
          },
          children: [
            {
              path: 'edit-info',
              name: 'edit-info',
              component: EditInfo,
              meta: {
                title: '账户信息',
                requireAuth: true
              }
            },
            {
              path: 'center-signin-daily',
              name: 'center-signin-daily',
              component: CenterSigninDaily,
              meta: {
                title: '每日签到',
                requireAuth: true
              }
            },
            {
              path: 'my-coupons',
              name: 'my-coupons',
              component: MyCoupons,
              meta: {
                title: '我的券包',
                requireAuth: true
              },
              children: [
                {
                  path: 'my-coupon-detail',
                  name: 'my-coupon-detail',
                  component: MyCouponDetail,
                  meta: {
                    title: '券包详情',
                    requireAuth: true
                  }
                }
              ]
            },
            {
              path: 'my-scores',
              name: 'my-scores',
              component: MyScores,
              meta: {
                title: '我的积分',
                requireAuth: true
              },
              children: [
                {
                  path: 'my-scores/scores-exchange',
                  name: 'scores-to-exchange',
                  component: ScoresToExchange,
                  meta: {
                    title: '积分兑礼',
                    requireAuth: true
                  },
                  children: [
                    {
                      path: 'my-scores/exchange-detail',
                      name: 'exchange-to-detail',
                      component: ExchangeToDetail,
                      meta: {
                        title: '礼券详情',
                        requireAuth: true
                      }
                    }
                  ]
                }
              ]
            },
            {
              path: 'my-orders',
              name: 'my-orders',
              component: MyOrders,
              meta: {
                title: '我的预约',
                requireAuth: true
              },
              children: [
                {
                  name: 'my-orders-detail',
                  path: 'my-orders-detail',
                  component: MyOrdersDetail,
                  meta: {
                    title: '活动详情',
                    requireAuth: true
                  }
                }
              ]
            },
            {
              path: 'set-password',
              name: 'set-password',
              component: SetPassword,
              meta: {
                title: '设置密码',
                requireAuth: true
              }
            },
            {
              path: 'my-invite-code',
              name: 'my-invite-code',
              component: MyInviteCode,
              meta: {
                title: '我的邀请码',
                requireAuth: true
              }
            }
          ]
        },
        {
          name: 'prize-game',
          path: 'prize-game',
          component: PrizeGame,
          meta: {
            title: '游戏抽奖',
            requireAuth: false
          }
        },
        {
          name: 'brand-discount',
          path: 'brand-discount',
          component: BrandDiscount,
          meta: {
            title: '品牌折扣',
            requireAuth: false
          },
          children: [
            {
              name: 'discount-detail',
              path: 'discount-detail',
              component: DiscountDetail,
              meta: {
                title: '折扣详情',
                requireAuth: false
              }
            }
          ]
        },
        {
          name: 'score-exchange',
          path: 'score-exchange',
          component: ScoreExchange,
          meta: {
            title: '积分兑礼',
            requireAuth: false
          },
          children: [
            {
              name: 'exchange-detail',
              path: 'exchange-detail',
              component: ExchangeDetail,
              meta: {
                title: '礼券详情',
                requireAuth: false
              }
            }
          ]
        },
        {
          name: 'activity-blends',
          path: 'activity-blends',
          component: ActivityBlends,
          meta: {
            title: '活动荟萃',
            requireAuth: true
          },
          children: [
            {
              name: 'activity-detail',
              path: 'activity-detail',
              component: ActivityDetail,
              meta: {
                title: '荟萃详情',
                requireAuth: true
              }
            }
          ]
        },
        {
          name: 'vip-salons',
          path: 'vip-salons',
          component: VIPSalons,
          meta: {
            title: '特邀沙龙',
            requireAuth: true
          },
          children: [
            {
              name: 'salon-detail',
              path: 'salon-detail',
              component: SalonDetail,
              meta: {
                title: '沙龙详情',
                requireAuth: true
              },
              children: [
                {
                  name: 'salon-order',
                  path: 'salon-order',
                  component: SalonOrder,
                  meta: {
                    title: '活动预约',
                    requireAuth: true
                  }
                }
              ]
            }
          ]
        },
        {
          name: 'signin-daily',
          path: 'signin-daily',
          component: SigninDaily,
          meta: {
            title: '每日签到',
            requireAuth: true
          }
        },
        {
          name: 'vip-rights',
          path: 'vip-rights',
          component: VIPRights,
          meta: {
            title: 'VIP权益',
            requireAuth: false
          }
        },
        {
          name: 'service-scores',
          path: 'service-scores',
          component: ServiceScores,
          // component: PageNotFound,
          meta: {
            title: '自助积分',
            requireAuth: true
          },
          children: [
            {
              name: 'service-photo',
              path: 'service-photo',
              component: ServicePhoto,
              meta: {
                title: '拍照积分',
                requireAuth: true
              }
            }
          ]
        },
        {
          name: 'map-navigate',
          path: 'map',
          component: Map,
          meta: {
            title: '地图导航',
            requireAuth: true
          }
        }
      ]
    },
    {
      name: 'register',
      path: '/register',
      component: Register,
      meta: {
        title: '注册',
        requireAuth: false
      }
    },
    {
      name: 'login',
      path: '/login',
      component: Login,
      meta: {
        title: '登录',
        requireAuth: false
      }
    },
    {
      name: 'score-records',
      path: '/score-records',
      component: ScoreRecords
    },
    {
      name: 'coupon-list',
      path: '/coupon-list',
      component: CouponList,
      meta: {
        title: '我的券包',
        requireAuth: true
      }
    },
    {
      name: 'score-list',
      path: '/score-list',
      component: ScoreList,
      meta: {
        title: '我的积分',
        requireAuth: true
      }
    },
    {
      name: 'car-park',
      path: '/car-park',
      component: CarPark,
      meta: {
        title: '停车优惠',
        requireAuth: true
      }
    },
    {
      name: 'car-payment-record',
      path: '/car-Payment-record',
      component: CarPaymentRecord,
      meta: {
        title: '缴费记录',
        requireAuth: true
      }
    },
    {
      name: 'car-park-result',
      path: '/car-park-result',
      component: CarParkResult,
      meta: {
        title: '缴费结果'
      }
    },
    {
      name: 'car-payment',
      path: '/car-payment',
      component: CarPaymentDetail,
      meta: {
        title: '停车缴费'
      }
    },
    {
      name: 'car-mine-manage',
      path: '/car-mine-manage',
      component: CarMineManage,
      meta: {
        title: '车辆管理',
        requireAuth: true
      }
    },
    {
      name: 'page-not-found',
      path: '*',
      component: PageNotFound,
      meta: {
        title: '首页',
        requireAuth: false
      }
    }
  ]
})
