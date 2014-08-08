// Module which handles high level control of the game state.  It lives 
// below the level of Typewar at the top and above the level of the 
// Scenemanager which simply loads and unloads scenes.  This module will have 
// knowlege of where to go when one scene ends (and take into account any 
// conditions around the scene being over.

Typewar.Engine.Managers.GameManager = Backbone.Model.extend({
  defaults: {
    scene_graph: {
      prototype_battle: {
        scene_name: "demo battle scene",
        scene_data: "ProtoBattleScene",
        transitions: {
          victory: "player_win_scene",
          defeat: "player_lose_scene"
        }
      },
      player_win_scene: {
        scene_name: "victory scene",
        scene_data: "PlayerWinScene",
        transitions: { }
      },
      player_lose_scene: {
        scene_name: "defeat scene",
        scene_data: "PlayerLoseScene",
        transitions: { }
      }
    }
  },

  initialize: function (){},

  start: function (initial_scene){
    if(!initial_scene) { 
      initial_scene = this._getSceneDataFromId("prototype_battle");
    }
    console.log("DEBUG: starting the game from Game Manager with initial scene ---> ", initial_scene);
    Typewar.Engine.scenemanager.loadScene(initial_scene);
  },

  transition: function (condition, scene_args){
    var next_scene_id;

    next_scene_id = this._getNextSceneFromCondition(this._getCurrentSceneId(), condition);
    Typewar.Engine.scenemanager.unloadScene();
    Typewar.Engine.scenemanager.loadScene(this._getSceneDataFromId(next_scene_id), scene_args);
  },

  // private

  _getCurrentSceneId: function (){
    var current_scene;

    current_scene = Typewar.Engine.scenemanager.getCurrentScene();
    return current_scene.get("scene_id");
  },

  _getSceneDataFromId: function (scene_id){
    var next_scene_class;

    next_scene_class = this.get("scene_graph")[scene_id].scene_data;
    debugger;
    return Typewar.Data.Scenes[next_scene_class];
  },
  
  _getNextSceneFromCondition: function (curr_scene_id, condition){
    return this.get("scene_graph")[curr_scene_id].transitions[condition];
  }
});
