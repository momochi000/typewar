import BattleScene from "./battle_scene"
import battleNPCGenerator from "../models/battle_npc_generator"

const DEFAULT_NPC_LOC_X = 390;
const DEFAULT_NPC_LOC_Y = 210;

export default class TrainingScene extends BattleScene {
  constructor(sceneId, sceneData) {
    super(sceneId, sceneData);
  }

  //private 

  init(){
    var self, chars_loaded_promise;
    self = this;

    self.initSprites();
    self.initBackground();
    self.initStageEdges();

    self.initCombatants().then(function (response){
      console.log("DEBUG: in the 'then' after trainingScene#initCombatants");
      self.initSystems();
      self.registerSystems();
      self.initCamera();
    }, function (error){
      console.log("DEBUG: FAILED TO INITIALIZE COMBATANTS FOR SOME REASON...");
      throw(error);
      alert('Failed to initialize combatants for some reason..');
    }).catch( function (error){
      console.log("DEBUG: ERROR IN PROMISE GROUP~~~~~~~---->", error);
      throw(error);
    });
  }

  initEnemyNPC(){
    var promise;

    promise = battleNPCGenerator(this._sceneData.combatants.npc);
    return promise.then( (npc_ent) => {
      npc_ent.x = DEFAULT_NPC_LOC_X;
      npc_ent.y = DEFAULT_NPC_LOC_Y;
      return npc_ent;
    });
  }
}
