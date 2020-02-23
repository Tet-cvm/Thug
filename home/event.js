import * as PIXI from './../libs/pixi.min'
// 全局事件中心
export const eventBus = new PIXI.utils.EventEmitter();
// 事件管理器
export const eventTypes = {
  TOUCH_START: 'TOUCH_START', // 点击左侧游戏手柄
  TOUCH_STEP: 'TOUCH_STEP', // 点击左侧游戏手柄
  TOUCH_STEP_BACK: 'TOUCH_STEP_BACK', // 关卡返回
  TOUCH_GAME_BACK: 'TOUCH_GAME_BACK', // 游戏返回
  TOUCH_GAME_SET: 'TOUCH_GAME_SET', // 游戏设置
  TOUCH_SET_CANCEL: 'TOUCH_SET_CANCEL', // 关闭游戏设置
  TOUCH_LEFT: 'TOUCH_LEFT', // 点击左侧游戏手柄
  TOUCH_RIGHT: 'TOUCH_RIGHT', // 点击右侧游戏手柄
  
}