import BattleEntityPC from "../../../entities/battle_entity_pc"
import CharacterSheet from "../../../models/character_sheet"

require("crafty");
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
    if(!this.charSheet) { this._buildDefaultCharSheet(); }
    console.log("DEBUG: ~~~~~~~~~~~~~~~~~~~~~~~~~~~ About to initialize model");
    this._initModel();
    console.log("DEBUG: ~~~~~~~~~~~~~~~~~~~~~~~~~~~ Model initailized");

    return this;
  },

  remove: function (destroyed) { 
    this._model.deallocate();
  },

  die: function (){
    Crafty.trigger("PlayerDied", {target: this});
  },

  getFromServer: function (){
    return this._model.getFromServer();
  },

  getStance: function (){
    return this.stance;
  },

  isPlayer: function (){ return true; },
  isNPC: function (){ return false; },
 
  _buildDefaultCharSheet: function (){
    this.charSheet = new CharacterSheet({name: "Player"});
  },

  _initModel: function (){
    this._model = new BattleEntityPC({entity: this});
  },

  _unbindChangeStance: function (){
    this.unbind("SwitchedCombatMode");
  }
});
