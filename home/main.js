import Scene from './scene'
import Action from './action'
export default class Main {
  constructor() {
    this.onInit()
  }
  onInit() {
    GameGlobal.globalScene = new Scene();
    GameGlobal.globalAction = new Action();
  }
}