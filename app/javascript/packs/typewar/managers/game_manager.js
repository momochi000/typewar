// Module which handles high level control of the game state.  It lives 
// below the level of Typewar at the top and above the level of the 
// Scenemanager which simply loads and unloads scenes.  This module will have 
// knowlege of where to go when one scene ends (and take into account any 
// conditions around the scene being over.

// TODO: This is in need of refactoring...
//   This can probably be merged into it's parent typewar_main

import SceneManager from "./scene_manager"

export default class GameManager {
  constructor(){
    console.log("DEBUG: initializing GameManager.....");
    this.sceneManager = new SceneManager();
    console.log("DEBUG: just initialized scene Manager ---->", this.managers);
  }

  start(){
    this.sceneManager.loadScene('prototype_battle');
  }
}
