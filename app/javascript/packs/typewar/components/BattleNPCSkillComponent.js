/* NPCSkill - A wrapper around skill data
 * Contains some additional logic to control skill cooldowns
 * Is meant to be expanded when necessary to include additional functionality
 *
 * IN PROGRESS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Refactoring or possibly removing this component as battle npc skill system is reworked
 */
require("crafty");
var StateMachine = require("javascript-state-machine");

Crafty.c("BattleNPCSkill", {
  _npcSkillFsm: null,
  _skill: null,

  init: function (){ },

  battleNPCSkill: function (skill){
    if(!skill) {
      throw "ERROR: attempting to initialize NPCSkill component without any skill data";
    }
    this._skill = skill;
    this._setupStateMachine();
    return this;
  },

  activate: function (){
    this._nPCSkillFsm.activate();
  },

  getSkill: function (){
    return this._skill;
  },

  isReady: function (){
    return this._nPCSkillFsm.is("ready");
  },

  prepare: function (){
    this._nPCSkillFsm.prepare();
  },

  // private

  //  _beginCooldown: function (){
  //    var self = this;
  //    this.timeout(function (){
  //      self.fsm.prepare();
  //    }, this.getSkillData().cooldown);
  //  },

  //  _initSkill: function (skill, difficulty){
  //    this.skill = new skill({difficulty: (difficulty || 1)});
  //  },

  _setupStateMachine: function (){
    var self = this;
    this._nPCSkillFsm = StateMachine.create({
      initial: "ready",
      events: [
        { name: "activate",  from: "ready",    to: "cooling" },
        { name: "prepare",   from: "cooling",  to: "ready" }
      ],
      callbacks: { 
        onafteractivate:     function (event, from, to) { },
        onbeforeready:       function (event, from, to) { },
      }
    });
  }
});
