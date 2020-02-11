import { eventBus, eventTypes } from './event'
export default class Action {
  constructor() {
    this.audioStage = null,
    this.audioClick = null,
    this.onAddEvent(),
    this.onAudioStage()
    this.onAudioClick()
  }
  onAddEvent() { // 监听事件中心
    eventBus.on(eventTypes.TOUCH_LEFT, this.onLeftGamePad, this);
    eventBus.on(eventTypes.TOUCH_RIGHT, this.onRightGamePad, this);
    eventBus.on(eventTypes.TOUCH_PLAY, this.onGamePlay, this);
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
  onLeftGamePad() { // 点击左侧游戏手柄
    console.log('left');
    this.onSpeedControl(0, 80);
  }
  onRightGamePad() { // 点击右侧游戏手柄
    console.log('right');
    this.onSpeedControl(1, 80);
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
    console.log(GameGlobal.globalScene.padArray)
    console.log(btn, direction);

    let max = GameGlobal.globalScene.padArray[2].maxScale;
    let min = GameGlobal.globalScene.padArray[2].minScale;

    switch (btn)
    {
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
    GameGlobal.globalScene.padArray[index].arrow.scale.set(scale);
    GameGlobal.globalScene.padArray[index].bubble.scale.set(scale);
  }
  onGamePlay() { // 游戏开始
    console.log('游戏开始')
  }
  onPlayAnimate(type, maxScale, minScale) {
    let scale = type == 0 ? minScale : maxScale;
    GameGlobal.globalScene.playBtn.scale.set(scale);
  }
}