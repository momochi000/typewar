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
    this.skills = this.char_sheet.skills
  },

  _initializeSkills: function (){
    this.skills = {}
    if(this.char_sheet.skills){
      //console.log("DEBUG: BattleSlime#_initializeSkills:  Loading skills from char sheet");
      this._getSkillsFromCharSheet();
    }else{
      //console.log("DEBUG: BattleSlime#_initializeSkills:  Loading default skills");
      this._loadDefaultSkills();
    }
  },

  _loadDefaultSkills: function (){
    this.skills.SlimeStandard = Typewar.Data.Skills["SlimeStandard"];
    this.skills.SlimeGlob = Typewar.Data.Skills["SlimeGlob"];
  }
});
