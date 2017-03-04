import BattleEntityPC from "../../../entities/battle_entity_pc"
import CharacterSheet from "../../../models/character_sheet"

require("crafty");
require("./BattleCharacterComponent");
require("../../animations/BattlePlayerAnimationComponent");
require("../../SkillManagerComponent");

Crafty.c("BattlePlayer", {
  _ANIM_HIT_DELAY: 410,
  _current_target: null,
  _fragment_spawner: null,
  stance: 'defense',

  init: function (){
    console.log("DEBUG: ~~~~~~~~~~~~~~~~~~~~~~~~~~~DEBUGGING BATTLEENTITYPC");
    console.log("DEBUG: ~~~~~~~~~~~~~~~~~~~~~~~~~~~ init ");
    this.requires("2D, BattlePlayerAnimation, BattleCharacter");
    console.log("DEBUG: ~~~~~~~~~~~~~~~~~~~~~~~~~~~ after requires ");
    this._bindChangeStance();
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

  getTarget: function (){
    return this._current_target;
  },

  isPlayer: function (){ return true; },
  isNPC: function (){ return false; },
 
  partialHit: function (){
    var self = this;
    console.log("DEBUG: PLAYER: PARTIAL HIT. OW!!! ");
    //window.setTimeout(function (){ self.animBlock(); }, this._ANIM_HIT_DELAY);
    self.animBlock();
  },

  setTarget: function (target){
    this._current_target = target;
  },

  successfulDefense: function (){
    console.log("DEBUG: PLAYER: DEFENDED!!! ");
    this.animBlock();
  },

  successfulHit: function (){
    console.log("DEBUG: PLAYER: HIT!! GOT ME GOOD D=");
    this.animHit();
  },

  wasMissed: function (){ },

  // private

  _bindChangeStance: function (){
    var self = this;
    this.bind("SwitchedCombatMode", function (evt){
      self.stance = evt;
      self.updateStatus();
    });
  }, 

  _buildDefaultCharSheet: function (){
    this.charSheet = new CharacterSheet({name: "Player"});
  },

  _initModel: function (){
    console.log("DEBUG: ~~~~~~~~~~~~~~~~~~~~~~~~~~~ calling constructor for BattleEntityPC ---> ");
    this._model = new BattleEntityPC({entity: this});
  },

  _unbindChangeStance: function (){
    this.unbind("SwitchedCombatMode");
  }
});
