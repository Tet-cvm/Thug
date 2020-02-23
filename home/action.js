import { eventBus, eventTypes } from './event'
import { wechat, utils, words } from './config'
export default class Action {
  constructor() {
    this.audioStage = null
    this.audioClick = null
    this.onAddEvent()
    this.onAudioStage()
    this.onAudioClick()
  }
  onAddEvent() { // 监听事件中心
    eventBus.on(eventTypes.TOUCH_START, this.onGameStart, this);
    eventBus.on(eventTypes.TOUCH_STEP, this.onGameStep, this);
    eventBus.on(eventTypes.TOUCH_STEP_BACK, this.onStepBack, this);
    eventBus.on(eventTypes.TOUCH_GAME_BACK, this.onGameBack, this);
    eventBus.on(eventTypes.TOUCH_GAME_SET, this.onGameSet, this);
    eventBus.on(eventTypes.TOUCH_SET_CANCEL, this.onSetCancel, this);
    eventBus.on(eventTypes.TOUCH_LEFT, this.onLeftGamePad, this);
    eventBus.on(eventTypes.TOUCH_RIGHT, this.onRightGamePad, this);
  }
  onAudioStage() { // 加载背景音乐
    this.audioStage = wx.createInnerAudioContext();
    this.audioStage.src = './assets/stage.mp3';
    this.audioStage.obeyMuteSwitch = false;
    this.audioStage.loop = true;
    this.audioStage.autoplay = false;
  }
  onStagePlay() {
    this.audioStage.play();
  }
  onStageStop() {
    this.audioStage.stop();
  }
  onAudioClick() { // 加载点击音效
    this.audioClick = wx.createInnerAudioContext();
    this.audioClick.src = './assets/click.mp3';
    this.audioClick.obeyMuteSwitch = false;
    this.audioClick.loop = false;
    this.audioClick.autoplay = false;
  }
  onClickPlay() {
    this.audioClick.play();
  }
  onClickStop() {
    this.audioClick.stop();
  }
  onGameStart() { // 游戏开始按钮
    if (wechat.wechatMsg) {
      GameGlobal.globalScene.onStartToggle(false) // 隐藏快速开始按钮
      GameGlobal.globalScene.onSetBtnToggle(false) // 隐藏设置按钮
      GameGlobal.globalScene.onStepStage(true) // 调用磨砂底图
      if (!utils.gameStep) { // 加载关卡图层
        GameGlobal.globalScene.onGameStep()
        utils.gameStep = true
      } else { // 显示关卡图层
        GameGlobal.globalScene.onStepToggle(true)
      }

      if (!utils.stepBack) { // 加载关卡返回
        utils.stepBack = true
        GameGlobal.globalScene.onStepBack()
      } else { // 显示关卡返回
        GameGlobal.globalScene.onStepBackToggle(true)
      }
    } else {
      GameGlobal.Login.onMember() // 重新获取用户信息
    }
  }
  onGameStep() { // 进入游戏按钮
    GameGlobal.globalScene.onStepToggle(false) // 隐藏关卡图层
    GameGlobal.globalScene.onGameStage() // 加载游戏图层
    GameGlobal.globalScene.onStepBackToggle(false) // 隐藏游戏返回

    if (!utils.gameBack) { // 加载游戏返回
      utils.gameBack = true
      GameGlobal.globalScene.onGameBack()
    } else { // 显示游戏返回
      GameGlobal.globalScene.onGameBackToggle(true)
    }

    if (!utils.gamePad) { // 加载游戏手柄
      utils.gamePad = true
      GameGlobal.globalScene.onGamePad()
    } else { // 隐藏游戏手柄
      GameGlobal.globalScene.onPadToggle(true)
    }
    GameGlobal.globalScene.onHeroInit()
  }
  onStepBack() { // 关卡返回按钮
    GameGlobal.globalScene.onStepToggle(false) // 隐藏关卡图层
    GameGlobal.globalScene.onStepBackToggle(false) // 隐藏关卡返回
    GameGlobal.globalScene.onStepStage(false) // 关闭磨砂
    GameGlobal.globalScene.onStartToggle(true) // 显示快速开始按钮
    GameGlobal.globalScene.onSetBtnToggle(true) // 显示设置按钮
  }
  onGameBack() { // 游戏返回按钮
    GameGlobal.globalScene.onGameBackToggle(false) // 隐藏游戏返回
    GameGlobal.globalScene.onPadToggle(false) // 隐藏游戏手柄
    GameGlobal.globalScene.onMenuStage(true) // 加载底图
    GameGlobal.globalScene.onStepStage(true) // 渲染磨砂效果
    GameGlobal.globalScene.onStepToggle(true) // 显示关卡图层
    GameGlobal.globalScene.onStepBackToggle(true) // 显示关卡返回
  }
  onGameSet() { // 游戏设置按钮
    console.log('onGameSet')
    if (!utils.gameSet) { // 游戏设置初始化
      utils.gameSet = true
      GameGlobal.globalScene.onSetupPanel()
    } else {
      GameGlobal.globalScene.onSetPanelToggle(true)
    }
  }
  onSetCancel() { // 游戏容器关闭
    GameGlobal.globalScene.onSetPanelToggle(false)
  }
  onLeftGamePad() { // 点击左侧游戏手柄
    this.onSpeedControl(0, 80)
  }
  onRightGamePad() { // 点击右侧游戏手柄
    this.onSpeedControl(1, 80)
  }
  onSpeedControl(direction, value) { // 场景切换控制器
    let count = this.onCountTimer(value);
    let timer = setInterval(() => {
      if (value > 0) {
        GameGlobal.globalScene.onScenePad(direction, 1);
        value--;
      } else {
        clearInterval(timer);
      }
    }, count);
  }
  onCountTimer(value) { // 计算
    return (300 / value).toFixed(2);
  }
  onPadAnimation(btn, direction) { // 游戏手柄动画
    let max = GameGlobal.globalScene.padArray.maxScale;
    let min = GameGlobal.globalScene.padArray.minScale;

    switch (btn) {
      case 'left':
        if (direction == 'down') {
          this.onPadScale(0, min);
        }
        if (direction == 'up') {
          this.onPadScale(0, max);
        }
        break;
      case 'right':
        if (direction == 'down') {
          this.onPadScale(1, min);
        }
        if (direction == 'up') {
          this.onPadScale(1, max);
        }
        break;
    }
  }
  onPadScale(index, scale) {
    switch(index)
    {
      case 0:
        GameGlobal.globalScene.padArray['leftArrow'].scale.set(scale);
        GameGlobal.globalScene.padArray['leftBubble'].scale.set(scale);
        break;
      case 1:
        GameGlobal.globalScene.padArray['rightArrow'].scale.set(scale);
        GameGlobal.globalScene.padArray['rightBubble'].scale.set(scale);
        break;
    }
  }
}