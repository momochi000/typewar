Crafty.c("BattleSlime", {
  init: function (){ 
    this.requires("2D, BattleCharacter, BattleNPCEnemy, BattleSlimeAnim");
  },

  battleSlime: function (){ 
    this._initializeSkills();
    return this;
  },

  // private 

  _initializeSkills: function (){
    this.skills = {}
    this.skills.SlimeStandard = Typewar.Data.Skills["SlimeStandard"];
    this.skills.SlimeGlob = Typewar.Data.Skills["SlimeGlob"];
  }
});
