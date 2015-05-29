Crafty.c("BattleSlime", {
  init: function (){ 
    this.requires("2D, BattleCharacter, BattleNPCEnemy, BattleSlimeAnim");
  },

  battleSlime: function (){ },
  initDefaultSkills: function (){
    //this.addComponent("NPCSkillManager").
    //  nPCSkillManager(["SlimeStandard", "SlimeGlob"]);

    this.addComponent("NPCSkillManager").
      nPCSkillManager({
        "SlimeStandard": function (){ 
          var wpm;

          wpm = Typewar.Engine.getPlayerWPM();
          return 1;
        }, 
        "SlimeGlob": function (){ 
          return 0.3;
        }
      });
  }
});
