import { wechat } from './../home/config'
export default class Login {
  constructor() {
    this.onMember()
  }
  onMember() { // 获取用户信息
    let that = this;
    wx.getSetting({ // 获取用户权限设置
      success(res) {
        if (Object.keys(res.authSetting).length == 0) { // 对象为空
          that.onAuthor();
        } else {
          if (res.authSetting['scope.userInfo']) { // 已授权
            that.onInfo();
          } else { // 已拒绝
            that.onSetting();
          }
        }
      },
      fail(err) {
        GameGlobal.Nebula.onToast('网络错误～');
      }
    })
  }
  onSetting() { // 跳用户权限设置
    let that = this;
    wx.showModal({
      title: '微信授权',
      content: '获取你的公开信息（昵称、头像、地区及性别）',
      success(res) {
        if (res.confirm) {
          wx.openSetting({
            success(res) {
              that.onInfo();
            },
            fail(err) {
              GameGlobal.Nebula.onToast('网络错误～');
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
  onAuthor() { // 请求授权
    let that = this;
    wx.authorize({
      scope: 'scope.userInfo',
      success(res) {
        if (res.errMsg.includes('ok')) { // 同意授权
          that.onInfo();
        } else { // 拒绝授权
          wechat.wechatMsg = false;
        }
      }
    })
  }
  onInfo() { // 获取用户信息
    let that = this;
    wx.getUserInfo({
      success(res) {
        wechat.wechatMsg = true;
        that.onVerify(res);
      },
      fail(err) {
        wechat.wechatMsg = false;
        GameGlobal.Nebula.onToast('网络错误～');
      }
    })
  }
  onVerify(data) { // 校验用户 
    GameGlobal.Nebula.onFecth('/register/userinfo', data)
    .then(res => {
      console.log(res, '@res');
      wechat.userStatus = res.status;
    })
    .catch(err => {
      GameGlobal.Nebula.onToast('网络错误～');
    })
  }
}