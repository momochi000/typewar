/* A component specifically for enemies encountered in Typewar's battle system
 * This is the base component, other child components are made up of specific
 * monsters or enemy types and require this component, calling methods from it.

 * Events Triggered:
 * updateStatus ===========> When the status of the npc changes
 * enemy_died =============> When this monster dies
 * TODO: Make these events use consistent style
 */

import BattleEntityNPC from "../../../entities/battle_entity_npc"
import CharacterSheet from "../../../models/character_sheet"

require('crafty');
require("../../TextFragmentSpawnerComponent");
require("../../BattleNPCSkillManagerComponent");

Crafty.c("BattleNPCSlime", {
  _ANIM_HIT_DELAY: 430,
  _ANIM_ATTACK_DELAY: 200,
  _fragment_spawner: null,
  _model: null,

  init: function (){
    this.requires("2D, SpriteAnimation, BattleCharacter");
  },

  battleNPCEnemy: function (charSheet, battleManagerRef){
    //this.charSheet = charSheet || new Typewar.Models.CharacterSheet({name: "Slime"});
    if(!this.charSheet) { 
      this.charSheet = new CharacterSheet({name :"Slime"});
    }
    this._battleManagerReference = battleManagerRef;
    this._fragment_timers = [];
    this._createFragmentSpawner();
    this._initModel();
    this._bindAIListners();

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

  initiateAttackOn: function (defender, skill){
    var self, skill, frag, speed, text_fragment_options, skill_data;
    self = this;

    if(!skill){ skill = this.getRandomReadySkill(); }
    if(!skill){ return; } // Do not attack if no skill available

    skill_data = skill.activate();
    text_fragment_options = this._battleManagerReference.handleAttack({
      attacker: this, 
      defender: defender, 
      skill: skill_data
    });
    this.animAttack(skill_data.animation);
    this._fragment_timers.push(window.setTimeout(function (){ // Spawn the fragment a short delay after the animation plays
      frag = self._fragment_spawner.generateTextFragment({
        attack_properties: text_fragment_options
      });
      console.log("DEBUG: did the fragment get created?? --->", frag);
    }, this._ANIM_ATTACK_DELAY));
  },

  isPlayer: function (){ return false; },
  isNPC: function (){ return true; },

  partialHit: function (){
    console.log("DEBUG: SLIME: PARTIAL HIT. OW!!! ");
    var self = this;
    window.setTimeout(function (){ self.animBlock(); }, this._ANIM_HIT_DELAY);
  },

  setupBattleNPCSkills: function (){
    var skills = this.charSheet.data.skills;

    if(skills){
      this.addComponent("NPCSkillManager").
        nPCSkillManager(skills);
    }else if(this.initDefaultSkills){ // Default skills which should come from monster specific component if the server doesn't provide any skills
      this.initDefaultSkills();
    }else{ 
      throw new Error("Attempting to setup battle NPC with no skills");
    }
  },

  successfulDefense: function (){
    console.log("DEBUG: SLIME: DEFENDED!!! ");
    var self = this;
    window.setTimeout(function (){ self.animBlock(); }, this._ANIM_HIT_DELAY);
  },

  successfulHit: function (){
    var self = this;
    console.log("DEBUG: SLIME: HIT!! GOT ME GOOD D=");
    window.setTimeout(function (){ self.animHit(); }, this._ANIM_HIT_DELAY);
  },

  wasMissed: function (){
    console.log("DEBUG: SLIME: MISSED ME!!");
  },

  //private 

  _bindAIListners: function (){
    var self = this;
    this.bind("initiateAttackOn", function (target){
      self.initiateAttackOn(target);
    });
  },

  _clearFragmentTimers: function (){
    _.each(this._fragment_timers, function (t_id){
      window.clearTimeout(t_id);
    });
    delete this._fragment_timers;
    this._fragment_timers = null;
  },

  _createFragmentSpawner: function (){
    this._fragment_spawner = Crafty.e("2D, TextFragmentSpawner")
      .attr({x: this._x, y: this._y})
      .textFragmentSpawner(this._battleManagerReference);

    this.attach(this._fragment_spawner);
  },

  _initModel: function (){
    this._model = new BattleEntityNPC({entity: this});
  }

});
