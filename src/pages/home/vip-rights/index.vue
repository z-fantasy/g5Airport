<template>
  <page type="vip-rights" title="VIP权益" class="rights-page">
    <section class="rights-section">
      <div v-html="rightTxt"></div>
      <!--<div class="rightsClaify">-->
        <!--<h3>-->
          <!--会员申办条件-->
        <!--</h3>-->
        <!--<ul>-->
          <!--<li>-->
            <!--<div class="rightItem">-->
              <!--<span>1</span>-->
            <!--</div>-->
            <!--<div class="rightTxt">-->
              <!--<div>-->
                <!--<p>微信线上注册:顾客关注G5官方微信，点击会员中心填写个人信息，一键进行注册，即可成为G5 VIP会员 。</p>-->
              <!--</div>-->
            <!--</div>-->
          <!--</li>-->
        <!--</ul>-->
      <!--</div>-->
      <!--<div class="rightsClaify">-->
        <!--<h3>-->
          <!--会员权益-->
        <!--</h3>-->
        <!--<ul>-->
          <!--<li>-->
            <!--<div class="rightItem">-->
              <!--<span>1</span>-->
            <!--</div>-->
            <!--<div class="rightTxt">-->
              <!--<div>-->
                <!--<p>会员消费积分，活动积分，签到积分。</p>-->
              <!--</div>-->
            <!--</div>-->
          <!--</li>-->
          <!--<li>-->
            <!--<div class="rightItem">-->
              <!--<span>2</span>-->
            <!--</div>-->
            <!--<div class="rightTxt">-->
              <!--<div>-->
                <!--<p>参加会员活动、文化沙龙等。</p>-->
              <!--</div>-->
            <!--</div>-->
          <!--</li>-->
          <!--<li>-->
            <!--<div class="rightItem">-->
              <!--<span>3</span>-->
            <!--</div>-->
            <!--<div class="rightTxt">-->
              <!--<div>-->
                <!--<p>定期发送活动信息，品牌优惠信息。</p>-->
              <!--</div>-->
            <!--</div>-->
          <!--</li>-->
          <!--<li>-->
            <!--<div class="rightItem">-->
              <!--<span>4</span>-->
            <!--</div>-->
            <!--<div class="rightTxt">-->
              <!--<div>-->
                <!--<p>优先邀请参与店庆等商业活动。</p>-->
              <!--</div>-->
            <!--</div>-->
          <!--</li>-->
          <!--<li>-->
            <!--<div class="rightItem">-->
              <!--<span>5</span>-->
            <!--</div>-->
            <!--<div class="rightTxt">-->
              <!--<div>-->
                <!--<p>享受会员指定优惠折扣及福利。</p>-->
              <!--</div>-->
            <!--</div>-->
          <!--</li>-->
        <!--</ul>-->
      <!--</div>-->
      <!--<div class="rightsClaify">-->
        <!--<h3>-->
          <!--VIP积分规则-->
        <!--</h3>-->
        <!--<ul>-->
          <!--<li>-->
            <!--<div class="rightItem">-->
              <!--<span>1</span>-->
            <!--</div>-->
            <!--<div class="rightTxt">-->
              <!--<div>-->
                <!--<p>店内积分：于指定品牌店铺消费后，出示本人微信VIP会员卡二维码或本人注册所使用的手机号码，可自动积分。</p>-->
              <!--</div>-->
            <!--</div>-->
          <!--</li>-->
          <!--<li>-->
            <!--<div class="rightItem">-->
              <!--<span>2</span>-->
            <!--</div>-->
            <!--<div class="rightTxt">-->
              <!--<div>-->
                <!--<p>扫码积分：使用G5微信VIP会员卡“自助积分”按钮，按提示扫描7天内购物消费的电脑小票维码，获取积分，逾期作废。</p>-->
              <!--</div>-->
            <!--</div>-->
          <!--</li>-->
          <!--<li>-->
            <!--<div class="rightItem">-->
              <!--<span>3</span>-->
            <!--</div>-->
            <!--<div class="rightTxt">-->
              <!--<div>-->
                <!--<p>服务台积分：持卡人需7天内携带购物消费电脑小票正本至服务台登记获得积分，逾期作废。</p>-->
              <!--</div>-->
            <!--</div>-->
          <!--</li>-->
          <!--<li>-->
            <!--<div class="rightItem">-->
              <!--<span>4</span>-->
            <!--</div>-->
            <!--<div class="rightTxt">-->
              <!--<div>-->
                <!--<p>VIP会员于微信VIP卡内进行签到，每天可获积分奖励。（每天签到+2积分，完成7日签到+7积分，完成30天签到+30积分。</p>-->
              <!--</div>-->
            <!--</div>-->
          <!--</li>-->
          <!--<li>-->
            <!--<div class="rightItem">-->
              <!--<span>5</span>-->
            <!--</div>-->
            <!--<div class="rightTxt">-->
              <!--<div>-->
                <!--<p>参与官方微信互动游戏、现场活动等，可获相应积分奖励。</p>-->
              <!--</div>-->
            <!--</div>-->
          <!--</li>-->
        <!--</ul>-->
      <!--</div>-->
      <!--不显示-->
      <!--<div class="rightsGardItem">-->
        <!--<h3>-->
          <!--<i class="rightIcon vip_icon_silver"></i>-->
          <!--银卡VIP权益-->
        <!--</h3>-->
        <!--<ul>-->
          <!--<li>-->
            <!--<div class="rightItem">-->
              <!--<span>1</span>-->
            <!--</div>-->
            <!--<div class="rightTxt">-->
              <!--<div>-->
                <!--<p>为会员打造定制一套回馈、增值奖励方案，会员级别越高，享受的权益越多</p>-->
              <!--</div>-->
            <!--</div>-->
          <!--</li>-->
          <!--<li>-->
            <!--<div class="rightItem">-->
              <!--<span>2</span>-->
            <!--</div>-->
            <!--<div class="rightTxt">-->
              <!--<div>-->
                <!--<p>当会员级别到期后，如未能达到升级标准，但凡会员到期前12个月消费金额大于0元，则当前会员级别就可以顺延一年。</p>-->
              <!--</div>-->
            <!--</div>-->
          <!--</li>-->
        <!--</ul>-->
      <!--</div>-->
      <!--<div class="rightsGardItem">-->
        <!--<h3>-->
          <!--<i class="rightIcon vip_icon_gold"></i>-->
          <!--金卡专属VIP权益-->
        <!--</h3>-->
        <!--<ul>-->
          <!--<li>-->
            <!--<div class="rightItem">-->
              <!--<span>1</span>-->
            <!--</div>-->
            <!--<div class="rightTxt">-->
              <!--<div>-->
                <!--<p>为会员打造定制一套回馈、增值奖励方案，会员级别越高，享受的权益越多</p>-->
              <!--</div>-->
            <!--</div>-->
          <!--</li>-->
          <!--<li>-->
            <!--<div class="rightItem">-->
              <!--<span>2</span>-->
            <!--</div>-->
            <!--<div class="rightTxt">-->
              <!--<div>-->
                <!--<p>当会员级别到期后，如未能达到升级标准，但凡会员到期前12个月消费金额大于0元，则当前会员级别就可以顺延一年。</p>-->
              <!--</div>-->
            <!--</div>-->
          <!--</li>-->
        <!--</ul>-->
      <!--</div>-->
      <!--<div class="rightsGardItem">-->
        <!--<h3>-->
          <!--<i class="rightIcon vip_icon_platinum"></i>-->
          <!--白金卡专属VIP权益-->
        <!--</h3>-->
        <!--<ul>-->
          <!--<li>-->
            <!--<div class="rightItem">-->
              <!--<span>1</span>-->
            <!--</div>-->
            <!--<div class="rightTxt">-->
              <!--<div>-->
                <!--<p>为会员打造定制一套回馈、增值奖励方案，会员级别越高，享受的权益越多</p>-->
              <!--</div>-->
            <!--</div>-->
          <!--</li>-->
          <!--<li>-->
            <!--<div class="rightItem">-->
              <!--<span>2</span>-->
            <!--</div>-->
            <!--<div class="rightTxt">-->
              <!--<div>-->
                <!--<p>当会员级别到期后，如未能达到升级标准，但凡会员到期前12个月消费金额大于0元，则当前会员级别就可以顺延一年。</p>-->
              <!--</div>-->
            <!--</div>-->
          <!--</li>-->
        <!--</ul>-->
      <!--</div>-->
      <!--静态权限-->
      <!--<div class="rightsGardItem">-->
        <!--<h3>-->
          <!--<i class="rightIcon vip_icon_diamonds"></i>-->
          <!--钻石专属VIP权益-->
        <!--</h3>-->
        <!--<ul>-->
          <!--<li>-->
            <!--<div class="rightItem">-->
              <!--<span>1</span>-->
            <!--</div>-->
            <!--<div class="rightTxt">-->
              <!--<div>-->
                <!--<p>为会员打造定制一套回馈、增值奖励方案，会员级别越高，享受的权益越多</p>-->
              <!--</div>-->
            <!--</div>-->
          <!--</li>-->
          <!--<li>-->
            <!--<div class="rightItem">-->
              <!--<span>2</span>-->
            <!--</div>-->
            <!--<div class="rightTxt">-->
              <!--<div>-->
                <!--<p>当会员级别到期后，如未能达到升级标准，但凡会员到期前12个月消费金额大于0元，则当前会员级别就可以顺延一年。</p>-->
              <!--</div>-->
            <!--</div>-->
          <!--</li>-->
        <!--</ul>-->
      <!--</div>-->
      <!--<div class="rightsClaify">-->
        <!--<h3>-->
          <!--积分标准（消费积分）-->
        <!--</h3>-->
        <!--<table class="jfbz">-->
          <!--<tr>-->
            <!--<th>积分比例</th>-->
            <!--<th>商户类型</th>-->
          <!--</tr>-->
          <!--<tr>-->
            <!--<td>1元=1积分</td>-->
            <!--<td>餐饮类、美发美甲类、服装类、儿童玩具类</td>-->
          <!--</tr>-->
          <!--<tr>-->
            <!--<td>10元=1积分</td>-->
            <!--<td>珠宝类、通讯类、电器类、钟表类、美容美体类、娱乐健身类、教育培训类-->
            <!--</td>-->
          <!--</tr>-->
        <!--</table>-->
      <!--</div>-->

      <!--<div class="rightsClaify">-->
        <!--<h3>-->
          <!--积分兑换与奖励-->
        <!--</h3>-->
        <!--<ul>-->
          <!--<li>-->
            <!--<div class="rightItem">-->
              <!--<span>1</span>-->
            <!--</div>-->
            <!--<div class="rightTxt">-->
              <!--<div>-->
                <!--<p>VIP消费所获积分可兑换礼品、礼券等或活动参与名额等，需卡主会员本人于G5微信VIP内在线兑换或凭获邀短信等亲临服务台办理；礼品兑换规则详见具体说明；实物礼品兑换后，如非质量问题不予退换且积分不作退还。</p>-->
              <!--</div>-->
            <!--</div>-->
          <!--</li>-->
          <!--<li>-->
            <!--<div class="rightItem">-->
              <!--<span>2</span>-->
            <!--</div>-->
            <!--<div class="rightTxt">-->
              <!--<div>-->
                <!--<p>VIP会员卡本身无有效期，卡内积分1年内有效，超过自然年期限（18年办理的统一到19年12月31日）自动清零重新积分，积分默认化整数。</p>-->
              <!--</div>-->
            <!--</div>-->
          <!--</li>-->
        <!--</ul>-->
      <!--</div>-->

      <!--<div class="rightsClaify">-->
        <!--<h3>-->
          <!--会员服务-->
        <!--</h3>-->
        <!--<ul>-->
          <!--<li>-->
            <!--<div class="rightItem">-->
              <!--<span>1</span>-->
            <!--</div>-->
            <!--<div class="rightTxt">-->
              <!--<div>-->
                <!--<p>会员享受停车积分兑换优惠。</p>-->
              <!--</div>-->
            <!--</div>-->
          <!--</li>-->
          <!--<li>-->
            <!--<div class="rightItem">-->
              <!--<span>2</span>-->
            <!--</div>-->
            <!--<div class="rightTxt">-->
              <!--<div>-->
                <!--<p>会员生日、节假日或G5周年庆当天购物享受1.5倍或2倍积分。</p>-->
              <!--</div>-->
            <!--</div>-->
          <!--</li>-->
          <!--<li>-->
            <!--<div class="rightItem">-->
              <!--<span>3</span>-->
            <!--</div>-->
            <!--<div class="rightTxt">-->
              <!--<div>-->
                <!--<p>优先获知时尚资讯、促销优惠，福利发放。</p>-->
              <!--</div>-->
            <!--</div>-->
          <!--</li>-->
          <!--<li>-->
            <!--<div class="rightItem">-->
              <!--<span>4</span>-->
            <!--</div>-->
            <!--<div class="rightTxt">-->
              <!--<div>-->
                <!--<p>特价商品限时抢购，好礼兑换。</p>-->
              <!--</div>-->
            <!--</div>-->
          <!--</li>-->
        <!--</ul>-->
      <!--</div>-->

      <!--<div class="rightsClaify">-->
        <!--<h3>-->
          <!--其它说明-->
        <!--</h3>-->
        <!--<ul>-->
          <!--<li>-->
            <!--<div class="rightItem">-->
              <!--<span>1</span>-->
            <!--</div>-->
            <!--<div class="rightTxt">-->
              <!--<div>-->
                <!--<p>VIP获得的购物消费优惠券或现金券类、活动参与资格等，需在消费付款前及参与活动时主动出示，方可享有相应优惠、权益及服务等。</p>-->
              <!--</div>-->
            <!--</div>-->
          <!--</li>-->
          <!--<li>-->
            <!--<div class="rightItem">-->
              <!--<span>2</span>-->
            <!--</div>-->
            <!--<div class="rightTxt">-->
              <!--<div>-->
                <!--<p>VIP卡的积分不可相互转赠或合并使用。</p>-->
              <!--</div>-->
            <!--</div>-->
          <!--</li>-->
          <!--<li>-->
            <!--<div class="rightItem">-->
              <!--<span>3</span>-->
            <!--</div>-->
            <!--<div class="rightTxt">-->
              <!--<div>-->
                <!--<p>VIP的积分奖励资格由G5最终确认，违规获得积分的，G5将有权取消其VIP积分或终止会籍。</p>-->
              <!--</div>-->
            <!--</div>-->
          <!--</li>-->
          <!--<li>-->
            <!--<div class="rightItem">-->
              <!--<span>4</span>-->
            <!--</div>-->
            <!--<div class="rightTxt">-->
              <!--<div>-->
                <!--<p>当持VIP会员卡顾客出现退换货等情况，相应积分需扣除。</p>-->
              <!--</div>-->
            <!--</div>-->
          <!--</li>-->
          <!--<li>-->
            <!--<div class="rightItem">-->
              <!--<span>5</span>-->
            <!--</div>-->
            <!--<div class="rightTxt">-->
              <!--<div>-->
                <!--<p>G5在法律许可范围内拥有对VIP的解释权及VIP规则调整权等。</p>-->
              <!--</div>-->
            <!--</div>-->
          <!--</li>-->
        <!--</ul>-->
      <!--</div>-->
    </section>
  </page>
