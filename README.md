## 源码目录介绍
```
Thug
|—— game.js               // 入口文件
|—— game.json             // 小游戏配置文件
|
|—— libs                  // 所需框架目录
|   |—— pixi.min.js       // pixi框架
|   |—— pixi-spine.js     // pixi挂件
|   |—— symbol.js         // ES6 Symbol简易兼容
|   |—— weapp-adapter.js  // 小游戏适配器
|
|—— home                  // 游戏逻辑主目录
|   |—— main.js           // 游戏入口控制器
|   |—— action.js         // 游戏动作控制器
|   |—— config.js         // 游戏配置及事件管理中心
|   |—— guide.js          // 游戏引导控制器 @新手引导@游戏菜单@弹窗
|   |—— scene.js          // 游戏场景控制器 @游戏相关场景
|   |—— event.js          // 游戏事件中心
|
|—— assets                // 静态图片资源目录
```