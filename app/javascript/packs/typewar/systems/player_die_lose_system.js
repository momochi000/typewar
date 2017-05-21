import {SCENE_TRANSITION_EVT, BATTLE_DEFEAT_COND} from "../constants/scene_constants";

export function playerDieLoseSystem(Crafty){
  var player;

  player = Crafty("BattlePlayer");
  if(player.length==0){ return; }
  if(player.getHP() <= 0){

    console.log("DEBUG: PLAYER DIED> GAME LOST!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    Crafty.trigger(SCENE_TRANSITION_EVT, BATTLE_DEFEAT_COND);
  }
}