</template>

<script>
  import Page from '../../../components/page/page'
  import {getRightAndBind} from '../../../api/common'
  import {utilMixin} from '../../../common/mixins/util'
  import {htmlDecode} from '../../../common/utils'
  const PAGE_NAME = 'vip-rights'

  export default {
    name: PAGE_NAME,
    mixins: [utilMixin],
    data () {
      return {
        rightTxt: ''
      }
    },
    activated() {
      this.getRuleTex()
    },
    methods: {
      getRuleTex() {
        if (!this.rightTxt) {
          this._openToast()
          getRightAndBind(1).then(res => {
            this._closeToast()
            this.rightTxt = htmlDecode(res.EB_RULE_CONDITION)
          }).catch(errs => {
            this._closeToast()
            this._openAlert(`${errs}`)
          })
        }
      }
    },
    deactivated() {
      if (!this.rightTxt) {
        this._closeToast()
      }
    },
    components: {
      Page
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variables.styl"
  @import "~common/stylus/mixin.styl"
  .jfbz
    border-left: 1px solid #cccccc
    border-top: 1px solid #cccccc
    margin-top: 12px
    tr
      border-bottom: 1px solid #cccccc
      >th:nth-child(1), >td:nth-child(1)
        width: 30%
        text-align : center
        vertical-align middle
      th, td
        padding: 8px 10px
        line-height : 1.3
        border-right: 1px solid #cccccc
  .rights-page
    background: $color-page-rights
    .rights-section
      margin-top: 12px
      background: #fff
      font-size : $fontsize-large
      padding: 18px 12px 30px
      .vip_icon_silver
        bg-image('./vip_icon_silver')
      .vip_icon_gold
        bg-image('./vip_icon_gold')
      .vip_icon_platinum
        bg-image('./vip_icon_platinum')
      .vip_icon_diamonds
        bg-image('./vip_icon_diamonds')
      .rightsClaify, .rightsGardItem
        border-bottom-1px()
        padding: 12px 0
        h3
          font-weight : 600
          .rightIcon
            width: 21px
            height: 21px
            display : inline-block
            background-size: 100%
            background-repeat: no-repeat
            background-position: center
            float: left
            margin-top: -4px
            margin-right: 4px
        >ul
          padding-top: 4px
          color: $color-hs
          >li
            display: flex
            padding-top: 12px
            .rightItem
              width: 14px
              margin-right: 8px
              color: #ffffff
              >span
                display : inline-block
                width: $fontsize-medium
                height: $fontsize-medium
                border-radius : 50%
                background : $color-orange
                text-align : center
                font-size: $fontsize-small
                line-height :  $fontsize-medium
            .rightTxt
              font-break()
              p
                line-height : 1.2
      >div:last-child
        &::after
          border-bottom: none
</style>
