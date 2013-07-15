Crafty.c("BattlePlayer", {
  char_sheet: null,

  init: function (){
    this.requires("2D, BattlePlayerAnimation");
  },

  battlePlayer: function (char_sheet){
    var self = this;

    this.char_sheet = char_sheet || new Typewar.Models.CharacterSheet;

    return this;
  },

  deliverAttack: function (){
    this.animAttack();
    // deal damage to target?
    // build up special meter?
  },

  handleBeingAttacked: function(e) {
    //stub for now, but could play animation or etc.
  }
});

