import * as PIXI from './../libs/pixi.min'
// 全局事件中心
export const eventBus = new PIXI.utils.EventEmitter();
// 事件管理器
export const eventTypes = {
  TOUCH_LEFT  : 'TOUCH_LEFT', // 点击左侧游戏手柄
  TOUCH_RIGHT : 'TOUCH_RIGHT', // 点击右侧游戏手柄
  TOUCH_PLAY  : 'TOUCH_PLAY', // 点击右侧游戏手柄
  TOUCH_NOTICE: 'TOUCH_NOTICE', // 点击通告牌
  TOUCH_SETTING: 'TOUCH_SETTING', // 设置按钮
  TOUCH_TRACK: 'TOUCH_TRACK', // 游戏关卡
}