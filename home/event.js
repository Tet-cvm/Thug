import * as PIXI from './../libs/pixi.min'
// 全局事件中心
export const eventBus = new PIXI.utils.EventEmitter();
// 事件管理器
export const eventTypes = {
  TOUCH_LEFT: 'TOUCH_LEFT', // 点击左侧游戏手柄
  TOUCH_RIGHT: 'TOUCH_RIGHT', // 点击右侧游戏手柄
}