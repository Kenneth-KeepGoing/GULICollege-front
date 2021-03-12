<template>
  <div class="cart py-container">
    <!--主内容-->
    <div class="checkout py-container  pay">
      <div class="checkout-tit" style="width: 1050px; margin: 0 auto; padding: 10px 0;">
        <h4 class="fl tit-txt"><span class="success-info">支付申请提交成功，请您及时付款！订单号：{{ payObj.courseId }}</span>
        </h4>
        <span class="fr"><em class="sui-lead">应付金额：</em><em class="orange money">￥{{ payObj.totalFee/100 }}</em></span>
        <div class="clearfix"/>
      </div>
      <div class="checkout-steps">
        <div class="fl weixin">微信支付</div>
        <div class="fl sao">
          <div class="fl code">
            <qriously :value="payObj.code_url" :size="338"/>
          </div>
          <div style="color: red; text-align:center;">请使用微信扫一扫</div>
          <img src="https://kenneth-common.oss-cn-beijing.aliyuncs.com/pic/wechat.jpg" height="300px" width="300px">
        </div>
        <div class="clearfix"/>
        <p style="color: red;text-align:center;"> 请勿扫码，模拟支付ing.....</p>
      </div>
    </div>

  </div>
</template>
<script>
import payApi from '~/api/pay'

export default {
  data() {
    return {
      message: ''
    }
  },
  async asyncData(page) {
    const response = await payApi.createNative(page.route.params.id)
    return {
      payObj: response.data.item,
      message: response.message
    }
  },
  mounted() {
    this.timer = setTimeout(this.get, 3000)
  },
  methods: {
    get() {
      this.$alert('支付成功！！！', '状态', {
        confirmButtonText: '确定',
        callback: action => {
          this.$router.push({ path: '/ucenter/order' })
        }
      })
    }
  }
}
</script>
