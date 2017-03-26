import BattleScene from "../scenes/battle_scene"
import {protoBattleSceneData} from "../scenes/data/proto_battle_scene"

var default_scene_graph = {
  prototype_battle: {
    sceneName: "demo battle scene",
    sceneData: protoBattleSceneData,
    sceneKlass: BattleScene,
    transitions: {
      victory: "player_win_scene",
      defeat: "player_lose_scene"
    }
  },
  player_win_scene: {
    sceneName: "victory scene",
    sceneData: "PlayerWinScene",
    transitions: { }
  },
  player_lose_scene: {
    sceneName: "defeat scene",
    sceneData: "PlayerLoseScene",
    transitions: { }
  }
}

export default class SceneManager {
  constructor(){
    console.log("DEBUG: initializing scene manager... ");
    this.sceneGraph = default_scene_graph;
    console.log("DEBUG: sceneGraph --------->", this.sceneGraph);
  }

  get currentScene(){
    return this._currentScene;
  }

  set currentScene(scene){
    this._currentScene = scene;
  }

  loadScene(scene_id){
    var scene_data, scene_klass, new_scene;

    console.log("DEBUG: SceneManager#loadScene(", scene_id, ")");
    scene_klass = this._getSceneKlassFromId(scene_id);

    scene_data = this._getSceneDataFromId(scene_id);
    if(this._currentScene){ this.unloadScene(); }
    console.log("DEBUG: SceneManager#loadScene -----------> scene_klass is ------->", scene_klass);
    new_scene = new scene_klass(scene_id, scene_data);
    new_scene.play();
    this._currentScene = new_scene;
  }

  unloadScene(){
    this._currentScene.stop();
    this._currentScene = null;
  }

  transition(condition, scene_args){
    var next_scene_id;

    next_scene_id = this._getNextSceneFromCondition(this._getCurrentSceneId(), condition);
    Typewar.Engine.scenemanager.unloadScene();
    Typewar.Engine.scenemanager.loadScene(this._getSceneDataFromId(next_scene_id), scene_args);
  }

  // private

  _getCurrentSceneId(){
    return this._currentScene.get("scene_id");
  }

  _getNextSceneFromCondition(curr_scene_id, condition){
    return this.sceneGraph[curr_scene_id].transitions[condition];
  }

  _getSceneDataFromId(scene_id){
    return this.sceneGraph[scene_id].sceneData;
  }

  _getSceneKlassFromId(scene_id){
    return this.sceneGraph[scene_id].sceneKlass;
  }
}
