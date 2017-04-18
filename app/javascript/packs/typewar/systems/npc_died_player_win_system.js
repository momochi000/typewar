import {SCENE_TRANSITION_EVT, BATTLE_VICTORY_COND} from "../constants/scene_constants";

export function npcDiedPlayerWinSystem(Crafty) {
  var npc;

  npc = Crafty("BattleNPC");
  if(npc.length==0) { return; }
  if(npc.getHP() <= 0){
    // WIN CONDITION MET
    // probably trigger an event that the scene is listening to
    //    console.log("DEBUG: NPC DIED, GAME WON!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    Crafty.trigger(SCENE_TRANSITION_EVT, BATTLE_VICTORY_COND);
  }
}
