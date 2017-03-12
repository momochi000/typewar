/* BattleNPCSkillManager - A container holding the set of skills for an npc in battle */
require("crafty");
require("./BattleNPCSkillComponent");

Crafty.c("BattleNPCSkillManager", {
  _skills: null,
  _skillset: null,
  _skillQueue: null,

  init: function (){ },

  battleNPCSkillManager: function (){ return this; },

  remove: function (){
    this._destroySkills();
  },

  //  getRandomSkill: function (){
  //    return _.sample(this.getSkills());
  //  },
  //
  //  getRandomReadySkill: function (){
  //    var ready_skills;
  //    ready_skills = _.filter(this.getSkills(), function (curr_skill){
  //      return curr_skill.isReady();
  //    });
  //    return _.sample(ready_skills);
  //  },

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
  },

  // private

  _destroySkills: function (){
    _.each(this.getSkills(), function(skill){
      skill = null;
    });

    this._skills = null;
  },

  //  _setupSkills: function (skills){
  //    var self;
  //
  //    this._skills = [];
  //    self = this;
  //
  //    _.each(skills, function (skill){
  //      var new_skill;
  //      new_skill = Crafty.e("NPCSkill")
  //        .nPCSkill(skill);
  //      self._skills.push(new_skill);
  //    });
  //  }
});
