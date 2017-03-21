/* A component specifically for enemies encountered in Typewar's battle system
 * This is the base component, other child components are made up of specific
 * monsters or enemy types and require this component, calling methods from it.
 */

import BattleEntityNPC from "../../../entities/battle_entity_npc"
import CharacterSheet from "../../../models/character_sheet"

require('crafty');
require("../../BattleNPCSkillManagerComponent");

Crafty.c("BattleNPCSlime", {
  _ANIM_HIT_DELAY: 430,
  _ANIM_ATTACK_DELAY: 200,
  _fragment_spawner: null,
  _model: null,

  init: function (){
    this.requires("2D, SpriteAnimation, BattleCharacter");
  },

  battleNPCEnemy: function (charSheet){
    //this.charSheet = charSheet || new Typewar.Models.CharacterSheet({name: "Slime"});
    if(!this.charSheet) { 
      this.charSheet = new CharacterSheet({name :"Slime"});
    }
    //    this._battleManagerReference = battleManagerRef;
    this._fragment_timers = [];
    this._initModel();
    //    this._bindAIListners();

    return this;
  },

  remove: function (destroyed){
    this.deactivateAI();
    this._clearFragmentTimers();
    this._fragment_spawner.destroy();
    this._fragment_spawner = null;
    this._model.deallocate();
    this._model = null;
  },

  die: function (){
    Crafty.trigger("NPCDied", {target: this});
  },

  getStance: function (){
    return "offense";
  },

  getFromServer: function (){
    return this._model.getFromServer();
  },

  isPlayer: function (){ return false; },
  isNPC: function (){ return true; },

  //private 

  //  _bindAIListners: function (){
  //    var self = this;
  //    this.bind("initiateAttackOn", function (target){
  //      self.initiateAttackOn(target);
  //    });
  //  },

  _clearFragmentTimers: function (){
    _.each(this._fragment_timers, function (t_id){
      window.clearTimeout(t_id);
    });
    delete this._fragment_timers;
    this._fragment_timers = null;
  },

  _initModel: function (){
    this._model = new BattleEntityNPC({entity: this});
  }
});
