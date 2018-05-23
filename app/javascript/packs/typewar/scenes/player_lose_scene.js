import { SID_PL_LOSE } from "../constants/scene_constants"
import BG_PL_DIED from "./data/background/player_died"
import * as Transitions from "../models/effects/transitions";

export default class PlayerLoseScene {
  constructor() {
    Crafty.scene(SID_PL_LOSE, this.init.bind(this), () => {});
  }

  get sceneId(){
    return SID_PL_LOSE;
  }

  play() {
    Crafty.scene(SID_PL_LOSE);
  }

  init() {
    this._initFadeIn();
    this._setBackground();
  }

  stop() {
    // TBI
    throw new Error("Stop method not implemented on PlayerLoseScene");
  }

  //private

  _initFadeIn() {
    Transitions.Fadein.execute({});
  }

  _setBackground() {
    Crafty.background(`#000 url(\"${BG_PL_DIED.filepath}") no-repeat center center`);
  }
}
