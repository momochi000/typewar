import CharacterSheet from "../../../models/character_sheet"

require("./BattleCharacterComponent");
require("../../animations/BattlePlayerAnimationComponent");

Crafty.c("BattlePlayer", {
  _ANIM_HIT_DELAY: 410,
  _fragment_spawner: null,

  init: function (){
    this.requires("2D, BattlePlayerAnimation, BattleCharacter");
  },

  battlePlayer: function (charSheet){
    console.log("DEBUG: ~~~~~~~~~~~~~~~~~~~~~~~~~~~ battlePlayer second initializer");
    return this;
  },

  die: function (){
    Crafty.trigger("PlayerDied", {target: this});
  },

  getStance: function (){
    return this.stance;
  },

  isPlayer: function (){ return true; },
  isNPC: function (){ return false; },
 
  _unbindChangeStance: function (){
    this.unbind("SwitchedCombatMode");
  }
});
