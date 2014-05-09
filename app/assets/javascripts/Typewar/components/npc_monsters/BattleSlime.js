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
    // Obtain the skills from the char sheet and build skills from that
    // this.skills = this.char_sheet.skills
  },

  _initializeSkills: function (){
    this.skills = {}
    if(this.char_sheet.skills){
      this._getSkillsFromCharSheet();
    }else{
      this._loadDefaultSkills();
    }
  },

  _loadDefaultSkills: function (){
    this.skills.SlimeStandard = Typewar.Data.Skills["SlimeStandard"];
    this.skills.SlimeGlob = Typewar.Data.Skills["SlimeGlob"];
  }
});
