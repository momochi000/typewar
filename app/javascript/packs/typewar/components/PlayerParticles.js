require("./BattleParticles");
Crafty.c("PlayerParticles", {
  init: function (){this.requires("BattleParticles");},
  playerParticles: function (){ return this; }
});
