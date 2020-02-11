import * as PIXI from './../libs/pixi.min'
import './../libs/pixi-spine'
import { eventBus, eventTypes } from './event'
import { utils, words } from './config'
const Application = PIXI.Application
const Sprite = PIXI.Sprite
const Container = PIXI.Container
const Resources = PIXI.loader.resources;
const Loader = PIXI.loader;
const TextureCache = PIXI.utils.TextureCache;
const { pixelRatio, windowWidth, windowHeight } = wx.getSystemInfoSync();

export default class Scene {
  constructor() {
    this.ratio = 0,
    this.appView = null,
    this.forest = null,
    this.cobbled = null,
    this.notice = null,
    this.setting = null,
    this.track = null,
    this.gameScene = new Container(),
    this.gamePadLeft = new Container(),
    this.gamePadRight = new Container(),
    this.gameHome = new Container(),
    this.gameControl = new Container(),
    this.gameStart = new Container(),
    this.padArray = [],
    this.playBtn = null,
    this.onAppView()
  }
  onAppView() {
    this.appView = new Application({
      view: canvas,
      antialias: true, // 抗锯齿
      transparent: false, // 透明度
      backgroundColor: 0x000000, // 容器底色
      width: utils.stageWidth,
      height: utils.stageHeight,
      resolution: pixelRatio || 1, // 分辨率
      autoDensity: false
    })
    // 映射点击事件
    this.appView.renderer.plugins.interaction.mapPositionToPoint = (point, x, y) => {
      point.x = x * 1
      point.y = y * 1
    }
    this.onResize();
    this.appView.stage.interactive = true;
    this.onGameStage();
  }
  onResize() {
    console.log(this.appView, '@this.appView');
    this.ratio = windowWidth / utils.stageWidth;
    this.appView.stage.scale.set(this.ratio);
    this.appView.renderer.resize(windowWidth, windowHeight);

    // iphoneX 适配
    windowWidth == 812 ? this.gamePadLeft.x = 54 : null;
    // iphoneXR iphoneXS 适配
    windowWidth == 896 ? this.gamePadLeft.x = 50 : null;
  }
  onGameStage() { // 搭建场景舞台
    const assets = [
      { name: 'forest', url: './assets/forest.jpg' },
      { name: 'cobbled', url: './assets/cobbled.png' },
      { name: 'notice', url: './assets/notice.png' },
      { name: 'setting', url: './assets/setting.png' },
      { name: 'track', url: './assets/track.png' },
    ]

    this.appView.loader.add(assets).load(() => {
      const forest = PIXI.Texture.fromImage('forest');
      const cobbled = PIXI.Texture.fromImage('cobbled');
      const notice  = new Sprite.from('notice');
      const setting = new Sprite.from('setting');
      const track = new Sprite.from('track');
      // 回去比例宽高
      let width = windowWidth / this.ratio;
      let height = windowHeight / this.ratio;
      // 计算森林、道路高度
      let _forest = parseInt(height * 640 / utils.stageHeight);
      let _cobbled = parseInt(height * 179 / utils.stageHeight);
      // 等比例缩放森林原图
      forest.baseTexture.realWidth = parseInt(_forest * 1286 / 640);
      forest.baseTexture.realHeight = _forest;
      forest.baseTexture.width = parseInt(_forest * 1286 / 640);
      forest.baseTexture.height = _forest;
      forest.orig.width = parseInt(_forest * 1286 / 640);
      forest.orig.height = _forest;
      // 等比例缩放道路原图
      cobbled.baseTexture.realWidth = parseInt(_cobbled * 1286 / 179);
      cobbled.baseTexture.realWidth = _cobbled;
      cobbled.baseTexture.width = parseInt(_cobbled * 1286 / 179);
      cobbled.baseTexture.height = _cobbled;
      cobbled.orig.width = parseInt(_cobbled * 1286 / 179);
      cobbled.orig.height = _cobbled;

      // 通告牌
      notice.x = width - notice.width - 180;
      notice.y = height - cobbled.orig.height - notice.height + cobbled.orig.height * 0.32;

      setting.x = width - setting.width - width * 0.2;
      setting.y = 18;

      track.x = width - setting.width * 2 - width * 0.2 - 60;
      track.y = 18;

      this.forest = new PIXI.extras.TilingSprite(forest, width, _forest);
      this.cobbled = new PIXI.extras.TilingSprite(cobbled, width, _cobbled);
      this.notice = notice;
      this.setting = setting;
      this.track = track;

      this.forest.position.x = 0;
      this.forest.position.y = 0;

      this.cobbled.position.x = 0;
      this.cobbled.position.y = height - cobbled.height;

      this.notice.interactive = true;
      this.notice.buttonMode = true;

      this.setting.interactive = true;
      this.setting.buttonMode = true;

      this.track.interactive = true;
      this.track.buttonMode = true;

      this.notice.on('pointertap', () => {
        utils.audioScene ? GameGlobal.globalAction.onClickPlay() : null;
        eventBus.emit(eventTypes.TOUCH_NOTICE, 'onBoxGem');
      })

      this.setting.on('pointertap', () => {
        utils.audioScene ? GameGlobal.globalAction.onClickPlay() : null;
        eventBus.emit(eventTypes.TOUCH_SETTING, 'onBoxGem');
      })

      this.track.on('pointertap', () => {
        utils.audioScene ? GameGlobal.globalAction.onClickPlay() : null;
        eventBus.emit(eventTypes.TOUCH_TRACK, 'onBoxGem');
      })

      this.appView.stage.addChild(this.forest, this.cobbled, this.setting, this.notice, this.track, this.gameScene, this.gameControl);
      utils.audioStage ? GameGlobal.globalAction.onStagePlay() : null;
      this.onGamePad();
    })
  }
  onGamePad() { // 初始化游戏手柄
    const assets = [
      { name: 'arrow-left', url: './assets/arrow-left.png' },
      { name: 'arrow-right', url: './assets/arrow-right.png' },
      { name: 'bubble-left', url: './assets/bubble-left.png' },
      { name: 'bubble-right', url: './assets/bubble-right.png' }
    ]

    this.appView.loader.add(assets).load(() => {
      const leftArrow = new Sprite.from('arrow-left');
      const leftBubble = new Sprite.from('bubble-left');

      const rightArrow = new Sprite.from('arrow-right');
      const rightBubble = new Sprite.from('bubble-right');

      leftArrow.width = 132;
      leftArrow.height = 128;
      rightArrow.width = 132;
      rightArrow.height = 128;

      leftBubble.width = 192;
      leftBubble.height = 192;
      rightBubble.width = 192;
      rightBubble.height = 192;

      leftArrow.anchor.set(0.5);
      rightArrow.anchor.set(0.5);
      leftBubble.anchor.set(0.5);
      rightBubble.anchor.set(0.5);

      // iphoneX 适配
      // iphoneXR iphoneXS 适配
      if (windowWidth == 812 || windowWidth == 896) {
        leftArrow.scale.set(0.9);
        leftBubble.scale.set(0.9);
        rightArrow.scale.set(0.9);
        rightBubble.scale.set(0.9);
      }

      this.gamePadLeft.addChild(leftBubble, leftArrow);
      this.gamePadRight.addChild(rightBubble, rightArrow);
      // 调整位置
      this.gamePadLeft.x = rightBubble.width / 2;
      this.gamePadRight.x = windowWidth / this.ratio - rightBubble.width / 2;

      this.gamePadLeft.y = windowHeight / this.ratio / 2;
      this.gamePadRight.y = windowHeight / this.ratio / 2;

      // this.gamePadLeft.y = (windowHeight / this.ratio - leftBubble.height) / 2 + leftBubble.height / 2;
      // this.gamePadRight.y = (windowHeight / this.ratio - rightBubble.height) / 2 + rightBubble.height / 2;

      this.gamePadLeft.x += 60;
      this.gamePadRight.x -= 60;

      let arrLeft = {
        arrow: leftArrow,
        bubble: leftBubble
      };

      let arrRight = {
        arrow: rightArrow,
        bubble: rightBubble
      }

      let arrScale = {
        maxScale: leftBubble.scale.x,
        minScale: leftBubble.scale.x * 0.9,
      }

      this.padArray.push(arrLeft, arrRight, arrScale);
      this.gameScene.addChild(this.gameHome, this.gamePadLeft, this.gamePadRight);

      // 游戏手柄绑定事件
      this.gamePadLeft.interactive = true;
      this.gamePadLeft.buttonMode = true;
      this.gamePadRight.interactive = true;
      this.gamePadRight.buttonMode = true;

      this.gamePadLeft.on('pointertap', () => {
        utils.audioScene ? GameGlobal.globalAction.onClickPlay() : null;
        eventBus.emit(eventTypes.TOUCH_LEFT, 'onBoxGem');
      })

      this.gamePadLeft.on('pointerdown', () => {
        GameGlobal.globalAction.onPadAnimation('left', 'down');
      })
      this.gamePadLeft.on('pointerup', () => {
        GameGlobal.globalAction.onPadAnimation('left', 'up');
      })

      this.gamePadRight.on('pointertap', () => {
        utils.audioScene ? GameGlobal.globalAction.onClickPlay() : null;
        eventBus.emit(eventTypes.TOUCH_RIGHT, 'onBoxGem');
      })

      this.gamePadRight.on('pointerdown', () => {
        GameGlobal.globalAction.onPadAnimation('right', 'down');
      })
      this.gamePadRight.on('pointerup', () => {
        GameGlobal.globalAction.onPadAnimation('right', 'up');
      })
      this.onHuman();
      this.onGameStart();
    })
  }
  onScenePad(direction, value) { // 场景控制器 @direction 0 left 1 right @value 场景切换值
    switch (direction) {
      case 0:
        this.forest.tilePosition.x += value;
        this.cobbled.tilePosition.x += value * 1.6;
        break;
      case 1:
        this.forest.tilePosition.x -= value;
        this.cobbled.tilePosition.x -= value * 1.6;
        break;
    }
  }
  onHuman() { // 初始化主角
    console.log('human')
    // this.appView.loader.add('spineboy', '../assets/spineboy.json').load((loader, res) => {
    //   console.log(res.spineboy, '@res')
    // })

    // this.appView.loader.add('spineboy', 'https://mdqygl.cn/thug/spineboy.png').load((loader, res) => {
    //   console.log(res.spineboy, '@res')
    //   let spineBoy = new Sprite.from('spineboy')
    //   // let spineBoy = new PIXI.spine.Spine(res.spineboy);
    //   spineBoy.x = 100;
    //   spineBoy.y = 100;
    //   this.gameHome.addChild(spineBoy);
    //   console.log(this.appView, '@this.appView')
    // })

    // this.appView.loader.add('spineboy', 'https://mdqygl.cn/thug/spineboy.json').load((loader, res) => {
    //   console.log(res.spineboy, '@res')
    //   let spineBoy = new PIXI.spine.Spine(res.spineboy.spineData);
    //   spineBoy.x = this.appView.screen.width / 2;
    //   spineBoy.y = this.appView.screen.height;
    //   this.gameScene.addChild(spineBoy);
    //   console.log(this.appView, '@this.appView')
    // })
  }
  onGameStart() { // 游戏开始按钮
    const assets = [
      { name: 'play', url: './assets/play.png' },
    ]

    this.appView.loader.add(assets).load(() => {
      const play = new Sprite.from('play');
      play.anchor.set(0.5);
      play.x = windowWidth / this.ratio / 2;
      play.y = windowHeight / this.ratio / 2;

      this.playBtn = play;
      this.gameStart.addChild(play);
      this.gameControl.addChild(this.gameStart);

      this.gameStart.interactive = true;
      this.gameStart.buttonMode = true;

      let arrScale = {
        maxScale: play.scale.x,
        minScale: play.scale.x * 0.9,
      }

      this.gameStart.on('pointerdown', () => {
        utils.audioScene ? GameGlobal.globalAction.onClickPlay() : null;
        GameGlobal.globalAction.onPlayAnimate(0, arrScale.maxScale, arrScale.minScale);
      })
      this.gameStart.on('pointerup', () => {
        GameGlobal.globalAction.onPlayAnimate(1, arrScale.maxScale, arrScale.minScale);
        eventBus.emit(eventTypes.TOUCH_PLAY, 'onBoxGem');
      })
    })
  }
}