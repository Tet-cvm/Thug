import * as PIXI from './../libs/pixi.min'
import './../libs/pixi-spine'
import { eventBus, eventTypes } from './event'
import { utils, words } from './config'
const Application = PIXI.Application
const Sprite = PIXI.Sprite
const Graphics = PIXI.Graphics
const Text = PIXI.Text
const TextStyle = PIXI.TextStyle
const Container = PIXI.Container
const Resources = PIXI.loader.resources;
const Loader = PIXI.loader;
const TextureCache = PIXI.utils.TextureCache;
const { pixelRatio, windowWidth, windowHeight } = wx.getSystemInfoSync();

export default class Scene {
  constructor() {
    this.ratio = 0
    this.appView = null // canvas容器
    this.appStage = new Container() // 背景层
    this.actStage = new Container() // 交互层
    this.notStage = new Container() // 提示层
    this.forest = null
    this.cobbled = null
    this.forestImage = null
    this.cobbledImage = null
    this.setupImage = null
    this.spineboyImage = null
    this.padArray = null
    this.gameStartControl = new Container() // 游戏快速开始控制器
    this.gameStepControl = new Container() // 游戏关卡容器
    this.stepBackControl = new Container() // 关卡返回容器
    this.gameBackControl = new Container() // 游戏返回容器
    this.gamePadLeft = new Container() // 游戏左侧手柄
    this.gamePadRight = new Container() // 游戏右侧手柄
    this.gameSetControl = new Container() // 游戏设置容器
    this.gameBoxControl = new Container() // 游戏进行容器
    this.onInit()
  }
  onInit() {
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
    this.onResize()
    this.appView.stage.interactive = true
    this.appView.stage.addChild(this.appStage, this.actStage, this.notStage)
    this.onSource()
  }
  onResize() {
    this.ratio = windowWidth / utils.stageWidth;
    this.appView.stage.scale.set(this.ratio);
    this.appView.renderer.resize(windowWidth, windowHeight);

    // // // iphoneX 适配
    // windowWidth == 812 ? this.gamePadLeft.x = 154 : null;
    // // // iphoneXR iphoneXS 适配
    // windowWidth == 896 ? this.gamePadLeft.x = 150 : null;
  }
  onSource() { // 初始化静态资源
    const assets = [
      { name: 'forest', url: './assets/forest.jpg' },
      { name: 'cobbled', url: './assets/cobbled.png' },
      { name: 'setup', url: './assets/setup.png' },
      { name: 'arrow-left', url: './assets/arrow-left.png' },
      { name: 'arrow-right', url: './assets/arrow-right.png' },
      { name: 'bubble-left', url: './assets/bubble-left.png' },
      { name: 'bubble-right', url: './assets/bubble-right.png' },
      { name: 'spineboy', url: './assets/spineboy.json' }
    ]

    this.appView.loader.add(assets).load((loader, resources) => {
      this.forestImage = PIXI.Texture.fromImage('forest')
      this.cobbledImage = PIXI.Texture.fromImage('cobbled')
      this.setupImage = new Sprite.from('setup')

      this.padArray = {
        'leftArrow': new Sprite.from('arrow-left'),
        'leftBubble': new Sprite.from('bubble-left'),
        'rightArrow': new Sprite.from('arrow-right'),
        'rightBubble': new Sprite.from('bubble-right')
      }
      // this.spineboyImage = new PIXI.spine.Spine(resources.spineboy.spineData)
      this.onMenuStage() // 首次进入加载底图
      this.onGameStart() // 首次进入加载快速开始按钮
      this.onSetup() // 加载设置按钮
      utils.audioStage ? GameGlobal.globalAction.onStagePlay() : null;
    })
  }
  onMenuStage(status) { // 菜单页面 && 关卡层
    if (status) { // 清除游戏图层
      this.forest = null
      this.cobbled = null
      this.appStage.removeChild(this.forest, this.cobbled)
    }
    // 比例宽高
    let width = windowWidth / this.ratio
    let height = windowHeight / this.ratio
    this.forestImage.baseTexture.realWidth = parseInt(height * 1286 / 640)
    this.forestImage.baseTexture.realHeight = height
    this.forestImage.baseTexture.width = parseInt(height * 1286 / 640)
    this.forestImage.baseTexture.height = height
    this.forestImage.orig.width = parseInt(height * 1286 / 640)
    this.forestImage.orig.height = height
    this.forest = new PIXI.extras.TilingSprite(this.forestImage, width, height)
    this.appStage.addChild(this.forest)
  }
  onStepStage(blur) { // 关卡页面
    let blurFilter = new PIXI.filters.BlurFilter()
    blurFilter.blur = blur ? utils.forestPolish : 0
    this.forest.filters = [blurFilter];
  }
  onGameStage() { // 游戏页面
    this.forest = null
    this.cobbled = null
    this.appStage.removeChild(this.forest, this.cobbled)
    // 比例宽高
    let width = windowWidth / this.ratio
    let height = windowHeight / this.ratio
    // // 计算森林、道路高度
    let _forest = parseInt(height * 640 / utils.stageHeight)
    let _cobbled = parseInt(height * 179 / utils.stageHeight)
    // 等比例缩放森林原图
    this.forestImage.baseTexture.realWidth = parseInt(_forest * 1286 / 640)
    this.forestImage.baseTexture.realHeight = _forest
    this.forestImage.baseTexture.width = parseInt(_forest * 1286 / 640)
    this.forestImage.baseTexture.height = _forest
    this.forestImage.orig.width = parseInt(_forest * 1286 / 640)
    this.forestImage.orig.height = _forest
    // 等比例缩放道路原图
    this.cobbledImage.baseTexture.realWidth = parseInt(_cobbled * 1286 / 179)
    this.cobbledImage.baseTexture.realWidth = _cobbled
    this.cobbledImage.baseTexture.width = parseInt(_cobbled * 1286 / 179)
    this.cobbledImage.baseTexture.height = _cobbled
    this.cobbledImage.orig.width = parseInt(_cobbled * 1286 / 179)
    this.cobbledImage.orig.height = _cobbled

    this.forest = new PIXI.extras.TilingSprite(this.forestImage, width, _forest)
    this.cobbled = new PIXI.extras.TilingSprite(this.cobbledImage, width, _cobbled)

    this.forest.position.x = 0;
    this.forest.position.y = 0;
    this.cobbled.position.x = 0;
    this.cobbled.position.y = height - this.cobbled.height;

    this.appStage.addChild(this.forest, this.cobbled)
  }
  onGameStart() { // 游戏快速开始控制器
    // 比例宽高
    let width = windowWidth / this.ratio
    let height = windowHeight / this.ratio

    const gaine = new Graphics() // 开始按钮盒子
    gaine.beginFill(0xE78D2C, 1)
    gaine.moveTo(0, 0)
    gaine.lineTo(240, 0)
    gaine.lineTo(260, 50)
    gaine.lineTo(240, 100)
    gaine.lineTo(0, 100)
    gaine.lineTo(20, 50)
    gaine.endFill()

    const style = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 44,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: ['#F7FFFF', '#F7F293'], // gradient
      stroke: '#9F6B0B',
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: '#9F6B0B',
      dropShadowBlur: 2,
      dropShadowAngle: Math.PI / 2,
      dropShadowDistance: 2,
      wordWrap: true,
      wordWrapWidth: 440
    })

    const quick = new Text(words.quickStart, style)
    this.gameStartControl.addChild(gaine, quick)
    this.actStage.addChild(this.gameStartControl)
    quick.position.x = (gaine.width - quick.width) / 2
    quick.position.y = (gaine.height - quick.height) / 2

    this.gameStartControl.position.x = width - gaine.width - width * 0.06
    this.gameStartControl.position.y = height - gaine.height - height * 0.03

    this.gameStartControl.interactive = true
    this.gameStartControl.buttonMode = true

    this.gameStartControl.on('pointertap', () => {
      utils.audioScene ? GameGlobal.globalAction.onClickPlay() : null;
      eventBus.emit(eventTypes.TOUCH_START, 'aaa')
    })
  }
  onStartToggle(status) {
    this.gameStartControl.visible = status
  }
  onGameStep() { // 关卡界面
    const graphics = new PIXI.Graphics()
    graphics.beginFill(0xDE3249)
    graphics.drawRect(250, 250, 100, 100)
    graphics.endFill()
    this.gameStepControl.addChild(graphics)
    this.actStage.addChild(this.gameStepControl)

    this.gameStepControl.interactive = true
    this.gameStepControl.buttonMode = true

    this.gameStepControl.on('pointertap', () => {
      eventBus.emit(eventTypes.TOUCH_STEP, 'aaa');
    })
  }
  onStepToggle(status) {
    this.gameStepControl.visible = status
  }
  onStepBack() { // 关卡返回键
    const graphics = new PIXI.Graphics()
    graphics.beginFill(0x1D9910)
    graphics.drawRect(50, 50, 100, 100)
    graphics.endFill()
    this.stepBackControl.addChild(graphics)
    this.actStage.addChild(this.stepBackControl)

    this.stepBackControl.interactive = true
    this.stepBackControl.buttonMode = true

    this.stepBackControl.on('pointertap', () => {
      eventBus.emit(eventTypes.TOUCH_STEP_BACK, 'aaa');
    })
  }
  onStepBackToggle(status) {
    this.stepBackControl.visible = status
  }
  onGameBack() { // 游戏返回键
    const graphics = new PIXI.Graphics()
    graphics.beginFill(0x810D7E)
    graphics.drawRect(50, 50, 100, 100)
    graphics.endFill()
    this.gameBackControl.addChild(graphics)
    this.actStage.addChild(this.gameBackControl)

    this.gameBackControl.interactive = true
    this.gameBackControl.buttonMode = true

    this.gameBackControl.on('pointertap', () => {
      eventBus.emit(eventTypes.TOUCH_GAME_BACK, 'aaa');
    })
  }
  onGameBackToggle(status) {
    this.gameBackControl.visible = status
  }
  onGamePad() { // 初始化游戏手柄
    this.padArray.leftArrow.width = 132
    this.padArray.leftArrow.height = 128
    this.padArray.rightArrow.width = 132
    this.padArray.rightArrow.height = 128

    this.padArray.leftBubble.width = 192
    this.padArray.leftBubble.height = 192
    this.padArray.rightBubble.width = 192
    this.padArray.rightBubble.height = 192

    this.padArray.leftArrow.anchor.set(0.5)
    this.padArray.rightArrow.anchor.set(0.5)
    this.padArray.leftBubble.anchor.set(0.5)
    this.padArray.rightBubble.anchor.set(0.5)

    // iphoneX 适配
    // iphoneXR iphoneXS 适配
    if (windowWidth == 812 || windowWidth == 896) {
      this.padArray.leftArrow.scale.set(0.9)
      this.padArray.leftBubble.scale.set(0.9)
      this.padArray.rightArrow.scale.set(0.9)
      this.padArray.rightBubble.scale.set(0.9)
    }

    this.gamePadLeft.addChild(this.padArray.leftBubble, this.padArray.leftArrow)
    this.gamePadRight.addChild(this.padArray.rightBubble, this.padArray.rightArrow)
    // 调整位置
    this.gamePadLeft.x = this.padArray.rightBubble.width / 2
    this.gamePadRight.x = windowWidth / this.ratio - this.padArray.rightBubble.width / 2

    this.gamePadLeft.y = windowHeight / this.ratio / 2
    this.gamePadRight.y = windowHeight / this.ratio / 2

    this.gamePadLeft.x += 60
    this.gamePadRight.x -= 60

    this.padArray.maxScale = this.padArray.leftBubble.scale.x
    this.padArray.minScale = this.padArray.leftBubble.scale.x * 0.9

    this.actStage.addChild(this.gamePadLeft, this.gamePadRight)

    // 游戏手柄绑定事件
    this.gamePadLeft.interactive = true
    this.gamePadLeft.buttonMode = true
    this.gamePadRight.interactive = true
    this.gamePadRight.buttonMode = true

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
  }
  onPadToggle(status) { // 游戏手柄控制器
    this.gamePadLeft.visible = status
    this.gamePadRight.visible = status
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
  onSetup() { // 初始化设置按钮
    // this.setupImage
    this.setupImage.width = 84
    this.setupImage.height = 84
    this.setupImage.position.x = 100;
    this.setupImage.position.y = windowHeight / this.ratio - this.setupImage.height - 40
    this.actStage.addChild(this.setupImage);

    this.setupImage.interactive = true
    this.setupImage.buttonMode = true

    this.setupImage.on('pointertap', () => {
      eventBus.emit(eventTypes.TOUCH_GAME_SET, 'aaa');
    })
  }
  onSetBtnToggle(status) {
    this.setupImage.visible = status
  }
  onSetupPanel() { // 设置面板
    // 创建背景底色
    const ground = new Graphics()
    ground.beginFill(0x000000, 0.38)
    ground.drawRect(0, 0, windowWidth / this.ratio, windowHeight / this.ratio)
    ground.endFill()

    // 创建设置容器
    const panel = new Graphics()
    panel.beginFill(0x00FF7F, 1)
    panel.drawRect(0, 0, 380, 340)
    panel.endFill()
    panel.position.x = (windowWidth / this.ratio - panel.width) / 2
    panel.position.y = (windowHeight / this.ratio - panel.height) / 2

    // 创建游戏设置关闭按钮
    const cancel = new Graphics()
    cancel.beginFill(0xFF0000, 1)
    cancel.drawCircle(0, 0, 30)
    cancel.endFill()

    cancel.position.x = panel.width - cancel.width / 2 - 12
    cancel.position.y = cancel.height / 2 + 12

    cancel.interactive = true
    cancel.buttonMode = true

    cancel.on('pointertap', () => {
      eventBus.emit(eventTypes.TOUCH_SET_CANCEL, 'aaa');
    })

    // 声效控制
    // 声效标题
    const style = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 34,
      fontStyle: 'normal',
      fontWeight: 'bold',
      fill: ['#F7FFFF'], // gradient
      stroke: '#9F6B0B',
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: '#9F6B0B',
      dropShadowBlur: 2,
      dropShadowAngle: Math.PI / 2,
      dropShadowDistance: 2,
      wordWrap: true,
      wordWrapWidth: 440
    })

    const sound = new Text(words.backSound.title, style)
    sound.position.x = (panel.width - sound.width) / 2
    sound.position.y = 18

    // 音乐
    const styleBack = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 32,
      fontStyle: 'normal',
      fill: ['#006400'], // gradient
    })

    const music = new Text(words.backSound.back, styleBack)

    music.position.x = 34
    music.position.y = 120

    // 音乐按钮
    const musicBtn = new Graphics()
    musicBtn.beginFill(0xFF0000, 1)
    musicBtn.drawCircle(0, 0, 26)
    musicBtn.endFill()

    musicBtn.position.x = 145
    musicBtn.position.y = 130

    musicBtn.interactive = true
    musicBtn.buttonMode = true

    musicBtn.on('pointertap', () => {
      utils.audioStage = !utils.audioStage
      utils.audioStage ? GameGlobal.globalAction.onStagePlay() : GameGlobal.globalAction.onStageStop()
    })

    // 音效
    const styleEffect = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 32,
      fontStyle: 'normal',
      fill: ['#006400'], // gradient
    })

    const effect = new Text(words.backSound.effect, styleEffect)

    effect.position.x = 34
    effect.position.y = 220

    // 音效按钮
    const effectBtn = new Graphics()
    effectBtn.beginFill(0xFF0000, 1)
    effectBtn.drawCircle(0, 0, 26)
    effectBtn.endFill()

    effectBtn.position.x = 145
    effectBtn.position.y = 230

    effectBtn.interactive = true
    effectBtn.buttonMode = true

    effectBtn.on('pointertap', () => {
      utils.audioScene = !utils.audioScene
    })

    panel.addChild(cancel, sound, music, musicBtn, effect, effectBtn)

    this.notStage.addChild(this.gameSetControl)
    this.gameSetControl.addChild(ground, panel)
  }
  onSetPanelToggle(status) { // 游戏设置控制器
    this.gameSetControl.visible = status
  }
  onHeroInit() { // 初始化英雄
    let spineData = this.appView.loader.resources.spineboy.spineData

    console.log(spineData, '@spineData')

    let spineBoy = new PIXI.spine.Spine(spineData)

    console.log(spineBoy, '@spineBoy')


    spineBoy.x = this.appView.screen.width / 2;
    spineBoy.y = this.appView.screen.height;
    spineBoy.scale.set(1.5);

    spineBoy.state.setAnimation(0, 'walk', true);

    spineBoy.width = 300
    spineBoy.height = 300

    spineBoy.interactive = true
    spineBoy.buttonMode = false

    this.gameBoxControl.interactive = true

    this.gameBoxControl.addChild(spineBoy)
    this.actStage.addChild(this.gameBoxControl)
  }
}