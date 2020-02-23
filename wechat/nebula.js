import { wechat } from './../home/config'
export default class Nebula {
  constructor() {

  }
  onFecth(url, data) { // 发起请求
    return new Promise((ret, rej) => {
      wx.request({
        url: wechat.baseUrl + url, //仅为示例，并非真实的接口地址
        data: data,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          ret(res.data);
        },
        fail(err) {
          rej(err);
        }
      })
    })
  }
  onToast(text = '网络错误～', type = 'none', time = 2000) {
    wx.showToast({
      title: text,
      icon: type,
      duration: time
    })
  }
}