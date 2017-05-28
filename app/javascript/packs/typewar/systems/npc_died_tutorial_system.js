import {TRAINING_TUTORIAL_COMPLETED_EVT} from "../constants/scene_constants";

export function npcDiedTutorialSystem(Crafty) {
  var npc;

  npc = Crafty("BattleNPC");
  if(npc.length==0) { return; }
  if(npc.getHP() <= 0){
    Crafty.trigger(TRAINING_TUTORIAL_COMPLETED_EVT);
  }
}
