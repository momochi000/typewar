export function npcDiedPlayerWinSystem(Crafty) {
  var npc;

  npc = Crafty("BattleNPC");

  if(npc.getHP() <= 0){
    // WIN CONDITION MET
    // probably trigger an event that the scene is listening to
    console.log("DEBUG: NPC DIED, GAME WON!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  }
}
