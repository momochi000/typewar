import BattleScene from "../scenes/battle_scene"
import {basicSlimeBattleData} from "../scenes/data/basic_slime_battle"
import {protoBattleSceneData} from "../scenes/data/proto_battle_scene"
import {SCENE_TRANSITION_EVT, BATTLE_VICTORY_EVT} from "../constants/scene_constants";

export default class SceneManager {
  constructor(){
    this._prepareSceneGraph();
    this._bindSceneListeners();
  }

  get currentScene(){
    return this._currentScene;
  }

  // For debugging only
  //  set currentScene(scene){
  //    this._currentScene = scene;
  //  }

  playScene(sceneId){
    var scene_data, scene_klass, new_scene;

    if(!sceneId) { this.loadScene(this._sceneGraph[0]); }
    if((typeof sceneId) === "number"){ this.loadScene(this._sceneGraph[sceneId]); }
    if((typeof sceneId) === "string"){ this.loadScene(this._findSceneFromId(sceneId)); }

    this._currentScene.play();
  }

  loadScene(scene) {
    this._currentScene = new scene.sceneKlass(scene.id, scene.sceneData);
    this._currentSceneIndex = _.indexOf(this._sceneGraph, scene);
  }

  // private

  _bindSceneListeners() {
    Crafty.bind(SCENE_TRANSITION_EVT, this._handleSceneTransition.bind(this))
  }

  _findSceneFromId(sceneId) {
    return _.find(this._sceneGraph, (curr) => {
      return (curr.id == sceneId);
    });
  }

  _getCurrentSceneId(){
    return this._currentScene.get("scene_id");
  }

  _getNextSceneFromCondition(currSceneId, condition){
    //TBI
  }

  _handleSceneTransition(evt){
    var transition_directive;

    transition_directive = this._sceneGraph[this._currentSceneIndex].transitions[evt];
    if(!transition_directive){
      console.log(`DEBUG: there is no transition directive declared for the ${evt} event`);
      // TODO: play game over scene
      return;
    }

    if(transition_directive == 'next'){
      if(!this._sceneGraph[this._currentSceneIndex+1]){
        // TODO: no scene to transition to, need to handle this
        //   play the end credits or something
        throw new Error("This is the end of the game! we're working on new levels");
      }
      this.playScene(this._currentSceneIndex+1);
    }
  }

  _prepareSceneGraph(){
    this._sceneGraph = [
      {
        id: "baby_slime",
        sceneKlass: BattleScene,
        sceneData: basicSlimeBattleData,
        transitions: {
          victory: "next",
          defeat: null // TODO: this should play the "you died" scene
        }
      },
      {
        id: "prototype_battle",
        sceneKlass: BattleScene,
        sceneData: protoBattleSceneData,
        transitions: {
          victory: "next",
          defeat: null // TODO: this should play the "you died" scene
        }
      },
    ]
  }
}
