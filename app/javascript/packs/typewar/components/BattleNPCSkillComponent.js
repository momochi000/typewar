require("crafty");
var StateMachine = require("javascript-state-machine");

Crafty.c("BattleNPCSkill", {
  _nPCSkillFsm: null,
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

  getSkillDef: function (){
    return this._skill;
  },

  isReady: function (){
    return this._nPCSkillFsm.is("ready");
  },

  prepare: function (){
    this._nPCSkillFsm.prepare();
  },

  // private

  _setupStateMachine: function (){
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
