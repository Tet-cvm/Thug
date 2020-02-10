import * as PIXI from './../libs/pixi.min'
import {utils, words} from './config'
import Scene from './scene'
import Action from './action'
const Application = PIXI.Application
const Sprite = PIXI.Sprite
const Container = PIXI.Container

export default class Main {
  constructor() {
    this.onInitizlize()
  }
  onInitizlize() {
    GameGlobal.globalScene = new Scene(); 
    GameGlobal.globalAction = new Action();
  }
}