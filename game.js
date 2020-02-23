// import './libs/weapp-adapter'
import './libs/weapp-adapter/index.js'
import './libs/symbol'
import Nebula from './wechat/nebula'
import Login from './wechat/login'
import Main from './home/main'

GameGlobal.Nebula = new Nebula();
GameGlobal.Login = new Login();

new Main();