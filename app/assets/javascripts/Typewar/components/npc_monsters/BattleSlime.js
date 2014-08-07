// TODO: Marked for deletion
//   Monsters are no longer a component, but instead some data coming from
//   a character sheet

Crafty.c("BattleSlime", {
  init: function (){ 
    this.requires("2D, BattleCharacter, BattleNPCEnemy, BattleSlimeAnim");
  },

  battleSlime: function (){ 
    this._initializeSkills();
    return this;
  },

  // private 

  _getSkillsFromCharSheet: function (){
    if(this.char_sheet.skills){ return this.char_sheet.skills; }
    return null;
  },

  _initializeSkills: function (){
    this.skills = this._getSkillsFromCharSheet() || this._buildDefaultSkills();
  },

  _buildDefaultSkills: function (){
    var skills;

    skills = {};
    skills.SlimeStandard = Typewar.Data.Skills["SlimeStandard"];
    skills.SlimeGlob     = Typewar.Data.Skills["SlimeGlob"];
    return skills;
  }
});
