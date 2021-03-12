import request from '~/utils/request'

export default {
  createNative(orderId) {
    return request({
      baseURL: 'http://localhost:8170',
      url: `/api/trade/order/auth/pay/${orderId}`,
      method: 'post'
    })
  }
}
