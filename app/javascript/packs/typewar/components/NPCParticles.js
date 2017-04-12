require("./BattleParticles");
Crafty.c("NPCParticles", {
  init: function (){ this.requires("BattleParticles");},
  nPCParticles: function (){ return this; }
});
