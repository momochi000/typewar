/* BattleNPCSkillManager - A container holding the set of skills for an npc in battle */

require("./BattleNPCSkillComponent");

Crafty.c("BattleNPCSkillManager", {
  _skills: null,
  _skillset: null,
  _skillQueue: null,

  init: function (){ },

  battleNPCSkillManager: function (){ return this; },

  getSkillQueue: function (){
    return this._skillQueue;
  },

  getSkillset: function (){
    return this._skillset;
  },

  getSkills: function (){
    return this._skills;
  },

  setSkillQueue: function (new_q) {
    this._skillQueue = new_q;
  },

  setSkills: function (new_skills){
    this._skills = new_skills;
  },

  setSkillset: function (new_skillset) { 
    this._skillset = new_skillset;
  }
});
