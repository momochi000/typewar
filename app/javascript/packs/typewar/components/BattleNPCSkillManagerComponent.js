/* NPCSkillManager - A container holding the set of skills for an npc in battle */
require("crafty");
require("./BattleNPCSkillComponent");

Crafty.c("NPCSkillManager", {
  init: function (){ 
    this._skills = null;
  },

  nPCSkillManager: function (skills){
    if(!skills || _.isEmpty(skills)) {
      // TODO: This could instead fail gracefully and grab a few random skills 
      // based on the type of monster
      throw "ERROR: attempting to initialize NPCSkillManager component without any skills";
    }
    this._setupSkills(skills);

    return this;
  },

  remove: function (){
    this._destroySkills();
  },

  getRandomSkill: function (){
    return _.sample(this.getSkills());
  },

  getRandomReadySkill: function (){
    var ready_skills;
    ready_skills = _.filter(this.getSkills(), function (curr_skill){
      return curr_skill.isReady();
    });
    return _.sample(ready_skills);
  },

  getSkills: function (){
    return this._skills;
  },

  setSkills: function (new_skills){
    this._skills = new_skills;
  },

  // private

  _destroySkills: function (){
    _.each(this.getSkills(), function(skill){
      skill = null;
    });

    this._skills = null;
  },

  _setupSkills: function (skills){
    var self;

    this._skills = [];
    self = this;

    // LEFT OFF~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //
    // Track down why I can't seem to type the text fragment fully (it partly 
    // works)
    // Track down why the game simply stops after a few seconds
    // track down why the box2d skill isn't working
    // ensure the monster is able to fire both skills
    // ensure you can type the things properly
    // refactor npc to be something more specific
    _.each(skills, function (skill){
      var new_skill;
      new_skill = Crafty.e("NPCSkill")
        .nPCSkill(skill);
      self._skills.push(new_skill);
    });
  }
});
