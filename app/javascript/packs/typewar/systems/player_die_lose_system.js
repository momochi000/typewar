export function playerDieLoseSystem(Crafty) {
  var player;

  player = Crafty("BattlePlayer");

  if(player.getHP() <= 0){
    // LOSE CONDITION MET, 
    // somehow, this has to get back to the scene
    // Likely we'll just trigger an event here
    console.log("DEBUG: PLAYER DIED> GAME LOST!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  }
}
