window.env = 1 // 0 正式 1 测试
window.globalData = {
  apiUrl: window.env === 0 ? 'http://183.6.99.19:8091' : 'http://183.6.99.19:9999', // 'http://183.6.99.19:8091' // https://wx.gate5mall.cn:8091
  homeUrl: window.env === 0 ? 'http://wx.gate5mall.cn/RayLeigh' : 'http://wxapp.tech-trans.com.cn/G5Plaza_test' // 'https://wx.gate5mall.cn/RayLeigh' // 'http://wxapp.tech-trans.com.cn/G5Plaza_test'
}
// http://121.8.145.68:1480/webservice_G5TJP
