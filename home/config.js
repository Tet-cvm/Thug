const wechat = {
  baseUrl: 'http://game.slogger.cn', // 默认地址
  wechatMsg: false, // 是否获取到用户信息
  userStatus: 0, // 0 未获取到用户信息状态 1 用户首次注册登陆 2 用户已注册登陆
}

const utils = {
  stageWidth: 1334,
  stageHeight: 750,
  forestPolish: 5, // 磨砂效果 
  gameStep: false, // 关卡图层初始化
  stepBack: false, // 关卡返回初始化
  gameBack: false, // 游戏返回初始化
  gamePad: false, // 游戏手柄初始化
  gameSet: false, // 游戏设置初始化
  audioStage: false, // 背景音乐
  audioScene: true  // 其他音乐
}

const words = {
  quickStart: '快速开始',
  backSound: {
    title: '声效',
    back: '音乐',
    effect: '音效'
  }
}

export { wechat, utils, words }